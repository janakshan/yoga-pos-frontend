/**
 * Users API Client
 *
 * API endpoints for user management
 */

import axiosInstance from '../lib/axios';

/**
 * Create a new user (Admin/Manager Only)
 * POST /api/v1/users
 */
export const createUser = async (userData) => {
  const response = await axiosInstance.post('/users', userData);
  return response.data;
};

/**
 * Get all users with pagination
 * GET /api/v1/users
 */
export const getAllUsers = async (params = {}) => {
  const response = await axiosInstance.get('/users', { params });
  return response.data;
};

/**
 * Get user statistics (Admin Only)
 * GET /api/v1/users/stats
 */
export const getUserStats = async () => {
  const response = await axiosInstance.get('/users/stats');
  return response.data;
};

/**
 * Get user by ID
 * GET /api/v1/users/:id
 */
export const getUserById = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

/**
 * Update user (Admin/Manager Only)
 * PATCH /api/v1/users/:id
 */
export const updateUser = async (userId, updates) => {
  const response = await axiosInstance.patch(`/users/${userId}`, updates);
  return response.data;
};

/**
 * Delete user (Admin Only)
 * DELETE /api/v1/users/:id
 */
export const deleteUser = async (userId) => {
  const response = await axiosInstance.delete(`/users/${userId}`);
  return response.data;
};

/**
 * Bulk update user roles (Admin/Manager Only)
 * POST /api/v1/users/bulk/roles
 */
export const bulkUpdateUserRoles = async (userIds, roleIds) => {
  const response = await axiosInstance.post('/users/bulk/roles', {
    userIds,
    roleIds
  });
  return response.data;
};

/**
 * Reset user password (Admin/Manager Only)
 * POST /api/v1/users/:id/reset-password
 */
export const resetUserPassword = async (userId, newPassword) => {
  const response = await axiosInstance.post(`/users/${userId}/reset-password`, {
    newPassword
  });
  return response.data;
};

// Export all functions as a default object
export default {
  createUser,
  getAllUsers,
  getUserStats,
  getUserById,
  updateUser,
  deleteUser,
  bulkUpdateUserRoles,
  resetUserPassword,
};
