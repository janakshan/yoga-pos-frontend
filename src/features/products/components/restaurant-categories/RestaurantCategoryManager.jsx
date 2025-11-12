/**
 * Restaurant Category Manager
 * Main component for managing restaurant menu categories
 */

import { useState, useEffect } from 'react';
import { useStore } from '../../../../store';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import RestaurantCategoryForm from './RestaurantCategoryForm';
import {
  RESTAURANT_CATEGORY_LABELS,
  CATEGORY_STATUS_LABELS
} from '../../types/restaurant-category.types';

export default function RestaurantCategoryManager() {
  const {
    restaurantCategories,
    fetchRestaurantCategories,
    deleteRestaurantCategory,
    initializeDefaultCategories,
    isLoadingCategories,
    categoryError
  } = useStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchRestaurantCategories();
  }, [fetchRestaurantCategories]);

  const handleCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteRestaurantCategory(categoryId);
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const handleInitializeDefaults = async () => {
    if (
      window.confirm(
        'This will create default restaurant categories. Continue?'
      )
    ) {
      try {
        await initializeDefaultCategories();
      } catch (error) {
        console.error('Failed to initialize categories:', error);
      }
    }
  };

  const activeCategories = restaurantCategories
    .filter(c => c.status === 'active')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const inactiveCategories = restaurantCategories
    .filter(c => c.status === 'inactive' || c.status === 'seasonal')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Categories</h1>
          <p className="text-gray-600 mt-1">
            Organize your menu into categories
          </p>
        </div>
        <div className="flex gap-3">
          {restaurantCategories.length === 0 && (
            <button
              onClick={handleInitializeDefaults}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Initialize Defaults
            </button>
          )}
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Category
          </button>
        </div>
      </div>

      {categoryError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {categoryError}
        </div>
      )}

      {isLoadingCategories ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Active Categories */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Active Categories ({activeCategories.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeCategories.length === 0 ? (
                <div className="col-span-full bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-600">No active categories yet</p>
                  <button
                    onClick={handleCreate}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create your first category
                  </button>
                </div>
              ) : (
                activeCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={() => handleEdit(category)}
                    onDelete={() => handleDelete(category.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Inactive Categories */}
          {inactiveCategories.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Inactive Categories ({inactiveCategories.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inactiveCategories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    onEdit={() => handleEdit(category)}
                    onDelete={() => handleDelete(category.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <RestaurantCategoryForm
          category={editingCategory}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
}

function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div
      className="bg-white border-2 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden"
      style={{ borderColor: category.color }}
    >
      <div
        className="h-2"
        style={{ backgroundColor: category.color }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {category.icon && (
              <span className="text-2xl">{category.icon}</span>
            )}
            <div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {RESTAURANT_CATEGORY_LABELS[category.type]}
              </p>
            </div>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              category.status === 'active'
                ? 'bg-green-100 text-green-800'
                : category.status === 'seasonal'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {CATEGORY_STATUS_LABELS[category.status]}
          </span>
        </div>

        {category.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {category.description}
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          {category.showInMenu && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">Menu</span>
          )}
          {category.showInPOS && (
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded">POS</span>
          )}
          {category.showInKDS && (
            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded">KDS</span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit2 className="w-4 h-4 inline mr-1" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
