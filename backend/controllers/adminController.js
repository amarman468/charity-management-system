// Controller methods used specifically by admin routes.
// These perform common admin tasks: manage users, campaigns, donations and dashboard stats.
import User from '../models/User.js';
import Campaign from '../models/Campaign.js';
import Donation from '../models/Donation.js';

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Create a campaign (admin only)
export const createCampaign = async (req, res) => {
  try {
    const { title, description, targetAmount, startDate, endDate, image, type } = req.body;
    const campaign = await Campaign.create({
      title,
      description,
      targetAmount,
      startDate,
      endDate,
      image: image || '',
      type: type || 'general',
      createdBy: req.user.userId
    });

    res.status(201).json({ success: true, campaign });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create campaign' });
  }
};

// Update campaign (admin only)
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findByIdAndUpdate(id, req.body, { new: true });
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ success: true, campaign });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update campaign' });
  }
};

// Delete campaign (admin only)
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findByIdAndDelete(id);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
    res.json({ success: true, message: 'Campaign deleted' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete campaign' });
  }
};

// Get all donations (admin only)
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find({}).populate('donor', 'name email').populate('campaign', 'title');
    const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    res.json({ success: true, donations, total });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch donations' });
  }
};

// Admin-only: list admin registration requests awaiting approval
export const getAdminRequests = async (req, res) => {
  try {
    const requests = await User.find({ role: 'admin', isApproved: false }).select('-password');
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin requests' });
  }
};

// Approve an admin registration request
export const approveAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user || user.role !== 'admin') return res.status(404).json({ message: 'Admin request not found' });

    user.isApproved = true;
    user.isActive = true;
    await user.save();

    res.json({ success: true, message: 'Admin approved', user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to approve admin' });
  }
};

// Reject an admin request (delete the user)
export const rejectAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'Admin request not found' });

    res.json({ success: true, message: 'Admin request rejected and removed' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to reject admin' });
  }
};

// Admin dashboard stats (admin only)
export const getAdminStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const campaignsCount = await Campaign.countDocuments();
    const donations = await Donation.find({});
    const totalDonations = donations.reduce((s, d) => s + (d.amount || 0), 0);

    res.json({
      success: true,
      stats: {
        usersCount,
        campaignsCount,
        donationsCount: donations.length,
        totalDonations
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};

export default {
  getAllUsers,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getAllDonations,
  getAdminStats
};
