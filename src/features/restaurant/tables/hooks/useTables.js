/**
 * useTables Hook - React hook for table management
 * @module features/restaurant/tables/hooks/useTables
 */

import { useCallback } from 'react';
import { useStore } from '@/store';
import tableService from '../services/tableService';
import toast from 'react-hot-toast';

/**
 * Custom hook for table management
 * @returns {Object} Table state and operations
 */
export const useTables = () => {
  // Select state from store
  const tables = useStore((state) => state.tables);
  const selectedTable = useStore((state) => state.selectedTable);
  const tableFilters = useStore((state) => state.tableFilters);
  const tableStats = useStore((state) => state.tableStats);
  const sections = useStore((state) => state.sections);
  const floors = useStore((state) => state.floors);
  const isLoading = useStore((state) => state.tableLoading);
  const error = useStore((state) => state.tableError);

  // Select actions from store
  const setTables = useStore((state) => state.setTables);
  const addTable = useStore((state) => state.addTable);
  const updateTable = useStore((state) => state.updateTable);
  const removeTable = useStore((state) => state.removeTable);
  const setSelectedTable = useStore((state) => state.setSelectedTable);
  const clearSelectedTable = useStore((state) => state.clearSelectedTable);
  const setTableFilters = useStore((state) => state.setTableFilters);
  const clearTableFilters = useStore((state) => state.clearTableFilters);
  const setTableStats = useStore((state) => state.setTableStats);
  const setSections = useStore((state) => state.setSections);
  const setFloors = useStore((state) => state.setFloors);
  const setTableLoading = useStore((state) => state.setTableLoading);
  const setTableError = useStore((state) => state.setTableError);
  const clearTableError = useStore((state) => state.clearTableError);

  // Select selectors from store
  const getTableById = useStore((state) => state.getTableById);
  const getTablesByStatus = useStore((state) => state.getTablesByStatus);
  const getTablesBySection = useStore((state) => state.getTablesBySection);
  const getTablesByFloor = useStore((state) => state.getTablesByFloor);
  const getAvailableTables = useStore((state) => state.getAvailableTables);
  const getOccupiedTables = useStore((state) => state.getOccupiedTables);
  const searchTables = useStore((state) => state.searchTables);

  /**
   * Fetch tables from API
   */
  const fetchTables = useCallback(
    async (filters = {}) => {
      try {
        setTableLoading(true);
        clearTableError();

        const response = await tableService.getList(filters);
        setTables(response.data);

        return response.data;
      } catch (err) {
        const message = err.message || 'Failed to load tables';
        setTableError(message);
        toast.error(message);
        throw err;
      } finally {
        setTableLoading(false);
      }
    },
    [setTableLoading, clearTableError, setTables, setTableError]
  );

  /**
   * Fetch table by ID
   */
  const fetchTableById = useCallback(
    async (id) => {
      try {
        setTableLoading(true);
        clearTableError();

        const table = await tableService.getById(id);
        setSelectedTable(table);

        return table;
      } catch (err) {
        const message = err.message || 'Failed to load table';
        setTableError(message);
        toast.error(message);
        throw err;
      } finally {
        setTableLoading(false);
      }
    },
    [setTableLoading, clearTableError, setSelectedTable, setTableError]
  );

  /**
   * Create new table
   */
  const createTable = useCallback(
    async (data) => {
      try {
        setTableLoading(true);
        clearTableError();

        const newTable = await tableService.create(data);
        addTable(newTable);

        toast.success('Table created successfully');
        return newTable;
      } catch (err) {
        const message = err.message || 'Failed to create table';
        setTableError(message);
        toast.error(message);
        throw err;
      } finally {
        setTableLoading(false);
      }
    },
    [setTableLoading, clearTableError, addTable, setTableError]
  );

  /**
   * Update existing table
   */
  const updateTableData = useCallback(
    async (id, data) => {
      try {
        setTableLoading(true);
        clearTableError();

        const updatedTable = await tableService.update(id, data);
        updateTable(id, updatedTable);

        toast.success('Table updated successfully');
        return updatedTable;
      } catch (err) {
        const message = err.message || 'Failed to update table';
        setTableError(message);
        toast.error(message);
        throw err;
      } finally {
        setTableLoading(false);
      }
    },
    [setTableLoading, clearTableError, updateTable, setTableError]
  );

  /**
   * Delete table
   */
  const deleteTable = useCallback(
    async (id) => {
      try {
        setTableLoading(true);
        clearTableError();

        await tableService.delete(id);
        removeTable(id);

        toast.success('Table deleted successfully');
      } catch (err) {
        const message = err.message || 'Failed to delete table';
        setTableError(message);
        toast.error(message);
        throw err;
      } finally {
        setTableLoading(false);
      }
    },
    [setTableLoading, clearTableError, removeTable, setTableError]
  );

  /**
   * Update table status
   */
  const updateStatus = useCallback(
    async (statusUpdate) => {
      try {
        setTableLoading(true);
        clearTableError();

        const updatedTable = await tableService.updateStatus(statusUpdate);
        updateTable(statusUpdate.tableId, updatedTable);

        toast.success('Table status updated');
        return updatedTable;
      } catch (err) {
        const message = err.message || 'Failed to update table status';
        setTableError(message);
        toast.error(message);
        throw err;
      } finally {
        setTableLoading(false);
      }
    },
    [setTableLoading, clearTableError, updateTable, setTableError]
  );

  /**
   * Assign server to table
   */
  const assignServer = useCallback(
    async (tableId, serverId) => {
      try {
        setTableLoading(true);
        clearTableError();

        const updatedTable = await tableService.assignServer(tableId, serverId);
        updateTable(tableId, updatedTable);

        toast.success('Server assigned to table');
        return updatedTable;
      } catch (err) {
        const message = err.message || 'Failed to assign server';
        setTableError(message);
        toast.error(message);
        throw err;
      } finally {
        setTableLoading(false);
      }
    },
    [setTableLoading, clearTableError, updateTable, setTableError]
  );

  /**
   * Combine tables
   */
  const combineTables = useCallback(
    async (tableIds) => {
      try {
        setTableLoading(true);
        clearTableError();

        const combination = await tableService.combineTables(tableIds);

        // Refresh tables to get updated combination status
        await fetchTables(tableFilters);

        toast.success('Tables combined successfully');
        return combination;
      } catch (err) {
        const message = err.message || 'Failed to combine tables';
        setTableError(message);
        toast.error(message);
        throw err;
      } finally {
        setTableLoading(false);
      }
    },
    [setTableLoading, clearTableError, fetchTables, tableFilters, setTableError]
  );

  /**
   * Separate combined tables
   */
  const separateTables = useCallback(
    async (tableIds) => {
      try {
        setTableLoading(true);
        clearTableError();

        await tableService.separateTables(tableIds);

        // Refresh tables to get updated status
        await fetchTables(tableFilters);

        toast.success('Tables separated successfully');
      } catch (err) {
        const message = err.message || 'Failed to separate tables';
        setTableError(message);
        toast.error(message);
        throw err;
      } finally {
        setTableLoading(false);
      }
    },
    [setTableLoading, clearTableError, fetchTables, tableFilters, setTableError]
  );

  /**
   * Fetch table statistics
   */
  const fetchStats = useCallback(
    async (filters = {}) => {
      try {
        const stats = await tableService.getStats(filters);
        setTableStats(stats);
        return stats;
      } catch (err) {
        const message = err.message || 'Failed to load statistics';
        toast.error(message);
        throw err;
      }
    },
    [setTableStats]
  );

  /**
   * Fetch sections list
   */
  const fetchSections = useCallback(async () => {
    try {
      const sectionsList = await tableService.getSections();
      setSections(sectionsList);
      return sectionsList;
    } catch (err) {
      const message = err.message || 'Failed to load sections';
      toast.error(message);
      throw err;
    }
  }, [setSections]);

  /**
   * Fetch floors list
   */
  const fetchFloors = useCallback(async () => {
    try {
      const floorsList = await tableService.getFloors();
      setFloors(floorsList);
      return floorsList;
    } catch (err) {
      const message = err.message || 'Failed to load floors';
      toast.error(message);
      throw err;
    }
  }, [setFloors]);

  /**
   * Apply filters to tables
   */
  const applyFilters = useCallback(
    async (filters) => {
      setTableFilters(filters);
      await fetchTables(filters);
    },
    [setTableFilters, fetchTables]
  );

  return {
    // State
    tables,
    selectedTable,
    tableFilters,
    tableStats,
    sections,
    floors,
    isLoading,
    error,

    // Actions
    fetchTables,
    fetchTableById,
    createTable,
    updateTable: updateTableData,
    deleteTable,
    updateStatus,
    assignServer,
    combineTables,
    separateTables,
    fetchStats,
    fetchSections,
    fetchFloors,
    applyFilters,

    // Store actions
    setSelectedTable,
    clearSelectedTable,
    setTableFilters,
    clearTableFilters,
    clearError: clearTableError,

    // Selectors
    getTableById,
    getTablesByStatus,
    getTablesBySection,
    getTablesByFloor,
    getAvailableTables,
    getOccupiedTables,
    searchTables,
  };
};

export default useTables;
