import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Sidebar } from '@/components/navigation';
import { useStore } from '@/store';
import { selectUser, selectIsAuthenticated } from '@/store/selectors';

/**
 * MainLayout Component
 * Layout wrapper for authenticated pages with sidebar navigation
 *
 * Features:
 * - Sidebar navigation with mobile drawer
 * - Protected route wrapper
 * - Main content area with Outlet for nested routes
 * - Responsive design for mobile devices
 */
const MainLayout = () => {
  const user = useStore(selectUser);
  const isAuthenticated = useStore(selectIsAuthenticated);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>

            {/* User Info */}
            <div className="flex-1 lg:flex-initial">
              <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
                Welcome back, {user.firstName || user.name}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {user.role}
                </span>
                <span className="ml-2">{user.email}</span>
              </p>
            </div>

            {/* Header Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-500 hidden md:block">
                Last login: {new Date(user.lastLogin).toLocaleString()}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
