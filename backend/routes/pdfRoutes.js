import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { generateDonationReceipt, generateVolunteerCertificate } from '../utils/pdfGenerator.js';
import Donation from '../models/Donation.js';
import VolunteerTask from '../models/VolunteerTask.js';
import User from '../models/User.js';
import Campaign from '../models/Campaign.js';

const router = express.Router();

router.get('/receipt/:donationId', authenticate, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.donationId)
      .populate('donor', 'name email')
      .populate('campaign', 'title');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (req.user.role === 'donor' && donation.donor._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const pdfBuffer = await generateDonationReceipt(donation, donation.donor, donation.campaign);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${donation.transactionId}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/certificate/:taskId', authenticate, async (req, res) => {
  try {
    const task = await VolunteerTask.findById(req.params.taskId)
      .populate('volunteer', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'volunteer' && task.volunteer._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (task.status !== 'completed') {
      return res.status(400).json({ message: 'Task must be completed to generate certificate' });
    }

    const pdfBuffer = await generateVolunteerCertificate(task, task.volunteer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=certificate-${task._id}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
