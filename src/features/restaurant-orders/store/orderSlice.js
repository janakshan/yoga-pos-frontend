/**
 * Restaurant Order Store Slice
 * Manages restaurant order state including active orders, history, and status tracking
 */

import { ORDER_STATUS } from '../types/order.types';

export const createOrderSlice = (set, get) => ({
  // State
  orders: [],
  activeOrders: [],
  orderHistory: [],
  currentOrder: null,
  filters: {
    status: null,
    serviceType: null,
    tableId: null,
    startDate: null,
    endDate: null
  },
  isLoading: false,
  error: null,

  // Actions

  /**
   * Set all orders
   */
  setOrders: (orders) =>
    set((state) => {
      state.orders = orders;
      state.activeOrders = orders.filter(
        (order) =>
          ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].includes(
            order.status
          )
      );
    }),

  /**
   * Add a new order
   */
  addOrder: (order) =>
    set((state) => {
      state.orders.unshift(order);
      if (
        ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].includes(
          order.status
        )
      ) {
        state.activeOrders.unshift(order);
      }
    }),

  /**
   * Update an existing order
   */
  updateOrder: (orderId, updates) =>
    set((state) => {
      const orderIndex = state.orders.findIndex((o) => o.id === orderId);
      if (orderIndex >= 0) {
        state.orders[orderIndex] = {
          ...state.orders[orderIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        };

        // Update active orders
        const activeIndex = state.activeOrders.findIndex((o) => o.id === orderId);
        if (activeIndex >= 0) {
          if (
            [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].includes(
              updates.status
            )
          ) {
            // Remove from active orders
            state.activeOrders.splice(activeIndex, 1);
          } else {
            // Update in active orders
            state.activeOrders[activeIndex] = state.orders[orderIndex];
          }
        } else if (
          ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].includes(
            updates.status
          )
        ) {
          // Add to active orders if it should be active
          state.activeOrders.unshift(state.orders[orderIndex]);
        }

        // Update current order if it's the one being updated
        if (state.currentOrder?.id === orderId) {
          state.currentOrder = state.orders[orderIndex];
        }
      }
    }),

  /**
   * Update order status
   */
  updateOrderStatus: (orderId, newStatus, userId, userName, notes = null) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        const statusHistory = order.statusHistory || [];
        statusHistory.push({
          status: newStatus,
          timestamp: new Date().toISOString(),
          userId,
          userName,
          notes
        });

        const updates = {
          status: newStatus,
          statusHistory,
          ...(newStatus === ORDER_STATUS.COMPLETED && {
            completedAt: new Date().toISOString()
          })
        };

        get().updateOrder(orderId, updates);
      }
    }),

  /**
   * Update order items
   */
  updateOrderItems: (orderId, items) =>
    set((state) => {
      get().updateOrder(orderId, { items });
    }),

  /**
   * Update order item status
   */
  updateOrderItemStatus: (orderId, itemId, newStatus) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        const items = order.items.map((item) =>
          item.id === itemId ? { ...item, status: newStatus } : item
        );
        get().updateOrder(orderId, { items });
      }
    }),

  /**
   * Add item to order
   */
  addOrderItem: (orderId, item) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        const items = [...order.items, item];
        get().updateOrder(orderId, { items });
      }
    }),

  /**
   * Remove item from order
   */
  removeOrderItem: (orderId, itemId) =>
    set((state) => {
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        const items = order.items.filter((item) => item.id !== itemId);
        get().updateOrder(orderId, { items });
      }
    }),

  /**
   * Update order totals
   */
  updateOrderTotals: (orderId, totals) =>
    set((state) => {
      get().updateOrder(orderId, totals);
    }),

  /**
   * Assign server to order
   */
  assignServer: (orderId, serverId, serverName) =>
    set((state) => {
      get().updateOrder(orderId, {
        assignedServerId: serverId,
        assignedServerName: serverName
      });
    }),

  /**
   * Route order to kitchen stations
   */
  routeToStations: (orderId, stationIds) =>
    set((state) => {
      get().updateOrder(orderId, {
        stationRoutes: stationIds
      });
    }),

  /**
   * Update order payment info
   */
  updateOrderPayment: (orderId, paymentInfo) =>
    set((state) => {
      get().updateOrder(orderId, {
        payment: paymentInfo
      });
    }),

  /**
   * Delete an order
   */
  deleteOrder: (orderId) =>
    set((state) => {
      state.orders = state.orders.filter((o) => o.id !== orderId);
      state.activeOrders = state.activeOrders.filter((o) => o.id !== orderId);
      if (state.currentOrder?.id === orderId) {
        state.currentOrder = null;
      }
    }),

  /**
   * Set current order
   */
  setCurrentOrder: (order) =>
    set((state) => {
      state.currentOrder = order;
    }),

  /**
   * Clear current order
   */
  clearCurrentOrder: () =>
    set((state) => {
      state.currentOrder = null;
    }),

  /**
   * Set filters
   */
  setFilters: (filters) =>
    set((state) => {
      state.filters = { ...state.filters, ...filters };
    }),

  /**
   * Clear filters
   */
  clearFilters: () =>
    set((state) => {
      state.filters = {
        status: null,
        serviceType: null,
        tableId: null,
        startDate: null,
        endDate: null
      };
    }),

  /**
   * Set loading state
   */
  setLoading: (isLoading) =>
    set((state) => {
      state.isLoading = isLoading;
    }),

  /**
   * Set error state
   */
  setError: (error) =>
    set((state) => {
      state.error = error;
    }),

  /**
   * Clear error
   */
  clearError: () =>
    set((state) => {
      state.error = null;
    }),

  // Getters (computed values)

  /**
   * Get order by ID
   */
  getOrderById: (orderId) => {
    return get().orders.find((o) => o.id === orderId);
  },

  /**
   * Get orders by status
   */
  getOrdersByStatus: (status) => {
    return get().orders.filter((o) => o.status === status);
  },

  /**
   * Get orders by table
   */
  getOrdersByTable: (tableId) => {
    return get().orders.filter((o) => o.tableId === tableId);
  },

  /**
   * Get orders by service type
   */
  getOrdersByServiceType: (serviceType) => {
    return get().orders.filter((o) => o.serviceType === serviceType);
  },

  /**
   * Get filtered orders
   */
  getFilteredOrders: () => {
    const { orders, filters } = get();
    let filtered = [...orders];

    if (filters.status) {
      filtered = filtered.filter((o) => o.status === filters.status);
    }

    if (filters.serviceType) {
      filtered = filtered.filter((o) => o.serviceType === filters.serviceType);
    }

    if (filters.tableId) {
      filtered = filtered.filter((o) => o.tableId === filters.tableId);
    }

    if (filters.startDate) {
      filtered = filtered.filter((o) => new Date(o.createdAt) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter((o) => new Date(o.createdAt) <= new Date(filters.endDate));
    }

    return filtered;
  },

  /**
   * Get order statistics
   */
  getOrderStats: () => {
    const orders = get().orders;
    const activeOrders = get().activeOrders;

    const totalOrders = orders.length;
    const totalActive = activeOrders.length;
    const totalCompleted = orders.filter((o) => o.status === ORDER_STATUS.COMPLETED).length;
    const totalCancelled = orders.filter((o) => o.status === ORDER_STATUS.CANCELLED).length;

    const totalRevenue = orders
      .filter((o) => o.status === ORDER_STATUS.COMPLETED)
      .reduce((sum, o) => sum + o.total, 0);

    const averageOrderValue = totalCompleted > 0 ? totalRevenue / totalCompleted : 0;

    return {
      totalOrders,
      totalActive,
      totalCompleted,
      totalCancelled,
      totalRevenue,
      averageOrderValue
    };
  }
});
