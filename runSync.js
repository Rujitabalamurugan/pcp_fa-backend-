require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Issue = require('./src/models/Issue');
const Comment = require('./src/models/Comment');
const ActivityLog = require('./src/models/ActivityLog');

const {
  sanitizeUser,
  sanitizeProject,
  sanitizeIssue,
  sanitizeComment,
  sanitizeActivityLog
} = require('./src/utils/sanitize');

const runSync = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Fetching token from public endpoint...');
    const API_BASE_URL = 'https://t4e-testserver.onrender.com/api';
    const authResponse = await axios.post(`${API_BASE_URL}/public/token`, {
      studentId: process.env.STUDENT_ID,
      set: process.env.SET,
      password: process.env.PASSWORD
    });
    
    const token = authResponse.data.token;
    const dataUrl = authResponse.data.dataUrl;
    console.log('Got token:', token ? 'Yes' : 'No');
    console.log('Data URL:', dataUrl);

    console.log('Fetching dataset...');
    const datasetResponse = await axios.get(`${API_BASE_URL}${dataUrl}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const dataset = datasetResponse.data.data || datasetResponse.data;
    const users = dataset.users || [];
    const projects = dataset.projects || [];
    const issues = dataset.issues || [];
    const comments = dataset.comments || [];
    const activities = dataset.activities_log || [];

    let totalFetched = users.length + projects.length + issues.length + comments.length + activities.length;
    let inserted = 0;
    let duplicates = 0;
    let rejected = 0;

    console.log(`Fetched ${totalFetched} items in total. Processing...`);

    for (const item of users) {
      const clean = sanitizeUser(item);
      if (!clean) { rejected++; continue; }
      const exists = await User.findOne({ userId: clean.userId });
      if (exists) { duplicates++; continue; }
      await User.create(clean);
      inserted++;
    }

    for (const item of projects) {
      const clean = sanitizeProject(item);
      if (!clean) { rejected++; continue; }
      const exists = await Project.findOne({ projectId: clean.projectId });
      if (exists) { duplicates++; continue; }
      await Project.create(clean);
      inserted++;
    }

    for (const item of issues) {
      const clean = sanitizeIssue(item);
      if (!clean) { rejected++; continue; }
      const exists = await Issue.findOne({ issueId: clean.issueId });
      if (exists) { duplicates++; continue; }
      await Issue.create(clean);
      inserted++;
    }

    for (const item of comments) {
      const clean = sanitizeComment(item);
      if (!clean) { rejected++; continue; }
      const exists = await Comment.findOne({ commentId: clean.commentId });
      if (exists) { duplicates++; continue; }
      await Comment.create(clean);
      inserted++;
    }

    for (const item of activities) {
      const clean = sanitizeActivityLog(item);
      if (!clean) { rejected++; continue; }
      const exists = await ActivityLog.findOne({ logId: clean.logId });
      if (exists) { duplicates++; continue; }
      await ActivityLog.create(clean);
      inserted++;
    }

    console.log(`Sync complete! Inserted: ${inserted}, Duplicates: ${duplicates}, Rejected: ${rejected}`);
    process.exit(0);
  } catch (error) {
    console.error('Error during sync:', error.response?.data || error.message);
    process.exit(1);
  }
};

runSync();
