import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';
import Notification from '../models/Notification.js';

const simulatePayment = (paymentMethod, amount) => {
  const success = Math.random() > 0.05;
  
  if (success) {
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    return { success: true, transactionId };
  } else {
    return { success: false, message: 'Payment failed. Please try again.' };
  }
};

export const createDonation = async (req, res) => {
  try {
    const { campaignId, amount, paymentMethod, paymentDetails } = req.body;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    const paymentResult = simulatePayment(paymentMethod, amount);

    if (!paymentResult.success) {
      const donation = await Donation.create({
        donor: req.user.userId,
        campaign: campaignId,
        amount,
        paymentMethod,
        transactionId: `FAILED${Date.now()}`,
        status: 'failed',
        paymentDetails
      });

      return res.status(400).json({
        success: false,
        message: paymentResult.message,
        donation
      });
    }

    const donation = await Donation.create({
      donor: req.user.userId,
      campaign: campaignId,
      amount,
      paymentMethod,
      transactionId: paymentResult.transactionId,
      status: 'completed',
      paymentDetails
    });

    campaign.currentAmount += amount;
    await campaign.save();

    await Notification.create({
      user: req.user.userId,
      type: 'email',
      title: 'Donation Successful',
      message: `Thank you for your donation of ${amount} BDT to ${campaign.title}. Your transaction ID is ${paymentResult.transactionId}.`,
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
