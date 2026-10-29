import pool from '../config/db.js';
import { parseDistressMessage } from '../utils/aiDistressParser.js';

export const submitDistressAlert = async (req, res) => {
  try {
    const { raw_message, district, state, lat, lng, contact_number, ngo_vpa } = req.body;
    
    // Parse the unstructured text using our AI utility
    const parsed = parseDistressMessage(raw_message, district, state);
    
    let disaster_zone_id = null;
    let matchedZoneTitle = null;

    // Spatial Verification Check if lat/lng are provided
    if (lat && lng) {
      const spatialQuery = `
        SELECT id, title 
        FROM disaster_zones 
        WHERE is_active = true 
          AND ST_DWithin(boundary_geom::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 50000) 
        LIMIT 1;
      `;
      const zoneMatch = await pool.query(spatialQuery, [lng, lat]); // PostGIS uses Longitude(X), Latitude(Y)
      if (zoneMatch.rows.length > 0) {
        disaster_zone_id = zoneMatch.rows[0].id;
        matchedZoneTitle = zoneMatch.rows[0].title;
      }
    }

    const verification_status = disaster_zone_id ? 'verified_on_ground' : 'pending_review';

    // Insert into emergency_aid_requests
    const insertQuery = `
      INSERT INTO emergency_aid_requests 
        (disaster_zone_id, charity_id, title, target_amount, supplies_needed, ngo_vpa, lat, lng, verification_status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *;
    `;
    
    const charityId = req.user && req.user.id ? req.user.id : null; 
    
    const newRequest = await pool.query(insertQuery, [
      disaster_zone_id,
      charityId,
      parsed.summary,
      parsed.estimated_funds_needed,
      JSON.stringify(parsed.items_needed),
      ngo_vpa || 'relief@upi',
      lat,
      lng,
      verification_status
    ]);

    res.status(201).json({
      message: "Distress alert ingested and structured successfully",
      matched_zone: matchedZoneTitle,
      parsed_data: parsed,
      request_record: newRequest.rows[0]
    });

  } catch (error) {
    console.error('Error in submitDistressAlert:', error);
    res.status(500).json({ error: 'Internal server error during ingestion' });
  }
};

export const matchSuppliesToDonors = async (req, res) => {
  try {
    const { id } = req.params;
    
    const reqData = await pool.query(`SELECT supplies_needed, title FROM emergency_aid_requests WHERE id = $1`, [id]);
    if (reqData.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    // Mock potential donor matches
    const potentialDonors = [
      { id: 101, name: 'Anik Sarkar', preference_match: 'Medical Supplies', reachout_score: 95 },
      { id: 102, name: 'Corporate Care CSR', preference_match: 'Shelter Tarps', reachout_score: 88 }
    ];

    res.status(200).json({
      request_id: id,
      supplies_needed: reqData.rows[0].supplies_needed,
      potential_matches: potentialDonors
    });

  } catch (error) {
    console.error('Error in matchSuppliesToDonors:', error);
    res.status(500).json({ error: 'Failed to match donors' });
  }
};
