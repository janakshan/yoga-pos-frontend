import { useCallback } from 'react';
import { useStore } from '../../../store';
import { customerService } from '../services/customerService';
import toast from 'react-hot-toast';

/**
 * Hook for managing customer purchase history
 * @returns {Object} Purchase history state and operations
 */
export const usePurchaseHistory = () => {
  // Get state from store
  const purchaseHistory = useStore((state) => state.purchaseHistory);
  const purchaseHistoryStats = useStore((state) => state.purchaseHistoryStats);
  const loading = useStore((state) => state.purchaseHistoryLoading);
  const error = useStore((state) => state.purchaseHistoryError);

  // Get mutations
  const setPurchaseHistory = useStore((state) => state.setPurchaseHistory);
  const setPurchaseHistoryStats = useStore((state) => state.setPurchaseHistoryStats);
  const addPurchaseHistoryItem = useStore((state) => state.addPurchaseHistoryItem);
  const setLoading = useStore((state) => state.setPurchaseHistoryLoading);
  const setError = useStore((state) => state.setPurchaseHistoryError);

  // Get getters
  const getPurchaseHistoryForCustomer = useStore((state) => state.getPurchaseHistoryForCustomer);

  /**
   * Fetch purchase history for a customer
   */
  const fetchPurchaseHistory = useCallback(
    async (customerId, filters = {}) => {
      try {
        setLoading(true);
        setError(null);
        const result = await customerService.getCustomerPurchaseHistory(customerId, filters);
        setPurchaseHistory(result);
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch purchase history';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setPurchaseHistory, setLoading, setError]
  );

  /**
   * Fetch purchase history statistics for a customer
   */
  const fetchPurchaseStats = useCallback(
    async (customerId) => {
      try {
        setLoading(true);
        setError(null);
        const result = await customerService.getPurchaseHistoryStats(customerId);
        setPurchaseHistoryStats(result);
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch purchase statistics';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setPurchaseHistoryStats, setLoading, setError]
  );

  /**
   * Fetch both history and stats together
   */
  const fetchCustomerPurchaseData = useCallback(
    async (customerId, filters = {}) => {
      try {
        setLoading(true);
        setError(null);

        const [history, stats] = await Promise.all([
          customerService.getCustomerPurchaseHistory(customerId, filters),
          customerService.getPurchaseHistoryStats(customerId),
        ]);

        setPurchaseHistory(history);
        setPurchaseHistoryStats(stats);

        return { history, stats };
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch purchase data';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setPurchaseHistory, setPurchaseHistoryStats, setLoading, setError]
  );

  return {
    // State
    purchaseHistory,
    purchaseHistoryStats,
    loading,
    error,

    // Operations
    fetchPurchaseHistory,
    fetchPurchaseStats,
    fetchCustomerPurchaseData,

    // Getters
    getPurchaseHistoryForCustomer,
  };
};

export default usePurchaseHistory;
