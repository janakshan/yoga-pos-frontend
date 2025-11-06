/**
 * @fileoverview Audit log hooks
 */

import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import {
  selectAuditLogs,
  selectCurrentAuditLog,
  selectAuditStats,
  selectAuditFilters,
  selectAuditLoading,
  selectAuditError,
  selectRecentAuditLogs,
  selectFailedAuditLogs,
} from '../store/auditSelectors.js';

/**
 * Hook for audit log operations
 * @returns {Object} Audit state and actions
 */
export const useAudit = () => {
  // Selectors
  const logs = useStore(selectAuditLogs);
  const currentLog = useStore(selectCurrentAuditLog);
  const stats = useStore(selectAuditStats);
  const filters = useStore(selectAuditFilters);
  const loading = useStore(selectAuditLoading);
  const error = useStore(selectAuditError);

  // Actions
  const actions = useStore((state) => state.auditActions);

  // Memoized actions
  const fetchAuditLogs = useCallback(() => actions.fetchAuditLogs(), [actions]);

  const fetchAuditLogById = useCallback(
    (id) => actions.fetchAuditLogById(id),
    [actions]
  );

  const createAuditLog = useCallback(
    (data) => actions.createAuditLog(data),
    [actions]
  );

  const fetchAuditLogsByUserId = useCallback(
    (userId, limit) => actions.fetchAuditLogsByUserId(userId, limit),
    [actions]
  );

  const fetchAuditLogsByResource = useCallback(
    (resource, resourceId) => actions.fetchAuditLogsByResource(resource, resourceId),
    [actions]
  );

  const fetchAuditStats = useCallback(
    (options) => actions.fetchAuditStats(options),
    [actions]
  );

  const setAuditFilters = useCallback(
    (filters) => actions.setAuditFilters(filters),
    [actions]
  );

  const resetAuditFilters = useCallback(
    () => actions.resetAuditFilters(),
    [actions]
  );

  const clearCurrentAuditLog = useCallback(
    () => actions.clearCurrentAuditLog(),
    [actions]
  );

  const clearAuditError = useCallback(
    () => actions.clearAuditError(),
    [actions]
  );

  const exportAuditLogs = useCallback(
    (filters, format) => actions.exportAuditLogs(filters, format),
    [actions]
  );

  return {
    // State
    logs,
    currentLog,
    stats,
    filters,
    loading,
    error,

    // Actions
    fetchAuditLogs,
    fetchAuditLogById,
    createAuditLog,
    fetchAuditLogsByUserId,
    fetchAuditLogsByResource,
    fetchAuditStats,
    setAuditFilters,
    resetAuditFilters,
    clearCurrentAuditLog,
    clearAuditError,
    exportAuditLogs,
  };
};

/**
 * Hook to get recent audit logs
 * @returns {Array} Recent audit logs
 */
export const useRecentAuditLogs = () => {
  return useStore(selectRecentAuditLogs);
};

/**
 * Hook to get failed audit logs
 * @returns {Array} Failed audit logs
 */
export const useFailedAuditLogs = () => {
  return useStore(selectFailedAuditLogs);
};

/**
 * Hook to log audit events easily
 * @returns {Function} Log function
 */
export const useAuditLogger = () => {
  const { createAuditLog } = useAudit();
  const user = useStore((state) => state.user);
  const currentBranch = useStore((state) => state.currentBranch);
  const currentSession = useStore((state) => state.sessions?.current);

  return useCallback(
    async (eventType, action, options = {}) => {
      if (!user) return;

      const auditData = {
        eventType,
        action,
        userId: user.id,
        userName: user.name || user.email,
        branchId: currentBranch?.id || options.branchId,
        branchName: currentBranch?.name || options.branchName,
        sessionId: currentSession?.id || options.sessionId,
        severity: options.severity || 'info',
        status: options.status || 'success',
        resource: options.resource,
        resourceId: options.resourceId,
        targetUserId: options.targetUserId,
        targetUserName: options.targetUserName,
        oldValues: options.oldValues,
        newValues: options.newValues,
        details: options.details,
        metadata: options.metadata,
      };

      return await createAuditLog(auditData);
    },
    [createAuditLog, user, currentBranch, currentSession]
  );
};

export default useAudit;
