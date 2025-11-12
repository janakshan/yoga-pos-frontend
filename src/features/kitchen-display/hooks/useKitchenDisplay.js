/**
 * Kitchen Display Hook
 *
 * Custom hook for managing Kitchen Display System state and operations
 */

import { useEffect, useCallback, useRef } from 'react';
import { useStore } from '@/store';
import { kitchenService } from '../services/kitchenService';
import { socketService } from '@/features/qr-ordering/services/socketService';
import toast from 'react-hot-toast';

/**
 * Kitchen Display Hook
 */
export const useKitchenDisplay = () => {
  const intervalRef = useRef(null);

  // Store state
  const kitchenDisplay = useStore((state) => state.kitchenDisplay);
  const {
    setKitchenOrders,
    addKitchenOrder,
    updateKitchenOrder,
    removeKitchenOrder,
    updateOrderItemStatus,
    setSelectedStation,
    setViewMode,
    setSortBy,
    setFilterStatus,
    toggleSound,
    toggleNotifications,
    setAutoRefresh,
    updateStation,
    setKDSLoading,
    setKDSError,
  } = useStore();

  /**
   * Fetch kitchen orders
   */
  const fetchKitchenOrders = useCallback(async () => {
    try {
      setKDSLoading(true);
      const orders = await kitchenService.getActiveKitchenOrders();
      setKitchenOrders(orders);
      setKDSError(null);
    } catch (error) {
      console.error('Failed to fetch kitchen orders:', error);
      setKDSError(error.message);
      toast.error('Failed to load kitchen orders');
    } finally {
      setKDSLoading(false);
    }
  }, [setKitchenOrders, setKDSLoading, setKDSError]);

  /**
   * Start preparing order
   */
  const startPreparing = useCallback(
    async (orderId) => {
      try {
        const updatedOrder = await kitchenService.startPreparing(orderId);
        updateKitchenOrder(orderId, updatedOrder);
        toast.success('Order started');
      } catch (error) {
        console.error('Failed to start preparing:', error);
        toast.error('Failed to start order');
      }
    },
    [updateKitchenOrder]
  );

  /**
   * Update item status
   */
  const updateItemStatus = useCallback(
    async (orderId, itemId, status) => {
      try {
        const updatedOrder = await kitchenService.updateItemStatus(
          orderId,
          itemId,
          status
        );
        updateOrderItemStatus(orderId, itemId, status);

        if (status === 'ready') {
          toast.success('Item marked ready');
        }
      } catch (error) {
        console.error('Failed to update item status:', error);
        toast.error('Failed to update item');
      }
    },
    [updateOrderItemStatus]
  );

  /**
   * Mark order ready
   */
  const markOrderReady = useCallback(
    async (orderId) => {
      try {
        const updatedOrder = await kitchenService.markOrderReady(orderId);
        updateKitchenOrder(orderId, updatedOrder);
        toast.success('Order marked ready');
      } catch (error) {
        console.error('Failed to mark order ready:', error);
        toast.error('Failed to mark order ready');
      }
    },
    [updateKitchenOrder]
  );

  /**
   * Bump order (complete)
   */
  const bumpOrder = useCallback(
    async (orderId) => {
      try {
        await kitchenService.bumpOrder(orderId);
        removeKitchenOrder(orderId);
        toast.success('Order completed');
      } catch (error) {
        console.error('Failed to bump order:', error);
        toast.error('Failed to complete order');
      }
    },
    [removeKitchenOrder]
  );

  /**
   * Print order
   */
  const printOrder = useCallback(
    async (orderId, stationId) => {
      try {
        await kitchenService.printOrder(orderId, stationId);
        toast.success('Order printed');
      } catch (error) {
        console.error('Failed to print order:', error);
        toast.error('Failed to print order');
      }
    },
    []
  );

  /**
   * Reprint order
   */
  const reprintOrder = useCallback(
    async (orderId, stationId) => {
      try {
        await kitchenService.reprintOrder(orderId, stationId);
        toast.success('Order reprinted');
      } catch (error) {
        console.error('Failed to reprint order:', error);
        toast.error('Failed to reprint order');
      }
    },
    []
  );

  /**
   * Update order priority
   */
  const updateOrderPriority = useCallback(
    async (orderId, priority) => {
      try {
        const updatedOrder = await kitchenService.updateOrderPriority(
          orderId,
          priority
        );
        updateKitchenOrder(orderId, updatedOrder);
        toast.success('Priority updated');
      } catch (error) {
        console.error('Failed to update priority:', error);
        toast.error('Failed to update priority');
      }
    },
    [updateKitchenOrder]
  );

  /**
   * Fetch performance metrics
   */
  const fetchMetrics = useCallback(
    async (stationId = null, timeRange = 'today') => {
      try {
        const metrics = await kitchenService.getPerformanceMetrics(
          stationId,
          timeRange
        );
        // Update metrics in store
        useStore.setState((state) => ({
          kitchenDisplay: {
            ...state.kitchenDisplay,
            metrics,
          },
        }));
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
        toast.error('Failed to load metrics');
      }
    },
    []
  );

  /**
   * Setup real-time socket listeners
   */
  useEffect(() => {
    // Connect to socket if not connected
    if (!socketService.isConnected()) {
      socketService.connect(
        import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000'
      );
    }

    // Join kitchen room
    socketService.joinRoom('kitchen');

    // Listen for new orders
    const handleNewOrder = (order) => {
      console.log('New order received:', order);
      addKitchenOrder(order);
    };

    // Listen for order updates
    const handleOrderUpdate = (order) => {
      console.log('Order updated:', order);
      updateKitchenOrder(order.id, order);
    };

    // Listen for order status changes
    const handleOrderStatusChange = (data) => {
      console.log('Order status changed:', data);
      if (
        data.status === 'completed' ||
        data.status === 'cancelled' ||
        data.status === 'served'
      ) {
        removeKitchenOrder(data.orderId);
      } else {
        updateKitchenOrder(data.orderId, { status: data.status });
      }
    };

    socketService.onNewOrder(handleNewOrder);
    socketService.onOrderUpdate(handleOrderUpdate);
    socketService.onOrderStatusChange(handleOrderStatusChange);

    // Cleanup
    return () => {
      socketService.leaveRoom('kitchen');
      socketService.offNewOrder(handleNewOrder);
      socketService.offOrderUpdate(handleOrderUpdate);
      socketService.offOrderStatusChange(handleOrderStatusChange);
    };
  }, [addKitchenOrder, updateKitchenOrder, removeKitchenOrder]);

  /**
   * Setup auto-refresh interval
   */
  useEffect(() => {
    if (kitchenDisplay.autoRefresh) {
      intervalRef.current = setInterval(() => {
        fetchKitchenOrders();
      }, kitchenDisplay.refreshInterval * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    kitchenDisplay.autoRefresh,
    kitchenDisplay.refreshInterval,
    fetchKitchenOrders,
  ]);

  /**
   * Fetch initial orders on mount
   */
  useEffect(() => {
    fetchKitchenOrders();
  }, [fetchKitchenOrders]);

  return {
    // State
    ...kitchenDisplay,

    // Actions
    fetchKitchenOrders,
    startPreparing,
    updateItemStatus,
    markOrderReady,
    bumpOrder,
    printOrder,
    reprintOrder,
    updateOrderPriority,
    fetchMetrics,

    // Settings
    setSelectedStation,
    setViewMode,
    setSortBy,
    setFilterStatus,
    toggleSound,
    toggleNotifications,
    setAutoRefresh,
    updateStation,
  };
};

export default useKitchenDisplay;
