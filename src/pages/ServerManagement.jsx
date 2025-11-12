/**
 * Server Management Page
 * Main page for managing servers, shifts, sections, and performance
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  MapPin,
  TrendingUp,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useServerManagement } from '../features/server-management/hooks/useServerManagement';
import SectionAssignment from '../features/server-management/components/SectionAssignment';
import ShiftManagement from '../features/server-management/components/ShiftManagement';
import ServerPerformanceDashboard from '../features/server-management/components/ServerPerformanceDashboard';
import ServerAnalytics from '../features/server-management/components/ServerAnalytics';
import Card from '../components/common/Card';

const ServerManagement = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { stats, fetchStats } = useServerManagement();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const tabs = [
    {
      id: 'overview',
      name: 'Overview',
      icon: BarChart3,
      description: 'Quick stats and overview'
    },
    {
      id: 'sections',
      name: 'Sections',
      icon: MapPin,
      description: 'Manage restaurant sections'
    },
    {
      id: 'shifts',
      name: 'Shifts',
      icon: Clock,
      description: 'Shift management and clock in/out'
    },
    {
      id: 'performance',
      name: 'Performance',
      icon: TrendingUp,
      description: 'Server performance metrics'
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      description: 'Orders, tips, and reports'
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Server Management</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive server management, performance tracking, and analytics
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Overview</h2>
                <p className="text-gray-600">
                  Quick snapshot of server management statistics
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Active Servers</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.serversOnShift}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Total: {stats.totalServers} servers
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Active Sections</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.activeSections}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Total: {stats.totalSections} sections
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Active Orders</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.totalActiveOrders}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Currently being served
                  </p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Daily Sales</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatCurrency(stats.totalDailySales)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Tips: {formatCurrency(stats.totalDailyTips)}
                  </p>
                </Card>
              </div>

              {/* Performance Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Today's Performance
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Sales</span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatCurrency(stats.totalDailySales)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Tips</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(stats.totalDailyTips)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Active Orders</span>
                      <span className="text-lg font-bold text-purple-600">
                        {stats.totalActiveOrders}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Avg Service Time</span>
                      <span className="text-lg font-bold text-gray-900">
                        {Math.round(stats.averageServiceTime)} min
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setActiveTab('sections')}
                      className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
                    >
                      <MapPin className="w-6 h-6 text-blue-600 mb-2" />
                      <p className="font-medium text-gray-900">Manage Sections</p>
                      <p className="text-xs text-gray-600">Assign servers to sections</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('shifts')}
                      className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
                    >
                      <Clock className="w-6 h-6 text-green-600 mb-2" />
                      <p className="font-medium text-gray-900">Manage Shifts</p>
                      <p className="text-xs text-gray-600">Clock in/out and breaks</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('performance')}
                      className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
                    >
                      <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
                      <p className="font-medium text-gray-900">View Performance</p>
                      <p className="text-xs text-gray-600">Detailed metrics</p>
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-left"
                    >
                      <BarChart3 className="w-6 h-6 text-yellow-600 mb-2" />
                      <p className="font-medium text-gray-900">Analytics</p>
                      <p className="text-xs text-gray-600">Orders, tips & reports</p>
                    </button>
                  </div>
                </Card>
              </div>

              {/* Recent Activity or Tips */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  System Status
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700">
                    All systems operational • {stats.serversOnShift} servers currently on shift
                  </span>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'sections' && <SectionAssignment />}
          {activeTab === 'shifts' && <ShiftManagement />}
          {activeTab === 'performance' && <ServerPerformanceDashboard />}
          {activeTab === 'analytics' && <ServerAnalytics />}
        </div>
      </div>
    </div>
  );
};

export default ServerManagement;
