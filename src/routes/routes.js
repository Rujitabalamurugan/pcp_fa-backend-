const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { getHealth } = require('../controllers/healthController');
const { syncData } = require('../controllers/syncController');
const { getUsers, getUserById } = require('../controllers/userController');
const { createProject, getProjects, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');
const { createIssue, getIssues, getIssueById, updateIssue, deleteIssue, assignIssue, updateIssueStatus } = require('../controllers/issueController');
const { createComment, getComments, getCommentById, deleteComment } = require('../controllers/commentController');
const { getIssueAnalytics, getProjectAnalytics, getDeveloperAnalytics } = require('../controllers/analyticsController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Auth Routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/auth/me', protect, getMe);

// Health & Sync
router.get('/health', getHealth);
router.post('/sync', protect, authorize('admin', 'manager'), syncData);

// Users
router.get('/users', getUsers);
router.get('/users/:id', getUserById);

// Projects
router.post('/projects', createProject);
router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.patch('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

// Issues
router.post('/issues', protect, createIssue);
router.get('/issues', getIssues);
router.get('/issues/:id', getIssueById);
router.patch('/issues/:id', protect, updateIssue);
router.delete('/issues/:id', protect, deleteIssue);
router.patch('/issues/:id/assign', protect, assignIssue);
router.patch('/issues/:id/status', protect, updateIssueStatus);

// Comments
router.post('/comments', protect, createComment);
router.get('/comments', getComments);
router.get('/comments/:id', getCommentById);
router.delete('/comments/:id', protect, deleteComment);

// Analytics
router.get('/analytics/issues', getIssueAnalytics);
router.get('/analytics/projects', getProjectAnalytics);
router.get('/analytics/developers', getDeveloperAnalytics);

module.exports = router;
