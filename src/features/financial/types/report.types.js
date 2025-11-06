/**
 * @typedef {Object} ProfitLossStatement
 * @property {Date} startDate - Statement start date
 * @property {Date} endDate - Statement end date
 * @property {number} totalRevenue - Total revenue
 * @property {Object} revenue - Revenue breakdown
 * @property {number} revenue.classRevenue - Revenue from classes
 * @property {number} revenue.membershipRevenue - Revenue from memberships
 * @property {number} revenue.productSales - Revenue from product sales
 * @property {number} revenue.otherRevenue - Other revenue
 * @property {number} costOfGoodsSold - Total COGS
 * @property {Object} cogs - COGS breakdown
 * @property {number} cogs.productCosts - Product costs
 * @property {number} cogs.instructorFees - Instructor fees
 * @property {number} cogs.otherDirectCosts - Other direct costs
 * @property {number} grossProfit - Gross profit (revenue - COGS)
 * @property {number} grossProfitMargin - Gross profit margin percentage
 * @property {number} totalOperatingExpenses - Total operating expenses
 * @property {Object} operatingExpenses - Operating expenses breakdown
 * @property {number} operatingExpenses.salaries - Employee salaries
 * @property {number} operatingExpenses.rent - Rent
 * @property {number} operatingExpenses.utilities - Utilities
 * @property {number} operatingExpenses.marketing - Marketing
 * @property {number} operatingExpenses.insurance - Insurance
 * @property {number} operatingExpenses.maintenance - Maintenance
 * @property {number} operatingExpenses.supplies - Supplies
 * @property {number} operatingExpenses.depreciation - Depreciation
 * @property {number} operatingExpenses.other - Other expenses
 * @property {number} operatingIncome - Operating income (gross profit - operating expenses)
 * @property {number} operatingMargin - Operating margin percentage
 * @property {number} otherIncome - Other income
 * @property {number} otherExpenses - Other expenses
 * @property {number} netIncome - Net income
 * @property {number} netProfitMargin - Net profit margin percentage
 */

/**
 * @typedef {Object} EndOfDayReport
 * @property {string} id - Unique identifier
 * @property {Date} reportDate - Date of the report
 * @property {string} [shiftId] - Shift identifier
 * @property {string} cashierId - Cashier/user ID
 * @property {string} cashierName - Cashier/user name
 * @property {number} openingBalance - Opening cash balance
 * @property {number} expectedClosingBalance - Expected closing balance
 * @property {number} actualClosingBalance - Actual closing balance
 * @property {number} difference - Difference (overage/shortage)
 * @property {Object} sales - Sales summary
 * @property {number} sales.totalTransactions - Total number of transactions
 * @property {number} sales.totalRevenue - Total revenue
 * @property {number} sales.totalDiscount - Total discounts given
 * @property {number} sales.totalTax - Total tax collected
 * @property {number} sales.netRevenue - Net revenue
 * @property {Object} paymentBreakdown - Payment method breakdown
 * @property {number} paymentBreakdown.cash - Cash payments
 * @property {number} paymentBreakdown.card - Card payments
 * @property {number} paymentBreakdown.bankTransfer - Bank transfers
 * @property {number} paymentBreakdown.mobilePayment - Mobile payments
 * @property {number} paymentBreakdown.storeCredit - Store credit used
 * @property {number} paymentBreakdown.other - Other payment methods
 * @property {Object} cashMovements - Cash movements
 * @property {number} cashMovements.cashSales - Cash from sales
 * @property {number} cashMovements.cashPayments - Cash payments received
 * @property {number} cashMovements.cashExpenses - Cash expenses paid
 * @property {number} cashMovements.cashDeposits - Cash deposits made
 * @property {number} cashMovements.cashWithdrawals - Cash withdrawals
 * @property {number} cashMovements.pettyCash - Petty cash adjustments
 * @property {Object} reconciliation - Reconciliation details
 * @property {boolean} reconciliation.isReconciled - Whether reconciled
 * @property {string} reconciliation.notes - Reconciliation notes
 * @property {Date} reconciliation.reconciledAt - Reconciliation timestamp
 * @property {string} reconciliation.reconciledBy - User who reconciled
 * @property {Array} topProducts - Top selling products
 * @property {Array} transactions - List of transactions
 * @property {string} notes - Additional notes
 * @property {'open'|'closed'|'reconciled'} status - Report status
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} TaxReport
 * @property {Date} startDate - Report start date
 * @property {Date} endDate - Report end date
 * @property {number} totalSales - Total sales
 * @property {number} taxableSales - Taxable sales
 * @property {number} nonTaxableSales - Non-taxable sales
 * @property {number} totalTaxCollected - Total tax collected
 * @property {Object.<string, number>} taxByRate - Tax breakdown by rate
 * @property {number} taxPayable - Tax payable to authorities
 * @property {number} taxCredits - Tax credits available
 * @property {number} netTaxDue - Net tax due
 */

/**
 * @typedef {Object} ProfitMarginAnalysis
 * @property {Date} period - Analysis period
 * @property {number} overallMargin - Overall profit margin percentage
 * @property {Object.<string, Object>} byProduct - Margin by product
 * @property {Object.<string, Object>} byCategory - Margin by category
 * @property {Object.<string, Object>} byCustomer - Margin by customer segment
 * @property {Array} topMarginProducts - Products with highest margins
 * @property {Array} lowMarginProducts - Products with lowest margins
 * @property {Object} trends - Margin trends over time
 */

/**
 * @typedef {Object} FinancialSummary
 * @property {Date} period - Summary period
 * @property {number} totalRevenue - Total revenue
 * @property {number} totalExpenses - Total expenses
 * @property {number} netIncome - Net income
 * @property {number} cashBalance - Current cash balance
 * @property {number} accountsReceivable - Total accounts receivable
 * @property {number} accountsPayable - Total accounts payable
 * @property {number} profitMargin - Profit margin percentage
 * @property {Object} trends - Trend indicators
 * @property {string} trends.revenueGrowth - Revenue growth percentage
 * @property {string} trends.expenseGrowth - Expense growth percentage
 * @property {string} trends.profitGrowth - Profit growth percentage
 */

/**
 * @typedef {Object} ReportFilters
 * @property {Date} startDate - Start date
 * @property {Date} endDate - End date
 * @property {string} [branchId] - Filter by branch
 * @property {string} [categoryId] - Filter by category
 * @property {string} [customerId] - Filter by customer
 * @property {string} [groupBy] - Group by (day, week, month, year)
 */

export {};
