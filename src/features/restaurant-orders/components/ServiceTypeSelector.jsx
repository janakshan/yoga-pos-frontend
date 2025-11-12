import { SERVICE_TYPE, SERVICE_TYPE_LABELS } from '../types/order.types';
import {
  HomeIcon,
  ShoppingBagIcon,
  TruckIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

/**
 * Service Type Selector Component
 * Allows selection of order service type (dine-in, takeaway, delivery, online)
 */
export const ServiceTypeSelector = ({ value, onChange, disabled = false }) => {
  const serviceTypes = [
    {
      type: SERVICE_TYPE.DINE_IN,
      label: SERVICE_TYPE_LABELS[SERVICE_TYPE.DINE_IN],
      icon: HomeIcon,
      description: 'Customer dining in restaurant'
    },
    {
      type: SERVICE_TYPE.TAKEAWAY,
      label: SERVICE_TYPE_LABELS[SERVICE_TYPE.TAKEAWAY],
      icon: ShoppingBagIcon,
      description: 'Customer pickup order'
    },
    {
      type: SERVICE_TYPE.DELIVERY,
      label: SERVICE_TYPE_LABELS[SERVICE_TYPE.DELIVERY],
      icon: TruckIcon,
      description: 'Deliver to customer'
    },
    {
      type: SERVICE_TYPE.ONLINE,
      label: SERVICE_TYPE_LABELS[SERVICE_TYPE.ONLINE],
      icon: GlobeAltIcon,
      description: 'Online order'
    }
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Service Type
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {serviceTypes.map((serviceType) => {
          const Icon = serviceType.icon;
          const isSelected = value === serviceType.type;

          return (
            <button
              key={serviceType.type}
              type="button"
              onClick={() => !disabled && onChange(serviceType.type)}
              disabled={disabled}
              className={`
                relative flex flex-col items-center p-4 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <Icon className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">{serviceType.label}</span>
              <span className="text-xs text-gray-500 mt-1 text-center">
                {serviceType.description}
              </span>
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceTypeSelector;
