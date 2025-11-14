import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Shield, Key, Eye, RotateCw } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useRoles } from '../../roles/hooks/useRoles';
import { useBranch } from '../../branch/hooks/useBranch';
import UserForm from './UserForm';
import ResetPasswordModal from './ResetPasswordModal';

const UserList = ({ staffOnly = false }) => {
  const navigate = useNavigate();
  const { users, isLoading, error, stats, fetchUsers, fetchStats, deleteUser, resetPassword, clearError } = useUsers();
  const { roles, fetchRoles } = useRoles();
  const { branches, fetchBranches } = useBranch();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState('create');
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchUsers();
    await fetchStats();
    await fetchRoles();
    await fetchBranches();
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setMode('create');
    setIsFormOpen(true);
  };

  const handleView = (user) => {
    navigate(`/users/${user.id}`);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setMode('edit');
    setIsFormOpen(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return;
    }
    try {
      await deleteUser(user.id);
      await loadData();
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleResetPassword = (user) => {
    setUserToResetPassword(user);
    setIsResetPasswordOpen(true);
  };

  const handleResetPasswordSubmit = async (userId, newPassword) => {
    await resetPassword(userId, newPassword);
  };

  const handleResetPasswordClose = () => {
    setIsResetPasswordOpen(false);
    setUserToResetPassword(null);
  };

  const handleFormClose = async (shouldReload) => {
    setIsFormOpen(false);
    setSelectedUser(null);
    if (shouldReload) {
      await loadData();
    }
  };

  // Filter users - ensure users is an array
  const filteredUsers = (Array.isArray(users) ? users : []).filter((user) => {
    // Filter by staffOnly prop
    if (staffOnly && !user.staffProfile) {
      return false;
    }

    const matchesSearch =
      (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.lastName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.staffProfile?.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.staffProfile?.position || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || user.status === filterStatus;

    const matchesRole =
      filterRole === 'all' ||
      (user.roles && Array.isArray(user.roles) && user.roles.some(role => {
        const roleId = typeof role === 'string' ? role : role?.id;
        return roleId === filterRole;
      }));

    return matchesSearch && matchesStatus && matchesRole;
  });

  const getRoleName = (roleId) => {
    if (!roleId) return 'Unknown Role';
    if (!Array.isArray(roles) || roles.length === 0) {
      console.warn('Roles not loaded yet, showing role ID:', roleId);
      return roleId;
    }
    const role = roles.find((r) => r.id === roleId);
    if (!role) {
      console.warn('Role not found for ID:', roleId);
      return roleId;
    }
    return role.name;
  };

  const getBranchName = (user) => {
    // Handle different API response formats
    if (user.branchName) return user.branchName;
    if (user.branch && typeof user.branch === 'object') return user.branch.name;
    if (user.branchId) {
      if (!Array.isArray(branches) || branches.length === 0) return user.branchId;
      const branch = branches.find((b) => b.id === user.branchId);
      return branch ? branch.name : user.branchId;
    }
    return '-';
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">Total Users</div>
          <div className="text-2xl font-bold text-gray-900">{stats?.total || stats?.totalUsers || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold text-green-600">{stats?.active || stats?.activeUsers || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">Inactive</div>
          <div className="text-2xl font-bold text-gray-600">{stats?.inactive || stats?.inactiveUsers || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">Suspended</div>
          <div className="text-2xl font-bold text-red-600">{stats?.suspended || stats?.suspendedUsers || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-sm text-gray-600">Online Today</div>
          <div className="text-2xl font-bold text-blue-600">{stats?.loggedInToday || 0}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg flex justify-between">
          <span>{error}</span>
          <button onClick={clearError}>✕</button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{user.fullName}</div>
                  <div className="text-sm text-gray-500">@{user.username}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {(user.roles && user.roles.length > 0) ? (
                      user.roles.map((role) => {
                        // Handle both role objects and role IDs
                        const roleId = typeof role === 'string' ? role : role?.id;
                        const roleName = typeof role === 'string' ? getRoleName(role) : (role?.name || role?.id || 'Unknown');
                        return (
                          <span
                            key={roleId || Math.random()}
                            className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded"
                          >
                            {roleName}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-sm text-gray-400">No roles assigned</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {getBranchName(user)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-600'
                        : user.status === 'inactive'
                        ? 'bg-gray-100 text-gray-600'
                        : user.status === 'suspended'
                        ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(user)}
                      className="p-2 text-gray-600 hover:text-indigo-600"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                      title="Edit User"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleResetPassword(user)}
                      className="p-2 text-gray-600 hover:text-orange-600"
                      title="Reset Password"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 text-gray-600 hover:text-red-600"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <UserForm user={selectedUser} mode={mode} onClose={handleFormClose} />
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={handleResetPasswordClose}
        user={userToResetPassword}
        onResetPassword={handleResetPasswordSubmit}
      />
    </div>
  );
};

export default UserList;
