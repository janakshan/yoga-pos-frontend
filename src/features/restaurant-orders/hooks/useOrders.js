import { useStore } from '../../../store';
import { orderService } from '../services/orderService';
import { useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * Hook for managing restaurant orders
 * @returns {Object} Order state and actions
 */
export const useOrders = () => {
  const orders = useStore((state) => state.orders);
  const activeOrders = useStore((state) => state.activeOrders);
  const currentOrder = useStore((state) => state.currentOrder);
  const filters = useStore((state) => state.filters);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);

  const setOrders = useStore((state) => state.setOrders);
  const addOrder = useStore((state) => state.addOrder);
  const updateOrder = useStore((state) => state.updateOrder);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);
  const updateOrderItems = useStore((state) => state.updateOrderItems);
  const updateOrderItemStatus = useStore((state) => state.updateOrderItemStatus);
  const addOrderItem = useStore((state) => state.addOrderItem);
  const removeOrderItem = useStore((state) => state.removeOrderItem);
  const updateOrderTotals = useStore((state) => state.updateOrderTotals);
  const assignServer = useStore((state) => state.assignServer);
  const routeToStations = useStore((state) => state.routeToStations);
  const updateOrderPayment = useStore((state) => state.updateOrderPayment);
  const deleteOrder = useStore((state) => state.deleteOrder);
  const setCurrentOrder = useStore((state) => state.setCurrentOrder);
  const clearCurrentOrder = useStore((state) => state.clearCurrentOrder);
  const setFilters = useStore((state) => state.setFilters);
  const clearFilters = useStore((state) => state.clearFilters);
  const setLoading = useStore((state) => state.setLoading);
  const setError = useStore((state) => state.setError);
  const clearError = useStore((state) => state.clearError);

  const getOrderById = useStore((state) => state.getOrderById);
  const getOrdersByStatus = useStore((state) => state.getOrdersByStatus);
  const getOrdersByTable = useStore((state) => state.getOrdersByTable);
  const getOrdersByServiceType = useStore((state) => state.getOrdersByServiceType);
  const getFilteredOrders = useStore((state) => state.getFilteredOrders);
  const getOrderStats = useStore((state) => state.getOrderStats);

  /**
   * Fetch all orders with optional filters
   */
  const fetchOrders = useCallback(
    async (filterOptions = {}) => {
      try {
        setLoading(true);
        clearError();
        const orders = await orderService.getList(filterOptions);
        setOrders(orders);
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to fetch orders: ${err.message}`);
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setOrders, setError]
  );

  /**
   * Fetch active orders only
   */
  const fetchActiveOrders = useCallback(async () => {
    try {
      setLoading(true);
      clearError();
      const orders = await orderService.getActiveOrders();
      setOrders(orders);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch active orders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearError, setOrders, setError]);

  /**
   * Fetch a single order by ID
   */
  const fetchOrder = useCallback(
    async (orderId) => {
      try {
        setLoading(true);
        clearError();
        const order = await orderService.getById(orderId);
        setCurrentOrder(order);
        return order;
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to fetch order: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, setCurrentOrder, setError]
  );

  /**
   * Create a new order
   */
  const createOrder = useCallback(
    async (orderData) => {
      try {
        setLoading(true);
        clearError();
        const newOrder = await orderService.create(orderData);
        addOrder(newOrder);
        toast.success(`Order ${newOrder.orderNumber} created successfully`);
        return newOrder;
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to create order: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, addOrder, setError]
  );

  /**
   * Update an order
   */
  const saveOrder = useCallback(
    async (orderId, updates) => {
      try {
        setLoading(true);
        clearError();
        const updatedOrder = await orderService.update(orderId, updates);
        updateOrder(orderId, updates);
        toast.success('Order updated successfully');
        return updatedOrder;
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to update order: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, updateOrder, setError]
  );

  /**
   * Change order status
   */
  const changeOrderStatus = useCallback(
    async (orderId, newStatus, userId, userName, notes = null) => {
      try {
        setLoading(true);
        clearError();
        const updatedOrder = await orderService.updateStatus(
          orderId,
          newStatus,
          userId,
          userName,
          notes
        );
        updateOrderStatus(orderId, newStatus, userId, userName, notes);
        toast.success('Order status updated');
        return updatedOrder;
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to update status: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, updateOrderStatus, setError]
  );

  /**
   * Cancel an order
   */
  const cancelOrder = useCallback(
    async (orderId, userId, userName, reason) => {
      try {
        setLoading(true);
        clearError();
        await orderService.cancel(orderId, userId, userName, reason);
        await fetchOrders();
        toast.success('Order cancelled');
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to cancel order: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, fetchOrders, setError]
  );

  /**
   * Complete an order
   */
  const completeOrder = useCallback(
    async (orderId, userId, userName) => {
      try {
        setLoading(true);
        clearError();
        await orderService.complete(orderId, userId, userName);
        await fetchOrders();
        toast.success('Order completed');
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to complete order: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, fetchOrders, setError]
  );

  /**
   * Process payment for an order
   */
  const processPayment = useCallback(
    async (orderId, paymentInfo) => {
      try {
        setLoading(true);
        clearError();
        const updatedOrder = await orderService.processPayment(orderId, paymentInfo);
        updateOrderPayment(orderId, updatedOrder.payment);
        toast.success('Payment processed successfully');
        return updatedOrder;
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to process payment: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, updateOrderPayment, setError]
  );

  /**
   * Delete an order
   */
  const removeOrder = useCallback(
    async (orderId) => {
      try {
        setLoading(true);
        clearError();
        await orderService.remove(orderId);
        deleteOrder(orderId);
        toast.success('Order deleted');
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to delete order: ${err.message}`);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, clearError, deleteOrder, setError]
  );

  return {
    // State
    orders,
    activeOrders,
    currentOrder,
    filters,
    isLoading,
    error,

    // Actions
    fetchOrders,
    fetchActiveOrders,
    fetchOrder,
    createOrder,
    saveOrder,
    changeOrderStatus,
    cancelOrder,
    completeOrder,
    processPayment,
    removeOrder,

    // Store actions
    updateOrder,
    updateOrderStatus,
    updateOrderItems,
    updateOrderItemStatus,
    addOrderItem,
    removeOrderItem,
    updateOrderTotals,
    assignServer,
    routeToStations,
    setCurrentOrder,
    clearCurrentOrder,
    setFilters,
    clearFilters,
    clearError,

    // Getters
    getOrderById,
    getOrdersByStatus,
    getOrdersByTable,
    getOrdersByServiceType,
    getFilteredOrders,
    getOrderStats
  };
};

export default useOrders;
