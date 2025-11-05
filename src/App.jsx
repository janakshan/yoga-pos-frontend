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
import './App.css';

function App() {
  return (
    <Router>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
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
    <div className="w-full">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{module} Module</h1>
        <p className="text-gray-600 mb-4">
          The {module} module is coming soon!
        </p>
        <p className="text-sm text-gray-500">
          This module is currently under development.
        </p>
      </div>
    </div>
  );
}

export default App;
