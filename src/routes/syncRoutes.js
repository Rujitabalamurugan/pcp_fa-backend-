// POST /sync route definition — requires auth (admin/manager only)
const express = require('express');
const router = express.Router();
const { syncData } = require('../controllers/syncController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, authorize('admin', 'manager'), syncData);

module.exports = router;