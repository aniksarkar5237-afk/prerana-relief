import express from 'express';
import { handleIncomingCall, handleGatherResponse } from '../controllers/ivrsController.js';

const router = express.Router();

/**
 * IVRS Automated Voice Endpoints
 * 
 * POST /api/ivrs/incoming - Initial call webhook, plays regional voice prompts (Bengali, Hindi, English)
 * POST /api/ivrs/gather   - DTMF callback when caller presses '1', '2', or '3' on keypad
 */
router.post('/incoming', handleIncomingCall);
router.get('/incoming', handleIncomingCall); // For browser/developer audio checks

router.post('/gather', handleGatherResponse);
router.get('/gather', handleGatherResponse);

export default router;
