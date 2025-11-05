/**
 * Reports Feature Module
 *
 * Generates and displays various reports and analytics
 *
 * Public API:
 * - Components: ReportList, ReportGenerator, ReportViewer
 * - Hooks: useReports
 * - Services: reportService
 * - Store: createReportSlice, selectors
 * - Types: Report types and constants
 */

// Export components
export { ReportList, ReportGenerator, ReportViewer } from './components/index.js';

// Export hooks
export { useReports } from './hooks/index.js';

// Export services
export { reportService } from './services/index.js';

// Export store
export { createReportSlice } from './store/index.js';
export * from './store/reportSelectors.js';

// Export types
export * from './types/index.js';
