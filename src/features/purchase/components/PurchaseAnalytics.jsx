import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Package, FileText, AlertCircle } from 'lucide-react';
import { usePurchase } from '../hooks/usePurchase.js';
import { useSuppliers } from '../hooks/useSuppliers.js';

export const PurchaseAnalytics = () => {
  const { stats: purchaseStats, fetchStatistics, getOverduePurchaseOrders } = usePurchase();
  const { stats: supplierStats } = useSuppliers();
  const [overdueOrders, setOverdueOrders] = useState([]);

  useEffect(() => {
    fetchStatistics();
    getOverduePurchaseOrders().then(setOverdueOrders).catch(() => {});
  }, [fetchStatistics, getOverduePurchaseOrders]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      yellow: 'bg-yellow-50 text-yellow-600',
      red: 'bg-red-50 text-red-600',
      purple: 'bg-purple-50 text-purple-600'
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          {trend && (
            <div className={`flex items-center text-sm font-medium ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Purchase Analytics</h2>
        <p className="text-sm text-gray-600 mt-1">Overview of purchase orders and supplier performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Purchase Orders"
          value={purchaseStats.totalOrders}
          subtitle={`${purchaseStats.receivedOrders} completed`}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Total Purchase Value"
          value={formatCurrency(purchaseStats.totalValue)}
          subtitle={`${formatCurrency(purchaseStats.paidValue)} paid`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Pending Orders"
          value={purchaseStats.pendingOrders + purchaseStats.approvedOrders}
          subtitle={`${purchaseStats.draftOrders} drafts`}
          icon={Package}
          color="yellow"
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(purchaseStats.pendingValue)}
          subtitle="Amount due to suppliers"
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{purchaseStats.draftOrders}</div>
            <div className="text-sm text-gray-600 mt-1">Draft</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{purchaseStats.pendingOrders}</div>
            <div className="text-sm text-gray-600 mt-1">Pending</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{purchaseStats.approvedOrders}</div>
            <div className="text-sm text-gray-600 mt-1">Approved</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{purchaseStats.receivedOrders}</div>
            <div className="text-sm text-gray-600 mt-1">Received</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{purchaseStats.totalReturns}</div>
            <div className="text-sm text-gray-600 mt-1">Returns</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Suppliers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Suppliers</h3>
          {supplierStats.topPerformers && supplierStats.topPerformers.length > 0 ? (
            <div className="space-y-3">
              {supplierStats.topPerformers.map((supplier, index) => (
                <div key={supplier.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-sm text-gray-600">{supplier.totalOrders} orders</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{supplier.qualityScore}%</div>
                    <div className="text-xs text-gray-500">Quality</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No supplier data available</div>
          )}
        </div>

        {/* Overdue Orders */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Overdue Orders</h3>
          {overdueOrders.length > 0 ? (
            <div className="space-y-3">
              {overdueOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{order.orderNumber}</div>
                    <div className="text-sm text-gray-600">{order.supplierName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-600">
                      {new Date(order.expectedDeliveryDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">Expected</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-green-600">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No overdue orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Supplier Statistics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Supplier Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">{supplierStats.total}</div>
            <div className="text-sm text-gray-600 mt-1">Total Suppliers</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{supplierStats.active}</div>
            <div className="text-sm text-gray-600 mt-1">Active</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{supplierStats.inactive}</div>
            <div className="text-sm text-gray-600 mt-1">Inactive</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{supplierStats.blocked}</div>
            <div className="text-sm text-gray-600 mt-1">Blocked</div>
          </div>
        </div>
      </div>
    </div>
  );
};
