import {
  dispatchEvacuationAlerts,
  recordSOSPing,
  listVillagesSummary,
} from '../services/evacuationService.js';

export const handleDispatchEvacuation = async (req, res) => {
  try {
    const { villageId } = req.body;
    if (!villageId) {
      return res.status(400).json({ error: 'villageId is required in request body.' });
    }

    const result = await dispatchEvacuationAlerts(villageId);
    return res.status(200).json({
      message: 'Evacuation alerts dispatch executed successfully.',
      data: result,
    });
  } catch (error) {
    console.error('Error handling dispatch evacuation:', error);
    return res.status(500).json({ error: error.message || 'Failed to dispatch evacuation alerts' });
  }
};

export const handleGetVillages = async (req, res) => {
  try {
    const villages = await listVillagesSummary();
    return res.status(200).json(villages);
  } catch (error) {
    console.error('Error fetching villages summary:', error);
    return res.status(500).json({ error: 'Failed to retrieve villages summary' });
  }
};

export const handleSOSPing = async (req, res) => {
  try {
    const { victimPhone, needCategory } = req.body;
    if (!victimPhone || !needCategory) {
      return res.status(400).json({
        error: 'victimPhone and needCategory (FOOD, MEDICINE, RESCUE) are required.',
      });
    }

    const ping = await recordSOSPing({ victimPhone, needCategory });
    return res.status(201).json({
      message: 'SOS Ping recorded successfully and linked to predicted SafeZone.',
      ping,
    });
  } catch (error) {
    console.error('Error recording SOS Ping:', error);
    return res.status(500).json({ error: error.message || 'Failed to record SOS ping' });
  }
};
