-- Ensure required extensions are available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Alter table charity_profiles
ALTER TABLE charity_profiles
  ADD COLUMN IF NOT EXISTS pan_number VARCHAR(10),
  ADD COLUMN IF NOT EXISTS integrity_score INT DEFAULT 0 CHECK (integrity_score BETWEEN 0 AND 100),
  ADD COLUMN IF NOT EXISTS audit_flags JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES users(id);

-- Create table verification_audits
CREATE TABLE IF NOT EXISTS verification_audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  charity_id UUID REFERENCES charity_profiles(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_url TEXT NOT NULL,
  ocr_raw_text TEXT,
  matched_tax_id BOOLEAN DEFAULT false,
  calculated_score INT NOT NULL,
  decision VARCHAR(20) CHECK (decision IN ('auto_flagged', 'review_pending', 'auto_cleared')) DEFAULT 'review_pending',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create table disaster_priority_matrix
CREATE TABLE IF NOT EXISTS disaster_priority_matrix (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  disaster_zone_id UUID REFERENCES disaster_zones(id) ON DELETE CASCADE UNIQUE,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  rainfall_24h_mm NUMERIC(6, 2) DEFAULT 0.00,
  water_level_danger_offset_m NUMERIC(5, 2) DEFAULT 0.00,
  active_distress_count INT DEFAULT 0,
  calculated_priority_score NUMERIC(5, 2) DEFAULT 0.00,
  priority_level VARCHAR(10) CHECK (priority_level IN ('P0', 'P1', 'P2')) DEFAULT 'P2',
  last_evaluated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create table campaign_field_proofs
CREATE TABLE IF NOT EXISTS campaign_field_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  gps_point GEOMETRY(Point, 4326) NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL,
  verified_within_boundary BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
