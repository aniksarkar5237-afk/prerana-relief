-- users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'donor',
  skills JSONB DEFAULT '[]'::jsonb,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- charity_profiles table
CREATE TABLE IF NOT EXISTS charity_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  org_name VARCHAR(255) NOT NULL,
  description TEXT,
  website_url VARCHAR(255),
  darpan_id VARCHAR(100),
  document_path VARCHAR(255),
  verification_status VARCHAR(50) DEFAULT 'pending',
  pan_number VARCHAR(10),
  registration_number VARCHAR(100),
  integrity_score INTEGER DEFAULT 0,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  twelve_a_cert_url TEXT,
  eighty_g_cert_url TEXT,
  fcra_cert_url TEXT,
  audit_report_url TEXT,
  bank_account_no VARCHAR(50),
  bank_ifsc VARCHAR(20),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id SERIAL PRIMARY KEY,
  charity_id INTEGER REFERENCES charity_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  goal_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0.00,
  category VARCHAR(100),
  start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- donations table
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  donor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  donation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  transaction_status VARCHAR(50) DEFAULT 'pending'
);

-- PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- disaster_zones table
CREATE TABLE IF NOT EXISTS disaster_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  severity_level VARCHAR(50) CHECK (severity_level IN ('advisory', 'warning', 'severe_crisis')),
  affected_district VARCHAR(100),
  state VARCHAR(100),
  boundary_geom GEOMETRY(Polygon, 4326),
  is_active BOOLEAN DEFAULT true,
  reported_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- emergency_aid_requests table
CREATE TABLE IF NOT EXISTS emergency_aid_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_zone_id UUID REFERENCES disaster_zones(id) ON DELETE CASCADE,
  charity_id INTEGER REFERENCES charity_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  target_amount NUMERIC(15, 2) NOT NULL,
  raised_amount NUMERIC(15, 2) DEFAULT 0.00,
  supplies_needed JSONB,
  ngo_vpa VARCHAR(255) NOT NULL,
  lat NUMERIC(10, 8),
  lng NUMERIC(11, 8),
  verification_status VARCHAR(50) DEFAULT 'verified_on_ground',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- disaster_priority_matrix table
CREATE TABLE IF NOT EXISTS disaster_priority_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_zone_id UUID REFERENCES disaster_zones(id) ON DELETE CASCADE,
  state VARCHAR(100),
  district VARCHAR(100),
  priority_level VARCHAR(50)
);

-- medical_campaigns table
CREATE TABLE IF NOT EXISTS medical_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  charity_id INTEGER REFERENCES charity_profiles(id) ON DELETE CASCADE,
  patient_name VARCHAR(255) NOT NULL,
  hospital_name VARCHAR(255),
  hospital_uhid VARCHAR(100),
  diagnosis TEXT,
  target_amount NUMERIC(15, 2) NOT NULL,
  raised_amount NUMERIC(15, 2) DEFAULT 0.00,
  verification_status VARCHAR(50) DEFAULT 'pending',
  hospital_admin_remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- volunteer_tasks table
CREATE TABLE IF NOT EXISTS volunteer_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  disaster_zone_id UUID REFERENCES disaster_zones(id) ON DELETE CASCADE,
  volunteer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  task_description TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'assigned',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- deployment_passes table
CREATE TABLE IF NOT EXISTS deployment_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volunteer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  disaster_zone_id UUID REFERENCES disaster_zones(id) ON DELETE CASCADE,
  pass_status VARCHAR(50) DEFAULT 'approved',
  issued_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- notification_dispatches table
CREATE TABLE IF NOT EXISTS notification_dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- campaign_field_proofs table
CREATE TABLE IF NOT EXISTS campaign_field_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
  proof_url TEXT,
  description TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- verification_audits table
CREATE TABLE IF NOT EXISTS verification_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(100),
  entity_id VARCHAR(255),
  auditor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50),
  remarks TEXT,
  audit_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ngo_past_work table
CREATE TABLE IF NOT EXISTS ngo_past_work (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  charity_id INTEGER REFERENCES charity_profiles(id) ON DELETE CASCADE,
  project_title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  beneficiaries_impacted INT DEFAULT 0,
  completion_year INT NOT NULL,
  proof_images TEXT[] NOT NULL,
  proof_docs TEXT[],
  image_phash VARCHAR(64),
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ngo_verification_logs table
CREATE TABLE IF NOT EXISTS ngo_verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  charity_id INTEGER REFERENCES charity_profiles(id) ON DELETE CASCADE,
  reviewer_id INTEGER REFERENCES users(id),
  previous_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  admin_notes TEXT,
  checks_passed JSONB DEFAULT '{}',
);

-- river_stations table (Central Water Commission / CWC Telemetry)
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

-- villages table
CREATE TABLE IF NOT EXISTS villages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  vulnerability_score NUMERIC(5, 2) DEFAULT 0.0,
  region_name VARCHAR(100) NOT NULL,
  river_station_id UUID REFERENCES river_stations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_villages_region ON villages(region_name);
CREATE INDEX IF NOT EXISTS idx_villages_coords ON villages(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_villages_river_station ON villages(river_station_id);

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
  status VARCHAR(50) DEFAULT 'PENDING',
  timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sos_pings_victim_id ON sos_pings(victim_id);
CREATE INDEX IF NOT EXISTS idx_sos_pings_safe_zone_id ON sos_pings(safe_zone_id);
CREATE INDEX IF NOT EXISTS idx_sos_pings_status ON sos_pings(status);
CREATE INDEX IF NOT EXISTS idx_sos_pings_dispatch ON sos_pings(resolved, need_category, timestamp DESC);

-- boat_dispatches table
CREATE TABLE IF NOT EXISTS boat_dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  safe_zone_id UUID REFERENCES safe_zones(id) ON DELETE CASCADE,
  boat_id VARCHAR(100) NOT NULL,
  assigned_supplies JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'DISPATCHED',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_boat_dispatches_safe_zone ON boat_dispatches(safe_zone_id);

