// Data cleaning helpers: trim strings, normalize enums, reject nulls/dupes

const VALID_USER_ROLES = ['admin', 'manager', 'developer', 'tester'];
const VALID_USER_STATUSES = ['active'];
const VALID_PROJECT_STATUSES = ['active', 'completed', 'archived'];
const VALID_ISSUE_STATUSES = ['open', 'in-progress', 'testing', 'resolved', 'closed'];
const VALID_ISSUE_PRIORITIES = ['low', 'medium', 'high', 'critical'];
const VALID_ISSUE_SEVERITIES = ['minor', 'major', 'critical'];
const VALID_ACTIVITY_ACTIONS = ['created', 'assigned', 'status_changed', 'resolved', 'closed'];

function sanitizeUser(record) {
  if (!record) return null;
  const { userId, name, email, role, department, status } = record;

  // Mandatory fields check
  if (!userId || !name || !email || !role || !department || !status) return null;
  if (typeof userId !== 'string' || userId.trim() === '') return null;
  if (typeof name !== 'string' || name.trim() === '') return null;
  if (typeof email !== 'string' || email.trim() === '') return null;
  if (typeof role !== 'string' || role.trim() === '') return null;
  if (typeof department !== 'string' || department.trim() === '') return null;
  if (typeof status !== 'string' || status.trim() === '') return null;

  const cleanRole = role.trim().toLowerCase();
  const cleanStatus = status.trim().toLowerCase();

  if (!VALID_USER_ROLES.includes(cleanRole)) return null;
  if (!VALID_USER_STATUSES.includes(cleanStatus)) return null;

  return {
    userId: userId.trim(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    role: cleanRole,
    department: department.trim(),
    status: cleanStatus
  };
}

function sanitizeProject(record) {
  if (!record) return null;
  const { projectId, title, status } = record;

  // Mandatory fields
  if (!projectId || !title || !status) return null;
  if (typeof projectId !== 'string' || projectId.trim() === '') return null;
  if (typeof title !== 'string' || title.trim() === '') return null;
  if (typeof status !== 'string' || status.trim() === '') return null;

  const cleanStatus = status.trim().toLowerCase();
  if (!VALID_PROJECT_STATUSES.includes(cleanStatus)) return null;

  return {
    projectId: projectId.trim(),
    title: title.trim(),
    category: record.category ? String(record.category).trim() : null,
    description: record.description ? String(record.description).trim() : null,
    owner: record.owner ? String(record.owner).trim() : null,
    members: Array.isArray(record.members) ? record.members : [],
    status: cleanStatus,
    startDate: record.startDate ? String(record.startDate).trim() : null
  };
}

function sanitizeIssue(record) {
  if (!record) return null;
  const { issueId, title, projectId, priority, severity, status } = record;

  // Mandatory fields
  if (!issueId || !title || !projectId || !priority || !severity || !status) return null;
  if (typeof issueId !== 'string' || issueId.trim() === '') return null;
  if (typeof title !== 'string' || title.trim() === '') return null;
  if (typeof projectId !== 'string' || projectId.trim() === '') return null;
  if (typeof priority !== 'string' || priority.trim() === '') return null;
  if (typeof severity !== 'string' || severity.trim() === '') return null;
  if (typeof status !== 'string' || status.trim() === '') return null;

  const cleanPriority = priority.trim().toLowerCase();
  const cleanSeverity = severity.trim().toLowerCase();
  const cleanStatus = status.trim().toLowerCase();

  if (!VALID_ISSUE_PRIORITIES.includes(cleanPriority)) return null;
  if (!VALID_ISSUE_SEVERITIES.includes(cleanSeverity)) return null;
  if (!VALID_ISSUE_STATUSES.includes(cleanStatus)) return null;

  return {
    issueId: issueId.trim(),
    title: title.trim(),
    projectId: projectId.trim(),
    assignedTo: record.assignedTo ? String(record.assignedTo).trim() : null,
    reportedBy: record.reportedBy ? String(record.reportedBy).trim() : null,
    priority: cleanPriority,
    severity: cleanSeverity,
    status: cleanStatus
  };
}

function sanitizeComment(record) {
  if (!record) return null;
  const { commentId, issueId, userId, message, createdAt } = record;

  // Mandatory fields
  if (!commentId || !issueId || !userId || !message || !createdAt) return null;
  if (typeof commentId !== 'string' || commentId.trim() === '') return null;
  if (typeof issueId !== 'string' || issueId.trim() === '') return null;
  if (typeof userId !== 'string' || userId.trim() === '') return null;
  if (typeof message !== 'string' || message.trim() === '') return null;
  if (typeof createdAt !== 'string' || createdAt.trim() === '') return null;

  // Validate date
  const date = new Date(createdAt.trim());
  if (isNaN(date.getTime())) return null;

  return {
    commentId: commentId.trim(),
    issueId: issueId.trim(),
    userId: userId.trim(),
    message: message.trim(),
    createdAt: date.toISOString()
  };
}

function sanitizeActivityLog(record) {
  if (!record) return null;
  const { logId, issueId, userId, action, timestamp } = record;

  // Mandatory fields
  if (!logId || !issueId || !userId || !action || !timestamp) return null;
  if (typeof logId !== 'string' || logId.trim() === '') return null;
  if (typeof issueId !== 'string' || issueId.trim() === '') return null;
  if (typeof userId !== 'string' || userId.trim() === '') return null;
  if (typeof action !== 'string' || action.trim() === '') return null;
  if (typeof timestamp !== 'string' || timestamp.trim() === '') return null;

  const cleanAction = action.trim().toLowerCase();
  if (!VALID_ACTIVITY_ACTIONS.includes(cleanAction)) return null;

  // Validate date
  const date = new Date(timestamp.trim());
  if (isNaN(date.getTime())) return null;

  return {
    logId: logId.trim(),
    issueId: issueId.trim(),
    userId: userId.trim(),
    action: cleanAction,
    previousStatus: record.previousStatus ? String(record.previousStatus).trim().toLowerCase() : null,
    newStatus: record.newStatus ? String(record.newStatus).trim().toLowerCase() : null,
    timestamp: date.toISOString()
  };
}

// Generic sanitizeRecord that dispatches based on entity type
function sanitizeRecord(record, entityType) {
  switch (entityType) {
    case 'user': return sanitizeUser(record);
    case 'project': return sanitizeProject(record);
    case 'issue': return sanitizeIssue(record);
    case 'comment': return sanitizeComment(record);
    case 'activityLog': return sanitizeActivityLog(record);
    default: return null;
  }
}

module.exports = {
  sanitizeRecord,
  sanitizeUser,
  sanitizeProject,
  sanitizeIssue,
  sanitizeComment,
  sanitizeActivityLog,
  VALID_USER_ROLES,
  VALID_USER_STATUSES,
  VALID_PROJECT_STATUSES,
  VALID_ISSUE_STATUSES,
  VALID_ISSUE_PRIORITIES,
  VALID_ISSUE_SEVERITIES,
  VALID_ACTIVITY_ACTIONS
};
