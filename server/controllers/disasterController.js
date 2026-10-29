import pool from '../config/db.js';

export const getActiveZones = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        title, 
        severity_level, 
        affected_district, 
        state, 
        is_active, 
        reported_at,
        ST_AsGeoJSON(boundary_geom)::json AS geojson 
       FROM disaster_zones 
       WHERE is_active = true`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching active zones:', error);
    res.status(500).json({ error: 'Failed to fetch active zones' });
  }
};

export const getEmergencyRequests = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        e.id, 
        e.title, 
        e.target_amount, 
        e.raised_amount, 
        e.supplies_needed, 
        e.ngo_vpa, 
        e.lat, 
        e.lng, 
        e.verification_status, 
        e.created_at,
        c.org_name AS charity_name
       FROM emergency_aid_requests e
       JOIN charity_profiles c ON e.charity_id = c.id
       WHERE e.verification_status = 'verified_on_ground'`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching emergency requests:', error);
    res.status(500).json({ error: 'Failed to fetch emergency requests' });
  }
};
