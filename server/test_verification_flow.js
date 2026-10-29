import pool from './config/db.js';

async function testFlow() {
  try {
    console.log('Testing End-to-End Verification Flow...');

    // Ensure ID 1 is pending before we start
    await pool.query("UPDATE charity_profiles SET verification_status = 'pending' WHERE id = 1");

    // 1. Check all verified charities (simulating public radar map query)
    const initialVerified = await pool.query("SELECT * FROM charity_profiles WHERE verification_status = 'verified'");
    console.log(`Initial Verified Charities on map: ${initialVerified.rows.length}`);

    // 2. Simulate pending NGO
    // Get a pending NGO
    const pendingNgo = await pool.query("SELECT * FROM charity_profiles WHERE verification_status = 'pending' LIMIT 1");
    if (pendingNgo.rows.length === 0) {
      console.log('No pending NGOs to test with. Seed database first.');
      return;
    }
    const targetId = pendingNgo.rows[0].id;
    console.log(`Found pending NGO with ID: ${targetId}, Name: ${pendingNgo.rows[0].org_name}`);

    // 3. Admin approves NGO
    console.log('Admin is approving the NGO...');
    const updateResult = await pool.query(
      "UPDATE charity_profiles SET verification_status = 'verified' WHERE id = $1 RETURNING *",
      [targetId]
    );

    if (updateResult.rows[0].verification_status === 'verified') {
      console.log('✅ NGO status successfully updated in database to "verified"');
    }

    // 4. Re-check public query
    const newVerified = await pool.query("SELECT * FROM charity_profiles WHERE verification_status = 'verified'");
    console.log(`New Verified Charities on map: ${newVerified.rows.length}`);

    if (newVerified.rows.length === initialVerified.rows.length + 1) {
      console.log('✅ End-to-end flow verified! The approved NGO is now visible in the public directory query.');
    } else {
      console.log('❌ Failed: NGO did not appear in the verified list.');
    }

  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    pool.end();
  }
}

testFlow();
