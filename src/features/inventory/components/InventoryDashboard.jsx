import React, { useEffect, useState } from 'react';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Bell,
  ShoppingCart,
  DollarSign,
  BarChart3,
  AlertCircle
} from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { inventoryAlertsService } from '../services/inventoryAlertsService';

/**
 * Inventory Dashboard Component
 * Real-time stock monitoring with alerts and key metrics
 */
const InventoryDashboard = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [reorderNotifications, setReorderNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, alertsData, reordersData] = await Promise.all([
        inventoryService.getStats(),
        inventoryAlertsService.getAlerts({ status: 'pending' }),
        inventoryAlertsService.getReorderNotifications({ status: 'pending' })
      ]);

      setStats(statsData);
      setAlerts(alertsData);
      setReorderNotifications(reordersData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  const criticalAlerts = alerts.filter((a) => a.priority === 'critical');
  const highAlerts = alerts.filter((a) => a.priority === 'high');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Dashboard</h2>
          <p className="text-gray-600">Real-time inventory monitoring and alerts</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-red-500 mt-0.5" />
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-semibold text-red-800">
                Critical Inventory Alerts ({criticalAlerts.length})
              </h3>
              <div className="mt-2 space-y-1">
                {criticalAlerts.slice(0, 3).map((alert) => (
                  <p key={alert.id} className="text-sm text-red-700">
                    {alert.productName} - {alert.message}
                  </p>
                ))}
                {criticalAlerts.length > 3 && (
                  <p className="text-sm text-red-600 font-medium">
                    +{criticalAlerts.length - 3} more critical alerts
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats?.totalProducts || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Active stock levels tracked
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Stock</p>
              <p className="text-3xl font-bold text-orange-600 mt-1">
                {stats?.lowStockProducts || 0}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Below reorder threshold
          </div>
        </div>

        {/* Out of Stock Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-3xl font-bold text-red-600 mt-1">
                {stats?.outOfStockProducts || 0}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Need immediate attention
          </div>
        </div>

        {/* Total Inventory Value */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inventory Value</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                ${(stats?.totalInventoryValue || 0).toFixed(0)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Total stock value
          </div>
        </div>
      </div>

      {/* Alerts and Reorder Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Active Alerts
                </h3>
              </div>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded-full">
                {alerts.length}
              </span>
            </div>
          </div>
          <div className="p-6">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No active alerts</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {alerts.slice(0, 5).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.priority === 'critical'
                        ? 'bg-red-50 border-red-500'
                        : alert.priority === 'high'
                        ? 'bg-orange-50 border-orange-500'
                        : 'bg-yellow-50 border-yellow-500'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {alert.productName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.locationName || 'All locations'}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          alert.priority === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : alert.priority === 'high'
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {alert.priority}
                      </span>
                    </div>
                  </div>
                ))}
                {alerts.length > 5 && (
                  <button className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all {alerts.length} alerts
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reorder Notifications */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Reorder Notifications
                </h3>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                {reorderNotifications.length}
              </span>
            </div>
          </div>
          <div className="p-6">
            {reorderNotifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No reorder notifications</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {reorderNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {notification.productName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Current: {notification.currentQuantity} | Reorder: {notification.reorderQuantity} units
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>Est. Cost: ${notification.estimatedCost.toFixed(2)}</span>
                          {notification.supplier && <span>Supplier: {notification.supplier}</span>}
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700">
                        Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Transaction Summary
            </h3>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalTransactions || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Purchase Value</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ${(stats?.totalPurchaseValue || 0).toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Sales Value</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                ${(stats?.totalSaleValue || 0).toFixed(0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Adjustments</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                ${(stats?.totalAdjustmentValue || 0).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      {stats?.recentTransactions && stats.recentTransactions.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.productName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.type === 'purchase'
                            ? 'bg-green-100 text-green-800'
                            : transaction.type === 'sale'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(transaction.transactionDate).toLocaleDateString()}
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
};

export default InventoryDashboard;
