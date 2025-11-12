import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import inventoryService from '../services/inventoryService.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for inventory CRUD operations
 * @returns {Object} Inventory state and actions
 */
export const useInventory = () => {
  // State selectors
  const transactions = useStore((state) => state.inventoryTransactions);
  const stockLevels = useStore((state) => state.stockLevels);
  const selectedTransaction = useStore((state) => state.selectedTransaction);
  const isLoading = useStore((state) => state.inventoryLoading);
  const error = useStore((state) => state.inventoryError);
  const stats = useStore((state) => state.inventoryStats);

  // Action selectors
  const setInventoryTransactions = useStore((state) => state.setInventoryTransactions);
  const addInventoryTransaction = useStore((state) => state.addInventoryTransaction);
  const updateInventoryTransaction = useStore((state) => state.updateInventoryTransaction);
  const removeInventoryTransaction = useStore((state) => state.removeInventoryTransaction);
  const setStockLevels = useStore((state) => state.setStockLevels);
  const updateStockLevel = useStore((state) => state.updateStockLevel);
  const setSelectedTransaction = useStore((state) => state.setSelectedTransaction);
  const setInventoryLoading = useStore((state) => state.setInventoryLoading);
  const setInventoryError = useStore((state) => state.setInventoryError);
  const setInventoryStats = useStore((state) => state.setInventoryStats);
  const clearInventoryError = useStore((state) => state.clearInventoryError);

  /**
   * Fetch all transactions with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Transactions array
   */
  const fetchTransactions = useCallback(
    async (filters = {}) => {
      try {
        setInventoryLoading(true);
        setInventoryError(null);

        const data = await inventoryService.getTransactions(filters);
        setInventoryTransactions(data);

        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch inventory transactions';
        setInventoryError(message);
        toast.error(message);
        throw err;
      } finally {
        setInventoryLoading(false);
      }
    },
    [setInventoryTransactions, setInventoryLoading, setInventoryError]
  );

  /**
   * Fetch stock levels with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Stock levels array
   */
  const fetchStockLevels = useCallback(
    async (filters = {}) => {
      try {
        setInventoryLoading(true);
        setInventoryError(null);

        const data = await inventoryService.getStockLevels(filters);
        setStockLevels(data);

        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch stock levels';
        setInventoryError(message);
        toast.error(message);
        throw err;
      } finally {
        setInventoryLoading(false);
      }
    },
    [setStockLevels, setInventoryLoading, setInventoryError]
  );

  /**
   * Fetch inventory statistics
   * @returns {Promise<Object>} Inventory stats
   */
  const fetchInventoryStats = useCallback(async () => {
    try {
      const data = await inventoryService.getStats();
      setInventoryStats(data);
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch inventory statistics';
      toast.error(message);
      throw err;
    }
  }, [setInventoryStats]);

  /**
   * Fetch a single transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise<Object>} Transaction object
   */
  const fetchTransactionById = useCallback(
    async (id) => {
      try {
        setInventoryLoading(true);
        setInventoryError(null);

        const data = await inventoryService.getTransactionById(id);
        setSelectedTransaction(data);

        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch transaction';
        setInventoryError(message);
        toast.error(message);
        throw err;
      } finally {
        setInventoryLoading(false);
      }
    },
    [setSelectedTransaction, setInventoryLoading, setInventoryError]
  );

  /**
   * Create a new transaction
   * @param {Object} data - Transaction data
   * @returns {Promise<Object>} Created transaction
   */
  const createTransaction = useCallback(
    async (data) => {
      try {
        setInventoryLoading(true);
        setInventoryError(null);

        const newTransaction = await inventoryService.createTransaction(data);
        addInventoryTransaction(newTransaction);

        // Refresh stock levels
        await fetchStockLevels();

        toast.success('Transaction created successfully');
        return newTransaction;
      } catch (err) {
        const message = err.message || 'Failed to create transaction';
        setInventoryError(message);
        toast.error(message);
        throw err;
      } finally {
        setInventoryLoading(false);
      }
    },
    [addInventoryTransaction, setInventoryLoading, setInventoryError, fetchStockLevels]
  );

  /**
   * Update an existing transaction
   * @param {string} id - Transaction ID
   * @param {Object} data - Updated transaction data
   * @returns {Promise<Object>} Updated transaction
   */
  const updateTransaction = useCallback(
    async (id, data) => {
      try {
        setInventoryLoading(true);
        setInventoryError(null);

        const updatedTransaction = await inventoryService.update(id, data);
        updateInventoryTransaction(id, updatedTransaction);

        // Refresh stock levels
        await fetchStockLevels();

        toast.success('Transaction updated successfully');
        return updatedTransaction;
      } catch (err) {
        const message = err.message || 'Failed to update transaction';
        setInventoryError(message);
        toast.error(message);
        throw err;
      } finally {
        setInventoryLoading(false);
      }
    },
    [updateInventoryTransaction, setInventoryLoading, setInventoryError, fetchStockLevels]
  );

  /**
   * Delete a transaction
   * @param {string} id - Transaction ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteTransaction = useCallback(
    async (id) => {
      try {
        setInventoryLoading(true);
        setInventoryError(null);

        await inventoryService.deleteTransaction(id);
        removeInventoryTransaction(id);

        // Refresh stock levels
        await fetchStockLevels();

        toast.success('Transaction deleted successfully');
        return true;
      } catch (err) {
        const message = err.message || 'Failed to delete transaction';
        setInventoryError(message);
        toast.error(message);
        throw err;
      } finally {
        setInventoryLoading(false);
      }
    },
    [removeInventoryTransaction, setInventoryLoading, setInventoryError, fetchStockLevels]
  );

  /**
   * Cancel a transaction
   * @param {string} id - Transaction ID
   * @returns {Promise<Object>} Cancelled transaction
   */
  const cancelTransaction = useCallback(
    async (id) => {
      try {
        setInventoryLoading(true);
        setInventoryError(null);

        const cancelledTransaction = await inventoryService.cancelTransaction(id);
        updateInventoryTransaction(id, cancelledTransaction);

        // Refresh stock levels
        await fetchStockLevels();

        toast.success('Transaction cancelled successfully');
        return cancelledTransaction;
      } catch (err) {
        const message = err.message || 'Failed to cancel transaction';
        setInventoryError(message);
        toast.error(message);
        throw err;
      } finally {
        setInventoryLoading(false);
      }
    },
    [updateInventoryTransaction, setInventoryLoading, setInventoryError, fetchStockLevels]
  );

  /**
   * Create an inventory adjustment
   * @param {Object} adjustment - Adjustment data
   * @returns {Promise<Object>} Created transaction
   */
  const createAdjustment = useCallback(
    async (adjustment) => {
      try {
        setInventoryLoading(true);
        setInventoryError(null);

        const transaction = await inventoryService.createAdjustment(adjustment);
        addInventoryTransaction(transaction);

        // Refresh stock levels
        await fetchStockLevels();

        toast.success('Inventory adjusted successfully');
        return transaction;
      } catch (err) {
        const message = err.message || 'Failed to adjust inventory';
        setInventoryError(message);
        toast.error(message);
        throw err;
      } finally {
        setInventoryLoading(false);
      }
    },
    [addInventoryTransaction, setInventoryLoading, setInventoryError, fetchStockLevels]
  );

  /**
   * Transfer stock between locations
   * @param {Object} transfer - Transfer data
   * @returns {Promise<Object>} Transfer result
   */
  const transferStock = useCallback(
    async (transfer) => {
      try {
        setInventoryLoading(true);
        setInventoryError(null);

        const result = await inventoryService.transferStock(transfer);

        // Add both transactions to state
        addInventoryTransaction(result.transferOut);
        addInventoryTransaction(result.transferIn);

        // Refresh stock levels
        await fetchStockLevels();

        toast.success(`Stock transferred successfully (${result.referenceNumber})`);
        return result;
      } catch (err) {
        const message = err.message || 'Failed to transfer stock';
        setInventoryError(message);
        toast.error(message);
        throw err;
      } finally {
        setInventoryLoading(false);
      }
    },
    [addInventoryTransaction, setInventoryLoading, setInventoryError, fetchStockLevels]
  );

  /**
   * Get low stock products
   * @returns {Promise<Array>} Low stock products
   */
  const fetchLowStockProducts = useCallback(async () => {
    try {
      const data = await inventoryService.getLowStockProducts();
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch low stock products';
      toast.error(message);
      throw err;
    }
  }, []);

  /**
   * Get out of stock products
   * @returns {Promise<Array>} Out of stock products
   */
  const fetchOutOfStockProducts = useCallback(async () => {
    try {
      const data = await inventoryService.getOutOfStockProducts();
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch out of stock products';
      toast.error(message);
      throw err;
    }
  }, []);

  /**
   * Get stock level for a specific product
   * @param {string} productId - Product ID
   * @param {string} locationId - Location ID
   * @returns {Promise<Object>} Stock level
   */
  const fetchStockLevel = useCallback(async (productId, locationId = null) => {
    try {
      const data = await inventoryService.getStockLevel(productId, locationId);
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch stock level';
      toast.error(message);
      throw err;
    }
  }, []);

  /**
   * Select a transaction
   * @param {Object} transaction - Transaction to select
   */
  const selectTransaction = useCallback(
    (transaction) => {
      setSelectedTransaction(transaction);
    },
    [setSelectedTransaction]
  );

  /**
   * Clear selected transaction
   */
  const clearSelectedTransaction = useCallback(() => {
    setSelectedTransaction(null);
  }, [setSelectedTransaction]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    clearInventoryError();
  }, [clearInventoryError]);

  return {
    // State
    transactions,
    stockLevels,
    selectedTransaction,
    isLoading,
    error,
    stats,

    // Actions - Transactions
    fetchTransactions,
    fetchTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    cancelTransaction,

    // Actions - Stock Levels
    fetchStockLevels,
    fetchStockLevel,
    fetchLowStockProducts,
    fetchOutOfStockProducts,

    // Actions - Statistics
    fetchInventoryStats,

    // Actions - Special Operations
    createAdjustment,
    transferStock,

    // Utilities
    selectTransaction,
    clearSelectedTransaction,
    clearError
  };
};

export default useInventory;
