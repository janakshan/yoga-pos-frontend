/**
 * @fileoverview Role store slice using Zustand
 */

/**
 * Create role slice for Zustand store
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} Role slice
 */
export const createRoleSlice = (set, get) => ({
  // State
  roles: [],
  selectedRole: null,
  roleLoading: false,
  roleError: null,
  roleStats: {
    total: 0,
    active: 0,
    inactive: 0,
    system: 0,
    custom: 0,
  },

  // Actions
  setRoles: (roles) =>
    set((state) => ({
      roles,
      roleError: null,
    })),

  addRole: (role) =>
    set((state) => ({
      roles: [...state.roles, role],
    })),

  updateRole: (id, data) =>
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === id ? { ...role, ...data } : role
      ),
      selectedRole:
        state.selectedRole?.id === id
          ? { ...state.selectedRole, ...data }
          : state.selectedRole,
    })),

  removeRole: (id) =>
    set((state) => ({
      roles: state.roles.filter((role) => role.id !== id),
      selectedRole:
        state.selectedRole?.id === id ? null : state.selectedRole,
    })),

  selectRole: (role) =>
    set(() => ({
      selectedRole: role,
    })),

  setRoleLoading: (loading) =>
    set(() => ({
      roleLoading: loading,
    })),

  setRoleError: (error) =>
    set(() => ({
      roleError: error,
      roleLoading: false,
    })),

  clearRoleError: () =>
    set(() => ({
      roleError: null,
    })),

  setRoleStats: (stats) =>
    set(() => ({
      roleStats: stats,
    })),

  updateRolePermissions: (roleId, permissions) =>
    set((state) => ({
      roles: state.roles.map((role) =>
        role.id === roleId ? { ...role, permissions } : role
      ),
      selectedRole:
        state.selectedRole?.id === roleId
          ? { ...state.selectedRole, permissions }
          : state.selectedRole,
    })),

  // Helper selectors (can be used within actions)
  getRoleById: (id) => {
    const state = get();
    return state.roles.find((r) => r.id === id);
  },

  getRoleByCode: (code) => {
    const state = get();
    return state.roles.find((r) => r.code === code);
  },

  getSystemRoles: () => {
    const state = get();
    return state.roles.filter((r) => r.isSystem);
  },

  getCustomRoles: () => {
    const state = get();
    return state.roles.filter((r) => !r.isSystem);
  },
});

export default createRoleSlice;
