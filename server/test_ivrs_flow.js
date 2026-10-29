import pool from './config/db.js';

async function testIvrsFlow() {
  console.log('--- Starting IVRS Automated Voice Prompt & DTMF Test ---');

  const { handleIncomingCall, handleGatherResponse } = await import('./controllers/ivrsController.js');

  function createMockReqRes(body = {}) {
    let responseData = '';
    let statusCode = 200;
    const headers = {};

    const res = {
      status: (code) => { statusCode = code; return res; },
      setHeader: (key, val) => { headers[key] = val; },
      send: (data) => { responseData = data; return res; },
    };

    return { req: { body, query: {} }, res, getOutput: () => ({ statusCode, responseData, headers }) };
  }

  try {
    const testPhone = '+919876543210';

    // -----------------------------------------------------------------------
    // TEST 1: Inbound Emergency Call Handshake (/api/ivrs/incoming)
    // -----------------------------------------------------------------------
    console.log('\n[Test 1] Simulating Inbound Emergency Call from Villager...');
    const t1 = createMockReqRes({ From: testPhone, CallSid: 'CA_test_001' });
    handleIncomingCall(t1.req, t1.res);
    const out1 = t1.getOutput();

    console.log(`- Status: ${out1.statusCode}`);
    console.log(`- Content-Type: ${out1.headers['Content-Type']}`);
    console.log(`- TwiML Generated Voice Prompt Snippet:\n${out1.responseData.substring(0, 320)}...\n`);

    if (!out1.responseData.includes('<Gather') || !out1.responseData.includes('numDigits="1"')) {
      throw new Error('Test 1 Failed: <Gather numDigits="1"> missing in TwiML response.');
    }
    if (!out1.responseData.includes('বন্যা ত্রাণ') || !out1.responseData.includes('খাবারের জন্য ১ টিপুন')) {
      throw new Error('Test 1 Failed: Bengali voice prompt missing from IVRS.');
    }
    console.log('✓ Test 1 Passed: Regional voice prompt correctly queued with single-digit DTMF gather.');

    // -----------------------------------------------------------------------
    // TEST 2: Villager Presses "1" for Food (/api/ivrs/gather)
    // -----------------------------------------------------------------------
    console.log('\n[Test 2] Illiterate Villager Presses Key "1" (Need Food)...');
    const t2 = createMockReqRes({ From: testPhone, Digits: '1', CallSid: 'CA_test_002' });
    await handleGatherResponse(t2.req, t2.res);
    const out2 = t2.getOutput();

    console.log(`- Status: ${out2.statusCode}`);
    console.log(`- TwiML Confirmation Snippet:\n${out2.responseData.substring(0, 340)}...\n`);

    if (!out2.responseData.includes('অনুরোধ গ্রহণ করা হয়েছে') || !out2.responseData.includes('<Hangup/>')) {
      throw new Error('Test 2 Failed: Bengali audio confirmation or call hangup missing.');
    }

    // Verify DB entry
    const verifyPing = await pool.query(
      `SELECT sp.id, sp.need_category, sp.safe_zone_id, sz.name AS safe_zone_name, v.phone_number, v.status
       FROM sos_pings sp
       JOIN victims v ON v.id = sp.victim_id
       LEFT JOIN safe_zones sz ON sz.id = sp.safe_zone_id
       WHERE v.phone_number = $1 AND sp.need_category = 'FOOD'
       ORDER BY sp.timestamp DESC
       LIMIT 1`,
      [testPhone]
    );

    if (verifyPing.rows.length === 0) {
      throw new Error('Test 2 Failed: SOS Ping not recorded in PostgreSQL from IVRS keypress.');
    }

    const row = verifyPing.rows[0];
    console.log(`- DB Verified: Ping ID=${row.id}`);
    console.log(`- Registered Need: ${row.need_category}`);
    console.log(`- Predictive Shelter Attached: ${row.safe_zone_name} (ID: ${row.safe_zone_id})`);
    console.log(`- Victim Status: ${row.status}`);
    console.log('✓ Test 2 Passed: Single keypress logged distress and attached predictive shelter.');

    // -----------------------------------------------------------------------
    // TEST 3: Villager Presses "3" for Rescue (/api/ivrs/gather)
    // -----------------------------------------------------------------------
    console.log('\n[Test 3] Villager Presses Key "3" (Need Rescue)...');
    const t3 = createMockReqRes({ From: testPhone, Digits: '3', CallSid: 'CA_test_003' });
    await handleGatherResponse(t3.req, t3.res);
    const out3 = t3.getOutput();

    const verifyRescue = await pool.query(
      `SELECT sp.id, sp.need_category, sp.safe_zone_id, sz.name AS safe_zone_name
       FROM sos_pings sp
       JOIN victims v ON v.id = sp.victim_id
       LEFT JOIN safe_zones sz ON sz.id = sp.safe_zone_id
       WHERE v.phone_number = $1 AND sp.need_category = 'RESCUE'
       ORDER BY sp.timestamp DESC
       LIMIT 1`,
      [testPhone]
    );

    if (verifyRescue.rows.length === 0) {
      throw new Error('Test 3 Failed: Rescue SOS Ping not recorded from IVRS keypress 3.');
    }
    console.log(`- DB Verified: Rescue Ping ID=${verifyRescue.rows[0].id}`);
    console.log('✓ Test 3 Passed: Emergency rescue registered successfully via IVRS voice hotline.');

    console.log('\n================================================================');
    console.log('✅ ALL IVRS REGIONAL VOICE PROMPT & DTMF TESTS PASSED 100%!');
    console.log('================================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ IVRS Test Failed:', err);
    process.exit(1);
  }
}

testIvrsFlow();
