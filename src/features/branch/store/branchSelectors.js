/**
 * Branch Selectors
 *
 * Memoized selectors for accessing branch state from the store.
 * These selectors help optimize re-renders by providing stable references.
 */

/**
 * Select all branches
 * @param {Object} state - Store state
 * @returns {Array}
 */
export const selectBranches = (state) => state.branches;

/**
 * Select active branches
 * @param {Object} state - Store state
 * @returns {Array}
 */
export const selectActiveBranches = (state) =>
  state.branches.filter((b) => b.isActive);

/**
 * Select inactive branches
 * @param {Object} state - Store state
 * @returns {Array}
 */
export const selectInactiveBranches = (state) =>
  state.branches.filter((b) => !b.isActive);

/**
 * Select selected branch
 * @param {Object} state - Store state
 * @returns {Object|null}
 */
export const selectSelectedBranch = (state) => state.selectedBranch;

/**
 * Select current branch (the branch the user is operating in)
 * @param {Object} state - Store state
 * @returns {Object|null}
 */
export const selectCurrentBranch = (state) => state.currentBranch;

/**
 * Select branch loading state
 * @param {Object} state - Store state
 * @returns {boolean}
 */
export const selectBranchLoading = (state) => state.isLoading;

/**
 * Select branch error
 * @param {Object} state - Store state
 * @returns {string|null}
 */
export const selectBranchError = (state) => state.error;

/**
 * Select branch statistics
 * @param {Object} state - Store state
 * @returns {Object}
 */
export const selectBranchStats = (state) => state.stats;

/**
 * Select branch by ID
 * @param {string} id - Branch ID
 * @returns {Function} Selector function
 */
export const selectBranchById = (id) => (state) =>
  state.branches.find((b) => b.id === id);

/**
 * Select branches by city
 * @param {string} city - City name
 * @returns {Function} Selector function
 */
export const selectBranchesByCity = (city) => (state) =>
  state.branches.filter((b) => b.city.toLowerCase() === city.toLowerCase());

/**
 * Select branches by manager
 * @param {string} managerId - Manager user ID
 * @returns {Function} Selector function
 */
export const selectBranchesByManager = (managerId) => (state) =>
  state.branches.filter((b) => b.managerId === managerId);

/**
 * Select branches without manager
 * @param {Object} state - Store state
 * @returns {Array}
 */
export const selectBranchesWithoutManager = (state) =>
  state.branches.filter((b) => !b.managerId);

/**
 * Select total branch count
 * @param {Object} state - Store state
 * @returns {number}
 */
export const selectBranchCount = (state) => state.branches.length;

/**
 * Select active branch count
 * @param {Object} state - Store state
 * @returns {number}
 */
export const selectActiveBranchCount = (state) =>
  state.branches.filter((b) => b.isActive).length;

/**
 * Check if any branches exist
 * @param {Object} state - Store state
 * @returns {boolean}
 */
export const selectHasBranches = (state) => state.branches.length > 0;
