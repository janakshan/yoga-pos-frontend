/**
 * @fileoverview Role service for managing roles
 * This is a mock service that simulates API calls with local data
 */

import { DEFAULT_ROLES } from '../types/role.types.js';

// Generate mock role data with IDs
const generateMockRoles = () => {
  return DEFAULT_ROLES.map((role, index) => ({
    id: `role_${index + 1}`,
    ...role,
    isActive: true,
    userCount: Math.floor(Math.random() * 20) + 1,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system',
  }));
};

// Mock data store
let MOCK_ROLES = generateMockRoles();

/**
 * Simulate API delay
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 */
const delay = (min = 300, max = 600) =>
  new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min) + min)));

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
    await delay();

    let result = [...MOCK_ROLES];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        role =>
          role.name.toLowerCase().includes(searchLower) ||
          role.code.toLowerCase().includes(searchLower) ||
          role.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply active status filter
    if (typeof filters.isActive === 'boolean') {
      result = result.filter(role => role.isActive === filters.isActive);
    }

    // Apply system filter
    if (typeof filters.isSystem === 'boolean') {
      result = result.filter(role => role.isSystem === filters.isSystem);
    }

    // Apply sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        const aVal = a[filters.sortBy];
        const bVal = b[filters.sortBy];
        if (aVal < bVal) return -1 * sortOrder;
        if (aVal > bVal) return 1 * sortOrder;
        return 0;
      });
    }

    return result;
  },

  /**
   * Get role by ID
   * @param {string} id - Role ID
   * @returns {Promise<import('../types').Role>}
   */
  async getById(id) {
    await delay();

    const role = MOCK_ROLES.find(r => r.id === id);
    if (!role) {
      throw new Error(`Role with ID ${id} not found`);
    }

    return { ...role };
  },

  /**
   * Get role by code
   * @param {string} code - Role code
   * @returns {Promise<import('../types').Role>}
   */
  async getByCode(code) {
    await delay();

    const role = MOCK_ROLES.find(r => r.code === code);
    if (!role) {
      throw new Error(`Role with code ${code} not found`);
    }

    return { ...role };
  },

  /**
   * Create a new role
   * @param {import('../types').CreateRoleInput} data - Role data
   * @returns {Promise<import('../types').Role>}
   */
  async create(data) {
    await delay();

    // Validate required fields
    if (!data.name || !data.code || !data.description) {
      throw new Error('Name, code, and description are required');
    }

    // Check if role code already exists
    if (MOCK_ROLES.some(r => r.code === data.code)) {
      throw new Error(`Role with code ${data.code} already exists`);
    }

    // Validate code format (lowercase, no spaces)
    if (!/^[a-z_]+$/.test(data.code)) {
      throw new Error('Role code must be lowercase letters and underscores only');
    }

    const newRole = {
      id: `role_${Date.now()}`,
      name: data.name,
      code: data.code,
      description: data.description,
      permissions: data.permissions || [],
      isSystem: false, // Custom roles are never system roles
      isActive: data.isActive ?? true,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current_user', // Would be actual user ID in real app
    };

    MOCK_ROLES.push(newRole);
    return { ...newRole };
  },

  /**
   * Update a role
   * @param {string} id - Role ID
   * @param {import('../types').UpdateRoleInput} data - Updated data
   * @returns {Promise<import('../types').Role>}
   */
  async update(id, data) {
    await delay();

    const index = MOCK_ROLES.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Role with ID ${id} not found`);
    }

    // Prevent updating system roles
    if (MOCK_ROLES[index].isSystem && data.permissions) {
      throw new Error('Cannot modify permissions of system roles');
    }

    const updated = {
      ...MOCK_ROLES[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    MOCK_ROLES[index] = updated;
    return { ...updated };
  },

  /**
   * Delete a role
   * @param {string} id - Role ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async delete(id) {
    await delay();

    const index = MOCK_ROLES.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error(`Role with ID ${id} not found`);
    }

    const role = MOCK_ROLES[index];

    // Prevent deleting system roles
    if (role.isSystem) {
      throw new Error('Cannot delete system roles');
    }

    // Check if role has assigned users
    if (role.userCount > 0) {
      throw new Error(`Cannot delete role with ${role.userCount} assigned user(s). Reassign users first.`);
    }

    MOCK_ROLES.splice(index, 1);
    return { success: true, message: 'Role deleted successfully' };
  },

  /**
   * Add permissions to a role
   * @param {string} roleId - Role ID
   * @param {string[]} permissionIds - Permission IDs to add
   * @returns {Promise<import('../types').Role>}
   */
  async addPermissions(roleId, permissionIds) {
    await delay();

    const index = MOCK_ROLES.findIndex(r => r.id === roleId);
    if (index === -1) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    const role = MOCK_ROLES[index];
    const existingPermissions = new Set(role.permissions);
    permissionIds.forEach(id => existingPermissions.add(id));

    const updated = {
      ...role,
      permissions: Array.from(existingPermissions),
      updatedAt: new Date().toISOString(),
    };

    MOCK_ROLES[index] = updated;
    return { ...updated };
  },

  /**
   * Remove permissions from a role
   * @param {string} roleId - Role ID
   * @param {string[]} permissionIds - Permission IDs to remove
   * @returns {Promise<import('../types').Role>}
   */
  async removePermissions(roleId, permissionIds) {
    await delay();

    const index = MOCK_ROLES.findIndex(r => r.id === roleId);
    if (index === -1) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    const role = MOCK_ROLES[index];
    const permissionsToRemove = new Set(permissionIds);
    const updatedPermissions = role.permissions.filter(p => !permissionsToRemove.has(p));

    const updated = {
      ...role,
      permissions: updatedPermissions,
      updatedAt: new Date().toISOString(),
    };

    MOCK_ROLES[index] = updated;
    return { ...updated };
  },

  /**
   * Set role permissions (replace all)
   * @param {string} roleId - Role ID
   * @param {string[]} permissionIds - Permission IDs
   * @returns {Promise<import('../types').Role>}
   */
  async setPermissions(roleId, permissionIds) {
    await delay();

    const index = MOCK_ROLES.findIndex(r => r.id === roleId);
    if (index === -1) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    const updated = {
      ...MOCK_ROLES[index],
      permissions: permissionIds,
      updatedAt: new Date().toISOString(),
    };

    MOCK_ROLES[index] = updated;
    return { ...updated };
  },

  /**
   * Get role statistics
   * @returns {Promise<import('../types').RoleStats>}
   */
  async getStats() {
    await delay();

    const stats = {
      total: MOCK_ROLES.length,
      active: MOCK_ROLES.filter(r => r.isActive).length,
      inactive: MOCK_ROLES.filter(r => !r.isActive).length,
      system: MOCK_ROLES.filter(r => r.isSystem).length,
      custom: MOCK_ROLES.filter(r => !r.isSystem).length,
    };

    return stats;
  },

  /**
   * Clone a role
   * @param {string} roleId - Role ID to clone
   * @param {string} newName - Name for the cloned role
   * @returns {Promise<import('../types').Role>}
   */
  async clone(roleId, newName) {
    await delay();

    const role = MOCK_ROLES.find(r => r.id === roleId);
    if (!role) {
      throw new Error(`Role with ID ${roleId} not found`);
    }

    const newCode = newName.toLowerCase().replace(/\s+/g, '_');

    // Check if code already exists
    if (MOCK_ROLES.some(r => r.code === newCode)) {
      throw new Error(`Role with code ${newCode} already exists`);
    }

    const clonedRole = {
      id: `role_${Date.now()}`,
      name: newName,
      code: newCode,
      description: `Cloned from ${role.name}`,
      permissions: [...role.permissions],
      isSystem: false,
      isActive: true,
      userCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current_user',
    };

    MOCK_ROLES.push(clonedRole);
    return { ...clonedRole };
  },

  /**
   * Get roles by user ID (mock - would query user-role relationships)
   * @param {string} userId - User ID
   * @returns {Promise<import('../types').Role[]>}
   */
  async getByUserId(userId) {
    await delay();
    // Mock implementation - would actually query user-role relationships
    return MOCK_ROLES.filter(r => r.isActive).slice(0, 2);
  },
};

export default roleService;
