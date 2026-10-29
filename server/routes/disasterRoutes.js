import express from 'express';
import { getActiveZones, getEmergencyRequests } from '../controllers/disasterController.js';

const router = express.Router();

router.get('/active-zones', getActiveZones);
router.get('/emergency-requests', getEmergencyRequests);

export default router;
