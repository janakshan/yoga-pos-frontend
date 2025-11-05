import React from 'react';
import { ProductList } from '../features/products/components/ProductList.jsx';

/**
 * ProductsPage
 * Main page for product management
 * @returns {JSX.Element}
 */
const ProductsPage = () => {
  return (
    <div className="h-full px-6 py-6 overflow-auto">
      <ProductList />
    </div>
  );
};

export default ProductsPage;
