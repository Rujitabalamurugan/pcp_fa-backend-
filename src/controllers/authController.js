// Authentication controller: register, login, getMe
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const JWT_EXPIRES_IN = '24h';

// Helper to generate a unique userId
async function generateUserId() {
  const count = await User.countDocuments();
  return `USR${2001 + count}`;
}

// POST /auth/register
async function register(req, res) {
  try {
    const { name, email, password, role, department } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, password, role'
      });
    }

    // Validate role
    const validRoles = ['admin', 'manager', 'developer', 'tester'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
      });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Generate userId
    const userId = await generateUserId();

    // Create user (password hashing handled by pre-save hook)
    const user = await User.create({
      userId,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
      department: department || 'General',
      status: 'active'
    });

    // Response: data contains flat user fields (no token, no nested user)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user has a password (synced users may not)
    if (!user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please register first.'
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, userId: user.userId, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Response: token at top level, data contains flat user fields
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// GET /auth/me
async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Authenticated user fetched successfully',
      data: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { register, login, getMe };
