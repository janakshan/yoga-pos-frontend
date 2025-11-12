import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import productService from '../services/productService.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for product CRUD operations
 * @returns {Object} Product state and actions
 */
export const useProducts = () => {
  // State selectors
  const products = useStore((state) => state.products);
  const selectedProduct = useStore((state) => state.selectedProduct);
  const isLoading = useStore((state) => state.productLoading);
  const error = useStore((state) => state.productError);
  const stats = useStore((state) => state.productStats);

  // Action selectors
  const setProducts = useStore((state) => state.setProducts);
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  const removeProduct = useStore((state) => state.removeProduct);
  const setSelectedProduct = useStore((state) => state.setSelectedProduct);
  const setProductLoading = useStore((state) => state.setProductLoading);
  const setProductError = useStore((state) => state.setProductError);
  const setProductStats = useStore((state) => state.setProductStats);
  const updateProductInventory = useStore((state) => state.updateProductInventory);
  const bulkUpdateProductStatus = useStore((state) => state.bulkUpdateProductStatus);
  const clearProductError = useStore((state) => state.clearProductError);

  /**
   * Fetch all products with optional filters
   * @param {Object} filters - Filter options
   * @returns {Promise<Array>} Products array
   */
  const fetchProducts = useCallback(
    async (filters = {}) => {
      try {
        setProductLoading(true);
        setProductError(null);

        const data = await productService.getList(filters);
        setProducts(data);

        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch products';
        setProductError(message);
        toast.error(message);
        throw err;
      } finally {
        setProductLoading(false);
      }
    },
    [setProducts, setProductLoading, setProductError]
  );

  /**
   * Fetch product statistics
   * @returns {Promise<Object>} Product stats
   */
  const fetchProductStats = useCallback(async () => {
    try {
      const data = await productService.getStats();
      setProductStats(data);
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch product statistics';
      toast.error(message);
      throw err;
    }
  }, [setProductStats]);

  /**
   * Fetch a single product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Product object
   */
  const fetchProductById = useCallback(
    async (id) => {
      try {
        setProductLoading(true);
        setProductError(null);

        const data = await productService.getById(id);
        setSelectedProduct(data);

        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch product';
        setProductError(message);
        toast.error(message);
        throw err;
      } finally {
        setProductLoading(false);
      }
    },
    [setSelectedProduct, setProductLoading, setProductError]
  );

  /**
   * Create a new product
   * @param {Object} data - Product data
   * @returns {Promise<Object>} Created product
   */
  const createProduct = useCallback(
    async (data) => {
      try {
        setProductLoading(true);
        setProductError(null);

        const newProduct = await productService.create(data);
        addProduct(newProduct);

        toast.success('Product created successfully');
        return newProduct;
      } catch (err) {
        const message = err.message || 'Failed to create product';
        setProductError(message);
        toast.error(message);
        throw err;
      } finally {
        setProductLoading(false);
      }
    },
    [addProduct, setProductLoading, setProductError]
  );

  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {Object} data - Updated product data
   * @returns {Promise<Object>} Updated product
   */
  const updateProductById = useCallback(
    async (id, data) => {
      try {
        setProductLoading(true);
        setProductError(null);

        const updatedProduct = await productService.update(id, data);
        updateProduct(id, updatedProduct);

        toast.success('Product updated successfully');
        return updatedProduct;
      } catch (err) {
        const message = err.message || 'Failed to update product';
        setProductError(message);
        toast.error(message);
        throw err;
      } finally {
        setProductLoading(false);
      }
    },
    [updateProduct, setProductLoading, setProductError]
  );

  /**
   * Delete a product
   * @param {string} id - Product ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteProduct = useCallback(
    async (id) => {
      try {
        setProductLoading(true);
        setProductError(null);

        await productService.remove(id);
        removeProduct(id);

        toast.success('Product deleted successfully');
        return true;
      } catch (err) {
        const message = err.message || 'Failed to delete product';
        setProductError(message);
        toast.error(message);
        throw err;
      } finally {
        setProductLoading(false);
      }
    },
    [removeProduct, setProductLoading, setProductError]
  );

  /**
   * Adjust product inventory
   * @param {string} id - Product ID
   * @param {number} adjustment - Quantity adjustment (positive or negative)
   * @returns {Promise<Object>} Updated product
   */
  const adjustInventory = useCallback(
    async (id, adjustment) => {
      try {
        setProductLoading(true);
        setProductError(null);

        const updatedProduct = await productService.adjustInventory(id, adjustment);
        updateProductInventory(id, updatedProduct.stockQuantity);

        toast.success('Inventory adjusted successfully');
        return updatedProduct;
      } catch (err) {
        const message = err.message || 'Failed to adjust inventory';
        setProductError(message);
        toast.error(message);
        throw err;
      } finally {
        setProductLoading(false);
      }
    },
    [updateProductInventory, setProductLoading, setProductError]
  );

  /**
   * Bulk update product status
   * @param {string[]} ids - Array of product IDs
   * @param {string} status - New status
   * @returns {Promise<number>} Number of products updated
   */
  const bulkUpdateStatus = useCallback(
    async (ids, status) => {
      try {
        setProductLoading(true);
        setProductError(null);

        const count = await productService.bulkUpdateStatus(ids, status);
        bulkUpdateProductStatus(ids, status);

        toast.success(`${count} product(s) updated successfully`);
        return count;
      } catch (err) {
        const message = err.message || 'Failed to update products';
        setProductError(message);
        toast.error(message);
        throw err;
      } finally {
        setProductLoading(false);
      }
    },
    [bulkUpdateProductStatus, setProductLoading, setProductError]
  );

  /**
   * Get low stock products
   * @returns {Promise<Array>} Low stock products
   */
  const fetchLowStockProducts = useCallback(async () => {
    try {
      const data = await productService.getLowStockProducts();
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch low stock products';
      toast.error(message);
      throw err;
    }
  }, []);

  /**
   * Get out of stock products
   * @returns {Promise<Array>} Out of stock products
   */
  const fetchOutOfStockProducts = useCallback(async () => {
    try {
      const data = await productService.getOutOfStockProducts();
      return data;
    } catch (err) {
      const message = err.message || 'Failed to fetch out of stock products';
      toast.error(message);
      throw err;
    }
  }, []);

  /**
   * Select a product
   * @param {Object} product - Product to select
   */
  const selectProduct = useCallback(
    (product) => {
      setSelectedProduct(product);
    },
    [setSelectedProduct]
  );

  /**
   * Clear selected product
   */
  const clearSelectedProduct = useCallback(() => {
    setSelectedProduct(null);
  }, [setSelectedProduct]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    clearProductError();
  }, [clearProductError]);

  return {
    // State
    products,
    selectedProduct,
    isLoading,
    error,
    stats,

    // Actions
    fetchProducts,
    fetchProductStats,
    fetchProductById,
    createProduct,
    updateProductById,
    deleteProduct,
    adjustInventory,
    bulkUpdateStatus,
    fetchLowStockProducts,
    fetchOutOfStockProducts,

    // Utilities
    selectProduct,
    clearSelectedProduct,
    clearError
  };
};

export default useProducts;
