/**
 * TableFilters Component
 * Filter and search tables by various criteria
 */

import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useTables } from '../hooks/useTables';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'out-of-service', label: 'Out of Service' },
];

export const TableFilters = ({ onFilterChange }) => {
  const { sections, floors, fetchSections, fetchFloors, clearTableFilters } = useTables();

  const [filters, setFilters] = useState({
    status: '',
    section: '',
    floor: '',
    search: '',
    minCapacity: '',
    maxCapacity: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load sections and floors on mount
  useEffect(() => {
    fetchSections();
    fetchFloors();
  }, [fetchSections, fetchFloors]);

  // Notify parent of filter changes
  useEffect(() => {
    const activeFilters = {};
    if (filters.status) activeFilters.status = filters.status;
    if (filters.section) activeFilters.section = filters.section;
    if (filters.floor) activeFilters.floor = filters.floor;
    if (filters.search) activeFilters.search = filters.search;
    if (filters.minCapacity) activeFilters.minCapacity = parseInt(filters.minCapacity);
    if (filters.maxCapacity) activeFilters.maxCapacity = parseInt(filters.maxCapacity);

    onFilterChange?.(activeFilters);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      section: '',
      floor: '',
      search: '',
      minCapacity: '',
      maxCapacity: '',
    });
    clearTableFilters();
  };

  const hasActiveFilters =
    filters.status ||
    filters.section ||
    filters.floor ||
    filters.search ||
    filters.minCapacity ||
    filters.maxCapacity;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tables..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
            ${showAdvanced ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          `}
        >
          <Filter className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t">
          {/* Section Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              value={filters.section}
              onChange={(e) => handleFilterChange('section', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Sections</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          </div>

          {/* Floor Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Floor
            </label>
            <select
              value={filters.floor}
              onChange={(e) => handleFilterChange('floor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Floors</option>
              {floors.map((floor) => (
                <option key={floor} value={floor}>
                  {floor}
                </option>
              ))}
            </select>
          </div>

          {/* Min Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Capacity
            </label>
            <input
              type="number"
              min="1"
              placeholder="Min"
              value={filters.minCapacity}
              onChange={(e) => handleFilterChange('minCapacity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Max Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Capacity
            </label>
            <input
              type="number"
              min="1"
              placeholder="Max"
              value={filters.maxCapacity}
              onChange={(e) => handleFilterChange('maxCapacity', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-3 border-t">
          <span className="text-sm font-medium text-gray-700">Active filters:</span>
          {filters.status && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Status: {STATUS_OPTIONS.find((o) => o.value === filters.status)?.label}
            </span>
          )}
          {filters.section && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Section: {filters.section}
            </span>
          )}
          {filters.floor && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Floor: {filters.floor}
            </span>
          )}
          {filters.search && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Search: {filters.search}
            </span>
          )}
          {(filters.minCapacity || filters.maxCapacity) && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Capacity: {filters.minCapacity || '0'}-{filters.maxCapacity || '∞'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TableFilters;
