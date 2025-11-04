/**
 * Authentication Feature Module
 *
 * Handles user authentication, authorization, and session management
 *
 * Public API:
 * - Components: LoginForm, ProtectedRoute
 * - Hooks: useAuth, useRequireAuth
 * - Services: authService
 * - Types: User, LoginCredentials, AuthResponse, etc.
 */

// Export components
export { LoginForm, ProtectedRoute } from './components';

// Export hooks
export { useAuth, useRequireAuth } from './hooks';

// Export services
export { authService } from './services';

// Export types
export * from './types';
