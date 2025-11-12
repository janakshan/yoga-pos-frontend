/**
 * Expeditor Display Component
 *
 * Full-screen display for expeditor to monitor all kitchen stations and order readiness
 * Shows overview of all orders across all stations with bump/completion controls
 */

import { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  FireIcon,
  PrinterIcon,
  BellAlertIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import {
  KITCHEN_STATION_LABELS,
  KITCHEN_STATION_COLORS,
  ORDER_PRIORITY_LABELS,
} from '../types/kitchen.types';
import OrderTimer from './OrderTimer';

/**
 * Expeditor Display Component
 */
const ExpeditorDisplay = ({
  orders = [],
  onBumpOrder,
  onCompleteOrder,
  onPrintBumpTicket,
  onPageCustomer,
  onBuzzKitchen,
  pagerEnabled = false,
}) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, ready, critical
  const [autoAdvance, setAutoAdvance] = useState(true);

  /**
   * Calculate order readiness percentage
   */
  const getOrderReadiness = (order) => {
    const totalItems = order.items.length;
    const readyItems = order.items.filter((i) => i.status === 'ready').length;
    return totalItems > 0 ? Math.round((readyItems / totalItems) * 100) : 0;
  };

  /**
   * Get readiness status
   */
  const getReadinessStatus = (percentage) => {
    if (percentage === 100) return 'complete';
    if (percentage >= 75) return 'almost';
    if (percentage >= 50) return 'halfway';
    if (percentage >= 25) return 'started';
    return 'pending';
  };

  /**
   * Get readiness color
   */
  const getReadinessColor = (status) => {
    const colors = {
      complete: 'bg-green-500',
      almost: 'bg-green-400',
      halfway: 'bg-yellow-500',
      started: 'bg-orange-500',
      pending: 'bg-gray-400',
    };
    return colors[status] || colors.pending;
  };

  /**
   * Get aging color based on elapsed time
   */
  const getAgingColor = (elapsedTime) => {
    if (elapsedTime >= 20) return 'bg-red-500';
    if (elapsedTime >= 15) return 'bg-orange-500';
    if (elapsedTime >= 10) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  /**
   * Get items by station for an order
   */
  const getItemsByStation = (order) => {
    const byStation = {};
    order.items.forEach((item) => {
      const station = item.kitchenStation || 'default';
      if (!byStation[station]) {
        byStation[station] = [];
      }
      byStation[station].push(item);
    });
    return byStation;
  };

  /**
   * Handle bump order
   */
  const handleBump = (order) => {
    if (onBumpOrder) {
      onBumpOrder(order);
    }

    if (autoAdvance) {
      // Auto-select next order
      const currentIndex = filteredOrders.findIndex((o) => o.id === order.id);
      if (currentIndex < filteredOrders.length - 1) {
        setSelectedOrder(filteredOrders[currentIndex + 1]);
      } else if (filteredOrders.length > 1) {
        setSelectedOrder(filteredOrders[0]);
      } else {
        setSelectedOrder(null);
      }
    }
  };

  /**
   * Filter orders based on selected filter
   */
  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true;
    if (filter === 'pending') return getOrderReadiness(order) < 100;
    if (filter === 'ready') return getOrderReadiness(order) === 100;
    if (filter === 'critical') return order.elapsedTime >= 15;
    return true;
  }).sort((a, b) => {
    // Sort by priority, then by elapsed time
    const priorityOrder = { urgent: 4, high: 3, normal: 2, low: 1 };
    const aPriority = priorityOrder[a.priority] || 2;
    const bPriority = priorityOrder[b.priority] || 2;

    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }

    return b.elapsedTime - a.elapsedTime;
  });

  /**
   * Get summary statistics
   */
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => getOrderReadiness(o) < 100).length,
    ready: orders.filter((o) => getOrderReadiness(o) === 100).length,
    critical: orders.filter((o) => o.elapsedTime >= 15).length,
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TruckIcon className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Expeditor Display</h1>
            </div>
            <div className="flex items-center gap-2 text-sm bg-indigo-500 px-3 py-1 rounded-full">
              <ClockIcon className="h-4 w-4" />
              {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Statistics */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{stats.total}</div>
              <div className="text-xs uppercase">Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">{stats.pending}</div>
              <div className="text-xs uppercase">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">{stats.ready}</div>
              <div className="text-xs uppercase">Ready</div>
            </div>
            {stats.critical > 0 && (
              <div className="text-center">
                <div className="text-3xl font-bold text-red-300 animate-pulse">
                  {stats.critical}
                </div>
                <div className="text-xs uppercase">Critical</div>
              </div>
            )}
          </div>

          {/* Auto-advance toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoAdvance}
              onChange={(e) => setAutoAdvance(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Auto Advance</span>
          </label>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mt-4">
          {[
            { id: 'all', label: 'All Orders', count: stats.total },
            { id: 'pending', label: 'In Progress', count: stats.pending },
            { id: 'ready', label: 'Ready', count: stats.ready },
            { id: 'critical', label: 'Critical', count: stats.critical },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-white text-indigo-600'
                  : 'bg-indigo-500 text-white hover:bg-indigo-400'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Order list */}
        <div className="w-1/3 bg-white border-r overflow-y-auto">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <CheckCircleIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No orders to display</p>
              <p className="text-sm">All caught up!</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const readiness = getOrderReadiness(order);
              const readinessStatus = getReadinessStatus(readiness);
              const isSelected = selectedOrder?.id === order.id;

              return (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50 border-l-4 border-l-indigo-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          #{order.orderNumber || order.id}
                        </span>
                        {order.priority !== 'normal' && (
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              order.priority === 'urgent'
                                ? 'bg-red-100 text-red-800 animate-pulse'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {ORDER_PRIORITY_LABELS[order.priority]}
                          </span>
                        )}
                      </div>
                      {order.tableNumber && (
                        <div className="text-sm text-gray-600 mt-1">
                          Table: {order.tableNumber}
                        </div>
                      )}
                    </div>
                    <OrderTimer
                      startTime={order.createdAt || order.confirmedAt}
                      agingThresholds={{ warning: 10, critical: 15, urgent: 20 }}
                      compact
                    />
                  </div>

                  {/* Progress bar */}
                  <div className="mb-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">
                        Readiness
                      </span>
                      <span className="text-xs font-bold text-gray-900">
                        {readiness}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full ${getReadinessColor(readinessStatus)} transition-all duration-500`}
                        style={{ width: `${readiness}%` }}
                      />
                    </div>
                  </div>

                  {/* Item counts by station */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {Object.entries(getItemsByStation(order)).map(([station, items]) => {
                      const stationReady = items.filter((i) => i.status === 'ready').length;
                      const stationTotal = items.length;
                      const isComplete = stationReady === stationTotal;

                      return (
                        <div
                          key={station}
                          className={`px-2 py-1 rounded ${
                            isComplete
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {KITCHEN_STATION_LABELS[station] || station}: {stationReady}/{stationTotal}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Order details */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedOrder ? (
            <div className="max-w-4xl mx-auto">
              {/* Order header */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                      Order #{selectedOrder.orderNumber || selectedOrder.id}
                    </h2>
                    <div className="flex items-center gap-4 text-gray-600">
                      {selectedOrder.tableNumber && (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">Table:</span>
                          <span className="text-xl font-bold">{selectedOrder.tableNumber}</span>
                        </div>
                      )}
                      {selectedOrder.serverName && (
                        <div>Server: {selectedOrder.serverName}</div>
                      )}
                      {selectedOrder.serviceType && (
                        <div className="capitalize">{selectedOrder.serviceType}</div>
                      )}
                    </div>
                  </div>
                  <OrderTimer
                    startTime={selectedOrder.createdAt || selectedOrder.confirmedAt}
                    agingThresholds={{ warning: 10, critical: 15, urgent: 20 }}
                  />
                </div>

                {/* Items by station */}
                <div className="space-y-4">
                  {Object.entries(getItemsByStation(selectedOrder)).map(([station, items]) => (
                    <div key={station} className="border rounded-lg overflow-hidden">
                      <div
                        className={`bg-${KITCHEN_STATION_COLORS[station]}-100 px-4 py-2 font-medium text-${KITCHEN_STATION_COLORS[station]}-900 flex items-center justify-between`}
                      >
                        <span>{KITCHEN_STATION_LABELS[station] || station}</span>
                        <span className="text-sm">
                          {items.filter((i) => i.status === 'ready').length} / {items.length} Ready
                        </span>
                      </div>
                      <div className="divide-y">
                        {items.map((item) => (
                          <div
                            key={item.id}
                            className={`p-4 flex items-center justify-between ${
                              item.status === 'ready' ? 'bg-green-50' : 'bg-white'
                            }`}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-gray-700">
                                  {item.quantity}x
                                </span>
                                <div>
                                  <div className="font-medium text-gray-900">{item.name}</div>
                                  {item.modifiers && item.modifiers.length > 0 && (
                                    <div className="text-sm text-gray-600 mt-1">
                                      {item.modifiers.map((mod) => mod.name).join(', ')}
                                    </div>
                                  )}
                                  {item.notes && (
                                    <div className="text-sm font-medium text-orange-600 mt-1">
                                      ** {item.notes} **
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {item.status === 'ready' ? (
                                <CheckCircleIcon className="h-8 w-8 text-green-600" />
                              ) : (
                                <ClockIcon className="h-8 w-8 text-yellow-600" />
                              )}
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  item.status === 'ready'
                                    ? 'bg-green-100 text-green-800'
                                    : item.status === 'preparing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {item.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex gap-4 mt-6">
                  {getOrderReadiness(selectedOrder) === 100 && (
                    <>
                      <button
                        onClick={() => handleBump(selectedOrder)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircleIcon className="h-6 w-6" />
                        Bump Order
                      </button>
                      {pagerEnabled && selectedOrder.pagerNumber && (
                        <button
                          onClick={() => onPageCustomer(selectedOrder)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                        >
                          <BellAlertIcon className="h-6 w-6" />
                          Page Customer
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => onPrintBumpTicket(selectedOrder)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <PrinterIcon className="h-6 w-6" />
                    Print Ticket
                  </button>
                  {onBuzzKitchen && getOrderReadiness(selectedOrder) < 100 && (
                    <button
                      onClick={() => {
                        Object.keys(getItemsByStation(selectedOrder)).forEach((station) => {
                          onBuzzKitchen(station, 'urgent');
                        });
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <FireIcon className="h-6 w-6" />
                      Rush Order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <TruckIcon className="h-24 w-24 mx-auto mb-4 opacity-30" />
                <p className="text-xl">Select an order to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpeditorDisplay;
