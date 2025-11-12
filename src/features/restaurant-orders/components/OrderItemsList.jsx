import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ITEM_STATUS } from '../types/order.types';

const ITEM_STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  served: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800'
};

/**
 * Order Items List Component
 * Displays list of items in an order with controls
 */
export const OrderItemsList = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateItem,
  readOnly = false,
  showStatus = false
}) => {
  const calculateItemTotal = (item) => {
    const baseTotal = item.quantity * item.price;
    const modifiersTotal = (item.modifiers || []).reduce(
      (sum, mod) => sum + mod.price * item.quantity,
      0
    );
    return baseTotal + modifiersTotal;
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const itemTotal = calculateItemTotal(item);

        return (
          <div
            key={item.id}
            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
          >
            {/* Item Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {item.name}
                  </h4>

                  {/* Modifiers */}
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div className="mt-1 text-xs text-gray-600">
                      {item.modifiers.map((mod, idx) => (
                        <span key={mod.id || idx}>
                          + {mod.name}
                          {mod.price > 0 && ` (+$${mod.price.toFixed(2)})`}
                          {idx < item.modifiers.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Item Notes */}
                  {item.notes && (
                    <div className="mt-1 text-xs text-gray-500 italic">
                      Note: {item.notes}
                    </div>
                  )}

                  {/* Item Status */}
                  {showStatus && item.status && (
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
                          ITEM_STATUS_COLORS[item.status] || ITEM_STATUS_COLORS.pending
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  )}

                  {/* Station Info */}
                  {item.stationName && (
                    <div className="mt-1 text-xs text-gray-500">
                      Station: {item.stationName}
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold text-gray-900">
                    ${itemTotal.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    ${item.price.toFixed(2)} each
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Controls */}
            {!readOnly && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  title="Decrease quantity"
                >
                  <MinusIcon className="w-5 h-5" />
                </button>

                <span className="w-8 text-center font-semibold text-gray-900">
                  {item.quantity}
                </span>

                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  title="Increase quantity"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="ml-2 p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                  title="Remove item"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Read-only quantity display */}
            {readOnly && (
              <div className="flex-shrink-0 px-4 py-2 bg-gray-100 rounded font-semibold text-gray-900">
                ×{item.quantity}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderItemsList;
