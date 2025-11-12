/**
 * @typedef {Object} RestaurantOrder
 * @property {string} id - Unique order identifier
 * @property {string} orderNumber - Human-readable order number (e.g., "ORD-001")
 * @property {string} status - Current order status
 * @property {string} serviceType - Type of service (dine-in, takeaway, delivery)
 * @property {string|null} tableId - Associated table ID for dine-in orders
 * @property {string|null} tableName - Table name/number for display
 * @property {string|null} customerId - Customer ID if known
 * @property {Object|null} customer - Customer information
 * @property {string} customer.name - Customer name
 * @property {string} customer.phone - Customer phone number
 * @property {string} customer.email - Customer email
 * @property {OrderItem[]} items - Order items
 * @property {number} subtotal - Subtotal before tax and discounts
 * @property {number} tax - Tax amount
 * @property {number} discount - Discount amount
 * @property {number} tip - Tip amount
 * @property {number} total - Total order amount
 * @property {string|null} assignedServerId - ID of assigned server/waiter
 * @property {string|null} assignedServerName - Name of assigned server
 * @property {string[]} stationRoutes - Kitchen stations this order is routed to
 * @property {OrderStatusHistory[]} statusHistory - History of status changes
 * @property {string|null} notes - Special instructions or notes
 * @property {string} createdAt - ISO timestamp when order was created
 * @property {string} updatedAt - ISO timestamp when order was last updated
 * @property {string|null} completedAt - ISO timestamp when order was completed
 * @property {string} branchId - Branch/location ID
 * @property {string} createdBy - User ID who created the order
 * @property {PaymentInfo|null} payment - Payment information
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id - Item ID
 * @property {string} productId - Product/menu item ID
 * @property {string} name - Product name
 * @property {number} quantity - Quantity ordered
 * @property {number} price - Unit price
 * @property {number} total - Total price (quantity * price + modifiers)
 * @property {OrderModifier[]} modifiers - Applied modifiers
 * @property {string|null} notes - Special instructions for this item
 * @property {string} status - Item status (pending, preparing, ready, served)
 * @property {string|null} stationId - Kitchen station assigned to
 * @property {string|null} stationName - Kitchen station name
 */

/**
 * @typedef {Object} OrderModifier
 * @property {string} id - Modifier ID
 * @property {string} name - Modifier name
 * @property {number} price - Additional price for modifier
 * @property {string|null} groupName - Modifier group name
 */

/**
 * @typedef {Object} OrderStatusHistory
 * @property {string} status - Status at this point
 * @property {string} timestamp - ISO timestamp
 * @property {string} userId - User who made the change
 * @property {string} userName - Name of user who made the change
 * @property {string|null} notes - Notes about the change
 */

/**
 * @typedef {Object} PaymentInfo
 * @property {string} method - Payment method (cash, card, etc.)
 * @property {string} status - Payment status (pending, paid, refunded)
 * @property {string|null} transactionId - Payment transaction ID
 * @property {string|null} paidAt - ISO timestamp when paid
 */

/**
 * Order status constants
 */
export const ORDER_STATUS = {
  DRAFT: 'draft',                   // Order being created
  PENDING: 'pending',               // Order submitted, awaiting confirmation
  CONFIRMED: 'confirmed',           // Order confirmed by staff
  PREPARING: 'preparing',           // Being prepared in kitchen
  READY: 'ready',                   // Ready to serve/pickup
  SERVED: 'served',                 // Served to customer (dine-in)
  COMPLETED: 'completed',           // Order completed and paid
  CANCELLED: 'cancelled',           // Order cancelled
  REFUNDED: 'refunded'              // Order refunded
};

/**
 * Order status labels for display
 */
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.DRAFT]: 'Draft',
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.CONFIRMED]: 'Confirmed',
  [ORDER_STATUS.PREPARING]: 'Preparing',
  [ORDER_STATUS.READY]: 'Ready',
  [ORDER_STATUS.SERVED]: 'Served',
  [ORDER_STATUS.COMPLETED]: 'Completed',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
  [ORDER_STATUS.REFUNDED]: 'Refunded'
};

/**
 * Order status colors for UI
 */
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.DRAFT]: 'gray',
  [ORDER_STATUS.PENDING]: 'yellow',
  [ORDER_STATUS.CONFIRMED]: 'blue',
  [ORDER_STATUS.PREPARING]: 'orange',
  [ORDER_STATUS.READY]: 'green',
  [ORDER_STATUS.SERVED]: 'teal',
  [ORDER_STATUS.COMPLETED]: 'green',
  [ORDER_STATUS.CANCELLED]: 'red',
  [ORDER_STATUS.REFUNDED]: 'purple'
};

/**
 * Service type constants
 */
export const SERVICE_TYPE = {
  DINE_IN: 'dine_in',
  TAKEAWAY: 'takeaway',
  DELIVERY: 'delivery',
  ONLINE: 'online'
};

/**
 * Service type labels
 */
export const SERVICE_TYPE_LABELS = {
  [SERVICE_TYPE.DINE_IN]: 'Dine In',
  [SERVICE_TYPE.TAKEAWAY]: 'Takeaway',
  [SERVICE_TYPE.DELIVERY]: 'Delivery',
  [SERVICE_TYPE.ONLINE]: 'Online Order'
};

/**
 * Item status constants
 */
export const ITEM_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  READY: 'ready',
  SERVED: 'served',
  CANCELLED: 'cancelled'
};

/**
 * Kitchen station types
 */
export const KITCHEN_STATION = {
  HOT_KITCHEN: 'hot_kitchen',
  COLD_KITCHEN: 'cold_kitchen',
  GRILL: 'grill',
  BAR: 'bar',
  DESSERT: 'dessert',
  PREP: 'prep'
};

/**
 * Kitchen station labels
 */
export const KITCHEN_STATION_LABELS = {
  [KITCHEN_STATION.HOT_KITCHEN]: 'Hot Kitchen',
  [KITCHEN_STATION.COLD_KITCHEN]: 'Cold Kitchen',
  [KITCHEN_STATION.GRILL]: 'Grill',
  [KITCHEN_STATION.BAR]: 'Bar',
  [KITCHEN_STATION.DESSERT]: 'Dessert',
  [KITCHEN_STATION.PREP]: 'Prep'
};

/**
 * Payment status constants
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIAL: 'partial',
  REFUNDED: 'refunded',
  FAILED: 'failed'
};

export default {
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  SERVICE_TYPE,
  SERVICE_TYPE_LABELS,
  ITEM_STATUS,
  KITCHEN_STATION,
  KITCHEN_STATION_LABELS,
  PAYMENT_STATUS
};
