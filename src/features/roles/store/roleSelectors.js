/**
 * @fileoverview Role selectors for Zustand store
 */

// Basic selectors
export const selectRoles = (state) => state.roles;
export const selectSelectedRole = (state) => state.selectedRole;
export const selectRoleLoading = (state) => state.roleLoading;
export const selectRoleError = (state) => state.roleError;
export const selectRoleStats = (state) => state.roleStats;

// Computed selectors
export const selectActiveRoles = (state) =>
  state.roles.filter((r) => r.isActive);

export const selectInactiveRoles = (state) =>
  state.roles.filter((r) => !r.isActive);

export const selectSystemRoles = (state) =>
  state.roles.filter((r) => r.isSystem);

export const selectCustomRoles = (state) =>
  state.roles.filter((r) => !r.isSystem);

export const selectRoleById = (id) => (state) =>
  state.roles.find((r) => r.id === id);

export const selectRoleByCode = (code) => (state) =>
  state.roles.find((r) => r.code === code);

export const selectRolesWithPermission = (permissionName) => (state) =>
  state.roles.filter((r) => r.permissions.includes(permissionName));
