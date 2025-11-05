import {
  TRANSACTION_TYPES,
  TRANSACTION_STATUSES,
  STOCK_IN_TYPES,
  STOCK_OUT_TYPES
} from '../types/inventory.types.js';

/**
 * Mock delay to simulate network latency
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate unique ID
 * @returns {string}
 */
const generateId = () => `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Mock inventory transactions data
 */
let MOCK_TRANSACTIONS = [
  {
    id: 'inv_001',
    productId: 'prod_001',
    productName: 'Premium Yoga Mat - Ocean Blue',
    productSku: 'YM-001-BLU',
    type: TRANSACTION_TYPES.PURCHASE,
    quantity: 50,
    unitCost: 25.00,
    totalCost: 1250.00,
    balanceAfter: 50,
    batchNumber: 'BATCH-2024-001',
    expiryDate: null,
    locationId: 'loc_001',
    locationName: 'Main Store',
    referenceType: 'purchase_order',
    referenceId: 'PO-2024-001',
    referenceNumber: 'PO-2024-001',
    notes: 'Initial stock purchase for new store opening',
    status: TRANSACTION_STATUSES.COMPLETED,
    transactionDate: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    createdBy: 'user_001',
    updatedBy: 'user_001',
    createdByName: 'Admin User'
  },
  {
    id: 'inv_002',
    productId: 'prod_001',
    productName: 'Premium Yoga Mat - Ocean Blue',
    productSku: 'YM-001-BLU',
    type: TRANSACTION_TYPES.SALE,
    quantity: 5,
    unitCost: 25.00,
    totalCost: 125.00,
    balanceAfter: 45,
    locationId: 'loc_001',
    locationName: 'Main Store',
    referenceType: 'sale',
    referenceId: 'SALE-2024-001',
    referenceNumber: 'SALE-2024-001',
    notes: 'Regular customer purchase',
    status: TRANSACTION_STATUSES.COMPLETED,
    transactionDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'user_002',
    updatedBy: 'user_002',
    createdByName: 'Staff User'
  },
  {
    id: 'inv_003',
    productId: 'prod_003',
    productName: 'Cork Yoga Block (Set of 2)',
    productSku: 'YB-001-CORK',
    type: TRANSACTION_TYPES.PURCHASE,
    quantity: 80,
    unitCost: 12.00,
    totalCost: 960.00,
    balanceAfter: 80,
    batchNumber: 'BATCH-2024-002',
    locationId: 'loc_001',
    locationName: 'Main Store',
    referenceType: 'purchase_order',
    referenceId: 'PO-2024-002',
    referenceNumber: 'PO-2024-002',
    notes: 'Bulk purchase from EcoYoga Ltd.',
    status: TRANSACTION_STATUSES.COMPLETED,
    transactionDate: new Date('2024-01-18'),
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
    createdBy: 'user_001',
    updatedBy: 'user_001',
    createdByName: 'Admin User'
  },
  {
    id: 'inv_004',
    productId: 'prod_004',
    productName: 'Adjustable Yoga Strap - Black',
    productSku: 'YS-001-BLK',
    type: TRANSACTION_TYPES.ADJUSTMENT,
    quantity: -2,
    unitCost: 6.00,
    totalCost: -12.00,
    balanceAfter: 8,
    locationId: 'loc_001',
    locationName: 'Main Store',
    notes: 'Damaged items during unpacking - discarded',
    status: TRANSACTION_STATUSES.COMPLETED,
    transactionDate: new Date('2024-02-02'),
    createdAt: new Date('2024-02-02'),
    updatedAt: new Date('2024-02-02'),
    createdBy: 'user_002',
    updatedBy: 'user_002',
    createdByName: 'Staff User'
  },
  {
    id: 'inv_005',
    productId: 'prod_010',
    productName: 'Plant-Based Protein Powder - Vanilla',
    productSku: 'SUP-001-PRO',
    type: TRANSACTION_TYPES.SALE,
    quantity: 5,
    unitCost: 22.00,
    totalCost: 110.00,
    balanceAfter: 0,
    locationId: 'loc_001',
    locationName: 'Main Store',
    referenceType: 'sale',
    referenceId: 'SALE-2024-015',
    referenceNumber: 'SALE-2024-015',
    notes: 'Last units sold - need reorder',
    status: TRANSACTION_STATUSES.COMPLETED,
    transactionDate: new Date('2024-02-14'),
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-14'),
    createdBy: 'user_002',
    updatedBy: 'user_002',
    createdByName: 'Staff User'
  },
  {
    id: 'inv_006',
    productId: 'prod_002',
    productName: 'Premium Yoga Mat - Purple Lavender',
    productSku: 'YM-002-PUR',
    type: TRANSACTION_TYPES.TRANSFER_IN,
    quantity: 10,
    unitCost: 25.00,
    totalCost: 250.00,
    balanceAfter: 42,
    locationId: 'loc_001',
    locationName: 'Main Store',
    referenceType: 'transfer',
    referenceId: 'TRF-2024-001',
    referenceNumber: 'TRF-2024-001',
    notes: 'Transfer from warehouse',
    status: TRANSACTION_STATUSES.COMPLETED,
    transactionDate: new Date('2024-02-10'),
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    createdBy: 'user_001',
    updatedBy: 'user_001',
    createdByName: 'Admin User'
  },
  {
    id: 'inv_007',
    productId: 'prod_005',
    productName: 'Yoga Wheel - Deep Blue',
    productSku: 'YW-001-BLU',
    type: TRANSACTION_TYPES.RETURN,
    quantity: 2,
    unitCost: 20.00,
    totalCost: 40.00,
    balanceAfter: 20,
    locationId: 'loc_001',
    locationName: 'Main Store',
    referenceType: 'return',
    referenceId: 'RET-2024-001',
    referenceNumber: 'RET-2024-001',
    notes: 'Customer return - unopened items',
    status: TRANSACTION_STATUSES.COMPLETED,
    transactionDate: new Date('2024-02-08'),
    createdAt: new Date('2024-02-08'),
    updatedAt: new Date('2024-02-08'),
    createdBy: 'user_002',
    updatedBy: 'user_002',
    createdByName: 'Staff User'
  }
];

/**
 * Mock stock levels data
 * Calculated from transactions
 */
let MOCK_STOCK_LEVELS = {};

/**
 * Calculate stock levels from transactions
 */
const calculateStockLevels = () => {
  const stockLevels = {};

  // Group transactions by product and location
  MOCK_TRANSACTIONS.forEach((transaction) => {
    if (transaction.status !== TRANSACTION_STATUSES.COMPLETED) return;

    const key = `${transaction.productId}_${transaction.locationId || 'default'}`;

    if (!stockLevels[key]) {
      stockLevels[key] = {
        productId: transaction.productId,
        productName: transaction.productName,
        productSku: transaction.productSku,
        locationId: transaction.locationId,
        locationName: transaction.locationName,
        quantity: 0,
        lowStockThreshold: 10,
        reorderPoint: 15,
        reorderQuantity: 50,
        totalCost: 0,
        transactionCount: 0,
        lastRestockedAt: null,
        lastSoldAt: null,
        updatedAt: transaction.transactionDate
      };
    }

    const level = stockLevels[key];

    // Adjust quantity based on transaction type
    if (STOCK_IN_TYPES.includes(transaction.type)) {
      level.quantity += transaction.quantity;
      level.lastRestockedAt = transaction.transactionDate;
    } else if (STOCK_OUT_TYPES.includes(transaction.type)) {
      level.quantity -= transaction.quantity;
      if (transaction.type === TRANSACTION_TYPES.SALE) {
        level.lastSoldAt = transaction.transactionDate;
      }
    } else if (transaction.type === TRANSACTION_TYPES.ADJUSTMENT) {
      level.quantity += transaction.quantity;
    }

    level.totalCost += (transaction.quantity * transaction.unitCost);
    level.transactionCount++;

    if (new Date(transaction.transactionDate) > new Date(level.updatedAt)) {
      level.updatedAt = transaction.transactionDate;
    }
  });

  // Calculate derived properties
  Object.values(stockLevels).forEach((level) => {
    level.averageCost = level.transactionCount > 0 ? level.totalCost / level.transactionCount : 0;
    level.totalValue = level.quantity * level.averageCost;
    level.isLowStock = level.quantity > 0 && level.quantity <= level.lowStockThreshold;
    level.isOutOfStock = level.quantity === 0;
  });

  MOCK_STOCK_LEVELS = stockLevels;
  return stockLevels;
};

// Initialize stock levels
calculateStockLevels();

/**
 * Calculate inventory statistics
 * @returns {Object} Inventory statistics
 */
const calculateStats = (transactions, stockLevels) => {
  const stats = {
    totalTransactions: transactions.length,
    totalProducts: Object.keys(stockLevels).length,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalInventoryValue: 0,
    totalPurchaseValue: 0,
    totalSaleValue: 0,
    totalAdjustmentValue: 0,
    transactionsByType: {},
    valueByLocation: {},
    topMovingProducts: [],
    recentTransactions: []
  };

  // Stock level stats
  Object.values(stockLevels).forEach((level) => {
    if (level.isLowStock) stats.lowStockProducts++;
    if (level.isOutOfStock) stats.outOfStockProducts++;
    stats.totalInventoryValue += level.totalValue;

    // Value by location
    const locKey = level.locationName || 'Unknown';
    stats.valueByLocation[locKey] = (stats.valueByLocation[locKey] || 0) + level.totalValue;
  });

  // Transaction stats
  transactions.forEach((transaction) => {
    if (transaction.status !== TRANSACTION_STATUSES.COMPLETED) return;

    // Count by type
    stats.transactionsByType[transaction.type] =
      (stats.transactionsByType[transaction.type] || 0) + 1;

    // Value by type
    if (transaction.type === TRANSACTION_TYPES.PURCHASE) {
      stats.totalPurchaseValue += transaction.totalCost;
    } else if (transaction.type === TRANSACTION_TYPES.SALE) {
      stats.totalSaleValue += transaction.totalCost;
    } else if (transaction.type === TRANSACTION_TYPES.ADJUSTMENT) {
      stats.totalAdjustmentValue += Math.abs(transaction.totalCost);
    }
  });

  // Recent transactions (last 5)
  stats.recentTransactions = transactions
    .filter(t => t.status === TRANSACTION_STATUSES.COMPLETED)
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
    .slice(0, 5)
    .map(t => ({
      id: t.id,
      productName: t.productName,
      type: t.type,
      quantity: t.quantity,
      transactionDate: t.transactionDate
    }));

  // Top moving products (by transaction count)
  const productMovement = {};
  transactions.forEach((t) => {
    if (t.status === TRANSACTION_STATUSES.COMPLETED) {
      productMovement[t.productId] = productMovement[t.productId] || {
        productId: t.productId,
        productName: t.productName,
        productSku: t.productSku,
        transactionCount: 0,
        totalQuantity: 0
      };
      productMovement[t.productId].transactionCount++;
      productMovement[t.productId].totalQuantity += Math.abs(t.quantity);
    }
  });

  stats.topMovingProducts = Object.values(productMovement)
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, 5);

  return stats;
};

/**
 * Inventory Service
 * Mock service for inventory CRUD operations
 */
export const inventoryService = {
  /**
   * Get all inventory transactions with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of transactions
   */
  async getTransactions(filters = {}) {
    await delay(400);

    let result = [...MOCK_TRANSACTIONS];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((transaction) =>
        transaction.productName.toLowerCase().includes(searchLower) ||
        transaction.productSku.toLowerCase().includes(searchLower) ||
        transaction.referenceNumber?.toLowerCase().includes(searchLower) ||
        transaction.notes.toLowerCase().includes(searchLower)
      );
    }

    // Apply productId filter
    if (filters.productId) {
      result = result.filter((t) => t.productId === filters.productId);
    }

    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }

    // Apply location filter
    if (filters.locationId && filters.locationId !== 'all') {
      result = result.filter((t) => t.locationId === filters.locationId);
    }

    // Apply date range filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter((t) => new Date(t.transactionDate) >= startDate);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      result = result.filter((t) => new Date(t.transactionDate) <= endDate);
    }

    // Apply batch number filter
    if (filters.batchNumber) {
      result = result.filter((t) => t.batchNumber === filters.batchNumber);
    }

    // Apply reference number filter
    if (filters.referenceNumber) {
      result = result.filter((t) => t.referenceNumber?.includes(filters.referenceNumber));
    }

    // Apply sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        let aVal = a[filters.sortBy];
        let bVal = b[filters.sortBy];

        // Handle date sorting
        if (filters.sortBy === 'transactionDate' || filters.sortBy === 'createdAt') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (aVal < bVal) return -1 * sortOrder;
        if (aVal > bVal) return 1 * sortOrder;
        return 0;
      });
    } else {
      // Default sort by transaction date descending
      result.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
    }

    return result;
  },

  /**
   * Get a single transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise<Object>} Transaction object
   */
  async getTransactionById(id) {
    await delay(300);

    const transaction = MOCK_TRANSACTIONS.find((t) => t.id === id);
    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    return { ...transaction };
  },

  /**
   * Create a new inventory transaction
   * @param {Object} data - Transaction data
   * @returns {Promise<Object>} Created transaction
   */
  async createTransaction(data) {
    await delay(500);

    // Validation
    if (!data.productId) {
      throw new Error('Product ID is required');
    }
    if (!data.type) {
      throw new Error('Transaction type is required');
    }
    if (data.quantity === undefined || data.quantity === 0) {
      throw new Error('Quantity is required and must not be zero');
    }
    if (data.unitCost === undefined || data.unitCost < 0) {
      throw new Error('Unit cost is required');
    }

    // Get product info (in real app, would fetch from product service)
    // For mock, we'll use the productId as a key
    const productInfo = {
      productName: data.productName || `Product ${data.productId}`,
      productSku: data.productSku || data.productId
    };

    // Normalize quantity based on transaction type
    let normalizedQuantity = Math.abs(data.quantity);
    if (STOCK_OUT_TYPES.includes(data.type)) {
      normalizedQuantity = Math.abs(data.quantity);
    }

    // Calculate current balance
    const currentBalance = await this.getStockLevel(data.productId, data.locationId);
    const balanceAfter = STOCK_IN_TYPES.includes(data.type)
      ? currentBalance.quantity + normalizedQuantity
      : STOCK_OUT_TYPES.includes(data.type)
      ? currentBalance.quantity - normalizedQuantity
      : currentBalance.quantity + data.quantity; // For adjustments, use signed value

    // Check if we have enough stock for outbound transactions
    if (STOCK_OUT_TYPES.includes(data.type) && balanceAfter < 0) {
      throw new Error('Insufficient stock for this transaction');
    }

    const newTransaction = {
      id: generateId(),
      productId: data.productId,
      productName: productInfo.productName,
      productSku: productInfo.productSku,
      type: data.type,
      quantity: normalizedQuantity,
      unitCost: parseFloat(data.unitCost),
      totalCost: normalizedQuantity * parseFloat(data.unitCost),
      balanceAfter,
      batchNumber: data.batchNumber || null,
      expiryDate: data.expiryDate || null,
      locationId: data.locationId || null,
      locationName: data.locationName || (data.locationId ? `Location ${data.locationId}` : null),
      referenceType: data.referenceType || null,
      referenceId: data.referenceId || null,
      referenceNumber: data.referenceNumber || null,
      notes: data.notes || '',
      status: TRANSACTION_STATUSES.COMPLETED,
      transactionDate: data.transactionDate ? new Date(data.transactionDate) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user',
      updatedBy: 'current_user',
      createdByName: 'Current User'
    };

    MOCK_TRANSACTIONS.push(newTransaction);
    calculateStockLevels(); // Recalculate stock levels

    return { ...newTransaction };
  },

  /**
   * Update an existing transaction
   * @param {string} id - Transaction ID
   * @param {Object} data - Updated transaction data
   * @returns {Promise<Object>} Updated transaction
   */
  async update(id, data) {
    await delay(500);

    const index = MOCK_TRANSACTIONS.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    const transaction = MOCK_TRANSACTIONS[index];

    // Recalculate total cost if quantity or unit cost changed
    const quantity = data.quantity !== undefined ? Math.abs(data.quantity) : transaction.quantity;
    const unitCost = data.unitCost !== undefined ? parseFloat(data.unitCost) : transaction.unitCost;
    const totalCost = quantity * unitCost;

    const updatedTransaction = {
      ...transaction,
      ...data,
      id, // Ensure ID doesn't change
      quantity,
      unitCost,
      totalCost,
      updatedAt: new Date(),
      updatedBy: 'current_user'
    };

    MOCK_TRANSACTIONS[index] = updatedTransaction;
    calculateStockLevels(); // Recalculate stock levels

    return { ...updatedTransaction };
  },

  /**
   * Delete a transaction
   * @param {string} id - Transaction ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteTransaction(id) {
    await delay(400);

    const index = MOCK_TRANSACTIONS.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    MOCK_TRANSACTIONS.splice(index, 1);
    calculateStockLevels(); // Recalculate stock levels

    return true;
  },

  /**
   * Cancel a transaction (soft delete)
   * @param {string} id - Transaction ID
   * @returns {Promise<Object>} Cancelled transaction
   */
  async cancelTransaction(id) {
    await delay(400);

    const index = MOCK_TRANSACTIONS.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    MOCK_TRANSACTIONS[index].status = TRANSACTION_STATUSES.CANCELLED;
    MOCK_TRANSACTIONS[index].updatedAt = new Date();
    MOCK_TRANSACTIONS[index].updatedBy = 'current_user';

    calculateStockLevels(); // Recalculate stock levels

    return { ...MOCK_TRANSACTIONS[index] };
  },

  /**
   * Get stock levels with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of stock levels
   */
  async getStockLevels(filters = {}) {
    await delay(400);

    let result = Object.values(MOCK_STOCK_LEVELS);

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((level) =>
        level.productName.toLowerCase().includes(searchLower) ||
        level.productSku.toLowerCase().includes(searchLower)
      );
    }

    // Apply location filter
    if (filters.locationId && filters.locationId !== 'all') {
      result = result.filter((level) => level.locationId === filters.locationId);
    }

    // Apply low stock filter
    if (filters.lowStock) {
      result = result.filter((level) => level.isLowStock);
    }

    // Apply out of stock filter
    if (filters.outOfStock) {
      result = result.filter((level) => level.isOutOfStock);
    }

    // Apply sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        let aVal = a[filters.sortBy];
        let bVal = b[filters.sortBy];

        // Handle date sorting
        if (filters.sortBy === 'lastRestockedAt' || filters.sortBy === 'lastSoldAt') {
          aVal = aVal ? new Date(aVal).getTime() : 0;
          bVal = bVal ? new Date(bVal).getTime() : 0;
        }

        if (aVal < bVal) return -1 * sortOrder;
        if (aVal > bVal) return 1 * sortOrder;
        return 0;
      });
    }

    return result;
  },

  /**
   * Get stock level for a specific product and location
   * @param {string} productId - Product ID
   * @param {string} locationId - Location ID (optional)
   * @returns {Promise<Object>} Stock level object
   */
  async getStockLevel(productId, locationId = null) {
    await delay(300);

    const key = `${productId}_${locationId || 'default'}`;
    const level = MOCK_STOCK_LEVELS[key];

    if (!level) {
      // Return zero stock level if not found
      return {
        productId,
        locationId,
        quantity: 0,
        lowStockThreshold: 10,
        reorderPoint: 15,
        reorderQuantity: 50,
        isLowStock: true,
        isOutOfStock: true,
        averageCost: 0,
        totalValue: 0,
        lastRestockedAt: null,
        lastSoldAt: null,
        updatedAt: new Date()
      };
    }

    return { ...level };
  },

  /**
   * Get inventory statistics
   * @returns {Promise<Object>} Inventory statistics
   */
  async getStats() {
    await delay(300);
    return calculateStats(MOCK_TRANSACTIONS, MOCK_STOCK_LEVELS);
  },

  /**
   * Get low stock products
   * @returns {Promise<Array>} Products with low stock
   */
  async getLowStockProducts() {
    await delay(300);
    return Object.values(MOCK_STOCK_LEVELS).filter((level) => level.isLowStock);
  },

  /**
   * Get out of stock products
   * @returns {Promise<Array>} Out of stock products
   */
  async getOutOfStockProducts() {
    await delay(300);
    return Object.values(MOCK_STOCK_LEVELS).filter((level) => level.isOutOfStock);
  },

  /**
   * Create an inventory adjustment
   * @param {Object} adjustment - Adjustment data
   * @returns {Promise<Object>} Created transaction
   */
  async createAdjustment(adjustment) {
    return this.createTransaction({
      productId: adjustment.productId,
      type: TRANSACTION_TYPES.ADJUSTMENT,
      quantity: adjustment.quantity,
      unitCost: 0, // Adjustments typically don't have cost
      locationId: adjustment.locationId,
      notes: `${adjustment.reason}: ${adjustment.notes}`,
      transactionDate: new Date()
    });
  },

  /**
   * Transfer stock between locations
   * @param {Object} transfer - Transfer data
   * @returns {Promise<Object>} Transfer result with both transactions
   */
  async transferStock(transfer) {
    await delay(500);

    // Validate
    if (!transfer.productId) throw new Error('Product ID is required');
    if (!transfer.fromLocationId) throw new Error('Source location is required');
    if (!transfer.toLocationId) throw new Error('Destination location is required');
    if (transfer.fromLocationId === transfer.toLocationId) {
      throw new Error('Source and destination locations must be different');
    }
    if (!transfer.quantity || transfer.quantity <= 0) {
      throw new Error('Transfer quantity must be greater than zero');
    }

    // Check stock availability at source
    const sourceStock = await this.getStockLevel(transfer.productId, transfer.fromLocationId);
    if (sourceStock.quantity < transfer.quantity) {
      throw new Error('Insufficient stock at source location');
    }

    const refNumber = `TRF-${Date.now()}`;

    // Create transfer out transaction
    const transferOut = await this.createTransaction({
      productId: transfer.productId,
      productName: sourceStock.productName,
      productSku: sourceStock.productSku,
      type: TRANSACTION_TYPES.TRANSFER_OUT,
      quantity: transfer.quantity,
      unitCost: sourceStock.averageCost,
      locationId: transfer.fromLocationId,
      locationName: sourceStock.locationName,
      referenceType: 'transfer',
      referenceNumber: refNumber,
      notes: `Transfer to ${transfer.toLocationId}: ${transfer.notes}`
    });

    // Create transfer in transaction
    const transferIn = await this.createTransaction({
      productId: transfer.productId,
      productName: sourceStock.productName,
      productSku: sourceStock.productSku,
      type: TRANSACTION_TYPES.TRANSFER_IN,
      quantity: transfer.quantity,
      unitCost: sourceStock.averageCost,
      locationId: transfer.toLocationId,
      referenceType: 'transfer',
      referenceNumber: refNumber,
      notes: `Transfer from ${transfer.fromLocationId}: ${transfer.notes}`
    });

    return {
      transferOut,
      transferIn,
      referenceNumber: refNumber
    };
  }
};

export default inventoryService;
