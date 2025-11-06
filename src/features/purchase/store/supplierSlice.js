/**
 * Supplier Management Zustand Slice
 * Manages supplier state with Immer for immutable updates
 */

export const createSupplierSlice = (set, get) => ({
  // ==================== STATE ====================
  suppliers: [],
  selectedSupplier: null,
  supplierLoading: false,
  supplierError: null,
  supplierStats: {
    total: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    topPerformers: []
  },

  // ==================== MUTATIONS ====================

  /**
   * Set all suppliers
   */
  setSuppliers: (suppliers) =>
    set((state) => {
      state.suppliers = suppliers;
      state.supplierStats = calculateSupplierStats(suppliers);
    }),

  /**
   * Add a new supplier
   */
  addSupplier: (supplier) =>
    set((state) => {
      state.suppliers.push(supplier);
      state.supplierStats = calculateSupplierStats(state.suppliers);
    }),

  /**
   * Update an existing supplier
   */
  updateSupplier: (id, updates) =>
    set((state) => {
      const index = state.suppliers.findIndex((s) => s.id === id);
      if (index !== -1) {
        state.suppliers[index] = { ...state.suppliers[index], ...updates };
        state.supplierStats = calculateSupplierStats(state.suppliers);
      }
    }),

  /**
   * Delete a supplier
   */
  deleteSupplier: (id) =>
    set((state) => {
      state.suppliers = state.suppliers.filter((s) => s.id !== id);
      state.supplierStats = calculateSupplierStats(state.suppliers);
      if (state.selectedSupplier?.id === id) {
        state.selectedSupplier = null;
      }
    }),

  /**
   * Set selected supplier
   */
  setSelectedSupplier: (supplier) =>
    set((state) => {
      state.selectedSupplier = supplier;
    }),

  /**
   * Update supplier performance metrics
   */
  updateSupplierPerformance: (id, performanceData) =>
    set((state) => {
      const supplier = state.suppliers.find((s) => s.id === id);
      if (supplier) {
        supplier.performance = {
          ...supplier.performance,
          ...performanceData
        };
        state.supplierStats = calculateSupplierStats(state.suppliers);
      }
    }),

  /**
   * Bulk update supplier status
   */
  bulkUpdateSupplierStatus: (ids, status) =>
    set((state) => {
      ids.forEach((id) => {
        const supplier = state.suppliers.find((s) => s.id === id);
        if (supplier) {
          supplier.status = status;
        }
      });
      state.supplierStats = calculateSupplierStats(state.suppliers);
    }),

  /**
   * Set supplier loading state
   */
  setSupplierLoading: (loading) =>
    set((state) => {
      state.supplierLoading = loading;
    }),

  /**
   * Set supplier error
   */
  setSupplierError: (error) =>
    set((state) => {
      state.supplierError = error;
    }),

  /**
   * Clear supplier error
   */
  clearSupplierError: () =>
    set((state) => {
      state.supplierError = null;
    }),

  // ==================== GETTERS ====================

  /**
   * Get supplier by ID
   */
  getSupplierById: (id) => {
    const state = get();
    return state.suppliers.find((s) => s.id === id);
  },

  /**
   * Get supplier by code
   */
  getSupplierByCode: (code) => {
    const state = get();
    return state.suppliers.find((s) => s.code === code);
  },

  /**
   * Get active suppliers
   */
  getActiveSuppliers: () => {
    const state = get();
    return state.suppliers.filter((s) => s.status === 'active');
  },

  /**
   * Get suppliers by category
   */
  getSuppliersByCategory: (category) => {
    const state = get();
    return state.suppliers.filter((s) =>
      s.productCategories.includes(category)
    );
  },

  /**
   * Get top performing suppliers
   */
  getTopSuppliers: (limit = 5) => {
    const state = get();
    return [...state.suppliers]
      .sort((a, b) => b.performance.qualityScore - a.performance.qualityScore)
      .slice(0, limit);
  },

  /**
   * Search suppliers
   */
  searchSuppliers: (searchTerm) => {
    const state = get();
    const term = searchTerm.toLowerCase();
    return state.suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term) ||
        s.phone.includes(term)
    );
  }
});

/**
 * Calculate supplier statistics
 */
function calculateSupplierStats(suppliers) {
  const stats = {
    total: suppliers.length,
    active: 0,
    inactive: 0,
    blocked: 0,
    topPerformers: []
  };

  suppliers.forEach((supplier) => {
    if (supplier.status === 'active') stats.active++;
    else if (supplier.status === 'inactive') stats.inactive++;
    else if (supplier.status === 'blocked') stats.blocked++;
  });

  // Get top 5 performers
  stats.topPerformers = [...suppliers]
    .filter((s) => s.status === 'active')
    .sort((a, b) => b.performance.qualityScore - a.performance.qualityScore)
    .slice(0, 5)
    .map((s) => ({
      id: s.id,
      name: s.name,
      qualityScore: s.performance.qualityScore,
      totalOrders: s.performance.totalOrders,
      totalValue: s.performance.totalPurchaseValue
    }));

  return stats;
}
