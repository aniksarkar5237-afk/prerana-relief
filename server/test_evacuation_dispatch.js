import pool from './config/db.js';
import { dispatchEvacuationAlerts, recordSOSPing, listVillagesSummary } from './services/evacuationService.js';

async function testEvacuationFlow() {
  console.log('--- Starting Disaster Logistics & Evacuation Test ---');

  try {
    // 1. Create or retrieve test village
    let villageRes = await pool.query(
      `SELECT id, name FROM villages WHERE name = $1`,
      ['Sundarbans Delta Zone A']
    );

    let villageId;
    if (villageRes.rows.length === 0) {
      const insertVillage = await pool.query(
        `INSERT INTO villages (name, latitude, longitude, vulnerability_score, region_name) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id, name`,
        ['Sundarbans Delta Zone A', 21.9497, 88.8998, 88.5, 'West Bengal Delta']
      );
      villageId = insertVillage.rows[0].id;
      console.log(`[Created Test Village]: ${insertVillage.rows[0].name} (${villageId})`);
    } else {
      villageId = villageRes.rows[0].id;
      console.log(`[Found Existing Test Village]: ${villageRes.rows[0].name} (${villageId})`);
    }

    // 2. Ensure SafeZones exist for this village
    const safeZoneCheck = await pool.query(
      `SELECT id, name FROM safe_zones WHERE village_id = $1`,
      [villageId]
    );

    let safeZoneId;
    if (safeZoneCheck.rows.length === 0) {
      const insertSafeZone = await pool.query(
        `INSERT INTO safe_zones (name, latitude, longitude, elevation_meters, capacity, structure_type, village_id) 
         VALUES 
          ($1, $2, $3, $4, $5, $6, $7),
          ($8, $9, $10, $11, $12, $13, $7)
         RETURNING id, name`,
        [
          'Gosaba Cyclone & Flood Shelter (Primary)',
          21.9520,
          88.9050,
          18.5, // higher elevation
          500,
          'Reinforced Concrete 3-Tier Shelter',
          villageId,
          'Community Health Clinic Ground (Secondary)',
          21.9480,
          88.8920,
          6.0,
          120,
          'Brick Schoolhouse',
        ]
      );
      safeZoneId = insertSafeZone.rows[0].id;
      console.log(`[Created SafeZones]: ${insertSafeZone.rows.map(r => r.name).join(', ')}`);
    } else {
      safeZoneId = safeZoneCheck.rows[0].id;
      console.log(`[Found SafeZones]: Count = ${safeZoneCheck.rows.length}`);
    }

    // 3. Ensure test victims exist
    const testPhones = ['+919876543210', '+919876543211', '+919876543212'];
    for (const phone of testPhones) {
      await pool.query(
        `INSERT INTO victims (phone_number, village_id, status) 
         VALUES ($1, $2, 'SAFE') 
         ON CONFLICT (phone_number) DO UPDATE SET village_id = $2`,
        [phone, villageId]
      );
    }
    console.log(`[Victims Registered/Updated]: ${testPhones.join(', ')}`);

    // 4. Test dispatchEvacuationAlerts
    console.log('\n--- Testing dispatchEvacuationAlerts() ---');
    const dispatchResult = await dispatchEvacuationAlerts(villageId);
    console.log('Dispatch Result:');
    console.log(`- Success: ${dispatchResult.success}`);
    console.log(`- Target Village: ${dispatchResult.village.name}`);
    console.log(`- Chosen SafeZone: ${dispatchResult.safeZone.name} (Elevation: ${dispatchResult.safeZone.elevation}m)`);
    console.log(`- Total Victims: ${dispatchResult.totalVictims}`);
    console.log(`- Dispatched SMS: ${dispatchResult.dispatched}`);
    console.log('\nSample Bilingual Message:\n' + dispatchResult.messageSample);

    // 5. Test recordSOSPing
    console.log('\n--- Testing recordSOSPing() ---');
    const sosResult = await recordSOSPing({
      victimPhone: '+919876543210',
      needCategory: 'RESCUE',
    });
    console.log('SOS Ping Recorded:', sosResult);

    // 6. Test listVillagesSummary
    console.log('\n--- Testing listVillagesSummary() ---');
    const summary = await listVillagesSummary();
    console.log(`Summary found ${summary.length} villages.`);
    const matched = summary.find(v => v.id === villageId);
    if (matched) {
      console.log(`Village ${matched.name} has ${matched.victim_count} victims, ${matched.unresolved_sos_count} unresolved SOS pings.`);
    }

    console.log('\n✅ ALL EVACUATION & DISASTER LOGISTICS TESTS PASSED WITHOUT FAILURE!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  }
}

testEvacuationFlow();
