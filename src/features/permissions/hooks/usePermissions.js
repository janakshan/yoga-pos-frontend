/**
 * usePermissions Hook
 *
 * Hook for managing permissions with state management
 */

import { useState, useCallback } from 'react';
import { permissionsService } from '../services/permissionsService';
import toast from 'react-hot-toast';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all permissions
   */
  const fetchPermissions = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await permissionsService.getList(params);
      setPermissions(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch permissions';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch permission by ID
   */
  const fetchPermissionById = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await permissionsService.getById(id);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch permission';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch permissions by role
   */
  const fetchPermissionsByRole = useCallback(async (roleId) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await permissionsService.getByRole(roleId);
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch role permissions';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new permission
   */
  const createPermission = useCallback(async (permissionData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPermission = await permissionsService.create(permissionData);
      setPermissions((prev) => [...prev, newPermission]);
      toast.success('Permission created successfully');
      return newPermission;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create permission';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update an existing permission
   */
  const updatePermission = useCallback(async (id, updates) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedPermission = await permissionsService.update(id, updates);
      setPermissions((prev) =>
        prev.map((perm) => (perm.id === id ? updatedPermission : perm))
      );
      toast.success('Permission updated successfully');
      return updatedPermission;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update permission';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete a permission
   */
  const deletePermission = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      await permissionsService.remove(id);
      setPermissions((prev) => prev.filter((perm) => perm.id !== id));
      toast.success('Permission deleted successfully');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete permission';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    permissions,
    isLoading,
    error,
    fetchPermissions,
    fetchPermissionById,
    fetchPermissionsByRole,
    createPermission,
    updatePermission,
    deletePermission,
    clearError,
  };
};

export default usePermissions;
