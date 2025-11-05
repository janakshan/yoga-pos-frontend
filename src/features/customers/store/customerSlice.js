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
});
