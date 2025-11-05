/**
 * Staff Selectors
 *
 * Memoized selectors for accessing staff state from the store.
 */

export const selectStaff = (state) => state.staff;
export const selectActiveStaff = (state) =>
  state.staff.filter((s) => s.status === 'active');
export const selectSelectedStaff = (state) => state.selectedStaff;
export const selectStaffLoading = (state) => state.staffLoading;
export const selectStaffError = (state) => state.staffError;
export const selectStaffStats = (state) => state.staffStats;
export const selectStaffById = (id) => (state) =>
  state.staff.find((s) => s.id === id);
export const selectStaffByBranch = (branchId) => (state) =>
  state.staff.filter((s) => s.branchId === branchId);
export const selectStaffByRole = (role) => (state) =>
  state.staff.filter((s) => s.role === role);
export const selectStaffCount = (state) => state.staff.length;
export const selectHasStaff = (state) => state.staff.length > 0;
