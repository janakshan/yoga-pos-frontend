import React from 'react';
import { Edit, Trash2, Package, AlertTriangle, XCircle } from 'lucide-react';
import { CATEGORY_LABELS, STATUS_LABELS } from '../types/product.types.js';

/**
 * ProductCard Component
 * Displays a single product in card format
 * @param {Object} props - Component props
 * @param {Object} props.product - Product data
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 * @returns {JSX.Element}
 */
export const ProductCard = ({ product, onEdit, onDelete }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStockStatus = () => {
    if (!product.trackInventory) {
      return { icon: Package, label: 'Not tracked', className: 'text-gray-500' };
    }
    if (product.stockQuantity === 0) {
      return { icon: XCircle, label: 'Out of Stock', className: 'text-red-600' };
    }
    if (product.stockQuantity <= product.lowStockThreshold) {
      return { icon: AlertTriangle, label: 'Low Stock', className: 'text-amber-600' };
    }
    return { icon: Package, label: 'In Stock', className: 'text-green-600' };
  };

  const getStatusBadge = () => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      discontinued: 'bg-red-100 text-red-800'
    };
    return badges[product.status] || badges.active;
  };

  const stockStatus = getStockStatus();
  const StockIcon = stockStatus.icon;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200">
      {/* Image */}
      {product.imageUrl ? (
        <div className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
          <Package className="h-16 w-16 text-blue-400" />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">SKU: {product.sku}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge()}`}>
            {STATUS_LABELS[product.status]}
          </span>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
        )}

        {/* Category */}
        <div className="mb-3">
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
            {CATEGORY_LABELS[product.category]}
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm text-gray-500">Cost: {formatCurrency(product.cost)}</span>
          </div>
          {product.taxRate > 0 && (
            <p className="text-xs text-gray-500 mt-1">+{product.taxRate}% tax</p>
          )}
        </div>

        {/* Stock Status */}
        <div className="mb-4 flex items-center gap-2 p-2 bg-gray-50 rounded">
          <StockIcon className={`h-5 w-5 ${stockStatus.className}`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${stockStatus.className}`}>
              {stockStatus.label}
            </p>
            {product.trackInventory && (
              <p className="text-xs text-gray-600">
                {product.stockQuantity} {product.unit}
                {product.stockQuantity !== 1 ? 's' : ''} available
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
              >
                #{tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="inline-block px-2 py-0.5 text-gray-500 text-xs">
                +{product.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span className="text-sm">Edit</span>
          </button>
          <button
            onClick={() => onDelete(product)}
            className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
