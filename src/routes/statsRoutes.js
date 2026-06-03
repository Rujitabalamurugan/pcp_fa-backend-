// GET /stats and GET /health route definitions
const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');
const { authenticate, authorize } = require('../middleware/auth');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');

// Stats/analytics require authentication + admin/manager role
router.get('/stats', authenticate, authorize('admin', 'manager'), getStats);

// Health endpoint is public (no auth needed for monitoring)
router.get('/health', async (req, res) => {
  try {
    const issueCount = await Issue.countDocuments();
    const userCount = await User.countDocuments();
    const projectCount = await Project.countDocuments();
    const commentCount = await Comment.countDocuments();
    const activityCount = await ActivityLog.countDocuments();
    const total = issueCount + userCount + projectCount + commentCount + activityCount;

    res.status(200).json({
      success: true,
      message: 'Database connected successfully',
      data: {
        database: 'connected',
        documentCount: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: {
        database: 'disconnected',
        documentCount: 0
      }
    });
  }
});

module.exports = router;