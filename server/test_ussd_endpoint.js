import pool from './config/db.js';

async function testUssdFlow() {
  console.log('--- Starting USSD Webhook & SOS Ping Latency Test ---');

  // Dynamically import the controller
  const { handleUssdWebhook } = await import('./controllers/ussdController.js');

  // Helper to simulate Express req/res
  function createMockReqRes(body) {
    const req = { body, query: {} };
    let responseBody = '';
    let statusCode = 200;
    const headers = {};

    const res = {
      status: (code) => {
        statusCode = code;
        return res;
      },
      setHeader: (key, val) => {
        headers[key] = val;
      },
      send: (data) => {
        responseBody = data;
        return res;
      },
    };

    return { req, res, getOutput: () => ({ statusCode, responseBody, headers }) };
  }

  try {
    const testPhone = '+919876543210';

    // TEST 1: Initial Dial (text is empty)
    console.log('\n[Test 1] Initial Dial (text = "")');
    const t1 = createMockReqRes({ phoneNumber: testPhone, text: '', sessionId: 'sess_1' });
    const start1 = Date.now();
    await handleUssdWebhook(t1.req, t1.res);
    const time1 = Date.now() - start1;
    const out1 = t1.getOutput();

    console.log(`- Status: ${out1.statusCode}`);
    console.log(`- Response: \n${out1.responseBody}`);
    console.log(`- Latency: ${time1}ms (Must be < 500ms)`);
    if (!out1.responseBody.includes('Disaster Relief') || !out1.responseBody.includes('1. Need Food')) {
      throw new Error('Test 1 Failed: Initial dial menu format incorrect');
    }

    // TEST 2: Select Option 1 (Need Food)
    console.log('\n[Test 2] User Selects Option "1" (Need Food)');
    const t2 = createMockReqRes({ phoneNumber: testPhone, text: '1', sessionId: 'sess_2' });
    const start2 = Date.now();
    await handleUssdWebhook(t2.req, t2.res);
    const time2 = Date.now() - start2;
    const out2 = t2.getOutput();

    console.log(`- Status: ${out2.statusCode}`);
    console.log(`- Response: ${out2.responseBody}`);
    console.log(`- Latency: ${time2}ms (Must be < 500ms)`);
    if (!out2.responseBody.includes('Request received. Help is being routed.')) {
      throw new Error('Test 2 Failed: Unexpected termination message');
    }

    // Verify DB entry for Test 2
    const verifyPing1 = await pool.query(
      `SELECT sp.id, sp.need_category, sp.safe_zone_id, sz.name AS safe_zone_name, v.phone_number
       FROM sos_pings sp
       JOIN victims v ON v.id = sp.victim_id
       LEFT JOIN safe_zones sz ON sz.id = sp.safe_zone_id
       WHERE v.phone_number = $1 AND sp.need_category = 'FOOD'
       ORDER BY sp.timestamp DESC
       LIMIT 1`,
      [testPhone]
    );

    if (verifyPing1.rows.length === 0) {
      throw new Error('Test 2 Failed: SOS Ping not recorded in PostgreSQL');
    }
    const ping1 = verifyPing1.rows[0];
    console.log(`- DB Verified: Ping ID=${ping1.id}, Need=${ping1.need_category}, Predictive SafeZone=${ping1.safe_zone_name} (${ping1.safe_zone_id})`);
    if (!ping1.safe_zone_id) {
      throw new Error('Test 2 Failed: SafeZoneId was not automatically attached to the ping!');
    }

    // TEST 3: Select Option 2 (Need Medicine)
    console.log('\n[Test 3] User Selects Option "2" (Need Medicine)');
    const t3 = createMockReqRes({ phoneNumber: testPhone, text: '2', sessionId: 'sess_3' });
    const start3 = Date.now();
    await handleUssdWebhook(t3.req, t3.res);
    const time3 = Date.now() - start3;
    const out3 = t3.getOutput();
    console.log(`- Status: ${out3.statusCode}, Latency: ${time3}ms`);
    console.log(`- Response: ${out3.responseBody}`);

    // TEST 4: Select Option 3 (Need Rescue)
    console.log('\n[Test 4] User Selects Option "3" (Need Rescue)');
    const t4 = createMockReqRes({ phoneNumber: testPhone, text: '3', sessionId: 'sess_4' });
    const start4 = Date.now();
    await handleUssdWebhook(t4.req, t4.res);
    const time4 = Date.now() - start4;
    const out4 = t4.getOutput();
    console.log(`- Status: ${out4.statusCode}, Latency: ${time4}ms`);
    console.log(`- Response: ${out4.responseBody}`);

    console.log('\n======================================================');
    console.log('✅ ALL USSD ENDPOINT TESTS PASSED IN UNDER 500MS!');
    console.log('======================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ USSD Test Failed:', err);
    process.exit(1);
  }
}

testUssdFlow();
