// Mongoose schema/model for activity logs
const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  logId: { type: String, required: true, unique: true },
  issueId: { type: String, required: true },
  userId: { type: String, required: true },
  action: {
    type: String,
    required: true,
    enum: ['created', 'assigned', 'status_changed', 'resolved', 'closed']
  },
  previousStatus: { type: String, default: null },
  newStatus: { type: String, default: null },
  timestamp: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
