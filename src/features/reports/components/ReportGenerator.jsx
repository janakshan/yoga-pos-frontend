import { useState, useEffect } from 'react';
import { X, FileText, Calendar, Filter } from 'lucide-react';
import {
  REPORT_TYPES,
  REPORT_TYPE_LABELS,
  REPORT_TYPE_DESCRIPTIONS,
  DATE_RANGE_PRESETS,
  DATE_RANGE_PRESET_LABELS,
  GROUPING_OPTIONS,
  GROUPING_LABELS,
} from '../types';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subDays,
  subWeeks,
  subMonths,
  format,
} from 'date-fns';

/**
 * ReportGenerator Component
 * Form for generating new reports with filters
 */
export const ReportGenerator = ({ onGenerate, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    type: REPORT_TYPES.SALES,
    title: '',
    description: '',
    datePreset: DATE_RANGE_PRESETS.THIS_MONTH,
    startDate: '',
    endDate: '',
    groupBy: GROUPING_OPTIONS.DAY,
    branchId: '',
    staffId: '',
    customerId: '',
    productId: '',
  });

  const [errors, setErrors] = useState({});

  // Update date fields when preset changes
  useEffect(() => {
    if (formData.datePreset !== DATE_RANGE_PRESETS.CUSTOM) {
      const dates = getDateRangeFromPreset(formData.datePreset);
      setFormData((prev) => ({
        ...prev,
        startDate: format(dates.startDate, 'yyyy-MM-dd'),
        endDate: format(dates.endDate, 'yyyy-MM-dd'),
      }));
    }
  }, [formData.datePreset]);

  // Get date range from preset
  const getDateRangeFromPreset = (preset) => {
    const now = new Date();

    switch (preset) {
      case DATE_RANGE_PRESETS.TODAY:
        return {
          startDate: startOfDay(now),
          endDate: endOfDay(now),
        };
      case DATE_RANGE_PRESETS.YESTERDAY:
        return {
          startDate: startOfDay(subDays(now, 1)),
          endDate: endOfDay(subDays(now, 1)),
        };
      case DATE_RANGE_PRESETS.THIS_WEEK:
        return {
          startDate: startOfWeek(now),
          endDate: endOfWeek(now),
        };
      case DATE_RANGE_PRESETS.LAST_WEEK:
        return {
          startDate: startOfWeek(subWeeks(now, 1)),
          endDate: endOfWeek(subWeeks(now, 1)),
        };
      case DATE_RANGE_PRESETS.THIS_MONTH:
        return {
          startDate: startOfMonth(now),
          endDate: endOfMonth(now),
        };
      case DATE_RANGE_PRESETS.LAST_MONTH:
        return {
          startDate: startOfMonth(subMonths(now, 1)),
          endDate: endOfMonth(subMonths(now, 1)),
        };
      default:
        return { startDate: now, endDate: now };
    }
  };

  // Handle field change
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = 'Report type is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (start > end) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Prepare report data
    const reportData = {
      type: formData.type,
      title:
        formData.title ||
        `${REPORT_TYPE_LABELS[formData.type]} - ${format(
          new Date(),
          'MMM dd, yyyy'
        )}`,
      description:
        formData.description || REPORT_TYPE_DESCRIPTIONS[formData.type],
      datePreset: formData.datePreset,
      filters: {
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        groupBy: formData.groupBy,
        ...(formData.branchId && { branchId: formData.branchId }),
        ...(formData.staffId && { staffId: formData.staffId }),
        ...(formData.customerId && { customerId: formData.customerId }),
        ...(formData.productId && { productId: formData.productId }),
      },
    };

    onGenerate?.(reportData);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold text-gray-900">
            Generate New Report
          </h2>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          disabled={isLoading}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.type ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            >
              {Object.entries(REPORT_TYPES).map(([key, value]) => (
                <option key={key} value={value}>
                  {REPORT_TYPE_LABELS[value]}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-500">{errors.type}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {REPORT_TYPE_DESCRIPTIONS[formData.type]}
            </p>
          </div>

          {/* Title (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder={`${REPORT_TYPE_LABELS[formData.type]} - ${format(
                new Date(),
                'MMM dd, yyyy'
              )}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={REPORT_TYPE_DESCRIPTIONS[formData.type]}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Date Range Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">Date Range</h3>
            </div>

            {/* Date Preset */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Select
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(DATE_RANGE_PRESETS)
                  .filter(([_, value]) => value !== DATE_RANGE_PRESETS.CUSTOM)
                  .map(([key, value]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleChange('datePreset', value)}
                      className={`px-3 py-2 text-sm rounded-md border ${
                        formData.datePreset === value
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      disabled={isLoading}
                    >
                      {DATE_RANGE_PRESET_LABELS[value]}
                    </button>
                  ))}
              </div>
            </div>

            {/* Custom Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    handleChange('startDate', e.target.value);
                    handleChange('datePreset', DATE_RANGE_PRESETS.CUSTOM);
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => {
                    handleChange('endDate', e.target.value);
                    handleChange('datePreset', DATE_RANGE_PRESETS.CUSTOM);
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Grouping */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Data By
            </label>
            <select
              value={formData.groupBy}
              onChange={(e) => handleChange('groupBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {Object.entries(GROUPING_OPTIONS).map(([key, value]) => (
                <option key={key} value={value}>
                  {GROUPING_LABELS[value]}
                </option>
              ))}
            </select>
          </div>

          {/* Optional Filters */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 text-gray-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">
                Additional Filters (Optional)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch ID
                </label>
                <input
                  type="text"
                  value={formData.branchId}
                  onChange={(e) => handleChange('branchId', e.target.value)}
                  placeholder="e.g., B001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staff ID
                </label>
                <input
                  type="text"
                  value={formData.staffId}
                  onChange={(e) => handleChange('staffId', e.target.value)}
                  placeholder="e.g., S001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer ID
                </label>
                <input
                  type="text"
                  value={formData.customerId}
                  onChange={(e) => handleChange('customerId', e.target.value)}
                  placeholder="e.g., C001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product ID
                </label>
                <input
                  type="text"
                  value={formData.productId}
                  onChange={(e) => handleChange('productId', e.target.value)}
                  placeholder="e.g., P001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </form>
    </div>
  );
};
