/**
 * Customer Selectors - Reusable selector functions for accessing customer state
 */

// Basic selectors
export const selectCustomers = (state) => state.customers;
export const selectSelectedCustomer = (state) => state.selectedCustomer;
export const selectCustomerLoading = (state) => state.customerLoading;
export const selectCustomerError = (state) => state.customerError;
export const selectCustomerStats = (state) => state.customerStats;

// Computed selectors
export const selectActiveCustomers = (state) =>
  state.customers.filter((c) => c.status === 'active');

export const selectVIPCustomers = (state) =>
  state.customers.filter((c) => c.customerType === 'vip');

export const selectCustomersByType = (type) => (state) =>
  state.customers.filter((c) => c.customerType === type);

export const selectCustomersByStatus = (status) => (state) =>
  state.customers.filter((c) => c.status === status);

export const selectCustomersByLoyaltyTier = (tier) => (state) =>
  state.customers.filter((c) => c.loyaltyInfo.tier === tier);

export const selectTopCustomers = (limit = 10) => (state) =>
  [...state.customers]
    .sort((a, b) => b.stats.totalSpent - a.stats.totalSpent)
    .slice(0, limit);

export const selectRecentCustomers = (limit = 10) => (state) =>
  [...state.customers]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);

export const selectCustomerById = (id) => (state) =>
  state.customers.find((c) => c.id === id) || null;

export const selectCustomerFullName = (id) => (state) => {
  const customer = state.customers.find((c) => c.id === id);
  return customer ? `${customer.firstName} ${customer.lastName}` : '';
};

// Search selector
export const selectSearchedCustomers = (searchTerm) => (state) => {
  if (!searchTerm) return state.customers;
  const term = searchTerm.toLowerCase();
  return state.customers.filter(
    (c) =>
      c.firstName.toLowerCase().includes(term) ||
      c.lastName.toLowerCase().includes(term) ||
      c.email.toLowerCase().includes(term) ||
      c.phone.includes(term)
  );
};

// Count selectors
export const selectTotalCustomers = (state) => state.customers.length;
export const selectActiveCustomersCount = (state) =>
  state.customers.filter((c) => c.status === 'active').length;
export const selectVIPCustomersCount = (state) =>
  state.customers.filter((c) => c.customerType === 'vip').length;
