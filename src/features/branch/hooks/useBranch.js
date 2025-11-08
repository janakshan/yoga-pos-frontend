/**
 * useBranch Hook
 *
 * Main hook for branch management operations.
 * Provides methods to fetch, create, update, and delete branches.
 */

import { useCallback } from 'react';
import { useStore } from '@/store';
import { branchService } from '../services';
import { authApi } from '@/api/auth.api';
import toast from 'react-hot-toast';

/**
 * Hook for managing branches
 * @returns {Object} Branch management interface
 */
export const useBranch = () => {
  // Get state and actions from store
  const branches = useStore((state) => state.branches);
  const selectedBranch = useStore((state) => state.selectedBranch);
  const currentBranch = useStore((state) => state.currentBranch);
  const isLoading = useStore((state) => state.branchLoading);
  const error = useStore((state) => state.branchError);
  const stats = useStore((state) => state.branchStats);

  const setBranches = useStore((state) => state.setBranches);
  const addBranch = useStore((state) => state.addBranch);
  const updateBranch = useStore((state) => state.updateBranch);
  const removeBranch = useStore((state) => state.removeBranch);
  const selectBranch = useStore((state) => state.selectBranch);
  const setCurrentBranch = useStore((state) => state.setCurrentBranch);
  const setLoading = useStore((state) => state.setBranchLoading);
  const setError = useStore((state) => state.setBranchError);
  const clearError = useStore((state) => state.clearBranchError);
  const setStats = useStore((state) => state.setBranchStats);
  const bulkUpdateBranchStatus = useStore((state) => state.bulkUpdateBranchStatus);

  /**
   * Fetch all branches with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>}
   */
  const fetchBranches = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        clearError();
        const data = await branchService.getList(filters);
        setBranches(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch branches';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setBranches, setLoading, setError, clearError]
  );

  /**
   * Fetch a single branch by ID
   * @param {string} id - Branch ID
   * @returns {Promise<Object>}
   */
  const fetchBranchById = useCallback(
    async (id) => {
      try {
        setLoading(true);
        clearError();
        const branch = await branchService.getById(id);
        selectBranch(branch);
        return branch;
      } catch (err) {
        const message = err.message || 'Failed to fetch branch';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [selectBranch, setLoading, setError, clearError]
  );

  /**
   * Create a new branch
   * @param {Object} data - Branch data
   * @returns {Promise<Object>}
   */
  const createBranch = useCallback(
    async (data) => {
      try {
        setLoading(true);
        clearError();
        const newBranch = await branchService.create(data);
        addBranch(newBranch);
        toast.success('Branch created successfully');
        return newBranch;
      } catch (err) {
        const message = err.message || 'Failed to create branch';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addBranch, setLoading, setError, clearError]
  );

  /**
   * Update an existing branch
   * @param {string} id - Branch ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object>}
   */
  const updateBranchData = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        clearError();
        const updated = await branchService.update(id, data);
        updateBranch(id, updated);
        toast.success('Branch updated successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update branch';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateBranch, setLoading, setError, clearError]
  );

  /**
   * Delete a branch
   * @param {string} id - Branch ID
   * @returns {Promise<Object>}
   */
  const deleteBranch = useCallback(
    async (id) => {
      try {
        setLoading(true);
        clearError();
        const result = await branchService.remove(id);
        removeBranch(id);
        toast.success('Branch deleted successfully');
        return result;
      } catch (err) {
        const message = err.message || 'Failed to delete branch';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [removeBranch, setLoading, setError, clearError]
  );

  /**
   * Fetch branch statistics
   * @returns {Promise<Object>}
   */
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const data = await branchService.getStats();
      setStats(data);
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch statistics';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setStats, setLoading, setError, clearError]);

  /**
   * Assign a manager to a branch
   * @param {string} branchId - Branch ID
   * @param {string} managerId - Manager user ID
   * @param {string} managerName - Manager name
   * @returns {Promise<Object>}
   */
  const assignManager = useCallback(
    async (branchId, managerId, managerName) => {
      try {
        setLoading(true);
        clearError();
        const updated = await branchService.assignManager(
          branchId,
          managerId,
          managerName
        );
        updateBranch(branchId, {
          managerId,
          managerName,
        });
        toast.success('Manager assigned successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to assign manager';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateBranch, setLoading, setError, clearError]
  );

  /**
   * Bulk update branch status
   * @param {Array<string>} branchIds - Array of branch IDs
   * @param {boolean} isActive - Target active status
   * @returns {Promise<Object>}
   */
  const bulkUpdateStatus = useCallback(
    async (branchIds, isActive) => {
      try {
        setLoading(true);
        clearError();
        const result = await branchService.bulkUpdateStatus(branchIds, isActive);
        bulkUpdateBranchStatus(branchIds, isActive);
        toast.success(
          `${result.updated} branch(es) ${
            isActive ? 'activated' : 'deactivated'
          } successfully`
        );
        return result;
      } catch (err) {
        const message = err.message || 'Failed to update branches';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [bulkUpdateBranchStatus, setLoading, setError, clearError]
  );

  /**
   * Initialize user's branch from current user data
   * Fetches current user from /auth/me and sets their branch as current
   * @returns {Promise<Object|null>}
   */
  const initializeUserBranch = useCallback(async () => {
    try {
      setLoading(true);
      clearError();

      // Fetch current user data from /auth/me
      const userData = await authApi.getCurrentUser();

      // Check if user has a branch assigned
      if (userData?.user?.branchId) {
        const userBranchId = userData.user.branchId;

        // Find the branch in the branches list
        const userBranch = branches.find((b) => b.id === userBranchId);

        if (userBranch) {
          // Set the user's branch as current
          setCurrentBranch(userBranch);
          return userBranch;
        } else {
          // If branch not found in list, try to fetch it
          const branch = await branchService.getById(userBranchId);
          if (branch) {
            setCurrentBranch(branch);
            return branch;
          }
        }
      }

      return null;
    } catch (err) {
      const message = err.message || 'Failed to initialize user branch';
      console.error(message, err);
      // Don't show toast error for this - it's called automatically
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [branches, setCurrentBranch, setLoading, setError, clearError]);

  /**
   * Get active branches from state
   * @returns {Array}
   */
  const getActiveBranches = useCallback(() => {
    return branches.filter((b) => b.isActive);
  }, [branches]);

  /**
   * Get branch by ID from state
   * @param {string} id - Branch ID
   * @returns {Object|undefined}
   */
  const getBranchById = useCallback(
    (id) => {
      return branches.find((b) => b.id === id);
    },
    [branches]
  );

  return {
    // State
    branches,
    selectedBranch,
    currentBranch,
    isLoading,
    error,
    stats,

    // Actions
    fetchBranches,
    fetchBranchById,
    createBranch,
    updateBranch: updateBranchData,
    deleteBranch,
    fetchStats,
    assignManager,
    bulkUpdateStatus,
    initializeUserBranch,

    // Selection
    selectBranch,
    setCurrentBranch,

    // Utilities
    clearError,
    getActiveBranches,
    getBranchById,
  };
};
