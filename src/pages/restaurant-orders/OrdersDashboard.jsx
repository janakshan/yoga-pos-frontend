import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../../features/restaurant-orders/hooks/useOrders';
import { ORDER_STATUS, SERVICE_TYPE, ORDER_STATUS_LABELS } from '../../features/restaurant-orders/types/order.types';
import OrderStatusBadge from '../../features/restaurant-orders/components/OrderStatusBadge';
import { getOrderAge } from '../../features/restaurant-orders/utils/orderWorkflow';
import {
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

/**
 * Orders Dashboard Page
 * Main dashboard for restaurant order management with stats and quick views
 */
export const OrdersDashboard = () => {
  const navigate = useNavigate();
  const { orders, activeOrders, fetchOrders, getOrderStats, isLoading } = useOrders();
  const [stats, setStats] = useState(null);
  const [selectedTab, setSelectedTab] = useState('active');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      setStats(getOrderStats());
    }
  }, [orders]);

  const getPendingOrders = () => orders.filter(o => o.status === ORDER_STATUS.PENDING);
  const getPreparingOrders = () => orders.filter(o => o.status === ORDER_STATUS.PREPARING);
  const getReadyOrders = () => orders.filter(o => o.status === ORDER_STATUS.READY);

  const getTabOrders = () => {
    switch (selectedTab) {
      case 'active':
        return activeOrders;
      case 'pending':
        return getPendingOrders();
      case 'preparing':
        return getPreparingOrders();
      case 'ready':
        return getReadyOrders();
      default:
        return activeOrders;
    }
  };

  const displayOrders = getTabOrders();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time overview of restaurant orders
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/orders"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            View All Orders
          </Link>
          <Link
            to="/orders/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Order
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Active Orders */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalActive}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <ClockIcon className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Completed Today */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.completedOrders}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircleIcon className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ${stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <CurrencyDollarIcon className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Average Order Value */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  ${stats.averageOrderValue.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <ArrowTrendingUpIcon className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button
              onClick={() => setSelectedTab('active')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                selectedTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Active Orders ({activeOrders.length})
            </button>
            <button
              onClick={() => setSelectedTab('pending')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                selectedTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending ({getPendingOrders().length})
            </button>
            <button
              onClick={() => setSelectedTab('preparing')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                selectedTab === 'preparing'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Preparing ({getPreparingOrders().length})
            </button>
            <button
              onClick={() => setSelectedTab('ready')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                selectedTab === 'ready'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ready ({getReadyOrders().length})
            </button>
          </nav>
        </div>

        {/* Orders Grid */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading orders...
            </div>
          ) : displayOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No orders in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.tableName || order.customer?.name || 'No table/customer'}
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} size="sm" />
                  </div>

                  {/* Order Details */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Items:</span>
                      <span className="font-medium text-gray-900">
                        {order.items.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Time:</span>
                      <span className="flex items-center text-gray-600">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {getOrderAge(order.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/orders/${order.id}`);
                    }}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <EyeIcon className="w-4 h-4 mr-2" />
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats by Service Type */}
      {stats && stats.serviceTypeBreakdown && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Orders by Service Type
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(SERVICE_TYPE).map(([key, value]) => (
              <div key={value} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">
                  {stats.serviceTypeBreakdown[value] || 0}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {key.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersDashboard;
