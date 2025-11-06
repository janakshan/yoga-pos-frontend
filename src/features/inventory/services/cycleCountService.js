/**
 * Cycle Count Service
 * Manages cycle counting for inventory accuracy
 */

/**
 * Mock delay to simulate network latency
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate unique ID
 */
const generateId = () => `cc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Mock cycle counts data
 */
let MOCK_CYCLE_COUNTS = [
  {
    id: 'cc_001',
    name: 'Weekly Count - Main Store',
    status: 'completed',
    locationId: 'loc_001',
    locationName: 'Main Store',
    scheduledDate: new Date('2024-02-12'),
    startDate: new Date('2024-02-12T09:00:00'),
    endDate: new Date('2024-02-12T11:30:00'),
    assignedTo: 'user_002',
    assignedToName: 'Staff User',
    items: [
      {
        id: 'cci_001',
        productId: 'prod_001',
        productName: 'Premium Yoga Mat - Ocean Blue',
        productSku: 'YM-001-BLU',
        systemQuantity: 45,
        countedQuantity: 45,
        variance: 0,
        status: 'verified',
        notes: '',
        countedAt: new Date('2024-02-12T10:15:00'),
        countedBy: 'user_002'
      },
      {
        id: 'cci_002',
        productId: 'prod_003',
        productName: 'Cork Yoga Block (Set of 2)',
        productSku: 'YB-001-CORK',
        systemQuantity: 80,
        countedQuantity: 78,
        variance: -2,
        status: 'verified',
        notes: '2 units damaged, marked for write-off',
        countedAt: new Date('2024-02-12T10:30:00'),
        countedBy: 'user_002'
      }
    ],
    totalItems: 2,
    countedItems: 2,
    varianceCount: 1,
    notes: 'Routine weekly cycle count',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-12T11:30:00'),
    createdBy: 'user_001',
    completedBy: 'user_002'
  },
  {
    id: 'cc_002',
    name: 'Monthly ABC Count - Fast Movers',
    status: 'in_progress',
    locationId: 'loc_001',
    locationName: 'Main Store',
    scheduledDate: new Date('2024-02-20'),
    startDate: new Date('2024-02-20T09:00:00'),
    assignedTo: 'user_001',
    assignedToName: 'Admin User',
    items: [
      {
        id: 'cci_003',
        productId: 'prod_001',
        productName: 'Premium Yoga Mat - Ocean Blue',
        productSku: 'YM-001-BLU',
        systemQuantity: 45,
        countedQuantity: 46,
        variance: 1,
        status: 'counted',
        notes: 'Found 1 additional unit',
        countedAt: new Date('2024-02-20T09:30:00'),
        countedBy: 'user_001'
      },
      {
        id: 'cci_004',
        productId: 'prod_002',
        productName: 'Premium Yoga Mat - Purple Lavender',
        productSku: 'YM-002-PUR',
        systemQuantity: 42,
        status: 'pending',
        notes: ''
      }
    ],
    totalItems: 2,
    countedItems: 1,
    varianceCount: 1,
    notes: 'ABC analysis count focusing on high-value items',
    createdAt: new Date('2024-02-18'),
    updatedAt: new Date('2024-02-20T09:30:00'),
    createdBy: 'user_001'
  }
];

/**
 * Cycle Count Service
 */
export const cycleCountService = {
  /**
   * Get all cycle counts with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of cycle counts
   */
  async getCycleCounts(filters = {}) {
    await delay(300);

    let result = [...MOCK_CYCLE_COUNTS];

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter((cc) => cc.status === filters.status);
    }

    // Apply location filter
    if (filters.locationId && filters.locationId !== 'all') {
      result = result.filter((cc) => cc.locationId === filters.locationId);
    }

    // Apply assigned filter
    if (filters.assignedTo) {
      result = result.filter((cc) => cc.assignedTo === filters.assignedTo);
    }

    // Apply date range filters
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      result = result.filter((cc) => new Date(cc.scheduledDate) >= startDate);
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      result = result.filter((cc) => new Date(cc.scheduledDate) <= endDate);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((cc) =>
        cc.name.toLowerCase().includes(searchLower) ||
        cc.notes.toLowerCase().includes(searchLower)
      );
    }

    // Sort by scheduled date descending
    result.sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

    return result;
  },

  /**
   * Get cycle count by ID
   * @param {string} id - Cycle count ID
   * @returns {Promise<Object>} Cycle count object
   */
  async getCycleCountById(id) {
    await delay(200);

    const cycleCount = MOCK_CYCLE_COUNTS.find((cc) => cc.id === id);
    if (!cycleCount) {
      throw new Error(`Cycle count with ID ${id} not found`);
    }

    return { ...cycleCount };
  },

  /**
   * Create a new cycle count
   * @param {Object} data - Cycle count data
   * @returns {Promise<Object>} Created cycle count
   */
  async createCycleCount(data) {
    await delay(400);

    // Validation
    if (!data.name) {
      throw new Error('Cycle count name is required');
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

    const newCycleCount = {
      id: generateId(),
      name: data.name,
      status: 'scheduled',
      locationId: data.locationId,
      locationName: data.locationName,
      scheduledDate: new Date(data.scheduledDate),
      assignedTo: data.assignedTo || null,
      assignedToName: data.assignedToName || null,
      items: data.items.map((item) => ({
        id: generateId(),
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        systemQuantity: item.systemQuantity,
        batchNumber: item.batchNumber || null,
        expiryDate: item.expiryDate || null,
        status: 'pending',
        notes: ''
      })),
      totalItems: data.items.length,
      countedItems: 0,
      varianceCount: 0,
      notes: data.notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user'
    };

    MOCK_CYCLE_COUNTS.push(newCycleCount);
    return { ...newCycleCount };
  },

  /**
   * Start a cycle count
   * @param {string} id - Cycle count ID
   * @returns {Promise<Object>} Updated cycle count
   */
  async startCycleCount(id) {
    await delay(300);

    const index = MOCK_CYCLE_COUNTS.findIndex((cc) => cc.id === id);
    if (index === -1) {
      throw new Error(`Cycle count with ID ${id} not found`);
    }

    if (MOCK_CYCLE_COUNTS[index].status !== 'scheduled') {
      throw new Error('Only scheduled cycle counts can be started');
    }

    MOCK_CYCLE_COUNTS[index] = {
      ...MOCK_CYCLE_COUNTS[index],
      status: 'in_progress',
      startDate: new Date(),
      updatedAt: new Date()
    };

    return { ...MOCK_CYCLE_COUNTS[index] };
  },

  /**
   * Update item count
   * @param {string} cycleCountId - Cycle count ID
   * @param {string} itemId - Item ID
   * @param {Object} countData - Count data
   * @returns {Promise<Object>} Updated cycle count
   */
  async updateItemCount(cycleCountId, itemId, countData) {
    await delay(300);

    const ccIndex = MOCK_CYCLE_COUNTS.findIndex((cc) => cc.id === cycleCountId);
    if (ccIndex === -1) {
      throw new Error(`Cycle count with ID ${cycleCountId} not found`);
    }

    const cycleCount = MOCK_CYCLE_COUNTS[ccIndex];
    const itemIndex = cycleCount.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error(`Item with ID ${itemId} not found in cycle count`);
    }

    // Update item
    cycleCount.items[itemIndex] = {
      ...cycleCount.items[itemIndex],
      countedQuantity: countData.countedQuantity,
      variance: countData.countedQuantity - cycleCount.items[itemIndex].systemQuantity,
      status: 'counted',
      notes: countData.notes || cycleCount.items[itemIndex].notes,
      countedAt: new Date(),
      countedBy: 'current_user'
    };

    // Recalculate statistics
    const countedItems = cycleCount.items.filter((item) => item.status === 'counted' || item.status === 'verified').length;
    const varianceCount = cycleCount.items.filter((item) => item.variance && item.variance !== 0).length;

    MOCK_CYCLE_COUNTS[ccIndex] = {
      ...cycleCount,
      countedItems,
      varianceCount,
      updatedAt: new Date()
    };

    return { ...MOCK_CYCLE_COUNTS[ccIndex] };
  },

  /**
   * Verify item count
   * @param {string} cycleCountId - Cycle count ID
   * @param {string} itemId - Item ID
   * @returns {Promise<Object>} Updated cycle count
   */
  async verifyItemCount(cycleCountId, itemId) {
    await delay(300);

    const ccIndex = MOCK_CYCLE_COUNTS.findIndex((cc) => cc.id === cycleCountId);
    if (ccIndex === -1) {
      throw new Error(`Cycle count with ID ${cycleCountId} not found`);
    }

    const cycleCount = MOCK_CYCLE_COUNTS[ccIndex];
    const itemIndex = cycleCount.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error(`Item with ID ${itemId} not found in cycle count`);
    }

    if (cycleCount.items[itemIndex].status !== 'counted') {
      throw new Error('Only counted items can be verified');
    }

    cycleCount.items[itemIndex] = {
      ...cycleCount.items[itemIndex],
      status: 'verified',
      verifiedAt: new Date(),
      verifiedBy: 'current_user'
    };

    MOCK_CYCLE_COUNTS[ccIndex] = {
      ...cycleCount,
      updatedAt: new Date()
    };

    return { ...MOCK_CYCLE_COUNTS[ccIndex] };
  },

  /**
   * Complete a cycle count
   * @param {string} id - Cycle count ID
   * @returns {Promise<Object>} Updated cycle count
   */
  async completeCycleCount(id) {
    await delay(400);

    const index = MOCK_CYCLE_COUNTS.findIndex((cc) => cc.id === id);
    if (index === -1) {
      throw new Error(`Cycle count with ID ${id} not found`);
    }

    const cycleCount = MOCK_CYCLE_COUNTS[index];

    if (cycleCount.status !== 'in_progress') {
      throw new Error('Only in-progress cycle counts can be completed');
    }

    // Check if all items are counted
    const uncountedItems = cycleCount.items.filter((item) => item.status === 'pending');
    if (uncountedItems.length > 0) {
      throw new Error(`${uncountedItems.length} items are still pending count`);
    }

    MOCK_CYCLE_COUNTS[index] = {
      ...cycleCount,
      status: 'completed',
      endDate: new Date(),
      completedBy: 'current_user',
      updatedAt: new Date()
    };

    return { ...MOCK_CYCLE_COUNTS[index] };
  },

  /**
   * Cancel a cycle count
   * @param {string} id - Cycle count ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Updated cycle count
   */
  async cancelCycleCount(id, reason) {
    await delay(300);

    const index = MOCK_CYCLE_COUNTS.findIndex((cc) => cc.id === id);
    if (index === -1) {
      throw new Error(`Cycle count with ID ${id} not found`);
    }

    if (MOCK_CYCLE_COUNTS[index].status === 'completed') {
      throw new Error('Completed cycle counts cannot be cancelled');
    }

    MOCK_CYCLE_COUNTS[index] = {
      ...MOCK_CYCLE_COUNTS[index],
      status: 'cancelled',
      cancellationReason: reason,
      cancelledBy: 'current_user',
      cancelledAt: new Date(),
      updatedAt: new Date()
    };

    return { ...MOCK_CYCLE_COUNTS[index] };
  },

  /**
   * Apply cycle count adjustments to inventory
   * @param {string} id - Cycle count ID
   * @returns {Promise<Object>} Result with created adjustments
   */
  async applyAdjustments(id) {
    await delay(500);

    const cycleCount = MOCK_CYCLE_COUNTS.find((cc) => cc.id === id);
    if (!cycleCount) {
      throw new Error(`Cycle count with ID ${id} not found`);
    }

    if (cycleCount.status !== 'completed') {
      throw new Error('Only completed cycle counts can have adjustments applied');
    }

    const adjustments = [];

    // Find items with variance
    const itemsWithVariance = cycleCount.items.filter((item) => item.variance !== 0);

    for (const item of itemsWithVariance) {
      adjustments.push({
        productId: item.productId,
        productName: item.productName,
        productSku: item.productSku,
        systemQuantity: item.systemQuantity,
        countedQuantity: item.countedQuantity,
        variance: item.variance,
        notes: `Cycle count adjustment - ${cycleCount.name}`
      });
    }

    return {
      cycleCountId: id,
      adjustments,
      message: `${adjustments.length} adjustments ready to be applied to inventory`
    };
  },

  /**
   * Get cycle count statistics
   * @returns {Promise<Object>} Cycle count statistics
   */
  async getStats() {
    await delay(200);

    const stats = {
      total: MOCK_CYCLE_COUNTS.length,
      scheduled: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
      totalVariances: 0,
      totalItemsCounted: 0,
      accuracyRate: 0
    };

    MOCK_CYCLE_COUNTS.forEach((cc) => {
      stats[cc.status]++;
      stats.totalVariances += cc.varianceCount;
      stats.totalItemsCounted += cc.countedItems;
    });

    // Calculate accuracy rate
    const totalItems = MOCK_CYCLE_COUNTS.reduce((sum, cc) => sum + cc.totalItems, 0);
    const itemsWithoutVariance = stats.totalItemsCounted - stats.totalVariances;
    stats.accuracyRate = totalItems > 0 ? (itemsWithoutVariance / stats.totalItemsCounted) * 100 : 100;

    return stats;
  },

  /**
   * Delete cycle count
   * @param {string} id - Cycle count ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCycleCount(id) {
    await delay(300);

    const index = MOCK_CYCLE_COUNTS.findIndex((cc) => cc.id === id);
    if (index === -1) {
      throw new Error(`Cycle count with ID ${id} not found`);
    }

    if (MOCK_CYCLE_COUNTS[index].status === 'completed') {
      throw new Error('Completed cycle counts cannot be deleted');
    }

    MOCK_CYCLE_COUNTS.splice(index, 1);
    return true;
  }
};

export default cycleCountService;
