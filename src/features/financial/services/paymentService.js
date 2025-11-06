import { delay } from '@/utils/delay.js';

/**
 * Mock payment data
 * @type {import('../types/payment.types.js').Payment[]}
 */
const MOCK_PAYMENTS = [
  {
    id: 'PAY001',
    paymentNumber: 'PAY-2024-001',
    invoiceId: 'INV001',
    invoiceNumber: 'INV-2024-001',
    customerId: '1',
    customerName: 'Sarah Johnson',
    amount: 165.00,
    paymentMethod: 'card',
    paymentDate: new Date('2024-10-02'),
    status: 'completed',
    transactionId: 'TXN001234',
    referenceNumber: 'REF001',
    notes: 'Payment for yoga class package',
    currency: 'USD',
    receivedBy: 'admin',
    createdAt: new Date('2024-10-02'),
    updatedAt: new Date('2024-10-02'),
    cardLastFour: '4242'
  },
  {
    id: 'PAY002',
    paymentNumber: 'PAY-2024-002',
    invoiceId: 'INV003',
    invoiceNumber: 'INV-2024-003',
    customerId: '3',
    customerName: 'Emma Wilson',
    amount: 100.00,
    paymentMethod: 'cash',
    paymentDate: new Date('2024-10-12'),
    status: 'completed',
    referenceNumber: 'REF002',
    notes: 'Partial payment received',
    currency: 'USD',
    receivedBy: 'admin',
    createdAt: new Date('2024-10-12'),
    updatedAt: new Date('2024-10-12')
  },
  {
    id: 'PAY003',
    paymentNumber: 'PAY-2024-003',
    customerId: '5',
    customerName: 'Lisa Anderson',
    amount: 50.00,
    paymentMethod: 'mobile_payment',
    paymentDate: new Date('2024-10-18'),
    status: 'completed',
    transactionId: 'TXN567890',
    referenceNumber: 'REF003',
    notes: 'Membership renewal',
    currency: 'USD',
    receivedBy: 'admin',
    createdAt: new Date('2024-10-18'),
    updatedAt: new Date('2024-10-18')
  },
  {
    id: 'PAY004',
    paymentNumber: 'PAY-2024-004',
    customerId: '6',
    customerName: 'Robert Brown',
    amount: 200.00,
    paymentMethod: 'bank_transfer',
    paymentDate: new Date('2024-10-22'),
    status: 'pending',
    referenceNumber: 'REF004',
    notes: 'Bank transfer pending verification',
    currency: 'USD',
    receivedBy: 'admin',
    createdAt: new Date('2024-10-22'),
    updatedAt: new Date('2024-10-22'),
    bankName: 'First National Bank'
  },
  {
    id: 'PAY005',
    paymentNumber: 'PAY-2024-005',
    customerId: '1',
    customerName: 'Sarah Johnson',
    amount: 75.00,
    paymentMethod: 'store_credit',
    paymentDate: new Date('2024-10-25'),
    status: 'completed',
    referenceNumber: 'REF005',
    notes: 'Store credit applied',
    currency: 'USD',
    receivedBy: 'admin',
    createdAt: new Date('2024-10-25'),
    updatedAt: new Date('2024-10-25')
  }
];

let payments = [...MOCK_PAYMENTS];
let paymentCounter = 6;

/**
 * Payment Service
 * Provides operations for managing payments
 */
export const paymentService = {
  /**
   * Get list of payments with optional filters
   * @param {import('../types/payment.types.js').PaymentFilters} filters - Filter criteria
   * @returns {Promise<import('../types/payment.types.js').Payment[]>}
   */
  async getList(filters = {}) {
    await delay(500);

    let filtered = [...payments];

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(payment => payment.status === filters.status);
    }

    if (filters.paymentMethod) {
      filtered = filtered.filter(payment => payment.paymentMethod === filters.paymentMethod);
    }

    if (filters.customerId) {
      filtered = filtered.filter(payment => payment.customerId === filters.customerId);
    }

    if (filters.startDate) {
      filtered = filtered.filter(payment => payment.paymentDate >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(payment => payment.paymentDate <= new Date(filters.endDate));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.paymentNumber.toLowerCase().includes(searchLower) ||
        payment.customerName.toLowerCase().includes(searchLower) ||
        (payment.referenceNumber && payment.referenceNumber.toLowerCase().includes(searchLower)) ||
        (payment.transactionId && payment.transactionId.toLowerCase().includes(searchLower))
      );
    }

    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(payment => payment.amount >= filters.minAmount);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(payment => payment.amount <= filters.maxAmount);
    }

    // Sort by payment date descending
    filtered.sort((a, b) => b.paymentDate - a.paymentDate);

    return filtered;
  },

  /**
   * Get payment by ID
   * @param {string} id - Payment ID
   * @returns {Promise<import('../types/payment.types.js').Payment>}
   */
  async getById(id) {
    await delay(300);

    const payment = payments.find(p => p.id === id);
    if (!payment) {
      throw new Error('Payment not found');
    }

    return { ...payment };
  },

  /**
   * Create new payment
   * @param {Partial<import('../types/payment.types.js').Payment>} data - Payment data
   * @returns {Promise<import('../types/payment.types.js').Payment>}
   */
  async create(data) {
    await delay(500);

    const newPayment = {
      id: `PAY${String(paymentCounter).padStart(3, '0')}`,
      paymentNumber: `PAY-2024-${String(paymentCounter).padStart(3, '0')}`,
      invoiceId: data.invoiceId,
      invoiceNumber: data.invoiceNumber,
      customerId: data.customerId || '',
      customerName: data.customerName || '',
      amount: data.amount || 0,
      paymentMethod: data.paymentMethod || 'cash',
      paymentDate: data.paymentDate || new Date(),
      status: data.status || 'completed',
      transactionId: data.transactionId,
      referenceNumber: data.referenceNumber || `REF${String(paymentCounter).padStart(3, '0')}`,
      notes: data.notes || '',
      currency: data.currency || 'USD',
      receivedBy: data.receivedBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      bankName: data.bankName,
      checkNumber: data.checkNumber,
      cardLastFour: data.cardLastFour
    };

    paymentCounter++;
    payments.push(newPayment);

    return newPayment;
  },

  /**
   * Update payment
   * @param {string} id - Payment ID
   * @param {Partial<import('../types/payment.types.js').Payment>} data - Updated data
   * @returns {Promise<import('../types/payment.types.js').Payment>}
   */
  async update(id, data) {
    await delay(500);

    const index = payments.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Payment not found');
    }

    payments[index] = {
      ...payments[index],
      ...data,
      updatedAt: new Date()
    };

    return { ...payments[index] };
  },

  /**
   * Delete payment
   * @param {string} id - Payment ID
   * @returns {Promise<boolean>}
   */
  async remove(id) {
    await delay(300);

    const index = payments.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Payment not found');
    }

    payments.splice(index, 1);
    return true;
  },

  /**
   * Process refund
   * @param {string} id - Payment ID
   * @param {Object} refundData - Refund information
   * @returns {Promise<import('../types/payment.types.js').Payment>}
   */
  async processRefund(id, refundData) {
    await delay(500);

    const index = payments.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Payment not found');
    }

    payments[index] = {
      ...payments[index],
      status: 'refunded',
      notes: `${payments[index].notes}\nRefunded: ${refundData.reason}`,
      updatedAt: new Date()
    };

    return { ...payments[index] };
  },

  /**
   * Verify pending payment
   * @param {string} id - Payment ID
   * @returns {Promise<import('../types/payment.types.js').Payment>}
   */
  async verifyPayment(id) {
    await delay(500);

    const index = payments.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Payment not found');
    }

    payments[index] = {
      ...payments[index],
      status: 'completed',
      updatedAt: new Date()
    };

    return { ...payments[index] };
  },

  /**
   * Get payment statistics
   * @param {Object} filters - Optional filters
   * @returns {Promise<import('../types/payment.types.js').PaymentStats>}
   */
  async getStats(filters = {}) {
    await delay(300);

    const filtered = await this.getList(filters);

    const byPaymentMethod = filtered.reduce((acc, payment) => {
      acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + payment.amount;
      return acc;
    }, {});

    const stats = {
      totalPayments: filtered.length,
      totalAmount: filtered.reduce((sum, p) => sum + p.amount, 0),
      cashAmount: filtered
        .filter(p => p.paymentMethod === 'cash')
        .reduce((sum, p) => sum + p.amount, 0),
      cardAmount: filtered
        .filter(p => p.paymentMethod === 'card')
        .reduce((sum, p) => sum + p.amount, 0),
      bankTransferAmount: filtered
        .filter(p => p.paymentMethod === 'bank_transfer')
        .reduce((sum, p) => sum + p.amount, 0),
      completedCount: filtered.filter(p => p.status === 'completed').length,
      pendingCount: filtered.filter(p => p.status === 'pending').length,
      failedCount: filtered.filter(p => p.status === 'failed').length,
      refundedCount: filtered.filter(p => p.status === 'refunded').length,
      byPaymentMethod,
      averagePaymentValue: filtered.length > 0
        ? filtered.reduce((sum, p) => sum + p.amount, 0) / filtered.length
        : 0
    };

    return stats;
  },

  /**
   * Get payments by invoice
   * @param {string} invoiceId - Invoice ID
   * @returns {Promise<import('../types/payment.types.js').Payment[]>}
   */
  async getByInvoice(invoiceId) {
    await delay(300);

    return payments.filter(p => p.invoiceId === invoiceId);
  },

  /**
   * Get payments by customer
   * @param {string} customerId - Customer ID
   * @returns {Promise<import('../types/payment.types.js').Payment[]>}
   */
  async getByCustomer(customerId) {
    await delay(300);

    return payments
      .filter(p => p.customerId === customerId)
      .sort((a, b) => b.paymentDate - a.paymentDate);
  },

  /**
   * Generate receipt (mock)
   * @param {string} id - Payment ID
   * @returns {Promise<string>} URL to receipt
   */
  async generateReceipt(id) {
    await delay(800);

    const payment = await this.getById(id);
    // In real implementation, this would generate a receipt PDF
    return `https://example.com/receipts/${payment.paymentNumber}.pdf`;
  }
};
