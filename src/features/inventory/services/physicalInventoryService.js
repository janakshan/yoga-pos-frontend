/**
 * Physical Inventory Service
 * Manages full physical inventory counts
 */

/**
 * Mock delay to simulate network latency
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate unique ID
 */
const generateId = () => `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Mock physical inventory data
 */
let MOCK_PHYSICAL_INVENTORIES = [
  {
    id: 'pi_001',
    name: 'Q1 2024 Physical Inventory - Main Store',
    status: 'completed',
    locationId: 'loc_001',
    locationName: 'Main Store',
    scheduledDate: new Date('2024-01-31'),
    startDate: new Date('2024-01-31T18:00:00'),
    endDate: new Date('2024-02-01T02:00:00'),
    assignedTeam: ['user_001', 'user_002'],
    items: [
      {
        id: 'pii_001',
        productId: 'prod_001',
        productName: 'Premium Yoga Mat - Ocean Blue',
        productSku: 'YM-001-BLU',
        systemQuantity: 50,
        countedQuantity: 50,
        variance: 0,
        unitCost: 25.00,
        varianceValue: 0,
        status: 'approved',
        notes: '',
        countedAt: new Date('2024-01-31T19:15:00'),
        countedBy: 'user_001'
      },
      {
        id: 'pii_002',
        productId: 'prod_003',
        productName: 'Cork Yoga Block (Set of 2)',
        productSku: 'YB-001-CORK',
        systemQuantity: 80,
        countedQuantity: 75,
        variance: -5,
        unitCost: 12.00,
        varianceValue: -60.00,
        status: 'approved',
        notes: '5 units unaccounted for',
        countedAt: new Date('2024-01-31T20:00:00'),
        countedBy: 'user_002'
      }
    ],
    totalItems: 2,
    countedItems: 2,
    varianceCount: 1,
    totalVarianceValue: -60.00,
    requireApproval: true,
    approved: true,
    approvedBy: 'user_001',
    approvedAt: new Date('2024-02-01T08:00:00'),
    notes: 'Annual physical inventory count',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-01T08:00:00'),
    createdBy: 'user_001',
    completedBy: 'user_001'
  }
];

/**
 * Physical Inventory Service
 */
export const physicalInventoryService = {
  /**
   * Get all physical inventories with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of physical inventories
   */
  async getPhysicalInventories(filters = {}) {
    await delay(300);

    let result = [...MOCK_PHYSICAL_INVENTORIES];

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter((pi) => pi.status === filters.status);
    }

    // Apply location filter
    if (filters.locationId && filters.locationId !== 'all') {
      result = result.filter((pi) => pi.locationId === filters.locationId);
    }

    // Apply date range filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter((pi) => new Date(pi.scheduledDate) >= startDate);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      result = result.filter((pi) => new Date(pi.scheduledDate) <= endDate);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((pi) =>
        pi.name.toLowerCase().includes(searchLower) ||
        pi.notes.toLowerCase().includes(searchLower)
      );
    }

    // Sort by scheduled date descending
    result.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

    return result;
  },

  /**
   * Get physical inventory by ID
   * @param {string} id - Physical inventory ID
   * @returns {Promise<Object>} Physical inventory object
   */
  async getPhysicalInventoryById(id) {
    await delay(200);

    const inventory = MOCK_PHYSICAL_INVENTORIES.find((pi) => pi.id === id);
    if (!inventory) {
      throw new Error(`Physical inventory with ID ${id} not found`);
    }

    return { ...inventory };
  },

  /**
   * Create a new physical inventory
   * @param {Object} data - Physical inventory data
   * @returns {Promise<Object>} Created physical inventory
   */
  async createPhysicalInventory(data) {
    await delay(500);

    // Validation
    if (!data.name) {
      throw new Error('Physical inventory name is required');
    }
    if (!data.locationId) {
      throw new Error('Location is required');
    }
    if (!data.scheduledDate) {
      throw new Error('Scheduled date is required');
    }
    if (!data.items || data.items.length === 0) {
      throw new Error('At least one item is required');
    }

    const newInventory = {
      id: generateId(),
      name: data.name,
      status: 'scheduled',
      locationId: data.locationId,
      locationName: data.locationName,
      scheduledDate: new Date(data.scheduledDate),
      assignedTeam: data.assignedTeam || [],
      items: data.items.map((item) => ({
        id: generateId(),
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        systemQuantity: item.systemQuantity,
        unitCost: item.unitCost,
        batchNumber: item.batchNumber || null,
        expiryDate: item.expiryDate || null,
        status: 'pending',
        notes: ''
      })),
      totalItems: data.items.length,
      countedItems: 0,
      varianceCount: 0,
      totalVarianceValue: 0,
      requireApproval: data.requireApproval !== undefined ? data.requireApproval : true,
      notes: data.notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user'
    };

    MOCK_PHYSICAL_INVENTORIES.push(newInventory);
    return { ...newInventory };
  },

  /**
   * Start a physical inventory
   * @param {string} id - Physical inventory ID
   * @returns {Promise<Object>} Updated physical inventory
   */
  async startPhysicalInventory(id) {
    await delay(300);

    const index = MOCK_PHYSICAL_INVENTORIES.findIndex((pi) => pi.id === id);
    if (index === -1) {
      throw new Error(`Physical inventory with ID ${id} not found`);
    }

    if (MOCK_PHYSICAL_INVENTORIES[index].status !== 'scheduled') {
      throw new Error('Only scheduled physical inventories can be started');
    }

    MOCK_PHYSICAL_INVENTORIES[index] = {
      ...MOCK_PHYSICAL_INVENTORIES[index],
      status: 'in_progress',
      startDate: new Date(),
      updatedAt: new Date()
    };

    return { ...MOCK_PHYSICAL_INVENTORIES[index] };
  },

  /**
   * Update item count
   * @param {string} inventoryId - Physical inventory ID
   * @param {string} itemId - Item ID
   * @param {Object} countData - Count data
   * @returns {Promise<Object>} Updated physical inventory
   */
  async updateItemCount(inventoryId, itemId, countData) {
    await delay(300);

    const piIndex = MOCK_PHYSICAL_INVENTORIES.findIndex((pi) => pi.id === inventoryId);
    if (piIndex === -1) {
      throw new Error(`Physical inventory with ID ${inventoryId} not found`);
    }

    const inventory = MOCK_PHYSICAL_INVENTORIES[piIndex];
    const itemIndex = inventory.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error(`Item with ID ${itemId} not found in physical inventory`);
    }

    const item = inventory.items[itemIndex];
    const variance = countData.countedQuantity - item.systemQuantity;
    const varianceValue = variance * item.unitCost;

    // Update item
    inventory.items[itemIndex] = {
      ...item,
      countedQuantity: countData.countedQuantity,
      variance,
      varianceValue,
      status: 'counted',
      notes: countData.notes || item.notes,
      countedAt: new Date(),
      countedBy: 'current_user'
    };

    // Recalculate statistics
    const countedItems = inventory.items.filter((item) => item.status === 'counted' || item.status === 'verified' || item.status === 'approved').length;
    const varianceCount = inventory.items.filter((item) => item.variance && item.variance !== 0).length;
    const totalVarianceValue = inventory.items.reduce((sum, item) => sum + (item.varianceValue || 0), 0);

    MOCK_PHYSICAL_INVENTORIES[piIndex] = {
      ...inventory,
      countedItems,
      varianceCount,
      totalVarianceValue,
      updatedAt: new Date()
    };

    return { ...MOCK_PHYSICAL_INVENTORIES[piIndex] };
  },

  /**
   * Verify item count
   * @param {string} inventoryId - Physical inventory ID
   * @param {string} itemId - Item ID
   * @returns {Promise<Object>} Updated physical inventory
   */
  async verifyItemCount(inventoryId, itemId) {
    await delay(300);

    const piIndex = MOCK_PHYSICAL_INVENTORIES.findIndex((pi) => pi.id === inventoryId);
    if (piIndex === -1) {
      throw new Error(`Physical inventory with ID ${inventoryId} not found`);
    }

    const inventory = MOCK_PHYSICAL_INVENTORIES[piIndex];
    const itemIndex = inventory.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error(`Item with ID ${itemId} not found in physical inventory`);
    }

    if (inventory.items[itemIndex].status !== 'counted') {
      throw new Error('Only counted items can be verified');
    }

    inventory.items[itemIndex] = {
      ...inventory.items[itemIndex],
      status: 'verified',
      verifiedAt: new Date(),
      verifiedBy: 'current_user'
    };

    MOCK_PHYSICAL_INVENTORIES[piIndex] = {
      ...inventory,
      updatedAt: new Date()
    };

    return { ...MOCK_PHYSICAL_INVENTORIES[piIndex] };
  },

  /**
   * Complete a physical inventory
   * @param {string} id - Physical inventory ID
   * @returns {Promise<Object>} Updated physical inventory
   */
  async completePhysicalInventory(id) {
    await delay(400);

    const index = MOCK_PHYSICAL_INVENTORIES.findIndex((pi) => pi.id === id);
    if (index === -1) {
      throw new Error(`Physical inventory with ID ${id} not found`);
    }

    const inventory = MOCK_PHYSICAL_INVENTORIES[index];

    if (inventory.status !== 'in_progress') {
      throw new Error('Only in-progress physical inventories can be completed');
    }

    // Check if all items are counted
    const uncountedItems = inventory.items.filter((item) => item.status === 'pending');
    if (uncountedItems.length > 0) {
      throw new Error(`${uncountedItems.length} items are still pending count`);
    }

    // If requires approval and has variances, wait for approval
    if (inventory.requireApproval && inventory.varianceCount > 0) {
      MOCK_PHYSICAL_INVENTORIES[index] = {
        ...inventory,
        status: 'completed',
        endDate: new Date(),
        completedBy: 'current_user',
        approved: false,
        updatedAt: new Date()
      };
    } else {
      // Auto-approve if no variances or approval not required
      MOCK_PHYSICAL_INVENTORIES[index] = {
        ...inventory,
        status: 'completed',
        endDate: new Date(),
        completedBy: 'current_user',
        approved: true,
        approvedBy: 'current_user',
        approvedAt: new Date(),
        updatedAt: new Date()
      };
    }

    return { ...MOCK_PHYSICAL_INVENTORIES[index] };
  },

  /**
   * Approve physical inventory
   * @param {string} id - Physical inventory ID
   * @returns {Promise<Object>} Updated physical inventory
   */
  async approvePhysicalInventory(id) {
    await delay(300);

    const index = MOCK_PHYSICAL_INVENTORIES.findIndex((pi) => pi.id === id);
    if (index === -1) {
      throw new Error(`Physical inventory with ID ${id} not found`);
    }

    const inventory = MOCK_PHYSICAL_INVENTORIES[index];

    if (inventory.status !== 'completed') {
      throw new Error('Only completed physical inventories can be approved');
    }

    if (inventory.approved) {
      throw new Error('Physical inventory is already approved');
    }

    // Approve all items
    inventory.items.forEach((item) => {
      if (item.status === 'counted' || item.status === 'verified') {
        item.status = 'approved';
      }
    });

    MOCK_PHYSICAL_INVENTORIES[index] = {
      ...inventory,
      approved: true,
      approvedBy: 'current_user',
      approvedAt: new Date(),
      updatedAt: new Date()
    };

    return { ...MOCK_PHYSICAL_INVENTORIES[index] };
  },

  /**
   * Cancel a physical inventory
   * @param {string} id - Physical inventory ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Updated physical inventory
   */
  async cancelPhysicalInventory(id, reason) {
    await delay(300);

    const index = MOCK_PHYSICAL_INVENTORIES.findIndex((pi) => pi.id === id);
    if (index === -1) {
      throw new Error(`Physical inventory with ID ${id} not found`);
    }

    if (MOCK_PHYSICAL_INVENTORIES[index].status === 'completed' && MOCK_PHYSICAL_INVENTORIES[index].approved) {
      throw new Error('Approved physical inventories cannot be cancelled');
    }

    MOCK_PHYSICAL_INVENTORIES[index] = {
      ...MOCK_PHYSICAL_INVENTORIES[index],
      status: 'cancelled',
      cancellationReason: reason,
      cancelledBy: 'current_user',
      cancelledAt: new Date(),
      updatedAt: new Date()
    };

    return { ...MOCK_PHYSICAL_INVENTORIES[index] };
  },

  /**
   * Apply physical inventory adjustments to inventory
   * @param {string} id - Physical inventory ID
   * @returns {Promise<Object>} Result with created adjustments
   */
  async applyAdjustments(id) {
    await delay(500);

    const inventory = MOCK_PHYSICAL_INVENTORIES.find((pi) => pi.id === id);
    if (!inventory) {
      throw new Error(`Physical inventory with ID ${id} not found`);
    }

    if (inventory.status !== 'completed') {
      throw new Error('Only completed physical inventories can have adjustments applied');
    }

    if (inventory.requireApproval && !inventory.approved) {
      throw new Error('Physical inventory must be approved before applying adjustments');
    }

    const adjustments = [];

    // Find items with variance
    const itemsWithVariance = inventory.items.filter((item) => item.variance !== 0);

    for (const item of itemsWithVariance) {
      adjustments.push({
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        systemQuantity: item.systemQuantity,
        countedQuantity: item.countedQuantity,
        variance: item.variance,
        varianceValue: item.varianceValue,
        notes: `Physical inventory adjustment - ${inventory.name}`
      });
    }

    return {
      inventoryId: id,
      adjustments,
      totalVarianceValue: inventory.totalVarianceValue,
      message: `${adjustments.length} adjustments ready to be applied to inventory`
    };
  },

  /**
   * Get physical inventory statistics
   * @returns {Promise<Object>} Physical inventory statistics
   */
  async getStats() {
    await delay(200);

    const stats = {
      total: MOCK_PHYSICAL_INVENTORIES.length,
      scheduled: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      totalVarianceValue: 0,
      totalItemsCounted: 0,
      accuracyRate: 0,
      pendingApproval: 0
    };

    MOCK_PHYSICAL_INVENTORIES.forEach((pi) => {
      stats[pi.status]++;
      stats.totalVarianceValue += pi.totalVarianceValue || 0;
      stats.totalItemsCounted += pi.countedItems;

      if (pi.status === 'completed' && !pi.approved && pi.requireApproval) {
        stats.pendingApproval++;
      }
    });

    // Calculate accuracy rate
    const totalItems = MOCK_PHYSICAL_INVENTORIES.reduce((sum, pi) => sum + pi.totalItems, 0);
    const totalVariances = MOCK_PHYSICAL_INVENTORIES.reduce((sum, pi) => sum + pi.varianceCount, 0);
    const itemsWithoutVariance = stats.totalItemsCounted - totalVariances;
    stats.accuracyRate = totalItems > 0 ? (itemsWithoutVariance / stats.totalItemsCounted) * 100 : 100;

    return stats;
  },

  /**
   * Generate variance report
   * @param {string} id - Physical inventory ID
   * @returns {Promise<Object>} Variance report
   */
  async getVarianceReport(id) {
    await delay(300);

    const inventory = MOCK_PHYSICAL_INVENTORIES.find((pi) => pi.id === id);
    if (!inventory) {
      throw new Error(`Physical inventory with ID ${id} not found`);
    }

    const variances = inventory.items
      .filter((item) => item.variance !== 0)
      .map((item) => ({
        productName: item.productName,
        productSku: item.productSku,
        systemQuantity: item.systemQuantity,
        countedQuantity: item.countedQuantity,
        variance: item.variance,
        varianceValue: item.varianceValue,
        variancePercentage: ((item.variance / item.systemQuantity) * 100).toFixed(2),
        notes: item.notes
      }))
      .sort((a, b) => Math.abs(b.varianceValue) - Math.abs(a.varianceValue));

    return {
      inventoryName: inventory.name,
      locationName: inventory.locationName,
      completedDate: inventory.endDate,
      totalItems: inventory.totalItems,
      itemsWithVariance: variances.length,
      totalVarianceValue: inventory.totalVarianceValue,
      accuracyRate: ((inventory.totalItems - variances.length) / inventory.totalItems * 100).toFixed(2),
      variances
    };
  },

  /**
   * Delete physical inventory
   * @param {string} id - Physical inventory ID
   * @returns {Promise<boolean>} Success status
   */
  async deletePhysicalInventory(id) {
    await delay(300);

    const index = MOCK_PHYSICAL_INVENTORIES.findIndex((pi) => pi.id === id);
    if (index === -1) {
      throw new Error(`Physical inventory with ID ${id} not found`);
    }

    if (MOCK_PHYSICAL_INVENTORIES[index].status === 'completed' && MOCK_PHYSICAL_INVENTORIES[index].approved) {
      throw new Error('Approved physical inventories cannot be deleted');
    }

    MOCK_PHYSICAL_INVENTORIES.splice(index, 1);
    return true;
  }
};

export default physicalInventoryService;
