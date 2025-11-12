import React, { useEffect, useState } from 'react';
import { RotateCcw, Clock, ShoppingCart, X } from 'lucide-react';
import { usePos } from '../hooks/usePos';
import { useStore } from '../../../store';
import { formatCurrency } from '../utils/calculations';
import toast from 'react-hot-toast';

/**
 * QuickReorder Component
 * Allows quick reordering from recent orders/transactions
 * @returns {JSX.Element}
 */
export const QuickReorder = () => {
  const { fetchTodaysTransactions } = usePos();
  const addToCart = useStore((state) => state.addToCart);

  const [recentOrders, setRecentOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRecentOrders();
    }
  }, [isOpen]);

  const loadRecentOrders = async () => {
    try {
      setIsLoading(true);
      const orders = await fetchTodaysTransactions();
      // Get unique orders by grouping similar items
      const uniqueOrders = orders.slice(0, 10); // Last 10 orders
      setRecentOrders(uniqueOrders);
    } catch (error) {
      console.error('Failed to load recent orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReorder = (order) => {
    // Add all items from the order to cart
    order.items?.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addToCart({
          id: item.productId || item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          modifiers: item.modifiers || [],
          specialInstructions: item.notes || '',
          courseOrder: item.course,
          seatNumber: item.seatNumber,
        });
      }
    });

    toast.success(`Added ${order.items?.length || 0} items to cart`);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
      >
        <RotateCcw className="h-5 w-5" />
        <span className="hidden sm:inline font-semibold">Quick Re-order</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RotateCcw className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Quick Re-order</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-blue-100 mt-2">Select a recent order to re-add items to cart</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <Clock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p>No recent orders found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-bold text-gray-900">
                        {order.transactionNumber || order.orderNumber}
                      </div>
                      <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                      {order.customerName && (
                        <div className="text-sm text-gray-600 mt-1">
                          Customer: {order.customerName}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">
                        {formatCurrency(order.total)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-1 mb-3">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-600 flex items-center justify-between">
                        <span>
                          {item.quantity}× {item.name}
                        </span>
                        <span className="text-gray-500">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Re-order Button */}
                  <button
                    onClick={() => handleReorder(order)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickReorder;
