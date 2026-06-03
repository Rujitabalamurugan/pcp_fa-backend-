// Mongoose schema/model for comments/activity logs
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  commentId: { type: String, required: true, unique: true },
  issueId: { type: String, required: true },
  userId: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
