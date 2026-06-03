// Mongoose schema/model for issues/bugs
const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  issueId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  projectId: { type: String, required: true },
  assignedTo: { type: String, default: null },
  reportedBy: { type: String, default: null },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  severity: {
    type: String,
    required: true,
    enum: ['minor', 'major', 'critical']
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'in-progress', 'testing', 'resolved', 'closed']
  }
}, { timestamps: true });

module.exports = mongoose.model('Issue', IssueSchema);
