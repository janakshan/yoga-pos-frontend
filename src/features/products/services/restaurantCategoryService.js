/**
 * Restaurant Category Service
 * Handles all API calls and business logic for restaurant categories
 */

import { generateId } from '../../../utils/generateId';
import { DEFAULT_RESTAURANT_CATEGORIES } from '../types/restaurant-category.types';

/**
 * Get all restaurant categories
 * @returns {Promise<import('../types/restaurant-category.types.js').RestaurantCategory[]>}
 */
export const getRestaurantCategories = async () => {
  try {
    const stored = localStorage.getItem('restaurantCategories');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error fetching restaurant categories:', error);
    throw error;
  }
};

/**
 * Get a single restaurant category by ID
 * @param {string} id - Category ID
 * @returns {Promise<import('../types/restaurant-category.types.js').RestaurantCategory|null>}
 */
export const getRestaurantCategoryById = async (id) => {
  try {
    const categories = await getRestaurantCategories();
    return categories.find(category => category.id === id) || null;
  } catch (error) {
    console.error('Error fetching restaurant category:', error);
    throw error;
  }
};

/**
 * Create a new restaurant category
 * @param {import('../types/restaurant-category.types.js').CreateRestaurantCategoryInput} input
 * @returns {Promise<import('../types/restaurant-category.types.js').RestaurantCategory>}
 */
export const createRestaurantCategory = async (input) => {
  try {
    const categories = await getRestaurantCategories();

    const newCategory = {
      id: generateId('restaurant_category'),
      ...input,
      status: input.status || 'active',
      displayOrder: input.displayOrder ?? categories.length,
      showInMenu: input.showInMenu ?? true,
      showInPOS: input.showInPOS ?? true,
      showInKDS: input.showInKDS ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    categories.push(newCategory);
    localStorage.setItem('restaurantCategories', JSON.stringify(categories));

    return newCategory;
  } catch (error) {
    console.error('Error creating restaurant category:', error);
    throw error;
  }
};

/**
 * Update an existing restaurant category
 * @param {string} id - Category ID
 * @param {import('../types/restaurant-category.types.js').UpdateRestaurantCategoryInput} input
 * @returns {Promise<import('../types/restaurant-category.types.js').RestaurantCategory>}
 */
export const updateRestaurantCategory = async (id, input) => {
  try {
    const categories = await getRestaurantCategories();
    const index = categories.findIndex(category => category.id === id);

    if (index === -1) {
      throw new Error(`Restaurant category with ID ${id} not found`);
    }

    const updatedCategory = {
      ...categories[index],
      ...input,
      updatedAt: new Date().toISOString()
    };

    categories[index] = updatedCategory;
    localStorage.setItem('restaurantCategories', JSON.stringify(categories));

    return updatedCategory;
  } catch (error) {
    console.error('Error updating restaurant category:', error);
    throw error;
  }
};

/**
 * Delete a restaurant category
 * @param {string} id - Category ID
 * @returns {Promise<boolean>}
 */
export const deleteRestaurantCategory = async (id) => {
  try {
    const categories = await getRestaurantCategories();
    const filteredCategories = categories.filter(category => category.id !== id);

    if (filteredCategories.length === categories.length) {
      throw new Error(`Restaurant category with ID ${id} not found`);
    }

    localStorage.setItem('restaurantCategories', JSON.stringify(filteredCategories));
    return true;
  } catch (error) {
    console.error('Error deleting restaurant category:', error);
    throw error;
  }
};

/**
 * Get active restaurant categories sorted by display order
 * @returns {Promise<import('../types/restaurant-category.types.js').RestaurantCategory[]>}
 */
export const getActiveRestaurantCategories = async () => {
  try {
    const categories = await getRestaurantCategories();
    return categories
      .filter(cat => cat.status === 'active')
      .sort((a, b) => a.displayOrder - b.displayOrder);
  } catch (error) {
    console.error('Error fetching active restaurant categories:', error);
    throw error;
  }
};

/**
 * Get categories by type
 * @param {import('../types/restaurant-category.types.js').RestaurantCategoryType} type
 * @returns {Promise<import('../types/restaurant-category.types.js').RestaurantCategory[]>}
 */
export const getRestaurantCategoriesByType = async (type) => {
  try {
    const categories = await getRestaurantCategories();
    return categories.filter(cat => cat.type === type && cat.status === 'active');
  } catch (error) {
    console.error('Error fetching restaurant categories by type:', error);
    throw error;
  }
};

/**
 * Get subcategories of a parent category
 * @param {string} parentCategoryId - Parent category ID
 * @returns {Promise<import('../types/restaurant-category.types.js').RestaurantCategory[]>}
 */
export const getSubcategories = async (parentCategoryId) => {
  try {
    const categories = await getRestaurantCategories();
    return categories
      .filter(cat => cat.parentCategoryId === parentCategoryId && cat.status === 'active')
      .sort((a, b) => a.displayOrder - b.displayOrder);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

/**
 * Check if a category is available at a specific time
 * @param {import('../types/restaurant-category.types.js').RestaurantCategory} category
 * @param {Date} dateTime
 * @returns {boolean}
 */
export const isCategoryAvailable = (category, dateTime = new Date()) => {
  if (!category.availability) {
    return true; // No restrictions
  }

  const { daysOfWeek, timeRanges, startDate, endDate } = category.availability;

  // Check date range
  if (startDate && new Date(startDate) > dateTime) {
    return false;
  }
  if (endDate && new Date(endDate) < dateTime) {
    return false;
  }

  // Check day of week
  if (daysOfWeek && daysOfWeek.length > 0) {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[dateTime.getDay()];
    if (!daysOfWeek.includes(currentDay)) {
      return false;
    }
  }

  // Check time ranges
  if (timeRanges && timeRanges.length > 0) {
    const currentTime = dateTime.toTimeString().substring(0, 5); // HH:mm format
    const isWithinTimeRange = timeRanges.some(range =>
      currentTime >= range.start && currentTime <= range.end
    );
    if (!isWithinTimeRange) {
      return false;
    }
  }

  return true;
};

/**
 * Get available categories at current time
 * @param {Date} [dateTime] - Optional date/time to check (defaults to now)
 * @returns {Promise<import('../types/restaurant-category.types.js').RestaurantCategory[]>}
 */
export const getAvailableCategories = async (dateTime = new Date()) => {
  try {
    const categories = await getActiveRestaurantCategories();
    return categories.filter(cat => isCategoryAvailable(cat, dateTime));
  } catch (error) {
    console.error('Error fetching available categories:', error);
    throw error;
  }
};

/**
 * Initialize default restaurant categories
 * @returns {Promise<import('../types/restaurant-category.types.js').RestaurantCategory[]>}
 */
export const initializeDefaultCategories = async () => {
  try {
    const existing = await getRestaurantCategories();

    if (existing.length > 0) {
      return existing; // Already initialized
    }

    const categories = DEFAULT_RESTAURANT_CATEGORIES.map(category => ({
      id: generateId('restaurant_category'),
      ...category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    localStorage.setItem('restaurantCategories', JSON.stringify(categories));

    return categories;
  } catch (error) {
    console.error('Error initializing default categories:', error);
    throw error;
  }
};

/**
 * Reorder categories
 * @param {string[]} categoryIds - Array of category IDs in new order
 * @returns {Promise<import('../types/restaurant-category.types.js').RestaurantCategory[]>}
 */
export const reorderCategories = async (categoryIds) => {
  try {
    const categories = await getRestaurantCategories();

    // Update display order based on new position
    categoryIds.forEach((categoryId, index) => {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        category.displayOrder = index;
        category.updatedAt = new Date().toISOString();
      }
    });

    localStorage.setItem('restaurantCategories', JSON.stringify(categories));

    return categories.sort((a, b) => a.displayOrder - b.displayOrder);
  } catch (error) {
    console.error('Error reordering categories:', error);
    throw error;
  }
};

/**
 * Create menu availability rule
 * @param {Omit<import('../types/restaurant-category.types.js').MenuAvailabilityRule, 'id'>} rule
 * @returns {Promise<import('../types/restaurant-category.types.js').MenuAvailabilityRule>}
 */
export const createAvailabilityRule = async (rule) => {
  try {
    const stored = localStorage.getItem('menuAvailabilityRules');
    const rules = stored ? JSON.parse(stored) : [];

    const newRule = {
      id: generateId('availability_rule'),
      ...rule,
      isActive: rule.isActive ?? true
    };

    rules.push(newRule);
    localStorage.setItem('menuAvailabilityRules', JSON.stringify(rules));

    return newRule;
  } catch (error) {
    console.error('Error creating availability rule:', error);
    throw error;
  }
};

/**
 * Get all availability rules
 * @returns {Promise<import('../types/restaurant-category.types.js').MenuAvailabilityRule[]>}
 */
export const getAvailabilityRules = async () => {
  try {
    const stored = localStorage.getItem('menuAvailabilityRules');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error fetching availability rules:', error);
    throw error;
  }
};

/**
 * Update availability rule
 * @param {string} id - Rule ID
 * @param {Partial<import('../types/restaurant-category.types.js').MenuAvailabilityRule>} updates
 * @returns {Promise<import('../types/restaurant-category.types.js').MenuAvailabilityRule>}
 */
export const updateAvailabilityRule = async (id, updates) => {
  try {
    const rules = await getAvailabilityRules();
    const index = rules.findIndex(rule => rule.id === id);

    if (index === -1) {
      throw new Error(`Availability rule with ID ${id} not found`);
    }

    rules[index] = {
      ...rules[index],
      ...updates
    };

    localStorage.setItem('menuAvailabilityRules', JSON.stringify(rules));

    return rules[index];
  } catch (error) {
    console.error('Error updating availability rule:', error);
    throw error;
  }
};

/**
 * Delete availability rule
 * @param {string} id - Rule ID
 * @returns {Promise<boolean>}
 */
export const deleteAvailabilityRule = async (id) => {
  try {
    const rules = await getAvailabilityRules();
    const filteredRules = rules.filter(rule => rule.id !== id);

    if (filteredRules.length === rules.length) {
      throw new Error(`Availability rule with ID ${id} not found`);
    }

    localStorage.setItem('menuAvailabilityRules', JSON.stringify(filteredRules));
    return true;
  } catch (error) {
    console.error('Error deleting availability rule:', error);
    throw error;
  }
};

export default {
  getRestaurantCategories,
  getRestaurantCategoryById,
  createRestaurantCategory,
  updateRestaurantCategory,
  deleteRestaurantCategory,
  getActiveRestaurantCategories,
  getRestaurantCategoriesByType,
  getSubcategories,
  isCategoryAvailable,
  getAvailableCategories,
  initializeDefaultCategories,
  reorderCategories,
  createAvailabilityRule,
  getAvailabilityRules,
  updateAvailabilityRule,
  deleteAvailabilityRule
};
