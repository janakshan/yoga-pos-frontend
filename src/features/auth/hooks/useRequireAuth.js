/**
 * useRequireAuth Hook
 * Hook to enforce authentication on a component/page
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

/**
 * Require authentication for a component
 * Redirects to login if not authenticated
 * @param {Object} options
 * @param {string} [options.redirectTo='/login'] - Redirect path if not authenticated
 * @param {string[]} [options.roles] - Required roles (if any)
 */
export const useRequireAuth = (options = {}) => {
  const { redirectTo = '/login', roles } = options;
  const { isAuthenticated, user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for loading to complete
    if (isLoading) return;

    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate(redirectTo, { replace: true });
      return;
    }

    // Check role requirements if specified
    if (roles && roles.length > 0) {
      const hasRequiredRole = roles.includes(user?.role);
      if (!hasRequiredRole) {
        navigate('/unauthorized', { replace: true });
      }
    }
  }, [isAuthenticated, user, isLoading, navigate, redirectTo, roles]);

  return { isAuthenticated, user, isLoading };
};
