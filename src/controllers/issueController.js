// CRUD handlers for issues (getAll with pagination, getById, create, update, remove, search)
const Issue = require('../models/Issue');

// GET /issues - with optional filters and pagination
async function getAll(req, res) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.severity) filter.severity = req.query.severity;
    if (req.query.projectId) filter.projectId = req.query.projectId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Issue.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);
    const issues = await Issue.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      message: 'Data fetched successfully',
      page,
      limit,
      total,
      totalPages,
      data: issues
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// GET /issues/search?q=keyword
async function search(req, res) {
  try {
    const q = req.query.q || '';
    if (!q.trim()) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const total = await Issue.countDocuments();
      const totalPages = Math.ceil(total / limit);
      const all = await Issue.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
      return res.status(200).json({
        success: true,
        message: 'Data fetched successfully',
        page,
        limit,
        total,
        totalPages,
        data: all
      });
    }

    const regex = new RegExp(q.trim(), 'i');
    const searchFilter = {
      $or: [
        { issueId: regex },
        { title: regex },
        { projectId: regex },
        { assignedTo: regex },
        { reportedBy: regex },
        { priority: regex },
        { severity: regex },
        { status: regex }
      ]
    };

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Issue.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);
    const issues = await Issue.find(searchFilter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    return res.status(200).json({
      success: true,
      message: 'Data fetched successfully',
      page,
      limit,
      total,
      totalPages,
      data: issues
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// GET /issues/:id
async function getById(req, res) {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Issue fetched successfully',
      data: issue
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// POST /issues
async function create(req, res) {
  try {
    const { issueId, title, projectId, priority, severity, status } = req.body;

    // Validate required fields
    if (!issueId || !title || !projectId || !priority || !severity || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: issueId, title, projectId, priority, severity, status'
      });
    }

    const issue = await Issue.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Issue created successfully',
      data: issue
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Duplicate issueId' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
}

// PUT /issues/:id
async function update(req, res) {
  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Issue updated successfully',
      data: issue
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

// DELETE /issues/:id
async function remove(req, res) {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Issue deleted successfully',
      data: issue
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getAll, getById, create, update, remove, search };
