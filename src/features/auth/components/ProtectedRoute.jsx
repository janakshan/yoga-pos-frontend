/**
 * ProtectedRoute Component
 * Wrapper component to protect routes that require authentication
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

/**
 * ProtectedRoute Component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string[]} [props.roles] - Required roles to access this route
 * @param {string} [props.redirectTo='/login'] - Redirect path if not authenticated
 */
export const ProtectedRoute = ({ children, roles, redirectTo = '/login' }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role requirements if specified
  if (roles && roles.length > 0) {
    const hasRequiredRole = roles.includes(user?.role);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render children if authenticated and authorized
  return children;
};
