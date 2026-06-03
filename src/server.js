// Calls dbConnect, then app.listen on process.env.PORT
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Import routes
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const syncRoutes = require('./routes/syncRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Connect MongoDB Atlas
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://naveen:naveensekhar@pcp-fa.ryugznl.mongodb.net/')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('Database connection failed:', err));

// Mount routes
app.use('/auth', authRoutes);
app.use('/issues', issueRoutes);
app.use('/sync', syncRoutes);
app.use('/', statsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));