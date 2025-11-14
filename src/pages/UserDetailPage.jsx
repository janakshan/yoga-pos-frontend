/**
 * User Details Page
 *
 * Comprehensive view of a single user with tabs for:
 * - Overview (general info, contact details)
 * - Roles & Permissions
 * - Activity Log
 * - Staff Profile (if applicable)
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  UserIcon,
  ShieldCheckIcon,
  ClockIcon,
  BriefcaseIcon,
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  XCircleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { useUsers } from '../features/users/hooks/useUsers';
import { useRoles } from '../features/roles/hooks/useRoles';
import { useBranch } from '../features/branch/hooks/useBranch';
import UserForm from '../features/users/components/UserForm';
import ResetPasswordModal from '../features/users/components/ResetPasswordModal';
import toast from 'react-hot-toast';

const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchUserById, deleteUser, updateUserById, resetPassword, isLoading } = useUsers();
  const { roles, fetchRoles } = useRoles();
  const { branches, fetchBranches } = useBranch();

  const [activeTab, setActiveTab] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  // Fetch user details
  const fetchUserDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const userData = await fetchUserById(id);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  }, [id, fetchUserById]);

  useEffect(() => {
    fetchUserDetails();
    fetchRoles();
    fetchBranches();
  }, [fetchUserDetails, fetchRoles, fetchBranches]);

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleEditClose = async (shouldReload) => {
    setShowEditForm(false);
    if (shouldReload) {
      await fetchUserDetails();
    }
  };

  const handleToggleActive = async () => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    if (!window.confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    try {
      await updateUserById(id, { status: newStatus });
      toast.success(`User ${action}d successfully`);
      setUser({ ...user, status: newStatus });
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete user "${user.username}"?`)) {
      return;
    }

    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      navigate('/users');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleResetPassword = () => {
    setShowResetPasswordModal(true);
  };

  const handleResetPasswordSubmit = async (userId, newPassword) => {
    await resetPassword(userId, newPassword);
  };

  const handleResetPasswordClose = () => {
    setShowResetPasswordModal(false);
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: UserIcon },
    { id: 'roles', name: 'Roles & Permissions', icon: ShieldCheckIcon },
    { id: 'activity', name: 'Activity Log', icon: ClockIcon },
  ];

  // Add staff profile tab if user has staff profile
  if (user?.staffProfile) {
    tabs.push({ id: 'staff', name: 'Staff Profile', icon: BriefcaseIcon });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">User not found</p>
          <button
            onClick={() => navigate('/users')}
            className="mt-2 text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Users
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <ResetPasswordModal
          isOpen={true}
          onClose={handleResetPasswordClose}
          user={user}
          onResetPassword={handleResetPasswordSubmit}
        />
      )}

      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <UserForm user={user} mode="edit" onClose={handleEditClose} />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/users')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Users
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${user.status === 'active' ? 'bg-green-100' : 'bg-gray-100'}`}>
              <UserIcon className={`h-8 w-8 ${user.status === 'active' ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{user.fullName || `${user.firstName} ${user.lastName}`}</h1>
              <p className="text-gray-500">@{user.username}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleActive}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${getStatusColor(user.status)} hover:opacity-80`}
            >
              {user.status === 'active' ? (
                <>
                  <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircleIcon className="h-4 w-4 inline mr-1" />
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </>
              )}
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit
            </button>
            <button
              onClick={handleResetPassword}
              className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
            >
              <KeyIcon className="h-5 w-5 mr-2" />
              Reset Password
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && <OverviewTab user={user} branches={branches} />}
        {activeTab === 'roles' && <RolesTab user={user} roles={roles} />}
        {activeTab === 'activity' && <ActivityTab user={user} />}
        {activeTab === 'staff' && user.staffProfile && <StaffProfileTab user={user} />}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ user, branches }) => {
  const getBranchName = (user) => {
    if (user.branchName) return user.branchName;
    if (user.branch && typeof user.branch === 'object') return user.branch.name;
    if (user.branchId && Array.isArray(branches)) {
      const branch = branches.find((b) => b.id === user.branchId);
      return branch ? branch.name : user.branchId;
    }
    return 'No branch assigned';
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="space-y-3">
          <div className="flex items-center">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <a href={`mailto:${user.email}`} className="text-indigo-600 hover:text-indigo-700">
                {user.email}
              </a>
            </div>
          </div>
          {user.phone && (
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Phone</div>
                <a href={`tel:${user.phone}`} className="text-indigo-600 hover:text-indigo-700">
                  {user.phone}
                </a>
              </div>
            </div>
          )}
          <div className="flex items-center">
            <BuildingStorefrontIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <div className="text-sm text-gray-500">Branch</div>
              <div className="text-gray-900">{getBranchName(user)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Username</div>
            <div className="text-gray-900">@{user.username}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Status</div>
            <div className="text-gray-900">{user.status.charAt(0).toUpperCase() + user.status.slice(1)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Created At</div>
            <div className="text-gray-900">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Last Updated</div>
            <div className="text-gray-900">
              {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
          {user.lastLogin && (
            <div>
              <div className="text-sm text-gray-500">Last Login</div>
              <div className="text-gray-900">
                {new Date(user.lastLogin).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Roles Tab Component
const RolesTab = ({ user, roles }) => {
  const userRoles = (user.roles || []).map((role) => {
    if (typeof role === 'string') {
      return roles.find((r) => r.id === role) || { id: role, name: role };
    }
    return role;
  });

  return (
    <div className="space-y-6">
      {/* Assigned Roles */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Roles</h2>
        {userRoles.length > 0 ? (
          <div className="space-y-4">
            {userRoles.map((role) => (
              <div key={role.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-medium text-gray-900">{role.name}</h3>
                  </div>
                  {role.isSystem && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                      System Role
                    </span>
                  )}
                </div>
                {role.description && (
                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                )}
                {role.permissions && role.permissions.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Permissions:</div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => {
                        const permName = typeof permission === 'string' ? permission : permission.name || permission.code;
                        return (
                          <span
                            key={typeof permission === 'string' ? permission : permission.id}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {permName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No roles assigned</p>
        )}
      </div>
    </div>
  );
};

// Activity Tab Component
const ActivityTab = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Log</h2>
        <div className="space-y-4">
          {user.lastLogin && (
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ClockIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Last Login</p>
                <p className="text-sm text-gray-500">
                  {new Date(user.lastLogin).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          {user.createdAt && (
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <UserIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Account Created</p>
                <p className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          {user.updatedAt && user.updatedAt !== user.createdAt && (
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <PencilIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Last Updated</p>
                <p className="text-sm text-gray-500">
                  {new Date(user.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>Detailed activity logs coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Staff Profile Tab Component
const StaffProfileTab = ({ user }) => {
  const { staffProfile } = user;

  if (!staffProfile) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <p className="text-gray-500">No staff profile available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Staff Information</h2>
        <div className="grid grid-cols-2 gap-4">
          {staffProfile.employeeId && (
            <div>
              <div className="text-sm text-gray-500">Employee ID</div>
              <div className="text-gray-900">{staffProfile.employeeId}</div>
            </div>
          )}
          {staffProfile.position && (
            <div>
              <div className="text-sm text-gray-500">Position</div>
              <div className="text-gray-900">{staffProfile.position}</div>
            </div>
          )}
          {staffProfile.department && (
            <div>
              <div className="text-sm text-gray-500">Department</div>
              <div className="text-gray-900">{staffProfile.department}</div>
            </div>
          )}
          {staffProfile.hireDate && (
            <div>
              <div className="text-sm text-gray-500">Hire Date</div>
              <div className="text-gray-900">
                {new Date(staffProfile.hireDate).toLocaleDateString()}
              </div>
            </div>
          )}
          {staffProfile.salary && (
            <div>
              <div className="text-sm text-gray-500">Salary</div>
              <div className="text-gray-900">${staffProfile.salary.toLocaleString()}</div>
            </div>
          )}
          {staffProfile.manager && (
            <div>
              <div className="text-sm text-gray-500">Manager</div>
              <div className="text-gray-900">{staffProfile.manager}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
