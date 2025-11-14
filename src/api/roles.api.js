/**
 * Roles API Client
 *
 * API endpoints for role management
 */

import axiosInstance from '../lib/axios';

/**
 * Create a new role (Admin Only)
 * POST /api/v1/roles
 */
export const createRole = async (roleData) => {
  const response = await axiosInstance.post('/roles', roleData);
  return response.data;
};

/**
 * Get all roles
 * GET /api/v1/roles
 */
export const getAllRoles = async (params = {}) => {
  const response = await axiosInstance.get('/roles', { params });
  return response.data;
};

/**
 * Get role by ID
 * GET /api/v1/roles/:id
 */
export const getRoleById = async (roleId) => {
  const response = await axiosInstance.get(`/roles/${roleId}`);
  return response.data;
};

/**
 * Update role (Admin Only)
 * PATCH /api/v1/roles/:id
 */
export const updateRole = async (roleId, updates) => {
  const response = await axiosInstance.patch(`/roles/${roleId}`, updates);
  return response.data;
};

/**
 * Delete role (Admin Only)
 * DELETE /api/v1/roles/:id
 */
export const deleteRole = async (roleId) => {
  const response = await axiosInstance.delete(`/roles/${roleId}`);
  return response.data;
};

/**
 * Assign permissions to role (Admin Only)
 * POST /api/v1/roles/:id/permissions
 */
export const assignPermissionsToRole = async (roleId, permissionIds) => {
  const response = await axiosInstance.post(`/roles/${roleId}/permissions`, {
    permissionIds
  });
  return response.data;
};

// Export all functions as a default object
export default {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
};
