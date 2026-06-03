const Issue = require('../models/Issue');
const Project = require('../models/Project');
const User = require('../models/User');

const getIssueAnalytics = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const openIssues = await Issue.countDocuments({ status: 'open' });
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const closedIssues = await Issue.countDocuments({ status: 'closed' });

    res.json({
      success: true,
      message: 'Issue analytics fetched successfully',
      data: {
        totalIssues,
        openIssues,
        resolvedIssues,
        closedIssues
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProjectAnalytics = async (req, res) => {
  try {
    const projects = await Project.find();
    
    // Using aggregation or loop
    const data = await Promise.all(projects.map(async (p) => {
      const issueCount = await Issue.countDocuments({ project: p._id });
      return {
        project: p.title,
        issueCount,
        status: p.status
      };
    }));

    res.json({
      success: true,
      message: 'Project analytics fetched successfully',
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDeveloperAnalytics = async (req, res) => {
  try {
    const developers = await User.find({ role: 'developer' });
    
    const data = await Promise.all(developers.map(async (dev) => {
      const resolvedIssues = await Issue.countDocuments({ assignedTo: dev._id, status: 'resolved' });
      return {
        developer: dev.name,
        resolvedIssues,
        averageResolutionTime: 4, // Placeholder for dynamic calc
        highestResolvedIssueCount: resolvedIssues // Placeholder
      };
    }));

    res.json({
      success: true,
      message: 'Developer analytics fetched successfully',
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getIssueAnalytics, getProjectAnalytics, getDeveloperAnalytics };
