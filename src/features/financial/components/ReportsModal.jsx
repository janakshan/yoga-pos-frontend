import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Calendar,
} from 'lucide-react';
import { reportService } from '@/features/financial/services/reportService.js';

export const ReportsModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('month');
  const [reportData, setReportData] = useState(null);

  const reportTypes = [
    { value: 'summary', label: 'Financial Summary', icon: DollarSign },
    { value: 'profitLoss', label: 'Profit & Loss', icon: TrendingUp },
    { value: 'cashflow', label: 'Cash Flow', icon: TrendingDown },
    { value: 'invoice', label: 'Invoice Report', icon: FileText },
  ];

  useEffect(() => {
    if (isOpen) {
      loadReport();
    }
  }, [isOpen, reportType, dateRange]);

  const loadReport = async () => {
    try {
      setLoading(true);

      const endDate = new Date();
      const startDate = new Date();

      switch (dateRange) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setMonth(startDate.getMonth() - 1);
      }

      const filters = { startDate, endDate };
      let data;

      switch (reportType) {
        case 'summary':
          data = await reportService.generateFinancialSummary(filters);
          break;
        case 'profitLoss':
          data = await reportService.generateProfitLossStatement(filters);
          break;
        case 'cashflow':
          data = await reportService.generateCashFlowStatement(filters);
          break;
        case 'invoice':
          data = await reportService.generateInvoiceReport(filters);
          break;
        default:
          data = await reportService.generateFinancialSummary(filters);
      }

      setReportData(data);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    // This would trigger a PDF download
    alert('Report download functionality would be implemented here');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText size={24} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Reports</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 space-y-4">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Report Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setReportType(type.value)}
                    className={`flex items-center gap-2 p-3 border-2 rounded-lg transition-all ${
                      reportType === type.value
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon
                      size={20}
                      className={
                        reportType === type.value ? 'text-purple-600' : 'text-gray-600'
                      }
                    />
                    <span
                      className={`text-sm font-medium ${
                        reportType === type.value ? 'text-purple-900' : 'text-gray-900'
                      }`}
                    >
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range and Download */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-gray-600" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="quarter">Last 3 Months</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download size={20} />
              Download PDF
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Financial Summary Report */}
              {reportType === 'summary' && reportData && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Financial Summary Report
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(reportData.totalRevenue)}
                      </p>
                    </div>

                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm text-gray-600 mb-1">Total Expenses</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(reportData.totalExpenses)}
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Net Income</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(reportData.netIncome)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Profit Margin</span>
                        <span className="font-semibold text-gray-900">
                          {reportData.profitMargin?.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue Growth</span>
                        <span className="font-semibold text-green-600">
                          {reportData.trends?.revenueGrowth || '+0%'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Profit & Loss Report */}
              {reportType === 'profitLoss' && reportData && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Profit & Loss Statement
                  </h3>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        <tr className="bg-green-50">
                          <td className="p-3 font-semibold text-gray-900">Revenue</td>
                          <td className="p-3 text-right font-semibold text-green-600">
                            {formatCurrency(reportData.revenue)}
                          </td>
                        </tr>
                        <tr className="bg-white border-t">
                          <td className="p-3 text-gray-700">Operating Revenue</td>
                          <td className="p-3 text-right text-gray-700">
                            {formatCurrency(reportData.operatingRevenue)}
                          </td>
                        </tr>
                        <tr className="bg-red-50 border-t">
                          <td className="p-3 font-semibold text-gray-900">Expenses</td>
                          <td className="p-3 text-right font-semibold text-red-600">
                            {formatCurrency(reportData.expenses)}
                          </td>
                        </tr>
                        <tr className="bg-white border-t">
                          <td className="p-3 text-gray-700">Operating Expenses</td>
                          <td className="p-3 text-right text-gray-700">
                            {formatCurrency(reportData.operatingExpenses)}
                          </td>
                        </tr>
                        <tr className="bg-blue-50 border-t border-t-2 border-gray-300">
                          <td className="p-3 font-bold text-gray-900">Net Profit</td>
                          <td className="p-3 text-right font-bold text-blue-600">
                            {formatCurrency(reportData.netProfit)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Cash Flow Report */}
              {reportType === 'cashflow' && reportData && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Cash Flow Statement</h3>

                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Operating Activities
                      </h4>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Cash from Operations</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(reportData.operatingCashFlow)}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Investing Activities</h4>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Cash from Investing</span>
                        <span className="font-semibold text-gray-900">
                          {formatCurrency(reportData.investingCashFlow)}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900">Net Cash Flow</span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(reportData.netCashFlow)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Invoice Report */}
              {reportType === 'invoice' && reportData && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Invoice Report</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Total Invoices</p>
                      <p className="text-xl font-bold text-gray-900">
                        {reportData.totalCount}
                      </p>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Paid</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(reportData.paidAmount)}
                      </p>
                    </div>

                    <div className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Outstanding</p>
                      <p className="text-xl font-bold text-orange-600">
                        {formatCurrency(reportData.outstandingAmount)}
                      </p>
                    </div>

                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Overdue</p>
                      <p className="text-xl font-bold text-red-600">
                        {formatCurrency(reportData.overdueAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Collection Rate</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {reportData.collectionRate?.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsModal;
