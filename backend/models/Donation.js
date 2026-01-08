import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Please provide donation amount'],
    min: 1
  },
  paymentMethod: {
    type: String,
    enum: ['bKash', 'Nagad', 'Bank', 'Card'],
    required: true
  },
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  receiptGenerated: {
    type: Boolean,
    default: false
  },
  paymentDetails: {
    phoneNumber: String,
    accountNumber: String,
    cardLastFour: String
  }
}, {
  timestamps: true
});

const Donation = mongoose.models.Donation || mongoose.model('Donation', donationSchema);

export default Donation;
