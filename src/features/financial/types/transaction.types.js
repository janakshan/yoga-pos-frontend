/**
 * @typedef {Object} Transaction
 * @property {string} id - Unique identifier
 * @property {string} transactionNumber - Human-readable transaction number
 * @property {'income'|'expense'|'transfer'} type - Transaction type
 * @property {'invoice'|'payment'|'expense'|'refund'|'adjustment'|'transfer'|'other'} category - Transaction category
 * @property {number} amount - Transaction amount
 * @property {Date} transactionDate - Date of transaction
 * @property {string} description - Transaction description
 * @property {string} [referenceId] - Reference to related entity (invoice, payment, etc.)
 * @property {string} [referenceType] - Type of reference (invoice, payment, expense)
 * @property {string} [referenceNumber] - Reference number
 * @property {string} [accountId] - Reference to account
 * @property {string} [accountName] - Account name
 * @property {string} [customerId] - Reference to customer (for income)
 * @property {string} [vendorId] - Reference to vendor (for expenses)
 * @property {'cash'|'card'|'bank_transfer'|'check'|'mobile_payment'|'other'} paymentMethod - Payment method
 * @property {'completed'|'pending'|'failed'|'cancelled'} status - Transaction status
 * @property {string} notes - Additional notes
 * @property {string} createdBy - User who created the transaction
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {string} currency - Currency code
 * @property {number} [exchangeRate] - Exchange rate (if multi-currency)
 * @property {boolean} isReconciled - Whether transaction has been reconciled
 * @property {Date} [reconciledAt] - Reconciliation timestamp
 * @property {string} [reconciledBy] - User who reconciled
 */

/**
 * @typedef {Object} TransactionFilters
 * @property {string} [type] - Filter by type
 * @property {string} [category] - Filter by category
 * @property {string} [status] - Filter by status
 * @property {string} [paymentMethod] - Filter by payment method
 * @property {string} [accountId] - Filter by account
 * @property {Date} [startDate] - Filter by start date
 * @property {Date} [endDate] - Filter by end date
 * @property {string} [search] - Search term
 * @property {number} [minAmount] - Minimum amount
 * @property {number} [maxAmount] - Maximum amount
 * @property {boolean} [isReconciled] - Filter by reconciliation status
 */

/**
 * @typedef {Object} TransactionStats
 * @property {number} totalTransactions - Total number of transactions
 * @property {number} totalIncome - Total income
 * @property {number} totalExpenses - Total expenses
 * @property {number} netIncome - Net income (income - expenses)
 * @property {number} pendingCount - Number of pending transactions
 * @property {number} completedCount - Number of completed transactions
 * @property {Object.<string, number>} byType - Breakdown by type
 * @property {Object.<string, number>} byCategory - Breakdown by category
 * @property {Object.<string, number>} byPaymentMethod - Breakdown by payment method
 * @property {number} reconciledCount - Number of reconciled transactions
 * @property {number} unreconciledCount - Number of unreconciled transactions
 */

export {};
