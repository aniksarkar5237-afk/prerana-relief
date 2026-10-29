-- Create table medical_campaigns
CREATE TABLE IF NOT EXISTS medical_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  charity_id INTEGER REFERENCES charity_profiles(id) ON DELETE SET NULL,
  patient_name VARCHAR(255) NOT NULL,
  hospital_name VARCHAR(255) NOT NULL,
  hospital_uhid VARCHAR(100),
  diagnosis TEXT,
  target_amount DECIMAL(15, 2) NOT NULL,
  current_amount DECIMAL(15, 2) DEFAULT 0.00,
  medical_estimate_url TEXT,
  verification_status VARCHAR(50) DEFAULT 'review_pending',
  hospital_verification_token VARCHAR(64) UNIQUE,
  hospital_verified_at TIMESTAMPTZ,
  hospital_admin_remarks TEXT,
  applicant_phone VARCHAR(15),
  hospital_contact_email VARCHAR(150),
  hospital_contact_phone VARCHAR(15),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create table notification_dispatches
CREATE TABLE IF NOT EXISTS notification_dispatches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES medical_campaigns(id) ON DELETE CASCADE,
  recipient_type VARCHAR(20) CHECK (recipient_type IN ('hospital', 'applicant', 'donor')),
  recipient_target VARCHAR(150) NOT NULL,
  channel VARCHAR(20) CHECK (channel IN ('sms', 'whatsapp', 'email')) DEFAULT 'sms',
  message_body TEXT NOT NULL,
  delivery_status VARCHAR(20) DEFAULT 'sent',
  dispatched_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
