/**
 * Staff Slice
 *
 * Zustand slice for managing staff state in the global store.
 * Uses Immer for immutable state updates.
 */

/**
 * Creates the staff slice for the store
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} Staff slice
 */
export const createStaffSlice = (set, get) => ({
  // State
  staff: [],
  selectedStaff: null,
  staffLoading: false,
  staffError: null,
  staffStats: {
    totalStaff: 0,
    activeStaff: 0,
    inactiveStaff: 0,
    onLeave: 0,
    fullTime: 0,
    partTime: 0,
    byRole: {},
    byBranch: {},
    byDepartment: {},
  },

  // Actions

  /**
   * Set the list of staff
   * @param {Array} staff - Array of staff objects
   */
  setStaff: (staff) =>
    set((state) => {
      state.staff = staff;
    }),

  /**
   * Add a new staff member to the list
   * @param {Object} member - Staff object
   */
  addStaff: (member) =>
    set((state) => {
      state.staff.push(member);
    }),

  /**
   * Update an existing staff member
   * @param {string} id - Staff ID
   * @param {Object} updates - Fields to update
   */
  updateStaffMember: (id, updates) =>
    set((state) => {
      const index = state.staff.findIndex((s) => s.id === id);
      if (index >= 0) {
        state.staff[index] = {
          ...state.staff[index],
          ...updates,
        };

        // Update selected staff if it's the one being updated
        if (state.selectedStaff?.id === id) {
          state.selectedStaff = {
            ...state.selectedStaff,
            ...updates,
          };
        }
      }
    }),

  /**
   * Remove a staff member from the list
   * @param {string} id - Staff ID
   */
  removeStaff: (id) =>
    set((state) => {
      state.staff = state.staff.filter((s) => s.id !== id);

      // Clear selected staff if it's the one being removed
      if (state.selectedStaff?.id === id) {
        state.selectedStaff = null;
      }
    }),

  /**
   * Set the selected staff member (for viewing/editing)
   * @param {Object|null} member - Staff object or null
   */
  selectStaffMember: (member) =>
    set((state) => {
      state.selectedStaff = member;
    }),

  /**
   * Set loading state
   * @param {boolean} isLoading - Loading state
   */
  setStaffLoading: (isLoading) =>
    set((state) => {
      state.staffLoading = isLoading;
    }),

  /**
   * Set error state
   * @param {string|null} error - Error message
   */
  setStaffError: (error) =>
    set((state) => {
      state.staffError = error;
    }),

  /**
   * Clear error state
   */
  clearStaffError: () =>
    set((state) => {
      state.staffError = null;
    }),

  /**
   * Set staff statistics
   * @param {Object} stats - Statistics object
   */
  setStaffStats: (stats) =>
    set((state) => {
      state.staffStats = stats;
    }),

  /**
   * Get staff member by ID
   * @param {string} id - Staff ID
   * @returns {Object|undefined}
   */
  getStaffById: (id) => {
    const state = get();
    return state.staff.find((s) => s.id === id);
  },

  /**
   * Get active staff members
   * @returns {Array}
   */
  getActiveStaff: () => {
    const state = get();
    return state.staff.filter((s) => s.status === 'active');
  },

  /**
   * Get staff by branch
   * @param {string} branchId - Branch ID
   * @returns {Array}
   */
  getStaffByBranch: (branchId) => {
    const state = get();
    return state.staff.filter((s) => s.branchId === branchId);
  },

  /**
   * Get staff by role
   * @param {string} role - Staff role
   * @returns {Array}
   */
  getStaffByRole: (role) => {
    const state = get();
    return state.staff.filter((s) => s.role === role);
  },

  /**
   * Check if user has any staff
   * @returns {boolean}
   */
  hasStaff: () => {
    const state = get();
    return state.staff.length > 0;
  },

  /**
   * Reset staff state
   */
  resetStaffState: () =>
    set((state) => {
      state.staff = [];
      state.selectedStaff = null;
      state.staffLoading = false;
      state.staffError = null;
      state.staffStats = {
        totalStaff: 0,
        activeStaff: 0,
        inactiveStaff: 0,
        onLeave: 0,
        fullTime: 0,
        partTime: 0,
        byRole: {},
        byBranch: {},
        byDepartment: {},
      };
    }),
});
