import { PROMOTION_TYPES, PROMOTION_STATUSES } from '../types/pricing.types.js';

/**
 * Pricing Service
 * Mock service for managing location-specific pricing and promotions
 */

// Mock delay utility
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ID generator
const generateId = () => `PRICE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
const generatePromoId = () => `PROMO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Mock data for branch-specific pricing
let MOCK_BRANCH_PRICES = [
  {
    id: 'bp-001',
    productId: 'prod_001',
    branchId: 'branch-001',
    price: 49.99,
    cost: 25.00,
    isActive: true,
    effectiveFrom: new Date('2025-01-01'),
    effectiveUntil: null,
    notes: 'Premium pricing for downtown location',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    createdBy: 'user-001',
  },
  {
    id: 'bp-002',
    productId: 'prod_001',
    branchId: 'branch-002',
    price: 44.99,
    cost: 25.00,
    isActive: true,
    effectiveFrom: new Date('2025-01-01'),
    effectiveUntil: null,
    notes: 'Competitive pricing for marina district',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    createdBy: 'user-001',
  },
];

// Mock data for promotions
let MOCK_PROMOTIONS = [
  {
    id: 'promo-001',
    name: 'New Year Sale',
    description: '20% off all yoga mats',
    type: PROMOTION_TYPES.PERCENTAGE,
    status: PROMOTION_STATUSES.ACTIVE,
    branchIds: [], // All branches
    productIds: [],
    categoryIds: ['yoga_mat'],
    discountValue: 20,
    minPurchaseAmount: 0,
    maxDiscountAmount: null,
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-01-31'),
    priority: 1,
    isStackable: false,
    usageLimit: null,
    usageCount: 145,
    code: null,
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2025-01-01'),
    createdBy: 'user-001',
  },
  {
    id: 'promo-002',
    name: 'Downtown Exclusive',
    description: '$10 off purchases over $50',
    type: PROMOTION_TYPES.FIXED_AMOUNT,
    status: PROMOTION_STATUSES.ACTIVE,
    branchIds: ['branch-001'], // Only downtown
    productIds: [],
    categoryIds: [],
    discountValue: 10,
    minPurchaseAmount: 50,
    maxDiscountAmount: null,
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-02-28'),
    priority: 2,
    isStackable: true,
    usageLimit: 500,
    usageCount: 78,
    code: null,
    createdAt: new Date('2025-01-25'),
    updatedAt: new Date('2025-02-01'),
    createdBy: 'user-002',
  },
  {
    id: 'promo-003',
    name: 'Buy 2 Get 1 Free - Blocks',
    description: 'Buy 2 yoga blocks, get 1 free',
    type: PROMOTION_TYPES.BUY_X_GET_Y,
    status: PROMOTION_STATUSES.ACTIVE,
    branchIds: [],
    productIds: [],
    categoryIds: ['yoga_block'],
    discountValue: 0,
    minPurchaseAmount: 0,
    maxDiscountAmount: null,
    buyXGetY: {
      buyQuantity: 2,
      getQuantity: 1,
      getProductId: null, // Same product
    },
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-03-15'),
    priority: 3,
    isStackable: false,
    usageLimit: null,
    usageCount: 42,
    code: null,
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-15'),
    createdBy: 'user-001',
  },
  {
    id: 'promo-004',
    name: 'SPRING25 - Spring Sale',
    description: '25% off with code SPRING25',
    type: PROMOTION_TYPES.PERCENTAGE,
    status: PROMOTION_STATUSES.SCHEDULED,
    branchIds: [],
    productIds: [],
    categoryIds: [],
    discountValue: 25,
    minPurchaseAmount: 30,
    maxDiscountAmount: 50,
    startDate: new Date('2025-03-20'),
    endDate: new Date('2025-04-20'),
    priority: 1,
    isStackable: false,
    usageLimit: 1000,
    usageCount: 0,
    code: 'SPRING25',
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01'),
    createdBy: 'user-001',
  },
];

/**
 * Get branch-specific price for a product
 */
export const getBranchPrice = async (productId, branchId) => {
  await delay(300);

  const now = new Date();
  const branchPrice = MOCK_BRANCH_PRICES.find(
    (bp) =>
      bp.productId === productId &&
      bp.branchId === branchId &&
      bp.isActive &&
      new Date(bp.effectiveFrom) <= now &&
      (!bp.effectiveUntil || new Date(bp.effectiveUntil) >= now)
  );

  return branchPrice || null;
};

/**
 * Get all branch prices for a product
 */
export const getProductBranchPrices = async (productId) => {
  await delay(300);
  return MOCK_BRANCH_PRICES.filter((bp) => bp.productId === productId);
};

/**
 * Create branch-specific price
 */
export const createBranchPrice = async (data) => {
  await delay(500);

  const newPrice = {
    id: generateId(),
    productId: data.productId,
    branchId: data.branchId,
    price: data.price,
    cost: data.cost || null,
    isActive: true,
    effectiveFrom: data.effectiveFrom || new Date(),
    effectiveUntil: data.effectiveUntil || null,
    notes: data.notes || '',
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'current-user',
  };

  MOCK_BRANCH_PRICES.push(newPrice);
  return newPrice;
};

/**
 * Update branch price
 */
export const updateBranchPrice = async (id, updates) => {
  await delay(500);

  const index = MOCK_BRANCH_PRICES.findIndex((bp) => bp.id === id);
  if (index === -1) {
    throw new Error('Branch price not found');
  }

  MOCK_BRANCH_PRICES[index] = {
    ...MOCK_BRANCH_PRICES[index],
    ...updates,
    updatedAt: new Date(),
  };

  return MOCK_BRANCH_PRICES[index];
};

/**
 * Delete branch price
 */
export const deleteBranchPrice = async (id) => {
  await delay(400);

  const index = MOCK_BRANCH_PRICES.findIndex((bp) => bp.id === id);
  if (index === -1) {
    throw new Error('Branch price not found');
  }

  MOCK_BRANCH_PRICES.splice(index, 1);
  return true;
};

/**
 * Get active promotions
 */
export const getActivePromotions = async (branchId = null, filters = {}) => {
  await delay(400);

  const now = new Date();
  let promotions = MOCK_PROMOTIONS.filter(
    (promo) =>
      promo.status === PROMOTION_STATUSES.ACTIVE &&
      new Date(promo.startDate) <= now &&
      new Date(promo.endDate) >= now
  );

  // Filter by branch
  if (branchId) {
    promotions = promotions.filter(
      (promo) => promo.branchIds.length === 0 || promo.branchIds.includes(branchId)
    );
  }

  // Filter by product
  if (filters.productId) {
    promotions = promotions.filter(
      (promo) =>
        promo.productIds.length === 0 || promo.productIds.includes(filters.productId)
    );
  }

  // Filter by category
  if (filters.categoryId) {
    promotions = promotions.filter(
      (promo) =>
        promo.categoryIds.length === 0 || promo.categoryIds.includes(filters.categoryId)
    );
  }

  // Sort by priority (higher first)
  return promotions.sort((a, b) => b.priority - a.priority);
};

/**
 * Get all promotions with filters
 */
export const getPromotions = async (filters = {}) => {
  await delay(400);

  let promotions = [...MOCK_PROMOTIONS];

  // Filter by status
  if (filters.status) {
    promotions = promotions.filter((p) => p.status === filters.status);
  }

  // Filter by branch
  if (filters.branchId) {
    promotions = promotions.filter(
      (p) => p.branchIds.length === 0 || p.branchIds.includes(filters.branchId)
    );
  }

  // Search by name or code
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    promotions = promotions.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        (p.code && p.code.toLowerCase().includes(searchLower))
    );
  }

  // Sort
  if (filters.sortBy) {
    promotions.sort((a, b) => {
      const aVal = a[filters.sortBy];
      const bVal = b[filters.sortBy];
      if (filters.sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });
  } else {
    promotions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return promotions;
};

/**
 * Get promotion by ID
 */
export const getPromotionById = async (id) => {
  await delay(300);

  const promotion = MOCK_PROMOTIONS.find((p) => p.id === id);
  if (!promotion) {
    throw new Error('Promotion not found');
  }

  return promotion;
};

/**
 * Create promotion
 */
export const createPromotion = async (data) => {
  await delay(600);

  const newPromotion = {
    id: generatePromoId(),
    name: data.name,
    description: data.description,
    type: data.type,
    status: PROMOTION_STATUSES.SCHEDULED,
    branchIds: data.branchIds || [],
    productIds: data.productIds || [],
    categoryIds: data.categoryIds || [],
    discountValue: data.discountValue,
    minPurchaseAmount: data.minPurchaseAmount || 0,
    maxDiscountAmount: data.maxDiscountAmount || null,
    buyXGetY: data.buyXGetY || null,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    priority: data.priority || 1,
    isStackable: data.isStackable || false,
    usageLimit: data.usageLimit || null,
    usageCount: 0,
    code: data.code || null,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: 'current-user',
  };

  // Update status if already active
  const now = new Date();
  if (
    new Date(newPromotion.startDate) <= now &&
    new Date(newPromotion.endDate) >= now
  ) {
    newPromotion.status = PROMOTION_STATUSES.ACTIVE;
  }

  MOCK_PROMOTIONS.push(newPromotion);
  return newPromotion;
};

/**
 * Update promotion
 */
export const updatePromotion = async (id, updates) => {
  await delay(500);

  const index = MOCK_PROMOTIONS.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error('Promotion not found');
  }

  MOCK_PROMOTIONS[index] = {
    ...MOCK_PROMOTIONS[index],
    ...updates,
    updatedAt: new Date(),
  };

  return MOCK_PROMOTIONS[index];
};

/**
 * Delete promotion
 */
export const deletePromotion = async (id) => {
  await delay(400);

  const index = MOCK_PROMOTIONS.findIndex((p) => p.id === id);
  if (index === -1) {
    throw new Error('Promotion not found');
  }

  MOCK_PROMOTIONS.splice(index, 1);
  return true;
};

/**
 * Calculate price with promotions
 */
export const calculatePrice = async (productId, branchId, quantity = 1, promotionCode = null) => {
  await delay(300);

  // Get base price (simplified - would fetch from product service)
  const basePrice = 45.0;

  // Get branch-specific price
  const branchPrice = await getBranchPrice(productId, branchId);
  const effectivePrice = branchPrice ? branchPrice.price : basePrice;

  // Get applicable promotions
  const activePromotions = await getActivePromotions(branchId, { productId });

  // Filter by promotion code if provided
  let applicablePromotions = activePromotions;
  if (promotionCode) {
    const codePromo = activePromotions.find(
      (p) => p.code && p.code.toLowerCase() === promotionCode.toLowerCase()
    );
    if (codePromo) {
      applicablePromotions = [codePromo];
    } else {
      applicablePromotions = [];
    }
  }

  // Calculate discounts
  let totalDiscount = 0;
  const appliedPromotions = [];

  for (const promo of applicablePromotions) {
    if (!promo.isStackable && appliedPromotions.length > 0) {
      continue;
    }

    let discount = 0;

    switch (promo.type) {
      case PROMOTION_TYPES.PERCENTAGE:
        discount = (effectivePrice * quantity * promo.discountValue) / 100;
        if (promo.maxDiscountAmount) {
          discount = Math.min(discount, promo.maxDiscountAmount);
        }
        break;

      case PROMOTION_TYPES.FIXED_AMOUNT:
        if (effectivePrice * quantity >= (promo.minPurchaseAmount || 0)) {
          discount = promo.discountValue;
        }
        break;

      case PROMOTION_TYPES.BUY_X_GET_Y:
        if (quantity >= promo.buyXGetY.buyQuantity) {
          const freeItems = Math.floor(quantity / promo.buyXGetY.buyQuantity) * promo.buyXGetY.getQuantity;
          discount = freeItems * effectivePrice;
        }
        break;

      default:
        break;
    }

    if (discount > 0) {
      totalDiscount += discount;
      appliedPromotions.push(promo);
    }

    if (!promo.isStackable) {
      break;
    }
  }

  const subtotal = effectivePrice * quantity;
  const finalPrice = Math.max(0, subtotal - totalDiscount);
  const taxRate = 0.0875; // Would come from branch settings
  const taxAmount = finalPrice * taxRate;
  const totalPrice = finalPrice + taxAmount;

  return {
    basePrice,
    branchPrice: branchPrice?.price || null,
    effectivePrice,
    quantity,
    subtotal,
    totalDiscount,
    finalPrice,
    appliedPromotions: appliedPromotions.map((p) => ({
      id: p.id,
      name: p.name,
      type: p.type,
      discountValue: p.discountValue,
    })),
    taxAmount,
    taxRate,
    totalPrice,
  };
};

/**
 * Get promotion statistics
 */
export const getPromotionStats = async () => {
  await delay(400);

  const now = new Date();
  const activePromotions = MOCK_PROMOTIONS.filter(
    (p) =>
      p.status === PROMOTION_STATUSES.ACTIVE &&
      new Date(p.startDate) <= now &&
      new Date(p.endDate) >= now
  );

  return {
    totalPromotions: MOCK_PROMOTIONS.length,
    activePromotions: activePromotions.length,
    scheduledPromotions: MOCK_PROMOTIONS.filter(
      (p) => p.status === PROMOTION_STATUSES.SCHEDULED
    ).length,
    expiredPromotions: MOCK_PROMOTIONS.filter(
      (p) => p.status === PROMOTION_STATUSES.EXPIRED
    ).length,
    totalUsage: MOCK_PROMOTIONS.reduce((sum, p) => sum + p.usageCount, 0),
    byType: {
      percentage: MOCK_PROMOTIONS.filter((p) => p.type === PROMOTION_TYPES.PERCENTAGE)
        .length,
      fixed_amount: MOCK_PROMOTIONS.filter(
        (p) => p.type === PROMOTION_TYPES.FIXED_AMOUNT
      ).length,
      buy_x_get_y: MOCK_PROMOTIONS.filter((p) => p.type === PROMOTION_TYPES.BUY_X_GET_Y)
        .length,
    },
  };
};

export const pricingService = {
  getBranchPrice,
  getProductBranchPrices,
  createBranchPrice,
  updateBranchPrice,
  deleteBranchPrice,
  getActivePromotions,
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  calculatePrice,
  getPromotionStats,
};

export default pricingService;
