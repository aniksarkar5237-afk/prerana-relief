import express from 'express';
import { getPendingNGOs, reviewNGO } from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/pending-ngos', verifyToken, isAdmin, getPendingNGOs);
router.patch('/review-ngo/:id', verifyToken, isAdmin, reviewNGO);

export default router;
