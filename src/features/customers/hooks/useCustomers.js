import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import toast from 'react-hot-toast';
import { customerService } from '../services/customerService.js';

/**
 * Custom hook for customer operations
 * Provides access to customer state and operations with error handling
 */
export const useCustomers = () => {
  // State selectors
  const customers = useStore((state) => state.customers);
  const selectedCustomer = useStore((state) => state.selectedCustomer);
  const isLoading = useStore((state) => state.customerLoading);
  const error = useStore((state) => state.customerError);
  const stats = useStore((state) => state.customerStats);

  // Action selectors
  const setCustomers = useStore((state) => state.setCustomers);
  const addCustomer = useStore((state) => state.addCustomer);
  const updateCustomer = useStore((state) => state.updateCustomer);
  const removeCustomer = useStore((state) => state.removeCustomer);
  const setSelectedCustomer = useStore((state) => state.setSelectedCustomer);
  const clearSelectedCustomer = useStore((state) => state.clearSelectedCustomer);
  const setCustomerLoading = useStore((state) => state.setCustomerLoading);
  const setCustomerError = useStore((state) => state.setCustomerError);
  const setCustomerStats = useStore((state) => state.setCustomerStats);
  const bulkUpdateCustomers = useStore((state) => state.bulkUpdateCustomers);
  const bulkDeleteCustomers = useStore((state) => state.bulkDeleteCustomers);

  // Getter functions
  const getCustomerById = useStore((state) => state.getCustomerById);
  const getActiveCustomers = useStore((state) => state.getActiveCustomers);
  const getVIPCustomers = useStore((state) => state.getVIPCustomers);
  const getCustomersByType = useStore((state) => state.getCustomersByType);
  const getCustomersByStatus = useStore((state) => state.getCustomersByStatus);
  const getCustomersByLoyaltyTier = useStore((state) => state.getCustomersByLoyaltyTier);
  const searchCustomers = useStore((state) => state.searchCustomers);
  const getTopCustomers = useStore((state) => state.getTopCustomers);
  const getRecentCustomers = useStore((state) => state.getRecentCustomers);
  const getCustomerFullName = useStore((state) => state.getCustomerFullName);

  /**
   * Fetch customers with optional filters
   */
  const fetchCustomers = useCallback(
    async (filters = {}) => {
      try {
        setCustomerLoading(true);
        setCustomerError(null);
        const data = await customerService.getList(filters);
        setCustomers(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch customers';
        setCustomerError(message);
        toast.error(message);
        throw err;
      } finally {
        setCustomerLoading(false);
      }
    },
    [setCustomers, setCustomerLoading, setCustomerError]
  );

  /**
   * Fetch customer statistics
   */
  const fetchCustomerStats = useCallback(async () => {
    try {
      const data = await customerService.getStats();
      setCustomerStats(data);
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch customer statistics';
      toast.error(message);
      throw err;
    }
  }, [setCustomerStats]);

  /**
   * Create new customer
   */
  const createCustomer = useCallback(
    async (data) => {
      try {
        setCustomerLoading(true);
        setCustomerError(null);
        const newCustomer = await customerService.create(data);
        addCustomer(newCustomer);
        toast.success('Customer created successfully');
        return newCustomer;
      } catch (err) {
        const message = err.message || 'Failed to create customer';
        setCustomerError(message);
        toast.error(message);
        throw err;
      } finally {
        setCustomerLoading(false);
      }
    },
    [addCustomer, setCustomerLoading, setCustomerError]
  );

  /**
   * Update existing customer
   */
  const updateCustomerById = useCallback(
    async (id, data) => {
      try {
        setCustomerLoading(true);
        setCustomerError(null);
        const updatedCustomer = await customerService.update(id, data);
        updateCustomer(id, updatedCustomer);
        toast.success('Customer updated successfully');
        return updatedCustomer;
      } catch (err) {
        const message = err.message || 'Failed to update customer';
        setCustomerError(message);
        toast.error(message);
        throw err;
      } finally {
        setCustomerLoading(false);
      }
    },
    [updateCustomer, setCustomerLoading, setCustomerError]
  );

  /**
   * Delete customer
   */
  const deleteCustomer = useCallback(
    async (id) => {
      try {
        setCustomerLoading(true);
        setCustomerError(null);
        await customerService.remove(id);
        removeCustomer(id);
        toast.success('Customer deleted successfully');
        return true;
      } catch (err) {
        const message = err.message || 'Failed to delete customer';
        setCustomerError(message);
        toast.error(message);
        throw err;
      } finally {
        setCustomerLoading(false);
      }
    },
    [removeCustomer, setCustomerLoading, setCustomerError]
  );

  /**
   * Select a customer
   */
  const selectCustomer = useCallback(
    async (id) => {
      try {
        const customer = await customerService.getById(id);
        if (customer) {
          setSelectedCustomer(customer);
          return customer;
        }
        throw new Error('Customer not found');
      } catch (err) {
        const message = err.message || 'Failed to select customer';
        toast.error(message);
        throw err;
      }
    },
    [setSelectedCustomer]
  );

  /**
   * Update customer loyalty points
   */
  const updateLoyaltyPoints = useCallback(
    async (id, pointsChange) => {
      try {
        const updatedCustomer = await customerService.updateLoyaltyPoints(id, pointsChange);
        updateCustomer(id, updatedCustomer);
        toast.success(
          `Loyalty points ${pointsChange > 0 ? 'added' : 'deducted'} successfully`
        );
        return updatedCustomer;
      } catch (err) {
        const message = err.message || 'Failed to update loyalty points';
        toast.error(message);
        throw err;
      }
    },
    [updateCustomer]
  );

  /**
   * Update customer purchase statistics
   */
  const updatePurchaseStats = useCallback(
    async (id, amount) => {
      try {
        const updatedCustomer = await customerService.updatePurchaseStats(id, amount);
        updateCustomer(id, updatedCustomer);
        return updatedCustomer;
      } catch (err) {
        const message = err.message || 'Failed to update purchase statistics';
        console.error(message, err);
        throw err;
      }
    },
    [updateCustomer]
  );

  /**
   * Bulk update customer status
   */
  const bulkUpdateStatus = useCallback(
    async (ids, status) => {
      try {
        setCustomerLoading(true);
        setCustomerError(null);
        const count = await customerService.bulkUpdateStatus(ids, status);
        bulkUpdateCustomers(ids, { status });
        toast.success(`${count} customer(s) updated successfully`);
        return count;
      } catch (err) {
        const message = err.message || 'Failed to update customers';
        setCustomerError(message);
        toast.error(message);
        throw err;
      } finally {
        setCustomerLoading(false);
      }
    },
    [bulkUpdateCustomers, setCustomerLoading, setCustomerError]
  );

  /**
   * Bulk delete customers
   */
  const bulkDelete = useCallback(
    async (ids) => {
      try {
        setCustomerLoading(true);
        setCustomerError(null);
        await Promise.all(ids.map((id) => customerService.remove(id)));
        bulkDeleteCustomers(ids);
        toast.success(`${ids.length} customer(s) deleted successfully`);
        return true;
      } catch (err) {
        const message = err.message || 'Failed to delete customers';
        setCustomerError(message);
        toast.error(message);
        throw err;
      } finally {
        setCustomerLoading(false);
      }
    },
    [bulkDeleteCustomers, setCustomerLoading, setCustomerError]
  );

  return {
    // State
    customers,
    selectedCustomer,
    isLoading,
    error,
    stats,

    // Actions
    fetchCustomers,
    fetchCustomerStats,
    createCustomer,
    updateCustomerById,
    deleteCustomer,
    selectCustomer,
    clearSelectedCustomer,
    updateLoyaltyPoints,
    updatePurchaseStats,
    bulkUpdateStatus,
    bulkDelete,

    // Getters
    getCustomerById,
    getActiveCustomers,
    getVIPCustomers,
    getCustomersByType,
    getCustomersByStatus,
    getCustomersByLoyaltyTier,
    searchCustomers,
    getTopCustomers,
    getRecentCustomers,
    getCustomerFullName,
  };
};
