/**
 * Performance Metrics Component
 *
 * Displays kitchen performance metrics and statistics
 */

import {
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  FireIcon,
} from '@heroicons/react/24/outline';

/**
 * Performance Metrics Component
 */
const PerformanceMetrics = ({ metrics, timeRange = 'today' }) => {
  /**
   * Format time in minutes to readable format
   */
  const formatTime = (minutes) => {
    if (!minutes || isNaN(minutes)) return 'N/A';
    if (minutes < 60) {
      return `${Math.round(minutes)}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  /**
   * Format percentage
   */
  const formatPercentage = (value) => {
    if (!value || isNaN(value)) return '0%';
    return `${Math.round(value)}%`;
  };

  /**
   * Metric Card Component
   */
  const MetricCard = ({ icon: Icon, label, value, color = 'indigo', subtext }) => {
    const colorClasses = {
      indigo: 'bg-indigo-50 text-indigo-600',
      green: 'bg-green-50 text-green-600',
      orange: 'bg-orange-50 text-orange-600',
      blue: 'bg-blue-50 text-blue-600',
      purple: 'bg-purple-50 text-purple-600',
    };

    return (
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-600">{label}</div>
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Time Range Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
        <span className="text-sm text-gray-600 capitalize">{timeRange}</span>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={CheckCircleIcon}
          label="Orders Completed"
          value={metrics.ordersCompleted || 0}
          color="green"
          subtext={`${metrics.itemsCompleted || 0} items`}
        />

        <MetricCard
          icon={ClockIcon}
          label="Avg Prep Time"
          value={formatTime(metrics.avgPrepTime)}
          color="blue"
          subtext="Per order"
        />

        <MetricCard
          icon={ChartBarIcon}
          label="On-Time Rate"
          value={formatPercentage(metrics.onTimePercentage)}
          color={metrics.onTimePercentage >= 90 ? 'green' : 'orange'}
          subtext="Target: 95%"
        />

        <MetricCard
          icon={FireIcon}
          label="Avg Ticket Time"
          value={formatTime(metrics.avgTicketTime)}
          color="purple"
          subtext="Total time"
        />
      </div>

      {/* Current Status */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow p-4 text-white">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-indigo-100">Active Orders</div>
            <div className="text-3xl font-bold">{metrics.activeOrders || 0}</div>
          </div>
          <div>
            <div className="text-sm text-indigo-100">Pending Items</div>
            <div className="text-3xl font-bold">{metrics.pendingItems || 0}</div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <div className="text-sm text-indigo-100">Status</div>
            <div className="text-xl font-semibold">
              {metrics.activeOrders > 10 ? 'Busy' : 'Normal'}
            </div>
          </div>
        </div>
      </div>

      {/* By Station Breakdown (if available) */}
      {metrics.byStation && Object.keys(metrics.byStation).length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-3">By Station</h4>
          <div className="space-y-2">
            {Object.entries(metrics.byStation).map(([station, data]) => (
              <div key={station} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {station.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">
                    {data.completed || 0} orders
                  </span>
                  <span className="text-gray-600">
                    {formatTime(data.avgPrepTime)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics;
