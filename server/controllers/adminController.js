import pool from '../config/db.js';
import { dispatchVerificationAlert } from '../services/notificationService.js';

export const getPendingNGOs = async (req, res) => {
  try {
    const query = `
      SELECT 
        cp.*,
        u.email, u.name as user_name,
        json_agg(
          json_build_object(
            'project_name', npw.project_name,
            'proof_url', npw.proof_url,
            'description', npw.description,
            'created_at', npw.created_at
          )
        ) FILTER (WHERE npw.id IS NOT NULL) as past_work
      FROM charity_profiles cp
      JOIN users u ON cp.user_id = u.id
      LEFT JOIN ngo_past_work npw ON cp.id = npw.charity_id
      WHERE cp.verification_status = 'pending'
      GROUP BY cp.id, u.id
    `;
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching pending NGOs:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const reviewNGO = async (req, res) => {
  try {
    const adminId = req.user.id;
    const charityId = req.params.id;
    const { action, rejection_reason } = req.body; // action: 'verified' | 'rejected'

    if (!['verified', 'rejected'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action' });
    }

    // Update profile
    const updateQuery = `
      UPDATE charity_profiles 
      SET 
        verification_status = $1, 
        verified_by = $2, 
        verified_at = CURRENT_TIMESTAMP,
        rejection_reason = $3
      WHERE id = $4
      RETURNING *
    `;
    const updatedProfile = await pool.query(updateQuery, [action, adminId, rejection_reason || null, charityId]);

    if (updatedProfile.rows.length === 0) {
      return res.status(404).json({ message: 'Charity profile not found' });
    }

    const profile = updatedProfile.rows[0];

    // Fetch user contact info for notification
    const userResult = await pool.query('SELECT email, phone FROM users WHERE id = $1', [profile.user_id]);
    const user = userResult.rows[0];

    // Insert log
    await pool.query(
      'INSERT INTO ngo_verification_logs (charity_id, admin_id, action, remarks) VALUES ($1, $2, $3, $4)',
      [charityId, adminId, action, rejection_reason || null]
    );

    // Dispatch Email & SMS Alerts (non-blocking)
    if (user) {
      dispatchVerificationAlert({
        email: user.email,
        phone: user.phone,
        orgName: profile.org_name,
        decision: action,
        rejectionReason: rejection_reason,
        score: profile.integrity_score
      }).catch(err => console.error('Alert background dispatch error:', err));
    }

    res.status(200).json({ message: `NGO successfully ${action}`, profile });
  } catch (error) {
    console.error('Error reviewing NGO:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
