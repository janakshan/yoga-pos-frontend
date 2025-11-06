/**
 * @fileoverview Audit log type definitions
 */

/**
 * Audit log event types
 * @readonly
 * @enum {string}
 */
export const AuditEventType = {
  // Authentication events
  AUTH_LOGIN: 'auth.login',
  AUTH_LOGOUT: 'auth.logout',
  AUTH_LOGIN_FAILED: 'auth.login_failed',
  AUTH_PASSWORD_CHANGED: 'auth.password_changed',
  AUTH_PIN_CHANGED: 'auth.pin_changed',
  AUTH_SESSION_EXPIRED: 'auth.session_expired',
  AUTH_TOKEN_REFRESHED: 'auth.token_refreshed',

  // User management events
  USER_CREATED: 'user.created',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  USER_STATUS_CHANGED: 'user.status_changed',
  USER_ROLE_ASSIGNED: 'user.role_assigned',
  USER_ROLE_REMOVED: 'user.role_removed',
  USER_PASSWORD_RESET: 'user.password_reset',

  // Role management events
  ROLE_CREATED: 'role.created',
  ROLE_UPDATED: 'role.updated',
  ROLE_DELETED: 'role.deleted',
  ROLE_PERMISSION_ADDED: 'role.permission_added',
  ROLE_PERMISSION_REMOVED: 'role.permission_removed',

  // Permission events
  PERMISSION_CREATED: 'permission.created',
  PERMISSION_UPDATED: 'permission.updated',
  PERMISSION_DELETED: 'permission.deleted',

  // POS events
  POS_TRANSACTION_CREATED: 'pos.transaction_created',
  POS_TRANSACTION_VOIDED: 'pos.transaction_voided',
  POS_REFUND_PROCESSED: 'pos.refund_processed',
  POS_DRAWER_OPENED: 'pos.drawer_opened',
  POS_DRAWER_CLOSED: 'pos.drawer_closed',

  // Product events
  PRODUCT_CREATED: 'product.created',
  PRODUCT_UPDATED: 'product.updated',
  PRODUCT_DELETED: 'product.deleted',
  PRODUCT_PRICE_CHANGED: 'product.price_changed',

  // Inventory events
  INVENTORY_ADJUSTED: 'inventory.adjusted',
  INVENTORY_TRANSFER: 'inventory.transfer',
  INVENTORY_COUNT: 'inventory.count',

  // Customer events
  CUSTOMER_CREATED: 'customer.created',
  CUSTOMER_UPDATED: 'customer.updated',
  CUSTOMER_DELETED: 'customer.deleted',

  // Settings events
  SETTINGS_UPDATED: 'settings.updated',
  SETTINGS_SYSTEM_CHANGED: 'settings.system_changed',

  // Branch events
  BRANCH_CREATED: 'branch.created',
  BRANCH_UPDATED: 'branch.updated',
  BRANCH_DELETED: 'branch.deleted',

  // Report events
  REPORT_GENERATED: 'report.generated',
  REPORT_EXPORTED: 'report.exported',

  // System events
  SYSTEM_BACKUP: 'system.backup',
  SYSTEM_RESTORE: 'system.restore',
  SYSTEM_ERROR: 'system.error',
};

/**
 * Audit log severity levels
 * @readonly
 * @enum {string}
 */
export const AuditSeverity = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical',
};

/**
 * Audit log status
 * @readonly
 * @enum {string}
 */
export const AuditStatus = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  PENDING: 'pending',
};

/**
 * @typedef {Object} AuditLog
 * @property {string} id - Unique identifier
 * @property {string} eventType - Type of event (from AuditEventType)
 * @property {AuditSeverity} severity - Severity level
 * @property {AuditStatus} status - Status of the action
 * @property {string} userId - ID of user who performed the action
 * @property {string} userName - Name of user who performed the action
 * @property {string} [targetUserId] - ID of user affected by the action (if applicable)
 * @property {string} [targetUserName] - Name of user affected by the action
 * @property {string} resource - Resource type affected (e.g., 'user', 'role', 'product')
 * @property {string} [resourceId] - ID of the resource affected
 * @property {string} action - Human-readable action description
 * @property {Object} [oldValues] - Previous values before change
 * @property {Object} [newValues] - New values after change
 * @property {string} [details] - Additional details
 * @property {string} [ipAddress] - IP address of the user
 * @property {string} [userAgent] - Browser/client user agent
 * @property {string} [sessionId] - Session ID
 * @property {string} [branchId] - Branch ID where action occurred
 * @property {string} [branchName] - Branch name where action occurred
 * @property {Object} [metadata] - Additional metadata
 * @property {Date|string} timestamp - When the action occurred
 */

/**
 * @typedef {Object} CreateAuditLogInput
 * @property {string} eventType - Type of event
 * @property {AuditSeverity} [severity='info'] - Severity level
 * @property {AuditStatus} [status='success'] - Status of the action
 * @property {string} userId - ID of user who performed the action
 * @property {string} userName - Name of user who performed the action
 * @property {string} [targetUserId] - ID of user affected by the action
 * @property {string} [targetUserName] - Name of user affected by the action
 * @property {string} resource - Resource type affected
 * @property {string} [resourceId] - ID of the resource affected
 * @property {string} action - Human-readable action description
 * @property {Object} [oldValues] - Previous values before change
 * @property {Object} [newValues] - New values after change
 * @property {string} [details] - Additional details
 * @property {string} [ipAddress] - IP address
 * @property {string} [userAgent] - User agent
 * @property {string} [sessionId] - Session ID
 * @property {string} [branchId] - Branch ID
 * @property {string} [branchName] - Branch name
 * @property {Object} [metadata] - Additional metadata
 */

/**
 * @typedef {Object} AuditLogFilters
 * @property {string} [search] - Search term
 * @property {string} [eventType] - Filter by event type
 * @property {AuditSeverity} [severity] - Filter by severity
 * @property {AuditStatus} [status] - Filter by status
 * @property {string} [userId] - Filter by user ID
 * @property {string} [resource] - Filter by resource type
 * @property {string} [resourceId] - Filter by resource ID
 * @property {string} [sessionId] - Filter by session ID
 * @property {string} [branchId] - Filter by branch ID
 * @property {Date|string} [startDate] - Start date for date range
 * @property {Date|string} [endDate] - End date for date range
 * @property {string} [sortBy] - Sort field (timestamp, eventType, severity)
 * @property {string} [sortOrder] - Sort order (asc, desc)
 * @property {number} [limit] - Number of records to return
 * @property {number} [offset] - Offset for pagination
 */

/**
 * @typedef {Object} AuditLogStats
 * @property {number} total - Total audit logs
 * @property {number} today - Logs created today
 * @property {number} thisWeek - Logs created this week
 * @property {number} thisMonth - Logs created this month
 * @property {number} successCount - Successful actions
 * @property {number} failureCount - Failed actions
 * @property {Object<string, number>} byEventType - Count by event type
 * @property {Object<string, number>} bySeverity - Count by severity
 * @property {Object<string, number>} byUser - Count by user
 * @property {Object<string, number>} byResource - Count by resource type
 */

/**
 * @typedef {Object} AuditLogSummary
 * @property {string} date - Date (YYYY-MM-DD)
 * @property {number} count - Number of events
 * @property {number} successCount - Successful events
 * @property {number} failureCount - Failed events
 * @property {string[]} topEvents - Top event types
 * @property {string[]} topUsers - Top users by activity
 */
