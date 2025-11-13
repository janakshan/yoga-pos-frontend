/**
 * Branch API Client
 * Handles all branch-related API requests
 * Based on API documentation: docs/api/BRANCH.md
 */

import axiosInstance from '../lib/axios';

/**
 * Create a new branch
 * @param {Object} branchData - Branch data
 * @param {string} branchData.name - Branch name
 * @param {string} branchData.code - Branch code (unique identifier)
 * @param {string} branchData.address - Branch address
 * @param {string} branchData.city - City
 * @param {string} branchData.state - State
 * @param {string} branchData.zipCode - Zip code
 * @param {string} branchData.country - Country
 * @param {string} branchData.phone - Phone number
 * @param {string} branchData.email - Email address
 * @param {boolean} branchData.isActive - Active status
 * @param {Object} branchData.settings - Branch settings
 * @returns {Promise<Object>} Created branch object
 */
export const createBranch = async (branchData) => {
  const response = await axiosInstance.post('/branches', branchData);
  return response.data;
};

/**
 * Get all branches with optional filters
 * @param {Object} params - Query parameters
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Items per page
 * @param {string} [params.search] - Search query
 * @param {string} [params.city] - Filter by city
 * @param {string} [params.state] - Filter by state
 * @param {boolean} [params.isActive] - Filter by active status
 * @param {string} [params.sortBy] - Sort field
 * @param {string} [params.sortOrder] - Sort order (ASC or DESC)
 * @returns {Promise<Object>} Branches list with pagination
 */
export const getAllBranches = async (params = {}) => {
  const response = await axiosInstance.get('/branches', { params });
  return response.data;
};

/**
 * Get branch by ID
 * @param {string} branchId - Branch ID
 * @returns {Promise<Object>} Branch object
 */
export const getBranchById = async (branchId) => {
  const response = await axiosInstance.get(`/branches/${branchId}`);
  return response.data;
};

/**
 * Get branch by code
 * @param {string} code - Branch code
 * @returns {Promise<Object>} Branch object
 */
export const getBranchByCode = async (code) => {
  const response = await axiosInstance.get(`/branches/code/${code}`);
  return response.data;
};

/**
 * Get overall branch statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getBranchStats = async () => {
  const response = await axiosInstance.get('/branches/stats');
  return response.data;
};

/**
 * Get branch settings
 * @param {string} branchId - Branch ID
 * @returns {Promise<Object>} Branch settings
 */
export const getBranchSettings = async (branchId) => {
  const response = await axiosInstance.get(`/branches/${branchId}/settings`);
  return response.data;
};

/**
 * Get branch operating hours
 * @param {string} branchId - Branch ID
 * @returns {Promise<Object>} Operating hours
 */
export const getBranchOperatingHours = async (branchId) => {
  const response = await axiosInstance.get(`/branches/${branchId}/operating-hours`);
  return response.data;
};

/**
 * Get branch performance statistics
 * @param {string} branchId - Branch ID
 * @returns {Promise<Object>} Performance statistics
 */
export const getBranchPerformance = async (branchId) => {
  const response = await axiosInstance.get(`/branches/${branchId}/stats`);
  return response.data;
};

/**
 * Update branch
 * @param {string} branchId - Branch ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated branch object
 */
export const updateBranch = async (branchId, updates) => {
  const response = await axiosInstance.patch(`/branches/${branchId}`, updates);
  return response.data;
};

/**
 * Update branch settings
 * @param {string} branchId - Branch ID
 * @param {Object} settings - Settings to update
 * @returns {Promise<Object>} Updated settings
 */
export const updateBranchSettings = async (branchId, settings) => {
  const response = await axiosInstance.patch(`/branches/${branchId}/settings`, {
    settings,
  });
  return response.data;
};

/**
 * Update branch operating hours
 * @param {string} branchId - Branch ID
 * @param {Object} operatingHours - Operating hours object
 * @returns {Promise<Object>} Updated operating hours
 */
export const updateBranchOperatingHours = async (branchId, operatingHours) => {
  const response = await axiosInstance.patch(`/branches/${branchId}/operating-hours`, {
    operatingHours,
  });
  return response.data;
};

/**
 * Delete branch
 * @param {string} branchId - Branch ID
 * @returns {Promise<Object>} Success response
 */
export const deleteBranch = async (branchId) => {
  const response = await axiosInstance.delete(`/branches/${branchId}`);
  return response.data;
};

/**
 * Assign manager to branch
 * @param {string} branchId - Branch ID
 * @param {string} managerId - Manager user ID
 * @returns {Promise<Object>} Updated branch object
 */
export const assignManager = async (branchId, managerId) => {
  const response = await axiosInstance.post(`/branches/${branchId}/manager`, {
    managerId,
  });
  return response.data;
};

/**
 * Bulk update branch status
 * @param {Array<string>} branchIds - Array of branch IDs
 * @param {boolean} isActive - Target active status
 * @returns {Promise<Object>} Bulk update result
 */
export const bulkUpdateBranchStatus = async (branchIds, isActive) => {
  const response = await axiosInstance.post('/branches/bulk/status', {
    branchIds,
    isActive,
  });
  return response.data;
};

/**
 * Get all branches performance
 * @returns {Promise<Object>} Performance data for all branches
 */
export const getAllBranchesPerformance = async () => {
  const response = await axiosInstance.get('/branches/performance');
  return response.data;
};

/**
 * Compare multiple branches
 * @param {Array<string>} branchIds - Array of branch IDs to compare
 * @returns {Promise<Object>} Comparison data
 */
export const compareBranches = async (branchIds) => {
  const response = await axiosInstance.post('/branches/compare', {
    branchIds,
  });
  return response.data;
};

/**
 * Clone settings between branches
 * @param {string} sourceBranchId - Source branch ID
 * @param {string} targetBranchId - Target branch ID
 * @returns {Promise<Object>} Success response
 */
export const cloneBranchSettings = async (sourceBranchId, targetBranchId) => {
  const response = await axiosInstance.post('/branches/settings/clone', {
    sourceBranchId,
    targetBranchId,
  });
  return response.data;
};

// Export as a service object
export const branchApi = {
  createBranch,
  getAllBranches,
  getBranchById,
  getBranchByCode,
  getBranchStats,
  getBranchSettings,
  getBranchOperatingHours,
  getBranchPerformance,
  updateBranch,
  updateBranchSettings,
  updateBranchOperatingHours,
  deleteBranch,
  assignManager,
  bulkUpdateBranchStatus,
  getAllBranchesPerformance,
  compareBranches,
  cloneBranchSettings,
};

export default branchApi;
