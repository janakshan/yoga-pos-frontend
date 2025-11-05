/**
 * @typedef {Object} CartItem
 * @property {string} id - Unique cart item identifier
 * @property {string} productId - Product identifier
 * @property {string} name - Product name
 * @property {number} price - Product price
 * @property {number} quantity - Quantity in cart
 * @property {string} category - Product category
 * @property {number} stock - Available stock
 * @property {number} subtotal - Item subtotal (price * quantity)
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Transaction identifier
 * @property {string} transactionNumber - Human-readable transaction number
 * @property {CartItem[]} items - Items in the transaction
 * @property {number} subtotal - Subtotal before discount and tax
 * @property {number} discount - Discount amount
 * @property {number} discountPercentage - Discount percentage
 * @property {number} tax - Tax amount
 * @property {number} taxPercentage - Tax percentage
 * @property {number} total - Final total amount
 * @property {string} paymentMethod - Payment method used
 * @property {string} paymentStatus - Payment status
 * @property {string} customerName - Customer name (optional)
 * @property {string} customerEmail - Customer email (optional)
 * @property {string} customerPhone - Customer phone (optional)
 * @property {string} notes - Transaction notes
 * @property {string} createdAt - Transaction timestamp
 * @property {string} createdBy - User who created the transaction
 * @property {string} status - Transaction status
 */

/**
 * @typedef {Object} Receipt
 * @property {string} id - Receipt identifier
 * @property {string} transactionId - Associated transaction ID
 * @property {string} receiptNumber - Receipt number
 * @property {string} storeName - Store name
 * @property {string} storeAddress - Store address
 * @property {string} storePhone - Store phone
 * @property {Transaction} transaction - Transaction details
 * @property {string} generatedAt - Receipt generation timestamp
 */

/**
 * Payment method constants
 */
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  MOBILE: 'mobile',
  UPI: 'upi',
  BANK_TRANSFER: 'bank_transfer',
};

/**
 * Payment method display labels
 */
export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'Cash',
  [PAYMENT_METHODS.CARD]: 'Credit/Debit Card',
  [PAYMENT_METHODS.MOBILE]: 'Mobile Wallet',
  [PAYMENT_METHODS.UPI]: 'UPI',
  [PAYMENT_METHODS.BANK_TRANSFER]: 'Bank Transfer',
};

/**
 * Payment status constants
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

/**
 * Payment status display labels
 */
export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.PROCESSING]: 'Processing',
  [PAYMENT_STATUS.COMPLETED]: 'Completed',
  [PAYMENT_STATUS.FAILED]: 'Failed',
  [PAYMENT_STATUS.REFUNDED]: 'Refunded',
};

/**
 * Transaction status constants
 */
export const TRANSACTION_STATUS = {
  DRAFT: 'draft',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

/**
 * Transaction status display labels
 */
export const TRANSACTION_STATUS_LABELS = {
  [TRANSACTION_STATUS.DRAFT]: 'Draft',
  [TRANSACTION_STATUS.COMPLETED]: 'Completed',
  [TRANSACTION_STATUS.CANCELLED]: 'Cancelled',
  [TRANSACTION_STATUS.REFUNDED]: 'Refunded',
};

/**
 * Tax configuration
 */
export const TAX_CONFIG = {
  DEFAULT_TAX_RATE: 18, // 18% GST
  TAX_LABEL: 'GST',
};

/**
 * Discount types
 */
export const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
};
