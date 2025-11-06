/**
 * Transaction Slice
 * Manages transaction state in the application store
 */

export const createTransactionSlice = (set, get, api) => ({
  // State
  financialTransactions: [],
  transactionLoading: false,
  transactionError: null,
  transactionStats: {
    totalTransactions: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    pendingCount: 0,
    completedCount: 0,
    byType: {},
    byCategory: {},
    byPaymentMethod: {},
    reconciledCount: 0,
    unreconciledCount: 0,
  },
  selectedTransaction: null,
  transactionFilters: {
    type: null,
    category: null,
    status: null,
    paymentMethod: null,
    accountId: null,
    startDate: null,
    endDate: null,
    search: '',
    isReconciled: null,
  },

  // Actions
  setFinancialTransactions: (transactions) => {
    set((state) => {
      state.financialTransactions = transactions;
    });
  },

  setTransactionLoading: (loading) => {
    set((state) => {
      state.transactionLoading = loading;
    });
  },

  setTransactionError: (error) => {
    set((state) => {
      state.transactionError = error;
    });
  },

  setTransactionStats: (stats) => {
    set((state) => {
      state.transactionStats = stats;
    });
  },

  setSelectedTransaction: (transaction) => {
    set((state) => {
      state.selectedTransaction = transaction;
    });
  },

  setTransactionFilters: (filters) => {
    set((state) => {
      state.transactionFilters = { ...state.transactionFilters, ...filters };
    });
  },

  addFinancialTransaction: (transaction) => {
    set((state) => {
      state.financialTransactions.unshift(transaction);
    });
  },

  updateFinancialTransaction: (id, updates) => {
    set((state) => {
      const index = state.financialTransactions.findIndex((txn) => txn.id === id);
      if (index !== -1) {
        state.financialTransactions[index] = {
          ...state.financialTransactions[index],
          ...updates,
        };
      }
      // Update selected transaction if it's the one being updated
      if (state.selectedTransaction?.id === id) {
        state.selectedTransaction = { ...state.selectedTransaction, ...updates };
      }
    });
  },

  removeFinancialTransaction: (id) => {
    set((state) => {
      state.financialTransactions = state.financialTransactions.filter(
        (txn) => txn.id !== id
      );
      // Clear selected if it was deleted
      if (state.selectedTransaction?.id === id) {
        state.selectedTransaction = null;
      }
    });
  },

  // Computed/Getters
  getTransactionById: (id) => {
    const state = get();
    return state.financialTransactions.find((txn) => txn.id === id);
  },

  getTransactionsByType: (type) => {
    const state = get();
    return state.financialTransactions.filter((txn) => txn.type === type);
  },

  getTransactionsByCategory: (category) => {
    const state = get();
    return state.financialTransactions.filter((txn) => txn.category === category);
  },

  getTransactionsByStatus: (status) => {
    const state = get();
    return state.financialTransactions.filter((txn) => txn.status === status);
  },

  getUnreconciledTransactions: () => {
    const state = get();
    return state.financialTransactions.filter((txn) => !txn.isReconciled);
  },

  clearTransactionFilters: () => {
    set((state) => {
      state.transactionFilters = {
        type: null,
        category: null,
        status: null,
        paymentMethod: null,
        accountId: null,
        startDate: null,
        endDate: null,
        search: '',
        isReconciled: null,
      };
    });
  },
});
