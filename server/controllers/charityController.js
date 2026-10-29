import pool from '../config/db.js';

export const getCharityProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileResult = await pool.query('SELECT * FROM charity_profiles WHERE user_id = $1', [userId]);
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ message: 'Charity profile not found' });
    }

    res.status(200).json({ profile: profileResult.rows[0] });
  } catch (error) {
    console.error('Get charity profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllCharities = async (req, res) => {
  try {
    // PUBLIC GATING: Only return verified charities
    const result = await pool.query("SELECT * FROM charity_profiles WHERE verification_status = 'verified'");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Get all charities error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const applyForVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      org_name, description, website_url, pan_number, registration_number,
      bank_account_no, bank_ifsc,
      project_title_0, project_desc_0, project_year_0, project_impact_0,
      project_title_1, project_desc_1, project_year_1, project_impact_1
    } = req.body;
    
    // Check if profile exists, if not create one (UPSERT logic)
    let profileResult = await pool.query('SELECT * FROM charity_profiles WHERE user_id = $1', [userId]);
    let profile;
    if (profileResult.rows.length === 0) {
      const insertProfile = await pool.query(
        'INSERT INTO charity_profiles (user_id, org_name) VALUES ($1, $2) RETURNING *',
        [userId, org_name || 'New NGO']
      );
      profile = insertProfile.rows[0];
    } else {
      profile = profileResult.rows[0];
    }

    const files = req.files || {};
    // Extract file paths from diskStorage
    const doc12a = files['twelve_a']?.[0]?.path;
    const doc80g = files['eighty_g']?.[0]?.path;
    const fcra = files['fcra']?.[0]?.path;
    const audit = files['audit_report']?.[0]?.path;
    
    const proofs0 = files['project_proofs_0']?.map(f => f.path) || [];
    const proofs1 = files['project_proofs_1']?.map(f => f.path) || [];

    // Update profile
    const updateProfileQuery = `
      UPDATE charity_profiles 
      SET 
        org_name = COALESCE($1, org_name),
        description = COALESCE($2, description),
        website_url = COALESCE($3, website_url),
        pan_number = COALESCE($4, pan_number),
        registration_number = COALESCE($5, registration_number),
        bank_account_no = COALESCE($6, bank_account_no),
        bank_ifsc = COALESCE($7, bank_ifsc),
        twelve_a_cert_url = COALESCE($8, twelve_a_cert_url),
        eighty_g_cert_url = COALESCE($9, eighty_g_cert_url),
        fcra_cert_url = COALESCE($10, fcra_cert_url),
        audit_report_url = COALESCE($11, audit_report_url),
        verification_status = 'pending'
      WHERE id = $12
    `;
    await pool.query(updateProfileQuery, [
      org_name, description, website_url, pan_number, registration_number,
      bank_account_no, bank_ifsc,
      doc12a, doc80g, fcra, audit,
      profile.id
    ]);

    // Insert past work
    if (proofs0.length > 0 && project_title_0) {
      await pool.query(
        'INSERT INTO ngo_past_work (charity_id, project_title, description, completion_year, beneficiaries_impacted, proof_images) VALUES ($1, $2, $3, $4, $5, $6)',
        [profile.id, project_title_0, project_desc_0 || '', project_year_0 || new Date().getFullYear(), project_impact_0 || 0, proofs0]
      );
    }
    if (proofs1.length > 0 && project_title_1) {
      await pool.query(
        'INSERT INTO ngo_past_work (charity_id, project_title, description, completion_year, beneficiaries_impacted, proof_images) VALUES ($1, $2, $3, $4, $5, $6)',
        [profile.id, project_title_1, project_desc_1 || '', project_year_1 || new Date().getFullYear(), project_impact_1 || 0, proofs1]
      );
    }

    res.status(200).json({ message: 'Application submitted successfully for review' });
  } catch (error) {
    console.error('Application submission error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

