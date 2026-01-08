import express from 'express';
import {
  getTasks,
  getTask,
  createTask,
  updateTaskStatus
} from '../controllers/volunteerController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/tasks', authenticate, getTasks);
router.get('/tasks/:id', authenticate, getTask);
router.post('/tasks', authenticate, authorize('admin', 'staff'), createTask);
router.patch('/tasks/:id/status', authenticate, updateTaskStatus);

export default router;
