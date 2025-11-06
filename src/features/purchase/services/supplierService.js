/**
 * Supplier Service
 * Mock API service for supplier management
 */

import { SUPPLIER_STATUS } from '../types/supplier.types.js';

// Simulated delay to mimic API latency
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate unique ID
let idCounter = 100;
const generateId = () => `SUP-${String(idCounter++).padStart(6, '0')}`;

// Mock data storage
let MOCK_SUPPLIERS = [
  {
    id: 'SUP-000001',
    code: 'SUP001',
    name: 'Yoga Essentials International',
    taxId: 'TAX123456',
    registrationNumber: 'REG789012',
    contact: {
      name: 'Rajesh Kumar',
      phone: '+94 11 234 5678',
      email: 'rajesh@yogaessentials.com',
      position: 'Sales Manager'
    },
    additionalContacts: [
      {
        name: 'Priya Singh',
        phone: '+94 11 234 5679',
        email: 'priya@yogaessentials.com',
        position: 'Account Manager'
      }
    ],
    address: {
      street: '45 Galle Road',
      line2: 'Colombo 03',
      city: 'Colombo',
      state: 'Western Province',
      postalCode: '00300',
      country: 'Sri Lanka'
    },
    phone: '+94 11 234 5678',
    email: 'info@yogaessentials.com',
    website: 'www.yogaessentials.com',
    paymentTerms: {
      creditDays: 30,
      method: 'bank_transfer',
      creditLimit: 500000,
      discount: 2
    },
    productCategories: ['Yoga Mats', 'Yoga Blocks', 'Yoga Straps'],
    currency: 'LKR',
    bankName: 'Commercial Bank of Ceylon',
    bankAccount: '1234567890',
    notes: 'Primary supplier for yoga props',
    status: 'active',
    performance: {
      totalOrders: 45,
      onTimeDeliveries: 42,
      qualityScore: 95,
      responseTime: 4,
      lastOrderDate: '2024-11-01T10:00:00.000Z',
      totalPurchaseValue: 2500000,
      returnRate: 2
    },
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-11-01T10:00:00.000Z',
    createdBy: 'admin'
  },
  {
    id: 'SUP-000002',
    code: 'SUP002',
    name: 'Active Wear Solutions',
    taxId: 'TAX234567',
    registrationNumber: 'REG890123',
    contact: {
      name: 'Nimal Fernando',
      phone: '+94 11 345 6789',
      email: 'nimal@activewear.lk',
      position: 'Business Development Manager'
    },
    additionalContacts: [],
    address: {
      street: '123 Dutugemunu Street',
      line2: 'Dehiwala',
      city: 'Colombo',
      state: 'Western Province',
      postalCode: '10350',
      country: 'Sri Lanka'
    },
    phone: '+94 11 345 6789',
    email: 'sales@activewear.lk',
    website: 'www.activewear.lk',
    paymentTerms: {
      creditDays: 45,
      method: 'bank_transfer',
      creditLimit: 750000,
      discount: 3
    },
    productCategories: ['Clothing', 'Accessories'],
    currency: 'LKR',
    bankName: 'Bank of Ceylon',
    bankAccount: '0987654321',
    notes: 'Reliable for athletic apparel',
    status: 'active',
    performance: {
      totalOrders: 32,
      onTimeDeliveries: 30,
      qualityScore: 92,
      responseTime: 6,
      lastOrderDate: '2024-10-28T14:30:00.000Z',
      totalPurchaseValue: 1800000,
      returnRate: 3
    },
    createdAt: '2024-02-01T09:00:00.000Z',
    updatedAt: '2024-10-28T14:30:00.000Z',
    createdBy: 'admin'
  },
  {
    id: 'SUP-000003',
    code: 'SUP003',
    name: 'Wellness Products Ltd',
    taxId: 'TAX345678',
    registrationNumber: 'REG901234',
    contact: {
      name: 'Ayesha Jayawardena',
      phone: '+94 11 456 7890',
      email: 'ayesha@wellnesspro.lk',
      position: 'Regional Manager'
    },
    additionalContacts: [],
    address: {
      street: '78 Havelock Road',
      line2: '',
      city: 'Colombo',
      state: 'Western Province',
      postalCode: '00500',
      country: 'Sri Lanka'
    },
    phone: '+94 11 456 7890',
    email: 'orders@wellnesspro.lk',
    website: 'www.wellnesspro.lk',
    paymentTerms: {
      creditDays: 30,
      method: 'cash',
      creditLimit: 300000,
      discount: 0
    },
    productCategories: ['Accessories', 'Retail Products'],
    currency: 'LKR',
    bankName: 'Hatton National Bank',
    bankAccount: '5678901234',
    notes: 'Good for small accessories',
    status: 'active',
    performance: {
      totalOrders: 18,
      onTimeDeliveries: 16,
      qualityScore: 88,
      responseTime: 8,
      lastOrderDate: '2024-10-20T11:15:00.000Z',
      totalPurchaseValue: 650000,
      returnRate: 5
    },
    createdAt: '2024-03-10T11:00:00.000Z',
    updatedAt: '2024-10-20T11:15:00.000Z',
    createdBy: 'admin'
  },
  {
    id: 'SUP-000004',
    code: 'SUP004',
    name: 'Premium Yoga Imports',
    taxId: 'TAX456789',
    registrationNumber: 'REG012345',
    contact: {
      name: 'David Silva',
      phone: '+94 11 567 8901',
      email: 'david@premiumyoga.com',
      position: 'Import Manager'
    },
    additionalContacts: [],
    address: {
      street: '234 Baseline Road',
      line2: 'Colombo 09',
      city: 'Colombo',
      state: 'Western Province',
      postalCode: '00900',
      country: 'Sri Lanka'
    },
    phone: '+94 11 567 8901',
    email: 'imports@premiumyoga.com',
    website: 'www.premiumyoga.com',
    paymentTerms: {
      creditDays: 60,
      method: 'bank_transfer',
      creditLimit: 1000000,
      discount: 5
    },
    productCategories: ['Yoga Mats', 'Props', 'Equipment'],
    currency: 'LKR',
    bankName: 'Sampath Bank',
    bankAccount: '3456789012',
    notes: 'High-end international brands',
    status: 'inactive',
    performance: {
      totalOrders: 12,
      onTimeDeliveries: 10,
      qualityScore: 96,
      responseTime: 12,
      lastOrderDate: '2024-08-15T09:00:00.000Z',
      totalPurchaseValue: 1200000,
      returnRate: 1
    },
    createdAt: '2024-01-20T08:00:00.000Z',
    updatedAt: '2024-08-15T09:00:00.000Z',
    createdBy: 'admin'
  }
];

/**
 * Supplier Service API
 */
export const supplierService = {
  /**
   * Get all suppliers with optional filters
   */
  async getList(filters = {}) {
    await delay(400);

    let result = [...MOCK_SUPPLIERS];

    // Apply status filter
    if (filters.status) {
      result = result.filter((s) => s.status === filters.status);
    }

    // Apply category filter
    if (filters.category) {
      result = result.filter((s) =>
        s.productCategories.includes(filters.category)
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm) ||
          s.code.toLowerCase().includes(searchTerm) ||
          s.email?.toLowerCase().includes(searchTerm) ||
          s.phone.includes(searchTerm)
      );
    }

    // Sort
    if (filters.sortBy) {
      result.sort((a, b) => {
        const aVal = a[filters.sortBy];
        const bVal = b[filters.sortBy];
        if (filters.sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    return result;
  },

  /**
   * Get supplier by ID
   */
  async getById(id) {
    await delay(300);
    const supplier = MOCK_SUPPLIERS.find((s) => s.id === id);
    if (!supplier) {
      throw new Error(`Supplier with ID ${id} not found`);
    }
    return { ...supplier };
  },

  /**
   * Get supplier by code
   */
  async getByCode(code) {
    await delay(300);
    const supplier = MOCK_SUPPLIERS.find((s) => s.code === code);
    if (!supplier) {
      throw new Error(`Supplier with code ${code} not found`);
    }
    return { ...supplier };
  },

  /**
   * Create a new supplier
   */
  async create(data) {
    await delay(500);

    // Validation
    if (!data.code?.trim()) {
      throw new Error('Supplier code is required');
    }
    if (!data.name?.trim()) {
      throw new Error('Supplier name is required');
    }
    if (!data.phone?.trim()) {
      throw new Error('Phone number is required');
    }

    // Check for duplicate code
    const existingCode = MOCK_SUPPLIERS.find((s) => s.code === data.code);
    if (existingCode) {
      throw new Error(`Supplier code ${data.code} already exists`);
    }

    // Create new supplier
    const newSupplier = {
      id: generateId(),
      ...data,
      performance: {
        totalOrders: 0,
        onTimeDeliveries: 0,
        qualityScore: 100,
        responseTime: 0,
        lastOrderDate: null,
        totalPurchaseValue: 0,
        returnRate: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    MOCK_SUPPLIERS.push(newSupplier);
    return { ...newSupplier };
  },

  /**
   * Update an existing supplier
   */
  async update(id, data) {
    await delay(500);

    const index = MOCK_SUPPLIERS.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Supplier with ID ${id} not found`);
    }

    // Validation
    if (data.code && data.code !== MOCK_SUPPLIERS[index].code) {
      const existingCode = MOCK_SUPPLIERS.find((s) => s.code === data.code);
      if (existingCode) {
        throw new Error(`Supplier code ${data.code} already exists`);
      }
    }

    // Update supplier
    MOCK_SUPPLIERS[index] = {
      ...MOCK_SUPPLIERS[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    return { ...MOCK_SUPPLIERS[index] };
  },

  /**
   * Delete a supplier
   */
  async remove(id) {
    await delay(400);

    const index = MOCK_SUPPLIERS.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Supplier with ID ${id} not found`);
    }

    MOCK_SUPPLIERS.splice(index, 1);
    return true;
  },

  /**
   * Bulk update supplier status
   */
  async bulkUpdateStatus(ids, status) {
    await delay(500);

    if (!Object.values(SUPPLIER_STATUS).includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    let count = 0;
    ids.forEach((id) => {
      const supplier = MOCK_SUPPLIERS.find((s) => s.id === id);
      if (supplier) {
        supplier.status = status;
        supplier.updatedAt = new Date().toISOString();
        count++;
      }
    });

    return count;
  },

  /**
   * Update supplier performance metrics
   */
  async updatePerformance(id, performanceData) {
    await delay(300);

    const supplier = MOCK_SUPPLIERS.find((s) => s.id === id);
    if (!supplier) {
      throw new Error(`Supplier with ID ${id} not found`);
    }

    supplier.performance = {
      ...supplier.performance,
      ...performanceData
    };
    supplier.updatedAt = new Date().toISOString();

    return { ...supplier };
  },

  /**
   * Get supplier statistics
   */
  async getStatistics() {
    await delay(200);

    const stats = {
      total: MOCK_SUPPLIERS.length,
      active: MOCK_SUPPLIERS.filter((s) => s.status === 'active').length,
      inactive: MOCK_SUPPLIERS.filter((s) => s.status === 'inactive').length,
      blocked: MOCK_SUPPLIERS.filter((s) => s.status === 'blocked').length,
      totalPurchaseValue: MOCK_SUPPLIERS.reduce(
        (sum, s) => sum + (s.performance?.totalPurchaseValue || 0),
        0
      ),
      averageQualityScore:
        MOCK_SUPPLIERS.reduce(
          (sum, s) => sum + (s.performance?.qualityScore || 0),
          0
        ) / MOCK_SUPPLIERS.length,
      topPerformers: [...MOCK_SUPPLIERS]
        .sort((a, b) => b.performance.qualityScore - a.performance.qualityScore)
        .slice(0, 5)
        .map((s) => ({
          id: s.id,
          name: s.name,
          qualityScore: s.performance.qualityScore,
          totalOrders: s.performance.totalOrders
        }))
    };

    return stats;
  },

  /**
   * Get active suppliers for dropdown
   */
  async getActiveList() {
    await delay(200);
    return MOCK_SUPPLIERS.filter((s) => s.status === 'active').map((s) => ({
      id: s.id,
      code: s.code,
      name: s.name,
      paymentTerms: s.paymentTerms
    }));
  }
};
