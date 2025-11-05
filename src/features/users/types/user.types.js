/**
 * @fileoverview User type definitions
 */

/**
 * User status
 * @readonly
 * @enum {string}
 */
export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
};

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} username - Unique username
 * @property {string} email - User email address
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} fullName - Full name (computed)
 * @property {string} phone - Phone number
 * @property {string} avatar - Avatar URL
 * @property {string[]} roles - Array of role IDs assigned to user
 * @property {string[]} permissions - Computed array of all permissions (from roles)
 * @property {UserStatus} status - Account status
 * @property {string} [branchId] - Associated branch ID (optional)
 * @property {string} [branchName] - Associated branch name
 * @property {Date|string} [lastLogin] - Last login timestamp
 * @property {Date|string} [passwordChangedAt] - Last password change
 * @property {boolean} [mustChangePassword] - Require password change on next login
 * @property {Object} [preferences] - User preferences (theme, language, etc.)
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 * @property {string} createdBy - User ID who created this account
 */

/**
 * @typedef {Object} CreateUserInput
 * @property {string} username - Unique username
 * @property {string} email - User email address
 * @property {string} password - User password
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} [phone] - Phone number
 * @property {string[]} roles - Array of role IDs to assign
 * @property {UserStatus} [status=active] - Initial account status
 * @property {string} [branchId] - Associated branch ID
 * @property {boolean} [mustChangePassword=true] - Require password change on first login
 */

/**
 * @typedef {Object} UpdateUserInput
 * @property {string} [email] - User email address
 * @property {string} [firstName] - First name
 * @property {string} [lastName] - Last name
 * @property {string} [phone] - Phone number
 * @property {string} [avatar] - Avatar URL
 * @property {string[]} [roles] - Array of role IDs
 * @property {UserStatus} [status] - Account status
 * @property {string} [branchId] - Associated branch ID
 */

/**
 * @typedef {Object} ChangePasswordInput
 * @property {string} currentPassword - Current password (for verification)
 * @property {string} newPassword - New password
 * @property {string} confirmPassword - Password confirmation
 */

/**
 * @typedef {Object} ResetPasswordInput
 * @property {string} newPassword - New password
 * @property {boolean} [mustChangePassword=false] - Require password change on next login
 */

/**
 * @typedef {Object} UserFilters
 * @property {string} [search] - Search term (username, email, name)
 * @property {UserStatus} [status] - Filter by status
 * @property {string} [roleId] - Filter by role ID
 * @property {string} [branchId] - Filter by branch ID
 * @property {string} [sortBy] - Sort field (username, email, createdAt, lastLogin)
 * @property {string} [sortOrder] - Sort order (asc, desc)
 */

/**
 * @typedef {Object} UserStats
 * @property {number} total - Total users
 * @property {number} active - Active users
 * @property {number} inactive - Inactive users
 * @property {number} suspended - Suspended users
 * @property {number} pending - Pending users
 * @property {number} loggedInToday - Users logged in today
 */

/**
 * @typedef {Object} UserActivity
 * @property {string} id - Activity ID
 * @property {string} userId - User ID
 * @property {string} action - Action performed
 * @property {string} resource - Resource affected
 * @property {string} [details] - Additional details
 * @property {string} [ipAddress] - IP address
 * @property {string} [userAgent] - User agent string
 * @property {Date|string} timestamp - When action occurred
 */
