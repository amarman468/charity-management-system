import Beneficiary from '../models/Beneficiary.js';
import Notification from '../models/Notification.js';

export const getBeneficiaries = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const beneficiaries = await Beneficiary.find(filter)
      .populate('reviewedBy', 'name')
      .populate('distributedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: beneficiaries.length,
      data: beneficiaries
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findById(req.params.id)
      .populate('reviewedBy', 'name email')
      .populate('distributedBy', 'name email');

    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

    res.json({
      success: true,
      data: beneficiary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: beneficiary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewBeneficiary = async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    const beneficiary = await Beneficiary.findById(req.params.id);

    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

    beneficiary.status = status;
    beneficiary.reviewedBy = req.user.userId;
    beneficiary.reviewDate = new Date();
    beneficiary.reviewNotes = reviewNotes;

    await beneficiary.save();

    res.json({
      success: true,
      data: beneficiary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const distributeAid = async (req, res) => {
  try {
    const { aidType, aidAmount, aidDescription } = req.body;
    const beneficiary = await Beneficiary.findById(req.params.id);

    if (!beneficiary) {
      return res.status(404).json({ message: 'Beneficiary not found' });
    }

    if (beneficiary.status !== 'approved') {
      return res.status(400).json({ message: 'Beneficiary must be approved before aid distribution' });
    }

    beneficiary.status = 'aid-distributed';
    beneficiary.aidType = aidType;
    beneficiary.aidAmount = aidAmount;
    beneficiary.aidDescription = aidDescription;
    beneficiary.distributionDate = new Date();
    beneficiary.distributedBy = req.user.userId;

    await beneficiary.save();

    res.json({
      success: true,
      data: beneficiary
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
