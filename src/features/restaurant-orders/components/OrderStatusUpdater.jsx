import { useState } from 'react';
import { useStore } from '../../../store';
import { useOrders } from '../hooks/useOrders';
import { getNextStatuses, getDefaultNextStatus } from '../utils/orderWorkflow';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../types/order.types';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  gray: 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300',
  yellow: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-300',
  blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-300',
  orange: 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-300',
  green: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-300',
  teal: 'bg-teal-100 text-teal-800 hover:bg-teal-200 border-teal-300',
  red: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-300',
  purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-300'
};

/**
 * Order Status Updater Component
 * Provides UI for updating order status with quick actions
 */
export const OrderStatusUpdater = ({ order, onStatusChanged, compact = false }) => {
  const { changeOrderStatus } = useOrders();
  const user = useStore((state) => state.user);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAllStatuses, setShowAllStatuses] = useState(false);

  const nextStatuses = getNextStatuses(order.status, order.serviceType);
  const defaultNext = getDefaultNextStatus(order.status, order.serviceType);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setIsUpdating(true);
      await changeOrderStatus(
        order.id,
        newStatus,
        user?.id || 'user_001',
        user?.name || 'Unknown User'
      );

      if (onStatusChanged) {
        onStatusChanged(newStatus);
      }
    } catch (error) {
      toast.error(`Failed to update status: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  if (nextStatuses.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No status transitions available
      </div>
    );
  }

  // Compact view - show only default next status button
  if (compact) {
    return (
      <div className="flex gap-2">
        {defaultNext && (
          <button
            type="button"
            onClick={() => handleStatusUpdate(defaultNext)}
            disabled={isUpdating}
            className={`
              inline-flex items-center px-4 py-2 rounded-lg border font-medium transition-colors
              ${STATUS_STYLES[ORDER_STATUS_COLORS[defaultNext]]}
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {isUpdating ? 'Updating...' : ORDER_STATUS_LABELS[defaultNext]}
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </button>
        )}

        {nextStatuses.length > 1 && (
          <button
            type="button"
            onClick={() => setShowAllStatuses(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            More Options
          </button>
        )}
      </div>
    );
  }

  // Full view - show all available status transitions
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Update Status</h4>
        <span className="text-xs text-gray-500">
          Current: {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {nextStatuses.map((status) => {
          const color = ORDER_STATUS_COLORS[status] || 'gray';
          const isDefault = status === defaultNext;

          return (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusUpdate(status)}
              disabled={isUpdating}
              className={`
                relative px-4 py-3 rounded-lg border-2 font-medium transition-all text-left
                ${STATUS_STYLES[color]}
                ${isDefault ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              <div className="flex items-center justify-between">
                <span>{ORDER_STATUS_LABELS[status]}</span>
                {isDefault && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                    Next
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {isUpdating && (
        <div className="text-sm text-gray-500 text-center">
          Updating order status...
        </div>
      )}
    </div>
  );
};

export default OrderStatusUpdater;
