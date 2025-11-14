/**
 * PermissionGuard Component
 *
 * Route guard component that checks user permissions before rendering children.
 * Can be toggled via settings for easy testing.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';

/**
 * PermissionGuard - Protects routes based on required permissions
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if permission check passes
 * @param {string|string[]} props.permission - Required permission(s)
 * @param {boolean} props.requireAll - If true, user must have ALL permissions
 * @param {string} props.redirectTo - Path to redirect if access denied
 * @param {boolean} props.showMessage - Whether to show access denied message
 */
const PermissionGuard = ({
  children,
  permission,
  requireAll = false,
  redirectTo = '/unauthorized',
  showMessage = false,
}) => {
  const { hasPermission, isGuardsEnabled } = usePermissions();
  const location = useLocation();

  // If guards are disabled, always allow access
  if (!isGuardsEnabled) {
    return <>{children}</>;
  }

  // Check permissions
  const hasAccess = hasPermission(permission, requireAll);

  if (!hasAccess) {
    // Show inline message if requested
    if (showMessage) {
      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <div className="text-center">
            <ShieldExclamationIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You don't have permission to access this feature.
            </p>
            <p className="text-sm text-gray-500">
              Required permission: {Array.isArray(permission) ? permission.join(', ') : permission}
            </p>
          </div>
        </div>
      );
    }

    // Redirect to unauthorized page
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * RouteGuard - Simplified guard for route-level protection
 * Automatically determines required permissions based on route path
 */
export const RouteGuard = ({ children, routePath }) => {
  const { canAccessRoute, isGuardsEnabled } = usePermissions();
  const location = useLocation();

  // If guards are disabled, always allow access
  if (!isGuardsEnabled) {
    return <>{children}</>;
  }

  const hasAccess = canAccessRoute(routePath || location.pathname);

  if (!hasAccess) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PermissionGuard;
