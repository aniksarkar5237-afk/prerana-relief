import pool from '../config/db.js';

const sql = `
-- villages table
CREATE TABLE IF NOT EXISTS villages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  vulnerability_score NUMERIC(5, 2) DEFAULT 0.0,
  region_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_villages_region ON villages(region_name);
CREATE INDEX IF NOT EXISTS idx_villages_coords ON villages(latitude, longitude);

-- safe_zones table
CREATE TABLE IF NOT EXISTS safe_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  elevation_meters DOUBLE PRECISION NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 100,
  structure_type VARCHAR(100) NOT NULL,
  village_id UUID NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_safe_zones_village_id ON safe_zones(village_id);
CREATE INDEX IF NOT EXISTS idx_safe_zones_elevation ON safe_zones(village_id, elevation_meters DESC);

-- victims table
CREATE TABLE IF NOT EXISTS victims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  village_id UUID NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'SAFE',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_victims_phone ON victims(phone_number);
CREATE INDEX IF NOT EXISTS idx_victims_village_id ON victims(village_id);
CREATE INDEX IF NOT EXISTS idx_victims_village_status ON victims(village_id, status);

-- sos_pings table
CREATE TABLE IF NOT EXISTS sos_pings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  victim_id UUID NOT NULL REFERENCES victims(id) ON DELETE CASCADE,
  safe_zone_id UUID REFERENCES safe_zones(id) ON DELETE SET NULL,
  need_category VARCHAR(50) NOT NULL CHECK (need_category IN ('FOOD', 'MEDICINE', 'RESCUE')),
  resolved BOOLEAN DEFAULT false,
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sos_pings_victim_id ON sos_pings(victim_id);
CREATE INDEX IF NOT EXISTS idx_sos_pings_safe_zone_id ON sos_pings(safe_zone_id);
CREATE INDEX IF NOT EXISTS idx_sos_pings_dispatch ON sos_pings(resolved, need_category, timestamp DESC);
`;

async function run() {
  try {
    console.log('Running migration for disaster relief logistics tables...');
    await pool.query(sql);
    console.log('Migration successful: villages, safe_zones, victims, sos_pings tables and indexes created.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
