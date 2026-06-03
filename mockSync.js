require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Project = require('./src/models/Project');
const Issue = require('./src/models/Issue');
const Comment = require('./src/models/Comment');

const runMockSync = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Wipe old mock data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Issue.deleteMany({});
    await Comment.deleteMany({});

    const mockUsers = [
      { userId: 'admin1', name: 'Admin User', email: 'admin@t4e.com', role: 'admin', password: 'password123', department: 'IT' },
      { userId: 'dev1', name: 'John Developer', email: 'john@t4e.com', role: 'developer', password: 'password123', department: 'Engineering' },
      { userId: 'tester1', name: 'Jane Tester', email: 'jane@t4e.com', role: 'tester', password: 'password123', department: 'QA' }
    ];

    const userMap = {};
    for (const item of mockUsers) {
      const created = await User.create(item);
      userMap[item.role] = created._id;
    }

    const mockProjects = [
      { projectId: 'PRJ-01', title: 'Frontend Redesign', status: 'active', owner: 'admin1' },
      { projectId: 'PRJ-02', title: 'Backend API', status: 'active', owner: 'admin1' },
      { projectId: 'PRJ-03', title: 'Legacy Cleanup', status: 'completed', owner: 'dev1' }
    ];

    const projMap = {};
    for (const item of mockProjects) {
      const created = await Project.create(item);
      projMap[item.projectId] = created._id;
    }

    const mockIssues = [
      { issueId: 'ISS-001', title: 'Login page crash', priority: 'high', severity: 'critical', status: 'open', projectId: 'PRJ-01' },
      { issueId: 'ISS-002', title: 'Button unresponsive', priority: 'medium', severity: 'major', status: 'in-progress', projectId: 'PRJ-01', assignedTo: 'dev1' },
      { issueId: 'ISS-003', title: 'Typo in header', priority: 'low', severity: 'minor', status: 'resolved', projectId: 'PRJ-02', assignedTo: 'dev1' },
      { issueId: 'ISS-004', title: 'Data not syncing', priority: 'critical', severity: 'critical', status: 'open', projectId: 'PRJ-02' },
      { issueId: 'ISS-005', title: 'Profile picture missing', priority: 'low', severity: 'minor', status: 'closed', projectId: 'PRJ-03' }
    ];

    for (const item of mockIssues) {
      await Issue.create(item);
    }

    console.log(`Mock Sync complete! Database successfully populated.`);
    process.exit(0);
  } catch (error) {
    console.error('Error during mock sync:', error);
    process.exit(1);
  }
};

runMockSync();
