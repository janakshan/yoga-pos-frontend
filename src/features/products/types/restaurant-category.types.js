/**
 * Restaurant Category Types
 * JSDoc type definitions for restaurant menu categories and organization
 */

/**
 * @typedef {'appetizer'|'soup'|'salad'|'main_course'|'side_dish'|'dessert'|'beverage'|'alcoholic_beverage'|'coffee_tea'|'breakfast'|'lunch'|'dinner'|'snack'|'special'} RestaurantCategoryType
 * Types of restaurant menu categories
 */

/**
 * @typedef {'breakfast'|'brunch'|'lunch'|'dinner'|'all_day'} MealPeriod
 * Meal periods for menu availability
 */

/**
 * @typedef {'monday'|'tuesday'|'wednesday'|'thursday'|'friday'|'saturday'|'sunday'} DayOfWeek
 * Days of the week
 */

/**
 * @typedef {'active'|'inactive'|'seasonal'} CategoryStatus
 * Restaurant category status
 */

/**
 * @typedef {Object} TimeRange
 * Time range for availability
 * @property {string} start - Start time in HH:mm format (e.g., "08:00")
 * @property {string} end - End time in HH:mm format (e.g., "22:00")
 */

/**
 * @typedef {Object} AvailabilitySchedule
 * Schedule defining when items are available
 * @property {DayOfWeek[]} daysOfWeek - Days when available
 * @property {TimeRange[]} timeRanges - Time ranges when available
 * @property {MealPeriod[]} mealPeriods - Meal periods when available
 * @property {Date|string} [startDate] - Start date for seasonal items
 * @property {Date|string} [endDate] - End date for seasonal items
 */

/**
 * @typedef {Object} RestaurantCategory
 * Restaurant menu category
 * @property {string} id - Unique category identifier
 * @property {string} name - Category name (e.g., "Appetizers", "Main Courses")
 * @property {string} [description] - Category description
 * @property {RestaurantCategoryType} type - Category type
 * @property {string} [parentCategoryId] - Parent category ID for subcategories
 * @property {number} displayOrder - Order in which to display
 * @property {CategoryStatus} status - Category status
 * @property {string} [imageUrl] - Category image
 * @property {string} [icon] - Icon name or emoji
 * @property {string} color - Color code for category (hex)
 * @property {AvailabilitySchedule} [availability] - When this category is available
 * @property {boolean} showInMenu - Whether to show in customer menu
 * @property {boolean} showInPOS - Whether to show in POS
 * @property {boolean} showInKDS - Whether to show in Kitchen Display System
 * @property {string} [kdsStation] - Preferred kitchen station for items in this category
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} MenuAvailabilityRule
 * Rules for when menu items are available
 * @property {string} id - Rule identifier
 * @property {string} name - Rule name
 * @property {string} [description] - Rule description
 * @property {AvailabilitySchedule} schedule - Availability schedule
 * @property {boolean} isActive - Whether rule is active
 * @property {string[]} productIds - Products this rule applies to
 * @property {string[]} categoryIds - Categories this rule applies to
 * @property {number} [priority] - Priority when multiple rules apply
 */

/**
 * @typedef {Object} CreateRestaurantCategoryInput
 * Input for creating a restaurant category
 * @property {string} name - Category name
 * @property {string} [description] - Description
 * @property {RestaurantCategoryType} type - Category type
 * @property {string} [parentCategoryId] - Parent category ID
 * @property {number} displayOrder - Display order
 * @property {CategoryStatus} status - Status
 * @property {string} [imageUrl] - Image URL
 * @property {string} [icon] - Icon
 * @property {string} color - Color code
 * @property {AvailabilitySchedule} [availability] - Availability schedule
 * @property {boolean} showInMenu - Show in menu
 * @property {boolean} showInPOS - Show in POS
 * @property {boolean} showInKDS - Show in KDS
 * @property {string} [kdsStation] - KDS station
 */

/**
 * @typedef {Object} UpdateRestaurantCategoryInput
 * Input for updating a restaurant category
 * @property {string} [name] - Category name
 * @property {string} [description] - Description
 * @property {RestaurantCategoryType} [type] - Category type
 * @property {string} [parentCategoryId] - Parent category ID
 * @property {number} [displayOrder] - Display order
 * @property {CategoryStatus} [status] - Status
 * @property {string} [imageUrl] - Image URL
 * @property {string} [icon] - Icon
 * @property {string} [color] - Color code
 * @property {AvailabilitySchedule} [availability] - Availability schedule
 * @property {boolean} [showInMenu] - Show in menu
 * @property {boolean} [showInPOS] - Show in POS
 * @property {boolean} [showInKDS] - Show in KDS
 * @property {string} [kdsStation] - KDS station
 */

// Constants
export const RESTAURANT_CATEGORY_TYPES = {
  APPETIZER: 'appetizer',
  SOUP: 'soup',
  SALAD: 'salad',
  MAIN_COURSE: 'main_course',
  SIDE_DISH: 'side_dish',
  DESSERT: 'dessert',
  BEVERAGE: 'beverage',
  ALCOHOLIC_BEVERAGE: 'alcoholic_beverage',
  COFFEE_TEA: 'coffee_tea',
  BREAKFAST: 'breakfast',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  SNACK: 'snack',
  SPECIAL: 'special'
};

export const MEAL_PERIODS = {
  BREAKFAST: 'breakfast',
  BRUNCH: 'brunch',
  LUNCH: 'lunch',
  DINNER: 'dinner',
  ALL_DAY: 'all_day'
};

export const DAYS_OF_WEEK = {
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
  SUNDAY: 'sunday'
};

export const CATEGORY_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SEASONAL: 'seasonal'
};

export const RESTAURANT_CATEGORY_LABELS = {
  appetizer: 'Appetizers',
  soup: 'Soups',
  salad: 'Salads',
  main_course: 'Main Courses',
  side_dish: 'Side Dishes',
  dessert: 'Desserts',
  beverage: 'Beverages',
  alcoholic_beverage: 'Alcoholic Beverages',
  coffee_tea: 'Coffee & Tea',
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snacks',
  special: 'Specials'
};

export const MEAL_PERIOD_LABELS = {
  breakfast: 'Breakfast',
  brunch: 'Brunch',
  lunch: 'Lunch',
  dinner: 'Dinner',
  all_day: 'All Day'
};

export const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday'
};

export const CATEGORY_STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  seasonal: 'Seasonal'
};

// Default meal period times
export const DEFAULT_MEAL_TIMES = {
  breakfast: { start: '06:00', end: '11:00' },
  brunch: { start: '09:00', end: '14:00' },
  lunch: { start: '11:00', end: '15:00' },
  dinner: { start: '17:00', end: '22:00' },
  all_day: { start: '00:00', end: '23:59' }
};

// Common category colors
export const CATEGORY_COLORS = {
  appetizer: '#10B981',
  soup: '#F59E0B',
  salad: '#22C55E',
  main_course: '#EF4444',
  side_dish: '#8B5CF6',
  dessert: '#EC4899',
  beverage: '#3B82F6',
  alcoholic_beverage: '#DC2626',
  coffee_tea: '#78350F',
  breakfast: '#FBBF24',
  lunch: '#14B8A6',
  dinner: '#6366F1',
  snack: '#A855F7',
  special: '#F97316'
};

// KDS Stations
export const KDS_STATIONS = {
  HOT_KITCHEN: 'hot_kitchen',
  COLD_KITCHEN: 'cold_kitchen',
  GRILL: 'grill',
  BAR: 'bar',
  DESSERT: 'dessert',
  PREP: 'prep'
};

export const KDS_STATION_LABELS = {
  hot_kitchen: 'Hot Kitchen',
  cold_kitchen: 'Cold Kitchen',
  grill: 'Grill',
  bar: 'Bar',
  dessert: 'Dessert Station',
  prep: 'Prep Station'
};

// Default restaurant categories template
export const DEFAULT_RESTAURANT_CATEGORIES = [
  {
    name: 'Appetizers',
    type: 'appetizer',
    displayOrder: 1,
    status: 'active',
    color: CATEGORY_COLORS.appetizer,
    icon: '🥟',
    showInMenu: true,
    showInPOS: true,
    showInKDS: true,
    kdsStation: 'hot_kitchen'
  },
  {
    name: 'Soups',
    type: 'soup',
    displayOrder: 2,
    status: 'active',
    color: CATEGORY_COLORS.soup,
    icon: '🍲',
    showInMenu: true,
    showInPOS: true,
    showInKDS: true,
    kdsStation: 'hot_kitchen'
  },
  {
    name: 'Salads',
    type: 'salad',
    displayOrder: 3,
    status: 'active',
    color: CATEGORY_COLORS.salad,
    icon: '🥗',
    showInMenu: true,
    showInPOS: true,
    showInKDS: true,
    kdsStation: 'cold_kitchen'
  },
  {
    name: 'Main Courses',
    type: 'main_course',
    displayOrder: 4,
    status: 'active',
    color: CATEGORY_COLORS.main_course,
    icon: '🍽️',
    showInMenu: true,
    showInPOS: true,
    showInKDS: true,
    kdsStation: 'hot_kitchen'
  },
  {
    name: 'Side Dishes',
    type: 'side_dish',
    displayOrder: 5,
    status: 'active',
    color: CATEGORY_COLORS.side_dish,
    icon: '🍟',
    showInMenu: true,
    showInPOS: true,
    showInKDS: true,
    kdsStation: 'hot_kitchen'
  },
  {
    name: 'Desserts',
    type: 'dessert',
    displayOrder: 6,
    status: 'active',
    color: CATEGORY_COLORS.dessert,
    icon: '🍰',
    showInMenu: true,
    showInPOS: true,
    showInKDS: true,
    kdsStation: 'dessert'
  },
  {
    name: 'Beverages',
    type: 'beverage',
    displayOrder: 7,
    status: 'active',
    color: CATEGORY_COLORS.beverage,
    icon: '🥤',
    showInMenu: true,
    showInPOS: true,
    showInKDS: true,
    kdsStation: 'bar'
  },
  {
    name: 'Coffee & Tea',
    type: 'coffee_tea',
    displayOrder: 8,
    status: 'active',
    color: CATEGORY_COLORS.coffee_tea,
    icon: '☕',
    showInMenu: true,
    showInPOS: true,
    showInKDS: true,
    kdsStation: 'bar'
  }
];
