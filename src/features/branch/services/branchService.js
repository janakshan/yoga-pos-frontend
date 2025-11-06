/**
 * Branch Service
 *
 * Mock API service for managing branches in the multi-branch POS system.
 * This service simulates API calls with realistic delays.
 * Replace with real API calls when backend is ready.
 */

// Mock data for branches
let MOCK_BRANCHES = [
  {
    id: 'branch-001',
    name: 'Downtown Yoga Studio',
    code: 'BR001',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    country: 'USA',
    phone: '+1 (415) 555-0100',
    email: 'downtown@yoga.com',
    managerId: 'user-002',
    managerName: 'Sarah Manager',
    isActive: true,
    staffCount: 8,
    monthlyRevenue: 45800,
    transactionCount: 342,
    averageTicketSize: 133.92,
    customerCount: 285,
    inventoryValue: 12450,
    settings: {
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      taxRate: 0.0875,
      allowWalkins: true,
      operatingHours: {
        monday: { open: '06:00', close: '21:00' },
        tuesday: { open: '06:00', close: '21:00' },
        wednesday: { open: '06:00', close: '21:00' },
        thursday: { open: '06:00', close: '21:00' },
        friday: { open: '06:00', close: '21:00' },
        saturday: { open: '08:00', close: '18:00' },
        sunday: { open: '08:00', close: '18:00' },
      },
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-11-01T15:30:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'branch-002',
    name: 'Marina District Studio',
    code: 'BR002',
    address: '456 Bay Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94123',
    country: 'USA',
    phone: '+1 (415) 555-0200',
    email: 'marina@yoga.com',
    managerId: 'user-003',
    managerName: 'Mike Johnson',
    isActive: true,
    staffCount: 6,
    monthlyRevenue: 38200,
    transactionCount: 298,
    averageTicketSize: 128.19,
    customerCount: 234,
    inventoryValue: 9800,
    settings: {
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      taxRate: 0.0875,
      allowWalkins: true,
      operatingHours: {
        monday: { open: '07:00', close: '20:00' },
        tuesday: { open: '07:00', close: '20:00' },
        wednesday: { open: '07:00', close: '20:00' },
        thursday: { open: '07:00', close: '20:00' },
        friday: { open: '07:00', close: '20:00' },
        saturday: { open: '09:00', close: '17:00' },
        sunday: { open: '09:00', close: '17:00' },
      },
    },
    createdAt: '2024-02-20T10:00:00Z',
    updatedAt: '2024-10-15T12:00:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'branch-003',
    name: 'Sunset Wellness Center',
    code: 'BR003',
    address: '789 Ocean Avenue',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94112',
    country: 'USA',
    phone: '+1 (415) 555-0300',
    email: 'sunset@yoga.com',
    managerId: null,
    managerName: null,
    isActive: false,
    staffCount: 0,
    monthlyRevenue: 0,
    transactionCount: 0,
    averageTicketSize: 0,
    customerCount: 0,
    inventoryValue: 0,
    settings: {
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      taxRate: 0.0875,
      allowWalkins: false,
      operatingHours: {},
    },
    createdAt: '2024-03-10T10:00:00Z',
    updatedAt: '2024-09-01T09:00:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'branch-004',
    name: 'Oakland Yoga Center',
    code: 'BR004',
    address: '321 Broadway',
    city: 'Oakland',
    state: 'CA',
    zipCode: '94612',
    country: 'USA',
    phone: '+1 (510) 555-0100',
    email: 'oakland@yoga.com',
    managerId: 'user-004',
    managerName: 'Lisa Chen',
    isActive: true,
    staffCount: 7,
    monthlyRevenue: 52300,
    transactionCount: 385,
    averageTicketSize: 135.84,
    customerCount: 312,
    inventoryValue: 14200,
    settings: {
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      taxRate: 0.0975,
      allowWalkins: true,
      operatingHours: {
        monday: { open: '06:00', close: '21:00' },
        tuesday: { open: '06:00', close: '21:00' },
        wednesday: { open: '06:00', close: '21:00' },
        thursday: { open: '06:00', close: '21:00' },
        friday: { open: '06:00', close: '21:00' },
        saturday: { open: '08:00', close: '19:00' },
        sunday: { open: '08:00', close: '19:00' },
      },
    },
    createdAt: '2024-04-10T10:00:00Z',
    updatedAt: '2024-11-02T14:00:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'branch-005',
    name: 'Berkeley Wellness Studio',
    code: 'BR005',
    address: '567 University Avenue',
    city: 'Berkeley',
    state: 'CA',
    zipCode: '94704',
    country: 'USA',
    phone: '+1 (510) 555-0200',
    email: 'berkeley@yoga.com',
    managerId: 'user-005',
    managerName: 'David Park',
    isActive: true,
    staffCount: 5,
    monthlyRevenue: 32500,
    transactionCount: 245,
    averageTicketSize: 132.65,
    customerCount: 198,
    inventoryValue: 8650,
    settings: {
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      taxRate: 0.0975,
      allowWalkins: true,
      operatingHours: {
        monday: { open: '07:00', close: '20:00' },
        tuesday: { open: '07:00', close: '20:00' },
        wednesday: { open: '07:00', close: '20:00' },
        thursday: { open: '07:00', close: '20:00' },
        friday: { open: '07:00', close: '20:00' },
        saturday: { open: '09:00', close: '18:00' },
        sunday: { open: '09:00', close: '18:00' },
      },
    },
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-11-03T10:30:00Z',
    createdBy: 'user-001',
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
 * Generates a unique ID for new branches
 * @returns {string}
 */
const generateId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `branch-${timestamp}-${random}`;
};

/**
 * Generates a unique branch code
 * @returns {string}
 */
const generateBranchCode = () => {
  const codes = MOCK_BRANCHES.map((b) => b.code);
  const numbers = codes
    .map((code) => parseInt(code.replace('BR', ''), 10))
    .filter((n) => !isNaN(n));
  const maxNumber = Math.max(0, ...numbers);
  return `BR${String(maxNumber + 1).padStart(3, '0')}`;
};

/**
 * Applies filters to branches list
 * @param {Array} branches - List of branches
 * @param {Object} filters - Filter criteria
 * @returns {Array}
 */
const applyFilters = (branches, filters = {}) => {
  let filtered = [...branches];

  // Search filter (name, code, address)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (branch) =>
        branch.name.toLowerCase().includes(searchLower) ||
        branch.code.toLowerCase().includes(searchLower) ||
        branch.address.toLowerCase().includes(searchLower) ||
        branch.city.toLowerCase().includes(searchLower)
    );
  }

  // Active status filter
  if (typeof filters.isActive === 'boolean') {
    filtered = filtered.filter((branch) => branch.isActive === filters.isActive);
  }

  // City filter
  if (filters.city) {
    filtered = filtered.filter(
      (branch) => branch.city.toLowerCase() === filters.city.toLowerCase()
    );
  }

  // State filter
  if (filters.state) {
    filtered = filtered.filter(
      (branch) => branch.state.toLowerCase() === filters.state.toLowerCase()
    );
  }

  // Manager filter
  if (filters.managerId) {
    filtered = filtered.filter((branch) => branch.managerId === filters.managerId);
  }

  // Sorting
  const sortBy = filters.sortBy || 'name';
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
 * Get list of branches with optional filters
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>}
 */
export const getList = async (filters = {}) => {
  await mockDelay(400);

  const branches = applyFilters(MOCK_BRANCHES, filters);
  return branches;
};

/**
 * Get a single branch by ID
 * @param {string} id - Branch ID
 * @returns {Promise<Object>}
 * @throws {Error} If branch not found
 */
export const getById = async (id) => {
  await mockDelay(300);

  const branch = MOCK_BRANCHES.find((b) => b.id === id);
  if (!branch) {
    throw new Error(`Branch with ID ${id} not found`);
  }

  return branch;
};

/**
 * Create a new branch
 * @param {Object} data - Branch data
 * @returns {Promise<Object>}
 * @throws {Error} If validation fails
 */
export const create = async (data) => {
  await mockDelay(600);

  // Validation
  if (!data.name || !data.name.trim()) {
    throw new Error('Branch name is required');
  }

  if (!data.address || !data.address.trim()) {
    throw new Error('Branch address is required');
  }

  if (!data.phone || !data.phone.trim()) {
    throw new Error('Branch phone is required');
  }

  if (!data.email || !data.email.trim()) {
    throw new Error('Branch email is required');
  }

  // Check if code already exists
  if (data.code) {
    const codeExists = MOCK_BRANCHES.some((b) => b.code === data.code);
    if (codeExists) {
      throw new Error(`Branch code ${data.code} already exists`);
    }
  }

  const newBranch = {
    id: generateId(),
    name: data.name.trim(),
    code: data.code || generateBranchCode(),
    address: data.address.trim(),
    city: data.city || '',
    state: data.state || '',
    zipCode: data.zipCode || '',
    country: data.country || 'USA',
    phone: data.phone.trim(),
    email: data.email.trim(),
    managerId: data.managerId || null,
    managerName: null, // This would be fetched from user service
    isActive: true,
    staffCount: 0,
    settings: {
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      taxRate: 0.0875,
      allowWalkins: true,
      operatingHours: {},
      ...data.settings,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'current-user-id', // Would come from auth context
  };

  MOCK_BRANCHES.push(newBranch);
  return newBranch;
};

/**
 * Update an existing branch
 * @param {string} id - Branch ID
 * @param {Object} data - Updated branch data
 * @returns {Promise<Object>}
 * @throws {Error} If branch not found or validation fails
 */
export const update = async (id, data) => {
  await mockDelay(600);

  const index = MOCK_BRANCHES.findIndex((b) => b.id === id);
  if (index === -1) {
    throw new Error(`Branch with ID ${id} not found`);
  }

  // Validation
  if (data.name && !data.name.trim()) {
    throw new Error('Branch name cannot be empty');
  }

  if (data.email && !data.email.trim()) {
    throw new Error('Branch email cannot be empty');
  }

  if (data.phone && !data.phone.trim()) {
    throw new Error('Branch phone cannot be empty');
  }

  const updatedBranch = {
    ...MOCK_BRANCHES[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  MOCK_BRANCHES[index] = updatedBranch;
  return updatedBranch;
};

/**
 * Delete a branch
 * @param {string} id - Branch ID
 * @returns {Promise<Object>}
 * @throws {Error} If branch not found
 */
export const remove = async (id) => {
  await mockDelay(500);

  const index = MOCK_BRANCHES.findIndex((b) => b.id === id);
  if (index === -1) {
    throw new Error(`Branch with ID ${id} not found`);
  }

  const deleted = MOCK_BRANCHES[index];
  MOCK_BRANCHES.splice(index, 1);

  return { success: true, branch: deleted };
};

/**
 * Get branch statistics
 * @returns {Promise<Object>}
 */
export const getStats = async () => {
  await mockDelay(300);

  const totalBranches = MOCK_BRANCHES.length;
  const activeBranches = MOCK_BRANCHES.filter((b) => b.isActive).length;
  const inactiveBranches = totalBranches - activeBranches;
  const totalStaff = MOCK_BRANCHES.reduce((sum, b) => sum + b.staffCount, 0);
  const branchesWithoutManager = MOCK_BRANCHES.filter((b) => !b.managerId).length;

  return {
    totalBranches,
    activeBranches,
    inactiveBranches,
    totalStaff,
    branchesWithoutManager,
  };
};

/**
 * Assign a manager to a branch
 * @param {string} branchId - Branch ID
 * @param {string} managerId - Manager user ID
 * @param {string} managerName - Manager name
 * @returns {Promise<Object>}
 * @throws {Error} If branch not found
 */
export const assignManager = async (branchId, managerId, managerName) => {
  await mockDelay(400);

  const branch = MOCK_BRANCHES.find((b) => b.id === branchId);
  if (!branch) {
    throw new Error(`Branch with ID ${branchId} not found`);
  }

  branch.managerId = managerId;
  branch.managerName = managerName;
  branch.updatedAt = new Date().toISOString();

  return branch;
};

/**
 * Bulk activate/deactivate branches
 * @param {Array<string>} branchIds - Array of branch IDs
 * @param {boolean} isActive - Target active status
 * @returns {Promise<Object>}
 */
export const bulkUpdateStatus = async (branchIds, isActive) => {
  await mockDelay(700);

  const updated = [];
  const failed = [];

  branchIds.forEach((id) => {
    const branch = MOCK_BRANCHES.find((b) => b.id === id);
    if (branch) {
      branch.isActive = isActive;
      branch.updatedAt = new Date().toISOString();
      updated.push(branch);
    } else {
      failed.push(id);
    }
  });

  return {
    success: true,
    updated: updated.length,
    failed: failed.length,
    failedIds: failed,
  };
};

/**
 * Get consolidated performance data across all branches
 * @param {Object} filters - Date range and other filters
 * @returns {Promise<Object>}
 */
export const getConsolidatedPerformance = async (filters = {}) => {
  await mockDelay(600);

  const branches = await getList({ isActive: true });

  return {
    totalRevenue: branches.reduce((sum, b) => sum + (b.monthlyRevenue || 0), 0),
    totalTransactions: branches.reduce((sum, b) => sum + (b.transactionCount || 0), 0),
    averageTicketSize: branches.reduce((sum, b) => sum + (b.averageTicketSize || 0), 0) / branches.length,
    topPerformingBranches: branches
      .sort((a, b) => (b.monthlyRevenue || 0) - (a.monthlyRevenue || 0))
      .slice(0, 5)
      .map(b => ({
        id: b.id,
        name: b.name,
        revenue: b.monthlyRevenue || 0,
        transactions: b.transactionCount || 0,
      })),
    branchPerformance: branches.map(b => ({
      branchId: b.id,
      branchName: b.name,
      revenue: b.monthlyRevenue || 0,
      transactions: b.transactionCount || 0,
      averageTicketSize: b.averageTicketSize || 0,
      staffCount: b.staffCount,
    })),
  };
};

/**
 * Get branch comparison metrics
 * @param {Array<string>} branchIds - Branch IDs to compare
 * @returns {Promise<Object>}
 */
export const compareBranches = async (branchIds) => {
  await mockDelay(500);

  const branches = await Promise.all(branchIds.map(id => getById(id)));

  return {
    branches: branches.map(b => ({
      id: b.id,
      name: b.name,
      code: b.code,
      metrics: {
        revenue: b.monthlyRevenue || 0,
        transactions: b.transactionCount || 0,
        staffCount: b.staffCount,
        customerCount: b.customerCount || 0,
        inventoryValue: b.inventoryValue || 0,
      },
    })),
    comparison: {
      highestRevenue: branches.reduce((max, b) =>
        (b.monthlyRevenue || 0) > (max.monthlyRevenue || 0) ? b : max
      ),
      mostTransactions: branches.reduce((max, b) =>
        (b.transactionCount || 0) > (max.transactionCount || 0) ? b : max
      ),
      largestStaff: branches.reduce((max, b) =>
        b.staffCount > max.staffCount ? b : max
      ),
    },
  };
};

/**
 * Update branch-specific settings
 * @param {string} branchId - Branch ID
 * @param {Object} settings - Settings to update
 * @returns {Promise<Object>}
 */
export const updateBranchSettings = async (branchId, settings) => {
  await mockDelay(500);

  const branch = MOCK_BRANCHES.find(b => b.id === branchId);
  if (!branch) {
    throw new Error(`Branch with ID ${branchId} not found`);
  }

  branch.settings = {
    ...branch.settings,
    ...settings,
  };
  branch.updatedAt = new Date().toISOString();

  return branch;
};

/**
 * Get all unique cities where branches are located
 * @returns {Promise<Array<string>>}
 */
export const getCities = async () => {
  await mockDelay(200);
  const cities = [...new Set(MOCK_BRANCHES.map(b => b.city).filter(Boolean))];
  return cities.sort();
};

/**
 * Get all unique states where branches are located
 * @returns {Promise<Array<string>>}
 */
export const getStates = async () => {
  await mockDelay(200);
  const states = [...new Set(MOCK_BRANCHES.map(b => b.state).filter(Boolean))];
  return states.sort();
};

/**
 * Clone branch settings from one branch to another
 * @param {string} sourceBranchId - Source branch ID
 * @param {string} targetBranchId - Target branch ID
 * @returns {Promise<Object>}
 */
export const cloneBranchSettings = async (sourceBranchId, targetBranchId) => {
  await mockDelay(500);

  const sourceBranch = MOCK_BRANCHES.find(b => b.id === sourceBranchId);
  const targetBranch = MOCK_BRANCHES.find(b => b.id === targetBranchId);

  if (!sourceBranch) {
    throw new Error(`Source branch with ID ${sourceBranchId} not found`);
  }
  if (!targetBranch) {
    throw new Error(`Target branch with ID ${targetBranchId} not found`);
  }

  targetBranch.settings = { ...sourceBranch.settings };
  targetBranch.updatedAt = new Date().toISOString();

  return targetBranch;
};

// Export as a service object
export const branchService = {
  getList,
  getById,
  create,
  update,
  remove,
  getStats,
  assignManager,
  bulkUpdateStatus,
  getConsolidatedPerformance,
  compareBranches,
  updateBranchSettings,
  getCities,
  getStates,
  cloneBranchSettings,
};
