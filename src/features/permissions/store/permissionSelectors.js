/**
 * @fileoverview Permission selectors for Zustand store
 */

// Basic selectors
export const selectPermissions = (state) => state.permissions;
export const selectPermissionGroups = (state) => state.permissionGroups;
export const selectSelectedPermission = (state) => state.selectedPermission;
export const selectPermissionLoading = (state) => state.permissionLoading;
export const selectPermissionError = (state) => state.permissionError;

// Computed selectors
export const selectActivePermissions = (state) =>
  state.permissions.filter((p) => p.isActive);

export const selectInactivePermissions = (state) =>
  state.permissions.filter((p) => !p.isActive);

export const selectPermissionsByCategory = (category) => (state) =>
  state.permissions.filter((p) => p.category === category);

export const selectPermissionById = (id) => (state) =>
  state.permissions.find((p) => p.id === id);

export const selectPermissionByName = (name) => (state) =>
  state.permissions.find((p) => p.name === name);

export const selectPermissionCategories = (state) => {
  const categories = new Set(state.permissions.map((p) => p.category));
  return Array.from(categories);
};

export const selectPermissionStats = (state) => ({
  total: state.permissions.length,
  active: state.permissions.filter((p) => p.isActive).length,
  inactive: state.permissions.filter((p) => !p.isActive).length,
  categories: new Set(state.permissions.map((p) => p.category)).size,
});
