import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import posService from '../services/posService.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for POS operations
 * @returns {Object} POS state and actions
 */
export const usePos = () => {
  // State selectors
  const cartItems = useStore((state) => state.cartItems);
  const transactions = useStore((state) => state.transactions);
  const currentTransaction = useStore((state) => state.currentTransaction);
  const selectedCustomerId = useStore((state) => state.selectedCustomerId);
  const customerInfo = useStore((state) => state.customerInfo);
  const paymentMethod = useStore((state) => state.paymentMethod);
  const paymentStatus = useStore((state) => state.paymentStatus);
  const discountPercentage = useStore((state) => state.discountPercentage);
  const taxPercentage = useStore((state) => state.taxPercentage);
  const notes = useStore((state) => state.notes);
  const amountPaid = useStore((state) => state.amountPaid);
  const isLoading = useStore((state) => state.posLoading);
  const error = useStore((state) => state.posError);
  const stats = useStore((state) => state.posStats);

  // Action selectors
  const addToCart = useStore((state) => state.addToCart);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const updateCartItemQuantity = useStore((state) => state.updateCartItemQuantity);
  const clearCart = useStore((state) => state.clearCart);
  const setSelectedCustomerId = useStore((state) => state.setSelectedCustomerId);
  const setCustomerInfo = useStore((state) => state.setCustomerInfo);
  const setPaymentMethod = useStore((state) => state.setPaymentMethod);
  const setPaymentStatus = useStore((state) => state.setPaymentStatus);
  const setDiscountPercentage = useStore((state) => state.setDiscountPercentage);
  const setTaxPercentage = useStore((state) => state.setTaxPercentage);
  const setNotes = useStore((state) => state.setNotes);
  const setAmountPaid = useStore((state) => state.setAmountPaid);
  const setTransactions = useStore((state) => state.setTransactions);
  const addTransaction = useStore((state) => state.addTransaction);
  const updateTransaction = useStore((state) => state.updateTransaction);
  const setCurrentTransaction = useStore((state) => state.setCurrentTransaction);
  const setPosLoading = useStore((state) => state.setPosLoading);
  const setPosError = useStore((state) => state.setPosError);
  const setPosStats = useStore((state) => state.setPosStats);
  const clearPosError = useStore((state) => state.clearPosError);

  // Getters
  const getCartTotals = useStore((state) => state.getCartTotals);
  const getCartItemCount = useStore((state) => state.getCartItemCount);

  /**
   * Add product to cart
   * @param {Object} product - Product to add
   */
  const handleAddToCart = useCallback(
    (product) => {
      try {
        if (product.trackInventory && product.stockQuantity === 0) {
          toast.error('Product is out of stock');
          return;
        }

        addToCart(product);
        toast.success(`${product.name} added to cart`);
      } catch (err) {
        const message = err.message || 'Failed to add item to cart';
        toast.error(message);
      }
    },
    [addToCart]
  );

  /**
   * Remove item from cart
   * @param {string} cartItemId - Cart item ID
   */
  const handleRemoveFromCart = useCallback(
    (cartItemId) => {
      try {
        removeFromCart(cartItemId);
        toast.success('Item removed from cart');
      } catch (err) {
        const message = err.message || 'Failed to remove item';
        toast.error(message);
      }
    },
    [removeFromCart]
  );

  /**
   * Update cart item quantity
   * @param {string} cartItemId - Cart item ID
   * @param {number} quantity - New quantity
   */
  const handleUpdateQuantity = useCallback(
    (cartItemId, quantity) => {
      try {
        updateCartItemQuantity(cartItemId, quantity);
      } catch (err) {
        const message = err.message || 'Failed to update quantity';
        toast.error(message);
      }
    },
    [updateCartItemQuantity]
  );

  /**
   * Clear the cart
   */
  const handleClearCart = useCallback(() => {
    try {
      clearCart();
      toast.success('Cart cleared');
    } catch (err) {
      const message = err.message || 'Failed to clear cart';
      toast.error(message);
    }
  }, [clearCart]);

  /**
   * Process sale transaction
   * @returns {Promise<Object>} Created transaction
   */
  const processSale = useCallback(
    async () => {
      try {
        setPosLoading(true);
        setPosError(null);

        if (cartItems.length === 0) {
          throw new Error('Cart is empty');
        }

        const saleData = {
          items: cartItems,
          customerId: selectedCustomerId,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          paymentMethod,
          discountPercentage,
          taxPercentage,
          notes,
        };

        const transaction = await posService.processSale(saleData);
        addTransaction(transaction);
        clearCart();

        toast.success('Sale completed successfully');
        return transaction;
      } catch (err) {
        const message = err.message || 'Failed to process sale';
        setPosError(message);
        toast.error(message);
        throw err;
      } finally {
        setPosLoading(false);
      }
    },
    [
      cartItems,
      selectedCustomerId,
      customerInfo,
      paymentMethod,
      discountPercentage,
      taxPercentage,
      notes,
      addTransaction,
      clearCart,
      setPosLoading,
      setPosError,
    ]
  );

  /**
   * Fetch all transactions with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Transactions array
   */
  const fetchTransactions = useCallback(
    async (filters = {}) => {
      try {
        setPosLoading(true);
        setPosError(null);

        const data = await posService.getList(filters);
        setTransactions(data);

        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch transactions';
        setPosError(message);
        toast.error(message);
        throw err;
      } finally {
        setPosLoading(false);
      }
    },
    [setTransactions, setPosLoading, setPosError]
  );

  /**
   * Fetch a single transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise<Object>} Transaction object
   */
  const fetchTransactionById = useCallback(
    async (id) => {
      try {
        setPosLoading(true);
        setPosError(null);

        const data = await posService.getById(id);
        setCurrentTransaction(data);

        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch transaction';
        setPosError(message);
        toast.error(message);
        throw err;
      } finally {
        setPosLoading(false);
      }
    },
    [setCurrentTransaction, setPosLoading, setPosError]
  );

  /**
   * Fetch POS statistics
   * @returns {Promise<Object>} POS stats
   */
  const fetchPosStats = useCallback(async () => {
    try {
      const data = await posService.getStats();
      setPosStats(data);
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch POS statistics';
      toast.error(message);
      throw err;
    }
  }, [setPosStats]);

  /**
   * Fetch today's transactions
   * @returns {Promise<Array>} Today's transactions
   */
  const fetchTodaysTransactions = useCallback(async () => {
    try {
      const data = await posService.getTodaysTransactions();
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch today\'s transactions';
      toast.error(message);
      throw err;
    }
  }, []);

  /**
   * Refund a transaction
   * @param {string} id - Transaction ID
   * @param {string} reason - Refund reason
   * @returns {Promise<Object>} Updated transaction
   */
  const refundTransaction = useCallback(
    async (id, reason = '') => {
      try {
        setPosLoading(true);
        setPosError(null);

        const updatedTransaction = await posService.refundTransaction(id, reason);
        updateTransaction(id, updatedTransaction);

        toast.success('Transaction refunded successfully');
        return updatedTransaction;
      } catch (err) {
        const message = err.message || 'Failed to refund transaction';
        setPosError(message);
        toast.error(message);
        throw err;
      } finally {
        setPosLoading(false);
      }
    },
    [updateTransaction, setPosLoading, setPosError]
  );

  /**
   * Generate receipt for a transaction
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Receipt data
   */
  const generateReceipt = useCallback(async (transactionId) => {
    try {
      const receipt = await posService.generateReceipt(transactionId);
      return receipt;
    } catch (err) {
      const message = err.message || 'Failed to generate receipt';
      toast.error(message);
      throw err;
    }
  }, []);

  /**
   * Get sales report
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Object>} Sales report
   */
  const getSalesReport = useCallback(async (startDate, endDate) => {
    try {
      const report = await posService.getSalesReport(startDate, endDate);
      return report;
    } catch (err) {
      const message = err.message || 'Failed to generate sales report';
      toast.error(message);
      throw err;
    }
  }, []);

  /**
   * Update selected customer ID
   * @param {string|null} customerId - Customer ID
   */
  const updateSelectedCustomerId = useCallback(
    (customerId) => {
      setSelectedCustomerId(customerId);
    },
    [setSelectedCustomerId]
  );

  /**
   * Update customer information
   * @param {Object} info - Customer information
   */
  const updateCustomerInfo = useCallback(
    (info) => {
      setCustomerInfo(info);
    },
    [setCustomerInfo]
  );

  /**
   * Update payment method
   * @param {string} method - Payment method
   */
  const updatePaymentMethod = useCallback(
    (method) => {
      setPaymentMethod(method);
    },
    [setPaymentMethod]
  );

  /**
   * Update discount percentage
   * @param {number} percentage - Discount percentage
   */
  const updateDiscountPercentage = useCallback(
    (percentage) => {
      setDiscountPercentage(percentage);
    },
    [setDiscountPercentage]
  );

  /**
   * Update tax percentage
   * @param {number} percentage - Tax percentage
   */
  const updateTaxPercentage = useCallback(
    (percentage) => {
      setTaxPercentage(percentage);
    },
    [setTaxPercentage]
  );

  /**
   * Update transaction notes
   * @param {string} notesText - Transaction notes
   */
  const updateNotes = useCallback(
    (notesText) => {
      setNotes(notesText);
    },
    [setNotes]
  );

  /**
   * Update amount paid
   * @param {number} amount - Amount paid
   */
  const updateAmountPaid = useCallback(
    (amount) => {
      setAmountPaid(amount);
    },
    [setAmountPaid]
  );

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    clearPosError();
  }, [clearPosError]);

  return {
    // State
    cartItems,
    transactions,
    currentTransaction,
    selectedCustomerId,
    customerInfo,
    paymentMethod,
    paymentStatus,
    discountPercentage,
    taxPercentage,
    notes,
    amountPaid,
    isLoading,
    error,
    stats,

    // Cart Actions
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateQuantity,
    handleClearCart,

    // Transaction Actions
    processSale,
    fetchTransactions,
    fetchTransactionById,
    fetchPosStats,
    fetchTodaysTransactions,
    refundTransaction,
    generateReceipt,
    getSalesReport,

    // Updates
    updateSelectedCustomerId,
    updateCustomerInfo,
    updatePaymentMethod,
    updateDiscountPercentage,
    updateTaxPercentage,
    updateNotes,
    updateAmountPaid,

    // Getters
    getCartTotals,
    getCartItemCount,

    // Utilities
    clearError,
  };
};

export default usePos;
