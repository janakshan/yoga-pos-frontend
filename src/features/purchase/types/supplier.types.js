/**
 * @typedef {Object} SupplierContact
 * @property {string} name - Contact person name
 * @property {string} [phone] - Contact phone number
 * @property {string} [email] - Contact email address
 * @property {string} [position] - Position/role in company
 */

/**
 * @typedef {Object} SupplierAddress
 * @property {string} street - Street address
 * @property {string} [line2] - Additional address line
 * @property {string} city - City
 * @property {string} state - State/Province
 * @property {string} postalCode - Postal/ZIP code
 * @property {string} country - Country
 */

/**
 * @typedef {Object} SupplierPaymentTerms
 * @property {number} creditDays - Number of days for payment
 * @property {string} method - Payment method (e.g., 'bank_transfer', 'cash', 'check')
 * @property {number} [creditLimit] - Maximum credit limit
 * @property {number} [discount] - Early payment discount percentage
 */

/**
 * @typedef {Object} SupplierPerformance
 * @property {number} totalOrders - Total number of purchase orders
 * @property {number} onTimeDeliveries - Number of on-time deliveries
 * @property {number} qualityScore - Quality rating (0-100)
 * @property {number} responseTime - Average response time in hours
 * @property {string} lastOrderDate - Last order date (ISO string)
 * @property {number} totalPurchaseValue - Total value of all purchases
 * @property {number} returnRate - Percentage of returned items
 */

/**
 * @typedef {Object} Supplier
 * @property {string} id - Unique supplier identifier
 * @property {string} code - Supplier code (unique)
 * @property {string} name - Supplier name
 * @property {string} [taxId] - Tax identification number
 * @property {string} [registrationNumber] - Business registration number
 * @property {SupplierContact} contact - Primary contact information
 * @property {SupplierContact[]} [additionalContacts] - Additional contacts
 * @property {SupplierAddress} address - Supplier address
 * @property {string} phone - Company phone number
 * @property {string} [email] - Company email address
 * @property {string} [website] - Company website
 * @property {SupplierPaymentTerms} paymentTerms - Payment terms
 * @property {string[]} productCategories - Categories of products supplied
 * @property {string} currency - Currency code (e.g., 'USD', 'EUR')
 * @property {string} [bankName] - Bank name
 * @property {string} [bankAccount] - Bank account number
 * @property {string} [notes] - Additional notes
 * @property {'active'|'inactive'|'blocked'} status - Supplier status
 * @property {SupplierPerformance} performance - Performance metrics
 * @property {string} createdAt - Creation date (ISO string)
 * @property {string} updatedAt - Last update date (ISO string)
 * @property {string} [createdBy] - User who created the record
 */

/**
 * Supplier status options
 */
export const SUPPLIER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked'
};

/**
 * Supplier status labels
 */
export const SUPPLIER_STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  blocked: 'Blocked'
};

/**
 * Payment method options
 */
export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  CHECK: 'check',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card'
};

/**
 * Payment method labels
 */
export const PAYMENT_METHOD_LABELS = {
  bank_transfer: 'Bank Transfer',
  cash: 'Cash',
  check: 'Check',
  credit_card: 'Credit Card',
  debit_card: 'Debit Card'
};

/**
 * Product categories that suppliers can provide
 */
export const SUPPLIER_PRODUCT_CATEGORIES = [
  'Yoga Mats',
  'Yoga Blocks',
  'Yoga Straps',
  'Yoga Wheels',
  'Clothing',
  'Accessories',
  'Props',
  'Equipment',
  'Retail Products',
  'Other'
];

/**
 * Default supplier object
 */
export const DEFAULT_SUPPLIER = {
  code: '',
  name: '',
  taxId: '',
  registrationNumber: '',
  contact: {
    name: '',
    phone: '',
    email: '',
    position: ''
  },
  additionalContacts: [],
  address: {
    street: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Sri Lanka'
  },
  phone: '',
  email: '',
  website: '',
  paymentTerms: {
    creditDays: 30,
    method: 'bank_transfer',
    creditLimit: 0,
    discount: 0
  },
  productCategories: [],
  currency: 'LKR',
  bankName: '',
  bankAccount: '',
  notes: '',
  status: 'active',
  performance: {
    totalOrders: 0,
    onTimeDeliveries: 0,
    qualityScore: 100,
    responseTime: 0,
    lastOrderDate: null,
    totalPurchaseValue: 0,
    returnRate: 0
  }
};
