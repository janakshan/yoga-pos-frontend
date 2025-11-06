/**
 * Financial Slice
 * Manages overall financial state including cash flow, reconciliation, and reports
 */

export const createFinancialSlice = (set, get, api) => ({
  // State
  bankAccounts: [],
  cashFlowStatement: null,
  bankReconciliations: [],
  eodReports: [],
  profitLossStatement: null,
  financialSummary: null,
  financialLoading: false,
  financialError: null,

  // Actions
  setBankAccounts: (accounts) => {
    set((state) => {
      state.bankAccounts = accounts;
    });
  },

  updateBankAccount: (id, updates) => {
    set((state) => {
      const index = state.bankAccounts.findIndex((acc) => acc.id === id);
      if (index !== -1) {
        state.bankAccounts[index] = { ...state.bankAccounts[index], ...updates };
      }
    });
  },

  setCashFlowStatement: (statement) => {
    set((state) => {
      state.cashFlowStatement = statement;
    });
  },

  setBankReconciliations: (reconciliations) => {
    set((state) => {
      state.bankReconciliations = reconciliations;
    });
  },

  addBankReconciliation: (reconciliation) => {
    set((state) => {
      state.bankReconciliations.unshift(reconciliation);
    });
  },

  setEodReports: (reports) => {
    set((state) => {
      state.eodReports = reports;
    });
  },

  addEodReport: (report) => {
    set((state) => {
      state.eodReports.unshift(report);
    });
  },

  updateEodReport: (id, updates) => {
    set((state) => {
      const index = state.eodReports.findIndex((report) => report.id === id);
      if (index !== -1) {
        state.eodReports[index] = { ...state.eodReports[index], ...updates };
      }
    });
  },

  setProfitLossStatement: (statement) => {
    set((state) => {
      state.profitLossStatement = statement;
    });
  },

  setFinancialSummary: (summary) => {
    set((state) => {
      state.financialSummary = summary;
    });
  },

  setFinancialLoading: (loading) => {
    set((state) => {
      state.financialLoading = loading;
    });
  },

  setFinancialError: (error) => {
    set((state) => {
      state.financialError = error;
    });
  },

  // Computed/Getters
  getBankAccountById: (id) => {
    const state = get();
    return state.bankAccounts.find((acc) => acc.id === id);
  },

  getPrimaryBankAccount: () => {
    const state = get();
    return state.bankAccounts.find((acc) => acc.isPrimary);
  },

  getTotalCashBalance: () => {
    const state = get();
    return state.bankAccounts
      .filter((acc) => acc.isActive)
      .reduce((sum, acc) => sum + acc.currentBalance, 0);
  },

  getEodReportById: (id) => {
    const state = get();
    return state.eodReports.find((report) => report.id === id);
  },

  getLatestEodReport: () => {
    const state = get();
    if (state.eodReports.length === 0) return null;
    return state.eodReports.reduce((latest, report) =>
      report.reportDate > latest.reportDate ? report : latest
    );
  },

  getUnreconciledEodReports: () => {
    const state = get();
    return state.eodReports.filter((report) => report.status !== 'reconciled');
  },
});
