/**
 * @typedef {Object} Payment
 * @property {string} id - Unique identifier
 * @property {string} paymentNumber - Human-readable payment number (e.g., PAY-2024-001)
 * @property {string} [invoiceId] - Reference to invoice (if applicable)
 * @property {string} [invoiceNumber] - Invoice number
 * @property {string} customerId - Reference to customer
 * @property {string} customerName - Customer name
 * @property {number} amount - Payment amount
 * @property {'cash'|'card'|'bank_transfer'|'check'|'mobile_payment'|'store_credit'|'other'} paymentMethod - Payment method
 * @property {Date} paymentDate - Date of payment
 * @property {'completed'|'pending'|'failed'|'refunded'|'cancelled'} status - Payment status
 * @property {string} [transactionId] - External transaction reference
 * @property {string} [referenceNumber] - Payment reference number
 * @property {string} notes - Additional notes
 * @property {string} [receiptUrl] - URL to receipt/proof
 * @property {string} currency - Currency code
 * @property {string} receivedBy - User who received the payment
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {string} [bankName] - Bank name (for bank transfers)
 * @property {string} [checkNumber] - Check number (for check payments)
 * @property {string} [cardLastFour] - Last 4 digits of card (for card payments)
 */

/**
 * @typedef {Object} PaymentFilters
 * @property {string} [status] - Filter by status
 * @property {string} [paymentMethod] - Filter by payment method
 * @property {string} [customerId] - Filter by customer
 * @property {Date} [startDate] - Filter by start date
 * @property {Date} [endDate] - Filter by end date
 * @property {string} [search] - Search term
 * @property {number} [minAmount] - Minimum amount
 * @property {number} [maxAmount] - Maximum amount
 */

/**
 * @typedef {Object} PaymentStats
 * @property {number} totalPayments - Total number of payments
 * @property {number} totalAmount - Total payment amount
 * @property {number} cashAmount - Total cash payments
 * @property {number} cardAmount - Total card payments
 * @property {number} bankTransferAmount - Total bank transfer payments
 * @property {number} completedCount - Number of completed payments
 * @property {number} pendingCount - Number of pending payments
 * @property {number} failedCount - Number of failed payments
 * @property {number} refundedCount - Number of refunded payments
 * @property {Object.<string, number>} byPaymentMethod - Breakdown by payment method
 * @property {number} averagePaymentValue - Average payment value
 */

export {};
