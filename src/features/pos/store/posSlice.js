/**
 * POS Slice
 * Zustand slice for POS state management
 */

import { PAYMENT_METHODS, PAYMENT_STATUS, TRANSACTION_STATUS, TAX_CONFIG } from '../types';
import { calculateCartTotals, generateTransactionNumber } from '../utils/calculations';

export const createPosSlice = (set, get) => ({
  // State
  cartItems: [],
  transactions: [],
  currentTransaction: null,
  selectedProduct: null,
  selectedCustomerId: null,
  customerInfo: {
    name: '',
    email: '',
    phone: '',
  },
  paymentMethod: PAYMENT_METHODS.CASH,
  paymentStatus: PAYMENT_STATUS.PENDING,
  discountPercentage: 0,
  taxPercentage: TAX_CONFIG.DEFAULT_TAX_RATE,
  notes: '',
  amountPaid: 0,
  posLoading: false,
  posError: null,
  posStats: {
    totalSales: 0,
    totalTransactions: 0,
    todaysSales: 0,
    todaysTransactions: 0,
    averageTransactionValue: 0,
    paymentMethodBreakdown: {},
  },

  // Cart Mutations

  /**
   * Add item to cart
   * @param {Object} product - Product to add
   */
  addToCart: (product) =>
    set((state) => {
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.productId === product.id
      );

      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        const existingItem = state.cartItems[existingItemIndex];
        if (existingItem.quantity < product.stockQuantity) {
          state.cartItems[existingItemIndex].quantity += 1;
          state.cartItems[existingItemIndex].subtotal =
            state.cartItems[existingItemIndex].price *
            state.cartItems[existingItemIndex].quantity;
        }
      } else {
        // New item, add to cart
        state.cartItems.push({
          id: `cart-${Date.now()}-${Math.random()}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          category: product.category,
          stock: product.stockQuantity,
          subtotal: product.price,
        });
      }
    }),

  /**
   * Remove item from cart
   * @param {string} cartItemId - Cart item ID
   */
  removeFromCart: (cartItemId) =>
    set((state) => {
      state.cartItems = state.cartItems.filter((item) => item.id !== cartItemId);
    }),

  /**
   * Update cart item quantity
   * @param {string} cartItemId - Cart item ID
   * @param {number} quantity - New quantity
   */
  updateCartItemQuantity: (cartItemId, quantity) =>
    set((state) => {
      const index = state.cartItems.findIndex((item) => item.id === cartItemId);
      if (index >= 0) {
        const item = state.cartItems[index];
        const newQuantity = Math.max(1, Math.min(quantity, item.stock));
        state.cartItems[index].quantity = newQuantity;
        state.cartItems[index].subtotal = item.price * newQuantity;
      }
    }),

  /**
   * Clear entire cart
   */
  clearCart: () =>
    set((state) => {
      state.cartItems = [];
      state.selectedCustomerId = null;
      state.customerInfo = { name: '', email: '', phone: '' };
      state.discountPercentage = 0;
      state.notes = '';
      state.amountPaid = 0;
      state.paymentMethod = PAYMENT_METHODS.CASH;
      state.paymentStatus = PAYMENT_STATUS.PENDING;
    }),

  // Customer & Payment Mutations

  /**
   * Set selected customer ID
   * @param {string|null} customerId - Customer ID
   */
  setSelectedCustomerId: (customerId) =>
    set((state) => {
      state.selectedCustomerId = customerId;
    }),

  /**
   * Set customer information
   * @param {Object} customerInfo - Customer details
   */
  setCustomerInfo: (customerInfo) =>
    set((state) => {
      state.customerInfo = { ...state.customerInfo, ...customerInfo };
    }),

  /**
   * Set payment method
   * @param {string} method - Payment method
   */
  setPaymentMethod: (method) =>
    set((state) => {
      state.paymentMethod = method;
    }),

  /**
   * Set payment status
   * @param {string} status - Payment status
   */
  setPaymentStatus: (status) =>
    set((state) => {
      state.paymentStatus = status;
    }),

  /**
   * Set discount percentage
   * @param {number} percentage - Discount percentage
   */
  setDiscountPercentage: (percentage) =>
    set((state) => {
      state.discountPercentage = Math.max(0, Math.min(100, percentage));
    }),

  /**
   * Set tax percentage
   * @param {number} percentage - Tax percentage
   */
  setTaxPercentage: (percentage) =>
    set((state) => {
      state.taxPercentage = Math.max(0, percentage);
    }),

  /**
   * Set transaction notes
   * @param {string} notes - Transaction notes
   */
  setNotes: (notes) =>
    set((state) => {
      state.notes = notes;
    }),

  /**
   * Set amount paid
   * @param {number} amount - Amount paid
   */
  setAmountPaid: (amount) =>
    set((state) => {
      state.amountPaid = Math.max(0, amount);
    }),

  // Transaction Mutations

  /**
   * Set transactions list
   * @param {Array} transactions - Transactions array
   */
  setTransactions: (transactions) =>
    set((state) => {
      state.transactions = transactions;
    }),

  /**
   * Add a new transaction
   * @param {Object} transaction - Transaction to add
   */
  addTransaction: (transaction) =>
    set((state) => {
      state.transactions.unshift(transaction);
    }),

  /**
   * Update transaction
   * @param {string} id - Transaction ID
   * @param {Object} updates - Fields to update
   */
  updateTransaction: (id, updates) =>
    set((state) => {
      const index = state.transactions.findIndex((t) => t.id === id);
      if (index >= 0) {
        state.transactions[index] = { ...state.transactions[index], ...updates };
      }
    }),

  /**
   * Set current transaction
   * @param {Object|null} transaction - Transaction or null
   */
  setCurrentTransaction: (transaction) =>
    set((state) => {
      state.currentTransaction = transaction;
    }),

  // UI State Mutations

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setPosLoading: (loading) =>
    set((state) => {
      state.posLoading = loading;
    }),

  /**
   * Set error state
   * @param {string|null} error - Error message or null to clear
   */
  setPosError: (error) =>
    set((state) => {
      state.posError = error;
    }),

  /**
   * Set POS statistics
   * @param {Object} stats - POS statistics
   */
  setPosStats: (stats) =>
    set((state) => {
      state.posStats = stats;
    }),

  // Getters (derived state)

  /**
   * Get cart totals
   * @returns {Object} Cart calculation totals
   */
  getCartTotals: () => {
    const state = get();
    return calculateCartTotals(
      state.cartItems,
      state.discountPercentage,
      state.taxPercentage
    );
  },

  /**
   * Get cart item count
   * @returns {number} Total items in cart
   */
  getCartItemCount: () => {
    const state = get();
    return state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Get transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Object|undefined} Transaction object
   */
  getTransactionById: (id) => {
    const state = get();
    return state.transactions.find((t) => t.id === id);
  },

  /**
   * Get today's transactions
   * @returns {Array} Today's transactions
   */
  getTodaysTransactions: () => {
    const state = get();
    const today = new Date().toDateString();
    return state.transactions.filter(
      (t) => new Date(t.createdAt).toDateString() === today
    );
  },

  /**
   * Get transactions by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Filtered transactions
   */
  getTransactionsByDateRange: (startDate, endDate) => {
    const state = get();
    return state.transactions.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  },

  /**
   * Get transactions by payment method
   * @param {string} method - Payment method
   * @returns {Array} Filtered transactions
   */
  getTransactionsByPaymentMethod: (method) => {
    const state = get();
    return state.transactions.filter((t) => t.paymentMethod === method);
  },

  /**
   * Clear POS error
   */
  clearPosError: () =>
    set((state) => {
      state.posError = null;
    }),

  /**
   * Reset POS state
   */
  resetPosState: () =>
    set((state) => {
      state.cartItems = [];
      state.transactions = [];
      state.currentTransaction = null;
      state.selectedProduct = null;
      state.selectedCustomerId = null;
      state.customerInfo = { name: '', email: '', phone: '' };
      state.paymentMethod = PAYMENT_METHODS.CASH;
      state.paymentStatus = PAYMENT_STATUS.PENDING;
      state.discountPercentage = 0;
      state.taxPercentage = TAX_CONFIG.DEFAULT_TAX_RATE;
      state.notes = '';
      state.amountPaid = 0;
      state.posLoading = false;
      state.posError = null;
      state.posStats = {
        totalSales: 0,
        totalTransactions: 0,
        todaysSales: 0,
        todaysTransactions: 0,
        averageTransactionValue: 0,
        paymentMethodBreakdown: {},
      };
    }),
});

export default createPosSlice;
