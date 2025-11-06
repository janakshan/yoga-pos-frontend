/**
 * Supplier Slice
 * Zustand store slice for supplier state management
 */
export const createSupplierSlice = (set, get) => ({
  // State
  suppliers: [],
  selectedSupplier: null,
  supplierLoading: false,
  supplierError: null,
  supplierStats: null,

  // Mutations
  setSuppliers: (suppliers) =>
    set((state) => {
      state.suppliers = suppliers;
    }),

  setSelectedSupplier: (supplier) =>
    set((state) => {
      state.selectedSupplier = supplier;
    }),

  setSupplierLoading: (loading) =>
    set((state) => {
      state.supplierLoading = loading;
    }),

  setSupplierError: (error) =>
    set((state) => {
      state.supplierError = error;
    }),

  setSupplierStats: (stats) =>
    set((state) => {
      state.supplierStats = stats;
    }),

  addSupplier: (supplier) =>
    set((state) => {
      state.suppliers.push(supplier);
    }),

  updateSupplier: (id, updates) =>
    set((state) => {
      const index = state.suppliers.findIndex((s) => s.id === id);
      if (index !== -1) {
        state.suppliers[index] = { ...state.suppliers[index], ...updates };
      }
    }),

  removeSupplier: (id) =>
    set((state) => {
      state.suppliers = state.suppliers.filter((s) => s.id !== id);
    }),

  updateSupplierStatus: (id, status) =>
    set((state) => {
      const index = state.suppliers.findIndex((s) => s.id === id);
      if (index !== -1) {
        state.suppliers[index].status = status;
      }
    }),

  // Getters
  getSupplierById: (id) => {
    const state = get();
    return state.suppliers.find((s) => s.id === id);
  },

  getActiveSuppliers: () => {
    const state = get();
    return state.suppliers.filter((s) => s.status === 'active');
  },

  getSuppliersByType: (type) => {
    const state = get();
    return state.suppliers.filter((s) => s.type === type);
  },

  getSuppliersByCategory: (category) => {
    const state = get();
    return state.suppliers.filter((s) =>
      s.categories.includes(category)
    );
  },
});
