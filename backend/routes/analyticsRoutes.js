import express from 'express';
import {
  getDashboard,
  getReports
} from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticate, authorize('admin'), getDashboard);
router.get('/reports', authenticate, authorize('admin', 'staff'), getReports);

export default router;
