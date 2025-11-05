import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from './middleware';
import {
  createAuthSlice,
  createCartSlice,
  createUISlice,
  createSettingsSlice,
  createBranchSlice,
  createStaffSlice,
  createPermissionSlice,
  createRoleSlice,
  createUserSlice,
  createProductSlice,
  createInventorySlice,
  createPosSlice,
} from './slices';

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
        ...createBranchSlice(set, get, api),
        ...createStaffSlice(set, get, api),
        ...createPermissionSlice(set, get, api),
        ...createRoleSlice(set, get, api),
        ...createUserSlice(set, get, api),
        ...createProductSlice(set, get, api),
        ...createInventorySlice(set, get, api),
        ...createPosSlice(set, get, api),
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

          // UI (persist theme and sidebar preferences)
          theme: state.theme,
          isSidebarCollapsed: state.isSidebarCollapsed,

          // Settings (persist all settings)
          currency: state.currency,
          currencySymbol: state.currencySymbol,
          locale: state.locale,
          dateFormat: state.dateFormat,
          timeFormat: state.timeFormat,
          defaultTaxRate: state.defaultTaxRate,
          defaultPaymentMethod: state.defaultPaymentMethod,
          printReceipt: state.printReceipt,
          soundEnabled: state.soundEnabled,
          receiptFooter: state.receiptFooter,
          businessInfo: state.businessInfo,

          // Branch (persist branches and current branch selection)
          branches: state.branches,
          currentBranch: state.currentBranch,
          branchStats: state.branchStats,

          // Staff (persist staff list)
          staff: state.staff,
          staffStats: state.staffStats,

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

          // POS (persist transactions history and stats, but not cart)
          transactions: state.transactions,
          posStats: state.posStats,

          // Cart is NOT persisted (cleared on page refresh)
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
