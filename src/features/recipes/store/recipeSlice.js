/**
 * Recipe Slice
 * Zustand slice for managing recipes, ingredients, and costing
 */

import recipeService from '../services/recipeService';
import { RecipeStatus } from '../types/recipe.types';

/**
 * Create recipe slice
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} Recipe slice
 */
export const createRecipeSlice = (set, get) => ({
  // State
  recipes: [],
  selectedRecipe: null,
  recipeStats: {
    total: 0,
    active: 0,
    draft: 0,
    inactive: 0,
    avgCostPerPortion: 0,
    avgPrepTime: 0,
    avgCookTime: 0,
  },
  recipeAnalytics: null,
  recipeCostingReports: [],
  isLoadingRecipes: false,
  recipeError: null,
  filters: {
    category: '',
    status: '',
    difficulty: '',
    cuisine: '',
    search: '',
  },

  // Actions

  /**
   * Fetch all recipes
   * @param {Object} filters - Filter options
   */
  fetchRecipes: async (filters = {}) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const recipes = await recipeService.getRecipes(filters);
      set({
        recipes,
        isLoadingRecipes: false,
        filters: { ...get().filters, ...filters }
      });

      // Update stats
      get().updateRecipeStats();
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Fetch a single recipe by ID
   * @param {string} id
   */
  fetchRecipeById: async (id) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const recipe = await recipeService.getRecipeById(id);
      set({ selectedRecipe: recipe, isLoadingRecipes: false });
      return recipe;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Create a new recipe
   * @param {Object} recipeData
   */
  createRecipe: async (recipeData) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const newRecipe = await recipeService.createRecipe(recipeData);
      set((state) => ({
        recipes: [...state.recipes, newRecipe],
        isLoadingRecipes: false
      }));

      // Update stats
      get().updateRecipeStats();

      return newRecipe;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Update a recipe
   * @param {string} id
   * @param {Object} updates
   */
  updateRecipe: async (id, updates) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const updatedRecipe = await recipeService.updateRecipe(id, updates);
      set((state) => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === id ? updatedRecipe : recipe
        ),
        selectedRecipe: state.selectedRecipe?.id === id ? updatedRecipe : state.selectedRecipe,
        isLoadingRecipes: false
      }));

      // Update stats
      get().updateRecipeStats();

      return updatedRecipe;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Delete a recipe
   * @param {string} id
   */
  deleteRecipe: async (id) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      await recipeService.deleteRecipe(id);
      set((state) => ({
        recipes: state.recipes.filter(recipe => recipe.id !== id),
        selectedRecipe: state.selectedRecipe?.id === id ? null : state.selectedRecipe,
        isLoadingRecipes: false
      }));

      // Update stats
      get().updateRecipeStats();
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Duplicate a recipe
   * @param {string} id
   */
  duplicateRecipe: async (id) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const duplicatedRecipe = await recipeService.duplicateRecipe(id);
      set((state) => ({
        recipes: [...state.recipes, duplicatedRecipe],
        isLoadingRecipes: false
      }));

      // Update stats
      get().updateRecipeStats();

      return duplicatedRecipe;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Update recipe status
   * @param {string} id
   * @param {string} status - RecipeStatus value
   */
  updateRecipeStatus: async (id, status) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const updatedRecipe = await recipeService.updateRecipeStatus(id, status);
      set((state) => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === id ? updatedRecipe : recipe
        ),
        isLoadingRecipes: false
      }));

      // Update stats
      get().updateRecipeStats();

      return updatedRecipe;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Add ingredient to recipe
   * @param {string} recipeId
   * @param {Object} ingredient
   */
  addIngredientToRecipe: async (recipeId, ingredient) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const updatedRecipe = await recipeService.addIngredient(recipeId, ingredient);
      set((state) => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === recipeId ? updatedRecipe : recipe
        ),
        selectedRecipe: state.selectedRecipe?.id === recipeId ? updatedRecipe : state.selectedRecipe,
        isLoadingRecipes: false
      }));
      return updatedRecipe;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Update ingredient in recipe
   * @param {string} recipeId
   * @param {string} ingredientId
   * @param {Object} updates
   */
  updateIngredientInRecipe: async (recipeId, ingredientId, updates) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const updatedRecipe = await recipeService.updateIngredient(recipeId, ingredientId, updates);
      set((state) => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === recipeId ? updatedRecipe : recipe
        ),
        selectedRecipe: state.selectedRecipe?.id === recipeId ? updatedRecipe : state.selectedRecipe,
        isLoadingRecipes: false
      }));
      return updatedRecipe;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Remove ingredient from recipe
   * @param {string} recipeId
   * @param {string} ingredientId
   */
  removeIngredientFromRecipe: async (recipeId, ingredientId) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const updatedRecipe = await recipeService.removeIngredient(recipeId, ingredientId);
      set((state) => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === recipeId ? updatedRecipe : recipe
        ),
        selectedRecipe: state.selectedRecipe?.id === recipeId ? updatedRecipe : state.selectedRecipe,
        isLoadingRecipes: false
      }));
      return updatedRecipe;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Calculate recipe cost
   * @param {string} recipeId
   */
  calculateRecipeCost: async (recipeId) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const costData = await recipeService.calculateRecipeCost(recipeId);

      // Update recipe with calculated costs
      set((state) => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === recipeId ? { ...recipe, ...costData } : recipe
        ),
        selectedRecipe: state.selectedRecipe?.id === recipeId
          ? { ...state.selectedRecipe, ...costData }
          : state.selectedRecipe,
        isLoadingRecipes: false
      }));

      return costData;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Calculate batch recipe
   * @param {string} recipeId
   * @param {number} desiredYieldQuantity
   */
  calculateBatchRecipe: async (recipeId, desiredYieldQuantity) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const batchData = await recipeService.calculateBatchRecipe(recipeId, desiredYieldQuantity);
      set({ isLoadingRecipes: false });
      return batchData;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Link recipe to menu item
   * @param {string} recipeId
   * @param {string} menuItemId
   */
  linkRecipeToMenuItem: async (recipeId, menuItemId) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const updatedRecipe = await recipeService.linkToMenuItem(recipeId, menuItemId);
      set((state) => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === recipeId ? updatedRecipe : recipe
        ),
        selectedRecipe: state.selectedRecipe?.id === recipeId ? updatedRecipe : state.selectedRecipe,
        isLoadingRecipes: false
      }));
      return updatedRecipe;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Unlink recipe from menu item
   * @param {string} recipeId
   * @param {string} menuItemId
   */
  unlinkRecipeFromMenuItem: async (recipeId, menuItemId) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const updatedRecipe = await recipeService.unlinkFromMenuItem(recipeId, menuItemId);
      set((state) => ({
        recipes: state.recipes.map(recipe =>
          recipe.id === recipeId ? updatedRecipe : recipe
        ),
        selectedRecipe: state.selectedRecipe?.id === recipeId ? updatedRecipe : state.selectedRecipe,
        isLoadingRecipes: false
      }));
      return updatedRecipe;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Fetch recipe analytics
   */
  fetchRecipeAnalytics: async () => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const analytics = await recipeService.getAnalytics();
      set({ recipeAnalytics: analytics, isLoadingRecipes: false });
      return analytics;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Generate recipe costing report
   * @param {Object} filters - Report filters
   */
  generateRecipeCostingReport: async (filters = {}) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const reports = await recipeService.getCostingReport(filters);
      set({ recipeCostingReports: reports, isLoadingRecipes: false });
      return reports;
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Update recipe stats (local calculation)
   */
  updateRecipeStats: () => {
    const { recipes } = get();

    const stats = {
      total: recipes.length,
      active: recipes.filter(r => r.status === RecipeStatus.ACTIVE).length,
      draft: recipes.filter(r => r.status === RecipeStatus.DRAFT).length,
      inactive: recipes.filter(r => r.status === RecipeStatus.INACTIVE).length,
      avgCostPerPortion: recipes.length > 0
        ? recipes.reduce((sum, r) => sum + (r.costPerPortion || 0), 0) / recipes.length
        : 0,
      avgPrepTime: recipes.length > 0
        ? recipes.reduce((sum, r) => sum + (r.prepTime || 0), 0) / recipes.length
        : 0,
      avgCookTime: recipes.length > 0
        ? recipes.reduce((sum, r) => sum + (r.cookTime || 0), 0) / recipes.length
        : 0,
    };

    set({ recipeStats: stats });
  },

  /**
   * Set selected recipe
   * @param {Object} recipe
   */
  setSelectedRecipe: (recipe) => {
    set({ selectedRecipe: recipe });
  },

  /**
   * Clear selected recipe
   */
  clearSelectedRecipe: () => {
    set({ selectedRecipe: null });
  },

  /**
   * Set recipe filters
   * @param {Object} filters
   */
  setRecipeFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters }
    }));
  },

  /**
   * Clear recipe filters
   */
  clearRecipeFilters: () => {
    set({
      filters: {
        category: '',
        status: '',
        difficulty: '',
        cuisine: '',
        search: '',
      }
    });
  },

  /**
   * Search recipes
   * @param {string} searchTerm
   */
  searchRecipes: async (searchTerm) => {
    set({ isLoadingRecipes: true, recipeError: null });
    try {
      const recipes = await recipeService.searchRecipes(searchTerm);
      set({
        recipes,
        isLoadingRecipes: false,
        filters: { ...get().filters, search: searchTerm }
      });
    } catch (error) {
      set({ recipeError: error.message, isLoadingRecipes: false });
      throw error;
    }
  },

  /**
   * Clear recipe error
   */
  clearRecipeError: () => {
    set({ recipeError: null });
  },
});
