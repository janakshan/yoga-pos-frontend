/**
 * useServerManagement Hook
 * Custom hook for server management operations
 */

import { useCallback } from 'react';
import { useStore } from '../../../store';
import * as serverManagementService from '../services/serverManagementService';
import { toast } from 'react-hot-toast';

/**
 * Hook for server management functionality
 */
export const useServerManagement = () => {
  // Get state and actions from store
  const sections = useStore((state) => state.sections);
  const serverAssignments = useStore((state) => state.serverAssignments);
  const shifts = useStore((state) => state.shifts);
  const activeShifts = useStore((state) => state.activeShifts);
  const serverPerformance = useStore((state) => state.serverPerformance);
  const serverOrderHistory = useStore((state) => state.serverOrderHistory);
  const serverTips = useStore((state) => state.serverTips);
  const serverReports = useStore((state) => state.serverReports);
  const loading = useStore((state) => state.loading);
  const error = useStore((state) => state.error);
  const stats = useStore((state) => state.stats);
  const filters = useStore((state) => state.filters);

  // Actions
  const setSections = useStore((state) => state.setSections);
  const addSection = useStore((state) => state.addSection);
  const updateSection = useStore((state) => state.updateSection);
  const removeSection = useStore((state) => state.removeSection);
  const selectSection = useStore((state) => state.selectSection);

  const setServerAssignments = useStore((state) => state.setServerAssignments);
  const addServerAssignment = useStore((state) => state.addServerAssignment);
  const updateServerAssignment = useStore((state) => state.updateServerAssignment);
  const removeServerAssignment = useStore((state) => state.removeServerAssignment);

  const setShifts = useStore((state) => state.setShifts);
  const addShift = useStore((state) => state.addShift);
  const updateShift = useStore((state) => state.updateShift);
  const startShift = useStore((state) => state.startShift);
  const endShift = useStore((state) => state.endShift);
  const addBreakToShift = useStore((state) => state.addBreakToShift);
  const getServerActiveShift = useStore((state) => state.getServerActiveShift);
  const getServerShifts = useStore((state) => state.getServerShifts);

  const setServerPerformance = useStore((state) => state.setServerPerformance);
  const getServerPerformance = useStore((state) => state.getServerPerformance);

  const setServerOrderHistory = useStore((state) => state.setServerOrderHistory);
  const getServerOrderHistory = useStore((state) => state.getServerOrderHistory);

  const setServerTips = useStore((state) => state.setServerTips);
  const addServerTip = useStore((state) => state.addServerTip);
  const getServerTips = useStore((state) => state.getServerTips);

  const setServerReports = useStore((state) => state.setServerReports);
  const addServerReport = useStore((state) => state.addServerReport);

  const setLoading = useStore((state) => state.setLoading);
  const setError = useStore((state) => state.setError);
  const clearError = useStore((state) => state.clearError);
  const setFilters = useStore((state) => state.setFilters);
  const clearFilters = useStore((state) => state.clearFilters);
  const setStats = useStore((state) => state.setStats);
  const updateStats = useStore((state) => state.updateStats);

  // ========== Section Operations ==========

  /**
   * Fetch all sections
   */
  const fetchSections = useCallback(async (filters = {}) => {
    try {
      setLoading('sections', true);
      clearError();

      const response = await serverManagementService.getSections(filters);

      if (response.success) {
        setSections(response.data);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch sections';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('sections', false);
    }
  }, [setSections, setLoading, setError, clearError]);

  /**
   * Create new section
   */
  const createSection = useCallback(async (sectionData) => {
    try {
      setLoading('sections', true);
      clearError();

      const response = await serverManagementService.createSection(sectionData);

      if (response.success) {
        addSection(response.data);
        toast.success(response.message);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to create section';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('sections', false);
    }
  }, [addSection, setLoading, setError, clearError]);

  /**
   * Update existing section
   */
  const updateSectionData = useCallback(async (sectionId, updates) => {
    try {
      setLoading('sections', true);
      clearError();

      const response = await serverManagementService.updateSection(sectionId, updates);

      if (response.success) {
        updateSection(sectionId, updates);
        toast.success(response.message);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to update section';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('sections', false);
    }
  }, [updateSection, setLoading, setError, clearError]);

  /**
   * Delete section
   */
  const deleteSection = useCallback(async (sectionId) => {
    try {
      setLoading('sections', true);
      clearError();

      const response = await serverManagementService.deleteSection(sectionId);

      if (response.success) {
        removeSection(sectionId);
        toast.success(response.message);
        return true;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to delete section';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('sections', false);
    }
  }, [removeSection, setLoading, setError, clearError]);

  // ========== Server Assignment Operations ==========

  /**
   * Fetch server assignments
   */
  const fetchServerAssignments = useCallback(async (filters = {}) => {
    try {
      setLoading('assignments', true);
      clearError();

      const response = await serverManagementService.getServerAssignments(filters);

      if (response.success) {
        setServerAssignments(response.data);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch assignments';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('assignments', false);
    }
  }, [setServerAssignments, setLoading, setError, clearError]);

  /**
   * Assign server to sections
   */
  const assignServer = useCallback(async (assignmentData) => {
    try {
      setLoading('assignments', true);
      clearError();

      const response = await serverManagementService.createServerAssignment(assignmentData);

      if (response.success) {
        addServerAssignment(response.data);
        toast.success(response.message);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to assign server';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('assignments', false);
    }
  }, [addServerAssignment, setLoading, setError, clearError]);

  /**
   * End server assignment
   */
  const unassignServer = useCallback(async (assignmentId) => {
    try {
      setLoading('assignments', true);
      clearError();

      const response = await serverManagementService.endServerAssignment(assignmentId);

      if (response.success) {
        updateServerAssignment(assignmentId, {
          isActive: false,
          unassignedAt: new Date(),
        });
        toast.success(response.message);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to unassign server';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('assignments', false);
    }
  }, [updateServerAssignment, setLoading, setError, clearError]);

  // ========== Shift Operations ==========

  /**
   * Fetch shifts
   */
  const fetchShifts = useCallback(async (filters = {}) => {
    try {
      setLoading('shifts', true);
      clearError();

      const response = await serverManagementService.getShifts(filters);

      if (response.success) {
        setShifts(response.data);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch shifts';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('shifts', false);
    }
  }, [setShifts, setLoading, setError, clearError]);

  /**
   * Create shift
   */
  const createShift = useCallback(async (shiftData) => {
    try {
      setLoading('shifts', true);
      clearError();

      const response = await serverManagementService.createShift(shiftData);

      if (response.success) {
        addShift(response.data);
        toast.success(response.message);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to create shift';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('shifts', false);
    }
  }, [addShift, setLoading, setError, clearError]);

  /**
   * Clock in
   */
  const clockIn = useCallback(async (shiftId) => {
    try {
      setLoading('shifts', true);
      clearError();

      const response = await serverManagementService.clockIn(shiftId);

      if (response.success) {
        startShift(shiftId);
        toast.success(response.message);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to clock in';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('shifts', false);
    }
  }, [startShift, setLoading, setError, clearError]);

  /**
   * Clock out
   */
  const clockOut = useCallback(async (shiftId) => {
    try {
      setLoading('shifts', true);
      clearError();

      const response = await serverManagementService.clockOut(shiftId);

      if (response.success) {
        endShift(shiftId);
        toast.success(response.message);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to clock out';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('shifts', false);
    }
  }, [endShift, setLoading, setError, clearError]);

  /**
   * Add break
   */
  const addBreak = useCallback(async (shiftId, breakData) => {
    try {
      setLoading('shifts', true);
      clearError();

      const response = await serverManagementService.addBreak(shiftId, breakData);

      if (response.success) {
        addBreakToShift(shiftId, breakData);
        toast.success(response.message);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to add break';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('shifts', false);
    }
  }, [addBreakToShift, setLoading, setError, clearError]);

  // ========== Performance Operations ==========

  /**
   * Fetch server performance
   */
  const fetchServerPerformance = useCallback(async (serverId, filters = {}) => {
    try {
      setLoading('performance', true);
      clearError();

      const response = await serverManagementService.getServerPerformance(serverId, filters);

      if (response.success) {
        setServerPerformance(serverId, response.data);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch performance';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('performance', false);
    }
  }, [setServerPerformance, setLoading, setError, clearError]);

  // ========== Order History Operations ==========

  /**
   * Fetch server order history
   */
  const fetchServerOrderHistory = useCallback(async (serverId, filters = {}) => {
    try {
      setLoading('orders', true);
      clearError();

      const response = await serverManagementService.getServerOrderHistory(serverId, filters);

      if (response.success) {
        setServerOrderHistory(response.data);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch order history';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('orders', false);
    }
  }, [setServerOrderHistory, setLoading, setError, clearError]);

  // ========== Tip Operations ==========

  /**
   * Fetch server tips
   */
  const fetchServerTips = useCallback(async (serverId, filters = {}) => {
    try {
      setLoading('tips', true);
      clearError();

      const response = await serverManagementService.getServerTips(serverId, filters);

      if (response.success) {
        setServerTips(response.data);
        return response;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch tips';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('tips', false);
    }
  }, [setServerTips, setLoading, setError, clearError]);

  /**
   * Record tip
   */
  const recordTip = useCallback(async (tipData) => {
    try {
      setLoading('tips', true);
      clearError();

      const response = await serverManagementService.recordTip(tipData);

      if (response.success) {
        addServerTip(response.data);
        toast.success(response.message);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to record tip';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('tips', false);
    }
  }, [addServerTip, setLoading, setError, clearError]);

  // ========== Report Operations ==========

  /**
   * Generate server report
   */
  const generateReport = useCallback(async (reportData) => {
    try {
      setLoading('reports', true);
      clearError();

      const response = await serverManagementService.generateServerReport(reportData);

      if (response.success) {
        addServerReport(response.data);
        toast.success(response.message);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to generate report';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading('reports', false);
    }
  }, [addServerReport, setLoading, setError, clearError]);

  // ========== Stats Operations ==========

  /**
   * Fetch server management stats
   */
  const fetchStats = useCallback(async () => {
    try {
      const response = await serverManagementService.getServerManagementStats();

      if (response.success) {
        setStats(response.data);
        return response.data;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch stats';
      toast.error(errorMsg);
      throw err;
    }
  }, [setStats]);

  return {
    // State
    sections,
    serverAssignments,
    shifts,
    activeShifts,
    serverPerformance,
    serverOrderHistory,
    serverTips,
    serverReports,
    loading,
    error,
    stats,
    filters,

    // Section operations
    fetchSections,
    createSection,
    updateSectionData,
    deleteSection,
    selectSection,

    // Assignment operations
    fetchServerAssignments,
    assignServer,
    unassignServer,

    // Shift operations
    fetchShifts,
    createShift,
    clockIn,
    clockOut,
    addBreak,
    getServerActiveShift,
    getServerShifts,

    // Performance operations
    fetchServerPerformance,
    getServerPerformance,

    // Order history operations
    fetchServerOrderHistory,
    getServerOrderHistory,

    // Tip operations
    fetchServerTips,
    recordTip,
    getServerTips,

    // Report operations
    generateReport,

    // Stats operations
    fetchStats,
    updateStats,

    // Utility
    setFilters,
    clearFilters,
    clearError,
  };
};

export default useServerManagement;
