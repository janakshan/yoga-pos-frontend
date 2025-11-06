/**
 * @fileoverview Session management hooks
 */

import { useCallback, useEffect } from 'react';
import { useStore } from '../../../store/index.js';
import {
  selectSessions,
  selectCurrentSession,
  selectSessionStats,
  selectSessionFilters,
  selectSessionLoading,
  selectSessionError,
  selectActiveSessions,
  selectConcurrentUsersCount,
} from '../store/sessionSelectors.js';

/**
 * Hook for session operations
 * @returns {Object} Session state and actions
 */
export const useSession = () => {
  // Selectors
  const sessions = useStore(selectSessions);
  const current = useStore(selectCurrentSession);
  const stats = useStore(selectSessionStats);
  const filters = useStore(selectSessionFilters);
  const loading = useStore(selectSessionLoading);
  const error = useStore(selectSessionError);

  // Actions
  const actions = useStore((state) => state.sessionActions);

  // Memoized actions
  const createSession = useCallback(
    (data) => actions.createSession(data),
    [actions]
  );

  const fetchSessions = useCallback(
    () => actions.fetchSessions(),
    [actions]
  );

  const fetchActiveSessionsByUserId = useCallback(
    (userId) => actions.fetchActiveSessionsByUserId(userId),
    [actions]
  );

  const fetchCurrentSession = useCallback(
    (token) => actions.fetchCurrentSession(token),
    [actions]
  );

  const updateSessionActivity = useCallback(
    (sessionId) => actions.updateSessionActivity(sessionId),
    [actions]
  );

  const terminateSession = useCallback(
    (sessionId) => actions.terminateSession(sessionId),
    [actions]
  );

  const terminateAllUserSessions = useCallback(
    (userId, exceptSessionId) => actions.terminateAllUserSessions(userId, exceptSessionId),
    [actions]
  );

  const expireOldSessions = useCallback(
    () => actions.expireOldSessions(),
    [actions]
  );

  const markIdleSessions = useCallback(
    (idleThresholdMinutes) => actions.markIdleSessions(idleThresholdMinutes),
    [actions]
  );

  const fetchSessionStats = useCallback(
    () => actions.fetchSessionStats(),
    [actions]
  );

  const checkConcurrentAccess = useCallback(
    (userId, resourceType, resourceId) =>
      actions.checkConcurrentAccess(userId, resourceType, resourceId),
    [actions]
  );

  const setSessionFilters = useCallback(
    (filters) => actions.setSessionFilters(filters),
    [actions]
  );

  const resetSessionFilters = useCallback(
    () => actions.resetSessionFilters(),
    [actions]
  );

  const clearCurrentSession = useCallback(
    () => actions.clearCurrentSession(),
    [actions]
  );

  const clearSessionError = useCallback(
    () => actions.clearSessionError(),
    [actions]
  );

  const cleanupSessions = useCallback(
    (daysOld) => actions.cleanupSessions(daysOld),
    [actions]
  );

  return {
    // State
    sessions,
    current,
    stats,
    filters,
    loading,
    error,

    // Actions
    createSession,
    fetchSessions,
    fetchActiveSessionsByUserId,
    fetchCurrentSession,
    updateSessionActivity,
    terminateSession,
    terminateAllUserSessions,
    expireOldSessions,
    markIdleSessions,
    fetchSessionStats,
    checkConcurrentAccess,
    setSessionFilters,
    resetSessionFilters,
    clearCurrentSession,
    clearSessionError,
    cleanupSessions,
  };
};

/**
 * Hook to get active sessions
 * @returns {Array} Active sessions
 */
export const useActiveSessions = () => {
  return useStore(selectActiveSessions);
};

/**
 * Hook to get concurrent users count
 * @returns {number} Concurrent users count
 */
export const useConcurrentUsersCount = () => {
  return useStore(selectConcurrentUsersCount);
};

/**
 * Hook to automatically update session activity
 * Updates activity every 5 minutes
 * @param {boolean} enabled - Whether to enable activity tracking
 */
export const useSessionActivityTracker = (enabled = true) => {
  const { current, updateSessionActivity } = useSession();

  useEffect(() => {
    if (!enabled || !current?.id) return;

    // Update activity immediately
    updateSessionActivity(current.id);

    // Set up interval to update activity every 5 minutes
    const interval = setInterval(() => {
      updateSessionActivity(current.id);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [enabled, current?.id, updateSessionActivity]);
};

/**
 * Hook to automatically expire old sessions
 * Checks every 15 minutes
 * @param {boolean} enabled - Whether to enable auto-expiration
 */
export const useAutoExpireSessions = (enabled = true) => {
  const { expireOldSessions, markIdleSessions } = useSession();

  useEffect(() => {
    if (!enabled) return;

    // Run immediately
    expireOldSessions();
    markIdleSessions(15); // Mark as idle after 15 minutes

    // Set up interval to check every 15 minutes
    const interval = setInterval(() => {
      expireOldSessions();
      markIdleSessions(15);
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, [enabled, expireOldSessions, markIdleSessions]);
};

/**
 * Hook to check for concurrent access conflicts
 * @param {string} userId - User ID to check
 * @param {string} resourceType - Resource type being accessed
 * @param {string} resourceId - Resource ID being accessed
 * @returns {Object} Concurrent access info
 */
export const useConcurrentAccessCheck = (userId, resourceType = null, resourceId = null) => {
  const { checkConcurrentAccess } = useSession();
  const [conflictInfo, setConflictInfo] = React.useState(null);

  useEffect(() => {
    if (!userId) return;

    checkConcurrentAccess(userId, resourceType, resourceId)
      .then(setConflictInfo)
      .catch(console.error);
  }, [userId, resourceType, resourceId, checkConcurrentAccess]);

  return conflictInfo;
};

export default useSession;
