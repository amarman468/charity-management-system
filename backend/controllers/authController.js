import { sendWelcomeEmail } from '../services/emailService.js';
import User from '../models/User.js';

import jwt from 'jsonwebtoken';

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // If someone registers as an admin, mark their account as not active and not approved.
    // An existing admin must approve them via the admin panel before they can log in.
    const isAdminRequest = role === 'admin';

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'donor',
      phone,
      address,
      isActive: isAdminRequest ? false : true,
      isApproved: isAdminRequest ? false : true
    });

    // For admin registration requests we do NOT auto-login or issue a token.
    if (isAdminRequest) {
      return res.status(201).json({ success: true, message: 'Admin registration submitted and awaiting approval by an existing admin.' });
    }

    // Send Welcome Email
    sendWelcomeEmail(user).catch(console.error);

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // If this is an admin account and it's not yet approved, block login with a clear message
    if (user.role === 'admin' && user.isApproved === false) {
      return res.status(403).json({ message: 'Admin account is awaiting approval' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
