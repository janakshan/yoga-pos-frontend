/**
 * Branch Details Page
 *
 * Comprehensive view of a single branch with tabs for:
 * - Overview (general info, stats)
 * - Settings (timezone, currency, tax rate)
 * - Operating Hours
 * - Performance (analytics and metrics)
 */

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  ClockIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useBranch } from '../features/branch/hooks';
import { branchApiService } from '../features/branch/services/branchApiService';
import { BranchForm } from '../features/branch/components/BranchForm';
import { AssignManagerModal } from '../features/branch/components/AssignManagerModal';
import toast from 'react-hot-toast';

const BranchDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateBranch, isLoading: hookLoading } = useBranch();

  const [activeTab, setActiveTab] = useState('overview');
  const [branch, setBranch] = useState(null);
  const [branchSettings, setBranchSettings] = useState(null);
  const [operatingHours, setOperatingHours] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAssignManager, setShowAssignManager] = useState(false);

  // Mock users for manager assignment - In real app, fetch from API
  const [users] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'MANAGER' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'MANAGER' },
    { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'ADMIN' },
  ]);

  // Fetch branch details
  const fetchBranchDetails = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Fetch main branch data
      const branchData = await branchApiService.getById(id);
      console.log('Branch data loaded:', branchData);
      setBranch(branchData);

      // Fetch additional data in parallel
      const [settingsData, hoursData, perfData] = await Promise.allSettled([
        branchApiService.getSettings(id),
        branchApiService.getOperatingHours(id),
        branchApiService.getPerformance(id),
      ]);

      if (settingsData.status === 'fulfilled') {
        // Extract settings from the response - handle nested structure
        // API might return: { settings: { settings: {...} } } or { settings: {...} } or {...}
        let settings = settingsData.value;
        if (settings?.settings) {
          settings = settings.settings;
        }
        // Check if there's another nested level
        if (settings?.settings) {
          settings = settings.settings;
        }
        setBranchSettings(settings);
        console.log('Settings loaded:', settings);
      }
      if (hoursData.status === 'fulfilled') {
        // Extract operatingHours from the response if it's nested
        const hours = hoursData.value?.operatingHours || hoursData.value;
        setOperatingHours(hours);
        console.log('Operating hours loaded:', hours);
      } else if (hoursData.status === 'rejected') {
        console.error('Failed to load operating hours:', hoursData.reason);
      }
      if (perfData.status === 'fulfilled') {
        setPerformance(perfData.value);
      }
    } catch (error) {
      console.error('Error fetching branch details:', error);
      toast.error('Failed to load branch details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBranchDetails();
  }, [fetchBranchDetails]);

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleEditSubmit = async (data) => {
    try {
      await updateBranch(id, data);
      toast.success('Branch updated successfully');
      setShowEditForm(false);

      // Refresh branch data
      const updatedBranch = await branchApiService.getById(id);
      setBranch(updatedBranch);
    } catch (error) {
      console.error('Error updating branch:', error);
      toast.error('Failed to update branch');
    }
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
  };

  const handleToggleActive = async () => {
    const newStatus = !branch.isActive;
    const action = newStatus ? 'activate' : 'deactivate';

    if (!window.confirm(`Are you sure you want to ${action} this branch?`)) {
      return;
    }

    try {
      await updateBranch(id, { isActive: newStatus });
      toast.success(`Branch ${action}d successfully`);

      // Update local state
      setBranch({ ...branch, isActive: newStatus });
    } catch (error) {
      console.error(`Error ${action}ing branch:`, error);
      toast.error(`Failed to ${action} branch`);
    }
  };

  const handleAssignManager = () => {
    setShowAssignManager(true);
  };

  const handleAssignManagerSuccess = () => {
    fetchBranchDetails(); // Refresh branch data to show updated manager
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this branch?')) {
      return;
    }

    try {
      await branchApiService.remove(id);
      toast.success('Branch deleted successfully');
      navigate('/branches');
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast.error('Failed to delete branch');
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BuildingStorefrontIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
    { id: 'hours', name: 'Operating Hours', icon: ClockIcon },
    { id: 'performance', name: 'Performance', icon: ChartBarIcon },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Branch not found</p>
          <button
            onClick={() => navigate('/branches')}
            className="mt-2 text-red-600 hover:text-red-700 font-medium"
          >
            ← Back to Branches
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Edit Form Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Edit Branch
              </h2>
              <BranchForm
                initialData={branch}
                onSubmit={handleEditSubmit}
                onCancel={handleEditCancel}
                isLoading={hookLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Assign Manager Modal */}
      {showAssignManager && branch && (
        <AssignManagerModal
          branch={branch}
          users={users}
          onClose={() => setShowAssignManager(false)}
          onSuccess={handleAssignManagerSuccess}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/branches')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Branches
        </button>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${branch.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
              <BuildingStorefrontIcon className={`h-8 w-8 ${branch.isActive ? 'text-green-600' : 'text-gray-600'}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{branch.name}</h1>
              <p className="text-gray-500">
                {branch.code} • {branch.city}, {branch.state}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleToggleActive}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                branch.isActive
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {branch.isActive ? (
                <>
                  <CheckCircleIcon className="h-4 w-4 inline mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircleIcon className="h-4 w-4 inline mr-1" />
                  Inactive
                </>
              )}
            </button>
            <button
              onClick={handleAssignManager}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <UserIcon className="h-5 w-5 mr-2" />
              Assign Manager
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit
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
        {activeTab === 'overview' && <OverviewTab branch={branch} performance={performance} />}
        {activeTab === 'settings' && <SettingsTab settings={branchSettings || branch.settings} branchId={id} onUpdate={fetchBranchDetails} />}
        {activeTab === 'hours' && <OperatingHoursTab hours={operatingHours || branch.settings?.operatingHours} branchId={id} onUpdate={fetchBranchDetails} />}
        {activeTab === 'performance' && <PerformanceTab performance={performance} />}
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ branch, performance }) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      {performance && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="text-sm text-gray-500">Monthly Revenue</div>
            <div className="text-2xl font-bold text-gray-900">
              ${performance.monthlyRevenue?.toLocaleString() || '0'}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="text-sm text-gray-500">Transactions</div>
            <div className="text-2xl font-bold text-gray-900">
              {performance.transactionCount?.toLocaleString() || '0'}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="text-sm text-gray-500">Staff Count</div>
            <div className="text-2xl font-bold text-gray-900">
              {performance.staffCount || branch.staffCount || '0'}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <div className="text-sm text-gray-500">Avg Ticket Size</div>
            <div className="text-2xl font-bold text-gray-900">
              ${performance.averageTicketSize?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>
      )}

      {/* Contact Information */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="space-y-3">
          <div className="flex items-start">
            <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
            <div>
              <div className="text-gray-900">{branch.address}</div>
              <div className="text-gray-500">
                {branch.city}, {branch.state} {branch.zipCode}
              </div>
              <div className="text-gray-500">{branch.country}</div>
            </div>
          </div>
          <div className="flex items-center">
            <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
            <a href={`tel:${branch.phone}`} className="text-indigo-600 hover:text-indigo-700">
              {branch.phone}
            </a>
          </div>
          <div className="flex items-center">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
            <a href={`mailto:${branch.email}`} className="text-indigo-600 hover:text-indigo-700">
              {branch.email}
            </a>
          </div>
          <div className="flex items-center">
            <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <span className="text-gray-500">Manager: </span>
              <span className="text-gray-900">
                {branch.managerName || branch.manager?.name || (branch.managerId ? 'Assigned' : 'No manager assigned')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-500">Created At</div>
            <div className="text-gray-900">
              {branch.createdAt ? new Date(branch.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Last Updated</div>
            <div className="text-gray-900">
              {branch.updatedAt ? new Date(branch.updatedAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab = ({ settings, branchId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(settings || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(settings || {});
  }, [settings]);

  if (!settings) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <p className="text-gray-500">No settings data available</p>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await branchApiService.updateBranchSettings(branchId, formData);
      toast.success('Settings updated successfully');
      setIsEditing(false);
      onUpdate?.();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(settings);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Branch Settings</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500">Timezone</div>
              <div className="text-gray-900">{settings.timezone || 'Not set'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Currency</div>
              <div className="text-gray-900">{settings.currency || 'Not set'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Tax Rate</div>
              <div className="text-gray-900">{settings.taxRate ? `${(settings.taxRate * 100).toFixed(2)}%` : 'Not set'}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Allow Walk-ins</div>
              <div className="text-gray-900">
                {settings.allowWalkins !== undefined ? (settings.allowWalkins ? 'Yes' : 'No') : 'Not set'}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
              <select
                value={formData.timezone || 'America/Los_Angeles'}
                onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/New_York">Eastern Time</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={formData.currency || 'USD'}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.taxRate ? (formData.taxRate * 100).toFixed(2) : 0}
                onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) / 100 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="e.g., 8.75"
              />
            </div>
            <div className="flex items-center pt-6">
              <input
                type="checkbox"
                id="allowWalkins"
                checked={formData.allowWalkins || false}
                onChange={(e) => setFormData({ ...formData, allowWalkins: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="allowWalkins" className="ml-2 block text-sm text-gray-700">
                Allow Walk-in Customers
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Operating Hours Tab Component
const OperatingHoursTab = ({ hours, branchId, onUpdate }) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(hours || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(hours || {});
  }, [hours]);

  const handleDayToggle = (day) => {
    setFormData({
      ...formData,
      [day]: formData[day] ? null : { open: '09:00', close: '17:00' }
    });
  };

  const handleTimeChange = (day, field, value) => {
    setFormData({
      ...formData,
      [day]: {
        ...formData[day],
        [field]: value
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Clean formData - remove null values and only send days with valid hours
      const cleanedData = Object.keys(formData).reduce((acc, day) => {
        if (formData[day] && formData[day].open && formData[day].close) {
          acc[day] = formData[day];
        }
        return acc;
      }, {});

      const response = await branchApiService.updateOperatingHours(branchId, cleanedData);
      console.log('Operating hours updated:', response);

      toast.success('Operating hours updated successfully');
      setIsEditing(false);

      // Call onUpdate to refresh parent data
      if (onUpdate) {
        await onUpdate();
      }
    } catch (error) {
      console.error('Error updating operating hours:', error);
      toast.error(error?.response?.data?.message || 'Failed to update operating hours');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(hours || {});
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Operating Hours</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <PencilIcon className="h-4 w-4 mr-1" />
            Edit
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="space-y-3">
          {days.map((day) => (
            <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="font-medium text-gray-900 capitalize w-32">{day}</div>
              <div className="text-gray-600">
                {hours && hours[day] ? (
                  <>
                    {hours[day].open} - {hours[day].close}
                  </>
                ) : (
                  <span className="text-gray-400">Closed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {days.map((day) => (
            <div key={day} className="flex items-center gap-4 py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center w-32">
                <input
                  type="checkbox"
                  id={`${day}-open`}
                  checked={!!formData[day]}
                  onChange={() => handleDayToggle(day)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={`${day}-open`} className="ml-2 font-medium text-gray-900 capitalize">
                  {day}
                </label>
              </div>
              {formData[day] ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={formData[day].open || '09:00'}
                    onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={formData[day].close || '17:00'}
                    onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              ) : (
                <div className="flex-1 text-gray-400">Closed</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Performance Tab Component
const PerformanceTab = ({ performance }) => {
  if (!performance) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <p className="text-gray-500">No performance data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Metrics */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500">Monthly Revenue</div>
            <div className="text-2xl font-bold text-green-600">
              ${performance.monthlyRevenue?.toLocaleString() || '0'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Average Ticket Size</div>
            <div className="text-2xl font-bold text-blue-600">
              ${performance.averageTicketSize?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Total Transactions</div>
            <div className="text-2xl font-bold text-purple-600">
              {performance.transactionCount?.toLocaleString() || '0'}
            </div>
          </div>
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Operational Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500">Staff Count</div>
            <div className="text-2xl font-bold text-gray-900">
              {performance.staffCount || '0'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Customer Count</div>
            <div className="text-2xl font-bold text-gray-900">
              {performance.customerCount?.toLocaleString() || '0'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Inventory Value</div>
            <div className="text-2xl font-bold text-gray-900">
              ${performance.inventoryValue?.toLocaleString() || '0'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetailsPage;
