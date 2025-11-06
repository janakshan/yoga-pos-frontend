/**
 * @typedef {Object} Customer
 * @property {string} id - Unique customer identifier
 * @property {string} firstName - Customer's first name
 * @property {string} lastName - Customer's last name
 * @property {string} email - Customer's email address
 * @property {string} phone - Customer's phone number
 * @property {string} [alternatePhone] - Alternate contact number
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
 * @property {string[]} segments - Customer segment IDs
 * @property {Object} loyaltyInfo - Loyalty program information
 * @property {number} loyaltyInfo.points - Current loyalty points
 * @property {string} loyaltyInfo.tier - Loyalty tier level
 * @property {Date} loyaltyInfo.joinedDate - Date joined loyalty program
 * @property {Date} loyaltyInfo.lastEarnedDate - Last date points were earned
 * @property {Date} loyaltyInfo.lastRedeemedDate - Last date points were redeemed
 * @property {number} loyaltyInfo.lifetimePoints - Total points earned lifetime
 * @property {number} loyaltyInfo.redeemedPoints - Total points redeemed
 * @property {Object} creditInfo - Customer credit/account management
 * @property {number} creditInfo.creditLimit - Maximum credit allowed
 * @property {number} creditInfo.currentBalance - Current outstanding balance
 * @property {number} creditInfo.availableCredit - Available credit (limit - balance)
 * @property {string} creditInfo.creditStatus - Credit account status
 * @property {Date} creditInfo.lastPaymentDate - Last payment date
 * @property {number} creditInfo.lastPaymentAmount - Last payment amount
 * @property {Date} creditInfo.nextPaymentDue - Next payment due date
 * @property {Object} storeCredit - Store credit balance
 * @property {number} storeCredit.balance - Current store credit balance
 * @property {Date} storeCredit.lastUpdated - Last update date
 * @property {Date} storeCredit.expiryDate - Expiry date if applicable
 * @property {Object} preferences - Customer preferences
 * @property {boolean} preferences.emailNotifications - Email notification preference
 * @property {boolean} preferences.smsNotifications - SMS notification preference
 * @property {boolean} preferences.marketingEmails - Marketing emails preference
 * @property {boolean} preferences.promotionalSms - Promotional SMS preference
 * @property {string} preferences.preferredContactMethod - Preferred contact method
 * @property {string} preferences.preferredLanguage - Preferred language
 * @property {string[]} preferences.interests - Array of interest categories
 * @property {string} preferences.communicationFrequency - Preferred communication frequency
 * @property {Object} stats - Customer statistics
 * @property {number} stats.totalPurchases - Total number of purchases
 * @property {number} stats.totalSpent - Total amount spent
 * @property {Date} stats.lastPurchaseDate - Date of last purchase
 * @property {number} stats.averageOrderValue - Average order value
 * @property {Date} stats.firstPurchaseDate - Date of first purchase
 * @property {number} stats.yearlySpent - Amount spent in current year
 * @property {number} stats.monthlySpent - Amount spent in current month
 * @property {number} stats.returnRate - Return rate percentage
 * @property {string} [notes] - Additional notes about customer
 * @property {string[]} [tags] - Tags for categorization
 * @property {string} [referredBy] - Customer ID who referred this customer
 * @property {number} referralCount - Number of customers referred
 * @property {Date} createdAt - Date customer was created
 * @property {Date} updatedAt - Date customer was last updated
 * @property {string} createdBy - User who created the customer record
 */

/**
 * @typedef {Object} CustomerNote
 * @property {string} id - Note ID
 * @property {string} customerId - Customer ID
 * @property {string} note - Note content
 * @property {string} type - Note type (general, support, sales, complaint)
 * @property {string} createdBy - User who created the note
 * @property {Date} createdAt - Creation date
 */

/**
 * @typedef {Object} CustomerSegment
 * @property {string} id - Segment ID
 * @property {string} name - Segment name
 * @property {string} description - Segment description
 * @property {Object} criteria - Segment criteria
 * @property {string} criteria.type - Criteria type (manual, automatic)
 * @property {Object} criteria.rules - Rules for automatic segments
 * @property {string[]} customerIds - Customer IDs in this segment (for manual)
 * @property {number} customerCount - Count of customers in segment
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last updated date
 * @property {string} createdBy - User who created the segment
 */

/**
 * @typedef {Object} PurchaseHistoryItem
 * @property {string} id - Purchase ID
 * @property {string} customerId - Customer ID
 * @property {Date} date - Purchase date
 * @property {number} amount - Purchase amount
 * @property {number} discount - Discount applied
 * @property {number} total - Total amount
 * @property {string} paymentMethod - Payment method used
 * @property {Array} items - Items purchased
 * @property {string} status - Order status
 * @property {number} loyaltyPointsEarned - Points earned from this purchase
 */

/**
 * @typedef {Object} CreditTransaction
 * @property {string} id - Transaction ID
 * @property {string} customerId - Customer ID
 * @property {string} type - Transaction type (charge, payment, adjustment)
 * @property {number} amount - Transaction amount
 * @property {number} balanceBefore - Balance before transaction
 * @property {number} balanceAfter - Balance after transaction
 * @property {string} description - Transaction description
 * @property {string} paymentMethod - Payment method (for payments)
 * @property {Date} date - Transaction date
 * @property {string} createdBy - User who created the transaction
 */

/**
 * @typedef {Object} StoreCreditTransaction
 * @property {string} id - Transaction ID
 * @property {string} customerId - Customer ID
 * @property {string} type - Transaction type (credit, debit, adjustment)
 * @property {number} amount - Transaction amount
 * @property {number} balanceBefore - Balance before transaction
 * @property {number} balanceAfter - Balance after transaction
 * @property {string} reason - Reason for transaction
 * @property {string} orderId - Related order ID if applicable
 * @property {Date} date - Transaction date
 * @property {string} createdBy - User who created the transaction
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

/**
 * Credit status constants
 * @readonly
 * @enum {string}
 */
export const CREDIT_STATUS = {
  GOOD: 'good',
  WARNING: 'warning',
  OVERDUE: 'overdue',
  SUSPENDED: 'suspended',
};

/**
 * Credit status labels
 * @readonly
 */
export const CREDIT_STATUS_LABELS = {
  [CREDIT_STATUS.GOOD]: 'Good Standing',
  [CREDIT_STATUS.WARNING]: 'Payment Warning',
  [CREDIT_STATUS.OVERDUE]: 'Overdue',
  [CREDIT_STATUS.SUSPENDED]: 'Suspended',
};

/**
 * Note type constants
 * @readonly
 * @enum {string}
 */
export const NOTE_TYPES = {
  GENERAL: 'general',
  SUPPORT: 'support',
  SALES: 'sales',
  COMPLAINT: 'complaint',
  FEEDBACK: 'feedback',
};

/**
 * Note type labels
 * @readonly
 */
export const NOTE_TYPE_LABELS = {
  [NOTE_TYPES.GENERAL]: 'General',
  [NOTE_TYPES.SUPPORT]: 'Support',
  [NOTE_TYPES.SALES]: 'Sales',
  [NOTE_TYPES.COMPLAINT]: 'Complaint',
  [NOTE_TYPES.FEEDBACK]: 'Feedback',
};

/**
 * Contact method constants
 * @readonly
 * @enum {string}
 */
export const CONTACT_METHODS = {
  EMAIL: 'email',
  PHONE: 'phone',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
};

/**
 * Contact method labels
 * @readonly
 */
export const CONTACT_METHOD_LABELS = {
  [CONTACT_METHODS.EMAIL]: 'Email',
  [CONTACT_METHODS.PHONE]: 'Phone',
  [CONTACT_METHODS.SMS]: 'SMS',
  [CONTACT_METHODS.WHATSAPP]: 'WhatsApp',
};

/**
 * Communication frequency constants
 * @readonly
 * @enum {string}
 */
export const COMMUNICATION_FREQUENCY = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  NEVER: 'never',
};

/**
 * Communication frequency labels
 * @readonly
 */
export const COMMUNICATION_FREQUENCY_LABELS = {
  [COMMUNICATION_FREQUENCY.DAILY]: 'Daily',
  [COMMUNICATION_FREQUENCY.WEEKLY]: 'Weekly',
  [COMMUNICATION_FREQUENCY.MONTHLY]: 'Monthly',
  [COMMUNICATION_FREQUENCY.QUARTERLY]: 'Quarterly',
  [COMMUNICATION_FREQUENCY.NEVER]: 'Never',
};

/**
 * Segment criteria type constants
 * @readonly
 * @enum {string}
 */
export const SEGMENT_CRITERIA_TYPES = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic',
};

/**
 * Transaction type constants
 * @readonly
 * @enum {string}
 */
export const CREDIT_TRANSACTION_TYPES = {
  CHARGE: 'charge',
  PAYMENT: 'payment',
  ADJUSTMENT: 'adjustment',
  REFUND: 'refund',
};

/**
 * Store credit transaction type constants
 * @readonly
 * @enum {string}
 */
export const STORE_CREDIT_TRANSACTION_TYPES = {
  CREDIT: 'credit',
  DEBIT: 'debit',
  ADJUSTMENT: 'adjustment',
  EXPIRY: 'expiry',
};

/**
 * Language constants
 * @readonly
 * @enum {string}
 */
export const LANGUAGES = {
  ENGLISH: 'en',
  SPANISH: 'es',
  FRENCH: 'fr',
  GERMAN: 'de',
  CHINESE: 'zh',
  HINDI: 'hi',
};

/**
 * Language labels
 * @readonly
 */
export const LANGUAGE_LABELS = {
  [LANGUAGES.ENGLISH]: 'English',
  [LANGUAGES.SPANISH]: 'Spanish',
  [LANGUAGES.FRENCH]: 'French',
  [LANGUAGES.GERMAN]: 'German',
  [LANGUAGES.CHINESE]: 'Chinese',
  [LANGUAGES.HINDI]: 'Hindi',
};

/**
 * Loyalty tier thresholds (points required)
 * @readonly
 */
export const LOYALTY_TIER_THRESHOLDS = {
  [LOYALTY_TIERS.BRONZE]: 0,
  [LOYALTY_TIERS.SILVER]: 1000,
  [LOYALTY_TIERS.GOLD]: 5000,
  [LOYALTY_TIERS.PLATINUM]: 10000,
};

/**
 * Loyalty tier benefits
 * @readonly
 */
export const LOYALTY_TIER_BENEFITS = {
  [LOYALTY_TIERS.BRONZE]: {
    pointsMultiplier: 1,
    discountPercentage: 0,
    benefits: ['Earn 1 point per $1 spent'],
  },
  [LOYALTY_TIERS.SILVER]: {
    pointsMultiplier: 1.25,
    discountPercentage: 5,
    benefits: ['Earn 1.25 points per $1 spent', '5% discount on all purchases', 'Priority support'],
  },
  [LOYALTY_TIERS.GOLD]: {
    pointsMultiplier: 1.5,
    discountPercentage: 10,
    benefits: ['Earn 1.5 points per $1 spent', '10% discount on all purchases', 'Priority support', 'Free shipping'],
  },
  [LOYALTY_TIERS.PLATINUM]: {
    pointsMultiplier: 2,
    discountPercentage: 15,
    benefits: ['Earn 2 points per $1 spent', '15% discount on all purchases', 'VIP support', 'Free shipping', 'Exclusive access to new products'],
  },
};
