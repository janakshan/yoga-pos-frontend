/**
 * Modifier Group Form
 * Form for creating and editing modifier groups
 */

import { useState, useEffect } from 'react';
import { useStore } from '../../../../store';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';
import {
  MODIFIER_SELECTION_TYPES,
  MODIFIER_STATUSES,
  SELECTION_TYPE_LABELS,
  MODIFIER_STATUS_LABELS
} from '../../types/modifier.types';

export default function ModifierGroupForm({ group, onClose }) {
  const { createModifierGroup, updateModifierGroup } = useStore();
  const isEditing = !!group;

  const [formData, setFormData] = useState({
    name: group?.name || '',
    description: group?.description || '',
    selectionType: group?.selectionType || 'single',
    required: group?.required ?? false,
    minSelections: group?.minSelections ?? 0,
    maxSelections: group?.maxSelections ?? 1,
    status: group?.status || 'active',
    displayOrder: group?.displayOrder ?? 0,
    showInKDS: group?.showInKDS ?? true,
    options: group?.options || []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update max selections when selection type changes
  useEffect(() => {
    if (formData.selectionType === 'single' && formData.maxSelections !== 1) {
      setFormData(prev => ({ ...prev, maxSelections: 1 }));
    }
  }, [formData.selectionType]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [
        ...prev.options,
        {
          id: `temp_${Date.now()}`,
          name: '',
          price: 0,
          isDefault: prev.options.length === 0,
          isAvailable: true,
          displayOrder: prev.options.length
        }
      ]
    }));
  };

  const handleUpdateOption = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      )
    }));
  };

  const handleRemoveOption = (index) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.options.length === 0) {
      newErrors.options = 'At least one option is required';
    }

    const emptyOptions = formData.options.filter(opt => !opt.name.trim());
    if (emptyOptions.length > 0) {
      newErrors.options = 'All options must have a name';
    }

    if (formData.minSelections < 0) {
      newErrors.minSelections = 'Minimum selections cannot be negative';
    }

    if (formData.maxSelections < 1) {
      newErrors.maxSelections = 'Maximum selections must be at least 1';
    }

    if (formData.minSelections > formData.maxSelections) {
      newErrors.minSelections = 'Minimum selections cannot exceed maximum selections';
    }

    if (formData.required && formData.minSelections === 0) {
      newErrors.minSelections = 'Required groups must have minimum selections > 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        minSelections: Number(formData.minSelections),
        maxSelections: Number(formData.maxSelections),
        displayOrder: Number(formData.displayOrder)
      };

      if (isEditing) {
        await updateModifierGroup(group.id, submitData);
      } else {
        await createModifierGroup(submitData);
      }

      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Modifier Group' : 'Create Modifier Group'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Size, Toppings, Temperature"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Object.entries(MODIFIER_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Optional description for this modifier group"
              />
            </div>

            {/* Selection Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selection Type
                </label>
                <select
                  value={formData.selectionType}
                  onChange={(e) => handleChange('selectionType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Object.entries(SELECTION_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  {formData.selectionType === 'single'
                    ? 'Customer can select only one option'
                    : 'Customer can select multiple options'}
                </p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.required}
                    onChange={(e) => handleChange('required', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Required Selection
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Selections
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.minSelections}
                  onChange={(e) => handleChange('minSelections', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.minSelections ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.minSelections && (
                  <p className="mt-1 text-sm text-red-600">{errors.minSelections}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Selections
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxSelections}
                  onChange={(e) => handleChange('maxSelections', e.target.value)}
                  disabled={formData.selectionType === 'single'}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    formData.selectionType === 'single' ? 'bg-gray-100' : ''
                  } ${errors.maxSelections ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.maxSelections && (
                  <p className="mt-1 text-sm text-red-600">{errors.maxSelections}</p>
                )}
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showInKDS}
                  onChange={(e) => handleChange('showInKDS', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Show in Kitchen Display System
                </span>
              </label>
            </div>

            {/* Options */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Options *
                </label>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Option
                </button>
              </div>

              {errors.options && (
                <p className="mb-2 text-sm text-red-600">{errors.options}</p>
              )}

              <div className="space-y-3">
                {formData.options.map((option, index) => (
                  <div
                    key={option.id}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="cursor-move pt-2">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          value={option.name}
                          onChange={(e) =>
                            handleUpdateOption(index, 'name', e.target.value)
                          }
                          placeholder="Option name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={option.price}
                          onChange={(e) =>
                            handleUpdateOption(index, 'price', parseFloat(e.target.value) || 0)
                          }
                          placeholder="Price"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={option.isDefault}
                            onChange={(e) =>
                              handleUpdateOption(index, 'isDefault', e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-1.5 text-sm text-gray-700">Default</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={option.isAvailable}
                            onChange={(e) =>
                              handleUpdateOption(index, 'isAvailable', e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-1.5 text-sm text-gray-700">Available</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {formData.options.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No options added yet. Click "Add Option" to get started.
                  </div>
                )}
              </div>
            </div>

            {errors.submit && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {errors.submit}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Group' : 'Create Group'}
          </button>
        </div>
      </div>
    </div>
  );
}
