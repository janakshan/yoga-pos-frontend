import { MOCK_SUPPLIERS, generateSupplierId } from '../data/mockSuppliers.js';
import { SUPPLIER_STATUS } from '../types/supplier.types.js';

/**
 * Simulate network delay
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Supplier Service
 * Handles all supplier-related API operations
 */
export const supplierService = {
  /**
   * Get list of suppliers with optional filters
   * @param {Object} filters - Filter criteria
   * @param {string} [filters.search] - Search term
   * @param {string} [filters.status] - Filter by status
   * @param {string} [filters.type] - Filter by type
   * @param {string} [filters.sortBy] - Sort field
   * @param {string} [filters.sortOrder] - Sort order ('asc' | 'desc')
   * @returns {Promise<Supplier[]>}
   */
  async getList(filters = {}) {
    await delay(400);

    let result = [...MOCK_SUPPLIERS];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchLower) ||
          supplier.code.toLowerCase().includes(searchLower) ||
          supplier.email.toLowerCase().includes(searchLower) ||
          supplier.phone.includes(filters.search)
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((supplier) => supplier.status === filters.status);
    }

    // Apply type filter
    if (filters.type) {
      result = result.filter((supplier) => supplier.type === filters.type);
    }

    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        let aVal = a[filters.sortBy];
        let bVal = b[filters.sortBy];

        // Handle nested properties (e.g., 'stats.totalOrders')
        if (filters.sortBy.includes('.')) {
          const keys = filters.sortBy.split('.');
          aVal = keys.reduce((obj, key) => obj?.[key], a);
          bVal = keys.reduce((obj, key) => obj?.[key], b);
        }

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (filters.sortOrder === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
    }

    return result;
  },

  /**
   * Get supplier by ID
   * @param {string} id - Supplier ID
   * @returns {Promise<Supplier>}
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
   * Create a new supplier
   * @param {Object} data - Supplier data
   * @returns {Promise<Supplier>}
   */
  async create(data) {
    await delay(500);

    // Validation
    if (!data.name?.trim()) {
      throw new Error('Supplier name is required');
    }
    if (!data.email?.trim()) {
      throw new Error('Email is required');
    }
    if (!data.phone?.trim()) {
      throw new Error('Phone number is required');
    }

    // Check for duplicate code
    if (data.code && MOCK_SUPPLIERS.some((s) => s.code === data.code)) {
      throw new Error('Supplier code already exists');
    }

    const newSupplier = {
      id: generateSupplierId(),
      code: data.code || generateSupplierId(),
      name: data.name,
      displayName: data.displayName || data.name,
      email: data.email,
      phone: data.phone,
      alternatePhone: data.alternatePhone || '',
      website: data.website || '',
      taxNumber: data.taxNumber || '',
      status: data.status || SUPPLIER_STATUS.ACTIVE,
      type: data.type,
      address: data.address || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      contacts: data.contacts || [],
      bankDetails: data.bankDetails || {
        bankName: '',
        accountNumber: '',
        accountName: '',
        ifscCode: '',
        branch: '',
      },
      paymentTerms: data.paymentTerms || {
        terms: 'net30',
        creditLimit: 0,
        creditDays: 30,
        preferredPaymentMethod: 'Bank Transfer',
      },
      categories: data.categories || [],
      notes: data.notes || '',
      stats: {
        totalOrders: 0,
        totalAmount: 0,
        pendingOrders: 0,
        completedOrders: 0,
        returnedOrders: 0,
        averageDeliveryTime: 0,
        onTimeDeliveryRate: 0,
        qualityRating: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current-user',
    };

    MOCK_SUPPLIERS.push(newSupplier);
    return { ...newSupplier };
  },

  /**
   * Update supplier
   * @param {string} id - Supplier ID
   * @param {Object} data - Updated supplier data
   * @returns {Promise<Supplier>}
   */
  async update(id, data) {
    await delay(500);

    const index = MOCK_SUPPLIERS.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Supplier with ID ${id} not found`);
    }

    // Validation
    if (data.name !== undefined && !data.name?.trim()) {
      throw new Error('Supplier name is required');
    }
    if (data.email !== undefined && !data.email?.trim()) {
      throw new Error('Email is required');
    }

    // Check for duplicate code (excluding current supplier)
    if (
      data.code &&
      MOCK_SUPPLIERS.some((s) => s.id !== id && s.code === data.code)
    ) {
      throw new Error('Supplier code already exists');
    }

    const updatedSupplier = {
      ...MOCK_SUPPLIERS[index],
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    MOCK_SUPPLIERS[index] = updatedSupplier;
    return { ...updatedSupplier };
  },

  /**
   * Delete supplier
   * @param {string} id - Supplier ID
   * @returns {Promise<void>}
   */
  async remove(id) {
    await delay(400);

    const index = MOCK_SUPPLIERS.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Supplier with ID ${id} not found`);
    }

    // Check if supplier has active purchase orders
    const supplier = MOCK_SUPPLIERS[index];
    if (supplier.stats.pendingOrders > 0) {
      throw new Error(
        'Cannot delete supplier with pending purchase orders. Please complete or cancel all orders first.'
      );
    }

    MOCK_SUPPLIERS.splice(index, 1);
  },

  /**
   * Update supplier status
   * @param {string} id - Supplier ID
   * @param {string} status - New status
   * @returns {Promise<Supplier>}
   */
  async updateStatus(id, status) {
    await delay(300);

    const index = MOCK_SUPPLIERS.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Supplier with ID ${id} not found`);
    }

    MOCK_SUPPLIERS[index] = {
      ...MOCK_SUPPLIERS[index],
      status,
      updatedAt: new Date(),
    };

    return { ...MOCK_SUPPLIERS[index] };
  },

  /**
   * Get supplier statistics
   * @returns {Promise<Object>}
   */
  async getStats() {
    await delay(300);

    const activeSuppliers = MOCK_SUPPLIERS.filter(
      (s) => s.status === SUPPLIER_STATUS.ACTIVE
    ).length;

    const totalSuppliers = MOCK_SUPPLIERS.length;

    const totalOrders = MOCK_SUPPLIERS.reduce(
      (sum, s) => sum + s.stats.totalOrders,
      0
    );

    const totalAmount = MOCK_SUPPLIERS.reduce(
      (sum, s) => sum + s.stats.totalAmount,
      0
    );

    const avgOnTimeDelivery =
      MOCK_SUPPLIERS.reduce((sum, s) => sum + s.stats.onTimeDeliveryRate, 0) /
      (MOCK_SUPPLIERS.length || 1);

    const avgQualityRating =
      MOCK_SUPPLIERS.reduce((sum, s) => sum + s.stats.qualityRating, 0) /
      (MOCK_SUPPLIERS.length || 1);

    return {
      activeSuppliers,
      totalSuppliers,
      totalOrders,
      totalAmount,
      avgOnTimeDelivery,
      avgQualityRating,
    };
  },

  /**
   * Get top suppliers by various metrics
   * @param {string} metric - Metric to sort by ('totalOrders' | 'totalAmount' | 'onTimeDeliveryRate' | 'qualityRating')
   * @param {number} limit - Number of suppliers to return
   * @returns {Promise<Supplier[]>}
   */
  async getTopSuppliers(metric = 'totalAmount', limit = 5) {
    await delay(300);

    const suppliers = [...MOCK_SUPPLIERS].filter(
      (s) => s.status === SUPPLIER_STATUS.ACTIVE
    );

    suppliers.sort((a, b) => {
      const aVal = a.stats[metric] || 0;
      const bVal = b.stats[metric] || 0;
      return bVal - aVal;
    });

    return suppliers.slice(0, limit);
  },

  /**
   * Update supplier performance stats
   * @param {string} id - Supplier ID
   * @param {Object} stats - Updated stats
   * @returns {Promise<Supplier>}
   */
  async updateStats(id, stats) {
    await delay(300);

    const index = MOCK_SUPPLIERS.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Supplier with ID ${id} not found`);
    }

    MOCK_SUPPLIERS[index] = {
      ...MOCK_SUPPLIERS[index],
      stats: {
        ...MOCK_SUPPLIERS[index].stats,
        ...stats,
      },
      updatedAt: new Date(),
    };

    return { ...MOCK_SUPPLIERS[index] };
  },

  /**
   * Add contact to supplier
   * @param {string} id - Supplier ID
   * @param {SupplierContact} contact - Contact data
   * @returns {Promise<Supplier>}
   */
  async addContact(id, contact) {
    await delay(300);

    const index = MOCK_SUPPLIERS.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Supplier with ID ${id} not found`);
    }

    if (!contact.name || !contact.email) {
      throw new Error('Contact name and email are required');
    }

    MOCK_SUPPLIERS[index].contacts.push(contact);
    MOCK_SUPPLIERS[index].updatedAt = new Date();

    return { ...MOCK_SUPPLIERS[index] };
  },

  /**
   * Remove contact from supplier
   * @param {string} id - Supplier ID
   * @param {number} contactIndex - Index of contact to remove
   * @returns {Promise<Supplier>}
   */
  async removeContact(id, contactIndex) {
    await delay(300);

    const index = MOCK_SUPPLIERS.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error(`Supplier with ID ${id} not found`);
    }

    if (
      contactIndex < 0 ||
      contactIndex >= MOCK_SUPPLIERS[index].contacts.length
    ) {
      throw new Error('Invalid contact index');
    }

    MOCK_SUPPLIERS[index].contacts.splice(contactIndex, 1);
    MOCK_SUPPLIERS[index].updatedAt = new Date();

    return { ...MOCK_SUPPLIERS[index] };
  },
};
