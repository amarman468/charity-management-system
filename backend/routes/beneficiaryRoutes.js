import express from 'express';
import {
  getBeneficiaries,
  getBeneficiary,
  createBeneficiary,
  reviewBeneficiary,
  distributeAid
} from '../controllers/beneficiaryController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin', 'staff'), getBeneficiaries);
router.get('/:id', authenticate, authorize('admin', 'staff'), getBeneficiary);
router.post('/', createBeneficiary);
router.patch('/:id/review', authenticate, authorize('admin', 'staff'), reviewBeneficiary);
router.patch('/:id/distribute', authenticate, authorize('admin', 'staff'), distributeAid);

export default router;
