import { useCallback } from 'react';
import { useStore } from '../../../store';
import { customerService } from '../services/customerService';
import toast from 'react-hot-toast';

/**
 * Hook for managing customer credit and store credit
 * @returns {Object} Credit state and operations
 */
export const useCustomerCredit = () => {
  // Get state from store
  const creditTransactions = useStore((state) => state.creditTransactions);
  const storeCreditTransactions = useStore((state) => state.storeCreditTransactions);
  const creditLoading = useStore((state) => state.creditLoading);
  const storeCreditLoading = useStore((state) => state.storeCreditLoading);
  const creditError = useStore((state) => state.creditError);
  const storeCreditError = useStore((state) => state.storeCreditError);

  // Get mutations
  const setCreditTransactions = useStore((state) => state.setCreditTransactions);
  const addCreditTransaction = useStore((state) => state.addCreditTransaction);
  const setStoreCreditTransactions = useStore((state) => state.setStoreCreditTransactions);
  const addStoreCreditTransaction = useStore((state) => state.addStoreCreditTransaction);
  const setCreditLoading = useStore((state) => state.setCreditLoading);
  const setStoreCreditLoading = useStore((state) => state.setStoreCreditLoading);
  const setCreditError = useStore((state) => state.setCreditError);
  const setStoreCreditError = useStore((state) => state.setStoreCreditError);
  const updateCustomer = useStore((state) => state.updateCustomer);

  // Get getters
  const getCreditBalance = useStore((state) => state.getCreditBalance);
  const getAvailableCredit = useStore((state) => state.getAvailableCredit);
  const getStoreCreditBalance = useStore((state) => state.getStoreCreditBalance);
  const getCreditTransactionsForCustomer = useStore((state) => state.getCreditTransactionsForCustomer);
  const getStoreCreditTransactionsForCustomer = useStore((state) => state.getStoreCreditTransactionsForCustomer);

  // ========== CREDIT ACCOUNT OPERATIONS ==========

  /**
   * Fetch credit transactions for a customer
   */
  const fetchCreditTransactions = useCallback(
    async (customerId) => {
      try {
        setCreditLoading(true);
        setCreditError(null);
        const result = await customerService.getCreditTransactions(customerId);
        setCreditTransactions(result);
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch credit transactions';
        setCreditError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setCreditLoading(false);
      }
    },
    [setCreditTransactions, setCreditLoading, setCreditError]
  );

  /**
   * Create credit charge
   */
  const createCharge = useCallback(
    async (customerId, chargeData) => {
      try {
        setCreditLoading(true);
        setCreditError(null);
        const transaction = await customerService.createCreditCharge(customerId, chargeData);
        addCreditTransaction(transaction);

        // Update customer in store
        const updatedCustomer = await customerService.getById(customerId);
        if (updatedCustomer) {
          updateCustomer(customerId, updatedCustomer);
        }

        toast.success(`Credit charge of $${chargeData.amount.toFixed(2)} created`);
        return transaction;
      } catch (err) {
        const errorMessage = err.message || 'Failed to create credit charge';
        setCreditError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setCreditLoading(false);
      }
    },
    [addCreditTransaction, updateCustomer, setCreditLoading, setCreditError]
  );

  /**
   * Create credit payment
   */
  const createPayment = useCallback(
    async (customerId, paymentData) => {
      try {
        setCreditLoading(true);
        setCreditError(null);
        const transaction = await customerService.createCreditPayment(customerId, paymentData);
        addCreditTransaction(transaction);

        // Update customer in store
        const updatedCustomer = await customerService.getById(customerId);
        if (updatedCustomer) {
          updateCustomer(customerId, updatedCustomer);
        }

        toast.success(`Payment of $${paymentData.amount.toFixed(2)} received`);
        return transaction;
      } catch (err) {
        const errorMessage = err.message || 'Failed to create payment';
        setCreditError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setCreditLoading(false);
      }
    },
    [addCreditTransaction, updateCustomer, setCreditLoading, setCreditError]
  );

  /**
   * Update credit limit
   */
  const updateCreditLimit = useCallback(
    async (customerId, newLimit) => {
      try {
        setCreditLoading(true);
        setCreditError(null);
        const updatedCustomer = await customerService.updateCreditLimit(customerId, newLimit);
        updateCustomer(customerId, updatedCustomer);
        toast.success(`Credit limit updated to $${newLimit.toFixed(2)}`);
        return updatedCustomer;
      } catch (err) {
        const errorMessage = err.message || 'Failed to update credit limit';
        setCreditError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setCreditLoading(false);
      }
    },
    [updateCustomer, setCreditLoading, setCreditError]
  );

  // ========== STORE CREDIT OPERATIONS ==========

  /**
   * Fetch store credit transactions for a customer
   */
  const fetchStoreCreditTransactions = useCallback(
    async (customerId) => {
      try {
        setStoreCreditLoading(true);
        setStoreCreditError(null);
        const result = await customerService.getStoreCreditTransactions(customerId);
        setStoreCreditTransactions(result);
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch store credit transactions';
        setStoreCreditError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setStoreCreditLoading(false);
      }
    },
    [setStoreCreditTransactions, setStoreCreditLoading, setStoreCreditError]
  );

  /**
   * Add store credit
   */
  const addCredit = useCallback(
    async (customerId, creditData) => {
      try {
        setStoreCreditLoading(true);
        setStoreCreditError(null);
        const transaction = await customerService.addStoreCredit(customerId, creditData);
        addStoreCreditTransaction(transaction);

        // Update customer in store
        const updatedCustomer = await customerService.getById(customerId);
        if (updatedCustomer) {
          updateCustomer(customerId, updatedCustomer);
        }

        toast.success(`Store credit of $${creditData.amount.toFixed(2)} added`);
        return transaction;
      } catch (err) {
        const errorMessage = err.message || 'Failed to add store credit';
        setStoreCreditError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setStoreCreditLoading(false);
      }
    },
    [addStoreCreditTransaction, updateCustomer, setStoreCreditLoading, setStoreCreditError]
  );

  /**
   * Deduct store credit
   */
  const deductCredit = useCallback(
    async (customerId, debitData) => {
      try {
        setStoreCreditLoading(true);
        setStoreCreditError(null);
        const transaction = await customerService.deductStoreCredit(customerId, debitData);
        addStoreCreditTransaction(transaction);

        // Update customer in store
        const updatedCustomer = await customerService.getById(customerId);
        if (updatedCustomer) {
          updateCustomer(customerId, updatedCustomer);
        }

        toast.success(`Store credit of $${debitData.amount.toFixed(2)} deducted`);
        return transaction;
      } catch (err) {
        const errorMessage = err.message || 'Failed to deduct store credit';
        setStoreCreditError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setStoreCreditLoading(false);
      }
    },
    [addStoreCreditTransaction, updateCustomer, setStoreCreditLoading, setStoreCreditError]
  );

  /**
   * Redeem loyalty points for store credit
   */
  const redeemPoints = useCallback(
    async (customerId, points, conversionRate = 100) => {
      try {
        setStoreCreditLoading(true);
        setStoreCreditError(null);
        const result = await customerService.redeemLoyaltyPoints(customerId, points, conversionRate);

        addStoreCreditTransaction(result.transaction);

        // Update customer in store
        const updatedCustomer = await customerService.getById(customerId);
        if (updatedCustomer) {
          updateCustomer(customerId, updatedCustomer);
        }

        toast.success(
          `${points} points redeemed for $${result.storeCreditAdded.toFixed(2)} store credit`
        );
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to redeem points';
        setStoreCreditError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setStoreCreditLoading(false);
      }
    },
    [addStoreCreditTransaction, updateCustomer, setStoreCreditLoading, setStoreCreditError]
  );

  return {
    // State
    creditTransactions,
    storeCreditTransactions,
    creditLoading,
    storeCreditLoading,
    creditError,
    storeCreditError,

    // Credit account operations
    fetchCreditTransactions,
    createCharge,
    createPayment,
    updateCreditLimit,

    // Store credit operations
    fetchStoreCreditTransactions,
    addCredit,
    deductCredit,
    redeemPoints,

    // Getters
    getCreditBalance,
    getAvailableCredit,
    getStoreCreditBalance,
    getCreditTransactionsForCustomer,
    getStoreCreditTransactionsForCustomer,
  };
};

export default useCustomerCredit;
