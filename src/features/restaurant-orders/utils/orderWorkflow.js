import { ORDER_STATUS, ITEM_STATUS } from '../types/order.types';

/**
 * Defines valid status transitions for orders
 */
export const ORDER_STATUS_TRANSITIONS = {
  [ORDER_STATUS.DRAFT]: [ORDER_STATUS.PENDING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PENDING]: [ORDER_STATUS.CONFIRMED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PREPARING, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.READY]: [ORDER_STATUS.SERVED, ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.SERVED]: [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED],
  [ORDER_STATUS.COMPLETED]: [ORDER_STATUS.REFUNDED],
  [ORDER_STATUS.CANCELLED]: [],
  [ORDER_STATUS.REFUNDED]: []
};

/**
 * Checks if a status transition is valid
 * @param {string} currentStatus - Current order status
 * @param {string} newStatus - Desired new status
 * @returns {boolean} - Whether the transition is valid
 */
export const isValidStatusTransition = (currentStatus, newStatus) => {
  const allowedTransitions = ORDER_STATUS_TRANSITIONS[currentStatus] || [];
  return allowedTransitions.includes(newStatus);
};

/**
 * Gets the next possible statuses for an order
 * @param {string} currentStatus - Current order status
 * @param {string} serviceType - Service type (affects workflow)
 * @returns {string[]} - Array of possible next statuses
 */
export const getNextStatuses = (currentStatus, serviceType = 'dine_in') => {
  const baseTransitions = ORDER_STATUS_TRANSITIONS[currentStatus] || [];

  // For takeaway and delivery, skip 'served' status
  if (serviceType === 'takeaway' || serviceType === 'delivery') {
    return baseTransitions.filter(status => status !== ORDER_STATUS.SERVED);
  }

  return baseTransitions;
};

/**
 * Gets the default next status for an order
 * @param {string} currentStatus - Current order status
 * @param {string} serviceType - Service type
 * @returns {string|null} - Default next status or null
 */
export const getDefaultNextStatus = (currentStatus, serviceType = 'dine_in') => {
  const nextStatuses = getNextStatuses(currentStatus, serviceType);

  // Return the first non-cancelled status if available
  const progressStatus = nextStatuses.find(status => status !== ORDER_STATUS.CANCELLED);
  return progressStatus || nextStatuses[0] || null;
};

/**
 * Checks if an order can be modified
 * @param {string} status - Order status
 * @returns {boolean} - Whether the order can be modified
 */
export const canModifyOrder = (status) => {
  return [
    ORDER_STATUS.DRAFT,
    ORDER_STATUS.PENDING,
    ORDER_STATUS.CONFIRMED
  ].includes(status);
};

/**
 * Checks if an order can be cancelled
 * @param {string} status - Order status
 * @returns {boolean} - Whether the order can be cancelled
 */
export const canCancelOrder = (status) => {
  return ![
    ORDER_STATUS.COMPLETED,
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.REFUNDED
  ].includes(status);
};

/**
 * Checks if an order can be refunded
 * @param {string} status - Order status
 * @returns {boolean} - Whether the order can be refunded
 */
export const canRefundOrder = (status) => {
  return status === ORDER_STATUS.COMPLETED;
};

/**
 * Determines if an order requires payment
 * @param {string} status - Order status
 * @returns {boolean} - Whether payment is required
 */
export const requiresPayment = (status) => {
  return [
    ORDER_STATUS.SERVED,
    ORDER_STATUS.READY // For takeaway/delivery
  ].includes(status);
};

/**
 * Gets the overall status of an order based on item statuses
 * @param {Object[]} items - Order items with status
 * @returns {string} - Derived order status
 */
export const deriveOrderStatusFromItems = (items) => {
  if (!items || items.length === 0) {
    return ORDER_STATUS.DRAFT;
  }

  const itemStatuses = items.map(item => item.status);

  // All items served
  if (itemStatuses.every(status => status === ITEM_STATUS.SERVED)) {
    return ORDER_STATUS.SERVED;
  }

  // All items ready
  if (itemStatuses.every(status =>
    status === ITEM_STATUS.READY || status === ITEM_STATUS.SERVED
  )) {
    return ORDER_STATUS.READY;
  }

  // Any item preparing
  if (itemStatuses.some(status => status === ITEM_STATUS.PREPARING)) {
    return ORDER_STATUS.PREPARING;
  }

  // All items pending
  if (itemStatuses.every(status => status === ITEM_STATUS.PENDING)) {
    return ORDER_STATUS.CONFIRMED;
  }

  return ORDER_STATUS.PENDING;
};

/**
 * Validates order data before submission
 * @param {Object} order - Order object to validate
 * @returns {Object} - Validation result { isValid, errors }
 */
export const validateOrder = (order) => {
  const errors = [];

  if (!order.serviceType) {
    errors.push('Service type is required');
  }

  if (order.serviceType === 'dine_in' && !order.tableId) {
    errors.push('Table selection is required for dine-in orders');
  }

  if (!order.items || order.items.length === 0) {
    errors.push('Order must have at least one item');
  }

  if (order.items && order.items.some(item => item.quantity <= 0)) {
    errors.push('All items must have quantity greater than 0');
  }

  if (order.total <= 0) {
    errors.push('Order total must be greater than 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calculates order totals from items
 * @param {Object[]} items - Order items
 * @param {number} taxRate - Tax rate (e.g., 0.1 for 10%)
 * @param {number} discount - Discount amount
 * @param {number} tip - Tip amount
 * @returns {Object} - Calculated totals
 */
export const calculateOrderTotals = (items = [], taxRate = 0, discount = 0, tip = 0) => {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.price;
    const modifiersTotal = (item.modifiers || []).reduce(
      (modSum, mod) => modSum + (mod.price * item.quantity),
      0
    );
    return sum + itemTotal + modifiersTotal;
  }, 0);

  const discountAmount = Math.min(discount, subtotal);
  const taxableAmount = subtotal - discountAmount;
  const tax = taxableAmount * taxRate;
  const total = taxableAmount + tax + tip;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    discount: Number(discountAmount.toFixed(2)),
    tip: Number(tip.toFixed(2)),
    total: Number(total.toFixed(2))
  };
};

/**
 * Groups order items by kitchen station
 * @param {Object[]} items - Order items
 * @returns {Object} - Items grouped by station
 */
export const groupItemsByStation = (items = []) => {
  return items.reduce((groups, item) => {
    const station = item.stationId || 'unassigned';
    if (!groups[station]) {
      groups[station] = [];
    }
    groups[station].push(item);
    return groups;
  }, {});
};

/**
 * Formats order number with padding
 * @param {number} orderNumber - Order number
 * @returns {string} - Formatted order number
 */
export const formatOrderNumber = (orderNumber) => {
  return `ORD-${String(orderNumber).padStart(6, '0')}`;
};

/**
 * Gets time elapsed since order creation
 * @param {string} createdAt - ISO timestamp
 * @returns {string} - Human readable time elapsed
 */
export const getOrderAge = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMinutes = Math.floor((now - created) / (1000 * 60));

  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

/**
 * Checks if an order is overdue based on estimated time
 * @param {string} createdAt - ISO timestamp
 * @param {number} estimatedMinutes - Estimated preparation time in minutes
 * @returns {boolean} - Whether order is overdue
 */
export const isOrderOverdue = (createdAt, estimatedMinutes = 30) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMinutes = Math.floor((now - created) / (1000 * 60));

  return diffMinutes > estimatedMinutes;
};

export default {
  ORDER_STATUS_TRANSITIONS,
  isValidStatusTransition,
  getNextStatuses,
  getDefaultNextStatus,
  canModifyOrder,
  canCancelOrder,
  canRefundOrder,
  requiresPayment,
  deriveOrderStatusFromItems,
  validateOrder,
  calculateOrderTotals,
  groupItemsByStation,
  formatOrderNumber,
  getOrderAge,
  isOrderOverdue
};
