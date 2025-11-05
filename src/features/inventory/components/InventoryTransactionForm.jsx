import React from 'react';
import { X } from 'lucide-react';
import { useInventoryForm } from '../hooks/useInventoryForm.js';
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS
} from '../types/inventory.types.js';

/**
 * InventoryTransactionForm Component
 * Form for creating inventory transactions
 * @param {Object} props - Component props
 * @param {Object|null} props.initialData - Initial transaction data
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element}
 */
export const InventoryTransactionForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    hasError,
    getError,
    calculateTotalCost,
    isEditMode
  } = useInventoryForm(initialData);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditMode ? 'Edit Transaction' : 'New Inventory Transaction'}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {isEditMode
              ? 'Update transaction details'
              : 'Record a new inventory movement'}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Transaction Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product ID (Note: In real app, this would be a product selector) */}
          <div>
            <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
              Product ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="productId"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('productId')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="e.g., prod_001"
            />
            {hasError('productId') && (
              <p className="mt-1 text-sm text-red-600">{getError('productId')}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">Enter the product ID (e.g., prod_001, prod_002)</p>
          </div>

          {/* Transaction Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Transaction Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('type')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {Object.values(TRANSACTION_TYPES).map((type) => (
                <option key={type} value={type}>
                  {TRANSACTION_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
            {hasError('type') && (
              <p className="mt-1 text-sm text-red-600">{getError('type')}</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              min="0"
              step="1"
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('quantity')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="0"
            />
            {hasError('quantity') && (
              <p className="mt-1 text-sm text-red-600">{getError('quantity')}</p>
            )}
          </div>

          {/* Unit Cost */}
          <div>
            <label htmlFor="unitCost" className="block text-sm font-medium text-gray-700">
              Unit Cost <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                id="unitCost"
                name="unitCost"
                value={formData.unitCost}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                min="0"
                step="0.01"
                className={`block w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hasError('unitCost')
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 bg-white'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                placeholder="0.00"
              />
            </div>
            {hasError('unitCost') && (
              <p className="mt-1 text-sm text-red-600">{getError('unitCost')}</p>
            )}
          </div>

          {/* Transaction Date */}
          <div>
            <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">
              Transaction Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="transactionDate"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('transactionDate')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {hasError('transactionDate') && (
              <p className="mt-1 text-sm text-red-600">{getError('transactionDate')}</p>
            )}
          </div>

          {/* Total Cost (Read-only calculated field) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Total Cost</label>
            <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900">
              ${calculateTotalCost().toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Optional Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Additional Information (Optional)</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Batch Number */}
          <div>
            <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700">
              Batch/Lot Number
            </label>
            <input
              type="text"
              id="batchNumber"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., BATCH-2024-001"
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
              Expiry Date
            </label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('expiryDate')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            {hasError('expiryDate') && (
              <p className="mt-1 text-sm text-red-600">{getError('expiryDate')}</p>
            )}
          </div>

          {/* Location ID */}
          <div>
            <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">
              Location ID
            </label>
            <input
              type="text"
              id="locationId"
              name="locationId"
              value={formData.locationId}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., loc_001"
            />
          </div>

          {/* Reference Number */}
          <div>
            <label htmlFor="referenceNumber" className="block text-sm font-medium text-gray-700">
              Reference Number
            </label>
            <input
              type="text"
              id="referenceNumber"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., PO-2024-001"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add any additional notes about this transaction..."
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
          {isLoading ? 'Saving...' : isEditMode ? 'Update Transaction' : 'Create Transaction'}
        </button>
      </div>
    </form>
  );
};

export default InventoryTransactionForm;
