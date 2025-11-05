import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/navigation';
import { useAuthStore } from '@/store/slices/authSlice';

/**
 * MainLayout Component
 * Layout wrapper for authenticated pages with sidebar navigation
 *
 * Features:
 * - Sidebar navigation
 * - Protected route wrapper
 * - Main content area with Outlet for nested routes
 */
const MainLayout = () => {
  const { user, isAuthenticated } = useAuthStore();

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Welcome back, {user.firstName || user.name}
              </h2>
              <p className="text-sm text-gray-600">
                {user.role} • {user.email}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Last login: {new Date(user.lastLogin).toLocaleString()}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
