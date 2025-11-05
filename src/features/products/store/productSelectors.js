/**
 * Product Selectors
 * Reusable selectors for accessing product state
 */

/**
 * Select all products
 * @param {Object} state - Zustand state
 * @returns {Array} Products array
 */
export const selectProducts = (state) => state.products;

/**
 * Select selected product
 * @param {Object} state - Zustand state
 * @returns {Object|null} Selected product
 */
export const selectSelectedProduct = (state) => state.selectedProduct;

/**
 * Select product loading state
 * @param {Object} state - Zustand state
 * @returns {boolean} Loading state
 */
export const selectProductLoading = (state) => state.productLoading;

/**
 * Select product error
 * @param {Object} state - Zustand state
 * @returns {string|null} Error message
 */
export const selectProductError = (state) => state.productError;

/**
 * Select product statistics
 * @param {Object} state - Zustand state
 * @returns {Object} Product stats
 */
export const selectProductStats = (state) => state.productStats;

/**
 * Select active products
 * @param {Object} state - Zustand state
 * @returns {Array} Active products
 */
export const selectActiveProducts = (state) =>
  state.products.filter((p) => p.status === 'active');

/**
 * Select products by category
 * @param {string} category - Category to filter by
 * @returns {Function} Selector function
 */
export const selectProductsByCategory = (category) => (state) =>
  state.products.filter((p) => p.category === category);

/**
 * Select low stock products
 * @param {Object} state - Zustand state
 * @returns {Array} Low stock products
 */
export const selectLowStockProducts = (state) =>
  state.products.filter(
    (p) =>
      p.trackInventory &&
      p.stockQuantity > 0 &&
      p.stockQuantity <= p.lowStockThreshold
  );

/**
 * Select out of stock products
 * @param {Object} state - Zustand state
 * @returns {Array} Out of stock products
 */
export const selectOutOfStockProducts = (state) =>
  state.products.filter((p) => p.trackInventory && p.stockQuantity === 0);

/**
 * Select product by ID
 * @param {string} id - Product ID
 * @returns {Function} Selector function
 */
export const selectProductById = (id) => (state) =>
  state.products.find((p) => p.id === id);

/**
 * Select product by SKU
 * @param {string} sku - Product SKU
 * @returns {Function} Selector function
 */
export const selectProductBySku = (sku) => (state) =>
  state.products.find((p) => p.sku === sku);
