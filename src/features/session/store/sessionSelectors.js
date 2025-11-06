/**
 * @fileoverview Session selectors
 */

/**
 * Get all sessions
 * @param {Object} state - Zustand state
 * @returns {import('../types').Session[]}
 */
export const selectSessions = (state) => state.sessions?.list || [];

/**
 * Get current session
 * @param {Object} state - Zustand state
 * @returns {import('../types').Session|null}
 */
export const selectCurrentSession = (state) => state.sessions?.current || null;

/**
 * Get session statistics
 * @param {Object} state - Zustand state
 * @returns {import('../types').SessionStats|null}
 */
export const selectSessionStats = (state) => state.sessions?.stats || null;

/**
 * Get session filters
 * @param {Object} state - Zustand state
 * @returns {import('../types').SessionFilters}
 */
export const selectSessionFilters = (state) => state.sessions?.filters || {};

/**
 * Get session loading state
 * @param {Object} state - Zustand state
 * @returns {boolean}
 */
export const selectSessionLoading = (state) => state.sessions?.loading || false;

/**
 * Get session error
 * @param {Object} state - Zustand state
 * @returns {string|null}
 */
export const selectSessionError = (state) => state.sessions?.error || null;

/**
 * Get active sessions
 * @param {Object} state - Zustand state
 * @returns {import('../types').Session[]}
 */
export const selectActiveSessions = (state) => {
  const sessions = selectSessions(state);
  const now = new Date();
  return sessions.filter(
    s => s.status === 'active' && new Date(s.expiresAt) > now
  );
};

/**
 * Get sessions by user ID
 * @param {string} userId - User ID to filter by
 * @returns {Function} Selector function
 */
export const selectSessionsByUserId = (userId) => (state) => {
  const sessions = selectSessions(state);
  return sessions.filter(s => s.userId === userId);
};

/**
 * Get concurrent users count
 * @param {Object} state - Zustand state
 * @returns {number}
 */
export const selectConcurrentUsersCount = (state) => {
  const activeSessions = selectActiveSessions(state);
  const uniqueUsers = new Set(activeSessions.map(s => s.userId));
  return uniqueUsers.size;
};

/**
 * Check if user has multiple active sessions
 * @param {string} userId - User ID to check
 * @returns {Function} Selector function
 */
export const selectHasMultipleSessions = (userId) => (state) => {
  const userSessions = selectSessionsByUserId(userId)(state);
  const now = new Date();
  const activeCount = userSessions.filter(
    s => s.status === 'active' && new Date(s.expiresAt) > now
  ).length;
  return activeCount > 1;
};
