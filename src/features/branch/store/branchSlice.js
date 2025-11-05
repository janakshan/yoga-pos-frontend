/**
 * Branch Slice
 *
 * Zustand slice for managing branch state in the global store.
 * Uses Immer for immutable state updates.
 */

/**
 * Creates the branch slice for the store
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} Branch slice
 */
export const createBranchSlice = (set, get) => ({
  // State
  branches: [],
  selectedBranch: null,
  currentBranch: null, // The branch the user is currently operating in
  isLoading: false,
  error: null,
  stats: {
    totalBranches: 0,
    activeBranches: 0,
    inactiveBranches: 0,
    totalStaff: 0,
    branchesWithoutManager: 0,
  },

  // Actions

  /**
   * Set the list of branches
   * @param {Array} branches - Array of branch objects
   */
  setBranches: (branches) =>
    set((state) => {
      state.branches = branches;
    }),

  /**
   * Add a new branch to the list
   * @param {Object} branch - Branch object
   */
  addBranch: (branch) =>
    set((state) => {
      state.branches.push(branch);
    }),

  /**
   * Update an existing branch
   * @param {string} id - Branch ID
   * @param {Object} updates - Fields to update
   */
  updateBranch: (id, updates) =>
    set((state) => {
      const index = state.branches.findIndex((b) => b.id === id);
      if (index >= 0) {
        state.branches[index] = {
          ...state.branches[index],
          ...updates,
        };

        // Update selected branch if it's the one being updated
        if (state.selectedBranch?.id === id) {
          state.selectedBranch = {
            ...state.selectedBranch,
            ...updates,
          };
        }

        // Update current branch if it's the one being updated
        if (state.currentBranch?.id === id) {
          state.currentBranch = {
            ...state.currentBranch,
            ...updates,
          };
        }
      }
    }),

  /**
   * Remove a branch from the list
   * @param {string} id - Branch ID
   */
  removeBranch: (id) =>
    set((state) => {
      state.branches = state.branches.filter((b) => b.id !== id);

      // Clear selected branch if it's the one being removed
      if (state.selectedBranch?.id === id) {
        state.selectedBranch = null;
      }

      // Clear current branch if it's the one being removed
      if (state.currentBranch?.id === id) {
        state.currentBranch = null;
      }
    }),

  /**
   * Set the selected branch (for viewing/editing)
   * @param {Object|null} branch - Branch object or null
   */
  selectBranch: (branch) =>
    set((state) => {
      state.selectedBranch = branch;
    }),

  /**
   * Set the current branch (the branch the user is operating in)
   * @param {Object|null} branch - Branch object or null
   */
  setCurrentBranch: (branch) =>
    set((state) => {
      state.currentBranch = branch;
      // Persist to localStorage for session continuity
      if (branch) {
        localStorage.setItem('currentBranchId', branch.id);
      } else {
        localStorage.removeItem('currentBranchId');
      }
    }),

  /**
   * Set loading state
   * @param {boolean} isLoading - Loading state
   */
  setLoading: (isLoading) =>
    set((state) => {
      state.isLoading = isLoading;
    }),

  /**
   * Set error state
   * @param {string|null} error - Error message
   */
  setError: (error) =>
    set((state) => {
      state.error = error;
    }),

  /**
   * Clear error state
   */
  clearError: () =>
    set((state) => {
      state.error = null;
    }),

  /**
   * Set branch statistics
   * @param {Object} stats - Statistics object
   */
  setStats: (stats) =>
    set((state) => {
      state.stats = stats;
    }),

  /**
   * Bulk update branch status (activate/deactivate)
   * @param {Array<string>} branchIds - Array of branch IDs
   * @param {boolean} isActive - Target active status
   */
  bulkUpdateBranchStatus: (branchIds, isActive) =>
    set((state) => {
      branchIds.forEach((id) => {
        const index = state.branches.findIndex((b) => b.id === id);
        if (index >= 0) {
          state.branches[index].isActive = isActive;
          state.branches[index].updatedAt = new Date().toISOString();
        }
      });
    }),

  /**
   * Get branch by ID
   * @param {string} id - Branch ID
   * @returns {Object|undefined}
   */
  getBranchById: (id) => {
    const state = get();
    return state.branches.find((b) => b.id === id);
  },

  /**
   * Get active branches
   * @returns {Array}
   */
  getActiveBranches: () => {
    const state = get();
    return state.branches.filter((b) => b.isActive);
  },

  /**
   * Get branches by manager
   * @param {string} managerId - Manager user ID
   * @returns {Array}
   */
  getBranchesByManager: (managerId) => {
    const state = get();
    return state.branches.filter((b) => b.managerId === managerId);
  },

  /**
   * Check if user has any branches
   * @returns {boolean}
   */
  hasBranches: () => {
    const state = get();
    return state.branches.length > 0;
  },

  /**
   * Reset branch state
   */
  resetBranchState: () =>
    set((state) => {
      state.branches = [];
      state.selectedBranch = null;
      state.currentBranch = null;
      state.isLoading = false;
      state.error = null;
      state.stats = {
        totalBranches: 0,
        activeBranches: 0,
        inactiveBranches: 0,
        totalStaff: 0,
        branchesWithoutManager: 0,
      };
    }),
});
