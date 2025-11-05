/**
 * StaffList Component
 *
 * Displays a list of staff members with search, filter, and actions.
 */

import React, { useEffect, useState } from 'react';
import { useStaff } from '../hooks';
import { StaffCard } from './StaffCard';
import { StaffForm } from './StaffForm';
import { Search, Plus, Filter, Loader2, Users } from 'lucide-react';

export const StaffList = ({ onStaffSelect }) => {
  const {
    staff,
    isLoading,
    error,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    selectStaffMember,
    selectedStaff,
    clearError,
  } = useStaff();

  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editingStaff) {
        await updateStaff(editingStaff.id, data);
      } else {
        await createStaff(data);
      }
      setShowForm(false);
      setEditingStaff(null);
    } catch (error) {
      console.error('Submit error:', error);
    }
  };

  const filteredStaff = staff.filter((member) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      member.firstName.toLowerCase().includes(searchLower) ||
      member.lastName.toLowerCase().includes(searchLower) ||
      member.employeeId.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower);

    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    const matchesRole = filterRole === 'all' || member.role === filterRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Staff Members</h1>
            <p className="text-gray-600">Manage your yoga studio staff</p>
          </div>
          <button
            onClick={() => { setEditingStaff(null); setShowForm(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Staff</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="instructor">Instructor</option>
            <option value="receptionist">Receptionist</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-700 hover:text-red-900">×</button>
        </div>
      )}

      {isLoading && !showForm && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <span className="ml-3 text-gray-600">Loading staff...</span>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              <StaffForm
                initialData={editingStaff}
                onSubmit={handleSubmit}
                onCancel={() => { setShowForm(false); setEditingStaff(null); }}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {!isLoading && !showForm && (
        <>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterStatus !== 'all' || filterRole !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by adding your first staff member'}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                Showing {filteredStaff.length} of {staff.length} staff member{staff.length !== 1 ? 's' : ''}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaff.map((member) => (
                  <StaffCard
                    key={member.id}
                    staff={member}
                    onEdit={(m) => { setEditingStaff(m); setShowForm(true); }}
                    onDelete={deleteStaff}
                    onSelect={(m) => { selectStaffMember(m); onStaffSelect?.(m); }}
                    isSelected={selectedStaff?.id === member.id}
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
