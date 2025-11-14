/**
 * Permissions API Client
 *
 * API endpoints for permission management
 */

import axiosInstance from '../lib/axios';

/**
 * Create a new permission (Admin Only)
 * POST /api/v1/permissions
 */
export const createPermission = async (permissionData) => {
  const response = await axiosInstance.post('/permissions', permissionData);
  return response.data;
};

/**
 * Get all permissions
 * GET /api/v1/permissions
 */
export const getAllPermissions = async (params = {}) => {
  const response = await axiosInstance.get('/permissions', { params });
  return response.data;
};

/**
 * Get permission by ID
 * GET /api/v1/permissions/:id
 */
export const getPermissionById = async (permissionId) => {
  const response = await axiosInstance.get(`/permissions/${permissionId}`);
  return response.data;
};

/**
 * Get permissions by role ID
 * GET /api/v1/permissions/role/:roleId
 */
export const getPermissionsByRole = async (roleId) => {
  const response = await axiosInstance.get(`/permissions/role/${roleId}`);
  return response.data;
};

/**
 * Update permission (Admin Only)
 * PATCH /api/v1/permissions/:id
 */
export const updatePermission = async (permissionId, updates) => {
  const response = await axiosInstance.patch(`/permissions/${permissionId}`, updates);
  return response.data;
};

/**
 * Delete permission (Admin Only)
 * DELETE /api/v1/permissions/:id
 */
export const deletePermission = async (permissionId) => {
  const response = await axiosInstance.delete(`/permissions/${permissionId}`);
  return response.data;
};

// Export all functions as a default object
export default {
  createPermission,
  getAllPermissions,
  getPermissionById,
  getPermissionsByRole,
  updatePermission,
  deletePermission,
};
