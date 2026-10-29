import express from 'express';
import { getCharityProfile, getAllCharities, applyForVerification } from '../controllers/charityController.js';
import { verifyToken, requireRoles } from '../middleware/authMiddleware.js';
import { uploadVerificationDocs } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllCharities);
router.get('/profile', verifyToken, requireRoles('charity'), getCharityProfile);

router.post('/apply', verifyToken, requireRoles('charity'), uploadVerificationDocs.fields([
  { name: 'twelve_a', maxCount: 1 },
  { name: 'eighty_g', maxCount: 1 },
  { name: 'fcra', maxCount: 1 },
  { name: 'audit_report', maxCount: 1 },
  { name: 'project_proofs_0', maxCount: 5 },
  { name: 'project_proofs_1', maxCount: 5 }
]), applyForVerification);

export default router;
