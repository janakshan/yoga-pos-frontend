/**
 * TableStatusBoard Component
 * Main dashboard for viewing and managing tables
 */

import { useState, useEffect } from 'react';
import { Plus, Grid3x3, List, BarChart3, RefreshCw } from 'lucide-react';
import { useTables } from '../hooks/useTables';
import { TableCard } from './TableCard';
import { TableFilters } from './TableFilters';
import { TableForm } from './TableForm';
import { TableQuickActions } from './TableQuickActions';

export const TableStatusBoard = () => {
  const {
    tables,
    tableStats,
    isLoading,
    fetchTables,
    fetchStats,
    deleteTable,
  } = useTables();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showForm, setShowForm] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableForStatusChange, setTableForStatusChange] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  // Load tables and stats on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([
      fetchTables(activeFilters),
      fetchStats(activeFilters),
    ]);
  };

  const handleFilterChange = async (filters) => {
    setActiveFilters(filters);
    await fetchTables(filters);
    await fetchStats(filters);
  };

  const handleAddTable = () => {
    setSelectedTable(null);
    setShowForm(true);
  };

  const handleEditTable = (table) => {
    setSelectedTable(table);
    setShowForm(true);
  };

  const handleStatusChange = (table) => {
    setTableForStatusChange(table);
  };

  const handleDeleteTable = async (table) => {
    if (window.confirm(`Are you sure you want to delete table ${table.number}?`)) {
      await deleteTable(table.id);
      await loadData();
    }
  };

  const handleFormSuccess = async () => {
    await loadData();
  };

  const handleRefresh = async () => {
    await loadData();
  };

  // Stats Cards
  const statsCards = [
    {
      label: 'Total Tables',
      value: tableStats.totalTables,
      color: 'bg-blue-500',
    },
    {
      label: 'Available',
      value: tableStats.availableTables,
      color: 'bg-green-500',
    },
    {
      label: 'Occupied',
      value: tableStats.occupiedTables,
      color: 'bg-blue-600',
    },
    {
      label: 'Reserved',
      value: tableStats.reservedTables,
      color: 'bg-purple-500',
    },
    {
      label: 'Occupancy',
      value: `${tableStats.occupancyRate}%`,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Table Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitor and manage your restaurant tables
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleAddTable}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Table
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <TableFilters onFilterChange={handleFilterChange} />

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {tables.length} table{tables.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tables Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : tables.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3x3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tables found</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get started by adding your first table
            </p>
            <button
              onClick={handleAddTable}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Table
            </button>
          </div>
        </div>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
              : 'space-y-3'
          }
        >
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onEdit={handleEditTable}
              onStatusChange={handleStatusChange}
              onDelete={() => handleDeleteTable(table)}
            />
          ))}
        </div>
      )}

      {/* Table Form Modal */}
      {showForm && (
        <TableForm
          table={selectedTable}
          onClose={() => {
            setShowForm(false);
            setSelectedTable(null);
          }}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Quick Actions Modal */}
      {tableForStatusChange && (
        <TableQuickActions
          table={tableForStatusChange}
          onClose={() => {
            setTableForStatusChange(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};

export default TableStatusBoard;
