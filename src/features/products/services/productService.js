import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  UNIT_TYPES,
  PRODUCT_SUBCATEGORIES
} from '../types/product.types.js';
import { generateBarcode } from '../utils/barcodeUtils.js';

/**
 * Mock delay to simulate network latency
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate unique ID
 * @returns {string}
 */
const generateId = () => `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

/**
 * Mock product data
 */
let MOCK_PRODUCTS = [
  {
    id: 'prod_001',
    sku: 'YM-001-BLU',
    name: 'Premium Yoga Mat - Ocean Blue',
    description: 'High-quality non-slip yoga mat perfect for all types of yoga practice. Made from eco-friendly TPE material.',
    category: PRODUCT_CATEGORIES.YOGA_MAT,
    subcategory: 'yoga_mat_premium',
    price: 49.99, // Backwards compatibility - defaults to retail price
    pricing: {
      retail: 49.99,
      wholesale: 39.99,
      member: 44.99
    },
    cost: 25.00,
    stockQuantity: 45,
    lowStockThreshold: 10,
    unit: UNIT_TYPES.PIECE,
    unitConversions: [],
    barcode: '1234567890123',
    imageUrl: '/images/products/yoga-mat-blue.jpg',
    imageUrls: ['/images/products/yoga-mat-blue.jpg', '/images/products/yoga-mat-blue-2.jpg'],
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['yoga', 'mat', 'premium', 'eco-friendly', 'non-slip'],
    attributes: [
      { id: 'attr_001', name: 'Color', value: 'Ocean Blue', isVariant: false },
      { id: 'attr_002', name: 'Material', value: 'TPE', isVariant: false },
      { id: 'attr_003', name: 'Thickness', value: '6mm', isVariant: false },
      { id: 'attr_004', name: 'Length', value: '183cm', isVariant: false }
    ],
    trackInventory: true,
    allowBackorder: false,
    taxRate: 10,
    supplier: 'Yoga Supplies Co.',
    supplierId: 'sup_001',
    variants: [],
    isBundle: false,
    customFields: {
      weight: '1.2kg',
      dimensions: '183cm x 61cm x 0.6cm'
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_002',
    sku: 'YM-002-PUR',
    name: 'Premium Yoga Mat - Purple Lavender',
    description: 'Beautiful purple yoga mat with extra cushioning for comfort during practice.',
    category: PRODUCT_CATEGORIES.YOGA_MAT,
    price: 49.99,
    cost: 25.00,
    stockQuantity: 32,
    lowStockThreshold: 10,
    unit: UNIT_TYPES.PIECE,
    barcode: '1234567890124',
    imageUrl: '/images/products/yoga-mat-purple.jpg',
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['yoga', 'mat', 'premium', 'comfort'],
    trackInventory: true,
    allowBackorder: false,
    taxRate: 10,
    supplier: 'Yoga Supplies Co.',
    variants: [],
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_003',
    sku: 'YB-001-CORK',
    name: 'Cork Yoga Block (Set of 2)',
    description: 'Sustainable cork yoga blocks for support and stability. Set of 2 blocks.',
    category: PRODUCT_CATEGORIES.YOGA_BLOCK,
    price: 24.99,
    cost: 12.00,
    stockQuantity: 67,
    lowStockThreshold: 15,
    unit: UNIT_TYPES.SET,
    barcode: '1234567890125',
    imageUrl: '/images/products/yoga-block-cork.jpg',
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['yoga', 'block', 'cork', 'sustainable', 'support'],
    trackInventory: true,
    allowBackorder: true,
    taxRate: 10,
    supplier: 'EcoYoga Ltd.',
    variants: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_004',
    sku: 'YS-001-BLK',
    name: 'Adjustable Yoga Strap - Black',
    description: 'Durable cotton yoga strap with adjustable buckle. 8 feet long.',
    category: PRODUCT_CATEGORIES.YOGA_STRAP,
    price: 14.99,
    cost: 6.00,
    stockQuantity: 8,
    lowStockThreshold: 10,
    unit: UNIT_TYPES.PIECE,
    barcode: '1234567890126',
    imageUrl: '/images/products/yoga-strap-black.jpg',
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['yoga', 'strap', 'adjustable', 'cotton'],
    trackInventory: true,
    allowBackorder: true,
    taxRate: 10,
    supplier: 'Yoga Supplies Co.',
    variants: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_005',
    sku: 'YW-001-BLU',
    name: 'Yoga Wheel - Deep Blue',
    description: 'Strengthen your back and improve flexibility with our sturdy yoga wheel.',
    category: PRODUCT_CATEGORIES.YOGA_WHEEL,
    price: 39.99,
    cost: 20.00,
    stockQuantity: 18,
    lowStockThreshold: 8,
    unit: UNIT_TYPES.PIECE,
    barcode: '1234567890127',
    imageUrl: '/images/products/yoga-wheel-blue.jpg',
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['yoga', 'wheel', 'back', 'flexibility'],
    trackInventory: true,
    allowBackorder: false,
    taxRate: 10,
    supplier: 'Fitness Gear Inc.',
    variants: [],
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_006',
    sku: 'CL-001-LS',
    name: 'Women\'s Yoga Leggings - Storm Gray',
    description: 'Comfortable high-waisted yoga leggings with moisture-wicking fabric.',
    category: PRODUCT_CATEGORIES.CLOTHING,
    price: 59.99,
    cost: 28.00,
    stockQuantity: 54,
    lowStockThreshold: 20,
    unit: UNIT_TYPES.PIECE,
    barcode: '1234567890128',
    imageUrl: '/images/products/leggings-gray.jpg',
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['clothing', 'leggings', 'women', 'activewear'],
    trackInventory: true,
    allowBackorder: true,
    taxRate: 10,
    supplier: 'ActiveWear Pro',
    variants: [
      { id: 'var_001', name: 'Small - Gray', sku: 'CL-001-LS-SM', price: 59.99, stockQuantity: 15, attributes: { size: 'S', color: 'gray' } },
      { id: 'var_002', name: 'Medium - Gray', sku: 'CL-001-LS-MD', price: 59.99, stockQuantity: 20, attributes: { size: 'M', color: 'gray' } },
      { id: 'var_003', name: 'Large - Gray', sku: 'CL-001-LS-LG', price: 59.99, stockQuantity: 19, attributes: { size: 'L', color: 'gray' } }
    ],
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_007',
    sku: 'ACC-001-BTL',
    name: 'Insulated Water Bottle - 750ml',
    description: 'Stainless steel insulated water bottle keeps drinks cold for 24 hours.',
    category: PRODUCT_CATEGORIES.ACCESSORIES,
    price: 29.99,
    cost: 15.00,
    stockQuantity: 41,
    lowStockThreshold: 15,
    unit: UNIT_TYPES.PIECE,
    barcode: '1234567890129',
    imageUrl: '/images/products/water-bottle.jpg',
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['accessories', 'water', 'bottle', 'insulated'],
    trackInventory: true,
    allowBackorder: true,
    taxRate: 10,
    supplier: 'Hydration Co.',
    variants: [],
    createdAt: new Date('2024-02-12'),
    updatedAt: new Date('2024-02-12'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_008',
    sku: 'MEM-001-M',
    name: 'Monthly Unlimited Membership',
    description: 'Unlimited access to all yoga classes for one month.',
    category: PRODUCT_CATEGORIES.MEMBERSHIPS,
    price: 129.99,
    cost: 0,
    stockQuantity: 999,
    lowStockThreshold: 0,
    unit: UNIT_TYPES.SERVICE,
    barcode: '',
    imageUrl: '/images/products/membership.jpg',
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['membership', 'monthly', 'unlimited', 'classes'],
    trackInventory: false,
    allowBackorder: true,
    taxRate: 0,
    supplier: '',
    variants: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_009',
    sku: 'CLS-001-BEG',
    name: 'Beginner Yoga Class - Single Session',
    description: 'One-hour beginner-friendly yoga class suitable for all levels.',
    category: PRODUCT_CATEGORIES.CLASSES,
    price: 25.00,
    cost: 0,
    stockQuantity: 999,
    lowStockThreshold: 0,
    unit: UNIT_TYPES.SESSION,
    barcode: '',
    imageUrl: '/images/products/class-beginner.jpg',
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['class', 'beginner', 'yoga', 'session'],
    trackInventory: false,
    allowBackorder: true,
    taxRate: 0,
    supplier: '',
    variants: [],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_010',
    sku: 'SUP-001-PRO',
    name: 'Plant-Based Protein Powder - Vanilla',
    description: 'Organic plant-based protein powder for post-workout recovery. 30 servings.',
    category: PRODUCT_CATEGORIES.SUPPLEMENTS,
    price: 44.99,
    cost: 22.00,
    stockQuantity: 0,
    lowStockThreshold: 5,
    unit: UNIT_TYPES.PIECE,
    barcode: '1234567890130',
    imageUrl: '/images/products/protein-vanilla.jpg',
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['supplement', 'protein', 'vegan', 'organic'],
    trackInventory: true,
    allowBackorder: true,
    taxRate: 10,
    supplier: 'Wellness Nutrition',
    variants: [],
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_011',
    sku: 'YM-003-GRN',
    name: 'Eco Yoga Mat - Forest Green',
    description: 'Biodegradable yoga mat made from natural rubber and jute fibers.',
    category: PRODUCT_CATEGORIES.YOGA_MAT,
    price: 69.99,
    cost: 35.00,
    stockQuantity: 22,
    lowStockThreshold: 8,
    unit: UNIT_TYPES.PIECE,
    barcode: '1234567890131',
    imageUrl: '/images/products/yoga-mat-green.jpg',
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['yoga', 'mat', 'eco', 'natural', 'biodegradable'],
    trackInventory: true,
    allowBackorder: false,
    taxRate: 10,
    supplier: 'EcoYoga Ltd.',
    variants: [],
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_012',
    sku: 'GC-100',
    name: 'Gift Card - $100',
    description: '$100 gift card redeemable for any products or services.',
    category: PRODUCT_CATEGORIES.GIFT_CARDS,
    price: 100.00,
    pricing: {
      retail: 100.00,
      wholesale: 100.00,
      member: 100.00
    },
    cost: 0,
    stockQuantity: 999,
    lowStockThreshold: 0,
    unit: UNIT_TYPES.PIECE,
    barcode: '',
    imageUrl: '/images/products/gift-card.jpg',
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['gift', 'card', 'voucher'],
    trackInventory: false,
    allowBackorder: true,
    taxRate: 0,
    supplier: '',
    variants: [],
    isBundle: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_013',
    sku: 'BDL-001-START',
    name: 'Yoga Starter Kit Bundle',
    description: 'Complete starter kit for beginners including mat, blocks, and strap. Save $15 when purchased as a bundle!',
    category: PRODUCT_CATEGORIES.EQUIPMENT,
    subcategory: 'equipment_kits',
    price: 84.97, // Bundle price (calculated from bundle.bundlePrice)
    pricing: {
      retail: 84.97,
      wholesale: 74.97,
      member: 79.97
    },
    cost: 43.00,
    stockQuantity: 25,
    lowStockThreshold: 5,
    unit: UNIT_TYPES.SET,
    barcode: '1234567890132',
    imageUrl: '/images/products/yoga-starter-kit.jpg',
    imageUrls: ['/images/products/yoga-starter-kit.jpg'],
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['bundle', 'kit', 'starter', 'beginner', 'yoga'],
    attributes: [
      { id: 'attr_bundle_001', name: 'Bundle Type', value: 'Starter Kit', isVariant: false },
      { id: 'attr_bundle_002', name: 'Items Included', value: '4 pieces', isVariant: false }
    ],
    trackInventory: true,
    allowBackorder: false,
    taxRate: 10,
    supplier: 'Yoga Supplies Co.',
    supplierId: 'sup_001',
    variants: [],
    isBundle: true,
    bundle: {
      id: 'bundle_001',
      name: 'Yoga Starter Kit',
      description: 'Everything you need to start your yoga journey',
      items: [
        { productId: 'prod_001', quantity: 1, discount: 0 }, // Premium Yoga Mat
        { productId: 'prod_003', quantity: 1, discount: 0 }, // Cork Blocks Set
        { productId: 'prod_004', quantity: 1, discount: 0 }  // Yoga Strap
      ],
      bundlePrice: 84.97, // Original total: 49.99 + 24.99 + 14.99 = 89.97, Save $5
      savings: 5.00
    },
    customFields: {
      bundleDiscount: '6%',
      totalValue: '$89.97'
    },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  },
  {
    id: 'prod_014',
    sku: 'SUP-002-PRO-CHOC',
    name: 'Plant-Based Protein Powder - Chocolate',
    description: 'Organic plant-based protein powder in rich chocolate flavor. 30 servings per container.',
    category: PRODUCT_CATEGORIES.SUPPLEMENTS,
    subcategory: 'supplements_protein',
    price: 44.99,
    pricing: {
      retail: 44.99,
      wholesale: 34.99,
      member: 39.99
    },
    cost: 22.00,
    stockQuantity: 35,
    lowStockThreshold: 10,
    unit: UNIT_TYPES.PIECE,
    unitConversions: [
      { fromUnit: 'piece', toUnit: 'g', conversionFactor: 900, formula: '1 container = 900g' },
      { fromUnit: 'g', toUnit: 'piece', conversionFactor: 0.001111, formula: '900g = 1 container' }
    ],
    barcode: '1234567890133',
    imageUrl: '/images/products/protein-chocolate.jpg',
    imageUrls: ['/images/products/protein-chocolate.jpg'],
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['supplement', 'protein', 'vegan', 'organic', 'chocolate'],
    attributes: [
      { id: 'attr_014_001', name: 'Flavor', value: 'Chocolate', isVariant: true },
      { id: 'attr_014_002', name: 'Size', value: '900g', isVariant: false },
      { id: 'attr_014_003', name: 'Servings', value: '30', isVariant: false },
      { id: 'attr_014_004', name: 'Dietary', value: 'Vegan', isVariant: false }
    ],
    trackInventory: true,
    allowBackorder: true,
    taxRate: 10,
    supplier: 'Wellness Nutrition',
    supplierId: 'sup_002',
    variants: [],
    isBundle: false,
    customFields: {
      servingSize: '30g',
      proteinPerServing: '20g',
      allergenInfo: 'May contain traces of nuts'
    },
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
    createdBy: 'user_001',
    updatedBy: 'user_001'
  }
];

/**
 * Calculate product statistics
 * @param {Array} products - Array of products
 * @returns {Object} Product statistics
 */
const calculateStats = (products) => {
  const stats = {
    totalProducts: products.length,
    activeProducts: 0,
    inactiveProducts: 0,
    discontinuedProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalInventoryValue: 0,
    totalRetailValue: 0,
    productsByCategory: {}
  };

  products.forEach((product) => {
    // Status counts
    if (product.status === PRODUCT_STATUSES.ACTIVE) stats.activeProducts++;
    if (product.status === PRODUCT_STATUSES.INACTIVE) stats.inactiveProducts++;
    if (product.status === PRODUCT_STATUSES.DISCONTINUED) stats.discontinuedProducts++;

    // Stock counts
    if (product.trackInventory) {
      if (product.stockQuantity === 0) {
        stats.outOfStockProducts++;
      } else if (product.stockQuantity <= product.lowStockThreshold) {
        stats.lowStockProducts++;
      }

      // Value calculations
      stats.totalInventoryValue += product.cost * product.stockQuantity;
      stats.totalRetailValue += product.price * product.stockQuantity;
    }

    // Category counts
    stats.productsByCategory[product.category] =
      (stats.productsByCategory[product.category] || 0) + 1;
  });

  return stats;
};

/**
 * Product Service
 * Mock service for product CRUD operations
 */
export const productService = {
  /**
   * Get all products with optional filtering
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} List of products
   */
  async getList(filters = {}) {
    await delay(400);

    let result = [...MOCK_PRODUCTS];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((product) => product.category === filters.category);
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter((product) => product.status === filters.status);
    }

    // Apply low stock filter
    if (filters.lowStock) {
      result = result.filter((product) =>
        product.trackInventory &&
        product.stockQuantity > 0 &&
        product.stockQuantity <= product.lowStockThreshold
      );
    }

    // Apply price range filters
    if (filters.minPrice !== undefined && filters.minPrice !== '') {
      result = result.filter((product) => product.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
      result = result.filter((product) => product.price <= parseFloat(filters.maxPrice));
    }

    // Apply tags filter
    if (filters.tags && filters.tags.length > 0) {
      result = result.filter((product) =>
        filters.tags.some(tag => product.tags.includes(tag))
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;
      result.sort((a, b) => {
        let aVal = a[filters.sortBy];
        let bVal = b[filters.sortBy];

        // Handle date sorting
        if (filters.sortBy === 'createdAt' || filters.sortBy === 'updatedAt') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (aVal < bVal) return -1 * sortOrder;
        if (aVal > bVal) return 1 * sortOrder;
        return 0;
      });
    }

    return result;
  },

  /**
   * Get a single product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  async getById(id) {
    await delay(300);

    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return { ...product };
  },

  /**
   * Get a product by SKU
   * @param {string} sku - Product SKU
   * @returns {Promise<Object>} Product object
   */
  async getBySku(sku) {
    await delay(300);

    const product = MOCK_PRODUCTS.find((p) => p.sku === sku);
    if (!product) {
      throw new Error(`Product with SKU ${sku} not found`);
    }

    return { ...product };
  },

  /**
   * Create a new product
   * @param {Object} data - Product data
   * @returns {Promise<Object>} Created product
   */
  async create(data) {
    await delay(500);

    // Validation
    if (!data.sku?.trim()) {
      throw new Error('SKU is required');
    }
    if (!data.name?.trim()) {
      throw new Error('Product name is required');
    }
    if (!data.category) {
      throw new Error('Category is required');
    }
    if (data.price === undefined || data.price < 0) {
      throw new Error('Valid price is required');
    }
    if (data.cost === undefined || data.cost < 0) {
      throw new Error('Valid cost is required');
    }

    // Check for duplicate SKU
    const existingSku = MOCK_PRODUCTS.find((p) => p.sku === data.sku);
    if (existingSku) {
      throw new Error(`Product with SKU ${data.sku} already exists`);
    }

    // Set up pricing tiers
    const pricing = data.pricing || {
      retail: parseFloat(data.price),
      wholesale: parseFloat(data.price) * 0.85,
      member: parseFloat(data.price) * 0.92
    };

    const newProduct = {
      id: generateId(),
      sku: data.sku,
      name: data.name,
      description: data.description || '',
      category: data.category,
      subcategory: data.subcategory || null,
      price: parseFloat(data.price), // Backwards compatibility
      pricing,
      cost: parseFloat(data.cost),
      stockQuantity: parseInt(data.stockQuantity) || 0,
      lowStockThreshold: parseInt(data.lowStockThreshold) || 10,
      unit: data.unit || UNIT_TYPES.PIECE,
      unitConversions: Array.isArray(data.unitConversions) ? data.unitConversions : [],
      barcode: data.barcode || '',
      imageUrl: data.imageUrl || '',
      imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : (data.imageUrl ? [data.imageUrl] : []),
      status: data.status || PRODUCT_STATUSES.ACTIVE,
      tags: Array.isArray(data.tags) ? data.tags : [],
      attributes: Array.isArray(data.attributes) ? data.attributes : [],
      trackInventory: data.trackInventory !== false,
      allowBackorder: data.allowBackorder || false,
      taxRate: parseFloat(data.taxRate) || 0,
      supplier: data.supplier || '',
      supplierId: data.supplierId || null,
      variants: Array.isArray(data.variants) ? data.variants : [],
      isBundle: data.isBundle || false,
      bundle: data.bundle || null,
      customFields: data.customFields || {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user',
      updatedBy: 'current_user'
    };

    MOCK_PRODUCTS.push(newProduct);
    return { ...newProduct };
  },

  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {Object} data - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  async update(id, data) {
    await delay(500);

    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    // Check for duplicate SKU (excluding current product)
    if (data.sku) {
      const existingSku = MOCK_PRODUCTS.find((p) => p.sku === data.sku && p.id !== id);
      if (existingSku) {
        throw new Error(`Product with SKU ${data.sku} already exists`);
      }
    }

    const updatedProduct = {
      ...MOCK_PRODUCTS[index],
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
      updatedBy: 'current_user'
    };

    MOCK_PRODUCTS[index] = updatedProduct;
    return { ...updatedProduct };
  },

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  async remove(id) {
    await delay(400);

    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    MOCK_PRODUCTS.splice(index, 1);
    return true;
  },

  /**
   * Get product statistics
   * @returns {Promise<Object>} Product statistics
   */
  async getStats() {
    await delay(300);
    return calculateStats(MOCK_PRODUCTS);
  },

  /**
   * Adjust product inventory
   * @param {string} id - Product ID
   * @param {number} adjustment - Quantity to add (positive) or remove (negative)
   * @returns {Promise<Object>} Updated product
   */
  async adjustInventory(id, adjustment) {
    await delay(400);

    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    const product = MOCK_PRODUCTS[index];
    if (!product.trackInventory) {
      throw new Error('This product does not track inventory');
    }

    const newQuantity = product.stockQuantity + adjustment;
    if (newQuantity < 0) {
      throw new Error('Insufficient stock for this adjustment');
    }

    product.stockQuantity = newQuantity;
    product.updatedAt = new Date();
    product.updatedBy = 'current_user';

    return { ...product };
  },

  /**
   * Bulk update product status
   * @param {string[]} ids - Array of product IDs
   * @param {string} status - New status
   * @returns {Promise<number>} Number of products updated
   */
  async bulkUpdateStatus(ids, status) {
    await delay(500);

    if (!Object.values(PRODUCT_STATUSES).includes(status)) {
      throw new Error('Invalid product status');
    }

    let count = 0;
    ids.forEach((id) => {
      const product = MOCK_PRODUCTS.find((p) => p.id === id);
      if (product) {
        product.status = status;
        product.updatedAt = new Date();
        product.updatedBy = 'current_user';
        count++;
      }
    });

    return count;
  },

  /**
   * Get products that need reordering (low stock)
   * @returns {Promise<Array>} Products with low stock
   */
  async getLowStockProducts() {
    await delay(300);

    return MOCK_PRODUCTS.filter((product) =>
      product.trackInventory &&
      product.status === PRODUCT_STATUSES.ACTIVE &&
      product.stockQuantity > 0 &&
      product.stockQuantity <= product.lowStockThreshold
    );
  },

  /**
   * Get out-of-stock products
   * @returns {Promise<Array>} Out of stock products
   */
  async getOutOfStockProducts() {
    await delay(300);

    return MOCK_PRODUCTS.filter((product) =>
      product.trackInventory &&
      product.status === PRODUCT_STATUSES.ACTIVE &&
      product.stockQuantity === 0
    );
  },

  /**
   * Get all bundle products
   * @returns {Promise<Array>} Bundle products
   */
  async getBundles() {
    await delay(300);
    return MOCK_PRODUCTS.filter((product) => product.isBundle === true);
  },

  /**
   * Calculate bundle price from items
   * @param {Array} bundleItems - Array of bundle items
   * @returns {Promise<Object>} Calculated bundle info
   */
  async calculateBundlePrice(bundleItems) {
    await delay(200);

    let totalPrice = 0;
    let totalCost = 0;
    const items = [];

    for (const item of bundleItems) {
      const product = MOCK_PRODUCTS.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      const itemPrice = product.pricing?.retail || product.price;
      const itemCost = product.cost;
      const discount = item.discount || 0;

      const discountedPrice = itemPrice * (1 - discount / 100);

      totalPrice += discountedPrice * item.quantity;
      totalCost += itemCost * item.quantity;

      items.push({
        ...item,
        product: {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: itemPrice,
          cost: itemCost
        },
        itemTotal: discountedPrice * item.quantity
      });
    }

    return {
      items,
      totalPrice: parseFloat(totalPrice.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      regularPrice: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    };
  },

  /**
   * Get products by subcategory
   * @param {string} subcategoryId - Subcategory ID
   * @returns {Promise<Array>} Products in subcategory
   */
  async getBySubcategory(subcategoryId) {
    await delay(300);
    return MOCK_PRODUCTS.filter((product) => product.subcategory === subcategoryId);
  },

  /**
   * Get all subcategories for a category
   * @param {string} category - Category name
   * @returns {Promise<Array>} Subcategories
   */
  async getSubcategories(category) {
    await delay(200);
    return PRODUCT_SUBCATEGORIES[category] || [];
  },

  /**
   * Generate barcode for a product
   * @param {Object} options - Barcode generation options
   * @returns {Promise<string>} Generated barcode
   */
  async generateProductBarcode(options = {}) {
    await delay(200);
    return generateBarcode({
      type: options.type || 'EAN13',
      prefix: options.prefix || '200',
      sku: options.sku || '',
      productId: options.productId || ''
    });
  },

  /**
   * Search products by attributes
   * @param {Object} attributeFilters - Attribute filters
   * @returns {Promise<Array>} Matching products
   */
  async searchByAttributes(attributeFilters) {
    await delay(300);

    return MOCK_PRODUCTS.filter((product) => {
      if (!product.attributes || product.attributes.length === 0) {
        return false;
      }

      return Object.entries(attributeFilters).every(([attrName, attrValue]) => {
        return product.attributes.some(
          (attr) =>
            attr.name.toLowerCase() === attrName.toLowerCase() &&
            attr.value.toLowerCase().includes(attrValue.toLowerCase())
        );
      });
    });
  },

  /**
   * Get products by pricing tier
   * @param {string} tier - Pricing tier (retail, wholesale, member)
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @returns {Promise<Array>} Filtered products
   */
  async getByPricingTier(tier, minPrice, maxPrice) {
    await delay(300);

    return MOCK_PRODUCTS.filter((product) => {
      const price = product.pricing?.[tier] || product.price;
      if (minPrice !== undefined && price < minPrice) return false;
      if (maxPrice !== undefined && price > maxPrice) return false;
      return true;
    });
  },

  /**
   * Update pricing tiers for a product
   * @param {string} id - Product ID
   * @param {Object} pricingTiers - New pricing tiers
   * @returns {Promise<Object>} Updated product
   */
  async updatePricing(id, pricingTiers) {
    await delay(400);

    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    MOCK_PRODUCTS[index].pricing = {
      ...MOCK_PRODUCTS[index].pricing,
      ...pricingTiers
    };

    // Update the legacy price field to match retail
    if (pricingTiers.retail !== undefined) {
      MOCK_PRODUCTS[index].price = pricingTiers.retail;
    }

    MOCK_PRODUCTS[index].updatedAt = new Date();
    MOCK_PRODUCTS[index].updatedBy = 'current_user';

    return { ...MOCK_PRODUCTS[index] };
  },

  /**
   * Add custom field to a product
   * @param {string} id - Product ID
   * @param {string} fieldName - Field name
   * @param {any} fieldValue - Field value
   * @returns {Promise<Object>} Updated product
   */
  async addCustomField(id, fieldName, fieldValue) {
    await delay(300);

    const index = MOCK_PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }

    if (!MOCK_PRODUCTS[index].customFields) {
      MOCK_PRODUCTS[index].customFields = {};
    }

    MOCK_PRODUCTS[index].customFields[fieldName] = fieldValue;
    MOCK_PRODUCTS[index].updatedAt = new Date();

    return { ...MOCK_PRODUCTS[index] };
  },

  /**
   * Get all unique attribute names across products
   * @returns {Promise<Array>} Unique attribute names
   */
  async getAvailableAttributes() {
    await delay(200);

    const attributeNames = new Set();
    MOCK_PRODUCTS.forEach((product) => {
      if (product.attributes) {
        product.attributes.forEach((attr) => {
          attributeNames.add(attr.name);
        });
      }
    });

    return Array.from(attributeNames).sort();
  }
};

export default productService;
