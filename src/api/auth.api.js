/**
 * Authentication API Client
 * Handles all authentication-related API requests
 */

import axiosInstance from '../lib/axios';

/**
 * Login with email and password
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @param {boolean} [credentials.rememberMe] - Remember user session
 * @returns {Promise<Object>} Auth response with user, token, and refreshToken
 */
export const loginWithEmail = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', {
    email: credentials.email,
    password: credentials.password,
    rememberMe: credentials.rememberMe || false,
  });

  return response.data;
};

/**
 * Login with PIN
 * @param {Object} credentials - PIN login credentials
 * @param {string} credentials.username - Username or email
 * @param {string} credentials.pin - User PIN (4-6 digits)
 * @param {boolean} [credentials.rememberMe] - Remember user session
 * @returns {Promise<Object>} Auth response with user, token, and refreshToken
 */
export const loginWithPIN = async (credentials) => {
  const response = await axiosInstance.post('/auth/login/pin', {
    username: credentials.username,
    pin: credentials.pin,
    rememberMe: credentials.rememberMe || false,
  });

  return response.data;
};

/**
 * Logout current user
 * @returns {Promise<Object>} Logout response
 */
export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New tokens
 */
export const refreshAccessToken = async (refreshToken) => {
  const response = await axiosInstance.post('/auth/refresh', {
    refreshToken,
  });

  return response.data;
};

/**
 * Get current authenticated user
 * @returns {Promise<Object>} User object
 */
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return response.data;
};

/**
 * Set user PIN
 * @param {Object} data - PIN data
 * @param {string} data.userId - User ID
 * @param {string} data.newPIN - New PIN (4-6 digits)
 * @returns {Promise<Object>} Success response
 */
export const setUserPIN = async (data) => {
  const response = await axiosInstance.post('/auth/pin/set', {
    userId: data.userId,
    newPIN: data.newPIN,
  });

  return response.data;
};

/**
 * Disable user PIN
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Success response
 */
export const disableUserPIN = async (userId) => {
  const response = await axiosInstance.post('/auth/pin/disable', {
    userId,
  });

  return response.data;
};

/**
 * Reset PIN attempts (admin action)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Success response
 */
export const resetPINAttempts = async (userId) => {
  const response = await axiosInstance.post('/auth/pin/reset-attempts', {
    userId,
  });

  return response.data;
};

// Export all auth API functions
export const authApi = {
  loginWithEmail,
  loginWithPIN,
  logout,
  refreshAccessToken,
  getCurrentUser,
  setUserPIN,
  disableUserPIN,
  resetPINAttempts,
};

export default authApi;
