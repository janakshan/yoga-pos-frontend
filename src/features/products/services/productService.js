import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  UNIT_TYPES
} from '../types/product.types.js';

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
    price: 49.99,
    cost: 25.00,
    stockQuantity: 45,
    lowStockThreshold: 10,
    unit: UNIT_TYPES.PIECE,
    barcode: '1234567890123',
    imageUrl: '/images/products/yoga-mat-blue.jpg',
    status: PRODUCT_STATUSES.ACTIVE,
    tags: ['yoga', 'mat', 'premium', 'eco-friendly', 'non-slip'],
    trackInventory: true,
    allowBackorder: false,
    taxRate: 10,
    supplier: 'Yoga Supplies Co.',
    variants: [],
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
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
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

    const newProduct = {
      id: generateId(),
      sku: data.sku,
      name: data.name,
      description: data.description || '',
      category: data.category,
      price: parseFloat(data.price),
      cost: parseFloat(data.cost),
      stockQuantity: parseInt(data.stockQuantity) || 0,
      lowStockThreshold: parseInt(data.lowStockThreshold) || 10,
      unit: data.unit || UNIT_TYPES.PIECE,
      barcode: data.barcode || '',
      imageUrl: data.imageUrl || '',
      status: data.status || PRODUCT_STATUSES.ACTIVE,
      tags: Array.isArray(data.tags) ? data.tags : [],
      trackInventory: data.trackInventory !== false,
      allowBackorder: data.allowBackorder || false,
      taxRate: parseFloat(data.taxRate) || 0,
      supplier: data.supplier || '',
      variants: Array.isArray(data.variants) ? data.variants : [],
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
  }
};

export default productService;
