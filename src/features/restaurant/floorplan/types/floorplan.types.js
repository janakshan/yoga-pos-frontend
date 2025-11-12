/**
 * Floor Plan Types for Restaurant POS System
 * @module features/restaurant/floorplan/types
 */

/**
 * @typedef {Object} Section
 * @property {string} id - Unique section identifier
 * @property {string} name - Section name (e.g., "Main Dining", "Bar", "Patio")
 * @property {string} [color] - Color code for visual identification (hex color)
 * @property {string} [floor] - Floor level this section belongs to
 * @property {number} [capacity] - Total seating capacity in this section
 * @property {Position} [position] - Position on floor plan
 * @property {Dimensions} [dimensions] - Size of section on floor plan
 * @property {string} [notes] - Additional notes about the section
 * @property {boolean} isActive - Whether section is currently active
 * @property {Date} createdAt - When section was created
 * @property {Date} updatedAt - When section was last updated
 */

/**
 * @typedef {Object} Position
 * @property {number} x - X coordinate
 * @property {number} y - Y coordinate
 */

/**
 * @typedef {Object} Dimensions
 * @property {number} width - Width in pixels
 * @property {number} height - Height in pixels
 */

/**
 * @typedef {'wall' | 'door' | 'window' | 'bar' | 'kitchen' | 'restroom' | 'entrance' | 'exit' | 'decor'} ElementType
 * Types of floor plan elements that can be placed
 */

/**
 * @typedef {Object} FloorPlanElement
 * @property {string} id - Unique element identifier
 * @property {ElementType} type - Type of element
 * @property {Position} position - Position on floor plan
 * @property {Dimensions} [dimensions] - Size of element
 * @property {number} [rotation] - Rotation angle in degrees
 * @property {string} [label] - Optional label for the element
 * @property {string} [color] - Color for visual representation
 * @property {Object} [metadata] - Additional metadata for the element
 */

/**
 * @typedef {Object} GridSettings
 * @property {boolean} enabled - Whether grid snapping is enabled
 * @property {number} size - Grid cell size in pixels
 * @property {boolean} visible - Whether grid should be visible
 * @property {string} [color] - Grid line color
 */

/**
 * @typedef {Object} FloorPlan
 * @property {string} id - Unique floor plan identifier
 * @property {string} name - Floor plan name (e.g., "Main Floor", "Second Floor")
 * @property {string} [description] - Description of the floor plan
 * @property {string} floor - Floor level (e.g., "Ground Floor", "1st Floor")
 * @property {Dimensions} dimensions - Canvas dimensions
 * @property {Section[]} sections - Sections/areas in this floor plan
 * @property {string[]} tableIds - IDs of tables placed on this floor plan
 * @property {FloorPlanElement[]} elements - Additional elements (walls, doors, etc.)
 * @property {GridSettings} gridSettings - Grid configuration
 * @property {string} [backgroundImage] - URL to background image if any
 * @property {number} scale - Scale factor for measurements (pixels per meter)
 * @property {boolean} isActive - Whether this floor plan is currently active
 * @property {Date} createdAt - When floor plan was created
 * @property {Date} updatedAt - When floor plan was last updated
 * @property {string} branchId - Branch/location ID
 */

/**
 * @typedef {Object} FloorPlanFilters
 * @property {string} [floor] - Filter by floor level
 * @property {boolean} [isActive] - Filter by active status
 * @property {string} [search] - Search query for name
 */

/**
 * @typedef {'select' | 'pan' | 'add-table' | 'add-element' | 'edit'} FloorPlanEditorMode
 * Editor interaction modes:
 * - select: Select and move objects
 * - pan: Pan/scroll the canvas
 * - add-table: Add new tables
 * - add-element: Add walls, doors, etc.
 * - edit: Edit selected object properties
 */

/**
 * @typedef {Object} FloorPlanEditorState
 * @property {FloorPlanEditorMode} mode - Current editor mode
 * @property {string[]} selectedIds - IDs of selected objects
 * @property {Object} [clipboard] - Copied objects for paste operation
 * @property {boolean} isDragging - Whether user is dragging
 * @property {Position} [dragStart] - Drag start position
 * @property {number} zoom - Zoom level (0.1 to 3.0)
 * @property {Position} panOffset - Pan offset for canvas positioning
 * @property {boolean} showGrid - Whether to show grid
 * @property {boolean} snapToGrid - Whether to snap to grid
 */

/**
 * @typedef {Object} SectionStats
 * @property {string} sectionId - Section ID
 * @property {string} sectionName - Section name
 * @property {number} totalTables - Total tables in section
 * @property {number} availableTables - Available tables
 * @property {number} occupiedTables - Occupied tables
 * @property {number} capacity - Total seating capacity
 * @property {number} occupancyRate - Occupancy percentage
 */

export {};
