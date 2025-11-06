/**
 * Expense Slice
 * Manages expense state in the application store
 */

export const createExpenseSlice = (set, get, api) => ({
  // State
  expenses: [],
  expenseLoading: false,
  expenseError: null,
  expenseStats: {
    totalExpenses: 0,
    totalAmount: 0,
    pendingAmount: 0,
    approvedAmount: 0,
    paidAmount: 0,
    pendingCount: 0,
    approvedCount: 0,
    paidCount: 0,
    byCategory: {},
    byPaymentMethod: {},
    averageExpenseValue: 0,
    recurringExpensesTotal: 0,
  },
  expenseCategories: [],
  selectedExpense: null,
  expenseFilters: {
    status: null,
    category: null,
    paymentMethod: null,
    vendorId: null,
    startDate: null,
    endDate: null,
    search: '',
    isRecurring: null,
  },

  // Actions
  setExpenses: (expenses) => {
    set((state) => {
      state.expenses = expenses;
    });
  },

  setExpenseLoading: (loading) => {
    set((state) => {
      state.expenseLoading = loading;
    });
  },

  setExpenseError: (error) => {
    set((state) => {
      state.expenseError = error;
    });
  },

  setExpenseStats: (stats) => {
    set((state) => {
      state.expenseStats = stats;
    });
  },

  setExpenseCategories: (categories) => {
    set((state) => {
      state.expenseCategories = categories;
    });
  },

  setSelectedExpense: (expense) => {
    set((state) => {
      state.selectedExpense = expense;
    });
  },

  setExpenseFilters: (filters) => {
    set((state) => {
      state.expenseFilters = { ...state.expenseFilters, ...filters };
    });
  },

  addExpense: (expense) => {
    set((state) => {
      state.expenses.unshift(expense);
    });
  },

  updateExpense: (id, updates) => {
    set((state) => {
      const index = state.expenses.findIndex((exp) => exp.id === id);
      if (index !== -1) {
        state.expenses[index] = { ...state.expenses[index], ...updates };
      }
      // Update selected expense if it's the one being updated
      if (state.selectedExpense?.id === id) {
        state.selectedExpense = { ...state.selectedExpense, ...updates };
      }
    });
  },

  removeExpense: (id) => {
    set((state) => {
      state.expenses = state.expenses.filter((exp) => exp.id !== id);
      // Clear selected if it was deleted
      if (state.selectedExpense?.id === id) {
        state.selectedExpense = null;
      }
    });
  },

  // Computed/Getters
  getExpenseById: (id) => {
    const state = get();
    return state.expenses.find((exp) => exp.id === id);
  },

  getExpensesByCategory: (category) => {
    const state = get();
    return state.expenses.filter((exp) => exp.category === category);
  },

  getExpensesByVendor: (vendorId) => {
    const state = get();
    return state.expenses.filter((exp) => exp.vendorId === vendorId);
  },

  getExpensesByStatus: (status) => {
    const state = get();
    return state.expenses.filter((exp) => exp.status === status);
  },

  getRecurringExpenses: () => {
    const state = get();
    return state.expenses.filter((exp) => exp.isRecurring);
  },

  clearExpenseFilters: () => {
    set((state) => {
      state.expenseFilters = {
        status: null,
        category: null,
        paymentMethod: null,
        vendorId: null,
        startDate: null,
        endDate: null,
        search: '',
        isRecurring: null,
      };
    });
  },
});
