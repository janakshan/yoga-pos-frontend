/**
 * Restaurant Module Constants
 * Defines constant values used throughout the restaurant feature
 */

/**
 * Default table sections/areas
 * @type {string[]}
 */
export const DEFAULT_TABLE_SECTIONS = [
  'Main Dining',
  'Patio',
  'Bar',
  'Private Room',
  'Outdoor',
  'VIP',
];

/**
 * Default table capacities
 * @type {number[]}
 */
export const DEFAULT_TABLE_CAPACITIES = [2, 4, 6, 8, 10, 12];

/**
 * Default tip percentages for quick selection
 * @type {number[]}
 */
export const DEFAULT_TIP_PERCENTAGES = [10, 15, 18, 20, 25];

/**
 * Default service charge percentage
 * @type {number}
 */
export const DEFAULT_SERVICE_CHARGE = 0;

/**
 * Maximum number of tables per section
 * @type {number}
 */
export const MAX_TABLES_PER_SECTION = 50;

/**
 * Default order timeout (in minutes)
 * Orders older than this are considered delayed
 * @type {number}
 */
export const DEFAULT_ORDER_TIMEOUT = 30;

/**
 * Kitchen display refresh interval (in seconds)
 * @type {number}
 */
export const KITCHEN_DISPLAY_REFRESH_INTERVAL = 5;

/**
 * Table status color mapping for UI
 * @type {Object}
 */
export const TABLE_STATUS_COLORS = {
  available: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-500',
    badge: 'bg-green-500',
  },
  occupied: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-500',
    badge: 'bg-red-500',
  },
  reserved: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-500',
    badge: 'bg-blue-500',
  },
  cleaning: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-500',
    badge: 'bg-yellow-500',
  },
};

/**
 * Order status color mapping for UI
 * @type {Object}
 */
export const ORDER_STATUS_COLORS = {
  draft: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-500',
  },
  open: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-500',
  },
  in_progress: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-500',
  },
  ready: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-500',
  },
  completed: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-500',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-500',
  },
};

/**
 * Order item status color mapping for UI
 * @type {Object}
 */
export const ORDER_ITEM_STATUS_COLORS = {
  pending: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
  },
  confirmed: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
  },
  preparing: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
  },
  ready: {
    bg: 'bg-green-100',
    text: 'text-green-800',
  },
  served: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
  },
};

/**
 * Course type labels for display
 * @type {Object}
 */
export const COURSE_TYPE_LABELS = {
  appetizer: 'Appetizer',
  main: 'Main Course',
  dessert: 'Dessert',
  beverage: 'Beverage',
};

/**
 * Course type order for sorting
 * @type {Object}
 */
export const COURSE_TYPE_ORDER = {
  appetizer: 1,
  main: 2,
  dessert: 3,
  beverage: 4,
};

/**
 * Default menu categories for restaurant
 * @type {Array<{name: string, icon: string, courseType: string}>}
 */
export const DEFAULT_MENU_CATEGORIES = [
  { name: 'Appetizers', icon: '🥗', courseType: 'appetizer' },
  { name: 'Main Courses', icon: '🍽️', courseType: 'main' },
  { name: 'Desserts', icon: '🍰', courseType: 'dessert' },
  { name: 'Beverages', icon: '🥤', courseType: 'beverage' },
  { name: 'Alcohol', icon: '🍷', courseType: 'beverage' },
];

/**
 * Table shape options
 * @type {string[]}
 */
export const TABLE_SHAPES = ['round', 'square', 'rectangle', 'oval'];

/**
 * Time slots for reservations (in 30-minute increments)
 * @type {string[]}
 */
export const RESERVATION_TIME_SLOTS = [
  '11:00', '11:30',
  '12:00', '12:30',
  '13:00', '13:30',
  '14:00', '14:30',
  '17:00', '17:30',
  '18:00', '18:30',
  '19:00', '19:30',
  '20:00', '20:30',
  '21:00', '21:30',
  '22:00',
];

/**
 * Default reservation duration (in hours)
 * @type {number}
 */
export const DEFAULT_RESERVATION_DURATION = 2;

/**
 * Priority levels for kitchen orders
 * @type {Object}
 */
export const ORDER_PRIORITY = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

/**
 * Order priority labels
 * @type {Object}
 */
export const ORDER_PRIORITY_LABELS = {
  [ORDER_PRIORITY.LOW]: 'Low Priority',
  [ORDER_PRIORITY.NORMAL]: 'Normal',
  [ORDER_PRIORITY.HIGH]: 'High Priority',
  [ORDER_PRIORITY.URGENT]: 'Urgent',
};

/**
 * Maximum items per order
 * @type {number}
 */
export const MAX_ITEMS_PER_ORDER = 100;

/**
 * Maximum modifiers per item
 * @type {number}
 */
export const MAX_MODIFIERS_PER_ITEM = 10;
