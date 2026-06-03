const mongoose = require('mongoose');

const getHealth = async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    // The prompt mentions "documentCount: 84", probably issues count.
    const Issue = require('../models/Issue');
    const count = isConnected ? await Issue.countDocuments() : 0;

    res.json({
      success: true,
      message: 'Database connected successfully',
      data: {
        database: isConnected ? 'connected' : 'disconnected',
        documentCount: count
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getHealth };
