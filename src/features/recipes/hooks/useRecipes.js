import { useCallback } from 'react';
import { useStore } from '../../../store/index.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for recipe CRUD operations and management
 * @returns {Object} Recipe state and actions
 */
export const useRecipes = () => {
  // State selectors
  const recipes = useStore((state) => state.recipes);
  const selectedRecipe = useStore((state) => state.selectedRecipe);
  const isLoadingRecipes = useStore((state) => state.isLoadingRecipes);
  const recipeError = useStore((state) => state.recipeError);
  const recipeStats = useStore((state) => state.recipeStats);
  const recipeAnalytics = useStore((state) => state.recipeAnalytics);
  const recipeCostingReports = useStore((state) => state.recipeCostingReports);
  const filters = useStore((state) => state.filters);

  // Action selectors
  const fetchRecipes = useStore((state) => state.fetchRecipes);
  const fetchRecipeById = useStore((state) => state.fetchRecipeById);
  const createRecipe = useStore((state) => state.createRecipe);
  const updateRecipe = useStore((state) => state.updateRecipe);
  const deleteRecipe = useStore((state) => state.deleteRecipe);
  const duplicateRecipe = useStore((state) => state.duplicateRecipe);
  const updateRecipeStatus = useStore((state) => state.updateRecipeStatus);
  const addIngredientToRecipe = useStore((state) => state.addIngredientToRecipe);
  const updateIngredientInRecipe = useStore((state) => state.updateIngredientInRecipe);
  const removeIngredientFromRecipe = useStore((state) => state.removeIngredientFromRecipe);
  const calculateRecipeCost = useStore((state) => state.calculateRecipeCost);
  const calculateBatchRecipe = useStore((state) => state.calculateBatchRecipe);
  const linkRecipeToMenuItem = useStore((state) => state.linkRecipeToMenuItem);
  const unlinkRecipeFromMenuItem = useStore((state) => state.unlinkRecipeFromMenuItem);
  const fetchRecipeAnalytics = useStore((state) => state.fetchRecipeAnalytics);
  const generateRecipeCostingReport = useStore((state) => state.generateRecipeCostingReport);
  const setSelectedRecipe = useStore((state) => state.setSelectedRecipe);
  const clearSelectedRecipe = useStore((state) => state.clearSelectedRecipe);
  const setRecipeFilters = useStore((state) => state.setRecipeFilters);
  const clearRecipeFilters = useStore((state) => state.clearRecipeFilters);
  const searchRecipes = useStore((state) => state.searchRecipes);
  const clearRecipeError = useStore((state) => state.clearRecipeError);

  /**
   * Load all recipes with optional filters
   * @param {Object} filters - Filter options
   */
  const loadRecipes = useCallback(
    async (filterOptions = {}) => {
      try {
        await fetchRecipes(filterOptions);
      } catch (err) {
        const message = err.message || 'Failed to fetch recipes';
        toast.error(message);
        throw err;
      }
    },
    [fetchRecipes]
  );

  /**
   * Load a single recipe by ID
   * @param {string} id - Recipe ID
   */
  const loadRecipeById = useCallback(
    async (id) => {
      try {
        const recipe = await fetchRecipeById(id);
        return recipe;
      } catch (err) {
        const message = err.message || 'Failed to fetch recipe';
        toast.error(message);
        throw err;
      }
    },
    [fetchRecipeById]
  );

  /**
   * Create a new recipe
   * @param {Object} recipeData - Recipe data
   */
  const handleCreateRecipe = useCallback(
    async (recipeData) => {
      try {
        const newRecipe = await createRecipe(recipeData);
        toast.success('Recipe created successfully');
        return newRecipe;
      } catch (err) {
        const message = err.message || 'Failed to create recipe';
        toast.error(message);
        throw err;
      }
    },
    [createRecipe]
  );

  /**
   * Update an existing recipe
   * @param {string} id - Recipe ID
   * @param {Object} updates - Recipe updates
   */
  const handleUpdateRecipe = useCallback(
    async (id, updates) => {
      try {
        const updatedRecipe = await updateRecipe(id, updates);
        toast.success('Recipe updated successfully');
        return updatedRecipe;
      } catch (err) {
        const message = err.message || 'Failed to update recipe';
        toast.error(message);
        throw err;
      }
    },
    [updateRecipe]
  );

  /**
   * Delete a recipe
   * @param {string} id - Recipe ID
   */
  const handleDeleteRecipe = useCallback(
    async (id) => {
      try {
        await deleteRecipe(id);
        toast.success('Recipe deleted successfully');
      } catch (err) {
        const message = err.message || 'Failed to delete recipe';
        toast.error(message);
        throw err;
      }
    },
    [deleteRecipe]
  );

  /**
   * Duplicate a recipe
   * @param {string} id - Recipe ID
   */
  const handleDuplicateRecipe = useCallback(
    async (id) => {
      try {
        const duplicatedRecipe = await duplicateRecipe(id);
        toast.success('Recipe duplicated successfully');
        return duplicatedRecipe;
      } catch (err) {
        const message = err.message || 'Failed to duplicate recipe';
        toast.error(message);
        throw err;
      }
    },
    [duplicateRecipe]
  );

  /**
   * Update recipe status
   * @param {string} id - Recipe ID
   * @param {string} status - New status
   */
  const handleUpdateRecipeStatus = useCallback(
    async (id, status) => {
      try {
        const updatedRecipe = await updateRecipeStatus(id, status);
        toast.success('Recipe status updated successfully');
        return updatedRecipe;
      } catch (err) {
        const message = err.message || 'Failed to update recipe status';
        toast.error(message);
        throw err;
      }
    },
    [updateRecipeStatus]
  );

  /**
   * Add ingredient to recipe
   * @param {string} recipeId - Recipe ID
   * @param {Object} ingredient - Ingredient data
   */
  const handleAddIngredient = useCallback(
    async (recipeId, ingredient) => {
      try {
        const updatedRecipe = await addIngredientToRecipe(recipeId, ingredient);
        toast.success('Ingredient added successfully');
        return updatedRecipe;
      } catch (err) {
        const message = err.message || 'Failed to add ingredient';
        toast.error(message);
        throw err;
      }
    },
    [addIngredientToRecipe]
  );

  /**
   * Update ingredient in recipe
   * @param {string} recipeId - Recipe ID
   * @param {string} ingredientId - Ingredient ID
   * @param {Object} updates - Ingredient updates
   */
  const handleUpdateIngredient = useCallback(
    async (recipeId, ingredientId, updates) => {
      try {
        const updatedRecipe = await updateIngredientInRecipe(recipeId, ingredientId, updates);
        toast.success('Ingredient updated successfully');
        return updatedRecipe;
      } catch (err) {
        const message = err.message || 'Failed to update ingredient';
        toast.error(message);
        throw err;
      }
    },
    [updateIngredientInRecipe]
  );

  /**
   * Remove ingredient from recipe
   * @param {string} recipeId - Recipe ID
   * @param {string} ingredientId - Ingredient ID
   */
  const handleRemoveIngredient = useCallback(
    async (recipeId, ingredientId) => {
      try {
        const updatedRecipe = await removeIngredientFromRecipe(recipeId, ingredientId);
        toast.success('Ingredient removed successfully');
        return updatedRecipe;
      } catch (err) {
        const message = err.message || 'Failed to remove ingredient';
        toast.error(message);
        throw err;
      }
    },
    [removeIngredientFromRecipe]
  );

  /**
   * Calculate recipe cost
   * @param {string} recipeId - Recipe ID
   */
  const handleCalculateRecipeCost = useCallback(
    async (recipeId) => {
      try {
        const costData = await calculateRecipeCost(recipeId);
        toast.success('Recipe cost calculated successfully');
        return costData;
      } catch (err) {
        const message = err.message || 'Failed to calculate recipe cost';
        toast.error(message);
        throw err;
      }
    },
    [calculateRecipeCost]
  );

  /**
   * Calculate batch recipe
   * @param {string} recipeId - Recipe ID
   * @param {number} desiredYieldQuantity - Desired yield quantity
   */
  const handleCalculateBatchRecipe = useCallback(
    async (recipeId, desiredYieldQuantity) => {
      try {
        const batchData = await calculateBatchRecipe(recipeId, desiredYieldQuantity);
        return batchData;
      } catch (err) {
        const message = err.message || 'Failed to calculate batch recipe';
        toast.error(message);
        throw err;
      }
    },
    [calculateBatchRecipe]
  );

  /**
   * Link recipe to menu item
   * @param {string} recipeId - Recipe ID
   * @param {string} menuItemId - Menu item ID
   */
  const handleLinkToMenuItem = useCallback(
    async (recipeId, menuItemId) => {
      try {
        const updatedRecipe = await linkRecipeToMenuItem(recipeId, menuItemId);
        toast.success('Recipe linked to menu item successfully');
        return updatedRecipe;
      } catch (err) {
        const message = err.message || 'Failed to link recipe to menu item';
        toast.error(message);
        throw err;
      }
    },
    [linkRecipeToMenuItem]
  );

  /**
   * Unlink recipe from menu item
   * @param {string} recipeId - Recipe ID
   * @param {string} menuItemId - Menu item ID
   */
  const handleUnlinkFromMenuItem = useCallback(
    async (recipeId, menuItemId) => {
      try {
        const updatedRecipe = await unlinkRecipeFromMenuItem(recipeId, menuItemId);
        toast.success('Recipe unlinked from menu item successfully');
        return updatedRecipe;
      } catch (err) {
        const message = err.message || 'Failed to unlink recipe from menu item';
        toast.error(message);
        throw err;
      }
    },
    [unlinkRecipeFromMenuItem]
  );

  /**
   * Load recipe analytics
   */
  const loadRecipeAnalytics = useCallback(async () => {
    try {
      const analytics = await fetchRecipeAnalytics();
      return analytics;
    } catch (err) {
      const message = err.message || 'Failed to fetch recipe analytics';
      toast.error(message);
      throw err;
    }
  }, [fetchRecipeAnalytics]);

  /**
   * Generate recipe costing report
   * @param {Object} filters - Report filters
   */
  const handleGenerateRecipeCostingReport = useCallback(
    async (filterOptions = {}) => {
      try {
        const reports = await generateRecipeCostingReport(filterOptions);
        toast.success('Recipe costing report generated successfully');
        return reports;
      } catch (err) {
        const message = err.message || 'Failed to generate recipe costing report';
        toast.error(message);
        throw err;
      }
    },
    [generateRecipeCostingReport]
  );

  /**
   * Search recipes
   * @param {string} searchTerm - Search term
   */
  const handleSearchRecipes = useCallback(
    async (searchTerm) => {
      try {
        await searchRecipes(searchTerm);
      } catch (err) {
        const message = err.message || 'Failed to search recipes';
        toast.error(message);
        throw err;
      }
    },
    [searchRecipes]
  );

  return {
    // State
    recipes,
    selectedRecipe,
    isLoadingRecipes,
    recipeError,
    recipeStats,
    recipeAnalytics,
    recipeCostingReports,
    filters,

    // Actions
    loadRecipes,
    loadRecipeById,
    handleCreateRecipe,
    handleUpdateRecipe,
    handleDeleteRecipe,
    handleDuplicateRecipe,
    handleUpdateRecipeStatus,
    handleAddIngredient,
    handleUpdateIngredient,
    handleRemoveIngredient,
    handleCalculateRecipeCost,
    handleCalculateBatchRecipe,
    handleLinkToMenuItem,
    handleUnlinkFromMenuItem,
    loadRecipeAnalytics,
    handleGenerateRecipeCostingReport,
    handleSearchRecipes,
    setSelectedRecipe,
    clearSelectedRecipe,
    setRecipeFilters,
    clearRecipeFilters,
    clearRecipeError,
  };
};

export default useRecipes;
