import React, { useState } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, X, MessageSquare, Users, ChefHat, Edit2 } from 'lucide-react';
import { usePos } from '../hooks/usePos';
import { formatCurrency } from '../utils/calculations';
import { useStore } from '../../../store';
import { useBusinessType } from '../../../hooks/useBusinessType';

/**
 * Cart Component
 * Displays cart items and summary
 * @returns {JSX.Element}
 */
export const Cart = () => {
  const {
    cartItems,
    handleRemoveFromCart,
    handleUpdateQuantity,
    handleClearCart,
    getCartTotals,
    getCartItemCount,
    discountPercentage,
    updateDiscountPercentage,
  } = usePos();

  const updateItemInstructions = useStore((state) => state.updateItemInstructions);
  const updateItemCourse = useStore((state) => state.updateItemCourse);
  const updateItemSeat = useStore((state) => state.updateItemSeat);
  const getTipAmount = useStore((state) => state.getTipAmount);
  const { isRestaurant } = useBusinessType();

  const [editingInstructions, setEditingInstructions] = useState(null);
  const [instructionsText, setInstructionsText] = useState('');

  const totals = getCartTotals();
  const itemCount = getCartItemCount();
  const tipAmount = getTipAmount();

  const handleQuantityChange = (cartItemId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      handleUpdateQuantity(cartItemId, newQuantity);
    }
  };

  const handleEditInstructions = (item) => {
    setEditingInstructions(item.id);
    setInstructionsText(item.specialInstructions || '');
  };

  const handleSaveInstructions = (itemId) => {
    updateItemInstructions(itemId, instructionsText);
    setEditingInstructions(null);
    setInstructionsText('');
  };

  const courses = {
    1: 'Appetizer',
    2: 'Soup/Salad',
    3: 'Main',
    4: 'Dessert',
    5: 'Beverage',
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h2>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <ShoppingCart className="h-16 w-16 mb-4" />
            <p className="text-lg font-medium">Cart is empty</p>
            <p className="text-sm">Add products to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200"
              >
                {/* Item Header */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500">{item.category}</p>

                    {/* Restaurant-specific badges - Only show for restaurant business type */}
                    {isRestaurant && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {item.course && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                            <ChefHat className="h-3 w-3" />
                            {courses[item.course]}
                          </span>
                        )}
                        {item.seatNumber && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                            <Users className="h-3 w-3" />
                            Seat {item.seatNumber}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Modifiers */}
                    {item.modifiers && item.modifiers.length > 0 && (
                      <div className="mt-2 space-y-0.5">
                        {item.modifiers.map((modifier, idx) => (
                          <div key={idx} className="text-xs text-gray-600 flex items-center justify-between">
                            <span>+ {modifier.name}</span>
                            {modifier.price > 0 && (
                              <span className="text-gray-500">
                                +{formatCurrency(modifier.price)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Special Instructions */}
                    {editingInstructions === item.id ? (
                      <div className="mt-2">
                        <textarea
                          value={instructionsText}
                          onChange={(e) => setInstructionsText(e.target.value)}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-transparent"
                          rows={2}
                          placeholder="Special instructions..."
                        />
                        <div className="flex gap-1 mt-1">
                          <button
                            onClick={() => handleSaveInstructions(item.id)}
                            className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingInstructions(null)}
                            className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : item.specialInstructions ? (
                      <div className="mt-2 flex items-start gap-1">
                        <MessageSquare className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-gray-600 flex-1">
                          {item.specialInstructions}
                        </p>
                        <button
                          onClick={() => handleEditInstructions(item)}
                          className="text-orange-500 hover:text-orange-700"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditInstructions(item)}
                        className="mt-1 text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1"
                      >
                        <MessageSquare className="h-3 w-3" />
                        Add instructions
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Quantity and Price */}
                <div className="flex justify-between items-center mt-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {formatCurrency(item.price)} × {item.quantity}
                    </div>
                    <div className="font-bold text-gray-900">
                      {formatCurrency(item.subtotal)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Section */}
      {cartItems.length > 0 && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {/* Discount Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={discountPercentage}
              onChange={(e) =>
                updateDiscountPercentage(parseFloat(e.target.value) || 0)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(totals.subtotal)}
              </span>
            </div>

            {totals.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Discount ({discountPercentage}%):
                </span>
                <span className="font-medium text-red-600">
                  -{formatCurrency(totals.discount)}
                </span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (GST):</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(totals.tax)}
              </span>
            </div>

            {tipAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tip:</span>
                <span className="font-medium text-pink-600">
                  {formatCurrency(tipAmount)}
                </span>
              </div>
            )}

            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totals.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
