import { useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Mock table data - TODO: Replace with actual table management
const MOCK_TABLES = [
  { id: 'table_001', name: 'Table 1', capacity: 2, section: 'Main', status: 'available' },
  { id: 'table_002', name: 'Table 2', capacity: 4, section: 'Main', status: 'available' },
  { id: 'table_003', name: 'Table 3', capacity: 4, section: 'Main', status: 'occupied' },
  { id: 'table_004', name: 'Table 4', capacity: 6, section: 'Main', status: 'available' },
  { id: 'table_005', name: 'Table 5', capacity: 2, section: 'Patio', status: 'occupied' },
  { id: 'table_006', name: 'Table 6', capacity: 4, section: 'Patio', status: 'available' },
  { id: 'table_007', name: 'Table 7', capacity: 4, section: 'Patio', status: 'available' },
  { id: 'table_008', name: 'Table 8', capacity: 8, section: 'Private', status: 'available' },
  { id: 'table_009', name: 'Table 9', capacity: 6, section: 'Private', status: 'reserved' },
  { id: 'table_010', name: 'Table 10', capacity: 2, section: 'Bar', status: 'available' },
];

const TABLE_STATUS_COLORS = {
  available: 'bg-green-100 text-green-800 border-green-300',
  occupied: 'bg-red-100 text-red-800 border-red-300',
  reserved: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  cleaning: 'bg-gray-100 text-gray-800 border-gray-300'
};

/**
 * Table Selector Component
 * Allows selection of table for dine-in orders
 */
export const TableSelector = ({ value, onChange, disabled = false, showOccupied = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');

  // Get unique sections
  const sections = useMemo(() => {
    const sectionSet = new Set(MOCK_TABLES.map((table) => table.section));
    return ['all', ...Array.from(sectionSet)];
  }, []);

  // Filter tables
  const filteredTables = useMemo(() => {
    let tables = MOCK_TABLES;

    // Filter by section
    if (selectedSection !== 'all') {
      tables = tables.filter((table) => table.section === selectedSection);
    }

    // Filter by search query
    if (searchQuery) {
      tables = tables.filter((table) =>
        table.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by availability
    if (!showOccupied) {
      tables = tables.filter((table) => table.status === 'available');
    }

    return tables;
  }, [selectedSection, searchQuery, showOccupied]);

  const handleTableSelect = (table) => {
    if (!disabled && (showOccupied || table.status === 'available')) {
      onChange(table.id, table.name);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Select Table
      </label>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Section Filter */}
        <div className="w-full sm:w-48">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sections.map((section) => (
              <option key={section} value={section}>
                {section === 'all' ? 'All Sections' : section}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto">
        {filteredTables.map((table) => {
          const isSelected = value === table.id;
          const isDisabled = disabled || (!showOccupied && table.status !== 'available');
          const statusColor = TABLE_STATUS_COLORS[table.status] || TABLE_STATUS_COLORS.available;

          return (
            <button
              key={table.id}
              type="button"
              onClick={() => handleTableSelect(table)}
              disabled={isDisabled}
              className={`
                relative flex flex-col items-center p-4 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : `border-gray-200 ${statusColor}`
                }
                ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-md'
                }
              `}
            >
              {/* Table Icon */}
              <div className="w-12 h-12 mb-2 flex items-center justify-center">
                <svg
                  className="w-10 h-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="10" width="20" height="8" rx="2" />
                  <path d="M4 18v3M20 18v3M8 18v3M16 18v3" strokeWidth="2" stroke="currentColor" />
                </svg>
              </div>

              {/* Table Info */}
              <span className="text-sm font-semibold">{table.name}</span>
              <span className="text-xs text-gray-500">
                {table.capacity} seats
              </span>

              {/* Status Badge */}
              <span className={`
                mt-2 px-2 py-0.5 text-xs font-medium rounded-full
                ${statusColor}
              `}>
                {table.status}
              </span>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTables.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No tables found</p>
          {!showOccupied && (
            <p className="text-sm mt-1">Try showing occupied tables</p>
          )}
        </div>
      )}

      {/* Selected Table Info */}
      {value && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            Selected: <span className="font-semibold">
              {MOCK_TABLES.find((t) => t.id === value)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default TableSelector;
