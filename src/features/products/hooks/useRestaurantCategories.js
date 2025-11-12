/**
 * useRestaurantCategories Hook
 * Custom hook for managing restaurant categories
 */

import { useStore } from '../../../store';

export function useRestaurantCategories() {
  const {
    restaurantCategories,
    fetchRestaurantCategories,
    fetchActiveRestaurantCategories,
    createRestaurantCategory,
    updateRestaurantCategory,
    deleteRestaurantCategory,
    getCategoriesByType,
    getSubcategories,
    getAvailableCategories,
    isCategoryAvailable,
    initializeDefaultCategories,
    reorderCategories,
    isLoadingCategories,
    categoryError,
    clearCategoryError
  } = useStore();

  return {
    // State
    restaurantCategories,
    isLoadingCategories,
    categoryError,

    // Actions
    fetchRestaurantCategories,
    fetchActiveRestaurantCategories,
    createRestaurantCategory,
    updateRestaurantCategory,
    deleteRestaurantCategory,
    getCategoriesByType,
    getSubcategories,
    getAvailableCategories,
    isCategoryAvailable,
    initializeDefaultCategories,
    reorderCategories,
    clearCategoryError
  };
}

export function useAvailabilityRules() {
  const {
    availabilityRules,
    fetchAvailabilityRules,
    createAvailabilityRule,
    updateAvailabilityRule,
    deleteAvailabilityRule
  } = useStore();

  return {
    // State
    availabilityRules,

    // Actions
    fetchAvailabilityRules,
    createAvailabilityRule,
    updateAvailabilityRule,
    deleteAvailabilityRule
  };
}

export default useRestaurantCategories;
