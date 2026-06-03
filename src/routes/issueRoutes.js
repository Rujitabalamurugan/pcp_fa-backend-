// Express router: GET/POST/PUT/DELETE /issues, GET /issues/search
// RBAC: admin/manager can create/assign/change priority; developer can update assigned; tester can report
const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { authenticate, authorize } = require('../middleware/auth');

// All issue routes require authentication
router.use(authenticate);

// Search must come before /:id to avoid Express treating "search" as an id
router.get('/search', issueController.search);
router.get('/', issueController.getAll);
router.get('/:id', issueController.getById);

// Only admin/manager can create issues and assign them
router.post('/', authorize('admin', 'manager', 'tester'), issueController.create);

// admin/manager can update anything; developer/tester can update specific fields
router.put('/:id', authorize('admin', 'manager', 'developer', 'tester'), issueController.update);

// Only admin/manager can delete issues
router.delete('/:id', authorize('admin', 'manager'), issueController.remove);

module.exports = router;
