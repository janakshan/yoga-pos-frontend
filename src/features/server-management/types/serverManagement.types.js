/**
 * Server Management Types
 * Defines types for server assignments, shifts, sections, and performance tracking
 */

/**
 * Shift Status
 * @typedef {'scheduled' | 'active' | 'completed' | 'cancelled'} ShiftStatus
 */
export const SHIFT_STATUS = {
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

/**
 * Section Type
 * @typedef {'dining_room' | 'patio' | 'bar' | 'private_room' | 'vip'} SectionType
 */
export const SECTION_TYPE = {
  DINING_ROOM: 'dining_room',
  PATIO: 'patio',
  BAR: 'bar',
  PRIVATE_ROOM: 'private_room',
  VIP: 'vip'
};

/**
 * Server Assignment Type
 * @typedef {Object} ServerAssignment
 * @property {string} id - Unique identifier
 * @property {string} serverId - User ID of the server
 * @property {string} serverName - Full name of server
 * @property {string} shiftId - Associated shift ID
 * @property {string[]} sectionIds - Assigned section IDs
 * @property {string[]} tableIds - Assigned table IDs
 * @property {number} maxTables - Maximum tables allowed
 * @property {number} currentTables - Currently occupied tables
 * @property {boolean} isActive - Whether assignment is active
 * @property {Date} assignedAt - When assignment was made
 * @property {Date} unassignedAt - When assignment ended
 * @property {string} assignedBy - User ID who made assignment
 * @property {string} notes - Assignment notes
 * @property {string} branchId - Branch ID
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * Server Shift Type
 * @typedef {Object} ServerShift
 * @property {string} id - Unique identifier
 * @property {string} serverId - User ID of the server
 * @property {string} serverName - Full name of server
 * @property {ShiftStatus} status - Shift status
 * @property {Date} scheduledStart - Scheduled start time
 * @property {Date} scheduledEnd - Scheduled end time
 * @property {Date} actualStart - Actual clock-in time
 * @property {Date} actualEnd - Actual clock-out time
 * @property {number} duration - Shift duration in minutes
 * @property {number} breakDuration - Break time in minutes
 * @property {string[]} breakPeriods - Array of break period objects
 * @property {ServerPerformance} performance - Shift performance metrics
 * @property {string} notes - Shift notes
 * @property {string} branchId - Branch ID
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {string} createdBy - User ID who created shift
 */

/**
 * Break Period Type
 * @typedef {Object} BreakPeriod
 * @property {string} id - Unique identifier
 * @property {Date} startTime - Break start time
 * @property {Date} endTime - Break end time
 * @property {number} duration - Break duration in minutes
 * @property {string} type - Break type (meal, rest, etc.)
 * @property {string} notes - Break notes
 */

/**
 * Section Type
 * @typedef {Object} Section
 * @property {string} id - Unique identifier
 * @property {string} name - Section name
 * @property {SectionType} type - Section type
 * @property {string} description - Section description
 * @property {number} capacity - Total capacity
 * @property {string[]} tableIds - Table IDs in section
 * @property {number} tableCount - Number of tables
 * @property {string} floor - Floor/level
 * @property {boolean} isActive - Whether section is active
 * @property {string} assignedServerId - Currently assigned server ID
 * @property {string} assignedServerName - Currently assigned server name
 * @property {Object} coordinates - Section coordinates/boundaries
 * @property {string} color - Section color for visualization
 * @property {number} priority - Section priority
 * @property {string} notes - Section notes
 * @property {string} branchId - Branch ID
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * Server Performance Type
 * @typedef {Object} ServerPerformance
 * @property {string} id - Unique identifier
 * @property {string} serverId - User ID of the server
 * @property {string} serverName - Full name of server
 * @property {string} shiftId - Associated shift ID (if specific to shift)
 * @property {Date} startDate - Performance period start
 * @property {Date} endDate - Performance period end
 * @property {number} totalOrders - Total orders handled
 * @property {number} completedOrders - Successfully completed orders
 * @property {number} cancelledOrders - Cancelled orders
 * @property {number} totalSales - Total sales amount
 * @property {number} averageOrderValue - Average order value
 * @property {number} totalTips - Total tips received
 * @property {number} averageTipAmount - Average tip amount
 * @property {number} tipPercentage - Average tip percentage
 * @property {number} tablesServed - Number of tables served
 * @property {number} guestsServed - Number of guests served
 * @property {number} averageServiceTime - Average order completion time (minutes)
 * @property {number} averageTableTurnover - Average table turnover time (minutes)
 * @property {number} customerSatisfactionScore - Customer satisfaction rating
 * @property {number} orderAccuracy - Order accuracy percentage
 * @property {number} upsellAmount - Additional sales from upselling
 * @property {Object} breakdown - Detailed breakdown by service type, time, etc.
 * @property {string} notes - Performance notes
 * @property {string} branchId - Branch ID
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 */

/**
 * Server Order History Type
 * @typedef {Object} ServerOrderHistory
 * @property {string} id - Order ID
 * @property {string} orderNumber - Order number
 * @property {string} serverId - Server ID
 * @property {string} serverName - Server name
 * @property {string} tableId - Table ID
 * @property {string} tableName - Table name
 * @property {Date} createdAt - Order creation time
 * @property {Date} completedAt - Order completion time
 * @property {number} serviceTime - Service time in minutes
 * @property {number} subtotal - Order subtotal
 * @property {number} tax - Tax amount
 * @property {number} tip - Tip amount
 * @property {number} total - Total amount
 * @property {number} tipPercentage - Tip percentage
 * @property {string} status - Order status
 * @property {string} serviceType - Service type
 * @property {number} guestCount - Number of guests
 * @property {number} itemCount - Number of items
 * @property {string} paymentMethod - Payment method
 * @property {Object} customer - Customer information
 * @property {string} notes - Order notes
 */

/**
 * Server Tip Tracking Type
 * @typedef {Object} ServerTip
 * @property {string} id - Unique identifier
 * @property {string} serverId - Server ID
 * @property {string} serverName - Server name
 * @property {string} orderId - Order ID
 * @property {string} orderNumber - Order number
 * @property {Date} date - Tip date
 * @property {number} orderAmount - Order amount before tip
 * @property {number} tipAmount - Tip amount
 * @property {number} tipPercentage - Tip percentage
 * @property {string} tipType - Tip type (cash, card, split)
 * @property {string} paymentMethod - Payment method
 * @property {string} shiftId - Associated shift ID
 * @property {boolean} isShared - Whether tip is shared
 * @property {Object[]} splits - Tip split information
 * @property {string} notes - Tip notes
 * @property {string} branchId - Branch ID
 * @property {Date} createdAt - Creation timestamp
 */

/**
 * Server Report Type
 * @typedef {Object} ServerReport
 * @property {string} id - Unique identifier
 * @property {string} reportType - Report type (daily, weekly, monthly, custom)
 * @property {string} serverId - Server ID (if individual report)
 * @property {string} serverName - Server name
 * @property {Date} startDate - Report start date
 * @property {Date} endDate - Report end date
 * @property {ServerPerformance} performance - Performance metrics
 * @property {Object} comparison - Comparison with previous period
 * @property {Object} rankings - Server rankings
 * @property {Object[]} dailyBreakdown - Daily performance breakdown
 * @property {Object[]} topItems - Top selling items
 * @property {Object} insights - AI-generated insights
 * @property {string} generatedBy - User who generated report
 * @property {Date} generatedAt - Report generation time
 */

/**
 * Server Assignment Filter Type
 * @typedef {Object} ServerAssignmentFilter
 * @property {string} serverId - Filter by server ID
 * @property {string} sectionId - Filter by section ID
 * @property {boolean} isActive - Filter by active status
 * @property {Date} startDate - Filter by start date
 * @property {Date} endDate - Filter by end date
 * @property {string} branchId - Filter by branch ID
 */

/**
 * Server Shift Filter Type
 * @typedef {Object} ServerShiftFilter
 * @property {string} serverId - Filter by server ID
 * @property {ShiftStatus} status - Filter by shift status
 * @property {Date} startDate - Filter by start date
 * @property {Date} endDate - Filter by end date
 * @property {string} branchId - Filter by branch ID
 */

/**
 * Server Performance Filter Type
 * @typedef {Object} ServerPerformanceFilter
 * @property {string} serverId - Filter by server ID
 * @property {Date} startDate - Filter by start date
 * @property {Date} endDate - Filter by end date
 * @property {string} shiftId - Filter by shift ID
 * @property {string} branchId - Filter by branch ID
 */

/**
 * Helper function to calculate shift duration
 * @param {Date} start - Start time
 * @param {Date} end - End time
 * @returns {number} Duration in minutes
 */
export const calculateShiftDuration = (start, end) => {
  if (!start || !end) return 0;
  return Math.round((new Date(end) - new Date(start)) / (1000 * 60));
};

/**
 * Helper function to calculate tip percentage
 * @param {number} tipAmount - Tip amount
 * @param {number} orderAmount - Order amount
 * @returns {number} Tip percentage
 */
export const calculateTipPercentage = (tipAmount, orderAmount) => {
  if (!orderAmount || orderAmount === 0) return 0;
  return Math.round((tipAmount / orderAmount) * 100 * 100) / 100;
};

/**
 * Helper function to format shift time
 * @param {number} minutes - Minutes
 * @returns {string} Formatted time (e.g., "2h 30m")
 */
export const formatShiftTime = (minutes) => {
  if (!minutes) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Helper function to get shift status badge color
 * @param {ShiftStatus} status - Shift status
 * @returns {string} Badge color
 */
export const getShiftStatusColor = (status) => {
  const colors = {
    [SHIFT_STATUS.SCHEDULED]: 'blue',
    [SHIFT_STATUS.ACTIVE]: 'green',
    [SHIFT_STATUS.COMPLETED]: 'gray',
    [SHIFT_STATUS.CANCELLED]: 'red'
  };
  return colors[status] || 'gray';
};

/**
 * Helper function to get section type display name
 * @param {SectionType} type - Section type
 * @returns {string} Display name
 */
export const getSectionTypeName = (type) => {
  const names = {
    [SECTION_TYPE.DINING_ROOM]: 'Dining Room',
    [SECTION_TYPE.PATIO]: 'Patio',
    [SECTION_TYPE.BAR]: 'Bar',
    [SECTION_TYPE.PRIVATE_ROOM]: 'Private Room',
    [SECTION_TYPE.VIP]: 'VIP'
  };
  return names[type] || type;
};
