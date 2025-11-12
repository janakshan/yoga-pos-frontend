import { ORDER_STATUS, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '../types/order.types';

const STATUS_STYLES = {
  gray: 'bg-gray-100 text-gray-800 border-gray-300',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  blue: 'bg-blue-100 text-blue-800 border-blue-300',
  orange: 'bg-orange-100 text-orange-800 border-orange-300',
  green: 'bg-green-100 text-green-800 border-green-300',
  teal: 'bg-teal-100 text-teal-800 border-teal-300',
  red: 'bg-red-100 text-red-800 border-red-300',
  purple: 'bg-purple-100 text-purple-800 border-purple-300'
};

/**
 * Order Status Badge Component
 * Displays order status with appropriate styling
 */
export const OrderStatusBadge = ({ status, size = 'md', showBorder = true }) => {
  const label = ORDER_STATUS_LABELS[status] || status;
  const color = ORDER_STATUS_COLORS[status] || 'gray';
  const styles = STATUS_STYLES[color] || STATUS_STYLES.gray;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${styles}
        ${showBorder ? 'border' : ''}
        ${sizeClasses[size]}
      `}
    >
      {label}
    </span>
  );
};

export default OrderStatusBadge;
