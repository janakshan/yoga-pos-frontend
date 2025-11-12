/**
 * QR Code Ordering Service
 *
 * Handles QR code generation, session management, and ordering operations
 */

import QRCode from 'qrcode';
import {
  createTableQRCode,
  createQROrderSession,
  createServerRequest,
  generateQRCode,
  generateSessionToken,
  QR_CODE_STATUS,
  QR_CODE_TYPE,
  SESSION_STATUS,
  SERVER_REQUEST_TYPE,
  SERVER_REQUEST_STATUS,
  formatQRCodeUrl
} from '../types/qr.types';

// Mock delay for simulating API calls
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data storage (in real app, this would be API calls)
let qrCodes = [];
let sessions = [];
let serverRequests = [];

// ============================================================================
// QR CODE GENERATION
// ============================================================================

/**
 * Generate QR code image as data URL
 * @param {string} url - URL to encode
 * @param {Object} options - QR code options
 * @returns {Promise<string>} Data URL of QR code image
 */
export const generateQRCodeImage = async (url, options = {}) => {
  const defaultOptions = {
    width: 300,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    margin: 2,
    ...options
  };

  try {
    const dataUrl = await QRCode.toDataURL(url, defaultOptions);
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Download QR code as image file
 * @param {string} dataUrl - QR code data URL
 * @param {string} filename - File name
 */
export const downloadQRCode = (dataUrl, filename = 'qr-code.png') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Print QR code
 * @param {string} dataUrl - QR code data URL
 * @param {string} tableName - Table name for print label
 */
export const printQRCode = (dataUrl, tableName) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>QR Code - ${tableName}</title>
        <style>
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            font-family: Arial, sans-serif;
          }
          h1 {
            margin-bottom: 20px;
            font-size: 24px;
          }
          img {
            max-width: 100%;
          }
          p {
            margin-top: 20px;
            font-size: 14px;
            color: #666;
          }
          @media print {
            @page {
              margin: 1cm;
            }
          }
        </style>
      </head>
      <body>
        <h1>${tableName}</h1>
        <img src="${dataUrl}" alt="QR Code" />
        <p>Scan to order</p>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
  }, 250);
};

// ============================================================================
// TABLE QR CODE CRUD
// ============================================================================

/**
 * Create QR code for a table
 * @param {Object} tableData - Table information
 * @returns {Promise<Object>} Created QR code
 */
export const createTableQRCodeService = async (tableData) => {
  await delay();

  const code = generateQRCode(tableData.tableNumber || tableData.id);
  const baseUrl = window.location.origin;
  const url = formatQRCodeUrl(baseUrl, code);

  // Generate QR code image
  const qrCodeDataUrl = await generateQRCodeImage(url, {
    width: tableData.config?.size || 300,
    errorCorrectionLevel: tableData.config?.errorCorrectionLevel || 'M',
    color: {
      dark: tableData.config?.foregroundColor || '#000000',
      light: tableData.config?.backgroundColor || '#FFFFFF'
    }
  });

  const qrCode = createTableQRCode({
    id: `qr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    code,
    tableId: tableData.tableId || tableData.id,
    type: tableData.type || QR_CODE_TYPE.TABLE,
    status: QR_CODE_STATUS.ACTIVE,
    qrCodeDataUrl,
    url,
    config: tableData.config,
    settings: tableData.settings,
    restrictions: tableData.restrictions,
    metadata: {
      generatedBy: tableData.generatedBy,
      notes: tableData.notes || ''
    }
  });

  qrCodes.push(qrCode);
  return qrCode;
};

/**
 * Get all QR codes
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>} QR codes
 */
export const getQRCodes = async (filters = {}) => {
  await delay(300);

  let filtered = [...qrCodes];

  if (filters.status) {
    filtered = filtered.filter(qr => qr.status === filters.status);
  }

  if (filters.type) {
    filtered = filtered.filter(qr => qr.type === filters.type);
  }

  if (filters.tableId) {
    filtered = filtered.filter(qr => qr.tableId === filters.tableId);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(qr =>
      qr.code.toLowerCase().includes(searchLower) ||
      qr.tableId?.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

/**
 * Get QR code by ID
 * @param {string} id - QR code ID
 * @returns {Promise<Object|null>}
 */
export const getQRCodeById = async (id) => {
  await delay(200);
  return qrCodes.find(qr => qr.id === id) || null;
};

/**
 * Get QR code by code string
 * @param {string} code - QR code string
 * @returns {Promise<Object|null>}
 */
export const getQRCodeByCode = async (code) => {
  await delay(200);
  return qrCodes.find(qr => qr.code === code) || null;
};

/**
 * Update QR code
 * @param {string} id - QR code ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>}
 */
export const updateQRCode = async (id, updates) => {
  await delay();

  const index = qrCodes.findIndex(qr => qr.id === id);
  if (index === -1) {
    throw new Error('QR code not found');
  }

  qrCodes[index] = {
    ...qrCodes[index],
    ...updates,
    updatedAt: new Date()
  };

  return qrCodes[index];
};

/**
 * Regenerate QR code (creates new code string)
 * @param {string} id - QR code ID
 * @returns {Promise<Object>}
 */
export const regenerateQRCode = async (id) => {
  await delay();

  const qrCode = qrCodes.find(qr => qr.id === id);
  if (!qrCode) {
    throw new Error('QR code not found');
  }

  const newCode = generateQRCode(qrCode.tableId);
  const baseUrl = window.location.origin;
  const url = formatQRCodeUrl(baseUrl, newCode);

  const qrCodeDataUrl = await generateQRCodeImage(url, {
    width: qrCode.config.size,
    errorCorrectionLevel: qrCode.config.errorCorrectionLevel,
    color: {
      dark: qrCode.config.foregroundColor,
      light: qrCode.config.backgroundColor
    }
  });

  return updateQRCode(id, {
    code: newCode,
    url,
    qrCodeDataUrl,
    analytics: {
      ...qrCode.analytics,
      totalScans: 0,
      totalSessions: 0,
      totalOrders: 0,
      totalRevenue: 0
    }
  });
};

/**
 * Delete QR code
 * @param {string} id - QR code ID
 * @returns {Promise<boolean>}
 */
export const deleteQRCode = async (id) => {
  await delay();

  const index = qrCodes.findIndex(qr => qr.id === id);
  if (index === -1) {
    return false;
  }

  qrCodes.splice(index, 1);
  return true;
};

/**
 * Activate QR code
 * @param {string} id - QR code ID
 * @returns {Promise<Object>}
 */
export const activateQRCode = async (id) => {
  return updateQRCode(id, { status: QR_CODE_STATUS.ACTIVE });
};

/**
 * Deactivate QR code
 * @param {string} id - QR code ID
 * @returns {Promise<Object>}
 */
export const deactivateQRCode = async (id) => {
  return updateQRCode(id, { status: QR_CODE_STATUS.INACTIVE });
};

/**
 * Revoke QR code (for security)
 * @param {string} id - QR code ID
 * @returns {Promise<Object>}
 */
export const revokeQRCode = async (id) => {
  return updateQRCode(id, { status: QR_CODE_STATUS.REVOKED });
};

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Create QR order session
 * @param {string} qrCode - QR code string
 * @param {Object} data - Additional session data
 * @returns {Promise<Object>} Created session
 */
export const createSession = async (qrCode, data = {}) => {
  await delay();

  const qr = await getQRCodeByCode(qrCode);
  if (!qr) {
    throw new Error('Invalid QR code');
  }

  if (qr.status !== QR_CODE_STATUS.ACTIVE) {
    throw new Error('QR code is not active');
  }

  const sessionToken = generateSessionToken();
  const expirationMinutes = qr.settings.sessionTimeout || 120;
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + expirationMinutes);

  const session = createQROrderSession({
    id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    sessionToken,
    tableId: qr.tableId,
    qrCodeId: qr.id,
    status: SESSION_STATUS.ACTIVE,
    expiresAt,
    ...data
  });

  sessions.push(session);

  // Update QR code analytics
  await updateQRCode(qr.id, {
    analytics: {
      ...qr.analytics,
      totalScans: qr.analytics.totalScans + 1,
      totalSessions: qr.analytics.totalSessions + 1,
      lastScannedAt: new Date()
    },
    lastUsedAt: new Date()
  });

  return session;
};

/**
 * Get session by ID
 * @param {string} id - Session ID
 * @returns {Promise<Object|null>}
 */
export const getSession = async (id) => {
  await delay(200);
  return sessions.find(s => s.id === id) || null;
};

/**
 * Get session by token
 * @param {string} token - Session token
 * @returns {Promise<Object|null>}
 */
export const getSessionByToken = async (token) => {
  await delay(200);
  return sessions.find(s => s.sessionToken === token) || null;
};

/**
 * Get active sessions for a table
 * @param {string} tableId - Table ID
 * @returns {Promise<Array>}
 */
export const getActiveSessionsForTable = async (tableId) => {
  await delay(200);
  return sessions.filter(s =>
    s.tableId === tableId &&
    (s.status === SESSION_STATUS.ACTIVE || s.status === SESSION_STATUS.ORDERING)
  );
};

/**
 * Update session
 * @param {string} id - Session ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>}
 */
export const updateSession = async (id, updates) => {
  await delay();

  const index = sessions.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error('Session not found');
  }

  sessions[index] = {
    ...sessions[index],
    ...updates,
    lastActivityAt: new Date(),
    updatedAt: new Date()
  };

  return sessions[index];
};

/**
 * Add item to session cart
 * @param {string} sessionId - Session ID
 * @param {Object} item - Cart item
 * @returns {Promise<Object>} Updated session
 */
export const addToCart = async (sessionId, item) => {
  const session = await getSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  const cart = { ...session.cart };
  cart.items = [...cart.items, item];

  // Recalculate totals
  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  cart.totalItems = totalItems;
  cart.subtotal = Number(subtotal.toFixed(2));
  cart.tax = Number(tax.toFixed(2));
  cart.total = Number(total.toFixed(2));

  return updateSession(sessionId, {
    cart,
    status: SESSION_STATUS.ORDERING
  });
};

/**
 * Remove item from session cart
 * @param {string} sessionId - Session ID
 * @param {string} itemId - Cart item ID
 * @returns {Promise<Object>} Updated session
 */
export const removeFromCart = async (sessionId, itemId) => {
  const session = await getSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  const cart = { ...session.cart };
  cart.items = cart.items.filter(i => i.id !== itemId);

  // Recalculate totals
  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  cart.totalItems = totalItems;
  cart.subtotal = Number(subtotal.toFixed(2));
  cart.tax = Number(tax.toFixed(2));
  cart.total = Number(total.toFixed(2));

  return updateSession(sessionId, { cart });
};

/**
 * Update cart item quantity
 * @param {string} sessionId - Session ID
 * @param {string} itemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated session
 */
export const updateCartItemQuantity = async (sessionId, itemId, quantity) => {
  const session = await getSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  const cart = { ...session.cart };
  const itemIndex = cart.items.findIndex(i => i.id === itemId);

  if (itemIndex === -1) {
    throw new Error('Cart item not found');
  }

  cart.items[itemIndex] = {
    ...cart.items[itemIndex],
    quantity,
    subtotal: cart.items[itemIndex].price * quantity
  };

  // Recalculate totals
  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = cart.items.reduce((sum, i) => sum + i.subtotal, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  cart.totalItems = totalItems;
  cart.subtotal = Number(subtotal.toFixed(2));
  cart.tax = Number(tax.toFixed(2));
  cart.total = Number(total.toFixed(2));

  return updateSession(sessionId, { cart });
};

/**
 * Clear session cart
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Updated session
 */
export const clearCart = async (sessionId) => {
  return updateSession(sessionId, {
    cart: {
      items: [],
      totalItems: 0,
      subtotal: 0,
      tax: 0,
      total: 0
    }
  });
};

/**
 * Complete session
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Updated session
 */
export const completeSession = async (sessionId) => {
  return updateSession(sessionId, {
    status: SESSION_STATUS.COMPLETED,
    completedAt: new Date()
  });
};

/**
 * Expire session
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} Updated session
 */
export const expireSession = async (sessionId) => {
  return updateSession(sessionId, {
    status: SESSION_STATUS.EXPIRED
  });
};

// ============================================================================
// SERVER REQUESTS
// ============================================================================

/**
 * Create server request
 * @param {Object} requestData - Request data
 * @returns {Promise<Object>} Created request
 */
export const createServerRequestService = async (requestData) => {
  await delay();

  const request = createServerRequest({
    id: `request-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...requestData
  });

  serverRequests.push(request);

  // Update session actions
  if (requestData.sessionId) {
    const session = await getSession(requestData.sessionId);
    if (session) {
      const actions = { ...session.actions };
      actions.history.push({
        type: requestData.type,
        timestamp: new Date()
      });

      if (requestData.type === SERVER_REQUEST_TYPE.CALL_SERVER) {
        actions.callServerCount += 1;
        actions.lastCallServerAt = new Date();
      } else if (requestData.type === SERVER_REQUEST_TYPE.REQUEST_BILL) {
        actions.billRequested = true;
        actions.billRequestedAt = new Date();
      }

      await updateSession(requestData.sessionId, { actions });
    }
  }

  return request;
};

/**
 * Get all server requests
 * @param {Object} filters - Filter options
 * @returns {Promise<Array>}
 */
export const getServerRequests = async (filters = {}) => {
  await delay(200);

  let filtered = [...serverRequests];

  if (filters.status) {
    filtered = filtered.filter(r => r.status === filters.status);
  }

  if (filters.type) {
    filtered = filtered.filter(r => r.type === filters.type);
  }

  if (filters.tableId) {
    filtered = filtered.filter(r => r.tableId === filters.tableId);
  }

  return filtered.sort((a, b) => b.requestedAt - a.requestedAt);
};

/**
 * Acknowledge server request
 * @param {string} id - Request ID
 * @param {string} assignedTo - Server user ID
 * @returns {Promise<Object>}
 */
export const acknowledgeServerRequest = async (id, assignedTo = null) => {
  await delay();

  const index = serverRequests.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error('Request not found');
  }

  serverRequests[index] = {
    ...serverRequests[index],
    status: SERVER_REQUEST_STATUS.ACKNOWLEDGED,
    acknowledgedAt: new Date(),
    assignedTo
  };

  return serverRequests[index];
};

/**
 * Complete server request
 * @param {string} id - Request ID
 * @returns {Promise<Object>}
 */
export const completeServerRequest = async (id) => {
  await delay();

  const index = serverRequests.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error('Request not found');
  }

  serverRequests[index] = {
    ...serverRequests[index],
    status: SERVER_REQUEST_STATUS.COMPLETED,
    completedAt: new Date()
  };

  return serverRequests[index];
};

// ============================================================================
// ANALYTICS
// ============================================================================

/**
 * Get QR code analytics
 * @param {string} id - QR code ID
 * @returns {Promise<Object>}
 */
export const getQRCodeAnalytics = async (id) => {
  await delay(200);

  const qrCode = await getQRCodeById(id);
  if (!qrCode) {
    throw new Error('QR code not found');
  }

  const qrSessions = sessions.filter(s => s.qrCodeId === id);
  const activeSessions = qrSessions.filter(s =>
    s.status === SESSION_STATUS.ACTIVE || s.status === SESSION_STATUS.ORDERING
  );

  return {
    ...qrCode.analytics,
    activeSessionsCount: activeSessions.length,
    averageSessionDuration: calculateAverageSessionDuration(qrSessions),
    conversionRate: calculateConversionRate(qrSessions)
  };
};

/**
 * Get overall analytics
 * @returns {Promise<Object>}
 */
export const getOverallAnalytics = async () => {
  await delay(300);

  const totalQRCodes = qrCodes.length;
  const activeQRCodes = qrCodes.filter(qr => qr.status === QR_CODE_STATUS.ACTIVE).length;
  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.analytics.totalScans, 0);
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(s =>
    s.status === SESSION_STATUS.ACTIVE || s.status === SESSION_STATUS.ORDERING
  ).length;
  const totalOrders = sessions.reduce((sum, s) => sum + s.orderIds.length, 0);
  const totalRevenue = qrCodes.reduce((sum, qr) => sum + qr.analytics.totalRevenue, 0);

  return {
    totalQRCodes,
    activeQRCodes,
    totalScans,
    totalSessions,
    activeSessions,
    totalOrders,
    totalRevenue,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
    conversionRate: totalScans > 0 ? (totalOrders / totalScans) * 100 : 0
  };
};

// Helper functions
const calculateAverageSessionDuration = (sessions) => {
  if (sessions.length === 0) return 0;

  const completedSessions = sessions.filter(s => s.completedAt);
  if (completedSessions.length === 0) return 0;

  const totalDuration = completedSessions.reduce((sum, s) => {
    const duration = new Date(s.completedAt) - new Date(s.startedAt);
    return sum + duration;
  }, 0);

  return totalDuration / completedSessions.length / 1000 / 60; // in minutes
};

const calculateConversionRate = (sessions) => {
  if (sessions.length === 0) return 0;
  const sessionsWithOrders = sessions.filter(s => s.orderIds.length > 0).length;
  return (sessionsWithOrders / sessions.length) * 100;
};

// ============================================================================
// MOCK DATA INITIALIZATION
// ============================================================================

/**
 * Initialize with mock data for development
 */
export const initializeMockData = async () => {
  // This can be called to populate some initial QR codes for testing
  qrCodes = [];
  sessions = [];
  serverRequests = [];
};

// Export all functions
export default {
  // QR Code generation
  generateQRCodeImage,
  downloadQRCode,
  printQRCode,

  // QR Code CRUD
  createTableQRCodeService,
  getQRCodes,
  getQRCodeById,
  getQRCodeByCode,
  updateQRCode,
  regenerateQRCode,
  deleteQRCode,
  activateQRCode,
  deactivateQRCode,
  revokeQRCode,

  // Session management
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
  expireSession,

  // Server requests
  createServerRequestService,
  getServerRequests,
  acknowledgeServerRequest,
  completeServerRequest,

  // Analytics
  getQRCodeAnalytics,
  getOverallAnalytics,

  // Utilities
  initializeMockData
};
