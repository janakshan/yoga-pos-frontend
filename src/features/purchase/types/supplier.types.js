/**
 * @typedef {Object} SupplierContact
 * @property {string} name - Contact person name
 * @property {string} phone - Contact phone number
 * @property {string} email - Contact email address
 * @property {string} designation - Contact person's designation
 */

/**
 * @typedef {Object} SupplierAddress
 * @property {string} street - Street address
 * @property {string} city - City
 * @property {string} state - State/Province
 * @property {string} postalCode - Postal/ZIP code
 * @property {string} country - Country
 */

/**
 * @typedef {Object} SupplierBankDetails
 * @property {string} bankName - Name of bank
 * @property {string} accountNumber - Bank account number
 * @property {string} accountName - Account holder name
 * @property {string} ifscCode - IFSC/SWIFT code
 * @property {string} branch - Bank branch
 */

/**
 * @typedef {Object} SupplierStats
 * @property {number} totalOrders - Total purchase orders placed
 * @property {number} totalAmount - Total purchase amount
 * @property {number} pendingOrders - Number of pending orders
 * @property {number} completedOrders - Number of completed orders
 * @property {number} returnedOrders - Number of returned orders
 * @property {number} averageDeliveryTime - Average delivery time in days
 * @property {number} onTimeDeliveryRate - Percentage of on-time deliveries
 * @property {number} qualityRating - Quality rating (0-5)
 */

/**
 * @typedef {Object} SupplierPaymentTerms
 * @property {string} terms - Payment terms (e.g., 'net30', 'net60', 'cod', 'advance')
 * @property {number} creditLimit - Credit limit amount
 * @property {number} creditDays - Number of credit days
 * @property {string} preferredPaymentMethod - Preferred payment method
 */

/**
 * @typedef {Object} Supplier
 * @property {string} id - Unique identifier
 * @property {string} code - Supplier code/number
 * @property {string} name - Supplier name
 * @property {string} displayName - Display name
 * @property {string} email - Supplier email
 * @property {string} phone - Primary phone number
 * @property {string} alternatePhone - Alternate phone number
 * @property {string} website - Website URL
 * @property {string} taxNumber - Tax ID/GST number
 * @property {string} status - Supplier status ('active' | 'inactive' | 'blocked')
 * @property {string} type - Supplier type ('manufacturer' | 'distributor' | 'wholesaler' | 'retailer' | 'other')
 * @property {SupplierAddress} address - Supplier address
 * @property {SupplierContact[]} contacts - List of contacts
 * @property {SupplierBankDetails} bankDetails - Bank account details
 * @property {SupplierPaymentTerms} paymentTerms - Payment terms
 * @property {string[]} categories - Product categories supplied
 * @property {string} notes - Additional notes
 * @property {SupplierStats} stats - Supplier statistics
 * @property {Date} createdAt - Created timestamp
 * @property {Date} updatedAt - Updated timestamp
 * @property {string} createdBy - User who created the supplier
 */

// Status constants
export const SUPPLIER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
};

// Type constants
export const SUPPLIER_TYPE = {
  MANUFACTURER: 'manufacturer',
  DISTRIBUTOR: 'distributor',
  WHOLESALER: 'wholesaler',
  RETAILER: 'retailer',
  OTHER: 'other',
};

// Payment terms constants
export const PAYMENT_TERMS = {
  COD: 'cod',
  NET_15: 'net15',
  NET_30: 'net30',
  NET_60: 'net60',
  NET_90: 'net90',
  ADVANCE: 'advance',
};

export const PAYMENT_TERMS_LABELS = {
  [PAYMENT_TERMS.COD]: 'Cash on Delivery',
  [PAYMENT_TERMS.NET_15]: 'Net 15 Days',
  [PAYMENT_TERMS.NET_30]: 'Net 30 Days',
  [PAYMENT_TERMS.NET_60]: 'Net 60 Days',
  [PAYMENT_TERMS.NET_90]: 'Net 90 Days',
  [PAYMENT_TERMS.ADVANCE]: 'Advance Payment',
};
