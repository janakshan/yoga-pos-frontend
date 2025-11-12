import React, { useState } from 'react';
import { X, Plus, Check, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import toast from 'react-hot-toast';

/**
 * ModifierSelectorModal Component
 * Allows selecting modifiers/add-ons for menu items
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Close modal callback
 * @param {Object} product - Product/menu item to add modifiers to
 * @param {Array} modifierGroups - Available modifier groups
 * @param {Function} onConfirm - Callback when modifiers are confirmed
 * @returns {JSX.Element}
 */
export const ModifierSelectorModal = ({
  isOpen,
  onClose,
  product,
  modifierGroups = [],
  onConfirm,
}) => {
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [seatNumber, setSeatNumber] = useState('');
  const [course, setCourse] = useState(product?.courseOrder || null);

  if (!isOpen || !product) return null;

  // Filter modifier groups relevant to this product
  const relevantGroups = modifierGroups.filter((group) =>
    product.modifierGroupIds?.includes(group.id)
  );

  const handleModifierToggle = (group, modifier) => {
    const existingIndex = selectedModifiers.findIndex(
      (m) => m.groupId === group.id && m.id === modifier.id
    );

    if (existingIndex >= 0) {
      // Remove modifier
      setSelectedModifiers(selectedModifiers.filter((_, i) => i !== existingIndex));
    } else {
      // Add modifier
      if (group.selectionType === 'single') {
        // Single selection - remove other modifiers from this group
        const filtered = selectedModifiers.filter((m) => m.groupId !== group.id);
        setSelectedModifiers([
          ...filtered,
          {
            ...modifier,
            groupId: group.id,
            groupName: group.name,
          },
        ]);
      } else {
        // Multiple selection - check max selection
        const groupCount = selectedModifiers.filter(
          (m) => m.groupId === group.id
        ).length;
        if (group.maxSelection && groupCount >= group.maxSelection) {
          toast.error(
            `Maximum ${group.maxSelection} selections allowed for ${group.name}`
          );
          return;
        }
        setSelectedModifiers([
          ...selectedModifiers,
          {
            ...modifier,
            groupId: group.id,
            groupName: group.name,
          },
        ]);
      }
    }
  };

  const isModifierSelected = (groupId, modifierId) => {
    return selectedModifiers.some(
      (m) => m.groupId === groupId && m.id === modifierId
    );
  };

  const validateSelection = () => {
    for (const group of relevantGroups) {
      const selectedInGroup = selectedModifiers.filter(
        (m) => m.groupId === group.id
      ).length;

      if (group.isRequired && selectedInGroup < (group.minSelection || 1)) {
        toast.error(`Please select at least ${group.minSelection || 1} from ${group.name}`);
        return false;
      }
    }
    return true;
  };

  const calculateTotal = () => {
    const modifiersTotal = selectedModifiers.reduce(
      (sum, mod) => sum + (mod.price || 0),
      0
    );
    return (product.price + modifiersTotal) * quantity;
  };

  const handleConfirm = () => {
    if (!validateSelection()) {
      return;
    }

    const productWithModifiers = {
      ...product,
      modifiers: selectedModifiers,
      quantity,
      specialInstructions,
      seatNumber: seatNumber || null,
      courseOrder: course,
    };

    onConfirm(productWithModifiers);
    onClose();
    toast.success('Added to cart');
  };

  const courses = [
    { value: 1, label: 'Appetizer' },
    { value: 2, label: 'Soup/Salad' },
    { value: 3, label: 'Main Course' },
    { value: 4, label: 'Dessert' },
    { value: 5, label: 'Beverage' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="text-orange-100 text-sm">
            Base Price: {formatCurrency(product.price)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 font-bold text-gray-700"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 text-center px-3 py-2 border border-gray-300 rounded-lg font-semibold text-lg"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 font-bold text-gray-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Modifier Groups */}
          {relevantGroups.length > 0 ? (
            <div className="space-y-6 mb-6">
              {relevantGroups.map((group) => {
                const selectedInGroup = selectedModifiers.filter(
                  (m) => m.groupId === group.id
                ).length;

                return (
                  <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {group.name}
                          {group.isRequired && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {group.selectionType === 'single'
                            ? 'Select one'
                            : `Select up to ${group.maxSelection || 'multiple'}`}
                          {group.minSelection > 0 &&
                            ` (Min: ${group.minSelection})`}
                        </p>
                      </div>
                      {group.isRequired && selectedInGroup === 0 && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {group.modifiers?.map((modifier) => {
                        const isSelected = isModifierSelected(group.id, modifier.id);

                        return (
                          <button
                            key={modifier.id}
                            onClick={() => handleModifierToggle(group, modifier)}
                            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  isSelected
                                    ? 'border-orange-500 bg-orange-500'
                                    : 'border-gray-300'
                                }`}
                              >
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-gray-900">
                                  {modifier.name}
                                </div>
                                {modifier.description && (
                                  <div className="text-xs text-gray-500">
                                    {modifier.description}
                                  </div>
                                )}
                              </div>
                            </div>
                            {modifier.price > 0 && (
                              <div className="font-semibold text-gray-900">
                                +{formatCurrency(modifier.price)}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-6 mb-6">
              No modifiers available for this item
            </div>
          )}

          {/* Course Assignment */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course (Optional)
            </label>
            <select
              value={course || ''}
              onChange={(e) => setCourse(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">No specific course</option>
              {courses.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Seat Number */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Seat Number (Optional)
            </label>
            <input
              type="text"
              value={seatNumber}
              onChange={(e) => setSeatNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., 1, 2, A, B"
            />
          </div>

          {/* Special Instructions */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              placeholder="e.g., No onions, extra spicy, well done..."
            />
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Base Price:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(product.price)}
                </span>
              </div>
              {selectedModifiers.length > 0 && (
                <>
                  {selectedModifiers.map((mod, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">+ {mod.name}:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(mod.price || 0)}
                      </span>
                    </div>
                  ))}
                </>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium text-gray-900">× {quantity}</span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-orange-600">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add to Cart - {formatCurrency(calculateTotal())}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifierSelectorModal;
