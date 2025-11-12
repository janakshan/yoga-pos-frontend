/**
 * Server Analytics Component
 * Combines order history, tip tracking, and reports
 */

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Clock,
  FileText,
  Download,
  Filter,
} from 'lucide-react';
import { useServerManagement } from '../hooks/useServerManagement';
import { useStore } from '../../../store';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import FormField from '../../../components/forms/FormField';
import { format, subDays } from 'date-fns';

const ServerAnalytics = () => {
  const {
    serverOrderHistory,
    serverTips,
    loading,
    fetchServerOrderHistory,
    fetchServerTips,
    generateReport,
  } = useServerManagement();

  const users = useStore((state) => state.users);
  const currentUser = useStore((state) => state.user);
  const fetchUsers = useStore((state) => state.fetchUsers);

  const [selectedServerId, setSelectedServerId] = useState(currentUser?.id || '');
  const [activeTab, setActiveTab] = useState('orders'); // orders, tips, reports
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [orderFilter, setOrderFilter] = useState('all'); // all, completed, cancelled
  const [tipsSummary, setTipsSummary] = useState(null);

  // Get servers
  const servers = users.filter(user =>
    user.roles?.some(role => role.toLowerCase().includes('server')) ||
    user.staffProfile?.serverProfile?.isServer
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (selectedServerId) {
      loadAnalyticsData();
    }
  }, [selectedServerId, startDate, endDate]);

  const loadAnalyticsData = async () => {
    try {
      await fetchServerOrderHistory(selectedServerId, { startDate, endDate });
      const tipsResponse = await fetchServerTips(selectedServerId, { startDate, endDate });
      if (tipsResponse?.summary) {
        setTipsSummary(tipsResponse.summary);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
  };

  const handleGenerateReport = async () => {
    try {
      await generateReport({
        serverId: selectedServerId,
        serverName: servers.find(s => s.id === selectedServerId)?.fullName || 'Server',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reportType: 'custom',
      });
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  // Filter orders
  const filteredOrders = serverOrderHistory.filter(order => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'completed') return order.status === 'completed';
    if (orderFilter === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      completed: 'green',
      cancelled: 'red',
      pending: 'yellow',
      confirmed: 'blue',
      preparing: 'purple',
      ready: 'cyan',
      served: 'emerald',
    };
    return colors[status] || 'gray';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Server Analytics</h2>
          <p className="text-gray-600 mt-1">
            View order history, tips, and generate reports
          </p>
        </div>
        <Button
          onClick={handleGenerateReport}
          disabled={!selectedServerId || loading.reports}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Generate Report
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Server"
            type="select"
            value={selectedServerId}
            onChange={(e) => setSelectedServerId(e.target.value)}
          >
            <option value="">Select a server...</option>
            {servers.map((server) => (
              <option key={server.id} value={server.id}>
                {server.fullName || `${server.firstName} ${server.lastName}`}
              </option>
            ))}
          </FormField>

          <FormField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <FormField
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </Card>

      {!selectedServerId ? (
        <Card className="p-12 text-center">
          <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Server</h3>
          <p className="text-gray-600">
            Choose a server from the dropdown to view their analytics
          </p>
        </Card>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex gap-2">
            {['orders', 'tips', 'summary'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Order History Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Order Filters */}
              <div className="flex gap-2">
                {['all', 'completed', 'cancelled'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setOrderFilter(filter)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                      orderFilter === filter
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {filter} ({serverOrderHistory.filter(o => filter === 'all' || o.status === filter).length})
                  </button>
                ))}
              </div>

              {/* Orders List */}
              {loading.orders ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredOrders.length === 0 ? (
                <Card className="p-12 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
                  <p className="text-gray-600">
                    No orders found for the selected period and filters
                  </p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-gray-900">{order.orderNumber}</h4>
                            <Badge color={getOrderStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                            {order.tableName && (
                              <span className="text-sm text-gray-600">Table: {order.tableName}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {format(new Date(order.createdAt), 'MMM d, h:mm a')}
                            </span>
                            {order.serviceTime && (
                              <span>Service Time: {order.serviceTime} min</span>
                            )}
                            {order.guestCount && (
                              <span>Guests: {order.guestCount}</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(order.total)}
                          </p>
                          {order.tip > 0 && (
                            <p className="text-sm text-green-600">
                              Tip: {formatCurrency(order.tip)} ({order.tipPercentage?.toFixed(1)}%)
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === 'tips' && (
            <div className="space-y-6">
              {/* Tips Summary Cards */}
              {tipsSummary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Tips</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(tipsSummary.totalTips)}
                    </p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-gray-600 mb-1">Average Tip</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(tipsSummary.averageTip)}
                    </p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-gray-600 mb-1">Avg Tip %</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {tipsSummary.averageTipPercentage?.toFixed(1)}%
                    </p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-gray-600 mb-1">Cash vs Card</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Cash</p>
                        <p className="text-sm font-semibold">{formatCurrency(tipsSummary.cashTips)}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Card</p>
                        <p className="text-sm font-semibold">{formatCurrency(tipsSummary.cardTips)}</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Tips List */}
              {loading.tips ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : serverTips.length === 0 ? (
                <Card className="p-12 text-center">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tips Found</h3>
                  <p className="text-gray-600">
                    No tip data found for the selected period
                  </p>
                </Card>
              ) : (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tip History</h3>
                  <div className="space-y-3">
                    {serverTips.map((tip) => (
                      <div
                        key={tip.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{tip.orderNumber}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(tip.date), 'MMM d, h:mm a')} • {tip.tipType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(tip.tipAmount)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {tip.tipPercentage?.toFixed(1)}% of {formatCurrency(tip.orderAmount)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Performance */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Performance</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="text-xl font-bold">{serverOrderHistory.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Sales</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(
                        serverOrderHistory.reduce((sum, o) => sum + o.total, 0)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Tips</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(
                        serverOrderHistory.reduce((sum, o) => sum + (o.tip || 0), 0)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Average Order Value</span>
                    <span className="text-xl font-bold">
                      {formatCurrency(
                        serverOrderHistory.length > 0
                          ? serverOrderHistory.reduce((sum, o) => sum + o.total, 0) /
                              serverOrderHistory.length
                          : 0
                      )}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Order Status Breakdown */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Breakdown</h3>
                <div className="space-y-3">
                  {['completed', 'cancelled', 'pending'].map((status) => {
                    const count = serverOrderHistory.filter(o => o.status === status).length;
                    const percentage = serverOrderHistory.length > 0
                      ? (count / serverOrderHistory.length) * 100
                      : 0;

                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {status}
                          </span>
                          <span className="text-sm text-gray-600">
                            {count} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              status === 'completed'
                                ? 'bg-green-600'
                                : status === 'cancelled'
                                ? 'bg-red-600'
                                : 'bg-yellow-600'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Performance Trends */}
              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">+15%</p>
                    <p className="text-sm text-gray-600">Sales Growth</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">+12%</p>
                    <p className="text-sm text-gray-600">Order Volume</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <DollarSign className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">+8%</p>
                    <p className="text-sm text-gray-600">Tip Average</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ServerAnalytics;
