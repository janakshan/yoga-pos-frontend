import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { useStore } from '../store';
import { useOrders } from '../features/restaurant-orders/hooks/useOrders';
import { useTables } from '../features/restaurant/tables/hooks/useTables';
import { ORDER_STATUS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../features/restaurant-orders/types/order.types';
import { formatCurrency } from '../features/pos/utils/calculations';
import toast from 'react-hot-toast';

/**
 * ServerDashboard
 * Dashboard for restaurant servers/waiters to manage their tables and orders
 * @returns {JSX.Element}
 */
const ServerDashboard = () => {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  const { orders, fetchOrders, updateOrderStatus, isLoading } = useOrders();
  const { tables, fetchTables } = useTables();

  const [selectedFilter, setSelectedFilter] = useState('active'); // 'active', 'all', 'completed'

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchOrders({ assignedServerId: user?.id }),
      fetchTables(),
    ]);
  };

  // Filter orders based on selected filter
  const filteredOrders = orders.filter((order) => {
    if (selectedFilter === 'active') {
      return ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].includes(order.status);
    } else if (selectedFilter === 'completed') {
      return order.status === ORDER_STATUS.COMPLETED;
    }
    return true;
  });

  // Get server's assigned tables
  const myTables = tables.filter((table) => table.assignedServer?.id === user?.id);

  // Calculate stats
  const activeOrders = orders.filter((o) =>
    ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].includes(o.status)
  ).length;

  const totalSales = orders
    .filter((o) => o.status === ORDER_STATUS.COMPLETED)
    .reduce((sum, o) => sum + o.total, 0);

  const totalTips = orders
    .filter((o) => o.status === ORDER_STATUS.COMPLETED)
    .reduce((sum, o) => sum + (o.tip || 0), 0);

  const occupiedTables = myTables.filter((t) => t.status === 'occupied').length;

  const handleNewOrder = (tableId = null) => {
    if (tableId) {
      // Pre-select table and navigate to POS
      const table = tables.find((t) => t.id === tableId);
      if (table) {
        useStore.getState().setTable(table.id, table.number);
        useStore.getState().setServer(user.id, `${user.firstName} ${user.lastName}`);
      }
    }
    navigate('/pos');
  };

  const handleOrderClick = (order) => {
    // Navigate to order details or POS page
    navigate(`/restaurant-orders/${order.id}`);
  };

  const handleRefresh = () => {
    loadData();
    toast.success('Dashboard refreshed');
  };

  const getStatusColor = (status) => {
    const colors = {
      [ORDER_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      [ORDER_STATUS.CONFIRMED]: 'bg-blue-100 text-blue-800 border-blue-300',
      [ORDER_STATUS.PREPARING]: 'bg-orange-100 text-orange-800 border-orange-300',
      [ORDER_STATUS.READY]: 'bg-green-100 text-green-800 border-green-300',
      [ORDER_STATUS.SERVED]: 'bg-teal-100 text-teal-800 border-teal-300',
      [ORDER_STATUS.COMPLETED]: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Server Dashboard</h1>
              <p className="text-orange-100 mt-1">
                Welcome, {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={() => handleNewOrder()}
                className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 hover:bg-orange-50 rounded-lg font-semibold transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">New Order</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm text-orange-100">Active Orders</span>
              </div>
              <div className="text-3xl font-bold">{activeOrders}</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5" />
                <span className="text-sm text-orange-100">Occupied Tables</span>
              </div>
              <div className="text-3xl font-bold">
                {occupiedTables}/{myTables.length}
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm text-orange-100">Total Sales</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm text-orange-100">Total Tips</span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(totalTips)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Tables */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-orange-600" />
                  My Tables ({myTables.length})
                </h2>
              </div>
              <div className="p-4 space-y-2 max-h-[600px] overflow-y-auto">
                {myTables.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No tables assigned
                  </div>
                ) : (
                  myTables.map((table) => (
                    <div
                      key={table.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        table.status === 'occupied'
                          ? 'border-orange-300 bg-orange-50 hover:border-orange-400'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                      onClick={() => {
                        if (table.status === 'available') {
                          handleNewOrder(table.id);
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-gray-900">{table.number}</div>
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-medium ${
                            table.status === 'occupied'
                              ? 'bg-red-100 text-red-700'
                              : table.status === 'available'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {table.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Capacity: {table.capacity}
                        </div>
                        {table.section && (
                          <div className="text-xs text-gray-500 mt-1">
                            {table.section}
                          </div>
                        )}
                      </div>
                      {table.status === 'occupied' && table.currentOrderId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const order = orders.find((o) => o.id === table.currentOrderId);
                            if (order) handleOrderClick(order);
                          }}
                          className="mt-2 text-xs text-orange-600 hover:text-orange-700 font-medium"
                        >
                          View Order →
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    Orders
                  </h2>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedFilter('active')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedFilter === 'active'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setSelectedFilter('completed')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedFilter === 'completed'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedFilter === 'all'
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                {filteredOrders.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">
                    <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                    <p>No orders to display</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => handleOrderClick(order)}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-orange-300 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-gray-900 text-lg">
                            {order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                            {order.tableName && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {order.tableName}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(order.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium border-2 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {ORDER_STATUS_LABELS[order.status]}
                        </span>
                      </div>

                      {/* Order Items */}
                      <div className="mb-3 space-y-1">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="text-sm text-gray-600">
                            {item.quantity}× {item.name}
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="text-sm text-gray-500">
                            +{order.items.length - 3} more items
                          </div>
                        )}
                      </div>

                      {/* Total */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Total:</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(order.total)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerDashboard;
