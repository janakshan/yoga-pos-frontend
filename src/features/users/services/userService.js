/**
 * @fileoverview User service for managing user accounts
 * This is a mock service that simulates API calls with local data
 */

import { UserStatus } from '../types/user.types.js';

// Generate mock user data
const generateMockUsers = () => {
  return [
    {
      id: 'user_1',
      username: 'admin',
      email: 'admin@yoga.com',
      firstName: 'Admin',
      lastName: 'User',
      fullName: 'Admin User',
      phone: '+1 (555) 123-4567',
      avatar: null,
      roles: ['role_1'], // Super Admin
      permissions: ['*'],
      status: UserStatus.ACTIVE,
      branchId: null,
      branchName: null,
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      passwordChangedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      mustChangePassword: false,
      preferences: { theme: 'dark', language: 'en' },
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
    },
    {
      id: 'user_2',
      username: 'manager',
      email: 'manager@yoga.com',
      firstName: 'John',
      lastName: 'Manager',
      fullName: 'John Manager',
      phone: '+1 (555) 234-5678',
      avatar: null,
      roles: ['role_3'], // Manager
      permissions: [],
      status: UserStatus.ACTIVE,
      branchId: 'branch_1',
      branchName: 'Downtown Studio',
      lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      passwordChangedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      mustChangePassword: false,
      preferences: { theme: 'light', language: 'en' },
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user_1',
    },
    {
      id: 'user_3',
      username: 'staff1',
      email: 'staff@yoga.com',
      firstName: 'Jane',
      lastName: 'Staff',
      fullName: 'Jane Staff',
      phone: '+1 (555) 345-6789',
      avatar: null,
      roles: ['role_4'], // Staff
      permissions: [],
      status: UserStatus.ACTIVE,
      branchId: 'branch_1',
      branchName: 'Downtown Studio',
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      passwordChangedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      mustChangePassword: false,
      preferences: { theme: 'light', language: 'en' },
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user_1',
    },
    {
      id: 'user_4',
      username: 'instructor1',
      email: 'instructor@yoga.com',
      firstName: 'Sarah',
      lastName: 'Instructor',
      fullName: 'Sarah Instructor',
      phone: '+1 (555) 456-7890',
      avatar: null,
      roles: ['role_5'], // Instructor
      permissions: [],
      status: UserStatus.ACTIVE,
      branchId: 'branch_1',
      branchName: 'Downtown Studio',
      lastLogin: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      passwordChangedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      mustChangePassword: false,
      preferences: { theme: 'light', language: 'en' },
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user_1',
    },
    {
      id: 'user_5',
      username: 'receptionist1',
      email: 'reception@yoga.com',
      firstName: 'Mike',
      lastName: 'Reception',
      fullName: 'Mike Reception',
      phone: '+1 (555) 567-8901',
      avatar: null,
      roles: ['role_6'], // Receptionist
      permissions: [],
      status: UserStatus.INACTIVE,
      branchId: 'branch_2',
      branchName: 'West Side Studio',
      lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      passwordChangedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      mustChangePassword: false,
      preferences: { theme: 'light', language: 'en' },
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user_1',
    },
  ];
};

// Mock data store
let MOCK_USERS = generateMockUsers();

/**
 * Simulate API delay
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 */
const delay = (min = 300, max = 600) =>
  new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min) + min)));

/**
 * User Service
 */
export const userService = {
  /**
   * Get all users with optional filters
   * @param {import('../types').UserFilters} [filters] - Filter options
   * @returns {Promise<import('../types').User[]>}
   */
  async getAll(filters = {}) {
    await delay();

    let result = [...MOCK_USERS];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        user =>
          user.username.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.fullName.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(user => user.status === filters.status);
    }

    // Apply role filter
    if (filters.roleId) {
      result = result.filter(user => user.roles.includes(filters.roleId));
    }

    // Apply branch filter
    if (filters.branchId) {
      result = result.filter(user => user.branchId === filters.branchId);
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
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<import('../types').User>}
   */
  async getById(id) {
    await delay();

    const user = MOCK_USERS.find(u => u.id === id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }

    return { ...user };
  },

  /**
   * Get user by username
   * @param {string} username - Username
   * @returns {Promise<import('../types').User>}
   */
  async getByUsername(username) {
    await delay();

    const user = MOCK_USERS.find(u => u.username === username);
    if (!user) {
      throw new Error(`User with username ${username} not found`);
    }

    return { ...user };
  },

  /**
   * Get user by email
   * @param {string} email - Email address
   * @returns {Promise<import('../types').User>}
   */
  async getByEmail(email) {
    await delay();

    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    return { ...user };
  },

  /**
   * Create a new user
   * @param {import('../types').CreateUserInput} data - User data
   * @returns {Promise<import('../types').User>}
   */
  async create(data) {
    await delay();

    // Validate required fields
    if (!data.username || !data.email || !data.password || !data.firstName || !data.lastName) {
      throw new Error('Username, email, password, firstName, and lastName are required');
    }

    // Check if username already exists
    if (MOCK_USERS.some(u => u.username === data.username)) {
      throw new Error(`Username ${data.username} already exists`);
    }

    // Check if email already exists
    if (MOCK_USERS.some(u => u.email === data.email)) {
      throw new Error(`Email ${data.email} already exists`);
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password (minimum 8 characters)
    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const newUser = {
      id: `user_${Date.now()}`,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`,
      phone: data.phone || null,
      avatar: null,
      roles: data.roles || [],
      permissions: [],
      status: data.status || UserStatus.ACTIVE,
      branchId: data.branchId || null,
      branchName: null, // Would be populated from branch data
      lastLogin: null,
      passwordChangedAt: new Date().toISOString(),
      mustChangePassword: data.mustChangePassword ?? true,
      preferences: { theme: 'light', language: 'en' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current_user', // Would be actual user ID in real app
    };

    MOCK_USERS.push(newUser);
    return { ...newUser };
  },

  /**
   * Update a user
   * @param {string} id - User ID
   * @param {import('../types').UpdateUserInput} data - Updated data
   * @returns {Promise<import('../types').User>}
   */
  async update(id, data) {
    await delay();

    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }

    // Validate email if changed
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Check if new email already exists
    if (data.email && MOCK_USERS.some(u => u.id !== id && u.email === data.email)) {
      throw new Error(`Email ${data.email} already exists`);
    }

    const updated = {
      ...MOCK_USERS[index],
      ...data,
      fullName: data.firstName && data.lastName
        ? `${data.firstName} ${data.lastName}`
        : MOCK_USERS[index].fullName,
      updatedAt: new Date().toISOString(),
    };

    MOCK_USERS[index] = updated;
    return { ...updated };
  },

  /**
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async delete(id) {
    await delay();

    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }

    const user = MOCK_USERS[index];

    // Prevent deleting system admin
    if (user.username === 'admin') {
      throw new Error('Cannot delete system administrator account');
    }

    MOCK_USERS.splice(index, 1);
    return { success: true, message: 'User deleted successfully' };
  },

  /**
   * Assign roles to a user
   * @param {string} userId - User ID
   * @param {string[]} roleIds - Role IDs to assign
   * @returns {Promise<import('../types').User>}
   */
  async assignRoles(userId, roleIds) {
    await delay();

    const index = MOCK_USERS.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const updated = {
      ...MOCK_USERS[index],
      roles: roleIds,
      updatedAt: new Date().toISOString(),
    };

    MOCK_USERS[index] = updated;
    return { ...updated };
  },

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {import('../types').ChangePasswordInput} data - Password data
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async changePassword(userId, data) {
    await delay();

    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Validate passwords match
    if (data.newPassword !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Validate password strength
    if (data.newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    // In real app, would verify currentPassword
    // For mock, just update the timestamp

    const index = MOCK_USERS.findIndex(u => u.id === userId);
    MOCK_USERS[index] = {
      ...MOCK_USERS[index],
      passwordChangedAt: new Date().toISOString(),
      mustChangePassword: false,
      updatedAt: new Date().toISOString(),
    };

    return { success: true, message: 'Password changed successfully' };
  },

  /**
   * Reset user password (admin action)
   * @param {string} userId - User ID
   * @param {import('../types').ResetPasswordInput} data - Password data
   * @returns {Promise<{success: boolean, message: string, temporaryPassword: string}>}
   */
  async resetPassword(userId, data) {
    await delay();

    const index = MOCK_USERS.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';

    MOCK_USERS[index] = {
      ...MOCK_USERS[index],
      passwordChangedAt: new Date().toISOString(),
      mustChangePassword: data.mustChangePassword ?? true,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: 'Password reset successfully',
      temporaryPassword: tempPassword,
    };
  },

  /**
   * Get user statistics
   * @returns {Promise<import('../types').UserStats>}
   */
  async getStats() {
    await delay();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      total: MOCK_USERS.length,
      active: MOCK_USERS.filter(u => u.status === UserStatus.ACTIVE).length,
      inactive: MOCK_USERS.filter(u => u.status === UserStatus.INACTIVE).length,
      suspended: MOCK_USERS.filter(u => u.status === UserStatus.SUSPENDED).length,
      pending: MOCK_USERS.filter(u => u.status === UserStatus.PENDING).length,
      loggedInToday: MOCK_USERS.filter(u => {
        if (!u.lastLogin) return false;
        const lastLogin = new Date(u.lastLogin);
        return lastLogin >= today;
      }).length,
    };

    return stats;
  },

  /**
   * Get users by branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<import('../types').User[]>}
   */
  async getByBranch(branchId) {
    await delay();
    return MOCK_USERS.filter(u => u.branchId === branchId);
  },

  /**
   * Get users by role
   * @param {string} roleId - Role ID
   * @returns {Promise<import('../types').User[]>}
   */
  async getByRole(roleId) {
    await delay();
    return MOCK_USERS.filter(u => u.roles.includes(roleId));
  },
};

export default userService;
