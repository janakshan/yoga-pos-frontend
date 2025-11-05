/**
 * @fileoverview Custom hook for permission management
 */

import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import { permissionService } from '../services/permissionService.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing permissions
 * @returns {Object} Permission state and actions
 */
export const usePermissions = () => {
  // Selectors
  const permissions = useStore((state) => state.permissions);
  const permissionGroups = useStore((state) => state.permissionGroups);
  const selectedPermission = useStore((state) => state.selectedPermission);
  const isLoading = useStore((state) => state.permissionLoading);
  const error = useStore((state) => state.permissionError);

  // Actions
  const setPermissions = useStore((state) => state.setPermissions);
  const setPermissionGroups = useStore((state) => state.setPermissionGroups);
  const addPermission = useStore((state) => state.addPermission);
  const updatePermission = useStore((state) => state.updatePermission);
  const removePermission = useStore((state) => state.removePermission);
  const selectPermission = useStore((state) => state.selectPermission);
  const setLoading = useStore((state) => state.setPermissionLoading);
  const setError = useStore((state) => state.setPermissionError);
  const clearError = useStore((state) => state.clearPermissionError);
  const bulkUpdatePermissionStatus = useStore((state) => state.bulkUpdatePermissionStatus);

  /**
   * Fetch all permissions with optional filters
   */
  const fetchPermissions = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        clearError();
        const data = await permissionService.getAll(filters);
        setPermissions(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch permissions';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setPermissions, setError]
  );

  /**
   * Fetch permissions grouped by category
   */
  const fetchPermissionGroups = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const data = await permissionService.getGroupedByCategory();
      setPermissionGroups(data);
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch permission groups';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setPermissionGroups, setError]);

  /**
   * Fetch permission by ID
   */
  const fetchPermissionById = useCallback(
    async (id) => {
      try {
        setLoading(true);
        clearError();
        const data = await permissionService.getById(id);
        selectPermission(data);
        return data;
      } catch (err) {
        const message = err.message || `Failed to fetch permission ${id}`;
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, selectPermission, setError]
  );

  /**
   * Create a new permission
   */
  const createPermission = useCallback(
    async (data) => {
      try {
        setLoading(true);
        clearError();
        const newPermission = await permissionService.create(data);
        addPermission(newPermission);
        toast.success('Permission created successfully');
        return newPermission;
      } catch (err) {
        const message = err.message || 'Failed to create permission';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, addPermission, setError]
  );

  /**
   * Update a permission
   */
  const updatePermissionById = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        clearError();
        const updated = await permissionService.update(id, data);
        updatePermission(id, updated);
        toast.success('Permission updated successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update permission';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, updatePermission, setError]
  );

  /**
   * Delete a permission
   */
  const deletePermission = useCallback(
    async (id) => {
      try {
        setLoading(true);
        clearError();
        await permissionService.delete(id);
        removePermission(id);
        toast.success('Permission deleted successfully');
        return true;
      } catch (err) {
        const message = err.message || 'Failed to delete permission';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, removePermission, setError]
  );

  /**
   * Bulk update permission status
   */
  const bulkUpdateStatus = useCallback(
    async (ids, isActive) => {
      try {
        setLoading(true);
        clearError();
        const result = await permissionService.bulkUpdateStatus(ids, isActive);
        bulkUpdatePermissionStatus(ids, isActive);
        toast.success(`${result.count} permission(s) ${isActive ? 'activated' : 'deactivated'}`);
        return result;
      } catch (err) {
        const message = err.message || 'Failed to update permissions';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, bulkUpdatePermissionStatus, setError]
  );

  /**
   * Reset permissions to default
   */
  const resetToDefault = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const result = await permissionService.resetToDefault();
      // Reload permissions after reset
      await fetchPermissions();
      toast.success(`${result.count} permissions reset to default`);
      return result;
    } catch (err) {
      const message = err.message || 'Failed to reset permissions';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, fetchPermissions, setError]);

  /**
   * Get permission by name
   */
  const getPermissionByName = useCallback(
    (name) => {
      return permissions.find((p) => p.name === name);
    },
    [permissions]
  );

  /**
   * Get permissions by category
   */
  const getPermissionsByCategory = useCallback(
    (category) => {
      return permissions.filter((p) => p.category === category);
    },
    [permissions]
  );

  /**
   * Check if permission exists
   */
  const hasPermission = useCallback(
    (name) => {
      return permissions.some((p) => p.name === name && p.isActive);
    },
    [permissions]
  );

  return {
    // State
    permissions,
    permissionGroups,
    selectedPermission,
    isLoading,
    error,

    // Actions
    fetchPermissions,
    fetchPermissionGroups,
    fetchPermissionById,
    createPermission,
    updatePermissionById,
    deletePermission,
    bulkUpdateStatus,
    resetToDefault,
    selectPermission,
    clearError,

    // Utilities
    getPermissionByName,
    getPermissionsByCategory,
    hasPermission,
  };
};

export default usePermissions;
