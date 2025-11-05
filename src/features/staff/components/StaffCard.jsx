/**
 * StaffCard Component
 *
 * Displays a single staff member's information in a card format.
 */

import React from 'react';
import { User, Mail, Phone, Building2, Briefcase, Calendar, MoreVertical } from 'lucide-react';

export const StaffCard = ({ staff, onEdit, onDelete, onSelect, isSelected = false }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'instructor': return 'bg-indigo-100 text-indigo-800';
      case 'receptionist': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer relative ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect?.(staff)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-lg ${staff.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
            <User className={staff.status === 'active' ? 'text-green-600' : 'text-gray-400'} size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {staff.firstName} {staff.lastName}
            </h3>
            <p className="text-sm text-gray-500">{staff.employeeId}</p>
          </div>
        </div>

        <div className="relative">
          <button onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }} className="p-1 hover:bg-gray-100 rounded-full">
            <MoreVertical size={20} className="text-gray-500" />
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
                {onEdit && <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(staff); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Edit</button>}
                {onDelete && <button onClick={(e) => { e.stopPropagation(); setShowMenu(false); if (window.confirm('Delete this staff member?')) onDelete(staff.id); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Delete</button>}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(staff.status)}`}>
          {staff.status.replace('_', ' ')}
        </span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(staff.role)}`}>
          {staff.role}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Briefcase size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{staff.position || 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Building2 size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{staff.branchName || 'Unassigned'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Mail size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{staff.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone size={16} className="text-gray-400" />
          <span className="text-sm text-gray-600">{staff.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar size={14} className="text-gray-400" />
          <span className="text-xs text-gray-500">
            Hired {new Date(staff.hireDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};
