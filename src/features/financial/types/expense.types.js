/**
 * @typedef {Object} Expense
 * @property {string} id - Unique identifier
 * @property {string} expenseNumber - Human-readable expense number (e.g., EXP-2024-001)
 * @property {string} category - Expense category
 * @property {string} subcategory - Expense subcategory
 * @property {string} description - Expense description
 * @property {number} amount - Expense amount
 * @property {Date} expenseDate - Date of expense
 * @property {'cash'|'card'|'bank_transfer'|'check'|'other'} paymentMethod - Payment method
 * @property {'pending'|'approved'|'paid'|'rejected'|'cancelled'} status - Expense status
 * @property {string} [vendorId] - Reference to vendor/supplier
 * @property {string} [vendorName] - Vendor name
 * @property {string} [invoiceNumber] - Vendor invoice number
 * @property {string} [receiptUrl] - URL to receipt/proof
 * @property {boolean} isRecurring - Whether this is a recurring expense
 * @property {string} [recurringFrequency] - Frequency (monthly, quarterly, yearly)
 * @property {string} notes - Additional notes
 * @property {string} submittedBy - User who submitted the expense
 * @property {string} [approvedBy] - User who approved the expense
 * @property {Date} [approvedAt] - Approval timestamp
 * @property {string} currency - Currency code
 * @property {boolean} isTaxDeductible - Whether expense is tax deductible
 * @property {string} [projectId] - Reference to project (if applicable)
 * @property {string} [departmentId] - Reference to department
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} ExpenseCategory
 * @property {string} id - Unique identifier
 * @property {string} name - Category name
 * @property {string} description - Category description
 * @property {string} [parentId] - Parent category ID (for subcategories)
 * @property {boolean} isActive - Whether category is active
 * @property {string} icon - Icon name
 * @property {string} color - Color code
 */

/**
 * @typedef {Object} ExpenseFilters
 * @property {string} [status] - Filter by status
 * @property {string} [category] - Filter by category
 * @property {string} [paymentMethod] - Filter by payment method
 * @property {string} [vendorId] - Filter by vendor
 * @property {Date} [startDate] - Filter by start date
 * @property {Date} [endDate] - Filter by end date
 * @property {string} [search] - Search term
 * @property {number} [minAmount] - Minimum amount
 * @property {number} [maxAmount] - Maximum amount
 * @property {boolean} [isRecurring] - Filter by recurring status
 */

/**
 * @typedef {Object} ExpenseStats
 * @property {number} totalExpenses - Total number of expenses
 * @property {number} totalAmount - Total expense amount
 * @property {number} pendingAmount - Total pending expenses
 * @property {number} approvedAmount - Total approved expenses
 * @property {number} paidAmount - Total paid expenses
 * @property {number} pendingCount - Number of pending expenses
 * @property {number} approvedCount - Number of approved expenses
 * @property {number} paidCount - Number of paid expenses
 * @property {Object.<string, number>} byCategory - Breakdown by category
 * @property {Object.<string, number>} byPaymentMethod - Breakdown by payment method
 * @property {number} averageExpenseValue - Average expense value
 * @property {number} recurringExpensesTotal - Total recurring expenses
 */

export {};
