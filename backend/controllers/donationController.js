import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';
import Notification from '../models/Notification.js';

import { initiatePayment, verifyPayment } from '../services/paymentService.js';
import { sendDonationReceipt } from '../services/emailService.js';
import { sendDonationSMS } from '../services/smsService.js';

export const createDonation = async (req, res) => {
  try {
    const { campaignId, amount, paymentMethod, paymentDetails } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // 1. Initiate Payment
    const paymentInit = await initiatePayment({
      amount,
      method: paymentMethod,
      user: req.user,
      campaignId
    });

    if (!paymentInit.success) {
      return res.status(400).json({ success: false, message: 'Payment initiation failed' });
    }

    // 2. Verify Payment (Immediate verification for mock)
    const paymentVerification = await verifyPayment(paymentInit.transactionId);

    if (!paymentVerification.success || paymentVerification.status !== 'completed') {
      const donation = await Donation.create({
        donor: req.user.userId,
        campaign: campaignId,
        amount,
        paymentMethod,
        transactionId: paymentInit.transactionId || `FAILED${Date.now()}`,
        status: 'failed',
        paymentDetails
      });
      return res.status(400).json({ success: false, message: 'Payment failed' });
    }

    // 3. Create Successful Donation Record
    const donation = await Donation.create({
      donor: req.user.userId,
      campaign: campaignId,
      amount,
      paymentMethod,
      transactionId: paymentInit.transactionId,
      status: 'completed',
      paymentDetails,
      receiptGenerated: true
    });

    // 4. Update Campaign Amount
    campaign.currentAmount += Number(amount);
    await campaign.save();

    // 5. Send Notifications
    // We don't await these to not block the response
    const user = await User.findById(req.user.userId);
    sendDonationReceipt(donation, user).catch(console.error);
    sendDonationSMS(donation, user).catch(console.error);

    await Notification.create({
      user: req.user.userId,
      type: 'email',
      title: 'Donation Successful',
      message: `Thank you for your donation of ${amount} BDT to ${campaign.title}. Your transaction ID is ${paymentInit.transactionId}.`,
      relatedEntity: {
        entityType: 'donation',
        entityId: donation._id
      }
    });

    res.status(201).json({
      success: true,
      message: 'Donation successful',
      data: donation
    });
  } catch (error) {
    console.error('Donation Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getDonations = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'donor') {
      filter.donor = req.user.userId;
    }

    const donations = await Donation.find(filter)
      .populate('donor', 'name email')
      .populate('campaign', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      data: donations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDonation = async (req, res) => {
  try {
    let donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email')
      .populate('campaign', 'title description');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    if (req.user.role === 'donor' && donation.donor._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      data: donation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
