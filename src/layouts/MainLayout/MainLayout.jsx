import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '@/components/navigation';
import { useStore } from '@/store';
import { selectUser, selectIsAuthenticated } from '@/store/selectors';

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
  const user = useStore(selectUser);
  const isAuthenticated = useStore(selectIsAuthenticated);

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Welcome back, {user.firstName || user.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {user.role}
                </span>
                <span className="ml-2">{user.email}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Last login: {new Date(user.lastLogin).toLocaleString()}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
