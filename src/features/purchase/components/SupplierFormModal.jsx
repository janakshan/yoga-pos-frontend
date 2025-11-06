import React from 'react';
import { X } from 'lucide-react';
import { useSuppliers } from '../hooks/useSuppliers.js';
import { useSupplierForm } from '../hooks/useSupplierForm.js';
import {
  SUPPLIER_STATUS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  SUPPLIER_PRODUCT_CATEGORIES
} from '../types/supplier.types.js';

export const SupplierFormModal = ({ supplier = null, onClose }) => {
  const { createSupplier, updateSupplierData, isLoading } = useSuppliers();
  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    hasError,
    getError
  } = useSupplierForm(supplier);

  const isEditMode = !!supplier;

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateSupplierData(supplier.id, data);
      } else {
        await createSupplier(data);
      }
      onClose();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleCategoryToggle = (category) => {
    const categories = formData.productCategories || [];
    if (categories.includes(category)) {
      handleChange(
        'productCategories',
        categories.filter((c) => c !== category)
      );
    } else {
      handleChange('productCategories', [...categories, category]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="px-6 py-4 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value)}
                    onBlur={() => handleBlur('code')}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      hasError('code') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {hasError('code') && (
                    <p className="mt-1 text-sm text-red-600">{getError('code')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      hasError('name') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {hasError('name') && (
                    <p className="mt-1 text-sm text-red-600">{getError('name')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      hasError('phone') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {hasError('phone') && (
                    <p className="mt-1 text-sm text-red-600">{getError('phone')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      hasError('email') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {hasError('email') && (
                    <p className="mt-1 text-sm text-red-600">{getError('email')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={SUPPLIER_STATUS.ACTIVE}>Active</option>
                    <option value={SUPPLIER_STATUS.INACTIVE}>Inactive</option>
                    <option value={SUPPLIER_STATUS.BLOCKED}>Blocked</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Contact Person
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contact.name}
                    onChange={(e) => handleChange('contact.name', e.target.value)}
                    onBlur={() => handleBlur('contact.name')}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      hasError('contact.name') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {hasError('contact.name') && (
                    <p className="mt-1 text-sm text-red-600">{getError('contact.name')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) => handleChange('contact.phone', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => handleChange('contact.email', e.target.value)}
                    onBlur={() => handleBlur('contact.email')}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      hasError('contact.email') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {hasError('contact.email') && (
                    <p className="mt-1 text-sm text-red-600">{getError('contact.email')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.contact.position}
                    onChange={(e) => handleChange('contact.position', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Street <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleChange('address.street', e.target.value)}
                    onBlur={() => handleBlur('address.street')}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      hasError('address.street') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {hasError('address.street') && (
                    <p className="mt-1 text-sm text-red-600">{getError('address.street')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleChange('address.city', e.target.value)}
                    onBlur={() => handleBlur('address.city')}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      hasError('address.city') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {hasError('address.city') && (
                    <p className="mt-1 text-sm text-red-600">{getError('address.city')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address.postalCode}
                    onChange={(e) => handleChange('address.postalCode', e.target.value)}
                    onBlur={() => handleBlur('address.postalCode')}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      hasError('address.postalCode') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {hasError('address.postalCode') && (
                    <p className="mt-1 text-sm text-red-600">{getError('address.postalCode')}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Payment Terms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credit Days <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.paymentTerms.creditDays}
                    onChange={(e) =>
                      handleChange('paymentTerms.creditDays', parseInt(e.target.value) || 0)
                    }
                    onBlur={() => handleBlur('paymentTerms.creditDays')}
                    disabled={isLoading}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      hasError('paymentTerms.creditDays') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {hasError('paymentTerms.creditDays') && (
                    <p className="mt-1 text-sm text-red-600">{getError('paymentTerms.creditDays')}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentTerms.method}
                    onChange={(e) => handleChange('paymentTerms.method', e.target.value)}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                      <option key={value} value={value}>
                        {PAYMENT_METHOD_LABELS[value]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Credit Limit
                  </label>
                  <input
                    type="number"
                    value={formData.paymentTerms.creditLimit}
                    onChange={(e) =>
                      handleChange('paymentTerms.creditLimit', parseFloat(e.target.value) || 0)
                    }
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Product Categories */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Product Categories
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SUPPLIER_PRODUCT_CATEGORIES.map((category) => (
                  <label
                    key={category}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.productCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      disabled={isLoading}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Supplier' : 'Create Supplier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
