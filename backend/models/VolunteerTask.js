import mongoose from 'mongoose';

const volunteerTaskSchema = new mongoose.Schema({
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a task description']
  },
  status: {
    type: String,
    enum: ['assigned', 'in-progress', 'completed'],
    default: 'assigned'
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  completedDate: {
    type: Date
  },
  updates: [{
    updateText: String,
    updateDate: {
      type: Date,
      default: Date.now
    }
  }],
  fieldPhotos: [{
    type: String // URL to photo
  }],
  certificateGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const VolunteerTask = mongoose.models.VolunteerTask || mongoose.model('VolunteerTask', volunteerTaskSchema);

export default VolunteerTask;
