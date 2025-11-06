import { useState } from 'react';
import { X, Download, Calendar, Database, Clock, Printer } from 'lucide-react';
import { format } from 'date-fns';
import {
  REPORT_TYPE_LABELS,
  REPORT_STATUS_LABELS,
  EXPORT_FORMATS,
  EXPORT_FORMAT_LABELS,
} from '../types';
import PrintModal from '../../../components/common/PrintModal';
import PrintableReport from '../../../components/reports/PrintableReport';

/**
 * ReportViewer Component
 * Displays report details and data in a readable format
 */
export const ReportViewer = ({ report, onClose, onExport, isLoading = false }) => {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  if (!report) {
    return null;
  }

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  const handlePrintAction = () => {
    window.print();
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

  // Render data based on report type
  const renderReportData = () => {
    if (!report.data) {
      return (
        <div className="text-center py-8 text-gray-500">
          No data available for this report.
        </div>
      );
    }

    const { data } = report;

    // Sales Report
    if (report.type === 'sales') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Sales</p>
              <p className="text-2xl font-bold text-blue-900">
                ${data.totalSales?.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Transactions</p>
              <p className="text-2xl font-bold text-green-900">
                {data.totalTransactions?.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Avg Transaction</p>
              <p className="text-2xl font-bold text-purple-900">
                ${data.averageTransaction?.toLocaleString()}
              </p>
            </div>
          </div>

          {data.topProducts && data.topProducts.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Top Products</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        Product
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                        Sales
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.topProducts.map((product, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          {product.sales}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          ${product.revenue?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Revenue Report
    if (report.type === 'revenue') {
      return (
        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-green-900">
              ${data.totalRevenue?.toLocaleString()}
            </p>
          </div>

          {data.revenueByMonth && data.revenueByMonth.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Revenue by Month</h4>
              <div className="space-y-2">
                {data.revenueByMonth.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{item.month}</span>
                    <span className="font-medium text-gray-900">
                      ${item.revenue?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.revenueByCategory && data.revenueByCategory.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Revenue by Category</h4>
              <div className="space-y-2">
                {data.revenueByCategory.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{item.category}</span>
                    <span className="font-medium text-gray-900">
                      ${item.revenue?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Customer Report
    if (report.type === 'customer') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Customers</p>
              <p className="text-2xl font-bold text-blue-900">
                {data.totalCustomers?.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Active Customers</p>
              <p className="text-2xl font-bold text-green-900">
                {data.activeCustomers?.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">New Customers</p>
              <p className="text-2xl font-bold text-purple-900">
                {data.newCustomers?.toLocaleString()}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-600 font-medium">Avg Lifetime Value</p>
              <p className="text-2xl font-bold text-orange-900">
                ${data.averageLifetimeValue?.toLocaleString()}
              </p>
            </div>
          </div>

          {data.topCustomers && data.topCustomers.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Top Customers</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                        Customer
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                        Visits
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                        Total Spent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.topCustomers.map((customer, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {customer.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          {customer.visits}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          ${customer.spent?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Products Report
    if (report.type === 'products') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-blue-900">
                {data.totalProducts?.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">In Stock</p>
              <p className="text-2xl font-bold text-green-900">
                {data.productsInStock?.toLocaleString()}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600 font-medium">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-900">
                {data.lowStockProducts?.toLocaleString()}
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-600 font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-red-900">
                {data.outOfStockProducts?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Payments Report
    if (report.type === 'payments') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Transactions</p>
              <p className="text-2xl font-bold text-blue-900">
                {data.totalTransactions?.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Total Amount</p>
              <p className="text-2xl font-bold text-green-900">
                ${data.totalAmount?.toLocaleString()}
              </p>
            </div>
          </div>

          {data.byMethod && data.byMethod.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Payment Methods</h4>
              <div className="space-y-2">
                {data.byMethod.map((method, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <span className="text-sm text-gray-900 font-medium">{method.method}</span>
                      <span className="text-xs text-gray-500 ml-2">({method.count} transactions)</span>
                    </div>
                    <span className="font-medium text-gray-900">
                      ${method.amount?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Generic data display for other report types
    return (
      <div className="space-y-4">
        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {report.title}
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  report.status
                )}`}
              >
                {REPORT_STATUS_LABELS[report.status]}
              </span>
            </div>
            {report.description && (
              <p className="text-sm text-gray-600">{report.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-4"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metadata */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <p className="text-gray-500">Report Type</p>
              <p className="font-medium text-gray-900">
                {REPORT_TYPE_LABELS[report.type]}
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <p className="text-gray-500">Date Range</p>
              <p className="font-medium text-gray-900">
                {report.filters?.startDate && report.filters?.endDate
                  ? `${format(
                      new Date(report.filters.startDate),
                      'MMM dd'
                    )} - ${format(new Date(report.filters.endDate), 'MMM dd, yyyy')}`
                  : 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Database className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <p className="text-gray-500">Records</p>
              <p className="font-medium text-gray-900">
                {report.metadata?.recordCount?.toLocaleString() || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 text-gray-400 mr-2" />
            <div>
              <p className="text-gray-500">Generated</p>
              <p className="font-medium text-gray-900">
                {format(new Date(report.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Data */}
      <div className="px-6 py-6">{renderReportData()}</div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Generated by {report.metadata?.generatedBy || 'System'} •
            Processing time: {report.metadata?.processingTime || 0}ms
          </p>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              disabled={isLoading}
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Print
            </button>
            {Object.entries(EXPORT_FORMATS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => onExport?.(report, value)}
                className="px-3 py-1.5 text-sm bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-1.5" />
                Export {value.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Print Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        title={`Print ${report.title}`}
        onPrint={handlePrintAction}
      >
        <PrintableReport report={report} />
      </PrintModal>
    </div>
  );
};
