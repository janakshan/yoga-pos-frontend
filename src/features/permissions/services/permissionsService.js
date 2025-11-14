/**
 * Permissions Service
 *
 * Service layer for permission operations
 */

import {
  createPermission as apiCreatePermission,
  getAllPermissions as apiGetAllPermissions,
  getPermissionById as apiGetPermissionById,
  getPermissionsByRole as apiGetPermissionsByRole,
  updatePermission as apiUpdatePermission,
  deletePermission as apiDeletePermission,
} from '../../../api/permissions.api';

/**
 * Get all permissions
 */
export const getList = async (params = {}) => {
  try {
    const response = await apiGetAllPermissions(params);
    return response.data || response;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

/**
 * Get permission by ID
 */
export const getById = async (id) => {
  try {
    const response = await apiGetPermissionById(id);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching permission ${id}:`, error);
    throw error;
  }
};

/**
 * Get permissions by role ID
 */
export const getByRole = async (roleId) => {
  try {
    const response = await apiGetPermissionsByRole(roleId);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching permissions for role ${roleId}:`, error);
    throw error;
  }
};

/**
 * Create a new permission
 */
export const create = async (data) => {
  try {
    const response = await apiCreatePermission(data);
    return response.data || response;
  } catch (error) {
    console.error('Error creating permission:', error);
    throw error;
  }
};

/**
 * Update an existing permission
 */
export const update = async (id, data) => {
  try {
    const response = await apiUpdatePermission(id, data);
    return response.data || response;
  } catch (error) {
    console.error(`Error updating permission ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a permission
 */
export const remove = async (id) => {
  try {
    const response = await apiDeletePermission(id);
    return response;
  } catch (error) {
    console.error(`Error deleting permission ${id}:`, error);
    throw error;
  }
};

// Export as a service object
export const permissionsService = {
  getList,
  getById,
  getByRole,
  create,
  update,
  remove,
};

export default permissionsService;
