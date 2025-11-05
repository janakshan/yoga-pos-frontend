/**
 * @fileoverview Permission-based authorization hook
 */

import { useStore } from '../../../store/index.js';
import { useCallback, useMemo } from 'react';

/**
 * Hook for checking user permissions
 * @returns {Object} Permission checking functions
 */
export const usePermission = () => {
  const user = useStore((state) => state.user);
  const roles = useStore((state) => state.roles);

  /**
   * Get all permissions for the current user
   */
  const userPermissions = useMemo(() => {
    if (!user || !user.roles || user.roles.length === 0) {
      return [];
    }

    const allPermissions = new Set();

    // Get all roles for the user
    user.roles.forEach((roleId) => {
      const role = roles.find((r) => r.id === roleId);
      if (role && role.permissions) {
        // Check for wildcard (super admin)
        if (role.permissions.includes('*')) {
          return ['*']; // Super admin has all permissions
        }
        role.permissions.forEach((perm) => allPermissions.add(perm));
      }
    });

    return Array.from(allPermissions);
  }, [user, roles]);

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission name (e.g., "pos:create")
   * @returns {boolean}
   */
  const hasPermission = useCallback(
    (permission) => {
      if (!user) return false;

      // Check for super admin wildcard
      if (userPermissions.includes('*')) return true;

      // Check for specific permission
      return userPermissions.includes(permission);
    },
    [user, userPermissions]
  );

  /**
   * Check if user has ANY of the specified permissions
   * @param {string[]} permissions - Array of permission names
   * @returns {boolean}
   */
  const hasAnyPermission = useCallback(
    (permissions) => {
      if (!user) return false;
      if (userPermissions.includes('*')) return true;

      return permissions.some((perm) => userPermissions.includes(perm));
    },
    [user, userPermissions]
  );

  /**
   * Check if user has ALL of the specified permissions
   * @param {string[]} permissions - Array of permission names
   * @returns {boolean}
   */
  const hasAllPermissions = useCallback(
    (permissions) => {
      if (!user) return false;
      if (userPermissions.includes('*')) return true;

      return permissions.every((perm) => userPermissions.includes(perm));
    },
    [user, userPermissions]
  );

  /**
   * Check if user has a specific role
   * @param {string} roleCode - Role code (e.g., "admin")
   * @returns {boolean}
   */
  const hasRole = useCallback(
    (roleCode) => {
      if (!user || !user.roles) return false;

      const role = roles.find((r) => r.code === roleCode);
      return role ? user.roles.includes(role.id) : false;
    },
    [user, roles]
  );

  /**
   * Check if user has ANY of the specified roles
   * @param {string[]} roleCodes - Array of role codes
   * @returns {boolean}
   */
  const hasAnyRole = useCallback(
    (roleCodes) => {
      if (!user || !user.roles) return false;

      return roleCodes.some((code) => hasRole(code));
    },
    [user, hasRole]
  );

  /**
   * Check if user is super admin (has wildcard permission)
   * @returns {boolean}
   */
  const isSuperAdmin = useCallback(() => {
    return userPermissions.includes('*');
  }, [userPermissions]);

  return {
    // State
    userPermissions,

    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Role checks
    hasRole,
    hasAnyRole,
    isSuperAdmin,
  };
};

export default usePermission;
