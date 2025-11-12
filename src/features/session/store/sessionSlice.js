/**
 * @fileoverview Session state management slice
 */

import sessionService from '../services/sessionService.js';

/**
 * Create session slice
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} Session slice
 */
export const createSessionSlice = (set, get) => ({
  // State
  sessions: {
    list: [],
    current: null,
    stats: null,
    filters: {
      userId: null,
      status: null,
      branchId: null,
      sortBy: 'lastActivityAt',
      sortOrder: 'desc',
    },
    loading: false,
    error: null,
  },

  // Actions
  sessionActions: {
    /**
     * Create a new session
     * @param {import('../types').CreateSessionInput} data - Session data
     */
    createSession: async (data) => {
      try {
        const session = await sessionService.create(data);

        set((state) => ({
          sessions: {
            ...state.sessions,
            current: session,
            list: [session, ...state.sessions.list],
          },
        }));

        return session;
      } catch (error) {
        console.error('Failed to create session:', error);
        throw error;
      }
    },

    /**
     * Fetch all sessions with current filters
     */
    fetchSessions: async () => {
      set((state) => ({
        sessions: { ...state.sessions, loading: true, error: null },
      }));

      try {
        const filters = get().sessions.filters;
        const sessions = await sessionService.getAll(filters);

        set((state) => ({
          sessions: { ...state.sessions, list: sessions, loading: false },
        }));
      } catch (error) {
        set((state) => ({
          sessions: { ...state.sessions, loading: false, error: error.message },
        }));
        throw error;
      }
    },

    /**
     * Fetch active sessions for a user
     * @param {string} userId - User ID
     */
    fetchActiveSessionsByUserId: async (userId) => {
      set((state) => ({
        sessions: { ...state.sessions, loading: true, error: null },
      }));

      try {
        const sessions = await sessionService.getActiveByUserId(userId);

        set((state) => ({
          sessions: { ...state.sessions, list: sessions, loading: false },
        }));
      } catch (error) {
        set((state) => ({
          sessions: { ...state.sessions, loading: false, error: error.message },
        }));
        throw error;
      }
    },

    /**
     * Get current session
     * @param {string} token - Current session token
     */
    fetchCurrentSession: async (token) => {
      try {
        const session = await sessionService.getCurrent(token);

        set((state) => ({
          sessions: { ...state.sessions, current: session },
        }));

        return session;
      } catch (error) {
        console.error('Failed to fetch current session:', error);
        throw error;
      }
    },

    /**
     * Update session activity
     * @param {string} sessionId - Session ID
     */
    updateSessionActivity: async (sessionId) => {
      try {
        const session = await sessionService.updateActivity(sessionId);

        set((state) => ({
          sessions: {
            ...state.sessions,
            current: state.sessions.current?.id === sessionId ? session : state.sessions.current,
            list: state.sessions.list.map(s => (s.id === sessionId ? session : s)),
          },
        }));

        return session;
      } catch (error) {
        console.error('Failed to update session activity:', error);
        throw error;
      }
    },

    /**
     * Terminate a session
     * @param {string} sessionId - Session ID
     */
    terminateSession: async (sessionId) => {
      try {
        const result = await sessionService.terminate(sessionId);

        set((state) => ({
          sessions: {
            ...state.sessions,
            list: state.sessions.list.filter(s => s.id !== sessionId),
          },
        }));

        return result;
      } catch (error) {
        console.error('Failed to terminate session:', error);
        throw error;
      }
    },

    /**
     * Terminate all sessions for a user (except current)
     * @param {string} userId - User ID
     * @param {string} [exceptSessionId] - Session ID to keep active
     */
    terminateAllUserSessions: async (userId, exceptSessionId = null) => {
      try {
        const result = await sessionService.terminateAllForUser(userId, exceptSessionId);

        // Refresh session list
        await get().sessionActions.fetchSessions();

        return result;
      } catch (error) {
        console.error('Failed to terminate user sessions:', error);
        throw error;
      }
    },

    /**
     * Check and expire old sessions
     */
    expireOldSessions: async () => {
      try {
        const result = await sessionService.expireOldSessions();

        // Refresh session list if any were expired
        if (result.expiredCount > 0) {
          await get().sessionActions.fetchSessions();
        }

        return result;
      } catch (error) {
        console.error('Failed to expire sessions:', error);
        throw error;
      }
    },

    /**
     * Mark idle sessions
     * @param {number} [idleThresholdMinutes=15] - Minutes of inactivity
     */
    markIdleSessions: async (idleThresholdMinutes = 15) => {
      try {
        const result = await sessionService.markIdleSessions(idleThresholdMinutes);

        // Refresh session list if any were marked idle
        if (result.idleCount > 0) {
          await get().sessionActions.fetchSessions();
        }

        return result;
      } catch (error) {
        console.error('Failed to mark idle sessions:', error);
        throw error;
      }
    },

    /**
     * Fetch session statistics
     */
    fetchSessionStats: async () => {
      try {
        const stats = await sessionService.getStats();

        set((state) => ({
          sessions: { ...state.sessions, stats },
        }));

        return stats;
      } catch (error) {
        console.error('Failed to fetch session stats:', error);
        throw error;
      }
    },

    /**
     * Check for concurrent access conflicts
     * @param {string} userId - User ID
     * @param {string} [resourceType] - Resource type
     * @param {string} [resourceId] - Resource ID
     */
    checkConcurrentAccess: async (userId, resourceType = null, resourceId = null) => {
      try {
        return await sessionService.checkConcurrentAccess(userId, resourceType, resourceId);
      } catch (error) {
        console.error('Failed to check concurrent access:', error);
        throw error;
      }
    },

    /**
     * Set session filters
     * @param {Partial<import('../types').SessionFilters>} filters - Filter values
     */
    setSessionFilters: (filters) => {
      set((state) => ({
        sessions: {
          ...state.sessions,
          filters: { ...state.sessions.filters, ...filters },
        },
      }));
    },

    /**
     * Reset session filters
     */
    resetSessionFilters: () => {
      set((state) => ({
        sessions: {
          ...state.sessions,
          filters: {
            userId: null,
            status: null,
            branchId: null,
            sortBy: 'lastActivityAt',
            sortOrder: 'desc',
          },
        },
      }));
    },

    /**
     * Clear current session
     */
    clearCurrentSession: () => {
      set((state) => ({
        sessions: { ...state.sessions, current: null },
      }));
    },

    /**
     * Clear session error
     */
    clearSessionError: () => {
      set((state) => ({
        sessions: { ...state.sessions, error: null },
      }));
    },

    /**
     * Cleanup old sessions
     * @param {number} [daysOld=30] - Delete sessions older than this many days
     */
    cleanupSessions: async (daysOld = 30) => {
      try {
        const result = await sessionService.cleanup(daysOld);

        // Refresh session list
        await get().sessionActions.fetchSessions();

        return result;
      } catch (error) {
        console.error('Failed to cleanup sessions:', error);
        throw error;
      }
    },
  },
});
