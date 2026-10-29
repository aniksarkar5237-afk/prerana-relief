import express from 'express';
import { createCampaign, listCampaigns, getCampaignById } from '../controllers/campaignController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, requireRoles('charity'), createCampaign);
router.get('/', listCampaigns);
router.get('/:id', getCampaignById);

export default router;
