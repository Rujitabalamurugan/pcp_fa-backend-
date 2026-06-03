// GET /stats: computes totals, status counts, priority grouping
const Issue = require('../models/Issue');
const User = require('../models/User');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const ActivityLog = require('../models/ActivityLog');

async function getStats(req, res) {
  try {
    // Total counts
    const totalIssues = await Issue.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalActivities = await ActivityLog.countDocuments();

    // Issues by status
    const byStatus = await Issue.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Issues by priority
    const byPriority = await Issue.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Issues by severity
    const bySeverity = await Issue.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Issues by project
    const byProject = await Issue.aggregate([
      { $group: { _id: '$projectId', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Projects by status
    const projectsByStatus = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Users by role
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Convert aggregation arrays to objects for easier frontend consumption
    const statusCounts = {};
    byStatus.forEach(s => { statusCounts[s._id] = s.count; });

    const priorityCounts = {};
    byPriority.forEach(p => { priorityCounts[p._id] = p.count; });

    const severityCounts = {};
    bySeverity.forEach(s => { severityCounts[s._id] = s.count; });

    return res.status(200).json({
      success: true,
      message: 'Stats fetched successfully',
      data: {
        totalIssues,
        totalUsers,
        totalProjects,
        totalComments,
        totalActivities,
        byStatus: statusCounts,
        byPriority: priorityCounts,
        bySeverity: severityCounts,
        byProject,
        projectsByStatus,
        usersByRole
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getStats };