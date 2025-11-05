/**
 * @typedef {Object} Customer
 * @property {string} id - Unique customer identifier
 * @property {string} firstName - Customer's first name
 * @property {string} lastName - Customer's last name
 * @property {string} email - Customer's email address
 * @property {string} phone - Customer's phone number
 * @property {string} [dateOfBirth] - Customer's date of birth (optional)
 * @property {string} gender - Customer's gender
 * @property {Object} address - Customer's address
 * @property {string} address.street - Street address
 * @property {string} address.city - City
 * @property {string} address.state - State/Province
 * @property {string} address.postalCode - Postal/ZIP code
 * @property {string} address.country - Country
 * @property {string} customerType - Type of customer (regular, vip, corporate)
 * @property {string} status - Customer status (active, inactive, blocked)
 * @property {Object} loyaltyInfo - Loyalty program information
 * @property {number} loyaltyInfo.points - Current loyalty points
 * @property {string} loyaltyInfo.tier - Loyalty tier level
 * @property {Date} loyaltyInfo.joinedDate - Date joined loyalty program
 * @property {Object} preferences - Customer preferences
 * @property {boolean} preferences.emailNotifications - Email notification preference
 * @property {boolean} preferences.smsNotifications - SMS notification preference
 * @property {string[]} preferences.interests - Array of interest categories
 * @property {Object} stats - Customer statistics
 * @property {number} stats.totalPurchases - Total number of purchases
 * @property {number} stats.totalSpent - Total amount spent
 * @property {Date} stats.lastPurchaseDate - Date of last purchase
 * @property {number} stats.averageOrderValue - Average order value
 * @property {string} [notes] - Additional notes about customer
 * @property {string[]} [tags] - Tags for categorization
 * @property {Date} createdAt - Date customer was created
 * @property {Date} updatedAt - Date customer was last updated
 * @property {string} createdBy - User who created the customer record
 */

/**
 * Customer type constants
 * @readonly
 * @enum {string}
 */
export const CUSTOMER_TYPES = {
  REGULAR: 'regular',
  VIP: 'vip',
  CORPORATE: 'corporate',
};

/**
 * Customer status constants
 * @readonly
 * @enum {string}
 */
export const CUSTOMER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BLOCKED: 'blocked',
};

/**
 * Gender constants
 * @readonly
 * @enum {string}
 */
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say',
};

/**
 * Loyalty tier constants
 * @readonly
 * @enum {string}
 */
export const LOYALTY_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
};

/**
 * Customer type labels
 * @readonly
 */
export const CUSTOMER_TYPE_LABELS = {
  [CUSTOMER_TYPES.REGULAR]: 'Regular',
  [CUSTOMER_TYPES.VIP]: 'VIP',
  [CUSTOMER_TYPES.CORPORATE]: 'Corporate',
};

/**
 * Customer status labels
 * @readonly
 */
export const STATUS_LABELS = {
  [CUSTOMER_STATUS.ACTIVE]: 'Active',
  [CUSTOMER_STATUS.INACTIVE]: 'Inactive',
  [CUSTOMER_STATUS.BLOCKED]: 'Blocked',
};

/**
 * Gender labels
 * @readonly
 */
export const GENDER_LABELS = {
  [GENDER.MALE]: 'Male',
  [GENDER.FEMALE]: 'Female',
  [GENDER.OTHER]: 'Other',
  [GENDER.PREFER_NOT_TO_SAY]: 'Prefer not to say',
};

/**
 * Loyalty tier labels
 * @readonly
 */
export const LOYALTY_TIER_LABELS = {
  [LOYALTY_TIERS.BRONZE]: 'Bronze',
  [LOYALTY_TIERS.SILVER]: 'Silver',
  [LOYALTY_TIERS.GOLD]: 'Gold',
  [LOYALTY_TIERS.PLATINUM]: 'Platinum',
};

/**
 * Interest categories for customers
 * @readonly
 */
export const INTEREST_CATEGORIES = {
  YOGA: 'yoga',
  MEDITATION: 'meditation',
  FITNESS: 'fitness',
  WELLNESS: 'wellness',
  NUTRITION: 'nutrition',
  MINDFULNESS: 'mindfulness',
};

/**
 * Interest category labels
 * @readonly
 */
export const INTEREST_LABELS = {
  [INTEREST_CATEGORIES.YOGA]: 'Yoga',
  [INTEREST_CATEGORIES.MEDITATION]: 'Meditation',
  [INTEREST_CATEGORIES.FITNESS]: 'Fitness',
  [INTEREST_CATEGORIES.WELLNESS]: 'Wellness',
  [INTEREST_CATEGORIES.NUTRITION]: 'Nutrition',
  [INTEREST_CATEGORIES.MINDFULNESS]: 'Mindfulness',
};
