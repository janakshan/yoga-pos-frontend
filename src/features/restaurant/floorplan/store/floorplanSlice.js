/**
 * Floor Plan Slice - Zustand store for floor plan management
 * @module features/restaurant/floorplan/store/floorplanSlice
 */

/**
 * Creates the floor plan slice for Zustand store
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} Floor plan slice state and actions
 */
export const createFloorPlanSlice = (set, get) => ({
  // ============ State ============

  // Floor plans data
  floorPlans: [],
  selectedFloorPlan: null,
  activeFloorPlan: null,

  // Loading states
  floorPlanLoading: false,
  floorPlanError: null,

  // Editor state
  editorMode: 'select',
  selectedObjects: [],
  editorClipboard: null,
  isDragging: false,
  dragStart: null,
  zoom: 1.0,
  panOffset: { x: 0, y: 0 },
  showGrid: true,
  snapToGrid: true,

  // Section stats
  sectionStats: [],

  // ============ Mutations ============

  /**
   * Set floor plans list
   * @param {import('../types/floorplan.types').FloorPlan[]} floorPlans - Floor plans array
   */
  setFloorPlans: (floorPlans) =>
    set((state) => {
      state.floorPlans = floorPlans;
    }),

  /**
   * Add new floor plan
   * @param {import('../types/floorplan.types').FloorPlan} floorPlan - Floor plan to add
   */
  addFloorPlan: (floorPlan) =>
    set((state) => {
      state.floorPlans.push(floorPlan);
    }),

  /**
   * Update existing floor plan
   * @param {string} id - Floor plan ID
   * @param {Partial<import('../types/floorplan.types').FloorPlan>} updates - Updates to apply
   */
  updateFloorPlan: (id, updates) =>
    set((state) => {
      const index = state.floorPlans.findIndex((fp) => fp.id === id);
      if (index !== -1) {
        state.floorPlans[index] = {
          ...state.floorPlans[index],
          ...updates,
          id,
          updatedAt: new Date(),
        };
      }
    }),

  /**
   * Remove floor plan
   * @param {string} id - Floor plan ID to remove
   */
  removeFloorPlan: (id) =>
    set((state) => {
      state.floorPlans = state.floorPlans.filter((fp) => fp.id !== id);
    }),

  /**
   * Set selected floor plan
   * @param {import('../types/floorplan.types').FloorPlan | null} floorPlan - Floor plan to select
   */
  setSelectedFloorPlan: (floorPlan) =>
    set((state) => {
      state.selectedFloorPlan = floorPlan;
    }),

  /**
   * Set active floor plan
   * @param {import('../types/floorplan.types').FloorPlan | null} floorPlan - Floor plan to activate
   */
  setActiveFloorPlan: (floorPlan) =>
    set((state) => {
      state.activeFloorPlan = floorPlan;
    }),

  /**
   * Set editor mode
   * @param {import('../types/floorplan.types').FloorPlanEditorMode} mode - Editor mode
   */
  setEditorMode: (mode) =>
    set((state) => {
      state.editorMode = mode;
    }),

  /**
   * Set selected objects
   * @param {string[]} ids - Array of selected object IDs
   */
  setSelectedObjects: (ids) =>
    set((state) => {
      state.selectedObjects = ids;
    }),

  /**
   * Add to selected objects
   * @param {string} id - Object ID to add to selection
   */
  addToSelection: (id) =>
    set((state) => {
      if (!state.selectedObjects.includes(id)) {
        state.selectedObjects.push(id);
      }
    }),

  /**
   * Remove from selected objects
   * @param {string} id - Object ID to remove from selection
   */
  removeFromSelection: (id) =>
    set((state) => {
      state.selectedObjects = state.selectedObjects.filter((objId) => objId !== id);
    }),

  /**
   * Clear selection
   */
  clearSelection: () =>
    set((state) => {
      state.selectedObjects = [];
    }),

  /**
   * Set clipboard
   * @param {Object} data - Data to copy to clipboard
   */
  setClipboard: (data) =>
    set((state) => {
      state.editorClipboard = data;
    }),

  /**
   * Set dragging state
   * @param {boolean} isDragging - Dragging state
   * @param {Object} [dragStart] - Drag start position
   */
  setDragging: (isDragging, dragStart = null) =>
    set((state) => {
      state.isDragging = isDragging;
      state.dragStart = dragStart;
    }),

  /**
   * Set zoom level
   * @param {number} zoom - Zoom level (0.1 to 3.0)
   */
  setZoom: (zoom) =>
    set((state) => {
      state.zoom = Math.max(0.1, Math.min(3.0, zoom));
    }),

  /**
   * Set pan offset
   * @param {Object} offset - Pan offset {x, y}
   */
  setPanOffset: (offset) =>
    set((state) => {
      state.panOffset = offset;
    }),

  /**
   * Toggle grid visibility
   */
  toggleGrid: () =>
    set((state) => {
      state.showGrid = !state.showGrid;
    }),

  /**
   * Toggle snap to grid
   */
  toggleSnapToGrid: () =>
    set((state) => {
      state.snapToGrid = !state.snapToGrid;
    }),

  /**
   * Reset editor view
   */
  resetEditorView: () =>
    set((state) => {
      state.zoom = 1.0;
      state.panOffset = { x: 0, y: 0 };
    }),

  /**
   * Set section stats
   * @param {import('../types/floorplan.types').SectionStats[]} stats - Section statistics
   */
  setSectionStats: (stats) =>
    set((state) => {
      state.sectionStats = stats;
    }),

  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setFloorPlanLoading: (loading) =>
    set((state) => {
      state.floorPlanLoading = loading;
    }),

  /**
   * Set error state
   * @param {string | null} error - Error message
   */
  setFloorPlanError: (error) =>
    set((state) => {
      state.floorPlanError = error;
    }),

  /**
   * Clear error
   */
  clearFloorPlanError: () =>
    set((state) => {
      state.floorPlanError = null;
    }),

  // ============ Selectors ============

  /**
   * Get floor plan by ID
   * @param {string} id - Floor plan ID
   * @returns {import('../types/floorplan.types').FloorPlan | undefined}
   */
  getFloorPlanById: (id) => {
    const state = get();
    return state.floorPlans.find((fp) => fp.id === id);
  },

  /**
   * Get floor plans by floor
   * @param {string} floor - Floor name
   * @returns {import('../types/floorplan.types').FloorPlan[]}
   */
  getFloorPlansByFloor: (floor) => {
    const state = get();
    return state.floorPlans.filter((fp) => fp.floor === floor);
  },

  /**
   * Get active floor plans
   * @returns {import('../types/floorplan.types').FloorPlan[]}
   */
  getActiveFloorPlans: () => {
    const state = get();
    return state.floorPlans.filter((fp) => fp.isActive);
  },

  /**
   * Get section by ID from selected floor plan
   * @param {string} sectionId - Section ID
   * @returns {import('../types/floorplan.types').Section | undefined}
   */
  getSectionById: (sectionId) => {
    const state = get();
    if (!state.selectedFloorPlan) return undefined;
    return state.selectedFloorPlan.sections.find((s) => s.id === sectionId);
  },

  /**
   * Get element by ID from selected floor plan
   * @param {string} elementId - Element ID
   * @returns {import('../types/floorplan.types').FloorPlanElement | undefined}
   */
  getElementById: (elementId) => {
    const state = get();
    if (!state.selectedFloorPlan) return undefined;
    return state.selectedFloorPlan.elements.find((e) => e.id === elementId);
  },
});

export default createFloorPlanSlice;
