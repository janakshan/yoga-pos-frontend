/**
 * Product Slice
 * Zustand slice for product state management
 */

export const createProductSlice = (set, get) => ({
  // State
  products: [],
  selectedProduct: null,
  productLoading: false,
  productError: null,
  productStats: {
    totalProducts: 0,
    activeProducts: 0,
    inactiveProducts: 0,
    discontinuedProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    totalInventoryValue: 0,
    totalRetailValue: 0,
    productsByCategory: {}
  },

  // Mutations (using Immer draft syntax)

  /**
   * Set products list
   * @param {Array} products - Products array
   */
  setProducts: (products) =>
    set((state) => {
      state.products = products;
    }),

  /**
   * Add a new product
   * @param {Object} product - Product to add
   */
  addProduct: (product) =>
    set((state) => {
      state.products.push(product);
    }),

  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {Object} updates - Fields to update
   */
  updateProduct: (id, updates) =>
    set((state) => {
      const index = state.products.findIndex((p) => p.id === id);
      if (index >= 0) {
        state.products[index] = { ...state.products[index], ...updates };
      }
    }),

  /**
   * Remove a product
   * @param {string} id - Product ID
   */
  removeProduct: (id) =>
    set((state) => {
      state.products = state.products.filter((p) => p.id !== id);
    }),

  /**
   * Set selected product
   * @param {Object|null} product - Product to select or null to clear
   */
  setSelectedProduct: (product) =>
    set((state) => {
      state.selectedProduct = product;
    }),

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setProductLoading: (loading) =>
    set((state) => {
      state.productLoading = loading;
    }),

  /**
   * Set error state
   * @param {string|null} error - Error message or null to clear
   */
  setProductError: (error) =>
    set((state) => {
      state.productError = error;
    }),

  /**
   * Set product statistics
   * @param {Object} stats - Product statistics
   */
  setProductStats: (stats) =>
    set((state) => {
      state.productStats = stats;
    }),

  /**
   * Update product inventory
   * @param {string} id - Product ID
   * @param {number} quantity - New quantity
   */
  updateProductInventory: (id, quantity) =>
    set((state) => {
      const index = state.products.findIndex((p) => p.id === id);
      if (index >= 0) {
        state.products[index].stockQuantity = quantity;
        state.products[index].updatedAt = new Date();
      }
    }),

  /**
   * Bulk update product status
   * @param {string[]} ids - Product IDs
   * @param {string} status - New status
   */
  bulkUpdateProductStatus: (ids, status) =>
    set((state) => {
      ids.forEach((id) => {
        const index = state.products.findIndex((p) => p.id === id);
        if (index >= 0) {
          state.products[index].status = status;
          state.products[index].updatedAt = new Date();
        }
      });
    }),

  // Getters (derived state)

  /**
   * Get product by ID
   * @param {string} id - Product ID
   * @returns {Object|undefined} Product object
   */
  getProductById: (id) => {
    const state = get();
    return state.products.find((p) => p.id === id);
  },

  /**
   * Get product by SKU
   * @param {string} sku - Product SKU
   * @returns {Object|undefined} Product object
   */
  getProductBySku: (sku) => {
    const state = get();
    return state.products.find((p) => p.sku === sku);
  },

  /**
   * Get products by category
   * @param {string} category - Category name
   * @returns {Array} Products in category
   */
  getProductsByCategory: (category) => {
    const state = get();
    return state.products.filter((p) => p.category === category);
  },

  /**
   * Get active products
   * @returns {Array} Active products
   */
  getActiveProducts: () => {
    const state = get();
    return state.products.filter((p) => p.status === 'active');
  },

  /**
   * Get low stock products
   * @returns {Array} Products with low stock
   */
  getLowStockProducts: () => {
    const state = get();
    return state.products.filter(
      (p) =>
        p.trackInventory &&
        p.stockQuantity > 0 &&
        p.stockQuantity <= p.lowStockThreshold
    );
  },

  /**
   * Get out of stock products
   * @returns {Array} Products that are out of stock
   */
  getOutOfStockProducts: () => {
    const state = get();
    return state.products.filter((p) => p.trackInventory && p.stockQuantity === 0);
  },

  /**
   * Get bundle products
   * @returns {Array} Products that are bundles
   */
  getBundleProducts: () => {
    const state = get();
    return state.products.filter((p) => p.isBundle === true);
  },

  /**
   * Get products by subcategory
   * @param {string} subcategoryId - Subcategory ID
   * @returns {Array} Products in subcategory
   */
  getProductsBySubcategory: (subcategoryId) => {
    const state = get();
    return state.products.filter((p) => p.subcategory === subcategoryId);
  },

  /**
   * Get products with specific attribute
   * @param {string} attributeName - Attribute name
   * @param {string} attributeValue - Attribute value (optional)
   * @returns {Array} Products with the attribute
   */
  getProductsByAttribute: (attributeName, attributeValue = null) => {
    const state = get();
    return state.products.filter((p) => {
      if (!p.attributes || p.attributes.length === 0) return false;
      return p.attributes.some((attr) => {
        if (attributeValue) {
          return attr.name === attributeName && attr.value === attributeValue;
        }
        return attr.name === attributeName;
      });
    });
  },

  /**
   * Get product price for specific tier
   * @param {string} productId - Product ID
   * @param {string} tier - Pricing tier (retail, wholesale, member)
   * @returns {number|null} Price for tier or null if not found
   */
  getProductPriceByTier: (productId, tier = 'retail') => {
    const state = get();
    const product = state.products.find((p) => p.id === productId);
    if (!product) return null;

    // Return pricing tier if available, otherwise return legacy price
    return product.pricing?.[tier] || product.price || 0;
  },

  /**
   * Clear product error
   */
  clearProductError: () =>
    set((state) => {
      state.productError = null;
    }),

  /**
   * Reset product state
   */
  resetProductState: () =>
    set((state) => {
      state.products = [];
      state.selectedProduct = null;
      state.productLoading = false;
      state.productError = null;
      state.productStats = {
        totalProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        discontinuedProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        totalInventoryValue: 0,
        totalRetailValue: 0,
        productsByCategory: {}
      };
    })
});

export default createProductSlice;
