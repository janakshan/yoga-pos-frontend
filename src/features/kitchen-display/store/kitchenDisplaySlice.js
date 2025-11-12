/**
 * Kitchen Display System Store Slice
 *
 * Manages state for the Kitchen Display System including:
 * - Station configurations
 * - Active orders for kitchen
 * - Station selection and filtering
 * - Performance metrics
 * - Display settings
 */

import { produce } from 'immer';
import {
  KITCHEN_STATION,
  DEFAULT_STATIONS,
  KDS_VIEW_MODE,
  KDS_SORT_OPTIONS,
  KDS_FILTER_OPTIONS,
  ORDER_AGING_THRESHOLDS,
  ORDER_AGING_COLORS,
} from '../types/kitchen.types';

/**
 * Initial state for kitchen display
 */
const initialState = {
  // Station Configuration
  stations: DEFAULT_STATIONS,
  selectedStation: null, // null = all stations
  stationOrders: {}, // { stationId: [orders] }

  // Orders
  kitchenOrders: [], // All active kitchen orders
  filteredOrders: [], // Filtered based on station/status
  orderQueue: [], // Ordered queue based on sort/priority

  // Display Settings
  viewMode: KDS_VIEW_MODE.GRID,
  sortBy: KDS_SORT_OPTIONS.TIME_ASC,
  filterStatus: KDS_FILTER_OPTIONS.ALL,
  showCompletedOrders: false,
  autoRefresh: true,
  refreshInterval: 30, // seconds

  // Performance Metrics
  metrics: {
    ordersCompleted: 0,
    itemsCompleted: 0,
    avgPrepTime: 0,
    avgTicketTime: 0,
    onTimePercentage: 0,
    activeOrders: 0,
    pendingItems: 0,
    byStation: {},
    byCourse: {},
    byPriority: {},
  },
  metricsTimeRange: 'today', // today, week, month

  // UI State
  isLoading: false,
  error: null,
  soundEnabled: true,
  notificationsEnabled: true,
  lastUpdate: null,

  // Hardware Status
  hardware: {
    printers: {
      status: 'disconnected', // connected, disconnected, error
      devices: [],
      routing: [],
      queue: [],
    },
    pager: {
      status: 'disconnected',
      enabled: false,
      activePagers: [],
    },
    customerDisplay: {
      status: 'disconnected',
      enabled: false,
      currentMessage: { line1: '', line2: '' },
    },
    healthStatus: {
      lastCheck: null,
      errors: [],
      warnings: [],
    },
  },
};

/**
 * Kitchen Display Slice Factory
 */
export const createKitchenDisplaySlice = (set, get) => ({
  kitchenDisplay: initialState,

  // ==================== Station Management ====================

  /**
   * Set selected station (null for all stations)
   */
  setSelectedStation: (stationId) =>
    set(
      produce((state) => {
        state.kitchenDisplay.selectedStation = stationId;
        // Refilter orders when station changes
        const filteredOrders = get().filterOrdersByStation(stationId);
        state.kitchenDisplay.filteredOrders = filteredOrders;
        state.kitchenDisplay.orderQueue = get().sortOrders(filteredOrders);
      })
    ),

  /**
   * Update station configuration
   */
  updateStation: (stationId, updates) =>
    set(
      produce((state) => {
        const stationIndex = state.kitchenDisplay.stations.findIndex(
          (s) => s.id === stationId
        );
        if (stationIndex !== -1) {
          state.kitchenDisplay.stations[stationIndex] = {
            ...state.kitchenDisplay.stations[stationIndex],
            ...updates,
          };
        }
      })
    ),

  /**
   * Enable/Disable station
   */
  toggleStation: (stationId) =>
    set(
      produce((state) => {
        const station = state.kitchenDisplay.stations.find(
          (s) => s.id === stationId
        );
        if (station) {
          station.enabled = !station.enabled;
        }
      })
    ),

  /**
   * Add new station
   */
  addStation: (stationConfig) =>
    set(
      produce((state) => {
        state.kitchenDisplay.stations.push(stationConfig);
      })
    ),

  /**
   * Remove station
   */
  removeStation: (stationId) =>
    set(
      produce((state) => {
        state.kitchenDisplay.stations = state.kitchenDisplay.stations.filter(
          (s) => s.id !== stationId
        );
      })
    ),

  // ==================== Order Management ====================

  /**
   * Set kitchen orders
   */
  setKitchenOrders: (orders) =>
    set(
      produce((state) => {
        // Enrich orders with KDS-specific data
        state.kitchenDisplay.kitchenOrders = orders.map((order) =>
          get().enrichOrderForKDS(order)
        );
        state.kitchenDisplay.lastUpdate = new Date();

        // Refilter and resort
        const filteredOrders = get().filterOrdersByStation(
          state.kitchenDisplay.selectedStation
        );
        state.kitchenDisplay.filteredOrders = filteredOrders;
        state.kitchenDisplay.orderQueue = get().sortOrders(filteredOrders);

        // Update metrics
        get().updateMetrics();
      })
    ),

  /**
   * Add new kitchen order (real-time)
   */
  addKitchenOrder: (order) =>
    set(
      produce((state) => {
        const enrichedOrder = get().enrichOrderForKDS(order);
        state.kitchenDisplay.kitchenOrders.push(enrichedOrder);
        state.kitchenDisplay.lastUpdate = new Date();

        // Refilter and resort
        const filteredOrders = get().filterOrdersByStation(
          state.kitchenDisplay.selectedStation
        );
        state.kitchenDisplay.filteredOrders = filteredOrders;
        state.kitchenDisplay.orderQueue = get().sortOrders(filteredOrders);

        // Update metrics
        get().updateMetrics();

        // Play notification sound if enabled
        if (state.kitchenDisplay.soundEnabled) {
          get().playNotificationSound();
        }
      })
    ),

  /**
   * Update kitchen order
   */
  updateKitchenOrder: (orderId, updates) =>
    set(
      produce((state) => {
        const orderIndex = state.kitchenDisplay.kitchenOrders.findIndex(
          (o) => o.id === orderId
        );
        if (orderIndex !== -1) {
          state.kitchenDisplay.kitchenOrders[orderIndex] = {
            ...state.kitchenDisplay.kitchenOrders[orderIndex],
            ...updates,
          };

          // Re-enrich with KDS data
          state.kitchenDisplay.kitchenOrders[orderIndex] = get().enrichOrderForKDS(
            state.kitchenDisplay.kitchenOrders[orderIndex]
          );

          // Refilter and resort
          const filteredOrders = get().filterOrdersByStation(
            state.kitchenDisplay.selectedStation
          );
          state.kitchenDisplay.filteredOrders = filteredOrders;
          state.kitchenDisplay.orderQueue = get().sortOrders(filteredOrders);

          // Update metrics
          get().updateMetrics();
        }
      })
    ),

  /**
   * Remove kitchen order (completed/cancelled)
   */
  removeKitchenOrder: (orderId) =>
    set(
      produce((state) => {
        state.kitchenDisplay.kitchenOrders =
          state.kitchenDisplay.kitchenOrders.filter((o) => o.id !== orderId);

        // Refilter and resort
        const filteredOrders = get().filterOrdersByStation(
          state.kitchenDisplay.selectedStation
        );
        state.kitchenDisplay.filteredOrders = filteredOrders;
        state.kitchenDisplay.orderQueue = get().sortOrders(filteredOrders);

        // Update metrics
        get().updateMetrics();
      })
    ),

  /**
   * Update order item status
   */
  updateOrderItemStatus: (orderId, itemId, status) =>
    set(
      produce((state) => {
        const order = state.kitchenDisplay.kitchenOrders.find(
          (o) => o.id === orderId
        );
        if (order) {
          const item = order.items.find((i) => i.id === itemId);
          if (item) {
            item.status = status;
            if (status === 'preparing' && !item.startedAt) {
              item.startedAt = new Date();
            }
            if (status === 'ready') {
              item.readyAt = new Date();
              if (item.startedAt) {
                item.prepTime = Math.round(
                  (new Date() - new Date(item.startedAt)) / 60000
                );
              }
            }
          }

          // Re-enrich order
          const enrichedOrder = get().enrichOrderForKDS(order);
          const orderIndex = state.kitchenDisplay.kitchenOrders.findIndex(
            (o) => o.id === orderId
          );
          state.kitchenDisplay.kitchenOrders[orderIndex] = enrichedOrder;

          // Refilter
          const filteredOrders = get().filterOrdersByStation(
            state.kitchenDisplay.selectedStation
          );
          state.kitchenDisplay.filteredOrders = filteredOrders;
          state.kitchenDisplay.orderQueue = get().sortOrders(filteredOrders);
        }
      })
    ),

  // ==================== Display Settings ====================

  /**
   * Set view mode
   */
  setViewMode: (mode) =>
    set(
      produce((state) => {
        state.kitchenDisplay.viewMode = mode;
      })
    ),

  /**
   * Set sort option
   */
  setSortBy: (sortOption) =>
    set(
      produce((state) => {
        state.kitchenDisplay.sortBy = sortOption;
        state.kitchenDisplay.orderQueue = get().sortOrders(
          state.kitchenDisplay.filteredOrders
        );
      })
    ),

  /**
   * Set filter status
   */
  setFilterStatus: (filterStatus) =>
    set(
      produce((state) => {
        state.kitchenDisplay.filterStatus = filterStatus;
        const filteredOrders = get().filterOrdersByStation(
          state.kitchenDisplay.selectedStation
        );
        state.kitchenDisplay.filteredOrders = filteredOrders;
        state.kitchenDisplay.orderQueue = get().sortOrders(filteredOrders);
      })
    ),

  /**
   * Toggle sound notifications
   */
  toggleSound: () =>
    set(
      produce((state) => {
        state.kitchenDisplay.soundEnabled = !state.kitchenDisplay.soundEnabled;
      })
    ),

  /**
   * Toggle notifications
   */
  toggleNotifications: () =>
    set(
      produce((state) => {
        state.kitchenDisplay.notificationsEnabled =
          !state.kitchenDisplay.notificationsEnabled;
      })
    ),

  /**
   * Set auto refresh
   */
  setAutoRefresh: (enabled) =>
    set(
      produce((state) => {
        state.kitchenDisplay.autoRefresh = enabled;
      })
    ),

  // ==================== Helper Functions ====================

  /**
   * Enrich order with KDS-specific data
   */
  enrichOrderForKDS: (order) => {
    const now = new Date();
    const orderTime = new Date(order.createdAt || order.confirmedAt || now);
    const elapsedMinutes = Math.round((now - orderTime) / 60000);

    // Determine aging status
    let agingStatus = ORDER_AGING_COLORS.FRESH;
    if (elapsedMinutes >= ORDER_AGING_THRESHOLDS.URGENT) {
      agingStatus = ORDER_AGING_COLORS.URGENT;
    } else if (elapsedMinutes >= ORDER_AGING_THRESHOLDS.CRITICAL) {
      agingStatus = ORDER_AGING_COLORS.CRITICAL;
    } else if (elapsedMinutes >= ORDER_AGING_THRESHOLDS.WARNING) {
      agingStatus = ORDER_AGING_COLORS.WARNING;
    }

    return {
      ...order,
      elapsedTime: elapsedMinutes,
      agingStatus,
      priority: order.priority || 'normal',
      source: order.sessionId ? 'qr' : order.source || 'pos',
    };
  },

  /**
   * Filter orders by selected station
   */
  filterOrdersByStation: (stationId) => {
    const { kitchenOrders, filterStatus } = get().kitchenDisplay;

    let filtered = kitchenOrders;

    // Filter by station
    if (stationId) {
      filtered = filtered.filter((order) =>
        order.items.some((item) => item.kitchenStation === stationId)
      );
    }

    // Filter by status
    if (filterStatus !== KDS_FILTER_OPTIONS.ALL) {
      filtered = filtered.filter((order) => {
        if (filterStatus === KDS_FILTER_OPTIONS.PENDING) {
          return order.status === 'pending' || order.status === 'confirmed';
        }
        if (filterStatus === KDS_FILTER_OPTIONS.PREPARING) {
          return order.status === 'preparing';
        }
        if (filterStatus === KDS_FILTER_OPTIONS.READY) {
          return order.status === 'ready';
        }
        return true;
      });
    }

    return filtered;
  },

  /**
   * Sort orders based on sort option
   */
  sortOrders: (orders) => {
    const { sortBy } = get().kitchenDisplay;
    const sorted = [...orders];

    switch (sortBy) {
      case KDS_SORT_OPTIONS.TIME_ASC:
        return sorted.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );

      case KDS_SORT_OPTIONS.TIME_DESC:
        return sorted.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

      case KDS_SORT_OPTIONS.PRIORITY:
        const priorityWeight = { urgent: 4, high: 3, normal: 2, low: 1 };
        return sorted.sort((a, b) => {
          const aPriority = priorityWeight[a.priority] || 2;
          const bPriority = priorityWeight[b.priority] || 2;
          if (aPriority !== bPriority) {
            return bPriority - aPriority;
          }
          return new Date(a.createdAt) - new Date(b.createdAt);
        });

      case KDS_SORT_OPTIONS.TABLE:
        return sorted.sort((a, b) => {
          const aTable = parseInt(a.tableNumber) || 0;
          const bTable = parseInt(b.tableNumber) || 0;
          return aTable - bTable;
        });

      case KDS_SORT_OPTIONS.COURSE:
        const courseWeight = { appetizer: 1, main: 2, dessert: 3, beverage: 4 };
        return sorted.sort((a, b) => {
          const aCourse = a.items[0]?.course || 'main';
          const bCourse = b.items[0]?.course || 'main';
          return (courseWeight[aCourse] || 2) - (courseWeight[bCourse] || 2);
        });

      default:
        return sorted;
    }
  },

  /**
   * Update performance metrics
   */
  updateMetrics: () =>
    set(
      produce((state) => {
        const { kitchenOrders } = state.kitchenDisplay;

        // Calculate active orders and pending items
        const activeOrders = kitchenOrders.length;
        const pendingItems = kitchenOrders.reduce(
          (sum, order) =>
            sum +
            order.items.filter(
              (item) => item.status === 'pending' || item.status === 'preparing'
            ).length,
          0
        );

        state.kitchenDisplay.metrics = {
          ...state.kitchenDisplay.metrics,
          activeOrders,
          pendingItems,
        };
      })
    ),

  /**
   * Play notification sound
   */
  playNotificationSound: () => {
    // Create audio notification
    try {
      const audio = new Audio('/sounds/kitchen-notification.mp3');
      audio.volume = 0.5;
      audio.play().catch((err) => console.log('Audio play failed:', err));
    } catch (err) {
      console.log('Audio not available:', err);
    }
  },

  /**
   * Set loading state
   */
  setKDSLoading: (isLoading) =>
    set(
      produce((state) => {
        state.kitchenDisplay.isLoading = isLoading;
      })
    ),

  /**
   * Set error state
   */
  setKDSError: (error) =>
    set(
      produce((state) => {
        state.kitchenDisplay.error = error;
      })
    ),

  /**
   * Reset kitchen display state
   */
  resetKitchenDisplay: () =>
    set(
      produce((state) => {
        state.kitchenDisplay = initialState;
      })
    ),

  // ==================== Hardware Management ====================

  /**
   * Update hardware printer status
   */
  setHardwarePrinterStatus: (status, devices = [], routing = []) =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.printers = {
          status,
          devices,
          routing,
          queue: state.kitchenDisplay.hardware.printers.queue,
        };
      })
    ),

  /**
   * Update printer queue
   */
  updatePrinterQueue: (queue) =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.printers.queue = queue;
      })
    ),

  /**
   * Update pager status
   */
  setHardwarePagerStatus: (status, enabled, activePagers = []) =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.pager = {
          status,
          enabled,
          activePagers,
        };
      })
    ),

  /**
   * Add active pager
   */
  addActivePager: (pagerInfo) =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.pager.activePagers.push(pagerInfo);
      })
    ),

  /**
   * Remove active pager
   */
  removeActivePager: (pagerNumber) =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.pager.activePagers =
          state.kitchenDisplay.hardware.pager.activePagers.filter(
            (p) => p.pagerNumber !== pagerNumber
          );
      })
    ),

  /**
   * Update customer display status
   */
  setHardwareCustomerDisplayStatus: (status, enabled, currentMessage = null) =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.customerDisplay = {
          status,
          enabled,
          currentMessage: currentMessage || state.kitchenDisplay.hardware.customerDisplay.currentMessage,
        };
      })
    ),

  /**
   * Update customer display message
   */
  updateCustomerDisplayMessage: (line1, line2) =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.customerDisplay.currentMessage = {
          line1,
          line2,
        };
      })
    ),

  /**
   * Update hardware health status
   */
  setHardwareHealthStatus: (healthStatus) =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.healthStatus = {
          ...state.kitchenDisplay.hardware.healthStatus,
          ...healthStatus,
        };
      })
    ),

  /**
   * Add hardware error
   */
  addHardwareError: (error) =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.healthStatus.errors = [
          ...state.kitchenDisplay.hardware.healthStatus.errors.slice(-9),
          {
            ...error,
            timestamp: new Date(),
          },
        ];
      })
    ),

  /**
   * Add hardware warning
   */
  addHardwareWarning: (warning) =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.healthStatus.warnings = [
          ...state.kitchenDisplay.hardware.healthStatus.warnings.slice(-9),
          {
            ...warning,
            timestamp: new Date(),
          },
        ];
      })
    ),

  /**
   * Clear hardware errors
   */
  clearHardwareErrors: () =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.healthStatus.errors = [];
      })
    ),

  /**
   * Clear hardware warnings
   */
  clearHardwareWarnings: () =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.healthStatus.warnings = [];
      })
    ),
});

export default createKitchenDisplaySlice;
