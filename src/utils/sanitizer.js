const mongoose = require('mongoose');

const sanitizeIssue = (issue) => {
  if (!issue || !issue.title || !issue.issueId) {
    return null;
  }
  
  // Normalizing
  const priority = issue.priority ? issue.priority.toString().trim().toLowerCase() : '';
  const severity = issue.severity ? issue.severity.toString().trim().toLowerCase() : 'minor';
  const status = issue.status ? issue.status.toString().trim().toLowerCase() : '';

  // Validation Sets
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  const validSeverities = ['minor', 'major', 'critical'];
  const validStatuses = ['open', 'in-progress', 'testing', 'resolved', 'closed'];

  // Reject invalid priority values
  if (!validPriorities.includes(priority)) return null;
  
  // Reject invalid status values
  if (!validStatuses.includes(status)) return null;

  // Reject invalid dates if provided
  if (issue.createdAt && isNaN(Date.parse(issue.createdAt))) return null;
  if (issue.updatedAt && isNaN(Date.parse(issue.updatedAt))) return null;

  // Reject invalid object ID format for project
  if (issue.project && !mongoose.Types.ObjectId.isValid(issue.project)) return null;
  
  // Reject invalid object ID format for assigned user
  if (issue.assignedTo && !mongoose.Types.ObjectId.isValid(issue.assignedTo)) return null;

  return {
    ...issue,
    title: issue.title.toString().trim(),
    priority,
    severity: validSeverities.includes(severity) ? severity : 'minor',
    status
  };
};

module.exports = { sanitizeIssue };
