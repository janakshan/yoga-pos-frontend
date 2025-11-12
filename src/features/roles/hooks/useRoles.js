/**
 * @fileoverview Custom hook for role management
 */

import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import roleService from '../services/roleService.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing roles
 * @returns {Object} Role state and actions
 */
export const useRoles = () => {
  // Selectors
  const roles = useStore((state) => state.roles);
  const selectedRole = useStore((state) => state.selectedRole);
  const isLoading = useStore((state) => state.roleLoading);
  const error = useStore((state) => state.roleError);
  const stats = useStore((state) => state.roleStats);

  // Actions
  const setRoles = useStore((state) => state.setRoles);
  const addRole = useStore((state) => state.addRole);
  const updateRole = useStore((state) => state.updateRole);
  const removeRole = useStore((state) => state.removeRole);
  const selectRole = useStore((state) => state.selectRole);
  const setLoading = useStore((state) => state.setRoleLoading);
  const setError = useStore((state) => state.setRoleError);
  const clearError = useStore((state) => state.clearRoleError);
  const setStats = useStore((state) => state.setRoleStats);
  const updateRolePermissions = useStore((state) => state.updateRolePermissions);

  /**
   * Fetch all roles with optional filters
   */
  const fetchRoles = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        clearError();
        const data = await roleService.getAll(filters);
        setRoles(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch roles';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setRoles, setError]
  );

  /**
   * Fetch role by ID
   */
  const fetchRoleById = useCallback(
    async (id) => {
      try {
        setLoading(true);
        clearError();
        const data = await roleService.getById(id);
        selectRole(data);
        return data;
      } catch (err) {
        const message = err.message || `Failed to fetch role ${id}`;
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, selectRole, setError]
  );

  /**
   * Fetch role by code
   */
  const fetchRoleByCode = useCallback(
    async (code) => {
      try {
        setLoading(true);
        clearError();
        const data = await roleService.getByCode(code);
        selectRole(data);
        return data;
      } catch (err) {
        const message = err.message || `Failed to fetch role ${code}`;
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, selectRole, setError]
  );

  /**
   * Create a new role
   */
  const createRole = useCallback(
    async (data) => {
      try {
        setLoading(true);
        clearError();
        const newRole = await roleService.create(data);
        addRole(newRole);
        toast.success('Role created successfully');
        return newRole;
      } catch (err) {
        const message = err.message || 'Failed to create role';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, addRole, setError]
  );

  /**
   * Update a role
   */
  const updateRoleById = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        clearError();
        const updated = await roleService.update(id, data);
        updateRole(id, updated);
        toast.success('Role updated successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update role';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, updateRole, setError]
  );

  /**
   * Delete a role
   */
  const deleteRole = useCallback(
    async (id) => {
      try {
        setLoading(true);
        clearError();
        await roleService.delete(id);
        removeRole(id);
        toast.success('Role deleted successfully');
        return true;
      } catch (err) {
        const message = err.message || 'Failed to delete role';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, removeRole, setError]
  );

  /**
   * Add permissions to a role
   */
  const addPermissions = useCallback(
    async (roleId, permissionIds) => {
      try {
        setLoading(true);
        clearError();
        const updated = await roleService.addPermissions(roleId, permissionIds);
        updateRole(roleId, updated);
        toast.success('Permissions added successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to add permissions';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, updateRole, setError]
  );

  /**
   * Remove permissions from a role
   */
  const removePermissions = useCallback(
    async (roleId, permissionIds) => {
      try {
        setLoading(true);
        clearError();
        const updated = await roleService.removePermissions(roleId, permissionIds);
        updateRole(roleId, updated);
        toast.success('Permissions removed successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to remove permissions';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, updateRole, setError]
  );

  /**
   * Set role permissions (replace all)
   */
  const setPermissions = useCallback(
    async (roleId, permissionIds) => {
      try {
        setLoading(true);
        clearError();
        const updated = await roleService.setPermissions(roleId, permissionIds);
        updateRolePermissions(roleId, permissionIds);
        toast.success('Permissions updated successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update permissions';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, updateRolePermissions, setError]
  );

  /**
   * Fetch role statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const data = await roleService.getStats();
      setStats(data);
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch role statistics';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setStats, setError]);

  /**
   * Clone a role
   */
  const cloneRole = useCallback(
    async (roleId, newName) => {
      try {
        setLoading(true);
        clearError();
        const cloned = await roleService.clone(roleId, newName);
        addRole(cloned);
        toast.success(`Role cloned as "${newName}"`);
        return cloned;
      } catch (err) {
        const message = err.message || 'Failed to clone role';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, addRole, setError]
  );

  /**
   * Get role by ID from state
   */
  const getRoleById = useCallback(
    (id) => {
      return roles.find((r) => r.id === id);
    },
    [roles]
  );

  /**
   * Get role by code from state
   */
  const getRoleByCode = useCallback(
    (code) => {
      return roles.find((r) => r.code === code);
    },
    [roles]
  );

  /**
   * Get system roles
   */
  const getSystemRoles = useCallback(() => {
    return roles.filter((r) => r.isSystem);
  }, [roles]);

  /**
   * Get custom roles
   */
  const getCustomRoles = useCallback(() => {
    return roles.filter((r) => !r.isSystem);
  }, [roles]);

  return {
    // State
    roles,
    selectedRole,
    isLoading,
    error,
    stats,

    // Actions
    fetchRoles,
    fetchRoleById,
    fetchRoleByCode,
    createRole,
    updateRoleById,
    deleteRole,
    addPermissions,
    removePermissions,
    setPermissions,
    fetchStats,
    cloneRole,
    selectRole,
    clearError,

    // Utilities
    getRoleById,
    getRoleByCode,
    getSystemRoles,
    getCustomRoles,
  };
};

export default useRoles;
