/**
 * @fileoverview User selectors for Zustand store
 */

// Basic selectors
export const selectUsers = (state) => state.users;
export const selectSelectedUser = (state) => state.selectedUser;
export const selectUserLoading = (state) => state.userLoading;
export const selectUserError = (state) => state.userError;
export const selectUserStats = (state) => state.userStats;

// Computed selectors
export const selectActiveUsers = (state) =>
  state.users.filter((u) => u.status === 'active');

export const selectInactiveUsers = (state) =>
  state.users.filter((u) => u.status === 'inactive');

export const selectSuspendedUsers = (state) =>
  state.users.filter((u) => u.status === 'suspended');

export const selectPendingUsers = (state) =>
  state.users.filter((u) => u.status === 'pending');

export const selectUserById = (id) => (state) =>
  state.users.find((u) => u.id === id);

export const selectUserByUsername = (username) => (state) =>
  state.users.find((u) => u.username === username);

export const selectUsersByRole = (roleId) => (state) =>
  state.users.filter((u) => u.roles.includes(roleId));

export const selectUsersByBranch = (branchId) => (state) =>
  state.users.filter((u) => u.branchId === branchId);
