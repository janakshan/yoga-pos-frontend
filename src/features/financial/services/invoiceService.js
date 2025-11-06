import { delay } from '@/utils/delay.js';

/**
 * Mock invoice data
 * @type {import('../types/invoice.types.js').Invoice[]}
 */
const MOCK_INVOICES = [
  {
    id: 'INV001',
    invoiceNumber: 'INV-2024-001',
    customerId: '1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    customerPhone: '+1-555-0101',
    invoiceDate: new Date('2024-10-01'),
    dueDate: new Date('2024-10-15'),
    status: 'paid',
    items: [
      {
        id: 'item1',
        productId: '1',
        productName: 'Morning Yoga Class - 10 Sessions',
        description: '10-session package for morning yoga',
        quantity: 1,
        unitPrice: 150.00,
        discount: 0,
        tax: 15.00,
        total: 165.00
      }
    ],
    subtotal: 150.00,
    discountAmount: 0,
    taxAmount: 15.00,
    total: 165.00,
    amountPaid: 165.00,
    amountDue: 0,
    currency: 'USD',
    notes: 'Thank you for your business!',
    terms: 'Payment due within 14 days',
    createdBy: 'admin',
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-02'),
    paidAt: new Date('2024-10-02'),
    paymentMethod: 'card',
    transactionId: 'TXN001'
  },
  {
    id: 'INV002',
    invoiceNumber: 'INV-2024-002',
    customerId: '2',
    customerName: 'Michael Chen',
    customerEmail: 'mchen@email.com',
    customerPhone: '+1-555-0102',
    invoiceDate: new Date('2024-10-05'),
    dueDate: new Date('2024-10-19'),
    status: 'overdue',
    items: [
      {
        id: 'item2',
        productId: '2',
        productName: 'Premium Membership',
        description: 'Monthly premium membership',
        quantity: 1,
        unitPrice: 99.00,
        discount: 0,
        tax: 9.90,
        total: 108.90
      }
    ],
    subtotal: 99.00,
    discountAmount: 0,
    taxAmount: 9.90,
    total: 108.90,
    amountPaid: 0,
    amountDue: 108.90,
    currency: 'USD',
    notes: '',
    terms: 'Payment due within 14 days',
    createdBy: 'admin',
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-10-05')
  },
  {
    id: 'INV003',
    invoiceNumber: 'INV-2024-003',
    customerId: '3',
    customerName: 'Emma Wilson',
    customerEmail: 'emma.w@email.com',
    customerPhone: '+1-555-0103',
    invoiceDate: new Date('2024-10-10'),
    dueDate: new Date('2024-10-24'),
    status: 'partial',
    items: [
      {
        id: 'item3',
        productId: '3',
        productName: 'Yoga Mat Premium',
        description: 'Premium eco-friendly yoga mat',
        quantity: 2,
        unitPrice: 45.00,
        discount: 5.00,
        tax: 8.50,
        total: 93.50
      },
      {
        id: 'item4',
        productId: '4',
        productName: 'Evening Yoga Class',
        description: 'Single evening class',
        quantity: 5,
        unitPrice: 20.00,
        discount: 0,
        tax: 10.00,
        total: 110.00
      }
    ],
    subtotal: 190.00,
    discountAmount: 5.00,
    taxAmount: 18.50,
    total: 203.50,
    amountPaid: 100.00,
    amountDue: 103.50,
    currency: 'USD',
    notes: 'Partial payment received',
    terms: 'Payment due within 14 days',
    createdBy: 'admin',
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-10-12'),
    paymentMethod: 'cash'
  },
  {
    id: 'INV004',
    invoiceNumber: 'INV-2024-004',
    customerId: '4',
    customerName: 'David Martinez',
    customerEmail: 'dmartinez@email.com',
    customerPhone: '+1-555-0104',
    invoiceDate: new Date('2024-10-15'),
    dueDate: new Date('2024-10-29'),
    status: 'sent',
    items: [
      {
        id: 'item5',
        productId: '5',
        productName: 'Private Session',
        description: 'One-on-one private yoga session',
        quantity: 3,
        unitPrice: 75.00,
        discount: 15.00,
        tax: 21.00,
        total: 231.00
      }
    ],
    subtotal: 225.00,
    discountAmount: 15.00,
    taxAmount: 21.00,
    total: 231.00,
    amountPaid: 0,
    amountDue: 231.00,
    currency: 'USD',
    notes: 'Discount applied for bulk booking',
    terms: 'Payment due within 14 days',
    createdBy: 'admin',
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-10-15')
  },
  {
    id: 'INV005',
    invoiceNumber: 'INV-2024-005',
    customerId: '1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    customerPhone: '+1-555-0101',
    invoiceDate: new Date('2024-10-20'),
    dueDate: new Date('2024-11-03'),
    status: 'draft',
    items: [
      {
        id: 'item6',
        productId: '6',
        productName: 'Meditation Workshop',
        description: 'Weekend meditation workshop',
        quantity: 1,
        unitPrice: 120.00,
        discount: 0,
        tax: 12.00,
        total: 132.00
      }
    ],
    subtotal: 120.00,
    discountAmount: 0,
    taxAmount: 12.00,
    total: 132.00,
    amountPaid: 0,
    amountDue: 132.00,
    currency: 'USD',
    notes: 'Draft - pending finalization',
    terms: 'Payment due within 14 days',
    createdBy: 'admin',
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-20')
  }
];

let invoices = [...MOCK_INVOICES];
let invoiceCounter = 6;

/**
 * Invoice Service
 * Provides operations for managing invoices
 */
export const invoiceService = {
  /**
   * Get list of invoices with optional filters
   * @param {import('../types/invoice.types.js').InvoiceFilters} filters - Filter criteria
   * @returns {Promise<import('../types/invoice.types.js').Invoice[]>}
   */
  async getList(filters = {}) {
    await delay(500);

    let filtered = [...invoices];

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(inv => inv.status === filters.status);
    }

    if (filters.customerId) {
      filtered = filtered.filter(inv => inv.customerId === filters.customerId);
    }

    if (filters.startDate) {
      filtered = filtered.filter(inv => inv.invoiceDate >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(inv => inv.invoiceDate <= new Date(filters.endDate));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchLower) ||
        inv.customerName.toLowerCase().includes(searchLower) ||
        inv.customerEmail.toLowerCase().includes(searchLower)
      );
    }

    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(inv => inv.total >= filters.minAmount);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(inv => inv.total <= filters.maxAmount);
    }

    // Sort by invoice date descending
    filtered.sort((a, b) => b.invoiceDate - a.invoiceDate);

    return filtered;
  },

  /**
   * Get invoice by ID
   * @param {string} id - Invoice ID
   * @returns {Promise<import('../types/invoice.types.js').Invoice>}
   */
  async getById(id) {
    await delay(300);

    const invoice = invoices.find(inv => inv.id === id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return { ...invoice };
  },

  /**
   * Create new invoice
   * @param {Partial<import('../types/invoice.types.js').Invoice>} data - Invoice data
   * @returns {Promise<import('../types/invoice.types.js').Invoice>}
   */
  async create(data) {
    await delay(500);

    const newInvoice = {
      id: `INV${String(invoiceCounter).padStart(3, '0')}`,
      invoiceNumber: `INV-2024-${String(invoiceCounter).padStart(3, '0')}`,
      customerId: data.customerId || '',
      customerName: data.customerName || '',
      customerEmail: data.customerEmail || '',
      customerPhone: data.customerPhone || '',
      invoiceDate: data.invoiceDate || new Date(),
      dueDate: data.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: data.status || 'draft',
      items: data.items || [],
      subtotal: data.subtotal || 0,
      discountAmount: data.discountAmount || 0,
      taxAmount: data.taxAmount || 0,
      total: data.total || 0,
      amountPaid: 0,
      amountDue: data.total || 0,
      currency: data.currency || 'USD',
      notes: data.notes || '',
      terms: data.terms || 'Payment due within 14 days',
      createdBy: data.createdBy || 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    invoiceCounter++;
    invoices.push(newInvoice);

    return newInvoice;
  },

  /**
   * Update invoice
   * @param {string} id - Invoice ID
   * @param {Partial<import('../types/invoice.types.js').Invoice>} data - Updated data
   * @returns {Promise<import('../types/invoice.types.js').Invoice>}
   */
  async update(id, data) {
    await delay(500);

    const index = invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }

    invoices[index] = {
      ...invoices[index],
      ...data,
      updatedAt: new Date()
    };

    return { ...invoices[index] };
  },

  /**
   * Delete invoice
   * @param {string} id - Invoice ID
   * @returns {Promise<boolean>}
   */
  async remove(id) {
    await delay(300);

    const index = invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }

    invoices.splice(index, 1);
    return true;
  },

  /**
   * Mark invoice as paid
   * @param {string} id - Invoice ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<import('../types/invoice.types.js').Invoice>}
   */
  async markAsPaid(id, paymentData) {
    await delay(500);

    const index = invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }

    invoices[index] = {
      ...invoices[index],
      status: 'paid',
      amountPaid: invoices[index].total,
      amountDue: 0,
      paidAt: new Date(),
      paymentMethod: paymentData.paymentMethod,
      transactionId: paymentData.transactionId,
      updatedAt: new Date()
    };

    return { ...invoices[index] };
  },

  /**
   * Record partial payment
   * @param {string} id - Invoice ID
   * @param {Object} paymentData - Payment information
   * @returns {Promise<import('../types/invoice.types.js').Invoice>}
   */
  async recordPartialPayment(id, paymentData) {
    await delay(500);

    const index = invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }

    const newAmountPaid = invoices[index].amountPaid + paymentData.amount;
    const newAmountDue = invoices[index].total - newAmountPaid;

    invoices[index] = {
      ...invoices[index],
      status: newAmountDue === 0 ? 'paid' : 'partial',
      amountPaid: newAmountPaid,
      amountDue: newAmountDue,
      paidAt: newAmountDue === 0 ? new Date() : invoices[index].paidAt,
      paymentMethod: paymentData.paymentMethod,
      updatedAt: new Date()
    };

    return { ...invoices[index] };
  },

  /**
   * Send invoice to customer
   * @param {string} id - Invoice ID
   * @returns {Promise<import('../types/invoice.types.js').Invoice>}
   */
  async sendInvoice(id) {
    await delay(500);

    const index = invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      throw new Error('Invoice not found');
    }

    invoices[index] = {
      ...invoices[index],
      status: 'sent',
      updatedAt: new Date()
    };

    return { ...invoices[index] };
  },

  /**
   * Get invoice statistics
   * @param {Object} filters - Optional filters
   * @returns {Promise<import('../types/invoice.types.js').InvoiceStats>}
   */
  async getStats(filters = {}) {
    await delay(300);

    const filtered = await this.getList(filters);

    const stats = {
      totalInvoices: filtered.length,
      totalAmount: filtered.reduce((sum, inv) => sum + inv.total, 0),
      totalPaid: filtered.reduce((sum, inv) => sum + inv.amountPaid, 0),
      totalDue: filtered.reduce((sum, inv) => sum + inv.amountDue, 0),
      overdueAmount: filtered
        .filter(inv => inv.status === 'overdue')
        .reduce((sum, inv) => sum + inv.amountDue, 0),
      overdueCount: filtered.filter(inv => inv.status === 'overdue').length,
      draftCount: filtered.filter(inv => inv.status === 'draft').length,
      paidCount: filtered.filter(inv => inv.status === 'paid').length,
      partialCount: filtered.filter(inv => inv.status === 'partial').length,
      averageInvoiceValue: filtered.length > 0
        ? filtered.reduce((sum, inv) => sum + inv.total, 0) / filtered.length
        : 0,
      collectionRate: filtered.reduce((sum, inv) => sum + inv.total, 0) > 0
        ? (filtered.reduce((sum, inv) => sum + inv.amountPaid, 0) /
           filtered.reduce((sum, inv) => sum + inv.total, 0)) * 100
        : 0
    };

    return stats;
  },

  /**
   * Get overdue invoices
   * @returns {Promise<import('../types/invoice.types.js').Invoice[]>}
   */
  async getOverdueInvoices() {
    await delay(300);

    const now = new Date();
    const overdue = invoices.filter(inv =>
      inv.dueDate < now &&
      inv.amountDue > 0 &&
      inv.status !== 'paid' &&
      inv.status !== 'cancelled'
    );

    // Update status to overdue
    overdue.forEach(inv => {
      inv.status = 'overdue';
    });

    return overdue;
  },

  /**
   * Generate invoice PDF (mock)
   * @param {string} id - Invoice ID
   * @returns {Promise<string>} URL to PDF
   */
  async generatePDF(id) {
    await delay(1000);

    const invoice = await this.getById(id);
    // In real implementation, this would generate a PDF
    return `https://example.com/invoices/${invoice.invoiceNumber}.pdf`;
  },

  /**
   * Email invoice to customer (mock)
   * @param {string} id - Invoice ID
   * @returns {Promise<boolean>}
   */
  async emailInvoice(id) {
    await delay(800);

    const invoice = await this.getById(id);
    // In real implementation, this would send an email
    console.log(`Email sent to ${invoice.customerEmail}`);
    return true;
  }
};
