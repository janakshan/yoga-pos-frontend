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
      staffProfile: null, // Admin is not staff
      createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system',
    },
    {
      id: 'user_2',
      username: 'sarah.manager',
      email: 'sarah.manager@yoga.com',
      firstName: 'Sarah',
      lastName: 'Manager',
      fullName: 'Sarah Manager',
      phone: '+1 (415) 555-1001',
      avatar: null,
      roles: ['role_3'], // Manager
      permissions: [],
      status: UserStatus.ACTIVE,
      branchId: 'branch_1',
      branchName: 'Downtown Yoga Studio',
      lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      passwordChangedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      mustChangePassword: false,
      preferences: { theme: 'light', language: 'en' },
      staffProfile: {
        employeeId: 'EMP001',
        position: 'Branch Manager',
        department: 'Management',
        employmentType: 'full_time',
        hireDate: '2023-01-15',
        employmentStatus: 'employed',
        compensationType: 'salary',
        salary: 65000,
        hourlyRate: 0,
        schedule: {
          monday: { working: true, startTime: '08:00', endTime: '17:00' },
          tuesday: { working: true, startTime: '08:00', endTime: '17:00' },
          wednesday: { working: true, startTime: '08:00', endTime: '17:00' },
          thursday: { working: true, startTime: '08:00', endTime: '17:00' },
          friday: { working: true, startTime: '08:00', endTime: '17:00' },
          saturday: { working: false, startTime: '', endTime: '' },
          sunday: { working: false, startTime: '', endTime: '' },
        },
        emergencyContact: {
          name: 'John Manager',
          phone: '+1 (415) 555-1002',
          relationship: 'Spouse',
        },
        address: {
          street: '789 Pine Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94108',
          country: 'USA',
        },
        terminationDate: null,
      },
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user_1',
    },
    {
      id: 'user_3',
      username: 'emily.thompson',
      email: 'emily.thompson@yoga.com',
      firstName: 'Emily',
      lastName: 'Thompson',
      fullName: 'Emily Thompson',
      phone: '+1 (415) 555-1003',
      avatar: null,
      roles: ['role_5'], // Instructor
      permissions: [],
      status: UserStatus.ACTIVE,
      branchId: 'branch_1',
      branchName: 'Downtown Yoga Studio',
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      passwordChangedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      mustChangePassword: false,
      preferences: { theme: 'light', language: 'en' },
      staffProfile: {
        employeeId: 'EMP002',
        position: 'Senior Yoga Instructor',
        department: 'Instructors',
        employmentType: 'full_time',
        hireDate: '2023-03-20',
        employmentStatus: 'employed',
        compensationType: 'salary',
        salary: 52000,
        hourlyRate: 0,
        schedule: {
          monday: { working: true, startTime: '06:00', endTime: '14:00' },
          tuesday: { working: true, startTime: '06:00', endTime: '14:00' },
          wednesday: { working: true, startTime: '06:00', endTime: '14:00' },
          thursday: { working: true, startTime: '06:00', endTime: '14:00' },
          friday: { working: true, startTime: '06:00', endTime: '14:00' },
          saturday: { working: true, startTime: '08:00', endTime: '12:00' },
          sunday: { working: false, startTime: '', endTime: '' },
        },
        emergencyContact: {
          name: 'David Thompson',
          phone: '+1 (415) 555-1004',
          relationship: 'Spouse',
        },
        address: {
          street: '234 Market Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
          country: 'USA',
        },
        terminationDate: null,
      },
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user_1',
    },
    {
      id: 'user_4',
      username: 'michael.davis',
      email: 'michael.davis@yoga.com',
      firstName: 'Michael',
      lastName: 'Davis',
      fullName: 'Michael Davis',
      phone: '+1 (415) 555-1005',
      avatar: null,
      roles: ['role_6'], // Receptionist
      permissions: [],
      status: UserStatus.ACTIVE,
      branchId: 'branch_1',
      branchName: 'Downtown Yoga Studio',
      lastLogin: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      passwordChangedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      mustChangePassword: false,
      preferences: { theme: 'light', language: 'en' },
      staffProfile: {
        employeeId: 'EMP003',
        position: 'Receptionist',
        department: 'Reception',
        employmentType: 'part_time',
        hireDate: '2023-06-10',
        employmentStatus: 'employed',
        compensationType: 'hourly',
        salary: 0,
        hourlyRate: 22,
        schedule: {
          monday: { working: true, startTime: '14:00', endTime: '21:00' },
          tuesday: { working: true, startTime: '14:00', endTime: '21:00' },
          wednesday: { working: true, startTime: '14:00', endTime: '21:00' },
          thursday: { working: false, startTime: '', endTime: '' },
          friday: { working: false, startTime: '', endTime: '' },
          saturday: { working: true, startTime: '10:00', endTime: '18:00' },
          sunday: { working: true, startTime: '10:00', endTime: '18:00' },
        },
        emergencyContact: {
          name: 'Lisa Davis',
          phone: '+1 (415) 555-1006',
          relationship: 'Sister',
        },
        address: {
          street: '567 Valencia Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94110',
          country: 'USA',
        },
        terminationDate: null,
      },
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user_1',
    },
    {
      id: 'user_5',
      username: 'jessica.wilson',
      email: 'jessica.wilson@yoga.com',
      firstName: 'Jessica',
      lastName: 'Wilson',
      fullName: 'Jessica Wilson',
      phone: '+1 (415) 555-1007',
      avatar: null,
      roles: ['role_5'], // Instructor
      permissions: [],
      status: UserStatus.ACTIVE,
      branchId: 'branch_2',
      branchName: 'Marina District Studio',
      lastLogin: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      passwordChangedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      mustChangePassword: false,
      preferences: { theme: 'light', language: 'en' },
      staffProfile: {
        employeeId: 'EMP004',
        position: 'Yoga Instructor',
        department: 'Instructors',
        employmentType: 'contract',
        hireDate: '2023-08-01',
        employmentStatus: 'on_leave',
        compensationType: 'hourly',
        salary: 0,
        hourlyRate: 45,
        schedule: {
          monday: { working: false, startTime: '', endTime: '' },
          tuesday: { working: true, startTime: '17:00', endTime: '20:00' },
          wednesday: { working: false, startTime: '', endTime: '' },
          thursday: { working: true, startTime: '17:00', endTime: '20:00' },
          friday: { working: false, startTime: '', endTime: '' },
          saturday: { working: true, startTime: '09:00', endTime: '13:00' },
          sunday: { working: false, startTime: '', endTime: '' },
        },
        emergencyContact: {
          name: 'Robert Wilson',
          phone: '+1 (415) 555-1008',
          relationship: 'Father',
        },
        address: {
          street: '890 Lombard Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94123',
          country: 'USA',
        },
        terminationDate: null,
      },
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'user_1',
    },
  ];
};

// Mock data store
let MOCK_USERS = generateMockUsers();

/**
 * Generate a unique employee ID
 * @returns {string}
 */
const generateEmployeeId = () => {
  const existingIds = MOCK_USERS
    .filter(u => u.staffProfile?.employeeId)
    .map(u => u.staffProfile.employeeId);

  const numbers = existingIds
    .map(id => parseInt(id.replace('EMP', ''), 10))
    .filter(n => !isNaN(n));

  const maxNumber = Math.max(0, ...numbers);
  return `EMP${String(maxNumber + 1).padStart(3, '0')}`;
};

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

    // Apply staff-specific filters
    if (filters.department) {
      result = result.filter(user =>
        user.staffProfile?.department?.toLowerCase() === filters.department.toLowerCase()
      );
    }

    if (filters.employmentType) {
      result = result.filter(user =>
        user.staffProfile?.employmentType === filters.employmentType
      );
    }

    if (filters.employmentStatus) {
      result = result.filter(user =>
        user.staffProfile?.employmentStatus === filters.employmentStatus
      );
    }

    // Filter only staff users (users with staffProfile)
    if (filters.staffOnly) {
      result = result.filter(user => user.staffProfile != null);
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

    // Process staff profile if provided
    let staffProfile = null;
    if (data.staffProfile) {
      // Auto-generate employee ID if not provided
      const employeeId = data.staffProfile.employeeId || generateEmployeeId();

      // Check if employee ID already exists
      if (MOCK_USERS.some(u => u.staffProfile?.employeeId === employeeId)) {
        throw new Error(`Employee ID ${employeeId} already exists`);
      }

      staffProfile = {
        employeeId,
        position: data.staffProfile.position || '',
        department: data.staffProfile.department || '',
        employmentType: data.staffProfile.employmentType || 'full_time',
        hireDate: data.staffProfile.hireDate || new Date().toISOString(),
        employmentStatus: data.staffProfile.employmentStatus || 'employed',
        compensationType: data.staffProfile.compensationType || 'salary',
        salary: data.staffProfile.salary || 0,
        hourlyRate: data.staffProfile.hourlyRate || 0,
        schedule: data.staffProfile.schedule || {
          monday: { working: false, startTime: '', endTime: '' },
          tuesday: { working: false, startTime: '', endTime: '' },
          wednesday: { working: false, startTime: '', endTime: '' },
          thursday: { working: false, startTime: '', endTime: '' },
          friday: { working: false, startTime: '', endTime: '' },
          saturday: { working: false, startTime: '', endTime: '' },
          sunday: { working: false, startTime: '', endTime: '' },
        },
        emergencyContact: data.staffProfile.emergencyContact || null,
        address: data.staffProfile.address || null,
        terminationDate: data.staffProfile.terminationDate || null,
      };
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
      staffProfile,
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

    // Handle staff profile updates
    let updatedStaffProfile = MOCK_USERS[index].staffProfile;
    if (data.staffProfile !== undefined) {
      if (data.staffProfile === null) {
        // Remove staff profile
        updatedStaffProfile = null;
      } else {
        // Update or create staff profile
        updatedStaffProfile = {
          ...(MOCK_USERS[index].staffProfile || {}),
          ...data.staffProfile,
        };
      }
    }

    const updated = {
      ...MOCK_USERS[index],
      ...data,
      staffProfile: updatedStaffProfile,
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

  /**
   * Get all staff (users with staffProfile)
   * @param {Object} [filters] - Filter options
   * @returns {Promise<import('../types').User[]>}
   */
  async getAllStaff(filters = {}) {
    await delay();
    return this.getAll({ ...filters, staffOnly: true });
  },

  /**
   * Get staff statistics
   * @returns {Promise<Object>}
   */
  async getStaffStats() {
    await delay();

    const staff = MOCK_USERS.filter(u => u.staffProfile != null);

    const stats = {
      totalStaff: staff.length,
      activeStaff: staff.filter(u => u.status === UserStatus.ACTIVE).length,
      inactiveStaff: staff.filter(u => u.status === UserStatus.INACTIVE).length,
      onLeave: staff.filter(u => u.staffProfile?.employmentStatus === 'on_leave').length,
      terminated: staff.filter(u => u.staffProfile?.employmentStatus === 'terminated').length,
      fullTime: staff.filter(u => u.staffProfile?.employmentType === 'full_time').length,
      partTime: staff.filter(u => u.staffProfile?.employmentType === 'part_time').length,
      contract: staff.filter(u => u.staffProfile?.employmentType === 'contract').length,
      byDepartment: {},
      byBranch: {},
    };

    // Count by department
    staff.forEach(u => {
      const dept = u.staffProfile?.department;
      if (dept) {
        stats.byDepartment[dept] = (stats.byDepartment[dept] || 0) + 1;
      }
    });

    // Count by branch
    staff.forEach(u => {
      if (u.branchId) {
        stats.byBranch[u.branchId] = (stats.byBranch[u.branchId] || 0) + 1;
      }
    });

    return stats;
  },

  /**
   * Update staff schedule
   * @param {string} userId - User ID
   * @param {import('../types').WeekSchedule} schedule - New schedule
   * @returns {Promise<import('../types').User>}
   */
  async updateStaffSchedule(userId, schedule) {
    await delay();

    const index = MOCK_USERS.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error(`User with ID ${userId} not found`);
    }

    if (!MOCK_USERS[index].staffProfile) {
      throw new Error('User does not have a staff profile');
    }

    MOCK_USERS[index] = {
      ...MOCK_USERS[index],
      staffProfile: {
        ...MOCK_USERS[index].staffProfile,
        schedule,
      },
      updatedAt: new Date().toISOString(),
    };

    return { ...MOCK_USERS[index] };
  },

  /**
   * Terminate staff employment
   * @param {string} userId - User ID
   * @param {Date|string} terminationDate - Termination date
   * @returns {Promise<import('../types').User>}
   */
  async terminateStaff(userId, terminationDate) {
    await delay();

    const index = MOCK_USERS.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error(`User with ID ${userId} not found`);
    }

    if (!MOCK_USERS[index].staffProfile) {
      throw new Error('User does not have a staff profile');
    }

    MOCK_USERS[index] = {
      ...MOCK_USERS[index],
      status: UserStatus.INACTIVE,
      staffProfile: {
        ...MOCK_USERS[index].staffProfile,
        employmentStatus: 'terminated',
        terminationDate: terminationDate || new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };

    return { ...MOCK_USERS[index] };
  },
};

export default userService;
