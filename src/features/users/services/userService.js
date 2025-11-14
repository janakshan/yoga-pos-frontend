/**
 * @fileoverview User service for managing user accounts
 * Service layer with API integration
 */

import {
  createUser as apiCreateUser,
  getAllUsers as apiGetAllUsers,
  getUserStats as apiGetUserStats,
  getUserById as apiGetUserById,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  bulkUpdateUserRoles as apiBulkUpdateUserRoles,
  resetUserPassword as apiResetUserPassword,
} from '../../../api/users.api.js';

/**
 * User Service
 */
export const userService = {
  /**
   * Get all users with pagination
   * @param {Object} [params] - Query parameters (page, limit)
   * @returns {Promise<{data: Array, meta: Object}>}
   */
  async getAll(params = {}) {
    try {
      const response = await apiGetAllUsers(params);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>}
   */
  async getById(id) {
    try {
      const response = await apiGetUserById(id);
      return response.data || response;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Get user statistics
   * @returns {Promise<Object>}
   */
  async getStats() {
    try {
      const response = await apiGetUserStats();
      return response.data || response;
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Create a new user
   * @param {Object} data - User data
   * @returns {Promise<Object>}
   */
  async create(data) {
    try {
      const response = await apiCreateUser(data);
      return response.data || response;
    } catch (error) {
      console.error('Error creating user:', error);
      console.error('Error response:', error.response?.data);
      console.error('Request data:', data);
      throw error;
    }
  },

  /**
   * Update a user
   * @param {string} id - User ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    try {
      const response = await apiUpdateUser(id, data);
      return response.data || response;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async delete(id) {
    try {
      const response = await apiDeleteUser(id);
      return response;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  /**
   * Bulk update user roles
   * @param {string[]} userIds - User IDs
   * @param {string[]} roleIds - Role IDs
   * @returns {Promise<Object>}
   */
  async bulkUpdateRoles(userIds, roleIds) {
    try {
      const response = await apiBulkUpdateUserRoles(userIds, roleIds);
      return response.data || response;
    } catch (error) {
      console.error('Error bulk updating user roles:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Legacy mock methods kept for backwards compatibility
  // These can be removed once all components are updated

  /**
   * Get user by username (uses getAll and filters)
   * @param {string} username - Username
   * @returns {Promise<Object>}
   */
  async getByUsername(username) {
    try {
      const response = await this.getAll();
      const users = response.data || response;
      const user = Array.isArray(users)
        ? users.find(u => u.username === username)
        : null;
      if (!user) {
        throw new Error(`User with username ${username} not found`);
      }
      return user;
    } catch (error) {
      console.error(`Error fetching user by username ${username}:`, error);
      throw error;
    }
  },

  /**
   * Get user by email (uses getAll and filters)
   * @param {string} email - Email address
   * @returns {Promise<Object>}
   */
  async getByEmail(email) {
    try {
      const response = await this.getAll();
      const users = response.data || response;
      const user = Array.isArray(users)
        ? users.find(u => u.email === email)
        : null;
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return user;
    } catch (error) {
      console.error(`Error fetching user by email ${email}:`, error);
      throw error;
    }
  },

  /**
   * Get users by branch (uses getAll with filters)
   * @param {string} branchId - Branch ID
   * @returns {Promise<Array>}
   */
  async getByBranch(branchId) {
    try {
      const response = await this.getAll({ branchId });
      return response.data || response;
    } catch (error) {
      console.error(`Error fetching users for branch ${branchId}:`, error);
      throw error;
    }
  },

  /**
   * Get users by role (uses getAll with filters)
   * @param {string} roleId - Role ID
   * @returns {Promise<Array>}
   */
  async getByRole(roleId) {
    try {
      const response = await this.getAll({ roleId });
      return response.data || response;
    } catch (error) {
      console.error(`Error fetching users for role ${roleId}:`, error);
      throw error;
    }
  },

  /**
   * Assign roles to a user (uses update)
   * @param {string} userId - User ID
   * @param {string[]} roleIds - Role IDs to assign
   * @returns {Promise<Object>}
   */
  async assignRoles(userId, roleIds) {
    try {
      return await this.update(userId, { roles: roleIds });
    } catch (error) {
      console.error(`Error assigning roles to user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Reset user password
   * @param {string} userId - User ID
   * @param {string} newPassword - New password
   * @returns {Promise<Object>}
   */
  async resetPassword(userId, newPassword) {
    try {
      const response = await apiResetUserPassword(userId, newPassword);
      return response.data || response;
    } catch (error) {
      console.error(`Error resetting password for user ${userId}:`, error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },
};

export default userService;
