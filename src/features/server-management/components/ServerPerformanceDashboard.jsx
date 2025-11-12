/**
 * Server Performance Dashboard Component
 * Displays comprehensive performance metrics for servers
 */

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  Star,
  Target,
  Calendar,
} from 'lucide-react';
import { useServerManagement } from '../hooks/useServerManagement';
import { useStore } from '../../../store';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import FormField from '../../../components/forms/FormField';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

const ServerPerformanceDashboard = () => {
  const {
    serverPerformance,
    loading,
    fetchServerPerformance,
    fetchServerOrderHistory,
    fetchServerTips,
  } = useServerManagement();

  const users = useStore((state) => state.users);
  const currentUser = useStore((state) => state.user);
  const fetchUsers = useStore((state) => state.fetchUsers);

  const [selectedServerId, setSelectedServerId] = useState(currentUser?.id || '');
  const [dateRange, setDateRange] = useState('today');
  const [startDate, setStartDate] = useState(format(startOfDay(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfDay(new Date()), 'yyyy-MM-dd'));

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
      loadPerformanceData();
    }
  }, [selectedServerId, startDate, endDate]);

  const loadPerformanceData = async () => {
    try {
      await fetchServerPerformance(selectedServerId, { startDate, endDate });
      await fetchServerOrderHistory(selectedServerId, { startDate, endDate });
      await fetchServerTips(selectedServerId, { startDate, endDate });
    } catch (error) {
      console.error('Error loading performance data:', error);
    }
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    const today = new Date();

    switch (range) {
      case 'today':
        setStartDate(format(startOfDay(today), 'yyyy-MM-dd'));
        setEndDate(format(endOfDay(today), 'yyyy-MM-dd'));
        break;
      case 'yesterday':
        const yesterday = subDays(today, 1);
        setStartDate(format(startOfDay(yesterday), 'yyyy-MM-dd'));
        setEndDate(format(endOfDay(yesterday), 'yyyy-MM-dd'));
        break;
      case 'week':
        setStartDate(format(subDays(today, 7), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case 'month':
        setStartDate(format(subDays(today, 30), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        break;
      case 'custom':
        // Keep current dates
        break;
      default:
        break;
    }
  };

  const performance = serverPerformance[selectedServerId];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const getChangeColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4" />;
    if (value < 0) return <TrendingDown className="w-4 h-4" />;
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Server Performance</h2>
        <p className="text-gray-600 mt-1">
          Track and analyze server performance metrics
        </p>
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
            label="Date Range"
            type="select"
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="custom">Custom Range</option>
          </FormField>

          {dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-2">
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
          )}
        </div>
      </Card>

      {/* Performance Data */}
      {!selectedServerId ? (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Server</h3>
          <p className="text-gray-600">
            Choose a server from the dropdown to view their performance metrics
          </p>
        </Card>
      ) : loading.performance ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : !performance ? (
        <Card className="p-12 text-center">
          <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">
            No performance data found for the selected period
          </p>
        </Card>
      ) : (
        <>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Sales */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <Badge color="blue">Sales</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(performance.totalSales)}
              </p>
              <p className="text-sm text-gray-600">Total Sales</p>
              <div className="flex items-center gap-1 mt-2 text-sm font-medium text-green-600">
                {getChangeIcon(12)}
                <span>+12% from last period</span>
              </div>
            </Card>

            {/* Tips */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <Badge color="green">Tips</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(performance.totalTips)}
              </p>
              <p className="text-sm text-gray-600">
                Avg: {formatCurrency(performance.averageTipAmount)} ({formatPercentage(performance.tipPercentage)})
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm font-medium text-green-600">
                {getChangeIcon(8)}
                <span>+8% from last period</span>
              </div>
            </Card>

            {/* Orders */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                </div>
                <Badge color="purple">Orders</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {performance.totalOrders}
              </p>
              <p className="text-sm text-gray-600">
                Avg Value: {formatCurrency(performance.averageOrderValue)}
              </p>
              <div className="flex items-center gap-1 mt-2 text-sm font-medium text-green-600">
                {getChangeIcon(15)}
                <span>+15% from last period</span>
              </div>
            </Card>

            {/* Service Time */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <Badge color="yellow">Efficiency</Badge>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {Math.round(performance.averageServiceTime)} min
              </p>
              <p className="text-sm text-gray-600">Avg Service Time</p>
              <div className="flex items-center gap-1 mt-2 text-sm font-medium text-green-600">
                {getChangeIcon(-5)}
                <span>-5% faster</span>
              </div>
            </Card>
          </div>

          {/* Detailed Performance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Performance */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold">{performance.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed Orders</span>
                  <span className="font-semibold text-green-600">{performance.completedOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cancelled Orders</span>
                  <span className="font-semibold text-red-600">{performance.cancelledOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order Accuracy</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${performance.orderAccuracy}%` }}
                      />
                    </div>
                    <span className="font-semibold">{formatPercentage(performance.orderAccuracy)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customer Service */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Service</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tables Served</span>
                  <span className="font-semibold">{performance.tablesServed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Guests Served</span>
                  <span className="font-semibold">{performance.guestsServed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Customer Rating</span>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{performance.customerSatisfactionScore}/5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Table Turnover</span>
                  <span className="font-semibold">{Math.round(performance.averageTableTurnover)} min</span>
                </div>
              </div>
            </Card>

            {/* Sales Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Breakdown</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Total Sales</span>
                    <span className="font-semibold">{formatCurrency(performance.totalSales)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Upsells</span>
                    <span className="font-semibold">{formatCurrency(performance.upsellAmount)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${(performance.upsellAmount / performance.totalSales) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-gray-600">Average Order Value</span>
                  <span className="font-semibold">{formatCurrency(performance.averageOrderValue)}</span>
                </div>
              </div>
            </Card>

            {/* Tips Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Tips</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(performance.totalTips)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Tip</span>
                  <span className="font-semibold">{formatCurrency(performance.averageTipAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Tip Percentage</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${performance.tipPercentage}%` }}
                      />
                    </div>
                    <span className="font-semibold">{formatPercentage(performance.tipPercentage)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-gray-600">Tips per Hour</span>
                  <span className="font-semibold">
                    {formatCurrency((performance.totalTips / (performance.averageServiceTime / 60)) || 0)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Insights */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <h4 className="font-medium text-green-900">Strengths</h4>
                </div>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• High customer satisfaction rating</li>
                  <li>• Above-average tip percentage</li>
                  <li>• Efficient service time</li>
                  <li>• Strong order accuracy</li>
                </ul>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-medium text-yellow-900">Areas for Improvement</h4>
                </div>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Increase upsell opportunities</li>
                  <li>• Reduce table turnover time</li>
                  <li>• Handle more tables during peak hours</li>
                  <li>• Focus on guest count per table</li>
                </ul>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ServerPerformanceDashboard;
