import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Eye,
  Trash2,
  Package,
  TrendingUp,
  TrendingDown,
  Filter,
  Loader2,
  AlertTriangle,
  Calendar,
  XCircle
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory.js';
import { InventoryTransactionForm } from './InventoryTransactionForm.jsx';
import {
  TRANSACTION_TYPES,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_STATUS_LABELS,
  STOCK_IN_TYPES
} from '../types/inventory.types.js';

/**
 * InventoryTransactionList Component
 * Displays a list of inventory transactions with filtering and CRUD operations
 * @returns {JSX.Element}
 */
export const InventoryTransactionList = () => {
  const {
    transactions,
    isLoading,
    stats,
    fetchTransactions,
    fetchInventoryStats,
    createTransaction,
    deleteTransaction,
    cancelTransaction
  } = useInventory();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewTransaction, setViewTransaction] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    locationId: 'all',
    startDate: '',
    endDate: '',
    sortBy: 'transactionDate',
    sortOrder: 'desc'
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Reload data when filters change
  useEffect(() => {
    if (transactions.length > 0 || filters.search || filters.type !== 'all' || filters.status !== 'all') {
      loadData();
    }
  }, [filters]);

  const loadData = async () => {
    const filterParams = {
      ...filters,
      type: filters.type === 'all' ? undefined : filters.type,
      status: filters.status === 'all' ? undefined : filters.status,
      locationId: filters.locationId === 'all' ? undefined : filters.locationId,
      startDate: filters.startDate || undefined,
      endDate: filters.endDate || undefined
    };
    await fetchTransactions(filterParams);
    await fetchInventoryStats();
  };

  const handleCreateClick = () => {
    setSelectedTransaction(null);
    setIsFormOpen(true);
  };

  const handleViewClick = (transaction) => {
    setViewTransaction(transaction);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    setIsDeleteConfirmOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      await createTransaction(data);
      setIsFormOpen(false);
      setSelectedTransaction(null);
      await loadData();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedTransaction(null);
  };

  const handleConfirmDelete = async () => {
    if (transactionToDelete) {
      try {
        await deleteTransaction(transactionToDelete.id);
        setIsDeleteConfirmOpen(false);
        setTransactionToDelete(null);
        await loadData();
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setTransactionToDelete(null);
  };

  const handleCancelTransaction = async (transactionId) => {
    try {
      await cancelTransaction(transactionId);
      await loadData();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionTypeStyle = (type) => {
    if (STOCK_IN_TYPES.includes(type)) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-red-100 text-red-800';
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || badges.pending;
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
            </div>
            <Package className="h-10 w-10 text-blue-500" />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {stats.totalProducts} products tracked
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalInventoryValue)}
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-500" />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Current stock value
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStockProducts}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-amber-500" />
          </div>
          <p className="mt-2 text-xs text-gray-500">Need reordering</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.outOfStockProducts}</p>
            </div>
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <p className="mt-2 text-xs text-gray-500">Unavailable items</p>
        </div>
      </div>

      {/* Header and Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inventory Transactions</h2>
            <p className="text-sm text-gray-600 mt-1">
              Track all inventory movements and stock changes
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            Add Transaction
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product, SKU, reference..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            {Object.values(TRANSACTION_TYPES).map((type) => (
              <option key={type} value={type}>
                {TRANSACTION_TYPE_LABELS[type]}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            {Object.values(TRANSACTION_STATUSES).map((status) => (
              <option key={status} value={status}>
                {TRANSACTION_STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          {/* Start Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* End Date */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Transactions Table */}
        {isLoading && transactions.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No transactions found</p>
            <p className="text-sm text-gray-500 mt-1">
              {filters.search || filters.type !== 'all' || filters.status !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by recording your first transaction'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Unit Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(transaction.transactionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.productName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction.productSku}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeStyle(
                          transaction.type
                        )}`}
                      >
                        {TRANSACTION_TYPE_LABELS[transaction.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {STOCK_IN_TYPES.includes(transaction.type) ? '+' : '-'}
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatCurrency(transaction.unitCost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(transaction.totalCost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.balanceAfter}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                          transaction.status
                        )}`}
                      >
                        {TRANSACTION_STATUS_LABELS[transaction.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewClick(transaction)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        {transaction.status !== 'cancelled' && (
                          <button
                            onClick={() => handleDeleteClick(transaction)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete transaction"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <InventoryTransactionForm
                initialData={selectedTransaction}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Transaction Modal */}
      {isViewOpen && viewTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
              <button
                onClick={() => setIsViewOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                  <p className="mt-1 text-sm text-gray-900">{viewTransaction.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(viewTransaction.transactionDate)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product</label>
                  <p className="mt-1 text-sm text-gray-900">{viewTransaction.productName}</p>
                  <p className="text-xs text-gray-500">{viewTransaction.productSku}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionTypeStyle(viewTransaction.type)}`}>
                      {TRANSACTION_TYPE_LABELS[viewTransaction.type]}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Quantity</label>
                  <p className="mt-1 text-sm text-gray-900">{viewTransaction.quantity}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit Cost</label>
                  <p className="mt-1 text-sm text-gray-900">{formatCurrency(viewTransaction.unitCost)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Total Cost</label>
                  <p className="mt-1 text-sm text-gray-900">{formatCurrency(viewTransaction.totalCost)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Balance After</label>
                  <p className="mt-1 text-sm text-gray-900">{viewTransaction.balanceAfter}</p>
                </div>
                {viewTransaction.batchNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Batch Number</label>
                    <p className="mt-1 text-sm text-gray-900">{viewTransaction.batchNumber}</p>
                  </div>
                )}
                {viewTransaction.locationName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-sm text-gray-900">{viewTransaction.locationName}</p>
                  </div>
                )}
                {viewTransaction.referenceNumber && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reference</label>
                    <p className="mt-1 text-sm text-gray-900">{viewTransaction.referenceNumber}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(viewTransaction.status)}`}>
                      {TRANSACTION_STATUS_LABELS[viewTransaction.status]}
                    </span>
                  </p>
                </div>
              </div>
              {viewTransaction.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <p className="mt-1 text-sm text-gray-900">{viewTransaction.notes}</p>
                </div>
              )}
              {viewTransaction.createdByName && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created By</label>
                  <p className="mt-1 text-sm text-gray-900">{viewTransaction.createdByName}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && transactionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Transaction</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this transaction for "{transactionToDelete.productName}"?
              This will affect stock levels. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTransactionList;
