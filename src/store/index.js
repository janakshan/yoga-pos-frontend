import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from './middleware';
import {
  createAuthSlice,
  createCartSlice,
  createUISlice,
  createSettingsSlice,
  createNotificationSlice,
  createBackupSlice,
  createBranchSlice,
  createPermissionSlice,
  createRoleSlice,
  createUserSlice,
  createProductSlice,
  createInventorySlice,
  createPosSlice,
  createCustomerSlice,
  createReportSlice,
  createSupplierSlice,
  createPurchaseOrderSlice,
} from './slices';
import { createAuditSlice } from '../features/audit/store/auditSlice.js';
import { createSessionSlice } from '../features/session/store/sessionSlice.js';
import {
  createInvoiceSlice,
  createPaymentSlice,
  createExpenseSlice,
  createTransactionSlice,
  createFinancialSlice,
} from '../features/financial/store/index.js';
import { createOrderSlice } from '../features/restaurant-orders/store/orderSlice.js';
import { createTableSlice } from '../features/restaurant/tables/store/tableSlice.js';
import { createFloorPlanSlice } from '../features/restaurant/floorplan/store/floorplanSlice.js';
import { createRestaurantSlice } from '../features/restaurant/store/restaurantSlice.js';

/**
 * Main Application Store
 * Combines all slices with middleware for persistence, devtools, and immutability
 */
export const useStore = create(
  devtools(
    persist(
      immer((set, get, api) => ({
        // Combine all slices
        ...createAuthSlice(set, get, api),
        ...createCartSlice(set, get, api),
        ...createUISlice(set, get, api),
        ...createSettingsSlice(set, get, api),
        ...createNotificationSlice(set, get, api),
        ...createBackupSlice(set, get, api),
        ...createBranchSlice(set, get, api),
        ...createPermissionSlice(set, get, api),
        ...createRoleSlice(set, get, api),
        ...createUserSlice(set, get, api),
        ...createProductSlice(set, get, api),
        ...createInventorySlice(set, get, api),
        ...createPosSlice(set, get, api),
        ...createCustomerSlice(set, get, api),
        ...createReportSlice(set, get, api),
        ...createSupplierSlice(set, get, api),
        ...createPurchaseOrderSlice(set, get, api),
        ...createAuditSlice(set, get, api),
        ...createSessionSlice(set, get, api),
        ...createInvoiceSlice(set, get, api),
        ...createPaymentSlice(set, get, api),
        ...createExpenseSlice(set, get, api),
        ...createTransactionSlice(set, get, api),
        ...createFinancialSlice(set, get, api),
        ...createOrderSlice(set, get, api),
        ...createTableSlice(set, get, api),
        ...createFloorPlanSlice(set, get, api),
        ...createRestaurantSlice(set, get, api),
      })),
      {
        name: 'yoga-pos-storage',
        // Persist specific slices
        partialize: (state) => ({
          // Auth (persist tokens and user)
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken,
          isAuthenticated: state.isAuthenticated,

          // UI (persist sidebar preferences)
          isSidebarCollapsed: state.isSidebarCollapsed,

          // Settings (persist all settings)
          businessType: state.businessType,
          currency: state.currency,
          currencySymbol: state.currencySymbol,
          locale: state.locale,
          language: state.language,
          dateFormat: state.dateFormat,
          timeFormat: state.timeFormat,
          defaultTaxRate: state.defaultTaxRate,
          defaultPaymentMethod: state.defaultPaymentMethod,
          printReceipt: state.printReceipt,
          soundEnabled: state.soundEnabled,
          receiptFooter: state.receiptFooter,
          receiptHeader: state.receiptHeader,
          businessInfo: state.businessInfo,
          restaurantSettings: state.restaurantSettings,
          currencies: state.currencies,
          baseCurrency: state.baseCurrency,
          enableMultiCurrency: state.enableMultiCurrency,
          branding: state.branding,
          hardware: state.hardware,

          // Branch (persist branches and current branch selection)
          branches: state.branches,
          currentBranch: state.currentBranch,
          branchStats: state.branchStats,

          // Permissions (persist permissions list)
          permissions: state.permissions,
          permissionGroups: state.permissionGroups,

          // Roles (persist roles list)
          roles: state.roles,
          roleStats: state.roleStats,

          // Users (persist users list)
          users: state.users,
          userStats: state.userStats,

          // Products (persist products list)
          products: state.products,
          productStats: state.productStats,

          // Inventory (persist transactions and stock levels)
          inventoryTransactions: state.inventoryTransactions,
          stockLevels: state.stockLevels,
          inventoryStats: state.inventoryStats,

          // POS (persist transactions, stats, and cart items for customer display)
          transactions: state.transactions,
          posStats: state.posStats,
          cartItems: state.cartItems,
          selectedCustomerId: state.selectedCustomerId,
          customerInfo: state.customerInfo,
          paymentMethod: state.paymentMethod,
          discountPercentage: state.discountPercentage,
          taxPercentage: state.taxPercentage,
          notes: state.notes,

          // Customers (persist customers list)
          customers: state.customers,
          customerStats: state.customerStats,

          // Reports (persist reports list)
          reports: state.reports,
          reportStats: state.reportStats,

          // Suppliers (persist suppliers list)
          suppliers: state.suppliers,
          supplierStats: state.supplierStats,

          // Purchase Orders (persist purchase orders list)
          purchaseOrders: state.purchaseOrders,
          purchaseOrderStats: state.purchaseOrderStats,
          purchaseAnalytics: state.purchaseAnalytics,

          // Audit Logs (do not persist - too large)
          // Only persist filters for convenience
          auditFilters: state.audit?.filters,

          // Sessions (persist current session only)
          currentSession: state.sessions?.current,

          // Financial - Invoices
          invoices: state.invoices,
          invoiceStats: state.invoiceStats,

          // Financial - Payments
          payments: state.payments,
          paymentStats: state.paymentStats,

          // Financial - Expenses
          expenses: state.expenses,
          expenseStats: state.expenseStats,
          expenseCategories: state.expenseCategories,

          // Financial - Transactions
          financialTransactions: state.financialTransactions,
          transactionStats: state.transactionStats,

          // Financial - General
          bankAccounts: state.bankAccounts,
          eodReports: state.eodReports,

          // Notifications
          notificationSettings: state.notificationSettings,
          notificationHistory: state.notificationHistory,
          notificationStats: state.notificationStats,

          // Backup
          backupSettings: state.backupSettings,
          backupStatus: state.backupStatus,
          backupStats: state.backupStats,

          // Restaurant Orders (persist active orders only)
          orders: state.orders,
          activeOrders: state.activeOrders,
          // Restaurant - Tables
          tables: state.tables,
          tableStats: state.tableStats,
          sections: state.sections,
          floors: state.floors,

          // Restaurant - Floor Plans
          floorPlans: state.floorPlans,
          activeFloorPlan: state.activeFloorPlan,
          // Restaurant (persist tables and orders)
          tables: state.tables,
          restaurantOrders: state.restaurantOrders,
          activeTableId: state.activeTableId,
        }),
      }
    ),
    {
      name: 'YogaPOS',
      enabled: import.meta.env.DEV,
    }
  )
);

/**
 * Session-specific cart store
 * Separate store for cart that uses sessionStorage
 * This allows cart to persist during the session but clear on browser close
 */
export const useCartStore = create(
  devtools(
    persist(
      immer((set, get, api) => ({
        ...createCartSlice(set, get, api),
      })),
      {
        name: 'yoga-pos-cart',
        getStorage: () => sessionStorage,
      }
    ),
    {
      name: 'YogaPOS-Cart',
      enabled: import.meta.env.DEV,
    }
  )
);

// Export selectors
export * from './selectors';
