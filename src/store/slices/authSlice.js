/**
 * Authentication Store Slice
 * Manages user authentication state, tokens, and user data
 */

export const createAuthSlice = (set, get) => ({
  // State
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Actions
  setUser: (user) =>
    set((state) => {
      state.user = user;
      state.isAuthenticated = !!user;
    }),

  setTokens: (token, refreshToken) =>
    set((state) => {
      state.token = token;
      state.refreshToken = refreshToken;
    }),

  setLoading: (isLoading) =>
    set((state) => {
      state.isLoading = isLoading;
    }),

  setError: (error) =>
    set((state) => {
      state.error = error;
    }),

  login: (user, token, refreshToken) =>
    set((state) => {
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    }),

  logout: () =>
    set((state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    }),

  updateUser: (updates) =>
    set((state) => {
      if (state.user) {
        state.user = { ...state.user, ...updates };
      }
    }),

  clearError: () =>
    set((state) => {
      state.error = null;
    }),
});
