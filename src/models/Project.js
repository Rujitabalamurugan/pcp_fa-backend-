// Mongoose schema/model for projects
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  projectId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, default: null },
  description: { type: String, default: null },
  owner: { type: String, default: null },
  members: { type: [String], default: [] },
  status: {
    type: String,
    required: true,
    enum: ['active', 'completed', 'archived']
  },
  startDate: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
