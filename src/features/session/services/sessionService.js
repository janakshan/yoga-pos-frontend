/**
 * @fileoverview Session service for managing user sessions and concurrent access
 * This is a mock service that simulates API calls with local data
 */

import { SessionStatus, DeviceType } from '../types/session.types.js';

// Mock data store
let MOCK_SESSIONS = [];

/**
 * Detect device type from user agent
 * @param {string} userAgent - User agent string
 * @returns {DeviceType}
 */
const detectDeviceType = (userAgent) => {
  if (!userAgent) return DeviceType.UNKNOWN;

  const ua = userAgent.toLowerCase();
  if (ua.includes('mobile')) return DeviceType.MOBILE;
  if (ua.includes('tablet') || ua.includes('ipad')) return DeviceType.TABLET;
  return DeviceType.DESKTOP;
};

/**
 * Generate session ID
 * @returns {string}
 */
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
};

/**
 * Simulate API delay
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 */
const delay = (min = 200, max = 400) =>
  new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min) + min)));

/**
 * Session Service
 */
export const sessionService = {
  /**
   * Create a new session
   * @param {import('../types').CreateSessionInput} data - Session data
   * @returns {Promise<import('../types').Session>}
   */
  async create(data) {
    await delay();

    const now = new Date();
    const expiresAt = new Date(now.getTime() + (data.expiresIn || 86400) * 1000);

    const newSession = {
      id: generateSessionId(),
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      userAvatar: data.userAvatar,
      status: SessionStatus.ACTIVE,
      token: data.token,
      refreshToken: data.refreshToken,
      createdAt: now.toISOString(),
      lastActivityAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      ipAddress: data.ipAddress || '127.0.0.1',
      userAgent: data.userAgent || navigator.userAgent,
      deviceType: detectDeviceType(data.userAgent || navigator.userAgent),
      deviceName: data.deviceName,
      location: data.location,
      branchId: data.branchId,
      branchName: data.branchName,
      isCurrent: true,
      metadata: data.metadata || {},
    };

    // Mark all other sessions for this user as not current
    MOCK_SESSIONS = MOCK_SESSIONS.map(session =>
      session.userId === data.userId ? { ...session, isCurrent: false } : session
    );

    MOCK_SESSIONS.push(newSession);
    return { ...newSession };
  },

  /**
   * Get all sessions with optional filters
   * @param {import('../types').SessionFilters} [filters] - Filter options
   * @returns {Promise<import('../types').Session[]>}
   */
  async getAll(filters = {}) {
    await delay();

    let result = [...MOCK_SESSIONS];

    // Apply user filter
    if (filters.userId) {
      result = result.filter(session => session.userId === filters.userId);
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(session => session.status === filters.status);
    }

    // Apply branch filter
    if (filters.branchId) {
      result = result.filter(session => session.branchId === filters.branchId);
    }

    // Apply date filters
    if (filters.activeAfter) {
      const after = new Date(filters.activeAfter);
      result = result.filter(session => new Date(session.lastActivityAt) >= after);
    }

    if (filters.activeBefore) {
      const before = new Date(filters.activeBefore);
      result = result.filter(session => new Date(session.lastActivityAt) <= before);
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'lastActivityAt';
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return -1 * sortOrder;
      if (aVal > bVal) return 1 * sortOrder;
      return 0;
    });

    return result;
  },

  /**
   * Get session by ID
   * @param {string} id - Session ID
   * @returns {Promise<import('../types').Session>}
   */
  async getById(id) {
    await delay();

    const session = MOCK_SESSIONS.find(s => s.id === id);
    if (!session) {
      throw new Error(`Session with ID ${id} not found`);
    }

    return { ...session };
  },

  /**
   * Get active sessions for a user
   * @param {string} userId - User ID
   * @returns {Promise<import('../types').Session[]>}
   */
  async getActiveByUserId(userId) {
    await delay();

    return MOCK_SESSIONS.filter(
      session =>
        session.userId === userId &&
        session.status === SessionStatus.ACTIVE &&
        new Date(session.expiresAt) > new Date()
    );
  },

  /**
   * Get current session
   * @param {string} token - Current session token
   * @returns {Promise<import('../types').Session>}
   */
  async getCurrent(token) {
    await delay();

    const session = MOCK_SESSIONS.find(s => s.token === token && s.isCurrent);
    if (!session) {
      throw new Error('Current session not found');
    }

    return { ...session };
  },

  /**
   * Update session
   * @param {string} id - Session ID
   * @param {import('../types').UpdateSessionInput} data - Update data
   * @returns {Promise<import('../types').Session>}
   */
  async update(id, data) {
    await delay();

    const index = MOCK_SESSIONS.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Session with ID ${id} not found`);
    }

    const updated = {
      ...MOCK_SESSIONS[index],
      ...data,
    };

    MOCK_SESSIONS[index] = updated;
    return { ...updated };
  },

  /**
   * Update session activity
   * @param {string} sessionId - Session ID
   * @returns {Promise<import('../types').Session>}
   */
  async updateActivity(sessionId) {
    await delay(50, 100); // Faster for activity updates

    const index = MOCK_SESSIONS.findIndex(s => s.id === sessionId);
    if (index === -1) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }

    const updated = {
      ...MOCK_SESSIONS[index],
      lastActivityAt: new Date().toISOString(),
      status: SessionStatus.ACTIVE,
    };

    MOCK_SESSIONS[index] = updated;
    return { ...updated };
  },

  /**
   * Terminate session
   * @param {string} id - Session ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async terminate(id) {
    await delay();

    const index = MOCK_SESSIONS.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error(`Session with ID ${id} not found`);
    }

    MOCK_SESSIONS[index] = {
      ...MOCK_SESSIONS[index],
      status: SessionStatus.TERMINATED,
    };

    return { success: true, message: 'Session terminated successfully' };
  },

  /**
   * Terminate all sessions for a user (except current)
   * @param {string} userId - User ID
   * @param {string} [exceptSessionId] - Session ID to keep active
   * @returns {Promise<{success: boolean, terminatedCount: number}>}
   */
  async terminateAllForUser(userId, exceptSessionId = null) {
    await delay();

    let count = 0;
    MOCK_SESSIONS = MOCK_SESSIONS.map(session => {
      if (
        session.userId === userId &&
        session.id !== exceptSessionId &&
        session.status === SessionStatus.ACTIVE
      ) {
        count++;
        return { ...session, status: SessionStatus.TERMINATED };
      }
      return session;
    });

    return { success: true, terminatedCount: count };
  },

  /**
   * Check and expire old sessions
   * @returns {Promise<{success: boolean, expiredCount: number}>}
   */
  async expireOldSessions() {
    await delay();

    const now = new Date();
    let count = 0;

    MOCK_SESSIONS = MOCK_SESSIONS.map(session => {
      if (
        session.status === SessionStatus.ACTIVE &&
        new Date(session.expiresAt) < now
      ) {
        count++;
        return { ...session, status: SessionStatus.EXPIRED };
      }
      return session;
    });

    return { success: true, expiredCount: count };
  },

  /**
   * Mark sessions as idle after inactivity
   * @param {number} idleThresholdMinutes - Minutes of inactivity to consider idle
   * @returns {Promise<{success: boolean, idleCount: number}>}
   */
  async markIdleSessions(idleThresholdMinutes = 15) {
    await delay();

    const now = new Date();
    const threshold = idleThresholdMinutes * 60 * 1000;
    let count = 0;

    MOCK_SESSIONS = MOCK_SESSIONS.map(session => {
      if (
        session.status === SessionStatus.ACTIVE &&
        now.getTime() - new Date(session.lastActivityAt).getTime() > threshold
      ) {
        count++;
        return { ...session, status: SessionStatus.IDLE };
      }
      return session;
    });

    return { success: true, idleCount: count };
  },

  /**
   * Get session statistics
   * @returns {Promise<import('../types').SessionStats>}
   */
  async getStats() {
    await delay();

    const now = new Date();
    const activeSessions = MOCK_SESSIONS.filter(
      s => s.status === SessionStatus.ACTIVE && new Date(s.expiresAt) > now
    );

    const uniqueUserIds = new Set(activeSessions.map(s => s.userId));

    const stats = {
      totalSessions: MOCK_SESSIONS.length,
      activeSessions: activeSessions.length,
      idleSessions: MOCK_SESSIONS.filter(s => s.status === SessionStatus.IDLE).length,
      expiredSessions: MOCK_SESSIONS.filter(s => s.status === SessionStatus.EXPIRED).length,
      uniqueUsers: uniqueUserIds.size,
      concurrentUsers: uniqueUserIds.size,
      byBranch: {},
      byDevice: {},
      topUsers: [],
    };

    // Count by branch
    activeSessions.forEach(session => {
      if (session.branchId) {
        const key = session.branchName || session.branchId;
        stats.byBranch[key] = (stats.byBranch[key] || 0) + 1;
      }
    });

    // Count by device
    activeSessions.forEach(session => {
      stats.byDevice[session.deviceType] = (stats.byDevice[session.deviceType] || 0) + 1;
    });

    // Top users by session count
    const userCounts = {};
    activeSessions.forEach(session => {
      const key = session.userId;
      if (!userCounts[key]) {
        userCounts[key] = { userId: session.userId, userName: session.userName, sessionCount: 0 };
      }
      userCounts[key].sessionCount++;
    });

    stats.topUsers = Object.values(userCounts)
      .sort((a, b) => b.sessionCount - a.sessionCount)
      .slice(0, 10);

    return stats;
  },

  /**
   * Check for concurrent access conflicts
   * @param {string} userId - User ID
   * @param {string} [resourceType] - Resource type being accessed
   * @param {string} [resourceId] - Resource ID being accessed
   * @returns {Promise<import('../types').ConcurrentAccessInfo>}
   */
  async checkConcurrentAccess(userId, resourceType = null, resourceId = null) {
    await delay();

    const activeSessions = await this.getActiveByUserId(userId);

    const info = {
      hasConflict: activeSessions.length > 1,
      conflictType: null,
      concurrentSessions: activeSessions,
      message: null,
    };

    if (activeSessions.length > 1) {
      info.conflictType = 'multiple_sessions';
      info.message = `User has ${activeSessions.length} active sessions`;
    }

    // Check for same branch access
    if (resourceType === 'branch' && resourceId) {
      const sameBranchSessions = activeSessions.filter(s => s.branchId === resourceId);
      if (sameBranchSessions.length > 1) {
        info.conflictType = 'same_branch';
        info.message = `Multiple sessions accessing the same branch`;
      }
    }

    return info;
  },

  /**
   * Delete old terminated/expired sessions
   * @param {number} daysOld - Delete sessions older than this many days
   * @returns {Promise<{success: boolean, deletedCount: number}>}
   */
  async cleanup(daysOld = 30) {
    await delay();

    const threshold = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
    const initialCount = MOCK_SESSIONS.length;

    MOCK_SESSIONS = MOCK_SESSIONS.filter(session => {
      // Keep active and idle sessions
      if (session.status === SessionStatus.ACTIVE || session.status === SessionStatus.IDLE) {
        return true;
      }
      // Delete old terminated/expired sessions
      return new Date(session.lastActivityAt) >= threshold;
    });

    const deletedCount = initialCount - MOCK_SESSIONS.length;

    return { success: true, deletedCount };
  },
};

export default sessionService;
