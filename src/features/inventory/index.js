/**
 * Inventory Feature Module
 *
 * Manages inventory tracking, stock levels, transactions, and reordering
 *
 * Public API:
 * - Components: InventoryTransactionList, StockLevelsList
 * - Hooks: useInventory, useInventoryForm
 * - Services: inventoryService
 * - Types: Transaction types, Stock level types, etc.
 */

// Export components
export { InventoryTransactionList, InventoryTransactionForm, StockLevelsList } from './components';

// Export hooks
export { useInventory, useInventoryForm } from './hooks';

// Export services
export { inventoryService } from './services';

// Export types and constants
export {
  TRANSACTION_TYPES,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_STATUS_LABELS,
  STOCK_IN_TYPES,
  STOCK_OUT_TYPES
} from './types';
