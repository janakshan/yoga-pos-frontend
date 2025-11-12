import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  CalculatorIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';
import { useRecipes } from '../hooks/useRecipes';
import {
  RecipeCategory,
  RecipeStatus,
  RecipeDifficulty,
  RecipeYieldUnit,
} from '../types/recipe.types';
import IngredientSelector from './IngredientSelector';

const RecipeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const {
    selectedRecipe,
    loadRecipeById,
    handleCreateRecipe,
    handleUpdateRecipe,
    handleCalculateRecipeCost,
    isLoadingRecipes,
  } = useRecipes();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: RecipeCategory.OTHER,
    status: RecipeStatus.DRAFT,
    difficulty: RecipeDifficulty.MEDIUM,
    cuisine: '',
    yieldQuantity: 1,
    yieldUnit: RecipeYieldUnit.SERVINGS,
    portionSize: '',
    prepTime: 0,
    cookTime: 0,
    restTime: 0,
    laborCost: 0,
    overheadCost: 0,
    targetCostPercentage: 30,
    ingredients: [],
    instructions: [],
    preparationNotes: '',
    cookingTips: '',
    kdsStation: '',
    tags: [],
    dietaryInfo: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      nutFree: false,
      halal: false,
      kosher: false,
      allergens: [],
    },
  });

  const [showIngredientSelector, setShowIngredientSelector] = useState(false);
  const [instructionText, setInstructionText] = useState('');

  useEffect(() => {
    if (isEditMode) {
      loadRecipeById(id).then((recipe) => {
        if (recipe) {
          setFormData({
            ...recipe,
            tags: recipe.tags || [],
            instructions: recipe.instructions || [],
            dietaryInfo: recipe.dietaryInfo || formData.dietaryInfo,
          });
        }
      });
    }
  }, [id, isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDietaryChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      dietaryInfo: {
        ...prev.dietaryInfo,
        [field]: value,
      },
    }));
  };

  const handleAddIngredient = (ingredient) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient],
    }));
    setShowIngredientSelector(false);
  };

  const handleRemoveIngredient = (index) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateIngredient = (index, field, value) => {
    setFormData((prev) => {
      const updatedIngredients = [...prev.ingredients];
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value,
      };
      // Recalculate total cost
      if (field === 'quantity' || field === 'unitCost') {
        updatedIngredients[index].totalCost =
          (updatedIngredients[index].quantity || 0) *
          (updatedIngredients[index].unitCost || 0);
      }
      return { ...prev, ingredients: updatedIngredients };
    });
  };

  const handleAddInstruction = () => {
    if (instructionText.trim()) {
      const newInstruction = {
        stepNumber: formData.instructions.length + 1,
        instruction: instructionText.trim(),
        duration: 0,
      };
      setFormData((prev) => ({
        ...prev,
        instructions: [...prev.instructions, newInstruction],
      }));
      setInstructionText('');
    }
  };

  const handleRemoveInstruction = (index) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  };

  const calculateTotalCost = () => {
    const totalIngredientCost = formData.ingredients.reduce(
      (sum, ing) => sum + (ing.totalCost || 0),
      0
    );
    const totalCost =
      totalIngredientCost + (formData.laborCost || 0) + (formData.overheadCost || 0);
    const costPerPortion = formData.yieldQuantity > 0 ? totalCost / formData.yieldQuantity : 0;
    const suggestedSellingPrice =
      formData.targetCostPercentage > 0
        ? costPerPortion / (formData.targetCostPercentage / 100)
        : 0;

    return {
      totalIngredientCost,
      totalCost,
      costPerPortion,
      suggestedSellingPrice,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const costs = calculateTotalCost();
    const totalTime = (formData.prepTime || 0) + (formData.cookTime || 0);

    const recipeData = {
      ...formData,
      totalTime,
      totalIngredientCost: costs.totalIngredientCost,
      totalCost: costs.totalCost,
      costPerPortion: costs.costPerPortion,
      suggestedSellingPrice: costs.suggestedSellingPrice,
    };

    try {
      if (isEditMode) {
        await handleUpdateRecipe(id, recipeData);
      } else {
        await handleCreateRecipe(recipeData);
      }
      navigate('/recipes');
    } catch (error) {
      console.error('Error saving recipe:', error);
    }
  };

  const costs = calculateTotalCost();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/recipes')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Recipe' : 'Create New Recipe'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update recipe details' : 'Add a new recipe to your collection'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipe Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Classic Margherita Pizza"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the recipe"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(RecipeCategory).map(([key, value]) => (
                        <option key={value} value={value}>
                          {key.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(RecipeStatus).map(([key, value]) => (
                        <option key={value} value={value}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty *
                    </label>
                    <select
                      required
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(RecipeDifficulty).map(([key, value]) => (
                        <option key={value} value={value}>
                          {key}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuisine
                  </label>
                  <input
                    type="text"
                    value={formData.cuisine}
                    onChange={(e) => handleInputChange('cuisine', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Italian, Chinese, Mexican"
                  />
                </div>
              </div>
            </div>

            {/* Yield & Time */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Yield & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yield Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.1"
                    value={formData.yieldQuantity}
                    onChange={(e) =>
                      handleInputChange('yieldQuantity', parseFloat(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yield Unit *
                  </label>
                  <select
                    required
                    value={formData.yieldUnit}
                    onChange={(e) => handleInputChange('yieldUnit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.entries(RecipeYieldUnit).map(([key, value]) => (
                      <option key={value} value={value}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portion Size
                  </label>
                  <input
                    type="text"
                    value={formData.portionSize}
                    onChange={(e) => handleInputChange('portionSize', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 250ml, 1 plate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prep Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.prepTime}
                    onChange={(e) => handleInputChange('prepTime', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cook Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cookTime}
                    onChange={(e) => handleInputChange('cookTime', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rest Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.restTime}
                    onChange={(e) => handleInputChange('restTime', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Ingredients</h2>
                <button
                  type="button"
                  onClick={() => setShowIngredientSelector(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <PlusIcon className="h-5 w-5" />
                  Add Ingredient
                </button>
              </div>

              {formData.ingredients.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No ingredients added yet. Click "Add Ingredient" to start building your recipe.
                </p>
              ) : (
                <div className="space-y-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                          <p className="font-medium text-gray-900">
                            {ingredient.inventoryItemName}
                          </p>
                          <p className="text-sm text-gray-500">{ingredient.inventoryItemSku}</p>
                        </div>
                        <div>
                          <input
                            type="number"
                            step="0.01"
                            value={ingredient.quantity}
                            onChange={(e) =>
                              handleUpdateIngredient(
                                index,
                                'quantity',
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="Qty"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={ingredient.unit}
                            onChange={(e) =>
                              handleUpdateIngredient(index, 'unit', e.target.value)
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder="Unit"
                          />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">
                            Cost: ${(ingredient.totalCost || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={instructionText}
                    onChange={(e) => setInstructionText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddInstruction()}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter instruction step..."
                  />
                  <button
                    type="button"
                    onClick={handleAddInstruction}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>

                {formData.instructions.length > 0 && (
                  <div className="space-y-2">
                    {formData.instructions.map((instruction, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full font-semibold">
                          {instruction.stepNumber}
                        </span>
                        <p className="flex-1 text-gray-900">{instruction.instruction}</p>
                        <button
                          type="button"
                          onClick={() => handleRemoveInstruction(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dietary Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dietary Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  'vegetarian',
                  'vegan',
                  'glutenFree',
                  'dairyFree',
                  'nutFree',
                  'halal',
                  'kosher',
                ].map((key) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.dietaryInfo[key]}
                      onChange={(e) => handleDietaryChange(key, e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Cost Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CalculatorIcon className="h-6 w-6 text-blue-600" />
                Cost Summary
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Labor Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.laborCost}
                    onChange={(e) =>
                      handleInputChange('laborCost', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overhead Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.overheadCost}
                    onChange={(e) =>
                      handleInputChange('overheadCost', parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Cost % *
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    max="100"
                    required
                    value={formData.targetCostPercentage}
                    onChange={(e) =>
                      handleInputChange('targetCostPercentage', parseInt(e.target.value))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ingredient Cost:</span>
                      <span className="font-medium">${costs.totalIngredientCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Labor Cost:</span>
                      <span className="font-medium">${(formData.laborCost || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Overhead Cost:</span>
                      <span className="font-medium">
                        ${(formData.overheadCost || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
                      <span>Total Cost:</span>
                      <span className="text-blue-600">${costs.totalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cost per Portion:</span>
                      <span className="font-medium">${costs.costPerPortion.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold text-green-600 border-t border-gray-200 pt-2">
                      <span>Suggested Price:</span>
                      <span>${costs.suggestedSellingPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <button
                    type="submit"
                    disabled={isLoadingRecipes}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoadingRecipes
                      ? 'Saving...'
                      : isEditMode
                      ? 'Update Recipe'
                      : 'Create Recipe'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/recipes')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Ingredient Selector Modal */}
      {showIngredientSelector && (
        <IngredientSelector
          onSelect={handleAddIngredient}
          onClose={() => setShowIngredientSelector(false)}
        />
      )}
    </div>
  );
};

export default RecipeForm;
