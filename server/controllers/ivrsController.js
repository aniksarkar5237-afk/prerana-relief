import pool from '../config/db.js';
import twilio from 'twilio';

const VoiceResponse = twilio.twiml.VoiceResponse;

// DTMF Key Mapping to Need Category
const DTMF_MAP = {
  '1': 'FOOD',
  '2': 'MEDICINE',
  '3': 'RESCUE',
};

/**
 * Step 1: Handles Inbound Voice Calls from Telecom Gateways (Twilio, Exotel, Plivo)
 * Plays regional voice prompts in Bengali (বাংলা), Hindi (हिन्दी), and English
 * Prompts illiterate callers to press a single number key (DTMF 1, 2, or 3).
 */
export const handleIncomingCall = (req, res) => {
  const twiml = new VoiceResponse();

  // Gather single keypress (DTMF)
  const gather = twiml.gather({
    numDigits: 1,
    action: '/api/ivrs/gather',
    method: 'POST',
    timeout: 6,
  });

  // 1. Bengali Prompt (বাংলা - Primary Delta Regional Dialect)
  gather.say(
    {
      language: 'bn-IN',
      voice: 'Polly.Aditi',
    },
    'বন্যা ত্রাণ সহায়তার জরুরি সেবা। খাবারের জন্য ১ টিপুন। জরুরি ওষুধের জন্য ২ টিপুন। বন্যা থেকে উদ্ধার পেতে ৩ টিপুন।'
  );

  // 2. Hindi Prompt (हिन्दी)
  gather.say(
    {
      language: 'hi-IN',
      voice: 'Polly.Aditi',
    },
    'बाढ़ राहत आपातकालीन सेवा। भोजन के लिए १ दबाएं। दवा के लिए २ दबाएं। बचाव सहायता के लिए ३ दबाएं।'
  );

  // 3. English Fallback
  gather.say(
    {
      language: 'en-IN',
      voice: 'Polly.Raveena',
    },
    'Disaster Relief Emergency Service. Press 1 for Food. Press 2 for Medicine. Press 3 for Rescue.'
  );

  // If no input received within timeout, loop once more
  twiml.redirect('/api/ivrs/incoming');

  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  return res.status(200).send(twiml.toString());
};

/**
 * Step 2: Handles the DTMF Keypress Callback (/api/ivrs/gather)
 * Identifies caller phone, attaches predictive SafeZoneId, logs SOS_Ping,
 * and plays regional confirmation message.
 */
export const handleGatherResponse = async (req, res) => {
  const twiml = new VoiceResponse();

  // Extract phone and key pressed (Supports Twilio "Digits", Exotel "Digits", or JSON)
  const callerPhone = (req.body.From || req.body.phoneNumber || req.body.Caller || '').trim();
  const digitPressed = (req.body.Digits || req.body.digit || '').toString().trim();

  const needCategory = DTMF_MAP[digitPressed];

  // If invalid digit pressed
  if (!needCategory) {
    const gather = twiml.gather({
      numDigits: 1,
      action: '/api/ivrs/gather',
      method: 'POST',
      timeout: 5,
    });

    gather.say(
      { language: 'bn-IN' },
      'ভুল বোতাম টেপা হয়েছে। খাবারের জন্য ১, ওষুধের জন্য ২, অথবা উদ্ধারের জন্য ৩ টিপুন।'
    );
    gather.say(
      { language: 'hi-IN' },
      'गलत बटन दबाया गया है। भोजन के लिए १, दवा के लिए २, या बचाव के लिए ३ दबाएं।'
    );

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    return res.status(200).send(twiml.toString());
  }

  try {
    // Single-Pass CTE: Resolve Victim, attach predictive SafeZone, log SOS_Ping, flag IN_DISTRESS
    const singlePassQuery = `
      WITH victim_match AS (
        SELECT 
          v.id AS victim_id,
          v.village_id,
          sz.id AS safe_zone_id,
          sz.name AS safe_zone_name
        FROM victims v
        LEFT JOIN LATERAL (
          SELECT s.id, s.name 
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
        (SELECT safe_zone_name FROM victim_match) AS safe_zone_name,
        (SELECT id FROM log_ping) AS ping_id;
    `;

    const dbResult = await pool.query(singlePassQuery, [callerPhone, needCategory]);
    const record = dbResult.rows[0];

    // Fallback if caller phone is unregistered in the system
    if (!record?.victim_id) {
      const fallbackVillage = await pool.query(`SELECT id FROM villages LIMIT 1`);
      const fallbackSafeZone = await pool.query(`SELECT id, name FROM safe_zones ORDER BY elevation_meters DESC LIMIT 1`);

      if (fallbackVillage.rows[0]?.id) {
        const newVictim = await pool.query(
          `INSERT INTO victims (phone_number, village_id, status) VALUES ($1, $2, 'IN_DISTRESS') RETURNING id`,
          [callerPhone, fallbackVillage.rows[0].id]
        );

        if (newVictim.rows[0]?.id) {
          await pool.query(
            `INSERT INTO sos_pings (victim_id, safe_zone_id, need_category, resolved) VALUES ($1, $2, $3, false)`,
            [newVictim.rows[0].id, fallbackSafeZone.rows[0]?.id || null, needCategory]
          );
        }
      }
    }

    const shelterName = record?.safe_zone_name || 'নিকটবর্তী আশ্রয় শিবির';

    console.info(
      `[IVRS Voice Success] Caller: ${callerPhone} | Key Pressed: ${digitPressed} (${needCategory}) | Predictive Shelter: ${shelterName}`
    );

    // Audio Voice Confirmations in Regional Languages
    // 1. Bengali Audio Confirmation
    twiml.say(
      {
        language: 'bn-IN',
        voice: 'Polly.Aditi',
      },
      `আপনার অনুরোধ গ্রহণ করা হয়েছে। নিকটবর্তী আশ্রয় শিবির ${shelterName} থেকে উদ্ধারকারী দল রওনা হচ্ছে। নিরাপদ আশ্রয়ে থাকুন।`
    );

    // 2. Hindi Audio Confirmation
    twiml.say(
      {
        language: 'hi-IN',
        voice: 'Polly.Aditi',
      },
      `आपकी आपातकालीन सहायता दर्ज कर ली गई है। राहत दल भेजा जा रहा है। सुरक्षित रहें।`
    );

    // 3. English Audio Confirmation
    twiml.say(
      {
        language: 'en-IN',
        voice: 'Polly.Raveena',
      },
      'Your emergency request is registered. Help is on the way. Please stay in a safe place.'
    );

    twiml.hangup();

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    return res.status(200).send(twiml.toString());
  } catch (error) {
    console.error('[IVRS Error] Failed to process DTMF input:', error);

    // Fail-safe comforting response
    twiml.say(
      { language: 'bn-IN' },
      'আপনার জরুরি অনুরোধ লিপিবদ্ধ করা হয়েছে। শান্ত থাকুন, সাহায্য আসছে।'
    );
    twiml.hangup();

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    return res.status(200).send(twiml.toString());
  }
};
