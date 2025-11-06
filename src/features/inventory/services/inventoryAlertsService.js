/**
 * Inventory Alerts Service
 * Manages inventory alerts for low stock, expiry dates, reorder points, etc.
 */

/**
 * Mock delay to simulate network latency
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate unique ID
 */
const generateId = () => `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Mock inventory alerts data
 */
let MOCK_ALERTS = [
  {
    id: 'alert_001',
    type: 'low_stock',
    status: 'pending',
    priority: 'medium',
    productId: 'prod_004',
    productName: 'Adjustable Yoga Strap - Black',
    productSku: 'YS-001-BLK',
    locationId: 'loc_001',
    locationName: 'Main Store',
    currentQuantity: 8,
    threshold: 10,
    message: 'Stock level is below threshold (8/10)',
    triggeredAt: new Date('2024-02-05'),
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05')
  },
  {
    id: 'alert_002',
    type: 'out_of_stock',
    status: 'pending',
    priority: 'critical',
    productId: 'prod_010',
    productName: 'Plant-Based Protein Powder - Vanilla',
    productSku: 'SUP-001-PRO',
    locationId: 'loc_001',
    locationName: 'Main Store',
    currentQuantity: 0,
    threshold: 0,
    message: 'Product is out of stock',
    triggeredAt: new Date('2024-02-14'),
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-14')
  },
  {
    id: 'alert_003',
    type: 'reorder_point',
    status: 'pending',
    priority: 'high',
    productId: 'prod_010',
    productName: 'Plant-Based Protein Powder - Vanilla',
    productSku: 'SUP-001-PRO',
    locationId: 'loc_001',
    locationName: 'Main Store',
    currentQuantity: 0,
    threshold: 15,
    message: 'Stock has reached reorder point - reorder now',
    triggeredAt: new Date('2024-02-14'),
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-14')
  }
];

/**
 * Mock reorder notifications data
 */
let MOCK_REORDER_NOTIFICATIONS = [
  {
    id: 'reorder_001',
    productId: 'prod_010',
    productName: 'Plant-Based Protein Powder - Vanilla',
    productSku: 'SUP-001-PRO',
    locationId: 'loc_001',
    locationName: 'Main Store',
    currentQuantity: 0,
    reorderPoint: 15,
    reorderQuantity: 50,
    averageDailySales: 2.5,
    leadTimeDays: 7,
    supplier: 'Health Supplements Co.',
    estimatedCost: 1100.00,
    status: 'pending',
    triggeredAt: new Date('2024-02-14'),
    createdAt: new Date('2024-02-14'),
    updatedAt: new Date('2024-02-14')
  }
];

/**
 * Inventory Alerts Service
 */
export const inventoryAlertsService = {
  /**
   * Get all alerts with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of alerts
   */
  async getAlerts(filters = {}) {
    await delay(300);

    let result = [...MOCK_ALERTS];

    // Apply type filter
    if (filters.type && filters.type !== 'all') {
      result = result.filter((alert) => alert.type === filters.type);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter((alert) => alert.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter((alert) => alert.priority === filters.priority);
    }

    // Apply location filter
    if (filters.locationId && filters.locationId !== 'all') {
      result = result.filter((alert) => alert.locationId === filters.locationId);
    }

    // Apply product filter
    if (filters.productId) {
      result = result.filter((alert) => alert.productId === filters.productId);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((alert) =>
        alert.productName.toLowerCase().includes(searchLower) ||
        alert.productSku.toLowerCase().includes(searchLower) ||
        alert.message.toLowerCase().includes(searchLower)
      );
    }

    // Sort by priority and date
    result.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return new Date(b.triggeredAt) - new Date(a.triggeredAt);
    });

    return result;
  },

  /**
   * Get alert by ID
   * @param {string} id - Alert ID
   * @returns {Promise<Object>} Alert object
   */
  async getAlertById(id) {
    await delay(200);

    const alert = MOCK_ALERTS.find((a) => a.id === id);
    if (!alert) {
      throw new Error(`Alert with ID ${id} not found`);
    }

    return { ...alert };
  },

  /**
   * Create a new alert
   * @param {Object} data - Alert data
   * @returns {Promise<Object>} Created alert
   */
  async createAlert(data) {
    await delay(300);

    const newAlert = {
      id: generateId(),
      type: data.type,
      status: 'pending',
      priority: data.priority || 'medium',
      productId: data.productId,
      productName: data.productName,
      productSku: data.productSku,
      locationId: data.locationId || null,
      locationName: data.locationName || null,
      batchNumber: data.batchNumber || null,
      currentQuantity: data.currentQuantity || null,
      threshold: data.threshold || null,
      expiryDate: data.expiryDate || null,
      message: data.message,
      triggeredAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    MOCK_ALERTS.push(newAlert);
    return { ...newAlert };
  },

  /**
   * Acknowledge an alert
   * @param {string} id - Alert ID
   * @param {string} userId - User acknowledging
   * @returns {Promise<Object>} Updated alert
   */
  async acknowledgeAlert(id, userId = 'current_user') {
    await delay(300);

    const index = MOCK_ALERTS.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Alert with ID ${id} not found`);
    }

    MOCK_ALERTS[index] = {
      ...MOCK_ALERTS[index],
      status: 'acknowledged',
      acknowledgedAt: new Date(),
      acknowledgedBy: userId,
      updatedAt: new Date()
    };

    return { ...MOCK_ALERTS[index] };
  },

  /**
   * Resolve an alert
   * @param {string} id - Alert ID
   * @param {string} userId - User resolving
   * @returns {Promise<Object>} Updated alert
   */
  async resolveAlert(id, userId = 'current_user') {
    await delay(300);

    const index = MOCK_ALERTS.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Alert with ID ${id} not found`);
    }

    MOCK_ALERTS[index] = {
      ...MOCK_ALERTS[index],
      status: 'resolved',
      resolvedAt: new Date(),
      resolvedBy: userId,
      updatedAt: new Date()
    };

    return { ...MOCK_ALERTS[index] };
  },

  /**
   * Dismiss an alert
   * @param {string} id - Alert ID
   * @returns {Promise<Object>} Updated alert
   */
  async dismissAlert(id) {
    await delay(300);

    const index = MOCK_ALERTS.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new Error(`Alert with ID ${id} not found`);
    }

    MOCK_ALERTS[index] = {
      ...MOCK_ALERTS[index],
      status: 'dismissed',
      updatedAt: new Date()
    };

    return { ...MOCK_ALERTS[index] };
  },

  /**
   * Get alert statistics
   * @returns {Promise<Object>} Alert statistics
   */
  async getAlertStats() {
    await delay(200);

    const stats = {
      total: MOCK_ALERTS.length,
      pending: 0,
      acknowledged: 0,
      resolved: 0,
      dismissed: 0,
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      byType: {
        low_stock: 0,
        out_of_stock: 0,
        reorder_point: 0,
        expiring_soon: 0,
        expired: 0,
        overstock: 0
      }
    };

    MOCK_ALERTS.forEach((alert) => {
      stats[alert.status]++;
      stats[alert.priority]++;
      stats.byType[alert.type]++;
    });

    return stats;
  },

  /**
   * Get reorder notifications
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of reorder notifications
   */
  async getReorderNotifications(filters = {}) {
    await delay(300);

    let result = [...MOCK_REORDER_NOTIFICATIONS];

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter((n) => n.status === filters.status);
    }

    // Apply location filter
    if (filters.locationId && filters.locationId !== 'all') {
      result = result.filter((n) => n.locationId === filters.locationId);
    }

    // Sort by triggered date
    result.sort((a, b) => new Date(b.triggeredAt) - new Date(a.triggeredAt));

    return result;
  },

  /**
   * Mark reorder notification as ordered
   * @param {string} id - Notification ID
   * @param {string} purchaseOrderId - Created PO ID
   * @returns {Promise<Object>} Updated notification
   */
  async markReorderAsOrdered(id, purchaseOrderId) {
    await delay(300);

    const index = MOCK_REORDER_NOTIFICATIONS.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`Reorder notification with ID ${id} not found`);
    }

    MOCK_REORDER_NOTIFICATIONS[index] = {
      ...MOCK_REORDER_NOTIFICATIONS[index],
      status: 'ordered',
      purchaseOrderId,
      orderedAt: new Date(),
      orderedBy: 'current_user',
      updatedAt: new Date()
    };

    return { ...MOCK_REORDER_NOTIFICATIONS[index] };
  },

  /**
   * Dismiss reorder notification
   * @param {string} id - Notification ID
   * @returns {Promise<Object>} Updated notification
   */
  async dismissReorderNotification(id) {
    await delay(300);

    const index = MOCK_REORDER_NOTIFICATIONS.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`Reorder notification with ID ${id} not found`);
    }

    MOCK_REORDER_NOTIFICATIONS[index] = {
      ...MOCK_REORDER_NOTIFICATIONS[index],
      status: 'dismissed',
      dismissedAt: new Date(),
      updatedAt: new Date()
    };

    return { ...MOCK_REORDER_NOTIFICATIONS[index] };
  },

  /**
   * Check stock levels and generate alerts
   * @param {Array} stockLevels - Stock levels to check
   * @returns {Promise<Array>} Generated alerts
   */
  async checkAndGenerateAlerts(stockLevels) {
    await delay(400);

    const generatedAlerts = [];

    for (const level of stockLevels) {
      // Check for out of stock
      if (level.isOutOfStock) {
        const existingAlert = MOCK_ALERTS.find(
          (a) =>
            a.productId === level.productId &&
            a.locationId === level.locationId &&
            a.type === 'out_of_stock' &&
            a.status === 'pending'
        );

        if (!existingAlert) {
          const alert = await this.createAlert({
            type: 'out_of_stock',
            priority: 'critical',
            productId: level.productId,
            productName: level.productName,
            productSku: level.productSku,
            locationId: level.locationId,
            locationName: level.locationName,
            currentQuantity: level.quantity,
            threshold: 0,
            message: 'Product is out of stock'
          });
          generatedAlerts.push(alert);
        }
      }
      // Check for low stock
      else if (level.isLowStock) {
        const existingAlert = MOCK_ALERTS.find(
          (a) =>
            a.productId === level.productId &&
            a.locationId === level.locationId &&
            a.type === 'low_stock' &&
            a.status === 'pending'
        );

        if (!existingAlert) {
          const alert = await this.createAlert({
            type: 'low_stock',
            priority: 'medium',
            productId: level.productId,
            productName: level.productName,
            productSku: level.productSku,
            locationId: level.locationId,
            locationName: level.locationName,
            currentQuantity: level.quantity,
            threshold: level.lowStockThreshold,
            message: `Stock level is below threshold (${level.quantity}/${level.lowStockThreshold})`
          });
          generatedAlerts.push(alert);
        }
      }

      // Check for reorder point
      if (level.quantity <= level.reorderPoint) {
        const existingAlert = MOCK_ALERTS.find(
          (a) =>
            a.productId === level.productId &&
            a.locationId === level.locationId &&
            a.type === 'reorder_point' &&
            a.status === 'pending'
        );

        if (!existingAlert) {
          const alert = await this.createAlert({
            type: 'reorder_point',
            priority: 'high',
            productId: level.productId,
            productName: level.productName,
            productSku: level.productSku,
            locationId: level.locationId,
            locationName: level.locationName,
            currentQuantity: level.quantity,
            threshold: level.reorderPoint,
            message: 'Stock has reached reorder point - reorder now'
          });
          generatedAlerts.push(alert);

          // Also create reorder notification if not exists
          const existingNotification = MOCK_REORDER_NOTIFICATIONS.find(
            (n) =>
              n.productId === level.productId &&
              n.locationId === level.locationId &&
              n.status === 'pending'
          );

          if (!existingNotification) {
            const notification = {
              id: generateId(),
              productId: level.productId,
              productName: level.productName,
              productSku: level.productSku,
              locationId: level.locationId,
              locationName: level.locationName,
              currentQuantity: level.quantity,
              reorderPoint: level.reorderPoint,
              reorderQuantity: level.reorderQuantity,
              averageDailySales: 2.0, // Would be calculated from sales data
              leadTimeDays: 7, // Would come from supplier data
              supplier: 'Default Supplier',
              estimatedCost: level.reorderQuantity * level.averageCost,
              status: 'pending',
              triggeredAt: new Date(),
              createdAt: new Date(),
              updatedAt: new Date()
            };
            MOCK_REORDER_NOTIFICATIONS.push(notification);
          }
        }
      }
    }

    return generatedAlerts;
  },

  /**
   * Check expiry dates and generate alerts
   * @param {Array} transactions - Transactions with expiry dates
   * @returns {Promise<Array>} Generated alerts
   */
  async checkExpiryDates(transactions) {
    await delay(400);

    const generatedAlerts = [];
    const today = new Date();
    const expiringThreshold = 30; // days

    for (const transaction of transactions) {
      if (!transaction.expiryDate || !transaction.batchNumber) continue;

      const expiryDate = new Date(transaction.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      // Check for expired items
      if (daysUntilExpiry < 0) {
        const existingAlert = MOCK_ALERTS.find(
          (a) =>
            a.productId === transaction.productId &&
            a.batchNumber === transaction.batchNumber &&
            a.type === 'expired' &&
            a.status === 'pending'
        );

        if (!existingAlert) {
          const alert = await this.createAlert({
            type: 'expired',
            priority: 'critical',
            productId: transaction.productId,
            productName: transaction.productName,
            productSku: transaction.productSku,
            locationId: transaction.locationId,
            locationName: transaction.locationName,
            batchNumber: transaction.batchNumber,
            expiryDate: transaction.expiryDate,
            message: `Batch ${transaction.batchNumber} has expired (${Math.abs(daysUntilExpiry)} days ago)`
          });
          generatedAlerts.push(alert);
        }
      }
      // Check for expiring soon items
      else if (daysUntilExpiry <= expiringThreshold) {
        const existingAlert = MOCK_ALERTS.find(
          (a) =>
            a.productId === transaction.productId &&
            a.batchNumber === transaction.batchNumber &&
            a.type === 'expiring_soon' &&
            a.status === 'pending'
        );

        if (!existingAlert) {
          const alert = await this.createAlert({
            type: 'expiring_soon',
            priority: daysUntilExpiry <= 7 ? 'high' : 'medium',
            productId: transaction.productId,
            productName: transaction.productName,
            productSku: transaction.productSku,
            locationId: transaction.locationId,
            locationName: transaction.locationName,
            batchNumber: transaction.batchNumber,
            expiryDate: transaction.expiryDate,
            message: `Batch ${transaction.batchNumber} expires in ${daysUntilExpiry} days`
          });
          generatedAlerts.push(alert);
        }
      }
    }

    return generatedAlerts;
  }
};

export default inventoryAlertsService;
