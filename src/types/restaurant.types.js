/**
 * Restaurant Type Definitions
 * Defines types and interfaces for restaurant-specific features
 */

/**
 * @typedef {'available' | 'occupied' | 'reserved' | 'cleaning'} TableStatus
 * Status of a restaurant table
 */

/**
 * @typedef {Object} Table
 * @property {string} id - Unique table identifier
 * @property {string} number - Table number/name
 * @property {number} capacity - Maximum number of guests
 * @property {TableStatus} status - Current table status
 * @property {string|null} orderId - ID of current order (if any)
 * @property {string|null} serverId - ID of assigned server
 * @property {Date|null} occupiedAt - When table became occupied
 * @property {string|null} section - Table section/area
 */

/**
 * @typedef {'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'cancelled'} OrderItemStatus
 * Status of an individual order item
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id - Unique item identifier
 * @property {string} productId - Product/menu item ID
 * @property {string} name - Product name
 * @property {number} quantity - Quantity ordered
 * @property {number} price - Price per unit
 * @property {OrderItemStatus} status - Current item status
 * @property {string} [notes] - Special instructions
 * @property {Object[]} [modifiers] - Item modifications
 * @property {string} [courseNumber] - Course number (appetizer, main, dessert)
 */

/**
 * @typedef {'draft' | 'open' | 'in_progress' | 'ready' | 'completed' | 'cancelled'} OrderStatus
 * Status of a restaurant order
 */

/**
 * @typedef {Object} RestaurantOrder
 * @property {string} id - Unique order identifier
 * @property {string} tableId - Associated table ID
 * @property {OrderStatus} status - Current order status
 * @property {OrderItem[]} items - Order items
 * @property {number} subtotal - Order subtotal
 * @property {number} tax - Tax amount
 * @property {number} total - Total amount
 * @property {Date} createdAt - When order was created
 * @property {Date|null} completedAt - When order was completed
 * @property {string} serverId - Server/waiter ID
 * @property {string} [customerId] - Customer ID (optional)
 * @property {string} [notes] - Order notes
 */

/**
 * @typedef {'appetizer' | 'main' | 'dessert' | 'beverage'} CourseType
 * Type of course in a meal
 */

/**
 * @typedef {Object} MenuCategory
 * @property {string} id - Unique category identifier
 * @property {string} name - Category name
 * @property {string} [description] - Category description
 * @property {number} sortOrder - Display order
 * @property {boolean} active - Whether category is active
 * @property {string} [icon] - Icon identifier
 * @property {CourseType} [courseType] - Associated course type
 */

/**
 * @typedef {Object} RestaurantSettings
 * @property {boolean} enableTableService - Enable table management
 * @property {boolean} enableKitchenDisplay - Enable kitchen display system
 * @property {boolean} enableCourseManagement - Enable course/timing management
 * @property {boolean} autoAssignTables - Auto-assign tables to servers
 * @property {number} defaultServiceCharge - Default service charge percentage
 * @property {boolean} enableTipping - Enable tipping functionality
 * @property {number[]} tipSuggestions - Suggested tip percentages
 * @property {boolean} requireServerAssignment - Require server for orders
 * @property {string} defaultOrderStatus - Default status for new orders
 * @property {boolean} enableReservations - Enable table reservations
 */

/**
 * Table status constants
 * @enum {TableStatus}
 */
export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  CLEANING: 'cleaning',
};

/**
 * Order status constants
 * @enum {OrderStatus}
 */
export const ORDER_STATUS = {
  DRAFT: 'draft',
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/**
 * Order item status constants
 * @enum {OrderItemStatus}
 */
export const ORDER_ITEM_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  SERVED: 'served',
  CANCELLED: 'cancelled',
};

/**
 * Course type constants
 * @enum {CourseType}
 */
export const COURSE_TYPES = {
  APPETIZER: 'appetizer',
  MAIN: 'main',
  DESSERT: 'dessert',
  BEVERAGE: 'beverage',
};

/**
 * Status labels for display
 * @type {Record<TableStatus, string>}
 */
export const TABLE_STATUS_LABELS = {
  [TABLE_STATUS.AVAILABLE]: 'Available',
  [TABLE_STATUS.OCCUPIED]: 'Occupied',
  [TABLE_STATUS.RESERVED]: 'Reserved',
  [TABLE_STATUS.CLEANING]: 'Cleaning',
};

/**
 * Status colors for UI
 * @type {Record<TableStatus, string>}
 */
export const TABLE_STATUS_COLORS = {
  [TABLE_STATUS.AVAILABLE]: 'green',
  [TABLE_STATUS.OCCUPIED]: 'red',
  [TABLE_STATUS.RESERVED]: 'blue',
  [TABLE_STATUS.CLEANING]: 'yellow',
};
