import express from 'express';
import { submitDistressAlert, matchSuppliesToDonors } from '../controllers/intakeController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, requireRoles('charity', 'volunteer'), submitDistressAlert);
router.get('/requests/:id/matches', verifyToken, requireRoles('charity', 'volunteer'), matchSuppliesToDonors);

export default router;
