import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute } from './features/auth';
import { LoginPage, UnauthorizedPage } from './pages';
import MainLayout from './layouts/MainLayout';
import BranchPage from './pages/BranchPage';
import DashboardPage from './pages/DashboardPage';
import RolesPage from './pages/RolesPage';
import UsersPage from './pages/UsersPage';
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
          <Route path="branches" element={<BranchPage />} />

          {/* User & Role Management */}
          <Route path="users" element={<UsersPage />} />
          <Route path="roles" element={<RolesPage />} />

          {/* Products Management */}
          <Route path="products" element={<ProductsPage />} />

          {/* Inventory Management */}
          <Route path="inventory" element={<InventoryPage />} />

          {/* Purchase/Procurement Management */}
          <Route path="suppliers" element={<SuppliersPage />} />
          <Route path="purchase-orders" element={<PurchaseOrdersPage />} />

          {/* POS (Point of Sale) */}
          <Route path="pos" element={<POSPage />} />
          <Route path="pos/fast-checkout" element={<FastCheckoutPOS />} />

          {/* Restaurant Orders */}
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/new" element={<NewOrder />} />
          <Route path="orders/:orderId" element={<OrderDetails />} />
          <Route path="orders-dashboard" element={<OrdersDashboard />} />

          {/* Customers Management */}
          <Route path="customers" element={<CustomersPage />} />

          {/* Reports Management */}
          <Route path="reports" element={<ReportsPage />} />

          {/* Demo Data Overview */}
          <Route path="demo-data" element={<DemoDataPage />} />

          {/* Financial Management */}
          <Route path="financial" element={<FinancialDashboard />} />
          <Route path="invoices" element={<FinancialDashboard />} />
          <Route path="payments" element={<FinancialDashboard />} />
          <Route path="expenses" element={<FinancialDashboard />} />
          <Route path="financial-reports" element={<FinancialDashboard />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />

          {/* Restaurant Management */}
          <Route path="tables" element={<TablesPage />} />
          <Route path="floor-plan" element={<FloorPlanPage />} />

          {/* QR Ordering Management */}
          <Route path="qr-codes" element={<QRCodeList />} />
          <Route path="qr-analytics" element={<QRAnalyticsDashboard />} />

          {/* Kitchen Display System */}
          <Route path="kitchen-display" element={<KitchenDisplayPage />} />

          {/* Recipe Management */}
          <Route path="recipes" element={<RecipeList />} />
          <Route path="recipes/new" element={<RecipeForm />} />
          <Route path="recipes/:id" element={<RecipeDetails />} />
          <Route path="recipes/:id/edit" element={<RecipeForm />} />
          <Route path="recipes/reports" element={<RecipeCostingReport />} />

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
