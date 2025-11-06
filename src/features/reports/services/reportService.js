import {
  REPORT_TYPES,
  REPORT_STATUS,
  DATE_RANGE_PRESETS,
} from '../types/report.types.js';
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  subDays,
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
} from 'date-fns';

// Utility function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility function to generate unique ID
const generateId = () => `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Mock data for reports
let MOCK_REPORTS = [
  {
    id: 'RPT-001',
    title: 'Monthly Sales Report - January 2025',
    type: REPORT_TYPES.SALES,
    description: 'Comprehensive sales analysis for January 2025',
    status: REPORT_STATUS.GENERATED,
    createdAt: new Date('2025-02-01T10:00:00'),
    updatedAt: new Date('2025-02-01T10:00:00'),
    filters: {
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
    },
    data: {
      totalSales: 125000,
      totalTransactions: 523,
      averageTransaction: 239,
      topProducts: [
        { id: 'P001', name: 'Yoga Mat Premium', sales: 45, revenue: 13500 },
        { id: 'P002', name: 'Meditation Cushion', sales: 32, revenue: 9600 },
        { id: 'P003', name: 'Yoga Block Set', sales: 28, revenue: 5600 },
      ],
      salesByDay: [
        { date: '2025-01-01', sales: 4200 },
        { date: '2025-01-02', sales: 3800 },
        { date: '2025-01-03', sales: 4100 },
      ],
    },
    metadata: {
      generatedBy: 'admin@yoga.com',
      recordCount: 523,
      processingTime: 1250,
    },
  },
  {
    id: 'RPT-002',
    title: 'Revenue Report - Q1 2025',
    type: REPORT_TYPES.REVENUE,
    description: 'Quarterly revenue breakdown by branch and category',
    status: REPORT_STATUS.GENERATED,
    createdAt: new Date('2025-04-01T09:30:00'),
    updatedAt: new Date('2025-04-01T09:30:00'),
    filters: {
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-03-31'),
    },
    data: {
      totalRevenue: 375000,
      revenueByMonth: [
        { month: 'January', revenue: 125000 },
        { month: 'February', revenue: 120000 },
        { month: 'March', revenue: 130000 },
      ],
      revenueByBranch: [
        { branchId: 'B001', name: 'Main Studio', revenue: 180000 },
        { branchId: 'B002', name: 'East Branch', revenue: 195000 },
      ],
      revenueByCategory: [
        { category: 'Classes', revenue: 225000 },
        { category: 'Products', revenue: 100000 },
        { category: 'Memberships', revenue: 50000 },
      ],
    },
    metadata: {
      generatedBy: 'manager@yoga.com',
      recordCount: 1456,
      processingTime: 2100,
    },
  },
  {
    id: 'RPT-003',
    title: 'Customer Activity Report - March 2025',
    type: REPORT_TYPES.CUSTOMERS,
    description: 'Customer engagement and retention metrics',
    status: REPORT_STATUS.GENERATED,
    createdAt: new Date('2025-04-02T14:15:00'),
    updatedAt: new Date('2025-04-02T14:15:00'),
    filters: {
      startDate: new Date('2025-03-01'),
      endDate: new Date('2025-03-31'),
    },
    data: {
      totalCustomers: 342,
      newCustomers: 45,
      activeCustomers: 287,
      churnRate: 3.2,
      averageLifetimeValue: 850,
      topCustomers: [
        { id: 'C001', name: 'Sarah Johnson', visits: 28, spent: 4200 },
        { id: 'C002', name: 'Michael Chen', visits: 24, spent: 3800 },
        { id: 'C003', name: 'Emma Wilson', visits: 22, spent: 3600 },
      ],
    },
    metadata: {
      generatedBy: 'admin@yoga.com',
      recordCount: 342,
      processingTime: 980,
    },
  },
  {
    id: 'RPT-004',
    title: 'Product Performance - January 2025',
    type: REPORT_TYPES.PRODUCTS,
    description: 'Best and worst performing products',
    status: REPORT_STATUS.GENERATED,
    createdAt: new Date('2025-02-03T11:20:00'),
    updatedAt: new Date('2025-02-03T11:20:00'),
    filters: {
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-31'),
    },
    data: {
      totalProducts: 156,
      productsInStock: 142,
      lowStockProducts: 8,
      outOfStockProducts: 6,
      topPerformers: [
        { id: 'P001', name: 'Yoga Mat Premium', unitsSold: 45, revenue: 13500 },
        { id: 'P002', name: 'Meditation Cushion', unitsSold: 32, revenue: 9600 },
      ],
      lowPerformers: [
        { id: 'P045', name: 'Yoga DVD Set', unitsSold: 2, revenue: 40 },
        { id: 'P089', name: 'Incense Holder', unitsSold: 3, revenue: 45 },
      ],
    },
    metadata: {
      generatedBy: 'inventory@yoga.com',
      recordCount: 156,
      processingTime: 1450,
    },
  },
  {
    id: 'RPT-005',
    title: 'Payment Methods Analysis - February 2025',
    type: REPORT_TYPES.PAYMENTS,
    description: 'Payment method distribution and trends',
    status: REPORT_STATUS.GENERATED,
    createdAt: new Date('2025-03-01T16:45:00'),
    updatedAt: new Date('2025-03-01T16:45:00'),
    filters: {
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-02-28'),
    },
    data: {
      totalTransactions: 487,
      totalAmount: 120000,
      byMethod: [
        { method: 'Credit Card', count: 245, amount: 68000 },
        { method: 'Debit Card', count: 128, amount: 32000 },
        { method: 'Cash', count: 89, amount: 15000 },
        { method: 'Mobile Payment', count: 25, amount: 5000 },
      ],
      averageTransactionValue: 246,
      successRate: 98.5,
    },
    metadata: {
      generatedBy: 'finance@yoga.com',
      recordCount: 487,
      processingTime: 890,
    },
  },
];

/**
 * Get date range based on preset
 */
const getDateRangeFromPreset = (preset) => {
  const now = new Date();

  switch (preset) {
    case DATE_RANGE_PRESETS.TODAY:
      return {
        startDate: startOfDay(now),
        endDate: endOfDay(now),
      };
    case DATE_RANGE_PRESETS.YESTERDAY:
      return {
        startDate: startOfDay(subDays(now, 1)),
        endDate: endOfDay(subDays(now, 1)),
      };
    case DATE_RANGE_PRESETS.THIS_WEEK:
      return {
        startDate: startOfWeek(now),
        endDate: endOfWeek(now),
      };
    case DATE_RANGE_PRESETS.LAST_WEEK:
      return {
        startDate: startOfWeek(subWeeks(now, 1)),
        endDate: endOfWeek(subWeeks(now, 1)),
      };
    case DATE_RANGE_PRESETS.THIS_MONTH:
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      };
    case DATE_RANGE_PRESETS.LAST_MONTH:
      return {
        startDate: startOfMonth(subMonths(now, 1)),
        endDate: endOfMonth(subMonths(now, 1)),
      };
    case DATE_RANGE_PRESETS.THIS_QUARTER:
      return {
        startDate: startOfQuarter(now),
        endDate: endOfQuarter(now),
      };
    case DATE_RANGE_PRESETS.LAST_QUARTER:
      return {
        startDate: startOfQuarter(subQuarters(now, 1)),
        endDate: endOfQuarter(subQuarters(now, 1)),
      };
    case DATE_RANGE_PRESETS.THIS_YEAR:
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now),
      };
    case DATE_RANGE_PRESETS.LAST_YEAR:
      return {
        startDate: startOfYear(subYears(now, 1)),
        endDate: endOfYear(subYears(now, 1)),
      };
    default:
      return { startDate: null, endDate: null };
  }
};

/**
 * Report Service
 */
const reportService = {
  /**
   * Get list of reports with optional filters
   */
  async getList(filters = {}) {
    await delay(600);

    let filtered = [...MOCK_REPORTS];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchLower) ||
          report.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter((report) => report.type === filters.type);
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((report) => report.status === filters.status);
    }

    // Apply date range filter
    if (filters.startDate) {
      filtered = filtered.filter(
        (report) => new Date(report.createdAt) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (report) => new Date(report.createdAt) <= new Date(filters.endDate)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[filters.sortBy];
        const bVal = b[filters.sortBy];

        if (filters.sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    } else {
      // Default sort by createdAt descending
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  },

  /**
   * Get a single report by ID
   */
  async getById(id) {
    await delay(300);
    const report = MOCK_REPORTS.find((r) => r.id === id);
    if (!report) {
      throw new Error('Report not found');
    }
    return report;
  },

  /**
   * Generate a new report
   */
  async generate(reportData) {
    await delay(1500); // Simulate processing time

    const { type, title, description, filters, datePreset } = reportData;

    // Get date range from preset if provided
    let dateRange = {};
    if (datePreset && datePreset !== DATE_RANGE_PRESETS.CUSTOM) {
      dateRange = getDateRangeFromPreset(datePreset);
    } else if (filters.startDate && filters.endDate) {
      dateRange = {
        startDate: filters.startDate,
        endDate: filters.endDate,
      };
    }

    // Generate mock data based on report type
    const mockData = this.generateMockData(type);

    const newReport = {
      id: generateId(),
      title: title || `${type} Report - ${new Date().toLocaleDateString()}`,
      type,
      description: description || `Generated ${type} report`,
      status: REPORT_STATUS.GENERATED,
      createdAt: new Date(),
      updatedAt: new Date(),
      filters: {
        ...filters,
        ...dateRange,
      },
      data: mockData,
      metadata: {
        generatedBy: 'current.user@yoga.com',
        recordCount: Math.floor(Math.random() * 1000) + 100,
        processingTime: Math.floor(Math.random() * 2000) + 500,
      },
    };

    MOCK_REPORTS.unshift(newReport);
    return newReport;
  },

  /**
   * Generate mock data based on report type
   */
  generateMockData(type) {
    const baseAmount = Math.floor(Math.random() * 100000) + 50000;

    switch (type) {
      case REPORT_TYPES.SALES:
        return {
          totalSales: baseAmount,
          totalTransactions: Math.floor(baseAmount / 200),
          averageTransaction: 200 + Math.floor(Math.random() * 100),
          topProducts: [
            {
              id: 'P001',
              name: 'Yoga Mat Premium',
              sales: Math.floor(Math.random() * 50) + 20,
              revenue: Math.floor(Math.random() * 15000) + 5000,
            },
            {
              id: 'P002',
              name: 'Meditation Cushion',
              sales: Math.floor(Math.random() * 40) + 15,
              revenue: Math.floor(Math.random() * 10000) + 3000,
            },
          ],
        };

      case REPORT_TYPES.REVENUE:
        return {
          totalRevenue: baseAmount,
          revenueByMonth: [
            { month: 'Month 1', revenue: Math.floor(baseAmount / 3) },
            { month: 'Month 2', revenue: Math.floor(baseAmount / 3) },
            { month: 'Month 3', revenue: Math.floor(baseAmount / 3) },
          ],
          revenueByCategory: [
            { category: 'Classes', revenue: Math.floor(baseAmount * 0.6) },
            { category: 'Products', revenue: Math.floor(baseAmount * 0.3) },
            { category: 'Memberships', revenue: Math.floor(baseAmount * 0.1) },
          ],
        };

      case REPORT_TYPES.CUSTOMERS:
        return {
          totalCustomers: Math.floor(Math.random() * 400) + 200,
          newCustomers: Math.floor(Math.random() * 50) + 20,
          activeCustomers: Math.floor(Math.random() * 350) + 150,
          churnRate: (Math.random() * 5).toFixed(1),
          averageLifetimeValue: Math.floor(Math.random() * 1000) + 500,
        };

      case REPORT_TYPES.PRODUCTS:
        return {
          totalProducts: Math.floor(Math.random() * 200) + 100,
          productsInStock: Math.floor(Math.random() * 180) + 90,
          lowStockProducts: Math.floor(Math.random() * 15) + 5,
          outOfStockProducts: Math.floor(Math.random() * 10) + 2,
        };

      case REPORT_TYPES.PAYMENTS:
        return {
          totalTransactions: Math.floor(Math.random() * 600) + 300,
          totalAmount: baseAmount,
          byMethod: [
            {
              method: 'Credit Card',
              count: Math.floor(Math.random() * 300) + 150,
              amount: Math.floor(baseAmount * 0.5),
            },
            {
              method: 'Debit Card',
              count: Math.floor(Math.random() * 150) + 75,
              amount: Math.floor(baseAmount * 0.3),
            },
            {
              method: 'Cash',
              count: Math.floor(Math.random() * 100) + 50,
              amount: Math.floor(baseAmount * 0.2),
            },
          ],
          successRate: (95 + Math.random() * 4).toFixed(1),
        };

      case REPORT_TYPES.BOOKINGS:
        return {
          totalBookings: Math.floor(Math.random() * 500) + 200,
          completedBookings: Math.floor(Math.random() * 400) + 150,
          cancelledBookings: Math.floor(Math.random() * 50) + 10,
          noShowBookings: Math.floor(Math.random() * 30) + 5,
          attendanceRate: (85 + Math.random() * 10).toFixed(1),
        };

      case REPORT_TYPES.STAFF:
        return {
          totalStaff: Math.floor(Math.random() * 30) + 10,
          activeStaff: Math.floor(Math.random() * 25) + 8,
          averagePerformanceRating: (4.0 + Math.random()).toFixed(1),
          totalClassesConducted: Math.floor(Math.random() * 500) + 200,
        };

      case REPORT_TYPES.INVENTORY:
        return {
          totalItems: Math.floor(Math.random() * 300) + 100,
          totalValue: baseAmount,
          lowStockItems: Math.floor(Math.random() * 20) + 5,
          outOfStockItems: Math.floor(Math.random() * 10) + 2,
          turnoverRate: (5 + Math.random() * 5).toFixed(1),
        };

      case REPORT_TYPES.BRANCH:
        return {
          totalBranches: Math.floor(Math.random() * 5) + 2,
          topPerformer: 'Main Studio',
          totalRevenue: baseAmount,
          averageRevenuePerBranch: Math.floor(baseAmount / 3),
        };

      default:
        return { message: 'Report data generated successfully' };
    }
  },

  /**
   * Update an existing report
   */
  async update(id, updates) {
    await delay(500);

    const index = MOCK_REPORTS.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Report not found');
    }

    MOCK_REPORTS[index] = {
      ...MOCK_REPORTS[index],
      ...updates,
      updatedAt: new Date(),
    };

    return MOCK_REPORTS[index];
  },

  /**
   * Delete a report
   */
  async remove(id) {
    await delay(400);

    const index = MOCK_REPORTS.findIndex((r) => r.id === id);
    if (index === -1) {
      throw new Error('Report not found');
    }

    MOCK_REPORTS.splice(index, 1);
    return true;
  },

  /**
   * Archive a report
   */
  async archive(id) {
    await delay(400);
    return this.update(id, { status: REPORT_STATUS.ARCHIVED });
  },

  /**
   * Export a report in specified format
   */
  async export(id, format) {
    await delay(800);

    const report = MOCK_REPORTS.find((r) => r.id === id);
    if (!report) {
      throw new Error('Report not found');
    }

    // Simulate export
    return {
      success: true,
      format,
      filename: `${report.title.replace(/\s+/g, '_')}.${format}`,
      downloadUrl: `#download-${id}-${format}`,
    };
  },

  /**
   * Get report statistics
   */
  async getStats() {
    await delay(400);

    const now = new Date();
    const today = startOfDay(now);
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    const todayReports = MOCK_REPORTS.filter(
      (r) => new Date(r.createdAt) >= today
    ).length;

    const weekReports = MOCK_REPORTS.filter(
      (r) => new Date(r.createdAt) >= weekStart
    ).length;

    const monthReports = MOCK_REPORTS.filter(
      (r) => new Date(r.createdAt) >= monthStart
    ).length;

    const byType = {};
    const byStatus = {};

    MOCK_REPORTS.forEach((report) => {
      byType[report.type] = (byType[report.type] || 0) + 1;
      byStatus[report.status] = (byStatus[report.status] || 0) + 1;
    });

    return {
      totalReports: MOCK_REPORTS.length,
      todayReports,
      weekReports,
      monthReports,
      byType,
      byStatus,
    };
  },

  /**
   * Bulk delete reports
   */
  async bulkDelete(ids) {
    await delay(600);

    let deleted = 0;
    ids.forEach((id) => {
      const index = MOCK_REPORTS.findIndex((r) => r.id === id);
      if (index !== -1) {
        MOCK_REPORTS.splice(index, 1);
        deleted++;
      }
    });

    return deleted;
  },

  /**
   * Bulk archive reports
   */
  async bulkArchive(ids) {
    await delay(600);

    let archived = 0;
    ids.forEach((id) => {
      const index = MOCK_REPORTS.findIndex((r) => r.id === id);
      if (index !== -1) {
        MOCK_REPORTS[index].status = REPORT_STATUS.ARCHIVED;
        MOCK_REPORTS[index].updatedAt = new Date();
        archived++;
      }
    });

    return archived;
  },

  /**
   * Get consolidated sales report across all branches
   */
  async getConsolidatedSalesReport(filters = {}) {
    await delay(1000);

    const mockBranches = [
      { id: 'branch-001', name: 'Downtown Yoga Studio', code: 'BR001' },
      { id: 'branch-002', name: 'Marina District Studio', code: 'BR002' },
      { id: 'branch-004', name: 'Oakland Yoga Center', code: 'BR004' },
      { id: 'branch-005', name: 'Berkeley Wellness Studio', code: 'BR005' },
    ];

    const branchSales = mockBranches.map(branch => ({
      branchId: branch.id,
      branchName: branch.name,
      branchCode: branch.code,
      totalSales: Math.floor(Math.random() * 50000) + 30000,
      transactionCount: Math.floor(Math.random() * 300) + 200,
      averageTicketSize: Math.floor(Math.random() * 50) + 120,
      topProducts: [
        {
          id: 'prod_001',
          name: 'Premium Yoga Mat',
          quantity: Math.floor(Math.random() * 30) + 20,
          revenue: Math.floor(Math.random() * 5000) + 3000,
        },
        {
          id: 'prod_002',
          name: 'Yoga Block Set',
          quantity: Math.floor(Math.random() * 25) + 15,
          revenue: Math.floor(Math.random() * 3000) + 2000,
        },
      ],
    }));

    const totalSales = branchSales.reduce((sum, b) => sum + b.totalSales, 0);
    const totalTransactions = branchSales.reduce((sum, b) => sum + b.transactionCount, 0);

    return {
      summary: {
        totalSales,
        totalTransactions,
        averageTicketSize: totalSales / totalTransactions,
        branchCount: branchSales.length,
      },
      branchSales: branchSales.sort((a, b) => b.totalSales - a.totalSales),
      topPerformingBranch: branchSales.reduce((max, b) =>
        b.totalSales > max.totalSales ? b : max
      ),
      comparisonData: {
        salesByBranch: branchSales.map(b => ({
          branchName: b.branchName,
          sales: b.totalSales,
        })),
        transactionsByBranch: branchSales.map(b => ({
          branchName: b.branchName,
          transactions: b.transactionCount,
        })),
      },
    };
  },

  /**
   * Get consolidated inventory report across all branches
   */
  async getConsolidatedInventoryReport(filters = {}) {
    await delay(1000);

    const mockBranches = [
      { id: 'branch-001', name: 'Downtown Yoga Studio' },
      { id: 'branch-002', name: 'Marina District Studio' },
      { id: 'branch-004', name: 'Oakland Yoga Center' },
      { id: 'branch-005', name: 'Berkeley Wellness Studio' },
    ];

    const branchInventory = mockBranches.map(branch => ({
      branchId: branch.id,
      branchName: branch.name,
      totalItems: Math.floor(Math.random() * 100) + 50,
      totalValue: Math.floor(Math.random() * 20000) + 8000,
      lowStockItems: Math.floor(Math.random() * 10) + 3,
      outOfStockItems: Math.floor(Math.random() * 5) + 1,
    }));

    const totalItems = branchInventory.reduce((sum, b) => sum + b.totalItems, 0);
    const totalValue = branchInventory.reduce((sum, b) => sum + b.totalValue, 0);
    const totalLowStock = branchInventory.reduce((sum, b) => sum + b.lowStockItems, 0);
    const totalOutOfStock = branchInventory.reduce((sum, b) => sum + b.outOfStockItems, 0);

    return {
      summary: {
        totalItems,
        totalValue,
        lowStockItems: totalLowStock,
        outOfStockItems: totalOutOfStock,
        branchCount: branchInventory.length,
        averageValuePerBranch: totalValue / branchInventory.length,
      },
      branchInventory: branchInventory.sort((a, b) => b.totalValue - a.totalValue),
      alerts: {
        branchesWithLowStock: branchInventory.filter(b => b.lowStockItems > 5).length,
        branchesWithOutOfStock: branchInventory.filter(b => b.outOfStockItems > 2).length,
      },
    };
  },

  /**
   * Get branch comparison report
   */
  async getBranchComparisonReport(branchIds, filters = {}) {
    await delay(800);

    const metrics = branchIds.map(branchId => ({
      branchId,
      branchName: `Branch ${branchId.slice(-3)}`,
      sales: Math.floor(Math.random() * 50000) + 30000,
      transactions: Math.floor(Math.random() * 300) + 200,
      customers: Math.floor(Math.random() * 200) + 150,
      averageTicketSize: Math.floor(Math.random() * 50) + 120,
      inventoryValue: Math.floor(Math.random() * 20000) + 8000,
      staffCount: Math.floor(Math.random() * 5) + 4,
    }));

    return {
      metrics,
      comparison: {
        highestSales: metrics.reduce((max, m) => m.sales > max.sales ? m : max),
        lowestSales: metrics.reduce((min, m) => m.sales < min.sales ? m : min),
        highestTransactions: metrics.reduce((max, m) => m.transactions > max.transactions ? m : max),
        mostCustomers: metrics.reduce((max, m) => m.customers > max.customers ? m : max),
      },
      averages: {
        avgSales: metrics.reduce((sum, m) => sum + m.sales, 0) / metrics.length,
        avgTransactions: metrics.reduce((sum, m) => sum + m.transactions, 0) / metrics.length,
        avgCustomers: metrics.reduce((sum, m) => sum + m.customers, 0) / metrics.length,
      },
    };
  },

  /**
   * Get inter-branch transfer report
   */
  async getInterBranchTransferReport(filters = {}) {
    await delay(900);

    const mockTransfers = [
      {
        id: 'TRF-001',
        date: new Date('2025-10-01'),
        fromBranch: 'Downtown Yoga Studio',
        toBranch: 'Marina District Studio',
        productName: 'Premium Yoga Mat',
        quantity: 10,
        status: 'completed',
      },
      {
        id: 'TRF-002',
        date: new Date('2025-10-15'),
        fromBranch: 'Oakland Yoga Center',
        toBranch: 'Berkeley Wellness Studio',
        productName: 'Yoga Block Set',
        quantity: 15,
        status: 'completed',
      },
      {
        id: 'TRF-003',
        date: new Date('2025-10-20'),
        fromBranch: 'Marina District Studio',
        toBranch: 'Downtown Yoga Studio',
        productName: 'Meditation Cushion',
        quantity: 8,
        status: 'in_transit',
      },
    ];

    return {
      transfers: mockTransfers,
      summary: {
        totalTransfers: mockTransfers.length,
        completedTransfers: mockTransfers.filter(t => t.status === 'completed').length,
        inTransitTransfers: mockTransfers.filter(t => t.status === 'in_transit').length,
        totalItemsTransferred: mockTransfers.reduce((sum, t) => sum + t.quantity, 0),
      },
      mostActiveRoutes: [
        { from: 'Downtown Yoga Studio', to: 'Marina District Studio', count: 5 },
        { from: 'Oakland Yoga Center', to: 'Berkeley Wellness Studio', count: 3 },
      ],
    };
  },

  /**
   * Get consolidated revenue report across all branches
   */
  async getConsolidatedRevenueReport(filters = {}) {
    await delay(1000);

    const mockBranches = [
      { id: 'branch-001', name: 'Downtown Yoga Studio', code: 'BR001' },
      { id: 'branch-002', name: 'Marina District Studio', code: 'BR002' },
      { id: 'branch-004', name: 'Oakland Yoga Center', code: 'BR004' },
      { id: 'branch-005', name: 'Berkeley Wellness Studio', code: 'BR005' },
    ];

    const monthlyData = mockBranches.map(branch => ({
      branchId: branch.id,
      branchName: branch.name,
      branchCode: branch.code,
      revenue: Math.floor(Math.random() * 50000) + 30000,
      growth: (Math.random() * 20 - 5).toFixed(2), // -5% to +15%
    }));

    const totalRevenue = monthlyData.reduce((sum, b) => sum + b.revenue, 0);

    return {
      summary: {
        totalRevenue,
        branchCount: monthlyData.length,
        averageRevenuePerBranch: totalRevenue / monthlyData.length,
        topRevenueBranch: monthlyData.reduce((max, b) => b.revenue > max.revenue ? b : max),
      },
      branchRevenue: monthlyData.sort((a, b) => b.revenue - a.revenue),
      trends: {
        growingBranches: monthlyData.filter(b => parseFloat(b.growth) > 0).length,
        decliningBranches: monthlyData.filter(b => parseFloat(b.growth) < 0).length,
      },
    };
  },

  /**
   * Get reports (wrapper for getList with consistent API format)
   */
  async getReports(filters = {}) {
    const reports = await this.getList(filters);
    return {
      items: reports,
      total: reports.length,
    };
  },
};

export { reportService };
export default reportService;
