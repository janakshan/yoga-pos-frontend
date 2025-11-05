/**
 * Inventory Types
 * JSDoc type definitions for inventory-related data structures
 */

/**
 * @typedef {'purchase'|'sale'|'adjustment'|'return'|'damage'|'transfer_in'|'transfer_out'|'production'|'consumption'} TransactionType
 * Type of inventory transaction
 */

/**
 * @typedef {'pending'|'completed'|'cancelled'} TransactionStatus
 * Status of inventory transaction
 */

/**
 * @typedef {Object} InventoryTransaction
 * @property {string} id - Unique transaction identifier
 * @property {string} productId - Product ID
 * @property {string} productName - Product name (denormalized for quick display)
 * @property {string} productSku - Product SKU (denormalized)
 * @property {TransactionType} type - Transaction type
 * @property {number} quantity - Quantity (positive for in, negative for out)
 * @property {number} unitCost - Cost per unit at transaction time
 * @property {number} totalCost - Total cost (quantity * unitCost)
 * @property {number} balanceAfter - Stock balance after this transaction
 * @property {string} [batchNumber] - Batch/lot number (optional)
 * @property {Date|string} [expiryDate] - Expiry date for batch (optional)
 * @property {string} [locationId] - Location/branch ID
 * @property {string} [locationName] - Location name (denormalized)
 * @property {string} [referenceType] - Reference document type (e.g., 'purchase_order', 'sale', 'adjustment')
 * @property {string} [referenceId] - Reference document ID
 * @property {string} [referenceNumber] - Reference document number for display
 * @property {string} notes - Transaction notes
 * @property {TransactionStatus} status - Transaction status
 * @property {Date|string} transactionDate - Date of transaction
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 * @property {string} createdBy - User ID who created the transaction
 * @property {string} updatedBy - User ID who last updated the transaction
 * @property {string} [createdByName] - User name (denormalized)
 */

/**
 * @typedef {Object} StockLevel
 * @property {string} productId - Product ID
 * @property {string} productName - Product name
 * @property {string} productSku - Product SKU
 * @property {string} [locationId] - Location ID (null for total stock)
 * @property {string} [locationName] - Location name
 * @property {number} quantity - Current stock quantity
 * @property {number} lowStockThreshold - Alert threshold
 * @property {number} reorderPoint - Reorder point
 * @property {number} reorderQuantity - Suggested reorder quantity
 * @property {boolean} isLowStock - Whether stock is below threshold
 * @property {boolean} isOutOfStock - Whether stock is zero
 * @property {number} averageCost - Weighted average cost
 * @property {number} totalValue - Total inventory value (quantity * averageCost)
 * @property {Date|string} lastRestockedAt - Last restock date
 * @property {Date|string} lastSoldAt - Last sale date
 * @property {Date|string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CreateTransactionInput
 * @property {string} productId - Product ID
 * @property {TransactionType} type - Transaction type
 * @property {number} quantity - Quantity (use positive for in, negative for out, or system will auto-adjust)
 * @property {number} unitCost - Cost per unit
 * @property {string} [batchNumber] - Batch/lot number (optional)
 * @property {Date|string} [expiryDate] - Expiry date (optional)
 * @property {string} [locationId] - Location ID (optional)
 * @property {string} [referenceType] - Reference type (optional)
 * @property {string} [referenceId] - Reference ID (optional)
 * @property {string} [referenceNumber] - Reference number (optional)
 * @property {string} notes - Transaction notes
 * @property {Date|string} [transactionDate] - Transaction date (defaults to now)
 */

/**
 * @typedef {Object} UpdateTransactionInput
 * @property {TransactionType} [type] - Transaction type
 * @property {number} [quantity] - Quantity
 * @property {number} [unitCost] - Cost per unit
 * @property {string} [batchNumber] - Batch number
 * @property {Date|string} [expiryDate] - Expiry date
 * @property {string} [locationId] - Location ID
 * @property {string} [referenceType] - Reference type
 * @property {string} [referenceId] - Reference ID
 * @property {string} [referenceNumber] - Reference number
 * @property {string} [notes] - Notes
 * @property {TransactionStatus} [status] - Status
 * @property {Date|string} [transactionDate] - Transaction date
 */

/**
 * @typedef {Object} InventoryFilters
 * @property {string} [search] - Search term for product name or SKU
 * @property {string} [productId] - Filter by product ID
 * @property {TransactionType} [type] - Filter by transaction type
 * @property {TransactionStatus} [status] - Filter by status
 * @property {string} [locationId] - Filter by location
 * @property {Date|string} [startDate] - Filter from date
 * @property {Date|string} [endDate] - Filter to date
 * @property {string} [batchNumber] - Filter by batch number
 * @property {string} [referenceNumber] - Filter by reference number
 * @property {string} [sortBy] - Sort field (transactionDate, quantity, totalCost, productName)
 * @property {'asc'|'desc'} [sortOrder] - Sort order
 */

/**
 * @typedef {Object} StockLevelFilters
 * @property {string} [search] - Search term for product name or SKU
 * @property {string} [locationId] - Filter by location
 * @property {boolean} [lowStock] - Show only low stock items
 * @property {boolean} [outOfStock] - Show only out of stock items
 * @property {string} [sortBy] - Sort field (quantity, productName, totalValue, lastRestockedAt)
 * @property {'asc'|'desc'} [sortOrder] - Sort order
 */

/**
 * @typedef {Object} InventoryStats
 * @property {number} totalTransactions - Total number of transactions
 * @property {number} totalProducts - Total number of products with inventory
 * @property {number} lowStockProducts - Number of low stock products
 * @property {number} outOfStockProducts - Number of out of stock products
 * @property {number} totalInventoryValue - Total inventory value
 * @property {number} totalPurchaseValue - Total purchase value (period)
 * @property {number} totalSaleValue - Total sale value (period)
 * @property {number} totalAdjustmentValue - Total adjustment value (period)
 * @property {Object.<TransactionType, number>} transactionsByType - Count by type
 * @property {Object.<string, number>} valueByLocation - Inventory value by location
 * @property {Array<Object>} topMovingProducts - Top products by transaction volume
 * @property {Array<Object>} recentTransactions - Recent transactions summary
 */

/**
 * @typedef {Object} InventoryAdjustment
 * @property {string} productId - Product ID
 * @property {string} [locationId] - Location ID
 * @property {number} quantity - Adjustment quantity (positive or negative)
 * @property {string} reason - Adjustment reason
 * @property {string} notes - Additional notes
 */

/**
 * @typedef {Object} StockTransfer
 * @property {string} productId - Product ID
 * @property {string} fromLocationId - Source location ID
 * @property {string} toLocationId - Destination location ID
 * @property {number} quantity - Transfer quantity
 * @property {string} notes - Transfer notes
 */

export const TRANSACTION_TYPES = {
  PURCHASE: 'purchase',
  SALE: 'sale',
  ADJUSTMENT: 'adjustment',
  RETURN: 'return',
  DAMAGE: 'damage',
  TRANSFER_IN: 'transfer_in',
  TRANSFER_OUT: 'transfer_out',
  PRODUCTION: 'production',
  CONSUMPTION: 'consumption'
};

export const TRANSACTION_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const TRANSACTION_TYPE_LABELS = {
  purchase: 'Purchase',
  sale: 'Sale',
  adjustment: 'Adjustment',
  return: 'Return',
  damage: 'Damage',
  transfer_in: 'Transfer In',
  transfer_out: 'Transfer Out',
  production: 'Production',
  consumption: 'Consumption'
};

export const TRANSACTION_STATUS_LABELS = {
  pending: 'Pending',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

/**
 * Transaction types that increase stock
 */
export const STOCK_IN_TYPES = [
  TRANSACTION_TYPES.PURCHASE,
  TRANSACTION_TYPES.RETURN,
  TRANSACTION_TYPES.TRANSFER_IN,
  TRANSACTION_TYPES.PRODUCTION
];

/**
 * Transaction types that decrease stock
 */
export const STOCK_OUT_TYPES = [
  TRANSACTION_TYPES.SALE,
  TRANSACTION_TYPES.DAMAGE,
  TRANSACTION_TYPES.TRANSFER_OUT,
  TRANSACTION_TYPES.CONSUMPTION
];
