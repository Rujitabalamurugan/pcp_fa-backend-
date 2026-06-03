const Comment = require('../models/Comment');

const createComment = async (req, res) => {
  try {
    const { commentId, message, issue } = req.body;
    const comment = await Comment.create({
      commentId,
      message,
      issue,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: {
        _id: comment._id,
        commentId: comment.commentId,
        message: comment.message,
        createdAt: comment.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json({
      success: true,
      message: 'Comments fetched successfully',
      data: comments.map(c => ({
        _id: c._id,
        commentId: c.commentId,
        message: c.message
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate('user', 'name').populate('issue', 'title');
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    res.json({
      success: true,
      message: 'Comment fetched successfully',
      data: {
        _id: comment._id,
        commentId: comment.commentId,
        message: comment.message,
        user: comment.user || {},
        issue: comment.issue || {}
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createComment, getComments, getCommentById, deleteComment };
