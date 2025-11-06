/**
 * Purchase Order Slice
 * Zustand store slice for purchase order state management
 */
export const createPurchaseOrderSlice = (set, get) => ({
  // State
  purchaseOrders: [],
  selectedPurchaseOrder: null,
  purchaseOrderLoading: false,
  purchaseOrderError: null,
  purchaseOrderStats: null,
  purchaseAnalytics: null,

  // Mutations
  setPurchaseOrders: (orders) =>
    set((state) => {
      state.purchaseOrders = orders;
    }),

  setSelectedPurchaseOrder: (order) =>
    set((state) => {
      state.selectedPurchaseOrder = order;
    }),

  setPurchaseOrderLoading: (loading) =>
    set((state) => {
      state.purchaseOrderLoading = loading;
    }),

  setPurchaseOrderError: (error) =>
    set((state) => {
      state.purchaseOrderError = error;
    }),

  setPurchaseOrderStats: (stats) =>
    set((state) => {
      state.purchaseOrderStats = stats;
    }),

  setPurchaseAnalytics: (analytics) =>
    set((state) => {
      state.purchaseAnalytics = analytics;
    }),

  addPurchaseOrder: (order) =>
    set((state) => {
      state.purchaseOrders.push(order);
    }),

  updatePurchaseOrder: (id, updates) =>
    set((state) => {
      const index = state.purchaseOrders.findIndex((po) => po.id === id);
      if (index !== -1) {
        state.purchaseOrders[index] = {
          ...state.purchaseOrders[index],
          ...updates,
        };
      }
    }),

  removePurchaseOrder: (id) =>
    set((state) => {
      state.purchaseOrders = state.purchaseOrders.filter((po) => po.id !== id);
    }),

  updatePurchaseOrderStatus: (id, status) =>
    set((state) => {
      const index = state.purchaseOrders.findIndex((po) => po.id === id);
      if (index !== -1) {
        state.purchaseOrders[index].status = status;
      }
    }),

  // Getters
  getPurchaseOrderById: (id) => {
    const state = get();
    return state.purchaseOrders.find((po) => po.id === id);
  },

  getPurchaseOrdersBySupplier: (supplierId) => {
    const state = get();
    return state.purchaseOrders.filter((po) => po.supplierId === supplierId);
  },

  getPurchaseOrdersByStatus: (status) => {
    const state = get();
    return state.purchaseOrders.filter((po) => po.status === status);
  },

  getPendingPurchaseOrders: () => {
    const state = get();
    return state.purchaseOrders.filter(
      (po) => po.status === 'pending' || po.status === 'approved'
    );
  },

  getOverduePurchaseOrders: () => {
    const state = get();
    const now = new Date();
    return state.purchaseOrders.filter(
      (po) =>
        po.expectedDeliveryDate &&
        new Date(po.expectedDeliveryDate) < now &&
        po.status !== 'completed' &&
        po.status !== 'cancelled'
    );
  },
});
