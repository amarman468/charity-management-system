// Admin routes: grouped endpoints that are admin-only
import express from 'express';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
  getAllUsers,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getAllDonations,
  getAdminStats,
  getAdminRequests,
  approveAdmin,
  rejectAdmin
} from '../controllers/adminController.js';

const router = express.Router();

// Get all users (admin only)
router.get('/users', adminOnly, getAllUsers);

// Campaign management (admin only)
router.post('/campaigns', adminOnly, createCampaign);
router.put('/campaigns/:id', adminOnly, updateCampaign);
router.delete('/campaigns/:id', adminOnly, deleteCampaign);

// Donations list and total (admin only)
router.get('/donations', adminOnly, getAllDonations);

// Dashboard stats for admin panel
router.get('/dashboard', adminOnly, getAdminStats);

// Admin registration requests (approve/reject)
router.get('/admin-requests', adminOnly, getAdminRequests);
router.post('/admin-requests/:id/approve', adminOnly, approveAdmin);
router.delete('/admin-requests/:id', adminOnly, rejectAdmin);

export default router;
