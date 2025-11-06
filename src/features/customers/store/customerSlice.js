/**
 * Customer Slice - Zustand store slice for customer management
 * Uses Immer for immutable state updates
 */

export const createCustomerSlice = (set, get) => ({
  // State
  customers: [],
  selectedCustomer: null,
  customerLoading: false,
  customerError: null,
  customerStats: {
    totalCustomers: 0,
    activeCustomers: 0,
    vipCustomers: 0,
    totalRevenue: 0,
    averageCustomerValue: 0,
    newThisMonth: 0,
  },

  // CRM State
  segments: [],
  selectedSegment: null,
  segmentLoading: false,
  segmentError: null,

  customerNotes: [],
  notesLoading: false,
  notesError: null,

  purchaseHistory: [],
  purchaseHistoryLoading: false,
  purchaseHistoryError: null,
  purchaseHistoryStats: null,

  creditTransactions: [],
  creditLoading: false,
  creditError: null,

  storeCreditTransactions: [],
  storeCreditLoading: false,
  storeCreditError: null,

  // Mutations
  setCustomers: (customers) =>
    set((state) => {
      state.customers = customers;
    }),

  addCustomer: (customer) =>
    set((state) => {
      state.customers.push(customer);
    }),

  updateCustomer: (id, updates) =>
    set((state) => {
      const index = state.customers.findIndex((c) => c.id === id);
      if (index !== -1) {
        state.customers[index] = {
          ...state.customers[index],
          ...updates,
          id, // Ensure ID doesn't change
          updatedAt: new Date(),
        };
      }
    }),

  removeCustomer: (id) =>
    set((state) => {
      state.customers = state.customers.filter((c) => c.id !== id);
    }),

  setSelectedCustomer: (customer) =>
    set((state) => {
      state.selectedCustomer = customer;
    }),

  clearSelectedCustomer: () =>
    set((state) => {
      state.selectedCustomer = null;
    }),

  setCustomerLoading: (loading) =>
    set((state) => {
      state.customerLoading = loading;
    }),

  setCustomerError: (error) =>
    set((state) => {
      state.customerError = error;
    }),

  setCustomerStats: (stats) =>
    set((state) => {
      state.customerStats = stats;
    }),

  // Getters/Selectors (computed values)
  getCustomerById: (id) => {
    const state = get();
    return state.customers.find((c) => c.id === id) || null;
  },

  getActiveCustomers: () => {
    const state = get();
    return state.customers.filter((c) => c.status === 'active');
  },

  getVIPCustomers: () => {
    const state = get();
    return state.customers.filter((c) => c.customerType === 'vip');
  },

  getCustomersByType: (type) => {
    const state = get();
    return state.customers.filter((c) => c.customerType === type);
  },

  getCustomersByStatus: (status) => {
    const state = get();
    return state.customers.filter((c) => c.status === status);
  },

  getCustomersByLoyaltyTier: (tier) => {
    const state = get();
    return state.customers.filter((c) => c.loyaltyInfo.tier === tier);
  },

  searchCustomers: (searchTerm) => {
    const state = get();
    const term = searchTerm.toLowerCase();
    return state.customers.filter(
      (c) =>
        c.firstName.toLowerCase().includes(term) ||
        c.lastName.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.includes(term)
    );
  },

  getTopCustomers: (limit = 10) => {
    const state = get();
    return [...state.customers]
      .sort((a, b) => b.stats.totalSpent - a.stats.totalSpent)
      .slice(0, limit);
  },

  getRecentCustomers: (limit = 10) => {
    const state = get();
    return [...state.customers]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  },

  getCustomerFullName: (id) => {
    const state = get();
    const customer = state.customers.find((c) => c.id === id);
    return customer ? `${customer.firstName} ${customer.lastName}` : '';
  },

  // Bulk operations
  bulkUpdateCustomers: (ids, updates) =>
    set((state) => {
      ids.forEach((id) => {
        const index = state.customers.findIndex((c) => c.id === id);
        if (index !== -1) {
          state.customers[index] = {
            ...state.customers[index],
            ...updates,
            id,
            updatedAt: new Date(),
          };
        }
      });
    }),

  bulkDeleteCustomers: (ids) =>
    set((state) => {
      state.customers = state.customers.filter((c) => !ids.includes(c.id));
    }),

  // ========== SEGMENT MUTATIONS ==========

  setSegments: (segments) =>
    set((state) => {
      state.segments = segments;
    }),

  addSegment: (segment) =>
    set((state) => {
      state.segments.push(segment);
    }),

  updateSegment: (id, updates) =>
    set((state) => {
      const index = state.segments.findIndex((s) => s.id === id);
      if (index !== -1) {
        state.segments[index] = {
          ...state.segments[index],
          ...updates,
          id,
          updatedAt: new Date(),
        };
      }
    }),

  removeSegment: (id) =>
    set((state) => {
      state.segments = state.segments.filter((s) => s.id !== id);
    }),

  setSelectedSegment: (segment) =>
    set((state) => {
      state.selectedSegment = segment;
    }),

  clearSelectedSegment: () =>
    set((state) => {
      state.selectedSegment = null;
    }),

  setSegmentLoading: (loading) =>
    set((state) => {
      state.segmentLoading = loading;
    }),

  setSegmentError: (error) =>
    set((state) => {
      state.segmentError = error;
    }),

  // ========== NOTES MUTATIONS ==========

  setCustomerNotes: (notes) =>
    set((state) => {
      state.customerNotes = notes;
    }),

  addCustomerNote: (note) =>
    set((state) => {
      state.customerNotes.unshift(note); // Add to beginning for recent first
    }),

  updateCustomerNote: (id, updates) =>
    set((state) => {
      const index = state.customerNotes.findIndex((n) => n.id === id);
      if (index !== -1) {
        state.customerNotes[index] = {
          ...state.customerNotes[index],
          ...updates,
          id,
        };
      }
    }),

  removeCustomerNote: (id) =>
    set((state) => {
      state.customerNotes = state.customerNotes.filter((n) => n.id !== id);
    }),

  setNotesLoading: (loading) =>
    set((state) => {
      state.notesLoading = loading;
    }),

  setNotesError: (error) =>
    set((state) => {
      state.notesError = error;
    }),

  // ========== PURCHASE HISTORY MUTATIONS ==========

  setPurchaseHistory: (history) =>
    set((state) => {
      state.purchaseHistory = history;
    }),

  addPurchaseHistoryItem: (item) =>
    set((state) => {
      state.purchaseHistory.unshift(item); // Add to beginning for recent first
    }),

  setPurchaseHistoryLoading: (loading) =>
    set((state) => {
      state.purchaseHistoryLoading = loading;
    }),

  setPurchaseHistoryError: (error) =>
    set((state) => {
      state.purchaseHistoryError = error;
    }),

  setPurchaseHistoryStats: (stats) =>
    set((state) => {
      state.purchaseHistoryStats = stats;
    }),

  // ========== CREDIT MUTATIONS ==========

  setCreditTransactions: (transactions) =>
    set((state) => {
      state.creditTransactions = transactions;
    }),

  addCreditTransaction: (transaction) =>
    set((state) => {
      state.creditTransactions.unshift(transaction); // Add to beginning for recent first
    }),

  setCreditLoading: (loading) =>
    set((state) => {
      state.creditLoading = loading;
    }),

  setCreditError: (error) =>
    set((state) => {
      state.creditError = error;
    }),

  // ========== STORE CREDIT MUTATIONS ==========

  setStoreCreditTransactions: (transactions) =>
    set((state) => {
      state.storeCreditTransactions = transactions;
    }),

  addStoreCreditTransaction: (transaction) =>
    set((state) => {
      state.storeCreditTransactions.unshift(transaction); // Add to beginning for recent first
    }),

  setStoreCreditLoading: (loading) =>
    set((state) => {
      state.storeCreditLoading = loading;
    }),

  setStoreCreditError: (error) =>
    set((state) => {
      state.storeCreditError = error;
    }),

  // ========== CRM GETTERS/SELECTORS ==========

  // Segment getters
  getSegmentById: (id) => {
    const state = get();
    return state.segments.find((s) => s.id === id) || null;
  },

  getCustomersBySegment: (segmentId) => {
    const state = get();
    return state.customers.filter(
      (c) => c.segments && c.segments.includes(segmentId)
    );
  },

  getSegmentsForCustomer: (customerId) => {
    const state = get();
    const customer = state.customers.find((c) => c.id === customerId);
    if (!customer || !customer.segments) return [];
    return state.segments.filter((s) => customer.segments.includes(s.id));
  },

  // Notes getters
  getNotesByCustomer: (customerId) => {
    const state = get();
    return state.customerNotes.filter((n) => n.customerId === customerId);
  },

  getNotesByType: (type) => {
    const state = get();
    return state.customerNotes.filter((n) => n.type === type);
  },

  // Purchase history getters
  getPurchaseHistoryForCustomer: (customerId) => {
    const state = get();
    return state.purchaseHistory.filter((p) => p.customerId === customerId);
  },

  // Credit getters
  getCreditTransactionsForCustomer: (customerId) => {
    const state = get();
    return state.creditTransactions.filter((t) => t.customerId === customerId);
  },

  getCreditBalance: (customerId) => {
    const state = get();
    const customer = state.customers.find((c) => c.id === customerId);
    return customer?.creditInfo?.currentBalance || 0;
  },

  getAvailableCredit: (customerId) => {
    const state = get();
    const customer = state.customers.find((c) => c.id === customerId);
    return customer?.creditInfo?.availableCredit || 0;
  },

  // Store credit getters
  getStoreCreditTransactionsForCustomer: (customerId) => {
    const state = get();
    return state.storeCreditTransactions.filter((t) => t.customerId === customerId);
  },

  getStoreCreditBalance: (customerId) => {
    const state = get();
    const customer = state.customers.find((c) => c.id === customerId);
    return customer?.storeCredit?.balance || 0;
  },

  // Customer analytics getters
  getCustomerLifetimeValue: (customerId) => {
    const state = get();
    const customer = state.customers.find((c) => c.id === customerId);
    return customer?.stats?.totalSpent || 0;
  },

  getCustomerLoyaltyTier: (customerId) => {
    const state = get();
    const customer = state.customers.find((c) => c.id === customerId);
    return customer?.loyaltyInfo?.tier || 'bronze';
  },

  getCustomersByCreditStatus: (status) => {
    const state = get();
    return state.customers.filter(
      (c) => c.creditInfo && c.creditInfo.creditStatus === status
    );
  },

  getHighValueCustomers: (threshold = 1000) => {
    const state = get();
    return state.customers.filter((c) => c.stats.totalSpent >= threshold);
  },

  getCustomersWithStoreCredit: () => {
    const state = get();
    return state.customers.filter(
      (c) => c.storeCredit && c.storeCredit.balance > 0
    );
  },

  getCustomersWithCreditBalance: () => {
    const state = get();
    return state.customers.filter(
      (c) => c.creditInfo && c.creditInfo.currentBalance > 0
    );
  },
});
