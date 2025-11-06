import React from 'react';
import { ProductList } from '../features/products/components/ProductList.jsx';

/**
 * ProductsPage
 * Main page for product management
 * @returns {JSX.Element}
 */
const ProductsPage = () => {
  return (
    <div className="h-full px-4 sm:px-6 py-4 sm:py-6 overflow-auto bg-gray-50 dark:bg-gray-900">
      <ProductList />
    </div>
  );
};

export default ProductsPage;
