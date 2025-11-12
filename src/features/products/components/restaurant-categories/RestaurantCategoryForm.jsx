/**
 * Restaurant Category Form
 * Form for creating and editing restaurant categories
 */

import { useState } from 'react';
import { useStore } from '../../../../store';
import { X } from 'lucide-react';
import {
  RESTAURANT_CATEGORY_TYPES,
  CATEGORY_STATUSES,
  KDS_STATIONS,
  RESTAURANT_CATEGORY_LABELS,
  CATEGORY_STATUS_LABELS,
  KDS_STATION_LABELS,
  CATEGORY_COLORS
} from '../../types/restaurant-category.types';

export default function RestaurantCategoryForm({ category, onClose }) {
  const { createRestaurantCategory, updateRestaurantCategory } = useStore();
  const isEditing = !!category;

  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    type: category?.type || 'main_course',
    status: category?.status || 'active',
    color: category?.color || CATEGORY_COLORS.main_course,
    icon: category?.icon || '🍽️',
    displayOrder: category?.displayOrder ?? 0,
    showInMenu: category?.showInMenu ?? true,
    showInPOS: category?.showInPOS ?? true,
    showInKDS: category?.showInKDS ?? true,
    kdsStation: category?.kdsStation || ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }

    // Auto-update color when type changes
    if (field === 'type' && !isEditing) {
      setFormData(prev => ({
        ...prev,
        color: CATEGORY_COLORS[value] || prev.color
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    if (!formData.color) {
      newErrors.color = 'Color is required';
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
        displayOrder: Number(formData.displayOrder)
      };

      if (isEditing) {
        await updateRestaurantCategory(category.id, submitData);
      } else {
        await createRestaurantCategory(submitData);
      }

      onClose();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const commonEmojis = ['🍽️', '🥗', '🍲', '🍰', '☕', '🥤', '🍕', '🍔', '🍗', '🥟', '🍜', '🍱'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Category' : 'Create Category'}
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
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Appetizers, Main Courses"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Object.entries(RESTAURANT_CATEGORY_LABELS).map(([value, label]) => (
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
                placeholder="Optional description for this category"
              />
            </div>

            {/* Visual Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {commonEmojis.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleChange('icon', emoji)}
                      className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
                        formData.icon === emoji
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => handleChange('icon', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Or enter custom emoji/text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color *
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="w-full h-12 px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Status and Display Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Object.entries(CATEGORY_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={(e) => handleChange('displayOrder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Kitchen Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                KDS Station
              </label>
              <select
                value={formData.kdsStation}
                onChange={(e) => handleChange('kdsStation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">No Preferred Station</option>
                {Object.entries(KDS_STATION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Visibility Settings */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Show In
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showInMenu}
                  onChange={(e) => handleChange('showInMenu', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Customer Menu</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showInPOS}
                  onChange={(e) => handleChange('showInPOS', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">POS System</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showInKDS}
                  onChange={(e) => handleChange('showInKDS', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Kitchen Display System</span>
              </label>
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
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </div>
    </div>
  );
}
