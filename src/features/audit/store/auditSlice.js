/**
 * @fileoverview Audit log state management slice
 */

import auditService from '../services/auditService.js';

/**
 * Create audit slice
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} Audit slice
 */
export const createAuditSlice = (set, get) => ({
  // State
  audit: {
    logs: [],
    currentLog: null,
    stats: null,
    filters: {
      search: '',
      eventType: null,
      severity: null,
      status: null,
      userId: null,
      resource: null,
      startDate: null,
      endDate: null,
      sortBy: 'timestamp',
      sortOrder: 'desc',
    },
    loading: false,
    error: null,
  },

  // Actions
  auditActions: {
    /**
     * Fetch all audit logs with current filters
     */
    fetchAuditLogs: async () => {
      set((state) => ({
        audit: { ...state.audit, loading: true, error: null },
      }));

      try {
        const filters = get().audit.filters;
        const logs = await auditService.getAll(filters);

        set((state) => ({
          audit: { ...state.audit, logs, loading: false },
        }));
      } catch (error) {
        set((state) => ({
          audit: { ...state.audit, loading: false, error: error.message },
        }));
        throw error;
      }
    },

    /**
     * Fetch audit log by ID
     * @param {string} id - Audit log ID
     */
    fetchAuditLogById: async (id) => {
      set((state) => ({
        audit: { ...state.audit, loading: true, error: null },
      }));

      try {
        const log = await auditService.getById(id);

        set((state) => ({
          audit: { ...state.audit, currentLog: log, loading: false },
        }));
      } catch (error) {
        set((state) => ({
          audit: { ...state.audit, loading: false, error: error.message },
        }));
        throw error;
      }
    },

    /**
     * Create a new audit log entry
     * @param {import('../types').CreateAuditLogInput} data - Audit log data
     */
    createAuditLog: async (data) => {
      try {
        const newLog = await auditService.create(data);

        set((state) => ({
          audit: {
            ...state.audit,
            logs: [newLog, ...state.audit.logs],
          },
        }));

        return newLog;
      } catch (error) {
        console.error('Failed to create audit log:', error);
        throw error;
      }
    },

    /**
     * Fetch audit logs by user ID
     * @param {string} userId - User ID
     * @param {number} [limit=50] - Maximum number of logs
     */
    fetchAuditLogsByUserId: async (userId, limit = 50) => {
      set((state) => ({
        audit: { ...state.audit, loading: true, error: null },
      }));

      try {
        const logs = await auditService.getByUserId(userId, limit);

        set((state) => ({
          audit: { ...state.audit, logs, loading: false },
        }));
      } catch (error) {
        set((state) => ({
          audit: { ...state.audit, loading: false, error: error.message },
        }));
        throw error;
      }
    },

    /**
     * Fetch audit logs by resource
     * @param {string} resource - Resource type
     * @param {string} [resourceId] - Optional resource ID
     */
    fetchAuditLogsByResource: async (resource, resourceId = null) => {
      set((state) => ({
        audit: { ...state.audit, loading: true, error: null },
      }));

      try {
        const logs = await auditService.getByResource(resource, resourceId);

        set((state) => ({
          audit: { ...state.audit, logs, loading: false },
        }));
      } catch (error) {
        set((state) => ({
          audit: { ...state.audit, loading: false, error: error.message },
        }));
        throw error;
      }
    },

    /**
     * Fetch audit log statistics
     * @param {Object} [options] - Options for stats calculation
     */
    fetchAuditStats: async (options = {}) => {
      try {
        const stats = await auditService.getStats(options);

        set((state) => ({
          audit: { ...state.audit, stats },
        }));
      } catch (error) {
        console.error('Failed to fetch audit stats:', error);
        throw error;
      }
    },

    /**
     * Set audit log filters
     * @param {Partial<import('../types').AuditLogFilters>} filters - Filter values
     */
    setAuditFilters: (filters) => {
      set((state) => ({
        audit: {
          ...state.audit,
          filters: { ...state.audit.filters, ...filters },
        },
      }));
    },

    /**
     * Reset audit log filters
     */
    resetAuditFilters: () => {
      set((state) => ({
        audit: {
          ...state.audit,
          filters: {
            search: '',
            eventType: null,
            severity: null,
            status: null,
            userId: null,
            resource: null,
            startDate: null,
            endDate: null,
            sortBy: 'timestamp',
            sortOrder: 'desc',
          },
        },
      }));
    },

    /**
     * Clear current audit log
     */
    clearCurrentAuditLog: () => {
      set((state) => ({
        audit: { ...state.audit, currentLog: null },
      }));
    },

    /**
     * Clear audit error
     */
    clearAuditError: () => {
      set((state) => ({
        audit: { ...state.audit, error: null },
      }));
    },

    /**
     * Export audit logs
     * @param {import('../types').AuditLogFilters} [filters] - Filter options
     * @param {string} [format='json'] - Export format
     */
    exportAuditLogs: async (filters = {}, format = 'json') => {
      try {
        const result = await auditService.export(filters, format);

        // Create download link
        const blob = new Blob([result.data], { type: result.mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return result;
      } catch (error) {
        console.error('Failed to export audit logs:', error);
        throw error;
      }
    },
  },
});
