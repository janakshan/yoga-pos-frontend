/**
 * Report Zustand Store Slice
 *
 * This slice manages the report state in the global store
 * using Immer middleware for immutable updates
 */

export const createReportSlice = (set, get) => ({
  // State
  reports: [],
  selectedReport: null,
  reportLoading: false,
  reportError: null,
  reportStats: {
    totalReports: 0,
    todayReports: 0,
    weekReports: 0,
    monthReports: 0,
    byType: {},
    byStatus: {},
  },
  reportFilters: {
    search: '',
    type: null,
    status: null,
    startDate: null,
    endDate: null,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },

  // Mutations (using Immer for direct mutation syntax)

  /**
   * Set the list of reports
   */
  setReports: (reports) =>
    set((state) => {
      state.reports = reports;
    }),

  /**
   * Add a new report to the list
   */
  addReport: (report) =>
    set((state) => {
      state.reports.unshift(report);
    }),

  /**
   * Update an existing report
   */
  updateReport: (id, updates) =>
    set((state) => {
      const index = state.reports.findIndex((r) => r.id === id);
      if (index !== -1) {
        state.reports[index] = {
          ...state.reports[index],
          ...updates,
          updatedAt: new Date(),
        };
      }
    }),

  /**
   * Remove a report from the list
   */
  removeReport: (id) =>
    set((state) => {
      state.reports = state.reports.filter((r) => r.id !== id);
    }),

  /**
   * Set the selected report
   */
  setSelectedReport: (report) =>
    set((state) => {
      state.selectedReport = report;
    }),

  /**
   * Clear the selected report
   */
  clearSelectedReport: () =>
    set((state) => {
      state.selectedReport = null;
    }),

  /**
   * Set loading state
   */
  setReportLoading: (loading) =>
    set((state) => {
      state.reportLoading = loading;
    }),

  /**
   * Set error state
   */
  setReportError: (error) =>
    set((state) => {
      state.reportError = error;
    }),

  /**
   * Set report statistics
   */
  setReportStats: (stats) =>
    set((state) => {
      state.reportStats = stats;
    }),

  /**
   * Set report filters
   */
  setReportFilters: (filters) =>
    set((state) => {
      state.reportFilters = {
        ...state.reportFilters,
        ...filters,
      };
    }),

  /**
   * Reset report filters
   */
  resetReportFilters: () =>
    set((state) => {
      state.reportFilters = {
        search: '',
        type: null,
        status: null,
        startDate: null,
        endDate: null,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
    }),

  /**
   * Bulk update report status
   */
  bulkUpdateReportStatus: (ids, status) =>
    set((state) => {
      ids.forEach((id) => {
        const index = state.reports.findIndex((r) => r.id === id);
        if (index !== -1) {
          state.reports[index].status = status;
          state.reports[index].updatedAt = new Date();
        }
      });
    }),

  /**
   * Bulk remove reports
   */
  bulkRemoveReports: (ids) =>
    set((state) => {
      state.reports = state.reports.filter((r) => !ids.includes(r.id));
    }),

  // Getters (using get() to access current state)

  /**
   * Get a report by ID
   */
  getReportById: (id) => {
    const state = get();
    return state.reports.find((r) => r.id === id) || null;
  },

  /**
   * Get reports by type
   */
  getReportsByType: (type) => {
    const state = get();
    return state.reports.filter((r) => r.type === type);
  },

  /**
   * Get reports by status
   */
  getReportsByStatus: (status) => {
    const state = get();
    return state.reports.filter((r) => r.status === status);
  },

  /**
   * Get recent reports (last N)
   */
  getRecentReports: (limit = 5) => {
    const state = get();
    return [...state.reports]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  /**
   * Get filtered reports based on current filters
   */
  getFilteredReports: () => {
    const state = get();
    const { reports, reportFilters } = state;

    let filtered = [...reports];

    // Apply search filter
    if (reportFilters.search) {
      const searchLower = reportFilters.search.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchLower) ||
          report.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (reportFilters.type) {
      filtered = filtered.filter((report) => report.type === reportFilters.type);
    }

    // Apply status filter
    if (reportFilters.status) {
      filtered = filtered.filter((report) => report.status === reportFilters.status);
    }

    // Apply date range filter
    if (reportFilters.startDate) {
      filtered = filtered.filter(
        (report) => new Date(report.createdAt) >= new Date(reportFilters.startDate)
      );
    }
    if (reportFilters.endDate) {
      filtered = filtered.filter(
        (report) => new Date(report.createdAt) <= new Date(reportFilters.endDate)
      );
    }

    // Apply sorting
    if (reportFilters.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[reportFilters.sortBy];
        const bVal = b[reportFilters.sortBy];

        if (reportFilters.sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    return filtered;
  },

  /**
   * Search reports by query
   */
  searchReports: (query) => {
    const state = get();
    if (!query) return state.reports;

    const queryLower = query.toLowerCase();
    return state.reports.filter(
      (report) =>
        report.title.toLowerCase().includes(queryLower) ||
        report.description.toLowerCase().includes(queryLower) ||
        report.type.toLowerCase().includes(queryLower)
    );
  },

  /**
   * Get report count by type
   */
  getReportCountByType: () => {
    const state = get();
    const counts = {};

    state.reports.forEach((report) => {
      counts[report.type] = (counts[report.type] || 0) + 1;
    });

    return counts;
  },

  /**
   * Get report count by status
   */
  getReportCountByStatus: () => {
    const state = get();
    const counts = {};

    state.reports.forEach((report) => {
      counts[report.status] = (counts[report.status] || 0) + 1;
    });

    return counts;
  },
});
