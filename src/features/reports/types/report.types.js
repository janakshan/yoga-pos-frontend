/**
 * @typedef {Object} Report
 * @property {string} id - Unique identifier for the report
 * @property {string} title - Report title
 * @property {string} type - Report type (from REPORT_TYPES)
 * @property {string} description - Brief description of the report
 * @property {string} status - Report status (from REPORT_STATUS)
 * @property {Date} createdAt - Report creation date
 * @property {Date} updatedAt - Report last update date
 * @property {Object} filters - Applied filters
 * @property {Date} filters.startDate - Start date for date range
 * @property {Date} filters.endDate - End date for date range
 * @property {string} [filters.branchId] - Optional branch filter
 * @property {string} [filters.staffId] - Optional staff filter
 * @property {string} [filters.customerId] - Optional customer filter
 * @property {string} [filters.productId] - Optional product filter
 * @property {Object} data - Report data
 * @property {Object} metadata - Additional metadata
 * @property {string} metadata.generatedBy - User who generated the report
 * @property {number} metadata.recordCount - Number of records in the report
 * @property {number} metadata.processingTime - Processing time in ms
 */

/**
 * @typedef {Object} ReportStats
 * @property {number} totalReports - Total number of reports
 * @property {number} todayReports - Reports generated today
 * @property {number} weekReports - Reports generated this week
 * @property {number} monthReports - Reports generated this month
 * @property {Object} byType - Report count by type
 * @property {Object} byStatus - Report count by status
 */

/**
 * @typedef {Object} ReportFilters
 * @property {Date} startDate - Start date for report data
 * @property {Date} endDate - End date for report data
 * @property {string} [branchId] - Optional branch filter
 * @property {string} [staffId] - Optional staff filter
 * @property {string} [customerId] - Optional customer filter
 * @property {string} [productId] - Optional product filter
 * @property {string} [status] - Optional status filter
 * @property {string} [type] - Optional type filter
 */

// Report Types
export const REPORT_TYPES = {
  SALES: 'sales',
  REVENUE: 'revenue',
  PRODUCTS: 'products',
  CUSTOMERS: 'customer',
  STAFF: 'staff',
  PAYMENTS: 'payments',
  BOOKINGS: 'bookings',
  INVENTORY: 'inventory',
  BRANCH: 'branch',
};

export const REPORT_TYPE_LABELS = {
  [REPORT_TYPES.SALES]: 'Sales Report',
  [REPORT_TYPES.REVENUE]: 'Revenue Report',
  [REPORT_TYPES.PRODUCTS]: 'Product Performance',
  [REPORT_TYPES.CUSTOMERS]: 'Customer Report',
  [REPORT_TYPES.STAFF]: 'Staff Performance',
  [REPORT_TYPES.PAYMENTS]: 'Payment Report',
  [REPORT_TYPES.BOOKINGS]: 'Booking Report',
  [REPORT_TYPES.INVENTORY]: 'Inventory Report',
  [REPORT_TYPES.BRANCH]: 'Branch Performance',
};

export const REPORT_TYPE_DESCRIPTIONS = {
  [REPORT_TYPES.SALES]: 'Detailed analysis of sales transactions and trends',
  [REPORT_TYPES.REVENUE]: 'Revenue breakdown by period, branch, and category',
  [REPORT_TYPES.PRODUCTS]: 'Product sales performance and inventory metrics',
  [REPORT_TYPES.CUSTOMERS]: 'Customer activity, retention, and lifetime value',
  [REPORT_TYPES.STAFF]: 'Staff performance, attendance, and productivity',
  [REPORT_TYPES.PAYMENTS]: 'Payment methods, transactions, and reconciliation',
  [REPORT_TYPES.BOOKINGS]: 'Booking statistics, cancellations, and attendance',
  [REPORT_TYPES.INVENTORY]: 'Stock levels, movements, and valuation',
  [REPORT_TYPES.BRANCH]: 'Branch-wise performance comparison',
};

// Report Status
export const REPORT_STATUS = {
  DRAFT: 'draft',
  GENERATED: 'generated',
  PROCESSING: 'processing',
  FAILED: 'failed',
  ARCHIVED: 'archived',
};

export const REPORT_STATUS_LABELS = {
  [REPORT_STATUS.DRAFT]: 'Draft',
  [REPORT_STATUS.GENERATED]: 'Generated',
  [REPORT_STATUS.PROCESSING]: 'Processing',
  [REPORT_STATUS.FAILED]: 'Failed',
  [REPORT_STATUS.ARCHIVED]: 'Archived',
};

// Export Formats
export const EXPORT_FORMATS = {
  PDF: 'pdf',
  CSV: 'csv',
  EXCEL: 'excel',
  JSON: 'json',
};

export const EXPORT_FORMAT_LABELS = {
  [EXPORT_FORMATS.PDF]: 'PDF Document',
  [EXPORT_FORMATS.CSV]: 'CSV File',
  [EXPORT_FORMATS.EXCEL]: 'Excel Spreadsheet',
  [EXPORT_FORMATS.JSON]: 'JSON Data',
};

// Date Range Presets
export const DATE_RANGE_PRESETS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_QUARTER: 'this_quarter',
  LAST_QUARTER: 'last_quarter',
  THIS_YEAR: 'this_year',
  LAST_YEAR: 'last_year',
  CUSTOM: 'custom',
};

export const DATE_RANGE_PRESET_LABELS = {
  [DATE_RANGE_PRESETS.TODAY]: 'Today',
  [DATE_RANGE_PRESETS.YESTERDAY]: 'Yesterday',
  [DATE_RANGE_PRESETS.THIS_WEEK]: 'This Week',
  [DATE_RANGE_PRESETS.LAST_WEEK]: 'Last Week',
  [DATE_RANGE_PRESETS.THIS_MONTH]: 'This Month',
  [DATE_RANGE_PRESETS.LAST_MONTH]: 'Last Month',
  [DATE_RANGE_PRESETS.THIS_QUARTER]: 'This Quarter',
  [DATE_RANGE_PRESETS.LAST_QUARTER]: 'Last Quarter',
  [DATE_RANGE_PRESETS.THIS_YEAR]: 'This Year',
  [DATE_RANGE_PRESETS.LAST_YEAR]: 'Last Year',
  [DATE_RANGE_PRESETS.CUSTOM]: 'Custom Range',
};

// Chart Types
export const CHART_TYPES = {
  BAR: 'bar',
  LINE: 'line',
  PIE: 'pie',
  AREA: 'area',
  TABLE: 'table',
};

// Grouping Options
export const GROUPING_OPTIONS = {
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
};

export const GROUPING_LABELS = {
  [GROUPING_OPTIONS.DAY]: 'Daily',
  [GROUPING_OPTIONS.WEEK]: 'Weekly',
  [GROUPING_OPTIONS.MONTH]: 'Monthly',
  [GROUPING_OPTIONS.QUARTER]: 'Quarterly',
  [GROUPING_OPTIONS.YEAR]: 'Yearly',
};
