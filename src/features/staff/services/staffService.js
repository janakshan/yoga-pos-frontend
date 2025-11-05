/**
 * Staff Service
 *
 * Mock API service for managing staff in the multi-branch POS system.
 * This service simulates API calls with realistic delays.
 * Replace with real API calls when backend is ready.
 */

// Default permissions by role
const ROLE_PERMISSIONS = {
  admin: {
    canAccessPOS: true,
    canManageInventory: true,
    canManageCustomers: true,
    canManageBookings: true,
    canViewReports: true,
    canManageStaff: true,
    canManageSettings: true,
    canProcessRefunds: true,
    canApplyDiscounts: true,
  },
  manager: {
    canAccessPOS: true,
    canManageInventory: true,
    canManageCustomers: true,
    canManageBookings: true,
    canViewReports: true,
    canManageStaff: true,
    canManageSettings: false,
    canProcessRefunds: true,
    canApplyDiscounts: true,
  },
  instructor: {
    canAccessPOS: true,
    canManageInventory: false,
    canManageCustomers: true,
    canManageBookings: true,
    canViewReports: false,
    canManageStaff: false,
    canManageSettings: false,
    canProcessRefunds: false,
    canApplyDiscounts: true,
  },
  receptionist: {
    canAccessPOS: true,
    canManageInventory: false,
    canManageCustomers: true,
    canManageBookings: true,
    canViewReports: false,
    canManageStaff: false,
    canManageSettings: false,
    canProcessRefunds: false,
    canApplyDiscounts: false,
  },
  staff: {
    canAccessPOS: true,
    canManageInventory: false,
    canManageCustomers: false,
    canManageBookings: false,
    canViewReports: false,
    canManageStaff: false,
    canManageSettings: false,
    canProcessRefunds: false,
    canApplyDiscounts: false,
  },
};

// Mock data for staff
let MOCK_STAFF = [
  {
    id: 'staff-001',
    employeeId: 'EMP001',
    firstName: 'Sarah',
    lastName: 'Manager',
    email: 'sarah.manager@yoga.com',
    phone: '+1 (415) 555-1001',
    role: 'manager',
    branchId: 'branch-001',
    branchName: 'Downtown Yoga Studio',
    position: 'Branch Manager',
    department: 'Management',
    hireDate: '2023-01-15',
    terminationDate: null,
    status: 'active',
    employmentType: 'full_time',
    schedule: {
      monday: { working: true, startTime: '08:00', endTime: '17:00' },
      tuesday: { working: true, startTime: '08:00', endTime: '17:00' },
      wednesday: { working: true, startTime: '08:00', endTime: '17:00' },
      thursday: { working: true, startTime: '08:00', endTime: '17:00' },
      friday: { working: true, startTime: '08:00', endTime: '17:00' },
      saturday: { working: false, startTime: '', endTime: '' },
      sunday: { working: false, startTime: '', endTime: '' },
    },
    permissions: ROLE_PERMISSIONS.manager,
    hourlyRate: 0,
    salary: 65000,
    emergencyContactName: 'John Manager',
    emergencyContactPhone: '+1 (415) 555-1002',
    address: '789 Pine Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94108',
    country: 'USA',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'staff-002',
    employeeId: 'EMP002',
    firstName: 'Emily',
    lastName: 'Thompson',
    email: 'emily.thompson@yoga.com',
    phone: '+1 (415) 555-1003',
    role: 'instructor',
    branchId: 'branch-001',
    branchName: 'Downtown Yoga Studio',
    position: 'Senior Yoga Instructor',
    department: 'Instructors',
    hireDate: '2023-03-20',
    terminationDate: null,
    status: 'active',
    employmentType: 'full_time',
    schedule: {
      monday: { working: true, startTime: '06:00', endTime: '14:00' },
      tuesday: { working: true, startTime: '06:00', endTime: '14:00' },
      wednesday: { working: true, startTime: '06:00', endTime: '14:00' },
      thursday: { working: true, startTime: '06:00', endTime: '14:00' },
      friday: { working: true, startTime: '06:00', endTime: '14:00' },
      saturday: { working: true, startTime: '08:00', endTime: '12:00' },
      sunday: { working: false, startTime: '', endTime: '' },
    },
    permissions: ROLE_PERMISSIONS.instructor,
    hourlyRate: 0,
    salary: 52000,
    emergencyContactName: 'David Thompson',
    emergencyContactPhone: '+1 (415) 555-1004',
    address: '234 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    country: 'USA',
    createdAt: '2023-03-20T10:00:00Z',
    updatedAt: '2024-10-15T10:00:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'staff-003',
    employeeId: 'EMP003',
    firstName: 'Michael',
    lastName: 'Davis',
    email: 'michael.davis@yoga.com',
    phone: '+1 (415) 555-1005',
    role: 'receptionist',
    branchId: 'branch-001',
    branchName: 'Downtown Yoga Studio',
    position: 'Receptionist',
    department: 'Reception',
    hireDate: '2023-06-10',
    terminationDate: null,
    status: 'active',
    employmentType: 'part_time',
    schedule: {
      monday: { working: true, startTime: '14:00', endTime: '21:00' },
      tuesday: { working: true, startTime: '14:00', endTime: '21:00' },
      wednesday: { working: true, startTime: '14:00', endTime: '21:00' },
      thursday: { working: false, startTime: '', endTime: '' },
      friday: { working: false, startTime: '', endTime: '' },
      saturday: { working: true, startTime: '10:00', endTime: '18:00' },
      sunday: { working: true, startTime: '10:00', endTime: '18:00' },
    },
    permissions: ROLE_PERMISSIONS.receptionist,
    hourlyRate: 22,
    salary: 0,
    emergencyContactName: 'Lisa Davis',
    emergencyContactPhone: '+1 (415) 555-1006',
    address: '567 Valencia Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94110',
    country: 'USA',
    createdAt: '2023-06-10T10:00:00Z',
    updatedAt: '2024-09-20T10:00:00Z',
    createdBy: 'user-002',
  },
  {
    id: 'staff-004',
    employeeId: 'EMP004',
    firstName: 'Jessica',
    lastName: 'Wilson',
    email: 'jessica.wilson@yoga.com',
    phone: '+1 (415) 555-1007',
    role: 'instructor',
    branchId: 'branch-002',
    branchName: 'Marina District Studio',
    position: 'Yoga Instructor',
    department: 'Instructors',
    hireDate: '2023-08-01',
    terminationDate: null,
    status: 'on_leave',
    employmentType: 'contract',
    schedule: {
      monday: { working: false, startTime: '', endTime: '' },
      tuesday: { working: true, startTime: '17:00', endTime: '20:00' },
      wednesday: { working: false, startTime: '', endTime: '' },
      thursday: { working: true, startTime: '17:00', endTime: '20:00' },
      friday: { working: false, startTime: '', endTime: '' },
      saturday: { working: true, startTime: '09:00', endTime: '13:00' },
      sunday: { working: false, startTime: '', endTime: '' },
    },
    permissions: ROLE_PERMISSIONS.instructor,
    hourlyRate: 45,
    salary: 0,
    emergencyContactName: 'Robert Wilson',
    emergencyContactPhone: '+1 (415) 555-1008',
    address: '890 Lombard Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94123',
    country: 'USA',
    createdAt: '2023-08-01T10:00:00Z',
    updatedAt: '2024-10-01T10:00:00Z',
    createdBy: 'user-003',
  },
];

/**
 * Simulates network delay for mock API calls
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise<void>}
 */
const mockDelay = (ms = 500) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Generates a unique ID for new staff
 * @returns {string}
 */
const generateId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `staff-${timestamp}-${random}`;
};

/**
 * Generates a unique employee ID
 * @returns {string}
 */
const generateEmployeeId = () => {
  const ids = MOCK_STAFF.map((s) => s.employeeId);
  const numbers = ids
    .map((id) => parseInt(id.replace('EMP', ''), 10))
    .filter((n) => !isNaN(n));
  const maxNumber = Math.max(0, ...numbers);
  return `EMP${String(maxNumber + 1).padStart(3, '0')}`;
};

/**
 * Applies filters to staff list
 * @param {Array} staff - List of staff
 * @param {Object} filters - Filter criteria
 * @returns {Array}
 */
const applyFilters = (staff, filters = {}) => {
  let filtered = [...staff];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.firstName.toLowerCase().includes(searchLower) ||
        s.lastName.toLowerCase().includes(searchLower) ||
        s.employeeId.toLowerCase().includes(searchLower) ||
        s.email.toLowerCase().includes(searchLower) ||
        s.position.toLowerCase().includes(searchLower)
    );
  }

  // Status filter
  if (filters.status) {
    filtered = filtered.filter((s) => s.status === filters.status);
  }

  // Role filter
  if (filters.role) {
    filtered = filtered.filter((s) => s.role === filters.role);
  }

  // Branch filter
  if (filters.branchId) {
    filtered = filtered.filter((s) => s.branchId === filters.branchId);
  }

  // Department filter
  if (filters.department) {
    filtered = filtered.filter(
      (s) => s.department.toLowerCase() === filters.department.toLowerCase()
    );
  }

  // Employment type filter
  if (filters.employmentType) {
    filtered = filtered.filter((s) => s.employmentType === filters.employmentType);
  }

  // Sorting
  const sortBy = filters.sortBy || 'lastName';
  const sortOrder = filters.sortOrder || 'asc';

  filtered.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
};

/**
 * Get list of staff with optional filters
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>}
 */
export const getList = async (filters = {}) => {
  await mockDelay(400);

  const staff = applyFilters(MOCK_STAFF, filters);
  return staff;
};

/**
 * Get a single staff member by ID
 * @param {string} id - Staff ID
 * @returns {Promise<Object>}
 * @throws {Error} If staff not found
 */
export const getById = async (id) => {
  await mockDelay(300);

  const staff = MOCK_STAFF.find((s) => s.id === id);
  if (!staff) {
    throw new Error(`Staff member with ID ${id} not found`);
  }

  return staff;
};

/**
 * Create a new staff member
 * @param {Object} data - Staff data
 * @returns {Promise<Object>}
 * @throws {Error} If validation fails
 */
export const create = async (data) => {
  await mockDelay(600);

  // Validation
  if (!data.firstName || !data.firstName.trim()) {
    throw new Error('First name is required');
  }

  if (!data.lastName || !data.lastName.trim()) {
    throw new Error('Last name is required');
  }

  if (!data.email || !data.email.trim()) {
    throw new Error('Email is required');
  }

  if (!data.phone || !data.phone.trim()) {
    throw new Error('Phone number is required');
  }

  if (!data.role) {
    throw new Error('Role is required');
  }

  // Check if email already exists
  const emailExists = MOCK_STAFF.some(
    (s) => s.email.toLowerCase() === data.email.toLowerCase()
  );
  if (emailExists) {
    throw new Error(`Email ${data.email} is already in use`);
  }

  // Check if employee ID already exists
  if (data.employeeId) {
    const idExists = MOCK_STAFF.some((s) => s.employeeId === data.employeeId);
    if (idExists) {
      throw new Error(`Employee ID ${data.employeeId} already exists`);
    }
  }

  const newStaff = {
    id: generateId(),
    employeeId: data.employeeId || generateEmployeeId(),
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    role: data.role,
    branchId: data.branchId || null,
    branchName: null, // Would be fetched from branch service
    position: data.position || '',
    department: data.department || '',
    hireDate: data.hireDate || new Date().toISOString().split('T')[0],
    terminationDate: null,
    status: 'active',
    employmentType: data.employmentType || 'full_time',
    schedule: {
      monday: { working: false, startTime: '', endTime: '' },
      tuesday: { working: false, startTime: '', endTime: '' },
      wednesday: { working: false, startTime: '', endTime: '' },
      thursday: { working: false, startTime: '', endTime: '' },
      friday: { working: false, startTime: '', endTime: '' },
      saturday: { working: false, startTime: '', endTime: '' },
      sunday: { working: false, startTime: '', endTime: '' },
    },
    permissions: ROLE_PERMISSIONS[data.role] || ROLE_PERMISSIONS.staff,
    hourlyRate: data.hourlyRate || 0,
    salary: data.salary || 0,
    emergencyContactName: data.emergencyContactName || '',
    emergencyContactPhone: data.emergencyContactPhone || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    zipCode: data.zipCode || '',
    country: data.country || 'USA',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user-id',
  };

  MOCK_STAFF.push(newStaff);
  return newStaff;
};

/**
 * Update an existing staff member
 * @param {string} id - Staff ID
 * @param {Object} data - Updated staff data
 * @returns {Promise<Object>}
 * @throws {Error} If staff not found or validation fails
 */
export const update = async (id, data) => {
  await mockDelay(600);

  const index = MOCK_STAFF.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error(`Staff member with ID ${id} not found`);
  }

  // Validation
  if (data.firstName && !data.firstName.trim()) {
    throw new Error('First name cannot be empty');
  }

  if (data.lastName && !data.lastName.trim()) {
    throw new Error('Last name cannot be empty');
  }

  if (data.email && !data.email.trim()) {
    throw new Error('Email cannot be empty');
  }

  // Check if email is being changed and already exists
  if (data.email) {
    const emailExists = MOCK_STAFF.some(
      (s) => s.id !== id && s.email.toLowerCase() === data.email.toLowerCase()
    );
    if (emailExists) {
      throw new Error(`Email ${data.email} is already in use`);
    }
  }

  // Update permissions if role changes
  if (data.role && data.role !== MOCK_STAFF[index].role) {
    data.permissions = ROLE_PERMISSIONS[data.role] || ROLE_PERMISSIONS.staff;
  }

  const updatedStaff = {
    ...MOCK_STAFF[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  MOCK_STAFF[index] = updatedStaff;
  return updatedStaff;
};

/**
 * Delete a staff member
 * @param {string} id - Staff ID
 * @returns {Promise<Object>}
 * @throws {Error} If staff not found
 */
export const remove = async (id) => {
  await mockDelay(500);

  const index = MOCK_STAFF.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error(`Staff member with ID ${id} not found`);
  }

  const deleted = MOCK_STAFF[index];
  MOCK_STAFF.splice(index, 1);

  return { success: true, staff: deleted };
};

/**
 * Get staff statistics
 * @returns {Promise<Object>}
 */
export const getStats = async () => {
  await mockDelay(300);

  const totalStaff = MOCK_STAFF.length;
  const activeStaff = MOCK_STAFF.filter((s) => s.status === 'active').length;
  const inactiveStaff = MOCK_STAFF.filter((s) => s.status === 'inactive').length;
  const onLeave = MOCK_STAFF.filter((s) => s.status === 'on_leave').length;
  const fullTime = MOCK_STAFF.filter((s) => s.employmentType === 'full_time').length;
  const partTime = MOCK_STAFF.filter((s) => s.employmentType === 'part_time').length;

  // By role
  const byRole = {};
  MOCK_STAFF.forEach((s) => {
    byRole[s.role] = (byRole[s.role] || 0) + 1;
  });

  // By branch
  const byBranch = {};
  MOCK_STAFF.forEach((s) => {
    if (s.branchId) {
      byBranch[s.branchId] = (byBranch[s.branchId] || 0) + 1;
    }
  });

  // By department
  const byDepartment = {};
  MOCK_STAFF.forEach((s) => {
    if (s.department) {
      byDepartment[s.department] = (byDepartment[s.department] || 0) + 1;
    }
  });

  return {
    totalStaff,
    activeStaff,
    inactiveStaff,
    onLeave,
    fullTime,
    partTime,
    byRole,
    byBranch,
    byDepartment,
  };
};

/**
 * Assign staff to a branch
 * @param {string} staffId - Staff ID
 * @param {string} branchId - Branch ID
 * @param {string} branchName - Branch name
 * @returns {Promise<Object>}
 * @throws {Error} If staff not found
 */
export const assignToBranch = async (staffId, branchId, branchName) => {
  await mockDelay(400);

  const staff = MOCK_STAFF.find((s) => s.id === staffId);
  if (!staff) {
    throw new Error(`Staff member with ID ${staffId} not found`);
  }

  staff.branchId = branchId;
  staff.branchName = branchName;
  staff.updatedAt = new Date().toISOString();

  return staff;
};

/**
 * Update staff schedule
 * @param {string} staffId - Staff ID
 * @param {Object} schedule - New schedule
 * @returns {Promise<Object>}
 * @throws {Error} If staff not found
 */
export const updateSchedule = async (staffId, schedule) => {
  await mockDelay(500);

  const staff = MOCK_STAFF.find((s) => s.id === staffId);
  if (!staff) {
    throw new Error(`Staff member with ID ${staffId} not found`);
  }

  staff.schedule = schedule;
  staff.updatedAt = new Date().toISOString();

  return staff;
};

/**
 * Update staff permissions
 * @param {string} staffId - Staff ID
 * @param {Object} permissions - New permissions
 * @returns {Promise<Object>}
 * @throws {Error} If staff not found
 */
export const updatePermissions = async (staffId, permissions) => {
  await mockDelay(500);

  const staff = MOCK_STAFF.find((s) => s.id === staffId);
  if (!staff) {
    throw new Error(`Staff member with ID ${staffId} not found`);
  }

  staff.permissions = { ...staff.permissions, ...permissions };
  staff.updatedAt = new Date().toISOString();

  return staff;
};

// Export as a service object
export const staffService = {
  getList,
  getById,
  create,
  update,
  remove,
  getStats,
  assignToBranch,
  updateSchedule,
  updatePermissions,
};
