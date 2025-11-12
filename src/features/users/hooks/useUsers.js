/**
 * @fileoverview Custom hook for user management
 */

import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import userService from '../services/userService.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing users
 * @returns {Object} User state and actions
 */
export const useUsers = () => {
  // Selectors
  const users = useStore((state) => state.users);
  const selectedUser = useStore((state) => state.selectedUser);
  const isLoading = useStore((state) => state.userLoading);
  const error = useStore((state) => state.userError);
  const stats = useStore((state) => state.userStats);

  // Actions
  const setUsers = useStore((state) => state.setUsers);
  const addUser = useStore((state) => state.addUser);
  const updateUser = useStore((state) => state.updateUser);
  const removeUser = useStore((state) => state.removeUser);
  const selectUser = useStore((state) => state.selectUser);
  const setLoading = useStore((state) => state.setUserLoading);
  const setError = useStore((state) => state.setUserError);
  const clearError = useStore((state) => state.clearUserError);
  const setStats = useStore((state) => state.setUserStats);
  const updateUserRoles = useStore((state) => state.updateUserRoles);

  /**
   * Fetch all users with optional filters
   */
  const fetchUsers = useCallback(
    async (filters = {}) => {
      try {
        setLoading(true);
        clearError();
        const data = await userService.getAll(filters);
        setUsers(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch users';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setUsers, setError]
  );

  /**
   * Fetch user by ID
   */
  const fetchUserById = useCallback(
    async (id) => {
      try {
        setLoading(true);
        clearError();
        const data = await userService.getById(id);
        selectUser(data);
        return data;
      } catch (err) {
        const message = err.message || `Failed to fetch user ${id}`;
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, selectUser, setError]
  );

  /**
   * Create a new user
   */
  const createUser = useCallback(
    async (data) => {
      try {
        setLoading(true);
        clearError();
        const newUser = await userService.create(data);
        addUser(newUser);
        toast.success('User created successfully');
        return newUser;
      } catch (err) {
        const message = err.message || 'Failed to create user';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, addUser, setError]
  );

  /**
   * Update a user
   */
  const updateUserById = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        clearError();
        const updated = await userService.update(id, data);
        updateUser(id, updated);
        toast.success('User updated successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update user';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, updateUser, setError]
  );

  /**
   * Delete a user
   */
  const deleteUser = useCallback(
    async (id) => {
      try {
        setLoading(true);
        clearError();
        await userService.delete(id);
        removeUser(id);
        toast.success('User deleted successfully');
        return true;
      } catch (err) {
        const message = err.message || 'Failed to delete user';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, removeUser, setError]
  );

  /**
   * Assign roles to a user
   */
  const assignRoles = useCallback(
    async (userId, roleIds) => {
      try {
        setLoading(true);
        clearError();
        const updated = await userService.assignRoles(userId, roleIds);
        updateUserRoles(userId, roleIds);
        toast.success('Roles assigned successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to assign roles';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, updateUserRoles, setError]
  );

  /**
   * Change user password
   */
  const changePassword = useCallback(
    async (userId, data) => {
      try {
        setLoading(true);
        clearError();
        const result = await userService.changePassword(userId, data);
        toast.success(result.message);
        return result;
      } catch (err) {
        const message = err.message || 'Failed to change password';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  /**
   * Reset user password (admin action)
   */
  const resetPassword = useCallback(
    async (userId, data) => {
      try {
        setLoading(true);
        clearError();
        const result = await userService.resetPassword(userId, data);
        toast.success(result.message);
        return result;
      } catch (err) {
        const message = err.message || 'Failed to reset password';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  /**
   * Fetch user statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const data = await userService.getStats();
      setStats(data);
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch user statistics';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setStats, setError]);

  /**
   * Get users by branch
   */
  const getUsersByBranch = useCallback(
    async (branchId) => {
      try {
        setLoading(true);
        clearError();
        const data = await userService.getByBranch(branchId);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch users by branch';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  /**
   * Get users by role
   */
  const getUsersByRole = useCallback(
    async (roleId) => {
      try {
        setLoading(true);
        clearError();
        const data = await userService.getByRole(roleId);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch users by role';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setError]
  );

  // Local getters
  const getUserById = useCallback(
    (id) => users.find((u) => u.id === id),
    [users]
  );

  const getUserByUsername = useCallback(
    (username) => users.find((u) => u.username === username),
    [users]
  );

  return {
    // State
    users,
    selectedUser,
    isLoading,
    error,
    stats,

    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUserById,
    deleteUser,
    assignRoles,
    changePassword,
    resetPassword,
    fetchStats,
    getUsersByBranch,
    getUsersByRole,
    selectUser,
    clearError,

    // Utilities
    getUserById,
    getUserByUsername,
  };
};

export default useUsers;
