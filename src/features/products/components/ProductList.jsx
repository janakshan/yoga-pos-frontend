import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  DollarSign,
  AlertTriangle,
  XCircle,
  Filter,
  Loader2
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts.js';
import { ProductForm } from './ProductForm.jsx';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  CATEGORY_LABELS,
  STATUS_LABELS
} from '../types/product.types.js';

/**
 * ProductList Component
 * Displays a list of products with filtering, search, and CRUD operations
 * @returns {JSX.Element}
 */
export const ProductList = () => {
  const {
    products,
    isLoading,
    stats,
    fetchProducts,
    fetchProductStats,
    createProduct,
    updateProductById,
    deleteProduct
  } = useProducts();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    lowStock: false,
    sortBy: 'name',
    sortOrder: 'asc'
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Reload data when filters change
  useEffect(() => {
    if (products.length > 0 || filters.search || filters.category !== 'all' || filters.status !== 'all') {
      loadData();
    }
  }, [filters]);

  const loadData = async () => {
    const filterParams = {
      ...filters,
      category: filters.category === 'all' ? undefined : filters.category,
      status: filters.status === 'all' ? undefined : filters.status
    };
    await fetchProducts(filterParams);
    await fetchProductStats();
  };

  const handleCreateClick = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteConfirmOpen(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (selectedProduct) {
        await updateProductById(selectedProduct.id, data);
      } else {
        await createProduct(data);
      }
      setIsFormOpen(false);
      setSelectedProduct(null);
      await loadData();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
        setIsDeleteConfirmOpen(false);
        setProductToDelete(null);
        await loadData();
      } catch (error) {
        // Error is handled in the hook
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStockStatus = (product) => {
    if (!product.trackInventory) {
      return { label: 'N/A', className: 'bg-gray-100 text-gray-800' };
    }
    if (product.stockQuantity === 0) {
      return { label: 'Out of Stock', className: 'bg-red-100 text-red-800' };
    }
    if (product.stockQuantity <= product.lowStockThreshold) {
      return { label: 'Low Stock', className: 'bg-amber-100 text-amber-800' };
    }
    return { label: 'In Stock', className: 'bg-green-100 text-green-800' };
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      discontinued: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.active;
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
            </div>
            <Package className="h-10 w-10 text-blue-500" />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            {stats.activeProducts} active
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalInventoryValue)}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-green-500" />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Retail: {formatCurrency(stats.totalRetailValue)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStockProducts}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-amber-500" />
          </div>
          <p className="mt-2 text-xs text-gray-500">Need reordering</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.outOfStockProducts}</p>
            </div>
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <p className="mt-2 text-xs text-gray-500">Unavailable items</p>
        </div>
      </div>

      {/* Header and Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your product catalog and inventory
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {Object.values(PRODUCT_CATEGORIES).map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            {Object.values(PRODUCT_STATUSES).map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>

          {/* Low Stock Filter */}
          <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              checked={filters.lowStock}
              onChange={(e) => setFilters({ ...filters, lowStock: e.target.checked })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">Low Stock Only</span>
          </label>
        </div>

        {/* Products Table */}
        {isLoading && products.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No products found</p>
            <p className="text-sm text-gray-500 mt-1">
              {filters.search || filters.category !== 'all' || filters.status !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by adding your first product'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        {product.description && (
                          <div className="text-xs text-gray-500 max-w-xs truncate">
                            {product.description}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {CATEGORY_LABELS[product.category]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(product.price)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Cost: {formatCurrency(product.cost)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.trackInventory ? (
                          <>
                            <div className="text-sm text-gray-900">
                              {product.stockQuantity}
                            </div>
                            <span
                              className={`inline-flex text-xs px-2 py-1 rounded-full font-semibold ${stockStatus.className}`}
                            >
                              {stockStatus.label}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-500">Not tracked</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                            product.status
                          )}`}
                        >
                          {STATUS_LABELS[product.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit product"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete product"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ProductForm
                initialData={selectedProduct}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete "{productToDelete.name}"? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
