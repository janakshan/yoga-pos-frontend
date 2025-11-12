/**
 * Recipe Management Type Definitions
 * Defines types for recipes, ingredients, and related entities
 */

/**
 * Recipe Ingredient
 * Represents an ingredient used in a recipe with quantity and cost information
 */
export const RecipeIngredient = {
  id: '',                          // Unique identifier
  recipeId: '',                    // Parent recipe ID
  inventoryItemId: '',             // Reference to inventory/product item
  inventoryItemName: '',           // Name of the ingredient
  inventoryItemSku: '',            // SKU of the ingredient
  quantity: 0,                     // Quantity needed
  unit: '',                        // Unit of measurement (kg, g, l, ml, pcs, etc.)
  unitCost: 0,                     // Cost per unit
  totalCost: 0,                    // Calculated: quantity * unitCost
  notes: '',                       // Special notes for this ingredient
  isOptional: false,               // Whether ingredient is optional
  substituteIngredients: [],       // Array of substitute ingredient IDs
  createdAt: null,                 // Timestamp
  updatedAt: null                  // Timestamp
};

/**
 * Recipe Category
 * Categories for organizing recipes
 */
export const RecipeCategory = {
  APPETIZER: 'appetizer',
  MAIN_COURSE: 'main_course',
  DESSERT: 'dessert',
  BEVERAGE: 'beverage',
  SIDE_DISH: 'side_dish',
  SAUCE: 'sauce',
  SALAD: 'salad',
  SOUP: 'soup',
  BREAKFAST: 'breakfast',
  SNACK: 'snack',
  OTHER: 'other'
};

/**
 * Recipe Difficulty Level
 */
export const RecipeDifficulty = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert'
};

/**
 * Recipe Status
 */
export const RecipeStatus = {
  DRAFT: 'draft',              // Recipe being created/edited
  ACTIVE: 'active',            // Recipe in use
  INACTIVE: 'inactive',        // Recipe not currently used
  ARCHIVED: 'archived'         // Recipe archived/deprecated
};

/**
 * Recipe Yield Unit
 */
export const RecipeYieldUnit = {
  SERVINGS: 'servings',
  PORTIONS: 'portions',
  PIECES: 'pieces',
  LITERS: 'liters',
  KILOGRAMS: 'kilograms',
  GRAMS: 'grams',
  MILLILITERS: 'milliliters',
  UNITS: 'units'
};

/**
 * Recipe
 * Main recipe entity with ingredients, costs, and preparation details
 */
export const Recipe = {
  // Basic Information
  id: '',                          // Unique identifier
  name: '',                        // Recipe name
  description: '',                 // Recipe description
  category: RecipeCategory.OTHER,  // Recipe category
  status: RecipeStatus.DRAFT,      // Current status

  // Ingredients
  ingredients: [],                 // Array of RecipeIngredient objects

  // Yield & Portions
  yieldQuantity: 1,                // How many portions/servings this recipe makes
  yieldUnit: RecipeYieldUnit.SERVINGS, // Unit of yield
  portionSize: '',                 // Description of portion size (e.g., "250ml", "1 plate")

  // Time Tracking
  prepTime: 0,                     // Preparation time in minutes
  cookTime: 0,                     // Cooking time in minutes
  totalTime: 0,                    // Calculated: prepTime + cookTime
  restTime: 0,                     // Resting/cooling time in minutes (optional)

  // Cost Calculation
  totalIngredientCost: 0,          // Sum of all ingredient costs
  costPerPortion: 0,               // Calculated: totalIngredientCost / yieldQuantity
  laborCost: 0,                    // Labor cost (optional)
  overheadCost: 0,                 // Overhead cost (optional)
  totalCost: 0,                    // Calculated: totalIngredientCost + laborCost + overheadCost

  // Pricing
  suggestedSellingPrice: 0,        // Suggested price per portion
  targetCostPercentage: 30,        // Target food cost % (default 30%)

  // Instructions
  instructions: [],                // Array of step-by-step instructions
  preparationNotes: '',            // General preparation notes
  cookingTips: '',                 // Tips for cooking

  // Additional Information
  difficulty: RecipeDifficulty.MEDIUM, // Recipe difficulty level
  cuisine: '',                     // Cuisine type (Italian, Chinese, etc.)
  dietaryInfo: {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
    halal: false,
    kosher: false,
    allergens: []                  // Array of allergen strings
  },

  // Nutritional Information (per portion)
  nutritionalInfo: {
    calories: 0,
    protein: 0,                    // in grams
    carbohydrates: 0,              // in grams
    fat: 0,                        // in grams
    fiber: 0,                      // in grams
    sugar: 0,                      // in grams
    sodium: 0                      // in mg
  },

  // Kitchen & Equipment
  kdsStation: '',                  // Kitchen station (hot_kitchen, cold_kitchen, etc.)
  equipmentRequired: [],           // Array of equipment needed
  storageInstructions: '',         // How to store prepared recipe
  shelfLife: 0,                    // Shelf life in hours after preparation

  // Media
  imageUrl: '',                    // Main recipe image
  imageUrls: [],                   // Additional images
  videoUrl: '',                    // Video tutorial URL (optional)

  // Links & References
  linkedMenuItems: [],             // Array of menu item IDs that use this recipe
  linkedProducts: [],              // Array of product IDs that use this recipe
  parentRecipeId: null,            // For recipe variations
  variations: [],                  // Array of variation recipe IDs

  // Metadata
  tags: [],                        // Array of tags for searching/filtering
  isPublished: false,              // Whether recipe is published/visible
  isFeatured: false,               // Featured recipe
  version: 1,                      // Recipe version number
  notes: '',                       // Internal notes

  // Audit
  createdBy: '',                   // User ID who created
  updatedBy: '',                   // User ID who last updated
  createdAt: null,                 // Timestamp
  updatedAt: null,                 // Timestamp

  // Business Context
  branchId: '',                    // Branch this recipe belongs to
  businessMode: 'RESTAURANT'       // YOGA | RESTAURANT
};

/**
 * Recipe Instruction Step
 */
export const RecipeInstructionStep = {
  stepNumber: 1,                   // Order of step
  instruction: '',                 // Instruction text
  duration: 0,                     // Duration for this step in minutes (optional)
  imageUrl: '',                    // Image for this step (optional)
  tips: ''                         // Tips for this step (optional)
};

/**
 * Recipe Filter Options
 */
export const RecipeFilterOptions = {
  category: '',                    // Filter by category
  status: '',                      // Filter by status
  difficulty: '',                  // Filter by difficulty
  cuisine: '',                     // Filter by cuisine
  maxPrepTime: null,               // Max prep time in minutes
  maxCookTime: null,               // Max cook time in minutes
  dietary: {                       // Dietary filters
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false
  },
  linkedToMenuItem: false,         // Show only recipes linked to menu items
  linkedToProduct: false,          // Show only recipes linked to products
  search: ''                       // Search term
};

/**
 * Recipe Costing Summary
 * For reporting and analytics
 */
export const RecipeCostingSummary = {
  recipeId: '',
  recipeName: '',
  category: '',
  yieldQuantity: 0,
  yieldUnit: '',
  totalIngredientCost: 0,
  costPerPortion: 0,
  laborCost: 0,
  overheadCost: 0,
  totalCost: 0,
  suggestedSellingPrice: 0,
  actualSellingPrice: 0,           // If linked to menu item
  costPercentage: 0,               // (totalCost / actualSellingPrice) * 100
  profitMargin: 0,                 // actualSellingPrice - totalCost
  profitMarginPercentage: 0,       // (profitMargin / actualSellingPrice) * 100
  linkedMenuItemsCount: 0,
  status: ''
};

/**
 * Batch Recipe Calculation
 * For calculating ingredient quantities for multiple portions
 */
export const BatchRecipeCalculation = {
  recipeId: '',
  recipeName: '',
  originalYieldQuantity: 0,
  desiredYieldQuantity: 0,
  multiplier: 0,                   // desiredYieldQuantity / originalYieldQuantity
  adjustedIngredients: [],         // Array of ingredients with adjusted quantities
  adjustedTotalCost: 0,
  adjustedCostPerPortion: 0
};

/**
 * Recipe Analytics
 */
export const RecipeAnalytics = {
  totalRecipes: 0,
  recipesByCategory: {},           // { category: count }
  recipesByStatus: {},             // { status: count }
  averageCostPerPortion: 0,
  averagePrepTime: 0,
  averageCookTime: 0,
  totalRecipeValue: 0,             // Sum of all recipe costs
  mostExpensiveRecipes: [],        // Top 10
  leastExpensiveRecipes: [],       // Top 10
  mostUsedIngredients: [],         // Ingredients used most across recipes
  recipesNeedingUpdate: []         // Recipes with outdated costs
};

export default {
  Recipe,
  RecipeIngredient,
  RecipeCategory,
  RecipeDifficulty,
  RecipeStatus,
  RecipeYieldUnit,
  RecipeInstructionStep,
  RecipeFilterOptions,
  RecipeCostingSummary,
  BatchRecipeCalculation,
  RecipeAnalytics
};
