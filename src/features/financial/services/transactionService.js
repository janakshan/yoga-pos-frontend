import { delay } from '@/utils/delay.js';

/**
 * Mock transaction data
 * @type {import('../types/transaction.types.js').Transaction[]}
 */
const MOCK_TRANSACTIONS = [
  {
    id: 'TXN001',
    transactionNumber: 'TXN-2024-001',
    type: 'income',
    category: 'invoice',
    amount: 165.00,
    transactionDate: new Date('2024-10-02'),
    description: 'Payment received for INV-2024-001',
    referenceId: 'INV001',
    referenceType: 'invoice',
    referenceNumber: 'INV-2024-001',
    accountId: 'ACC001',
    accountName: 'Main Operating Account',
    customerId: '1',
    paymentMethod: 'card',
    status: 'completed',
    notes: 'Customer: Sarah Johnson',
    createdBy: 'admin',
    createdAt: new Date('2024-10-02'),
    updatedAt: new Date('2024-10-02'),
    currency: 'USD',
    isReconciled: true,
    reconciledAt: new Date('2024-10-03'),
    reconciledBy: 'admin'
  },
  {
    id: 'TXN002',
    transactionNumber: 'TXN-2024-002',
    type: 'expense',
    category: 'expense',
    amount: 2500.00,
    transactionDate: new Date('2024-10-01'),
    description: 'Monthly studio rent payment',
    referenceId: 'EXP001',
    referenceType: 'expense',
    referenceNumber: 'EXP-2024-001',
    accountId: 'ACC001',
    accountName: 'Main Operating Account',
    vendorId: 'V001',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    notes: 'Vendor: Downtown Properties LLC',
    createdBy: 'admin',
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-01'),
    currency: 'USD',
    isReconciled: true,
    reconciledAt: new Date('2024-10-03'),
    reconciledBy: 'admin'
  },
  {
    id: 'TXN003',
    transactionNumber: 'TXN-2024-003',
    type: 'expense',
    category: 'expense',
    amount: 800.00,
    transactionDate: new Date('2024-10-05'),
    description: 'Purchase of yoga equipment',
    referenceId: 'EXP002',
    referenceType: 'expense',
    referenceNumber: 'EXP-2024-002',
    accountId: 'ACC001',
    accountName: 'Main Operating Account',
    vendorId: 'V002',
    paymentMethod: 'card',
    status: 'completed',
    notes: 'Vendor: Yoga Supply Co',
    createdBy: 'admin',
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-10-05'),
    currency: 'USD',
    isReconciled: false
  },
  {
    id: 'TXN004',
    transactionNumber: 'TXN-2024-004',
    type: 'income',
    category: 'payment',
    amount: 100.00,
    transactionDate: new Date('2024-10-12'),
    description: 'Partial payment received',
    referenceId: 'PAY002',
    referenceType: 'payment',
    referenceNumber: 'PAY-2024-002',
    accountId: 'ACC001',
    accountName: 'Main Operating Account',
    customerId: '3',
    paymentMethod: 'cash',
    status: 'completed',
    notes: 'Customer: Emma Wilson',
    createdBy: 'admin',
    createdAt: new Date('2024-10-12'),
    updatedAt: new Date('2024-10-12'),
    currency: 'USD',
    isReconciled: false
  },
  {
    id: 'TXN005',
    transactionNumber: 'TXN-2024-005',
    type: 'expense',
    category: 'expense',
    amount: 3200.00,
    transactionDate: new Date('2024-10-10'),
    description: 'Monthly instructor payments',
    referenceId: 'EXP003',
    referenceType: 'expense',
    referenceNumber: 'EXP-2024-003',
    accountId: 'ACC001',
    accountName: 'Main Operating Account',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    notes: 'Instructor compensation',
    createdBy: 'admin',
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-10-10'),
    currency: 'USD',
    isReconciled: false
  },
  {
    id: 'TXN006',
    transactionNumber: 'TXN-2024-006',
    type: 'income',
    category: 'payment',
    amount: 50.00,
    transactionDate: new Date('2024-10-18'),
    description: 'Membership renewal payment',
    referenceId: 'PAY003',
    referenceType: 'payment',
    referenceNumber: 'PAY-2024-003',
    accountId: 'ACC001',
    accountName: 'Main Operating Account',
    customerId: '5',
    paymentMethod: 'mobile_payment',
    status: 'completed',
    notes: 'Customer: Lisa Anderson',
    createdBy: 'admin',
    createdAt: new Date('2024-10-18'),
    updatedAt: new Date('2024-10-18'),
    currency: 'USD',
    isReconciled: false
  },
  {
    id: 'TXN007',
    transactionNumber: 'TXN-2024-007',
    type: 'income',
    category: 'payment',
    amount: 200.00,
    transactionDate: new Date('2024-10-22'),
    description: 'Bank transfer payment',
    referenceId: 'PAY004',
    referenceType: 'payment',
    referenceNumber: 'PAY-2024-004',
    accountId: 'ACC001',
    accountName: 'Main Operating Account',
    customerId: '6',
    paymentMethod: 'bank_transfer',
    status: 'pending',
    notes: 'Customer: Robert Brown - Pending verification',
    createdBy: 'admin',
    createdAt: new Date('2024-10-22'),
    updatedAt: new Date('2024-10-22'),
    currency: 'USD',
    isReconciled: false
  },
  {
    id: 'TXN008',
    transactionNumber: 'TXN-2024-008',
    type: 'expense',
    category: 'expense',
    amount: 1200.00,
    transactionDate: new Date('2024-10-25'),
    description: 'Quarterly insurance premium',
    referenceId: 'EXP007',
    referenceType: 'expense',
    referenceNumber: 'EXP-2024-007',
    accountId: 'ACC001',
    accountName: 'Main Operating Account',
    vendorId: 'V005',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    notes: 'Vendor: SafeGuard Insurance',
    createdBy: 'admin',
    createdAt: new Date('2024-10-25'),
    updatedAt: new Date('2024-10-25'),
    currency: 'USD',
    isReconciled: false
  }
];

let transactions = [...MOCK_TRANSACTIONS];
let transactionCounter = 9;

/**
 * Transaction Service
 * Provides operations for managing financial transactions
 */
export const transactionService = {
  /**
   * Get list of transactions with optional filters
   * @param {import('../types/transaction.types.js').TransactionFilters} filters - Filter criteria
   * @returns {Promise<import('../types/transaction.types.js').Transaction[]>}
   */
  async getList(filters = {}) {
    await delay(500);

    let filtered = [...transactions];

    // Apply filters
    if (filters.type) {
      filtered = filtered.filter(txn => txn.type === filters.type);
    }

    if (filters.category) {
      filtered = filtered.filter(txn => txn.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(txn => txn.status === filters.status);
    }

    if (filters.paymentMethod) {
      filtered = filtered.filter(txn => txn.paymentMethod === filters.paymentMethod);
    }

    if (filters.accountId) {
      filtered = filtered.filter(txn => txn.accountId === filters.accountId);
    }

    if (filters.startDate) {
      filtered = filtered.filter(txn => txn.transactionDate >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(txn => txn.transactionDate <= new Date(filters.endDate));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(txn =>
        txn.transactionNumber.toLowerCase().includes(searchLower) ||
        txn.description.toLowerCase().includes(searchLower) ||
        (txn.referenceNumber && txn.referenceNumber.toLowerCase().includes(searchLower))
      );
    }

    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(txn => txn.amount >= filters.minAmount);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(txn => txn.amount <= filters.maxAmount);
    }

    if (filters.isReconciled !== undefined) {
      filtered = filtered.filter(txn => txn.isReconciled === filters.isReconciled);
    }

    // Sort by transaction date descending
    filtered.sort((a, b) => b.transactionDate - a.transactionDate);

    return filtered;
  },

  /**
   * Get transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise<import('../types/transaction.types.js').Transaction>}
   */
  async getById(id) {
    await delay(300);

    const transaction = transactions.find(txn => txn.id === id);
    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return { ...transaction };
  },

  /**
   * Create new transaction
   * @param {Partial<import('../types/transaction.types.js').Transaction>} data - Transaction data
   * @returns {Promise<import('../types/transaction.types.js').Transaction>}
   */
  async create(data) {
    await delay(500);

    const newTransaction = {
      id: `TXN${String(transactionCounter).padStart(3, '0')}`,
      transactionNumber: `TXN-2024-${String(transactionCounter).padStart(3, '0')}`,
      type: data.type || 'income',
      category: data.category || 'other',
      amount: data.amount || 0,
      transactionDate: data.transactionDate || new Date(),
      description: data.description || '',
      referenceId: data.referenceId,
      referenceType: data.referenceType,
      referenceNumber: data.referenceNumber,
      accountId: data.accountId || 'ACC001',
      accountName: data.accountName || 'Main Operating Account',
      customerId: data.customerId,
      vendorId: data.vendorId,
      paymentMethod: data.paymentMethod || 'cash',
      status: data.status || 'completed',
      notes: data.notes || '',
      createdBy: data.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      currency: data.currency || 'USD',
      exchangeRate: data.exchangeRate,
      isReconciled: false
    };

    transactionCounter++;
    transactions.push(newTransaction);

    return newTransaction;
  },

  /**
   * Update transaction
   * @param {string} id - Transaction ID
   * @param {Partial<import('../types/transaction.types.js').Transaction>} data - Updated data
   * @returns {Promise<import('../types/transaction.types.js').Transaction>}
   */
  async update(id, data) {
    await delay(500);

    const index = transactions.findIndex(txn => txn.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }

    transactions[index] = {
      ...transactions[index],
      ...data,
      updatedAt: new Date()
    };

    return { ...transactions[index] };
  },

  /**
   * Delete transaction
   * @param {string} id - Transaction ID
   * @returns {Promise<boolean>}
   */
  async remove(id) {
    await delay(300);

    const index = transactions.findIndex(txn => txn.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }

    transactions.splice(index, 1);
    return true;
  },

  /**
   * Reconcile transaction
   * @param {string} id - Transaction ID
   * @param {string} reconciledBy - User who reconciled
   * @returns {Promise<import('../types/transaction.types.js').Transaction>}
   */
  async reconcile(id, reconciledBy) {
    await delay(500);

    const index = transactions.findIndex(txn => txn.id === id);
    if (index === -1) {
      throw new Error('Transaction not found');
    }

    transactions[index] = {
      ...transactions[index],
      isReconciled: true,
      reconciledAt: new Date(),
      reconciledBy,
      updatedAt: new Date()
    };

    return { ...transactions[index] };
  },

  /**
   * Bulk reconcile transactions
   * @param {string[]} ids - Transaction IDs
   * @param {string} reconciledBy - User who reconciled
   * @returns {Promise<number>} Number of reconciled transactions
   */
  async bulkReconcile(ids, reconciledBy) {
    await delay(800);

    let reconciledCount = 0;

    for (const id of ids) {
      const index = transactions.findIndex(txn => txn.id === id);
      if (index !== -1) {
        transactions[index] = {
          ...transactions[index],
          isReconciled: true,
          reconciledAt: new Date(),
          reconciledBy,
          updatedAt: new Date()
        };
        reconciledCount++;
      }
    }

    return reconciledCount;
  },

  /**
   * Get transaction statistics
   * @param {Object} filters - Optional filters
   * @returns {Promise<import('../types/transaction.types.js').TransactionStats>}
   */
  async getStats(filters = {}) {
    await delay(300);

    const filtered = await this.getList(filters);

    const byType = filtered.reduce((acc, txn) => {
      acc[txn.type] = (acc[txn.type] || 0) + txn.amount;
      return acc;
    }, {});

    const byCategory = filtered.reduce((acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
      return acc;
    }, {});

    const byPaymentMethod = filtered.reduce((acc, txn) => {
      acc[txn.paymentMethod] = (acc[txn.paymentMethod] || 0) + txn.amount;
      return acc;
    }, {});

    const totalIncome = filtered
      .filter(txn => txn.type === 'income')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const totalExpenses = filtered
      .filter(txn => txn.type === 'expense')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const stats = {
      totalTransactions: filtered.length,
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      pendingCount: filtered.filter(txn => txn.status === 'pending').length,
      completedCount: filtered.filter(txn => txn.status === 'completed').length,
      byType,
      byCategory,
      byPaymentMethod,
      reconciledCount: filtered.filter(txn => txn.isReconciled).length,
      unreconciledCount: filtered.filter(txn => !txn.isReconciled).length
    };

    return stats;
  },

  /**
   * Get unreconciled transactions
   * @returns {Promise<import('../types/transaction.types.js').Transaction[]>}
   */
  async getUnreconciled() {
    await delay(300);

    return transactions.filter(txn => !txn.isReconciled);
  },

  /**
   * Get transactions by reference
   * @param {string} referenceType - Reference type
   * @param {string} referenceId - Reference ID
   * @returns {Promise<import('../types/transaction.types.js').Transaction[]>}
   */
  async getByReference(referenceType, referenceId) {
    await delay(300);

    return transactions.filter(
      txn => txn.referenceType === referenceType && txn.referenceId === referenceId
    );
  }
};
