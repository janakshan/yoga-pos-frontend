import { useState } from 'react';
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Archive,
  CheckSquare,
  Square,
  MoreVertical,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  REPORT_TYPE_LABELS,
  REPORT_STATUS_LABELS,
  EXPORT_FORMATS,
  EXPORT_FORMAT_LABELS,
} from '../types';

/**
 * ReportList Component
 * Displays a list of reports in a table format
 */
export const ReportList = ({
  reports = [],
  onView,
  onExport,
  onDelete,
  onArchive,
  onBulkDelete,
  onBulkArchive,
  isLoading = false,
}) => {
  const [selectedReports, setSelectedReports] = useState([]);
  const [showActions, setShowActions] = useState(null);

  // Handle select all
  const handleSelectAll = () => {
    if (selectedReports.length === reports.length) {
      setSelectedReports([]);
    } else {
      setSelectedReports(reports.map((r) => r.id));
    }
  };

  // Handle individual selection
  const handleSelectReport = (reportId) => {
    setSelectedReports((prev) =>
      prev.includes(reportId)
        ? prev.filter((id) => id !== reportId)
        : [...prev, reportId]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedReports.length === 0) return;
    if (window.confirm(`Delete ${selectedReports.length} report(s)?`)) {
      onBulkDelete?.(selectedReports);
      setSelectedReports([]);
    }
  };

  // Handle bulk archive
  const handleBulkArchive = () => {
    if (selectedReports.length === 0) return;
    if (window.confirm(`Archive ${selectedReports.length} report(s)?`)) {
      onBulkArchive?.(selectedReports);
      setSelectedReports([]);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'generated':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type badge color
  const getTypeColor = (type) => {
    const colors = {
      sales: 'bg-blue-100 text-blue-800',
      revenue: 'bg-green-100 text-green-800',
      products: 'bg-purple-100 text-purple-800',
      customer: 'bg-pink-100 text-pink-800',
      staff: 'bg-indigo-100 text-indigo-800',
      payments: 'bg-yellow-100 text-yellow-800',
      bookings: 'bg-cyan-100 text-cyan-800',
      inventory: 'bg-orange-100 text-orange-800',
      branch: 'bg-teal-100 text-teal-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by generating your first report.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Bulk actions */}
      {selectedReports.length > 0 && (
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <span className="text-sm text-blue-800 font-medium">
            {selectedReports.length} report(s) selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkArchive}
              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
            >
              <Archive className="w-4 h-4 inline mr-1" />
              Archive
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 inline mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <button
                  onClick={handleSelectAll}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {selectedReports.length === reports.length ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Created
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Records
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleSelectReport(report.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {selectedReports.includes(report.id) ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {report.title}
                      </div>
                      {report.description && (
                        <div className="text-xs text-gray-500">
                          {report.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                      report.type
                    )}`}
                  >
                    {REPORT_TYPE_LABELS[report.type] || report.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      report.status
                    )}`}
                  >
                    {REPORT_STATUS_LABELS[report.status] || report.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                  <div className="text-xs text-gray-400">
                    {format(new Date(report.createdAt), 'h:mm a')}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {report.metadata?.recordCount?.toLocaleString() || 'N/A'}
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onView?.(report)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View report"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowActions(
                            showActions === report.id ? null : report.id
                          )
                        }
                        className="text-gray-600 hover:text-gray-900"
                        title="More actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {showActions === report.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                          <div className="py-1">
                            <div className="px-3 py-1 text-xs font-medium text-gray-500 uppercase">
                              Export as
                            </div>
                            {Object.entries(EXPORT_FORMATS).map(([key, value]) => (
                              <button
                                key={key}
                                onClick={() => {
                                  onExport?.(report, value);
                                  setShowActions(null);
                                }}
                                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                {EXPORT_FORMAT_LABELS[value]}
                              </button>
                            ))}
                            <div className="border-t border-gray-200 my-1"></div>
                            <button
                              onClick={() => {
                                onArchive?.(report);
                                setShowActions(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-yellow-700 hover:bg-yellow-50 flex items-center"
                            >
                              <Archive className="w-4 h-4 mr-2" />
                              Archive
                            </button>
                            <button
                              onClick={() => {
                                onDelete?.(report);
                                setShowActions(null);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
