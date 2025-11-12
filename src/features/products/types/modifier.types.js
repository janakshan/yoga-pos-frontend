/**
 * Modifier Types
 * JSDoc type definitions for menu modifiers and customization options
 */

/**
 * @typedef {'single'|'multiple'} ModifierSelectionType
 * Type of modifier selection allowed
 * - single: Only one option can be selected (e.g., cooking temperature)
 * - multiple: Multiple options can be selected (e.g., toppings)
 */

/**
 * @typedef {'active'|'inactive'} ModifierStatus
 * Modifier availability status
 */

/**
 * @typedef {Object} ModifierOption
 * Individual modifier option that can be selected
 * @property {string} id - Unique option identifier
 * @property {string} name - Option name (e.g., "Extra Cheese", "No Onions")
 * @property {number} price - Additional price for this option (can be 0 for free options)
 * @property {number} [cost] - Cost price for this option
 * @property {boolean} isDefault - Whether this option is selected by default
 * @property {boolean} isAvailable - Whether this option is currently available
 * @property {number} [displayOrder] - Order in which to display this option
 * @property {string} [description] - Description of the option
 * @property {string} [imageUrl] - Optional image for the option
 * @property {number} [calories] - Calorie count for nutritional info
 * @property {string[]} [allergens] - List of allergens (e.g., ["dairy", "gluten"])
 * @property {number} [preparationTime] - Additional prep time in minutes
 */

/**
 * @typedef {Object} ModifierGroup
 * Group of related modifier options
 * @property {string} id - Unique group identifier
 * @property {string} name - Group name (e.g., "Size", "Add-ons", "Temperature")
 * @property {string} [description] - Group description
 * @property {ModifierSelectionType} selectionType - Single or multiple selection
 * @property {boolean} required - Whether customer must select at least one option
 * @property {number} minSelections - Minimum number of options to select (0 if not required)
 * @property {number} maxSelections - Maximum number of options to select (1 for single, unlimited for multiple)
 * @property {ModifierOption[]} options - Available options in this group
 * @property {ModifierStatus} status - Group status
 * @property {number} displayOrder - Order in which to display this group
 * @property {boolean} [showInKDS] - Whether to display in Kitchen Display System
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} SelectedModifier
 * Modifier option selected by customer for an order item
 * @property {string} modifierGroupId - ID of the modifier group
 * @property {string} modifierGroupName - Name of the modifier group
 * @property {string} optionId - ID of the selected option
 * @property {string} optionName - Name of the selected option
 * @property {number} price - Price of the selected option
 * @property {number} quantity - Quantity of this modifier (for multiple selections)
 */

/**
 * @typedef {Object} CreateModifierGroupInput
 * Input for creating a new modifier group
 * @property {string} name - Group name
 * @property {string} [description] - Group description
 * @property {ModifierSelectionType} selectionType - Selection type
 * @property {boolean} required - Whether selection is required
 * @property {number} minSelections - Minimum selections
 * @property {number} maxSelections - Maximum selections
 * @property {ModifierOption[]} options - Initial options
 * @property {ModifierStatus} status - Group status
 * @property {number} [displayOrder] - Display order
 * @property {boolean} [showInKDS] - Show in KDS
 */

/**
 * @typedef {Object} UpdateModifierGroupInput
 * Input for updating an existing modifier group
 * @property {string} [name] - Group name
 * @property {string} [description] - Group description
 * @property {ModifierSelectionType} [selectionType] - Selection type
 * @property {boolean} [required] - Whether selection is required
 * @property {number} [minSelections] - Minimum selections
 * @property {number} [maxSelections] - Maximum selections
 * @property {ModifierOption[]} [options] - Updated options
 * @property {ModifierStatus} [status] - Group status
 * @property {number} [displayOrder] - Display order
 * @property {boolean} [showInKDS] - Show in KDS
 */

/**
 * @typedef {Object} CreateModifierOptionInput
 * Input for creating a new modifier option
 * @property {string} name - Option name
 * @property {number} price - Additional price
 * @property {number} [cost] - Cost price
 * @property {boolean} isDefault - Is default selection
 * @property {boolean} isAvailable - Is available
 * @property {number} [displayOrder] - Display order
 * @property {string} [description] - Option description
 * @property {string} [imageUrl] - Option image URL
 * @property {number} [calories] - Calorie count
 * @property {string[]} [allergens] - Allergen list
 * @property {number} [preparationTime] - Prep time in minutes
 */

/**
 * @typedef {Object} ModifierGroupStats
 * Statistics about modifier group usage
 * @property {string} modifierGroupId - Group ID
 * @property {string} modifierGroupName - Group name
 * @property {number} totalSelections - Total number of times selected
 * @property {number} revenue - Total revenue generated
 * @property {Object.<string, number>} optionSelections - Selections per option ID
 * @property {Date|string} lastUsed - Last time this group was used
 */

// Constants
export const MODIFIER_SELECTION_TYPES = {
  SINGLE: 'single',
  MULTIPLE: 'multiple'
};

export const MODIFIER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

export const SELECTION_TYPE_LABELS = {
  single: 'Single Selection',
  multiple: 'Multiple Selection'
};

export const MODIFIER_STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive'
};

// Common modifier groups templates
export const COMMON_MODIFIER_GROUPS = {
  SIZE: {
    name: 'Size',
    selectionType: 'single',
    required: true,
    minSelections: 1,
    maxSelections: 1,
    options: [
      { name: 'Small', price: 0, isDefault: false, isAvailable: true },
      { name: 'Medium', price: 2, isDefault: true, isAvailable: true },
      { name: 'Large', price: 4, isDefault: false, isAvailable: true },
      { name: 'Extra Large', price: 6, isDefault: false, isAvailable: true }
    ]
  },
  TEMPERATURE: {
    name: 'Temperature',
    selectionType: 'single',
    required: true,
    minSelections: 1,
    maxSelections: 1,
    options: [
      { name: 'Rare', price: 0, isDefault: false, isAvailable: true },
      { name: 'Medium Rare', price: 0, isDefault: false, isAvailable: true },
      { name: 'Medium', price: 0, isDefault: true, isAvailable: true },
      { name: 'Medium Well', price: 0, isDefault: false, isAvailable: true },
      { name: 'Well Done', price: 0, isDefault: false, isAvailable: true }
    ]
  },
  EXTRAS: {
    name: 'Extras',
    selectionType: 'multiple',
    required: false,
    minSelections: 0,
    maxSelections: 10,
    options: [
      { name: 'Extra Cheese', price: 2, isDefault: false, isAvailable: true },
      { name: 'Bacon', price: 3, isDefault: false, isAvailable: true },
      { name: 'Avocado', price: 2.5, isDefault: false, isAvailable: true },
      { name: 'Extra Sauce', price: 1, isDefault: false, isAvailable: true }
    ]
  },
  SPICE_LEVEL: {
    name: 'Spice Level',
    selectionType: 'single',
    required: false,
    minSelections: 0,
    maxSelections: 1,
    options: [
      { name: 'Mild', price: 0, isDefault: true, isAvailable: true },
      { name: 'Medium', price: 0, isDefault: false, isAvailable: true },
      { name: 'Hot', price: 0, isDefault: false, isAvailable: true },
      { name: 'Extra Hot', price: 0, isDefault: false, isAvailable: true }
    ]
  },
  CUSTOMIZATION: {
    name: 'Customization',
    selectionType: 'multiple',
    required: false,
    minSelections: 0,
    maxSelections: 5,
    options: [
      { name: 'No Onions', price: 0, isDefault: false, isAvailable: true },
      { name: 'No Tomatoes', price: 0, isDefault: false, isAvailable: true },
      { name: 'No Lettuce', price: 0, isDefault: false, isAvailable: true },
      { name: 'Extra Sauce', price: 1, isDefault: false, isAvailable: true },
      { name: 'Light Sauce', price: 0, isDefault: false, isAvailable: true }
    ]
  }
};

// Common allergens list
export const COMMON_ALLERGENS = [
  'dairy',
  'eggs',
  'fish',
  'shellfish',
  'tree_nuts',
  'peanuts',
  'wheat',
  'gluten',
  'soy',
  'sesame'
];

export const ALLERGEN_LABELS = {
  dairy: 'Dairy',
  eggs: 'Eggs',
  fish: 'Fish',
  shellfish: 'Shellfish',
  tree_nuts: 'Tree Nuts',
  peanuts: 'Peanuts',
  wheat: 'Wheat',
  gluten: 'Gluten',
  soy: 'Soy',
  sesame: 'Sesame'
};
