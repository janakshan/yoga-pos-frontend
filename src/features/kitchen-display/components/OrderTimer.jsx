/**
 * Order Timer Component
 *
 * Displays elapsed time since order received with color-coded aging
 */

import { useState, useEffect } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import {
  ORDER_AGING_THRESHOLDS,
  ORDER_AGING_COLORS,
} from '../types/kitchen.types';

/**
 * Order Timer Component
 */
const OrderTimer = ({ order, size = 'md' }) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [agingStatus, setAgingStatus] = useState(ORDER_AGING_COLORS.FRESH);

  useEffect(() => {
    const calculateElapsed = () => {
      const orderTime = new Date(
        order.createdAt || order.confirmedAt || new Date()
      );
      const now = new Date();
      const minutes = Math.floor((now - orderTime) / 60000);
      setElapsedTime(minutes);

      // Update aging status
      if (minutes >= ORDER_AGING_THRESHOLDS.URGENT) {
        setAgingStatus(ORDER_AGING_COLORS.URGENT);
      } else if (minutes >= ORDER_AGING_THRESHOLDS.CRITICAL) {
        setAgingStatus(ORDER_AGING_COLORS.CRITICAL);
      } else if (minutes >= ORDER_AGING_THRESHOLDS.WARNING) {
        setAgingStatus(ORDER_AGING_COLORS.WARNING);
      } else {
        setAgingStatus(ORDER_AGING_COLORS.FRESH);
      }
    };

    // Initial calculation
    calculateElapsed();

    // Update every 30 seconds
    const interval = setInterval(calculateElapsed, 30000);

    return () => clearInterval(interval);
  }, [order]);

  /**
   * Format time display
   */
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  /**
   * Get color classes based on aging status
   */
  const getColorClasses = () => {
    const colors = {
      [ORDER_AGING_COLORS.FRESH]: 'bg-green-100 text-green-800 border-green-300',
      [ORDER_AGING_COLORS.WARNING]:
        'bg-yellow-100 text-yellow-800 border-yellow-300',
      [ORDER_AGING_COLORS.CRITICAL]:
        'bg-orange-100 text-orange-800 border-orange-300',
      [ORDER_AGING_COLORS.URGENT]: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[agingStatus] || colors[ORDER_AGING_COLORS.FRESH];
  };

  /**
   * Get size classes
   */
  const getSizeClasses = () => {
    const sizes = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-3 py-1.5',
      lg: 'text-base px-4 py-2',
    };
    return sizes[size] || sizes.md;
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-lg border-2 font-semibold ${getColorClasses()} ${getSizeClasses()}`}
    >
      <ClockIcon className="h-4 w-4" />
      <span>{formatTime(elapsedTime)}</span>
    </div>
  );
};

export default OrderTimer;
