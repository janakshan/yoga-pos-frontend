/**
 * Authentication Service
 * Handles authentication API calls with proper error handling
 */

import { AuthErrorCodes } from '../types';
import authApi from '../../../api/auth.api';
import tokenStorage from '../../../lib/tokenStorage';

/**
 * Transform API error to consistent error format
 * @param {Error} error - API error
 * @returns {Object} Formatted error object
 */
const handleAuthError = (error) => {
  // Network errors
  if (!error.response) {
    return {
      message: 'Network error. Please check your internet connection.',
      code: AuthErrorCodes.NETWORK_ERROR,
    };
  }

  // Get error data from response
  const { status, data } = error.response;

  // Map HTTP status codes to auth error codes
  switch (status) {
    case 400:
      return {
        message: data?.message || 'Invalid request data',
        code: AuthErrorCodes.INVALID_CREDENTIALS,
        details: data?.details,
      };

    case 401:
      return {
        message: data?.message || 'Invalid credentials',
        code: AuthErrorCodes.INVALID_CREDENTIALS,
      };

    case 404:
      return {
        message: data?.message || 'User not found',
        code: AuthErrorCodes.USER_NOT_FOUND,
      };

    case 423:
      return {
        message: data?.message || 'Account locked',
        code: AuthErrorCodes.PIN_LOCKED,
      };

    default:
      return {
        message: data?.message || 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
      };
  }
};

/**
 * Login with email and password
 * @param {import('../types').LoginCredentials} credentials
 * @returns {Promise<import('../types').AuthResponse>}
 */
export const login = async (credentials) => {
  try {
    // Validate input
    if (!credentials.email || !credentials.password) {
      throw {
        message: 'Email and password are required',
        code: AuthErrorCodes.INVALID_CREDENTIALS,
      };
    }

    // Call API
    const response = await authApi.loginWithEmail(credentials);

    // Store tokens
    tokenStorage.setAuthData(
      response.token,
      response.refreshToken,
      response.user
    );

    return response;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Login with PIN
 * @param {import('../types').PINLoginCredentials} credentials
 * @returns {Promise<import('../types').AuthResponse>}
 */
export const loginWithPIN = async (credentials) => {
  try {
    // Validate input
    if (!credentials.username || !credentials.pin) {
      throw {
        message: 'Username and PIN are required',
        code: AuthErrorCodes.INVALID_CREDENTIALS,
      };
    }

    // Validate PIN format (4-6 digits)
    if (!/^\d{4,6}$/.test(credentials.pin)) {
      throw {
        message: 'PIN must be 4-6 digits',
        code: AuthErrorCodes.INVALID_PIN,
      };
    }

    // Call API
    const response = await authApi.loginWithPIN(credentials);

    // Store tokens
    tokenStorage.setAuthData(
      response.token,
      response.refreshToken,
      response.user
    );

    return response;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Logout current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // Call logout API
    await authApi.logout();
  } catch (error) {
    // Log error but don't throw - we still want to clear local data
    console.error('Logout API error:', error);
  } finally {
    // Always clear local tokens
    tokenStorage.clearAuthData();
  }
};

/**
 * Refresh access token
 * @param {string} refreshToken
 * @returns {Promise<{token: string, refreshToken: string, expiresIn: number}>}
 */
export const refreshToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw {
        message: 'Refresh token is required',
        code: AuthErrorCodes.INVALID_TOKEN,
      };
    }

    // Call API
    const response = await authApi.refreshAccessToken(refreshToken);

    // Update stored tokens
    tokenStorage.setAccessToken(response.token);
    tokenStorage.setRefreshToken(response.refreshToken);

    return response;
  } catch (error) {
    // Clear tokens on refresh failure
    tokenStorage.clearAuthData();
    throw handleAuthError(error);
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<import('../types').User>}
 */
export const getCurrentUser = async () => {
  try {
    const token = tokenStorage.getAccessToken();

    if (!token) {
      throw {
        message: 'No authentication token found',
        code: AuthErrorCodes.UNAUTHORIZED,
      };
    }

    // Call API
    const user = await authApi.getCurrentUser();

    // Update stored user data
    tokenStorage.setUser(user);

    return user;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Verify if token is valid
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export const verifyToken = async (token) => {
  try {
    if (!token) {
      return false;
    }

    await getCurrentUser();
    return true;
  } catch {
    return false;
  }
};

/**
 * Set user PIN
 * @param {string} userId - User ID
 * @param {string} newPIN - New PIN (4-6 digits)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const setPIN = async (userId, newPIN) => {
  try {
    // Validate PIN format
    if (!/^\d{4,6}$/.test(newPIN)) {
      throw {
        message: 'PIN must be 4-6 digits',
        code: AuthErrorCodes.INVALID_PIN,
      };
    }

    // Call API
    const response = await authApi.setUserPIN({ userId, newPIN });

    return response;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Disable PIN authentication
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const disablePIN = async (userId) => {
  try {
    if (!userId) {
      throw {
        message: 'User ID is required',
        code: AuthErrorCodes.INVALID_CREDENTIALS,
      };
    }

    // Call API
    const response = await authApi.disableUserPIN(userId);

    return response;
  } catch (error) {
    throw handleAuthError(error);
  }
};

/**
 * Reset PIN attempts (admin action)
 * @param {string} userId - User ID
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const resetPINAttempts = async (userId) => {
  try {
    if (!userId) {
      throw {
        message: 'User ID is required',
        code: AuthErrorCodes.INVALID_CREDENTIALS,
      };
    }

    // Call API
    const response = await authApi.resetPINAttempts(userId);

    return response;
  } catch (error) {
    throw handleAuthError(error);
  }
};

// Export auth service
export const authService = {
  login,
  loginWithPIN,
  logout,
  refreshToken,
  getCurrentUser,
  verifyToken,
  setPIN,
  disablePIN,
  resetPINAttempts,
};

export default authService;
