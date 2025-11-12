/**
 * TableStatusBadge Component
 * Displays a color-coded badge for table status
 */

const STATUS_CONFIG = {
  available: {
    label: 'Available',
    className: 'bg-green-100 text-green-800 border-green-200',
    dotColor: 'bg-green-500',
  },
  occupied: {
    label: 'Occupied',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
    dotColor: 'bg-blue-500',
  },
  reserved: {
    label: 'Reserved',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
    dotColor: 'bg-purple-500',
  },
  cleaning: {
    label: 'Cleaning',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    dotColor: 'bg-yellow-500',
  },
  'out-of-service': {
    label: 'Out of Service',
    className: 'bg-red-100 text-red-800 border-red-200',
    dotColor: 'bg-red-500',
  },
};

export const TableStatusBadge = ({ status, showDot = true, size = 'md' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.available;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.className} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span
          className={`rounded-full ${config.dotColor} ${dotSizeClasses[size]}`}
          aria-hidden="true"
        />
      )}
      <span>{config.label}</span>
    </span>
  );
};

export default TableStatusBadge;
