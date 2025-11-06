import { delay } from '@/utils/delay.js';

/**
 * Mock expense categories
 * @type {import('../types/expense.types.js').ExpenseCategory[]}
 */
export const EXPENSE_CATEGORIES = [
  { id: 'cat1', name: 'Rent & Utilities', description: 'Rent, electricity, water, internet', icon: 'Building', color: '#3B82F6', isActive: true },
  { id: 'cat2', name: 'Salaries & Wages', description: 'Employee salaries and wages', icon: 'Users', color: '#10B981', isActive: true },
  { id: 'cat3', name: 'Marketing & Advertising', description: 'Marketing campaigns, ads, promotions', icon: 'Megaphone', color: '#8B5CF6', isActive: true },
  { id: 'cat4', name: 'Equipment & Supplies', description: 'Yoga mats, props, maintenance', icon: 'Package', color: '#F59E0B', isActive: true },
  { id: 'cat5', name: 'Insurance', description: 'Business insurance, liability', icon: 'Shield', color: '#EF4444', isActive: true },
  { id: 'cat6', name: 'Professional Services', description: 'Legal, accounting, consulting', icon: 'Briefcase', color: '#6366F1', isActive: true },
  { id: 'cat7', name: 'Inventory Purchases', description: 'Product inventory, retail items', icon: 'ShoppingCart', color: '#EC4899', isActive: true },
  { id: 'cat8', name: 'Maintenance & Repairs', description: 'Facility maintenance, repairs', icon: 'Wrench', color: '#14B8A6', isActive: true },
  { id: 'cat9', name: 'Training & Development', description: 'Staff training, certifications', icon: 'GraduationCap', color: '#F97316', isActive: true },
  { id: 'cat10', name: 'Other', description: 'Miscellaneous expenses', icon: 'MoreHorizontal', color: '#6B7280', isActive: true }
];

/**
 * Mock expense data
 * @type {import('../types/expense.types.js').Expense[]}
 */
const MOCK_EXPENSES = [
  {
    id: 'EXP001',
    expenseNumber: 'EXP-2024-001',
    category: 'Rent & Utilities',
    subcategory: 'Rent',
    description: 'Monthly studio rent - October 2024',
    amount: 2500.00,
    expenseDate: new Date('2024-10-01'),
    paymentMethod: 'bank_transfer',
    status: 'paid',
    vendorId: 'V001',
    vendorName: 'Downtown Properties LLC',
    invoiceNumber: 'PROP-10-2024',
    isRecurring: true,
    recurringFrequency: 'monthly',
    notes: 'Regular monthly rent payment',
    submittedBy: 'admin',
    approvedBy: 'manager',
    approvedAt: new Date('2024-10-01'),
    currency: 'USD',
    isTaxDeductible: true,
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-01')
  },
  {
    id: 'EXP002',
    expenseNumber: 'EXP-2024-002',
    category: 'Equipment & Supplies',
    subcategory: 'Yoga Mats',
    description: 'Purchase of 20 premium yoga mats',
    amount: 800.00,
    expenseDate: new Date('2024-10-05'),
    paymentMethod: 'card',
    status: 'paid',
    vendorId: 'V002',
    vendorName: 'Yoga Supply Co',
    invoiceNumber: 'YSC-5421',
    isRecurring: false,
    notes: 'Restocking studio equipment',
    submittedBy: 'admin',
    approvedBy: 'manager',
    approvedAt: new Date('2024-10-04'),
    currency: 'USD',
    isTaxDeductible: true,
    createdAt: new Date('2024-10-04'),
    updatedAt: new Date('2024-10-05')
  },
  {
    id: 'EXP003',
    expenseNumber: 'EXP-2024-003',
    category: 'Salaries & Wages',
    subcategory: 'Instructor Fees',
    description: 'Instructor payments for September',
    amount: 3200.00,
    expenseDate: new Date('2024-10-10'),
    paymentMethod: 'bank_transfer',
    status: 'paid',
    isRecurring: true,
    recurringFrequency: 'monthly',
    notes: 'Monthly instructor compensation',
    submittedBy: 'admin',
    approvedBy: 'manager',
    approvedAt: new Date('2024-10-09'),
    currency: 'USD',
    isTaxDeductible: true,
    createdAt: new Date('2024-10-09'),
    updatedAt: new Date('2024-10-10')
  },
  {
    id: 'EXP004',
    expenseNumber: 'EXP-2024-004',
    category: 'Marketing & Advertising',
    subcategory: 'Social Media Ads',
    description: 'Facebook & Instagram ad campaign',
    amount: 450.00,
    expenseDate: new Date('2024-10-15'),
    paymentMethod: 'card',
    status: 'approved',
    notes: 'Q4 marketing campaign',
    submittedBy: 'marketing',
    approvedBy: 'manager',
    approvedAt: new Date('2024-10-14'),
    currency: 'USD',
    isTaxDeductible: true,
    createdAt: new Date('2024-10-13'),
    updatedAt: new Date('2024-10-14')
  },
  {
    id: 'EXP005',
    expenseNumber: 'EXP-2024-005',
    category: 'Rent & Utilities',
    subcategory: 'Electricity',
    description: 'Electricity bill - September 2024',
    amount: 320.00,
    expenseDate: new Date('2024-10-20'),
    paymentMethod: 'bank_transfer',
    status: 'pending',
    vendorId: 'V003',
    vendorName: 'City Electric Company',
    invoiceNumber: 'ELEC-09-2024',
    isRecurring: true,
    recurringFrequency: 'monthly',
    notes: 'Monthly electricity bill',
    submittedBy: 'admin',
    currency: 'USD',
    isTaxDeductible: true,
    createdAt: new Date('2024-10-18'),
    updatedAt: new Date('2024-10-18')
  },
  {
    id: 'EXP006',
    expenseNumber: 'EXP-2024-006',
    category: 'Maintenance & Repairs',
    subcategory: 'HVAC',
    description: 'Air conditioning system repair',
    amount: 650.00,
    expenseDate: new Date('2024-10-22'),
    paymentMethod: 'check',
    status: 'approved',
    vendorId: 'V004',
    vendorName: 'Cool Air HVAC Services',
    invoiceNumber: 'HVAC-1024',
    isRecurring: false,
    notes: 'Emergency repair for studio AC',
    submittedBy: 'admin',
    approvedBy: 'manager',
    approvedAt: new Date('2024-10-22'),
    currency: 'USD',
    isTaxDeductible: true,
    createdAt: new Date('2024-10-21'),
    updatedAt: new Date('2024-10-22')
  },
  {
    id: 'EXP007',
    expenseNumber: 'EXP-2024-007',
    category: 'Insurance',
    subcategory: 'Liability Insurance',
    description: 'Quarterly liability insurance premium',
    amount: 1200.00,
    expenseDate: new Date('2024-10-25'),
    paymentMethod: 'bank_transfer',
    status: 'paid',
    vendorId: 'V005',
    vendorName: 'SafeGuard Insurance',
    invoiceNumber: 'SG-Q4-2024',
    isRecurring: true,
    recurringFrequency: 'quarterly',
    notes: 'Q4 2024 insurance premium',
    submittedBy: 'admin',
    approvedBy: 'manager',
    approvedAt: new Date('2024-10-24'),
    currency: 'USD',
    isTaxDeductible: true,
    createdAt: new Date('2024-10-24'),
    updatedAt: new Date('2024-10-25')
  }
];

let expenses = [...MOCK_EXPENSES];
let expenseCounter = 8;

/**
 * Expense Service
 * Provides operations for managing expenses
 */
export const expenseService = {
  /**
   * Get list of expenses with optional filters
   * @param {import('../types/expense.types.js').ExpenseFilters} filters - Filter criteria
   * @returns {Promise<import('../types/expense.types.js').Expense[]>}
   */
  async getList(filters = {}) {
    await delay(500);

    let filtered = [...expenses];

    // Apply filters
    if (filters.status) {
      filtered = filtered.filter(exp => exp.status === filters.status);
    }

    if (filters.category) {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }

    if (filters.paymentMethod) {
      filtered = filtered.filter(exp => exp.paymentMethod === filters.paymentMethod);
    }

    if (filters.vendorId) {
      filtered = filtered.filter(exp => exp.vendorId === filters.vendorId);
    }

    if (filters.startDate) {
      filtered = filtered.filter(exp => exp.expenseDate >= new Date(filters.startDate));
    }

    if (filters.endDate) {
      filtered = filtered.filter(exp => exp.expenseDate <= new Date(filters.endDate));
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(exp =>
        exp.expenseNumber.toLowerCase().includes(searchLower) ||
        exp.description.toLowerCase().includes(searchLower) ||
        (exp.vendorName && exp.vendorName.toLowerCase().includes(searchLower)) ||
        exp.category.toLowerCase().includes(searchLower)
      );
    }

    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(exp => exp.amount >= filters.minAmount);
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(exp => exp.amount <= filters.maxAmount);
    }

    if (filters.isRecurring !== undefined) {
      filtered = filtered.filter(exp => exp.isRecurring === filters.isRecurring);
    }

    // Sort by expense date descending
    filtered.sort((a, b) => b.expenseDate - a.expenseDate);

    return filtered;
  },

  /**
   * Get expense by ID
   * @param {string} id - Expense ID
   * @returns {Promise<import('../types/expense.types.js').Expense>}
   */
  async getById(id) {
    await delay(300);

    const expense = expenses.find(exp => exp.id === id);
    if (!expense) {
      throw new Error('Expense not found');
    }

    return { ...expense };
  },

  /**
   * Create new expense
   * @param {Partial<import('../types/expense.types.js').Expense>} data - Expense data
   * @returns {Promise<import('../types/expense.types.js').Expense>}
   */
  async create(data) {
    await delay(500);

    const newExpense = {
      id: `EXP${String(expenseCounter).padStart(3, '0')}`,
      expenseNumber: `EXP-2024-${String(expenseCounter).padStart(3, '0')}`,
      category: data.category || 'Other',
      subcategory: data.subcategory || '',
      description: data.description || '',
      amount: data.amount || 0,
      expenseDate: data.expenseDate || new Date(),
      paymentMethod: data.paymentMethod || 'cash',
      status: data.status || 'pending',
      vendorId: data.vendorId,
      vendorName: data.vendorName,
      invoiceNumber: data.invoiceNumber,
      receiptUrl: data.receiptUrl,
      isRecurring: data.isRecurring || false,
      recurringFrequency: data.recurringFrequency,
      notes: data.notes || '',
      submittedBy: data.submittedBy || 'admin',
      approvedBy: data.approvedBy,
      approvedAt: data.approvedAt,
      currency: data.currency || 'USD',
      isTaxDeductible: data.isTaxDeductible || false,
      projectId: data.projectId,
      departmentId: data.departmentId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    expenseCounter++;
    expenses.push(newExpense);

    return newExpense;
  },

  /**
   * Update expense
   * @param {string} id - Expense ID
   * @param {Partial<import('../types/expense.types.js').Expense>} data - Updated data
   * @returns {Promise<import('../types/expense.types.js').Expense>}
   */
  async update(id, data) {
    await delay(500);

    const index = expenses.findIndex(exp => exp.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }

    expenses[index] = {
      ...expenses[index],
      ...data,
      updatedAt: new Date()
    };

    return { ...expenses[index] };
  },

  /**
   * Delete expense
   * @param {string} id - Expense ID
   * @returns {Promise<boolean>}
   */
  async remove(id) {
    await delay(300);

    const index = expenses.findIndex(exp => exp.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }

    expenses.splice(index, 1);
    return true;
  },

  /**
   * Approve expense
   * @param {string} id - Expense ID
   * @param {string} approvedBy - User who approved
   * @returns {Promise<import('../types/expense.types.js').Expense>}
   */
  async approve(id, approvedBy) {
    await delay(500);

    const index = expenses.findIndex(exp => exp.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }

    expenses[index] = {
      ...expenses[index],
      status: 'approved',
      approvedBy,
      approvedAt: new Date(),
      updatedAt: new Date()
    };

    return { ...expenses[index] };
  },

  /**
   * Reject expense
   * @param {string} id - Expense ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<import('../types/expense.types.js').Expense>}
   */
  async reject(id, reason) {
    await delay(500);

    const index = expenses.findIndex(exp => exp.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }

    expenses[index] = {
      ...expenses[index],
      status: 'rejected',
      notes: `${expenses[index].notes}\nRejected: ${reason}`,
      updatedAt: new Date()
    };

    return { ...expenses[index] };
  },

  /**
   * Mark expense as paid
   * @param {string} id - Expense ID
   * @returns {Promise<import('../types/expense.types.js').Expense>}
   */
  async markAsPaid(id) {
    await delay(500);

    const index = expenses.findIndex(exp => exp.id === id);
    if (index === -1) {
      throw new Error('Expense not found');
    }

    expenses[index] = {
      ...expenses[index],
      status: 'paid',
      updatedAt: new Date()
    };

    return { ...expenses[index] };
  },

  /**
   * Get expense statistics
   * @param {Object} filters - Optional filters
   * @returns {Promise<import('../types/expense.types.js').ExpenseStats>}
   */
  async getStats(filters = {}) {
    await delay(300);

    const filtered = await this.getList(filters);

    const byCategory = filtered.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {});

    const byPaymentMethod = filtered.reduce((acc, exp) => {
      acc[exp.paymentMethod] = (acc[exp.paymentMethod] || 0) + exp.amount;
      return acc;
    }, {});

    const stats = {
      totalExpenses: filtered.length,
      totalAmount: filtered.reduce((sum, exp) => sum + exp.amount, 0),
      pendingAmount: filtered
        .filter(exp => exp.status === 'pending')
        .reduce((sum, exp) => sum + exp.amount, 0),
      approvedAmount: filtered
        .filter(exp => exp.status === 'approved')
        .reduce((sum, exp) => sum + exp.amount, 0),
      paidAmount: filtered
        .filter(exp => exp.status === 'paid')
        .reduce((sum, exp) => sum + exp.amount, 0),
      pendingCount: filtered.filter(exp => exp.status === 'pending').length,
      approvedCount: filtered.filter(exp => exp.status === 'approved').length,
      paidCount: filtered.filter(exp => exp.status === 'paid').length,
      byCategory,
      byPaymentMethod,
      averageExpenseValue: filtered.length > 0
        ? filtered.reduce((sum, exp) => sum + exp.amount, 0) / filtered.length
        : 0,
      recurringExpensesTotal: filtered
        .filter(exp => exp.isRecurring)
        .reduce((sum, exp) => sum + exp.amount, 0)
    };

    return stats;
  },

  /**
   * Get expense categories
   * @returns {Promise<import('../types/expense.types.js').ExpenseCategory[]>}
   */
  async getCategories() {
    await delay(200);
    return EXPENSE_CATEGORIES.filter(cat => cat.isActive);
  },

  /**
   * Get recurring expenses
   * @returns {Promise<import('../types/expense.types.js').Expense[]>}
   */
  async getRecurringExpenses() {
    await delay(300);
    return expenses.filter(exp => exp.isRecurring);
  }
};
