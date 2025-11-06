import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './features/auth';
import { LoginPage, UnauthorizedPage } from './pages';
import MainLayout from './layouts/MainLayout';
import BranchPage from './pages/BranchPage';
import StaffPage from './pages/StaffPage';
import DashboardPage from './pages/DashboardPage';
import RolesPage from './pages/RolesPage';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import POSPage from './pages/POSPage';
import CustomersPage from './pages/CustomersPage';
import ReportsPage from './pages/ReportsPage';
import { useStore } from './store';
import './App.css';

function App() {
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, [setTheme]);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <Router>
      {/* Toast Notifications with theme support */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#374151' : '#ffffff',
            color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
            border: `1px solid ${theme === 'dark' ? '#4b5563' : '#e5e7eb'}`,
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: theme === 'dark' ? '#34d399' : '#10b981',
              secondary: theme === 'dark' ? '#1f2937' : '#ffffff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: theme === 'dark' ? '#f87171' : '#ef4444',
              secondary: theme === 'dark' ? '#1f2937' : '#ffffff',
            },
          },
        }}
      />

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Protected Routes with MainLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard - Default Route */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Branch Management */}
          <Route path="branches" element={<BranchPage />} />

          {/* Staff Management */}
          <Route path="staff" element={<StaffPage />} />

          {/* User & Role Management */}
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />

          {/* Products Management */}
          <Route path="products" element={<ProductsPage />} />

          {/* Inventory Management */}
          <Route path="inventory" element={<InventoryPage />} />

          {/* POS (Point of Sale) */}
          <Route path="pos" element={<POSPage />} />

          {/* Customers Management */}
          <Route path="customers" element={<CustomersPage />} />

          {/* Reports Management */}
          <Route path="reports" element={<ReportsPage />} />

          {/* Placeholder routes for other modules */}
          <Route path="bookings" element={<PlaceholderPage module="Bookings" />} />
          <Route path="payments" element={<PlaceholderPage module="Payments" />} />
          <Route path="settings" element={<PlaceholderPage module="Settings" />} />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

/**
 * Placeholder component for modules not yet implemented
 */
function PlaceholderPage({ module }) {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-6 sm:p-8 text-center border border-gray-100 dark:border-gray-700">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">{module} Module</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The {module} module is coming soon!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          This module is currently under development.
        </p>
      </div>
    </div>
  );
}

export default App;
