import { useBusinessType } from '../../../hooks/useBusinessType';
import {
  BUSINESS_TYPES,
  BUSINESS_TYPE_LABELS,
  BUSINESS_TYPE_DESCRIPTIONS,
  BUSINESS_TYPE_FEATURES,
} from '../../../types/business.types';
import { toast } from 'react-hot-toast';

const BusinessTypeSettings = () => {
  const {
    businessType,
    setBusinessType,
    isRestaurant,
    restaurantSettings,
    updateRestaurantSettings,
  } = useBusinessType();

  const handleBusinessTypeChange = (newType) => {
    setBusinessType(newType);
    toast.success(`Business type changed to ${BUSINESS_TYPE_LABELS[newType]}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Business Type Configuration
        </h2>
        <p className="text-sm text-gray-600">
          Configure your business type to customize features and workflows
        </p>
      </div>

      {/* Business Type Selection */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Select Business Type
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(BUSINESS_TYPES).map((type) => (
            <button
              key={type}
              onClick={() => handleBusinessTypeChange(type)}
              className={`
                p-6 rounded-lg border-2 transition-all text-left
                ${
                  businessType === type
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {BUSINESS_TYPE_LABELS[type]}
                </h3>
                {businessType === type && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 text-white">
                    Active
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {BUSINESS_TYPE_DESCRIPTIONS[type]}
              </p>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Key Features:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {BUSINESS_TYPE_FEATURES[type]?.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg
                        className="w-3 h-3 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant-Specific Settings (Only shown when restaurant mode is active) */}
      {isRestaurant && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Restaurant Settings
          </h3>

          <div className="space-y-4">
            {/* Table Service */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Enable Table Service
                </label>
                <p className="text-xs text-gray-500">
                  Manage tables, seating, and table assignments
                </p>
              </div>
              <button
                onClick={() =>
                  updateRestaurantSettings({
                    enableTableService: !restaurantSettings.enableTableService,
                  })
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${restaurantSettings.enableTableService ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${restaurantSettings.enableTableService ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {/* Kitchen Display */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Enable Kitchen Display System
                </label>
                <p className="text-xs text-gray-500">
                  Send orders to kitchen display for preparation
                </p>
              </div>
              <button
                onClick={() =>
                  updateRestaurantSettings({
                    enableKitchenDisplay: !restaurantSettings.enableKitchenDisplay,
                  })
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${restaurantSettings.enableKitchenDisplay ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${restaurantSettings.enableKitchenDisplay ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {/* Course Management */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Enable Course Management
                </label>
                <p className="text-xs text-gray-500">
                  Organize orders by courses (appetizer, main, dessert)
                </p>
              </div>
              <button
                onClick={() =>
                  updateRestaurantSettings({
                    enableCourseManagement: !restaurantSettings.enableCourseManagement,
                  })
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${restaurantSettings.enableCourseManagement ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${restaurantSettings.enableCourseManagement ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {/* Tipping */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Enable Tipping
                </label>
                <p className="text-xs text-gray-500">
                  Allow customers to add tips to their bill
                </p>
              </div>
              <button
                onClick={() =>
                  updateRestaurantSettings({
                    enableTipping: !restaurantSettings.enableTipping,
                  })
                }
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${restaurantSettings.enableTipping ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${restaurantSettings.enableTipping ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {/* Service Charge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Service Charge (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={restaurantSettings.defaultServiceCharge}
                onChange={(e) =>
                  updateRestaurantSettings({
                    defaultServiceCharge: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Warning Message */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg
            className="h-5 w-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Changing business type will modify the available features and navigation. Some features may be hidden based on your selection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessTypeSettings;
