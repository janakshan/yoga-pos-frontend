/**
 * Server Management Service
 * Handles API calls for server assignments, shifts, sections, and performance tracking
 * Currently using mock data - replace with actual API calls in production
 */

import { SHIFT_STATUS, SECTION_TYPE, calculateShiftDuration, calculateTipPercentage } from '../types/serverManagement.types';

// Mock delay to simulate API latency
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data generators
const generateId = () => `SM${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

// ========== Mock Data ==========

let mockSections = [
  {
    id: 'SEC001',
    name: 'Front Dining Room',
    type: SECTION_TYPE.DINING_ROOM,
    description: 'Main dining area near entrance',
    capacity: 40,
    tableIds: ['TBL001', 'TBL002', 'TBL003', 'TBL004', 'TBL005'],
    tableCount: 5,
    floor: '1st Floor',
    isActive: true,
    assignedServerId: null,
    assignedServerName: null,
    coordinates: { x: 0, y: 0, width: 200, height: 150 },
    color: '#3B82F6',
    priority: 1,
    notes: '',
    branchId: 'BRANCH001',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'SEC002',
    name: 'Back Dining Room',
    type: SECTION_TYPE.DINING_ROOM,
    description: 'Quieter dining area',
    capacity: 32,
    tableIds: ['TBL006', 'TBL007', 'TBL008', 'TBL009'],
    tableCount: 4,
    floor: '1st Floor',
    isActive: true,
    assignedServerId: null,
    assignedServerName: null,
    coordinates: { x: 200, y: 0, width: 180, height: 150 },
    color: '#10B981',
    priority: 2,
    notes: '',
    branchId: 'BRANCH001',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'SEC003',
    name: 'Outdoor Patio',
    type: SECTION_TYPE.PATIO,
    description: 'Outdoor seating area',
    capacity: 24,
    tableIds: ['TBL010', 'TBL011', 'TBL012'],
    tableCount: 3,
    floor: '1st Floor',
    isActive: true,
    assignedServerId: null,
    assignedServerName: null,
    coordinates: { x: 0, y: 150, width: 150, height: 120 },
    color: '#F59E0B',
    priority: 3,
    notes: 'Weather dependent',
    branchId: 'BRANCH001',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
  {
    id: 'SEC004',
    name: 'Bar Area',
    type: SECTION_TYPE.BAR,
    description: 'Bar seating and high tables',
    capacity: 20,
    tableIds: ['TBL013', 'TBL014'],
    tableCount: 2,
    floor: '1st Floor',
    isActive: true,
    assignedServerId: null,
    assignedServerName: null,
    coordinates: { x: 150, y: 150, width: 230, height: 120 },
    color: '#8B5CF6',
    priority: 4,
    notes: '',
    branchId: 'BRANCH001',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

let mockShifts = [];
let mockServerAssignments = [];
let mockServerPerformance = {};
let mockServerTips = [];
let mockServerOrderHistory = [];

// ========== Section Management ==========

/**
 * Get all sections
 */
export const getSections = async (filters = {}) => {
  await delay();

  let sections = [...mockSections];

  if (filters.type) {
    sections = sections.filter(s => s.type === filters.type);
  }

  if (filters.isActive !== undefined) {
    sections = sections.filter(s => s.isActive === filters.isActive);
  }

  if (filters.floor) {
    sections = sections.filter(s => s.floor === filters.floor);
  }

  if (filters.assignedServerId) {
    sections = sections.filter(s => s.assignedServerId === filters.assignedServerId);
  }

  return {
    success: true,
    data: sections,
    total: sections.length,
  };
};

/**
 * Get section by ID
 */
export const getSectionById = async (sectionId) => {
  await delay();

  const section = mockSections.find(s => s.id === sectionId);

  if (!section) {
    return {
      success: false,
      error: 'Section not found',
    };
  }

  return {
    success: true,
    data: section,
  };
};

/**
 * Create section
 */
export const createSection = async (sectionData) => {
  await delay();

  const newSection = {
    ...sectionData,
    id: generateId(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    assignedServerId: null,
    assignedServerName: null,
  };

  mockSections.push(newSection);

  return {
    success: true,
    data: newSection,
    message: 'Section created successfully',
  };
};

/**
 * Update section
 */
export const updateSection = async (sectionId, updates) => {
  await delay();

  const index = mockSections.findIndex(s => s.id === sectionId);

  if (index === -1) {
    return {
      success: false,
      error: 'Section not found',
    };
  }

  mockSections[index] = {
    ...mockSections[index],
    ...updates,
    updatedAt: new Date(),
  };

  return {
    success: true,
    data: mockSections[index],
    message: 'Section updated successfully',
  };
};

/**
 * Delete section
 */
export const deleteSection = async (sectionId) => {
  await delay();

  const index = mockSections.findIndex(s => s.id === sectionId);

  if (index === -1) {
    return {
      success: false,
      error: 'Section not found',
    };
  }

  mockSections.splice(index, 1);

  return {
    success: true,
    message: 'Section deleted successfully',
  };
};

// ========== Server Assignment Management ==========

/**
 * Get server assignments
 */
export const getServerAssignments = async (filters = {}) => {
  await delay();

  let assignments = [...mockServerAssignments];

  if (filters.serverId) {
    assignments = assignments.filter(a => a.serverId === filters.serverId);
  }

  if (filters.sectionId) {
    assignments = assignments.filter(a => a.sectionIds.includes(filters.sectionId));
  }

  if (filters.isActive !== undefined) {
    assignments = assignments.filter(a => a.isActive === filters.isActive);
  }

  if (filters.shiftId) {
    assignments = assignments.filter(a => a.shiftId === filters.shiftId);
  }

  return {
    success: true,
    data: assignments,
    total: assignments.length,
  };
};

/**
 * Create server assignment
 */
export const createServerAssignment = async (assignmentData) => {
  await delay();

  const newAssignment = {
    ...assignmentData,
    id: generateId(),
    assignedAt: new Date(),
    isActive: true,
    currentTables: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockServerAssignments.push(newAssignment);

  // Update sections with server assignment
  assignmentData.sectionIds.forEach(sectionId => {
    const section = mockSections.find(s => s.id === sectionId);
    if (section) {
      section.assignedServerId = assignmentData.serverId;
      section.assignedServerName = assignmentData.serverName;
      section.updatedAt = new Date();
    }
  });

  return {
    success: true,
    data: newAssignment,
    message: 'Server assigned successfully',
  };
};

/**
 * Update server assignment
 */
export const updateServerAssignment = async (assignmentId, updates) => {
  await delay();

  const index = mockServerAssignments.findIndex(a => a.id === assignmentId);

  if (index === -1) {
    return {
      success: false,
      error: 'Assignment not found',
    };
  }

  mockServerAssignments[index] = {
    ...mockServerAssignments[index],
    ...updates,
    updatedAt: new Date(),
  };

  return {
    success: true,
    data: mockServerAssignments[index],
    message: 'Assignment updated successfully',
  };
};

/**
 * End server assignment
 */
export const endServerAssignment = async (assignmentId) => {
  await delay();

  const assignment = mockServerAssignments.find(a => a.id === assignmentId);

  if (!assignment) {
    return {
      success: false,
      error: 'Assignment not found',
    };
  }

  assignment.isActive = false;
  assignment.unassignedAt = new Date();
  assignment.updatedAt = new Date();

  // Update sections
  assignment.sectionIds.forEach(sectionId => {
    const section = mockSections.find(s => s.id === sectionId);
    if (section && section.assignedServerId === assignment.serverId) {
      section.assignedServerId = null;
      section.assignedServerName = null;
      section.updatedAt = new Date();
    }
  });

  return {
    success: true,
    data: assignment,
    message: 'Assignment ended successfully',
  };
};

// ========== Shift Management ==========

/**
 * Get shifts
 */
export const getShifts = async (filters = {}) => {
  await delay();

  let shifts = [...mockShifts];

  if (filters.serverId) {
    shifts = shifts.filter(s => s.serverId === filters.serverId);
  }

  if (filters.status) {
    shifts = shifts.filter(s => s.status === filters.status);
  }

  if (filters.startDate) {
    shifts = shifts.filter(s => new Date(s.scheduledStart) >= new Date(filters.startDate));
  }

  if (filters.endDate) {
    shifts = shifts.filter(s => new Date(s.scheduledStart) <= new Date(filters.endDate));
  }

  return {
    success: true,
    data: shifts,
    total: shifts.length,
  };
};

/**
 * Get shift by ID
 */
export const getShiftById = async (shiftId) => {
  await delay();

  const shift = mockShifts.find(s => s.id === shiftId);

  if (!shift) {
    return {
      success: false,
      error: 'Shift not found',
    };
  }

  return {
    success: true,
    data: shift,
  };
};

/**
 * Create shift
 */
export const createShift = async (shiftData) => {
  await delay();

  const newShift = {
    ...shiftData,
    id: generateId(),
    status: SHIFT_STATUS.SCHEDULED,
    actualStart: null,
    actualEnd: null,
    duration: 0,
    breakDuration: 0,
    breakPeriods: [],
    performance: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  mockShifts.push(newShift);

  return {
    success: true,
    data: newShift,
    message: 'Shift created successfully',
  };
};

/**
 * Clock in (start shift)
 */
export const clockIn = async (shiftId) => {
  await delay();

  const shift = mockShifts.find(s => s.id === shiftId);

  if (!shift) {
    return {
      success: false,
      error: 'Shift not found',
    };
  }

  if (shift.status === SHIFT_STATUS.ACTIVE) {
    return {
      success: false,
      error: 'Shift is already active',
    };
  }

  shift.status = SHIFT_STATUS.ACTIVE;
  shift.actualStart = new Date();
  shift.updatedAt = new Date();

  return {
    success: true,
    data: shift,
    message: 'Clocked in successfully',
  };
};

/**
 * Clock out (end shift)
 */
export const clockOut = async (shiftId) => {
  await delay();

  const shift = mockShifts.find(s => s.id === shiftId);

  if (!shift) {
    return {
      success: false,
      error: 'Shift not found',
    };
  }

  if (shift.status !== SHIFT_STATUS.ACTIVE) {
    return {
      success: false,
      error: 'Shift is not active',
    };
  }

  shift.status = SHIFT_STATUS.COMPLETED;
  shift.actualEnd = new Date();
  shift.duration = calculateShiftDuration(shift.actualStart, shift.actualEnd);
  shift.updatedAt = new Date();

  // Calculate shift performance
  shift.performance = await calculateShiftPerformance(shiftId);

  return {
    success: true,
    data: shift,
    message: 'Clocked out successfully',
  };
};

/**
 * Add break to shift
 */
export const addBreak = async (shiftId, breakData) => {
  await delay();

  const shift = mockShifts.find(s => s.id === shiftId);

  if (!shift) {
    return {
      success: false,
      error: 'Shift not found',
    };
  }

  const breakPeriod = {
    ...breakData,
    id: generateId(),
  };

  shift.breakPeriods.push(breakPeriod);
  shift.breakDuration = shift.breakPeriods.reduce((sum, bp) => sum + bp.duration, 0);
  shift.updatedAt = new Date();

  return {
    success: true,
    data: shift,
    message: 'Break added successfully',
  };
};

// ========== Performance Tracking ==========

/**
 * Get server performance
 */
export const getServerPerformance = async (serverId, filters = {}) => {
  await delay();

  // Generate mock performance data if not exists
  if (!mockServerPerformance[serverId]) {
    mockServerPerformance[serverId] = generateMockPerformance(serverId, filters);
  }

  return {
    success: true,
    data: mockServerPerformance[serverId],
  };
};

/**
 * Calculate shift performance
 */
const calculateShiftPerformance = async (shiftId) => {
  await delay(100);

  const shift = mockShifts.find(s => s.id === shiftId);
  if (!shift) return null;

  // Get orders for this shift
  const shiftOrders = mockServerOrderHistory.filter(
    o => o.serverId === shift.serverId &&
      new Date(o.createdAt) >= new Date(shift.actualStart) &&
      new Date(o.createdAt) <= new Date(shift.actualEnd || new Date())
  );

  // Calculate metrics
  const totalOrders = shiftOrders.length;
  const completedOrders = shiftOrders.filter(o => o.status === 'completed').length;
  const cancelledOrders = shiftOrders.filter(o => o.status === 'cancelled').length;
  const totalSales = shiftOrders.reduce((sum, o) => sum + o.total, 0);
  const totalTips = shiftOrders.reduce((sum, o) => sum + o.tip, 0);
  const tablesServed = new Set(shiftOrders.map(o => o.tableId)).size;
  const guestsServed = shiftOrders.reduce((sum, o) => sum + (o.guestCount || 1), 0);

  return {
    id: generateId(),
    serverId: shift.serverId,
    serverName: shift.serverName,
    shiftId: shift.id,
    startDate: shift.actualStart,
    endDate: shift.actualEnd,
    totalOrders,
    completedOrders,
    cancelledOrders,
    totalSales,
    averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
    totalTips,
    averageTipAmount: totalOrders > 0 ? totalTips / totalOrders : 0,
    tipPercentage: totalSales > 0 ? (totalTips / totalSales) * 100 : 0,
    tablesServed,
    guestsServed,
    averageServiceTime: shiftOrders
      .filter(o => o.serviceTime)
      .reduce((sum, o, _, arr) => sum + o.serviceTime / (arr.length || 1), 0),
    averageTableTurnover: 0,
    customerSatisfactionScore: 0,
    orderAccuracy: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
    upsellAmount: 0,
    breakdown: {},
    notes: '',
    branchId: shift.branchId || 'BRANCH001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Generate mock performance data
 */
const generateMockPerformance = (serverId, filters) => {
  const startDate = filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = filters.endDate || new Date();

  return {
    id: generateId(),
    serverId,
    serverName: 'Server',
    shiftId: null,
    startDate,
    endDate,
    totalOrders: Math.floor(Math.random() * 100) + 50,
    completedOrders: Math.floor(Math.random() * 95) + 45,
    cancelledOrders: Math.floor(Math.random() * 5),
    totalSales: Math.floor(Math.random() * 10000) + 5000,
    averageOrderValue: Math.floor(Math.random() * 50) + 30,
    totalTips: Math.floor(Math.random() * 2000) + 1000,
    averageTipAmount: Math.floor(Math.random() * 20) + 10,
    tipPercentage: Math.floor(Math.random() * 10) + 15,
    tablesServed: Math.floor(Math.random() * 50) + 30,
    guestsServed: Math.floor(Math.random() * 200) + 100,
    averageServiceTime: Math.floor(Math.random() * 20) + 15,
    averageTableTurnover: Math.floor(Math.random() * 30) + 45,
    customerSatisfactionScore: (Math.random() * 1 + 4).toFixed(1),
    orderAccuracy: Math.floor(Math.random() * 5) + 95,
    upsellAmount: Math.floor(Math.random() * 500) + 200,
    breakdown: {},
    notes: '',
    branchId: 'BRANCH001',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// ========== Order History ==========

/**
 * Get server order history
 */
export const getServerOrderHistory = async (serverId, filters = {}) => {
  await delay();

  let orders = mockServerOrderHistory.filter(o => o.serverId === serverId);

  if (filters.startDate) {
    orders = orders.filter(o => new Date(o.createdAt) >= new Date(filters.startDate));
  }

  if (filters.endDate) {
    orders = orders.filter(o => new Date(o.createdAt) <= new Date(filters.endDate));
  }

  if (filters.status) {
    orders = orders.filter(o => o.status === filters.status);
  }

  if (filters.shiftId) {
    orders = orders.filter(o => o.shiftId === filters.shiftId);
  }

  return {
    success: true,
    data: orders,
    total: orders.length,
  };
};

// ========== Tip Tracking ==========

/**
 * Get server tips
 */
export const getServerTips = async (serverId, filters = {}) => {
  await delay();

  let tips = mockServerTips.filter(t => t.serverId === serverId);

  if (filters.startDate) {
    tips = tips.filter(t => new Date(t.date) >= new Date(filters.startDate));
  }

  if (filters.endDate) {
    tips = tips.filter(t => new Date(t.date) <= new Date(filters.endDate));
  }

  if (filters.shiftId) {
    tips = tips.filter(t => t.shiftId === filters.shiftId);
  }

  return {
    success: true,
    data: tips,
    total: tips.length,
    summary: {
      totalTips: tips.reduce((sum, t) => sum + t.tipAmount, 0),
      averageTip: tips.length > 0 ? tips.reduce((sum, t) => sum + t.tipAmount, 0) / tips.length : 0,
      averageTipPercentage: tips.length > 0 ? tips.reduce((sum, t) => sum + t.tipPercentage, 0) / tips.length : 0,
      cashTips: tips.filter(t => t.tipType === 'cash').reduce((sum, t) => sum + t.tipAmount, 0),
      cardTips: tips.filter(t => t.tipType === 'card').reduce((sum, t) => sum + t.tipAmount, 0),
    },
  };
};

/**
 * Record tip
 */
export const recordTip = async (tipData) => {
  await delay();

  const newTip = {
    ...tipData,
    id: generateId(),
    tipPercentage: calculateTipPercentage(tipData.tipAmount, tipData.orderAmount),
    createdAt: new Date(),
  };

  mockServerTips.push(newTip);

  return {
    success: true,
    data: newTip,
    message: 'Tip recorded successfully',
  };
};

// ========== Reports ==========

/**
 * Generate server report
 */
export const generateServerReport = async (reportData) => {
  await delay(1000);

  const { serverId, startDate, endDate, reportType } = reportData;

  // Get performance data
  const performance = await getServerPerformance(serverId, { startDate, endDate });

  // Generate report
  const report = {
    id: generateId(),
    reportType,
    serverId,
    serverName: performance.data.serverName,
    startDate,
    endDate,
    performance: performance.data,
    comparison: {
      salesChange: Math.floor(Math.random() * 20) - 10,
      tipsChange: Math.floor(Math.random() * 20) - 10,
      ordersChange: Math.floor(Math.random() * 20) - 10,
    },
    rankings: {
      salesRank: Math.floor(Math.random() * 10) + 1,
      tipsRank: Math.floor(Math.random() * 10) + 1,
      satisfactionRank: Math.floor(Math.random() * 10) + 1,
    },
    dailyBreakdown: [],
    topItems: [],
    insights: {
      strengths: ['High customer satisfaction', 'Consistent performance'],
      improvements: ['Reduce service time', 'Increase upsell rate'],
    },
    generatedBy: 'system',
    generatedAt: new Date(),
  };

  return {
    success: true,
    data: report,
    message: 'Report generated successfully',
  };
};

// ========== Stats ==========

/**
 * Get server management stats
 */
export const getServerManagementStats = async () => {
  await delay();

  const activeShifts = mockShifts.filter(s => s.status === SHIFT_STATUS.ACTIVE);
  const todayOrders = mockServerOrderHistory.filter(o => {
    const today = new Date();
    const orderDate = new Date(o.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });
  const todayTips = mockServerTips.filter(t => {
    const today = new Date();
    const tipDate = new Date(t.date);
    return tipDate.toDateString() === today.toDateString();
  });

  return {
    success: true,
    data: {
      totalServers: new Set(mockShifts.map(s => s.serverId)).size,
      serversOnShift: activeShifts.length,
      totalSections: mockSections.length,
      activeSections: mockSections.filter(s => s.isActive).length,
      totalActiveOrders: todayOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length,
      totalDailySales: todayOrders.reduce((sum, o) => sum + o.total, 0),
      totalDailyTips: todayTips.reduce((sum, t) => sum + t.tipAmount, 0),
      averageServiceTime: todayOrders
        .filter(o => o.serviceTime)
        .reduce((sum, o, _, arr) => sum + o.serviceTime / (arr.length || 1), 0) || 0,
    },
  };
};

export default {
  // Sections
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection,

  // Assignments
  getServerAssignments,
  createServerAssignment,
  updateServerAssignment,
  endServerAssignment,

  // Shifts
  getShifts,
  getShiftById,
  createShift,
  clockIn,
  clockOut,
  addBreak,

  // Performance
  getServerPerformance,

  // Order History
  getServerOrderHistory,

  // Tips
  getServerTips,
  recordTip,

  // Reports
  generateServerReport,

  // Stats
  getServerManagementStats,
};
