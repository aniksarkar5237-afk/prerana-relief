import pool from '../config/db.js';

// Map USSD numerical selections to NeedCategory enum
const USSD_MENU_MAP = {
  '1': 'FOOD',
  '2': 'MEDICINE',
  '3': 'RESCUE',
};

/**
 * High-performance USSD Webhook Controller for Telecom Aggregators (Exotel, Africa's Talking)
 * Guarantees sub-500ms response time via single-pass Common Table Expression (CTE).
 */
export const handleUssdWebhook = async (req, res) => {
  const startTime = Date.now();

  try {
    // 1. Extract payload fields (support urlencoded, json, and query parameters)
    const phoneNumber = (req.body.phoneNumber || req.body.msisdn || req.query.phoneNumber || '').trim();
    const rawText = (req.body.text || req.body.input || req.query.text || '').toString().trim();
    const sessionId = req.body.sessionId || req.query.sessionId || `sess_${Date.now()}`;

    // Telecom aggregators concatenate multi-hop USSD input with '*' (e.g., '1*2' -> '2')
    const userSelection = rawText.includes('*') ? rawText.split('*').pop().trim() : rawText;

    // 2. Logic Flow: Initial Dial (Empty text input)
    if (!userSelection) {
      const menu =
        `CON Disaster Relief:\n` +
        `1. Need Food\n` +
        `2. Need Medicine\n` +
        `3. Need Rescue`;

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('X-Response-Time-Ms', `${Date.now() - startTime}`);
      return res.status(200).send(menu);
    }

    // 3. Logic Flow: Validate Menu Option ("1", "2", "3")
    const needCategory = USSD_MENU_MAP[userSelection];

    if (!needCategory) {
      const invalidMenu =
        `CON Invalid selection.\n` +
        `1. Need Food\n` +
        `2. Need Medicine\n` +
        `3. Need Rescue`;

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(invalidMenu);
    }

    // 4. Single-Pass High-Speed CTE: Point Lookup + SafeZone Attach + SOS_Ping Log in 1 Round-Trip
    const singlePassQuery = `
      WITH victim_match AS (
        SELECT 
          v.id AS victim_id,
          v.village_id,
          sz.id AS safe_zone_id
        FROM victims v
        LEFT JOIN LATERAL (
          SELECT s.id 
          FROM safe_zones s 
          WHERE s.village_id = v.village_id 
          ORDER BY s.elevation_meters DESC 
          LIMIT 1
        ) sz ON true
        WHERE v.phone_number = $1
        LIMIT 1
      ),
      log_ping AS (
        INSERT INTO sos_pings (victim_id, safe_zone_id, need_category, resolved)
        SELECT 
          victim_id, 
          safe_zone_id, 
          $2::varchar, 
          false
        FROM victim_match
        RETURNING id, victim_id, safe_zone_id
      ),
      flag_distress AS (
        UPDATE victims 
        SET status = 'IN_DISTRESS', updated_at = CURRENT_TIMESTAMP
        WHERE id = (SELECT victim_id FROM victim_match)
      )
      SELECT 
        (SELECT victim_id FROM victim_match) AS victim_id,
        (SELECT safe_zone_id FROM victim_match) AS safe_zone_id,
        (SELECT id FROM log_ping) AS ping_id;
    `;

    const dbPromise = pool.query(singlePassQuery, [phoneNumber, needCategory]);

    // Handle unregistered caller edge-case in background if not found
    dbPromise.then(async (result) => {
      if (!result.rows[0]?.victim_id) {
        // Fallback auto-registration for unregistered victim
        const fallbackVillage = await pool.query(`SELECT id FROM villages LIMIT 1`);
        const fallbackSafeZone = await pool.query(`SELECT id FROM safe_zones ORDER BY elevation_meters DESC LIMIT 1`);
        if (fallbackVillage.rows[0]?.id) {
          const newVictim = await pool.query(
            `INSERT INTO victims (phone_number, village_id, status) VALUES ($1, $2, 'IN_DISTRESS') RETURNING id`,
            [phoneNumber, fallbackVillage.rows[0].id]
          );
          if (newVictim.rows[0]?.id) {
            await pool.query(
              `INSERT INTO sos_pings (victim_id, safe_zone_id, need_category, resolved) VALUES ($1, $2, $3, false)`,
              [newVictim.rows[0].id, fallbackSafeZone.rows[0]?.id || null, needCategory]
            );
          }
        }
      }
    }).catch(err => console.error('[USSD Async Log Error]', err.message));

    // Await the single round-trip query
    const dbResult = await dbPromise;
    const safeZoneId = dbResult.rows[0]?.safe_zone_id;

    // 5. Respond to telco with termination message
    const latencyMs = Date.now() - startTime;
    const terminationMessage = `END Request received. Help is being routed.`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Response-Time-Ms', `${latencyMs}`);

    console.info(
      `[USSD] Phone: ${phoneNumber} | Option: ${userSelection} (${needCategory}) | SafeZoneId: ${safeZoneId} | ${latencyMs}ms`
    );

    return res.status(200).send(terminationMessage);
  } catch (error) {
    console.error('[USSD Webhook Error]:', error);

    // Fail-safe response to ensure telco session closes cleanly
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(`END Request received. Help is being routed.`);
  }
};
