/**
 * Serial Number Service
 * Manages serial number tracking for individual items
 */

/**
 * Mock delay to simulate network latency
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate unique ID
 */
const generateId = () => `serial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Mock serial numbers data
 */
let MOCK_SERIAL_NUMBERS = [
  {
    id: 'serial_001',
    serialNumber: 'SN-YW001-0001',
    productId: 'prod_005',
    productName: 'Yoga Wheel - Deep Blue',
    productSku: 'YW-001-BLU',
    batchNumber: 'BATCH-2024-003',
    locationId: 'loc_001',
    locationName: 'Main Store',
    expiryDate: null,
    status: 'in_stock',
    receivedDate: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: 'serial_002',
    serialNumber: 'SN-YW001-0002',
    productId: 'prod_005',
    productName: 'Yoga Wheel - Deep Blue',
    productSku: 'YW-001-BLU',
    batchNumber: 'BATCH-2024-003',
    locationId: 'loc_001',
    locationName: 'Main Store',
    expiryDate: null,
    status: 'sold',
    receivedDate: new Date('2024-01-20'),
    soldDate: new Date('2024-02-01'),
    soldTo: 'customer_001',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'serial_003',
    serialNumber: 'SN-YW001-0003',
    productId: 'prod_005',
    productName: 'Yoga Wheel - Deep Blue',
    productSku: 'YW-001-BLU',
    batchNumber: 'BATCH-2024-003',
    locationId: 'loc_001',
    locationName: 'Main Store',
    expiryDate: null,
    status: 'in_stock',
    receivedDate: new Date('2024-01-20'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20')
  }
];

/**
 * Serial Number Service
 */
export const serialNumberService = {
  /**
   * Get all serial numbers with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of serial numbers
   */
  async getSerialNumbers(filters = {}) {
    await delay(300);

    let result = [...MOCK_SERIAL_NUMBERS];

    // Apply product filter
    if (filters.productId) {
      result = result.filter((sn) => sn.productId === filters.productId);
    }

    // Apply location filter
    if (filters.locationId && filters.locationId !== 'all') {
      result = result.filter((sn) => sn.locationId === filters.locationId);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter((sn) => sn.status === filters.status);
    }

    // Apply batch number filter
    if (filters.batchNumber) {
      result = result.filter((sn) => sn.batchNumber === filters.batchNumber);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((sn) =>
        sn.serialNumber.toLowerCase().includes(searchLower) ||
        sn.productName.toLowerCase().includes(searchLower) ||
        sn.productSku.toLowerCase().includes(searchLower) ||
        sn.batchNumber.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        let aVal = a[filters.sortBy];
        let bVal = b[filters.sortBy];

        if (filters.sortBy.includes('Date')) {
          aVal = aVal ? new Date(aVal).getTime() : 0;
          bVal = bVal ? new Date(bVal).getTime() : 0;
        }

        if (aVal < bVal) return -1 * sortOrder;
        if (aVal > bVal) return 1 * sortOrder;
        return 0;
      });
    } else {
      // Default sort by received date descending
      result.sort((a, b) => new Date(b.receivedDate) - new Date(a.receivedDate));
    }

    return result;
  },

  /**
   * Get serial number by ID
   * @param {string} id - Serial number ID
   * @returns {Promise<Object>} Serial number object
   */
  async getSerialNumberById(id) {
    await delay(200);

    const serialNumber = MOCK_SERIAL_NUMBERS.find((sn) => sn.id === id);
    if (!serialNumber) {
      throw new Error(`Serial number with ID ${id} not found`);
    }

    return { ...serialNumber };
  },

  /**
   * Get serial number by serial number value
   * @param {string} serialNumber - Serial number value
   * @returns {Promise<Object>} Serial number object
   */
  async getBySerialNumber(serialNumber) {
    await delay(200);

    const sn = MOCK_SERIAL_NUMBERS.find((s) => s.serialNumber === serialNumber);
    if (!sn) {
      throw new Error(`Serial number ${serialNumber} not found`);
    }

    return { ...sn };
  },

  /**
   * Create a new serial number record
   * @param {Object} data - Serial number data
   * @returns {Promise<Object>} Created serial number
   */
  async createSerialNumber(data) {
    await delay(300);

    // Validation
    if (!data.serialNumber) {
      throw new Error('Serial number is required');
    }
    if (!data.productId) {
      throw new Error('Product ID is required');
    }

    // Check for duplicate serial number
    const existing = MOCK_SERIAL_NUMBERS.find((sn) => sn.serialNumber === data.serialNumber);
    if (existing) {
      throw new Error(`Serial number ${data.serialNumber} already exists`);
    }

    const newSerialNumber = {
      id: generateId(),
      serialNumber: data.serialNumber,
      productId: data.productId,
      productName: data.productName,
      productSku: data.productSku,
      batchNumber: data.batchNumber || null,
      locationId: data.locationId || null,
      locationName: data.locationName || null,
      expiryDate: data.expiryDate || null,
      status: 'in_stock',
      receivedDate: data.receivedDate ? new Date(data.receivedDate) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    MOCK_SERIAL_NUMBERS.push(newSerialNumber);
    return { ...newSerialNumber };
  },

  /**
   * Create multiple serial numbers (bulk)
   * @param {Array} serialNumbers - Array of serial number data
   * @returns {Promise<Array>} Created serial numbers
   */
  async createBulkSerialNumbers(serialNumbers) {
    await delay(500);

    const created = [];
    const errors = [];

    for (const data of serialNumbers) {
      try {
        const sn = await this.createSerialNumber(data);
        created.push(sn);
      } catch (error) {
        errors.push({ serialNumber: data.serialNumber, error: error.message });
      }
    }

    return { created, errors };
  },

  /**
   * Update serial number status
   * @param {string} id - Serial number ID
   * @param {string} status - New status
   * @param {Object} additionalData - Additional data (soldTo, soldDate, etc.)
   * @returns {Promise<Object>} Updated serial number
   */
  async updateStatus(id, status, additionalData = {}) {
    await delay(300);

    const index = MOCK_SERIAL_NUMBERS.findIndex((sn) => sn.id === id);
    if (index === -1) {
      throw new Error(`Serial number with ID ${id} not found`);
    }

    MOCK_SERIAL_NUMBERS[index] = {
      ...MOCK_SERIAL_NUMBERS[index],
      status,
      ...additionalData,
      updatedAt: new Date()
    };

    return { ...MOCK_SERIAL_NUMBERS[index] };
  },

  /**
   * Mark serial number as sold
   * @param {string} serialNumber - Serial number value
   * @param {Object} saleData - Sale data
   * @returns {Promise<Object>} Updated serial number
   */
  async markAsSold(serialNumber, saleData = {}) {
    await delay(300);

    const index = MOCK_SERIAL_NUMBERS.findIndex((sn) => sn.serialNumber === serialNumber);
    if (index === -1) {
      throw new Error(`Serial number ${serialNumber} not found`);
    }

    if (MOCK_SERIAL_NUMBERS[index].status !== 'in_stock') {
      throw new Error(`Serial number ${serialNumber} is not available (status: ${MOCK_SERIAL_NUMBERS[index].status})`);
    }

    MOCK_SERIAL_NUMBERS[index] = {
      ...MOCK_SERIAL_NUMBERS[index],
      status: 'sold',
      soldDate: new Date(),
      soldTo: saleData.customerId || saleData.customerName || null,
      saleReferenceId: saleData.saleId || null,
      updatedAt: new Date()
    };

    return { ...MOCK_SERIAL_NUMBERS[index] };
  },

  /**
   * Mark serial number as damaged
   * @param {string} serialNumber - Serial number value
   * @param {string} reason - Damage reason
   * @returns {Promise<Object>} Updated serial number
   */
  async markAsDamaged(serialNumber, reason) {
    await delay(300);

    const index = MOCK_SERIAL_NUMBERS.findIndex((sn) => sn.serialNumber === serialNumber);
    if (index === -1) {
      throw new Error(`Serial number ${serialNumber} not found`);
    }

    MOCK_SERIAL_NUMBERS[index] = {
      ...MOCK_SERIAL_NUMBERS[index],
      status: 'damaged',
      damageReason: reason,
      damagedDate: new Date(),
      updatedAt: new Date()
    };

    return { ...MOCK_SERIAL_NUMBERS[index] };
  },

  /**
   * Mark serial number as written off
   * @param {string} serialNumber - Serial number value
   * @param {string} reason - Write-off reason
   * @returns {Promise<Object>} Updated serial number
   */
  async markAsWrittenOff(serialNumber, reason) {
    await delay(300);

    const index = MOCK_SERIAL_NUMBERS.findIndex((sn) => sn.serialNumber === serialNumber);
    if (index === -1) {
      throw new Error(`Serial number ${serialNumber} not found`);
    }

    MOCK_SERIAL_NUMBERS[index] = {
      ...MOCK_SERIAL_NUMBERS[index],
      status: 'written_off',
      writeOffReason: reason,
      writtenOffDate: new Date(),
      updatedAt: new Date()
    };

    return { ...MOCK_SERIAL_NUMBERS[index] };
  },

  /**
   * Transfer serial number to different location
   * @param {string} serialNumber - Serial number value
   * @param {string} toLocationId - Destination location ID
   * @param {string} toLocationName - Destination location name
   * @returns {Promise<Object>} Updated serial number
   */
  async transferSerialNumber(serialNumber, toLocationId, toLocationName) {
    await delay(300);

    const index = MOCK_SERIAL_NUMBERS.findIndex((sn) => sn.serialNumber === serialNumber);
    if (index === -1) {
      throw new Error(`Serial number ${serialNumber} not found`);
    }

    if (MOCK_SERIAL_NUMBERS[index].status !== 'in_stock') {
      throw new Error(`Serial number ${serialNumber} cannot be transferred (status: ${MOCK_SERIAL_NUMBERS[index].status})`);
    }

    const fromLocation = MOCK_SERIAL_NUMBERS[index].locationName;

    MOCK_SERIAL_NUMBERS[index] = {
      ...MOCK_SERIAL_NUMBERS[index],
      locationId: toLocationId,
      locationName: toLocationName,
      status: 'transferred',
      transferredFrom: fromLocation,
      transferredDate: new Date(),
      updatedAt: new Date()
    };

    // After a brief period, set status back to in_stock at new location
    setTimeout(() => {
      const idx = MOCK_SERIAL_NUMBERS.findIndex((sn) => sn.serialNumber === serialNumber);
      if (idx !== -1) {
        MOCK_SERIAL_NUMBERS[idx].status = 'in_stock';
      }
    }, 1000);

    return { ...MOCK_SERIAL_NUMBERS[index] };
  },

  /**
   * Get serial number history
   * @param {string} serialNumber - Serial number value
   * @returns {Promise<Object>} Serial number with history
   */
  async getSerialNumberHistory(serialNumber) {
    await delay(300);

    const sn = MOCK_SERIAL_NUMBERS.find((s) => s.serialNumber === serialNumber);
    if (!sn) {
      throw new Error(`Serial number ${serialNumber} not found`);
    }

    // In a real implementation, this would fetch transaction history
    const history = [
      {
        date: sn.receivedDate,
        action: 'received',
        location: sn.locationName,
        notes: `Received in batch ${sn.batchNumber}`
      }
    ];

    if (sn.soldDate) {
      history.push({
        date: sn.soldDate,
        action: 'sold',
        location: sn.locationName,
        customer: sn.soldTo,
        notes: 'Item sold to customer'
      });
    }

    if (sn.transferredDate) {
      history.push({
        date: sn.transferredDate,
        action: 'transferred',
        fromLocation: sn.transferredFrom,
        toLocation: sn.locationName,
        notes: 'Inter-location transfer'
      });
    }

    return {
      serialNumber: { ...sn },
      history
    };
  },

  /**
   * Get serial number statistics
   * @returns {Promise<Object>} Serial number statistics
   */
  async getStats() {
    await delay(200);

    const stats = {
      total: MOCK_SERIAL_NUMBERS.length,
      in_stock: 0,
      sold: 0,
      damaged: 0,
      written_off: 0,
      transferred: 0,
      byProduct: {},
      byLocation: {}
    };

    MOCK_SERIAL_NUMBERS.forEach((sn) => {
      stats[sn.status]++;

      // By product
      if (!stats.byProduct[sn.productId]) {
        stats.byProduct[sn.productId] = {
          productName: sn.productName,
          productSku: sn.productSku,
          total: 0,
          in_stock: 0,
          sold: 0
        };
      }
      stats.byProduct[sn.productId].total++;
      if (sn.status === 'in_stock') {
        stats.byProduct[sn.productId].in_stock++;
      } else if (sn.status === 'sold') {
        stats.byProduct[sn.productId].sold++;
      }

      // By location
      if (sn.locationId) {
        if (!stats.byLocation[sn.locationId]) {
          stats.byLocation[sn.locationId] = {
            locationName: sn.locationName,
            total: 0,
            in_stock: 0
          };
        }
        stats.byLocation[sn.locationId].total++;
        if (sn.status === 'in_stock') {
          stats.byLocation[sn.locationId].in_stock++;
        }
      }
    });

    return stats;
  },

  /**
   * Verify serial number
   * @param {string} serialNumber - Serial number to verify
   * @returns {Promise<Object>} Verification result
   */
  async verifySerialNumber(serialNumber) {
    await delay(200);

    const sn = MOCK_SERIAL_NUMBERS.find((s) => s.serialNumber === serialNumber);

    if (!sn) {
      return {
        valid: false,
        exists: false,
        message: 'Serial number not found in system'
      };
    }

    return {
      valid: true,
      exists: true,
      serialNumber: { ...sn },
      message: `Valid serial number for ${sn.productName} (${sn.status})`
    };
  },

  /**
   * Delete serial number
   * @param {string} id - Serial number ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteSerialNumber(id) {
    await delay(300);

    const index = MOCK_SERIAL_NUMBERS.findIndex((sn) => sn.id === id);
    if (index === -1) {
      throw new Error(`Serial number with ID ${id} not found`);
    }

    MOCK_SERIAL_NUMBERS.splice(index, 1);
    return true;
  }
};

export default serialNumberService;
