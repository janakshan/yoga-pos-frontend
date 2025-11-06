import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import { supplierService } from '../services/supplierService.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for supplier operations
 * Provides supplier state and operations with error handling
 */
export const useSuppliers = () => {
  // Get state
  const suppliers = useStore((state) => state.suppliers);
  const selectedSupplier = useStore((state) => state.selectedSupplier);
  const isLoading = useStore((state) => state.supplierLoading);
  const error = useStore((state) => state.supplierError);
  const stats = useStore((state) => state.supplierStats);

  // Get mutations
  const setSuppliers = useStore((state) => state.setSuppliers);
  const setSelectedSupplier = useStore((state) => state.setSelectedSupplier);
  const setSupplierLoading = useStore((state) => state.setSupplierLoading);
  const setSupplierError = useStore((state) => state.setSupplierError);
  const setSupplierStats = useStore((state) => state.setSupplierStats);
  const addSupplier = useStore((state) => state.addSupplier);
  const updateSupplier = useStore((state) => state.updateSupplier);
  const removeSupplier = useStore((state) => state.removeSupplier);
  const updateSupplierStatus = useStore((state) => state.updateSupplierStatus);

  // Get getters
  const getSupplierById = useStore((state) => state.getSupplierById);
  const getActiveSuppliers = useStore((state) => state.getActiveSuppliers);

  /**
   * Fetch all suppliers
   */
  const fetchSuppliers = useCallback(
    async (filters = {}) => {
      try {
        setSupplierLoading(true);
        setSupplierError(null);
        const data = await supplierService.getList(filters);
        setSuppliers(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch suppliers';
        setSupplierError(message);
        toast.error(message);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [setSuppliers, setSupplierLoading, setSupplierError]
  );

  /**
   * Fetch supplier by ID
   */
  const fetchSupplierById = useCallback(
    async (id) => {
      try {
        setSupplierLoading(true);
        setSupplierError(null);
        const data = await supplierService.getById(id);
        setSelectedSupplier(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch supplier';
        setSupplierError(message);
        toast.error(message);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [setSelectedSupplier, setSupplierLoading, setSupplierError]
  );

  /**
   * Create new supplier
   */
  const createSupplier = useCallback(
    async (data) => {
      try {
        setSupplierLoading(true);
        setSupplierError(null);
        const newSupplier = await supplierService.create(data);
        addSupplier(newSupplier);
        toast.success('Supplier created successfully');
        return newSupplier;
      } catch (err) {
        const message = err.message || 'Failed to create supplier';
        setSupplierError(message);
        toast.error(message);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [addSupplier, setSupplierLoading, setSupplierError]
  );

  /**
   * Update supplier
   */
  const updateSupplierById = useCallback(
    async (id, data) => {
      try {
        setSupplierLoading(true);
        setSupplierError(null);
        const updated = await supplierService.update(id, data);
        updateSupplier(id, updated);
        toast.success('Supplier updated successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update supplier';
        setSupplierError(message);
        toast.error(message);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [updateSupplier, setSupplierLoading, setSupplierError]
  );

  /**
   * Delete supplier
   */
  const deleteSupplier = useCallback(
    async (id) => {
      try {
        setSupplierLoading(true);
        setSupplierError(null);
        await supplierService.remove(id);
        removeSupplier(id);
        toast.success('Supplier deleted successfully');
      } catch (err) {
        const message = err.message || 'Failed to delete supplier';
        setSupplierError(message);
        toast.error(message);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [removeSupplier, setSupplierLoading, setSupplierError]
  );

  /**
   * Update supplier status
   */
  const changeSupplierStatus = useCallback(
    async (id, status) => {
      try {
        setSupplierLoading(true);
        setSupplierError(null);
        const updated = await supplierService.updateStatus(id, status);
        updateSupplierStatus(id, status);
        toast.success(`Supplier status updated to ${status}`);
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update supplier status';
        setSupplierError(message);
        toast.error(message);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [updateSupplierStatus, setSupplierLoading, setSupplierError]
  );

  /**
   * Fetch supplier statistics
   */
  const fetchSupplierStats = useCallback(async () => {
    try {
      setSupplierLoading(true);
      setSupplierError(null);
      const data = await supplierService.getStats();
      setSupplierStats(data);
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch supplier statistics';
      setSupplierError(message);
      toast.error(message);
      throw err;
    } finally {
      setSupplierLoading(false);
    }
  }, [setSupplierStats, setSupplierLoading, setSupplierError]);

  /**
   * Get top suppliers
   */
  const fetchTopSuppliers = useCallback(
    async (metric = 'totalAmount', limit = 5) => {
      try {
        setSupplierLoading(true);
        setSupplierError(null);
        const data = await supplierService.getTopSuppliers(metric, limit);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch top suppliers';
        setSupplierError(message);
        toast.error(message);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [setSupplierLoading, setSupplierError]
  );

  /**
   * Add contact to supplier
   */
  const addSupplierContact = useCallback(
    async (id, contact) => {
      try {
        setSupplierLoading(true);
        setSupplierError(null);
        const updated = await supplierService.addContact(id, contact);
        updateSupplier(id, updated);
        toast.success('Contact added successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to add contact';
        setSupplierError(message);
        toast.error(message);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [updateSupplier, setSupplierLoading, setSupplierError]
  );

  /**
   * Remove contact from supplier
   */
  const removeSupplierContact = useCallback(
    async (id, contactIndex) => {
      try {
        setSupplierLoading(true);
        setSupplierError(null);
        const updated = await supplierService.removeContact(id, contactIndex);
        updateSupplier(id, updated);
        toast.success('Contact removed successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to remove contact';
        setSupplierError(message);
        toast.error(message);
        throw err;
      } finally {
        setSupplierLoading(false);
      }
    },
    [updateSupplier, setSupplierLoading, setSupplierError]
  );

  return {
    // State
    suppliers,
    selectedSupplier,
    isLoading,
    error,
    stats,

    // Operations
    fetchSuppliers,
    fetchSupplierById,
    createSupplier,
    updateSupplierById,
    deleteSupplier,
    changeSupplierStatus,
    fetchSupplierStats,
    fetchTopSuppliers,
    addSupplierContact,
    removeSupplierContact,
    setSelectedSupplier,

    // Getters
    getSupplierById,
    getActiveSuppliers,
  };
};
