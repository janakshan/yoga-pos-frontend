import React, { useState, useEffect } from 'react';
import { Save, Copy, AlertCircle } from 'lucide-react';
import { useBranch } from '../hooks/useBranch.js';
import { branchService } from '../services/branchService.js';

/**
 * BranchSettingsForm Component
 * Form for managing branch-specific settings
 * @param {Object} props - Component props
 * @param {Object} props.branch - Branch object
 * @param {Function} props.onSave - Save handler
 * @param {Function} props.onCancel - Cancel handler
 * @returns {JSX.Element}
 */
export const BranchSettingsForm = ({ branch, onSave, onCancel }) => {
  const { branches } = useBranch();
  const [settings, setSettings] = useState({
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    taxRate: 0.0875,
    allowWalkins: true,
    operatingHours: {
      monday: { open: '09:00', close: '18:00' },
      tuesday: { open: '09:00', close: '18:00' },
      wednesday: { open: '09:00', close: '18:00' },
      thursday: { open: '09:00', close: '18:00' },
      friday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '16:00' },
      sunday: { open: '10:00', close: '16:00' },
    },
  });
  const [loading, setLoading] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);

  useEffect(() => {
    if (branch?.settings) {
      setSettings(branch.settings);
    }
  }, [branch]);

  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setSettings(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await branchService.updateBranchSettings(branch.id, settings);
      onSave(updated);
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopySettings = async (sourceBranchId) => {
    setLoading(true);

    try {
      const updated = await branchService.cloneBranchSettings(sourceBranchId, branch.id);
      setSettings(updated.settings);
      setShowCopyDialog(false);
      alert('Settings copied successfully!');
    } catch (error) {
      console.error('Failed to copy settings:', error);
      alert('Failed to copy settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Branch Settings: {branch?.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Configure branch-specific settings and operating hours
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCopyDialog(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copy from Another Branch
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">General Settings</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/New_York">Eastern Time (ET)</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="GBP">British Pound (GBP)</option>
                <option value="CAD">Canadian Dollar (CAD)</option>
              </select>
            </div>

            {/* Tax Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={(settings.taxRate * 100).toFixed(2)}
                onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) / 100)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Allow Walk-ins */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowWalkins"
                checked={settings.allowWalkins}
                onChange={(e) => handleChange('allowWalkins', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="allowWalkins" className="ml-2 text-sm font-medium text-gray-700">
                Allow Walk-in Customers
              </label>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Operating Hours</h4>

          <div className="space-y-3">
            {daysOfWeek.map((day) => (
              <div key={day} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="capitalize font-medium text-gray-700">{day}</div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Open</label>
                  <input
                    type="time"
                    value={settings.operatingHours[day]?.open || '09:00'}
                    onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Close</label>
                  <input
                    type="time"
                    value={settings.operatingHours[day]?.close || '18:00'}
                    onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={loading}
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>

      {/* Copy Settings Dialog */}
      {showCopyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Copy Settings from Branch
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a branch to copy its settings to {branch?.name}
            </p>

            <div className="space-y-2 mb-6">
              {branches
                .filter(b => b.id !== branch?.id && b.isActive)
                .map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleCopySettings(b.id)}
                    className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium text-gray-900">{b.name}</p>
                    <p className="text-xs text-gray-600">{b.code}</p>
                  </button>
                ))}
            </div>

            <button
              onClick={() => setShowCopyDialog(false)}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchSettingsForm;
