import React from 'react';
import { useCustomerForm } from '../hooks/useCustomerForm.js';
import {
  CUSTOMER_TYPES,
  CUSTOMER_STATUS,
  GENDER,
  CUSTOMER_TYPE_LABELS,
  STATUS_LABELS,
  GENDER_LABELS,
  INTEREST_CATEGORIES,
  INTEREST_LABELS,
} from '../types/customer.types.js';

export const CustomerForm = ({ initialData = null, onSubmit, onCancel, isLoading = false }) => {
  const {
    formData,
    handleChange,
    handleBlur,
    handleSubmit,
    hasError,
    getError,
    addInterest,
    removeInterest,
    addTag,
    removeTag,
  } = useCustomerForm(initialData);

  const isEditMode = !!initialData;

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      addTag(e.target.value.trim());
      e.target.value = '';
    }
  };

  const handleInterestToggle = (interest) => {
    if (formData.preferences.interests.includes(interest)) {
      removeInterest(interest);
    } else {
      addInterest(interest);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {isEditMode ? 'Edit Customer' : 'Create New Customer'}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isEditMode
            ? 'Update customer information below'
            : 'Fill in the customer information below'}
        </p>
      </div>

      {/* Personal Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Personal Information</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('firstName')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Enter first name"
            />
            {hasError('firstName') && (
              <p className="mt-1 text-sm text-red-600">{getError('firstName')}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('lastName')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="Enter last name"
            />
            {hasError('lastName') && (
              <p className="mt-1 text-sm text-red-600">{getError('lastName')}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('email') ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="customer@email.com"
            />
            {hasError('email') && (
              <p className="mt-1 text-sm text-red-600">{getError('email')}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('phone') ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="+1-555-0100"
            />
            {hasError('phone') && (
              <p className="mt-1 text-sm text-red-600">{getError('phone')}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              onBlur={() => handleBlur('dateOfBirth')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('dateOfBirth')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {hasError('dateOfBirth') && (
              <p className="mt-1 text-sm text-red-600">{getError('dateOfBirth')}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {Object.entries(GENDER).map(([key, value]) => (
                <option key={value} value={value}>
                  {GENDER_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Address</h4>

        <div className="grid grid-cols-1 gap-4">
          {/* Street */}
          <div>
            <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              type="text"
              id="address.street"
              value={formData.address.street}
              onChange={(e) => handleChange('address.street', e.target.value)}
              onBlur={() => handleBlur('address.street')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('address.street')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="123 Main Street"
            />
            {hasError('address.street') && (
              <p className="mt-1 text-sm text-red-600">{getError('address.street')}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <div>
              <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                id="address.city"
                value={formData.address.city}
                onChange={(e) => handleChange('address.city', e.target.value)}
                onBlur={() => handleBlur('address.city')}
                disabled={isLoading}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hasError('address.city')
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="San Francisco"
              />
              {hasError('address.city') && (
                <p className="mt-1 text-sm text-red-600">{getError('address.city')}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                State/Province
              </label>
              <input
                type="text"
                id="address.state"
                value={formData.address.state}
                onChange={(e) => handleChange('address.state', e.target.value)}
                onBlur={() => handleBlur('address.state')}
                disabled={isLoading}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hasError('address.state')
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="CA"
              />
              {hasError('address.state') && (
                <p className="mt-1 text-sm text-red-600">{getError('address.state')}</p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <label
                htmlFor="address.postalCode"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="address.postalCode"
                value={formData.address.postalCode}
                onChange={(e) => handleChange('address.postalCode', e.target.value)}
                onBlur={() => handleBlur('address.postalCode')}
                disabled={isLoading}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hasError('address.postalCode')
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="94102"
              />
              {hasError('address.postalCode') && (
                <p className="mt-1 text-sm text-red-600">{getError('address.postalCode')}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="address.country"
                value={formData.address.country}
                onChange={(e) => handleChange('address.country', e.target.value)}
                onBlur={() => handleBlur('address.country')}
                disabled={isLoading}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hasError('address.country')
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="USA"
              />
              {hasError('address.country') && (
                <p className="mt-1 text-sm text-red-600">{getError('address.country')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Customer Settings</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Type */}
          <div>
            <label htmlFor="customerType" className="block text-sm font-medium text-gray-700">
              Customer Type
            </label>
            <select
              id="customerType"
              value={formData.customerType}
              onChange={(e) => handleChange('customerType', e.target.value)}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {Object.entries(CUSTOMER_TYPES).map(([key, value]) => (
                <option key={value} value={value}>
                  {CUSTOMER_TYPE_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {Object.entries(CUSTOMER_STATUS).map(([key, value]) => (
                <option key={value} value={value}>
                  {STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Preferences</h4>

        {/* Notification Preferences */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={formData.preferences.emailNotifications}
              onChange={(e) =>
                handleChange('preferences.emailNotifications', e.target.checked)
              }
              disabled={isLoading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
              Email Notifications
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="smsNotifications"
              checked={formData.preferences.smsNotifications}
              onChange={(e) => handleChange('preferences.smsNotifications', e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
              SMS Notifications
            </label>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(INTEREST_CATEGORIES).map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest)}
                disabled={isLoading}
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  formData.preferences.interests.includes(interest)
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {INTEREST_LABELS[interest]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notes and Tags */}
      <div className="space-y-4">
        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            onBlur={() => handleBlur('notes')}
            disabled={isLoading}
            rows={3}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError('notes') ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Additional notes about the customer..."
          />
          {hasError('notes') && (
            <p className="mt-1 text-sm text-red-600">{getError('notes')}</p>
          )}
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            onKeyPress={handleTagInput}
            disabled={isLoading}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            placeholder="Type a tag and press Enter"
          />
          {formData.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    disabled={isLoading}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : isEditMode ? 'Update Customer' : 'Create Customer'}
        </button>
      </div>
    </form>
  );
};
