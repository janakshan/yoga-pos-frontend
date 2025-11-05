import { useCallback } from 'react';
import { useStore } from '@/store';
import { reportService } from '../services';
import toast from 'react-hot-toast';

/**
 * Custom hook for report management
 * Provides access to report state and actions
 */
export const useReports = () => {
  // State selectors
  const reports = useStore((state) => state.reports);
  const selectedReport = useStore((state) => state.selectedReport);
  const isLoading = useStore((state) => state.reportLoading);
  const error = useStore((state) => state.reportError);
  const stats = useStore((state) => state.reportStats);
  const filters = useStore((state) => state.reportFilters);

  // Action selectors
  const setReports = useStore((state) => state.setReports);
  const addReport = useStore((state) => state.addReport);
  const updateReport = useStore((state) => state.updateReport);
  const removeReport = useStore((state) => state.removeReport);
  const setSelectedReport = useStore((state) => state.setSelectedReport);
  const clearSelectedReport = useStore((state) => state.clearSelectedReport);
  const setReportLoading = useStore((state) => state.setReportLoading);
  const setReportError = useStore((state) => state.setReportError);
  const setReportStats = useStore((state) => state.setReportStats);
  const setReportFilters = useStore((state) => state.setReportFilters);
  const resetReportFilters = useStore((state) => state.resetReportFilters);
  const bulkUpdateReportStatus = useStore((state) => state.bulkUpdateReportStatus);
  const bulkRemoveReports = useStore((state) => state.bulkRemoveReports);

  // Getter selectors
  const getReportById = useStore((state) => state.getReportById);
  const getReportsByType = useStore((state) => state.getReportsByType);
  const getReportsByStatus = useStore((state) => state.getReportsByStatus);
  const getRecentReports = useStore((state) => state.getRecentReports);
  const getFilteredReports = useStore((state) => state.getFilteredReports);
  const searchReports = useStore((state) => state.searchReports);

  // Async actions

  /**
   * Fetch all reports with optional filters
   */
  const fetchReports = useCallback(
    async (filterOptions = {}) => {
      try {
        setReportLoading(true);
        setReportError(null);
        const data = await reportService.getList(filterOptions);
        setReports(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch reports';
        setReportError(message);
        toast.error(message);
        throw err;
      } finally {
        setReportLoading(false);
      }
    },
    [setReports, setReportLoading, setReportError]
  );

  /**
   * Fetch a single report by ID
   */
  const fetchReportById = useCallback(
    async (id) => {
      try {
        setReportLoading(true);
        setReportError(null);
        const data = await reportService.getById(id);
        setSelectedReport(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch report';
        setReportError(message);
        toast.error(message);
        throw err;
      } finally {
        setReportLoading(false);
      }
    },
    [setSelectedReport, setReportLoading, setReportError]
  );

  /**
   * Generate a new report
   */
  const generateReport = useCallback(
    async (reportData) => {
      try {
        setReportLoading(true);
        setReportError(null);
        const newReport = await reportService.generate(reportData);
        addReport(newReport);
        toast.success('Report generated successfully');
        return newReport;
      } catch (err) {
        const message = err.message || 'Failed to generate report';
        setReportError(message);
        toast.error(message);
        throw err;
      } finally {
        setReportLoading(false);
      }
    },
    [addReport, setReportLoading, setReportError]
  );

  /**
   * Update an existing report
   */
  const updateExistingReport = useCallback(
    async (id, updates) => {
      try {
        setReportLoading(true);
        setReportError(null);
        const updatedReport = await reportService.update(id, updates);
        updateReport(id, updatedReport);
        toast.success('Report updated successfully');
        return updatedReport;
      } catch (err) {
        const message = err.message || 'Failed to update report';
        setReportError(message);
        toast.error(message);
        throw err;
      } finally {
        setReportLoading(false);
      }
    },
    [updateReport, setReportLoading, setReportError]
  );

  /**
   * Delete a report
   */
  const deleteReport = useCallback(
    async (id) => {
      try {
        setReportLoading(true);
        setReportError(null);
        await reportService.remove(id);
        removeReport(id);
        toast.success('Report deleted successfully');
        return true;
      } catch (err) {
        const message = err.message || 'Failed to delete report';
        setReportError(message);
        toast.error(message);
        throw err;
      } finally {
        setReportLoading(false);
      }
    },
    [removeReport, setReportLoading, setReportError]
  );

  /**
   * Archive a report
   */
  const archiveReport = useCallback(
    async (id) => {
      try {
        setReportLoading(true);
        setReportError(null);
        const archivedReport = await reportService.archive(id);
        updateReport(id, archivedReport);
        toast.success('Report archived successfully');
        return archivedReport;
      } catch (err) {
        const message = err.message || 'Failed to archive report';
        setReportError(message);
        toast.error(message);
        throw err;
      } finally {
        setReportLoading(false);
      }
    },
    [updateReport, setReportLoading, setReportError]
  );

  /**
   * Export a report
   */
  const exportReport = useCallback(
    async (id, format) => {
      try {
        setReportLoading(true);
        setReportError(null);
        const result = await reportService.export(id, format);
        toast.success(`Report exported as ${format.toUpperCase()}`);
        return result;
      } catch (err) {
        const message = err.message || 'Failed to export report';
        setReportError(message);
        toast.error(message);
        throw err;
      } finally {
        setReportLoading(false);
      }
    },
    [setReportLoading, setReportError]
  );

  /**
   * Fetch report statistics
   */
  const fetchReportStats = useCallback(async () => {
    try {
      const statsData = await reportService.getStats();
      setReportStats(statsData);
      return statsData;
    } catch (err) {
      const message = err.message || 'Failed to fetch report statistics';
      console.error(message, err);
      // Don't show toast for stats errors, just log them
      throw err;
    }
  }, [setReportStats]);

  /**
   * Bulk delete reports
   */
  const bulkDelete = useCallback(
    async (ids) => {
      try {
        setReportLoading(true);
        setReportError(null);
        const deleted = await reportService.bulkDelete(ids);
        bulkRemoveReports(ids);
        toast.success(`${deleted} report(s) deleted successfully`);
        return deleted;
      } catch (err) {
        const message = err.message || 'Failed to delete reports';
        setReportError(message);
        toast.error(message);
        throw err;
      } finally {
        setReportLoading(false);
      }
    },
    [bulkRemoveReports, setReportLoading, setReportError]
  );

  /**
   * Bulk archive reports
   */
  const bulkArchive = useCallback(
    async (ids) => {
      try {
        setReportLoading(true);
        setReportError(null);
        const archived = await reportService.bulkArchive(ids);
        bulkUpdateReportStatus(ids, 'archived');
        toast.success(`${archived} report(s) archived successfully`);
        return archived;
      } catch (err) {
        const message = err.message || 'Failed to archive reports';
        setReportError(message);
        toast.error(message);
        throw err;
      } finally {
        setReportLoading(false);
      }
    },
    [bulkUpdateReportStatus, setReportLoading, setReportError]
  );

  // Return public API
  return {
    // State
    reports,
    selectedReport,
    isLoading,
    error,
    stats,
    filters,

    // Actions
    fetchReports,
    fetchReportById,
    generateReport,
    updateExistingReport,
    deleteReport,
    archiveReport,
    exportReport,
    fetchReportStats,
    bulkDelete,
    bulkArchive,

    // Store actions
    setSelectedReport,
    clearSelectedReport,
    setReportFilters,
    resetReportFilters,

    // Getters
    getReportById,
    getReportsByType,
    getReportsByStatus,
    getRecentReports,
    getFilteredReports,
    searchReports,
  };
};
