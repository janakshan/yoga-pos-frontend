import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Key } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useRoles } from '../../roles/hooks/useRoles';
import UserForm from './UserForm';

const UserList = () => {
  const { users, isLoading, error, stats, fetchUsers, fetchStats, deleteUser, clearError } = useUsers();
  const { roles, fetchRoles } = useRoles();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mode, setMode] = useState('create');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchUsers();
    await fetchStats();
    await fetchRoles();
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setMode('create');
    setIsFormOpen(true);
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

  const handleFormClose = async (shouldReload) => {
    setIsFormOpen(false);
    setSelectedUser(null);
    if (shouldReload) {
      await loadData();
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'all' || user.status === filterStatus;

    const matchesRole =
      filterRole === 'all' || user.roles.includes(filterRole);

    return matchesSearch && matchesStatus && matchesRole;
  });

  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.id === roleId);
    return role ? role.name : roleId;
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600 dark:text-gray-400">Active</div>
          <div className="text-2xl font-bold text-green-600">{stats.active}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600 dark:text-gray-400">Inactive</div>
          <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600 dark:text-gray-400">Suspended</div>
          <div className="text-2xl font-bold text-red-600">{stats.suspended}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600 dark:text-gray-400">Online Today</div>
          <div className="text-2xl font-bold text-blue-600">{stats.loggedInToday}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-2 border rounded-lg">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-2 border rounded-lg">
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Branch</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-white">{user.fullName}</div>
                  <div className="text-sm text-gray-500">@{user.username}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                  <div className="text-sm text-gray-500">{user.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((roleId) => (
                      <span
                        key={roleId}
                        className="px-2 py-1 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded"
                      >
                        {getRoleName(roleId)}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  {user.branchName || '-'}
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
                      onClick={() => handleEdit(user)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 text-gray-600 hover:text-red-600"
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <UserForm user={selectedUser} mode={mode} onClose={handleFormClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
