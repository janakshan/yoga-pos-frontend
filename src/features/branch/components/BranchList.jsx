/**
 * BranchList Component
 *
 * Displays a list of branches with search, filter, and actions.
 */

import React, { useEffect, useState } from 'react';
import { useBranch } from '../hooks';
import { BranchCard } from './BranchCard';
import { BranchForm } from './BranchForm';
import { Search, Plus, Filter, Loader2 } from 'lucide-react';

/**
 * @param {Object} props
 * @param {Function} props.onBranchSelect - Branch selection handler
 */
export const BranchList = ({ onBranchSelect }) => {
  const {
    branches,
    isLoading,
    error,
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch,
    selectBranch,
    selectedBranch,
    clearError,
  } = useBranch();

  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all'); // 'all', 'active', 'inactive'

  // Fetch branches on mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Handle create
  const handleCreate = () => {
    setEditingBranch(null);
    setShowForm(true);
  };

  // Handle edit
  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setShowForm(true);
  };

  // Handle form submit
  const handleSubmit = async (data) => {
    try {
      if (editingBranch) {
        await updateBranch(editingBranch.id, data);
      } else {
        await createBranch(data);
      }
      setShowForm(false);
      setEditingBranch(null);
    } catch (error) {
      // Error is handled in the hook
      console.error('Submit error:', error);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await deleteBranch(id);
    } catch (error) {
      // Error is handled in the hook
      console.error('Delete error:', error);
    }
  };

  // Handle toggle active
  const handleToggleActive = async (branch) => {
    const newStatus = !branch.isActive;
    const action = newStatus ? 'activate' : 'deactivate';

    if (!window.confirm(`Are you sure you want to ${action} this branch?`)) {
      return;
    }

    try {
      await updateBranch(branch.id, { isActive: newStatus });
    } catch (error) {
      // Error is handled in the hook
      console.error('Toggle active error:', error);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingBranch(null);
  };

  // Handle branch selection
  const handleBranchSelect = (branch) => {
    selectBranch(branch);
    onBranchSelect?.(branch);
  };

  // Filter branches
  const filteredBranches = branches.filter((branch) => {
    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      branch.name.toLowerCase().includes(searchLower) ||
      branch.code.toLowerCase().includes(searchLower) ||
      branch.address.toLowerCase().includes(searchLower) ||
      branch.city.toLowerCase().includes(searchLower);

    // Active status filter
    const matchesFilter =
      filterActive === 'all' ||
      (filterActive === 'active' && branch.isActive) ||
      (filterActive === 'inactive' && !branch.isActive);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
            <p className="text-gray-600">
              Manage your yoga studio branches
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Branch</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Branches</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !showForm && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <span className="ml-3 text-gray-600">Loading branches...</span>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingBranch ? 'Edit Branch' : 'Create New Branch'}
              </h2>
              <BranchForm
                initialData={editingBranch}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Branch Grid */}
      {!isLoading && !showForm && (
        <>
          {filteredBranches.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No branches found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterActive !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'Get started by creating your first branch'}
              </p>
              {!searchTerm && filterActive === 'all' && (
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
                >
                  <Plus size={20} />
                  <span>Add Branch</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredBranches.length} of {branches.length}{' '}
                branch{branches.length !== 1 ? 'es' : ''}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBranches.map((branch) => (
                  <BranchCard
                    key={branch.id}
                    branch={branch}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onSelect={handleBranchSelect}
                    onToggleActive={handleToggleActive}
                    isSelected={selectedBranch?.id === branch.id}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

// Import Building2 icon
import { Building2 } from 'lucide-react';
