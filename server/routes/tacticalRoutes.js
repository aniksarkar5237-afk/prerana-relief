import express from 'express';
import { getTacticalOverview, dispatchBoat } from '../controllers/tacticalController.js';

const router = express.Router();

// GET /api/tactical/overview - Aggregated tactical triage overview with Dark Zone detection
router.get('/overview', getTacticalOverview);

// POST /api/tactical/dispatch-boat - Dispatch rescue/supply boat and update distress pings
router.post('/dispatch-boat', dispatchBoat);

export default router;
