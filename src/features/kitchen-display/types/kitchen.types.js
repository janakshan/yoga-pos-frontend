/**
 * Kitchen Display System Types
 *
 * Defines types and constants for the Kitchen Display System (KDS)
 */

/**
 * Kitchen Station Types
 * These match the KITCHEN_STATION enum from order.types.js
 */
export const KITCHEN_STATION = {
  HOT_KITCHEN: 'hot_kitchen',
  COLD_KITCHEN: 'cold_kitchen',
  GRILL: 'grill',
  BAR: 'bar',
  DESSERT: 'dessert',
  PREP: 'prep',
};

/**
 * Kitchen Station Labels for Display
 */
export const KITCHEN_STATION_LABELS = {
  [KITCHEN_STATION.HOT_KITCHEN]: 'Hot Kitchen',
  [KITCHEN_STATION.COLD_KITCHEN]: 'Cold Kitchen',
  [KITCHEN_STATION.GRILL]: 'Grill',
  [KITCHEN_STATION.BAR]: 'Bar',
  [KITCHEN_STATION.DESSERT]: 'Dessert',
  [KITCHEN_STATION.PREP]: 'Prep',
};

/**
 * Kitchen Station Icons (Heroicons)
 */
export const KITCHEN_STATION_ICONS = {
  [KITCHEN_STATION.HOT_KITCHEN]: 'FireIcon',
  [KITCHEN_STATION.COLD_KITCHEN]: 'BeakerIcon',
  [KITCHEN_STATION.GRILL]: 'FireIcon',
  [KITCHEN_STATION.BAR]: 'CubeIcon',
  [KITCHEN_STATION.DESSERT]: 'CakeIcon',
  [KITCHEN_STATION.PREP]: 'ScissorsIcon',
};

/**
 * Kitchen Station Colors
 */
export const KITCHEN_STATION_COLORS = {
  [KITCHEN_STATION.HOT_KITCHEN]: 'red',
  [KITCHEN_STATION.COLD_KITCHEN]: 'blue',
  [KITCHEN_STATION.GRILL]: 'orange',
  [KITCHEN_STATION.BAR]: 'purple',
  [KITCHEN_STATION.DESSERT]: 'pink',
  [KITCHEN_STATION.PREP]: 'green',
};

/**
 * Order Priority Levels
 */
export const ORDER_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

/**
 * Order Priority Labels
 */
export const ORDER_PRIORITY_LABELS = {
  [ORDER_PRIORITY.LOW]: 'Low',
  [ORDER_PRIORITY.NORMAL]: 'Normal',
  [ORDER_PRIORITY.HIGH]: 'High',
  [ORDER_PRIORITY.URGENT]: 'Urgent',
};

/**
 * Order Priority Colors
 */
export const ORDER_PRIORITY_COLORS = {
  [ORDER_PRIORITY.LOW]: 'gray',
  [ORDER_PRIORITY.NORMAL]: 'blue',
  [ORDER_PRIORITY.HIGH]: 'orange',
  [ORDER_PRIORITY.URGENT]: 'red',
};

/**
 * Course Types
 */
export const COURSE_TYPE = {
  APPETIZER: 'appetizer',
  MAIN: 'main',
  DESSERT: 'dessert',
  BEVERAGE: 'beverage',
};

/**
 * Course Type Labels
 */
export const COURSE_TYPE_LABELS = {
  [COURSE_TYPE.APPETIZER]: 'Appetizer',
  [COURSE_TYPE.MAIN]: 'Main Course',
  [COURSE_TYPE.DESSERT]: 'Dessert',
  [COURSE_TYPE.BEVERAGE]: 'Beverage',
};

/**
 * Order Aging Thresholds (in minutes)
 */
export const ORDER_AGING_THRESHOLDS = {
  WARNING: 10, // Yellow warning
  CRITICAL: 15, // Orange alert
  URGENT: 20, // Red urgent
};

/**
 * Order Aging Colors
 */
export const ORDER_AGING_COLORS = {
  FRESH: 'green', // 0-10 minutes
  WARNING: 'yellow', // 10-15 minutes
  CRITICAL: 'orange', // 15-20 minutes
  URGENT: 'red', // 20+ minutes
};

/**
 * Kitchen Display View Modes
 */
export const KDS_VIEW_MODE = {
  GRID: 'grid',
  LIST: 'list',
  COMPACT: 'compact',
};

/**
 * Kitchen Display Sort Options
 */
export const KDS_SORT_OPTIONS = {
  TIME_ASC: 'time_asc', // Oldest first
  TIME_DESC: 'time_desc', // Newest first
  PRIORITY: 'priority', // Highest priority first
  TABLE: 'table', // By table number
  COURSE: 'course', // By course sequence
};

/**
 * Kitchen Display Sort Labels
 */
export const KDS_SORT_LABELS = {
  [KDS_SORT_OPTIONS.TIME_ASC]: 'Oldest First',
  [KDS_SORT_OPTIONS.TIME_DESC]: 'Newest First',
  [KDS_SORT_OPTIONS.PRIORITY]: 'Priority',
  [KDS_SORT_OPTIONS.TABLE]: 'Table Number',
  [KDS_SORT_OPTIONS.COURSE]: 'Course Sequence',
};

/**
 * Kitchen Display Filter Options
 */
export const KDS_FILTER_OPTIONS = {
  ALL: 'all',
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
};

/**
 * Kitchen Printer Actions
 */
export const PRINTER_ACTION = {
  PRINT_ORDER: 'print_order',
  PRINT_ITEM: 'print_item',
  REPRINT: 'reprint',
};

/**
 * Performance Metric Types
 */
export const METRIC_TYPE = {
  AVG_PREP_TIME: 'avg_prep_time',
  ORDERS_COMPLETED: 'orders_completed',
  ITEMS_COMPLETED: 'items_completed',
  ON_TIME_PERCENTAGE: 'on_time_percentage',
  TICKET_TIME: 'ticket_time',
};

/**
 * Station Configuration Type
 * @typedef {Object} StationConfig
 * @property {string} id - Station ID
 * @property {string} name - Station name
 * @property {string} type - KITCHEN_STATION type
 * @property {boolean} enabled - Whether station is active
 * @property {string} printerName - Associated printer name
 * @property {number} displayOrder - Order in station selector
 * @property {string[]} productCategories - Categories assigned to this station
 * @property {Object} settings - Station-specific settings
 */

/**
 * Kitchen Order Item Type (extended from order item)
 * @typedef {Object} KitchenOrderItem
 * @property {string} id - Item ID
 * @property {string} name - Item name
 * @property {number} quantity - Quantity
 * @property {string} status - ITEM_STATUS
 * @property {string} kitchenStation - KITCHEN_STATION
 * @property {string} course - COURSE_TYPE
 * @property {string} priority - ORDER_PRIORITY
 * @property {Object[]} modifiers - Item modifiers
 * @property {string} notes - Special instructions
 * @property {Date} startedAt - When item started preparing
 * @property {Date} readyAt - When item marked ready
 * @property {number} prepTime - Preparation time in minutes
 */

/**
 * Kitchen Display Order Type (extended from order)
 * @typedef {Object} KitchenDisplayOrder
 * @property {string} id - Order ID
 * @property {string} orderNumber - Display order number
 * @property {string} tableNumber - Table number or name
 * @property {string} serviceType - Service type (dine-in, takeaway, etc.)
 * @property {string} status - ORDER_STATUS
 * @property {string} priority - ORDER_PRIORITY
 * @property {KitchenOrderItem[]} items - Order items
 * @property {Date} createdAt - Order creation time
 * @property {Date} confirmedAt - Order confirmation time
 * @property {Date} estimatedReadyTime - Estimated ready time
 * @property {number} elapsedTime - Time since order received (minutes)
 * @property {string} agingStatus - ORDER_AGING_COLORS status
 * @property {string} serverName - Server/waiter name
 * @property {number} customerCount - Number of customers
 * @property {string} source - Order source (pos, qr, online)
 * @property {string} sessionId - QR session ID if from QR ordering
 */

/**
 * Performance Metrics Type
 * @typedef {Object} PerformanceMetrics
 * @property {number} ordersCompleted - Total orders completed in period
 * @property {number} itemsCompleted - Total items completed in period
 * @property {number} avgPrepTime - Average preparation time (minutes)
 * @property {number} avgTicketTime - Average ticket time (minutes)
 * @property {number} onTimePercentage - Orders completed on time (%)
 * @property {number} activeOrders - Currently active orders
 * @property {number} pendingItems - Pending items count
 * @property {Object} byStation - Metrics broken down by station
 * @property {Object} byCourse - Metrics broken down by course
 * @property {Object} byPriority - Metrics broken down by priority
 */

/**
 * Default Station Configuration
 */
export const DEFAULT_STATIONS = [
  {
    id: 'hot-kitchen-1',
    name: 'Hot Kitchen',
    type: KITCHEN_STATION.HOT_KITCHEN,
    enabled: true,
    printerName: 'Hot Kitchen Printer',
    displayOrder: 1,
    productCategories: ['mains', 'sides'],
    settings: {
      autoAccept: false,
      soundNotification: true,
      warningTime: 10,
    },
  },
  {
    id: 'cold-kitchen-1',
    name: 'Cold Kitchen',
    type: KITCHEN_STATION.COLD_KITCHEN,
    enabled: true,
    printerName: 'Cold Kitchen Printer',
    displayOrder: 2,
    productCategories: ['salads', 'appetizers'],
    settings: {
      autoAccept: false,
      soundNotification: true,
      warningTime: 8,
    },
  },
  {
    id: 'grill-1',
    name: 'Grill Station',
    type: KITCHEN_STATION.GRILL,
    enabled: true,
    printerName: 'Grill Printer',
    displayOrder: 3,
    productCategories: ['grilled'],
    settings: {
      autoAccept: false,
      soundNotification: true,
      warningTime: 12,
    },
  },
  {
    id: 'bar-1',
    name: 'Bar',
    type: KITCHEN_STATION.BAR,
    enabled: true,
    printerName: 'Bar Printer',
    displayOrder: 4,
    productCategories: ['beverages', 'cocktails'],
    settings: {
      autoAccept: false,
      soundNotification: true,
      warningTime: 5,
    },
  },
  {
    id: 'dessert-1',
    name: 'Dessert Station',
    type: KITCHEN_STATION.DESSERT,
    enabled: true,
    printerName: 'Dessert Printer',
    displayOrder: 5,
    productCategories: ['desserts'],
    settings: {
      autoAccept: false,
      soundNotification: true,
      warningTime: 8,
    },
  },
  {
    id: 'prep-1',
    name: 'Prep Station',
    type: KITCHEN_STATION.PREP,
    enabled: true,
    printerName: 'Prep Printer',
    displayOrder: 6,
    productCategories: ['prep'],
    settings: {
      autoAccept: false,
      soundNotification: true,
      warningTime: 15,
    },
  },
];

export default {
  KITCHEN_STATION,
  KITCHEN_STATION_LABELS,
  KITCHEN_STATION_ICONS,
  KITCHEN_STATION_COLORS,
  ORDER_PRIORITY,
  ORDER_PRIORITY_LABELS,
  ORDER_PRIORITY_COLORS,
  COURSE_TYPE,
  COURSE_TYPE_LABELS,
  ORDER_AGING_THRESHOLDS,
  ORDER_AGING_COLORS,
  KDS_VIEW_MODE,
  KDS_SORT_OPTIONS,
  KDS_SORT_LABELS,
  KDS_FILTER_OPTIONS,
  PRINTER_ACTION,
  METRIC_TYPE,
  DEFAULT_STATIONS,
};
