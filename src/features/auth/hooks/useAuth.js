/**
 * useAuth Hook
 * Primary hook for authentication operations
 */

import { useCallback, useEffect } from 'react';
import { useStore } from '../../../store';
import { authService } from '../services';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const {
    user,
    token,
    refreshToken,
    isAuthenticated,
    isLoading,
    error,
    login: loginAction,
    logout: logoutAction,
    setLoading,
    setError,
    clearError,
  } = useStore();

  /**
   * Login user
   * @param {import('../types').LoginCredentials} credentials
   */
  const login = useCallback(
    async (credentials) => {
      try {
        setLoading(true);
        clearError();

        const response = await authService.login(credentials);

        // Update store with user data and tokens
        loginAction(response.user, response.token, response.refreshToken);

        toast.success(`Welcome back, ${response.user.name}!`);

        return response;
      } catch (err) {
        const errorMessage = err.message || 'Login failed';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [loginAction, setLoading, setError, clearError]
  );

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      logoutAction();
      toast.success('Logged out successfully');
    } catch (err) {
      const errorMessage = err.message || 'Logout failed';
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [logoutAction, setLoading]);

  /**
   * Refresh authentication token
   */
  const refresh = useCallback(async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshToken);

      // Update tokens in store
      useStore.getState().setTokens(response.token, response.refreshToken);

      return response;
    } catch (err) {
      // If refresh fails, logout the user
      logoutAction();
      throw err;
    }
  }, [refreshToken, logoutAction]);

  /**
   * Verify current token and refresh if needed
   */
  const verifySession = useCallback(async () => {
    if (!token) return false;

    try {
      const isValid = await authService.verifyToken(token);
      if (!isValid && refreshToken) {
        await refresh();
      }
      return isValid;
    } catch {
      return false;
    }
  }, [token, refreshToken, refresh]);

  // Auto-verify session on mount
  useEffect(() => {
    if (isAuthenticated && token) {
      verifySession();
    }
  }, []); // Only run on mount

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    logout,
    refresh,
    verifySession,
    clearError,

    // Utilities
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager' || user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isInstructor: user?.role === 'instructor',
    hasRole: (role) => user?.role === role,
  };
};
