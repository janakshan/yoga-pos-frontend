/**
 * Table Service - API operations for table management
 * @module features/restaurant/tables/services/tableService
 */

import axiosInstance from '@/lib/axios';

/**
 * Mock data for development
 * TODO: Replace with real API calls
 */
const mockTables = [
  {
    id: 't1',
    number: 'T1',
    capacity: 4,
    status: 'available',
    shape: 'square',
    section: 'Main Dining',
    floor: 'Ground Floor',
    position: { x: 100, y: 100 },
    dimensions: { width: 80, height: 80 },
    rotation: 0,
    branchId: 'branch1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 't2',
    number: 'T2',
    capacity: 2,
    status: 'occupied',
    shape: 'round',
    section: 'Main Dining',
    floor: 'Ground Floor',
    assignedServer: 'server1',
    currentOrderId: 'order1',
    position: { x: 220, y: 100 },
    dimensions: { width: 60, height: 60 },
    rotation: 0,
    lastOccupied: new Date(),
    branchId: 'branch1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 't3',
    number: 'T3',
    capacity: 6,
    status: 'reserved',
    shape: 'rectangle',
    section: 'Main Dining',
    floor: 'Ground Floor',
    position: { x: 320, y: 100 },
    dimensions: { width: 120, height: 80 },
    rotation: 0,
    reservedAt: new Date(Date.now() + 3600000),
    reservedFor: 'John Doe',
    reservedPhone: '555-0123',
    branchId: 'branch1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 't4',
    number: 'T4',
    capacity: 8,
    status: 'available',
    shape: 'rectangle',
    section: 'VIP',
    floor: 'Ground Floor',
    position: { x: 100, y: 220 },
    dimensions: { width: 140, height: 100 },
    rotation: 0,
    branchId: 'branch1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 't5',
    number: 'T5',
    capacity: 4,
    status: 'cleaning',
    shape: 'square',
    section: 'Patio',
    floor: 'Ground Floor',
    position: { x: 280, y: 220 },
    dimensions: { width: 80, height: 80 },
    rotation: 0,
    notes: 'Deep cleaning in progress',
    branchId: 'branch1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 't6',
    number: 'B1',
    capacity: 3,
    status: 'occupied',
    shape: 'bar',
    section: 'Bar',
    floor: 'Ground Floor',
    assignedServer: 'server2',
    currentOrderId: 'order2',
    position: { x: 400, y: 220 },
    dimensions: { width: 100, height: 40 },
    rotation: 0,
    lastOccupied: new Date(),
    branchId: 'branch1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

let tablesData = [...mockTables];

/**
 * Simulates API delay
 */
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate unique ID
 */
const generateId = () => `t${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

/**
 * Table Service API
 */
export const tableService = {
  /**
   * Get all tables with optional filters
   * @param {import('../types/table.types').TableFilters} [filters] - Filter options
   * @returns {Promise<import('../types/table.types').Table[]>}
   */
  getList: async (filters = {}) => {
    await delay();

    let filtered = [...tablesData];

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(t => t.status === filters.status);
    }
    if (filters.section) {
      filtered = filtered.filter(t => t.section === filters.section);
    }
    if (filters.floor) {
      filtered = filtered.filter(t => t.floor === filters.floor);
    }
    if (filters.assignedServer) {
      filtered = filtered.filter(t => t.assignedServer === filters.assignedServer);
    }
    if (filters.minCapacity) {
      filtered = filtered.filter(t => t.capacity >= filters.minCapacity);
    }
    if (filters.maxCapacity) {
      filtered = filtered.filter(t => t.capacity <= filters.maxCapacity);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(t =>
        t.number.toLowerCase().includes(search) ||
        t.section?.toLowerCase().includes(search)
      );
    }

    return {
      data: filtered,
      total: filtered.length,
    };
  },

  /**
   * Get table by ID
   * @param {string} id - Table ID
   * @returns {Promise<import('../types/table.types').Table>}
   */
  getById: async (id) => {
    await delay();
    const table = tablesData.find(t => t.id === id);
    if (!table) {
      throw new Error(`Table with ID ${id} not found`);
    }
    return table;
  },

  /**
   * Create new table
   * @param {Partial<import('../types/table.types').Table>} data - Table data
   * @returns {Promise<import('../types/table.types').Table>}
   */
  create: async (data) => {
    await delay();

    const newTable = {
      id: generateId(),
      number: data.number,
      capacity: data.capacity,
      status: data.status || 'available',
      shape: data.shape || 'square',
      section: data.section,
      floor: data.floor,
      position: data.position || { x: 0, y: 0 },
      dimensions: data.dimensions || { width: 80, height: 80 },
      rotation: data.rotation || 0,
      notes: data.notes,
      branchId: data.branchId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tablesData.push(newTable);
    return newTable;
  },

  /**
   * Update existing table
   * @param {string} id - Table ID
   * @param {Partial<import('../types/table.types').Table>} data - Updated data
   * @returns {Promise<import('../types/table.types').Table>}
   */
  update: async (id, data) => {
    await delay();

    const index = tablesData.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Table with ID ${id} not found`);
    }

    const updatedTable = {
      ...tablesData[index],
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    tablesData[index] = updatedTable;
    return updatedTable;
  },

  /**
   * Delete table
   * @param {string} id - Table ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    await delay();

    const index = tablesData.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Table with ID ${id} not found`);
    }

    tablesData.splice(index, 1);
    return { success: true, message: 'Table deleted successfully' };
  },

  /**
   * Update table status
   * @param {import('../types/table.types').TableStatusUpdate} statusUpdate - Status update data
   * @returns {Promise<import('../types/table.types').Table>}
   */
  updateStatus: async (statusUpdate) => {
    await delay();

    const { tableId, status, ...rest } = statusUpdate;

    return tableService.update(tableId, {
      status,
      ...rest,
      ...(status === 'occupied' && { lastOccupied: new Date() }),
      ...(status === 'available' && {
        currentOrderId: null,
        assignedServer: null,
        lastOccupied: new Date(),
      }),
    });
  },

  /**
   * Assign server to table
   * @param {string} tableId - Table ID
   * @param {string} serverId - Server ID
   * @returns {Promise<import('../types/table.types').Table>}
   */
  assignServer: async (tableId, serverId) => {
    await delay();
    return tableService.update(tableId, { assignedServer: serverId });
  },

  /**
   * Combine tables
   * @param {string[]} tableIds - Array of table IDs to combine
   * @returns {Promise<import('../types/table.types').TableCombination>}
   */
  combineTables: async (tableIds) => {
    await delay();

    const tables = tablesData.filter(t => tableIds.includes(t.id));
    if (tables.length !== tableIds.length) {
      throw new Error('Some tables not found');
    }

    const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0);
    const combination = {
      id: `comb_${generateId()}`,
      tableIds,
      totalCapacity,
      status: 'available',
      createdAt: new Date(),
    };

    // Update tables to mark as combined
    for (const tableId of tableIds) {
      await tableService.update(tableId, {
        isCombined: true,
        combinedWith: tableIds.filter(id => id !== tableId),
      });
    }

    return combination;
  },

  /**
   * Separate combined tables
   * @param {string[]} tableIds - Array of table IDs to separate
   * @returns {Promise<{success: boolean}>}
   */
  separateTables: async (tableIds) => {
    await delay();

    for (const tableId of tableIds) {
      await tableService.update(tableId, {
        isCombined: false,
        combinedWith: null,
      });
    }

    return { success: true };
  },

  /**
   * Get table statistics
   * @param {Object} [filters] - Optional filters
   * @returns {Promise<import('../types/table.types').TableStats>}
   */
  getStats: async (filters = {}) => {
    await delay();

    const { data: tables } = await tableService.getList(filters);

    const stats = {
      totalTables: tables.length,
      availableTables: tables.filter(t => t.status === 'available').length,
      occupiedTables: tables.filter(t => t.status === 'occupied').length,
      reservedTables: tables.filter(t => t.status === 'reserved').length,
      cleaningTables: tables.filter(t => t.status === 'cleaning').length,
      outOfServiceTables: tables.filter(t => t.status === 'out-of-service').length,
    };

    stats.occupancyRate = tables.length > 0
      ? Math.round((stats.occupiedTables / tables.length) * 100)
      : 0;

    stats.averageTurnoverTime = 45; // Mock value in minutes

    return stats;
  },

  /**
   * Get sections (unique section names)
   * @returns {Promise<string[]>}
   */
  getSections: async () => {
    await delay();
    const sections = [...new Set(tablesData.map(t => t.section).filter(Boolean))];
    return sections;
  },

  /**
   * Get floors (unique floor names)
   * @returns {Promise<string[]>}
   */
  getFloors: async () => {
    await delay();
    const floors = [...new Set(tablesData.map(t => t.floor).filter(Boolean))];
    return floors;
  },
};

export default tableService;
