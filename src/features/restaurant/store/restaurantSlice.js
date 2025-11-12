/**
 * Restaurant Store Slice
 * Manages restaurant-specific state (tables, orders, kitchen display)
 */

import { TABLE_STATUS, ORDER_STATUS } from '../../../types/restaurant.types';

export const createRestaurantSlice = (set, get) => ({
  // State
  tables: [],
  restaurantOrders: [],
  activeTableId: null,
  kitchenOrders: [],

  // Table Management Actions
  setTables: (tables) =>
    set((state) => {
      state.tables = tables;
    }),

  addTable: (table) =>
    set((state) => {
      state.tables.push({
        ...table,
        status: table.status || TABLE_STATUS.AVAILABLE,
        orderId: null,
        serverId: null,
        occupiedAt: null,
      });
    }),

  updateTable: (tableId, updates) =>
    set((state) => {
      const index = state.tables.findIndex((t) => t.id === tableId);
      if (index !== -1) {
        state.tables[index] = { ...state.tables[index], ...updates };
      }
    }),

  removeTable: (tableId) =>
    set((state) => {
      state.tables = state.tables.filter((t) => t.id !== tableId);
    }),

  setTableStatus: (tableId, status) =>
    set((state) => {
      const index = state.tables.findIndex((t) => t.id === tableId);
      if (index !== -1) {
        state.tables[index].status = status;
        if (status === TABLE_STATUS.OCCUPIED && !state.tables[index].occupiedAt) {
          state.tables[index].occupiedAt = new Date();
        } else if (status === TABLE_STATUS.AVAILABLE) {
          state.tables[index].occupiedAt = null;
          state.tables[index].orderId = null;
        }
      }
    }),

  assignTableToServer: (tableId, serverId) =>
    set((state) => {
      const index = state.tables.findIndex((t) => t.id === tableId);
      if (index !== -1) {
        state.tables[index].serverId = serverId;
      }
    }),

  setActiveTable: (tableId) =>
    set((state) => {
      state.activeTableId = tableId;
    }),

  // Restaurant Order Management Actions
  setRestaurantOrders: (orders) =>
    set((state) => {
      state.restaurantOrders = orders;
    }),

  addRestaurantOrder: (order) =>
    set((state) => {
      state.restaurantOrders.push({
        ...order,
        status: order.status || ORDER_STATUS.OPEN,
        createdAt: new Date(),
        completedAt: null,
      });

      // Update table if order has tableId
      if (order.tableId) {
        const tableIndex = state.tables.findIndex((t) => t.id === order.tableId);
        if (tableIndex !== -1) {
          state.tables[tableIndex].orderId = order.id;
          state.tables[tableIndex].status = TABLE_STATUS.OCCUPIED;
        }
      }
    }),

  updateRestaurantOrder: (orderId, updates) =>
    set((state) => {
      const index = state.restaurantOrders.findIndex((o) => o.id === orderId);
      if (index !== -1) {
        state.restaurantOrders[index] = { ...state.restaurantOrders[index], ...updates };

        // Update completedAt if status is completed
        if (updates.status === ORDER_STATUS.COMPLETED && !state.restaurantOrders[index].completedAt) {
          state.restaurantOrders[index].completedAt = new Date();
        }
      }
    }),

  removeRestaurantOrder: (orderId) =>
    set((state) => {
      const order = state.restaurantOrders.find((o) => o.id === orderId);
      state.restaurantOrders = state.restaurantOrders.filter((o) => o.id !== orderId);

      // Update table if order had tableId
      if (order?.tableId) {
        const tableIndex = state.tables.findIndex((t) => t.id === order.tableId);
        if (tableIndex !== -1) {
          state.tables[tableIndex].orderId = null;
          state.tables[tableIndex].status = TABLE_STATUS.AVAILABLE;
        }
      }
    }),

  updateOrderItemStatus: (orderId, itemId, status) =>
    set((state) => {
      const orderIndex = state.restaurantOrders.findIndex((o) => o.id === orderId);
      if (orderIndex !== -1) {
        const itemIndex = state.restaurantOrders[orderIndex].items.findIndex((i) => i.id === itemId);
        if (itemIndex !== -1) {
          state.restaurantOrders[orderIndex].items[itemIndex].status = status;
        }
      }
    }),

  // Kitchen Display Actions
  setKitchenOrders: (orders) =>
    set((state) => {
      state.kitchenOrders = orders;
    }),

  addKitchenOrder: (order) =>
    set((state) => {
      state.kitchenOrders.push(order);
    }),

  removeKitchenOrder: (orderId) =>
    set((state) => {
      state.kitchenOrders = state.kitchenOrders.filter((o) => o.id !== orderId);
    }),

  // Utility Actions
  getTableById: (tableId) => {
    return get().tables.find((t) => t.id === tableId);
  },

  getOrderById: (orderId) => {
    return get().restaurantOrders.find((o) => o.id === orderId);
  },

  getOrdersByTable: (tableId) => {
    return get().restaurantOrders.filter((o) => o.tableId === tableId);
  },

  getOrdersByServer: (serverId) => {
    return get().restaurantOrders.filter((o) => o.serverId === serverId);
  },

  getAvailableTables: () => {
    return get().tables.filter((t) => t.status === TABLE_STATUS.AVAILABLE);
  },

  getOccupiedTables: () => {
    return get().tables.filter((t) => t.status === TABLE_STATUS.OCCUPIED);
  },

  resetRestaurantState: () =>
    set((state) => {
      state.tables = [];
      state.restaurantOrders = [];
      state.activeTableId = null;
      state.kitchenOrders = [];
    }),
});
