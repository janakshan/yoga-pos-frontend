/**
 * @fileoverview Permission service for managing permissions
 * This is a mock service that simulates API calls with local data
 */

import { DEFAULT_PERMISSIONS } from '../types/permission.types.js';

// Generate mock permission data with IDs
const generateMockPermissions = () => {
  return DEFAULT_PERMISSIONS.map((perm, index) => ({
    id: `perm_${index + 1}`,
    ...perm,
    isActive: true,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

// Mock data store
let MOCK_PERMISSIONS = generateMockPermissions();

/**
 * Simulate API delay
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 */
const delay = (min = 300, max = 600) =>
  new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min) + min)));

/**
 * Permission Service
 */
export const permissionService = {
  /**
   * Get all permissions with optional filters
   * @param {import('../types').PermissionFilters} [filters] - Filter options
   * @returns {Promise<import('../types').Permission[]>}
   */
  async getAll(filters = {}) {
    await delay();

    let result = [...MOCK_PERMISSIONS];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        perm =>
          perm.name.toLowerCase().includes(searchLower) ||
          perm.displayName.toLowerCase().includes(searchLower) ||
          perm.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter(perm => perm.category === filters.category);
    }

    // Apply action filter
    if (filters.action) {
      result = result.filter(perm => perm.action === filters.action);
    }

    // Apply active status filter
    if (typeof filters.isActive === 'boolean') {
      result = result.filter(perm => perm.isActive === filters.isActive);
    }

    return result;
  },

  /**
   * Get permissions grouped by category
   * @returns {Promise<import('../types').PermissionGroup[]>}
   */
  async getGroupedByCategory() {
    await delay();

    const permissions = [...MOCK_PERMISSIONS];
    const grouped = {};

    // Group permissions by category
    permissions.forEach(perm => {
      if (!grouped[perm.category]) {
        grouped[perm.category] = {
          category: perm.category,
          displayName: formatCategoryName(perm.category),
          permissions: [],
        };
      }
      grouped[perm.category].permissions.push(perm);
    });

    return Object.values(grouped);
  },

  /**
   * Get permission by ID
   * @param {string} id - Permission ID
   * @returns {Promise<import('../types').Permission>}
   */
  async getById(id) {
    await delay();

    const permission = MOCK_PERMISSIONS.find(p => p.id === id);
    if (!permission) {
      throw new Error(`Permission with ID ${id} not found`);
    }

    return { ...permission };
  },

  /**
   * Get permission by name
   * @param {string} name - Permission name (e.g., "pos:create")
   * @returns {Promise<import('../types').Permission>}
   */
  async getByName(name) {
    await delay();

    const permission = MOCK_PERMISSIONS.find(p => p.name === name);
    if (!permission) {
      throw new Error(`Permission with name ${name} not found`);
    }

    return { ...permission };
  },

  /**
   * Create a new permission
   * @param {import('../types').CreatePermissionInput} data - Permission data
   * @returns {Promise<import('../types').Permission>}
   */
  async create(data) {
    await delay();

    // Validate required fields
    if (!data.name || !data.displayName || !data.category || !data.action) {
      throw new Error('Name, displayName, category, and action are required');
    }

    // Check if permission name already exists
    if (MOCK_PERMISSIONS.some(p => p.name === data.name)) {
      throw new Error(`Permission with name ${data.name} already exists`);
    }

    const newPermission = {
      id: `perm_${Date.now()}`,
      ...data,
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MOCK_PERMISSIONS.push(newPermission);
    return { ...newPermission };
  },

  /**
   * Update a permission
   * @param {string} id - Permission ID
   * @param {import('../types').UpdatePermissionInput} data - Updated data
   * @returns {Promise<import('../types').Permission>}
   */
  async update(id, data) {
    await delay();

    const index = MOCK_PERMISSIONS.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Permission with ID ${id} not found`);
    }

    const updated = {
      ...MOCK_PERMISSIONS[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    MOCK_PERMISSIONS[index] = updated;
    return { ...updated };
  },

  /**
   * Delete a permission
   * @param {string} id - Permission ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async delete(id) {
    await delay();

    const index = MOCK_PERMISSIONS.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error(`Permission with ID ${id} not found`);
    }

    MOCK_PERMISSIONS.splice(index, 1);
    return { success: true, message: 'Permission deleted successfully' };
  },

  /**
   * Bulk activate/deactivate permissions
   * @param {string[]} ids - Permission IDs
   * @param {boolean} isActive - Active status
   * @returns {Promise<{success: boolean, count: number}>}
   */
  async bulkUpdateStatus(ids, isActive) {
    await delay();

    let count = 0;
    ids.forEach(id => {
      const index = MOCK_PERMISSIONS.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PERMISSIONS[index] = {
          ...MOCK_PERMISSIONS[index],
          isActive,
          updatedAt: new Date().toISOString(),
        };
        count++;
      }
    });

    return { success: true, count };
  },

  /**
   * Get permissions by IDs
   * @param {string[]} ids - Permission IDs
   * @returns {Promise<import('../types').Permission[]>}
   */
  async getByIds(ids) {
    await delay();

    return MOCK_PERMISSIONS.filter(p => ids.includes(p.id));
  },

  /**
   * Get permissions by names
   * @param {string[]} names - Permission names
   * @returns {Promise<import('../types').Permission[]>}
   */
  async getByNames(names) {
    await delay();

    return MOCK_PERMISSIONS.filter(p => names.includes(p.name));
  },

  /**
   * Reset permissions to default
   * @returns {Promise<{success: boolean, count: number}>}
   */
  async resetToDefault() {
    await delay();

    MOCK_PERMISSIONS = generateMockPermissions();
    return { success: true, count: MOCK_PERMISSIONS.length };
  },
};

/**
 * Format category name for display
 * @param {string} category - Category code
 * @returns {string}
 */
function formatCategoryName(category) {
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default permissionService;
