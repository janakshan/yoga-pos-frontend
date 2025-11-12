/**
 * Mobile Menu Component
 *
 * Customer-facing mobile menu interface for QR ordering
 */

import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  PhoneIcon,
  ReceiptPercentIcon
} from '@heroicons/react/24/outline';
import { useStore } from '@/store';
import ProductCard from './ProductCard';
import CartDrawer from './CartDrawer';
import toast from 'react-hot-toast';

const MobileMenu = ({ sessionId }) => {
  const { products, qrOrdering, callServer, requestBill } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const session = qrOrdering.currentSession;
  const cart = qrOrdering.customerCart;

  // Get unique categories from products
  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    ...Array.from(new Set(products.map(p => p.category)))
      .filter(Boolean)
      .map(cat => ({ id: cat, name: cat, icon: getCategoryIcon(cat) }))
  ];

  function getCategoryIcon(category) {
    const icons = {
      'Appetizers': '🥗',
      'Main Course': '🍛',
      'Desserts': '🍰',
      'Beverages': '🥤',
      'Breakfast': '🍳',
      'Lunch': '🍱',
      'Dinner': '🍽️',
      'Drinks': '🍹',
      'Snacks': '🍿'
    };
    return icons[category] || '🍴';
  }

  const filteredProducts = products.filter(product => {
    // Filter by category
    if (selectedCategory !== 'all' && product.category !== selectedCategory) {
      return false;
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleCallServer = async () => {
    try {
      await callServer('Customer needs assistance');
      toast.success('Server has been notified!');
    } catch (error) {
      toast.error('Failed to call server');
    }
  };

  const handleRequestBill = async () => {
    try {
      await requestBill('Customer requests bill');
      toast.success('Bill request sent!');
    } catch (error) {
      toast.error('Failed to request bill');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        {/* Top Bar */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 -ml-2 text-gray-600"
            >
              {showMenu ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Menu</h1>
              {session && (
                <p className="text-xs text-gray-500">
                  Table {session.tableId}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowCart(true)}
            className="relative p-2 text-gray-600"
          >
            <ShoppingCartIcon className="h-6 w-6" />
            {cart.totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.totalItems}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories Scroll */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 px-4 pb-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Side Menu Drawer */}
      {showMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowMenu(false)}>
          <div
            className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Quick Actions</h2>
              {session && (
                <p className="text-sm text-gray-500">Table {session.tableId}</p>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  handleCallServer();
                  setShowMenu(false);
                }}
                className="w-full flex items-center px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100"
              >
                <PhoneIcon className="h-5 w-5 mr-3" />
                Call Server
              </button>

              <button
                onClick={() => {
                  handleRequestBill();
                  setShowMenu(false);
                }}
                className="w-full flex items-center px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
              >
                <ReceiptPercentIcon className="h-5 w-5 mr-3" />
                Request Bill
              </button>

              <button
                onClick={() => {
                  setShowCart(true);
                  setShowMenu(false);
                }}
                className="w-full flex items-center px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-3" />
                View Cart ({cart.totalItems})
              </button>
            </div>

            {session && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Session Info</h3>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Started: {new Date(session.startedAt).toLocaleTimeString()}</p>
                  <p>Customers: {session.customerCount}</p>
                  {session.customerName && <p>Name: {session.customerName}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="pt-48 px-4">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2 text-4xl">🍽️</div>
            <p className="text-gray-500">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Floating Cart Button (Mobile) */}
      {cart.totalItems > 0 && (
        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full shadow-lg px-6 py-4 flex items-center space-x-3 hover:bg-indigo-700 transition-colors z-30"
        >
          <ShoppingCartIcon className="h-6 w-6" />
          <div>
            <div className="text-sm font-semibold">{cart.totalItems} items</div>
            <div className="text-xs">${cart.total.toFixed(2)}</div>
          </div>
        </button>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={showCart}
        onClose={() => setShowCart(false)}
      />
    </div>
  );
};

export default MobileMenu;
