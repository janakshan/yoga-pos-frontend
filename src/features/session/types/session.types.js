/**
 * @fileoverview Session type definitions for multi-user session management
 */

/**
 * Session status
 * @readonly
 * @enum {string}
 */
export const SessionStatus = {
  ACTIVE: 'active',
  IDLE: 'idle',
  EXPIRED: 'expired',
  TERMINATED: 'terminated',
};

/**
 * Session device type
 * @readonly
 * @enum {string}
 */
export const DeviceType = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  UNKNOWN: 'unknown',
};

/**
 * @typedef {Object} Session
 * @property {string} id - Unique session identifier
 * @property {string} userId - User ID
 * @property {string} userName - User name
 * @property {string} userEmail - User email
 * @property {string} [userAvatar] - User avatar URL
 * @property {SessionStatus} status - Session status
 * @property {string} token - JWT access token
 * @property {string} refreshToken - Refresh token
 * @property {Date|string} createdAt - Session creation time
 * @property {Date|string} lastActivityAt - Last activity timestamp
 * @property {Date|string} expiresAt - Session expiration time
 * @property {string} ipAddress - IP address of the session
 * @property {string} userAgent - Browser/client user agent
 * @property {DeviceType} deviceType - Type of device
 * @property {string} [deviceName] - Device name/identifier
 * @property {string} [location] - Approximate location (city, country)
 * @property {string} [branchId] - Active branch ID
 * @property {string} [branchName] - Active branch name
 * @property {boolean} isCurrent - Whether this is the current session
 * @property {Object} [metadata] - Additional session metadata
 */

/**
 * @typedef {Object} CreateSessionInput
 * @property {string} userId - User ID
 * @property {string} userName - User name
 * @property {string} userEmail - User email
 * @property {string} [userAvatar] - User avatar URL
 * @property {string} token - JWT access token
 * @property {string} refreshToken - Refresh token
 * @property {number} expiresIn - Token expiration time in seconds
 * @property {string} [ipAddress] - IP address
 * @property {string} [userAgent] - User agent string
 * @property {string} [branchId] - Active branch ID
 * @property {string} [branchName] - Active branch name
 * @property {Object} [metadata] - Additional metadata
 */

/**
 * @typedef {Object} UpdateSessionInput
 * @property {SessionStatus} [status] - Session status
 * @property {Date|string} [lastActivityAt] - Last activity timestamp
 * @property {string} [token] - Updated access token
 * @property {string} [refreshToken] - Updated refresh token
 * @property {Date|string} [expiresAt] - Updated expiration time
 * @property {string} [branchId] - Updated branch ID
 * @property {string} [branchName] - Updated branch name
 * @property {Object} [metadata] - Additional metadata
 */

/**
 * @typedef {Object} SessionFilters
 * @property {string} [userId] - Filter by user ID
 * @property {SessionStatus} [status] - Filter by status
 * @property {string} [branchId] - Filter by branch ID
 * @property {Date|string} [activeAfter] - Filter sessions active after date
 * @property {Date|string} [activeBefore] - Filter sessions active before date
 * @property {boolean} [currentOnly] - Only return current user's sessions
 * @property {string} [sortBy] - Sort field (createdAt, lastActivityAt)
 * @property {string} [sortOrder] - Sort order (asc, desc)
 */

/**
 * @typedef {Object} SessionStats
 * @property {number} totalSessions - Total sessions
 * @property {number} activeSessions - Currently active sessions
 * @property {number} idleSessions - Idle sessions
 * @property {number} expiredSessions - Expired sessions
 * @property {number} uniqueUsers - Number of unique users
 * @property {number} concurrentUsers - Currently concurrent users
 * @property {Object<string, number>} byBranch - Sessions by branch
 * @property {Object<string, number>} byDevice - Sessions by device type
 * @property {Array<{userId: string, userName: string, sessionCount: number}>} topUsers - Most active users
 */

/**
 * @typedef {Object} ConcurrentAccessInfo
 * @property {boolean} hasConflict - Whether there's a potential conflict
 * @property {string} [conflictType] - Type of conflict (same_resource, same_branch)
 * @property {Session[]} concurrentSessions - List of concurrent sessions
 * @property {string} [message] - Conflict message
 */

/**
 * @typedef {Object} SessionActivity
 * @property {string} sessionId - Session ID
 * @property {string} userId - User ID
 * @property {string} userName - User name
 * @property {string} action - Action performed
 * @property {string} [resource] - Resource affected
 * @property {Date|string} timestamp - When action occurred
 */
