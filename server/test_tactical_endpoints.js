import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/tactical';

async function runTests() {
  console.log('--- TESTING TACTICAL AGGREGATION & DISPATCH ENDPOINTS ---');
  
  // 1. Test GET /api/tactical/overview
  console.log('\n1. Testing GET /api/tactical/overview...');
  try {
    const overviewRes = await axios.get(`${BASE_URL}/overview`);
    console.log('Status:', overviewRes.status);
    console.log('Response summary:', {
      success: overviewRes.data.success,
      count: overviewRes.data.count,
    });
    
    if (overviewRes.data.safeZones?.length > 0) {
      console.log('First Safe Zone Details:');
      const sz = overviewRes.data.safeZones[0];
      console.log({
        id: sz.id,
        name: sz.name,
        village: sz.village_name,
        total_pings: sz.total_pings,
        food_requests: sz.food_requests,
        medicine_requests: sz.medicine_requests,
        rescue_requests: sz.rescue_requests,
        latest_ping_time: sz.latest_ping_time,
        status: sz.status,
        is_dark_zone: sz.is_dark_zone
      });

      // 2. Test POST /api/tactical/dispatch-boat using the first safe zone
      console.log(`\n2. Testing POST /api/tactical/dispatch-boat for safeZone: ${sz.name}...`);
      const dispatchPayload = {
        safeZoneId: sz.id,
        boatId: 'NDRF-BOAT-DELTA-9',
        assignedSupplies: [
          { item: 'Dry Rations / Food Packs', quantity: 200 },
          { item: 'Water Purification Tablets', quantity: 500 },
          { item: 'Inflatable Life Rafts', quantity: 4 }
        ]
      };

      const dispatchRes = await axios.post(`${BASE_URL}/dispatch-boat`, dispatchPayload);
      console.log('Dispatch Status:', dispatchRes.status);
      console.log('Dispatch Response:', JSON.stringify(dispatchRes.data, null, 2));
    } else {
      console.warn('No safe zones returned to test dispatch-boat.');
    }

    console.log('\n--- ALL TACTICAL TESTS PASSED SUCCESSFULLY ---');
    process.exit(0);
  } catch (err) {
    console.error('Tactical tests failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

runTests();
