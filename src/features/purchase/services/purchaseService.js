/**
 * Purchase Order Service
 * Mock API service for purchase order management
 */

import { PURCHASE_STATUS, PAYMENT_STATUS } from '../types/purchase.types.js';

// Simulated delay to mimic API latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate unique IDs
let poCounter = 50;
let receiptCounter = 20;
let returnCounter = 10;
let paymentCounter = 30;
let itemCounter = 200;

const generatePONumber = () => `PO-${new Date().getFullYear()}-${String(poCounter++).padStart(4, '0')}`;
const generateReceiptNumber = () => `GR-${new Date().getFullYear()}-${String(receiptCounter++).padStart(4, '0')}`;
const generateReturnNumber = () => `PR-${new Date().getFullYear()}-${String(returnCounter++).padStart(4, '0')}`;
const generateId = () => `ID-${String(Math.random()).slice(2, 12)}`;

// Mock data storage
let MOCK_PURCHASE_ORDERS = [
  {
    id: 'PO-001',
    orderNumber: 'PO-2024-0001',
    supplierId: 'SUP-000001',
    supplierName: 'Yoga Essentials International',
    orderDate: '2024-10-15T10:00:00.000Z',
    expectedDeliveryDate: '2024-10-25T10:00:00.000Z',
    actualDeliveryDate: '2024-10-24T14:30:00.000Z',
    status: 'received',
    items: [
      {
        id: 'ITEM-001',
        productId: 'PROD-001',
        productName: 'Premium Yoga Mat',
        sku: 'YM-001',
        quantity: 50,
        receivedQuantity: 50,
        unitCost: 2500,
        discount: 5,
        tax: 0,
        totalCost: 118750,
        notes: '',
        expiryDate: '',
        batchNumber: 'BATCH-001'
      },
      {
        id: 'ITEM-002',
        productId: 'PROD-002',
        productName: 'Yoga Block Set',
        sku: 'YB-001',
        quantity: 30,
        receivedQuantity: 30,
        unitCost: 800,
        discount: 5,
        tax: 0,
        totalCost: 22800,
        notes: '',
        expiryDate: '',
        batchNumber: 'BATCH-002'
      }
    ],
    subtotal: 149000,
    taxAmount: 0,
    discountAmount: 7450,
    shippingCost: 2000,
    totalAmount: 143550,
    paidAmount: 143550,
    balanceAmount: 0,
    paymentStatus: 'paid',
    payments: [
      {
        id: 'PAY-001',
        amount: 143550,
        method: 'bank_transfer',
        date: '2024-10-25T10:00:00.000Z',
        reference: 'BT-2024-001',
        notes: 'Payment for PO-2024-0001'
      }
    ],
    paymentTerms: '30 days net',
    shippingAddress: 'Main Warehouse, 123 Store Street, Colombo 05',
    notes: 'Regular monthly order',
    internalNotes: 'Good quality as always',
    receipts: [
      {
        id: 'GR-001',
        purchaseOrderId: 'PO-001',
        receiptNumber: 'GR-2024-0001',
        receivedDate: '2024-10-24T14:30:00.000Z',
        receivedBy: 'John Doe',
        items: [
          {
            purchaseItemId: 'ITEM-001',
            productId: 'PROD-001',
            quantityOrdered: 50,
            quantityReceived: 50,
            quantityAccepted: 50,
            quantityRejected: 0,
            rejectionReason: '',
            batchNumber: 'BATCH-001',
            expiryDate: ''
          },
          {
            purchaseItemId: 'ITEM-002',
            productId: 'PROD-002',
            quantityOrdered: 30,
            quantityReceived: 30,
            quantityAccepted: 30,
            quantityRejected: 0,
            rejectionReason: '',
            batchNumber: 'BATCH-002',
            expiryDate: ''
          }
        ],
        status: 'complete',
        notes: 'All items in good condition',
        inspectionNotes: 'Quality check passed',
        qualityApproved: true
      }
    ],
    returns: [],
    createdBy: 'admin',
    approvedBy: 'manager',
    createdAt: '2024-10-15T10:00:00.000Z',
    updatedAt: '2024-10-25T10:00:00.000Z',
    inventoryUpdated: true
  },
  {
    id: 'PO-002',
    orderNumber: 'PO-2024-0002',
    supplierId: 'SUP-000002',
    supplierName: 'Active Wear Solutions',
    orderDate: '2024-10-20T09:00:00.000Z',
    expectedDeliveryDate: '2024-11-05T09:00:00.000Z',
    actualDeliveryDate: '',
    status: 'ordered',
    items: [
      {
        id: 'ITEM-003',
        productId: 'PROD-003',
        productName: 'Yoga Pants - Medium',
        sku: 'YP-M-001',
        quantity: 25,
        receivedQuantity: 0,
        unitCost: 1500,
        discount: 3,
        tax: 0,
        totalCost: 36375,
        notes: '',
        expiryDate: '',
        batchNumber: ''
      },
      {
        id: 'ITEM-004',
        productId: 'PROD-004',
        productName: 'Sports Bra - Small',
        sku: 'SB-S-001',
        quantity: 20,
        receivedQuantity: 0,
        unitCost: 1200,
        discount: 3,
        tax: 0,
        totalCost: 23280,
        notes: '',
        expiryDate: '',
        batchNumber: ''
      }
    ],
    subtotal: 61500,
    taxAmount: 0,
    discountAmount: 1845,
    shippingCost: 1500,
    totalAmount: 61155,
    paidAmount: 0,
    balanceAmount: 61155,
    paymentStatus: 'unpaid',
    payments: [],
    paymentTerms: '45 days net',
    shippingAddress: 'Main Warehouse, 123 Store Street, Colombo 05',
    notes: 'New seasonal collection',
    internalNotes: 'Check quality on arrival',
    receipts: [],
    returns: [],
    createdBy: 'admin',
    approvedBy: 'manager',
    createdAt: '2024-10-20T09:00:00.000Z',
    updatedAt: '2024-10-20T09:30:00.000Z',
    inventoryUpdated: false
  },
  {
    id: 'PO-003',
    orderNumber: 'PO-2024-0003',
    supplierId: 'SUP-000001',
    supplierName: 'Yoga Essentials International',
    orderDate: '2024-11-01T11:00:00.000Z',
    expectedDeliveryDate: '2024-11-10T11:00:00.000Z',
    actualDeliveryDate: '2024-11-05T10:00:00.000Z',
    status: 'partial',
    items: [
      {
        id: 'ITEM-005',
        productId: 'PROD-005',
        productName: 'Yoga Strap',
        sku: 'YS-001',
        quantity: 100,
        receivedQuantity: 60,
        unitCost: 400,
        discount: 5,
        tax: 0,
        totalCost: 38000,
        notes: 'Partial delivery expected',
        expiryDate: '',
        batchNumber: 'BATCH-003'
      },
      {
        id: 'ITEM-006',
        productId: 'PROD-006',
        productName: 'Meditation Cushion',
        sku: 'MC-001',
        quantity: 20,
        receivedQuantity: 20,
        unitCost: 1800,
        discount: 5,
        tax: 0,
        totalCost: 34200,
        notes: '',
        expiryDate: '',
        batchNumber: 'BATCH-004'
      }
    ],
    subtotal: 76000,
    taxAmount: 0,
    discountAmount: 3800,
    shippingCost: 1800,
    totalAmount: 74000,
    paidAmount: 37000,
    balanceAmount: 37000,
    paymentStatus: 'partial',
    payments: [
      {
        id: 'PAY-002',
        amount: 37000,
        method: 'bank_transfer',
        date: '2024-11-05T15:00:00.000Z',
        reference: 'BT-2024-002',
        notes: 'Partial payment for received items'
      }
    ],
    paymentTerms: '30 days net',
    shippingAddress: 'Main Warehouse, 123 Store Street, Colombo 05',
    notes: 'Expecting balance delivery soon',
    internalNotes: 'Supplier confirmed balance by Nov 12',
    receipts: [
      {
        id: 'GR-002',
        purchaseOrderId: 'PO-003',
        receiptNumber: 'GR-2024-0002',
        receivedDate: '2024-11-05T10:00:00.000Z',
        receivedBy: 'Jane Smith',
        items: [
          {
            purchaseItemId: 'ITEM-005',
            productId: 'PROD-005',
            quantityOrdered: 100,
            quantityReceived: 60,
            quantityAccepted: 60,
            quantityRejected: 0,
            rejectionReason: '',
            batchNumber: 'BATCH-003',
            expiryDate: ''
          },
          {
            purchaseItemId: 'ITEM-006',
            productId: 'PROD-006',
            quantityOrdered: 20,
            quantityReceived: 20,
            quantityAccepted: 20,
            quantityRejected: 0,
            rejectionReason: '',
            batchNumber: 'BATCH-004',
            expiryDate: ''
          }
        ],
        status: 'partial',
        notes: 'Partial delivery - balance expected',
        inspectionNotes: 'Good quality',
        qualityApproved: true
      }
    ],
    returns: [],
    createdBy: 'admin',
    approvedBy: 'manager',
    createdAt: '2024-11-01T11:00:00.000Z',
    updatedAt: '2024-11-05T15:00:00.000Z',
    inventoryUpdated: true
  },
  {
    id: 'PO-004',
    orderNumber: 'PO-2024-0004',
    supplierId: 'SUP-000003',
    supplierName: 'Wellness Products Ltd',
    orderDate: '2024-11-03T14:00:00.000Z',
    expectedDeliveryDate: '',
    actualDeliveryDate: '',
    status: 'draft',
    items: [
      {
        id: 'ITEM-007',
        productId: 'PROD-007',
        productName: 'Water Bottle',
        sku: 'WB-001',
        quantity: 50,
        receivedQuantity: 0,
        unitCost: 600,
        discount: 0,
        tax: 0,
        totalCost: 30000,
        notes: '',
        expiryDate: '',
        batchNumber: ''
      }
    ],
    subtotal: 30000,
    taxAmount: 0,
    discountAmount: 0,
    shippingCost: 0,
    totalAmount: 30000,
    paidAmount: 0,
    balanceAmount: 30000,
    paymentStatus: 'unpaid',
    payments: [],
    paymentTerms: '30 days net',
    shippingAddress: '',
    notes: '',
    internalNotes: 'Draft order - pending approval',
    receipts: [],
    returns: [],
    createdBy: 'admin',
    approvedBy: '',
    createdAt: '2024-11-03T14:00:00.000Z',
    updatedAt: '2024-11-03T14:00:00.000Z',
    inventoryUpdated: false
  }
];

/**
 * Purchase Order Service API
 */
export const purchaseService = {
  /**
   * Get all purchase orders with optional filters
   */
  async getList(filters = {}) {
    await delay(400);

    let result = [...MOCK_PURCHASE_ORDERS];

    // Apply status filter
    if (filters.status) {
      result = result.filter((po) => po.status === filters.status);
    }

    // Apply supplier filter
    if (filters.supplierId) {
      result = result.filter((po) => po.supplierId === filters.supplierId);
    }

    // Apply payment status filter
    if (filters.paymentStatus) {
      result = result.filter((po) => po.paymentStatus === filters.paymentStatus);
    }

    // Apply date range filter
    if (filters.startDate) {
      result = result.filter(
        (po) => new Date(po.orderDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      result = result.filter(
        (po) => new Date(po.orderDate) <= new Date(filters.endDate)
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (po) =>
          po.orderNumber.toLowerCase().includes(searchTerm) ||
          po.supplierName.toLowerCase().includes(searchTerm) ||
          po.notes?.toLowerCase().includes(searchTerm)
      );
    }

    // Sort
    const sortBy = filters.sortBy || 'orderDate';
    const sortOrder = filters.sortOrder || 'desc';
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    return result;
  },

  /**
   * Get purchase order by ID
   */
  async getById(id) {
    await delay(300);
    const po = MOCK_PURCHASE_ORDERS.find((p) => p.id === id);
    if (!po) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }
    return { ...po };
  },

  /**
   * Create a new purchase order
   */
  async create(data) {
    await delay(500);

    // Validation
    if (!data.supplierId) {
      throw new Error('Supplier is required');
    }
    if (!data.items || data.items.length === 0) {
      throw new Error('At least one item is required');
    }

    // Create new purchase order
    const newPO = {
      id: generateId(),
      orderNumber: generatePONumber(),
      ...data,
      receipts: [],
      returns: [],
      payments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Calculate totals
    calculateTotals(newPO);

    MOCK_PURCHASE_ORDERS.push(newPO);
    return { ...newPO };
  },

  /**
   * Update an existing purchase order
   */
  async update(id, data) {
    await delay(500);

    const index = MOCK_PURCHASE_ORDERS.findIndex((po) => po.id === id);
    if (index === -1) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }

    const currentPO = MOCK_PURCHASE_ORDERS[index];

    // Check if order can be updated
    if (currentPO.status === 'received') {
      throw new Error('Cannot update a fully received purchase order');
    }

    // Update purchase order
    MOCK_PURCHASE_ORDERS[index] = {
      ...currentPO,
      ...data,
      updatedAt: new Date().toISOString()
    };

    // Recalculate totals if items changed
    if (data.items) {
      calculateTotals(MOCK_PURCHASE_ORDERS[index]);
    }

    return { ...MOCK_PURCHASE_ORDERS[index] };
  },

  /**
   * Delete a purchase order
   */
  async remove(id) {
    await delay(400);

    const index = MOCK_PURCHASE_ORDERS.findIndex((po) => po.id === id);
    if (index === -1) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }

    const po = MOCK_PURCHASE_ORDERS[index];

    // Check if order can be deleted
    if (po.status !== 'draft') {
      throw new Error('Only draft orders can be deleted');
    }

    MOCK_PURCHASE_ORDERS.splice(index, 1);
    return true;
  },

  /**
   * Update purchase order status
   */
  async updateStatus(id, status, additionalData = {}) {
    await delay(400);

    const po = MOCK_PURCHASE_ORDERS.find((p) => p.id === id);
    if (!po) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }

    // Validate status transition
    if (!Object.values(PURCHASE_STATUS).includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    po.status = status;
    po.updatedAt = new Date().toISOString();

    // Handle additional data
    if (additionalData.approvedBy) {
      po.approvedBy = additionalData.approvedBy;
    }

    return { ...po };
  },

  /**
   * Receive goods for a purchase order
   */
  async receiveGoods(id, receiptData) {
    await delay(600);

    const po = MOCK_PURCHASE_ORDERS.find((p) => p.id === id);
    if (!po) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }

    // Create goods receipt
    const receipt = {
      id: generateId(),
      purchaseOrderId: id,
      receiptNumber: generateReceiptNumber(),
      receivedDate: new Date().toISOString(),
      ...receiptData
    };

    // Determine receipt status
    const allReceived = receipt.items.every((item) => {
      const orderItem = po.items.find((oi) => oi.id === item.purchaseItemId);
      return (
        orderItem &&
        orderItem.receivedQuantity + item.quantityAccepted >= orderItem.quantity
      );
    });
    receipt.status = allReceived ? 'complete' : 'partial';

    // Add receipt to PO
    po.receipts = po.receipts || [];
    po.receipts.push(receipt);

    // Update received quantities
    receipt.items.forEach((receiptItem) => {
      const orderItem = po.items.find((oi) => oi.id === receiptItem.purchaseItemId);
      if (orderItem) {
        orderItem.receivedQuantity += receiptItem.quantityAccepted;
        if (receiptItem.batchNumber) {
          orderItem.batchNumber = receiptItem.batchNumber;
        }
      }
    });

    // Update PO status
    const allItemsReceived = po.items.every(
      (item) => item.receivedQuantity >= item.quantity
    );
    const someItemsReceived = po.items.some((item) => item.receivedQuantity > 0);

    if (allItemsReceived) {
      po.status = 'received';
      po.actualDeliveryDate = receipt.receivedDate;
    } else if (someItemsReceived) {
      po.status = 'partial';
    }

    po.updatedAt = new Date().toISOString();

    return { ...receipt };
  },

  /**
   * Create a purchase return
   */
  async createReturn(id, returnData) {
    await delay(500);

    const po = MOCK_PURCHASE_ORDERS.find((p) => p.id === id);
    if (!po) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }

    // Validation
    if (!returnData.items || returnData.items.length === 0) {
      throw new Error('At least one item is required for return');
    }
    if (!returnData.reason) {
      throw new Error('Return reason is required');
    }

    // Create return
    const returnRecord = {
      id: generateId(),
      purchaseOrderId: id,
      returnNumber: generateReturnNumber(),
      ...returnData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Calculate total return amount
    returnRecord.totalAmount = returnRecord.items.reduce(
      (sum, item) => sum + item.totalCost,
      0
    );

    // Add return to PO
    po.returns = po.returns || [];
    po.returns.push(returnRecord);
    po.updatedAt = new Date().toISOString();

    return { ...returnRecord };
  },

  /**
   * Update purchase return status
   */
  async updateReturn(poId, returnId, status, additionalData = {}) {
    await delay(400);

    const po = MOCK_PURCHASE_ORDERS.find((p) => p.id === poId);
    if (!po) {
      throw new Error(`Purchase order with ID ${poId} not found`);
    }

    const returnRecord = po.returns?.find((r) => r.id === returnId);
    if (!returnRecord) {
      throw new Error(`Return with ID ${returnId} not found`);
    }

    returnRecord.status = status;
    if (additionalData.approvedBy) {
      returnRecord.approvedBy = additionalData.approvedBy;
    }
    if (additionalData.notes) {
      returnRecord.notes = additionalData.notes;
    }

    po.updatedAt = new Date().toISOString();

    return { ...returnRecord };
  },

  /**
   * Add payment to purchase order
   */
  async addPayment(id, paymentData) {
    await delay(400);

    const po = MOCK_PURCHASE_ORDERS.find((p) => p.id === id);
    if (!po) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }

    // Validation
    if (!paymentData.amount || paymentData.amount <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }
    if (paymentData.amount > po.balanceAmount) {
      throw new Error('Payment amount exceeds balance due');
    }

    // Create payment record
    const payment = {
      id: generateId(),
      date: new Date().toISOString(),
      ...paymentData
    };

    // Update PO
    po.payments = po.payments || [];
    po.payments.push(payment);
    po.paidAmount += payment.amount;
    po.balanceAmount = po.totalAmount - po.paidAmount;

    // Update payment status
    if (po.paidAmount >= po.totalAmount) {
      po.paymentStatus = 'paid';
    } else if (po.paidAmount > 0) {
      po.paymentStatus = 'partial';
    }

    po.updatedAt = new Date().toISOString();

    return { ...payment };
  },

  /**
   * Get purchase statistics
   */
  async getStatistics(filters = {}) {
    await delay(300);

    let orders = [...MOCK_PURCHASE_ORDERS];

    // Apply filters
    if (filters.startDate) {
      orders = orders.filter(
        (po) => new Date(po.orderDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      orders = orders.filter(
        (po) => new Date(po.orderDate) <= new Date(filters.endDate)
      );
    }

    const stats = {
      totalOrders: orders.length,
      draftOrders: orders.filter((po) => po.status === 'draft').length,
      pendingOrders: orders.filter((po) => po.status === 'pending').length,
      approvedOrders: orders.filter(
        (po) => po.status === 'approved' || po.status === 'ordered'
      ).length,
      receivedOrders: orders.filter(
        (po) => po.status === 'received' || po.status === 'partial'
      ).length,
      cancelledOrders: orders.filter((po) => po.status === 'cancelled').length,
      totalValue: orders.reduce((sum, po) => sum + (po.totalAmount || 0), 0),
      paidValue: orders.reduce((sum, po) => sum + (po.paidAmount || 0), 0),
      pendingValue: orders.reduce((sum, po) => sum + (po.balanceAmount || 0), 0),
      totalReturns: orders.reduce(
        (sum, po) => sum + (po.returns?.length || 0),
        0
      ),
      returnValue: orders.reduce(
        (sum, po) =>
          sum +
          (po.returns?.reduce((rSum, r) => rSum + (r.totalAmount || 0), 0) ||
            0),
        0
      )
    };

    return stats;
  },

  /**
   * Get overdue orders
   */
  async getOverdueOrders() {
    await delay(300);

    const now = new Date();
    return MOCK_PURCHASE_ORDERS.filter((po) => {
      if (!po.expectedDeliveryDate || po.status === 'received') return false;
      return new Date(po.expectedDeliveryDate) < now;
    });
  }
};

/**
 * Calculate purchase order totals
 */
function calculateTotals(po) {
  po.subtotal = 0;
  po.taxAmount = 0;
  po.discountAmount = 0;

  po.items.forEach((item) => {
    const itemSubtotal = item.quantity * item.unitCost;
    const itemDiscount = (itemSubtotal * item.discount) / 100;
    const itemTaxable = itemSubtotal - itemDiscount;
    const itemTax = (itemTaxable * item.tax) / 100;

    item.totalCost = itemTaxable + itemTax;
    po.subtotal += itemSubtotal;
    po.discountAmount += itemDiscount;
    po.taxAmount += itemTax;
  });

  po.totalAmount =
    po.subtotal - po.discountAmount + po.taxAmount + (po.shippingCost || 0);
  po.balanceAmount = po.totalAmount - (po.paidAmount || 0);
}
