import { useStore } from '../store';
import { BUSINESS_TYPES } from '../types/business.types';

/**
 * Custom hook for business type management
 * Provides business type state and utilities
 *
 * @returns {Object} Business type utilities
 */
export const useBusinessType = () => {
  const businessType = useStore((state) => state.businessType);
  const setBusinessType = useStore((state) => state.setBusinessType);
  const restaurantSettings = useStore((state) => state.restaurantSettings);
  const updateRestaurantSettings = useStore((state) => state.updateRestaurantSettings);

  /**
   * Check if current business type is yoga
   * @returns {boolean}
   */
  const isYoga = () => businessType === BUSINESS_TYPES.YOGA;

  /**
   * Check if current business type is restaurant
   * @returns {boolean}
   */
  const isRestaurant = () => businessType === BUSINESS_TYPES.RESTAURANT;

  /**
   * Switch business type
   * @param {import('../types/business.types').BusinessType} type
   */
  const switchBusinessType = (type) => {
    if (type !== businessType) {
      setBusinessType(type);
    }
  };

  /**
   * Toggle between business types
   */
  const toggleBusinessType = () => {
    const newType = businessType === BUSINESS_TYPES.YOGA
      ? BUSINESS_TYPES.RESTAURANT
      : BUSINESS_TYPES.YOGA;
    setBusinessType(newType);
  };

  /**
   * Check if a feature should be visible based on business type
   * @param {import('../types/business.types').BusinessType} requiredType
   * @returns {boolean}
   */
  const isFeatureVisible = (requiredType) => {
    if (!requiredType) return true;
    return businessType === requiredType;
  };

  return {
    businessType,
    isYoga: isYoga(),
    isRestaurant: isRestaurant(),
    setBusinessType: switchBusinessType,
    toggleBusinessType,
    isFeatureVisible,
    restaurantSettings,
    updateRestaurantSettings,
  };
};

export default useBusinessType;
