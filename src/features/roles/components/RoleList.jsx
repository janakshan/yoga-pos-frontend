import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Users, Shield, Copy } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import RoleForm from './RoleForm';
import RolePermissionsModal from './RolePermissionsModal';

const RoleList = () => {
  const {
    roles,
    isLoading,
    error,
    stats,
    fetchRoles,
    fetchStats,
    deleteRole,
    cloneRole,
    clearError,
  } = useRoles();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [mode, setMode] = useState('create');

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    await fetchRoles();
    await fetchStats();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleFilterType = (e) => {
    setFilterType(e.target.value);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setMode('create');
    setIsFormOpen(true);
  };

  const handleEdit = (role) => {
    if (role.isSystem) {
      alert('System roles cannot be edited');
      return;
    }
    setSelectedRole(role);
    setMode('edit');
    setIsFormOpen(true);
  };

  const handleManagePermissions = (role) => {
    setSelectedRole(role);
    setIsPermissionsModalOpen(true);
  };

  const handleDelete = async (role) => {
    if (role.isSystem) {
      alert('System roles cannot be deleted');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      return;
    }

    try {
      await deleteRole(role.id);
      await loadRoles();
    } catch (err) {
      // Error already handled by hook
    }
  };

  const handleClone = async (role) => {
    const newName = window.prompt('Enter name for the cloned role:', `${role.name} (Copy)`);
    if (!newName) return;

    try {
      await cloneRole(role.id, newName);
      await loadRoles();
    } catch (err) {
      // Error already handled by hook
    }
  };

  const handleFormClose = async (shouldReload) => {
    setIsFormOpen(false);
    setSelectedRole(null);
    if (shouldReload) {
      await loadRoles();
    }
  };

  const handlePermissionsModalClose = async (shouldReload) => {
    setIsPermissionsModalOpen(false);
    setSelectedRole(null);
    if (shouldReload) {
      await loadRoles();
    }
  };

  // Filter roles
  const filteredRoles = roles.filter((role) => {
    const matchesSearch =
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && role.isActive) ||
      (filterStatus === 'inactive' && !role.isActive);

    const matchesType =
      filterType === 'all' ||
      (filterType === 'system' && role.isSystem) ||
      (filterType === 'custom' && !role.isSystem);

    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading && roles.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading roles...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Total Roles</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Inactive</div>
          <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">System</div>
          <div className="text-2xl font-bold text-blue-600">{stats.system}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm text-gray-600">Custom</div>
          <div className="text-2xl font-bold text-purple-600">{stats.custom}</div>
        </div>
      </div>

      {/* Filters and search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              />
            </div>
          </div>
          <select
            value={filterStatus}
            onChange={handleFilterStatus}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={filterType}
            onChange={handleFilterType}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          >
            <option value="all">All Types</option>
            <option value="system">System</option>
            <option value="custom">Custom</option>
          </select>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Role
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-600 hover:text-red-800">
            ✕
          </button>
        </div>
      )}

      {/* Roles grid */}
      {filteredRoles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Shield className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No roles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all' || filterType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating a new role'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {role.name}
                    </h3>
                    {role.isSystem && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-600 rounded">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 font-mono">{role.code}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded ${
                    role.isActive
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {role.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {role.description}
              </p>

              <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{role.userCount || 0} users</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>{role.permissions?.length || 0} permissions</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleManagePermissions(role)}
                  className="flex-1 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                >
                  Permissions
                </button>
                {!role.isSystem && (
                  <>
                    <button
                      onClick={() => handleEdit(role)}
                      className="px-3 py-2 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleClone(role)}
                      className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(role)}
                      className="px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <RoleForm
              role={selectedRole}
              mode={mode}
              onClose={handleFormClose}
            />
          </div>
        </div>
      )}

      {/* Role Permissions Modal */}
      {isPermissionsModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <RolePermissionsModal
              role={selectedRole}
              onClose={handlePermissionsModalClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleList;
