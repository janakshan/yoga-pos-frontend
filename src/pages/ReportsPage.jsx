import { useState, useEffect } from 'react';
import { Plus, Search, Filter, BarChart3, TrendingUp, FileText, Calendar } from 'lucide-react';
import { useReports } from '@/features/reports/hooks';
import {
  ReportList,
  ReportGenerator,
  ReportViewer,
} from '@/features/reports/components';
import {
  REPORT_TYPES,
  REPORT_TYPE_LABELS,
  REPORT_STATUS,
  REPORT_STATUS_LABELS,
} from '@/features/reports/types';

/**
 * ReportsPage Component
 * Main page for report management
 */
const ReportsPage = () => {
  const {
    reports,
    isLoading,
    stats,
    filters,
    fetchReports,
    fetchReportStats,
    generateReport,
    deleteReport,
    archiveReport,
    exportReport,
    bulkDelete,
    bulkArchive,
    setReportFilters,
    resetReportFilters,
  } = useReports();

  const [view, setView] = useState('list'); // 'list', 'generate', 'view'
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchReports();
    fetchReportStats();
  }, [fetchReports, fetchReportStats]);

  // Handle generate report
  const handleGenerateReport = async (reportData) => {
    try {
      await generateReport(reportData);
      setView('list');
      // Refresh stats
      fetchReportStats();
    } catch (error) {
      console.error('Failed to generate report:', error);
    }
  };

  // Handle view report
  const handleViewReport = (report) => {
    setSelectedReport(report);
    setView('view');
  };

  // Handle export report
  const handleExportReport = async (report, format) => {
    try {
      await exportReport(report.id, format);
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  // Handle delete report
  const handleDeleteReport = async (report) => {
    if (window.confirm(`Are you sure you want to delete "${report.title}"?`)) {
      try {
        await deleteReport(report.id);
        // Refresh stats
        fetchReportStats();
      } catch (error) {
        console.error('Failed to delete report:', error);
      }
    }
  };

  // Handle archive report
  const handleArchiveReport = async (report) => {
    try {
      await archiveReport(report.id);
      // Refresh stats
      fetchReportStats();
    } catch (error) {
      console.error('Failed to archive report:', error);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async (ids) => {
    try {
      await bulkDelete(ids);
      // Refresh stats
      fetchReportStats();
    } catch (error) {
      console.error('Failed to delete reports:', error);
    }
  };

  // Handle bulk archive
  const handleBulkArchive = async (ids) => {
    try {
      await bulkArchive(ids);
      // Refresh stats
      fetchReportStats();
    } catch (error) {
      console.error('Failed to archive reports:', error);
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    setReportFilters({ ...filters, search: value });
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setReportFilters({ ...filters, [key]: value });
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    resetReportFilters();
  };

  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (
        !report.title.toLowerCase().includes(searchLower) &&
        !report.description.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }

    // Type filter
    if (filters.type && report.type !== filters.type) {
      return false;
    }

    // Status filter
    if (filters.status && report.status !== filters.status) {
      return false;
    }

    return true;
  });

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate and manage business intelligence reports
          </p>
        </div>
        {view === 'list' && (
          <button
            onClick={() => setView('generate')}
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {view === 'list' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalReports}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Today</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.todayReports}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.weekReports}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.monthReports}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-300" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      {view === 'list' && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-md flex items-center justify-center ${
                showFilters
                  ? 'bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Type
                  </label>
                  <select
                    value={filters.type || ''}
                    onChange={(e) => handleFilterChange('type', e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  >
                    <option value="">All Types</option>
                    {Object.entries(REPORT_TYPES).map(([key, value]) => (
                      <option key={key} value={value}>
                        {REPORT_TYPE_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status || ''}
                    onChange={(e) =>
                      handleFilterChange('status', e.target.value || null)
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  >
                    <option value="">All Status</option>
                    {Object.entries(REPORT_STATUS).map(([key, value]) => (
                      <option key={key} value={value}>
                        {REPORT_STATUS_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div>
        {view === 'list' && (
          <ReportList
            reports={filteredReports}
            onView={handleViewReport}
            onExport={handleExportReport}
            onDelete={handleDeleteReport}
            onArchive={handleArchiveReport}
            onBulkDelete={handleBulkDelete}
            onBulkArchive={handleBulkArchive}
            isLoading={isLoading}
          />
        )}

        {view === 'generate' && (
          <ReportGenerator
            onGenerate={handleGenerateReport}
            onCancel={() => setView('list')}
            isLoading={isLoading}
          />
        )}

        {view === 'view' && selectedReport && (
          <ReportViewer
            report={selectedReport}
            onClose={() => {
              setView('list');
              setSelectedReport(null);
            }}
            onExport={handleExportReport}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
