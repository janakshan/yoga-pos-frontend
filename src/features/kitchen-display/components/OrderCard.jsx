/**
 * Order Card Component
 *
 * Displays order details in kitchen display with actions
 */

import { useState } from 'react';
import {
  CheckCircleIcon,
  PrinterIcon,
  ExclamationTriangleIcon,
  UserIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import OrderTimer from './OrderTimer';
import {
  ORDER_PRIORITY_COLORS,
  ORDER_PRIORITY_LABELS,
  KITCHEN_STATION_LABELS,
} from '../types/kitchen.types';

/**
 * Order Card Component
 */
const OrderCard = ({
  order,
  onStartPreparing,
  onMarkReady,
  onBump,
  onPrint,
  onUpdateItemStatus,
  onUpdatePriority,
  selectedStation,
  viewMode = 'grid',
}) => {
  const [expandedItems, setExpandedItems] = useState(false);

  // Filter items by selected station
  const filteredItems = selectedStation
    ? order.items.filter((item) => item.kitchenStation === selectedStation)
    : order.items;

  /**
   * Get priority badge color
   */
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800 animate-pulse',
    };
    return colors[priority] || colors.normal;
  };

  /**
   * Get item status badge
   */
  const getItemStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      served: 'bg-gray-100 text-gray-800',
    };
    return badges[status] || badges.pending;
  };

  /**
   * Handle item status toggle
   */
  const handleItemStatusToggle = (item) => {
    if (item.status === 'pending') {
      onUpdateItemStatus(order.id, item.id, 'preparing');
    } else if (item.status === 'preparing') {
      onUpdateItemStatus(order.id, item.id, 'ready');
    }
  };

  /**
   * Check if all items are ready
   */
  const allItemsReady = filteredItems.every((item) => item.status === 'ready');

  /**
   * Check if order is being prepared
   */
  const isPreparing = order.status === 'preparing' ||
    filteredItems.some((item) => item.status === 'preparing');

  if (viewMode === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow border-l-4 border-indigo-500 p-3 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-indigo-600">
              #{order.orderNumber}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <TableCellsIcon className="h-4 w-4" />
              <span>{order.tableNumber || 'N/A'}</span>
            </div>
            <OrderTimer order={order} size="sm" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              {filteredItems.length} items
            </span>
            {!isPreparing && (
              <button
                onClick={() => onStartPreparing(order.id)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
              >
                Start
              </button>
            )}
            {allItemsReady && (
              <button
                onClick={() => onBump(order.id)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
              >
                Serve
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-bold">#{order.orderNumber}</div>
            <div
              className={`px-2 py-1 rounded-lg text-xs font-semibold ${getPriorityColor(
                order.priority
              )}`}
            >
              {ORDER_PRIORITY_LABELS[order.priority]}
            </div>
          </div>
          <OrderTimer order={order} />
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <TableCellsIcon className="h-4 w-4" />
            <span>Table {order.tableNumber || 'N/A'}</span>
          </div>
          {order.serverName && (
            <div className="flex items-center gap-1">
              <UserIcon className="h-4 w-4" />
              <span>{order.serverName}</span>
            </div>
          )}
          {order.customerCount && (
            <div className="flex items-center gap-1">
              <UserIcon className="h-4 w-4" />
              <span>{order.customerCount} guests</span>
            </div>
          )}
          {order.source === 'qr' && (
            <span className="px-2 py-0.5 bg-purple-500 rounded text-xs">
              QR Order
            </span>
          )}
        </div>
      </div>

      {/* Items List */}
      <div className="p-4">
        <div className="space-y-2 mb-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    {item.quantity}x {item.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${getItemStatusBadge(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                  {item.kitchenStation && (
                    <span className="text-xs text-gray-500">
                      {KITCHEN_STATION_LABELS[item.kitchenStation]}
                    </span>
                  )}
                </div>

                {/* Modifiers */}
                {item.modifiers && item.modifiers.length > 0 && (
                  <div className="text-sm text-gray-600 ml-6">
                    {item.modifiers.map((mod, idx) => (
                      <div key={idx}>
                        • {mod.name}
                        {mod.options?.map((opt) => ` - ${opt.name}`).join('')}
                      </div>
                    ))}
                  </div>
                )}

                {/* Special Instructions */}
                {item.notes && (
                  <div className="mt-1 flex items-start gap-1 text-sm text-orange-600">
                    <ExclamationTriangleIcon className="h-4 w-4 mt-0.5" />
                    <span className="font-medium">{item.notes}</span>
                  </div>
                )}
              </div>

              {/* Item Actions */}
              <div className="flex items-center gap-2 ml-4">
                {item.status === 'pending' && (
                  <button
                    onClick={() => handleItemStatusToggle(item)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Start
                  </button>
                )}
                {item.status === 'preparing' && (
                  <button
                    onClick={() => handleItemStatusToggle(item)}
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Ready
                  </button>
                )}
                {item.status === 'ready' && (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Special Order Notes */}
        {order.notes && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2 text-sm">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-semibold text-yellow-800">Order Notes:</div>
                <div className="text-yellow-700">{order.notes}</div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {!isPreparing && (
            <button
              onClick={() => onStartPreparing(order.id)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Start Preparing
            </button>
          )}

          {isPreparing && !allItemsReady && (
            <button
              onClick={() => onMarkReady(order.id)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
            >
              Mark All Ready
            </button>
          )}

          {allItemsReady && (
            <button
              onClick={() => onBump(order.id)}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold animate-pulse"
            >
              Serve / Bump Order
            </button>
          )}

          <button
            onClick={() => onPrint(order.id, selectedStation)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            title="Print Order"
          >
            <PrinterIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
