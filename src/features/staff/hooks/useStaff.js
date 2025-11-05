/**
 * useStaff Hook
 *
 * Main hook for staff management operations.
 */

import { useCallback } from 'react';
import { useStore } from '@/store';
import { staffService } from '../services';
import toast from 'react-hot-toast';

export const useStaff = () => {
  const staff = useStore((state) => state.staff);
  const selectedStaff = useStore((state) => state.selectedStaff);
  const isLoading = useStore((state) => state.staffLoading);
  const error = useStore((state) => state.staffError);
  const stats = useStore((state) => state.staffStats);

  const setStaff = useStore((state) => state.setStaff);
  const addStaff = useStore((state) => state.addStaff);
  const updateStaffMember = useStore((state) => state.updateStaffMember);
  const removeStaff = useStore((state) => state.removeStaff);
  const selectStaffMember = useStore((state) => state.selectStaffMember);
  const setStaffLoading = useStore((state) => state.setStaffLoading);
  const setStaffError = useStore((state) => state.setStaffError);
  const clearStaffError = useStore((state) => state.clearStaffError);
  const setStaffStats = useStore((state) => state.setStaffStats);

  const fetchStaff = useCallback(
    async (filters = {}) => {
      try {
        setStaffLoading(true);
        clearStaffError();
        const data = await staffService.getList(filters);
        setStaff(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch staff';
        setStaffError(message);
        toast.error(message);
        throw err;
      } finally {
        setStaffLoading(false);
      }
    },
    [setStaff, setStaffLoading, setStaffError, clearStaffError]
  );

  const fetchStaffById = useCallback(
    async (id) => {
      try {
        setStaffLoading(true);
        clearStaffError();
        const member = await staffService.getById(id);
        selectStaffMember(member);
        return member;
      } catch (err) {
        const message = err.message || 'Failed to fetch staff member';
        setStaffError(message);
        toast.error(message);
        throw err;
      } finally {
        setStaffLoading(false);
      }
    },
    [selectStaffMember, setStaffLoading, setStaffError, clearStaffError]
  );

  const createStaff = useCallback(
    async (data) => {
      try {
        setStaffLoading(true);
        clearStaffError();
        const newMember = await staffService.create(data);
        addStaff(newMember);
        toast.success('Staff member created successfully');
        return newMember;
      } catch (err) {
        const message = err.message || 'Failed to create staff member';
        setStaffError(message);
        toast.error(message);
        throw err;
      } finally {
        setStaffLoading(false);
      }
    },
    [addStaff, setStaffLoading, setStaffError, clearStaffError]
  );

  const updateStaff = useCallback(
    async (id, data) => {
      try {
        setStaffLoading(true);
        clearStaffError();
        const updated = await staffService.update(id, data);
        updateStaffMember(id, updated);
        toast.success('Staff member updated successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update staff member';
        setStaffError(message);
        toast.error(message);
        throw err;
      } finally {
        setStaffLoading(false);
      }
    },
    [updateStaffMember, setStaffLoading, setStaffError, clearStaffError]
  );

  const deleteStaff = useCallback(
    async (id) => {
      try {
        setStaffLoading(true);
        clearStaffError();
        await staffService.remove(id);
        removeStaff(id);
        toast.success('Staff member deleted successfully');
      } catch (err) {
        const message = err.message || 'Failed to delete staff member';
        setStaffError(message);
        toast.error(message);
        throw err;
      } finally {
        setStaffLoading(false);
      }
    },
    [removeStaff, setStaffLoading, setStaffError, clearStaffError]
  );

  const fetchStats = useCallback(async () => {
    try {
      setStaffLoading(true);
      clearStaffError();
      const data = await staffService.getStats();
      setStaffStats(data);
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch statistics';
      setStaffError(message);
      toast.error(message);
      throw err;
    } finally {
      setStaffLoading(false);
    }
  }, [setStaffStats, setStaffLoading, setStaffError, clearStaffError]);

  return {
    staff,
    selectedStaff,
    isLoading,
    error,
    stats,
    fetchStaff,
    fetchStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    fetchStats,
    selectStaffMember,
    clearError: clearStaffError,
  };
};
