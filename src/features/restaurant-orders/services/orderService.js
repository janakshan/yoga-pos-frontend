import {
  ORDER_STATUS,
  SERVICE_TYPE,
  ITEM_STATUS,
  KITCHEN_STATION
} from '../types/order.types';
import {
  validateOrder,
  calculateOrderTotals,
  formatOrderNumber,
  isValidStatusTransition
} from '../utils/orderWorkflow';

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
const generateId = () => `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Generate item ID
 * @returns {string}
 */
const generateItemId = () => `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Order counter for generating order numbers
 */
let orderCounter = 1;

/**
 * Mock order data
 */
let MOCK_ORDERS = [
  {
    id: 'order_001',
    orderNumber: 'ORD-000001',
    status: ORDER_STATUS.PREPARING,
    serviceType: SERVICE_TYPE.DINE_IN,
    tableId: 'table_005',
    tableName: 'Table 5',
    customerId: null,
    customer: {
      name: 'John Smith',
      phone: '+1234567890',
      email: null
    },
    items: [
      {
        id: 'item_001',
        productId: 'prod_menu_001',
        name: 'Caesar Salad',
        quantity: 2,
        price: 12.99,
        total: 25.98,
        modifiers: [],
        notes: 'No croutons',
        status: ITEM_STATUS.PREPARING,
        stationId: 'station_cold',
        stationName: 'Cold Kitchen'
      },
      {
        id: 'item_002',
        productId: 'prod_menu_002',
        name: 'Grilled Salmon',
        quantity: 1,
        price: 24.99,
        total: 24.99,
        modifiers: [
          {
            id: 'mod_001',
            name: 'Extra Lemon',
            price: 0.50,
            groupName: 'Add-ons'
          }
        ],
        notes: null,
        status: ITEM_STATUS.PREPARING,
        stationId: 'station_grill',
        stationName: 'Grill'
      }
    ],
    subtotal: 50.97,
    tax: 5.10,
    discount: 0,
    tip: 0,
    total: 56.07,
    assignedServerId: 'user_003',
    assignedServerName: 'Sarah Johnson',
    stationRoutes: ['station_cold', 'station_grill'],
    statusHistory: [
      {
        status: ORDER_STATUS.PENDING,
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        userId: 'user_003',
        userName: 'Sarah Johnson',
        notes: 'Order created'
      },
      {
        status: ORDER_STATUS.CONFIRMED,
        timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
        userId: 'user_001',
        userName: 'Admin User',
        notes: 'Order confirmed'
      },
      {
        status: ORDER_STATUS.PREPARING,
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        userId: 'user_004',
        userName: 'Chef Mike',
        notes: 'Started preparation'
      }
    ],
    notes: 'Customer prefers well-done salmon',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    completedAt: null,
    branchId: 'branch_001',
    createdBy: 'user_003',
    payment: null
  },
  {
    id: 'order_002',
    orderNumber: 'ORD-000002',
    status: ORDER_STATUS.READY,
    serviceType: SERVICE_TYPE.TAKEAWAY,
    tableId: null,
    tableName: null,
    customerId: 'customer_001',
    customer: {
      name: 'Emily Davis',
      phone: '+1234567891',
      email: 'emily@example.com'
    },
    items: [
      {
        id: 'item_003',
        productId: 'prod_menu_003',
        name: 'Margherita Pizza',
        quantity: 1,
        price: 15.99,
        total: 15.99,
        modifiers: [
          {
            id: 'mod_002',
            name: 'Extra Cheese',
            price: 2.00,
            groupName: 'Toppings'
          }
        ],
        notes: null,
        status: ITEM_STATUS.READY,
        stationId: 'station_hot',
        stationName: 'Hot Kitchen'
      }
    ],
    subtotal: 17.99,
    tax: 1.80,
    discount: 0,
    tip: 2.00,
    total: 21.79,
    assignedServerId: 'user_005',
    assignedServerName: 'Tom Wilson',
    stationRoutes: ['station_hot'],
    statusHistory: [
      {
        status: ORDER_STATUS.PENDING,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        userId: 'user_005',
        userName: 'Tom Wilson',
        notes: 'Takeaway order'
      },
      {
        status: ORDER_STATUS.CONFIRMED,
        timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
        userId: 'user_001',
        userName: 'Admin User',
        notes: null
      },
      {
        status: ORDER_STATUS.PREPARING,
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        userId: 'user_004',
        userName: 'Chef Mike',
        notes: null
      },
      {
        status: ORDER_STATUS.READY,
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        userId: 'user_004',
        userName: 'Chef Mike',
        notes: 'Ready for pickup'
      }
    ],
    notes: null,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    completedAt: null,
    branchId: 'branch_001',
    createdBy: 'user_005',
    payment: {
      method: 'card',
      status: 'pending',
      transactionId: null,
      paidAt: null
    }
  }
];

// Sync order counter
orderCounter = MOCK_ORDERS.length + 1;

/**
 * Restaurant Order Service
 * Provides methods for managing restaurant orders
 */
export const orderService = {
  /**
   * Get list of orders with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>}
   */
  async getList(filters = {}) {
    await delay(400);

    let orders = [...MOCK_ORDERS];

    // Apply filters
    if (filters.status) {
      orders = orders.filter((order) => order.status === filters.status);
    }

    if (filters.serviceType) {
      orders = orders.filter((order) => order.serviceType === filters.serviceType);
    }

    if (filters.tableId) {
      orders = orders.filter((order) => order.tableId === filters.tableId);
    }

    if (filters.assignedServerId) {
      orders = orders.filter((order) => order.assignedServerId === filters.assignedServerId);
    }

    if (filters.startDate) {
      orders = orders.filter(
        (order) => new Date(order.createdAt) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      orders = orders.filter((order) => new Date(order.createdAt) <= new Date(filters.endDate));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      orders = orders.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.customer?.name?.toLowerCase().includes(searchLower) ||
          order.tableName?.toLowerCase().includes(searchLower)
      );
    }

    // Sort by creation date (newest first)
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return orders;
  },

  /**
   * Get active orders (not completed, cancelled, or refunded)
   * @returns {Promise<Array>}
   */
  async getActiveOrders() {
    await delay(300);

    return MOCK_ORDERS.filter(
      (order) =>
        ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].includes(
          order.status
        )
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * Get order by ID
   * @param {string} id - Order ID
   * @returns {Promise<Object>}
   */
  async getById(id) {
    await delay(300);

    const order = MOCK_ORDERS.find((o) => o.id === id);

    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }

    return order;
  },

  /**
   * Get order by order number
   * @param {string} orderNumber - Order number
   * @returns {Promise<Object>}
   */
  async getByOrderNumber(orderNumber) {
    await delay(300);

    const order = MOCK_ORDERS.find((o) => o.orderNumber === orderNumber);

    if (!order) {
      throw new Error(`Order ${orderNumber} not found`);
    }

    return order;
  },

  /**
   * Create a new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>}
   */
  async create(orderData) {
    await delay(500);

    // Validate order data
    const validation = validateOrder(orderData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Calculate totals
    const totals = calculateOrderTotals(
      orderData.items,
      orderData.taxRate || 0.1,
      orderData.discount || 0,
      orderData.tip || 0
    );

    const newOrder = {
      id: generateId(),
      orderNumber: formatOrderNumber(orderCounter++),
      status: orderData.status || ORDER_STATUS.PENDING,
      serviceType: orderData.serviceType,
      tableId: orderData.tableId || null,
      tableName: orderData.tableName || null,
      customerId: orderData.customerId || null,
      customer: orderData.customer || null,
      items: orderData.items.map((item) => ({
        ...item,
        id: item.id || generateItemId(),
        status: item.status || ITEM_STATUS.PENDING
      })),
      ...totals,
      assignedServerId: orderData.assignedServerId || null,
      assignedServerName: orderData.assignedServerName || null,
      stationRoutes: orderData.stationRoutes || [],
      statusHistory: [
        {
          status: orderData.status || ORDER_STATUS.PENDING,
          timestamp: new Date().toISOString(),
          userId: orderData.createdBy,
          userName: orderData.createdByName || 'Unknown',
          notes: 'Order created'
        }
      ],
      notes: orderData.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      branchId: orderData.branchId,
      createdBy: orderData.createdBy,
      payment: orderData.payment || null
    };

    MOCK_ORDERS.unshift(newOrder);

    return newOrder;
  },

  /**
   * Update an existing order
   * @param {string} id - Order ID
   * @param {Object} updates - Order updates
   * @returns {Promise<Object>}
   */
  async update(id, updates) {
    await delay(400);

    const orderIndex = MOCK_ORDERS.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      throw new Error(`Order with ID ${id} not found`);
    }

    const order = MOCK_ORDERS[orderIndex];

    // Recalculate totals if items changed
    if (updates.items) {
      const totals = calculateOrderTotals(
        updates.items,
        updates.taxRate || order.taxRate || 0.1,
        updates.discount !== undefined ? updates.discount : order.discount,
        updates.tip !== undefined ? updates.tip : order.tip
      );
      updates = { ...updates, ...totals };
    }

    const updatedOrder = {
      ...order,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    MOCK_ORDERS[orderIndex] = updatedOrder;

    return updatedOrder;
  },

  /**
   * Update order status
   * @param {string} id - Order ID
   * @param {string} newStatus - New status
   * @param {string} userId - User making the change
   * @param {string} userName - Name of user making the change
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>}
   */
  async updateStatus(id, newStatus, userId, userName, notes = null) {
    await delay(400);

    const order = await this.getById(id);

    // Validate status transition
    if (!isValidStatusTransition(order.status, newStatus)) {
      throw new Error(
        `Invalid status transition from ${order.status} to ${newStatus}`
      );
    }

    const statusHistory = [
      ...order.statusHistory,
      {
        status: newStatus,
        timestamp: new Date().toISOString(),
        userId,
        userName,
        notes
      }
    ];

    const updates = {
      status: newStatus,
      statusHistory,
      ...(newStatus === ORDER_STATUS.COMPLETED && {
        completedAt: new Date().toISOString()
      })
    };

    return this.update(id, updates);
  },

  /**
   * Add item to order
   * @param {string} id - Order ID
   * @param {Object} item - Item to add
   * @returns {Promise<Object>}
   */
  async addItem(id, item) {
    await delay(300);

    const order = await this.getById(id);

    const newItem = {
      ...item,
      id: generateItemId(),
      status: item.status || ITEM_STATUS.PENDING
    };

    const items = [...order.items, newItem];

    return this.update(id, { items });
  },

  /**
   * Update order item
   * @param {string} orderId - Order ID
   * @param {string} itemId - Item ID
   * @param {Object} updates - Item updates
   * @returns {Promise<Object>}
   */
  async updateItem(orderId, itemId, updates) {
    await delay(300);

    const order = await this.getById(orderId);

    const items = order.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    return this.update(orderId, { items });
  },

  /**
   * Remove item from order
   * @param {string} orderId - Order ID
   * @param {string} itemId - Item ID
   * @returns {Promise<Object>}
   */
  async removeItem(orderId, itemId) {
    await delay(300);

    const order = await this.getById(orderId);

    const items = order.items.filter((item) => item.id !== itemId);

    if (items.length === 0) {
      throw new Error('Cannot remove last item from order');
    }

    return this.update(orderId, { items });
  },

  /**
   * Cancel an order
   * @param {string} id - Order ID
   * @param {string} userId - User cancelling the order
   * @param {string} userName - Name of user cancelling
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>}
   */
  async cancel(id, userId, userName, reason) {
    return this.updateStatus(id, ORDER_STATUS.CANCELLED, userId, userName, reason);
  },

  /**
   * Complete an order
   * @param {string} id - Order ID
   * @param {string} userId - User completing the order
   * @param {string} userName - Name of user completing
   * @returns {Promise<Object>}
   */
  async complete(id, userId, userName) {
    return this.updateStatus(id, ORDER_STATUS.COMPLETED, userId, userName, 'Order completed');
  },

  /**
   * Process payment for an order
   * @param {string} id - Order ID
   * @param {Object} paymentInfo - Payment information
   * @returns {Promise<Object>}
   */
  async processPayment(id, paymentInfo) {
    await delay(500);

    const payment = {
      method: paymentInfo.method,
      status: 'paid',
      transactionId: `txn_${Date.now()}`,
      paidAt: new Date().toISOString()
    };

    return this.update(id, { payment });
  },

  /**
   * Get order statistics
   * @param {Object} filters - Optional filters (date range, branch, etc.)
   * @returns {Promise<Object>}
   */
  async getStats(filters = {}) {
    await delay(300);

    const orders = await this.getList(filters);

    const totalOrders = orders.length;
    const activeOrders = orders.filter(
      (o) =>
        ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED, ORDER_STATUS.REFUNDED].includes(
          o.status
        )
    ).length;

    const completedOrders = orders.filter((o) => o.status === ORDER_STATUS.COMPLETED);
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;

    const statusBreakdown = {};
    Object.values(ORDER_STATUS).forEach((status) => {
      statusBreakdown[status] = orders.filter((o) => o.status === status).length;
    });

    const serviceTypeBreakdown = {};
    Object.values(SERVICE_TYPE).forEach((type) => {
      serviceTypeBreakdown[type] = orders.filter((o) => o.serviceType === type).length;
    });

    return {
      totalOrders,
      activeOrders,
      completedOrders: completedOrders.length,
      cancelledOrders: statusBreakdown[ORDER_STATUS.CANCELLED] || 0,
      totalRevenue,
      averageOrderValue,
      statusBreakdown,
      serviceTypeBreakdown
    };
  },

  /**
   * Delete an order (admin only)
   * @param {string} id - Order ID
   * @returns {Promise<void>}
   */
  async remove(id) {
    await delay(300);

    const orderIndex = MOCK_ORDERS.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      throw new Error(`Order with ID ${id} not found`);
    }

    MOCK_ORDERS.splice(orderIndex, 1);
  }
};

export default orderService;
