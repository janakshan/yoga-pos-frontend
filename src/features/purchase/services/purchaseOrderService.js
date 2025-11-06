import {
  MOCK_PURCHASE_ORDERS,
  generatePurchaseOrderId,
  generatePurchaseOrderNumber,
} from '../data/mockPurchaseOrders.js';
import {
  PO_STATUS,
  PAYMENT_STATUS,
  RETURN_STATUS,
  RECEIVING_STATUS,
} from '../types/purchaseOrder.types.js';

/**
 * Simulate network delay
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Purchase Order Service
 * Handles all purchase order-related API operations
 */
export const purchaseOrderService = {
  /**
   * Get list of purchase orders with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Promise<PurchaseOrder[]>}
   */
  async getList(filters = {}) {
    await delay(400);

    let result = [...MOCK_PURCHASE_ORDERS];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (po) =>
          po.orderNumber.toLowerCase().includes(searchLower) ||
          po.supplierName.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((po) => po.status === filters.status);
    }

    // Apply supplier filter
    if (filters.supplierId) {
      result = result.filter((po) => po.supplierId === filters.supplierId);
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

    // Apply payment status filter
    if (filters.paymentStatus) {
      result = result.filter((po) => po.paymentStatus === filters.paymentStatus);
    }

    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        let aVal = a[filters.sortBy];
        let bVal = b[filters.sortBy];

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (filters.sortOrder === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
    }

    return result;
  },

  /**
   * Get purchase order by ID
   * @param {string} id - Purchase order ID
   * @returns {Promise<PurchaseOrder>}
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
   * @param {Object} data - Purchase order data
   * @returns {Promise<PurchaseOrder>}
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

    const newPO = {
      id: generatePurchaseOrderId(),
      orderNumber: generatePurchaseOrderNumber(),
      supplierId: data.supplierId,
      supplierName: data.supplierName,
      orderDate: data.orderDate || new Date(),
      expectedDeliveryDate: data.expectedDeliveryDate || null,
      actualDeliveryDate: null,
      status: data.status || PO_STATUS.DRAFT,
      branchId: data.branchId,
      branchName: data.branchName,
      items: data.items,
      subtotal: data.subtotal,
      totalDiscount: data.totalDiscount || 0,
      totalTax: data.totalTax || 0,
      shippingCost: data.shippingCost || 0,
      otherCharges: data.otherCharges || 0,
      totalAmount: data.totalAmount,
      paymentTerms: data.paymentTerms || '',
      paymentStatus: PAYMENT_STATUS.UNPAID,
      paidAmount: 0,
      notes: data.notes || '',
      internalNotes: data.internalNotes || '',
      receivings: [],
      returns: [],
      attachments: data.attachments || [],
      createdBy: 'current-user',
      approvedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    MOCK_PURCHASE_ORDERS.push(newPO);
    return { ...newPO };
  },

  /**
   * Update purchase order
   * @param {string} id - Purchase order ID
   * @param {Object} data - Updated data
   * @returns {Promise<PurchaseOrder>}
   */
  async update(id, data) {
    await delay(500);

    const index = MOCK_PURCHASE_ORDERS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }

    // Validation
    if (data.items !== undefined && data.items.length === 0) {
      throw new Error('At least one item is required');
    }

    const updatedPO = {
      ...MOCK_PURCHASE_ORDERS[index],
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    MOCK_PURCHASE_ORDERS[index] = updatedPO;
    return { ...updatedPO };
  },

  /**
   * Delete purchase order
   * @param {string} id - Purchase order ID
   * @returns {Promise<void>}
   */
  async remove(id) {
    await delay(400);

    const index = MOCK_PURCHASE_ORDERS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }

    const po = MOCK_PURCHASE_ORDERS[index];

    // Only allow deletion of draft or cancelled orders
    if (po.status !== PO_STATUS.DRAFT && po.status !== PO_STATUS.CANCELLED) {
      throw new Error(
        'Only draft or cancelled purchase orders can be deleted'
      );
    }

    MOCK_PURCHASE_ORDERS.splice(index, 1);
  },

  /**
   * Update purchase order status
   * @param {string} id - Purchase order ID
   * @param {string} status - New status
   * @returns {Promise<PurchaseOrder>}
   */
  async updateStatus(id, status) {
    await delay(300);

    const index = MOCK_PURCHASE_ORDERS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }

    const updates = {
      status,
      updatedAt: new Date(),
    };

    // If approving, set approvedBy
    if (status === PO_STATUS.APPROVED) {
      updates.approvedBy = 'current-user';
    }

    MOCK_PURCHASE_ORDERS[index] = {
      ...MOCK_PURCHASE_ORDERS[index],
      ...updates,
    };

    return { ...MOCK_PURCHASE_ORDERS[index] };
  },

  /**
   * Receive goods for a purchase order
   * @param {string} id - Purchase order ID
   * @param {Object} receivingData - Receiving data
   * @returns {Promise<PurchaseOrder>}
   */
  async receiveGoods(id, receivingData) {
    await delay(500);

    const index = MOCK_PURCHASE_ORDERS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }

    const po = MOCK_PURCHASE_ORDERS[index];

    // Validate receiving
    if (!receivingData.items || receivingData.items.length === 0) {
      throw new Error('Receiving items are required');
    }

    // Create goods receiving note
    const grn = {
      id: `GRN-${String(po.receivings.length + 1).padStart(3, '0')}`,
      receivingNumber: `GRN-${new Date().getFullYear()}-${String(
        po.receivings.length + 1
      ).padStart(3, '0')}`,
      receivedDate: receivingData.receivedDate || new Date(),
      receivedBy: 'current-user',
      items: receivingData.items,
      notes: receivingData.notes || '',
      status: receivingData.status || RECEIVING_STATUS.COMPLETE,
      attachments: receivingData.attachments || [],
    };

    // Update PO items received quantities
    const updatedItems = po.items.map((item) => {
      const receivedItem = receivingData.items.find((ri) => ri.id === item.id);
      if (receivedItem) {
        return {
          ...item,
          receivedQuantity:
            item.receivedQuantity + receivedItem.receivedQuantity,
          pendingQuantity:
            item.orderedQuantity -
            (item.receivedQuantity + receivedItem.receivedQuantity),
        };
      }
      return item;
    });

    // Determine new PO status
    const allReceived = updatedItems.every(
      (item) => item.receivedQuantity >= item.orderedQuantity
    );
    const someReceived = updatedItems.some((item) => item.receivedQuantity > 0);

    let newStatus = po.status;
    if (allReceived) {
      newStatus = PO_STATUS.RECEIVED;
    } else if (someReceived) {
      newStatus = PO_STATUS.PARTIAL;
    }

    // Update PO
    MOCK_PURCHASE_ORDERS[index] = {
      ...po,
      items: updatedItems,
      status: newStatus,
      actualDeliveryDate: allReceived
        ? receivingData.receivedDate || new Date()
        : po.actualDeliveryDate,
      receivings: [...po.receivings, grn],
      updatedAt: new Date(),
    };

    // Here you would also update inventory
    // This will be handled in the hook layer by calling inventory service

    return { ...MOCK_PURCHASE_ORDERS[index] };
  },

  /**
   * Create purchase return
   * @param {string} id - Purchase order ID
   * @param {Object} returnData - Return data
   * @returns {Promise<PurchaseOrder>}
   */
  async createReturn(id, returnData) {
    await delay(500);

    const index = MOCK_PURCHASE_ORDERS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }

    const po = MOCK_PURCHASE_ORDERS[index];

    // Validate return
    if (!returnData.items || returnData.items.length === 0) {
      throw new Error('Return items are required');
    }
    if (!returnData.reason) {
      throw new Error('Return reason is required');
    }

    // Create purchase return
    const returnRecord = {
      id: `PR-${String(po.returns.length + 1).padStart(3, '0')}`,
      returnNumber: `PR-${new Date().getFullYear()}-${String(
        po.returns.length + 1
      ).padStart(3, '0')}`,
      returnDate: returnData.returnDate || new Date(),
      reason: returnData.reason,
      items: returnData.items,
      returnAmount: returnData.returnAmount,
      status: RETURN_STATUS.PENDING,
      notes: returnData.notes || '',
      processedBy: null,
    };

    // Update PO
    MOCK_PURCHASE_ORDERS[index] = {
      ...po,
      returns: [...po.returns, returnRecord],
      updatedAt: new Date(),
    };

    return { ...MOCK_PURCHASE_ORDERS[index] };
  },

  /**
   * Update return status
   * @param {string} poId - Purchase order ID
   * @param {string} returnId - Return ID
   * @param {string} status - New status
   * @returns {Promise<PurchaseOrder>}
   */
  async updateReturnStatus(poId, returnId, status) {
    await delay(300);

    const index = MOCK_PURCHASE_ORDERS.findIndex((p) => p.id === poId);
    if (index === -1) {
      throw new Error(`Purchase order with ID ${poId} not found`);
    }

    const po = MOCK_PURCHASE_ORDERS[index];
    const returnIndex = po.returns.findIndex((r) => r.id === returnId);
    if (returnIndex === -1) {
      throw new Error(`Return with ID ${returnId} not found`);
    }

    po.returns[returnIndex] = {
      ...po.returns[returnIndex],
      status,
      processedBy: 'current-user',
    };

    MOCK_PURCHASE_ORDERS[index] = {
      ...po,
      updatedAt: new Date(),
    };

    return { ...MOCK_PURCHASE_ORDERS[index] };
  },

  /**
   * Update payment status
   * @param {string} id - Purchase order ID
   * @param {number} paidAmount - Amount paid
   * @returns {Promise<PurchaseOrder>}
   */
  async updatePayment(id, paidAmount) {
    await delay(300);

    const index = MOCK_PURCHASE_ORDERS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Purchase order with ID ${id} not found`);
    }

    const po = MOCK_PURCHASE_ORDERS[index];
    const newPaidAmount = po.paidAmount + paidAmount;

    let paymentStatus = PAYMENT_STATUS.UNPAID;
    if (newPaidAmount >= po.totalAmount) {
      paymentStatus = PAYMENT_STATUS.PAID;
    } else if (newPaidAmount > 0) {
      paymentStatus = PAYMENT_STATUS.PARTIAL;
    }

    MOCK_PURCHASE_ORDERS[index] = {
      ...po,
      paidAmount: newPaidAmount,
      paymentStatus,
      updatedAt: new Date(),
    };

    return { ...MOCK_PURCHASE_ORDERS[index] };
  },

  /**
   * Get purchase order statistics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>}
   */
  async getStats(filters = {}) {
    await delay(300);

    let orders = [...MOCK_PURCHASE_ORDERS];

    // Apply date range filter
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

    const totalOrders = orders.length;
    const totalAmount = orders.reduce((sum, po) => sum + po.totalAmount, 0);
    const totalPaid = orders.reduce((sum, po) => sum + po.paidAmount, 0);

    const statusCounts = orders.reduce((acc, po) => {
      acc[po.status] = (acc[po.status] || 0) + 1;
      return acc;
    }, {});

    const paymentStatusCounts = orders.reduce((acc, po) => {
      acc[po.paymentStatus] = (acc[po.paymentStatus] || 0) + 1;
      return acc;
    }, {});

    const avgOrderValue = totalOrders > 0 ? totalAmount / totalOrders : 0;

    return {
      totalOrders,
      totalAmount,
      totalPaid,
      totalPending: totalAmount - totalPaid,
      statusCounts,
      paymentStatusCounts,
      avgOrderValue,
    };
  },

  /**
   * Get purchase analytics
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Object>}
   */
  async getAnalytics(filters = {}) {
    await delay(400);

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
    if (filters.supplierId) {
      orders = orders.filter((po) => po.supplierId === filters.supplierId);
    }

    // Calculate metrics
    const totalSpent = orders.reduce((sum, po) => sum + po.totalAmount, 0);
    const totalOrders = orders.length;

    // Group by supplier
    const bySupplier = orders.reduce((acc, po) => {
      if (!acc[po.supplierId]) {
        acc[po.supplierId] = {
          supplierId: po.supplierId,
          supplierName: po.supplierName,
          orderCount: 0,
          totalAmount: 0,
        };
      }
      acc[po.supplierId].orderCount += 1;
      acc[po.supplierId].totalAmount += po.totalAmount;
      return acc;
    }, {});

    // Group by month
    const byMonth = orders.reduce((acc, po) => {
      const month = new Date(po.orderDate).toISOString().slice(0, 7);
      if (!acc[month]) {
        acc[month] = {
          month,
          orderCount: 0,
          totalAmount: 0,
        };
      }
      acc[month].orderCount += 1;
      acc[month].totalAmount += po.totalAmount;
      return acc;
    }, {});

    // Top products
    const productMap = {};
    orders.forEach((po) => {
      po.items.forEach((item) => {
        if (!productMap[item.productId]) {
          productMap[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            sku: item.sku,
            totalQuantity: 0,
            totalAmount: 0,
          };
        }
        productMap[item.productId].totalQuantity += item.orderedQuantity;
        productMap[item.productId].totalAmount += item.totalAmount;
      });
    });

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 10);

    return {
      totalSpent,
      totalOrders,
      bySupplier: Object.values(bySupplier),
      byMonth: Object.values(byMonth).sort((a, b) =>
        a.month.localeCompare(b.month)
      ),
      topProducts,
    };
  },
};
