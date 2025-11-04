import { useStore } from '@/store';
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
} from '@/store';

/**
 * Custom hook for authentication
 * Provides easy access to auth state and actions
 */
export const useAuth = () => {
  const user = useStore(selectUser);
  const isAuthenticated = useStore(selectIsAuthenticated);
  const isLoading = useStore(selectAuthLoading);
  const error = useStore(selectAuthError);

  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);
  const updateUser = useStore((state) => state.updateUser);
  const setLoading = useStore((state) => state.setLoading);
  const setError = useStore((state) => state.setError);
  const clearError = useStore((state) => state.clearError);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    setLoading,
    setError,
    clearError,
  };
};
