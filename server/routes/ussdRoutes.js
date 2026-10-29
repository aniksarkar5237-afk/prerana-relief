import express from 'express';
import { handleUssdWebhook } from '../controllers/ussdController.js';

const router = express.Router();

/**
 * USSD Webhook Route
 * Accepts POST requests from telecom aggregators (Africa's Talking, Exotel, Twilio)
 * Payload fields:
 * - phoneNumber / msisdn
 * - text / input
 * - sessionId
 */
router.post('/', handleUssdWebhook);
router.get('/', handleUssdWebhook); // For developer testing / health probes

export default router;
