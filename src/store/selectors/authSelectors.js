/**
 * Auth Selectors
 * Optimized selectors for accessing auth state
 */

export const selectUser = (state) => state.user;
export const selectToken = (state) => state.token;
export const selectIsAuthenticated = (state) => state.isAuthenticated;
export const selectAuthLoading = (state) => state.isLoading;
export const selectAuthError = (state) => state.error;
export const selectUserRole = (state) => state.user?.role;
export const selectUserPermissions = (state) => state.user?.permissions || [];
