/**
 * Branch API Service
 * Wrapper service that uses the real API client
 * Provides a consistent interface for branch operations
 */

import {
  createBranch as apiCreateBranch,
  getAllBranches as apiGetAllBranches,
  getBranchById as apiGetBranchById,
  getBranchByCode as apiGetBranchByCode,
  getBranchStats as apiGetBranchStats,
  getBranchSettings as apiGetBranchSettings,
  getBranchOperatingHours as apiGetBranchOperatingHours,
  getBranchPerformance as apiGetBranchPerformance,
  updateBranch as apiUpdateBranch,
  updateBranchSettings as apiUpdateBranchSettings,
  updateBranchOperatingHours as apiUpdateBranchOperatingHours,
  deleteBranch as apiDeleteBranch,
  assignManager as apiAssignManager,
  bulkUpdateBranchStatus as apiBulkUpdateBranchStatus,
  getAllBranchesPerformance as apiGetAllBranchesPerformance,
  compareBranches as apiCompareBranches,
  cloneBranchSettings as apiCloneBranchSettings,
} from '../../../api/branch.api';

/**
 * Get list of branches with optional filters
 * @param {Object} filters - Filter criteria
 * @param {string} [filters.search] - Search query
 * @param {boolean} [filters.isActive] - Filter by active status
 * @param {string} [filters.city] - Filter by city
 * @param {string} [filters.state] - Filter by state
 * @param {string} [filters.managerId] - Filter by manager ID
 * @param {string} [filters.sortBy] - Sort field
 * @param {string} [filters.sortOrder] - Sort order (asc or desc)
 * @param {number} [filters.page] - Page number
 * @param {number} [filters.limit] - Items per page
 * @returns {Promise<Array>} List of branches
 */
export const getList = async (filters = {}) => {
  try {
    const params = {
      search: filters.search,
      city: filters.city,
      state: filters.state,
      isActive: filters.isActive,
      sortBy: filters.sortBy || 'name',
      sortOrder: filters.sortOrder?.toUpperCase() || 'ASC',
      page: filters.page,
      limit: filters.limit,
    };

    // Remove undefined values
    Object.keys(params).forEach(key => {
      if (params[key] === undefined) {
        delete params[key];
      }
    });

    const response = await apiGetAllBranches(params);

    // Handle different response structures
    // If API returns paginated response with data property
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }

    // If API returns array directly
    if (Array.isArray(response)) {
      return response;
    }

    // Fallback
    return [];
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

/**
 * Get a single branch by ID
 * @param {string} id - Branch ID
 * @returns {Promise<Object>} Branch object
 */
export const getById = async (id) => {
  try {
    const response = await apiGetBranchById(id);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching branch ${id}:`, error);
    throw error;
  }
};

/**
 * Get a branch by code
 * @param {string} code - Branch code
 * @returns {Promise<Object>} Branch object
 */
export const getByCode = async (code) => {
  try {
    const response = await apiGetBranchByCode(code);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching branch by code ${code}:`, error);
    throw error;
  }
};

/**
 * Sanitize branch data for creation
 * Removes fields that shouldn't be sent to the API
 * @param {Object} data - Branch data
 * @returns {Object} Sanitized data
 */
const sanitizeBranchDataForCreate = (data) => {
  const {
    id,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    manager,
    managerName,
    staffCount,
    monthlyRevenue,
    transactionCount,
    averageTicketSize,
    customerCount,
    inventoryValue,
    ...allowedFields
  } = data;

  // Remove empty code field to allow backend auto-generation
  if (allowedFields.code === '' || allowedFields.code === null || allowedFields.code === undefined) {
    delete allowedFields.code;
  }

  return allowedFields;
};

/**
 * Create a new branch
 * @param {Object} data - Branch data
 * @returns {Promise<Object>} Created branch
 */
export const create = async (data) => {
  try {
    // Sanitize data to remove read-only/generated fields
    const sanitizedData = sanitizeBranchDataForCreate(data);
    const response = await apiCreateBranch(sanitizedData);
    return response.data || response;
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
};

/**
 * Sanitize branch data for update
 * Removes fields that shouldn't be sent to the API
 * @param {Object} data - Branch data
 * @returns {Object} Sanitized data
 */
const sanitizeBranchDataForUpdate = (data) => {
  const {
    id,
    createdAt,
    updatedAt,
    createdBy,
    updatedBy,
    manager,
    managerName,
    staffCount,
    monthlyRevenue,
    transactionCount,
    averageTicketSize,
    customerCount,
    inventoryValue,
    ...allowedFields
  } = data;

  return allowedFields;
};

/**
 * Update an existing branch
 * @param {string} id - Branch ID
 * @param {Object} data - Updated branch data
 * @returns {Promise<Object>} Updated branch
 */
export const update = async (id, data) => {
  try {
    // Sanitize data to remove read-only fields
    const sanitizedData = sanitizeBranchDataForUpdate(data);
    const response = await apiUpdateBranch(id, sanitizedData);
    return response.data || response;
  } catch (error) {
    console.error(`Error updating branch ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a branch
 * @param {string} id - Branch ID
 * @returns {Promise<Object>} Success response
 */
export const remove = async (id) => {
  try {
    const response = await apiDeleteBranch(id);
    return response;
  } catch (error) {
    console.error(`Error deleting branch ${id}:`, error);
    throw error;
  }
};

/**
 * Get branch statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getStats = async () => {
  try {
    const response = await apiGetBranchStats();
    return response.data || response;
  } catch (error) {
    console.error('Error fetching branch stats:', error);
    throw error;
  }
};

/**
 * Get branch settings
 * @param {string} branchId - Branch ID
 * @returns {Promise<Object>} Branch settings
 */
export const getSettings = async (branchId) => {
  try {
    const response = await apiGetBranchSettings(branchId);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching settings for branch ${branchId}:`, error);
    throw error;
  }
};

/**
 * Get branch operating hours
 * @param {string} branchId - Branch ID
 * @returns {Promise<Object>} Operating hours
 */
export const getOperatingHours = async (branchId) => {
  try {
    const response = await apiGetBranchOperatingHours(branchId);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching operating hours for branch ${branchId}:`, error);
    throw error;
  }
};

/**
 * Get branch performance statistics
 * @param {string} branchId - Branch ID
 * @returns {Promise<Object>} Performance statistics
 */
export const getPerformance = async (branchId) => {
  try {
    const response = await apiGetBranchPerformance(branchId);
    return response.data || response;
  } catch (error) {
    console.error(`Error fetching performance for branch ${branchId}:`, error);
    throw error;
  }
};

/**
 * Update branch settings
 * @param {string} branchId - Branch ID
 * @param {Object} settings - Settings to update
 * @returns {Promise<Object>} Updated settings
 */
export const updateBranchSettings = async (branchId, settings) => {
  try {
    const response = await apiUpdateBranchSettings(branchId, settings);
    return response.data || response;
  } catch (error) {
    console.error(`Error updating settings for branch ${branchId}:`, error);
    throw error;
  }
};

/**
 * Update branch operating hours
 * @param {string} branchId - Branch ID
 * @param {Object} operatingHours - Operating hours object
 * @returns {Promise<Object>} Updated operating hours
 */
export const updateOperatingHours = async (branchId, operatingHours) => {
  try {
    const response = await apiUpdateBranchOperatingHours(branchId, operatingHours);
    return response.data || response;
  } catch (error) {
    console.error(`Error updating operating hours for branch ${branchId}:`, error);
    throw error;
  }
};

/**
 * Assign a manager to a branch
 * @param {string} branchId - Branch ID
 * @param {string} managerId - Manager user ID
 * @returns {Promise<Object>} Updated branch
 */
export const assignManager = async (branchId, managerId) => {
  try {
    const response = await apiAssignManager(branchId, managerId);
    return response.data || response;
  } catch (error) {
    console.error(`Error assigning manager to branch ${branchId}:`, error);
    throw error;
  }
};

/**
 * Bulk activate/deactivate branches
 * @param {Array<string>} branchIds - Array of branch IDs
 * @param {boolean} isActive - Target active status
 * @returns {Promise<Object>} Bulk update result
 */
export const bulkUpdateStatus = async (branchIds, isActive) => {
  try {
    const response = await apiBulkUpdateBranchStatus(branchIds, isActive);
    return response.data || response;
  } catch (error) {
    console.error('Error bulk updating branch status:', error);
    throw error;
  }
};

/**
 * Get consolidated performance data across all branches
 * @returns {Promise<Object>} Performance data
 */
export const getConsolidatedPerformance = async () => {
  try {
    const response = await apiGetAllBranchesPerformance();
    return response.data || response;
  } catch (error) {
    console.error('Error fetching consolidated performance:', error);
    throw error;
  }
};

/**
 * Get branch comparison metrics
 * @param {Array<string>} branchIds - Branch IDs to compare
 * @returns {Promise<Object>} Comparison data
 */
export const compareBranches = async (branchIds) => {
  try {
    const response = await apiCompareBranches(branchIds);
    return response.data || response;
  } catch (error) {
    console.error('Error comparing branches:', error);
    throw error;
  }
};

/**
 * Clone branch settings from one branch to another
 * @param {string} sourceBranchId - Source branch ID
 * @param {string} targetBranchId - Target branch ID
 * @returns {Promise<Object>} Success response
 */
export const cloneBranchSettings = async (sourceBranchId, targetBranchId) => {
  try {
    const response = await apiCloneBranchSettings(sourceBranchId, targetBranchId);
    return response.data || response;
  } catch (error) {
    console.error('Error cloning branch settings:', error);
    throw error;
  }
};

/**
 * Get all unique cities where branches are located
 * @returns {Promise<Array<string>>} List of cities
 */
export const getCities = async () => {
  try {
    // Fetch all branches and extract unique cities
    const branches = await getList();
    const cities = [...new Set(branches.map(b => b.city).filter(Boolean))];
    return cities.sort();
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw error;
  }
};

/**
 * Get all unique states where branches are located
 * @returns {Promise<Array<string>>} List of states
 */
export const getStates = async () => {
  try {
    // Fetch all branches and extract unique states
    const branches = await getList();
    const states = [...new Set(branches.map(b => b.state).filter(Boolean))];
    return states.sort();
  } catch (error) {
    console.error('Error fetching states:', error);
    throw error;
  }
};

// Export as a service object
export const branchApiService = {
  getList,
  getById,
  getByCode,
  create,
  update,
  remove,
  getStats,
  getSettings,
  getOperatingHours,
  getPerformance,
  updateBranchSettings,
  updateOperatingHours,
  assignManager,
  bulkUpdateStatus,
  getConsolidatedPerformance,
  compareBranches,
  cloneBranchSettings,
  getCities,
  getStates,
};

export default branchApiService;
