import { delay } from '@/utils/delay.js';
import { transactionService } from './transactionService.js';

/**
 * Mock bank accounts
 * @type {import('../types/cashflow.types.js').BankAccount[]}
 */
const MOCK_BANK_ACCOUNTS = [
  {
    id: 'ACC001',
    accountName: 'Main Operating Account',
    accountNumber: '****1234',
    bankName: 'First National Bank',
    accountType: 'checking',
    currency: 'USD',
    currentBalance: 15750.00,
    availableBalance: 15750.00,
    isActive: true,
    isPrimary: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-10-26'),
    lastReconciledAt: new Date('2024-10-03'),
    lastReconciledBalance: 14850.00
  },
  {
    id: 'ACC002',
    accountName: 'Savings Account',
    accountNumber: '****5678',
    bankName: 'First National Bank',
    accountType: 'savings',
    currency: 'USD',
    currentBalance: 25000.00,
    availableBalance: 25000.00,
    isActive: true,
    isPrimary: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-10-20'),
    lastReconciledAt: new Date('2024-10-01'),
    lastReconciledBalance: 25000.00
  },
  {
    id: 'ACC003',
    accountName: 'Petty Cash',
    accountNumber: 'N/A',
    bankName: 'On-site Cash',
    accountType: 'cash',
    currency: 'USD',
    currentBalance: 500.00,
    availableBalance: 500.00,
    isActive: true,
    isPrimary: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-10-25')
  }
];

let bankAccounts = [...MOCK_BANK_ACCOUNTS];
let reconciliations = [];
let reconciliationCounter = 1;

/**
 * Cash Flow Service
 * Provides operations for cash flow monitoring and bank reconciliation
 */
export const cashflowService = {
  /**
   * Get bank accounts
   * @returns {Promise<import('../types/cashflow.types.js').BankAccount[]>}
   */
  async getBankAccounts() {
    await delay(300);
    return bankAccounts.filter(acc => acc.isActive);
  },

  /**
   * Get bank account by ID
   * @param {string} id - Account ID
   * @returns {Promise<import('../types/cashflow.types.js').BankAccount>}
   */
  async getBankAccountById(id) {
    await delay(200);

    const account = bankAccounts.find(acc => acc.id === id);
    if (!account) {
      throw new Error('Bank account not found');
    }

    return { ...account };
  },

  /**
   * Update bank account balance
   * @param {string} id - Account ID
   * @param {number} newBalance - New balance
   * @returns {Promise<import('../types/cashflow.types.js').BankAccount>}
   */
  async updateBankAccountBalance(id, newBalance) {
    await delay(300);

    const index = bankAccounts.findIndex(acc => acc.id === id);
    if (index === -1) {
      throw new Error('Bank account not found');
    }

    bankAccounts[index] = {
      ...bankAccounts[index],
      currentBalance: newBalance,
      availableBalance: newBalance,
      updatedAt: new Date()
    };

    return { ...bankAccounts[index] };
  },

  /**
   * Get cash flow statement
   * @param {import('../types/cashflow.types.js').CashFlowFilters} filters - Filter criteria
   * @returns {Promise<import('../types/cashflow.types.js').CashFlowStatement>}
   */
  async getCashFlowStatement(filters = {}) {
    await delay(800);

    const startDate = filters.startDate || new Date(new Date().setDate(1)); // First day of current month
    const endDate = filters.endDate || new Date();
    const accountId = filters.accountId || 'ACC001';

    // Get transactions for the period
    const transactions = await transactionService.getList({
      startDate,
      endDate,
      accountId
    });

    // Calculate opening balance (simplified - would be from previous period close)
    const openingBalance = 10000.00;

    // Group transactions
    const receiptsFromCustomers = transactions
      .filter(t => t.type === 'income' && t.customerId)
      .reduce((sum, t) => sum + t.amount, 0);

    const paymentsToSuppliers = transactions
      .filter(t => t.type === 'expense' && t.vendorId)
      .reduce((sum, t) => sum + t.amount, 0);

    const employeeSalaries = transactions
      .filter(t => t.type === 'expense' && t.description.toLowerCase().includes('salary'))
      .reduce((sum, t) => sum + t.amount, 0);

    const otherOperatingExpenses = transactions
      .filter(t =>
        t.type === 'expense' &&
        !t.vendorId &&
        !t.description.toLowerCase().includes('salary') &&
        !t.description.toLowerCase().includes('equipment')
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const netOperatingCash =
      receiptsFromCustomers - paymentsToSuppliers - employeeSalaries - otherOperatingExpenses;

    const equipmentPurchases = transactions
      .filter(t => t.type === 'expense' && t.description.toLowerCase().includes('equipment'))
      .reduce((sum, t) => sum + t.amount, 0);

    const netInvestingCash = -equipmentPurchases;

    // Financing activities (simplified - would include loans, owner contributions, etc.)
    const netFinancingCash = 0;

    const totalInflows = receiptsFromCustomers;
    const totalOutflows =
      paymentsToSuppliers + employeeSalaries + otherOperatingExpenses + equipmentPurchases;
    const netCashFlow = totalInflows - totalOutflows;
    const closingBalance = openingBalance + netCashFlow;

    // Create cash flow entries
    const entries = transactions.map(t => ({
      id: t.id,
      date: t.transactionDate,
      type: t.type === 'income' ? 'inflow' : 'outflow',
      category: t.category,
      description: t.description,
      amount: t.amount,
      balance: 0, // Would be calculated cumulatively
      referenceId: t.referenceId,
      referenceType: t.referenceType,
      accountId: t.accountId,
      accountName: t.accountName
    }));

    // Calculate running balances
    let runningBalance = openingBalance;
    entries.forEach(entry => {
      runningBalance += entry.type === 'inflow' ? entry.amount : -entry.amount;
      entry.balance = runningBalance;
    });

    const statement = {
      startDate,
      endDate,
      openingBalance,
      closingBalance,
      totalInflows,
      totalOutflows,
      netCashFlow,
      operatingActivities: {
        receiptsFromCustomers,
        paymentsToSuppliers,
        employeeSalaries,
        otherOperatingExpenses,
        netOperatingCash
      },
      investingActivities: {
        equipmentPurchases,
        assetSales: 0,
        netInvestingCash
      },
      financingActivities: {
        loanProceeds: 0,
        loanRepayments: 0,
        ownerWithdrawals: 0,
        ownerContributions: 0,
        netFinancingCash
      },
      entries
    };

    return statement;
  },

  /**
   * Create bank reconciliation
   * @param {Object} data - Reconciliation data
   * @returns {Promise<import('../types/cashflow.types.js').BankReconciliation>}
   */
  async createBankReconciliation(data) {
    await delay(800);

    const account = await this.getBankAccountById(data.accountId);

    // Get unreconciled transactions for the account
    const transactions = await transactionService.getList({
      accountId: data.accountId,
      isReconciled: false,
      endDate: data.statementDate
    });

    const bookBalance = transactions.reduce((sum, t) => {
      return sum + (t.type === 'income' ? t.amount : -t.amount);
    }, account.lastReconciledBalance || 0);

    const statementBalance = data.statementBalance || 0;
    const difference = Math.abs(statementBalance - bookBalance);

    const reconciliation = {
      id: `RECON${String(reconciliationCounter).padStart(3, '0')}`,
      accountId: data.accountId,
      accountName: account.accountName,
      reconciliationDate: new Date(),
      statementDate: data.statementDate || new Date(),
      statementBalance,
      bookBalance,
      difference,
      status: difference < 0.01 ? 'completed' : 'discrepancy',
      unmatchedBankTransactions: data.unmatchedBankTransactions || [],
      unmatchedBookTransactions: transactions.slice(0, 3), // Simplified
      matchedTransactions: transactions.slice(3), // Simplified
      notes: data.notes || '',
      reconciledBy: data.reconciledBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    reconciliationCounter++;
    reconciliations.push(reconciliation);

    // Update account reconciliation info
    if (reconciliation.status === 'completed') {
      await this.updateBankAccountBalance(data.accountId, statementBalance);

      const index = bankAccounts.findIndex(acc => acc.id === data.accountId);
      bankAccounts[index].lastReconciledAt = new Date();
      bankAccounts[index].lastReconciledBalance = statementBalance;

      // Mark transactions as reconciled
      await transactionService.bulkReconcile(
        transactions.map(t => t.id),
        data.reconciledBy || 'admin'
      );
    }

    return reconciliation;
  },

  /**
   * Get bank reconciliation by ID
   * @param {string} id - Reconciliation ID
   * @returns {Promise<import('../types/cashflow.types.js').BankReconciliation>}
   */
  async getBankReconciliationById(id) {
    await delay(300);

    const reconciliation = reconciliations.find(r => r.id === id);
    if (!reconciliation) {
      throw new Error('Bank reconciliation not found');
    }

    return { ...reconciliation };
  },

  /**
   * Get bank reconciliations
   * @param {Object} filters - Filter criteria
   * @returns {Promise<import('../types/cashflow.types.js').BankReconciliation[]>}
   */
  async getBankReconciliations(filters = {}) {
    await delay(500);

    let filtered = [...reconciliations];

    if (filters.accountId) {
      filtered = filtered.filter(r => r.accountId === filters.accountId);
    }

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    if (filters.startDate) {
      filtered = filtered.filter(r => r.reconciliationDate >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(r => r.reconciliationDate <= new Date(filters.endDate));
    }

    // Sort by date descending
    filtered.sort((a, b) => b.reconciliationDate - a.reconciliationDate);

    return filtered;
  },

  /**
   * Get cash flow summary
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>} Cash flow summary
   */
  async getCashFlowSummary(filters = {}) {
    await delay(500);

    const statement = await this.getCashFlowStatement(filters);
    const accounts = await this.getBankAccounts();

    const totalCash = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

    return {
      totalCash,
      openingBalance: statement.openingBalance,
      closingBalance: statement.closingBalance,
      netCashFlow: statement.netCashFlow,
      operatingCashFlow: statement.operatingActivities.netOperatingCash,
      investingCashFlow: statement.investingActivities.netInvestingCash,
      financingCashFlow: statement.financingActivities.netFinancingCash,
      accounts: accounts.map(acc => ({
        id: acc.id,
        name: acc.accountName,
        balance: acc.currentBalance,
        type: acc.accountType
      }))
    };
  },

  /**
   * Get cash position forecast (simplified)
   * @param {number} days - Number of days to forecast
   * @returns {Promise<Array>} Daily cash position forecast
   */
  async getCashPositionForecast(days = 30) {
    await delay(600);

    const currentBalance = bankAccounts
      .filter(acc => acc.isPrimary)
      .reduce((sum, acc) => sum + acc.currentBalance, 0);

    // Simplified forecast - in real app would use historical data and trends
    const forecast = [];
    let balance = currentBalance;

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      // Simulate daily cash flow (simplified)
      const dailyInflow = 200 + Math.random() * 300;
      const dailyOutflow = 150 + Math.random() * 200;
      balance += dailyInflow - dailyOutflow;

      forecast.push({
        date,
        projectedBalance: balance,
        projectedInflow: dailyInflow,
        projectedOutflow: dailyOutflow
      });
    }

    return forecast;
  }
};
