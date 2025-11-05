import React from 'react';
import { ProductSelector, Cart, CheckoutPanel } from '../features/pos/components';

/**
 * POSPage
 * Main Point of Sale interface
 * @returns {JSX.Element}
 */
const POSPage = () => {
  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
        <p className="text-sm text-gray-500 mt-1">
          Select products and complete transactions
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Product Selector - Left Side */}
            <div className="lg:col-span-7 h-full overflow-hidden">
              <ProductSelector />
            </div>

            {/* Cart and Checkout - Right Side */}
            <div className="lg:col-span-5 h-full flex flex-col gap-4 overflow-y-auto">
              {/* Cart */}
              <div className="flex-1 min-h-[400px]">
                <Cart />
              </div>

              {/* Checkout Panel */}
              <div className="flex-shrink-0">
                <CheckoutPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSPage;
