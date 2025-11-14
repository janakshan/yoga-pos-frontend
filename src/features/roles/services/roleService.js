/**
 * @fileoverview Role service for managing roles
 * Service layer with API integration
 */

import {
  createRole as apiCreateRole,
  getAllRoles as apiGetAllRoles,
  getRoleById as apiGetRoleById,
  updateRole as apiUpdateRole,
  deleteRole as apiDeleteRole,
  assignPermissionsToRole as apiAssignPermissionsToRole,
} from '../../../api/roles.api.js';

/**
 * Role Service
 */
export const roleService = {
  /**
   * Get all roles with optional filters
   * @param {import('../types').RoleFilters} [filters] - Filter options
   * @returns {Promise<import('../types').Role[]>}
   */
  async getAll(filters = {}) {
    try {
      const response = await apiGetAllRoles(filters);
      return Array.isArray(response) ? response : response.data || response;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  /**
   * Get role by ID
   * @param {string} id - Role ID
   * @returns {Promise<import('../types').Role>}
   */
  async getById(id) {
    try {
      const response = await apiGetRoleById(id);
      return response.data || response;
    } catch (error) {
      console.error(`Error fetching role ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get role by code
   * @param {string} code - Role code
   * @returns {Promise<import('../types').Role>}
   */
  async getByCode(code) {
    try {
      // Get all roles and filter by code (API doesn't have getByCode endpoint)
      const roles = await this.getAll();
      const role = roles.find(r => r.code === code);
      if (!role) {
        throw new Error(`Role with code ${code} not found`);
      }
      return role;
    } catch (error) {
      console.error(`Error fetching role by code ${code}:`, error);
      throw error;
    }
  },

  /**
   * Create a new role
   * @param {import('../types').CreateRoleInput} data - Role data
   * @returns {Promise<import('../types').Role>}
   */
  async create(data) {
    try {
      const response = await apiCreateRole(data);
      return response.data || response;
    } catch (error) {
      console.error('Error creating role:', error);
      console.error('Error response:', error.response?.data);
      console.error('Request data:', data);
      throw error;
    }
  },

  /**
   * Update a role
   * @param {string} id - Role ID
   * @param {import('../types').UpdateRoleInput} data - Updated data
   * @returns {Promise<import('../types').Role>}
   */
  async update(id, data) {
    try {
      const response = await apiUpdateRole(id, data);
      return response.data || response;
    } catch (error) {
      console.error(`Error updating role ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a role
   * @param {string} id - Role ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async delete(id) {
    try {
      const response = await apiDeleteRole(id);
      return response;
    } catch (error) {
      console.error(`Error deleting role ${id}:`, error);
      throw error;
    }
  },

  /**
   * Add permissions to a role
   * @param {string} roleId - Role ID
   * @param {string[]} permissionIds - Permission IDs to add
   * @returns {Promise<import('../types').Role>}
   */
  async addPermissions(roleId, permissionIds) {
    try {
      // Get current role to merge permissions
      const role = await this.getById(roleId);
      const existingPermissions = role.permissions?.map(p => p.id || p) || [];
      const allPermissions = [...new Set([...existingPermissions, ...permissionIds])];

      // Use setPermissions API endpoint
      const response = await apiAssignPermissionsToRole(roleId, allPermissions);
      return response.data || response;
    } catch (error) {
      console.error(`Error adding permissions to role ${roleId}:`, error);
      throw error;
    }
  },

  /**
   * Remove permissions from a role
   * @param {string} roleId - Role ID
   * @param {string[]} permissionIds - Permission IDs to remove
   * @returns {Promise<import('../types').Role>}
   */
  async removePermissions(roleId, permissionIds) {
    try {
      // Get current role and filter out permissions to remove
      const role = await this.getById(roleId);
      const existingPermissions = role.permissions?.map(p => p.id || p) || [];
      const permissionsToRemove = new Set(permissionIds);
      const updatedPermissions = existingPermissions.filter(p => !permissionsToRemove.has(p));

      // Use setPermissions API endpoint
      const response = await apiAssignPermissionsToRole(roleId, updatedPermissions);
      return response.data || response;
    } catch (error) {
      console.error(`Error removing permissions from role ${roleId}:`, error);
      throw error;
    }
  },

  /**
   * Set role permissions (replace all)
   * @param {string} roleId - Role ID
   * @param {string[]} permissionIds - Permission IDs
   * @returns {Promise<import('../types').Role>}
   */
  async setPermissions(roleId, permissionIds) {
    try {
      const response = await apiAssignPermissionsToRole(roleId, permissionIds);
      return response.data || response;
    } catch (error) {
      console.error(`Error assigning permissions to role ${roleId}:`, error);
      throw error;
    }
  },

  /**
   * Get role statistics
   * @returns {Promise<import('../types').RoleStats>}
   */
  async getStats() {
    try {
      // Get all roles and calculate stats (API doesn't have stats endpoint)
      const roles = await this.getAll();

      const stats = {
        total: roles.length,
        active: roles.filter(r => r.isActive).length,
        inactive: roles.filter(r => !r.isActive).length,
        system: roles.filter(r => r.isSystem).length,
        custom: roles.filter(r => !r.isSystem).length,
      };

      return stats;
    } catch (error) {
      console.error('Error fetching role statistics:', error);
      throw error;
    }
  },

  /**
   * Clone a role
   * @param {string} roleId - Role ID to clone
   * @param {string} newName - Name for the cloned role
   * @returns {Promise<import('../types').Role>}
   */
  async clone(roleId, newName) {
    try {
      // Get the role to clone
      const role = await this.getById(roleId);

      const newCode = newName.toLowerCase().replace(/\s+/g, '_');

      // Create new role with same permissions
      const permissionIds = role.permissions?.map(p => p.id || p) || [];
      const clonedRoleData = {
        name: newName,
        code: newCode,
        description: `Cloned from ${role.name}`,
        isActive: true,
      };

      const clonedRole = await this.create(clonedRoleData);

      // Assign the same permissions
      if (permissionIds.length > 0) {
        await this.setPermissions(clonedRole.id, permissionIds);
      }

      return clonedRole;
    } catch (error) {
      console.error(`Error cloning role ${roleId}:`, error);
      throw error;
    }
  },

  /**
   * Get roles by user ID (would query user-role relationships via users API)
   * @param {string} userId - User ID
   * @returns {Promise<import('../types').Role[]>}
   */
  async getByUserId(userId) {
    try {
      // This would typically be handled by the users API
      // For now, return empty array as placeholder
      console.warn('getByUserId not yet implemented - would use users API');
      return [];
    } catch (error) {
      console.error(`Error fetching roles for user ${userId}:`, error);
      throw error;
    }
  },
};

export default roleService;
