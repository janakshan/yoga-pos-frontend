/**
 * TableQuickActions Component
 * Quick action buttons for changing table status
 */

import { useState } from 'react';
import { Check, X, Clock, AlertCircle, Users, Sparkles } from 'lucide-react';
import { useTables } from '../hooks/useTables';

const QUICK_ACTIONS = [
  {
    status: 'available',
    label: 'Mark Available',
    icon: Check,
    color: 'green',
    bgClass: 'bg-green-50 hover:bg-green-100',
    textClass: 'text-green-700',
    iconClass: 'text-green-600',
  },
  {
    status: 'occupied',
    label: 'Mark Occupied',
    icon: Users,
    color: 'blue',
    bgClass: 'bg-blue-50 hover:bg-blue-100',
    textClass: 'text-blue-700',
    iconClass: 'text-blue-600',
  },
  {
    status: 'reserved',
    label: 'Mark Reserved',
    icon: Clock,
    color: 'purple',
    bgClass: 'bg-purple-50 hover:bg-purple-100',
    textClass: 'text-purple-700',
    iconClass: 'text-purple-600',
  },
  {
    status: 'cleaning',
    label: 'Mark Cleaning',
    icon: Sparkles,
    color: 'yellow',
    bgClass: 'bg-yellow-50 hover:bg-yellow-100',
    textClass: 'text-yellow-700',
    iconClass: 'text-yellow-600',
  },
  {
    status: 'out-of-service',
    label: 'Mark Out of Service',
    icon: AlertCircle,
    color: 'red',
    bgClass: 'bg-red-50 hover:bg-red-100',
    textClass: 'text-red-700',
    iconClass: 'text-red-600',
  },
];

export const TableQuickActions = ({ table, onClose }) => {
  const { updateStatus } = useTables();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    if (table.status === newStatus) {
      onClose?.();
      return;
    }

    setIsUpdating(true);
    try {
      await updateStatus({
        tableId: table.id,
        status: newStatus,
      });
      onClose?.();
    } catch (error) {
      console.error('Failed to update table status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Change Table Status
            </h3>
            <p className="text-sm text-gray-500 mt-1">Table {table.number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isUpdating}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4">
          <div className="space-y-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              const isCurrentStatus = table.status === action.status;

              return (
                <button
                  key={action.status}
                  onClick={() => handleStatusChange(action.status)}
                  disabled={isUpdating || isCurrentStatus}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg transition-all
                    ${action.bgClass} ${action.textClass}
                    ${isCurrentStatus ? 'ring-2 ring-offset-1 ring-current opacity-75' : ''}
                    ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    disabled:cursor-not-allowed
                  `}
                >
                  <Icon className={`w-5 h-5 ${action.iconClass}`} />
                  <span className="font-medium">{action.label}</span>
                  {isCurrentStatus && (
                    <span className="ml-auto text-xs font-medium">Current</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableQuickActions;
