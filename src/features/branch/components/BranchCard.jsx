/**
 * BranchCard Component
 *
 * Displays a single branch's information in a card format.
 */

import React from 'react';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  User,
  Users,
  Clock,
  MoreVertical,
} from 'lucide-react';

/**
 * @param {Object} props
 * @param {Object} props.branch - Branch object
 * @param {Function} props.onEdit - Edit handler
 * @param {Function} props.onDelete - Delete handler
 * @param {Function} props.onSelect - Select handler
 * @param {Function} props.onAssignManager - Assign manager handler
 * @param {boolean} props.isSelected - Whether branch is selected
 */
export const BranchCard = ({
  branch,
  onEdit,
  onDelete,
  onSelect,
  onAssignManager,
  isSelected = false,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit?.(branch);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (window.confirm('Are you sure you want to delete this branch?')) {
      onDelete?.(branch.id);
    }
  };

  const handleAssignManager = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onAssignManager?.(branch);
  };

  const handleCardClick = () => {
    onSelect?.(branch);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer relative border border-gray-200 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div
            className={`p-2 rounded-lg ${
              branch.isActive ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            <Building2
              className={
                branch.isActive ? 'text-green-600' : 'text-gray-400'
              }
              size={24}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {branch.name}
            </h3>
            <p className="text-sm text-gray-500">{branch.code}</p>
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={handleMenuClick}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical size={20} className="text-gray-500" />
          </button>

          {showMenu && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
                {onEdit && (
                  <button
                    onClick={handleEdit}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                )}
                {onAssignManager && (
                  <button
                    onClick={handleAssignManager}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Assign Manager
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            branch.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {branch.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Address */}
      <div className="flex items-start space-x-2 mb-3">
        <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-gray-600">
          <div>{branch.address}</div>
          <div>
            {branch.city}, {branch.state} {branch.zipCode}
          </div>
          <div>{branch.country}</div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2">
          <Phone size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{branch.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{branch.email}</span>
        </div>
      </div>

      {/* Manager */}
      <div className="flex items-center space-x-2 mb-3">
        <User size={16} className="text-gray-400" />
        <span className="text-sm text-gray-600">
          {branch.managerName || 'No manager assigned'}
        </span>
      </div>

      {/* Staff Count */}
      <div className="flex items-center space-x-2 mb-3">
        <Users size={16} className="text-gray-400" />
        <span className="text-sm text-gray-600">
          {branch.staffCount} staff member{branch.staffCount !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Footer - Created Date */}
      <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
        <Clock size={14} className="text-gray-400" />
        <span className="text-xs text-gray-500">
          Created {new Date(branch.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};
