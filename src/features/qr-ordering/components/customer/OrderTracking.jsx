/**
 * Order Tracking Component
 *
 * Real-time order status tracking for customers
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
  TruckIcon,
  HandThumbUpIcon,
  PhoneIcon,
  ReceiptPercentIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useStore } from '@/store';
import socketService from '../../services/socketService';
import toast from 'react-hot-toast';

const OrderTracking = () => {
  const navigate = useNavigate();
  const { qrOrdering, callServer, requestBill } = useStore();
  const session = qrOrdering.currentSession;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      navigate('/qr/menu');
      return;
    }

    // Load orders for this session
    loadOrders();

    // Subscribe to real-time order updates
    const unsubscribe = socketService.onOrderUpdate((updatedOrder) => {
      setOrders(prev =>
        prev.map(order =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      toast.success(`Order ${updatedOrder.id} status updated!`);
    });

    return () => {
      unsubscribe();
    };
  }, [session]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Mock orders data - in real app, fetch from API
      const mockOrders = session?.orderIds.map((id, index) => ({
        id,
        status: index === 0 ? 'preparing' : 'pending',
        items: qrOrdering.customerCart.items,
        total: qrOrdering.customerCart.total,
        placedAt: new Date(Date.now() - index * 300000),
        estimatedTime: 20 - index * 5
      })) || [];

      setOrders(mockOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCallServer = async () => {
    try {
      await callServer('Customer needs assistance');
      toast.success('Server has been notified!');
    } catch (error) {
      toast.error('Failed to call server');
    }
  };

  const handleRequestBill = async () => {
    try {
      await requestBill('Customer requests bill');
      toast.success('Bill request sent!');
    } catch (error) {
      toast.error('Failed to request bill');
    }
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: 'Order Received',
        icon: ClockIcon,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-500',
        description: 'Your order has been received and is waiting to be prepared'
      },
      confirmed: {
        label: 'Confirmed',
        icon: CheckCircleIcon,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
        description: 'Your order has been confirmed'
      },
      preparing: {
        label: 'Preparing',
        icon: FireIcon,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-500',
        description: 'Your food is being prepared'
      },
      ready: {
        label: 'Ready',
        icon: TruckIcon,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-500',
        description: 'Your order is ready to be served'
      },
      served: {
        label: 'Served',
        icon: HandThumbUpIcon,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-500',
        description: 'Your order has been served. Enjoy!'
      }
    };

    return statusMap[status] || statusMap.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/qr/menu')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Order Tracking</h1>
              <p className="text-sm text-gray-500">Table {session?.tableId}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-2">
            <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-green-900">Order Placed Successfully!</h2>
              <p className="text-sm text-green-700">
                Thank you for your order. We'll notify you when it's ready.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleCallServer}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <PhoneIcon className="h-8 w-8 text-indigo-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Call Server</span>
          </button>

          <button
            onClick={handleRequestBill}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <ReceiptPercentIcon className="h-8 w-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Request Bill</span>
          </button>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ClockIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Place your first order to start tracking</p>
            <button
              onClick={() => navigate('/qr/menu')}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const statusInfo = getStatusInfo(order.status);
              const Icon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {/* Order Header */}
                  <div className={`${statusInfo.bgColor} border-l-4 ${statusInfo.borderColor} p-4`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Icon className={`h-6 w-6 ${statusInfo.color} mr-2`} />
                        <span className={`font-semibold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600">
                        Order #{order.id.slice(0, 8)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{statusInfo.description}</p>

                    {order.status === 'preparing' && order.estimatedTime && (
                      <div className="mt-2 flex items-center text-sm text-gray-700">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        Estimated time: {order.estimatedTime} minutes
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex justify-between text-sm"
                        >
                          <div>
                            <span className="text-gray-900">
                              {item.quantity}x {item.name}
                            </span>
                            {item.modifiers && item.modifiers.length > 0 && (
                              <p className="text-xs text-gray-500">
                                {item.modifiers.map(m =>
                                  m.selections.map(s => s.name).join(', ')
                                ).join(' • ')}
                              </p>
                            )}
                          </div>
                          <span className="text-gray-600">
                            ${item.subtotal.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between font-semibold text-gray-900">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      Placed at {order.placedAt.toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {order.status !== 'served' && (
                    <div className="px-4 pb-4">
                      <div className="relative">
                        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                          <div
                            style={{
                              width: `${
                                order.status === 'pending' ? 25 :
                                order.status === 'confirmed' ? 50 :
                                order.status === 'preparing' ? 75 :
                                order.status === 'ready' ? 90 : 100
                              }%`
                            }}
                            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                              order.status === 'ready' ? 'bg-indigo-600' : 'bg-orange-500'
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Continue Ordering Button */}
        {orders.length > 0 && (
          <button
            onClick={() => navigate('/qr/menu')}
            className="w-full mt-6 bg-white border-2 border-indigo-600 text-indigo-600 py-3 px-6 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
          >
            Order More Items
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
