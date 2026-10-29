import pool from '../config/db.js';

/**
 * Tactical Overview Controller
 * Queries all safe zones joined with their parent villages,
 * aggregates unresolved distress pings, computes Dark Zone flags,
 * and determines operational triage status (CRITICAL, DARK_ZONE, URGENT, STABLE).
 */
export async function getTacticalOverview(req, res) {
  try {
    const query = `
      SELECT 
        sz.id,
        sz.name,
        sz.latitude,
        sz.longitude,
        sz.elevation_meters,
        sz.capacity,
        sz.structure_type,
        sz.village_id,
        sz.created_at,
        v.name AS village_name,
        v.region_name,
        v.vulnerability_score,
        COUNT(sp.id) FILTER (WHERE sp.resolved = false)::int AS total_pings,
        COUNT(sp.id) FILTER (WHERE sp.resolved = false AND sp.need_category = 'FOOD')::int AS food_requests,
        COUNT(sp.id) FILTER (WHERE sp.resolved = false AND sp.need_category = 'MEDICINE')::int AS medicine_requests,
        COUNT(sp.id) FILTER (WHERE sp.resolved = false AND sp.need_category = 'RESCUE')::int AS rescue_requests,
        MAX(sp.timestamp) FILTER (WHERE sp.resolved = false) AS latest_ping_time,
        MAX(sp.timestamp) AS latest_recorded_ping_time
      FROM safe_zones sz
      JOIN villages v ON sz.village_id = v.id
      LEFT JOIN sos_pings sp ON sp.safe_zone_id = sz.id
      GROUP BY sz.id, v.id
      ORDER BY total_pings DESC, sz.name ASC;
    `;

    const result = await pool.query(query);
    const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000;
    const now = Date.now();

    const data = result.rows.map((row) => {
      const total_pings = parseInt(row.total_pings, 10) || 0;
      const food_requests = parseInt(row.food_requests, 10) || 0;
      const medicine_requests = parseInt(row.medicine_requests, 10) || 0;
      const rescue_requests = parseInt(row.rescue_requests, 10) || 0;
      const capacity = parseInt(row.capacity, 10) || 0;
      const latest_ping_time = row.latest_ping_time || null;
      const latest_recorded_ping_time = row.latest_recorded_ping_time || null;

      // Dark Zone Detection: total_pings === 0 AND capacity > 0 AND no pings recorded in past 12 hours
      const hasRecentPing = latest_recorded_ping_time
        ? (now - new Date(latest_recorded_ping_time).getTime()) < TWELVE_HOURS_MS
        : false;
      const isDarkZone = (total_pings === 0) && (capacity > 0) && !hasRecentPing;

      // Status triage hierarchy:
      // 1. CRITICAL: rescue requests present
      // 2. DARK_ZONE: high-capacity shelter completely silent (>12h)
      // 3. URGENT: any other unresolved distress requests
      // 4. STABLE: 0 unresolved pings and active telemetry
      let status = 'STABLE';
      if (rescue_requests > 0) {
        status = 'CRITICAL';
      } else if (isDarkZone) {
        status = 'DARK_ZONE';
      } else if (total_pings > 0) {
        status = 'URGENT';
      } else {
        status = 'STABLE';
      }

      return {
        id: row.id,
        name: row.name,
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        elevation_meters: Number(row.elevation_meters),
        capacity,
        structure_type: row.structure_type,
        village_id: row.village_id,
        village_name: row.village_name,
        region_name: row.region_name,
        vulnerability_score: Number(row.vulnerability_score || 0),
        total_pings,
        food_requests,
        medicine_requests,
        rescue_requests,
        latest_ping_time,
        is_dark_zone: isDarkZone,
        status
      };
    });

    return res.status(200).json({
      success: true,
      count: data.length,
      safeZones: data
    });
  } catch (error) {
    console.error('[Tactical Controller] Error getting tactical overview:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch tactical overview.',
      error: error.message
    });
  }
}

/**
 * Dispatch Boat Action Controller
 * Dispatches an emergency rescue/relief boat to a designated safe zone,
 * marks linked unresolved distress pings as 'in_progress', logs into boat_dispatches,
 * and returns coordinates and dispatch confirmation.
 */
export async function dispatchBoat(req, res) {
  try {
    const { safeZoneId, boatId, assignedSupplies = [] } = req.body;

    if (!safeZoneId || !boatId) {
      return res.status(400).json({
        success: false,
        message: 'safeZoneId and boatId are required fields.'
      });
    }

    // 1. Verify safe zone existence and retrieve target coordinates
    const safeZoneRes = await pool.query(
      `SELECT id, name, latitude, longitude, capacity, structure_type 
       FROM safe_zones 
       WHERE id = $1`,
      [safeZoneId]
    );

    if (safeZoneRes.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Safe zone with ID '${safeZoneId}' not found.`
      });
    }

    const safeZone = safeZoneRes.rows[0];

    // 2. Mark relevant unresolved sos_pings as in_progress
    const updatePingsRes = await pool.query(
      `UPDATE sos_pings 
       SET status = 'in_progress' 
       WHERE safe_zone_id = $1 AND resolved = false
       RETURNING id`,
      [safeZoneId]
    );

    // 3. Log dispatch event into boat_dispatches table
    const dispatchRes = await pool.query(
      `INSERT INTO boat_dispatches (safe_zone_id, boat_id, assigned_supplies, status)
       VALUES ($1, $2, $3, 'DISPATCHED')
       RETURNING id, created_at`,
      [safeZoneId, boatId, JSON.stringify(assignedSupplies)]
    );

    const dispatchRecord = dispatchRes.rows[0];

    return res.status(200).json({
      success: true,
      message: `Emergency rescue boat '${boatId}' dispatched to ${safeZone.name}.`,
      dispatch: {
        id: dispatchRecord.id,
        boatId,
        safeZoneId: safeZone.id,
        safeZoneName: safeZone.name,
        targetCoordinates: {
          latitude: Number(safeZone.latitude),
          longitude: Number(safeZone.longitude)
        },
        assignedSupplies,
        pingsUpdated: updatePingsRes.rowCount,
        timestamp: dispatchRecord.created_at || new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[Tactical Controller] Error dispatching boat:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to dispatch boat due to an internal server error.',
      error: error.message
    });
  }
}
