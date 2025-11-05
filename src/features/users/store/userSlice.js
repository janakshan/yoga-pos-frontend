/**
 * @fileoverview User store slice using Zustand
 */

/**
 * Create user slice for Zustand store
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} User slice
 */
export const createUserSlice = (set, get) => ({
  // State
  users: [],
  selectedUser: null,
  userLoading: false,
  userError: null,
  userStats: {
    total: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    pending: 0,
    loggedInToday: 0,
  },

  // Actions
  setUsers: (users) =>
    set((state) => ({
      users,
      userError: null,
    })),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
    })),

  updateUser: (id, data) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...data } : user
      ),
      selectedUser:
        state.selectedUser?.id === id
          ? { ...state.selectedUser, ...data }
          : state.selectedUser,
    })),

  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
      selectedUser:
        state.selectedUser?.id === id ? null : state.selectedUser,
    })),

  selectUser: (user) =>
    set(() => ({
      selectedUser: user,
    })),

  setUserLoading: (loading) =>
    set(() => ({
      userLoading: loading,
    })),

  setUserError: (error) =>
    set(() => ({
      userError: error,
      userLoading: false,
    })),

  clearUserError: () =>
    set(() => ({
      userError: null,
    })),

  setUserStats: (stats) =>
    set(() => ({
      userStats: stats,
    })),

  updateUserRoles: (userId, roles) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, roles } : user
      ),
      selectedUser:
        state.selectedUser?.id === userId
          ? { ...state.selectedUser, roles }
          : state.selectedUser,
    })),

  // Helper selectors
  getUserById: (id) => {
    const state = get();
    return state.users.find((u) => u.id === id);
  },

  getUserByUsername: (username) => {
    const state = get();
    return state.users.find((u) => u.username === username);
  },

  getUsersByRole: (roleId) => {
    const state = get();
    return state.users.filter((u) => u.roles.includes(roleId));
  },

  getUsersByBranch: (branchId) => {
    const state = get();
    return state.users.filter((u) => u.branchId === branchId);
  },
});

export default createUserSlice;
