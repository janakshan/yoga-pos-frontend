/**
 * @fileoverview Audit log selectors
 */

/**
 * Get all audit logs
 * @param {Object} state - Zustand state
 * @returns {import('../types').AuditLog[]}
 */
export const selectAuditLogs = (state) => state.audit?.logs || [];

/**
 * Get current audit log
 * @param {Object} state - Zustand state
 * @returns {import('../types').AuditLog|null}
 */
export const selectCurrentAuditLog = (state) => state.audit?.currentLog || null;

/**
 * Get audit statistics
 * @param {Object} state - Zustand state
 * @returns {import('../types').AuditLogStats|null}
 */
export const selectAuditStats = (state) => state.audit?.stats || null;

/**
 * Get audit filters
 * @param {Object} state - Zustand state
 * @returns {import('../types').AuditLogFilters}
 */
export const selectAuditFilters = (state) => state.audit?.filters || {};

/**
 * Get audit loading state
 * @param {Object} state - Zustand state
 * @returns {boolean}
 */
export const selectAuditLoading = (state) => state.audit?.loading || false;

/**
 * Get audit error
 * @param {Object} state - Zustand state
 * @returns {string|null}
 */
export const selectAuditError = (state) => state.audit?.error || null;

/**
 * Get recent audit logs (last 10)
 * @param {Object} state - Zustand state
 * @returns {import('../types').AuditLog[]}
 */
export const selectRecentAuditLogs = (state) => {
  const logs = selectAuditLogs(state);
  return logs.slice(0, 10);
};

/**
 * Get audit logs by event type
 * @param {Object} state - Zustand state
 * @param {string} eventType - Event type to filter by
 * @returns {import('../types').AuditLog[]}
 */
export const selectAuditLogsByEventType = (eventType) => (state) => {
  const logs = selectAuditLogs(state);
  return logs.filter(log => log.eventType === eventType);
};

/**
 * Get audit logs by user
 * @param {Object} state - Zustand state
 * @param {string} userId - User ID to filter by
 * @returns {import('../types').AuditLog[]}
 */
export const selectAuditLogsByUser = (userId) => (state) => {
  const logs = selectAuditLogs(state);
  return logs.filter(log => log.userId === userId);
};

/**
 * Get failed audit logs
 * @param {Object} state - Zustand state
 * @returns {import('../types').AuditLog[]}
 */
export const selectFailedAuditLogs = (state) => {
  const logs = selectAuditLogs(state);
  return logs.filter(log => log.status === 'failure');
};
