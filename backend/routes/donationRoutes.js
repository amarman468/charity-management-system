import express from 'express';
import {
  createDonation,
  getDonations,
  getDonation
} from '../controllers/donationController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('donor', 'admin'), createDonation);
router.get('/', authenticate, getDonations);
router.get('/:id', authenticate, getDonation);

export default router;
