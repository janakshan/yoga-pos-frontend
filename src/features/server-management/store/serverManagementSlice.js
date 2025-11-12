/**
 * Server Management Store Slice
 * Handles state for server assignments, shifts, sections, and performance tracking
 */

import { SHIFT_STATUS, calculateShiftDuration } from '../types/serverManagement.types';

/**
 * Creates the server management slice for Zustand store
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} Server management slice
 */
export const createServerManagementSlice = (set, get) => ({
  // ========== State ==========

  // Sections
  sections: [],
  selectedSection: null,

  // Server assignments
  serverAssignments: [],
  selectedAssignment: null,

  // Shifts
  shifts: [],
  activeShifts: [],
  selectedShift: null,

  // Performance data
  serverPerformance: {},
  performanceComparisons: {},

  // Order history
  serverOrderHistory: [],

  // Tips
  serverTips: [],
  tipsSummary: {},

  // Reports
  serverReports: [],

  // UI state
  loading: {
    sections: false,
    assignments: false,
    shifts: false,
    performance: false,
    orders: false,
    tips: false,
    reports: false,
  },
  error: null,

  // Filters
  filters: {
    serverId: null,
    sectionId: null,
    shiftStatus: null,
    startDate: null,
    endDate: null,
  },

  // Stats
  stats: {
    totalServers: 0,
    serversOnShift: 0,
    totalSections: 0,
    activeSections: 0,
    totalActiveOrders: 0,
    totalDailySales: 0,
    totalDailyTips: 0,
    averageServiceTime: 0,
  },

  // ========== Section Management Actions ==========

  /**
   * Set sections
   */
  setSections: (sections) => set((state) => {
    state.sections = sections;
  }),

  /**
   * Add section
   */
  addSection: (section) => set((state) => {
    state.sections.push(section);
  }),

  /**
   * Update section
   */
  updateSection: (sectionId, updates) => set((state) => {
    const index = state.sections.findIndex(s => s.id === sectionId);
    if (index !== -1) {
      state.sections[index] = { ...state.sections[index], ...updates, updatedAt: new Date() };
    }
  }),

  /**
   * Remove section
   */
  removeSection: (sectionId) => set((state) => {
    state.sections = state.sections.filter(s => s.id !== sectionId);
  }),

  /**
   * Select section
   */
  selectSection: (section) => set((state) => {
    state.selectedSection = section;
  }),

  /**
   * Assign server to section
   */
  assignServerToSection: (sectionId, serverId, serverName) => set((state) => {
    const section = state.sections.find(s => s.id === sectionId);
    if (section) {
      section.assignedServerId = serverId;
      section.assignedServerName = serverName;
      section.updatedAt = new Date();
    }
  }),

  /**
   * Unassign server from section
   */
  unassignServerFromSection: (sectionId) => set((state) => {
    const section = state.sections.find(s => s.id === sectionId);
    if (section) {
      section.assignedServerId = null;
      section.assignedServerName = null;
      section.updatedAt = new Date();
    }
  }),

  // ========== Server Assignment Actions ==========

  /**
   * Set server assignments
   */
  setServerAssignments: (assignments) => set((state) => {
    state.serverAssignments = assignments;
  }),

  /**
   * Add server assignment
   */
  addServerAssignment: (assignment) => set((state) => {
    state.serverAssignments.push(assignment);
  }),

  /**
   * Update server assignment
   */
  updateServerAssignment: (assignmentId, updates) => set((state) => {
    const index = state.serverAssignments.findIndex(a => a.id === assignmentId);
    if (index !== -1) {
      state.serverAssignments[index] = {
        ...state.serverAssignments[index],
        ...updates,
        updatedAt: new Date()
      };
    }
  }),

  /**
   * Remove server assignment
   */
  removeServerAssignment: (assignmentId) => set((state) => {
    state.serverAssignments = state.serverAssignments.filter(a => a.id !== assignmentId);
  }),

  /**
   * Select assignment
   */
  selectAssignment: (assignment) => set((state) => {
    state.selectedAssignment = assignment;
  }),

  /**
   * Get active assignments for a server
   */
  getServerActiveAssignments: (serverId) => {
    const state = get();
    return state.serverAssignments.filter(
      a => a.serverId === serverId && a.isActive
    );
  },

  /**
   * Get assignments for a section
   */
  getSectionAssignments: (sectionId) => {
    const state = get();
    return state.serverAssignments.filter(
      a => a.sectionIds.includes(sectionId)
    );
  },

  // ========== Shift Management Actions ==========

  /**
   * Set shifts
   */
  setShifts: (shifts) => set((state) => {
    state.shifts = shifts;
    state.activeShifts = shifts.filter(s => s.status === SHIFT_STATUS.ACTIVE);
  }),

  /**
   * Add shift
   */
  addShift: (shift) => set((state) => {
    state.shifts.push(shift);
    if (shift.status === SHIFT_STATUS.ACTIVE) {
      state.activeShifts.push(shift);
    }
  }),

  /**
   * Update shift
   */
  updateShift: (shiftId, updates) => set((state) => {
    // Update in main shifts array
    const index = state.shifts.findIndex(s => s.id === shiftId);
    if (index !== -1) {
      state.shifts[index] = { ...state.shifts[index], ...updates, updatedAt: new Date() };

      // Recalculate duration if end time is provided
      if (updates.actualEnd) {
        const shift = state.shifts[index];
        shift.duration = calculateShiftDuration(shift.actualStart, shift.actualEnd);
      }
    }

    // Update active shifts array
    state.activeShifts = state.shifts.filter(s => s.status === SHIFT_STATUS.ACTIVE);
  }),

  /**
   * Remove shift
   */
  removeShift: (shiftId) => set((state) => {
    state.shifts = state.shifts.filter(s => s.id !== shiftId);
    state.activeShifts = state.activeShifts.filter(s => s.id !== shiftId);
  }),

  /**
   * Select shift
   */
  selectShift: (shift) => set((state) => {
    state.selectedShift = shift;
  }),

  /**
   * Start shift (clock in)
   */
  startShift: (shiftId) => set((state) => {
    const shift = state.shifts.find(s => s.id === shiftId);
    if (shift) {
      shift.status = SHIFT_STATUS.ACTIVE;
      shift.actualStart = new Date();
      shift.updatedAt = new Date();

      // Add to active shifts
      if (!state.activeShifts.find(s => s.id === shiftId)) {
        state.activeShifts.push(shift);
      }
    }
  }),

  /**
   * End shift (clock out)
   */
  endShift: (shiftId) => set((state) => {
    const shift = state.shifts.find(s => s.id === shiftId);
    if (shift) {
      shift.status = SHIFT_STATUS.COMPLETED;
      shift.actualEnd = new Date();
      shift.duration = calculateShiftDuration(shift.actualStart, shift.actualEnd);
      shift.updatedAt = new Date();

      // Remove from active shifts
      state.activeShifts = state.activeShifts.filter(s => s.id !== shiftId);
    }
  }),

  /**
   * Add break to shift
   */
  addBreakToShift: (shiftId, breakPeriod) => set((state) => {
    const shift = state.shifts.find(s => s.id === shiftId);
    if (shift) {
      if (!shift.breakPeriods) {
        shift.breakPeriods = [];
      }
      shift.breakPeriods.push(breakPeriod);

      // Update total break duration
      shift.breakDuration = shift.breakPeriods.reduce((total, bp) => total + bp.duration, 0);
      shift.updatedAt = new Date();
    }
  }),

  /**
   * Get active shift for server
   */
  getServerActiveShift: (serverId) => {
    const state = get();
    return state.activeShifts.find(s => s.serverId === serverId);
  },

  /**
   * Get shifts for server
   */
  getServerShifts: (serverId, filters = {}) => {
    const state = get();
    let shifts = state.shifts.filter(s => s.serverId === serverId);

    if (filters.status) {
      shifts = shifts.filter(s => s.status === filters.status);
    }

    if (filters.startDate) {
      shifts = shifts.filter(s => new Date(s.scheduledStart) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      shifts = shifts.filter(s => new Date(s.scheduledStart) <= new Date(filters.endDate));
    }

    return shifts;
  },

  // ========== Performance Tracking Actions ==========

  /**
   * Set server performance data
   */
  setServerPerformance: (serverId, performance) => set((state) => {
    state.serverPerformance[serverId] = performance;
  }),

  /**
   * Update server performance
   */
  updateServerPerformance: (serverId, updates) => set((state) => {
    if (state.serverPerformance[serverId]) {
      state.serverPerformance[serverId] = {
        ...state.serverPerformance[serverId],
        ...updates,
        updatedAt: new Date()
      };
    }
  }),

  /**
   * Set performance comparisons
   */
  setPerformanceComparisons: (comparisons) => set((state) => {
    state.performanceComparisons = comparisons;
  }),

  /**
   * Get server performance
   */
  getServerPerformance: (serverId) => {
    const state = get();
    return state.serverPerformance[serverId] || null;
  },

  // ========== Order History Actions ==========

  /**
   * Set server order history
   */
  setServerOrderHistory: (orders) => set((state) => {
    state.serverOrderHistory = orders;
  }),

  /**
   * Add order to history
   */
  addOrderToHistory: (order) => set((state) => {
    state.serverOrderHistory.unshift(order);
  }),

  /**
   * Get order history for server
   */
  getServerOrderHistory: (serverId, filters = {}) => {
    const state = get();
    let orders = state.serverOrderHistory.filter(o => o.serverId === serverId);

    if (filters.startDate) {
      orders = orders.filter(o => new Date(o.createdAt) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      orders = orders.filter(o => new Date(o.createdAt) <= new Date(filters.endDate));
    }

    if (filters.status) {
      orders = orders.filter(o => o.status === filters.status);
    }

    return orders;
  },

  // ========== Tip Tracking Actions ==========

  /**
   * Set server tips
   */
  setServerTips: (tips) => set((state) => {
    state.serverTips = tips;
  }),

  /**
   * Add tip
   */
  addServerTip: (tip) => set((state) => {
    state.serverTips.unshift(tip);
  }),

  /**
   * Set tips summary
   */
  setTipsSummary: (serverId, summary) => set((state) => {
    state.tipsSummary[serverId] = summary;
  }),

  /**
   * Get tips for server
   */
  getServerTips: (serverId, filters = {}) => {
    const state = get();
    let tips = state.serverTips.filter(t => t.serverId === serverId);

    if (filters.startDate) {
      tips = tips.filter(t => new Date(t.date) >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      tips = tips.filter(t => new Date(t.date) <= new Date(filters.endDate));
    }

    if (filters.shiftId) {
      tips = tips.filter(t => t.shiftId === filters.shiftId);
    }

    return tips;
  },

  // ========== Report Actions ==========

  /**
   * Set server reports
   */
  setServerReports: (reports) => set((state) => {
    state.serverReports = reports;
  }),

  /**
   * Add server report
   */
  addServerReport: (report) => set((state) => {
    state.serverReports.unshift(report);
  }),

  /**
   * Get server reports
   */
  getServerReports: (serverId = null) => {
    const state = get();
    if (serverId) {
      return state.serverReports.filter(r => r.serverId === serverId);
    }
    return state.serverReports;
  },

  // ========== Loading State Actions ==========

  /**
   * Set loading state
   */
  setLoading: (key, value) => set((state) => {
    state.loading[key] = value;
  }),

  /**
   * Set error
   */
  setError: (error) => set((state) => {
    state.error = error;
  }),

  /**
   * Clear error
   */
  clearError: () => set((state) => {
    state.error = null;
  }),

  // ========== Filter Actions ==========

  /**
   * Set filters
   */
  setFilters: (filters) => set((state) => {
    state.filters = { ...state.filters, ...filters };
  }),

  /**
   * Clear filters
   */
  clearFilters: () => set((state) => {
    state.filters = {
      serverId: null,
      sectionId: null,
      shiftStatus: null,
      startDate: null,
      endDate: null,
    };
  }),

  // ========== Stats Actions ==========

  /**
   * Set stats
   */
  setStats: (stats) => set((state) => {
    state.stats = { ...state.stats, ...stats };
  }),

  /**
   * Update stats
   */
  updateStats: () => set((state) => {
    const { sections, activeShifts, serverOrderHistory, serverTips } = state;

    // Calculate stats
    state.stats = {
      totalServers: new Set(activeShifts.map(s => s.serverId)).size,
      serversOnShift: activeShifts.length,
      totalSections: sections.length,
      activeSections: sections.filter(s => s.isActive).length,
      totalActiveOrders: serverOrderHistory.filter(o =>
        o.status !== 'completed' && o.status !== 'cancelled'
      ).length,
      totalDailySales: serverOrderHistory
        .filter(o => {
          const today = new Date();
          const orderDate = new Date(o.createdAt);
          return orderDate.toDateString() === today.toDateString();
        })
        .reduce((sum, o) => sum + o.total, 0),
      totalDailyTips: serverTips
        .filter(t => {
          const today = new Date();
          const tipDate = new Date(t.date);
          return tipDate.toDateString() === today.toDateString();
        })
        .reduce((sum, t) => sum + t.tipAmount, 0),
      averageServiceTime: serverOrderHistory
        .filter(o => o.serviceTime)
        .reduce((sum, o, _, arr) => sum + o.serviceTime / arr.length, 0) || 0,
    };
  }),

  // ========== Reset Actions ==========

  /**
   * Reset server management state
   */
  resetServerManagement: () => set((state) => {
    state.sections = [];
    state.selectedSection = null;
    state.serverAssignments = [];
    state.selectedAssignment = null;
    state.shifts = [];
    state.activeShifts = [];
    state.selectedShift = null;
    state.serverPerformance = {};
    state.performanceComparisons = {};
    state.serverOrderHistory = [];
    state.serverTips = [];
    state.tipsSummary = {};
    state.serverReports = [];
    state.loading = {
      sections: false,
      assignments: false,
      shifts: false,
      performance: false,
      orders: false,
      tips: false,
      reports: false,
    };
    state.error = null;
    state.filters = {
      serverId: null,
      sectionId: null,
      shiftStatus: null,
      startDate: null,
      endDate: null,
    };
    state.stats = {
      totalServers: 0,
      serversOnShift: 0,
      totalSections: 0,
      activeSections: 0,
      totalActiveOrders: 0,
      totalDailySales: 0,
      totalDailyTips: 0,
      averageServiceTime: 0,
    };
  }),
});
