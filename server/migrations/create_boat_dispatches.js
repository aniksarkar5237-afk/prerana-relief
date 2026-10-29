import pool from '../config/db.js';

const sql = `
-- Add status column to sos_pings if not exists
ALTER TABLE sos_pings 
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'PENDING';

-- Create boat_dispatches log table
CREATE TABLE IF NOT EXISTS boat_dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  safe_zone_id UUID REFERENCES safe_zones(id) ON DELETE CASCADE,
  boat_id VARCHAR(100) NOT NULL,
  assigned_supplies JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'DISPATCHED',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_boat_dispatches_safe_zone ON boat_dispatches(safe_zone_id);
CREATE INDEX IF NOT EXISTS idx_sos_pings_status ON sos_pings(status);
`;

async function run() {
  try {
    console.log('Running migration for boat_dispatches table & sos_pings status column...');
    await pool.query(sql);
    console.log('Migration successful: boat_dispatches and sos_pings status column created.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
