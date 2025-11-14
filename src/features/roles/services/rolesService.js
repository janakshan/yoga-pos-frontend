/**
 * Roles Service
 *
 * Service layer for role operations
 */

import {
  createRole as apiCreateRole,
  getAllRoles as apiGetAllRoles,
  getRoleById as apiGetRoleById,
  updateRole as apiUpdateRole,
  deleteRole as apiDeleteRole,
  assignPermissionsToRole as apiAssignPermissionsToRole,
} from '../../../api/roles.api';

/**
 * Get all roles
 */
export const getList = async (params = {}) => {
  try {
    const response = await apiGetAllRoles(params);
    return Array.isArray(response) ? response : response.data || response;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

/**
 * Get role by ID
 */
export const getById = async (id) => {
  try {
    const response = await apiGetRoleById(id);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching role ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new role
 */
export const create = async (data) => {
  try {
    const response = await apiCreateRole(data);
    return response.data || response;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

/**
 * Update an existing role
 */
export const update = async (id, data) => {
  try {
    const response = await apiUpdateRole(id, data);
    return response.data || response;
  } catch (error) {
    console.error(`Error updating role ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a role
 */
export const remove = async (id) => {
  try {
    const response = await apiDeleteRole(id);
    return response;
  } catch (error) {
    console.error(`Error deleting role ${id}:`, error);
    throw error;
  }
};

/**
 * Assign permissions to a role
 */
export const assignPermissions = async (roleId, permissionIds) => {
  try {
    const response = await apiAssignPermissionsToRole(roleId, permissionIds);
    return response.data || response;
  } catch (error) {
    console.error(`Error assigning permissions to role ${roleId}:`, error);
    throw error;
  }
};

// Export as a service object
export const rolesService = {
  getList,
  getById,
  create,
  update,
  remove,
  assignPermissions,
};

export default rolesService;
