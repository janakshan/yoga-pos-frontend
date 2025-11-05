/**
 * Inventory Slice
 * Zustand slice for inventory state management
 */

export const createInventorySlice = (set, get) => ({
  // State
  inventoryTransactions: [],
  stockLevels: [],
  selectedTransaction: null,
  inventoryLoading: false,
  inventoryError: null,
  inventoryStats: {
    totalTransactions: 0,
    totalProducts: 0,
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
  },

  // Mutations (using Immer draft syntax)

  /**
   * Set inventory transactions list
   * @param {Array} transactions - Transactions array
   */
  setInventoryTransactions: (transactions) =>
    set((state) => {
      state.inventoryTransactions = transactions;
    }),

  /**
   * Add a new transaction
   * @param {Object} transaction - Transaction to add
   */
  addInventoryTransaction: (transaction) =>
    set((state) => {
      state.inventoryTransactions.unshift(transaction);
    }),

  /**
   * Update an existing transaction
   * @param {string} id - Transaction ID
   * @param {Object} updates - Fields to update
   */
  updateInventoryTransaction: (id, updates) =>
    set((state) => {
      const index = state.inventoryTransactions.findIndex((t) => t.id === id);
      if (index >= 0) {
        state.inventoryTransactions[index] = {
          ...state.inventoryTransactions[index],
          ...updates
        };
      }
    }),

  /**
   * Remove a transaction
   * @param {string} id - Transaction ID
   */
  removeInventoryTransaction: (id) =>
    set((state) => {
      state.inventoryTransactions = state.inventoryTransactions.filter((t) => t.id !== id);
    }),

  /**
   * Set stock levels list
   * @param {Array} levels - Stock levels array
   */
  setStockLevels: (levels) =>
    set((state) => {
      state.stockLevels = levels;
    }),

  /**
   * Update a single stock level
   * @param {string} productId - Product ID
   * @param {string} locationId - Location ID
   * @param {Object} updates - Fields to update
   */
  updateStockLevel: (productId, locationId, updates) =>
    set((state) => {
      const index = state.stockLevels.findIndex(
        (level) => level.productId === productId && level.locationId === locationId
      );
      if (index >= 0) {
        state.stockLevels[index] = {
          ...state.stockLevels[index],
          ...updates
        };
      }
    }),

  /**
   * Set selected transaction
   * @param {Object|null} transaction - Transaction to select or null to clear
   */
  setSelectedTransaction: (transaction) =>
    set((state) => {
      state.selectedTransaction = transaction;
    }),

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setInventoryLoading: (loading) =>
    set((state) => {
      state.inventoryLoading = loading;
    }),

  /**
   * Set error state
   * @param {string|null} error - Error message or null to clear
   */
  setInventoryError: (error) =>
    set((state) => {
      state.inventoryError = error;
    }),

  /**
   * Set inventory statistics
   * @param {Object} stats - Inventory statistics
   */
  setInventoryStats: (stats) =>
    set((state) => {
      state.inventoryStats = stats;
    }),

  // Getters (derived state)

  /**
   * Get transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Object|undefined} Transaction object
   */
  getTransactionById: (id) => {
    const state = get();
    return state.inventoryTransactions.find((t) => t.id === id);
  },

  /**
   * Get transactions by product ID
   * @param {string} productId - Product ID
   * @returns {Array} Transactions for product
   */
  getTransactionsByProduct: (productId) => {
    const state = get();
    return state.inventoryTransactions.filter((t) => t.productId === productId);
  },

  /**
   * Get transactions by type
   * @param {string} type - Transaction type
   * @returns {Array} Transactions of type
   */
  getTransactionsByType: (type) => {
    const state = get();
    return state.inventoryTransactions.filter((t) => t.type === type);
  },

  /**
   * Get transactions by location
   * @param {string} locationId - Location ID
   * @returns {Array} Transactions for location
   */
  getTransactionsByLocation: (locationId) => {
    const state = get();
    return state.inventoryTransactions.filter((t) => t.locationId === locationId);
  },

  /**
   * Get stock level for a product
   * @param {string} productId - Product ID
   * @param {string} locationId - Location ID
   * @returns {Object|undefined} Stock level object
   */
  getStockLevel: (productId, locationId = null) => {
    const state = get();
    return state.stockLevels.find(
      (level) => level.productId === productId && level.locationId === (locationId || null)
    );
  },

  /**
   * Get low stock items
   * @returns {Array} Stock levels that are low
   */
  getLowStockItems: () => {
    const state = get();
    return state.stockLevels.filter((level) => level.isLowStock);
  },

  /**
   * Get out of stock items
   * @returns {Array} Stock levels that are zero
   */
  getOutOfStockItems: () => {
    const state = get();
    return state.stockLevels.filter((level) => level.isOutOfStock);
  },

  /**
   * Get recent transactions
   * @param {number} count - Number of transactions to return
   * @returns {Array} Recent transactions
   */
  getRecentTransactions: (count = 10) => {
    const state = get();
    return state.inventoryTransactions
      .filter((t) => t.status === 'completed')
      .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
      .slice(0, count);
  },

  /**
   * Clear inventory error
   */
  clearInventoryError: () =>
    set((state) => {
      state.inventoryError = null;
    }),

  /**
   * Reset inventory state
   */
  resetInventoryState: () =>
    set((state) => {
      state.inventoryTransactions = [];
      state.stockLevels = [];
      state.selectedTransaction = null;
      state.inventoryLoading = false;
      state.inventoryError = null;
      state.inventoryStats = {
        totalTransactions: 0,
        totalProducts: 0,
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
    })
});

export default createInventorySlice;
