import React, { useState, useEffect } from 'react';
import { ArrowRight, Package, AlertCircle } from 'lucide-react';
import { useBranch } from '../../branch/hooks/useBranch.js';
import { useProducts } from '../../products/hooks/useProducts.js';
import { useInventory } from '../hooks/useInventory.js';

/**
 * InterBranchTransferForm Component
 * Form for transferring inventory between branches
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Submit handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element}
 */
export const InterBranchTransferForm = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { branches, currentBranch } = useBranch();
  const { products, fetchProducts } = useProducts();
  const { getStockLevel } = useInventory();

  const [formData, setFormData] = useState({
    productId: '',
    fromLocationId: currentBranch?.id || '',
    toLocationId: '',
    quantity: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [availableStock, setAvailableStock] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const activeBranches = branches.filter(b => b.isActive && b.id !== formData.fromLocationId);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Update from location when current branch changes
  useEffect(() => {
    if (currentBranch && !formData.fromLocationId) {
      setFormData(prev => ({
        ...prev,
        fromLocationId: currentBranch.id,
      }));
    }
  }, [currentBranch]);

  // Fetch available stock when product or from location changes
  useEffect(() => {
    const fetchStock = async () => {
      if (formData.productId && formData.fromLocationId) {
        try {
          const stock = await getStockLevel(formData.productId, formData.fromLocationId);
          setAvailableStock(stock);
        } catch (error) {
          setAvailableStock(null);
        }
      } else {
        setAvailableStock(null);
      }
    };

    fetchStock();
  }, [formData.productId, formData.fromLocationId]);

  // Update selected product when product changes
  useEffect(() => {
    if (formData.productId) {
      const product = products.find(p => p.id === formData.productId);
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null);
    }
  }, [formData.productId, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.productId) {
      newErrors.productId = 'Product is required';
    }

    if (!formData.fromLocationId) {
      newErrors.fromLocationId = 'Source branch is required';
    }

    if (!formData.toLocationId) {
      newErrors.toLocationId = 'Destination branch is required';
    } else if (formData.fromLocationId === formData.toLocationId) {
      newErrors.toLocationId = 'Source and destination must be different';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    } else if (availableStock && parseInt(formData.quantity) > availableStock.quantity) {
      newErrors.quantity = `Insufficient stock. Available: ${availableStock.quantity}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      onSubmit({
        ...formData,
        quantity: parseInt(formData.quantity),
        productName: selectedProduct?.name,
        productSku: selectedProduct?.sku,
      });
    }
  };

  const fromBranch = branches.find(b => b.id === formData.fromLocationId);
  const toBranch = branches.find(b => b.id === formData.toLocationId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          Inter-Branch Stock Transfer
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Transfer inventory between branches
        </p>
      </div>

      {/* Transfer Route Visualization */}
      {formData.fromLocationId && formData.toLocationId && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-900 mb-1">From</p>
              <p className="text-sm font-semibold text-blue-700">
                {fromBranch?.name || 'Select source'}
              </p>
              <p className="text-xs text-blue-600">{fromBranch?.city}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-blue-600 mx-4" />
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-900 mb-1">To</p>
              <p className="text-sm font-semibold text-blue-700">
                {toBranch?.name || 'Select destination'}
              </p>
              <p className="text-xs text-blue-600">{toBranch?.city}</p>
            </div>
          </div>
        </div>
      )}

      {/* Product Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Product *
        </label>
        <select
          name="productId"
          value={formData.productId}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.productId ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select a product</option>
          {products.map(product => (
            <option key={product.id} value={product.id}>
              {product.name} - {product.sku}
            </option>
          ))}
        </select>
        {errors.productId && (
          <p className="mt-1 text-sm text-red-600">{errors.productId}</p>
        )}
      </div>

      {/* Available Stock Info */}
      {availableStock && selectedProduct && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-gray-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Available Stock at {fromBranch?.name}
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {availableStock.quantity} units
              </p>
              {availableStock.isLowStock && (
                <div className="flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <p className="text-xs text-amber-600">Low stock at source location</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Source Branch */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          From Branch *
        </label>
        <select
          name="fromLocationId"
          value={formData.fromLocationId}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.fromLocationId ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select source branch</option>
          {branches.filter(b => b.isActive).map(branch => (
            <option key={branch.id} value={branch.id}>
              {branch.name} - {branch.code}
            </option>
          ))}
        </select>
        {errors.fromLocationId && (
          <p className="mt-1 text-sm text-red-600">{errors.fromLocationId}</p>
        )}
      </div>

      {/* Destination Branch */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          To Branch *
        </label>
        <select
          name="toLocationId"
          value={formData.toLocationId}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.toLocationId ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="">Select destination branch</option>
          {activeBranches.map(branch => (
            <option key={branch.id} value={branch.id}>
              {branch.name} - {branch.code}
            </option>
          ))}
        </select>
        {errors.toLocationId && (
          <p className="mt-1 text-sm text-red-600">{errors.toLocationId}</p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantity *
        </label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          min="1"
          max={availableStock?.quantity || undefined}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.quantity ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Enter quantity to transfer"
        />
        {errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add notes about this transfer (optional)"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Transfer Stock'}
        </button>
      </div>
    </form>
  );
};

export default InterBranchTransferForm;
