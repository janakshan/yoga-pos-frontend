import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  LinkIcon,
  CalculatorIcon,
} from '@heroicons/react/24/outline';
import { useRecipes } from '../hooks/useRecipes';
import { RecipeStatus } from '../types/recipe.types';

const RecipeDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const {
    selectedRecipe,
    loadRecipeById,
    handleDeleteRecipe,
    handleDuplicateRecipe,
    handleCalculateRecipeCost,
    handleCalculateBatchRecipe,
    isLoadingRecipes,
  } = useRecipes();

  const [batchQuantity, setBatchQuantity] = useState(1);
  const [batchData, setBatchData] = useState(null);
  const [showBatchCalculator, setShowBatchCalculator] = useState(false);

  useEffect(() => {
    if (id) {
      loadRecipeById(id);
    }
  }, [id]);

  useEffect(() => {
    if (selectedRecipe) {
      setBatchQuantity(selectedRecipe.yieldQuantity);
    }
  }, [selectedRecipe]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await handleDeleteRecipe(id);
      navigate('/recipes');
    }
  };

  const handleDuplicate = async () => {
    const duplicated = await handleDuplicateRecipe(id);
    if (duplicated) {
      navigate(`/recipes/${duplicated.id}/edit`);
    }
  };

  const handleRecalculateCost = async () => {
    await handleCalculateRecipeCost(id);
    loadRecipeById(id);
  };

  const handleBatchCalculation = async () => {
    const batch = await handleCalculateBatchRecipe(id, parseFloat(batchQuantity));
    setBatchData(batch);
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-red-100 text-red-800',
    };
    return badges[status] || badges.draft;
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      easy: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800',
    };
    return badges[difficulty] || badges.medium;
  };

  if (isLoadingRecipes || !selectedRecipe) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const recipe = selectedRecipe;
  const costPercentage = recipe.actualSellingPrice
    ? ((recipe.totalCost / recipe.actualSellingPrice) * 100).toFixed(1)
    : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/recipes')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{recipe.name}</h1>
            <p className="text-gray-600 mt-1">{recipe.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/recipes/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <PencilIcon className="h-5 w-5" />
              Edit
            </button>
            <button
              onClick={handleDuplicate}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <DocumentDuplicateIcon className="h-5 w-5" />
              Duplicate
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              <TrashIcon className="h-5 w-5" />
              Delete
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 text-sm font-medium rounded ${getStatusBadge(recipe.status)}`}>
            {recipe.status}
          </span>
          <span
            className={`px-3 py-1 text-sm font-medium rounded ${getDifficultyBadge(recipe.difficulty)}`}
          >
            {recipe.difficulty}
          </span>
          <span className="px-3 py-1 text-sm font-medium rounded bg-purple-100 text-purple-800">
            {recipe.category.replace(/_/g, ' ')}
          </span>
          {recipe.cuisine && (
            <span className="px-3 py-1 text-sm font-medium rounded bg-indigo-100 text-indigo-800">
              {recipe.cuisine}
            </span>
          )}
          {recipe.dietaryInfo?.vegetarian && (
            <span className="px-3 py-1 text-sm font-medium rounded bg-green-100 text-green-800">
              Vegetarian
            </span>
          )}
          {recipe.dietaryInfo?.vegan && (
            <span className="px-3 py-1 text-sm font-medium rounded bg-green-100 text-green-800">
              Vegan
            </span>
          )}
          {recipe.dietaryInfo?.glutenFree && (
            <span className="px-3 py-1 text-sm font-medium rounded bg-amber-100 text-amber-800">
              Gluten Free
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <ClockIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Prep Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{recipe.prepTime || 0} min</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <ClockIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Cook Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{recipe.cookTime || 0} min</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <ClockIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Total Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{recipe.totalTime || 0} min</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <UserGroupIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Yield</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {recipe.yieldQuantity} {recipe.yieldUnit}
              </p>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h2>
            {recipe.ingredients?.length > 0 ? (
              <div className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{ingredient.inventoryItemName}</p>
                      <p className="text-sm text-gray-500">{ingredient.inventoryItemSku}</p>
                      {ingredient.notes && (
                        <p className="text-sm text-gray-600 italic mt-1">{ingredient.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {ingredient.quantity} {ingredient.unit}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${(ingredient.totalCost || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No ingredients added</p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
            {recipe.instructions?.length > 0 ? (
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full font-semibold">
                        {instruction.stepNumber}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">{instruction.instruction}</p>
                      {instruction.duration > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          <ClockIcon className="inline h-4 w-4 mr-1" />
                          {instruction.duration} minutes
                        </p>
                      )}
                      {instruction.tips && (
                        <p className="text-sm text-blue-600 mt-1 italic">Tip: {instruction.tips}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No instructions added</p>
            )}
          </div>

          {/* Notes */}
          {(recipe.preparationNotes || recipe.cookingTips) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes & Tips</h2>
              {recipe.preparationNotes && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2">Preparation Notes:</h3>
                  <p className="text-gray-700">{recipe.preparationNotes}</p>
                </div>
              )}
              {recipe.cookingTips && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Cooking Tips:</h3>
                  <p className="text-gray-700">{recipe.cookingTips}</p>
                </div>
              )}
            </div>
          )}

          {/* Batch Calculator */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <CalculatorIcon className="h-6 w-6 text-blue-600" />
                Batch Calculator
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desired Yield Quantity
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={batchQuantity}
                    onChange={(e) => setBatchQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleBatchCalculation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Calculate
                </button>
              </div>

              {batchData && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Batch for {batchData.desiredYieldQuantity} {recipe.yieldUnit}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Multiplier: {batchData.multiplier.toFixed(2)}x
                  </p>
                  <div className="space-y-2">
                    {batchData.adjustedIngredients.map((ingredient, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-900">{ingredient.inventoryItemName}</span>
                        <span className="font-medium">
                          {ingredient.quantity.toFixed(2)} {ingredient.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex justify-between font-semibold">
                      <span>Total Cost:</span>
                      <span>${batchData.adjustedTotalCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="space-y-6 sticky top-6">
            {/* Cost Summary */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Cost Summary</h2>
                <button
                  onClick={handleRecalculateCost}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Recalculate
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ingredient Cost:</span>
                  <span className="font-medium">
                    ${(recipe.totalIngredientCost || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Labor Cost:</span>
                  <span className="font-medium">${(recipe.laborCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Overhead Cost:</span>
                  <span className="font-medium">${(recipe.overheadCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold border-t border-gray-200 pt-3">
                  <span>Total Cost:</span>
                  <span className="text-blue-600">${(recipe.totalCost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cost per Portion:</span>
                  <span className="font-medium">${(recipe.costPerPortion || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Target Cost %:</span>
                  <span className="font-medium">{recipe.targetCostPercentage}%</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span className="text-gray-900">Suggested Price:</span>
                  <span className="text-green-600">
                    ${(recipe.suggestedSellingPrice || 0).toFixed(2)}
                  </span>
                </div>
                {recipe.actualSellingPrice > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Actual Price:</span>
                      <span className="font-medium">
                        ${(recipe.actualSellingPrice || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Actual Cost %:</span>
                      <span
                        className={`font-medium ${
                          costPercentage > recipe.targetCostPercentage
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        {costPercentage}%
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Linked Items */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-blue-600" />
                Linked Items
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Menu Items:</p>
                  <p className="font-medium text-gray-900">
                    {recipe.linkedMenuItems?.length || 0} linked
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Products:</p>
                  <p className="font-medium text-gray-900">
                    {recipe.linkedProducts?.length || 0} linked
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Info</h2>
              <div className="space-y-3 text-sm">
                {recipe.kdsStation && (
                  <div>
                    <span className="text-gray-600">KDS Station:</span>
                    <p className="font-medium text-gray-900">{recipe.kdsStation}</p>
                  </div>
                )}
                {recipe.portionSize && (
                  <div>
                    <span className="text-gray-600">Portion Size:</span>
                    <p className="font-medium text-gray-900">{recipe.portionSize}</p>
                  </div>
                )}
                {recipe.tags?.length > 0 && (
                  <div>
                    <span className="text-gray-600">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {recipe.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Version:</span>
                  <p className="font-medium text-gray-900">{recipe.version}</p>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(recipe.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
