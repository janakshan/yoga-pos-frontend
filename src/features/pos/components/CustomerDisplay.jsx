import React, { useEffect, useState } from 'react';
import { ShoppingBag, Package } from 'lucide-react';
import { usePos } from '../hooks/usePos';
import { formatCurrency } from '../utils/calculations';
import { useStorageSync } from '../../../hooks/useStorageSync';
import { useStore } from '../../../store';

/**
 * CustomerDisplay Component
 * Customer-facing display showing cart items and total
 * Designed to be displayed on a secondary monitor
 * @returns {JSX.Element}
 */
export const CustomerDisplay = () => {
  // Sync cart state across windows
  useStorageSync();

  const [isHydrated, setIsHydrated] = useState(false);

  // Force immediate state refresh on mount
  useEffect(() => {
    // Wait for store to hydrate from localStorage
    const checkHydration = () => {
      const stored = localStorage.getItem('yoga-pos-storage');
      if (stored) {
        try {
          const data = JSON.parse(stored);
          const currentState = useStore.getState();

          // Manually sync the state if needed
          if (data.state && Array.isArray(data.state.cartItems)) {
            useStore.setState({
              cartItems: data.state.cartItems,
              selectedCustomerId: data.state.selectedCustomerId || null,
              customerInfo: data.state.customerInfo || { name: '', email: '', phone: '' },
              paymentMethod: data.state.paymentMethod || 'cash',
              discountPercentage: data.state.discountPercentage || 0,
              taxPercentage: data.state.taxPercentage || 0,
              notes: data.state.notes || '',
            });
          }
        } catch (error) {
          console.error('Error loading customer display state:', error);
        }
      }
      setIsHydrated(true);
    };

    // Small delay to ensure localStorage is available
    const timer = setTimeout(checkHydration, 100);
    return () => clearTimeout(timer);
  }, []);

  const { cartItems, getCartTotals } = usePos();
  const totals = getCartTotals();

  // Show loading state while hydrating
  if (!isHydrated) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex items-center justify-center">
        <div className="text-white text-4xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 p-6 flex-shrink-0">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Yoga Wellness Studio
          </h1>
          <p className="text-2xl text-blue-100 font-semibold drop-shadow-md">Point of Sale</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6" style={{ minHeight: 0 }}>
        {cartItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-white">
            <ShoppingBag className="h-48 w-48 mb-8 opacity-50" strokeWidth={1.5} />
            <h2 className="text-5xl font-bold mb-4 drop-shadow-lg">Welcome!</h2>
            <p className="text-3xl font-medium drop-shadow-md" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Your items will appear here
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col" style={{ minHeight: 0 }}>
            {/* Items Header */}
            <div className="mb-4 flex-shrink-0">
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                Your Items ({cartItems.length})
              </h2>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2" style={{ minHeight: 0 }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-6 border-2 border-white border-opacity-30 shadow-xl"
                  style={{ minHeight: 'auto' }}
                >
                  <div className="flex items-start gap-6">
                    {/* Product Icon */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-white bg-opacity-30 rounded-xl flex items-center justify-center shadow-lg">
                        <Package className="h-12 w-12 text-white" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md" style={{ wordBreak: 'break-word' }}>
                        {item.name}
                      </h3>
                      <p className="text-xl font-semibold mb-3 drop-shadow-sm" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                        {item.category}
                      </p>
                      <div className="flex items-center gap-4 font-medium" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        <span className="text-xl drop-shadow-sm">
                          Qty: <span className="font-bold text-white text-2xl">{item.quantity}</span>
                        </span>
                        <span className="text-xl">×</span>
                        <span className="text-xl font-semibold drop-shadow-sm">{formatCurrency(item.price)}</span>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-4xl font-bold text-white drop-shadow-lg">
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
        <div className="bg-white bg-opacity-10 backdrop-blur-md border-t-2 border-white border-opacity-30 p-6 flex-shrink-0">
          <div className="space-y-3">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-2xl font-semibold" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              <span className="drop-shadow-sm">Subtotal:</span>
              <span className="font-bold text-white drop-shadow-md">
                {formatCurrency(totals.subtotal)}
              </span>
            </div>

            {/* Discount */}
            {totals.discount > 0 && (
              <div className="flex justify-between items-center text-2xl font-semibold text-green-300">
                <span className="drop-shadow-sm">Discount:</span>
                <span className="font-bold drop-shadow-md">
                  -{formatCurrency(totals.discount)}
                </span>
              </div>
            )}

            {/* Tax */}
            <div className="flex justify-between items-center text-2xl font-semibold" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              <span className="drop-shadow-sm">Tax (GST):</span>
              <span className="font-bold text-white drop-shadow-md">
                {formatCurrency(totals.tax)}
              </span>
            </div>

            {/* Divider */}
            <div className="border-t-4 border-white border-opacity-40 my-3"></div>

            {/* Total */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-4xl font-bold text-white drop-shadow-lg">TOTAL:</span>
              <span className="text-6xl font-bold text-white drop-shadow-lg">
                {formatCurrency(totals.total)}
              </span>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mt-4 text-center">
            <p className="text-2xl font-semibold italic drop-shadow-md" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Thank you for shopping with us!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDisplay;
