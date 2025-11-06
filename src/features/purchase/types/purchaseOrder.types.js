/**
 * @typedef {Object} PurchaseOrderItem
 * @property {string} id - Unique identifier
 * @property {string} productId - Product ID
 * @property {string} productName - Product name
 * @property {string} sku - Product SKU
 * @property {string} unit - Unit of measurement
 * @property {number} orderedQuantity - Quantity ordered
 * @property {number} receivedQuantity - Quantity received
 * @property {number} pendingQuantity - Quantity pending
 * @property {number} unitPrice - Unit price
 * @property {number} discount - Discount amount/percentage
 * @property {string} discountType - Discount type ('percentage' | 'fixed')
 * @property {number} tax - Tax amount
 * @property {number} taxRate - Tax rate percentage
 * @property {number} totalAmount - Total amount for this item
 * @property {string} notes - Item-specific notes
 */

/**
 * @typedef {Object} GoodsReceiving
 * @property {string} id - Unique identifier
 * @property {string} receivingNumber - Goods receiving note number
 * @property {Date} receivedDate - Date of receipt
 * @property {string} receivedBy - User who received the goods
 * @property {PurchaseOrderItem[]} items - Items received
 * @property {string} notes - Receiving notes
 * @property {string} status - Status ('complete' | 'partial' | 'quality_issue')
 * @property {string[]} attachments - Attachment URLs
 */

/**
 * @typedef {Object} PurchaseReturn
 * @property {string} id - Unique identifier
 * @property {string} returnNumber - Return note number
 * @property {Date} returnDate - Date of return
 * @property {string} reason - Reason for return
 * @property {PurchaseOrderItem[]} items - Items being returned
 * @property {number} returnAmount - Total return amount
 * @property {string} status - Return status ('pending' | 'approved' | 'completed' | 'rejected')
 * @property {string} notes - Return notes
 * @property {string} processedBy - User who processed the return
 */

/**
 * @typedef {Object} PurchaseOrder
 * @property {string} id - Unique identifier
 * @property {string} orderNumber - Purchase order number
 * @property {string} supplierId - Supplier ID
 * @property {string} supplierName - Supplier name
 * @property {Date} orderDate - Date of order
 * @property {Date} expectedDeliveryDate - Expected delivery date
 * @property {Date} actualDeliveryDate - Actual delivery date
 * @property {string} status - Order status ('draft' | 'pending' | 'approved' | 'ordered' | 'partial' | 'received' | 'completed' | 'cancelled')
 * @property {string} branchId - Branch ID
 * @property {string} branchName - Branch name
 * @property {PurchaseOrderItem[]} items - Order items
 * @property {number} subtotal - Subtotal amount
 * @property {number} totalDiscount - Total discount amount
 * @property {number} totalTax - Total tax amount
 * @property {number} shippingCost - Shipping cost
 * @property {number} otherCharges - Other charges
 * @property {number} totalAmount - Total order amount
 * @property {string} paymentTerms - Payment terms
 * @property {string} paymentStatus - Payment status ('unpaid' | 'partial' | 'paid')
 * @property {number} paidAmount - Amount paid
 * @property {string} notes - Order notes
 * @property {string} internalNotes - Internal notes (not visible to supplier)
 * @property {GoodsReceiving[]} receivings - Goods receiving records
 * @property {PurchaseReturn[]} returns - Purchase return records
 * @property {string[]} attachments - Attachment URLs
 * @property {string} createdBy - User who created the order
 * @property {string} approvedBy - User who approved the order
 * @property {Date} createdAt - Created timestamp
 * @property {Date} updatedAt - Updated timestamp
 */

// Status constants
export const PO_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  ORDERED: 'ordered',
  PARTIAL: 'partial',
  RECEIVED: 'received',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PO_STATUS_LABELS = {
  [PO_STATUS.DRAFT]: 'Draft',
  [PO_STATUS.PENDING]: 'Pending Approval',
  [PO_STATUS.APPROVED]: 'Approved',
  [PO_STATUS.ORDERED]: 'Ordered',
  [PO_STATUS.PARTIAL]: 'Partially Received',
  [PO_STATUS.RECEIVED]: 'Received',
  [PO_STATUS.COMPLETED]: 'Completed',
  [PO_STATUS.CANCELLED]: 'Cancelled',
};

// Payment status constants
export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid',
};

// Return status constants
export const RETURN_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
};

// Receiving status constants
export const RECEIVING_STATUS = {
  COMPLETE: 'complete',
  PARTIAL: 'partial',
  QUALITY_ISSUE: 'quality_issue',
};

// Discount type constants
export const DISCOUNT_TYPE = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
};
