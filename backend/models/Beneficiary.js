import mongoose from 'mongoose';

const beneficiarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide beneficiary name'],
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please provide address']
  },
  nid: {
    type: String,
    trim: true
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'aid-distributed'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewDate: {
    type: Date
  },
  reviewNotes: {
    type: String
  },
  aidType: {
    type: String,
    enum: ['financial', 'food', 'medical', 'education', 'other'],
    default: 'financial'
  },
  aidAmount: {
    type: Number,
    min: 0
  },
  aidDescription: {
    type: String
  },
  distributionDate: {
    type: Date
  },
  distributionProof: {
    type: String // URL to proof image
  },
  distributedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Beneficiary = mongoose.models.Beneficiary || mongoose.model('Beneficiary', beneficiarySchema);

export default Beneficiary;
