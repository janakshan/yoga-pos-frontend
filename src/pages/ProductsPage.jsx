import React from 'react';
import { ProductList } from '../features/products/components/ProductList.jsx';

/**
 * ProductsPage
 * Main page for product management
 * @returns {JSX.Element}
 */
const ProductsPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <ProductList />
    </div>
  );
};

export default ProductsPage;
