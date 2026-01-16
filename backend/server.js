import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import donationRoutes from './routes/donationRoutes.js';
import volunteerRoutes from './routes/volunteerRoutes.js';
import beneficiaryRoutes from './routes/beneficiaryRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { initScheduler } from './services/schedulerService.js';

dotenv.config();

// diagnostic hooks to catch why the process might exit prematurely
process.on('uncaughtException', (err) => {
  console.error('⚠️ uncaughtException:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('⚠️ unhandledRejection:', reason);
});
process.on('beforeExit', (code) => {
  console.log('ℹ️ process beforeExit, code=', code);
});
process.on('exit', (code) => {
  console.log('ℹ️ process exit, code=', code);
});

const app = express();

connectDB();

// Build CORS origin - handle both full URLs and hostnames from Render
const getAllowedOrigins = () => {
  const frontendUrl = process.env.FRONTEND_URL;
  const origins = ['http://localhost:5173'];

  if (frontendUrl) {
    // Add both with and without protocol in case Render sends just hostname
    if (frontendUrl.startsWith('http')) {
      origins.push(frontendUrl);
    } else {
      origins.push(`https://${frontendUrl}`);
    }
  }

  console.log('Allowed CORS origins:', origins);
  return origins;
};

app.use(cors({
  origin: getAllowedOrigins(),
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'As-Shawkani Foundation Charity Management System API',
    version: '1.0.0'
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Initialize Scheduler
  initScheduler();

  // Temporary keep-alive to prevent the process from exiting unexpectedly while debugging
  // Remove this once the root cause is identified
  setInterval(() => {
    // keep alive
  }, 1e6);
});
