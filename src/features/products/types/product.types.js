/**
 * Product Types
 * JSDoc type definitions for product-related data structures
 */

/**
 * @typedef {'active'|'inactive'|'discontinued'} ProductStatus
 * Product availability status
 */

/**
 * @typedef {'yoga_mat'|'yoga_block'|'yoga_strap'|'yoga_wheel'|'yoga_bolster'|'yoga_blanket'|'clothing'|'accessories'|'equipment'|'supplements'|'books'|'gift_cards'|'memberships'|'classes'|'workshops'|'other'} ProductCategory
 * Product category types
 */

/**
 * @typedef {'piece'|'set'|'pack'|'kg'|'g'|'ml'|'l'|'service'|'session'} UnitType
 * Unit of measurement for products
 */

/**
 * @typedef {Object} Product
 * @property {string} id - Unique product identifier
 * @property {string} sku - Stock Keeping Unit (unique product code)
 * @property {string} name - Product name
 * @property {string} description - Detailed product description
 * @property {ProductCategory} category - Product category
 * @property {number} price - Base selling price
 * @property {number} cost - Cost price (for profit calculations)
 * @property {number} stockQuantity - Available stock quantity
 * @property {number} lowStockThreshold - Alert threshold for low stock
 * @property {UnitType} unit - Unit of measurement
 * @property {string} barcode - Barcode for scanning (optional)
 * @property {string} imageUrl - Product image URL (optional)
 * @property {ProductStatus} status - Product status
 * @property {string[]} tags - Search and categorization tags
 * @property {boolean} trackInventory - Whether to track inventory for this product
 * @property {boolean} allowBackorder - Allow selling when out of stock
 * @property {number} taxRate - Tax rate percentage (e.g., 10 for 10%)
 * @property {string} supplier - Supplier name (optional)
 * @property {ProductVariant[]} variants - Product variants (size, color, etc.)
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 * @property {string} createdBy - User ID who created the product
 * @property {string} updatedBy - User ID who last updated the product
 */

/**
 * @typedef {Object} ProductVariant
 * @property {string} id - Variant identifier
 * @property {string} name - Variant name (e.g., "Small - Blue")
 * @property {string} sku - Variant-specific SKU
 * @property {number} price - Variant price (if different from base)
 * @property {number} stockQuantity - Variant stock quantity
 * @property {Object} attributes - Variant attributes (e.g., {size: 'S', color: 'blue'})
 */

/**
 * @typedef {Object} CreateProductInput
 * @property {string} sku - Stock Keeping Unit
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {ProductCategory} category - Product category
 * @property {number} price - Selling price
 * @property {number} cost - Cost price
 * @property {number} stockQuantity - Initial stock quantity
 * @property {number} lowStockThreshold - Low stock alert threshold
 * @property {UnitType} unit - Unit of measurement
 * @property {string} [barcode] - Barcode (optional)
 * @property {string} [imageUrl] - Image URL (optional)
 * @property {ProductStatus} status - Product status
 * @property {string[]} [tags] - Tags (optional)
 * @property {boolean} trackInventory - Track inventory flag
 * @property {boolean} allowBackorder - Allow backorder flag
 * @property {number} taxRate - Tax rate percentage
 * @property {string} [supplier] - Supplier name (optional)
 * @property {ProductVariant[]} [variants] - Product variants (optional)
 */

/**
 * @typedef {Object} UpdateProductInput
 * @property {string} [sku] - Stock Keeping Unit
 * @property {string} [name] - Product name
 * @property {string} [description] - Product description
 * @property {ProductCategory} [category] - Product category
 * @property {number} [price] - Selling price
 * @property {number} [cost] - Cost price
 * @property {number} [stockQuantity] - Stock quantity
 * @property {number} [lowStockThreshold] - Low stock threshold
 * @property {UnitType} [unit] - Unit of measurement
 * @property {string} [barcode] - Barcode
 * @property {string} [imageUrl] - Image URL
 * @property {ProductStatus} [status] - Product status
 * @property {string[]} [tags] - Tags
 * @property {boolean} [trackInventory] - Track inventory flag
 * @property {boolean} [allowBackorder] - Allow backorder flag
 * @property {number} [taxRate] - Tax rate percentage
 * @property {string} [supplier] - Supplier name
 * @property {ProductVariant[]} [variants] - Product variants
 */

/**
 * @typedef {Object} ProductFilters
 * @property {string} [search] - Search term for name, SKU, or description
 * @property {ProductCategory} [category] - Filter by category
 * @property {ProductStatus} [status] - Filter by status
 * @property {boolean} [lowStock] - Filter products with low stock
 * @property {number} [minPrice] - Minimum price filter
 * @property {number} [maxPrice] - Maximum price filter
 * @property {string[]} [tags] - Filter by tags
 * @property {string} [sortBy] - Sort field (name, price, stockQuantity, createdAt)
 * @property {'asc'|'desc'} [sortOrder] - Sort order
 */

/**
 * @typedef {Object} ProductStats
 * @property {number} totalProducts - Total number of products
 * @property {number} activeProducts - Number of active products
 * @property {number} inactiveProducts - Number of inactive products
 * @property {number} discontinuedProducts - Number of discontinued products
 * @property {number} lowStockProducts - Number of products with low stock
 * @property {number} outOfStockProducts - Number of out-of-stock products
 * @property {number} totalInventoryValue - Total value of inventory (cost * quantity)
 * @property {number} totalRetailValue - Total retail value (price * quantity)
 * @property {Object.<ProductCategory, number>} productsByCategory - Count by category
 */

/**
 * @typedef {Object} InventoryAdjustment
 * @property {string} productId - Product ID
 * @property {number} quantity - Quantity to add (positive) or remove (negative)
 * @property {'sale'|'purchase'|'adjustment'|'return'|'damage'|'transfer'} reason - Adjustment reason
 * @property {string} notes - Additional notes
 * @property {Date|string} timestamp - Adjustment timestamp
 * @property {string} userId - User who made the adjustment
 */

export const PRODUCT_CATEGORIES = {
  YOGA_MAT: 'yoga_mat',
  YOGA_BLOCK: 'yoga_block',
  YOGA_STRAP: 'yoga_strap',
  YOGA_WHEEL: 'yoga_wheel',
  YOGA_BOLSTER: 'yoga_bolster',
  YOGA_BLANKET: 'yoga_blanket',
  CLOTHING: 'clothing',
  ACCESSORIES: 'accessories',
  EQUIPMENT: 'equipment',
  SUPPLEMENTS: 'supplements',
  BOOKS: 'books',
  GIFT_CARDS: 'gift_cards',
  MEMBERSHIPS: 'memberships',
  CLASSES: 'classes',
  WORKSHOPS: 'workshops',
  OTHER: 'other'
};

export const PRODUCT_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DISCONTINUED: 'discontinued'
};

export const UNIT_TYPES = {
  PIECE: 'piece',
  SET: 'set',
  PACK: 'pack',
  KG: 'kg',
  G: 'g',
  ML: 'ml',
  L: 'l',
  SERVICE: 'service',
  SESSION: 'session'
};

export const CATEGORY_LABELS = {
  yoga_mat: 'Yoga Mat',
  yoga_block: 'Yoga Block',
  yoga_strap: 'Yoga Strap',
  yoga_wheel: 'Yoga Wheel',
  yoga_bolster: 'Yoga Bolster',
  yoga_blanket: 'Yoga Blanket',
  clothing: 'Clothing',
  accessories: 'Accessories',
  equipment: 'Equipment',
  supplements: 'Supplements',
  books: 'Books',
  gift_cards: 'Gift Cards',
  memberships: 'Memberships',
  classes: 'Classes',
  workshops: 'Workshops',
  other: 'Other'
};

export const STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  discontinued: 'Discontinued'
};

export const UNIT_LABELS = {
  piece: 'Piece',
  set: 'Set',
  pack: 'Pack',
  kg: 'Kilogram',
  g: 'Gram',
  ml: 'Milliliter',
  l: 'Liter',
  service: 'Service',
  session: 'Session'
};
