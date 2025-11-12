/**
 * Product Modal Component
 *
 * Shows product details and allows modifier selection
 */

import { useState, useEffect } from 'react';
import { XMarkIcon, MinusIcon, PlusIcon, FireIcon, LeafIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store';
import { createCartItem } from '../../types/qr.types';
import toast from 'react-hot-toast';

const ProductModal = ({ product, isOpen, onClose }) => {
  const { addItemToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setQuantity(1);
      setSelectedModifiers([]);
      setSpecialInstructions('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleModifierChange = (groupId, groupName, option, isSelected) => {
    setSelectedModifiers(prev => {
      const existingGroup = prev.find(m => m.groupId === groupId);

      if (existingGroup) {
        // Update existing group
        const updatedGroups = prev.map(m => {
          if (m.groupId === groupId) {
            const selections = isSelected
              ? [...m.selections, option]
              : m.selections.filter(s => s.id !== option.id);

            return {
              ...m,
              selections
            };
          }
          return m;
        }).filter(m => m.selections.length > 0);

        return updatedGroups;
      } else {
        // Add new group
        if (isSelected) {
          return [...prev, {
            groupId,
            groupName,
            selections: [option]
          }];
        }
        return prev;
      }
    });
  };

  const isModifierSelected = (groupId, optionId) => {
    const group = selectedModifiers.find(m => m.groupId === groupId);
    return group?.selections.some(s => s.id === optionId) || false;
  };

  const calculateTotal = () => {
    let total = product.price * quantity;

    // Add modifier prices
    selectedModifiers.forEach(group => {
      group.selections.forEach(selection => {
        total += (selection.price || 0) * quantity;
      });
    });

    return total;
  };

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      const itemSubtotal = calculateTotal();

      const cartItem = createCartItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        modifiers: selectedModifiers,
        specialInstructions,
        subtotal: itemSubtotal,
        imageUrl: product.image
      });

      await addItemToCart(cartItem);
      toast.success(`${product.name} added to cart!`);
      onClose();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const total = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-lg max-h-[90vh] overflow-y-auto">
        {/* Product Image */}
        <div className="relative h-64 sm:h-80 bg-gray-200">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-8xl">
              🍽️
            </div>
          )}

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100"
          >
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          </button>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {product.isSpicy && (
              <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full flex items-center">
                <FireIcon className="h-4 w-4 mr-1" />
                Spicy
              </span>
            )}
            {product.isVegetarian && (
              <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full flex items-center">
                <LeafIcon className="h-4 w-4 mr-1" />
                Vegetarian
              </span>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Price */}
          <div className="mb-6">
            <p className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>
          </div>

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm font-medium text-orange-800 mb-1">
                ⚠️ Allergen Information
              </p>
              <p className="text-sm text-orange-700">
                Contains: {product.allergens.join(', ')}
              </p>
            </div>
          )}

          {/* Nutritional Info */}
          {product.nutritionalInfo && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-800 mb-2">Nutritional Information</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                {product.nutritionalInfo.calories && (
                  <div>Calories: {product.nutritionalInfo.calories} kcal</div>
                )}
                {product.nutritionalInfo.protein && (
                  <div>Protein: {product.nutritionalInfo.protein}g</div>
                )}
                {product.nutritionalInfo.carbs && (
                  <div>Carbs: {product.nutritionalInfo.carbs}g</div>
                )}
                {product.nutritionalInfo.fat && (
                  <div>Fat: {product.nutritionalInfo.fat}g</div>
                )}
              </div>
            </div>
          )}

          {/* Modifiers */}
          {product.modifiers && product.modifiers.length > 0 && (
            <div className="mb-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Customize Your Order</h3>

              {product.modifiers.map(group => (
                <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900">{group.name}</h4>
                    {group.required && (
                      <span className="text-sm text-red-600">Required</span>
                    )}
                    {group.maxSelections > 0 && (
                      <span className="text-sm text-gray-500 ml-2">
                        (Choose up to {group.maxSelections})
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {group.options.map(option => {
                      const isSelected = isModifierSelected(group.id, option.id);
                      return (
                        <label
                          key={option.id}
                          className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <input
                              type={group.maxSelections === 1 ? 'radio' : 'checkbox'}
                              name={group.maxSelections === 1 ? group.id : undefined}
                              checked={isSelected}
                              onChange={(e) => handleModifierChange(
                                group.id,
                                group.name,
                                option,
                                e.target.checked
                              )}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <span className="ml-3 text-gray-900">{option.name}</span>
                          </div>
                          {option.price > 0 && (
                            <span className="text-sm text-gray-600">
                              +${option.price.toFixed(2)}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Special Instructions */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Special Instructions
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows="3"
              placeholder="Any special requests? (e.g., no onions, extra spicy)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
                disabled={quantity <= 1}
              >
                <MinusIcon className="h-5 w-5 text-gray-600" />
              </button>
              <span className="px-6 text-lg font-semibold text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <PlusIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={loading || !product.isAvailable}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Adding...'
              ) : (
                <>
                  Add to Cart - ${total.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
