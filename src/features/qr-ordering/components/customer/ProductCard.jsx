/**
 * Product Card Component
 *
 * Displays product information in customer menu
 */

import { useState } from 'react';
import { PlusIcon, FireIcon, LeafIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';
import ProductModal from './ProductModal';

const ProductCard = ({ product }) => {
  const [showModal, setShowModal] = useState(false);

  const hasModifiers = product.modifiers && product.modifiers.length > 0;

  const handleAddToCart = () => {
    if (hasModifiers) {
      // Show modal for modifier selection
      setShowModal(true);
    } else {
      // Add directly to cart
      addToCart(product);
    }
  };

  const addToCart = (productData, modifiers = []) => {
    // This will be handled by the modal or directly
    console.log('Add to cart:', productData, modifiers);
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {/* Product Image */}
        <div className="relative h-48 bg-gray-200">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              🍽️
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.isSpicy && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full flex items-center">
                <FireIcon className="h-3 w-3 mr-1" />
                Spicy
              </span>
            )}
            {product.isVegetarian && (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center">
                <LeafIcon className="h-3 w-3 mr-1" />
                Veg
              </span>
            )}
            {product.isPopular && (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full flex items-center">
                <HeartIcon className="h-3 w-3 mr-1" />
                Popular
              </span>
            )}
          </div>

          {/* Out of Stock Overlay */}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          {/* Allergens */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-orange-600">
                ⚠️ Contains: {product.allergens.join(', ')}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3">
            <div>
              <p className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-gray-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </p>
              )}
            </div>

            {product.isAvailable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart();
                }}
                className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Customization Indicator */}
          {hasModifiers && (
            <div className="mt-2 text-xs text-indigo-600 font-medium">
              ✨ Customizable
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductModal
        product={product}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default ProductCard;
