import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders } from '../../features/restaurant-orders/hooks/useOrders';
import { useStore } from '../../store';
import OrderStatusBadge from '../../features/restaurant-orders/components/OrderStatusBadge';
import OrderStatusUpdater from '../../features/restaurant-orders/components/OrderStatusUpdater';
import OrderItemsList from '../../features/restaurant-orders/components/OrderItemsList';
import { SERVICE_TYPE_LABELS } from '../../features/restaurant-orders/types/order.types';
import { getOrderAge, canModifyOrder, canCancelOrder } from '../../features/restaurant-orders/utils/orderWorkflow';
import {
  ArrowLeftIcon,
  PencilIcon,
  PrinterIcon,
  XMarkIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

/**
 * Order Details Page
 * Displays full details of a restaurant order
 */
export const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchOrder, currentOrder, cancelOrder, isLoading } = useOrders();
  const user = useStore((state) => state.user);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
  }, [orderId]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason');
      return;
    }

    try {
      await cancelOrder(
        currentOrder.id,
        user?.id || 'user_001',
        user?.name || 'Unknown User',
        cancelReason
      );
      setShowCancelDialog(false);
      toast.success('Order cancelled successfully');
    } catch (error) {
      toast.error(`Failed to cancel order: ${error.message}`);
    }
  };

  const handlePrint = () => {
    // TODO: Implement print functionality
    toast.success('Print functionality coming soon');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-600">Order not found</p>
          <Link
            to="/orders"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-900"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const order = currentOrder;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order {order.orderNumber}
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <OrderStatusBadge status={order.status} />
              <span className="flex items-center text-sm text-gray-500">
                <ClockIcon className="w-4 h-4 mr-1" />
                {getOrderAge(order.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {canModifyOrder(order.status) && (
            <button
              onClick={() => navigate(`/orders/${order.id}/edit`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PencilIcon className="w-5 h-5 mr-2" />
              Edit
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <PrinterIcon className="w-5 h-5 mr-2" />
            Print
          </button>

          {canCancelOrder(order.status) && (
            <button
              onClick={() => setShowCancelDialog(true)}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 mr-2" />
              Cancel Order
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items
            </h3>
            <OrderItemsList
              items={order.items}
              readOnly={true}
              showStatus={true}
            />
          </div>

          {/* Order Totals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Discount</span>
                  <span className="text-red-600">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              {order.tip > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Tip</span>
                  <span>${order.tip.toFixed(2)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Status History
              </h3>
              <div className="space-y-3">
                {order.statusHistory.map((history, index) => (
                  <div key={index} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 bg-blue-600 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <OrderStatusBadge status={history.status} size="sm" />
                        <span className="text-xs text-gray-500">
                          {new Date(history.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        By {history.userName}
                      </p>
                      {history.notes && (
                        <p className="text-sm text-gray-500 mt-1 italic">
                          {history.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white rounded-lg shadow p-6">
            <OrderStatusUpdater
              order={order}
              onStatusChanged={() => fetchOrder(orderId)}
            />
          </div>

          {/* Order Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Order Information
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Service Type</p>
                <p className="text-sm font-medium text-gray-900">
                  {SERVICE_TYPE_LABELS[order.serviceType]}
                </p>
              </div>

              {order.tableName && (
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Table</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.tableName}
                    </p>
                  </div>
                </div>
              )}

              {order.customer && (
                <div className="flex items-start gap-2">
                  <UserIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Customer</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.customer.name}
                    </p>
                    {order.customer.phone && (
                      <p className="text-sm text-gray-600">
                        {order.customer.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {order.assignedServerName && (
                <div>
                  <p className="text-sm text-gray-500">Server</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.assignedServerName}
                  </p>
                </div>
              )}

              {order.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-sm font-medium text-gray-900">
                    {order.notes}
                  </p>
                </div>
              )}

              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {order.completedAt && (
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(order.completedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          {order.payment && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Method</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {order.payment.method}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {order.payment.status}
                  </p>
                </div>
                {order.payment.transactionId && (
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.payment.transactionId}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Cancel Order
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cancellation Reason *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Please provide a reason for cancelling..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
