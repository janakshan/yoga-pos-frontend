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
 * @typedef {Object} ProductSubcategory
 * @property {string} id - Unique subcategory identifier
 * @property {string} name - Subcategory name
 * @property {string} [description] - Subcategory description
 * @property {ProductCategory} parentCategory - Parent category
 */

/**
 * @typedef {Object} PricingTier
 * @property {number} retail - Retail price (standard customer price)
 * @property {number} wholesale - Wholesale price (for bulk buyers)
 * @property {number} member - Member price (for registered members)
 * @property {number} [custom] - Optional custom pricing tier
 */

/**
 * @typedef {Object} ProductAttribute
 * @property {string} id - Attribute identifier
 * @property {string} name - Attribute name (e.g., "Color", "Size", "Material")
 * @property {string} value - Attribute value (e.g., "Blue", "Large", "Cotton")
 * @property {boolean} [isVariant] - Whether this attribute creates variants
 */

/**
 * @typedef {Object} BundleItem
 * @property {string} productId - ID of the bundled product
 * @property {number} quantity - Quantity of this product in the bundle
 * @property {number} [discount] - Optional discount percentage for this item in bundle
 */

/**
 * @typedef {Object} ProductBundle
 * @property {string} id - Bundle identifier
 * @property {string} name - Bundle name
 * @property {string} [description] - Bundle description
 * @property {BundleItem[]} items - Products included in bundle
 * @property {number} bundlePrice - Total bundle price
 * @property {number} savings - Amount saved compared to individual prices
 */

/**
 * @typedef {Object} UnitConversion
 * @property {UnitType} fromUnit - Source unit
 * @property {UnitType} toUnit - Target unit
 * @property {number} conversionFactor - Multiplication factor for conversion
 * @property {string} [formula] - Optional formula description
 */

/**
 * @typedef {Object} Product
 * @property {string} id - Unique product identifier
 * @property {string} sku - Stock Keeping Unit (unique product code)
 * @property {string} name - Product name
 * @property {string} description - Detailed product description
 * @property {ProductCategory} category - Product category
 * @property {string} [subcategory] - Product subcategory ID
 * @property {number} price - Base selling price (deprecated - use pricing instead)
 * @property {PricingTier} pricing - Multi-tier pricing structure
 * @property {number} cost - Cost price (for profit calculations)
 * @property {number} stockQuantity - Available stock quantity
 * @property {number} lowStockThreshold - Alert threshold for low stock
 * @property {UnitType} unit - Unit of measurement
 * @property {UnitConversion[]} [unitConversions] - Available unit conversions
 * @property {string} barcode - Barcode for scanning (optional)
 * @property {string[]} [imageUrls] - Multiple product image URLs
 * @property {string} imageUrl - Primary product image URL (optional, for backwards compatibility)
 * @property {ProductStatus} status - Product status
 * @property {string[]} tags - Search and categorization tags
 * @property {ProductAttribute[]} [attributes] - Product attributes
 * @property {boolean} trackInventory - Whether to track inventory for this product
 * @property {boolean} allowBackorder - Allow selling when out of stock
 * @property {number} taxRate - Tax rate percentage (e.g., 10 for 10%)
 * @property {string} supplier - Supplier name (optional)
 * @property {string} [supplierId] - Supplier ID reference (optional)
 * @property {ProductVariant[]} variants - Product variants (size, color, etc.)
 * @property {boolean} [isBundle] - Whether this is a bundled product
 * @property {ProductBundle} [bundle] - Bundle information if isBundle is true
 * @property {Object} [customFields] - Custom fields for extensibility
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
 * @property {number} price - Variant price (deprecated - use pricing instead)
 * @property {PricingTier} [pricing] - Variant-specific pricing tiers
 * @property {number} stockQuantity - Variant stock quantity
 * @property {Object} attributes - Variant attributes (e.g., {size: 'S', color: 'blue'})
 * @property {string} [barcode] - Variant-specific barcode
 * @property {string} [imageUrl] - Variant-specific image
 */

/**
 * @typedef {Object} CreateProductInput
 * @property {string} sku - Stock Keeping Unit
 * @property {string} name - Product name
 * @property {string} description - Product description
 * @property {ProductCategory} category - Product category
 * @property {string} [subcategory] - Product subcategory ID
 * @property {number} price - Selling price (deprecated - use pricing)
 * @property {PricingTier} [pricing] - Multi-tier pricing structure
 * @property {number} cost - Cost price
 * @property {number} stockQuantity - Initial stock quantity
 * @property {number} lowStockThreshold - Low stock alert threshold
 * @property {UnitType} unit - Unit of measurement
 * @property {UnitConversion[]} [unitConversions] - Available unit conversions
 * @property {string} [barcode] - Barcode (optional)
 * @property {string[]} [imageUrls] - Multiple image URLs (optional)
 * @property {string} [imageUrl] - Image URL (optional, backwards compatibility)
 * @property {ProductStatus} status - Product status
 * @property {string[]} [tags] - Tags (optional)
 * @property {ProductAttribute[]} [attributes] - Product attributes
 * @property {boolean} trackInventory - Track inventory flag
 * @property {boolean} allowBackorder - Allow backorder flag
 * @property {number} taxRate - Tax rate percentage
 * @property {string} [supplier] - Supplier name (optional)
 * @property {string} [supplierId] - Supplier ID reference (optional)
 * @property {ProductVariant[]} [variants] - Product variants (optional)
 * @property {boolean} [isBundle] - Whether this is a bundled product
 * @property {ProductBundle} [bundle] - Bundle information
 * @property {Object} [customFields] - Custom fields
 */

/**
 * @typedef {Object} UpdateProductInput
 * @property {string} [sku] - Stock Keeping Unit
 * @property {string} [name] - Product name
 * @property {string} [description] - Product description
 * @property {ProductCategory} [category] - Product category
 * @property {string} [subcategory] - Product subcategory ID
 * @property {number} [price] - Selling price (deprecated)
 * @property {PricingTier} [pricing] - Multi-tier pricing structure
 * @property {number} [cost] - Cost price
 * @property {number} [stockQuantity] - Stock quantity
 * @property {number} [lowStockThreshold] - Low stock threshold
 * @property {UnitType} [unit] - Unit of measurement
 * @property {UnitConversion[]} [unitConversions] - Available unit conversions
 * @property {string} [barcode] - Barcode
 * @property {string[]} [imageUrls] - Multiple image URLs
 * @property {string} [imageUrl] - Image URL
 * @property {ProductStatus} [status] - Product status
 * @property {string[]} [tags] - Tags
 * @property {ProductAttribute[]} [attributes] - Product attributes
 * @property {boolean} [trackInventory] - Track inventory flag
 * @property {boolean} [allowBackorder] - Allow backorder flag
 * @property {number} [taxRate] - Tax rate percentage
 * @property {string} [supplier] - Supplier name
 * @property {string} [supplierId] - Supplier ID reference
 * @property {ProductVariant[]} [variants] - Product variants
 * @property {boolean} [isBundle] - Whether this is a bundled product
 * @property {ProductBundle} [bundle] - Bundle information
 * @property {Object} [customFields] - Custom fields
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

// Subcategories organized by parent category
export const PRODUCT_SUBCATEGORIES = {
  yoga_mat: [
    { id: 'yoga_mat_standard', name: 'Standard Mats', description: 'Standard thickness yoga mats' },
    { id: 'yoga_mat_thick', name: 'Thick Mats', description: 'Extra thick cushioned mats' },
    { id: 'yoga_mat_travel', name: 'Travel Mats', description: 'Lightweight portable mats' },
    { id: 'yoga_mat_eco', name: 'Eco-Friendly Mats', description: 'Sustainable and natural materials' },
    { id: 'yoga_mat_premium', name: 'Premium Mats', description: 'High-end professional mats' }
  ],
  yoga_block: [
    { id: 'yoga_block_foam', name: 'Foam Blocks', description: 'Lightweight foam blocks' },
    { id: 'yoga_block_cork', name: 'Cork Blocks', description: 'Natural cork blocks' },
    { id: 'yoga_block_bamboo', name: 'Bamboo Blocks', description: 'Solid bamboo blocks' }
  ],
  yoga_strap: [
    { id: 'yoga_strap_cotton', name: 'Cotton Straps', description: 'Soft cotton straps' },
    { id: 'yoga_strap_nylon', name: 'Nylon Straps', description: 'Durable nylon straps' },
    { id: 'yoga_strap_adjustable', name: 'Adjustable Straps', description: 'Straps with adjustable buckles' }
  ],
  clothing: [
    { id: 'clothing_tops', name: 'Tops', description: 'Yoga tops and shirts' },
    { id: 'clothing_bottoms', name: 'Bottoms', description: 'Yoga pants and leggings' },
    { id: 'clothing_sets', name: 'Sets', description: 'Matching yoga outfits' },
    { id: 'clothing_mens', name: "Men's Wear", description: "Men's yoga clothing" },
    { id: 'clothing_womens', name: "Women's Wear", description: "Women's yoga clothing" }
  ],
  accessories: [
    { id: 'accessories_bags', name: 'Bags', description: 'Yoga mat bags and carriers' },
    { id: 'accessories_bottles', name: 'Water Bottles', description: 'Hydration bottles' },
    { id: 'accessories_towels', name: 'Towels', description: 'Yoga towels' },
    { id: 'accessories_props', name: 'Props', description: 'Various yoga props' }
  ],
  equipment: [
    { id: 'equipment_wheels', name: 'Yoga Wheels', description: 'Yoga wheels and rollers' },
    { id: 'equipment_bolsters', name: 'Bolsters', description: 'Yoga bolsters and cushions' },
    { id: 'equipment_blankets', name: 'Blankets', description: 'Yoga blankets' },
    { id: 'equipment_chairs', name: 'Chairs', description: 'Yoga chairs and benches' }
  ],
  supplements: [
    { id: 'supplements_protein', name: 'Protein', description: 'Protein powders and drinks' },
    { id: 'supplements_vitamins', name: 'Vitamins', description: 'Vitamin supplements' },
    { id: 'supplements_energy', name: 'Energy', description: 'Energy supplements' },
    { id: 'supplements_recovery', name: 'Recovery', description: 'Post-workout recovery' }
  ],
  books: [
    { id: 'books_beginner', name: 'Beginner Guides', description: 'Books for beginners' },
    { id: 'books_advanced', name: 'Advanced Practice', description: 'Advanced yoga books' },
    { id: 'books_philosophy', name: 'Philosophy', description: 'Yoga philosophy books' },
    { id: 'books_anatomy', name: 'Anatomy', description: 'Yoga anatomy books' }
  ]
};

// Pricing tier types
export const PRICING_TIERS = {
  RETAIL: 'retail',
  WHOLESALE: 'wholesale',
  MEMBER: 'member',
  CUSTOM: 'custom'
};

export const PRICING_TIER_LABELS = {
  retail: 'Retail Price',
  wholesale: 'Wholesale Price',
  member: 'Member Price',
  custom: 'Custom Price'
};

// Common product attributes
export const COMMON_ATTRIBUTES = {
  COLOR: 'color',
  SIZE: 'size',
  MATERIAL: 'material',
  THICKNESS: 'thickness',
  LENGTH: 'length',
  WIDTH: 'width',
  WEIGHT: 'weight',
  FLAVOR: 'flavor',
  SCENT: 'scent'
};

export const ATTRIBUTE_LABELS = {
  color: 'Color',
  size: 'Size',
  material: 'Material',
  thickness: 'Thickness',
  length: 'Length',
  width: 'Width',
  weight: 'Weight',
  flavor: 'Flavor',
  scent: 'Scent'
};

// Standard unit conversions
export const UNIT_CONVERSIONS = {
  // Weight conversions
  kg_to_g: { fromUnit: 'kg', toUnit: 'g', conversionFactor: 1000, formula: '1 kg = 1000 g' },
  g_to_kg: { fromUnit: 'g', toUnit: 'kg', conversionFactor: 0.001, formula: '1 g = 0.001 kg' },

  // Volume conversions
  l_to_ml: { fromUnit: 'l', toUnit: 'ml', conversionFactor: 1000, formula: '1 L = 1000 ml' },
  ml_to_l: { fromUnit: 'ml', toUnit: 'l', conversionFactor: 0.001, formula: '1 ml = 0.001 L' },

  // Package conversions (these would be product-specific in real implementation)
  set_to_piece: { fromUnit: 'set', toUnit: 'piece', conversionFactor: 1, formula: 'Varies by product' },
  pack_to_piece: { fromUnit: 'pack', toUnit: 'piece', conversionFactor: 1, formula: 'Varies by product' }
};
