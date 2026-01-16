import User from '../models/User.js';

export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get activity for a specific user (admin access)
export const getUserActivity = async (req, res) => {
  try {
    const userId = req.params.id;

    // lazy import to avoid circular deps
    const Notification = (await import('../models/Notification.js')).default;
    const VolunteerTask = (await import('../models/VolunteerTask.js')).default;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(20);

    const tasksAssigned = await VolunteerTask.find({ assignedBy: userId })
      .populate('volunteer', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    const tasksForUser = await VolunteerTask.find({ volunteer: userId })
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(20);

    // combine and normalize activities
    let activities = [];

    notifications.forEach((n) => activities.push({
      type: 'notification',
      date: n.createdAt,
      payload: n
    }));

    tasksAssigned.forEach((t) => activities.push({
      type: 'task_assigned',
      date: t.createdAt,
      payload: t
    }));

    tasksForUser.forEach((t) => activities.push({
      type: 'task_for_user',
      date: t.createdAt,
      payload: t
    }));

    activities.sort((a, b) => b.date - a.date);
    activities = activities.slice(0, 20);

    res.json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
