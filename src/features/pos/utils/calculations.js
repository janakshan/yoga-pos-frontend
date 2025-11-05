import { TAX_CONFIG } from '../types';

/**
 * Calculate subtotal for cart items
 * @param {Array} items - Cart items
 * @returns {number} Subtotal amount
 */
export const calculateSubtotal = (items) => {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
};

/**
 * Calculate discount amount
 * @param {number} subtotal - Subtotal amount
 * @param {number} discountPercentage - Discount percentage
 * @returns {number} Discount amount
 */
export const calculateDiscount = (subtotal, discountPercentage) => {
  return (subtotal * discountPercentage) / 100;
};

/**
 * Calculate tax amount
 * @param {number} amount - Amount to calculate tax on
 * @param {number} taxPercentage - Tax percentage (defaults to config)
 * @returns {number} Tax amount
 */
export const calculateTax = (amount, taxPercentage = TAX_CONFIG.DEFAULT_TAX_RATE) => {
  return (amount * taxPercentage) / 100;
};

/**
 * Calculate total amount
 * @param {number} subtotal - Subtotal amount
 * @param {number} discount - Discount amount
 * @param {number} tax - Tax amount
 * @returns {number} Total amount
 */
export const calculateTotal = (subtotal, discount, tax) => {
  return subtotal - discount + tax;
};

/**
 * Calculate all amounts for a cart
 * @param {Array} items - Cart items
 * @param {number} discountPercentage - Discount percentage
 * @param {number} taxPercentage - Tax percentage
 * @returns {Object} Calculation results
 */
export const calculateCartTotals = (items, discountPercentage = 0, taxPercentage = TAX_CONFIG.DEFAULT_TAX_RATE) => {
  const subtotal = calculateSubtotal(items);
  const discount = calculateDiscount(subtotal, discountPercentage);
  const taxableAmount = subtotal - discount;
  const tax = calculateTax(taxableAmount, taxPercentage);
  const total = calculateTotal(subtotal, discount, tax);

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    tax: parseFloat(tax.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
};

/**
 * Format currency value
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = '₹') => {
  return `${currency}${amount.toFixed(2)}`;
};

/**
 * Calculate change to return
 * @param {number} total - Total amount
 * @param {number} paid - Amount paid
 * @returns {number} Change amount
 */
export const calculateChange = (total, paid) => {
  return Math.max(0, paid - total);
};

/**
 * Generate transaction number
 * @param {string} prefix - Prefix for transaction number
 * @returns {string} Transaction number
 */
export const generateTransactionNumber = (prefix = 'TXN') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Generate receipt number
 * @param {string} prefix - Prefix for receipt number
 * @returns {string} Receipt number
 */
export const generateReceiptNumber = (prefix = 'RCP') => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};
