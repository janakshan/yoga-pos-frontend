/**
 * @typedef {Object} InvoiceItem
 * @property {string} id - Unique identifier for the item
 * @property {string} productId - Reference to the product
 * @property {string} productName - Name of the product/service
 * @property {string} description - Item description
 * @property {number} quantity - Quantity
 * @property {number} unitPrice - Price per unit
 * @property {number} discount - Discount amount
 * @property {number} tax - Tax amount
 * @property {number} total - Total amount for this item
 */

/**
 * @typedef {Object} Invoice
 * @property {string} id - Unique identifier
 * @property {string} invoiceNumber - Human-readable invoice number (e.g., INV-2024-001)
 * @property {string} customerId - Reference to customer
 * @property {string} customerName - Customer name
 * @property {string} customerEmail - Customer email
 * @property {string} customerPhone - Customer phone
 * @property {Date} invoiceDate - Date the invoice was created
 * @property {Date} dueDate - Payment due date
 * @property {'draft'|'sent'|'viewed'|'paid'|'partial'|'overdue'|'cancelled'|'refunded'} status - Invoice status
 * @property {InvoiceItem[]} items - Invoice line items
 * @property {number} subtotal - Subtotal before tax and discounts
 * @property {number} discountAmount - Total discount amount
 * @property {number} taxAmount - Total tax amount
 * @property {number} total - Total invoice amount
 * @property {number} amountPaid - Amount already paid
 * @property {number} amountDue - Remaining amount due
 * @property {string} currency - Currency code (e.g., 'USD', 'LKR')
 * @property {string} notes - Additional notes
 * @property {string} terms - Payment terms
 * @property {string} createdBy - User who created the invoice
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Date} [paidAt] - Payment completion timestamp
 * @property {string} [paymentMethod] - Method of payment
 * @property {string} [transactionId] - Payment transaction reference
 */

/**
 * @typedef {Object} InvoiceFilters
 * @property {string} [status] - Filter by status
 * @property {string} [customerId] - Filter by customer
 * @property {Date} [startDate] - Filter by start date
 * @property {Date} [endDate] - Filter by end date
 * @property {string} [search] - Search term
 * @property {number} [minAmount] - Minimum amount
 * @property {number} [maxAmount] - Maximum amount
 */

/**
 * @typedef {Object} InvoiceStats
 * @property {number} totalInvoices - Total number of invoices
 * @property {number} totalAmount - Total invoice amount
 * @property {number} totalPaid - Total amount paid
 * @property {number} totalDue - Total amount due
 * @property {number} overdueAmount - Total overdue amount
 * @property {number} overdueCount - Number of overdue invoices
 * @property {number} draftCount - Number of draft invoices
 * @property {number} paidCount - Number of paid invoices
 * @property {number} partialCount - Number of partially paid invoices
 * @property {number} averageInvoiceValue - Average invoice value
 * @property {number} collectionRate - Percentage of invoices collected
 */

export {};
