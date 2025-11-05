/**
 * @fileoverview Permission store slice using Zustand
 */

/**
 * Create permission slice for Zustand store
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} Permission slice
 */
export const createPermissionSlice = (set, get) => ({
  // State
  permissions: [],
  permissionGroups: [],
  selectedPermission: null,
  permissionLoading: false,
  permissionError: null,

  // Actions
  setPermissions: (permissions) =>
    set((state) => ({
      permissions,
      permissionError: null,
    })),

  setPermissionGroups: (permissionGroups) =>
    set((state) => ({
      permissionGroups,
      permissionError: null,
    })),

  addPermission: (permission) =>
    set((state) => ({
      permissions: [...state.permissions, permission],
    })),

  updatePermission: (id, data) =>
    set((state) => ({
      permissions: state.permissions.map((perm) =>
        perm.id === id ? { ...perm, ...data } : perm
      ),
      selectedPermission:
        state.selectedPermission?.id === id
          ? { ...state.selectedPermission, ...data }
          : state.selectedPermission,
    })),

  removePermission: (id) =>
    set((state) => ({
      permissions: state.permissions.filter((perm) => perm.id !== id),
      selectedPermission:
        state.selectedPermission?.id === id ? null : state.selectedPermission,
    })),

  selectPermission: (permission) =>
    set(() => ({
      selectedPermission: permission,
    })),

  setPermissionLoading: (loading) =>
    set(() => ({
      permissionLoading: loading,
    })),

  setPermissionError: (error) =>
    set(() => ({
      permissionError: error,
      permissionLoading: false,
    })),

  clearPermissionError: () =>
    set(() => ({
      permissionError: null,
    })),

  bulkUpdatePermissionStatus: (ids, isActive) =>
    set((state) => ({
      permissions: state.permissions.map((perm) =>
        ids.includes(perm.id) ? { ...perm, isActive } : perm
      ),
    })),

  // Helper selectors (can be used within actions)
  getPermissionById: (id) => {
    const state = get();
    return state.permissions.find((p) => p.id === id);
  },

  getPermissionByName: (name) => {
    const state = get();
    return state.permissions.find((p) => p.name === name);
  },

  getPermissionsByCategory: (category) => {
    const state = get();
    return state.permissions.filter((p) => p.category === category);
  },
});

export default createPermissionSlice;
