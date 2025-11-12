/**
 * Visual Menu Display
 * Customer-facing visual menu organized by restaurant categories
 */

import { useState, useEffect } from 'react';
import { useStore } from '../../../store';
import { Clock, Flame, Leaf, Award } from 'lucide-react';

export default function VisualMenuDisplay({ onSelectProduct }) {
  const {
    restaurantCategories,
    fetchRestaurantCategories,
    getAvailableCategories
  } = useStore();

  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchRestaurantCategories();
        const available = await getAvailableCategories();
        setAvailableCategories(available);

        // Load products from localStorage
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
          const allProducts = JSON.parse(storedProducts);
          // Filter products that have restaurant categories
          const restaurantProducts = allProducts.filter(
            p => p.restaurantCategoryId && p.status === 'active'
          );
          setProducts(restaurantProducts);
        }
      } catch (error) {
        console.error('Error loading menu data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchRestaurantCategories, getAvailableCategories]);

  const getProductsByCategory = (categoryId) => {
    return products.filter(p => p.restaurantCategoryId === categoryId);
  };

  const displayCategories = selectedCategory
    ? availableCategories.filter(c => c.id === selectedCategory)
    : availableCategories;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Menu</h1>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                !selectedCategory
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {availableCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={
                  selectedCategory === category.id
                    ? { backgroundColor: category.color }
                    : {}
                }
              >
                {category.icon && <span>{category.icon}</span>}
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {displayCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No menu categories available</p>
          </div>
        ) : (
          <div className="space-y-12">
            {displayCategories.map((category) => {
              const categoryProducts = getProductsByCategory(category.id);

              if (categoryProducts.length === 0) {
                return null;
              }

              return (
                <div key={category.id} id={`category-${category.id}`}>
                  {/* Category Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      {category.icon && (
                        <span className="text-3xl">{category.icon}</span>
                      )}
                      <h2
                        className="text-2xl font-bold"
                        style={{ color: category.color }}
                      >
                        {category.name}
                      </h2>
                    </div>
                    {category.description && (
                      <p className="text-gray-600 ml-12">{category.description}</p>
                    )}
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.map((product) => (
                      <MenuItemCard
                        key={product.id}
                        product={product}
                        categoryColor={category.color}
                        onSelect={onSelectProduct}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItemCard({ product, categoryColor, onSelect }) {
  const hasModifiers = product.modifierGroupIds?.length > 0;
  const price = product.pricing?.retail || product.price || 0;

  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer border-2 border-transparent hover:border-gray-300"
      onClick={() => onSelect?.(product)}
    >
      {/* Product Image */}
      {(product.imageUrls?.[0] || product.imageUrl) && (
        <div className="relative h-48 bg-gray-200">
          <img
            src={product.imageUrls?.[0] || product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.isFeatured && (
            <div
              className="absolute top-3 right-3 px-2 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1"
              style={{ backgroundColor: categoryColor }}
            >
              <Award className="w-3 h-3" />
              Featured
            </div>
          )}
          {product.isChefSpecial && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-bold flex items-center gap-1">
              <Award className="w-3 h-3" />
              Chef's Special
            </div>
          )}
        </div>
      )}

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            {product.isSpicy && (
              <Flame className="w-4 h-4 text-red-500" title="Spicy" />
            )}
            {product.nutritionalInfo?.isVegetarian && (
              <Leaf className="w-4 h-4 text-green-500" title="Vegetarian" />
            )}
            {product.nutritionalInfo?.isVegan && (
              <Leaf className="w-4 h-4 text-green-600" title="Vegan" />
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Additional Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          {product.preparationTime && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {product.preparationTime} min
            </div>
          )}
          {product.nutritionalInfo?.calories && (
            <div>{product.nutritionalInfo.calories} cal</div>
          )}
        </div>

        {/* Allergens */}
        {product.nutritionalInfo?.allergens?.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500">
              Contains: {product.nutritionalInfo.allergens.join(', ')}
            </p>
          </div>
        )}

        {/* Dietary Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.nutritionalInfo?.isGlutenFree && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded">
              Gluten-Free
            </span>
          )}
          {product.nutritionalInfo?.isDairyFree && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">
              Dairy-Free
            </span>
          )}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <div>
            <div className="text-2xl font-bold" style={{ color: categoryColor }}>
              ${price.toFixed(2)}
            </div>
            {hasModifiers && (
              <div className="text-xs text-gray-500 mt-1">Customizable</div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(product);
            }}
            className="px-4 py-2 text-white rounded-lg font-medium transition-colors"
            style={{ backgroundColor: categoryColor }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
