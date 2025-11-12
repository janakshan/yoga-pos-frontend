/**
 * Recipe Service
 * Handles all API calls and business logic for recipes and ingredients
 */

import { generateId } from '../../../utils/generateId';
import { Recipe, RecipeIngredient, RecipeStatus, RecipeCategory, RecipeDifficulty, RecipeYieldUnit } from '../types/recipe.types';

const STORAGE_KEY = 'recipes';

/**
 * Get all recipes
 * @param {Object} filters - Filter options
 * @returns {Promise<Object[]>}
 */
export const getRecipes = async (filters = {}) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let recipes = stored ? JSON.parse(stored) : generateMockRecipes();

    // Apply filters
    if (filters.category) {
      recipes = recipes.filter(r => r.category === filters.category);
    }
    if (filters.status) {
      recipes = recipes.filter(r => r.status === filters.status);
    }
    if (filters.difficulty) {
      recipes = recipes.filter(r => r.difficulty === filters.difficulty);
    }
    if (filters.cuisine) {
      recipes = recipes.filter(r => r.cuisine?.toLowerCase().includes(filters.cuisine.toLowerCase()));
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      recipes = recipes.filter(r =>
        r.name.toLowerCase().includes(searchLower) ||
        r.description?.toLowerCase().includes(searchLower) ||
        r.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    if (filters.linkedToMenuItem) {
      recipes = recipes.filter(r => r.linkedMenuItems?.length > 0);
    }
    if (filters.linkedToProduct) {
      recipes = recipes.filter(r => r.linkedProducts?.length > 0);
    }

    return recipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
};

/**
 * Get a single recipe by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export const getRecipeById = async (id) => {
  try {
    const recipes = await getRecipes();
    return recipes.find(recipe => recipe.id === id) || null;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
};

/**
 * Create a new recipe
 * @param {Object} recipeData
 * @returns {Promise<Object>}
 */
export const createRecipe = async (recipeData) => {
  try {
    const recipes = await getRecipes();

    const newRecipe = {
      ...Recipe,
      ...recipeData,
      id: generateId('recipe'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    // Calculate costs if ingredients provided
    if (newRecipe.ingredients?.length > 0) {
      calculateRecipeCosts(newRecipe);
    }

    recipes.push(newRecipe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));

    return newRecipe;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

/**
 * Update an existing recipe
 * @param {string} id
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateRecipe = async (id, updates) => {
  try {
    const recipes = await getRecipes();
    const index = recipes.findIndex(recipe => recipe.id === id);

    if (index === -1) {
      throw new Error(`Recipe with ID ${id} not found`);
    }

    const updatedRecipe = {
      ...recipes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      version: recipes[index].version + 1,
    };

    // Recalculate costs if ingredients changed
    if (updates.ingredients) {
      calculateRecipeCosts(updatedRecipe);
    }

    recipes[index] = updatedRecipe;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));

    return updatedRecipe;
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
};

/**
 * Delete a recipe
 * @param {string} id
 * @returns {Promise<void>}
 */
export const deleteRecipe = async (id) => {
  try {
    const recipes = await getRecipes();
    const filteredRecipes = recipes.filter(recipe => recipe.id !== id);

    if (filteredRecipes.length === recipes.length) {
      throw new Error(`Recipe with ID ${id} not found`);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecipes));
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};

/**
 * Duplicate a recipe
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const duplicateRecipe = async (id) => {
  try {
    const recipe = await getRecipeById(id);
    if (!recipe) {
      throw new Error(`Recipe with ID ${id} not found`);
    }

    const duplicatedRecipe = {
      ...recipe,
      id: generateId('recipe'),
      name: `${recipe.name} (Copy)`,
      status: RecipeStatus.DRAFT,
      linkedMenuItems: [],
      linkedProducts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    };

    const recipes = await getRecipes();
    recipes.push(duplicatedRecipe);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));

    return duplicatedRecipe;
  } catch (error) {
    console.error('Error duplicating recipe:', error);
    throw error;
  }
};

/**
 * Update recipe status
 * @param {string} id
 * @param {string} status
 * @returns {Promise<Object>}
 */
export const updateRecipeStatus = async (id, status) => {
  return updateRecipe(id, { status });
};

/**
 * Add ingredient to recipe
 * @param {string} recipeId
 * @param {Object} ingredient
 * @returns {Promise<Object>}
 */
export const addIngredient = async (recipeId, ingredient) => {
  try {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
      throw new Error(`Recipe with ID ${recipeId} not found`);
    }

    const newIngredient = {
      ...RecipeIngredient,
      ...ingredient,
      id: generateId('recipe_ingredient'),
      recipeId,
      totalCost: (ingredient.quantity || 0) * (ingredient.unitCost || 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const ingredients = [...(recipe.ingredients || []), newIngredient];
    return updateRecipe(recipeId, { ingredients });
  } catch (error) {
    console.error('Error adding ingredient:', error);
    throw error;
  }
};

/**
 * Update ingredient in recipe
 * @param {string} recipeId
 * @param {string} ingredientId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
export const updateIngredient = async (recipeId, ingredientId, updates) => {
  try {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
      throw new Error(`Recipe with ID ${recipeId} not found`);
    }

    const ingredients = recipe.ingredients.map(ing => {
      if (ing.id === ingredientId) {
        const updated = { ...ing, ...updates, updatedAt: new Date().toISOString() };
        updated.totalCost = (updated.quantity || 0) * (updated.unitCost || 0);
        return updated;
      }
      return ing;
    });

    return updateRecipe(recipeId, { ingredients });
  } catch (error) {
    console.error('Error updating ingredient:', error);
    throw error;
  }
};

/**
 * Remove ingredient from recipe
 * @param {string} recipeId
 * @param {string} ingredientId
 * @returns {Promise<Object>}
 */
export const removeIngredient = async (recipeId, ingredientId) => {
  try {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
      throw new Error(`Recipe with ID ${recipeId} not found`);
    }

    const ingredients = recipe.ingredients.filter(ing => ing.id !== ingredientId);
    return updateRecipe(recipeId, { ingredients });
  } catch (error) {
    console.error('Error removing ingredient:', error);
    throw error;
  }
};

/**
 * Calculate recipe costs
 * @param {Object} recipe
 * @returns {Object} Cost data
 */
const calculateRecipeCosts = (recipe) => {
  const totalIngredientCost = recipe.ingredients.reduce((sum, ing) => sum + (ing.totalCost || 0), 0);
  const totalCost = totalIngredientCost + (recipe.laborCost || 0) + (recipe.overheadCost || 0);
  const costPerPortion = recipe.yieldQuantity > 0 ? totalCost / recipe.yieldQuantity : 0;

  // Update recipe object
  recipe.totalIngredientCost = totalIngredientCost;
  recipe.totalCost = totalCost;
  recipe.costPerPortion = costPerPortion;
  recipe.totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0);

  // Calculate suggested selling price based on target cost percentage
  if (recipe.targetCostPercentage > 0) {
    recipe.suggestedSellingPrice = costPerPortion / (recipe.targetCostPercentage / 100);
  }

  return {
    totalIngredientCost,
    totalCost,
    costPerPortion,
    totalTime: recipe.totalTime,
    suggestedSellingPrice: recipe.suggestedSellingPrice,
  };
};

/**
 * Calculate recipe cost
 * @param {string} recipeId
 * @returns {Promise<Object>}
 */
export const calculateRecipeCost = async (recipeId) => {
  try {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
      throw new Error(`Recipe with ID ${recipeId} not found`);
    }

    const costData = calculateRecipeCosts(recipe);
    await updateRecipe(recipeId, costData);

    return costData;
  } catch (error) {
    console.error('Error calculating recipe cost:', error);
    throw error;
  }
};

/**
 * Calculate batch recipe
 * @param {string} recipeId
 * @param {number} desiredYieldQuantity
 * @returns {Promise<Object>}
 */
export const calculateBatchRecipe = async (recipeId, desiredYieldQuantity) => {
  try {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
      throw new Error(`Recipe with ID ${recipeId} not found`);
    }

    const multiplier = desiredYieldQuantity / recipe.yieldQuantity;

    const adjustedIngredients = recipe.ingredients.map(ing => ({
      ...ing,
      quantity: ing.quantity * multiplier,
      totalCost: ing.totalCost * multiplier,
    }));

    const adjustedTotalCost = recipe.totalCost * multiplier;
    const adjustedCostPerPortion = recipe.costPerPortion;

    return {
      recipeId: recipe.id,
      recipeName: recipe.name,
      originalYieldQuantity: recipe.yieldQuantity,
      desiredYieldQuantity,
      multiplier,
      adjustedIngredients,
      adjustedTotalCost,
      adjustedCostPerPortion,
    };
  } catch (error) {
    console.error('Error calculating batch recipe:', error);
    throw error;
  }
};

/**
 * Link recipe to menu item
 * @param {string} recipeId
 * @param {string} menuItemId
 * @returns {Promise<Object>}
 */
export const linkToMenuItem = async (recipeId, menuItemId) => {
  try {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
      throw new Error(`Recipe with ID ${recipeId} not found`);
    }

    const linkedMenuItems = [...(recipe.linkedMenuItems || [])];
    if (!linkedMenuItems.includes(menuItemId)) {
      linkedMenuItems.push(menuItemId);
    }

    return updateRecipe(recipeId, { linkedMenuItems });
  } catch (error) {
    console.error('Error linking recipe to menu item:', error);
    throw error;
  }
};

/**
 * Unlink recipe from menu item
 * @param {string} recipeId
 * @param {string} menuItemId
 * @returns {Promise<Object>}
 */
export const unlinkFromMenuItem = async (recipeId, menuItemId) => {
  try {
    const recipe = await getRecipeById(recipeId);
    if (!recipe) {
      throw new Error(`Recipe with ID ${recipeId} not found`);
    }

    const linkedMenuItems = (recipe.linkedMenuItems || []).filter(id => id !== menuItemId);
    return updateRecipe(recipeId, { linkedMenuItems });
  } catch (error) {
    console.error('Error unlinking recipe from menu item:', error);
    throw error;
  }
};

/**
 * Get recipe analytics
 * @returns {Promise<Object>}
 */
export const getAnalytics = async () => {
  try {
    const recipes = await getRecipes();

    const analytics = {
      totalRecipes: recipes.length,
      recipesByCategory: {},
      recipesByStatus: {},
      averageCostPerPortion: 0,
      averagePrepTime: 0,
      averageCookTime: 0,
      totalRecipeValue: 0,
      mostExpensiveRecipes: [],
      leastExpensiveRecipes: [],
      mostUsedIngredients: [],
      recipesNeedingUpdate: [],
    };

    // Calculate by category
    recipes.forEach(recipe => {
      analytics.recipesByCategory[recipe.category] =
        (analytics.recipesByCategory[recipe.category] || 0) + 1;
      analytics.recipesByStatus[recipe.status] =
        (analytics.recipesByStatus[recipe.status] || 0) + 1;
    });

    // Calculate averages
    if (recipes.length > 0) {
      analytics.averageCostPerPortion =
        recipes.reduce((sum, r) => sum + (r.costPerPortion || 0), 0) / recipes.length;
      analytics.averagePrepTime =
        recipes.reduce((sum, r) => sum + (r.prepTime || 0), 0) / recipes.length;
      analytics.averageCookTime =
        recipes.reduce((sum, r) => sum + (r.cookTime || 0), 0) / recipes.length;
      analytics.totalRecipeValue =
        recipes.reduce((sum, r) => sum + (r.totalCost || 0), 0);
    }

    // Most/least expensive
    const sortedByCost = [...recipes].sort((a, b) =>
      (b.costPerPortion || 0) - (a.costPerPortion || 0)
    );
    analytics.mostExpensiveRecipes = sortedByCost.slice(0, 10);
    analytics.leastExpensiveRecipes = sortedByCost.slice(-10).reverse();

    // Most used ingredients
    const ingredientCount = {};
    recipes.forEach(recipe => {
      recipe.ingredients?.forEach(ing => {
        ingredientCount[ing.inventoryItemId] =
          (ingredientCount[ing.inventoryItemId] || 0) + 1;
      });
    });
    analytics.mostUsedIngredients = Object.entries(ingredientCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id, count]) => ({ inventoryItemId: id, count }));

    // Recipes needing update (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    analytics.recipesNeedingUpdate = recipes.filter(
      r => new Date(r.updatedAt) < thirtyDaysAgo
    );

    return analytics;
  } catch (error) {
    console.error('Error fetching recipe analytics:', error);
    throw error;
  }
};

/**
 * Get recipe costing report
 * @param {Object} filters
 * @returns {Promise<Array>}
 */
export const getCostingReport = async (filters = {}) => {
  try {
    const recipes = await getRecipes(filters);

    return recipes.map(recipe => ({
      recipeId: recipe.id,
      recipeName: recipe.name,
      category: recipe.category,
      yieldQuantity: recipe.yieldQuantity,
      yieldUnit: recipe.yieldUnit,
      totalIngredientCost: recipe.totalIngredientCost || 0,
      costPerPortion: recipe.costPerPortion || 0,
      laborCost: recipe.laborCost || 0,
      overheadCost: recipe.overheadCost || 0,
      totalCost: recipe.totalCost || 0,
      suggestedSellingPrice: recipe.suggestedSellingPrice || 0,
      actualSellingPrice: recipe.actualSellingPrice || 0,
      costPercentage: recipe.actualSellingPrice > 0
        ? (recipe.totalCost / recipe.actualSellingPrice) * 100
        : 0,
      profitMargin: (recipe.actualSellingPrice || 0) - (recipe.totalCost || 0),
      profitMarginPercentage: recipe.actualSellingPrice > 0
        ? (((recipe.actualSellingPrice || 0) - (recipe.totalCost || 0)) / recipe.actualSellingPrice) * 100
        : 0,
      linkedMenuItemsCount: recipe.linkedMenuItems?.length || 0,
      status: recipe.status,
    }));
  } catch (error) {
    console.error('Error generating costing report:', error);
    throw error;
  }
};

/**
 * Search recipes
 * @param {string} searchTerm
 * @returns {Promise<Array>}
 */
export const searchRecipes = async (searchTerm) => {
  return getRecipes({ search: searchTerm });
};

/**
 * Generate mock recipes for testing
 * @returns {Array}
 */
const generateMockRecipes = () => {
  const mockRecipes = [
    {
      id: generateId('recipe'),
      name: 'Classic Margherita Pizza',
      description: 'Traditional Italian pizza with fresh mozzarella, tomatoes, and basil',
      category: RecipeCategory.MAIN_COURSE,
      status: RecipeStatus.ACTIVE,
      ingredients: [
        {
          id: generateId('recipe_ingredient'),
          inventoryItemName: 'Pizza Dough',
          inventoryItemSku: 'ING-001',
          quantity: 300,
          unit: 'g',
          unitCost: 0.01,
          totalCost: 3.00,
        },
        {
          id: generateId('recipe_ingredient'),
          inventoryItemName: 'Tomato Sauce',
          inventoryItemSku: 'ING-002',
          quantity: 100,
          unit: 'ml',
          unitCost: 0.015,
          totalCost: 1.50,
        },
        {
          id: generateId('recipe_ingredient'),
          inventoryItemName: 'Mozzarella Cheese',
          inventoryItemSku: 'ING-003',
          quantity: 150,
          unit: 'g',
          unitCost: 0.02,
          totalCost: 3.00,
        },
        {
          id: generateId('recipe_ingredient'),
          inventoryItemName: 'Fresh Basil',
          inventoryItemSku: 'ING-004',
          quantity: 10,
          unit: 'g',
          unitCost: 0.10,
          totalCost: 1.00,
        },
      ],
      yieldQuantity: 1,
      yieldUnit: RecipeYieldUnit.SERVINGS,
      portionSize: '12 inch pizza',
      prepTime: 15,
      cookTime: 12,
      totalTime: 27,
      totalIngredientCost: 8.50,
      laborCost: 2.00,
      overheadCost: 1.50,
      totalCost: 12.00,
      costPerPortion: 12.00,
      targetCostPercentage: 30,
      suggestedSellingPrice: 40.00,
      difficulty: RecipeDifficulty.MEDIUM,
      cuisine: 'Italian',
      kdsStation: 'kitchen_hot',
      instructions: [
        { stepNumber: 1, instruction: 'Preheat oven to 475°F (245°C)', duration: 5 },
        { stepNumber: 2, instruction: 'Roll out pizza dough to 12 inches', duration: 5 },
        { stepNumber: 3, instruction: 'Spread tomato sauce evenly', duration: 2 },
        { stepNumber: 4, instruction: 'Add mozzarella cheese', duration: 2 },
        { stepNumber: 5, instruction: 'Bake for 10-12 minutes until golden', duration: 12 },
        { stepNumber: 6, instruction: 'Top with fresh basil', duration: 1 },
      ],
      dietaryInfo: {
        vegetarian: true,
        glutenFree: false,
        dairyFree: false,
        allergens: ['gluten', 'dairy'],
      },
      tags: ['italian', 'pizza', 'vegetarian', 'popular'],
      isPublished: true,
      isFeatured: true,
      linkedMenuItems: [],
      linkedProducts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    {
      id: generateId('recipe'),
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with classic Caesar dressing, croutons, and parmesan',
      category: RecipeCategory.SALAD,
      status: RecipeStatus.ACTIVE,
      ingredients: [
        {
          id: generateId('recipe_ingredient'),
          inventoryItemName: 'Romaine Lettuce',
          inventoryItemSku: 'ING-010',
          quantity: 200,
          unit: 'g',
          unitCost: 0.01,
          totalCost: 2.00,
        },
        {
          id: generateId('recipe_ingredient'),
          inventoryItemName: 'Caesar Dressing',
          inventoryItemSku: 'ING-011',
          quantity: 50,
          unit: 'ml',
          unitCost: 0.04,
          totalCost: 2.00,
        },
        {
          id: generateId('recipe_ingredient'),
          inventoryItemName: 'Croutons',
          inventoryItemSku: 'ING-012',
          quantity: 30,
          unit: 'g',
          unitCost: 0.05,
          totalCost: 1.50,
        },
        {
          id: generateId('recipe_ingredient'),
          inventoryItemName: 'Parmesan Cheese',
          inventoryItemSku: 'ING-013',
          quantity: 20,
          unit: 'g',
          unitCost: 0.10,
          totalCost: 2.00,
        },
      ],
      yieldQuantity: 1,
      yieldUnit: RecipeYieldUnit.SERVINGS,
      portionSize: '1 bowl',
      prepTime: 10,
      cookTime: 0,
      totalTime: 10,
      totalIngredientCost: 7.50,
      laborCost: 1.00,
      overheadCost: 0.50,
      totalCost: 9.00,
      costPerPortion: 9.00,
      targetCostPercentage: 30,
      suggestedSellingPrice: 30.00,
      difficulty: RecipeDifficulty.EASY,
      cuisine: 'American',
      kdsStation: 'cold_kitchen',
      instructions: [
        { stepNumber: 1, instruction: 'Wash and chop romaine lettuce', duration: 5 },
        { stepNumber: 2, instruction: 'Toss with Caesar dressing', duration: 2 },
        { stepNumber: 3, instruction: 'Add croutons and parmesan', duration: 2 },
        { stepNumber: 4, instruction: 'Serve immediately', duration: 1 },
      ],
      dietaryInfo: {
        vegetarian: true,
        glutenFree: false,
        dairyFree: false,
        allergens: ['gluten', 'dairy', 'eggs'],
      },
      tags: ['salad', 'quick', 'vegetarian'],
      isPublished: true,
      isFeatured: false,
      linkedMenuItems: [],
      linkedProducts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockRecipes));
  return mockRecipes;
};

export default {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  duplicateRecipe,
  updateRecipeStatus,
  addIngredient,
  updateIngredient,
  removeIngredient,
  calculateRecipeCost,
  calculateBatchRecipe,
  linkToMenuItem,
  unlinkFromMenuItem,
  getAnalytics,
  getCostingReport,
  searchRecipes,
};
