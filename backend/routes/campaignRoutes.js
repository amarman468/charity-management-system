import express from 'express';
import {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  closeCampaign
} from '../controllers/campaignController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCampaigns);
router.get('/:id', getCampaign);
router.post('/', authenticate, authorize('admin'), createCampaign);
router.put('/:id', authenticate, authorize('admin'), updateCampaign);
router.delete('/:id', authenticate, authorize('admin'), deleteCampaign);
router.patch('/:id/close', authenticate, authorize('admin'), closeCampaign);

export default router;
