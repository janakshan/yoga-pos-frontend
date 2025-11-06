/**
 * Pricing Types
 * JSDoc type definitions for location-specific pricing and promotions
 */

/**
 * @typedef {'percentage'|'fixed_amount'|'buy_x_get_y'|'bundle'} PromotionType
 * Type of promotion/discount
 */

/**
 * @typedef {'active'|'scheduled'|'expired'|'disabled'} PromotionStatus
 * Promotion status
 */

/**
 * @typedef {Object} BranchPrice
 * @property {string} id - Unique price ID
 * @property {string} productId - Product ID
 * @property {string} branchId - Branch ID
 * @property {number} price - Branch-specific price
 * @property {number} cost - Branch-specific cost (optional)
 * @property {boolean} isActive - Whether this price override is active
 * @property {Date|string} effectiveFrom - When this price becomes effective
 * @property {Date|string} effectiveUntil - When this price expires (optional)
 * @property {string} notes - Notes about this pricing
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 * @property {string} createdBy - User who created this price
 */

/**
 * @typedef {Object} Promotion
 * @property {string} id - Unique promotion identifier
 * @property {string} name - Promotion name
 * @property {string} description - Detailed description
 * @property {PromotionType} type - Type of promotion
 * @property {PromotionStatus} status - Current status
 * @property {string[]} branchIds - Branches where promotion is valid (empty = all branches)
 * @property {string[]} productIds - Products included in promotion (empty = all products)
 * @property {string[]} categoryIds - Product categories included (optional)
 * @property {number} discountValue - Discount amount (percentage or fixed)
 * @property {number} [minPurchaseAmount] - Minimum purchase required
 * @property {number} [maxDiscountAmount] - Maximum discount cap
 * @property {Object} [buyXGetY] - Buy X Get Y configuration
 * @property {number} [buyXGetY.buyQuantity] - Quantity to buy
 * @property {number} [buyXGetY.getQuantity] - Quantity to get free
 * @property {string} [buyXGetY.getProductId] - Product to get (if different)
 * @property {Date|string} startDate - Promotion start date
 * @property {Date|string} endDate - Promotion end date
 * @property {number} priority - Priority when multiple promotions apply (higher = more priority)
 * @property {boolean} isStackable - Can be combined with other promotions
 * @property {number} usageLimit - Maximum number of times promotion can be used (optional)
 * @property {number} usageCount - Current usage count
 * @property {string} code - Promotion code for manual application (optional)
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 * @property {string} createdBy - User who created the promotion
 */

/**
 * @typedef {Object} CreateBranchPriceInput
 * @property {string} productId - Product ID
 * @property {string} branchId - Branch ID
 * @property {number} price - Branch-specific price
 * @property {number} [cost] - Branch-specific cost
 * @property {Date|string} [effectiveFrom] - Effective start date
 * @property {Date|string} [effectiveUntil] - Effective end date
 * @property {string} [notes] - Notes about this pricing
 */

/**
 * @typedef {Object} CreatePromotionInput
 * @property {string} name - Promotion name
 * @property {string} description - Description
 * @property {PromotionType} type - Promotion type
 * @property {string[]} [branchIds] - Applicable branches
 * @property {string[]} [productIds] - Applicable products
 * @property {string[]} [categoryIds] - Applicable categories
 * @property {number} discountValue - Discount value
 * @property {number} [minPurchaseAmount] - Minimum purchase
 * @property {number} [maxDiscountAmount] - Maximum discount
 * @property {Object} [buyXGetY] - Buy X Get Y config
 * @property {Date|string} startDate - Start date
 * @property {Date|string} endDate - End date
 * @property {number} [priority] - Priority level
 * @property {boolean} [isStackable] - Stackable flag
 * @property {number} [usageLimit] - Usage limit
 * @property {string} [code] - Promotion code
 */

/**
 * @typedef {Object} PriceCalculation
 * @property {number} basePrice - Original product price
 * @property {number} branchPrice - Branch-specific price (if applicable)
 * @property {number} finalPrice - Price after promotions
 * @property {number} totalDiscount - Total discount amount
 * @property {Promotion[]} appliedPromotions - Promotions that were applied
 * @property {number} taxAmount - Tax amount
 * @property {number} totalPrice - Final price including tax
 */

export const PROMOTION_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED_AMOUNT: 'fixed_amount',
  BUY_X_GET_Y: 'buy_x_get_y',
  BUNDLE: 'bundle',
};

export const PROMOTION_STATUSES = {
  ACTIVE: 'active',
  SCHEDULED: 'scheduled',
  EXPIRED: 'expired',
  DISABLED: 'disabled',
};

export const PROMOTION_TYPE_LABELS = {
  percentage: 'Percentage Discount',
  fixed_amount: 'Fixed Amount Off',
  buy_x_get_y: 'Buy X Get Y',
  bundle: 'Bundle Deal',
};

export const PROMOTION_STATUS_LABELS = {
  active: 'Active',
  scheduled: 'Scheduled',
  expired: 'Expired',
  disabled: 'Disabled',
};
