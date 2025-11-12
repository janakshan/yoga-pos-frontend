/**
 * Modifier Group Selector
 * Component for selecting modifiers when adding items to orders
 */

import { useState, useEffect } from 'react';
import { useStore } from '../../../../store';
import { X, Check, AlertCircle } from 'lucide-react';
import modifierService from '../../services/modifierService';

export default function ModifierGroupSelector({
  product,
  orderItemId,
  onConfirm,
  onCancel
}) {
  const {
    modifierGroups,
    selectedModifiers,
    setSelectedModifiers,
    addSelectedModifier,
    removeSelectedModifier
  } = useStore();

  const [localSelections, setLocalSelections] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Get modifier groups for this product
  const productModifierGroups = modifierGroups.filter(
    group =>
      product.modifierGroupIds?.includes(group.id) && group.status === 'active'
  ).sort((a, b) => a.displayOrder - b.displayOrder);

  // Initialize with existing selections or defaults
  useEffect(() => {
    const existing = selectedModifiers[orderItemId] || [];
    if (existing.length > 0) {
      setLocalSelections(existing);
    } else {
      // Set default selections
      const defaults = [];
      productModifierGroups.forEach(group => {
        group.options.forEach(option => {
          if (option.isDefault && option.isAvailable) {
            defaults.push({
              modifierGroupId: group.id,
              modifierGroupName: group.name,
              optionId: option.id,
              optionName: option.name,
              price: option.price,
              quantity: 1
            });
          }
        });
      });
      setLocalSelections(defaults);
    }
  }, [orderItemId]);

  const handleOptionToggle = (group, option) => {
    if (!option.isAvailable) return;

    const existingIndex = localSelections.findIndex(
      s => s.modifierGroupId === group.id && s.optionId === option.id
    );

    if (existingIndex >= 0) {
      // Remove selection
      setLocalSelections(prev => prev.filter((_, i) => i !== existingIndex));
    } else {
      // Add selection
      const newSelection = {
        modifierGroupId: group.id,
        modifierGroupName: group.name,
        optionId: option.id,
        optionName: option.name,
        price: option.price,
        quantity: 1
      };

      if (group.selectionType === 'single') {
        // Replace existing selection for this group
        setLocalSelections(prev => [
          ...prev.filter(s => s.modifierGroupId !== group.id),
          newSelection
        ]);
      } else {
        // Check max selections
        const groupSelections = localSelections.filter(
          s => s.modifierGroupId === group.id
        );
        if (groupSelections.length >= group.maxSelections) {
          return; // Don't add if max reached
        }
        setLocalSelections(prev => [...prev, newSelection]);
      }
    }
  };

  const isOptionSelected = (groupId, optionId) => {
    return localSelections.some(
      s => s.modifierGroupId === groupId && s.optionId === optionId
    );
  };

  const getGroupSelectionCount = (groupId) => {
    return localSelections.filter(s => s.modifierGroupId === groupId).length;
  };

  const validateSelections = () => {
    const errors = [];

    productModifierGroups.forEach(group => {
      const validation = modifierService.validateModifierSelections(group, localSelections);
      if (!validation.valid) {
        errors.push(...validation.errors);
      }
    });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleConfirm = () => {
    if (!validateSelections()) {
      return;
    }

    // Update store with selections
    setSelectedModifiers(orderItemId, localSelections);

    // Call parent confirm handler
    onConfirm({
      modifiers: localSelections,
      specialInstructions,
      totalModifierPrice: modifierService.calculateModifierPrice(localSelections)
    });
  };

  const calculateTotal = () => {
    const modifierTotal = modifierService.calculateModifierPrice(localSelections);
    const basePrice = product.pricing?.retail || product.price || 0;
    return basePrice + modifierTotal;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
              <p className="text-gray-600 mt-1">Customize your selection</p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modifier Groups */}
        <div className="flex-1 overflow-y-auto p-6">
          {validationErrors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-red-900">Please review your selections:</h4>
                  <ul className="mt-2 space-y-1 text-sm text-red-700">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {productModifierGroups.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No customization options available for this item
            </div>
          ) : (
            <div className="space-y-6">
              {productModifierGroups.map((group) => (
                <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        {group.name}
                        {group.required && (
                          <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-800">
                            Required
                          </span>
                        )}
                      </h3>
                      {group.description && (
                        <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {group.selectionType === 'single'
                          ? 'Select one option'
                          : `Select ${group.minSelections}-${group.maxSelections} options`}
                      </p>
                    </div>
                    {group.selectionType === 'multiple' && (
                      <div className="text-sm text-gray-600">
                        {getGroupSelectionCount(group.id)} / {group.maxSelections} selected
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {group.options.map((option) => {
                      const isSelected = isOptionSelected(group.id, option.id);
                      const isDisabled = !option.isAvailable;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleOptionToggle(group, option)}
                          disabled={isDisabled}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50'
                              : isDisabled
                              ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600'
                                  : 'border-gray-300'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-gray-900">{option.name}</div>
                              {option.description && (
                                <div className="text-sm text-gray-600">{option.description}</div>
                              )}
                              {!option.isAvailable && (
                                <div className="text-sm text-red-600">Unavailable</div>
                              )}
                            </div>
                          </div>
                          <div className="font-semibold text-gray-900">
                            {option.price === 0 ? 'Free' : `+$${option.price.toFixed(2)}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Special Instructions */}
              {product.allowSpecialInstructions && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                    placeholder="Add any special requests or modifications..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-gray-900">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
