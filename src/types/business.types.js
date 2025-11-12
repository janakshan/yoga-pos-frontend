/**
 * Business Type Definitions
 * Defines types and constants for different business modes
 */

/**
 * @typedef {'yoga' | 'restaurant'} BusinessType
 * The type of business/operation mode
 */

/**
 * Business type constants
 * @enum {BusinessType}
 */
export const BUSINESS_TYPES = {
  YOGA: 'yoga',
  RESTAURANT: 'restaurant',
};

/**
 * Business type display names
 * @type {Record<BusinessType, string>}
 */
export const BUSINESS_TYPE_LABELS = {
  [BUSINESS_TYPES.YOGA]: 'Yoga Studio',
  [BUSINESS_TYPES.RESTAURANT]: 'Restaurant',
};

/**
 * Business type descriptions
 * @type {Record<BusinessType, string>}
 */
export const BUSINESS_TYPE_DESCRIPTIONS = {
  [BUSINESS_TYPES.YOGA]: 'Point of Sale system optimized for yoga studios, fitness centers, and wellness businesses',
  [BUSINESS_TYPES.RESTAURANT]: 'Full-featured restaurant management system with table service, kitchen display, and order management',
};

/**
 * Features available per business type
 * @type {Record<BusinessType, string[]>}
 */
export const BUSINESS_TYPE_FEATURES = {
  [BUSINESS_TYPES.YOGA]: [
    'Class scheduling',
    'Membership management',
    'Retail products',
    'Customer profiles',
    'Inventory tracking',
  ],
  [BUSINESS_TYPES.RESTAURANT]: [
    'Table management',
    'Kitchen display system',
    'Order management',
    'Menu categories',
    'Table service workflow',
    'Course management',
  ],
};

/**
 * Check if a business type is valid
 * @param {string} type - The business type to validate
 * @returns {boolean} True if valid business type
 */
export const isValidBusinessType = (type) => {
  return Object.values(BUSINESS_TYPES).includes(type);
};

/**
 * Get business type label
 * @param {BusinessType} type - The business type
 * @returns {string} The display label
 */
export const getBusinessTypeLabel = (type) => {
  return BUSINESS_TYPE_LABELS[type] || type;
};

/**
 * Get business type description
 * @param {BusinessType} type - The business type
 * @returns {string} The description
 */
export const getBusinessTypeDescription = (type) => {
  return BUSINESS_TYPE_DESCRIPTIONS[type] || '';
};

/**
 * Get features for a business type
 * @param {BusinessType} type - The business type
 * @returns {string[]} Array of feature names
 */
export const getBusinessTypeFeatures = (type) => {
  return BUSINESS_TYPE_FEATURES[type] || [];
};
