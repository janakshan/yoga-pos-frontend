import {
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  TRANSACTION_STATUS,
} from '../types';
import { calculateCartTotals, generateTransactionNumber, generateReceiptNumber } from '../utils/calculations';

/**
 * Mock delay to simulate network latency
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate unique ID
 * @returns {string}
 */
const generateId = () => `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Mock transactions data
 */
let MOCK_TRANSACTIONS = [
  {
    id: 'txn_001',
    transactionNumber: 'TXN-1704108000000-001',
    items: [
      {
        id: 'cart-item-1',
        productId: 'prod_001',
        name: 'Premium Yoga Mat - Ocean Blue',
        price: 49.99,
        quantity: 2,
        category: 'Yoga Mat',
        stock: 45,
        subtotal: 99.98,
      },
      {
        id: 'cart-item-2',
        productId: 'prod_003',
        name: 'Cork Yoga Block (Set of 2)',
        price: 24.99,
        quantity: 1,
        category: 'Yoga Block',
        stock: 67,
        subtotal: 24.99,
      },
    ],
    subtotal: 124.97,
    discount: 12.50,
    discountPercentage: 10,
    tax: 20.25,
    taxPercentage: 18,
    total: 132.72,
    paymentMethod: PAYMENT_METHODS.CARD,
    paymentStatus: PAYMENT_STATUS.COMPLETED,
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@example.com',
    customerPhone: '+1-555-0123',
    notes: '',
    createdAt: new Date('2024-01-01T10:30:00'),
    createdBy: 'user_001',
    status: TRANSACTION_STATUS.COMPLETED,
  },
  {
    id: 'txn_002',
    transactionNumber: 'TXN-1704194400000-002',
    items: [
      {
        id: 'cart-item-3',
        productId: 'prod_008',
        name: 'Monthly Unlimited Membership',
        price: 129.99,
        quantity: 1,
        category: 'Memberships',
        stock: 999,
        subtotal: 129.99,
      },
    ],
    subtotal: 129.99,
    discount: 0,
    discountPercentage: 0,
    tax: 0,
    taxPercentage: 0,
    total: 129.99,
    paymentMethod: PAYMENT_METHODS.CARD,
    paymentStatus: PAYMENT_STATUS.COMPLETED,
    customerName: 'Mike Chen',
    customerEmail: 'mike.chen@example.com',
    customerPhone: '+1-555-0456',
    notes: 'New member - January promotion',
    createdAt: new Date('2024-01-02T14:15:00'),
    createdBy: 'user_001',
    status: TRANSACTION_STATUS.COMPLETED,
  },
  {
    id: 'txn_003',
    transactionNumber: 'TXN-1704280800000-003',
    items: [
      {
        id: 'cart-item-4',
        productId: 'prod_009',
        name: 'Beginner Yoga Class - Single Session',
        price: 25.00,
        quantity: 3,
        category: 'Classes',
        stock: 999,
        subtotal: 75.00,
      },
      {
        id: 'cart-item-5',
        productId: 'prod_007',
        name: 'Insulated Water Bottle - 750ml',
        price: 29.99,
        quantity: 1,
        category: 'Accessories',
        stock: 41,
        subtotal: 29.99,
      },
    ],
    subtotal: 104.99,
    discount: 0,
    discountPercentage: 0,
    tax: 5.40,
    taxPercentage: 18,
    total: 110.39,
    paymentMethod: PAYMENT_METHODS.CASH,
    paymentStatus: PAYMENT_STATUS.COMPLETED,
    customerName: 'Emma Watson',
    customerEmail: '',
    customerPhone: '',
    notes: '',
    createdAt: new Date('2024-01-03T09:45:00'),
    createdBy: 'user_001',
    status: TRANSACTION_STATUS.COMPLETED,
  },
];

/**
 * Store configuration
 */
const STORE_INFO = {
  name: 'Yoga Wellness Studio',
  address: '123 Peaceful Lane, Zen City, ZC 12345',
  phone: '+1-555-YOGA-NOW',
  email: 'contact@yogawellness.com',
  website: 'www.yogawellness.com',
  taxId: 'TAX-123456789',
};

/**
 * Calculate POS statistics
 * @param {Array} transactions - Array of transactions
 * @returns {Object} POS statistics
 */
const calculateStats = (transactions) => {
  const completedTransactions = transactions.filter(
    (t) => t.status === TRANSACTION_STATUS.COMPLETED
  );

  const today = new Date().toDateString();
  const todaysTransactions = completedTransactions.filter(
    (t) => new Date(t.createdAt).toDateString() === today
  );

  const totalSales = completedTransactions.reduce((sum, t) => sum + t.total, 0);
  const todaysSales = todaysTransactions.reduce((sum, t) => sum + t.total, 0);

  const paymentMethodBreakdown = {};
  Object.values(PAYMENT_METHODS).forEach((method) => {
    const methodTransactions = completedTransactions.filter(
      (t) => t.paymentMethod === method
    );
    paymentMethodBreakdown[method] = {
      count: methodTransactions.length,
      total: methodTransactions.reduce((sum, t) => sum + t.total, 0),
    };
  });

  return {
    totalSales: parseFloat(totalSales.toFixed(2)),
    totalTransactions: completedTransactions.length,
    todaysSales: parseFloat(todaysSales.toFixed(2)),
    todaysTransactions: todaysTransactions.length,
    averageTransactionValue:
      completedTransactions.length > 0
        ? parseFloat((totalSales / completedTransactions.length).toFixed(2))
        : 0,
    paymentMethodBreakdown,
  };
};

/**
 * POS Service
 * Mock service for POS operations
 */
export const posService = {
  /**
   * Process a sale transaction
   * @param {Object} saleData - Sale data
   * @returns {Promise<Object>} Created transaction
   */
  async processSale(saleData) {
    await delay(600);

    // Validation
    if (!saleData.items || saleData.items.length === 0) {
      throw new Error('Cart is empty');
    }

    if (!saleData.paymentMethod) {
      throw new Error('Payment method is required');
    }

    // Check stock availability
    for (const item of saleData.items) {
      if (item.quantity > item.stock) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
    }

    // Calculate totals
    const totals = calculateCartTotals(
      saleData.items,
      saleData.discountPercentage || 0,
      saleData.taxPercentage || 18
    );

    // Create transaction
    const transaction = {
      id: generateId(),
      transactionNumber: generateTransactionNumber(),
      items: saleData.items.map((item) => ({ ...item })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      discountPercentage: saleData.discountPercentage || 0,
      tax: totals.tax,
      taxPercentage: saleData.taxPercentage || 18,
      total: totals.total,
      paymentMethod: saleData.paymentMethod,
      paymentStatus: PAYMENT_STATUS.COMPLETED,
      customerName: saleData.customerName || '',
      customerEmail: saleData.customerEmail || '',
      customerPhone: saleData.customerPhone || '',
      notes: saleData.notes || '',
      createdAt: new Date(),
      createdBy: 'current_user',
      status: TRANSACTION_STATUS.COMPLETED,
    };

    MOCK_TRANSACTIONS.unshift(transaction);
    return { ...transaction };
  },

  /**
   * Get all transactions with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of transactions
   */
  async getList(filters = {}) {
    await delay(400);

    let result = [...MOCK_TRANSACTIONS];

    // Apply date range filter
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter((t) => new Date(t.createdAt) >= startDate);
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter((t) => new Date(t.createdAt) <= endDate);
    }

    // Apply payment method filter
    if (filters.paymentMethod && filters.paymentMethod !== 'all') {
      result = result.filter((t) => t.paymentMethod === filters.paymentMethod);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }

    // Apply customer search
    if (filters.customer) {
      const searchLower = filters.customer.toLowerCase();
      result = result.filter(
        (t) =>
          t.customerName.toLowerCase().includes(searchLower) ||
          t.customerEmail.toLowerCase().includes(searchLower) ||
          t.customerPhone.toLowerCase().includes(searchLower)
      );
    }

    // Apply transaction number search
    if (filters.transactionNumber) {
      const searchLower = filters.transactionNumber.toLowerCase();
      result = result.filter((t) =>
        t.transactionNumber.toLowerCase().includes(searchLower)
      );
    }

    // Apply amount range filters
    if (filters.minAmount !== undefined && filters.minAmount !== '') {
      result = result.filter((t) => t.total >= parseFloat(filters.minAmount));
    }

    if (filters.maxAmount !== undefined && filters.maxAmount !== '') {
      result = result.filter((t) => t.total <= parseFloat(filters.maxAmount));
    }

    // Apply sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        let aVal = a[filters.sortBy];
        let bVal = b[filters.sortBy];

        // Handle date sorting
        if (filters.sortBy === 'createdAt') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (aVal < bVal) return -1 * sortOrder;
        if (aVal > bVal) return 1 * sortOrder;
        return 0;
      });
    }

    return result;
  },

  /**
   * Get a single transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Promise<Object>} Transaction object
   */
  async getById(id) {
    await delay(300);

    const transaction = MOCK_TRANSACTIONS.find((t) => t.id === id);
    if (!transaction) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    return { ...transaction };
  },

  /**
   * Get transaction by transaction number
   * @param {string} transactionNumber - Transaction number
   * @returns {Promise<Object>} Transaction object
   */
  async getByTransactionNumber(transactionNumber) {
    await delay(300);

    const transaction = MOCK_TRANSACTIONS.find(
      (t) => t.transactionNumber === transactionNumber
    );
    if (!transaction) {
      throw new Error(`Transaction ${transactionNumber} not found`);
    }

    return { ...transaction };
  },

  /**
   * Refund a transaction
   * @param {string} id - Transaction ID
   * @param {string} reason - Refund reason
   * @returns {Promise<Object>} Updated transaction
   */
  async refundTransaction(id, reason = '') {
    await delay(500);

    const index = MOCK_TRANSACTIONS.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    const transaction = MOCK_TRANSACTIONS[index];

    if (transaction.status === TRANSACTION_STATUS.REFUNDED) {
      throw new Error('Transaction has already been refunded');
    }

    if (transaction.status === TRANSACTION_STATUS.CANCELLED) {
      throw new Error('Cannot refund a cancelled transaction');
    }

    transaction.status = TRANSACTION_STATUS.REFUNDED;
    transaction.paymentStatus = PAYMENT_STATUS.REFUNDED;
    transaction.refundReason = reason;
    transaction.refundedAt = new Date();

    return { ...transaction };
  },

  /**
   * Cancel a transaction
   * @param {string} id - Transaction ID
   * @returns {Promise<Object>} Updated transaction
   */
  async cancelTransaction(id) {
    await delay(400);

    const index = MOCK_TRANSACTIONS.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Transaction with ID ${id} not found`);
    }

    const transaction = MOCK_TRANSACTIONS[index];

    if (transaction.status !== TRANSACTION_STATUS.DRAFT) {
      throw new Error('Only draft transactions can be cancelled');
    }

    transaction.status = TRANSACTION_STATUS.CANCELLED;
    transaction.cancelledAt = new Date();

    return { ...transaction };
  },

  /**
   * Get POS statistics
   * @returns {Promise<Object>} POS statistics
   */
  async getStats() {
    await delay(300);
    return calculateStats(MOCK_TRANSACTIONS);
  },

  /**
   * Get today's transactions
   * @returns {Promise<Array>} Today's transactions
   */
  async getTodaysTransactions() {
    await delay(300);

    const today = new Date().toDateString();
    return MOCK_TRANSACTIONS.filter(
      (t) => new Date(t.createdAt).toDateString() === today
    );
  },

  /**
   * Generate receipt for a transaction
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Receipt data
   */
  async generateReceipt(transactionId) {
    await delay(400);

    const transaction = MOCK_TRANSACTIONS.find((t) => t.id === transactionId);
    if (!transaction) {
      throw new Error(`Transaction with ID ${transactionId} not found`);
    }

    const receipt = {
      id: `rcp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      transactionId: transaction.id,
      receiptNumber: generateReceiptNumber(),
      storeName: STORE_INFO.name,
      storeAddress: STORE_INFO.address,
      storePhone: STORE_INFO.phone,
      storeEmail: STORE_INFO.email,
      storeWebsite: STORE_INFO.website,
      taxId: STORE_INFO.taxId,
      transaction: { ...transaction },
      generatedAt: new Date(),
    };

    return receipt;
  },

  /**
   * Get sales report by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Object>} Sales report
   */
  async getSalesReport(startDate, endDate) {
    await delay(500);

    const transactions = MOCK_TRANSACTIONS.filter((t) => {
      const transactionDate = new Date(t.createdAt);
      return (
        t.status === TRANSACTION_STATUS.COMPLETED &&
        transactionDate >= startDate &&
        transactionDate <= endDate
      );
    });

    const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalDiscount = transactions.reduce((sum, t) => sum + t.discount, 0);
    const totalTax = transactions.reduce((sum, t) => sum + t.tax, 0);

    // Group by date
    const salesByDate = {};
    transactions.forEach((t) => {
      const date = new Date(t.createdAt).toLocaleDateString();
      if (!salesByDate[date]) {
        salesByDate[date] = { count: 0, total: 0 };
      }
      salesByDate[date].count++;
      salesByDate[date].total += t.total;
    });

    // Group by payment method
    const salesByPaymentMethod = {};
    Object.values(PAYMENT_METHODS).forEach((method) => {
      const methodTransactions = transactions.filter(
        (t) => t.paymentMethod === method
      );
      salesByPaymentMethod[method] = {
        count: methodTransactions.length,
        total: methodTransactions.reduce((sum, t) => sum + t.total, 0),
      };
    });

    return {
      startDate,
      endDate,
      totalTransactions: transactions.length,
      totalSales: parseFloat(totalSales.toFixed(2)),
      totalDiscount: parseFloat(totalDiscount.toFixed(2)),
      totalTax: parseFloat(totalTax.toFixed(2)),
      averageTransactionValue:
        transactions.length > 0
          ? parseFloat((totalSales / transactions.length).toFixed(2))
          : 0,
      salesByDate,
      salesByPaymentMethod,
    };
  },

  /**
   * Get store information
   * @returns {Promise<Object>} Store information
   */
  async getStoreInfo() {
    await delay(200);
    return { ...STORE_INFO };
  },
};

export default posService;
