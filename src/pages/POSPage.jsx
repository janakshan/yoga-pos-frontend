import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { ProductSelector, Cart, CheckoutPanel } from '../features/pos/components';
import RestaurantPOSHeader from '../features/pos/components/RestaurantPOSHeader';
import QuickReorder from '../features/pos/components/QuickReorder';

/**
 * POSPage
 * Main Point of Sale interface
 * @returns {JSX.Element}
 */
const POSPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Restaurant POS Header */}
      <RestaurantPOSHeader />

      {/* Quick Actions Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Point of Sale</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Select products and complete transactions
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Re-order */}
            <QuickReorder />

            {/* Fast Checkout Link */}
            <button
              onClick={() => navigate('/pos/fast-checkout')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              <Zap className="h-5 w-5" />
              <span className="hidden sm:inline font-semibold">Fast Checkout</span>
              <span className="sm:hidden font-semibold">Fast</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-2 sm:px-4 py-4 sm:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 h-full">
            {/* Product Selector - Left Side */}
            <div className="lg:col-span-7 h-full overflow-hidden">
              <ProductSelector />
            </div>

            {/* Cart and Checkout - Right Side */}
            <div className="lg:col-span-5 h-full flex flex-col gap-4 overflow-y-auto">
              {/* Cart */}
              <div className="flex-1 min-h-[300px] sm:min-h-[400px]">
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
