/**
 * BranchForm Component
 *
 * Form for creating and editing branches.
 */

import React from 'react';
import { useBranchForm } from '../hooks';
import { Loader2 } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Object} props.initialData - Initial form data (for editing)
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} props.isLoading - Loading state
 */
export const BranchForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    formData,
    errors,
    handleChange,
    handleNestedChange,
    handleBlur,
    handleSubmit,
    hasError,
    getError,
  } = useBranchForm(initialData);

  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Basic Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Branch Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasError('name') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Downtown Yoga Studio"
            />
            {hasError('name') && (
              <p className="mt-1 text-sm text-red-500">{getError('name')}</p>
            )}
          </div>

          {/* Branch Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => handleChange('code', e.target.value)}
              onBlur={() => handleBlur('code')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., BR001 (auto-generated if empty)"
            />
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Street Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              onBlur={() => handleBlur('address')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasError('address') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 123 Main Street"
            />
            {hasError('address') && (
              <p className="mt-1 text-sm text-red-500">
                {getError('address')}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasError('city') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., San Francisco"
            />
            {hasError('city') && (
              <p className="mt-1 text-sm text-red-500">{getError('city')}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              onBlur={() => handleBlur('state')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasError('state') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., CA"
            />
            {hasError('state') && (
              <p className="mt-1 text-sm text-red-500">{getError('state')}</p>
            )}
          </div>

          {/* ZIP Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              onBlur={() => handleBlur('zipCode')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasError('zipCode') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 94102"
            />
            {hasError('zipCode') && (
              <p className="mt-1 text-sm text-red-500">
                {getError('zipCode')}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., USA"
            />
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasError('phone') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., +1 (415) 555-0100"
            />
            {hasError('phone') && (
              <p className="mt-1 text-sm text-red-500">{getError('phone')}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasError('email') ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., downtown@yoga.com"
            />
            {hasError('email') && (
              <p className="mt-1 text-sm text-red-500">{getError('email')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              value={formData.settings?.timezone || 'America/Los_Angeles'}
              onChange={(e) =>
                handleNestedChange('settings', 'timezone', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/New_York">Eastern Time</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              value={formData.settings?.currency || 'USD'}
              onChange={(e) =>
                handleNestedChange('settings', 'currency', e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>

          {/* Tax Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={(formData.settings?.taxRate || 0) * 100}
              onChange={(e) =>
                handleNestedChange(
                  'settings',
                  'taxRate',
                  parseFloat(e.target.value) / 100
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 8.75"
            />
          </div>

          {/* Allow Walk-ins */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowWalkins"
              checked={formData.settings?.allowWalkins || false}
              onChange={(e) =>
                handleNestedChange('settings', 'allowWalkins', e.target.checked)
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="allowWalkins"
              className="ml-2 block text-sm text-gray-700"
            >
              Allow Walk-in Customers
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {isLoading && <Loader2 className="animate-spin" size={16} />}
          <span>{initialData ? 'Update' : 'Create'} Branch</span>
        </button>
      </div>
    </form>
  );
};
