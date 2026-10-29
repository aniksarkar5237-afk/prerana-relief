import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import authRoutes from './routes/authRoutes.js';
import charityRoutes from './routes/charityRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import disasterRoutes from './routes/disasterRoutes.js';
import intakeRoutes from './routes/intakeRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import evacuationRoutes from './routes/evacuationRoutes.js';
import ussdRoutes from './routes/ussdRoutes.js';
import ivrsRoutes from './routes/ivrsRoutes.js';
import tacticalRoutes from './routes/tacticalRoutes.js';
import { checkRiverGauges } from './services/cwcService.js';
import { dispatchEvacuationAlerts } from './services/evacuationService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/charities', charityRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/disasters', disasterRoutes);
app.use('/api/disasters/intake', intakeRoutes);
app.use('/api/disasters/evacuation', evacuationRoutes);
app.use('/api/ussd', ussdRoutes);
app.use('/api/ivrs', ivrsRoutes);
app.use('/api/tactical', tacticalRoutes);
app.use('/api/admin', adminRoutes);

// Evacuation alert callback handler with fallback
const evacuationCallback = typeof dispatchEvacuationAlerts === 'function'
  ? dispatchEvacuationAlerts
  : async (villageId) => {
      console.log(`[EVACUATION FALLBACK] Triggered evacuation for village: ${villageId}`);
    };

// Automated River Gauge Telemetry Scheduler (Every 10 minutes)
cron.schedule('*/10 * * * *', async () => {
  console.log('[CRON] Polling active river stations for flood danger levels...');
  try {
    await checkRiverGauges(evacuationCallback);
  } catch (error) {
    console.error('[CRON] Error during river gauge check:', error.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log('[CRON] River gauge monitoring scheduler active (Interval: 10 mins).');
});

