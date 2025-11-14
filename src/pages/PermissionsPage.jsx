/**
 * PermissionsPage Component
 *
 * Main page for managing permissions
 */

import { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { PermissionList, PermissionForm } from '../features/permissions/components';
import { usePermissions } from '../features/permissions/hooks/usePermissions';
import toast from 'react-hot-toast';

const PermissionsPage = () => {
  const {
    permissions,
    isLoading,
    error,
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    clearError
  } = usePermissions();

  const [showForm, setShowForm] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch permissions on mount
  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleCreate = () => {
    setEditingPermission(null);
    setShowForm(true);
  };

  const handleEdit = (permission) => {
    setEditingPermission(permission);
    setShowForm(true);
  };

  const handleDelete = async (permission) => {
    if (window.confirm(`Are you sure you want to delete "${permission.name}"? This action cannot be undone.`)) {
      try {
        await deletePermission(permission.id);
        // Refresh the list
        await fetchPermissions();
      } catch (error) {
        // Error is already handled by the hook
        console.error('Delete error:', error);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormLoading(true);
    try {
      if (editingPermission) {
        await updatePermission(editingPermission.id, formData);
      } else {
        await createPermission(formData);
      }
      setShowForm(false);
      setEditingPermission(null);
      // Refresh the list
      await fetchPermissions();
    } catch (error) {
      // Error is already handled by the hook
      console.error('Form submit error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPermission(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Permissions</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage system permissions and access controls
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Permission
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Permissions List */}
        <PermissionList
          permissions={permissions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <PermissionForm
          permission={editingPermission}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={formLoading}
        />
      )}
    </div>
  );
};

export default PermissionsPage;
