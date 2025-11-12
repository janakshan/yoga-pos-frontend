import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useRecipes } from '../hooks/useRecipes';
import { RecipeCategory, RecipeStatus, RecipeDifficulty } from '../types/recipe.types';

const RecipeList = () => {
  const navigate = useNavigate();
  const {
    recipes,
    isLoadingRecipes,
    recipeStats,
    loadRecipes,
    handleDeleteRecipe,
    handleDuplicateRecipe,
    handleUpdateRecipeStatus,
    setRecipeFilters,
    clearRecipeFilters,
    filters,
  } = useRecipes();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    loadRecipes();
  }, []);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setRecipeFilters({ search: value });
    loadRecipes({ ...filters, search: value });
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters, [filterKey]: value };
    setRecipeFilters(newFilters);
    loadRecipes(newFilters);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    clearRecipeFilters();
    loadRecipes();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      await handleDeleteRecipe(id);
      loadRecipes();
    }
  };

  const handleDuplicate = async (id) => {
    const duplicated = await handleDuplicateRecipe(id);
    if (duplicated) {
      navigate(`/recipes/${duplicated.id}/edit`);
    }
  };

  const handleStatusChange = async (id, status) => {
    await handleUpdateRecipeStatus(id, status);
    loadRecipes();
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Recipe Management</h1>
        <p className="text-gray-600 mt-2">Manage your recipes, ingredients, and costs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Recipes</p>
              <p className="text-2xl font-bold text-gray-900">{recipeStats.total}</p>
            </div>
            <ChartBarIcon className="h-10 w-10 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Recipes</p>
              <p className="text-2xl font-bold text-green-600">{recipeStats.active}</p>
            </div>
            <CheckCircleIcon className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Cost/Portion</p>
              <p className="text-2xl font-bold text-gray-900">
                ${recipeStats.avgCostPerPortion.toFixed(2)}
              </p>
            </div>
            <CurrencyDollarIcon className="h-10 w-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Prep Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {recipeStats.avgPrepTime.toFixed(0)} min
              </p>
            </div>
            <ClockIcon className="h-10 w-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
            </button>

            {/* Add Recipe Button */}
            <button
              onClick={() => navigate('/recipes/new')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusIcon className="h-5 w-5" />
              Add Recipe
            </button>

            {/* Reports Button */}
            <button
              onClick={() => navigate('/recipes/reports')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ChartBarIcon className="h-5 w-5" />
              Reports
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {Object.entries(RecipeCategory).map(([key, value]) => (
                      <option key={value} value={value}>
                        {key.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    {Object.entries(RecipeStatus).map(([key, value]) => (
                      <option key={value} value={value}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Difficulties</option>
                    {Object.entries(RecipeDifficulty).map(([key, value]) => (
                      <option key={value} value={value}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={handleClearFilters}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recipe List */}
      {isLoadingRecipes ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500 text-lg">No recipes found</p>
          <button
            onClick={() => navigate('/recipes/new')}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5" />
            Create Your First Recipe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Recipe Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {recipe.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {recipe.description}
                    </p>
                  </div>
                  <div className="relative ml-2">
                    <button
                      onClick={() =>
                        setActiveDropdown(activeDropdown === recipe.id ? null : recipe.id)
                      }
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
                    </button>
                    {activeDropdown === recipe.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => {
                            navigate(`/recipes/${recipe.id}/edit`);
                            setActiveDropdown(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <PencilIcon className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDuplicate(recipe.id);
                            setActiveDropdown(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <DocumentDuplicateIcon className="h-4 w-4" />
                          Duplicate
                        </button>
                        {recipe.status === RecipeStatus.ACTIVE ? (
                          <button
                            onClick={() => {
                              handleStatusChange(recipe.id, RecipeStatus.INACTIVE);
                              setActiveDropdown(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <XCircleIcon className="h-4 w-4" />
                            Deactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              handleStatusChange(recipe.id, RecipeStatus.ACTIVE);
                              setActiveDropdown(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                            Activate
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleDelete(recipe.id);
                            setActiveDropdown(null);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusBadge(
                      recipe.status
                    )}`}
                  >
                    {recipe.status}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyBadge(
                      recipe.difficulty
                    )}`}
                  >
                    {recipe.difficulty}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-800">
                    {recipe.category.replace(/_/g, ' ')}
                  </span>
                </div>

                {/* Recipe Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Cost per portion:</span>
                    <span className="font-medium text-gray-900">
                      ${(recipe.costPerPortion || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Prep + Cook time:</span>
                    <span className="font-medium text-gray-900">
                      {(recipe.prepTime || 0) + (recipe.cookTime || 0)} min
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Yield:</span>
                    <span className="font-medium text-gray-900">
                      {recipe.yieldQuantity} {recipe.yieldUnit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Ingredients:</span>
                    <span className="font-medium text-gray-900">
                      {recipe.ingredients?.length || 0}
                    </span>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;
