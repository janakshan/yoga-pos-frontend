import React, { useState, useEffect } from 'react';
import { Pause, Play, Trash2, ShoppingCart, Clock } from 'lucide-react';
import { useStore } from '../../../store/index.js';
import { formatCurrency } from '../utils/calculations';
import toast from 'react-hot-toast';

/**
 * HoldSales Component
 * Manage parked/held sales for later completion
 * @returns {JSX.Element}
 */
export const HoldSales = () => {
  const [holdSales, setHoldSales] = useState([]);
  const cartItems = useStore((state) => state.cartItems);
  const discountPercentage = useStore((state) => state.discountPercentage);
  const selectedCustomerId = useStore((state) => state.selectedCustomerId);
  const customerInfo = useStore((state) => state.customerInfo);
  const notes = useStore((state) => state.notes);
  const clearCart = useStore((state) => state.clearCart);
  const setCartItems = useStore((state) => state.addToCart);
  const setDiscountPercentage = useStore((state) => state.setDiscountPercentage);
  const setSelectedCustomerId = useStore((state) => state.setSelectedCustomerId);
  const setCustomerInfo = useStore((state) => state.setCustomerInfo);
  const setNotes = useStore((state) => state.setNotes);

  // Load held sales from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('holdSales');
    if (saved) {
      try {
        setHoldSales(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load held sales:', e);
      }
    }
  }, []);

  // Save held sales to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('holdSales', JSON.stringify(holdSales));
  }, [holdSales]);

  /**
   * Hold current sale
   */
  const handleHoldSale = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const holdSale = {
      id: `hold-${Date.now()}`,
      cartItems: [...cartItems],
      discountPercentage,
      selectedCustomerId,
      customerInfo: { ...customerInfo },
      notes,
      timestamp: new Date().toISOString(),
    };

    setHoldSales([...holdSales, holdSale]);
    clearCart();
    toast.success('Sale held successfully');
  };

  /**
   * Resume a held sale
   * @param {Object} sale
   */
  const handleResumeSale = (sale) => {
    // Clear current cart first
    clearCart();

    // Restore cart items by adding them one by one
    sale.cartItems.forEach((item) => {
      // Need to reconstruct the product object
      const product = {
        id: item.productId,
        name: item.name,
        price: item.price,
        category: item.category,
        stockQuantity: item.stock,
      };

      for (let i = 0; i < item.quantity; i++) {
        setCartItems(product);
      }
    });

    // Restore other state
    setDiscountPercentage(sale.discountPercentage);
    setSelectedCustomerId(sale.selectedCustomerId);
    setCustomerInfo(sale.customerInfo);
    setNotes(sale.notes);

    // Remove from held sales
    setHoldSales(holdSales.filter((s) => s.id !== sale.id));
    toast.success('Sale resumed');
  };

  /**
   * Delete a held sale
   * @param {string} saleId
   */
  const handleDeleteSale = (saleId) => {
    setHoldSales(holdSales.filter((s) => s.id !== saleId));
    toast.success('Held sale deleted');
  };

  /**
   * Calculate sale total
   * @param {Object} sale
   */
  const calculateSaleTotal = (sale) => {
    const subtotal = sale.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = subtotal * (sale.discountPercentage / 100);
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * 0.18; // 18% GST
    return subtotal - discount + tax;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Pause className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Held Sales ({holdSales.length})
          </h2>
        </div>
        <button
          onClick={handleHoldSale}
          disabled={cartItems.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Pause className="h-4 w-4" />
          Hold Current Sale
        </button>
      </div>

      {holdSales.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No held sales</p>
          <p className="text-gray-400 text-sm mt-2">
            Park current sale to retrieve it later
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {holdSales.map((sale) => {
            const total = calculateSaleTotal(sale);
            const itemCount = sale.cartItems.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div
                key={sale.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Sale Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {new Date(sale.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <div className="mb-2">
                      <div className="font-semibold text-gray-900">
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </div>
                      {sale.customerInfo.name && (
                        <div className="text-sm text-gray-600">
                          Customer: {sale.customerInfo.name}
                        </div>
                      )}
                      {sale.notes && (
                        <div className="text-sm text-gray-500 italic mt-1">
                          {sale.notes}
                        </div>
                      )}
                    </div>

                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(total)}
                    </div>

                    {/* Items Preview */}
                    <div className="mt-3 space-y-1">
                      {sale.cartItems.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="text-xs text-gray-600">
                          {item.quantity}× {item.name}
                        </div>
                      ))}
                      {sale.cartItems.length > 3 && (
                        <div className="text-xs text-gray-400 italic">
                          +{sale.cartItems.length - 3} more items
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleResumeSale(sale)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      Resume
                    </button>
                    <button
                      onClick={() => handleDeleteSale(sale.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HoldSales;
