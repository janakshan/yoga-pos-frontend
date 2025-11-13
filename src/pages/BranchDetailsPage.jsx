/**
 * Branch Details Page
 *
 * Comprehensive view of a single branch with tabs for:
 * - Overview (general info, stats)
 * - Settings (timezone, currency, tax rate)
 * - Operating Hours
 * - Performance (analytics and metrics)
 */

import { useState, useEffect } from 'react';
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

  // Fetch branch details
  useEffect(() => {
    const fetchBranchDetails = async () => {
      if (!id) return;

      setLoading(true);
      try {
        // Fetch main branch data
        const branchData = await branchApiService.getById(id);
        setBranch(branchData);

        // Fetch additional data in parallel
        const [settingsData, hoursData, perfData] = await Promise.allSettled([
          branchApiService.getSettings(id),
          branchApiService.getOperatingHours(id),
          branchApiService.getPerformance(id),
        ]);

        if (settingsData.status === 'fulfilled') {
          setBranchSettings(settingsData.value);
        }
        if (hoursData.status === 'fulfilled') {
          setOperatingHours(hoursData.value);
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
    };

    fetchBranchDetails();
  }, [id]);

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
        {activeTab === 'settings' && <SettingsTab settings={branchSettings || branch.settings} />}
        {activeTab === 'hours' && <OperatingHoursTab hours={operatingHours || branch.settings?.operatingHours} />}
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
          {branch.managerId && (
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <span className="text-gray-500">Manager: </span>
                <span className="text-gray-900">{branch.managerName || 'Assigned'}</span>
              </div>
            </div>
          )}
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
const SettingsTab = ({ settings }) => {
  if (!settings) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <p className="text-gray-500">No settings data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Branch Settings</h2>
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
            <div className="text-gray-900">{settings.taxRate ? `${settings.taxRate}%` : 'Not set'}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Allow Walk-ins</div>
            <div className="text-gray-900">
              {settings.allowWalkins !== undefined ? (settings.allowWalkins ? 'Yes' : 'No') : 'Not set'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Operating Hours Tab Component
const OperatingHoursTab = ({ hours }) => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  if (!hours || Object.keys(hours).length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <p className="text-gray-500">No operating hours configured</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h2>
      <div className="space-y-3">
        {days.map((day) => (
          <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div className="font-medium text-gray-900 capitalize w-32">{day}</div>
            <div className="text-gray-600">
              {hours[day] ? (
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
