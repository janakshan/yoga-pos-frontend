/**
 * @fileoverview Audit log service for tracking system activities
 * This is a mock service that simulates API calls with local data
 */

import { AuditEventType, AuditSeverity, AuditStatus } from '../types/audit.types.js';

// Mock data store
let MOCK_AUDIT_LOGS = [];

// Generate some initial mock audit data
const generateInitialAuditLogs = () => {
  const events = [
    {
      eventType: AuditEventType.AUTH_LOGIN,
      severity: AuditSeverity.INFO,
      status: AuditStatus.SUCCESS,
      userId: 'user_1',
      userName: 'Admin User',
      resource: 'authentication',
      action: 'User logged in successfully',
      ipAddress: '192.168.1.100',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      eventType: AuditEventType.USER_CREATED,
      severity: AuditSeverity.INFO,
      status: AuditStatus.SUCCESS,
      userId: 'user_1',
      userName: 'Admin User',
      targetUserId: 'user_5',
      targetUserName: 'Jessica Wilson',
      resource: 'user',
      resourceId: 'user_5',
      action: 'Created new user account',
      newValues: { username: 'jessica.wilson', email: 'jessica.wilson@yoga.com', role: 'instructor' },
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      eventType: AuditEventType.POS_TRANSACTION_CREATED,
      severity: AuditSeverity.INFO,
      status: AuditStatus.SUCCESS,
      userId: 'user_3',
      userName: 'Emily Thompson',
      resource: 'transaction',
      resourceId: 'txn_12345',
      action: 'Processed sale transaction',
      branchId: 'branch_1',
      branchName: 'Downtown Yoga Studio',
      metadata: { amount: 85.00, items: 3 },
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), // 10 hours ago
    },
    {
      eventType: AuditEventType.AUTH_LOGIN_FAILED,
      severity: AuditSeverity.WARNING,
      status: AuditStatus.FAILURE,
      userId: 'unknown',
      userName: 'Unknown User',
      resource: 'authentication',
      action: 'Failed login attempt',
      details: 'Invalid credentials',
      ipAddress: '192.168.1.105',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    },
    {
      eventType: AuditEventType.PRODUCT_PRICE_CHANGED,
      severity: AuditSeverity.INFO,
      status: AuditStatus.SUCCESS,
      userId: 'user_2',
      userName: 'Sarah Manager',
      resource: 'product',
      resourceId: 'prod_123',
      action: 'Updated product pricing',
      oldValues: { price: 45.00 },
      newValues: { price: 50.00 },
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000), // 1.5 days ago
    },
  ];

  return events.map((event, index) => ({
    id: `audit_${Date.now() - index * 1000}`,
    sessionId: `session_${Math.random().toString(36).substring(7)}`,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    ...event,
  }));
};

// Initialize with mock data
MOCK_AUDIT_LOGS = generateInitialAuditLogs();

/**
 * Simulate API delay
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 */
const delay = (min = 300, max = 600) =>
  new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min) + min)));

/**
 * Audit Service
 */
export const auditService = {
  /**
   * Get all audit logs with optional filters
   * @param {import('../types').AuditLogFilters} [filters] - Filter options
   * @returns {Promise<import('../types').AuditLog[]>}
   */
  async getAll(filters = {}) {
    await delay();

    let result = [...MOCK_AUDIT_LOGS];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        log =>
          log.action.toLowerCase().includes(searchLower) ||
          log.userName.toLowerCase().includes(searchLower) ||
          log.details?.toLowerCase().includes(searchLower) ||
          log.resource.toLowerCase().includes(searchLower)
      );
    }

    // Apply event type filter
    if (filters.eventType) {
      result = result.filter(log => log.eventType === filters.eventType);
    }

    // Apply severity filter
    if (filters.severity) {
      result = result.filter(log => log.severity === filters.severity);
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(log => log.status === filters.status);
    }

    // Apply user filter
    if (filters.userId) {
      result = result.filter(log => log.userId === filters.userId);
    }

    // Apply resource filter
    if (filters.resource) {
      result = result.filter(log => log.resource === filters.resource);
    }

    // Apply resource ID filter
    if (filters.resourceId) {
      result = result.filter(log => log.resourceId === filters.resourceId);
    }

    // Apply session filter
    if (filters.sessionId) {
      result = result.filter(log => log.sessionId === filters.sessionId);
    }

    // Apply branch filter
    if (filters.branchId) {
      result = result.filter(log => log.branchId === filters.branchId);
    }

    // Apply date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter(log => new Date(log.timestamp) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      result = result.filter(log => new Date(log.timestamp) <= endDate);
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'timestamp';
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return -1 * sortOrder;
      if (aVal > bVal) return 1 * sortOrder;
      return 0;
    });

    // Apply pagination
    if (filters.limit) {
      const offset = filters.offset || 0;
      result = result.slice(offset, offset + filters.limit);
    }

    return result;
  },

  /**
   * Get audit log by ID
   * @param {string} id - Audit log ID
   * @returns {Promise<import('../types').AuditLog>}
   */
  async getById(id) {
    await delay();

    const log = MOCK_AUDIT_LOGS.find(l => l.id === id);
    if (!log) {
      throw new Error(`Audit log with ID ${id} not found`);
    }

    return { ...log };
  },

  /**
   * Create a new audit log entry
   * @param {import('../types').CreateAuditLogInput} data - Audit log data
   * @returns {Promise<import('../types').AuditLog>}
   */
  async create(data) {
    await delay(100, 200); // Shorter delay for audit logging

    const newLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      eventType: data.eventType,
      severity: data.severity || AuditSeverity.INFO,
      status: data.status || AuditStatus.SUCCESS,
      userId: data.userId,
      userName: data.userName,
      targetUserId: data.targetUserId,
      targetUserName: data.targetUserName,
      resource: data.resource,
      resourceId: data.resourceId,
      action: data.action,
      oldValues: data.oldValues,
      newValues: data.newValues,
      details: data.details,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      sessionId: data.sessionId,
      branchId: data.branchId,
      branchName: data.branchName,
      metadata: data.metadata,
      timestamp: new Date().toISOString(),
    };

    MOCK_AUDIT_LOGS.unshift(newLog); // Add to beginning for recent logs
    return { ...newLog };
  },

  /**
   * Get audit logs by user ID
   * @param {string} userId - User ID
   * @param {number} [limit=50] - Maximum number of logs to return
   * @returns {Promise<import('../types').AuditLog[]>}
   */
  async getByUserId(userId, limit = 50) {
    await delay();

    return MOCK_AUDIT_LOGS
      .filter(log => log.userId === userId)
      .slice(0, limit);
  },

  /**
   * Get audit logs by resource
   * @param {string} resource - Resource type
   * @param {string} [resourceId] - Optional resource ID
   * @returns {Promise<import('../types').AuditLog[]>}
   */
  async getByResource(resource, resourceId = null) {
    await delay();

    let result = MOCK_AUDIT_LOGS.filter(log => log.resource === resource);

    if (resourceId) {
      result = result.filter(log => log.resourceId === resourceId);
    }

    return result;
  },

  /**
   * Get audit logs by session ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<import('../types').AuditLog[]>}
   */
  async getBySessionId(sessionId) {
    await delay();

    return MOCK_AUDIT_LOGS.filter(log => log.sessionId === sessionId);
  },

  /**
   * Get audit log statistics
   * @param {Object} [options] - Options for stats calculation
   * @param {Date|string} [options.startDate] - Start date
   * @param {Date|string} [options.endDate] - End date
   * @returns {Promise<import('../types').AuditLogStats>}
   */
  async getStats(options = {}) {
    await delay();

    let logs = [...MOCK_AUDIT_LOGS];

    // Apply date filters if provided
    if (options.startDate) {
      const startDate = new Date(options.startDate);
      logs = logs.filter(log => new Date(log.timestamp) >= startDate);
    }
    if (options.endDate) {
      const endDate = new Date(options.endDate);
      logs = logs.filter(log => new Date(log.timestamp) <= endDate);
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      total: logs.length,
      today: logs.filter(log => new Date(log.timestamp) >= todayStart).length,
      thisWeek: logs.filter(log => new Date(log.timestamp) >= weekStart).length,
      thisMonth: logs.filter(log => new Date(log.timestamp) >= monthStart).length,
      successCount: logs.filter(log => log.status === AuditStatus.SUCCESS).length,
      failureCount: logs.filter(log => log.status === AuditStatus.FAILURE).length,
      byEventType: {},
      bySeverity: {},
      byUser: {},
      byResource: {},
    };

    // Count by event type
    logs.forEach(log => {
      stats.byEventType[log.eventType] = (stats.byEventType[log.eventType] || 0) + 1;
    });

    // Count by severity
    logs.forEach(log => {
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1;
    });

    // Count by user
    logs.forEach(log => {
      const key = `${log.userId}:${log.userName}`;
      stats.byUser[key] = (stats.byUser[key] || 0) + 1;
    });

    // Count by resource
    logs.forEach(log => {
      stats.byResource[log.resource] = (stats.byResource[log.resource] || 0) + 1;
    });

    return stats;
  },

  /**
   * Get audit log summary by date
   * @param {Date|string} startDate - Start date
   * @param {Date|string} endDate - End date
   * @returns {Promise<import('../types').AuditLogSummary[]>}
   */
  async getSummaryByDate(startDate, endDate) {
    await delay();

    const start = new Date(startDate);
    const end = new Date(endDate);
    const summaryMap = new Map();

    MOCK_AUDIT_LOGS
      .filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= start && logDate <= end;
      })
      .forEach(log => {
        const dateKey = new Date(log.timestamp).toISOString().split('T')[0];

        if (!summaryMap.has(dateKey)) {
          summaryMap.set(dateKey, {
            date: dateKey,
            count: 0,
            successCount: 0,
            failureCount: 0,
            eventTypes: {},
            users: {},
          });
        }

        const summary = summaryMap.get(dateKey);
        summary.count++;

        if (log.status === AuditStatus.SUCCESS) summary.successCount++;
        if (log.status === AuditStatus.FAILURE) summary.failureCount++;

        summary.eventTypes[log.eventType] = (summary.eventTypes[log.eventType] || 0) + 1;
        summary.users[log.userName] = (summary.users[log.userName] || 0) + 1;
      });

    // Convert to array and add top events/users
    return Array.from(summaryMap.values()).map(summary => ({
      date: summary.date,
      count: summary.count,
      successCount: summary.successCount,
      failureCount: summary.failureCount,
      topEvents: Object.entries(summary.eventTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([event]) => event),
      topUsers: Object.entries(summary.users)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([user]) => user),
    }));
  },

  /**
   * Delete old audit logs (data retention)
   * @param {Date|string} beforeDate - Delete logs before this date
   * @returns {Promise<{success: boolean, deletedCount: number}>}
   */
  async deleteOldLogs(beforeDate) {
    await delay();

    const before = new Date(beforeDate);
    const initialCount = MOCK_AUDIT_LOGS.length;

    MOCK_AUDIT_LOGS = MOCK_AUDIT_LOGS.filter(log => new Date(log.timestamp) >= before);

    const deletedCount = initialCount - MOCK_AUDIT_LOGS.length;

    return { success: true, deletedCount };
  },

  /**
   * Export audit logs
   * @param {import('../types').AuditLogFilters} [filters] - Filter options
   * @param {string} [format='json'] - Export format (json, csv)
   * @returns {Promise<{data: string, filename: string, mimeType: string}>}
   */
  async export(filters = {}, format = 'json') {
    await delay();

    const logs = await this.getAll(filters);

    if (format === 'json') {
      return {
        data: JSON.stringify(logs, null, 2),
        filename: `audit-logs-${new Date().toISOString().split('T')[0]}.json`,
        mimeType: 'application/json',
      };
    } else if (format === 'csv') {
      // Simple CSV conversion
      const headers = ['Timestamp', 'Event Type', 'Severity', 'Status', 'User', 'Action', 'Resource'];
      const rows = logs.map(log => [
        log.timestamp,
        log.eventType,
        log.severity,
        log.status,
        log.userName,
        log.action,
        log.resource,
      ]);

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n');

      return {
        data: csv,
        filename: `audit-logs-${new Date().toISOString().split('T')[0]}.csv`,
        mimeType: 'text/csv',
      };
    }

    throw new Error(`Unsupported export format: ${format}`);
  },
};

export default auditService;
