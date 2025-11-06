/**
 * useSuppliers Hook
 * Custom hook for supplier management operations
 */

import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import { supplierService } from '../services/supplierService.js';
import toast from 'react-hot-toast';

export const useSuppliers = () => {
  // State selectors
  const suppliers = useStore((state) => state.suppliers);
  const selectedSupplier = useStore((state) => state.selectedSupplier);
  const isLoading = useStore((state) => state.supplierLoading);
  const error = useStore((state) => state.supplierError);
  const stats = useStore((state) => state.supplierStats);

  // Action creators
  const setSuppliers = useStore((state) => state.setSuppliers);
  const addSupplier = useStore((state) => state.addSupplier);
  const updateSupplier = useStore((state) => state.updateSupplier);
  const deleteSupplier = useStore((state) => state.deleteSupplier);
  const setSelectedSupplier = useStore((state) => state.setSelectedSupplier);
  const updateSupplierPerformance = useStore(
    (state) => state.updateSupplierPerformance
  );
  const bulkUpdateSupplierStatus = useStore(
    (state) => state.bulkUpdateSupplierStatus
  );
  const setSupplierLoading = useStore((state) => state.setSupplierLoading);
  const setSupplierError = useStore((state) => state.setSupplierError);
  const clearSupplierError = useStore((state) => state.clearSupplierError);

  // Getters
  const getSupplierById = useStore((state) => state.getSupplierById);
  const getSupplierByCode = useStore((state) => state.getSupplierByCode);
  const getActiveSuppliers = useStore((state) => state.getActiveSuppliers);
  const getSuppliersByCategory = useStore(
    (state) => state.getSuppliersByCategory
  );
  const getTopSuppliers = useStore((state) => state.getTopSuppliers);
  const searchSuppliers = useStore((state) => state.searchSuppliers);

  /**
   * Fetch all suppliers
   */
  const fetchSuppliers = useCallback(
    async (filters = {}) => {
      try {
        setSupplierLoading(true);
        clearSupplierError();
        const data = await supplierService.getList(filters);
        setSuppliers(data);
        return data;
      } catch (err) {
        setSupplierError(err.message);
        toast.error(`Failed to fetch suppliers: ${err.message}`);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [setSuppliers, setSupplierLoading, setSupplierError, clearSupplierError]
  );

  /**
   * Fetch supplier by ID
   */
  const fetchSupplierById = useCallback(
    async (id) => {
      try {
        setSupplierLoading(true);
        clearSupplierError();
        const data = await supplierService.getById(id);
        setSelectedSupplier(data);
        return data;
      } catch (err) {
        setSupplierError(err.message);
        toast.error(`Failed to fetch supplier: ${err.message}`);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [setSelectedSupplier, setSupplierLoading, setSupplierError, clearSupplierError]
  );

  /**
   * Create a new supplier
   */
  const createSupplier = useCallback(
    async (data) => {
      try {
        setSupplierLoading(true);
        clearSupplierError();
        const newSupplier = await supplierService.create(data);
        addSupplier(newSupplier);
        toast.success('Supplier created successfully');
        return newSupplier;
      } catch (err) {
        setSupplierError(err.message);
        toast.error(`Failed to create supplier: ${err.message}`);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [addSupplier, setSupplierLoading, setSupplierError, clearSupplierError]
  );

  /**
   * Update an existing supplier
   */
  const updateSupplierData = useCallback(
    async (id, data) => {
      try {
        setSupplierLoading(true);
        clearSupplierError();
        const updatedSupplier = await supplierService.update(id, data);
        updateSupplier(id, updatedSupplier);
        toast.success('Supplier updated successfully');
        return updatedSupplier;
      } catch (err) {
        setSupplierError(err.message);
        toast.error(`Failed to update supplier: ${err.message}`);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [updateSupplier, setSupplierLoading, setSupplierError, clearSupplierError]
  );

  /**
   * Delete a supplier
   */
  const removeSupplier = useCallback(
    async (id) => {
      try {
        setSupplierLoading(true);
        clearSupplierError();
        await supplierService.remove(id);
        deleteSupplier(id);
        toast.success('Supplier deleted successfully');
        return true;
      } catch (err) {
        setSupplierError(err.message);
        toast.error(`Failed to delete supplier: ${err.message}`);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [deleteSupplier, setSupplierLoading, setSupplierError, clearSupplierError]
  );

  /**
   * Bulk update supplier status
   */
  const bulkUpdateStatus = useCallback(
    async (ids, status) => {
      try {
        setSupplierLoading(true);
        clearSupplierError();
        const count = await supplierService.bulkUpdateStatus(ids, status);
        bulkUpdateSupplierStatus(ids, status);
        toast.success(`Updated status for ${count} supplier(s)`);
        return count;
      } catch (err) {
        setSupplierError(err.message);
        toast.error(`Failed to update status: ${err.message}`);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [
      bulkUpdateSupplierStatus,
      setSupplierLoading,
      setSupplierError,
      clearSupplierError
    ]
  );

  /**
   * Update supplier performance
   */
  const updatePerformance = useCallback(
    async (id, performanceData) => {
      try {
        await supplierService.updatePerformance(id, performanceData);
        updateSupplierPerformance(id, performanceData);
        return true;
      } catch (err) {
        toast.error(`Failed to update performance: ${err.message}`);
        throw err;
      }
    },
    [updateSupplierPerformance]
  );

  /**
   * Get supplier statistics
   */
  const fetchStatistics = useCallback(async () => {
    try {
      const statistics = await supplierService.getStatistics();
      return statistics;
    } catch (err) {
      toast.error(`Failed to fetch statistics: ${err.message}`);
      throw err;
    }
  }, []);

  /**
   * Get active suppliers list
   */
  const fetchActiveSuppliers = useCallback(async () => {
    try {
      const activeList = await supplierService.getActiveList();
      return activeList;
    } catch (err) {
      toast.error(`Failed to fetch active suppliers: ${err.message}`);
      throw err;
    }
  }, []);

  return {
    // State
    suppliers,
    selectedSupplier,
    isLoading,
    error,
    stats,

    // Actions
    fetchSuppliers,
    fetchSupplierById,
    createSupplier,
    updateSupplierData,
    removeSupplier,
    bulkUpdateStatus,
    updatePerformance,
    fetchStatistics,
    fetchActiveSuppliers,
    setSelectedSupplier,
    clearSupplierError,

    // Getters
    getSupplierById,
    getSupplierByCode,
    getActiveSuppliers,
    getSuppliersByCategory,
    getTopSuppliers,
    searchSuppliers
  };
};
