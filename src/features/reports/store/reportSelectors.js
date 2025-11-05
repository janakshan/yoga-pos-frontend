/**
 * Report Selectors
 *
 * Optimized selectors for accessing report state
 */

/**
 * Get all reports
 */
export const selectReports = (state) => state.reports;

/**
 * Get selected report
 */
export const selectSelectedReport = (state) => state.selectedReport;

/**
 * Get loading state
 */
export const selectReportLoading = (state) => state.reportLoading;

/**
 * Get error state
 */
export const selectReportError = (state) => state.reportError;

/**
 * Get report stats
 */
export const selectReportStats = (state) => state.reportStats;

/**
 * Get report filters
 */
export const selectReportFilters = (state) => state.reportFilters;

/**
 * Get filtered reports
 */
export const selectFilteredReports = (state) => state.getFilteredReports();

/**
 * Get recent reports
 */
export const selectRecentReports = (state) => state.getRecentReports();

/**
 * Get report by ID factory
 */
export const selectReportById = (id) => (state) => state.getReportById(id);

/**
 * Get reports by type factory
 */
export const selectReportsByType = (type) => (state) => state.getReportsByType(type);

/**
 * Get reports by status factory
 */
export const selectReportsByStatus = (status) => (state) => state.getReportsByStatus(status);

/**
 * Get report count by type
 */
export const selectReportCountByType = (state) => state.getReportCountByType();

/**
 * Get report count by status
 */
export const selectReportCountByStatus = (state) => state.getReportCountByStatus();
