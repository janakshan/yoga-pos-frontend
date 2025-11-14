/**
 * usePermissions Hook
 *
 * Hook for checking user permissions and role-based access control.
 * Integrates with the settings toggle to enable/disable permission guards.
 */

import { useMemo } from 'react';
import { useStore } from '../store';
import { selectUser } from '../store/selectors';

/**
 * Permission mappings for routes and features
 * Maps route paths to required permissions
 * Note: Supports both dot and colon separators (users.view or users:view)
 * Also supports common variations: view/read, create/write, update/edit, delete/remove, list/index/manage
 */
export const ROUTE_PERMISSIONS = {
  // Dashboard
  '/dashboard': null, // Accessible to all authenticated users

  // Branch Management
  '/branches': ['branches.view', 'branches.list', 'branches.create', 'branches.update', 'branches.delete', 'branches.read', 'branches.write', 'branches.manage', 'branches.*'],
  '/branches/:id': ['branches.view', 'branches.update', 'branches.delete', 'branches.read', 'branches.write', 'branches.manage', 'branches.*'],

  // User & Role Management
  '/users': ['users.view', 'users.list', 'users.create', 'users.update', 'users.delete', 'users.read', 'users.write', 'users.manage', 'users.*'],
  '/users/:id': ['users.view', 'users.update', 'users.delete', 'users.read', 'users.write', 'users.manage', 'users.*'],
  '/roles': ['roles.view', 'roles.list', 'roles.create', 'roles.update', 'roles.delete', 'roles.read', 'roles.write', 'roles.manage', 'roles.*'],
  '/permissions': ['permissions.view', 'permissions.list', 'permissions.create', 'permissions.update', 'permissions.delete', 'permissions.read', 'permissions.write', 'permissions.manage', 'permissions.*'],

  // Products & Inventory
  '/products': ['products.view', 'products.list', 'products.create', 'products.update', 'products.delete', 'products.*'],
  '/inventory': ['inventory.view', 'inventory.list', 'inventory.create', 'inventory.update', 'inventory.delete', 'inventory.*'],
  '/recipes': ['recipes.view', 'recipes.list'],
  '/recipes/new': ['recipes.create'],
  '/recipes/:id': ['recipes.view'],
  '/recipes/:id/edit': ['recipes.update'],

  // Purchase Management
  '/suppliers': ['suppliers.view', 'suppliers.list'],
  '/purchase-orders': ['purchase_orders.view', 'purchase_orders.list'],

  // POS
  '/pos': ['pos.access', 'sales.create'],
  '/pos/fast-checkout': ['pos.access', 'sales.create'],

  // Orders (Restaurant)
  '/orders': ['orders.view', 'orders.list'],
  '/orders/new': ['orders.create'],
  '/orders/:orderId': ['orders.view'],
  '/orders-dashboard': ['orders.view', 'orders.list'],

  // Customer Management
  '/customers': ['customers.view', 'customers.list'],

  // Restaurant Features
  '/tables': ['tables.view', 'tables.list'],
  '/floor-plan': ['tables.view', 'floor_plan.view'],
  '/kitchen-display': ['kitchen.view', 'orders.view'],
  '/server-management': ['servers.view', 'servers.manage'],
  '/qr-codes': ['qr_ordering.view', 'qr_ordering.manage'],
  '/qr-analytics': ['qr_ordering.view', 'analytics.view'],

  // Financial
  '/financial': ['financial.view', 'reports.view'],
  '/invoices': ['invoices.view', 'invoices.list'],
  '/payments': ['payments.view', 'payments.list'],
  '/expenses': ['expenses.view', 'expenses.list'],
  '/financial-reports': ['financial.view', 'reports.view'],

  // Reports
  '/reports': ['reports.view', 'reports.list'],

  // Settings
  '/settings': ['settings.view', 'settings.manage'],

  // Bookings (Yoga)
  '/bookings': ['bookings.view', 'bookings.list'],
};

/**
 * Role-based permissions
 * Defines which roles can access certain features
 */
export const ROLE_PERMISSIONS = {
  ADMIN: ['*'], // Admin has access to everything
  SUPER_ADMIN: ['*'], // Super admin has access to everything
  MANAGER: [
    'dashboard.view',
    'branches.view',
    'users.view',
    'roles.view',
    'products.*',
    'inventory.*',
    'suppliers.*',
    'purchase_orders.*',
    'pos.access',
    'sales.*',
    'orders.*',
    'customers.*',
    'tables.*',
    'floor_plan.*',
    'kitchen.view',
    'servers.*',
    'financial.view',
    'reports.view',
  ],
  CASHIER: [
    'dashboard.view',
    'pos.access',
    'sales.create',
    'sales.view',
    'products.view',
    'customers.view',
    'customers.create',
    'inventory.view',
  ],
  SERVER: [
    'dashboard.view',
    'orders.*',
    'tables.view',
    'tables.update',
    'floor_plan.view',
    'kitchen.view',
    'products.view',
    'customers.view',
  ],
  CHEF: [
    'dashboard.view',
    'kitchen.view',
    'orders.view',
    'orders.update',
    'recipes.view',
    'inventory.view',
  ],
  STAFF: [
    'dashboard.view',
    'products.view',
    'inventory.view',
  ],
  VIEWER: [
    'dashboard.view',
    'reports.view',
  ],
};

/**
 * Custom hook for permission management
 */
export const usePermissions = () => {
  const user = useStore(selectUser);
  const enablePermissionGuards = useStore((state) => state.enablePermissionGuards);

  /**
   * Normalize permission format - convert colon to dot
   * Handles both 'users:view' and 'users.view' formats
   */
  const normalizePermission = (perm) => {
    if (!perm) return '';
    // Convert colon to dot (users:view -> users.view)
    return perm.replace(':', '.');
  };

  /**
   * Get all permissions for the current user based on their roles
   */
  const userPermissions = useMemo(() => {
    if (!user) return [];

    const permissions = new Set();

    // Add direct permissions from user.permissions array
    if (user.permissions && Array.isArray(user.permissions)) {
      user.permissions.forEach((perm) => {
        const permCode = typeof perm === 'string' ? perm : perm.code || perm.name;
        if (permCode) {
          permissions.add(normalizePermission(permCode));
        }
      });
    }

    // Collect permissions from all user roles
    if (user.roles && Array.isArray(user.roles)) {
      user.roles.forEach((role) => {
        const roleName = typeof role === 'string' ? role : role.code || role.name;
        const roleNameUpper = roleName.toUpperCase().replace(/\s+/g, '_');

        // Get permissions for this role
        const rolePerms = ROLE_PERMISSIONS[roleNameUpper] || [];
        rolePerms.forEach((perm) => permissions.add(normalizePermission(perm)));

        // Also add permissions from role object if available
        if (typeof role === 'object' && role.permissions) {
          role.permissions.forEach((perm) => {
            const permCode = typeof perm === 'string' ? perm : perm.code || perm.name;
            if (permCode) {
              permissions.add(normalizePermission(permCode));
            }
          });
        }
      });
    }

    return Array.from(permissions);
  }, [user]);

  /**
   * Check if user has a specific permission
   * @param {string|string[]} permission - Permission code or array of codes
   * @param {boolean} requireAll - If true, user must have ALL permissions. If false, user needs ANY permission.
   * @returns {boolean}
   */
  const hasPermission = (permission, requireAll = false) => {
    // If guards are disabled, allow access
    if (!enablePermissionGuards) return true;

    // No user or no permissions
    if (!user || userPermissions.length === 0) return false;

    // Admin or Super Admin has all permissions
    if (userPermissions.includes('*')) return true;

    // Handle array of permissions
    if (Array.isArray(permission)) {
      if (requireAll) {
        return permission.every((perm) => checkSinglePermission(perm));
      } else {
        return permission.some((perm) => checkSinglePermission(perm));
      }
    }

    // Handle single permission
    return checkSinglePermission(permission);
  };

  /**
   * Check a single permission with wildcard support
   * @param {string} permission - Permission code
   * @returns {boolean}
   */
  const checkSinglePermission = (permission) => {
    if (!permission) return true;

    // Direct match
    if (userPermissions.includes(permission)) return true;

    // Check wildcard permissions
    const parts = permission.split('.');
    for (let i = parts.length - 1; i >= 0; i--) {
      const wildcardPerm = parts.slice(0, i).join('.') + '.*';
      if (userPermissions.includes(wildcardPerm)) return true;
    }

    return false;
  };

  /**
   * Check if user can access a specific route
   * @param {string} routePath - Route path
   * @returns {boolean}
   */
  const canAccessRoute = (routePath) => {
    // If guards are disabled, allow access
    if (!enablePermissionGuards) return true;

    // Find matching route permission
    let requiredPerms = null;

    // Try exact match first
    if (ROUTE_PERMISSIONS[routePath]) {
      requiredPerms = ROUTE_PERMISSIONS[routePath];
    } else {
      // Try to find pattern match (e.g., /users/:id matches /users/123)
      for (const [pattern, perms] of Object.entries(ROUTE_PERMISSIONS)) {
        const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '[^/]+') + '$');
        if (regex.test(routePath)) {
          requiredPerms = perms;
          break;
        }
      }
    }

    // No permissions required for this route
    if (!requiredPerms) return true;

    // Check permissions
    return hasPermission(requiredPerms, false);
  };

  /**
   * Check if user has a specific role
   * @param {string|string[]} roleName - Role name or array of role names
   * @returns {boolean}
   */
  const hasRole = (roleName) => {
    if (!user || !user.roles) return false;

    const userRoles = user.roles.map((role) => {
      const name = typeof role === 'string' ? role : role.code || role.name;
      return name.toUpperCase().replace(/\s+/g, '_');
    });

    if (Array.isArray(roleName)) {
      return roleName.some((role) => userRoles.includes(role.toUpperCase().replace(/\s+/g, '_')));
    }

    return userRoles.includes(roleName.toUpperCase().replace(/\s+/g, '_'));
  };

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return hasRole(['ADMIN', 'SUPER_ADMIN']);
  };

  return {
    userPermissions,
    hasPermission,
    canAccessRoute,
    hasRole,
    isAdmin,
    isGuardsEnabled: enablePermissionGuards,
  };
};

export default usePermissions;
