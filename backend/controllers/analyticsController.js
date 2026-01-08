import Donation from '../models/Donation.js';
import Campaign from '../models/Campaign.js';
import Beneficiary from '../models/Beneficiary.js';
import VolunteerTask from '../models/VolunteerTask.js';
import User from '../models/User.js';

export const getDashboard = async (req, res) => {
  try {
    const totalDonations = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const campaignStats = await Campaign.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalTarget: { $sum: '$targetAmount' },
          totalCurrent: { $sum: '$currentAmount' }
        }
      }
    ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentDonations = await Donation.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    const beneficiaryStats = await Beneficiary.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const taskStats = await VolunteerTask.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const donationsByMethod = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$paymentMethod',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        donations: {
          total: totalDonations[0]?.total || 0,
          count: totalDonations[0]?.count || 0,
          recent: {
            total: recentDonations[0]?.total || 0,
            count: recentDonations[0]?.count || 0
          },
          byMethod: donationsByMethod
        },
        campaigns: campaignStats,
        beneficiaries: beneficiaryStats,
        tasks: taskStats,
        users: userStats
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    
    let startDate = new Date();
    if (period === 'weekly') {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const donations = await Donation.find({
      status: 'completed',
      createdAt: { $gte: startDate }
    })
      .populate('donor', 'name email')
      .populate('campaign', 'title')
      .sort({ createdAt: -1 });

    const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

    const beneficiaries = await Beneficiary.find({
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    const tasks = await VolunteerTask.find({
      createdAt: { $gte: startDate }
    })
      .populate('volunteer', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      period,
      startDate,
      data: {
        donations: {
          total: totalDonations,
          count: donations.length,
          list: donations
        },
        beneficiaries: {
          count: beneficiaries.length,
          list: beneficiaries
        },
        tasks: {
          count: tasks.length,
          list: tasks
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
