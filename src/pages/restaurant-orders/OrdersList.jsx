import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../../features/restaurant-orders/hooks/useOrders';
import { ORDER_STATUS, SERVICE_TYPE, ORDER_STATUS_LABELS, SERVICE_TYPE_LABELS } from '../../features/restaurant-orders/types/order.types';
import OrderStatusBadge from '../../features/restaurant-orders/components/OrderStatusBadge';
import { getOrderAge } from '../../features/restaurant-orders/utils/orderWorkflow';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

/**
 * Orders List Page
 * Main page for viewing and managing restaurant orders
 */
export const OrdersList = () => {
  const navigate = useNavigate();
  const {
    orders,
    isLoading,
    fetchOrders,
    getFilteredOrders,
    filters,
    setFilters,
    clearFilters
  } = useOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    status: '',
    serviceType: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = () => {
    fetchOrders({ search: searchQuery, ...localFilters });
  };

  const handleApplyFilters = () => {
    const filterParams = {};
    if (localFilters.status) filterParams.status = localFilters.status;
    if (localFilters.serviceType) filterParams.serviceType = localFilters.serviceType;
    if (localFilters.startDate) filterParams.startDate = localFilters.startDate;
    if (localFilters.endDate) filterParams.endDate = localFilters.endDate;

    setFilters(filterParams);
    fetchOrders({ search: searchQuery, ...filterParams });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      status: '',
      serviceType: '',
      startDate: '',
      endDate: ''
    });
    setSearchQuery('');
    clearFilters();
    fetchOrders();
  };

  const displayOrders = searchQuery || Object.values(localFilters).some(f => f)
    ? orders
    : orders;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all restaurant orders
          </p>
        </div>

        <Link
          to="/orders/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          New Order
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, customer, or table..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filters
          </button>

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={localFilters.status}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  {Object.entries(ORDER_STATUS).map(([key, value]) => (
                    <option key={value} value={value}>
                      {ORDER_STATUS_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type
                </label>
                <select
                  value={localFilters.serviceType}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, serviceType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {Object.entries(SERVICE_TYPE).map(([key, value]) => (
                    <option key={value} value={value}>
                      {SERVICE_TYPE_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={localFilters.startDate}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={localFilters.endDate}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">
            Loading orders...
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No orders found</p>
            <Link
              to="/orders/new"
              className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create First Order
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table/Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {order.orderNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <OrderStatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {SERVICE_TYPE_LABELS[order.serviceType]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.tableName || order.customer?.name || '-'}
                      </div>
                      {order.customer?.phone && (
                        <div className="text-xs text-gray-500">
                          {order.customer.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items.length} item{order.items.length !== 1 && 's'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {getOrderAge(order.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-900"
                      >
                        <EyeIcon className="w-5 h-5 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {displayOrders.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {displayOrders.length}
              </div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {displayOrders.filter(o => ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].includes(o.status)).length}
              </div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {displayOrders.filter(o => o.status === ORDER_STATUS.COMPLETED).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                ${displayOrders.filter(o => o.status === ORDER_STATUS.COMPLETED).reduce((sum, o) => sum + o.total, 0).toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Revenue</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
