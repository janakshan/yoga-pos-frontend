/**
 * @fileoverview Permission Gate Component
 * Conditionally renders children based on user permissions
 */

import { usePermission } from '../hooks/usePermission';

/**
 * Permission Gate Component
 * Renders children only if user has required permissions
 *
 * @param {Object} props
 * @param {string|string[]} props.permission - Required permission(s)
 * @param {boolean} props.requireAll - If true, requires ALL permissions (default: false)
 * @param {React.ReactNode} props.children - Content to render if authorized
 * @param {React.ReactNode} props.fallback - Content to render if not authorized
 * @returns {React.ReactElement|null}
 */
export const PermissionGate = ({
  permission,
  requireAll = false,
  children,
  fallback = null,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  let isAuthorized = false;

  if (typeof permission === 'string') {
    // Single permission
    isAuthorized = hasPermission(permission);
  } else if (Array.isArray(permission)) {
    // Multiple permissions
    isAuthorized = requireAll
      ? hasAllPermissions(permission)
      : hasAnyPermission(permission);
  }

  return isAuthorized ? children : fallback;
};

export default PermissionGate;
