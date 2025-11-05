import React, { useState, useEffect } from 'react';
import { Search, Package, Plus } from 'lucide-react';
import { useProducts } from '../../products/hooks/useProducts';
import { usePos } from '../hooks/usePos';

/**
 * ProductSelector Component
 * Displays products grid for POS selection
 * @returns {JSX.Element}
 */
export const ProductSelector = () => {
  const { products, fetchProducts, isLoading } = useProducts();
  const { handleAddToCart } = usePos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchProducts({ status: 'active' });
  }, [fetchProducts]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStockBadge = (product) => {
    if (!product.trackInventory) {
      return <span className="text-xs text-gray-500">No tracking</span>;
    }
    if (product.stockQuantity === 0) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          Out of Stock
        </span>
      );
    }
    if (product.stockQuantity <= product.lowStockThreshold) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
          Low Stock ({product.stockQuantity})
        </span>
      );
    }
    return (
      <span className="text-xs text-green-600">
        {product.stockQuantity} in stock
      </span>
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === '' ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory && product.status === 'active';
  });

  // Get unique categories
  const categories = ['all', ...new Set(products.map((p) => p.category))];

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter Bar */}
      <div className="mb-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Products' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Package className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => handleAddToCart(product)}
                disabled={product.trackInventory && product.stockQuantity === 0}
                className={`bg-white rounded-lg shadow hover:shadow-md transition-all border border-gray-200 text-left p-4 ${
                  product.trackInventory && product.stockQuantity === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-blue-500 cursor-pointer'
                }`}
              >
                {/* Product Image */}
                {product.imageUrl ? (
                  <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          'https://via.placeholder.com/200x150?text=No+Image';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <Package className="h-12 w-12 text-blue-300" />
                  </div>
                )}

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-blue-600">
                      {formatCurrency(product.price)}
                    </span>
                    <Plus className="h-5 w-5 text-gray-400" />
                  </div>

                  {/* Stock Badge */}
                  <div className="flex items-center justify-between">
                    {getStockBadge(product)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSelector;
