/**
 * QR Ordering Zustand Store Slice
 *
 * Manages state for QR code ordering system
 */

import {
  createTableQRCodeService,
  getQRCodes,
  getQRCodeById,
  getQRCodeByCode,
  updateQRCode,
  regenerateQRCode,
  deleteQRCode,
  activateQRCode,
  deactivateQRCode,
  createSession,
  getSession,
  getSessionByToken,
  getActiveSessionsForTable,
  updateSession,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  completeSession,
  createServerRequestService,
  getServerRequests,
  acknowledgeServerRequest,
  completeServerRequest,
  getQRCodeAnalytics,
  getOverallAnalytics
} from '../services/qrService';
import socketService from '../services/socketService';

/**
 * Creates the QR ordering slice
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} QR ordering slice
 */
export const createQROrderingSlice = (set, get) => ({
  // ============================================================================
  // STATE
  // ============================================================================

  qrOrdering: {
    // QR Codes
    qrCodes: [],
    currentQRCode: null,
    qrCodeLoading: false,
    qrCodeError: null,

    // Sessions
    sessions: [],
    currentSession: null,
    sessionLoading: false,
    sessionError: null,

    // Customer Cart (for customer-facing UI)
    customerCart: {
      items: [],
      totalItems: 0,
      subtotal: 0,
      tax: 0,
      total: 0
    },

    // Server Requests
    serverRequests: [],
    pendingRequests: [],
    requestLoading: false,
    requestError: null,

    // Analytics
    analytics: null,
    analyticsLoading: false,
    analyticsError: null,

    // Real-time
    socketConnected: false,
    socketError: null,

    // UI State
    selectedTableId: null,
    viewMode: 'grid', // grid or list
    filterStatus: 'all',
    searchQuery: ''
  },

  // ============================================================================
  // QR CODE ACTIONS
  // ============================================================================

  /**
   * Create QR code for table
   */
  createQRCode: async (tableData) => {
    set((state) => {
      state.qrOrdering.qrCodeLoading = true;
      state.qrOrdering.qrCodeError = null;
    });

    try {
      const qrCode = await createTableQRCodeService(tableData);

      set((state) => {
        state.qrOrdering.qrCodes.push(qrCode);
        state.qrOrdering.currentQRCode = qrCode;
        state.qrOrdering.qrCodeLoading = false;
      });

      return qrCode;
    } catch (error) {
      set((state) => {
        state.qrOrdering.qrCodeError = error.message;
        state.qrOrdering.qrCodeLoading = false;
      });
      throw error;
    }
  },

  /**
   * Fetch all QR codes
   */
  fetchQRCodes: async (filters = {}) => {
    set((state) => {
      state.qrOrdering.qrCodeLoading = true;
      state.qrOrdering.qrCodeError = null;
    });

    try {
      const qrCodes = await getQRCodes(filters);

      set((state) => {
        state.qrOrdering.qrCodes = qrCodes;
        state.qrOrdering.qrCodeLoading = false;
      });

      return qrCodes;
    } catch (error) {
      set((state) => {
        state.qrOrdering.qrCodeError = error.message;
        state.qrOrdering.qrCodeLoading = false;
      });
      throw error;
    }
  },

  /**
   * Fetch QR code by ID
   */
  fetchQRCodeById: async (id) => {
    set((state) => {
      state.qrOrdering.qrCodeLoading = true;
      state.qrOrdering.qrCodeError = null;
    });

    try {
      const qrCode = await getQRCodeById(id);

      set((state) => {
        state.qrOrdering.currentQRCode = qrCode;
        state.qrOrdering.qrCodeLoading = false;
      });

      return qrCode;
    } catch (error) {
      set((state) => {
        state.qrOrdering.qrCodeError = error.message;
        state.qrOrdering.qrCodeLoading = false;
      });
      throw error;
    }
  },

  /**
   * Fetch QR code by code string
   */
  fetchQRCodeByCode: async (code) => {
    set((state) => {
      state.qrOrdering.qrCodeLoading = true;
      state.qrOrdering.qrCodeError = null;
    });

    try {
      const qrCode = await getQRCodeByCode(code);

      set((state) => {
        state.qrOrdering.currentQRCode = qrCode;
        state.qrOrdering.qrCodeLoading = false;
      });

      return qrCode;
    } catch (error) {
      set((state) => {
        state.qrOrdering.qrCodeError = error.message;
        state.qrOrdering.qrCodeLoading = false;
      });
      throw error;
    }
  },

  /**
   * Update QR code
   */
  updateQRCode: async (id, updates) => {
    set((state) => {
      state.qrOrdering.qrCodeLoading = true;
      state.qrOrdering.qrCodeError = null;
    });

    try {
      const updated = await updateQRCode(id, updates);

      set((state) => {
        const index = state.qrOrdering.qrCodes.findIndex(qr => qr.id === id);
        if (index !== -1) {
          state.qrOrdering.qrCodes[index] = updated;
        }
        if (state.qrOrdering.currentQRCode?.id === id) {
          state.qrOrdering.currentQRCode = updated;
        }
        state.qrOrdering.qrCodeLoading = false;
      });

      return updated;
    } catch (error) {
      set((state) => {
        state.qrOrdering.qrCodeError = error.message;
        state.qrOrdering.qrCodeLoading = false;
      });
      throw error;
    }
  },

  /**
   * Regenerate QR code
   */
  regenerateQRCode: async (id) => {
    set((state) => {
      state.qrOrdering.qrCodeLoading = true;
      state.qrOrdering.qrCodeError = null;
    });

    try {
      const updated = await regenerateQRCode(id);

      set((state) => {
        const index = state.qrOrdering.qrCodes.findIndex(qr => qr.id === id);
        if (index !== -1) {
          state.qrOrdering.qrCodes[index] = updated;
        }
        if (state.qrOrdering.currentQRCode?.id === id) {
          state.qrOrdering.currentQRCode = updated;
        }
        state.qrOrdering.qrCodeLoading = false;
      });

      return updated;
    } catch (error) {
      set((state) => {
        state.qrOrdering.qrCodeError = error.message;
        state.qrOrdering.qrCodeLoading = false;
      });
      throw error;
    }
  },

  /**
   * Delete QR code
   */
  deleteQRCode: async (id) => {
    set((state) => {
      state.qrOrdering.qrCodeLoading = true;
      state.qrOrdering.qrCodeError = null;
    });

    try {
      await deleteQRCode(id);

      set((state) => {
        state.qrOrdering.qrCodes = state.qrOrdering.qrCodes.filter(qr => qr.id !== id);
        if (state.qrOrdering.currentQRCode?.id === id) {
          state.qrOrdering.currentQRCode = null;
        }
        state.qrOrdering.qrCodeLoading = false;
      });
    } catch (error) {
      set((state) => {
        state.qrOrdering.qrCodeError = error.message;
        state.qrOrdering.qrCodeLoading = false;
      });
      throw error;
    }
  },

  /**
   * Toggle QR code active status
   */
  toggleQRCodeStatus: async (id, activate = true) => {
    try {
      const updated = activate ? await activateQRCode(id) : await deactivateQRCode(id);

      set((state) => {
        const index = state.qrOrdering.qrCodes.findIndex(qr => qr.id === id);
        if (index !== -1) {
          state.qrOrdering.qrCodes[index] = updated;
        }
      });

      return updated;
    } catch (error) {
      console.error('Error toggling QR code status:', error);
      throw error;
    }
  },

  // ============================================================================
  // SESSION ACTIONS
  // ============================================================================

  /**
   * Create session from QR code scan
   */
  createQRSession: async (qrCode, customerData = {}) => {
    set((state) => {
      state.qrOrdering.sessionLoading = true;
      state.qrOrdering.sessionError = null;
    });

    try {
      const session = await createSession(qrCode, customerData);

      set((state) => {
        state.qrOrdering.sessions.push(session);
        state.qrOrdering.currentSession = session;
        state.qrOrdering.customerCart = session.cart;
        state.qrOrdering.sessionLoading = false;
      });

      // Join socket room for real-time updates
      if (socketService.isConnected()) {
        socketService.joinSession(session.id);
        socketService.joinTable(session.tableId);
      }

      return session;
    } catch (error) {
      set((state) => {
        state.qrOrdering.sessionError = error.message;
        state.qrOrdering.sessionLoading = false;
      });
      throw error;
    }
  },

  /**
   * Fetch session by ID
   */
  fetchSession: async (id) => {
    set((state) => {
      state.qrOrdering.sessionLoading = true;
      state.qrOrdering.sessionError = null;
    });

    try {
      const session = await getSession(id);

      set((state) => {
        state.qrOrdering.currentSession = session;
        if (session) {
          state.qrOrdering.customerCart = session.cart;
        }
        state.qrOrdering.sessionLoading = false;
      });

      return session;
    } catch (error) {
      set((state) => {
        state.qrOrdering.sessionError = error.message;
        state.qrOrdering.sessionLoading = false;
      });
      throw error;
    }
  },

  /**
   * Fetch session by token
   */
  fetchSessionByToken: async (token) => {
    set((state) => {
      state.qrOrdering.sessionLoading = true;
      state.qrOrdering.sessionError = null;
    });

    try {
      const session = await getSessionByToken(token);

      set((state) => {
        state.qrOrdering.currentSession = session;
        if (session) {
          state.qrOrdering.customerCart = session.cart;
        }
        state.qrOrdering.sessionLoading = false;
      });

      return session;
    } catch (error) {
      set((state) => {
        state.qrOrdering.sessionError = error.message;
        state.qrOrdering.sessionLoading = false;
      });
      throw error;
    }
  },

  /**
   * Update current session
   */
  updateCurrentSession: async (updates) => {
    const currentSession = get().qrOrdering.currentSession;
    if (!currentSession) {
      throw new Error('No active session');
    }

    try {
      const updated = await updateSession(currentSession.id, updates);

      set((state) => {
        state.qrOrdering.currentSession = updated;
        if (updated.cart) {
          state.qrOrdering.customerCart = updated.cart;
        }
      });

      return updated;
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  },

  /**
   * Complete current session
   */
  completeCurrentSession: async () => {
    const currentSession = get().qrOrdering.currentSession;
    if (!currentSession) {
      throw new Error('No active session');
    }

    try {
      const completed = await completeSession(currentSession.id);

      set((state) => {
        state.qrOrdering.currentSession = null;
        state.qrOrdering.customerCart = {
          items: [],
          totalItems: 0,
          subtotal: 0,
          tax: 0,
          total: 0
        };
      });

      // Leave socket rooms
      if (socketService.isConnected()) {
        socketService.leaveSession(currentSession.id);
        socketService.leaveTable(currentSession.tableId);
      }

      return completed;
    } catch (error) {
      console.error('Error completing session:', error);
      throw error;
    }
  },

  // ============================================================================
  // CART ACTIONS
  // ============================================================================

  /**
   * Add item to cart
   */
  addItemToCart: async (item) => {
    const currentSession = get().qrOrdering.currentSession;
    if (!currentSession) {
      throw new Error('No active session');
    }

    try {
      const updated = await addToCart(currentSession.id, item);

      set((state) => {
        state.qrOrdering.currentSession = updated;
        state.qrOrdering.customerCart = updated.cart;
      });

      // Emit cart update via socket
      if (socketService.isConnected()) {
        socketService.updateCart(currentSession.id, updated.cart);
      }

      return updated;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  /**
   * Remove item from cart
   */
  removeItemFromCart: async (itemId) => {
    const currentSession = get().qrOrdering.currentSession;
    if (!currentSession) {
      throw new Error('No active session');
    }

    try {
      const updated = await removeFromCart(currentSession.id, itemId);

      set((state) => {
        state.qrOrdering.currentSession = updated;
        state.qrOrdering.customerCart = updated.cart;
      });

      // Emit cart update via socket
      if (socketService.isConnected()) {
        socketService.updateCart(currentSession.id, updated.cart);
      }

      return updated;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  /**
   * Update cart item quantity
   */
  updateItemQuantity: async (itemId, quantity) => {
    const currentSession = get().qrOrdering.currentSession;
    if (!currentSession) {
      throw new Error('No active session');
    }

    try {
      const updated = await updateCartItemQuantity(currentSession.id, itemId, quantity);

      set((state) => {
        state.qrOrdering.currentSession = updated;
        state.qrOrdering.customerCart = updated.cart;
      });

      // Emit cart update via socket
      if (socketService.isConnected()) {
        socketService.updateCart(currentSession.id, updated.cart);
      }

      return updated;
    } catch (error) {
      console.error('Error updating quantity:', error);
      throw error;
    }
  },

  /**
   * Clear cart
   */
  clearCustomerCart: async () => {
    const currentSession = get().qrOrdering.currentSession;
    if (!currentSession) {
      throw new Error('No active session');
    }

    try {
      const updated = await clearCart(currentSession.id);

      set((state) => {
        state.qrOrdering.currentSession = updated;
        state.qrOrdering.customerCart = updated.cart;
      });

      return updated;
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  // ============================================================================
  // SERVER REQUEST ACTIONS
  // ============================================================================

  /**
   * Call server
   */
  callServer: async (message = '') => {
    const currentSession = get().qrOrdering.currentSession;
    if (!currentSession) {
      throw new Error('No active session');
    }

    set((state) => {
      state.qrOrdering.requestLoading = true;
      state.qrOrdering.requestError = null;
    });

    try {
      const request = await createServerRequestService({
        sessionId: currentSession.id,
        tableId: currentSession.tableId,
        type: 'call_server',
        message
      });

      set((state) => {
        state.qrOrdering.serverRequests.unshift(request);
        state.qrOrdering.pendingRequests.unshift(request);
        state.qrOrdering.requestLoading = false;
      });

      // Emit via socket
      if (socketService.isConnected()) {
        socketService.callServer(request);
      }

      return request;
    } catch (error) {
      set((state) => {
        state.qrOrdering.requestError = error.message;
        state.qrOrdering.requestLoading = false;
      });
      throw error;
    }
  },

  /**
   * Request bill
   */
  requestBill: async (message = '') => {
    const currentSession = get().qrOrdering.currentSession;
    if (!currentSession) {
      throw new Error('No active session');
    }

    set((state) => {
      state.qrOrdering.requestLoading = true;
      state.qrOrdering.requestError = null;
    });

    try {
      const request = await createServerRequestService({
        sessionId: currentSession.id,
        tableId: currentSession.tableId,
        type: 'request_bill',
        message
      });

      set((state) => {
        state.qrOrdering.serverRequests.unshift(request);
        state.qrOrdering.pendingRequests.unshift(request);
        state.qrOrdering.requestLoading = false;
      });

      // Emit via socket
      if (socketService.isConnected()) {
        socketService.requestBill(request);
      }

      return request;
    } catch (error) {
      set((state) => {
        state.qrOrdering.requestError = error.message;
        state.qrOrdering.requestLoading = false;
      });
      throw error;
    }
  },

  /**
   * Fetch server requests
   */
  fetchServerRequests: async (filters = {}) => {
    set((state) => {
      state.qrOrdering.requestLoading = true;
      state.qrOrdering.requestError = null;
    });

    try {
      const requests = await getServerRequests(filters);

      set((state) => {
        state.qrOrdering.serverRequests = requests;
        state.qrOrdering.pendingRequests = requests.filter(r => r.status === 'pending');
        state.qrOrdering.requestLoading = false;
      });

      return requests;
    } catch (error) {
      set((state) => {
        state.qrOrdering.requestError = error.message;
        state.qrOrdering.requestLoading = false;
      });
      throw error;
    }
  },

  // ============================================================================
  // ANALYTICS ACTIONS
  // ============================================================================

  /**
   * Fetch analytics
   */
  fetchAnalytics: async () => {
    set((state) => {
      state.qrOrdering.analyticsLoading = true;
      state.qrOrdering.analyticsError = null;
    });

    try {
      const analytics = await getOverallAnalytics();

      set((state) => {
        state.qrOrdering.analytics = analytics;
        state.qrOrdering.analyticsLoading = false;
      });

      return analytics;
    } catch (error) {
      set((state) => {
        state.qrOrdering.analyticsError = error.message;
        state.qrOrdering.analyticsLoading = false;
      });
      throw error;
    }
  },

  // ============================================================================
  // SOCKET ACTIONS
  // ============================================================================

  /**
   * Connect to socket
   */
  connectSocket: () => {
    try {
      socketService.connect();

      // Listen for connection events
      socketService.on('connection', (data) => {
        set((state) => {
          state.qrOrdering.socketConnected = data.status === 'connected' || data.status === 'reconnected';
          state.qrOrdering.socketError = data.error || null;
        });
      });

      // Listen for order updates
      socketService.onOrderUpdate((order) => {
        // Handle order update
        console.log('Order updated:', order);
      });

      // Listen for session updates
      socketService.onSessionUpdate((session) => {
        set((state) => {
          if (state.qrOrdering.currentSession?.id === session.id) {
            state.qrOrdering.currentSession = session;
            state.qrOrdering.customerCart = session.cart;
          }
        });
      });
    } catch (error) {
      set((state) => {
        state.qrOrdering.socketError = error.message;
      });
    }
  },

  /**
   * Disconnect from socket
   */
  disconnectSocket: () => {
    socketService.disconnect();
    set((state) => {
      state.qrOrdering.socketConnected = false;
    });
  },

  // ============================================================================
  // UI ACTIONS
  // ============================================================================

  /**
   * Set selected table
   */
  setSelectedTable: (tableId) => {
    set((state) => {
      state.qrOrdering.selectedTableId = tableId;
    });
  },

  /**
   * Set view mode
   */
  setViewMode: (mode) => {
    set((state) => {
      state.qrOrdering.viewMode = mode;
    });
  },

  /**
   * Set filter status
   */
  setFilterStatus: (status) => {
    set((state) => {
      state.qrOrdering.filterStatus = status;
    });
  },

  /**
   * Set search query
   */
  setSearchQuery: (query) => {
    set((state) => {
      state.qrOrdering.searchQuery = query;
    });
  },

  /**
   * Reset QR ordering state
   */
  resetQROrdering: () => {
    set((state) => {
      state.qrOrdering = {
        qrCodes: [],
        currentQRCode: null,
        qrCodeLoading: false,
        qrCodeError: null,
        sessions: [],
        currentSession: null,
        sessionLoading: false,
        sessionError: null,
        customerCart: {
          items: [],
          totalItems: 0,
          subtotal: 0,
          tax: 0,
          total: 0
        },
        serverRequests: [],
        pendingRequests: [],
        requestLoading: false,
        requestError: null,
        analytics: null,
        analyticsLoading: false,
        analyticsError: null,
        socketConnected: false,
        socketError: null,
        selectedTableId: null,
        viewMode: 'grid',
        filterStatus: 'all',
        searchQuery: ''
      };
    });
  }
});
