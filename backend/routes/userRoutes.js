import express from 'express';
import {
  getUsers,
  getUser,
  getUserActivity,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('admin'), getUsers);
// activity endpoint must be defined before the generic :id route
router.get('/:id/activity', authenticate, authorize('admin'), getUserActivity);
router.get('/:id', authenticate, authorize('admin'), getUser);
router.put('/:id', authenticate, authorize('admin'), updateUser);
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;
