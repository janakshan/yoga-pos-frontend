import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import { purchaseOrderService } from '../services/purchaseOrderService.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for purchase order operations
 * Provides purchase order state and operations with error handling
 */
export const usePurchaseOrders = () => {
  // Get state
  const purchaseOrders = useStore((state) => state.purchaseOrders);
  const selectedPurchaseOrder = useStore((state) => state.selectedPurchaseOrder);
  const isLoading = useStore((state) => state.purchaseOrderLoading);
  const error = useStore((state) => state.purchaseOrderError);
  const stats = useStore((state) => state.purchaseOrderStats);
  const analytics = useStore((state) => state.purchaseAnalytics);

  // Get mutations
  const setPurchaseOrders = useStore((state) => state.setPurchaseOrders);
  const setSelectedPurchaseOrder = useStore(
    (state) => state.setSelectedPurchaseOrder
  );
  const setPurchaseOrderLoading = useStore(
    (state) => state.setPurchaseOrderLoading
  );
  const setPurchaseOrderError = useStore((state) => state.setPurchaseOrderError);
  const setPurchaseOrderStats = useStore((state) => state.setPurchaseOrderStats);
  const setPurchaseAnalytics = useStore((state) => state.setPurchaseAnalytics);
  const addPurchaseOrder = useStore((state) => state.addPurchaseOrder);
  const updatePurchaseOrder = useStore((state) => state.updatePurchaseOrder);
  const removePurchaseOrder = useStore((state) => state.removePurchaseOrder);
  const updatePurchaseOrderStatus = useStore(
    (state) => state.updatePurchaseOrderStatus
  );

  // Get getters
  const getPurchaseOrderById = useStore((state) => state.getPurchaseOrderById);
  const getPurchaseOrdersBySupplier = useStore(
    (state) => state.getPurchaseOrdersBySupplier
  );
  const getPendingPurchaseOrders = useStore(
    (state) => state.getPendingPurchaseOrders
  );
  const getOverduePurchaseOrders = useStore(
    (state) => state.getOverduePurchaseOrders
  );

  /**
   * Fetch all purchase orders
   */
  const fetchPurchaseOrders = useCallback(
    async (filters = {}) => {
      try {
        setPurchaseOrderLoading(true);
        setPurchaseOrderError(null);
        const data = await purchaseOrderService.getList(filters);
        setPurchaseOrders(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch purchase orders';
        setPurchaseOrderError(message);
        toast.error(message);
        throw err;
      } finally {
        setPurchaseOrderLoading(false);
      }
    },
    [setPurchaseOrders, setPurchaseOrderLoading, setPurchaseOrderError]
  );

  /**
   * Fetch purchase order by ID
   */
  const fetchPurchaseOrderById = useCallback(
    async (id) => {
      try {
        setPurchaseOrderLoading(true);
        setPurchaseOrderError(null);
        const data = await purchaseOrderService.getById(id);
        setSelectedPurchaseOrder(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch purchase order';
        setPurchaseOrderError(message);
        toast.error(message);
        throw err;
      } finally {
        setPurchaseOrderLoading(false);
      }
    },
    [setSelectedPurchaseOrder, setPurchaseOrderLoading, setPurchaseOrderError]
  );

  /**
   * Create new purchase order
   */
  const createPurchaseOrder = useCallback(
    async (data) => {
      try {
        setPurchaseOrderLoading(true);
        setPurchaseOrderError(null);
        const newPO = await purchaseOrderService.create(data);
        addPurchaseOrder(newPO);
        toast.success('Purchase order created successfully');
        return newPO;
      } catch (err) {
        const message = err.message || 'Failed to create purchase order';
        setPurchaseOrderError(message);
        toast.error(message);
        throw err;
      } finally {
        setPurchaseOrderLoading(false);
      }
    },
    [addPurchaseOrder, setPurchaseOrderLoading, setPurchaseOrderError]
  );

  /**
   * Update purchase order
   */
  const updatePurchaseOrderById = useCallback(
    async (id, data) => {
      try {
        setPurchaseOrderLoading(true);
        setPurchaseOrderError(null);
        const updated = await purchaseOrderService.update(id, data);
        updatePurchaseOrder(id, updated);
        toast.success('Purchase order updated successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update purchase order';
        setPurchaseOrderError(message);
        toast.error(message);
        throw err;
      } finally {
        setPurchaseOrderLoading(false);
      }
    },
    [updatePurchaseOrder, setPurchaseOrderLoading, setPurchaseOrderError]
  );

  /**
   * Delete purchase order
   */
  const deletePurchaseOrder = useCallback(
    async (id) => {
      try {
        setPurchaseOrderLoading(true);
        setPurchaseOrderError(null);
        await purchaseOrderService.remove(id);
        removePurchaseOrder(id);
        toast.success('Purchase order deleted successfully');
      } catch (err) {
        const message = err.message || 'Failed to delete purchase order';
        setPurchaseOrderError(message);
        toast.error(message);
        throw err;
      } finally {
        setPurchaseOrderLoading(false);
      }
    },
    [removePurchaseOrder, setPurchaseOrderLoading, setPurchaseOrderError]
  );

  /**
   * Update purchase order status
   */
  const changePurchaseOrderStatus = useCallback(
    async (id, status) => {
      try {
        setPurchaseOrderLoading(true);
        setPurchaseOrderError(null);
        const updated = await purchaseOrderService.updateStatus(id, status);
        updatePurchaseOrderStatus(id, status);
        toast.success(`Purchase order status updated to ${status}`);
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update purchase order status';
        setPurchaseOrderError(message);
        toast.error(message);
        throw err;
      } finally {
        setPurchaseOrderLoading(false);
      }
    },
    [updatePurchaseOrderStatus, setPurchaseOrderLoading, setPurchaseOrderError]
  );

  /**
   * Receive goods for a purchase order
   */
  const receiveGoods = useCallback(
    async (id, receivingData) => {
      try {
        setPurchaseOrderLoading(true);
        setPurchaseOrderError(null);
        const updated = await purchaseOrderService.receiveGoods(
          id,
          receivingData
        );
        updatePurchaseOrder(id, updated);
        toast.success('Goods received successfully');

        // TODO: Update inventory here by calling inventory service
        // This would be done in a real implementation

        return updated;
      } catch (err) {
        const message = err.message || 'Failed to receive goods';
        setPurchaseOrderError(message);
        toast.error(message);
        throw err;
      } finally {
        setPurchaseOrderLoading(false);
      }
    },
    [updatePurchaseOrder, setPurchaseOrderLoading, setPurchaseOrderError]
  );

  /**
   * Create purchase return
   */
  const createReturn = useCallback(
    async (id, returnData) => {
      try {
        setPurchaseOrderLoading(true);
        setPurchaseOrderError(null);
        const updated = await purchaseOrderService.createReturn(id, returnData);
        updatePurchaseOrder(id, updated);
        toast.success('Purchase return created successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to create purchase return';
        setPurchaseOrderError(message);
        toast.error(message);
        throw err;
      } finally {
        setPurchaseOrderLoading(false);
      }
    },
    [updatePurchaseOrder, setPurchaseOrderLoading, setPurchaseOrderError]
  );

  /**
   * Update return status
   */
  const updateReturnStatus = useCallback(
    async (poId, returnId, status) => {
      try {
        setPurchaseOrderLoading(true);
        setPurchaseOrderError(null);
        const updated = await purchaseOrderService.updateReturnStatus(
          poId,
          returnId,
          status
        );
        updatePurchaseOrder(poId, updated);
        toast.success(`Return status updated to ${status}`);
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update return status';
        setPurchaseOrderError(message);
        toast.error(message);
        throw err;
      } finally {
        setPurchaseOrderLoading(false);
      }
    },
    [updatePurchaseOrder, setPurchaseOrderLoading, setPurchaseOrderError]
  );

  /**
   * Update payment
   */
  const updatePayment = useCallback(
    async (id, paidAmount) => {
      try {
        setPurchaseOrderLoading(true);
        setPurchaseOrderError(null);
        const updated = await purchaseOrderService.updatePayment(id, paidAmount);
        updatePurchaseOrder(id, updated);
        toast.success('Payment updated successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update payment';
        setPurchaseOrderError(message);
        toast.error(message);
        throw err;
      } finally {
        setPurchaseOrderLoading(false);
      }
    },
    [updatePurchaseOrder, setPurchaseOrderLoading, setPurchaseOrderError]
  );

  /**
   * Fetch purchase order statistics
   */
  const fetchPurchaseOrderStats = useCallback(
    async (filters = {}) => {
      try {
        setPurchaseOrderLoading(true);
        setPurchaseOrderError(null);
        const data = await purchaseOrderService.getStats(filters);
        setPurchaseOrderStats(data);
        return data;
      } catch (err) {
        const message =
          err.message || 'Failed to fetch purchase order statistics';
        setPurchaseOrderError(message);
        toast.error(message);
        throw err;
      } finally {
        setPurchaseOrderLoading(false);
      }
    },
    [setPurchaseOrderStats, setPurchaseOrderLoading, setPurchaseOrderError]
  );

  /**
   * Fetch purchase analytics
   */
  const fetchPurchaseAnalytics = useCallback(
    async (filters = {}) => {
      try {
        setPurchaseOrderLoading(true);
        setPurchaseOrderError(null);
        const data = await purchaseOrderService.getAnalytics(filters);
        setPurchaseAnalytics(data);
        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch purchase analytics';
        setPurchaseOrderError(message);
        toast.error(message);
        throw err;
      } finally {
        setPurchaseOrderLoading(false);
      }
    },
    [setPurchaseAnalytics, setPurchaseOrderLoading, setPurchaseOrderError]
  );

  return {
    // State
    purchaseOrders,
    selectedPurchaseOrder,
    isLoading,
    error,
    stats,
    analytics,

    // Operations
    fetchPurchaseOrders,
    fetchPurchaseOrderById,
    createPurchaseOrder,
    updatePurchaseOrderById,
    deletePurchaseOrder,
    changePurchaseOrderStatus,
    receiveGoods,
    createReturn,
    updateReturnStatus,
    updatePayment,
    fetchPurchaseOrderStats,
    fetchPurchaseAnalytics,
    setSelectedPurchaseOrder,

    // Getters
    getPurchaseOrderById,
    getPurchaseOrdersBySupplier,
    getPendingPurchaseOrders,
    getOverduePurchaseOrders,
  };
};
