/**
 * Restaurant Helper Utilities
 * Common utility functions for restaurant operations
 */

import { TABLE_STATUS, ORDER_STATUS, COURSE_TYPES } from '../../../types/restaurant.types';
import { COURSE_TYPE_ORDER } from './constants';

/**
 * Calculate total time a table has been occupied
 * @param {Date|string|null} occupiedAt - When the table was occupied
 * @returns {number} Duration in minutes
 */
export const calculateTableOccupancyTime = (occupiedAt) => {
  if (!occupiedAt) return 0;
  const occupiedDate = new Date(occupiedAt);
  const now = new Date();
  const diffMs = now - occupiedDate;
  return Math.floor(diffMs / 1000 / 60); // Convert to minutes
};

/**
 * Format occupancy time for display
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted time string
 */
export const formatOccupancyTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

/**
 * Check if a table is available
 * @param {import('../../../types/restaurant.types').Table} table
 * @returns {boolean}
 */
export const isTableAvailable = (table) => {
  return table.status === TABLE_STATUS.AVAILABLE;
};

/**
 * Check if a table can be assigned
 * @param {import('../../../types/restaurant.types').Table} table
 * @returns {boolean}
 */
export const canAssignTable = (table) => {
  return table.status === TABLE_STATUS.AVAILABLE || table.status === TABLE_STATUS.RESERVED;
};

/**
 * Get table status display text
 * @param {import('../../../types/restaurant.types').TableStatus} status
 * @returns {string}
 */
export const getTableStatusText = (status) => {
  const statusMap = {
    [TABLE_STATUS.AVAILABLE]: 'Available',
    [TABLE_STATUS.OCCUPIED]: 'Occupied',
    [TABLE_STATUS.RESERVED]: 'Reserved',
    [TABLE_STATUS.CLEANING]: 'Cleaning',
  };
  return statusMap[status] || status;
};

/**
 * Calculate order total
 * @param {import('../../../types/restaurant.types').OrderItem[]} items
 * @param {number} taxRate - Tax rate as percentage (e.g., 10 for 10%)
 * @param {number} serviceCharge - Service charge as percentage
 * @returns {{subtotal: number, tax: number, serviceCharge: number, total: number}}
 */
export const calculateOrderTotal = (items, taxRate = 0, serviceCharge = 0) => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const tax = (subtotal * taxRate) / 100;
  const serviceChargeAmount = (subtotal * serviceCharge) / 100;
  const total = subtotal + tax + serviceChargeAmount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    serviceCharge: parseFloat(serviceChargeAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

/**
 * Sort order items by course type
 * @param {import('../../../types/restaurant.types').OrderItem[]} items
 * @returns {import('../../../types/restaurant.types').OrderItem[]}
 */
export const sortItemsByCourse = (items) => {
  return [...items].sort((a, b) => {
    const orderA = COURSE_TYPE_ORDER[a.courseNumber] || 999;
    const orderB = COURSE_TYPE_ORDER[b.courseNumber] || 999;
    return orderA - orderB;
  });
};

/**
 * Group order items by course type
 * @param {import('../../../types/restaurant.types').OrderItem[]} items
 * @returns {Object<string, import('../../../types/restaurant.types').OrderItem[]>}
 */
export const groupItemsByCourse = (items) => {
  return items.reduce((groups, item) => {
    const course = item.courseNumber || 'other';
    if (!groups[course]) {
      groups[course] = [];
    }
    groups[course].push(item);
    return groups;
  }, {});
};

/**
 * Check if an order is ready to be served
 * @param {import('../../../types/restaurant.types').RestaurantOrder} order
 * @returns {boolean}
 */
export const isOrderReadyToServe = (order) => {
  return order.status === ORDER_STATUS.READY;
};

/**
 * Check if an order is in progress
 * @param {import('../../../types/restaurant.types').RestaurantOrder} order
 * @returns {boolean}
 */
export const isOrderInProgress = (order) => {
  return order.status === ORDER_STATUS.IN_PROGRESS;
};

/**
 * Get order status display text
 * @param {import('../../../types/restaurant.types').OrderStatus} status
 * @returns {string}
 */
export const getOrderStatusText = (status) => {
  const statusMap = {
    [ORDER_STATUS.DRAFT]: 'Draft',
    [ORDER_STATUS.OPEN]: 'Open',
    [ORDER_STATUS.IN_PROGRESS]: 'In Progress',
    [ORDER_STATUS.READY]: 'Ready',
    [ORDER_STATUS.COMPLETED]: 'Completed',
    [ORDER_STATUS.CANCELLED]: 'Cancelled',
  };
  return statusMap[status] || status;
};

/**
 * Calculate tip amount
 * @param {number} subtotal - Order subtotal
 * @param {number} tipPercentage - Tip percentage
 * @returns {number} Tip amount
 */
export const calculateTip = (subtotal, tipPercentage) => {
  return parseFloat(((subtotal * tipPercentage) / 100).toFixed(2));
};

/**
 * Format currency value
 * @param {number} amount
 * @param {string} currency - Currency code (e.g., 'USD')
 * @param {string} locale - Locale code (e.g., 'en-US')
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Generate unique order number
 * @param {string} prefix - Order number prefix
 * @returns {string}
 */
export const generateOrderNumber = (prefix = 'ORD') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Generate unique table ID
 * @param {string} section - Table section
 * @param {string} number - Table number
 * @returns {string}
 */
export const generateTableId = (section, number) => {
  return `${section.toLowerCase().replace(/\s+/g, '-')}-${number}`;
};

/**
 * Check if order is delayed based on creation time
 * @param {Date|string} createdAt - Order creation time
 * @param {number} thresholdMinutes - Delay threshold in minutes
 * @returns {boolean}
 */
export const isOrderDelayed = (createdAt, thresholdMinutes = 30) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now - created;
  const diffMinutes = diffMs / 1000 / 60;
  return diffMinutes > thresholdMinutes;
};

/**
 * Get elapsed time since order creation
 * @param {Date|string} createdAt
 * @returns {string} Formatted elapsed time
 */
export const getOrderElapsedTime = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now - created;
  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  return formatOccupancyTime(diffMinutes);
};

/**
 * Filter tables by section
 * @param {import('../../../types/restaurant.types').Table[]} tables
 * @param {string} section
 * @returns {import('../../../types/restaurant.types').Table[]}
 */
export const filterTablesBySection = (tables, section) => {
  if (!section) return tables;
  return tables.filter((table) => table.section === section);
};

/**
 * Filter tables by status
 * @param {import('../../../types/restaurant.types').Table[]} tables
 * @param {import('../../../types/restaurant.types').TableStatus} status
 * @returns {import('../../../types/restaurant.types').Table[]}
 */
export const filterTablesByStatus = (tables, status) => {
  if (!status) return tables;
  return tables.filter((table) => table.status === status);
};

/**
 * Get tables assigned to a server
 * @param {import('../../../types/restaurant.types').Table[]} tables
 * @param {string} serverId
 * @returns {import('../../../types/restaurant.types').Table[]}
 */
export const getTablesByServer = (tables, serverId) => {
  return tables.filter((table) => table.serverId === serverId);
};
