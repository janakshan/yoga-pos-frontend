/**
 * Station Selector Component
 *
 * Allows selection of kitchen station to filter orders
 */

import { FireIcon, BeakerIcon, CubeIcon } from '@heroicons/react/24/outline';
import { KITCHEN_STATION_LABELS, KITCHEN_STATION_COLORS } from '../types/kitchen.types';

/**
 * Station Icon Map
 */
const StationIcons = {
  hot_kitchen: FireIcon,
  cold_kitchen: BeakerIcon,
  grill: FireIcon,
  bar: CubeIcon,
  dessert: CubeIcon,
  prep: BeakerIcon,
};

/**
 * Station Selector Component
 */
const StationSelector = ({ stations, selectedStation, onSelectStation, orderCounts = {} }) => {
  /**
   * Get station color classes
   */
  const getStationColor = (stationType, isSelected) => {
    const colors = {
      hot_kitchen: isSelected
        ? 'bg-red-600 text-white border-red-700'
        : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
      cold_kitchen: isSelected
        ? 'bg-blue-600 text-white border-blue-700'
        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      grill: isSelected
        ? 'bg-orange-600 text-white border-orange-700'
        : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      bar: isSelected
        ? 'bg-purple-600 text-white border-purple-700'
        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      dessert: isSelected
        ? 'bg-pink-600 text-white border-pink-700'
        : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
      prep: isSelected
        ? 'bg-green-600 text-white border-green-700'
        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
    };
    return colors[stationType] || colors.hot_kitchen;
  };

  /**
   * Get total order count for all stations
   */
  const getTotalOrders = () => {
    return Object.values(orderCounts).reduce((sum, count) => sum + count, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Kitchen Stations</h3>

      <div className="space-y-2">
        {/* All Stations Option */}
        <button
          onClick={() => onSelectStation(null)}
          className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
            selectedStation === null
              ? 'bg-indigo-600 text-white border-indigo-700 shadow-md'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                selectedStation === null ? 'bg-indigo-500' : 'bg-gray-200'
              }`}
            >
              <CubeIcon className="h-5 w-5" />
            </div>
            <span className="font-semibold">All Stations</span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              selectedStation === null
                ? 'bg-indigo-500 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {getTotalOrders()}
          </span>
        </button>

        {/* Individual Stations */}
        {stations
          .filter((station) => station.enabled)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((station) => {
            const Icon = StationIcons[station.type] || CubeIcon;
            const isSelected = selectedStation === station.id;
            const orderCount = orderCounts[station.id] || 0;

            return (
              <button
                key={station.id}
                onClick={() => onSelectStation(station.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${getStationColor(
                  station.type,
                  isSelected
                )}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isSelected
                        ? 'bg-white bg-opacity-20'
                        : 'bg-white bg-opacity-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{station.name}</div>
                    {station.printerName && (
                      <div
                        className={`text-xs ${
                          isSelected ? 'text-white text-opacity-80' : 'text-gray-500'
                        }`}
                      >
                        {station.printerName}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {orderCount > 0 && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        isSelected
                          ? 'bg-white bg-opacity-20 text-white'
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      {orderCount}
                    </span>
                  )}
                  {!station.enabled && (
                    <span className="text-xs text-gray-400">(Disabled)</span>
                  )}
                </div>
              </button>
            );
          })}
      </div>
    </div>
  );
};

export default StationSelector;
