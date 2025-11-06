/**
 * Purchase Order Management Zustand Slice
 * Manages purchase orders, receipts, and returns with Immer for immutable updates
 */

export const createPurchaseSlice = (set, get) => ({
  // ==================== STATE ====================
  purchaseOrders: [],
  selectedPurchaseOrder: null,
  purchaseLoading: false,
  purchaseError: null,
  purchaseStats: {
    totalOrders: 0,
    draftOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    receivedOrders: 0,
    totalValue: 0,
    paidValue: 0,
    pendingValue: 0,
    totalReturns: 0,
    returnValue: 0
  },

  // ==================== MUTATIONS ====================

  /**
   * Set all purchase orders
   */
  setPurchaseOrders: (orders) =>
    set((state) => {
      state.purchaseOrders = orders;
      state.purchaseStats = calculatePurchaseStats(orders);
    }),

  /**
   * Add a new purchase order
   */
  addPurchaseOrder: (order) =>
    set((state) => {
      state.purchaseOrders.push(order);
      state.purchaseStats = calculatePurchaseStats(state.purchaseOrders);
    }),

  /**
   * Update an existing purchase order
   */
  updatePurchaseOrder: (id, updates) =>
    set((state) => {
      const index = state.purchaseOrders.findIndex((po) => po.id === id);
      if (index !== -1) {
        state.purchaseOrders[index] = {
          ...state.purchaseOrders[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        state.purchaseStats = calculatePurchaseStats(state.purchaseOrders);
      }
    }),

  /**
   * Delete a purchase order
   */
  deletePurchaseOrder: (id) =>
    set((state) => {
      state.purchaseOrders = state.purchaseOrders.filter((po) => po.id !== id);
      state.purchaseStats = calculatePurchaseStats(state.purchaseOrders);
      if (state.selectedPurchaseOrder?.id === id) {
        state.selectedPurchaseOrder = null;
      }
    }),

  /**
   * Set selected purchase order
   */
  setSelectedPurchaseOrder: (order) =>
    set((state) => {
      state.selectedPurchaseOrder = order;
    }),

  /**
   * Update purchase order status
   */
  updatePurchaseOrderStatus: (id, status) =>
    set((state) => {
      const order = state.purchaseOrders.find((po) => po.id === id);
      if (order) {
        order.status = status;
        order.updatedAt = new Date().toISOString();
        state.purchaseStats = calculatePurchaseStats(state.purchaseOrders);
      }
    }),

  /**
   * Add line item to purchase order
   */
  addPurchaseOrderItem: (orderId, item) =>
    set((state) => {
      const order = state.purchaseOrders.find((po) => po.id === orderId);
      if (order) {
        order.items.push(item);
        recalculatePurchaseOrderTotals(order);
        state.purchaseStats = calculatePurchaseStats(state.purchaseOrders);
      }
    }),

  /**
   * Update line item in purchase order
   */
  updatePurchaseOrderItem: (orderId, itemId, updates) =>
    set((state) => {
      const order = state.purchaseOrders.find((po) => po.id === orderId);
      if (order) {
        const itemIndex = order.items.findIndex((item) => item.id === itemId);
        if (itemIndex !== -1) {
          order.items[itemIndex] = { ...order.items[itemIndex], ...updates };
          recalculatePurchaseOrderTotals(order);
          state.purchaseStats = calculatePurchaseStats(state.purchaseOrders);
        }
      }
    }),

  /**
   * Remove line item from purchase order
   */
  removePurchaseOrderItem: (orderId, itemId) =>
    set((state) => {
      const order = state.purchaseOrders.find((po) => po.id === orderId);
      if (order) {
        order.items = order.items.filter((item) => item.id !== itemId);
        recalculatePurchaseOrderTotals(order);
        state.purchaseStats = calculatePurchaseStats(state.purchaseOrders);
      }
    }),

  /**
   * Add goods receipt to purchase order
   */
  addGoodsReceipt: (orderId, receipt) =>
    set((state) => {
      const order = state.purchaseOrders.find((po) => po.id === orderId);
      if (order) {
        order.receipts = order.receipts || [];
        order.receipts.push(receipt);

        // Update received quantities
        receipt.items.forEach((receiptItem) => {
          const orderItem = order.items.find(
            (item) => item.id === receiptItem.purchaseItemId
          );
          if (orderItem) {
            orderItem.receivedQuantity += receiptItem.quantityAccepted;
          }
        });

        // Update order status
        const allReceived = order.items.every(
          (item) => item.receivedQuantity >= item.quantity
        );
        const someReceived = order.items.some(
          (item) => item.receivedQuantity > 0
        );

        if (allReceived) {
          order.status = 'received';
          order.actualDeliveryDate = receipt.receivedDate;
        } else if (someReceived) {
          order.status = 'partial';
        }

        order.updatedAt = new Date().toISOString();
        state.purchaseStats = calculatePurchaseStats(state.purchaseOrders);
      }
    }),

  /**
   * Add purchase return
   */
  addPurchaseReturn: (orderId, returnData) =>
    set((state) => {
      const order = state.purchaseOrders.find((po) => po.id === orderId);
      if (order) {
        order.returns = order.returns || [];
        order.returns.push(returnData);
        order.updatedAt = new Date().toISOString();
        state.purchaseStats = calculatePurchaseStats(state.purchaseOrders);
      }
    }),

  /**
   * Update purchase return status
   */
  updatePurchaseReturn: (orderId, returnId, updates) =>
    set((state) => {
      const order = state.purchaseOrders.find((po) => po.id === orderId);
      if (order && order.returns) {
        const returnIndex = order.returns.findIndex((r) => r.id === returnId);
        if (returnIndex !== -1) {
          order.returns[returnIndex] = {
            ...order.returns[returnIndex],
            ...updates
          };
          order.updatedAt = new Date().toISOString();
        }
      }
    }),

  /**
   * Add payment to purchase order
   */
  addPurchasePayment: (orderId, payment) =>
    set((state) => {
      const order = state.purchaseOrders.find((po) => po.id === orderId);
      if (order) {
        order.payments = order.payments || [];
        order.payments.push(payment);
        order.paidAmount += payment.amount;
        order.balanceAmount = order.totalAmount - order.paidAmount;

        // Update payment status
        if (order.paidAmount >= order.totalAmount) {
          order.paymentStatus = 'paid';
        } else if (order.paidAmount > 0) {
          order.paymentStatus = 'partial';
        } else {
          order.paymentStatus = 'unpaid';
        }

        order.updatedAt = new Date().toISOString();
        state.purchaseStats = calculatePurchaseStats(state.purchaseOrders);
      }
    }),

  /**
   * Set purchase loading state
   */
  setPurchaseLoading: (loading) =>
    set((state) => {
      state.purchaseLoading = loading;
    }),

  /**
   * Set purchase error
   */
  setPurchaseError: (error) =>
    set((state) => {
      state.purchaseError = error;
    }),

  /**
   * Clear purchase error
   */
  clearPurchaseError: () =>
    set((state) => {
      state.purchaseError = null;
    }),

  // ==================== GETTERS ====================

  /**
   * Get purchase order by ID
   */
  getPurchaseOrderById: (id) => {
    const state = get();
    return state.purchaseOrders.find((po) => po.id === id);
  },

  /**
   * Get purchase orders by supplier
   */
  getPurchaseOrdersBySupplier: (supplierId) => {
    const state = get();
    return state.purchaseOrders.filter((po) => po.supplierId === supplierId);
  },

  /**
   * Get purchase orders by status
   */
  getPurchaseOrdersByStatus: (status) => {
    const state = get();
    return state.purchaseOrders.filter((po) => po.status === status);
  },

  /**
   * Get pending purchase orders
   */
  getPendingPurchaseOrders: () => {
    const state = get();
    return state.purchaseOrders.filter(
      (po) => po.status === 'pending' || po.status === 'approved'
    );
  },

  /**
   * Get overdue purchase orders
   */
  getOverduePurchaseOrders: () => {
    const state = get();
    const now = new Date();
    return state.purchaseOrders.filter((po) => {
      if (!po.expectedDeliveryDate || po.status === 'received') return false;
      return new Date(po.expectedDeliveryDate) < now;
    });
  },

  /**
   * Get purchase orders with outstanding payments
   */
  getOutstandingPayments: () => {
    const state = get();
    return state.purchaseOrders.filter(
      (po) =>
        po.paymentStatus !== 'paid' &&
        (po.status === 'received' || po.status === 'partial')
    );
  },

  /**
   * Search purchase orders
   */
  searchPurchaseOrders: (searchTerm) => {
    const state = get();
    const term = searchTerm.toLowerCase();
    return state.purchaseOrders.filter(
      (po) =>
        po.orderNumber.toLowerCase().includes(term) ||
        po.supplierName.toLowerCase().includes(term) ||
        po.notes?.toLowerCase().includes(term)
    );
  }
});

/**
 * Recalculate purchase order totals
 */
function recalculatePurchaseOrderTotals(order) {
  order.subtotal = 0;
  order.taxAmount = 0;
  order.discountAmount = 0;

  order.items.forEach((item) => {
    const itemSubtotal = item.quantity * item.unitCost;
    const itemDiscount = (itemSubtotal * item.discount) / 100;
    const itemTaxable = itemSubtotal - itemDiscount;
    const itemTax = (itemTaxable * item.tax) / 100;

    item.totalCost = itemTaxable + itemTax;
    order.subtotal += itemSubtotal;
    order.discountAmount += itemDiscount;
    order.taxAmount += itemTax;
  });

  order.totalAmount =
    order.subtotal - order.discountAmount + order.taxAmount + order.shippingCost;
  order.balanceAmount = order.totalAmount - order.paidAmount;
}

/**
 * Calculate purchase order statistics
 */
function calculatePurchaseStats(orders) {
  const stats = {
    totalOrders: orders.length,
    draftOrders: 0,
    pendingOrders: 0,
    approvedOrders: 0,
    receivedOrders: 0,
    totalValue: 0,
    paidValue: 0,
    pendingValue: 0,
    totalReturns: 0,
    returnValue: 0
  };

  orders.forEach((order) => {
    // Count by status
    switch (order.status) {
      case 'draft':
        stats.draftOrders++;
        break;
      case 'pending':
        stats.pendingOrders++;
        break;
      case 'approved':
      case 'ordered':
        stats.approvedOrders++;
        break;
      case 'received':
      case 'partial':
        stats.receivedOrders++;
        break;
    }

    // Sum values
    stats.totalValue += order.totalAmount || 0;
    stats.paidValue += order.paidAmount || 0;
    stats.pendingValue += order.balanceAmount || 0;

    // Count returns
    if (order.returns && order.returns.length > 0) {
      stats.totalReturns += order.returns.length;
      order.returns.forEach((ret) => {
        stats.returnValue += ret.totalAmount || 0;
      });
    }
  });

  return stats;
}
