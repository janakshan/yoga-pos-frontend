/**
 * usePurchase Hook
 * Custom hook for purchase order management operations
 */

import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import { purchaseService } from '../services/purchaseService.js';
import toast from 'react-hot-toast';

export const usePurchase = () => {
  // State selectors
  const purchaseOrders = useStore((state) => state.purchaseOrders);
  const selectedPurchaseOrder = useStore((state) => state.selectedPurchaseOrder);
  const isLoading = useStore((state) => state.purchaseLoading);
  const error = useStore((state) => state.purchaseError);
  const stats = useStore((state) => state.purchaseStats);

  // Action creators
  const setPurchaseOrders = useStore((state) => state.setPurchaseOrders);
  const addPurchaseOrder = useStore((state) => state.addPurchaseOrder);
  const updatePurchaseOrder = useStore((state) => state.updatePurchaseOrder);
  const deletePurchaseOrder = useStore((state) => state.deletePurchaseOrder);
  const setSelectedPurchaseOrder = useStore(
    (state) => state.setSelectedPurchaseOrder
  );
  const updatePurchaseOrderStatus = useStore(
    (state) => state.updatePurchaseOrderStatus
  );
  const addPurchaseOrderItem = useStore((state) => state.addPurchaseOrderItem);
  const updatePurchaseOrderItem = useStore(
    (state) => state.updatePurchaseOrderItem
  );
  const removePurchaseOrderItem = useStore(
    (state) => state.removePurchaseOrderItem
  );
  const addGoodsReceipt = useStore((state) => state.addGoodsReceipt);
  const addPurchaseReturn = useStore((state) => state.addPurchaseReturn);
  const updatePurchaseReturn = useStore((state) => state.updatePurchaseReturn);
  const addPurchasePayment = useStore((state) => state.addPurchasePayment);
  const setPurchaseLoading = useStore((state) => state.setPurchaseLoading);
  const setPurchaseError = useStore((state) => state.setPurchaseError);
  const clearPurchaseError = useStore((state) => state.clearPurchaseError);

  // Getters
  const getPurchaseOrderById = useStore((state) => state.getPurchaseOrderById);
  const getPurchaseOrdersBySupplier = useStore(
    (state) => state.getPurchaseOrdersBySupplier
  );
  const getPurchaseOrdersByStatus = useStore(
    (state) => state.getPurchaseOrdersByStatus
  );
  const getPendingPurchaseOrders = useStore(
    (state) => state.getPendingPurchaseOrders
  );
  const getOverduePurchaseOrders = useStore(
    (state) => state.getOverduePurchaseOrders
  );
  const getOutstandingPayments = useStore(
    (state) => state.getOutstandingPayments
  );
  const searchPurchaseOrders = useStore((state) => state.searchPurchaseOrders);

  /**
   * Fetch all purchase orders
   */
  const fetchPurchaseOrders = useCallback(
    async (filters = {}) => {
      try {
        setPurchaseLoading(true);
        clearPurchaseError();
        const data = await purchaseService.getList(filters);
        setPurchaseOrders(data);
        return data;
      } catch (err) {
        setPurchaseError(err.message);
        toast.error(`Failed to fetch purchase orders: ${err.message}`);
        throw err;
      } finally {
        setPurchaseLoading(false);
      }
    },
    [setPurchaseOrders, setPurchaseLoading, setPurchaseError, clearPurchaseError]
  );

  /**
   * Fetch purchase order by ID
   */
  const fetchPurchaseOrderById = useCallback(
    async (id) => {
      try {
        setPurchaseLoading(true);
        clearPurchaseError();
        const data = await purchaseService.getById(id);
        setSelectedPurchaseOrder(data);
        return data;
      } catch (err) {
        setPurchaseError(err.message);
        toast.error(`Failed to fetch purchase order: ${err.message}`);
        throw err;
      } finally {
        setPurchaseLoading(false);
      }
    },
    [
      setSelectedPurchaseOrder,
      setPurchaseLoading,
      setPurchaseError,
      clearPurchaseError
    ]
  );

  /**
   * Create a new purchase order
   */
  const createPurchaseOrder = useCallback(
    async (data) => {
      try {
        setPurchaseLoading(true);
        clearPurchaseError();
        const newPO = await purchaseService.create(data);
        addPurchaseOrder(newPO);
        toast.success(`Purchase order ${newPO.orderNumber} created successfully`);
        return newPO;
      } catch (err) {
        setPurchaseError(err.message);
        toast.error(`Failed to create purchase order: ${err.message}`);
        throw err;
      } finally {
        setPurchaseLoading(false);
      }
    },
    [addPurchaseOrder, setPurchaseLoading, setPurchaseError, clearPurchaseError]
  );

  /**
   * Update an existing purchase order
   */
  const updatePurchaseOrderData = useCallback(
    async (id, data) => {
      try {
        setPurchaseLoading(true);
        clearPurchaseError();
        const updatedPO = await purchaseService.update(id, data);
        updatePurchaseOrder(id, updatedPO);
        toast.success('Purchase order updated successfully');
        return updatedPO;
      } catch (err) {
        setPurchaseError(err.message);
        toast.error(`Failed to update purchase order: ${err.message}`);
        throw err;
      } finally {
        setPurchaseLoading(false);
      }
    },
    [
      updatePurchaseOrder,
      setPurchaseLoading,
      setPurchaseError,
      clearPurchaseError
    ]
  );

  /**
   * Delete a purchase order
   */
  const removePurchaseOrder = useCallback(
    async (id) => {
      try {
        setPurchaseLoading(true);
        clearPurchaseError();
        await purchaseService.remove(id);
        deletePurchaseOrder(id);
        toast.success('Purchase order deleted successfully');
        return true;
      } catch (err) {
        setPurchaseError(err.message);
        toast.error(`Failed to delete purchase order: ${err.message}`);
        throw err;
      } finally {
        setPurchaseLoading(false);
      }
    },
    [
      deletePurchaseOrder,
      setPurchaseLoading,
      setPurchaseError,
      clearPurchaseError
    ]
  );

  /**
   * Update purchase order status
   */
  const updateStatus = useCallback(
    async (id, status, additionalData = {}) => {
      try {
        setPurchaseLoading(true);
        clearPurchaseError();
        const updatedPO = await purchaseService.updateStatus(
          id,
          status,
          additionalData
        );
        updatePurchaseOrderStatus(id, status);
        toast.success(`Purchase order status updated to ${status}`);
        return updatedPO;
      } catch (err) {
        setPurchaseError(err.message);
        toast.error(`Failed to update status: ${err.message}`);
        throw err;
      } finally {
        setPurchaseLoading(false);
      }
    },
    [
      updatePurchaseOrderStatus,
      setPurchaseLoading,
      setPurchaseError,
      clearPurchaseError
    ]
  );

  /**
   * Receive goods for a purchase order
   */
  const receiveGoods = useCallback(
    async (id, receiptData) => {
      try {
        setPurchaseLoading(true);
        clearPurchaseError();
        const receipt = await purchaseService.receiveGoods(id, receiptData);
        addGoodsReceipt(id, receipt);
        toast.success(`Goods receipt ${receipt.receiptNumber} created successfully`);
        return receipt;
      } catch (err) {
        setPurchaseError(err.message);
        toast.error(`Failed to receive goods: ${err.message}`);
        throw err;
      } finally {
        setPurchaseLoading(false);
      }
    },
    [addGoodsReceipt, setPurchaseLoading, setPurchaseError, clearPurchaseError]
  );

  /**
   * Create a purchase return
   */
  const createReturn = useCallback(
    async (id, returnData) => {
      try {
        setPurchaseLoading(true);
        clearPurchaseError();
        const returnRecord = await purchaseService.createReturn(id, returnData);
        addPurchaseReturn(id, returnRecord);
        toast.success(
          `Purchase return ${returnRecord.returnNumber} created successfully`
        );
        return returnRecord;
      } catch (err) {
        setPurchaseError(err.message);
        toast.error(`Failed to create return: ${err.message}`);
        throw err;
      } finally {
        setPurchaseLoading(false);
      }
    },
    [
      addPurchaseReturn,
      setPurchaseLoading,
      setPurchaseError,
      clearPurchaseError
    ]
  );

  /**
   * Update purchase return status
   */
  const updateReturnStatus = useCallback(
    async (poId, returnId, status, additionalData = {}) => {
      try {
        setPurchaseLoading(true);
        clearPurchaseError();
        const updatedReturn = await purchaseService.updateReturn(
          poId,
          returnId,
          status,
          additionalData
        );
        updatePurchaseReturn(poId, returnId, { status, ...additionalData });
        toast.success(`Return status updated to ${status}`);
        return updatedReturn;
      } catch (err) {
        setPurchaseError(err.message);
        toast.error(`Failed to update return: ${err.message}`);
        throw err;
      } finally {
        setPurchaseLoading(false);
      }
    },
    [
      updatePurchaseReturn,
      setPurchaseLoading,
      setPurchaseError,
      clearPurchaseError
    ]
  );

  /**
   * Add payment to purchase order
   */
  const addPayment = useCallback(
    async (id, paymentData) => {
      try {
        setPurchaseLoading(true);
        clearPurchaseError();
        const payment = await purchaseService.addPayment(id, paymentData);
        addPurchasePayment(id, payment);
        toast.success('Payment recorded successfully');
        return payment;
      } catch (err) {
        setPurchaseError(err.message);
        toast.error(`Failed to add payment: ${err.message}`);
        throw err;
      } finally {
        setPurchaseLoading(false);
      }
    },
    [
      addPurchasePayment,
      setPurchaseLoading,
      setPurchaseError,
      clearPurchaseError
    ]
  );

  /**
   * Get purchase statistics
   */
  const fetchStatistics = useCallback(
    async (filters = {}) => {
      try {
        const statistics = await purchaseService.getStatistics(filters);
        return statistics;
      } catch (err) {
        toast.error(`Failed to fetch statistics: ${err.message}`);
        throw err;
      }
    },
    []
  );

  /**
   * Get overdue orders
   */
  const fetchOverdueOrders = useCallback(async () => {
    try {
      const overdueOrders = await purchaseService.getOverdueOrders();
      return overdueOrders;
    } catch (err) {
      toast.error(`Failed to fetch overdue orders: ${err.message}`);
      throw err;
    }
  }, []);

  return {
    // State
    purchaseOrders,
    selectedPurchaseOrder,
    isLoading,
    error,
    stats,

    // Actions
    fetchPurchaseOrders,
    fetchPurchaseOrderById,
    createPurchaseOrder,
    updatePurchaseOrderData,
    removePurchaseOrder,
    updateStatus,
    receiveGoods,
    createReturn,
    updateReturnStatus,
    addPayment,
    fetchStatistics,
    fetchOverdueOrders,
    setSelectedPurchaseOrder,
    clearPurchaseError,

    // Line item actions
    addPurchaseOrderItem,
    updatePurchaseOrderItem,
    removePurchaseOrderItem,

    // Getters
    getPurchaseOrderById,
    getPurchaseOrdersBySupplier,
    getPurchaseOrdersByStatus,
    getPendingPurchaseOrders,
    getOverduePurchaseOrders,
    getOutstandingPayments,
    searchPurchaseOrders
  };
};
