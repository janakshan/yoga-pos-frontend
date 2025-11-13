/**
 * AssignManagerModal Component
 *
 * Modal for assigning a manager to a branch
 */

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { branchApiService } from '../services/branchApiService';
import toast from 'react-hot-toast';

/**
 * @param {Object} props
 * @param {Object} props.branch - Branch object
 * @param {Function} props.onClose - Close handler
 * @param {Function} props.onSuccess - Success callback
 * @param {Array} props.users - List of users (managers)
 */
export const AssignManagerModal = ({ branch, onClose, onSuccess, users = [] }) => {
  const [selectedManagerId, setSelectedManagerId] = useState(branch?.managerId || '');
  const [isLoading, setIsLoading] = useState(false);
  const [availableManagers, setAvailableManagers] = useState(users);

  // Filter users to show only managers/admins
  useEffect(() => {
    // If users are provided, filter for managers
    if (users && users.length > 0) {
      const managers = users.filter(user =>
        user.role === 'MANAGER' || user.role === 'ADMIN'
      );
      setAvailableManagers(managers);
    }
  }, [users]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedManagerId) {
      toast.error('Please select a manager');
      return;
    }

    setIsLoading(true);
    try {
      await branchApiService.assignManager(branch.id, selectedManagerId);
      toast.success('Manager assigned successfully');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error assigning manager:', error);
      toast.error('Failed to assign manager');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Assign Manager</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch
            </label>
            <div className="px-3 py-2 bg-gray-50 rounded-lg text-gray-900">
              {branch?.name}
            </div>
            <p className="mt-1 text-sm text-gray-500">
              {branch?.city}, {branch?.state}
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-2">
              Select Manager <span className="text-red-500">*</span>
            </label>
            <select
              id="manager"
              value={selectedManagerId}
              onChange={(e) => setSelectedManagerId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">-- Select a manager --</option>
              {availableManagers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {availableManagers.length === 0 && (
              <p className="mt-2 text-sm text-amber-600">
                No managers available. Please create manager users first.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedManagerId}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isLoading ? 'Assigning...' : 'Assign Manager'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
