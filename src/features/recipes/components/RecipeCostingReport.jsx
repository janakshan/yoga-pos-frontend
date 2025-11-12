import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useRecipes } from '../hooks/useRecipes';
import { RecipeCategory, RecipeStatus } from '../types/recipe.types';

const RecipeCostingReport = () => {
  const navigate = useNavigate();
  const {
    recipeCostingReports,
    recipeAnalytics,
    handleGenerateRecipeCostingReport,
    loadRecipeAnalytics,
    isLoadingRecipes,
  } = useRecipes();

  const [filters, setFilters] = useState({
    category: '',
    status: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    loadData();
    loadRecipeAnalytics();
  }, []);

  const loadData = async () => {
    await handleGenerateRecipeCostingReport(filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    handleGenerateRecipeCostingReport(newFilters);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortedReports = () => {
    if (!recipeCostingReports) return [];

    const sorted = [...recipeCostingReports].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return sorted;
  };

  const exportToCSV = () => {
    const headers = [
      'Recipe Name',
      'Category',
      'Status',
      'Yield',
      'Ingredient Cost',
      'Labor Cost',
      'Overhead Cost',
      'Total Cost',
      'Cost/Portion',
      'Suggested Price',
      'Cost %',
      'Profit Margin',
      'Profit %',
      'Linked Items',
    ];

    const rows = recipeCostingReports.map((report) => [
      report.recipeName,
      report.category,
      report.status,
      `${report.yieldQuantity} ${report.yieldUnit}`,
      report.totalIngredientCost.toFixed(2),
      report.laborCost.toFixed(2),
      report.overheadCost.toFixed(2),
      report.totalCost.toFixed(2),
      report.costPerPortion.toFixed(2),
      report.suggestedSellingPrice.toFixed(2),
      report.costPercentage.toFixed(1),
      report.profitMargin.toFixed(2),
      report.profitMarginPercentage.toFixed(1),
      report.linkedMenuItemsCount,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recipe-costing-report-${new Date().toISOString()}.csv`;
    a.click();
  };

  const sortedReports = getSortedReports();

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
            <h1 className="text-3xl font-bold text-gray-900">Recipe Costing Report</h1>
            <p className="text-gray-600 mt-1">
              Analyze recipe costs, profitability, and pricing strategies
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
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

              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({ category: '', status: '' });
                    handleGenerateRecipeCostingReport({});
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Analytics Cards */}
      {recipeAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Recipes</p>
                <p className="text-2xl font-bold text-gray-900">{recipeAnalytics.totalRecipes}</p>
              </div>
              <ChartBarIcon className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Cost/Portion</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${recipeAnalytics.averageCostPerPortion.toFixed(2)}
                </p>
              </div>
              <ChartBarIcon className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Recipe Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${recipeAnalytics.totalRecipeValue.toFixed(2)}
                </p>
              </div>
              <ChartBarIcon className="h-10 w-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Total Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(recipeAnalytics.averagePrepTime + recipeAnalytics.averageCookTime)}{' '}
                  min
                </p>
              </div>
              <ChartBarIcon className="h-10 w-10 text-orange-500" />
            </div>
          </div>
        </div>
      )}

      {/* Report Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoadingRecipes ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : sortedReports.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">No recipes found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort('recipeName')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Recipe Name
                    {sortBy === 'recipeName' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort('category')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Category
                    {sortBy === 'category' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort('yieldQuantity')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Yield
                    {sortBy === 'yieldQuantity' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort('totalIngredientCost')}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Ingredient Cost
                    {sortBy === 'totalIngredientCost' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort('totalCost')}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Total Cost
                    {sortBy === 'totalCost' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort('costPerPortion')}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Cost/Portion
                    {sortBy === 'costPerPortion' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort('suggestedSellingPrice')}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Suggested Price
                    {sortBy === 'suggestedSellingPrice' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort('costPercentage')}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Cost %
                    {sortBy === 'costPercentage' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th
                    onClick={() => handleSort('profitMarginPercentage')}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Profit %
                    {sortBy === 'profitMarginPercentage' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedReports.map((report) => (
                  <tr key={report.recipeId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{report.recipeName}</div>
                      <div className="text-sm text-gray-500">{report.status}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {report.category.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.yieldQuantity} {report.yieldUnit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      ${report.totalIngredientCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                      ${report.totalCost.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      ${report.costPerPortion.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">
                      ${report.suggestedSellingPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span
                        className={`font-medium ${
                          report.costPercentage > 35 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {report.costPercentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span
                        className={`font-medium ${
                          report.profitMarginPercentage < 60 ? 'text-orange-600' : 'text-green-600'
                        }`}
                      >
                        {report.profitMarginPercentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <button
                        onClick={() => navigate(`/recipes/${report.recipeId}`)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeCostingReport;
