const Project = require('../models/Project');

const createProject = async (req, res) => {
  try {
    const { projectId, title, description, status } = req.body;
    const project = await Project.create({
      projectId,
      title,
      description,
      owner: req.user._id,
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        _id: project._id,
        projectId: project.projectId,
        title: project.title,
        status: project.status,
        createdAt: project.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const { status, owner } = req.query;
    let query = {};
    if (status) query.status = status;
    
    // If owner is passed as a name, we'd need to lookup the user. Let's assume it's filtering.
    // To filter by owner name, we populate and filter or just match if it's owner ID.
    // For simplicity, let's assume if 'owner' is passed, we fetch all and filter or populate.
    let projects = await Project.find(query).populate('owner', 'name');

    if (owner) {
      projects = projects.filter(p => p.owner && p.owner.name === owner);
    }

    res.json({
      success: true,
      message: 'Projects fetched successfully',
      data: projects.map(p => ({
        _id: p._id,
        projectId: p.projectId,
        title: p.title,
        status: p.status
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name').populate('members', 'name');
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    res.json({
      success: true,
      message: 'Project fetched successfully',
      data: {
        _id: project._id,
        projectId: project.projectId,
        title: project.title,
        description: project.description,
        owner: project.owner || {},
        members: project.members || [],
        status: project.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: {
        _id: project._id,
        projectId: project.projectId,
        status: project.status,
        updatedAt: project.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject };
