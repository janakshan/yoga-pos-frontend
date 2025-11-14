import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './features/auth';
import { RouteGuard } from './components/guards';
import BusinessTypeRoute from './components/common/BusinessTypeRoute';
import { BUSINESS_TYPES } from './types/business.types';
import { LoginPage, UnauthorizedPage } from './pages';
import MainLayout from './layouts/MainLayout';
import BranchPage from './pages/BranchPage';
import BranchDetailsPage from './pages/BranchDetailsPage';
import DashboardPage from './pages/DashboardPage';
import RolesPage from './pages/RolesPage';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import PermissionsPage from './pages/PermissionsPage';
import ProductsPage from './pages/ProductsPage';
import InventoryPage from './pages/InventoryPage';
import POSPage from './pages/POSPage';
import FastCheckoutPOS from './pages/FastCheckoutPOS';
import CustomerDisplayPage from './pages/CustomerDisplayPage';
import CustomersPage from './pages/CustomersPage';
import ReportsPage from './pages/ReportsPage';
import DemoDataPage from './pages/DemoDataPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { PurchaseOrdersPage } from './pages/PurchaseOrdersPage';
import FinancialDashboard from './pages/FinancialDashboard';
import SettingsPage from './features/settings/components/SettingsPage';
import { OrdersList, OrderDetails, NewOrder, OrdersDashboard } from './pages/restaurant-orders';
import TablesPage from './pages/TablesPage';
import FloorPlanPage from './pages/FloorPlanPage';
import autoBackupScheduler from './services/backup/autoBackupScheduler';
import { useStore } from './store';
// QR Ordering Components
import QRLanding from './features/qr-ordering/components/customer/QRLanding';
import MobileMenu from './features/qr-ordering/components/customer/MobileMenu';
import Checkout from './features/qr-ordering/components/customer/Checkout';
import OrderTracking from './features/qr-ordering/components/customer/OrderTracking';
import QRCodeList from './features/qr-ordering/components/admin/QRCodeList';
import QRAnalyticsDashboard from './features/qr-ordering/components/admin/QRAnalyticsDashboard';
// Kitchen Display System
import KitchenDisplayPage from './pages/KitchenDisplayPage';
// Recipe Management
import {
  RecipeList,
  RecipeForm,
  RecipeDetails,
  RecipeCostingReport,
} from './features/recipes/components';
// Server Management
import ServerManagement from './pages/ServerManagement';
import './App.css';

function App() {
  const backupSettings = useStore((state) => state.backupSettings);

  // Initialize auto-backup scheduler on app start
  useEffect(() => {
    if (backupSettings?.autoBackup) {
      autoBackupScheduler.init(backupSettings.autoBackup);
    }

    // Cleanup on unmount
    return () => {
      autoBackupScheduler.stop();
    };
  }, []);

  return (
    <Router>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/customer-display" element={<CustomerDisplayPage />} />

        {/* QR Ordering - Public Routes */}
        <Route path="/qr/:code" element={<QRLanding />} />
        <Route path="/qr/menu" element={<MobileMenu />} />
        <Route path="/qr/checkout" element={<Checkout />} />
        <Route path="/qr/order-tracking" element={<OrderTracking />} />

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
          <Route path="branches" element={<RouteGuard routePath="/branches"><BranchPage /></RouteGuard>} />
          <Route path="branches/:id" element={<RouteGuard routePath="/branches/:id"><BranchDetailsPage /></RouteGuard>} />

          {/* User & Role Management */}
          <Route path="users" element={<RouteGuard routePath="/users"><UsersPage /></RouteGuard>} />
          <Route path="users/:id" element={<RouteGuard routePath="/users/:id"><UserDetailPage /></RouteGuard>} />
          <Route path="roles" element={<RouteGuard routePath="/roles"><RolesPage /></RouteGuard>} />
          <Route path="permissions" element={<RouteGuard routePath="/permissions"><PermissionsPage /></RouteGuard>} />

          {/* Products Management */}
          <Route path="products" element={<RouteGuard routePath="/products"><ProductsPage /></RouteGuard>} />

          {/* Inventory Management */}
          <Route path="inventory" element={<RouteGuard routePath="/inventory"><InventoryPage /></RouteGuard>} />

          {/* Purchase/Procurement Management */}
          <Route path="suppliers" element={<RouteGuard routePath="/suppliers"><SuppliersPage /></RouteGuard>} />
          <Route path="purchase-orders" element={<RouteGuard routePath="/purchase-orders"><PurchaseOrdersPage /></RouteGuard>} />

          {/* POS (Point of Sale) */}
          <Route path="pos" element={<RouteGuard routePath="/pos"><POSPage /></RouteGuard>} />
          <Route path="pos/fast-checkout" element={<RouteGuard routePath="/pos/fast-checkout"><FastCheckoutPOS /></RouteGuard>} />

          {/* Restaurant Orders */}
          <Route path="orders" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><OrdersList /></BusinessTypeRoute>} />
          <Route path="orders/new" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><NewOrder /></BusinessTypeRoute>} />
          <Route path="orders/:orderId" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><OrderDetails /></BusinessTypeRoute>} />
          <Route path="orders-dashboard" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><OrdersDashboard /></BusinessTypeRoute>} />

          {/* Customers Management */}
          <Route path="customers" element={<RouteGuard routePath="/customers"><CustomersPage /></RouteGuard>} />

          {/* Reports Management */}
          <Route path="reports" element={<RouteGuard routePath="/reports"><ReportsPage /></RouteGuard>} />

          {/* Demo Data Overview */}
          <Route path="demo-data" element={<DemoDataPage />} />

          {/* Financial Management */}
          <Route path="financial" element={<RouteGuard routePath="/financial"><FinancialDashboard /></RouteGuard>} />
          <Route path="invoices" element={<RouteGuard routePath="/invoices"><FinancialDashboard /></RouteGuard>} />
          <Route path="payments" element={<RouteGuard routePath="/payments"><FinancialDashboard /></RouteGuard>} />
          <Route path="expenses" element={<RouteGuard routePath="/expenses"><FinancialDashboard /></RouteGuard>} />
          <Route path="financial-reports" element={<RouteGuard routePath="/financial-reports"><FinancialDashboard /></RouteGuard>} />

          {/* Settings */}
          <Route path="settings" element={<RouteGuard routePath="/settings"><SettingsPage /></RouteGuard>} />

          {/* Restaurant Management */}
          <Route path="tables" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><TablesPage /></BusinessTypeRoute>} />
          <Route path="floor-plan" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><FloorPlanPage /></BusinessTypeRoute>} />

          {/* QR Ordering Management */}
          <Route path="qr-codes" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><QRCodeList /></BusinessTypeRoute>} />
          <Route path="qr-analytics" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><QRAnalyticsDashboard /></BusinessTypeRoute>} />

          {/* Kitchen Display System */}
          <Route path="kitchen-display" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><KitchenDisplayPage /></BusinessTypeRoute>} />

          {/* Recipe Management */}
          <Route path="recipes" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><RecipeList /></BusinessTypeRoute>} />
          <Route path="recipes/new" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><RecipeForm /></BusinessTypeRoute>} />
          <Route path="recipes/:id" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><RecipeDetails /></BusinessTypeRoute>} />
          <Route path="recipes/:id/edit" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><RecipeForm /></BusinessTypeRoute>} />
          <Route path="recipes/reports" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><RecipeCostingReport /></BusinessTypeRoute>} />

          {/* Server Management */}
          <Route path="server-management" element={<BusinessTypeRoute requiredType={BUSINESS_TYPES.RESTAURANT}><ServerManagement /></BusinessTypeRoute>} />

          {/* Placeholder routes for other modules */}
          <Route path="bookings" element={<PlaceholderPage module="Bookings" />} />
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
      <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center border border-gray-100">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">{module} Module</h1>
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
