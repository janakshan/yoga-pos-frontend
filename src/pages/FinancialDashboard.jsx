import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  FileText,
  CreditCard,
  Receipt,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
} from 'lucide-react';
import { useInvoices } from '@/features/financial/hooks/useInvoices.js';
import { reportService } from '@/features/financial/services/reportService.js';
import { paymentService } from '@/features/financial/services/paymentService.js';
import { expenseService } from '@/features/financial/services/expenseService.js';
import { cashflowService } from '@/features/financial/services/cashflowService.js';
import { InvoiceFormModal } from '@/features/financial/components/InvoiceFormModal.jsx';
import { PaymentFormModal } from '@/features/financial/components/PaymentFormModal.jsx';
import { ExpenseFormModal } from '@/features/financial/components/ExpenseFormModal.jsx';
import { ReportsModal } from '@/features/financial/components/ReportsModal.jsx';

export const FinancialDashboard = () => {
  const { fetchInvoices, fetchInvoiceStats, invoiceStats } = useInvoices();
  const [loading, setLoading] = useState(true);
  const [financialSummary, setFinancialSummary] = useState(null);
  const [paymentStats, setPaymentStats] = useState(null);
  const [expenseStats, setExpenseStats] = useState(null);
  const [cashBalance, setCashBalance] = useState(0);
  const [dateRange, setDateRange] = useState('month');

  // Modal states
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Calculate date range
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

      // Fetch all data in parallel
      const [invoices, summary, payments, expenses, cashflow] = await Promise.all([
        fetchInvoiceStats(filters),
        reportService.generateFinancialSummary(filters),
        paymentService.getStats(filters),
        expenseService.getStats(filters),
        cashflowService.getCashFlowSummary(filters),
      ]);

      setFinancialSummary(summary);
      setPaymentStats(payments);
      setExpenseStats(expenses);
      setCashBalance(cashflow.totalCash);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Handler for when a modal action is successful
  const handleActionSuccess = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600 mt-1">
            Monitor your business finances, invoices, and cash flow
          </p>
        </div>

        <div className="flex gap-3">
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">Last Year</option>
          </select>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={20} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(financialSummary?.totalRevenue || 0)}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight size={16} className="text-green-600" />
                <span className="text-green-600 text-sm font-medium">
                  {financialSummary?.trends?.revenueGrowth || '+0%'}
                </span>
                <span className="text-gray-500 text-sm">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(expenseStats?.totalAmount || 0)}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight size={16} className="text-red-600" />
                <span className="text-red-600 text-sm font-medium">
                  {financialSummary?.trends?.expenseGrowth || '+0%'}
                </span>
                <span className="text-gray-500 text-sm">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Net Income */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Net Income</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(financialSummary?.netIncome || 0)}
              </h3>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight size={16} className="text-blue-600" />
                <span className="text-blue-600 text-sm font-medium">
                  {financialSummary?.trends?.profitGrowth || '+0%'}
                </span>
                <span className="text-gray-500 text-sm">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-600 text-sm font-medium">Cash Balance</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-2">
                {formatCurrency(cashBalance || 0)}
              </h3>
              <p className="text-gray-500 text-sm mt-2">Available across all accounts</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CreditCard size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Invoices Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText size={20} className="text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Invoiced</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(invoiceStats?.totalAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(invoiceStats?.totalPaid || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Outstanding</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(invoiceStats?.totalDue || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Overdue</span>
              <span className="font-semibold text-red-600">
                {formatCurrency(invoiceStats?.overdueAmount || 0)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Collection Rate</span>
              <span className="font-semibold text-gray-900">
                {invoiceStats?.collectionRate?.toFixed(1) || 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Payments Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard size={20} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Payments</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Received</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(paymentStats?.totalAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cash</span>
              <span className="font-semibold text-gray-700">
                {formatCurrency(paymentStats?.cashAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Card</span>
              <span className="font-semibold text-gray-700">
                {formatCurrency(paymentStats?.cardAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bank Transfer</span>
              <span className="font-semibold text-gray-700">
                {formatCurrency(paymentStats?.bankTransferAmount || 0)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold text-green-600">
                {paymentStats?.completedCount || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Expenses Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Receipt size={20} className="text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Expenses</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Expenses</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(expenseStats?.totalAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Paid</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(expenseStats?.paidAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold text-orange-600">
                {formatCurrency(expenseStats?.pendingAmount || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recurring</span>
              <span className="font-semibold text-blue-600">
                {formatCurrency(expenseStats?.recurringExpensesTotal || 0)}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Avg per Expense</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(expenseStats?.averageExpenseValue || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setIsInvoiceModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <FileText size={24} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-900">Create Invoice</span>
          </button>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <CreditCard size={24} className="text-green-600" />
            <span className="text-sm font-medium text-gray-900">Record Payment</span>
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Receipt size={24} className="text-red-600" />
            <span className="text-sm font-medium text-gray-900">Add Expense</span>
          </button>
          <button
            onClick={() => setIsReportsModalOpen(true)}
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
          >
            <PieChart size={24} className="text-purple-600" />
            <span className="text-sm font-medium text-gray-900">View Reports</span>
          </button>
        </div>
      </div>

      {/* Profit Margin */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">Profit Margin</h3>
            <p className="text-3xl font-bold">
              {financialSummary?.profitMargin?.toFixed(2) || 0}%
            </p>
            <p className="text-blue-100 mt-2">
              Healthy profit margin indicates strong financial performance
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <TrendingUp size={48} />
          </div>
        </div>
      </div>

      {/* Modals */}
      <InvoiceFormModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        onSuccess={handleActionSuccess}
      />
      <PaymentFormModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handleActionSuccess}
      />
      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSuccess={handleActionSuccess}
      />
      <ReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => setIsReportsModalOpen(false)}
      />
    </div>
  );
};

export default FinancialDashboard;
