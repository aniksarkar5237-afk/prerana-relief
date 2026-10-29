import pool from '../config/db.js';

const sql = `
CREATE TABLE IF NOT EXISTS river_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_code VARCHAR(100) UNIQUE NOT NULL,
  river_name VARCHAR(150) NOT NULL,
  location_name VARCHAR(150),
  warning_level_m NUMERIC(6, 2) NOT NULL DEFAULT 50.00,
  danger_level_m NUMERIC(6, 2) NOT NULL DEFAULT 52.50,
  current_level_m NUMERIC(6, 2) DEFAULT 48.00,
  last_updated TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_river_stations_code ON river_stations(station_code);

ALTER TABLE villages 
ADD COLUMN IF NOT EXISTS river_station_id UUID REFERENCES river_stations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_villages_river_station ON villages(river_station_id);

-- Seed sample river station if empty
INSERT INTO river_stations (station_code, river_name, location_name, warning_level_m, danger_level_m, current_level_m)
VALUES 
  ('CWC-BARAK-01', 'Barak River', 'Annapurna Ghat / Silchar', 19.83, 20.40, 21.15),
  ('CWC-MATLA-02', 'Matla River', 'Canning / Sundarbans', 5.20, 5.80, 6.10)
ON CONFLICT (station_code) DO NOTHING;

-- Link test village to CWC-MATLA-02
UPDATE villages 
SET river_station_id = (SELECT id FROM river_stations WHERE station_code = 'CWC-MATLA-02' LIMIT 1)
WHERE name = 'Sundarbans Delta Zone A' AND river_station_id IS NULL;
`;

async function run() {
  try {
    console.log('Migrating river_stations table & villages column...');
    await pool.query(sql);
    console.log('river_stations migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

run();
