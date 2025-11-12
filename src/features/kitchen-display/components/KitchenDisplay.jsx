/**
 * Kitchen Display System - Main Component
 *
 * Main interface for Kitchen Display System with real-time order management
 */

import { useState, useEffect } from 'react';
import {
  Squares2X2Icon,
  ListBulletIcon,
  AdjustmentsHorizontalIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowPathIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useKitchenDisplay } from '../hooks/useKitchenDisplay';
import OrderCard from './OrderCard';
import StationSelector from './StationSelector';
import PerformanceMetrics from './PerformanceMetrics';
import { KDS_VIEW_MODE, KDS_SORT_OPTIONS, KDS_SORT_LABELS, KDS_FILTER_OPTIONS } from '../types/kitchen.types';

/**
 * Kitchen Display Component
 */
const KitchenDisplay = () => {
  const [showMetrics, setShowMetrics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const {
    // State
    stations,
    selectedStation,
    orderQueue,
    viewMode,
    sortBy,
    filterStatus,
    soundEnabled,
    isLoading,
    error,
    metrics,

    // Actions
    fetchKitchenOrders,
    startPreparing,
    updateItemStatus,
    markOrderReady,
    bumpOrder,
    printOrder,
    updateOrderPriority,
    fetchMetrics,

    // Settings
    setSelectedStation,
    setViewMode,
    setSortBy,
    setFilterStatus,
    toggleSound,
  } = useKitchenDisplay();

  /**
   * Fetch metrics periodically
   */
  useEffect(() => {
    fetchMetrics(selectedStation, 'today');

    const interval = setInterval(() => {
      fetchMetrics(selectedStation, 'today');
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [selectedStation, fetchMetrics]);

  /**
   * Calculate order counts per station
   */
  const getOrderCountsByStation = () => {
    const counts = {};
    stations.forEach((station) => {
      counts[station.id] = orderQueue.filter((order) =>
        order.items.some((item) => item.kitchenStation === station.id)
      ).length;
    });
    return counts;
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    fetchKitchenOrders();
    fetchMetrics(selectedStation, 'today');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-center">
            <h2 className="text-2xl font-bold mb-2">Error Loading Kitchen Display</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b-4 border-indigo-600">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">
                Kitchen Display System
              </h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Live
              </span>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Refresh */}
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50"
                title="Refresh Orders"
              >
                <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className={`p-2 rounded-lg ${
                  soundEnabled
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-gray-100 text-gray-400'
                }`}
                title={soundEnabled ? 'Disable Sound' : 'Enable Sound'}
              >
                {soundEnabled ? (
                  <SpeakerWaveIcon className="h-5 w-5" />
                ) : (
                  <SpeakerXMarkIcon className="h-5 w-5" />
                )}
              </button>

              {/* View Mode */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode(KDS_VIEW_MODE.GRID)}
                  className={`p-2 rounded ${
                    viewMode === KDS_VIEW_MODE.GRID
                      ? 'bg-white text-indigo-600 shadow'
                      : 'text-gray-600'
                  }`}
                  title="Grid View"
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode(KDS_VIEW_MODE.LIST)}
                  className={`p-2 rounded ${
                    viewMode === KDS_VIEW_MODE.LIST
                      ? 'bg-white text-indigo-600 shadow'
                      : 'text-gray-600'
                  }`}
                  title="List View"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode(KDS_VIEW_MODE.COMPACT)}
                  className={`p-2 rounded ${
                    viewMode === KDS_VIEW_MODE.COMPACT
                      ? 'bg-white text-indigo-600 shadow'
                      : 'text-gray-600'
                  }`}
                  title="Compact View"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Metrics Toggle */}
              <button
                onClick={() => setShowMetrics(!showMetrics)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  showMetrics
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5" />
                  <span>Metrics</span>
                </div>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex items-center gap-4">
            {/* Sort By */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              >
                {Object.entries(KDS_SORT_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Status:</label>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                {Object.entries(KDS_FILTER_OPTIONS).map(([key, value]) => (
                  <button
                    key={value}
                    onClick={() => setFilterStatus(value)}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      filterStatus === value
                        ? 'bg-white text-indigo-600 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Count */}
            <div className="ml-auto text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{orderQueue.length}</span>{' '}
              {orderQueue.length === 1 ? 'order' : 'orders'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-full mx-auto p-6">
        <div className="flex gap-6">
          {/* Sidebar - Station Selector */}
          <div className="w-80 flex-shrink-0">
            <StationSelector
              stations={stations}
              selectedStation={selectedStation}
              onSelectStation={setSelectedStation}
              orderCounts={getOrderCountsByStation()}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Performance Metrics */}
            {showMetrics && (
              <div className="mb-6">
                <PerformanceMetrics metrics={metrics} timeRange="today" />
              </div>
            )}

            {/* Orders Grid/List */}
            {isLoading && orderQueue.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <ArrowPathIcon className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              </div>
            ) : orderQueue.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Squares2X2Icon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Active Orders
                </h3>
                <p className="text-gray-600">
                  {selectedStation
                    ? 'No orders for this station'
                    : 'All orders are complete'}
                </p>
              </div>
            ) : (
              <div
                className={
                  viewMode === KDS_VIEW_MODE.COMPACT
                    ? 'space-y-3'
                    : viewMode === KDS_VIEW_MODE.LIST
                    ? 'space-y-4'
                    : 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                }
              >
                {orderQueue.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    selectedStation={selectedStation}
                    viewMode={viewMode}
                    onStartPreparing={startPreparing}
                    onMarkReady={markOrderReady}
                    onBump={bumpOrder}
                    onPrint={printOrder}
                    onUpdateItemStatus={updateItemStatus}
                    onUpdatePriority={updateOrderPriority}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDisplay;
