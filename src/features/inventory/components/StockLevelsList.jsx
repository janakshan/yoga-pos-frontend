import React, { useState, useEffect } from 'react';
import {
  Search,
  Package,
  TrendingUp,
  AlertTriangle,
  XCircle,
  Filter,
  Loader2,
  DollarSign
} from 'lucide-react';
import { useInventory } from '../hooks/useInventory.js';

/**
 * StockLevelsList Component
 * Displays current stock levels for all products
 * @returns {JSX.Element}
 */
export const StockLevelsList = () => {
  const {
    stockLevels,
    isLoading,
    stats,
    fetchStockLevels,
    fetchInventoryStats
  } = useInventory();

  const [filters, setFilters] = useState({
    search: '',
    locationId: 'all',
    lowStock: false,
    outOfStock: false,
    sortBy: 'productName',
    sortOrder: 'asc'
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Reload data when filters change
  useEffect(() => {
    if (stockLevels.length > 0 || filters.search || filters.locationId !== 'all') {
      loadData();
    }
  }, [filters]);

  const loadData = async () => {
    const filterParams = {
      ...filters,
      locationId: filters.locationId === 'all' ? undefined : filters.locationId
    };
    await fetchStockLevels(filterParams);
    await fetchInventoryStats();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStockStatus = (level) => {
    if (level.isOutOfStock) {
      return { label: 'Out of Stock', className: 'bg-red-100 text-red-800', icon: XCircle };
    }
    if (level.isLowStock) {
      return { label: 'Low Stock', className: 'bg-amber-100 text-amber-800', icon: AlertTriangle };
    }
    return { label: 'In Stock', className: 'bg-green-100 text-green-800', icon: Package };
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <Package className="h-10 w-10 text-blue-500" />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Tracked in inventory
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalInventoryValue)}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-green-500" />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Current inventory value
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
            <h2 className="text-2xl font-bold text-gray-900">Stock Levels</h2>
            <p className="text-sm text-gray-600 mt-1">
              Current inventory levels across all products
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Low Stock Filter */}
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={filters.lowStock}
              onChange={(e) => setFilters({ ...filters, lowStock: e.target.checked, outOfStock: false })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-gray-700">Low Stock Only</span>
          </label>

          {/* Out of Stock Filter */}
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={filters.outOfStock}
              onChange={(e) => setFilters({ ...filters, outOfStock: e.target.checked, lowStock: false })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-700">Out of Stock Only</span>
          </label>
        </div>

        {/* Stock Levels Table */}
        {isLoading && stockLevels.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : stockLevels.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No stock levels found</p>
            <p className="text-sm text-gray-500 mt-1">
              {filters.search || filters.lowStock || filters.outOfStock
                ? 'Try adjusting your filters'
                : 'Start by recording inventory transactions'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Restocked
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stockLevels.map((level, index) => {
                  const stockStatus = getStockStatus(level);
                  const StatusIcon = stockStatus.icon;
                  const key = `${level.productId}_${level.locationId || 'default'}_${index}`;

                  return (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {level.productName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {level.productSku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {level.locationName || 'Main Store'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {level.quantity}
                        </div>
                        <div className="text-xs text-gray-500">
                          Threshold: {level.lowStockThreshold}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatCurrency(level.averageCost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(level.totalValue)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(level.lastRestockedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {stockStatus.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockLevelsList;
