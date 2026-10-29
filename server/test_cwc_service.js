import pool from './config/db.js';
import { fetchLiveGaugeData, checkRiverGauges } from './services/cwcService.js';

async function testCwcFlow() {
  console.log('--- Starting CWC River Gauge Monitoring & Early Evacuation Test ---');

  try {
    // 1. Test fetchLiveGaugeData
    console.log('\n[Test 1] Testing fetchLiveGaugeData("CWC-BARAK-01")...');
    const telemetry = await fetchLiveGaugeData('CWC-BARAK-01');
    console.log('Telemetry Response:', telemetry);

    if (!telemetry.stationCode || typeof telemetry.measuredLevelMeters !== 'number' || !telemetry.timestamp) {
      throw new Error('Test 1 Failed: Telemetry payload format incorrect.');
    }
    console.log('✓ Test 1 Passed: Telemetry returned correctly.');

    // 2. Test checkRiverGauges with callback
    console.log('\n[Test 2] Testing checkRiverGauges() with evacuation trigger callback...');
    const alertedVillages = [];

    const mockQueueEvacuationAlerts = async (villageId) => {
      console.log(`[Mock Dispatch Callback Executed] Queued evacuation alert for village ID: ${villageId}`);
      alertedVillages.push(villageId);
    };

    const results = await checkRiverGauges(mockQueueEvacuationAlerts);
    console.log('\nMonitoring Run Summary:', JSON.stringify(results, null, 2));

    // 3. Verify in PostgreSQL
    console.log('\n[Test 3] Verifying database updates in river_stations...');
    const dbStations = await pool.query('SELECT station_code, river_name, current_level_m, danger_level_m, last_updated FROM river_stations');
    console.log('Database River Stations:');
    console.table(dbStations.rows);

    const updated = dbStations.rows.find(s => Number(s.current_level_m) === 54.85);
    if (!updated) {
      throw new Error('Test 3 Failed: current_level_m was not updated to 54.85 in PostgreSQL.');
    }
    console.log('✓ Test 3 Passed: PostgreSQL database updated with latest measured levels.');

    console.log('\n================================================================');
    console.log('✅ ALL CWC RIVER GAUGE MONITORING & EVACUATION TESTS PASSED!');
    console.log('================================================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ CWC Test Failed:', error);
    process.exit(1);
  }
}

testCwcFlow();
