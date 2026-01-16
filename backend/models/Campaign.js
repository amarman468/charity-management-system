import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a campaign title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a campaign description']
  },
  type: {
    type: String,
    enum: ['general', 'zakat', 'sadaqah', 'disaster_relief', 'orphan_sponsorship'],
    default: 'general',
    required: true
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please provide a target amount'],
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'completed'],
    default: 'active'
  },
  image: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', campaignSchema);

export default Campaign;
