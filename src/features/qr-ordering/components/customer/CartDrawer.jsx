/**
 * Cart Drawer Component
 *
 * Sliding drawer for viewing and managing cart
 */

import { useState } from 'react';
import {
  XMarkIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useStore } from '@/store';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { qrOrdering, removeItemFromCart, updateItemQuantity, clearCustomerCart } = useStore();
  const cart = qrOrdering.customerCart;
  const [loading, setLoading] = useState(false);

  const handleRemoveItem = async (itemId) => {
    try {
      await removeItemFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      await updateItemQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) {
      return;
    }

    try {
      await clearCustomerCart();
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate('/qr/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <ShoppingBagIcon className="h-6 w-6 mr-2" />
            Your Cart ({cart.totalItems})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingBagIcon className="h-24 w-24 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm">Add some delicious items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  {/* Item Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Modifiers */}
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div className="mb-2 space-y-1">
                      {item.modifiers.map((modifier, idx) => (
                        <div key={idx} className="text-xs text-gray-600">
                          <span className="font-medium">{modifier.groupName}:</span>{' '}
                          {modifier.selections.map(s => s.name).join(', ')}
                          {modifier.selections.some(s => s.price > 0) && (
                            <span className="ml-1">
                              (+${modifier.selections.reduce((sum, s) => sum + (s.price || 0), 0).toFixed(2)})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Special Instructions */}
                  {item.specialInstructions && (
                    <div className="mb-2 text-xs text-gray-600 italic">
                      Note: {item.specialInstructions}
                    </div>
                  )}

                  {/* Quantity and Subtotal */}
                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <MinusIcon className="h-4 w-4 text-gray-600" />
                      </button>
                      <span className="px-4 font-semibold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <PlusIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <span className="font-bold text-gray-900">
                      ${item.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              {cart.items.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="w-full text-sm text-red-600 hover:text-red-700 py-2"
                >
                  Clear all items
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer - Order Summary */}
        {cart.items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            {/* Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${cart.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax</span>
                <span>${cart.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <p className="text-xs text-gray-500 text-center mt-2">
              Tax and service charges may apply
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
