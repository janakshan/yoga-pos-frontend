/**
 * Kitchen Display Service
 *
 * Handles API calls and business logic for Kitchen Display System
 */

import apiClient from '@/services/apiClient';

/**
 * Kitchen Service
 */
export const kitchenService = {
  /**
   * Get kitchen orders for specific station
   * @param {string} stationId - Station ID (null for all stations)
   * @param {Object} filters - Additional filters
   * @returns {Promise<Array>} Kitchen orders
   */
  async getKitchenOrders(stationId = null, filters = {}) {
    try {
      const params = {
        status: ['pending', 'confirmed', 'preparing', 'ready'],
        ...filters,
      };

      if (stationId) {
        params.kitchenStation = stationId;
      }

      const response = await apiClient.get('/restaurant-orders', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch kitchen orders:', error);
      throw error;
    }
  },

  /**
   * Get active orders for kitchen display
   * @returns {Promise<Array>} Active kitchen orders
   */
  async getActiveKitchenOrders() {
    try {
      const response = await apiClient.get('/restaurant-orders/active-kitchen');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch active kitchen orders:', error);
      throw error;
    }
  },

  /**
   * Update order item status in kitchen
   * @param {string} orderId - Order ID
   * @param {string} itemId - Item ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated order
   */
  async updateItemStatus(orderId, itemId, status) {
    try {
      const response = await apiClient.patch(
        `/restaurant-orders/${orderId}/items/${itemId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update item status:', error);
      throw error;
    }
  },

  /**
   * Mark order as ready
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Updated order
   */
  async markOrderReady(orderId) {
    try {
      const response = await apiClient.patch(
        `/restaurant-orders/${orderId}/status`,
        { status: 'ready' }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to mark order ready:', error);
      throw error;
    }
  },

  /**
   * Bump order (mark as completed/served)
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Updated order
   */
  async bumpOrder(orderId) {
    try {
      const response = await apiClient.patch(
        `/restaurant-orders/${orderId}/status`,
        { status: 'served' }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to bump order:', error);
      throw error;
    }
  },

  /**
   * Start preparing order
   * @param {string} orderId - Order ID
   * @returns {Promise<Object>} Updated order
   */
  async startPreparing(orderId) {
    try {
      const response = await apiClient.patch(
        `/restaurant-orders/${orderId}/status`,
        { status: 'preparing' }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to start preparing order:', error);
      throw error;
    }
  },

  /**
   * Get kitchen performance metrics
   * @param {string} stationId - Station ID (null for all)
   * @param {string} timeRange - Time range (today, week, month)
   * @returns {Promise<Object>} Performance metrics
   */
  async getPerformanceMetrics(stationId = null, timeRange = 'today') {
    try {
      const params = { timeRange };
      if (stationId) {
        params.stationId = stationId;
      }

      const response = await apiClient.get('/kitchen/metrics', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
      throw error;
    }
  },

  /**
   * Get station configurations
   * @returns {Promise<Array>} Station configurations
   */
  async getStations() {
    try {
      const response = await apiClient.get('/kitchen/stations');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch stations:', error);
      throw error;
    }
  },

  /**
   * Update station configuration
   * @param {string} stationId - Station ID
   * @param {Object} updates - Station updates
   * @returns {Promise<Object>} Updated station
   */
  async updateStation(stationId, updates) {
    try {
      const response = await apiClient.patch(
        `/kitchen/stations/${stationId}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update station:', error);
      throw error;
    }
  },

  /**
   * Print order to kitchen printer
   * @param {string} orderId - Order ID
   * @param {string} stationId - Station ID
   * @returns {Promise<Object>} Print result
   */
  async printOrder(orderId, stationId) {
    try {
      const response = await apiClient.post('/kitchen/print', {
        orderId,
        stationId,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to print order:', error);
      throw error;
    }
  },

  /**
   * Reprint order
   * @param {string} orderId - Order ID
   * @param {string} stationId - Station ID
   * @returns {Promise<Object>} Print result
   */
  async reprintOrder(orderId, stationId) {
    try {
      const response = await apiClient.post('/kitchen/reprint', {
        orderId,
        stationId,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to reprint order:', error);
      throw error;
    }
  },

  /**
   * Get orders by course sequence
   * @param {string} course - Course type
   * @returns {Promise<Array>} Orders for course
   */
  async getOrdersByCourse(course) {
    try {
      const response = await apiClient.get('/kitchen/orders-by-course', {
        params: { course },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders by course:', error);
      throw error;
    }
  },

  /**
   * Update order priority
   * @param {string} orderId - Order ID
   * @param {string} priority - Priority level
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderPriority(orderId, priority) {
    try {
      const response = await apiClient.patch(
        `/restaurant-orders/${orderId}/priority`,
        { priority }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update order priority:', error);
      throw error;
    }
  },
};

export default kitchenService;
