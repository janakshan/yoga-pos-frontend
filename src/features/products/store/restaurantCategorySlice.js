/**
 * Restaurant Category Slice
 * Zustand slice for managing restaurant categories and menu availability
 */

import restaurantCategoryService from '../services/restaurantCategoryService';

/**
 * Create restaurant category slice
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} Restaurant category slice
 */
export const createRestaurantCategorySlice = (set, get) => ({
  // State
  restaurantCategories: [],
  availabilityRules: [],
  isLoadingCategories: false,
  categoryError: null,

  // Actions

  /**
   * Fetch all restaurant categories
   */
  fetchRestaurantCategories: async () => {
    set({ isLoadingCategories: true, categoryError: null });
    try {
      const categories = await restaurantCategoryService.getRestaurantCategories();
      set({ restaurantCategories: categories, isLoadingCategories: false });
    } catch (error) {
      set({ categoryError: error.message, isLoadingCategories: false });
      throw error;
    }
  },

  /**
   * Fetch active restaurant categories
   */
  fetchActiveRestaurantCategories: async () => {
    set({ isLoadingCategories: true, categoryError: null });
    try {
      const categories = await restaurantCategoryService.getActiveRestaurantCategories();
      set({ restaurantCategories: categories, isLoadingCategories: false });
    } catch (error) {
      set({ categoryError: error.message, isLoadingCategories: false });
      throw error;
    }
  },

  /**
   * Create a new restaurant category
   * @param {import('../types/restaurant-category.types.js').CreateRestaurantCategoryInput} input
   */
  createRestaurantCategory: async (input) => {
    set({ isLoadingCategories: true, categoryError: null });
    try {
      const newCategory = await restaurantCategoryService.createRestaurantCategory(input);
      set((state) => ({
        restaurantCategories: [...state.restaurantCategories, newCategory],
        isLoadingCategories: false
      }));
      return newCategory;
    } catch (error) {
      set({ categoryError: error.message, isLoadingCategories: false });
      throw error;
    }
  },

  /**
   * Update a restaurant category
   * @param {string} id
   * @param {import('../types/restaurant-category.types.js').UpdateRestaurantCategoryInput} input
   */
  updateRestaurantCategory: async (id, input) => {
    set({ isLoadingCategories: true, categoryError: null });
    try {
      const updatedCategory = await restaurantCategoryService.updateRestaurantCategory(id, input);
      set((state) => ({
        restaurantCategories: state.restaurantCategories.map(category =>
          category.id === id ? updatedCategory : category
        ),
        isLoadingCategories: false
      }));
      return updatedCategory;
    } catch (error) {
      set({ categoryError: error.message, isLoadingCategories: false });
      throw error;
    }
  },

  /**
   * Delete a restaurant category
   * @param {string} id
   */
  deleteRestaurantCategory: async (id) => {
    set({ isLoadingCategories: true, categoryError: null });
    try {
      await restaurantCategoryService.deleteRestaurantCategory(id);
      set((state) => ({
        restaurantCategories: state.restaurantCategories.filter(category => category.id !== id),
        isLoadingCategories: false
      }));
    } catch (error) {
      set({ categoryError: error.message, isLoadingCategories: false });
      throw error;
    }
  },

  /**
   * Get categories by type
   * @param {import('../types/restaurant-category.types.js').RestaurantCategoryType} type
   */
  getCategoriesByType: async (type) => {
    set({ isLoadingCategories: true, categoryError: null });
    try {
      const categories = await restaurantCategoryService.getRestaurantCategoriesByType(type);
      return categories;
    } catch (error) {
      set({ categoryError: error.message, isLoadingCategories: false });
      throw error;
    }
  },

  /**
   * Get subcategories of a parent category
   * @param {string} parentCategoryId
   */
  getSubcategories: async (parentCategoryId) => {
    set({ isLoadingCategories: true, categoryError: null });
    try {
      const subcategories = await restaurantCategoryService.getSubcategories(parentCategoryId);
      return subcategories;
    } catch (error) {
      set({ categoryError: error.message, isLoadingCategories: false });
      throw error;
    }
  },

  /**
   * Get available categories at a specific time
   * @param {Date} [dateTime]
   */
  getAvailableCategories: async (dateTime = new Date()) => {
    try {
      return await restaurantCategoryService.getAvailableCategories(dateTime);
    } catch (error) {
      set({ categoryError: error.message });
      throw error;
    }
  },

  /**
   * Check if a category is available
   * @param {string} categoryId
   * @param {Date} [dateTime]
   */
  isCategoryAvailable: (categoryId, dateTime = new Date()) => {
    const state = get();
    const category = state.restaurantCategories.find(cat => cat.id === categoryId);
    if (!category) return false;
    return restaurantCategoryService.isCategoryAvailable(category, dateTime);
  },

  /**
   * Initialize default restaurant categories
   */
  initializeDefaultCategories: async () => {
    set({ isLoadingCategories: true, categoryError: null });
    try {
      const categories = await restaurantCategoryService.initializeDefaultCategories();
      set({ restaurantCategories: categories, isLoadingCategories: false });
      return categories;
    } catch (error) {
      set({ categoryError: error.message, isLoadingCategories: false });
      throw error;
    }
  },

  /**
   * Reorder categories
   * @param {string[]} categoryIds
   */
  reorderCategories: async (categoryIds) => {
    set({ isLoadingCategories: true, categoryError: null });
    try {
      const reordered = await restaurantCategoryService.reorderCategories(categoryIds);
      set({ restaurantCategories: reordered, isLoadingCategories: false });
      return reordered;
    } catch (error) {
      set({ categoryError: error.message, isLoadingCategories: false });
      throw error;
    }
  },

  /**
   * Fetch availability rules
   */
  fetchAvailabilityRules: async () => {
    try {
      const rules = await restaurantCategoryService.getAvailabilityRules();
      set({ availabilityRules: rules });
    } catch (error) {
      set({ categoryError: error.message });
      throw error;
    }
  },

  /**
   * Create availability rule
   * @param {Omit<import('../types/restaurant-category.types.js').MenuAvailabilityRule, 'id'>} rule
   */
  createAvailabilityRule: async (rule) => {
    try {
      const newRule = await restaurantCategoryService.createAvailabilityRule(rule);
      set((state) => ({
        availabilityRules: [...state.availabilityRules, newRule]
      }));
      return newRule;
    } catch (error) {
      set({ categoryError: error.message });
      throw error;
    }
  },

  /**
   * Update availability rule
   * @param {string} id
   * @param {Partial<import('../types/restaurant-category.types.js').MenuAvailabilityRule>} updates
   */
  updateAvailabilityRule: async (id, updates) => {
    try {
      const updatedRule = await restaurantCategoryService.updateAvailabilityRule(id, updates);
      set((state) => ({
        availabilityRules: state.availabilityRules.map(rule =>
          rule.id === id ? updatedRule : rule
        )
      }));
      return updatedRule;
    } catch (error) {
      set({ categoryError: error.message });
      throw error;
    }
  },

  /**
   * Delete availability rule
   * @param {string} id
   */
  deleteAvailabilityRule: async (id) => {
    try {
      await restaurantCategoryService.deleteAvailabilityRule(id);
      set((state) => ({
        availabilityRules: state.availabilityRules.filter(rule => rule.id !== id)
      }));
    } catch (error) {
      set({ categoryError: error.message });
      throw error;
    }
  },

  /**
   * Clear category error
   */
  clearCategoryError: () => {
    set({ categoryError: null });
  }
});
