/**
 * @typedef {Object} CashFlowEntry
 * @property {string} id - Unique identifier
 * @property {Date} date - Entry date
 * @property {'inflow'|'outflow'} type - Cash flow type
 * @property {string} category - Category
 * @property {string} description - Description
 * @property {number} amount - Amount
 * @property {number} balance - Running balance after this entry
 * @property {string} [referenceId] - Reference to related transaction
 * @property {string} [referenceType] - Type of reference
 * @property {string} accountId - Account ID
 * @property {string} accountName - Account name
 */

/**
 * @typedef {Object} CashFlowStatement
 * @property {Date} startDate - Statement start date
 * @property {Date} endDate - Statement end date
 * @property {number} openingBalance - Opening cash balance
 * @property {number} closingBalance - Closing cash balance
 * @property {number} totalInflows - Total cash inflows
 * @property {number} totalOutflows - Total cash outflows
 * @property {number} netCashFlow - Net cash flow
 * @property {Object} operatingActivities - Operating activities breakdown
 * @property {number} operatingActivities.receiptsFromCustomers - Customer receipts
 * @property {number} operatingActivities.paymentsToSuppliers - Supplier payments
 * @property {number} operatingActivities.employeeSalaries - Employee salaries
 * @property {number} operatingActivities.otherOperatingExpenses - Other operating expenses
 * @property {number} operatingActivities.netOperatingCash - Net operating cash flow
 * @property {Object} investingActivities - Investing activities breakdown
 * @property {number} investingActivities.equipmentPurchases - Equipment purchases
 * @property {number} investingActivities.assetSales - Asset sales
 * @property {number} investingActivities.netInvestingCash - Net investing cash flow
 * @property {Object} financingActivities - Financing activities breakdown
 * @property {number} financingActivities.loanProceeds - Loan proceeds
 * @property {number} financingActivities.loanRepayments - Loan repayments
 * @property {number} financingActivities.ownerWithdrawals - Owner withdrawals
 * @property {number} financingActivities.ownerContributions - Owner contributions
 * @property {number} financingActivities.netFinancingCash - Net financing cash flow
 * @property {CashFlowEntry[]} entries - Detailed entries
 */

/**
 * @typedef {Object} BankAccount
 * @property {string} id - Unique identifier
 * @property {string} accountName - Account name
 * @property {string} accountNumber - Account number (masked)
 * @property {string} bankName - Bank name
 * @property {string} accountType - Account type (checking, savings, etc.)
 * @property {string} currency - Currency code
 * @property {number} currentBalance - Current balance
 * @property {number} availableBalance - Available balance
 * @property {boolean} isActive - Whether account is active
 * @property {boolean} isPrimary - Whether this is the primary account
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {Date} [lastReconciledAt] - Last reconciliation timestamp
 * @property {number} [lastReconciledBalance] - Balance at last reconciliation
 */

/**
 * @typedef {Object} BankReconciliation
 * @property {string} id - Unique identifier
 * @property {string} accountId - Bank account ID
 * @property {string} accountName - Bank account name
 * @property {Date} reconciliationDate - Date of reconciliation
 * @property {Date} statementDate - Bank statement date
 * @property {number} statementBalance - Balance per bank statement
 * @property {number} bookBalance - Balance per books
 * @property {number} difference - Difference between statement and books
 * @property {'in_progress'|'completed'|'discrepancy'} status - Reconciliation status
 * @property {Array} unmatchedBankTransactions - Transactions in statement but not in books
 * @property {Array} unmatchedBookTransactions - Transactions in books but not in statement
 * @property {Array} matchedTransactions - Successfully matched transactions
 * @property {string} notes - Additional notes
 * @property {string} reconciledBy - User who performed reconciliation
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} CashFlowFilters
 * @property {string} [type] - Filter by type (inflow/outflow)
 * @property {string} [category] - Filter by category
 * @property {string} [accountId] - Filter by account
 * @property {Date} [startDate] - Filter by start date
 * @property {Date} [endDate] - Filter by end date
 * @property {string} [search] - Search term
 */

export {};
