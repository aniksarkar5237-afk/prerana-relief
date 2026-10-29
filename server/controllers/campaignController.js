import pool from '../config/db.js';

export const createCampaign = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch charity profile and check verification status
    const profileResult = await pool.query('SELECT * FROM charity_profiles WHERE user_id = $1', [userId]);
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ message: 'Charity profile not found' });
    }
    
    const profile = profileResult.rows[0];
    if (profile.verification_status !== 'verified') {
      return res.status(403).json({ message: 'Only verified organizations can create campaigns' });
    }

    const { title, description, target_amount, category } = req.body;

    if (!title || !description || !target_amount || target_amount <= 0) {
      return res.status(400).json({ message: 'Invalid campaign details provided' });
    }

    const insertQuery = `
      INSERT INTO campaigns (charity_id, title, description, goal_amount, current_amount, category)
      VALUES ($1, $2, $3, $4, 0.00, $5)
      RETURNING *
    `;
    const newCampaignResult = await pool.query(insertQuery, [profile.id, title, description, target_amount, category || null]);

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign: newCampaignResult.rows[0]
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ message: 'Internal server error during campaign creation' });
  }
};

export const listCampaigns = async (req, res) => {
  try {
    const { category, limit = 10, offset = 0 } = req.query;
    let query = `
      SELECT c.*, p.org_name 
      FROM campaigns c
      JOIN charity_profiles p ON c.charity_id = p.id
      WHERE p.verification_status = 'verified'
    `;
    const queryParams = [];
    
    if (category) {
      queryParams.push(category);
      query += ` AND c.category = $${queryParams.length}`;
    }

    queryParams.push(limit);
    query += ` LIMIT $${queryParams.length}`;
    
    queryParams.push(offset);
    query += ` OFFSET $${queryParams.length}`;

    const campaignsResult = await pool.query(query, queryParams);
    res.status(200).json({ campaigns: campaignsResult.rows });
  } catch (error) {
    console.error('List campaigns error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT c.*, p.org_name, p.description as charity_description
      FROM campaigns c
      JOIN charity_profiles p ON c.charity_id = p.id
      WHERE c.id = $1 AND p.verification_status = 'verified'
    `;
    const campaignResult = await pool.query(query, [id]);
    
    if (campaignResult.rows.length === 0) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.status(200).json({ campaign: campaignResult.rows[0] });
  } catch (error) {
    console.error('Get campaign by id error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
