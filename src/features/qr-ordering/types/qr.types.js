/**
 * QR Code Ordering System - Type Definitions
 *
 * This file contains all type definitions and constants for the QR ordering system
 */

// ============================================================================
// QR ORDER SESSION
// ============================================================================

/**
 * Session Status Types
 */
export const SESSION_STATUS = {
  ACTIVE: 'active',         // Customer is browsing/ordering
  ORDERING: 'ordering',     // Customer has items in cart
  SUBMITTED: 'submitted',   // Order has been submitted
  COMPLETED: 'completed',   // Session finished (paid/left)
  EXPIRED: 'expired',       // Session timed out
  CANCELLED: 'cancelled'    // Session was cancelled
};

/**
 * Session Action Types
 */
export const SESSION_ACTION = {
  VIEW_MENU: 'view_menu',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  SUBMIT_ORDER: 'submit_order',
  CALL_SERVER: 'call_server',
  REQUEST_BILL: 'request_bill',
  PAYMENT_INITIATED: 'payment_initiated',
  PAYMENT_COMPLETED: 'payment_completed'
};

/**
 * QR Order Session Model
 * Represents a customer's ordering session via QR code
 *
 * @typedef {Object} QROrderSession
 * @property {string} id - Unique session identifier
 * @property {string} sessionToken - Secure token for session validation
 * @property {string} tableId - Reference to table
 * @property {string} qrCodeId - Reference to QR code used
 * @property {string} status - Session status (SESSION_STATUS)
 * @property {number} customerCount - Number of customers at table
 * @property {string|null} customerName - Optional customer name
 * @property {string|null} customerPhone - Optional customer phone
 * @property {string|null} customerEmail - Optional customer email
 * @property {Array<string>} orderIds - Array of order IDs from this session
 * @property {Object} cart - Current cart items
 * @property {Array<Object>} cart.items - Cart items with modifiers
 * @property {number} cart.totalItems - Total number of items
 * @property {number} cart.subtotal - Subtotal amount
 * @property {number} cart.tax - Tax amount
 * @property {number} cart.total - Total amount
 * @property {Object} actions - Session activity log
 * @property {Array<Object>} actions.history - Action history
 * @property {number} actions.callServerCount - Number of times server was called
 * @property {boolean} actions.billRequested - Whether bill was requested
 * @property {Date} actions.lastCallServerAt - Last time server was called
 * @property {Date} actions.billRequestedAt - When bill was requested
 * @property {Object} preferences - Customer preferences
 * @property {string} preferences.language - Preferred language
 * @property {boolean} preferences.allergyWarnings - Show allergy warnings
 * @property {Array<string>} preferences.dietaryRestrictions - Dietary restrictions
 * @property {Object} metadata - Additional session data
 * @property {string} metadata.userAgent - Browser user agent
 * @property {string} metadata.ipAddress - Customer IP address
 * @property {Object} metadata.location - Geolocation if available
 * @property {Date} startedAt - Session start timestamp
 * @property {Date} lastActivityAt - Last activity timestamp
 * @property {Date|null} expiresAt - Session expiration timestamp
 * @property {Date|null} completedAt - Session completion timestamp
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record update timestamp
 */

/**
 * Creates a new QR Order Session
 * @param {Object} data - Session initialization data
 * @returns {QROrderSession}
 */
export const createQROrderSession = (data = {}) => ({
  id: data.id || null,
  sessionToken: data.sessionToken || null,
  tableId: data.tableId || null,
  qrCodeId: data.qrCodeId || null,
  status: data.status || SESSION_STATUS.ACTIVE,
  customerCount: data.customerCount || 1,
  customerName: data.customerName || null,
  customerPhone: data.customerPhone || null,
  customerEmail: data.customerEmail || null,
  orderIds: data.orderIds || [],
  cart: {
    items: [],
    totalItems: 0,
    subtotal: 0,
    tax: 0,
    total: 0,
    ...data.cart
  },
  actions: {
    history: [],
    callServerCount: 0,
    billRequested: false,
    lastCallServerAt: null,
    billRequestedAt: null,
    ...data.actions
  },
  preferences: {
    language: 'en',
    allergyWarnings: true,
    dietaryRestrictions: [],
    ...data.preferences
  },
  metadata: {
    userAgent: navigator?.userAgent || null,
    ipAddress: null,
    location: null,
    ...data.metadata
  },
  startedAt: data.startedAt || new Date(),
  lastActivityAt: data.lastActivityAt || new Date(),
  expiresAt: data.expiresAt || null,
  completedAt: data.completedAt || null,
  createdAt: data.createdAt || new Date(),
  updatedAt: data.updatedAt || new Date()
});

// ============================================================================
// TABLE QR CODE
// ============================================================================

/**
 * QR Code Status Types
 */
export const QR_CODE_STATUS = {
  ACTIVE: 'active',         // QR code is active and scannable
  INACTIVE: 'inactive',     // QR code is disabled
  EXPIRED: 'expired',       // QR code has expired
  REVOKED: 'revoked'        // QR code was revoked for security
};

/**
 * QR Code Type
 */
export const QR_CODE_TYPE = {
  TABLE: 'table',           // Standard table QR code
  TAKEAWAY: 'takeaway',     // Takeaway/pickup QR code
  EVENT: 'event',           // Special event QR code
  DELIVERY: 'delivery'      // Delivery QR code
};

/**
 * Table QR Code Model
 * Represents a generated QR code for table ordering
 *
 * @typedef {Object} TableQRCode
 * @property {string} id - Unique QR code identifier
 * @property {string} code - Unique code string (used in URL)
 * @property {string} tableId - Reference to table
 * @property {string} type - QR code type (QR_CODE_TYPE)
 * @property {string} status - QR code status (QR_CODE_STATUS)
 * @property {string} qrCodeDataUrl - Base64 data URL of QR code image
 * @property {string} url - Full URL for QR code
 * @property {Object} config - QR code configuration
 * @property {number} config.size - QR code size in pixels
 * @property {string} config.errorCorrectionLevel - Error correction level (L/M/Q/H)
 * @property {string} config.foregroundColor - Foreground color
 * @property {string} config.backgroundColor - Background color
 * @property {string|null} config.logoUrl - Logo URL for center of QR code
 * @property {Object} settings - Ordering settings
 * @property {boolean} settings.allowOrdering - Allow placing orders
 * @property {boolean} settings.showPrices - Show prices to customers
 * @property {boolean} settings.allowModifiers - Allow modifier selection
 * @property {boolean} settings.requireCustomerInfo - Require customer details
 * @property {number} settings.sessionTimeout - Session timeout in minutes
 * @property {number} settings.maxOrdersPerSession - Max orders per session
 * @property {Object} restrictions - Ordering restrictions
 * @property {Array<string>} restrictions.allowedCategories - Allowed category IDs
 * @property {Array<string>} restrictions.restrictedItems - Restricted product IDs
 * @property {Object} restrictions.timeRestrictions - Time-based restrictions
 * @property {string} restrictions.timeRestrictions.startTime - Start time (HH:mm)
 * @property {string} restrictions.timeRestrictions.endTime - End time (HH:mm)
 * @property {Array<number>} restrictions.timeRestrictions.allowedDays - Days of week (0-6)
 * @property {Object} analytics - Analytics data
 * @property {number} analytics.totalScans - Total scan count
 * @property {number} analytics.totalSessions - Total sessions created
 * @property {number} analytics.totalOrders - Total orders placed
 * @property {number} analytics.totalRevenue - Total revenue generated
 * @property {Date} analytics.lastScannedAt - Last scan timestamp
 * @property {Object} metadata - Additional metadata
 * @property {string} metadata.generatedBy - User who generated QR code
 * @property {string} metadata.notes - Admin notes
 * @property {Object} metadata.customFields - Custom fields
 * @property {Date|null} expiresAt - QR code expiration date
 * @property {Date|null} lastUsedAt - Last time QR was scanned
 * @property {Date} createdAt - Record creation timestamp
 * @property {Date} updatedAt - Record update timestamp
 */

/**
 * Creates a new Table QR Code
 * @param {Object} data - QR code initialization data
 * @returns {TableQRCode}
 */
export const createTableQRCode = (data = {}) => ({
  id: data.id || null,
  code: data.code || null,
  tableId: data.tableId || null,
  type: data.type || QR_CODE_TYPE.TABLE,
  status: data.status || QR_CODE_STATUS.ACTIVE,
  qrCodeDataUrl: data.qrCodeDataUrl || null,
  url: data.url || null,
  config: {
    size: 300,
    errorCorrectionLevel: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    logoUrl: null,
    ...data.config
  },
  settings: {
    allowOrdering: true,
    showPrices: true,
    allowModifiers: true,
    requireCustomerInfo: false,
    sessionTimeout: 120, // 2 hours
    maxOrdersPerSession: 10,
    ...data.settings
  },
  restrictions: {
    allowedCategories: [],
    restrictedItems: [],
    timeRestrictions: {
      startTime: null,
      endTime: null,
      allowedDays: [0, 1, 2, 3, 4, 5, 6]
    },
    ...data.restrictions
  },
  analytics: {
    totalScans: 0,
    totalSessions: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lastScannedAt: null,
    ...data.analytics
  },
  metadata: {
    generatedBy: null,
    notes: '',
    customFields: {},
    ...data.metadata
  },
  expiresAt: data.expiresAt || null,
  lastUsedAt: data.lastUsedAt || null,
  createdAt: data.createdAt || new Date(),
  updatedAt: data.updatedAt || new Date()
});

// ============================================================================
// CART ITEM
// ============================================================================

/**
 * Cart Item Model
 * Represents a product in customer's cart
 *
 * @typedef {Object} CartItem
 * @property {string} id - Cart item ID
 * @property {string} productId - Product reference
 * @property {string} name - Product name
 * @property {number} price - Item price
 * @property {number} quantity - Quantity
 * @property {Array<Object>} modifiers - Selected modifiers
 * @property {string} modifiers[].groupId - Modifier group ID
 * @property {string} modifiers[].groupName - Modifier group name
 * @property {Array<Object>} modifiers[].selections - Selected options
 * @property {string} specialInstructions - Special instructions
 * @property {number} subtotal - Item subtotal (price * quantity + modifiers)
 * @property {string|null} imageUrl - Product image URL
 */

/**
 * Creates a new Cart Item
 * @param {Object} data - Cart item data
 * @returns {CartItem}
 */
export const createCartItem = (data = {}) => ({
  id: data.id || `cart-item-${Date.now()}-${Math.random()}`,
  productId: data.productId || null,
  name: data.name || '',
  price: data.price || 0,
  quantity: data.quantity || 1,
  modifiers: data.modifiers || [],
  specialInstructions: data.specialInstructions || '',
  subtotal: data.subtotal || 0,
  imageUrl: data.imageUrl || null
});

// ============================================================================
// SERVER REQUEST
// ============================================================================

/**
 * Server Request Types
 */
export const SERVER_REQUEST_TYPE = {
  CALL_SERVER: 'call_server',
  REQUEST_BILL: 'request_bill',
  ASSISTANCE: 'assistance',
  REFILL: 'refill',
  COMPLAINT: 'complaint'
};

/**
 * Server Request Status
 */
export const SERVER_REQUEST_STATUS = {
  PENDING: 'pending',
  ACKNOWLEDGED: 'acknowledged',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

/**
 * Server Request Model
 * Represents a customer request for server assistance
 *
 * @typedef {Object} ServerRequest
 * @property {string} id - Request ID
 * @property {string} sessionId - QR session ID
 * @property {string} tableId - Table ID
 * @property {string} type - Request type
 * @property {string} status - Request status
 * @property {string} message - Optional message
 * @property {Date} requestedAt - Request timestamp
 * @property {Date|null} acknowledgedAt - Acknowledgment timestamp
 * @property {Date|null} completedAt - Completion timestamp
 * @property {string|null} assignedTo - Server assigned to request
 */

/**
 * Creates a new Server Request
 * @param {Object} data - Request data
 * @returns {ServerRequest}
 */
export const createServerRequest = (data = {}) => ({
  id: data.id || null,
  sessionId: data.sessionId || null,
  tableId: data.tableId || null,
  type: data.type || SERVER_REQUEST_TYPE.CALL_SERVER,
  status: data.status || SERVER_REQUEST_STATUS.PENDING,
  message: data.message || '',
  requestedAt: data.requestedAt || new Date(),
  acknowledgedAt: data.acknowledgedAt || null,
  completedAt: data.completedAt || null,
  assignedTo: data.assignedTo || null
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generates a unique session token
 * @returns {string}
 */
export const generateSessionToken = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${randomStr}`;
};

/**
 * Generates a unique QR code string
 * @param {string} tableNumber - Table number
 * @returns {string}
 */
export const generateQRCode = (tableNumber) => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `TBL${tableNumber}-${timestamp}-${randomStr}`;
};

/**
 * Validates if session is still active
 * @param {QROrderSession} session
 * @returns {boolean}
 */
export const isSessionActive = (session) => {
  if (!session) return false;
  if (session.status === SESSION_STATUS.EXPIRED ||
      session.status === SESSION_STATUS.COMPLETED ||
      session.status === SESSION_STATUS.CANCELLED) {
    return false;
  }
  if (session.expiresAt && new Date() > new Date(session.expiresAt)) {
    return false;
  }
  return true;
};

/**
 * Calculates cart totals
 * @param {Array<CartItem>} items - Cart items
 * @param {number} taxRate - Tax rate (e.g., 0.1 for 10%)
 * @returns {Object} Cart totals
 */
export const calculateCartTotals = (items, taxRate = 0.1) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return {
    totalItems,
    subtotal: Number(subtotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total: Number(total.toFixed(2))
  };
};

/**
 * Formats QR code URL
 * @param {string} baseUrl - Base URL
 * @param {string} code - QR code string
 * @returns {string}
 */
export const formatQRCodeUrl = (baseUrl, code) => {
  return `${baseUrl}/qr/${code}`;
};
