/**
 * Table Types for Restaurant POS System
 * @module features/restaurant/tables/types
 */

/**
 * @typedef {'available' | 'occupied' | 'reserved' | 'cleaning' | 'out-of-service'} TableStatus
 * Table status enum:
 * - available: Table is empty and ready for seating
 * - occupied: Table currently has seated customers
 * - reserved: Table has a reservation
 * - cleaning: Table is being cleaned/prepared
 * - out-of-service: Table is not available for use
 */

/**
 * @typedef {'square' | 'round' | 'rectangle' | 'oval' | 'bar'} TableShape
 * Table shape types for visual representation
 */

/**
 * @typedef {Object} Position
 * @property {number} x - X coordinate on floor plan (in pixels or grid units)
 * @property {number} y - Y coordinate on floor plan (in pixels or grid units)
 */

/**
 * @typedef {Object} Dimensions
 * @property {number} width - Table width (in pixels or grid units)
 * @property {number} height - Table height (in pixels or grid units)
 */

/**
 * @typedef {Object} Table
 * @property {string} id - Unique table identifier
 * @property {string} number - Table number or name (e.g., "T1", "Table 5")
 * @property {number} capacity - Maximum number of seats
 * @property {TableStatus} status - Current table status
 * @property {TableShape} shape - Table shape for visual representation
 * @property {string} [section] - Section/area name (e.g., "Main Dining", "Patio", "VIP")
 * @property {string} [floor] - Floor level (e.g., "Ground Floor", "1st Floor")
 * @property {string} [assignedServer] - ID of server assigned to this table
 * @property {string} [currentOrderId] - Current active order ID if occupied
 * @property {Position} [position] - Position on floor plan
 * @property {Dimensions} [dimensions] - Size of table on floor plan
 * @property {number} [rotation] - Rotation angle in degrees (0-360)
 * @property {string} [notes] - Additional notes or special requirements
 * @property {Date} [lastOccupied] - Last time table was occupied
 * @property {Date} [reservedAt] - Reservation time if reserved
 * @property {string} [reservedFor] - Customer name for reservation
 * @property {string} [reservedPhone] - Contact phone for reservation
 * @property {number} [estimatedTurnover] - Estimated minutes for turnover
 * @property {boolean} [isCombined] - Whether table is combined with others
 * @property {string[]} [combinedWith] - IDs of tables combined with this one
 * @property {Date} createdAt - Timestamp when table was created
 * @property {Date} updatedAt - Timestamp when table was last updated
 * @property {string} branchId - Branch/location ID
 */

/**
 * @typedef {Object} TableFilters
 * @property {TableStatus} [status] - Filter by status
 * @property {string} [section] - Filter by section
 * @property {string} [floor] - Filter by floor
 * @property {string} [assignedServer] - Filter by assigned server
 * @property {number} [minCapacity] - Minimum capacity
 * @property {number} [maxCapacity] - Maximum capacity
 * @property {string} [search] - Search query for table number/name
 */

/**
 * @typedef {Object} TableStats
 * @property {number} totalTables - Total number of tables
 * @property {number} availableTables - Number of available tables
 * @property {number} occupiedTables - Number of occupied tables
 * @property {number} reservedTables - Number of reserved tables
 * @property {number} cleaningTables - Number of tables being cleaned
 * @property {number} outOfServiceTables - Number of out-of-service tables
 * @property {number} occupancyRate - Percentage of occupied tables (0-100)
 * @property {number} averageTurnoverTime - Average time in minutes for table turnover
 */

/**
 * @typedef {Object} TableStatusUpdate
 * @property {string} tableId - Table ID to update
 * @property {TableStatus} status - New status
 * @property {string} [currentOrderId] - Order ID if status is occupied
 * @property {string} [assignedServer] - Server ID if assigning
 * @property {Date} [reservedAt] - Reservation time if status is reserved
 * @property {string} [reservedFor] - Customer name if status is reserved
 * @property {string} [notes] - Additional notes
 */

/**
 * @typedef {Object} TableAssignment
 * @property {string} tableId - Table ID
 * @property {string} serverId - Server/waiter ID
 * @property {Date} assignedAt - When assignment was made
 */

/**
 * @typedef {Object} TableCombination
 * @property {string} id - Unique combination ID
 * @property {string[]} tableIds - Array of table IDs that are combined
 * @property {number} totalCapacity - Combined capacity
 * @property {TableStatus} status - Status of the combined table group
 * @property {Date} createdAt - When tables were combined
 */

export {};
