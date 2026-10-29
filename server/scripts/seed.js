import pool from '../config/db.js';
import bcrypt from 'bcrypt';

const runSeed = async () => {
  try {
    console.log('Starting database seed...');
    
    // Create missing tables for volunteer tasks and deployment passes if they do not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS volunteer_tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        disaster_zone_id UUID REFERENCES disaster_zones(id) ON DELETE CASCADE,
        volunteer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        task_description TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'assigned',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS deployment_passes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        volunteer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        disaster_zone_id UUID REFERENCES disaster_zones(id) ON DELETE CASCADE,
        pass_status VARCHAR(50) DEFAULT 'approved',
        issued_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
      
      ALTER TABLE users ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;
    `);
    
    console.log('Clearing existing records...');
    await pool.query(`
      TRUNCATE TABLE 
        volunteer_tasks, 
        deployment_passes, 
        notification_dispatches, 
        medical_campaigns, 
        campaign_field_proofs, 
        disaster_priority_matrix, 
        verification_audits, 
        emergency_aid_requests, 
        disaster_zones, 
        donations, 
        campaigns, 
        charity_profiles, 
        users 
      CASCADE;
    `);

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash('Password@123', saltRounds);

    console.log('Seeding Users...');
    // Roles: admin, ngo, volunteer, donor
    const usersRes = await pool.query(`
      INSERT INTO users (name, email, password_hash, role, skills) VALUES 
      ('Admin', 'admin@aegisrelief.org', $1, 'admin', '[]'::jsonb),
      ('Assam Valley Relief Taskforce', 'assamvalley@ngo.org', $1, 'ngo', '[]'::jsonb),
      ('Bengal Delta Emergency Network', 'bengaldelta@ngo.org', $1, 'ngo', '[]'::jsonb),
      ('Vikram Das', 'vikram.das@volunteer.org', $1, 'volunteer', '["first_aid", "boat_operator"]'::jsonb),
      ('Arun Mehra', 'arun.mehra@donor.com', $1, 'donor', '[]'::jsonb)
      RETURNING id, role, email;
    `, [passwordHash]);
    
    const users = usersRes.rows;
    const admin = users.find(u => u.email === 'admin@aegisrelief.org');
    const ngoAssam = users.find(u => u.email === 'assamvalley@ngo.org');
    const ngoBengal = users.find(u => u.email === 'bengaldelta@ngo.org');
    const volunteer = users.find(u => u.email === 'vikram.das@volunteer.org');
    const donor = users.find(u => u.email === 'arun.mehra@donor.com');

    console.log('Seeding Charity Profiles...');
    const charityRes = await pool.query(`
      INSERT INTO charity_profiles (user_id, org_name, verification_status, pan_number, integrity_score, verified_at, verified_by) VALUES 
      ($1, 'Assam Valley Relief Taskforce', 'verified', 'ABCD1234E', 98, CURRENT_TIMESTAMP, $3),
      ($2, 'Bengal Delta Emergency Network', 'verified', 'WXYZ5678F', 95, CURRENT_TIMESTAMP, $3)
      RETURNING id, org_name;
    `, [ngoAssam.id, ngoBengal.id, admin.id]);
    
    const charities = charityRes.rows;
    const assamCharity = charities.find(c => c.org_name === 'Assam Valley Relief Taskforce');
    const bengalCharity = charities.find(c => c.org_name === 'Bengal Delta Emergency Network');

    console.log('Seeding Disaster Zones...');
    const zonesRes = await pool.query(`
      INSERT INTO disaster_zones (title, severity_level, affected_district, state, boundary_geom) VALUES 
      ('Assam Cachar/Silchar flood basin', 'severe_crisis', 'Cachar', 'Assam', ST_GeomFromText('POLYGON((92.7 24.8, 92.9 24.8, 92.9 24.7, 92.7 24.7, 92.7 24.8))', 4326)),
      ('West Bengal Sundarbans embankment breach', 'warning', 'South 24 Parganas', 'West Bengal', ST_GeomFromText('POLYGON((88.7 22.1, 88.9 22.1, 88.9 21.9, 88.7 21.9, 88.7 22.1))', 4326))
      RETURNING id, title;
    `);
    
    const zones = zonesRes.rows;
    const assamZone = zones.find(z => z.title === 'Assam Cachar/Silchar flood basin');
    const bengalZone = zones.find(z => z.title === 'West Bengal Sundarbans embankment breach');

    console.log('Seeding Disaster Priority Matrix...');
    await pool.query(`
      INSERT INTO disaster_priority_matrix (disaster_zone_id, state, district, priority_level) VALUES 
      ($1, 'Assam', 'Cachar', 'P0'),
      ($2, 'West Bengal', 'South 24 Parganas', 'P1')
    `, [assamZone.id, bengalZone.id]);

    console.log('Seeding Emergency Aid Requests...');
    await pool.query(`
      INSERT INTO emergency_aid_requests (disaster_zone_id, charity_id, title, target_amount, ngo_vpa, lat, lng, verification_status) VALUES 
      ($1, $3, 'Emergency Rescue Boats & Ration for Silchar', 500000.00, 'assamvalley@upi', 24.75, 92.8, 'verified_on_ground'),
      ($2, $4, 'Embankment Repair Materials & Medical Kits', 300000.00, 'bengaldelta@upi', 22.0, 88.8, 'verified_on_ground')
    `, [assamZone.id, bengalZone.id, assamCharity.id, bengalCharity.id]);

    console.log('Seeding Medical Emergency Case...');
    await pool.query(`
      INSERT INTO medical_campaigns (charity_id, patient_name, hospital_name, hospital_uhid, diagnosis, target_amount, verification_status, hospital_admin_remarks) VALUES 
      ($1, 'Rahul Sen', 'Apollo Multispecialty Hospitals, Kolkata', 'UHID-KOL-2026-9812', 'Acute End-Stage Liver Disease (Pediatric Liver Transplant)', 2500000.00, 'verified', 'Hospital Superintendent Desk confirmed')
    `, [bengalCharity.id]);

    console.log('Seeding Volunteer Tasks and Deployment Passes...');
    await pool.query(`
      INSERT INTO volunteer_tasks (disaster_zone_id, volunteer_id, task_description, status) VALUES 
      ($1, $2, 'Operate rescue boats in Silchar flooded areas and provide first aid.', 'assigned')
    `, [assamZone.id, volunteer.id]);

    await pool.query(`
      INSERT INTO deployment_passes (volunteer_id, disaster_zone_id, pass_status) VALUES 
      ($1, $2, 'approved')
    `, [volunteer.id, assamZone.id]);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
};

runSeed();
