/**
 * Socket.IO Service for Real-time Updates
 *
 * Handles real-time communication for QR ordering system
 */

import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  /**
   * Connect to socket server
   * @param {string} url - Socket server URL
   * @param {Object} options - Socket.IO options
   */
  connect(url = null, options = {}) {
    const socketUrl = url || import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

    const defaultOptions = {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      ...options
    };

    this.socket = io(socketUrl, defaultOptions);

    // Connection event handlers
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.connected = true;
      this.emit('connection', { status: 'connected', id: this.socket.id });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.connected = false;
      this.emit('connection', { status: 'disconnected', reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.emit('connection', { status: 'error', error: error.message });
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.emit('connection', { status: 'reconnected', attemptNumber });
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
      this.emit('connection', { status: 'failed' });
    });

    return this;
  }

  /**
   * Disconnect from socket server
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners.clear();
    }
  }

  /**
   * Check if socket is connected
   * @returns {boolean}
   */
  isConnected() {
    return this.connected && this.socket?.connected;
  }

  /**
   * Join a room
   * @param {string} room - Room name
   */
  joinRoom(room) {
    if (!this.isConnected()) {
      console.warn('Cannot join room: socket not connected');
      return;
    }
    this.socket.emit('join_room', room);
    console.log('Joined room:', room);
  }

  /**
   * Leave a room
   * @param {string} room - Room name
   */
  leaveRoom(room) {
    if (!this.isConnected()) {
      console.warn('Cannot leave room: socket not connected');
      return;
    }
    this.socket.emit('leave_room', room);
    console.log('Left room:', room);
  }

  /**
   * Emit event to server
   * @param {string} event - Event name
   * @param {*} data - Data to send
   */
  emit(event, data) {
    if (event !== 'connection' && !this.isConnected()) {
      console.warn(`Cannot emit ${event}: socket not connected`);
      return;
    }

    // Notify local listeners
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in listener for ${event}:`, error);
        }
      });
    }

    // Emit to server if connected and not a local-only event
    if (event !== 'connection' && this.socket) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Listen for events from server
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Also listen on socket if connected
    if (this.socket) {
      this.socket.on(event, callback);
    }

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).delete(callback);
      if (this.listeners.get(event).size === 0) {
        this.listeners.delete(event);
      }
    }

    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  /**
   * Listen for event once
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  once(event, callback) {
    const wrappedCallback = (data) => {
      callback(data);
      this.off(event, wrappedCallback);
    };
    this.on(event, wrappedCallback);
  }

  // ============================================================================
  // QR ORDERING SPECIFIC METHODS
  // ============================================================================

  /**
   * Join session room for real-time updates
   * @param {string} sessionId - Session ID
   */
  joinSession(sessionId) {
    this.joinRoom(`session:${sessionId}`);
  }

  /**
   * Leave session room
   * @param {string} sessionId - Session ID
   */
  leaveSession(sessionId) {
    this.leaveRoom(`session:${sessionId}`);
  }

  /**
   * Join table room for real-time updates
   * @param {string} tableId - Table ID
   */
  joinTable(tableId) {
    this.joinRoom(`table:${tableId}`);
  }

  /**
   * Leave table room
   * @param {string} tableId - Table ID
   */
  leaveTable(tableId) {
    this.leaveRoom(`table:${tableId}`);
  }

  /**
   * Subscribe to order updates
   * @param {Function} callback - Callback for order updates
   * @returns {Function} Unsubscribe function
   */
  onOrderUpdate(callback) {
    return this.on('order:update', callback);
  }

  /**
   * Subscribe to order status changes
   * @param {Function} callback - Callback for status changes
   * @returns {Function} Unsubscribe function
   */
  onOrderStatusChange(callback) {
    return this.on('order:status', callback);
  }

  /**
   * Subscribe to new orders
   * @param {Function} callback - Callback for new orders
   * @returns {Function} Unsubscribe function
   */
  onNewOrder(callback) {
    return this.on('order:new', callback);
  }

  /**
   * Subscribe to session updates
   * @param {Function} callback - Callback for session updates
   * @returns {Function} Unsubscribe function
   */
  onSessionUpdate(callback) {
    return this.on('session:update', callback);
  }

  /**
   * Subscribe to server requests
   * @param {Function} callback - Callback for server requests
   * @returns {Function} Unsubscribe function
   */
  onServerRequest(callback) {
    return this.on('server:request', callback);
  }

  /**
   * Subscribe to server request responses
   * @param {Function} callback - Callback for server responses
   * @returns {Function} Unsubscribe function
   */
  onServerResponse(callback) {
    return this.on('server:response', callback);
  }

  /**
   * Emit order placement
   * @param {Object} orderData - Order data
   */
  submitOrder(orderData) {
    this.emit('order:submit', orderData);
  }

  /**
   * Emit server call request
   * @param {Object} requestData - Request data
   */
  callServer(requestData) {
    this.emit('server:call', requestData);
  }

  /**
   * Emit bill request
   * @param {Object} requestData - Request data
   */
  requestBill(requestData) {
    this.emit('server:bill', requestData);
  }

  /**
   * Update cart in real-time
   * @param {string} sessionId - Session ID
   * @param {Object} cart - Cart data
   */
  updateCart(sessionId, cart) {
    this.emit('cart:update', { sessionId, cart });
  }

  /**
   * Notify customer joined
   * @param {string} sessionId - Session ID
   * @param {Object} customerData - Customer data
   */
  customerJoined(sessionId, customerData) {
    this.emit('customer:joined', { sessionId, ...customerData });
  }

  /**
   * Notify customer left
   * @param {string} sessionId - Session ID
   */
  customerLeft(sessionId) {
    this.emit('customer:left', { sessionId });
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;

// Also export the class for testing or multiple instances
export { SocketService };
