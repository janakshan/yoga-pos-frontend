/**
 * Authentication Types
 * Type definitions for authentication-related data structures
 */

/**
 * @typedef {Object} User
 * @property {string} id - User ID
 * @property {string} email - User email
 * @property {string} name - User full name
 * @property {string} role - User role (e.g., 'admin', 'manager', 'staff')
 * @property {string} [avatar] - User avatar URL
 * @property {string} [phone] - User phone number
 * @property {string} createdAt - Account creation date
 * @property {string} [lastLogin] - Last login timestamp
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email - User email
 * @property {string} password - User password
 * @property {boolean} [rememberMe] - Remember user session
 */

/**
 * @typedef {Object} AuthResponse
 * @property {User} user - User data
 * @property {string} token - Access token
 * @property {string} refreshToken - Refresh token
 * @property {number} expiresIn - Token expiration time in seconds
 */

/**
 * @typedef {Object} AuthError
 * @property {string} message - Error message
 * @property {string} [code] - Error code
 * @property {Object} [details] - Additional error details
 */

// User roles enum
export const UserRoles = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  INSTRUCTOR: 'instructor',
};

// Auth error codes
export const AuthErrorCodes = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EXPIRED_TOKEN: 'EXPIRED_TOKEN',
  INVALID_TOKEN: 'INVALID_TOKEN',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
};
