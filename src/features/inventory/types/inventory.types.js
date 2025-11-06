/**
 * Inventory Types
 * JSDoc type definitions for inventory-related data structures
 */

/**
 * @typedef {'purchase'|'sale'|'adjustment'|'return'|'damage'|'write_off'|'transfer_in'|'transfer_out'|'production'|'consumption'} TransactionType
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
 * @property {string} [serialNumber] - Serial number for individual item tracking (optional)
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
  WRITE_OFF: 'write_off',
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
  write_off: 'Write-Off',
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
  TRANSACTION_TYPES.WRITE_OFF,
  TRANSACTION_TYPES.TRANSFER_OUT,
  TRANSACTION_TYPES.CONSUMPTION
];

/**
 * @typedef {Object} SerialNumber
 * @property {string} id - Unique serial number ID
 * @property {string} serialNumber - Serial number value
 * @property {string} productId - Product ID
 * @property {string} productName - Product name
 * @property {string} productSku - Product SKU
 * @property {string} batchNumber - Associated batch number
 * @property {string} locationId - Current location ID
 * @property {string} locationName - Current location name
 * @property {Date|string} [expiryDate] - Expiry date (optional)
 * @property {'in_stock'|'sold'|'damaged'|'written_off'|'transferred'} status - Serial number status
 * @property {Date|string} receivedDate - Date received
 * @property {Date|string} [soldDate] - Date sold (if applicable)
 * @property {string} [soldTo] - Customer ID/name (if sold)
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} InventoryAlert
 * @property {string} id - Alert ID
 * @property {'low_stock'|'out_of_stock'|'reorder_point'|'expiring_soon'|'expired'|'overstock'} type - Alert type
 * @property {'pending'|'acknowledged'|'resolved'|'dismissed'} status - Alert status
 * @property {'low'|'medium'|'high'|'critical'} priority - Alert priority
 * @property {string} productId - Product ID
 * @property {string} productName - Product name
 * @property {string} productSku - Product SKU
 * @property {string} [locationId] - Location ID (optional)
 * @property {string} [locationName] - Location name (optional)
 * @property {string} [batchNumber] - Batch number (for expiry alerts)
 * @property {number} [currentQuantity] - Current stock quantity
 * @property {number} [threshold] - Threshold that triggered alert
 * @property {Date|string} [expiryDate] - Expiry date (for expiry alerts)
 * @property {string} message - Alert message
 * @property {Date|string} triggeredAt - When alert was triggered
 * @property {Date|string} [acknowledgedAt] - When alert was acknowledged
 * @property {Date|string} [resolvedAt] - When alert was resolved
 * @property {string} [acknowledgedBy] - User who acknowledged
 * @property {string} [resolvedBy] - User who resolved
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CycleCount
 * @property {string} id - Cycle count ID
 * @property {string} name - Cycle count name/description
 * @property {'scheduled'|'in_progress'|'completed'|'cancelled'} status - Cycle count status
 * @property {string} locationId - Location ID
 * @property {string} locationName - Location name
 * @property {Date|string} scheduledDate - Scheduled date
 * @property {Date|string} [startDate] - Actual start date
 * @property {Date|string} [endDate] - Actual end date
 * @property {string} [assignedTo] - User ID assigned to perform count
 * @property {string} [assignedToName] - User name assigned
 * @property {CycleCountItem[]} items - Items to count
 * @property {number} totalItems - Total items to count
 * @property {number} countedItems - Items already counted
 * @property {number} varianceCount - Number of items with variance
 * @property {string} notes - Notes
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 * @property {string} createdBy - User who created
 * @property {string} [completedBy] - User who completed
 */

/**
 * @typedef {Object} CycleCountItem
 * @property {string} id - Item ID
 * @property {string} productId - Product ID
 * @property {string} productName - Product name
 * @property {string} productSku - Product SKU
 * @property {number} systemQuantity - Quantity in system
 * @property {number} [countedQuantity] - Actual counted quantity
 * @property {number} [variance] - Difference (counted - system)
 * @property {string} [batchNumber] - Batch number (optional)
 * @property {Date|string} [expiryDate] - Expiry date (optional)
 * @property {'pending'|'counted'|'verified'} status - Item count status
 * @property {string} notes - Notes for this item
 * @property {Date|string} [countedAt] - When counted
 * @property {string} [countedBy] - Who counted
 */

/**
 * @typedef {Object} PhysicalInventory
 * @property {string} id - Physical inventory ID
 * @property {string} name - Inventory name/description
 * @property {'scheduled'|'in_progress'|'completed'|'cancelled'} status - Inventory status
 * @property {string} locationId - Location ID
 * @property {string} locationName - Location name
 * @property {Date|string} scheduledDate - Scheduled date
 * @property {Date|string} [startDate] - Actual start date
 * @property {Date|string} [endDate] - Actual end date
 * @property {string[]} assignedTeam - User IDs assigned
 * @property {PhysicalInventoryItem[]} items - All items in inventory
 * @property {number} totalItems - Total items
 * @property {number} countedItems - Items counted
 * @property {number} varianceCount - Items with variance
 * @property {number} totalVarianceValue - Total value of variances
 * @property {boolean} requireApproval - Whether variances need approval
 * @property {boolean} [approved] - Whether approved (if required)
 * @property {string} [approvedBy] - Who approved
 * @property {Date|string} [approvedAt] - When approved
 * @property {string} notes - Notes
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 * @property {string} createdBy - User who created
 * @property {string} [completedBy] - User who completed
 */

/**
 * @typedef {Object} PhysicalInventoryItem
 * @property {string} id - Item ID
 * @property {string} productId - Product ID
 * @property {string} productName - Product name
 * @property {string} productSku - Product SKU
 * @property {number} systemQuantity - Quantity in system
 * @property {number} [countedQuantity] - Actual counted quantity
 * @property {number} [variance] - Difference (counted - system)
 * @property {number} unitCost - Unit cost
 * @property {number} [varianceValue] - Value of variance
 * @property {string} [batchNumber] - Batch number (optional)
 * @property {Date|string} [expiryDate] - Expiry date (optional)
 * @property {'pending'|'counted'|'verified'|'approved'} status - Item status
 * @property {string} notes - Notes for this item
 * @property {Date|string} [countedAt] - When counted
 * @property {string} [countedBy] - Who counted
 */

/**
 * @typedef {Object} ReorderNotification
 * @property {string} id - Notification ID
 * @property {string} productId - Product ID
 * @property {string} productName - Product name
 * @property {string} productSku - Product SKU
 * @property {string} locationId - Location ID
 * @property {string} locationName - Location name
 * @property {number} currentQuantity - Current stock quantity
 * @property {number} reorderPoint - Reorder point threshold
 * @property {number} reorderQuantity - Suggested reorder quantity
 * @property {number} averageDailySales - Average daily sales
 * @property {number} leadTimeDays - Lead time in days
 * @property {string} [supplier] - Preferred supplier
 * @property {number} estimatedCost - Estimated reorder cost
 * @property {'pending'|'ordered'|'dismissed'} status - Notification status
 * @property {string} [purchaseOrderId] - Created PO ID (if ordered)
 * @property {Date|string} triggeredAt - When notification was triggered
 * @property {Date|string} [orderedAt] - When order was placed
 * @property {Date|string} [dismissedAt] - When dismissed
 * @property {string} [orderedBy] - User who placed order
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} StockAlert
 * @property {string} id - Alert ID
 * @property {string} type - Alert type
 * @property {string} message - Alert message
 * @property {string} priority - Alert priority
 * @property {Date|string} createdAt - Creation timestamp
 */
