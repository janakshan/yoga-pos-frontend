/**
 * Token Storage Utility
 * Handles secure storage and retrieval of authentication tokens
 */

const TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * Store access token
 * @param {string} token - Access token
 */
export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Get access token
 * @returns {string|null} Access token or null
 */
export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Store refresh token
 * @param {string} token - Refresh token
 */
export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

/**
 * Get refresh token
 * @returns {string|null} Refresh token or null
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store user data
 * @param {Object} user - User object
 */
export const setUser = (user) => {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

/**
 * Get user data
 * @returns {Object|null} User object or null
 */
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  return null;
};

/**
 * Store all auth data
 * @param {string} token - Access token
 * @param {string} refreshToken - Refresh token
 * @param {Object} user - User object
 */
export const setAuthData = (token, refreshToken, user) => {
  setAccessToken(token);
  setRefreshToken(refreshToken);
  setUser(user);
};

/**
 * Clear all auth data
 */
export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if tokens exist
 */
export const isAuthenticated = () => {
  return !!getAccessToken();
};

export const tokenStorage = {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  setUser,
  getUser,
  setAuthData,
  clearAuthData,
  isAuthenticated,
};

export default tokenStorage;
