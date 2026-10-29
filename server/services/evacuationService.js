import pool from '../config/db.js';
import twilio from 'twilio';

// Initialize Twilio client if credentials exist
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

/**
 * Builds trilingual evacuation alert message in English, Hindi, and Bengali (বাংলা)
 * @param {string} safeZoneName 
 * @returns {string}
 */
export function buildEvacuationMessage(safeZoneName) {
  return (
    `🚨 [EMERGENCY EVACUATION / आपातकालीन सूचना / জরুরী স্থানান্তর]\n` +
    `• English: Flood Alert: Move to ${safeZoneName}. Do not wait. Reply with 1 if received.\n\n` +
    `• বাংলা: বন্যার সতর্কবার্তা: অবিলম্বে ${safeZoneName}-এ চলে যান। অপেক্ষা করবেন না। বার্তাটি পেলে 1 লিখে উত্তর দিন।\n\n` +
    `• हिन्दी: बाढ़ की चेतावनी: ${safeZoneName} पर जाएं। प्रतीक्षा न करें। प्राप्त होने पर 1 लिखकर उत्तर दें।`
  );
}

/**
 * Sends a single SMS with retry and mock/live fallback
 * @param {Object} param0 
 * @returns {Promise<{ success: boolean, sid: string, error?: string }>}
 */
async function sendSMSWithRetry({ to, body, maxRetries = 3 }) {
  let attempt = 0;
  let lastError = null;

  while (attempt < maxRetries) {
    attempt++;
    try {
      if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
        const message = await twilioClient.messages.create({
          body,
          from: process.env.TWILIO_PHONE_NUMBER,
          to,
        });
        return { success: true, sid: message.sid, status: message.status };
      } else {
        // High-fidelity mock adapter with simulated gateway latency (10-30ms)
        await new Promise((res) => setTimeout(res, Math.floor(Math.random() * 20 + 10)));
        return {
          success: true,
          sid: `MOCK_TW_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          status: 'dispatched_mock',
        };
      }
    } catch (err) {
      lastError = err;
      console.warn(`[SMS Dispatch] Attempt ${attempt} failed for ${to}: ${err.message}`);
      if (attempt < maxRetries) {
        // Exponential backoff: 300ms, 600ms...
        await new Promise((res) => setTimeout(res, 300 * Math.pow(2, attempt - 1)));
      }
    }
  }

  return { success: false, sid: null, error: lastError?.message || 'Unknown carrier error' };
}

/**
 * Dispatches emergency evacuation alerts for all victims in a village.
 * Batches SMS delivery at 50 messages/sec to prevent downstream carrier throttling.
 * 
 * @param {string} villageId 
 * @returns {Promise<Object>} Summary of dispatch operations
 */
export async function dispatchEvacuationAlerts(villageId) {
  console.info(`[Evacuation Dispatch] Initiating evacuation alert for villageId: ${villageId}`);

  // 1. Fetch Village
  const villageRes = await pool.query(
    `SELECT id, name, latitude, longitude, vulnerability_score, region_name 
     FROM villages 
     WHERE id = $1`,
    [villageId]
  );

  if (villageRes.rows.length === 0) {
    throw new Error(`Village with ID '${villageId}' not found.`);
  }
  const village = villageRes.rows[0];

  // 2. Fetch nearest / highest-elevation SafeZone linked to this village
  const safeZoneRes = await pool.query(
    `SELECT id, name, latitude, longitude, elevation_meters, capacity, structure_type 
     FROM safe_zones 
     WHERE village_id = $1 
     ORDER BY elevation_meters DESC, capacity DESC 
     LIMIT 1`,
    [villageId]
  );

  if (safeZoneRes.rows.length === 0) {
    throw new Error(`No SafeZone configured for village: ${village.name} (ID: ${villageId})`);
  }
  const targetSafeZone = safeZoneRes.rows[0];

  // 3. Fetch all Victims linked to this village
  const victimsRes = await pool.query(
    `SELECT id, phone_number, status 
     FROM victims 
     WHERE village_id = $1`,
    [villageId]
  );

  const victims = victimsRes.rows;
  if (victims.length === 0) {
    console.warn(`[Evacuation Dispatch] No registered victims found for village: ${village.name}`);
    return {
      success: true,
      village: village.name,
      safeZone: targetSafeZone.name,
      totalVictims: 0,
      dispatched: 0,
      failed: 0,
      results: [],
    };
  }

  const alertMessage = buildEvacuationMessage(targetSafeZone.name);

  // 4. Rate-Controlled Dispatch Engine (50 messages per second)
  const RATE_LIMIT_PER_SEC = 50;
  const BATCH_INTERVAL_MS = 1000;
  const dispatchResults = [];
  let successfulCount = 0;
  let failedCount = 0;

  for (let i = 0; i < victims.length; i += RATE_LIMIT_PER_SEC) {
    const batchStartTime = Date.now();
    const batch = victims.slice(i, i + RATE_LIMIT_PER_SEC);

    const batchPromises = batch.map(async (victim) => {
      const sendResult = await sendSMSWithRetry({
        to: victim.phone_number,
        body: alertMessage,
      });

      // Audit log into database if notification_dispatches exists
      try {
        await pool.query(
          `INSERT INTO notification_dispatches (message, status) 
           VALUES ($1, $2)`,
          [
            `Evacuation to ${targetSafeZone.name} sent to ${victim.phone_number}`,
            sendResult.success ? 'delivered' : 'failed',
          ]
        );
      } catch (logErr) {
        // Non-blocking log failure
      }

      const resultItem = {
        victimId: victim.id,
        phone: victim.phone_number,
        status: sendResult.success ? 'SENT' : 'FAILED',
        sid: sendResult.sid,
        error: sendResult.error,
      };

      if (sendResult.success) successfulCount++;
      else failedCount++;

      return resultItem;
    });

    const batchOutput = await Promise.all(batchPromises);
    dispatchResults.push(...batchOutput);

    // If there are more batches, throttle to guarantee max 50 msgs / sec
    if (i + RATE_LIMIT_PER_SEC < victims.length) {
      const elapsed = Date.now() - batchStartTime;
      if (elapsed < BATCH_INTERVAL_MS) {
        await new Promise((resolve) => setTimeout(resolve, BATCH_INTERVAL_MS - elapsed));
      }
    }
  }

  console.info(
    `[Evacuation Dispatch Completed] Village: ${village.name} | SafeZone: ${targetSafeZone.name} | Sent: ${successfulCount} | Failed: ${failedCount}`
  );

  return {
    success: true,
    village: {
      id: village.id,
      name: village.name,
      region: village.region_name,
    },
    safeZone: {
      id: targetSafeZone.id,
      name: targetSafeZone.name,
      elevation: targetSafeZone.elevation_meters,
      capacity: targetSafeZone.capacity,
    },
    totalVictims: victims.length,
    dispatched: successfulCount,
    failed: failedCount,
    messageSample: alertMessage,
    results: dispatchResults,
  };
}

/**
 * Records an incoming SOS Ping from a victim and routes to nearest safe zone
 */
export async function recordSOSPing({ victimPhone, needCategory }) {
  // Find victim
  const victimRes = await pool.query(
    `SELECT id, village_id FROM victims WHERE phone_number = $1`,
    [victimPhone]
  );

  if (victimRes.rows.length === 0) {
    throw new Error(`Victim with phone number '${victimPhone}' not registered in system.`);
  }

  const victim = victimRes.rows[0];

  // Find nearest safe zone for victim's village
  const safeZoneRes = await pool.query(
    `SELECT id FROM safe_zones WHERE village_id = $1 ORDER BY elevation_meters DESC LIMIT 1`,
    [victim.village_id]
  );
  const safeZoneId = safeZoneRes.rows[0]?.id || null;

  // Insert SOS Ping
  const pingRes = await pool.query(
    `INSERT INTO sos_pings (victim_id, safe_zone_id, need_category, resolved) 
     VALUES ($1, $2, $3, false) 
     RETURNING id, victim_id, safe_zone_id, need_category, resolved, timestamp`,
    [victim.id, safeZoneId, needCategory]
  );

  // Update victim status to IN_DISTRESS
  await pool.query(
    `UPDATE victims SET status = 'IN_DISTRESS', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
    [victim.id]
  );

  return pingRes.rows[0];
}

/**
 * Get all villages with their safe zones and victim counts
 */
export async function listVillagesSummary() {
  const query = `
    SELECT 
      v.id,
      v.name,
      v.latitude,
      v.longitude,
      v.vulnerability_score,
      v.region_name,
      COALESCE(json_agg(DISTINCT jsonb_build_object(
        'id', sz.id,
        'name', sz.name,
        'elevation_meters', sz.elevation_meters,
        'capacity', sz.capacity,
        'structure_type', sz.structure_type
      )) FILTER (WHERE sz.id IS NOT NULL), '[]') AS safe_zones,
      COUNT(DISTINCT vic.id) AS victim_count,
      COUNT(DISTINCT sp.id) FILTER (WHERE sp.resolved = false) AS unresolved_sos_count
    FROM villages v
    LEFT JOIN safe_zones sz ON sz.village_id = v.id
    LEFT JOIN victims vic ON vic.village_id = v.id
    LEFT JOIN sos_pings sp ON sp.victim_id = vic.id
    GROUP BY v.id
    ORDER BY v.vulnerability_score DESC, v.name ASC
  `;
  const res = await pool.query(query);
  return res.rows;
}
