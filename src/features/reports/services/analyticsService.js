import {
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  format,
  subDays,
  subMonths,
  differenceInDays
} from 'date-fns';

/**
 * Analytics Service
 * Provides comprehensive reporting and analytics data
 */

// Utility function to simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Utility to generate random number in range
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Utility to generate random decimal in range
const randomDecimal = (min, max, decimals = 2) => {
  return (Math.random() * (max - min) + min).toFixed(decimals);
};

/**
 * Generate comprehensive sales report with period breakdowns
 */
export const generateSalesReport = async (filters = {}) => {
  await delay(800);

  const { startDate, endDate, groupBy = 'day', branchId } = filters;
  const start = startDate ? new Date(startDate) : subDays(new Date(), 30);
  const end = endDate ? new Date(endDate) : new Date();

  // Generate daily sales data
  const dailySales = eachDayOfInterval({ start, end }).map(date => ({
    date: format(date, 'yyyy-MM-DD'),
    dateLabel: format(date, 'MMM dd'),
    sales: randomInRange(3000, 8000),
    transactions: randomInRange(15, 45),
    customers: randomInRange(12, 40),
  }));

  const totalSales = dailySales.reduce((sum, day) => sum + day.sales, 0);
  const totalTransactions = dailySales.reduce((sum, day) => sum + day.transactions, 0);
  const totalCustomers = dailySales.reduce((sum, day) => sum + day.customers, 0);

  // Top selling products
  const topProducts = [
    { id: 'P001', name: 'Premium Yoga Mat', sku: 'YM-001', unitsSold: randomInRange(45, 85), revenue: randomInRange(8000, 15000), profit: randomInRange(2000, 5000) },
    { id: 'P002', name: 'Meditation Cushion', sku: 'MC-002', unitsSold: randomInRange(35, 65), revenue: randomInRange(5000, 10000), profit: randomInRange(1500, 3500) },
    { id: 'P003', name: 'Yoga Block Set', sku: 'YB-003', unitsSold: randomInRange(30, 60), revenue: randomInRange(3000, 8000), profit: randomInRange(1000, 3000) },
    { id: 'P004', name: 'Resistance Bands', sku: 'RB-004', unitsSold: randomInRange(25, 50), revenue: randomInRange(2500, 6000), profit: randomInRange(800, 2000) },
    { id: 'P005', name: 'Yoga Strap', sku: 'YS-005', unitsSold: randomInRange(20, 45), revenue: randomInRange(1500, 4000), profit: randomInRange(500, 1500) },
  ].sort((a, b) => b.revenue - a.revenue);

  // Sales by category
  const salesByCategory = [
    { category: 'Yoga Equipment', sales: randomInRange(25000, 45000), percentage: 45, itemsSold: randomInRange(150, 300) },
    { category: 'Classes & Memberships', sales: randomInRange(20000, 35000), percentage: 30, itemsSold: randomInRange(80, 150) },
    { category: 'Apparel', sales: randomInRange(12000, 22000), percentage: 15, itemsSold: randomInRange(50, 100) },
    { category: 'Accessories', sales: randomInRange(8000, 15000), percentage: 10, itemsSold: randomInRange(40, 80) },
  ];

  // Sales by payment method
  const salesByPaymentMethod = [
    { method: 'Credit Card', amount: totalSales * 0.55, transactions: Math.floor(totalTransactions * 0.5), percentage: 55 },
    { method: 'Debit Card', amount: totalSales * 0.25, transactions: Math.floor(totalTransactions * 0.28), percentage: 25 },
    { method: 'Cash', amount: totalSales * 0.15, transactions: Math.floor(totalTransactions * 0.17), percentage: 15 },
    { method: 'Mobile Payment', amount: totalSales * 0.05, transactions: Math.floor(totalTransactions * 0.05), percentage: 5 },
  ];

  // Hourly sales pattern
  const hourlySales = Array.from({ length: 14 }, (_, i) => ({
    hour: i + 6, // 6 AM to 8 PM
    hourLabel: `${i + 6}:00`,
    sales: randomInRange(500, 2500),
    transactions: randomInRange(5, 25),
  }));

  return {
    summary: {
      totalSales,
      totalTransactions,
      totalCustomers,
      averageTransaction: totalSales / totalTransactions,
      averageBasketSize: totalSales / totalCustomers,
      growthRate: randomDecimal(-5, 25),
    },
    dailySales,
    topProducts,
    salesByCategory,
    salesByPaymentMethod,
    hourlySales,
    trends: {
      bestDay: dailySales.reduce((max, day) => day.sales > max.sales ? day : max),
      worstDay: dailySales.reduce((min, day) => day.sales < min.sales ? day : min),
      averageDailySales: totalSales / dailySales.length,
    },
  };
};

/**
 * Generate inventory valuation report
 */
export const generateInventoryValuationReport = async (filters = {}) => {
  await delay(700);

  const categories = [
    {
      category: 'Yoga Equipment',
      items: 45,
      stockQuantity: 456,
      totalCost: randomInRange(15000, 25000),
      totalRetail: randomInRange(28000, 45000),
      profitMargin: randomDecimal(35, 55),
    },
    {
      category: 'Apparel',
      items: 78,
      stockQuantity: 892,
      totalCost: randomInRange(12000, 20000),
      totalRetail: randomInRange(22000, 38000),
      profitMargin: randomDecimal(40, 60),
    },
    {
      category: 'Accessories',
      items: 34,
      stockQuantity: 234,
      totalCost: randomInRange(5000, 10000),
      totalRetail: randomInRange(9000, 18000),
      profitMargin: randomDecimal(30, 50),
    },
    {
      category: 'Supplements',
      items: 23,
      stockQuantity: 156,
      totalCost: randomInRange(3000, 6000),
      totalRetail: randomInRange(6000, 12000),
      profitMargin: randomDecimal(45, 65),
    },
  ];

  const totalItems = categories.reduce((sum, cat) => sum + cat.items, 0);
  const totalStock = categories.reduce((sum, cat) => sum + cat.stockQuantity, 0);
  const totalCostValue = categories.reduce((sum, cat) => sum + cat.totalCost, 0);
  const totalRetailValue = categories.reduce((sum, cat) => sum + cat.totalRetail, 0);
  const overallProfitMargin = ((totalRetailValue - totalCostValue) / totalCostValue * 100).toFixed(2);

  // Stock status breakdown
  const stockStatus = {
    inStock: randomInRange(140, 160),
    lowStock: randomInRange(15, 25),
    outOfStock: randomInRange(8, 15),
    overStock: randomInRange(5, 12),
  };

  // Top value items
  const topValueItems = [
    { id: 'P001', name: 'Premium Yoga Mat', quantity: 45, costValue: 6750, retailValue: 13500, profitPotential: 6750 },
    { id: 'P015', name: 'Advanced Meditation Set', quantity: 12, costValue: 4800, retailValue: 9600, profitPotential: 4800 },
    { id: 'P023', name: 'Pro Yoga Wheel', quantity: 23, costValue: 3450, retailValue: 6900, profitPotential: 3450 },
    { id: 'P007', name: 'Premium Yoga Blocks', quantity: 56, costValue: 2240, retailValue: 5600, profitPotential: 3360 },
    { id: 'P034', name: 'Eco Yoga Bag', quantity: 34, costValue: 1700, retailValue: 4080, profitPotential: 2380 },
  ];

  return {
    summary: {
      totalItems,
      totalStock,
      totalCostValue,
      totalRetailValue,
      overallProfitMargin,
      potentialProfit: totalRetailValue - totalCostValue,
    },
    categories,
    stockStatus,
    topValueItems,
    alerts: {
      lowStockAlerts: stockStatus.lowStock,
      outOfStockAlerts: stockStatus.outOfStock,
      overstockAlerts: stockStatus.overStock,
      reorderNeeded: stockStatus.lowStock + stockStatus.outOfStock,
    },
  };
};

/**
 * Generate profit and loss analysis
 */
export const generateProfitLossReport = async (filters = {}) => {
  await delay(900);

  const { startDate, endDate } = filters;
  const start = startDate ? new Date(startDate) : subMonths(new Date(), 3);
  const end = endDate ? new Date(endDate) : new Date();

  const revenue = {
    productSales: randomInRange(85000, 125000),
    classFees: randomInRange(45000, 75000),
    membershipFees: randomInRange(35000, 55000),
    other: randomInRange(5000, 15000),
  };

  const totalRevenue = Object.values(revenue).reduce((sum, val) => sum + val, 0);

  const costOfGoodsSold = {
    productCosts: revenue.productSales * 0.45,
    instructorPayments: revenue.classFees * 0.35,
    supplies: randomInRange(5000, 12000),
  };

  const totalCOGS = Object.values(costOfGoodsSold).reduce((sum, val) => sum + val, 0);
  const grossProfit = totalRevenue - totalCOGS;
  const grossMargin = ((grossProfit / totalRevenue) * 100).toFixed(2);

  const operatingExpenses = {
    rent: randomInRange(8000, 15000),
    utilities: randomInRange(2000, 4000),
    salaries: randomInRange(25000, 45000),
    marketing: randomInRange(3000, 8000),
    insurance: randomInRange(2000, 5000),
    maintenance: randomInRange(1500, 3500),
    software: randomInRange(1000, 2500),
    other: randomInRange(2000, 5000),
  };

  const totalOperatingExpenses = Object.values(operatingExpenses).reduce((sum, val) => sum + val, 0);
  const operatingIncome = grossProfit - totalOperatingExpenses;
  const operatingMargin = ((operatingIncome / totalRevenue) * 100).toFixed(2);

  const otherIncome = randomInRange(500, 2000);
  const otherExpenses = randomInRange(300, 1500);
  const taxes = operatingIncome * 0.25;

  const netIncome = operatingIncome + otherIncome - otherExpenses - taxes;
  const netMargin = ((netIncome / totalRevenue) * 100).toFixed(2);

  // Monthly breakdown
  const monthlyData = eachMonthOfInterval({ start, end }).map(date => ({
    month: format(date, 'MMM yyyy'),
    revenue: randomInRange(40000, 80000),
    expenses: randomInRange(30000, 55000),
    profit: 0,
  })).map(item => ({
    ...item,
    profit: item.revenue - item.expenses,
  }));

  return {
    period: {
      startDate: format(start, 'MMM dd, yyyy'),
      endDate: format(end, 'MMM dd, yyyy'),
    },
    revenue,
    totalRevenue,
    costOfGoodsSold,
    totalCOGS,
    grossProfit,
    grossMargin: parseFloat(grossMargin),
    operatingExpenses,
    totalOperatingExpenses,
    operatingIncome,
    operatingMargin: parseFloat(operatingMargin),
    otherIncome,
    otherExpenses,
    taxes,
    netIncome,
    netMargin: parseFloat(netMargin),
    monthlyData,
    ratios: {
      returnOnSales: netMargin,
      operatingRatio: ((totalOperatingExpenses / totalRevenue) * 100).toFixed(2),
      expenseRatio: (((totalCOGS + totalOperatingExpenses) / totalRevenue) * 100).toFixed(2),
    },
  };
};

/**
 * Generate slow-moving and dead stock report
 */
export const generateSlowMovingStockReport = async (filters = {}) => {
  await delay(600);

  const slowMovingItems = [
    {
      id: 'P089',
      name: 'Incense Holder Set',
      sku: 'IH-089',
      category: 'Accessories',
      quantity: 45,
      lastSold: '45 days ago',
      daysSinceLastSale: 45,
      stockValue: 450,
      turnoverRate: 0.5,
      recommendedAction: 'Discount 30%',
    },
    {
      id: 'P102',
      name: 'Vintage Yoga DVD Collection',
      sku: 'DVD-102',
      category: 'Media',
      quantity: 23,
      lastSold: '67 days ago',
      daysSinceLastSale: 67,
      stockValue: 230,
      turnoverRate: 0.3,
      recommendedAction: 'Clearance Sale',
    },
    {
      id: 'P145',
      name: 'Crystal Healing Set',
      sku: 'CH-145',
      category: 'Wellness',
      quantity: 18,
      lastSold: '52 days ago',
      daysSinceLastSale: 52,
      stockValue: 540,
      turnoverRate: 0.4,
      recommendedAction: 'Bundle Offer',
    },
    {
      id: 'P167',
      name: 'Yoga Chart Poster',
      sku: 'YCP-167',
      category: 'Accessories',
      quantity: 34,
      lastSold: '38 days ago',
      daysSinceLastSale: 38,
      stockValue: 340,
      turnoverRate: 0.6,
      recommendedAction: 'Promote',
    },
    {
      id: 'P178',
      name: 'Bamboo Meditation Bench',
      sku: 'BMB-178',
      category: 'Equipment',
      quantity: 8,
      lastSold: '89 days ago',
      daysSinceLastSale: 89,
      stockValue: 800,
      turnoverRate: 0.2,
      recommendedAction: 'Deep Discount',
    },
  ];

  const deadStockItems = [
    {
      id: 'P234',
      name: 'Outdated Fitness Band',
      sku: 'OFB-234',
      category: 'Electronics',
      quantity: 12,
      lastSold: '156 days ago',
      daysSinceLastSale: 156,
      stockValue: 1200,
      costToCarry: 120,
      recommendedAction: 'Write Off / Donate',
    },
    {
      id: 'P256',
      name: 'Old Brand Yoga Mat',
      sku: 'OBM-256',
      category: 'Equipment',
      quantity: 15,
      lastSold: '203 days ago',
      daysSinceLastSale: 203,
      stockValue: 750,
      costToCarry: 75,
      recommendedAction: 'Liquidate',
    },
    {
      id: 'P289',
      name: 'Discontinued Supplement',
      sku: 'DS-289',
      category: 'Supplements',
      quantity: 24,
      lastSold: '178 days ago',
      daysSinceLastSale: 178,
      stockValue: 480,
      costToCarry: 48,
      recommendedAction: 'Return to Supplier',
    },
  ];

  const totalSlowMovingValue = slowMovingItems.reduce((sum, item) => sum + item.stockValue, 0);
  const totalDeadStockValue = deadStockItems.reduce((sum, item) => sum + item.stockValue, 0);
  const totalCarryingCost = deadStockItems.reduce((sum, item) => sum + item.costToCarry, 0);

  return {
    summary: {
      slowMovingItemsCount: slowMovingItems.length,
      deadStockItemsCount: deadStockItems.length,
      totalSlowMovingValue,
      totalDeadStockValue,
      totalAtRiskValue: totalSlowMovingValue + totalDeadStockValue,
      totalCarryingCost,
      potentialLoss: totalDeadStockValue + totalCarryingCost,
    },
    slowMovingItems,
    deadStockItems,
    recommendations: {
      totalItemsNeedingAction: slowMovingItems.length + deadStockItems.length,
      discountOpportunities: slowMovingItems.filter(i => i.daysSinceLastSale < 60).length,
      clearanceRequired: deadStockItems.length,
      estimatedRecovery: (totalSlowMovingValue * 0.6 + totalDeadStockValue * 0.3).toFixed(2),
    },
    categoryBreakdown: {
      'Accessories': { items: 2, value: 790 },
      'Equipment': { items: 2, value: 1550 },
      'Media': { items: 1, value: 230 },
      'Wellness': { items: 1, value: 540 },
      'Electronics': { items: 1, value: 1200 },
      'Supplements': { items: 1, value: 480 },
    },
  };
};

/**
 * Generate employee performance report
 */
export const generateEmployeePerformanceReport = async (filters = {}) => {
  await delay(750);

  const employees = [
    {
      id: 'E001',
      name: 'Sarah Johnson',
      role: 'Yoga Instructor',
      salesGenerated: randomInRange(15000, 25000),
      classesCompleted: randomInRange(45, 75),
      studentRating: randomDecimal(4.5, 5.0, 1),
      attendanceRate: randomDecimal(95, 100),
      customerFeedback: 'Excellent',
      performance: 'Outstanding',
    },
    {
      id: 'E002',
      name: 'Michael Chen',
      role: 'Sales Associate',
      salesGenerated: randomInRange(18000, 28000),
      transactionsHandled: randomInRange(150, 250),
      averageTicketSize: randomInRange(120, 180),
      attendanceRate: randomDecimal(92, 98),
      customerFeedback: 'Very Good',
      performance: 'Exceeds Expectations',
    },
    {
      id: 'E003',
      name: 'Emma Wilson',
      role: 'Yoga Instructor',
      salesGenerated: randomInRange(12000, 20000),
      classesCompleted: randomInRange(40, 65),
      studentRating: randomDecimal(4.3, 4.9, 1),
      attendanceRate: randomDecimal(90, 96),
      customerFeedback: 'Very Good',
      performance: 'Meets Expectations',
    },
    {
      id: 'E004',
      name: 'David Brown',
      role: 'Store Manager',
      salesGenerated: randomInRange(22000, 35000),
      teamManaged: 8,
      customerComplaintsResolved: randomInRange(15, 25),
      attendanceRate: randomDecimal(96, 100),
      customerFeedback: 'Excellent',
      performance: 'Outstanding',
    },
    {
      id: 'E005',
      name: 'Lisa Martinez',
      role: 'Front Desk',
      checkInsProcessed: randomInRange(400, 600),
      membershipsSold: randomInRange(15, 30),
      attendanceRate: randomDecimal(94, 99),
      customerFeedback: 'Good',
      performance: 'Meets Expectations',
    },
  ];

  const totalSalesGenerated = employees.reduce((sum, emp) => sum + (emp.salesGenerated || 0), 0);
  const averagePerformanceRating = employees.filter(e => e.studentRating).reduce((sum, e) => sum + parseFloat(e.studentRating), 0) / employees.filter(e => e.studentRating).length;

  return {
    summary: {
      totalEmployees: employees.length,
      totalSalesGenerated,
      averagePerformanceRating: averagePerformanceRating.toFixed(1),
      averageSalesPerEmployee: (totalSalesGenerated / employees.length).toFixed(2),
      topPerformer: employees.reduce((max, emp) => (emp.salesGenerated || 0) > (max.salesGenerated || 0) ? emp : max),
    },
    employees,
    performanceDistribution: {
      outstanding: employees.filter(e => e.performance === 'Outstanding').length,
      exceedsExpectations: employees.filter(e => e.performance === 'Exceeds Expectations').length,
      meetsExpectations: employees.filter(e => e.performance === 'Meets Expectations').length,
      needsImprovement: employees.filter(e => e.performance === 'Needs Improvement').length,
    },
    roleBreakdown: {
      instructors: employees.filter(e => e.role === 'Yoga Instructor'),
      salesTeam: employees.filter(e => e.role === 'Sales Associate'),
      management: employees.filter(e => e.role === 'Store Manager'),
      support: employees.filter(e => e.role === 'Front Desk'),
    },
    metrics: {
      averageAttendanceRate: (employees.reduce((sum, e) => sum + parseFloat(e.attendanceRate), 0) / employees.length).toFixed(2),
      totalClassesCompleted: employees.reduce((sum, e) => sum + (e.classesCompleted || 0), 0),
      totalTransactionsHandled: employees.reduce((sum, e) => sum + (e.transactionsHandled || 0), 0),
    },
  };
};

/**
 * Generate payment method analysis report
 */
export const generatePaymentMethodReport = async (filters = {}) => {
  await delay(650);

  const paymentMethods = [
    {
      method: 'Credit Card',
      transactions: randomInRange(250, 350),
      totalAmount: randomInRange(75000, 105000),
      averageTransaction: 0,
      percentage: 0,
      fees: 0,
      netAmount: 0,
      growthRate: randomDecimal(-5, 20),
    },
    {
      method: 'Debit Card',
      transactions: randomInRange(120, 180),
      totalAmount: randomInRange(35000, 55000),
      averageTransaction: 0,
      percentage: 0,
      fees: 0,
      netAmount: 0,
      growthRate: randomDecimal(-3, 15),
    },
    {
      method: 'Cash',
      transactions: randomInRange(80, 130),
      totalAmount: randomInRange(18000, 32000),
      averageTransaction: 0,
      percentage: 0,
      fees: 0,
      netAmount: 0,
      growthRate: randomDecimal(-15, 5),
    },
    {
      method: 'Mobile Payment (Apple Pay, Google Pay)',
      transactions: randomInRange(40, 80),
      totalAmount: randomInRange(10000, 20000),
      averageTransaction: 0,
      percentage: 0,
      fees: 0,
      netAmount: 0,
      growthRate: randomDecimal(25, 50),
    },
    {
      method: 'Bank Transfer',
      transactions: randomInRange(15, 35),
      totalAmount: randomInRange(8000, 18000),
      averageTransaction: 0,
      percentage: 0,
      fees: 0,
      netAmount: 0,
      growthRate: randomDecimal(5, 18),
    },
  ];

  const totalAmount = paymentMethods.reduce((sum, method) => sum + method.totalAmount, 0);
  const totalTransactions = paymentMethods.reduce((sum, method) => sum + method.transactions, 0);

  // Calculate percentages, fees, and net amounts
  paymentMethods.forEach(method => {
    method.averageTransaction = method.totalAmount / method.transactions;
    method.percentage = ((method.totalAmount / totalAmount) * 100).toFixed(2);

    // Calculate fees (credit card 2.9%, debit 1.5%, mobile 2.5%, bank 0.5%, cash 0%)
    if (method.method === 'Credit Card') method.fees = method.totalAmount * 0.029;
    else if (method.method === 'Debit Card') method.fees = method.totalAmount * 0.015;
    else if (method.method.includes('Mobile')) method.fees = method.totalAmount * 0.025;
    else if (method.method === 'Bank Transfer') method.fees = method.totalAmount * 0.005;
    else method.fees = 0;

    method.netAmount = method.totalAmount - method.fees;
  });

  const totalFees = paymentMethods.reduce((sum, method) => sum + method.fees, 0);
  const totalNet = paymentMethods.reduce((sum, method) => sum + method.netAmount, 0);

  return {
    summary: {
      totalTransactions,
      totalAmount,
      totalFees,
      totalNet,
      averageTransaction: totalAmount / totalTransactions,
      successRate: randomDecimal(96, 99.5),
      failedTransactions: randomInRange(5, 25),
    },
    paymentMethods,
    trends: {
      preferredMethod: paymentMethods.reduce((max, method) => method.totalAmount > max.totalAmount ? method : max),
      fastestGrowing: paymentMethods.reduce((max, method) => parseFloat(method.growthRate) > parseFloat(max.growthRate) ? method : max),
      highestFees: paymentMethods.reduce((max, method) => method.fees > max.fees ? method : max),
    },
    recommendations: {
      considerLowerFees: paymentMethods.filter(m => m.fees > 1000).length,
      encourageCash: totalFees > 5000,
      promoteDigital: paymentMethods.find(m => m.method.includes('Mobile'))?.growthRate > 20,
    },
  };
};

/**
 * Generate customer analytics and trends report
 */
export const generateCustomerAnalyticsReport = async (filters = {}) => {
  await delay(800);

  const totalCustomers = randomInRange(400, 600);
  const newCustomers = randomInRange(45, 85);
  const returningCustomers = randomInRange(280, 420);
  const churnedCustomers = randomInRange(15, 35);

  const customerSegments = [
    {
      segment: 'VIP Members',
      count: randomInRange(45, 75),
      averageSpend: randomInRange(500, 900),
      visitFrequency: randomDecimal(8, 15),
      lifetimeValue: randomInRange(3500, 6500),
      percentage: 0,
    },
    {
      segment: 'Regular Members',
      count: randomInRange(120, 200),
      averageSpend: randomInRange(250, 450),
      visitFrequency: randomDecimal(4, 8),
      lifetimeValue: randomInRange(1500, 3000),
      percentage: 0,
    },
    {
      segment: 'Occasional Visitors',
      count: randomInRange(150, 250),
      averageSpend: randomInRange(80, 180),
      visitFrequency: randomDecimal(1, 3),
      lifetimeValue: randomInRange(300, 800),
      percentage: 0,
    },
    {
      segment: 'New Customers',
      count: newCustomers,
      averageSpend: randomInRange(50, 150),
      visitFrequency: randomDecimal(0.5, 2),
      lifetimeValue: randomInRange(50, 250),
      percentage: 0,
    },
  ];

  customerSegments.forEach(segment => {
    segment.percentage = ((segment.count / totalCustomers) * 100).toFixed(2);
  });

  const ageDistribution = [
    { ageGroup: '18-25', count: randomInRange(60, 100), percentage: 0 },
    { ageGroup: '26-35', count: randomInRange(150, 220), percentage: 0 },
    { ageGroup: '36-45', count: randomInRange(120, 180), percentage: 0 },
    { ageGroup: '46-55', count: randomInRange(50, 90), percentage: 0 },
    { ageGroup: '56+', count: randomInRange(20, 50), percentage: 0 },
  ];

  ageDistribution.forEach(age => {
    age.percentage = ((age.count / totalCustomers) * 100).toFixed(2);
  });

  const topCustomers = [
    { id: 'C001', name: 'Sarah Johnson', visits: randomInRange(45, 75), spent: randomInRange(5000, 8500), lastVisit: '2 days ago' },
    { id: 'C002', name: 'Michael Chen', visits: randomInRange(40, 65), spent: randomInRange(4500, 7500), lastVisit: '1 day ago' },
    { id: 'C003', name: 'Emma Wilson', visits: randomInRange(35, 60), spent: randomInRange(4000, 7000), lastVisit: '3 days ago' },
    { id: 'C004', name: 'David Brown', visits: randomInRange(30, 55), spent: randomInRange(3500, 6500), lastVisit: '1 week ago' },
    { id: 'C005', name: 'Lisa Martinez', visits: randomInRange(28, 50), spent: randomInRange(3200, 6000), lastVisit: '4 days ago' },
  ];

  const churnRate = ((churnedCustomers / totalCustomers) * 100).toFixed(2);
  const retentionRate = (100 - churnRate).toFixed(2);
  const averageLifetimeValue = customerSegments.reduce((sum, seg) => sum + (seg.lifetimeValue * seg.count), 0) / totalCustomers;

  return {
    summary: {
      totalCustomers,
      newCustomers,
      returningCustomers,
      churnedCustomers,
      churnRate: parseFloat(churnRate),
      retentionRate: parseFloat(retentionRate),
      averageLifetimeValue: averageLifetimeValue.toFixed(2),
      growthRate: randomDecimal(5, 25),
    },
    customerSegments,
    ageDistribution,
    topCustomers,
    engagement: {
      highlyEngaged: customerSegments[0].count + customerSegments[1].count,
      atRisk: randomInRange(25, 50),
      inactive: randomInRange(30, 60),
    },
    trends: {
      averageVisitsPerCustomer: (customerSegments.reduce((sum, seg) => sum + (seg.visitFrequency * seg.count), 0) / totalCustomers).toFixed(2),
      averageSpendPerCustomer: (customerSegments.reduce((sum, seg) => sum + (seg.averageSpend * seg.count), 0) / totalCustomers).toFixed(2),
      membershipConversionRate: randomDecimal(15, 35),
    },
  };
};

/**
 * Generate tax report
 */
export const generateTaxReport = async (filters = {}) => {
  await delay(700);

  const { startDate, endDate } = filters;
  const start = startDate ? new Date(startDate) : subMonths(new Date(), 3);
  const end = endDate ? new Date(endDate) : new Date();

  const grossSales = randomInRange(150000, 250000);
  const returns = randomInRange(2000, 5000);
  const discounts = randomInRange(5000, 12000);
  const netSales = grossSales - returns - discounts;

  const taxRates = [
    {
      jurisdiction: 'State Tax',
      rate: 6.5,
      taxableAmount: netSales,
      taxCollected: netSales * 0.065,
      taxRemitted: 0,
      taxOwed: 0,
    },
    {
      jurisdiction: 'County Tax',
      rate: 1.5,
      taxableAmount: netSales,
      taxCollected: netSales * 0.015,
      taxRemitted: 0,
      taxOwed: 0,
    },
    {
      jurisdiction: 'City Tax',
      rate: 1.0,
      taxableAmount: netSales,
      taxCollected: netSales * 0.01,
      taxRemitted: 0,
      taxOwed: 0,
    },
  ];

  // Simulate some remitted taxes
  taxRates.forEach(tax => {
    tax.taxRemitted = tax.taxCollected * 0.75; // 75% already remitted
    tax.taxOwed = tax.taxCollected - tax.taxRemitted;
  });

  const totalTaxCollected = taxRates.reduce((sum, tax) => sum + tax.taxCollected, 0);
  const totalTaxRemitted = taxRates.reduce((sum, tax) => sum + tax.taxRemitted, 0);
  const totalTaxOwed = taxRates.reduce((sum, tax) => sum + tax.taxOwed, 0);

  // Tax by category
  const taxByCategory = [
    { category: 'Taxable Products', sales: randomInRange(80000, 120000), taxRate: 9.0, taxAmount: 0 },
    { category: 'Reduced Rate Items', sales: randomInRange(20000, 40000), taxRate: 4.5, taxAmount: 0 },
    { category: 'Tax Exempt (Classes)', sales: randomInRange(40000, 70000), taxRate: 0, taxAmount: 0 },
  ];

  taxByCategory.forEach(cat => {
    cat.taxAmount = cat.sales * (cat.taxRate / 100);
  });

  // Monthly breakdown
  const monthlyTaxData = eachMonthOfInterval({ start, end }).map(date => ({
    month: format(date, 'MMM yyyy'),
    grossSales: randomInRange(45000, 85000),
    netSales: 0,
    taxCollected: 0,
    taxRemitted: 0,
  })).map(item => ({
    ...item,
    netSales: item.grossSales * 0.95,
    taxCollected: item.grossSales * 0.95 * 0.09,
    taxRemitted: item.grossSales * 0.95 * 0.09 * 0.9, // 90% remitted
  }));

  return {
    period: {
      startDate: format(start, 'MMM dd, yyyy'),
      endDate: format(end, 'MMM dd, yyyy'),
    },
    salesSummary: {
      grossSales,
      returns,
      discounts,
      netSales,
      taxableAmount: netSales,
    },
    taxSummary: {
      totalTaxCollected,
      totalTaxRemitted,
      totalTaxOwed,
      effectiveTaxRate: ((totalTaxCollected / netSales) * 100).toFixed(2),
    },
    taxRates,
    taxByCategory,
    monthlyTaxData,
    compliance: {
      filingStatus: 'Current',
      nextFilingDate: format(new Date(end.getTime() + 30 * 24 * 60 * 60 * 1000), 'MMM dd, yyyy'),
      outstandingReturns: 0,
      penaltiesOrInterest: 0,
    },
  };
};

export default {
  generateSalesReport,
  generateInventoryValuationReport,
  generateProfitLossReport,
  generateSlowMovingStockReport,
  generateEmployeePerformanceReport,
  generatePaymentMethodReport,
  generateCustomerAnalyticsReport,
  generateTaxReport,
};
