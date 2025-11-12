import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  RefreshCw
} from 'lucide-react';
import inventoryAlertsService from '../services/inventoryAlertsService';

/**
 * Inventory Alerts List Component
 * Display and manage inventory alerts
 */
const InventoryAlertsList = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'pending',
    priority: 'all'
  });

  useEffect(() => {
    loadAlerts();
  }, [filters]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const data = await inventoryAlertsService.getAlerts(filters);
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (alertId) => {
    try {
      await inventoryAlertsService.acknowledgeAlert(alertId);
      loadAlerts();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleResolve = async (alertId) => {
    try {
      await inventoryAlertsService.resolveAlert(alertId);
      loadAlerts();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const handleDismiss = async (alertId) => {
    try {
      await inventoryAlertsService.dismissAlert(alertId);
      loadAlerts();
    } catch (error) {
      console.error('Error dismissing alert:', error);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'medium':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock',
      reorder_point: 'Reorder Point',
      expiring_soon: 'Expiring Soon',
      expired: 'Expired',
      overstock: 'Overstock'
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Alerts</h2>
          <p className="text-gray-600">Manage stock alerts and notifications</p>
        </div>
        <button
          onClick={loadAlerts}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="reorder_point">Reorder Point</option>
            <option value="expiring_soon">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Alerts Found
          </h3>
          <p className="text-gray-600">
            All inventory levels are within acceptable ranges.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow border-l-4 ${
                alert.priority === 'critical'
                  ? 'border-red-500'
                  : alert.priority === 'high'
                  ? 'border-orange-500'
                  : alert.priority === 'medium'
                  ? 'border-yellow-500'
                  : 'border-blue-500'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">{getPriorityIcon(alert.priority)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {alert.productName}
                        </h3>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
                            alert.priority
                          )}`}
                        >
                          {alert.priority.toUpperCase()}
                        </span>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                          {getTypeLabel(alert.type)}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-2">{alert.message}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>SKU: {alert.productSku}</span>
                        {alert.locationName && (
                          <span>Location: {alert.locationName}</span>
                        )}
                        {alert.currentQuantity !== null && (
                          <span>Current Stock: {alert.currentQuantity}</span>
                        )}
                        {alert.threshold !== null && (
                          <span>Threshold: {alert.threshold}</span>
                        )}
                      </div>

                      <div className="mt-2 text-xs text-gray-500">
                        Triggered: {new Date(alert.triggeredAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {alert.status === 'pending' && (
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        title="Acknowledge"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        title="Resolve"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="p-1.5 text-gray-600 hover:text-red-600"
                        title="Dismiss"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {alert.status === 'acknowledged' && (
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Resolve
                      </button>
                    </div>
                  )}

                  {(alert.status === 'resolved' || alert.status === 'dismissed') && (
                    <div className="ml-4">
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          alert.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {alert.status === 'resolved' ? 'Resolved' : 'Dismissed'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
            </span>
            <span>
              {alerts.filter((a) => a.priority === 'critical').length} Critical,{' '}
              {alerts.filter((a) => a.priority === 'high').length} High Priority
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryAlertsList;
