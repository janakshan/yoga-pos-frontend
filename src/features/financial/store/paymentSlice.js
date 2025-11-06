/**
 * Payment Slice
 * Manages payment state in the application store
 */

export const createPaymentSlice = (set, get, api) => ({
  // State
  payments: [],
  paymentLoading: false,
  paymentError: null,
  paymentStats: {
    totalPayments: 0,
    totalAmount: 0,
    cashAmount: 0,
    cardAmount: 0,
    bankTransferAmount: 0,
    completedCount: 0,
    pendingCount: 0,
    failedCount: 0,
    refundedCount: 0,
    byPaymentMethod: {},
    averagePaymentValue: 0,
  },
  selectedPayment: null,
  paymentFilters: {
    status: null,
    paymentMethod: null,
    customerId: null,
    startDate: null,
    endDate: null,
    search: '',
  },

  // Actions
  setPayments: (payments) => {
    set((state) => {
      state.payments = payments;
    });
  },

  setPaymentLoading: (loading) => {
    set((state) => {
      state.paymentLoading = loading;
    });
  },

  setPaymentError: (error) => {
    set((state) => {
      state.paymentError = error;
    });
  },

  setPaymentStats: (stats) => {
    set((state) => {
      state.paymentStats = stats;
    });
  },

  setSelectedPayment: (payment) => {
    set((state) => {
      state.selectedPayment = payment;
    });
  },

  setPaymentFilters: (filters) => {
    set((state) => {
      state.paymentFilters = { ...state.paymentFilters, ...filters };
    });
  },

  addPayment: (payment) => {
    set((state) => {
      state.payments.unshift(payment);
    });
  },

  updatePayment: (id, updates) => {
    set((state) => {
      const index = state.payments.findIndex((p) => p.id === id);
      if (index !== -1) {
        state.payments[index] = { ...state.payments[index], ...updates };
      }
      // Update selected payment if it's the one being updated
      if (state.selectedPayment?.id === id) {
        state.selectedPayment = { ...state.selectedPayment, ...updates };
      }
    });
  },

  removePayment: (id) => {
    set((state) => {
      state.payments = state.payments.filter((p) => p.id !== id);
      // Clear selected if it was deleted
      if (state.selectedPayment?.id === id) {
        state.selectedPayment = null;
      }
    });
  },

  // Computed/Getters
  getPaymentById: (id) => {
    const state = get();
    return state.payments.find((p) => p.id === id);
  },

  getPaymentsByCustomer: (customerId) => {
    const state = get();
    return state.payments.filter((p) => p.customerId === customerId);
  },

  getPaymentsByInvoice: (invoiceId) => {
    const state = get();
    return state.payments.filter((p) => p.invoiceId === invoiceId);
  },

  getPaymentsByStatus: (status) => {
    const state = get();
    return state.payments.filter((p) => p.status === status);
  },

  getPaymentsByMethod: (paymentMethod) => {
    const state = get();
    return state.payments.filter((p) => p.paymentMethod === paymentMethod);
  },

  clearPaymentFilters: () => {
    set((state) => {
      state.paymentFilters = {
        status: null,
        paymentMethod: null,
        customerId: null,
        startDate: null,
        endDate: null,
        search: '',
      };
    });
  },
});
