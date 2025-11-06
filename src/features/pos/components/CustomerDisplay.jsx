import React from 'react';
import { ShoppingBag, Package } from 'lucide-react';
import { usePos } from '../hooks/usePos';
import { formatCurrency } from '../utils/calculations';
import { useStorageSync } from '../../../hooks/useStorageSync';

/**
 * CustomerDisplay Component
 * Customer-facing display showing cart items and total
 * Designed to be displayed on a secondary monitor
 * @returns {JSX.Element}
 */
export const CustomerDisplay = () => {
  // Sync cart state across windows
  useStorageSync();

  const { cartItems, getCartTotals } = usePos();
  const totals = getCartTotals();

  return (
    <div className="h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex flex-col">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 p-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-2">
            Yoga Wellness Studio
          </h1>
          <p className="text-2xl text-blue-100">Point of Sale</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-8">
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white">
            <ShoppingBag className="h-48 w-48 mb-8 opacity-50" />
            <h2 className="text-5xl font-bold mb-4">Welcome!</h2>
            <p className="text-3xl opacity-75">Your items will appear here</p>
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {/* Items Header */}
            <div className="mb-6">
              <h2 className="text-4xl font-bold text-white">
                Your Items ({cartItems.length})
              </h2>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20"
                >
                  <div className="flex items-start gap-6">
                    {/* Product Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                        <Package className="h-12 w-12 text-white" />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-white mb-2 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xl text-blue-100 mb-3">
                        {item.category}
                      </p>
                      <div className="flex items-center gap-4 text-blue-100">
                        <span className="text-xl">
                          Qty: <span className="font-bold text-white">{item.quantity}</span>
                        </span>
                        <span className="text-xl">×</span>
                        <span className="text-xl">{formatCurrency(item.price)}</span>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-4xl font-bold text-white">
                        {formatCurrency(item.subtotal)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Total Footer */}
      {cartItems.length > 0 && (
        <div className="bg-white bg-opacity-10 backdrop-blur-md border-t border-white border-opacity-20 p-8">
          <div className="space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-2xl text-blue-100">
              <span>Subtotal:</span>
              <span className="font-semibold text-white">
                {formatCurrency(totals.subtotal)}
              </span>
            </div>

            {/* Discount */}
            {totals.discount > 0 && (
              <div className="flex justify-between items-center text-2xl text-green-300">
                <span>Discount:</span>
                <span className="font-semibold">
                  -{formatCurrency(totals.discount)}
                </span>
              </div>
            )}

            {/* Tax */}
            <div className="flex justify-between items-center text-2xl text-blue-100">
              <span>Tax (GST):</span>
              <span className="font-semibold text-white">
                {formatCurrency(totals.tax)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t-4 border-white border-opacity-30 my-4"></div>

            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="text-4xl font-bold text-white">TOTAL:</span>
              <span className="text-6xl font-bold text-white">
                {formatCurrency(totals.total)}
              </span>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mt-6 text-center">
            <p className="text-2xl text-blue-100 italic">
              Thank you for shopping with us!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDisplay;
