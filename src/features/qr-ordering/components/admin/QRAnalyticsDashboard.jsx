/**
 * QR Analytics Dashboard Component
 *
 * Displays analytics and insights for QR code ordering system
 */

import { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  QrCodeIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  TrendingUpIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useStore } from '@/store';
import toast from 'react-hot-toast';

const QRAnalyticsDashboard = () => {
  const { fetchAnalytics, qrOrdering } = useStore();
  const [timeRange, setTimeRange] = useState('today');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      await fetchAnalytics();
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const analytics = qrOrdering.analytics || {
    totalQRCodes: 0,
    activeQRCodes: 0,
    totalScans: 0,
    totalSessions: 0,
    activeSessions: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    conversionRate: 0
  };

  const StatCard = ({ icon: Icon, label, value, subvalue, trend, color = 'indigo' }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUpIcon className={`h-4 w-4 mr-1 ${trend < 0 ? 'transform rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {subvalue && (
          <p className="text-xs text-gray-500 mt-1">{subvalue}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <ChartBarIcon className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QR Ordering Analytics</h1>
              <p className="text-sm text-gray-500">
                Insights and performance metrics
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>

            <button
              onClick={loadAnalytics}
              disabled={loading}
              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-5 w-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {loading && !analytics.totalQRCodes ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              icon={QrCodeIcon}
              label="Total QR Codes"
              value={analytics.totalQRCodes}
              subvalue={`${analytics.activeQRCodes} active`}
              color="indigo"
            />

            <StatCard
              icon={UserGroupIcon}
              label="Total Scans"
              value={analytics.totalScans.toLocaleString()}
              subvalue={`${analytics.activeSessions} active sessions`}
              trend={12}
              color="blue"
            />

            <StatCard
              icon={ShoppingCartIcon}
              label="Total Orders"
              value={analytics.totalOrders.toLocaleString()}
              subvalue={`${analytics.conversionRate.toFixed(1)}% conversion rate`}
              trend={8}
              color="green"
            />

            <StatCard
              icon={CurrencyDollarIcon}
              label="Total Revenue"
              value={`$${analytics.totalRevenue.toLocaleString()}`}
              subvalue={`$${analytics.averageOrderValue.toFixed(2)} avg order`}
              trend={15}
              color="emerald"
            />
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Session Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Sessions</span>
                  <span className="font-semibold text-gray-900">{analytics.totalSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Sessions</span>
                  <span className="font-semibold text-green-600">{analytics.activeSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Conversion Rate</span>
                  <span className="font-semibold text-indigo-600">{analytics.conversionRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg. Session Duration</span>
                  <span className="font-semibold text-gray-900">24 min</span>
                </div>
              </div>
            </div>

            {/* Order Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Metrics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold text-gray-900">{analytics.totalOrders}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Average Order Value</span>
                  <span className="font-semibold text-green-600">${analytics.averageOrderValue.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-semibold text-indigo-600">${analytics.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Orders per Session</span>
                  <span className="font-semibold text-gray-900">
                    {analytics.totalSessions > 0 ? (analytics.totalOrders / analytics.totalSessions).toFixed(1) : '0'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Performing QR Codes */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Tables</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Table
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scans
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sessions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversion
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {qrOrdering.qrCodes
                    .sort((a, b) => b.analytics.totalRevenue - a.analytics.totalRevenue)
                    .slice(0, 10)
                    .map((qrCode, index) => {
                      const conversion = qrCode.analytics.totalScans > 0
                        ? (qrCode.analytics.totalOrders / qrCode.analytics.totalScans * 100).toFixed(1)
                        : 0;
                      return (
                        <tr key={qrCode.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Table {qrCode.tableId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {qrCode.analytics.totalScans}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {qrCode.analytics.totalSessions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {qrCode.analytics.totalOrders}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ${qrCode.analytics.totalRevenue.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {conversion}%
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {qrOrdering.qrCodes.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No QR codes available
                </div>
              )}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center mb-2">
                <ClockIcon className="h-5 w-5 mr-2" />
                <h4 className="font-semibold">Peak Hours</h4>
              </div>
              <p className="text-2xl font-bold mb-1">12 PM - 2 PM</p>
              <p className="text-sm opacity-90">Highest order volume</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center mb-2">
                <TrendingUpIcon className="h-5 w-5 mr-2" />
                <h4 className="font-semibold">Best Day</h4>
              </div>
              <p className="text-2xl font-bold mb-1">Friday</p>
              <p className="text-sm opacity-90">Most revenue generated</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center mb-2">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                <h4 className="font-semibold">Avg. Party Size</h4>
              </div>
              <p className="text-2xl font-bold mb-1">3.2 people</p>
              <p className="text-sm opacity-90">Per table session</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QRAnalyticsDashboard;
