/**
 * Invoice Slice
 * Manages invoice state in the application store
 */

export const createInvoiceSlice = (set, get, api) => ({
  // State
  invoices: [],
  invoiceLoading: false,
  invoiceError: null,
  invoiceStats: {
    totalInvoices: 0,
    totalAmount: 0,
    totalPaid: 0,
    totalDue: 0,
    overdueAmount: 0,
    overdueCount: 0,
    draftCount: 0,
    paidCount: 0,
    partialCount: 0,
    averageInvoiceValue: 0,
    collectionRate: 0,
  },
  selectedInvoice: null,
  invoiceFilters: {
    status: null,
    customerId: null,
    startDate: null,
    endDate: null,
    search: '',
  },

  // Actions
  setInvoices: (invoices) => {
    set((state) => {
      state.invoices = invoices;
    });
  },

  setInvoiceLoading: (loading) => {
    set((state) => {
      state.invoiceLoading = loading;
    });
  },

  setInvoiceError: (error) => {
    set((state) => {
      state.invoiceError = error;
    });
  },

  setInvoiceStats: (stats) => {
    set((state) => {
      state.invoiceStats = stats;
    });
  },

  setSelectedInvoice: (invoice) => {
    set((state) => {
      state.selectedInvoice = invoice;
    });
  },

  setInvoiceFilters: (filters) => {
    set((state) => {
      state.invoiceFilters = { ...state.invoiceFilters, ...filters };
    });
  },

  addInvoice: (invoice) => {
    set((state) => {
      state.invoices.unshift(invoice);
    });
  },

  updateInvoice: (id, updates) => {
    set((state) => {
      const index = state.invoices.findIndex((inv) => inv.id === id);
      if (index !== -1) {
        state.invoices[index] = { ...state.invoices[index], ...updates };
      }
      // Update selected invoice if it's the one being updated
      if (state.selectedInvoice?.id === id) {
        state.selectedInvoice = { ...state.selectedInvoice, ...updates };
      }
    });
  },

  removeInvoice: (id) => {
    set((state) => {
      state.invoices = state.invoices.filter((inv) => inv.id !== id);
      // Clear selected if it was deleted
      if (state.selectedInvoice?.id === id) {
        state.selectedInvoice = null;
      }
    });
  },

  // Computed/Getters
  getInvoiceById: (id) => {
    const state = get();
    return state.invoices.find((inv) => inv.id === id);
  },

  getInvoicesByCustomer: (customerId) => {
    const state = get();
    return state.invoices.filter((inv) => inv.customerId === customerId);
  },

  getOverdueInvoices: () => {
    const state = get();
    const now = new Date();
    return state.invoices.filter(
      (inv) =>
        inv.dueDate < now &&
        inv.amountDue > 0 &&
        inv.status !== 'paid' &&
        inv.status !== 'cancelled'
    );
  },

  getInvoicesByStatus: (status) => {
    const state = get();
    return state.invoices.filter((inv) => inv.status === status);
  },

  clearInvoiceFilters: () => {
    set((state) => {
      state.invoiceFilters = {
        status: null,
        customerId: null,
        startDate: null,
        endDate: null,
        search: '',
      };
    });
  },
});
