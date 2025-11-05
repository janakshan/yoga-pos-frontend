import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useProductForm } from '../hooks/useProductForm.js';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  UNIT_TYPES,
  CATEGORY_LABELS,
  STATUS_LABELS,
  UNIT_LABELS
} from '../types/product.types.js';

/**
 * ProductForm Component
 * Form for creating and editing products
 * @param {Object} props - Component props
 * @param {Object|null} props.initialData - Initial product data (null for create mode)
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element}
 */
export const ProductForm = ({
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
    addTag,
    removeTag
  } = useProductForm(initialData);

  const [newTag, setNewTag] = useState('');

  const isEditMode = !!initialData;

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag.trim().toLowerCase());
      setNewTag('');
    }
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {isEditMode ? 'Edit Product' : 'Create New Product'}
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          {isEditMode
            ? 'Update product information and inventory details'
            : 'Add a new product to your inventory'}
        </p>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="sku"
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              onBlur={() => handleBlur('sku')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('sku')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="e.g., YM-001-BLU"
            />
            {hasError('sku') && (
              <p className="mt-1 text-sm text-red-600">{getError('sku')}</p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('name')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="e.g., Premium Yoga Mat - Ocean Blue"
            />
            {hasError('name') && (
              <p className="mt-1 text-sm text-red-600">{getError('name')}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            disabled={isLoading}
            rows={3}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError('description')
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-white'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Detailed product description..."
          />
          {hasError('description') && (
            <p className="mt-1 text-sm text-red-600">{getError('description')}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('category')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value="">Select category</option>
              {Object.values(PRODUCT_CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_LABELS[cat]}
                </option>
              ))}
            </select>
            {hasError('category') && (
              <p className="mt-1 text-sm text-red-600">{getError('category')}</p>
            )}
          </div>

          {/* Unit */}
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              id="unit"
              value={formData.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              onBlur={() => handleBlur('unit')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('unit')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {Object.values(UNIT_TYPES).map((unit) => (
                <option key={unit} value={unit}>
                  {UNIT_LABELS[unit]}
                </option>
              ))}
            </select>
            {hasError('unit') && (
              <p className="mt-1 text-sm text-red-600">{getError('unit')}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              onBlur={() => handleBlur('status')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('status')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {Object.values(PRODUCT_STATUSES).map((status) => (
                <option key={status} value={status}>
                  {STATUS_LABELS[status]}
                </option>
              ))}
            </select>
            {hasError('status') && (
              <p className="mt-1 text-sm text-red-600">{getError('status')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Pricing</h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Selling Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              onBlur={() => handleBlur('price')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('price')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="0.00"
            />
            {hasError('price') && (
              <p className="mt-1 text-sm text-red-600">{getError('price')}</p>
            )}
          </div>

          {/* Cost */}
          <div>
            <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
              Cost Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="cost"
              step="0.01"
              min="0"
              value={formData.cost}
              onChange={(e) => handleChange('cost', e.target.value)}
              onBlur={() => handleBlur('cost')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('cost')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="0.00"
            />
            {hasError('cost') && (
              <p className="mt-1 text-sm text-red-600">{getError('cost')}</p>
            )}
          </div>

          {/* Tax Rate */}
          <div>
            <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
              Tax Rate (%) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="taxRate"
              step="0.01"
              min="0"
              max="100"
              value={formData.taxRate}
              onChange={(e) => handleChange('taxRate', e.target.value)}
              onBlur={() => handleBlur('taxRate')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('taxRate')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="10.00"
            />
            {hasError('taxRate') && (
              <p className="mt-1 text-sm text-red-600">{getError('taxRate')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Inventory</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Stock Quantity */}
          <div>
            <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="stockQuantity"
              min="0"
              value={formData.stockQuantity}
              onChange={(e) => handleChange('stockQuantity', e.target.value)}
              onBlur={() => handleBlur('stockQuantity')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('stockQuantity')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="0"
            />
            {hasError('stockQuantity') && (
              <p className="mt-1 text-sm text-red-600">{getError('stockQuantity')}</p>
            )}
          </div>

          {/* Low Stock Threshold */}
          <div>
            <label
              htmlFor="lowStockThreshold"
              className="block text-sm font-medium text-gray-700"
            >
              Low Stock Threshold <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="lowStockThreshold"
              min="0"
              value={formData.lowStockThreshold}
              onChange={(e) => handleChange('lowStockThreshold', e.target.value)}
              onBlur={() => handleBlur('lowStockThreshold')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('lowStockThreshold')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="10"
            />
            {hasError('lowStockThreshold') && (
              <p className="mt-1 text-sm text-red-600">{getError('lowStockThreshold')}</p>
            )}
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="trackInventory"
              checked={formData.trackInventory}
              onChange={(e) => handleChange('trackInventory', e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="trackInventory" className="ml-2 block text-sm text-gray-700">
              Track inventory for this product
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowBackorder"
              checked={formData.allowBackorder}
              onChange={(e) => handleChange('allowBackorder', e.target.checked)}
              disabled={isLoading}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="allowBackorder" className="ml-2 block text-sm text-gray-700">
              Allow backorders (sell when out of stock)
            </label>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Additional Information</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Barcode */}
          <div>
            <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
              Barcode
            </label>
            <input
              type="text"
              id="barcode"
              value={formData.barcode}
              onChange={(e) => handleChange('barcode', e.target.value)}
              onBlur={() => handleBlur('barcode')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('barcode')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="e.g., 1234567890123"
            />
            {hasError('barcode') && (
              <p className="mt-1 text-sm text-red-600">{getError('barcode')}</p>
            )}
          </div>

          {/* Supplier */}
          <div>
            <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
              Supplier
            </label>
            <input
              type="text"
              id="supplier"
              value={formData.supplier}
              onChange={(e) => handleChange('supplier', e.target.value)}
              onBlur={() => handleBlur('supplier')}
              disabled={isLoading}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                hasError('supplier')
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-300 bg-white'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              placeholder="e.g., Yoga Supplies Co."
            />
            {hasError('supplier') && (
              <p className="mt-1 text-sm text-red-600">{getError('supplier')}</p>
            )}
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Product Image
          </label>
          <input
            type="text"
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            onBlur={() => handleBlur('imageUrl')}
            disabled={isLoading}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              hasError('imageUrl')
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-white'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="https://example.com/image.jpg"
          />
          {hasError('imageUrl') && (
            <p className="mt-1 text-sm text-red-600">{getError('imageUrl')}</p>
          )}

          {/* Image Preview */}
          {formData.imageUrl && (
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
              <div className="w-full max-w-xs h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              disabled={isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add tag (press Enter)"
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={isLoading || !newTag.trim()}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    disabled={isLoading}
                    className="hover:text-blue-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
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
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {isEditMode ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{isEditMode ? 'Update Product' : 'Create Product'}</>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
