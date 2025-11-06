import { delay } from '@/utils/delay.js';
import { transactionService } from './transactionService.js';
import { invoiceService } from './invoiceService.js';
import { expenseService } from './expenseService.js';
import { paymentService } from './paymentService.js';

/**
 * Mock end-of-day reports
 * @type {import('../types/report.types.js').EndOfDayReport[]}
 */
const MOCK_EOD_REPORTS = [
  {
    id: 'EOD001',
    reportDate: new Date('2024-10-25'),
    cashierId: 'admin',
    cashierName: 'Admin User',
    openingBalance: 500.00,
    expectedClosingBalance: 1250.00,
    actualClosingBalance: 1248.50,
    difference: -1.50,
    sales: {
      totalTransactions: 12,
      totalRevenue: 1850.00,
      totalDiscount: 100.00,
      totalTax: 185.00,
      netRevenue: 1935.00
    },
    paymentBreakdown: {
      cash: 450.00,
      card: 850.00,
      bankTransfer: 200.00,
      mobilePayment: 250.00,
      storeCredit: 100.00,
      other: 0
    },
    cashMovements: {
      cashSales: 450.00,
      cashPayments: 300.00,
      cashExpenses: 0,
      cashDeposits: 0,
      cashWithdrawals: 0,
      pettyCash: 0
    },
    reconciliation: {
      isReconciled: true,
      notes: 'Minor shortage of $1.50 - documented',
      reconciledAt: new Date('2024-10-25T22:00:00'),
      reconciledBy: 'admin'
    },
    topProducts: [
      { productName: 'Premium Membership', quantity: 5, revenue: 495.00 },
      { productName: 'Morning Yoga Class', quantity: 8, revenue: 320.00 },
      { productName: 'Yoga Mat Premium', quantity: 6, revenue: 270.00 }
    ],
    transactions: ['TXN001', 'TXN002', 'TXN003'],
    notes: 'Busy day with high membership sales',
    status: 'reconciled',
    createdAt: new Date('2024-10-25T21:30:00'),
    updatedAt: new Date('2024-10-25T22:00:00')
  }
];

let eodReports = [...MOCK_EOD_REPORTS];
let eodCounter = 2;

/**
 * Report Service
 * Provides operations for generating financial reports
 */
export const reportService = {
  /**
   * Generate profit & loss statement
   * @param {import('../types/report.types.js').ReportFilters} filters - Filter criteria
   * @returns {Promise<import('../types/report.types.js').ProfitLossStatement>}
   */
  async generateProfitLoss(filters = {}) {
    await delay(1000);

    const startDate = filters.startDate || new Date(new Date().getFullYear(), 0, 1); // Year start
    const endDate = filters.endDate || new Date();

    // Get all transactions for the period
    const transactions = await transactionService.getList({ startDate, endDate });
    const expenses = await expenseService.getList({ startDate, endDate });

    // Calculate revenue
    const incomeTransactions = transactions.filter(t => t.type === 'income');
    const totalRevenue = incomeTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Revenue breakdown (simplified)
    const classRevenue = totalRevenue * 0.45; // 45% from classes
    const membershipRevenue = totalRevenue * 0.35; // 35% from memberships
    const productSales = totalRevenue * 0.15; // 15% from products
    const otherRevenue = totalRevenue * 0.05; // 5% other

    // Calculate COGS (simplified)
    const productCosts = productSales * 0.4; // 40% product cost
    const instructorFees = classRevenue * 0.35; // 35% instructor fees
    const otherDirectCosts = totalRevenue * 0.05; // 5% other direct costs
    const costOfGoodsSold = productCosts + instructorFees + otherDirectCosts;

    const grossProfit = totalRevenue - costOfGoodsSold;
    const grossProfitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    // Calculate operating expenses
    const expensesByCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    const salaries = expensesByCategory['Salaries & Wages'] || 0;
    const rent = expensesByCategory['Rent & Utilities'] || 0;
    const utilities = rent * 0.15; // Approximate utilities as 15% of rent
    const rentOnly = rent * 0.85;
    const marketing = expensesByCategory['Marketing & Advertising'] || 0;
    const insurance = expensesByCategory['Insurance'] || 0;
    const maintenance = expensesByCategory['Maintenance & Repairs'] || 0;
    const supplies = expensesByCategory['Equipment & Supplies'] || 0;
    const depreciation = totalRevenue * 0.03; // Simplified depreciation
    const other = expensesByCategory['Other'] || 0;

    const totalOperatingExpenses =
      salaries + rentOnly + utilities + marketing + insurance + maintenance + supplies + depreciation + other;

    const operatingIncome = grossProfit - totalOperatingExpenses;
    const operatingMargin = totalRevenue > 0 ? (operatingIncome / totalRevenue) * 100 : 0;

    // Other income/expenses
    const otherIncome = 0;
    const otherExpenses = 0;

    const netIncome = operatingIncome + otherIncome - otherExpenses;
    const netProfitMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

    return {
      startDate,
      endDate,
      totalRevenue,
      revenue: {
        classRevenue,
        membershipRevenue,
        productSales,
        otherRevenue
      },
      costOfGoodsSold,
      cogs: {
        productCosts,
        instructorFees,
        otherDirectCosts
      },
      grossProfit,
      grossProfitMargin,
      totalOperatingExpenses,
      operatingExpenses: {
        salaries,
        rent: rentOnly,
        utilities,
        marketing,
        insurance,
        maintenance,
        supplies,
        depreciation,
        other
      },
      operatingIncome,
      operatingMargin,
      otherIncome,
      otherExpenses,
      netIncome,
      netProfitMargin
    };
  },

  /**
   * Generate end-of-day report
   * @param {Object} data - Report data
   * @returns {Promise<import('../types/report.types.js').EndOfDayReport>}
   */
  async generateEndOfDayReport(data) {
    await delay(800);

    const reportDate = data.reportDate || new Date();

    // Get transactions for the day
    const dayStart = new Date(reportDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(reportDate);
    dayEnd.setHours(23, 59, 59, 999);

    const transactions = await transactionService.getList({
      startDate: dayStart,
      endDate: dayEnd
    });

    const payments = await paymentService.getList({
      startDate: dayStart,
      endDate: dayEnd
    });

    // Calculate sales summary
    const totalTransactions = transactions.filter(t => t.type === 'income').length;
    const totalRevenue = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDiscount = 0; // Would come from sales data
    const totalTax = totalRevenue * 0.1; // Simplified
    const netRevenue = totalRevenue + totalTax;

    // Payment breakdown
    const paymentBreakdown = payments.reduce(
      (acc, p) => {
        if (p.status === 'completed') {
          acc[p.paymentMethod] = (acc[p.paymentMethod] || 0) + p.amount;
        }
        return acc;
      },
      {
        cash: 0,
        card: 0,
        bankTransfer: 0,
        mobilePayment: 0,
        storeCredit: 0,
        other: 0
      }
    );

    // Cash movements
    const cashMovements = {
      cashSales: paymentBreakdown.cash,
      cashPayments: paymentBreakdown.cash,
      cashExpenses: transactions
        .filter(t => t.type === 'expense' && t.paymentMethod === 'cash')
        .reduce((sum, t) => sum + t.amount, 0),
      cashDeposits: 0,
      cashWithdrawals: 0,
      pettyCash: 0
    };

    const openingBalance = data.openingBalance || 500.00;
    const expectedClosingBalance =
      openingBalance +
      cashMovements.cashSales -
      cashMovements.cashExpenses +
      cashMovements.cashDeposits -
      cashMovements.cashWithdrawals;

    const actualClosingBalance = data.actualClosingBalance || expectedClosingBalance;
    const difference = actualClosingBalance - expectedClosingBalance;

    const report = {
      id: `EOD${String(eodCounter).padStart(3, '0')}`,
      reportDate,
      shiftId: data.shiftId,
      cashierId: data.cashierId || 'admin',
      cashierName: data.cashierName || 'Admin User',
      openingBalance,
      expectedClosingBalance,
      actualClosingBalance,
      difference,
      sales: {
        totalTransactions,
        totalRevenue,
        totalDiscount,
        totalTax,
        netRevenue
      },
      paymentBreakdown,
      cashMovements,
      reconciliation: {
        isReconciled: data.isReconciled || false,
        notes: data.reconciliationNotes || '',
        reconciledAt: data.isReconciled ? new Date() : null,
        reconciledBy: data.isReconciled ? data.cashierId : null
      },
      topProducts: data.topProducts || [],
      transactions: transactions.map(t => t.id),
      notes: data.notes || '',
      status: data.isReconciled ? 'reconciled' : 'open',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    eodCounter++;
    eodReports.push(report);

    return report;
  },

  /**
   * Get end-of-day report by ID
   * @param {string} id - Report ID
   * @returns {Promise<import('../types/report.types.js').EndOfDayReport>}
   */
  async getEndOfDayReport(id) {
    await delay(300);

    const report = eodReports.find(r => r.id === id);
    if (!report) {
      throw new Error('End-of-day report not found');
    }

    return { ...report };
  },

  /**
   * Get list of end-of-day reports
   * @param {Object} filters - Filter criteria
   * @returns {Promise<import('../types/report.types.js').EndOfDayReport[]>}
   */
  async getEndOfDayReports(filters = {}) {
    await delay(500);

    let filtered = [...eodReports];

    if (filters.startDate) {
      filtered = filtered.filter(r => r.reportDate >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(r => r.reportDate <= new Date(filters.endDate));
    }

    if (filters.status) {
      filtered = filtered.filter(r => r.status === filters.status);
    }

    // Sort by date descending
    filtered.sort((a, b) => b.reportDate - a.reportDate);

    return filtered;
  },

  /**
   * Update end-of-day report reconciliation
   * @param {string} id - Report ID
   * @param {Object} data - Reconciliation data
   * @returns {Promise<import('../types/report.types.js').EndOfDayReport>}
   */
  async reconcileEndOfDayReport(id, data) {
    await delay(500);

    const index = eodReports.findIndex(r => r.id === id);
    if (index === -1) {
      throw new Error('End-of-day report not found');
    }

    eodReports[index] = {
      ...eodReports[index],
      actualClosingBalance: data.actualClosingBalance,
      difference: data.actualClosingBalance - eodReports[index].expectedClosingBalance,
      reconciliation: {
        isReconciled: true,
        notes: data.notes || '',
        reconciledAt: new Date(),
        reconciledBy: data.reconciledBy || 'admin'
      },
      status: 'reconciled',
      updatedAt: new Date()
    };

    return { ...eodReports[index] };
  },

  /**
   * Generate profit margin analysis
   * @param {import('../types/report.types.js').ReportFilters} filters - Filter criteria
   * @returns {Promise<import('../types/report.types.js').ProfitMarginAnalysis>}
   */
  async generateProfitMarginAnalysis(filters = {}) {
    await delay(800);

    const profitLoss = await this.generateProfitLoss(filters);

    // Simplified margin analysis
    const byProduct = {
      'Yoga Classes': {
        revenue: profitLoss.revenue.classRevenue,
        cost: profitLoss.cogs.instructorFees,
        margin: ((profitLoss.revenue.classRevenue - profitLoss.cogs.instructorFees) / profitLoss.revenue.classRevenue) * 100
      },
      'Memberships': {
        revenue: profitLoss.revenue.membershipRevenue,
        cost: 0,
        margin: 100 // High margin on memberships
      },
      'Products': {
        revenue: profitLoss.revenue.productSales,
        cost: profitLoss.cogs.productCosts,
        margin: ((profitLoss.revenue.productSales - profitLoss.cogs.productCosts) / profitLoss.revenue.productSales) * 100
      }
    };

    const topMarginProducts = [
      { name: 'Memberships', margin: 100, revenue: profitLoss.revenue.membershipRevenue },
      { name: 'Yoga Classes', margin: byProduct['Yoga Classes'].margin, revenue: profitLoss.revenue.classRevenue },
      { name: 'Products', margin: byProduct['Products'].margin, revenue: profitLoss.revenue.productSales }
    ].sort((a, b) => b.margin - a.margin);

    const lowMarginProducts = [...topMarginProducts].reverse();

    return {
      period: new Date(),
      overallMargin: profitLoss.netProfitMargin,
      byProduct,
      byCategory: byProduct,
      byCustomer: {},
      topMarginProducts,
      lowMarginProducts,
      trends: {
        current: profitLoss.netProfitMargin,
        previous: profitLoss.netProfitMargin * 0.95, // Simplified
        change: 5.0
      }
    };
  },

  /**
   * Generate tax report
   * @param {import('../types/report.types.js').ReportFilters} filters - Filter criteria
   * @returns {Promise<import('../types/report.types.js').TaxReport>}
   */
  async generateTaxReport(filters = {}) {
    await delay(600);

    const startDate = filters.startDate || new Date(new Date().getFullYear(), 0, 1);
    const endDate = filters.endDate || new Date();

    const transactions = await transactionService.getList({
      type: 'income',
      startDate,
      endDate
    });

    const totalSales = transactions.reduce((sum, t) => sum + t.amount, 0);
    const taxableSales = totalSales * 0.9; // 90% taxable
    const nonTaxableSales = totalSales * 0.1; // 10% non-taxable

    const totalTaxCollected = taxableSales * 0.1; // 10% tax rate

    return {
      startDate,
      endDate,
      totalSales,
      taxableSales,
      nonTaxableSales,
      totalTaxCollected,
      taxByRate: {
        '10%': totalTaxCollected
      },
      taxPayable: totalTaxCollected,
      taxCredits: 0,
      netTaxDue: totalTaxCollected
    };
  },

  /**
   * Generate financial summary
   * @param {import('../types/report.types.js').ReportFilters} filters - Filter criteria
   * @returns {Promise<import('../types/report.types.js').FinancialSummary>}
   */
  async generateFinancialSummary(filters = {}) {
    await delay(800);

    const profitLoss = await this.generateProfitLoss(filters);
    const invoiceStats = await invoiceService.getStats(filters);

    return {
      period: new Date(),
      totalRevenue: profitLoss.totalRevenue,
      totalExpenses: profitLoss.totalOperatingExpenses + profitLoss.costOfGoodsSold,
      netIncome: profitLoss.netIncome,
      cashBalance: 15750.00, // Would come from cash flow service
      accountsReceivable: invoiceStats.totalDue,
      accountsPayable: 5000.00, // Simplified
      profitMargin: profitLoss.netProfitMargin,
      trends: {
        revenueGrowth: '+12.5%',
        expenseGrowth: '+8.2%',
        profitGrowth: '+18.3%'
      }
    };
  },

  /**
   * Export report to CSV (mock)
   * @param {string} reportType - Type of report
   * @param {Object} data - Report data
   * @returns {Promise<string>} URL to CSV file
   */
  async exportToCSV(reportType, data) {
    await delay(1000);
    return `https://example.com/reports/${reportType}_${Date.now()}.csv`;
  },

  /**
   * Export report to PDF (mock)
   * @param {string} reportType - Type of report
   * @param {Object} data - Report data
   * @returns {Promise<string>} URL to PDF file
   */
  async exportToPDF(reportType, data) {
    await delay(1200);
    return `https://example.com/reports/${reportType}_${Date.now()}.pdf`;
  }
};
