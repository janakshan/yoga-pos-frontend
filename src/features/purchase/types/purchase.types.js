/**
 * @typedef {Object} PurchaseOrderItem
 * @property {string} id - Unique line item identifier
 * @property {string} productId - Product ID
 * @property {string} productName - Product name
 * @property {string} sku - Product SKU
 * @property {number} quantity - Ordered quantity
 * @property {number} receivedQuantity - Quantity received
 * @property {number} unitCost - Cost per unit
 * @property {number} discount - Discount percentage
 * @property {number} tax - Tax percentage
 * @property {number} totalCost - Total line cost (calculated)
 * @property {string} [notes] - Line item notes
 * @property {string} [expiryDate] - Expiry date for perishables (ISO string)
 * @property {string} [batchNumber] - Batch/lot number
 */

/**
 * @typedef {Object} PurchaseOrderPayment
 * @property {string} id - Payment record ID
 * @property {number} amount - Payment amount
 * @property {string} method - Payment method
 * @property {string} date - Payment date (ISO string)
 * @property {string} [reference] - Payment reference number
 * @property {string} [notes] - Payment notes
 */

/**
 * @typedef {Object} PurchaseReturn
 * @property {string} id - Return ID
 * @property {string} purchaseOrderId - Related PO ID
 * @property {string} returnNumber - Return number
 * @property {PurchaseReturnItem[]} items - Returned items
 * @property {string} reason - Return reason
 * @property {'pending'|'approved'|'completed'|'rejected'} status - Return status
 * @property {number} totalAmount - Total return amount
 * @property {string} createdAt - Creation date (ISO string)
 * @property {string} [approvedBy] - User who approved
 * @property {string} [notes] - Additional notes
 */

/**
 * @typedef {Object} PurchaseReturnItem
 * @property {string} purchaseItemId - Original purchase item ID
 * @property {string} productId - Product ID
 * @property {string} productName - Product name
 * @property {number} quantity - Return quantity
 * @property {number} unitCost - Unit cost
 * @property {number} totalCost - Total return cost
 * @property {string} reason - Item return reason
 * @property {string} [condition] - Item condition
 */

/**
 * @typedef {Object} GoodsReceipt
 * @property {string} id - Receipt ID
 * @property {string} purchaseOrderId - Related PO ID
 * @property {string} receiptNumber - Receipt number
 * @property {string} receivedDate - Date received (ISO string)
 * @property {string} receivedBy - User who received
 * @property {GoodsReceiptItem[]} items - Received items
 * @property {'partial'|'complete'} status - Receipt status
 * @property {string} [notes] - Receipt notes
 * @property {string} [inspectionNotes] - Quality inspection notes
 * @property {boolean} qualityApproved - Quality check passed
 */

/**
 * @typedef {Object} GoodsReceiptItem
 * @property {string} purchaseItemId - Original purchase item ID
 * @property {string} productId - Product ID
 * @property {number} quantityOrdered - Originally ordered
 * @property {number} quantityReceived - Actually received
 * @property {number} quantityAccepted - Accepted quantity
 * @property {number} quantityRejected - Rejected quantity
 * @property {string} [rejectionReason] - Reason for rejection
 * @property {string} [batchNumber] - Batch number
 * @property {string} [expiryDate] - Expiry date (ISO string)
 */

/**
 * @typedef {Object} PurchaseOrder
 * @property {string} id - Unique purchase order identifier
 * @property {string} orderNumber - PO number (e.g., PO-2024-001)
 * @property {string} supplierId - Supplier ID
 * @property {string} supplierName - Supplier name
 * @property {string} orderDate - Order date (ISO string)
 * @property {string} [expectedDeliveryDate] - Expected delivery date (ISO string)
 * @property {string} [actualDeliveryDate] - Actual delivery date (ISO string)
 * @property {'draft'|'pending'|'approved'|'ordered'|'partial'|'received'|'cancelled'} status - Order status
 * @property {PurchaseOrderItem[]} items - Order line items
 * @property {number} subtotal - Subtotal amount (before tax)
 * @property {number} taxAmount - Total tax amount
 * @property {number} discountAmount - Total discount amount
 * @property {number} shippingCost - Shipping cost
 * @property {number} totalAmount - Grand total
 * @property {number} paidAmount - Amount paid
 * @property {number} balanceAmount - Balance due
 * @property {'unpaid'|'partial'|'paid'} paymentStatus - Payment status
 * @property {PurchaseOrderPayment[]} payments - Payment records
 * @property {string} paymentTerms - Payment terms description
 * @property {string} [shippingAddress] - Delivery address
 * @property {string} [notes] - Order notes
 * @property {string} [internalNotes] - Internal notes (not visible to supplier)
 * @property {GoodsReceipt[]} receipts - Goods receipt records
 * @property {PurchaseReturn[]} returns - Return records
 * @property {string} createdBy - User who created the order
 * @property {string} [approvedBy] - User who approved the order
 * @property {string} createdAt - Creation date (ISO string)
 * @property {string} updatedAt - Last update date (ISO string)
 * @property {boolean} inventoryUpdated - Whether inventory has been updated
 */

/**
 * Purchase order status options
 */
export const PURCHASE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  ORDERED: 'ordered',
  PARTIAL: 'partial',
  RECEIVED: 'received',
  CANCELLED: 'cancelled'
};

/**
 * Purchase order status labels
 */
export const PURCHASE_STATUS_LABELS = {
  draft: 'Draft',
  pending: 'Pending Approval',
  approved: 'Approved',
  ordered: 'Ordered',
  partial: 'Partially Received',
  received: 'Received',
  cancelled: 'Cancelled'
};

/**
 * Purchase order status colors for UI
 */
export const PURCHASE_STATUS_COLORS = {
  draft: 'gray',
  pending: 'yellow',
  approved: 'blue',
  ordered: 'indigo',
  partial: 'orange',
  received: 'green',
  cancelled: 'red'
};

/**
 * Payment status options
 */
export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid'
};

/**
 * Payment status labels
 */
export const PAYMENT_STATUS_LABELS = {
  unpaid: 'Unpaid',
  partial: 'Partially Paid',
  paid: 'Paid'
};

/**
 * Return status options
 */
export const RETURN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
};

/**
 * Return status labels
 */
export const RETURN_STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  completed: 'Completed',
  rejected: 'Rejected'
};

/**
 * Return reason options
 */
export const RETURN_REASONS = [
  'Defective Product',
  'Wrong Item',
  'Damaged in Transit',
  'Quality Issues',
  'Expired Product',
  'Incomplete Order',
  'Not as Described',
  'Other'
];

/**
 * Receipt status options
 */
export const RECEIPT_STATUS = {
  PARTIAL: 'partial',
  COMPLETE: 'complete'
};

/**
 * Default purchase order object
 */
export const DEFAULT_PURCHASE_ORDER = {
  orderNumber: '',
  supplierId: '',
  supplierName: '',
  orderDate: new Date().toISOString(),
  expectedDeliveryDate: '',
  actualDeliveryDate: '',
  status: 'draft',
  items: [],
  subtotal: 0,
  taxAmount: 0,
  discountAmount: 0,
  shippingCost: 0,
  totalAmount: 0,
  paidAmount: 0,
  balanceAmount: 0,
  paymentStatus: 'unpaid',
  payments: [],
  paymentTerms: '',
  shippingAddress: '',
  notes: '',
  internalNotes: '',
  receipts: [],
  returns: [],
  inventoryUpdated: false
};

/**
 * Default purchase order item
 */
export const DEFAULT_PURCHASE_ITEM = {
  productId: '',
  productName: '',
  sku: '',
  quantity: 1,
  receivedQuantity: 0,
  unitCost: 0,
  discount: 0,
  tax: 0,
  totalCost: 0,
  notes: '',
  expiryDate: '',
  batchNumber: ''
};
