import express from 'express';
import {
  handleDispatchEvacuation,
  handleGetVillages,
  handleSOSPing,
} from '../controllers/evacuationController.js';

const router = express.Router();

// GET /api/disasters/evacuation/villages - List villages with safe zones and victim counts
router.get('/villages', handleGetVillages);

// POST /api/disasters/evacuation/dispatch - Dispatch evacuation alert SMS batch to victims
router.post('/dispatch', handleDispatchEvacuation);

// POST /api/disasters/evacuation/sos - Inbound SOS ping from victim
router.post('/sos', handleSOSPing);

export default router;
