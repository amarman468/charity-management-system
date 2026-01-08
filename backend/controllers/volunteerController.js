import VolunteerTask from '../models/VolunteerTask.js';
import Notification from '../models/Notification.js';

export const getTasks = async (req, res) => {
  try {
    let filter = {};
    
    if (req.user.role === 'volunteer') {
      filter.volunteer = req.user.userId;
    }

    const tasks = await VolunteerTask.find(filter)
      .populate('volunteer', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  try {
    const task = await VolunteerTask.findById(req.params.id)
      .populate('volunteer', 'name email')
      .populate('assignedBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'volunteer' && task.volunteer._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const task = await VolunteerTask.create({
      ...req.body,
      assignedBy: req.user.userId
    });

    await Notification.create({
      user: req.body.volunteer,
      type: 'sms',
      title: 'New Task Assigned',
      message: `You have been assigned a new task: ${task.title}`,
      relatedEntity: {
        entityType: 'task',
        entityId: task._id
      }
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status, updateText } = req.body;
    const task = await VolunteerTask.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role === 'volunteer' && task.volunteer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    task.status = status;
    
    if (status === 'completed') {
      task.completedDate = new Date();
    }

    if (updateText) {
      task.updates.push({
        updateText,
        updateDate: new Date()
      });
    }

    await task.save();

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
