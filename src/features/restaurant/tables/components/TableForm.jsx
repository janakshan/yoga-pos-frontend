/**
 * TableForm Component
 * Form for creating and editing tables
 */

import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { useTables } from '../hooks/useTables';
import { useStore } from '@/store';

const SHAPE_OPTIONS = [
  { value: 'square', label: 'Square' },
  { value: 'round', label: 'Round' },
  { value: 'rectangle', label: 'Rectangle' },
  { value: 'oval', label: 'Oval' },
  { value: 'bar', label: 'Bar' },
];

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'out-of-service', label: 'Out of Service' },
];

export const TableForm = ({ table, onClose, onSuccess }) => {
  const { createTable, updateTable, sections, floors, fetchSections, fetchFloors } = useTables();
  const currentBranch = useStore((state) => state.currentBranch);

  const [formData, setFormData] = useState({
    number: '',
    capacity: 4,
    status: 'available',
    shape: 'square',
    section: '',
    floor: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Load sections and floors
  useEffect(() => {
    fetchSections();
    fetchFloors();
  }, [fetchSections, fetchFloors]);

  // Populate form with table data when editing
  useEffect(() => {
    if (table) {
      setFormData({
        number: table.number || '',
        capacity: table.capacity || 4,
        status: table.status || 'available',
        shape: table.shape || 'square',
        section: table.section || '',
        floor: table.floor || '',
        notes: table.notes || '',
      });
    }
  }, [table]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.number.trim()) {
      newErrors.number = 'Table number is required';
    }

    if (!formData.capacity || formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    if (!formData.section) {
      newErrors.section = 'Section is required';
    }

    if (!formData.floor) {
      newErrors.floor = 'Floor is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSaving(true);
    try {
      const tableData = {
        ...formData,
        branchId: currentBranch?.id || 'branch1',
      };

      if (table) {
        // Update existing table
        await updateTable(table.id, tableData);
      } else {
        // Create new table
        await createTable(tableData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to save table:', error);
      setErrors({ submit: error.message || 'Failed to save table' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">
            {table ? 'Edit Table' : 'Add New Table'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Basic Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Table Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => handleChange('number', e.target.value)}
                  placeholder="e.g., T1, Table 5"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.number ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSaving}
                />
                {errors.number && (
                  <p className="text-xs text-red-600 mt-1">{errors.number}</p>
                )}
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity (seats) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.capacity}
                  onChange={(e) => handleChange('capacity', parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.capacity ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSaving}
                />
                {errors.capacity && (
                  <p className="text-xs text-red-600 mt-1">{errors.capacity}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Shape */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Table Shape
                </label>
                <select
                  value={formData.shape}
                  onChange={(e) => handleChange('shape', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSaving}
                >
                  {SHAPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSaving}
                >
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Location</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  list="sections-list"
                  value={formData.section}
                  onChange={(e) => handleChange('section', e.target.value)}
                  placeholder="e.g., Main Dining, Patio"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.section ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSaving}
                />
                <datalist id="sections-list">
                  {sections.map((section) => (
                    <option key={section} value={section} />
                  ))}
                </datalist>
                {errors.section && (
                  <p className="text-xs text-red-600 mt-1">{errors.section}</p>
                )}
              </div>

              {/* Floor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Floor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  list="floors-list"
                  value={formData.floor}
                  onChange={(e) => handleChange('floor', e.target.value)}
                  placeholder="e.g., Ground Floor, 1st Floor"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.floor ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSaving}
                />
                <datalist id="floors-list">
                  {floors.map((floor) => (
                    <option key={floor} value={floor} />
                  ))}
                </datalist>
                {errors.floor && (
                  <p className="text-xs text-red-600 mt-1">{errors.floor}</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Additional Information</h3>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Add any special notes or requirements..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : table ? 'Update Table' : 'Create Table'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableForm;
