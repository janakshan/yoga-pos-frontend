/**
 * Table Slice - Zustand store for table management
 * @module features/restaurant/tables/store/tableSlice
 */

/**
 * Creates the table slice for Zustand store
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} Table slice state and actions
 */
export const createTableSlice = (set, get) => ({
  // ============ State ============

  // Tables data
  tables: [],
  selectedTable: null,

  // Loading states
  tableLoading: false,
  tableError: null,

  // Filters
  tableFilters: {
    status: null,
    section: null,
    floor: null,
    assignedServer: null,
    minCapacity: null,
    maxCapacity: null,
    search: '',
  },

  // Statistics
  tableStats: {
    totalTables: 0,
    availableTables: 0,
    occupiedTables: 0,
    reservedTables: 0,
    cleaningTables: 0,
    outOfServiceTables: 0,
    occupancyRate: 0,
    averageTurnoverTime: 0,
  },

  // Sections and floors
  sections: [],
  floors: [],

  // ============ Mutations ============

  /**
   * Set tables list
   * @param {import('../types/table.types').Table[]} tables - Tables array
   */
  setTables: (tables) =>
    set((state) => {
      state.tables = tables;
    }),

  /**
   * Add new table
   * @param {import('../types/table.types').Table} table - Table to add
   */
  addTable: (table) =>
    set((state) => {
      state.tables.push(table);
    }),

  /**
   * Update existing table
   * @param {string} id - Table ID
   * @param {Partial<import('../types/table.types').Table>} updates - Updates to apply
   */
  updateTable: (id, updates) =>
    set((state) => {
      const index = state.tables.findIndex((t) => t.id === id);
      if (index !== -1) {
        state.tables[index] = {
          ...state.tables[index],
          ...updates,
          id,
          updatedAt: new Date(),
        };
      }
    }),

  /**
   * Remove table
   * @param {string} id - Table ID to remove
   */
  removeTable: (id) =>
    set((state) => {
      state.tables = state.tables.filter((t) => t.id !== id);
    }),

  /**
   * Set selected table
   * @param {import('../types/table.types').Table | null} table - Table to select
   */
  setSelectedTable: (table) =>
    set((state) => {
      state.selectedTable = table;
    }),

  /**
   * Clear selected table
   */
  clearSelectedTable: () =>
    set((state) => {
      state.selectedTable = null;
    }),

  /**
   * Set table filters
   * @param {import('../types/table.types').TableFilters} filters - Filters to apply
   */
  setTableFilters: (filters) =>
    set((state) => {
      state.tableFilters = { ...state.tableFilters, ...filters };
    }),

  /**
   * Clear table filters
   */
  clearTableFilters: () =>
    set((state) => {
      state.tableFilters = {
        status: null,
        section: null,
        floor: null,
        assignedServer: null,
        minCapacity: null,
        maxCapacity: null,
        search: '',
      };
    }),

  /**
   * Set table statistics
   * @param {import('../types/table.types').TableStats} stats - Statistics data
   */
  setTableStats: (stats) =>
    set((state) => {
      state.tableStats = stats;
    }),

  /**
   * Set sections list
   * @param {string[]} sections - Sections array
   */
  setSections: (sections) =>
    set((state) => {
      state.sections = sections;
    }),

  /**
   * Set floors list
   * @param {string[]} floors - Floors array
   */
  setFloors: (floors) =>
    set((state) => {
      state.floors = floors;
    }),

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setTableLoading: (loading) =>
    set((state) => {
      state.tableLoading = loading;
    }),

  /**
   * Set error state
   * @param {string | null} error - Error message
   */
  setTableError: (error) =>
    set((state) => {
      state.tableError = error;
    }),

  /**
   * Clear error
   */
  clearTableError: () =>
    set((state) => {
      state.tableError = null;
    }),

  // ============ Selectors ============

  /**
   * Get table by ID
   * @param {string} id - Table ID
   * @returns {import('../types/table.types').Table | undefined}
   */
  getTableById: (id) => {
    const state = get();
    return state.tables.find((t) => t.id === id);
  },

  /**
   * Get tables by status
   * @param {import('../types/table.types').TableStatus} status - Status to filter
   * @returns {import('../types/table.types').Table[]}
   */
  getTablesByStatus: (status) => {
    const state = get();
    return state.tables.filter((t) => t.status === status);
  },

  /**
   * Get tables by section
   * @param {string} section - Section name
   * @returns {import('../types/table.types').Table[]}
   */
  getTablesBySection: (section) => {
    const state = get();
    return state.tables.filter((t) => t.section === section);
  },

  /**
   * Get tables by floor
   * @param {string} floor - Floor name
   * @returns {import('../types/table.types').Table[]}
   */
  getTablesByFloor: (floor) => {
    const state = get();
    return state.tables.filter((t) => t.floor === floor);
  },

  /**
   * Get available tables
   * @returns {import('../types/table.types').Table[]}
   */
  getAvailableTables: () => {
    const state = get();
    return state.tables.filter((t) => t.status === 'available');
  },

  /**
   * Get occupied tables
   * @returns {import('../types/table.types').Table[]}
   */
  getOccupiedTables: () => {
    const state = get();
    return state.tables.filter((t) => t.status === 'occupied');
  },

  /**
   * Get tables assigned to a server
   * @param {string} serverId - Server ID
   * @returns {import('../types/table.types').Table[]}
   */
  getTablesByServer: (serverId) => {
    const state = get();
    return state.tables.filter((t) => t.assignedServer === serverId);
  },

  /**
   * Search tables by number or section
   * @param {string} query - Search query
   * @returns {import('../types/table.types').Table[]}
   */
  searchTables: (query) => {
    const state = get();
    const lowerQuery = query.toLowerCase();
    return state.tables.filter(
      (t) =>
        t.number.toLowerCase().includes(lowerQuery) ||
        t.section?.toLowerCase().includes(lowerQuery)
    );
  },
});

export default createTableSlice;
