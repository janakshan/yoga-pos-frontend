import {
  CUSTOMER_TYPES,
  CUSTOMER_STATUS,
  GENDER,
  LOYALTY_TIERS
} from '../types/customer.types.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate unique ID
const generateId = () => `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Mock customer data
let MOCK_CUSTOMERS = [
  {
    id: 'cust_001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1-555-0101',
    dateOfBirth: '1990-05-15',
    gender: GENDER.FEMALE,
    address: {
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'USA',
    },
    customerType: CUSTOMER_TYPES.VIP,
    status: CUSTOMER_STATUS.ACTIVE,
    loyaltyInfo: {
      points: 1500,
      tier: LOYALTY_TIERS.GOLD,
      joinedDate: new Date('2023-01-15'),
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      interests: ['yoga', 'meditation', 'wellness'],
    },
    stats: {
      totalPurchases: 45,
      totalSpent: 2850.75,
      lastPurchaseDate: new Date('2025-11-01'),
      averageOrderValue: 63.35,
    },
    notes: 'Regular customer, prefers morning classes',
    tags: ['regular', 'yoga-enthusiast'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2025-11-01'),
    createdBy: 'admin',
  },
  {
    id: 'cust_002',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@email.com',
    phone: '+1-555-0102',
    dateOfBirth: '1985-08-22',
    gender: GENDER.MALE,
    address: {
      street: '456 Oak Avenue',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
      country: 'USA',
    },
    customerType: CUSTOMER_TYPES.REGULAR,
    status: CUSTOMER_STATUS.ACTIVE,
    loyaltyInfo: {
      points: 850,
      tier: LOYALTY_TIERS.SILVER,
      joinedDate: new Date('2023-06-20'),
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      interests: ['fitness', 'yoga'],
    },
    stats: {
      totalPurchases: 28,
      totalSpent: 1620.50,
      lastPurchaseDate: new Date('2025-10-28'),
      averageOrderValue: 57.88,
    },
    notes: '',
    tags: ['fitness-focused'],
    createdAt: new Date('2023-06-20'),
    updatedAt: new Date('2025-10-28'),
    createdBy: 'admin',
  },
  {
    id: 'cust_003',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1-555-0103',
    dateOfBirth: '1992-12-10',
    gender: GENDER.FEMALE,
    address: {
      street: '789 Elm Street',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94104',
      country: 'USA',
    },
    customerType: CUSTOMER_TYPES.CORPORATE,
    status: CUSTOMER_STATUS.ACTIVE,
    loyaltyInfo: {
      points: 2200,
      tier: LOYALTY_TIERS.PLATINUM,
      joinedDate: new Date('2022-09-10'),
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      interests: ['wellness', 'mindfulness', 'meditation'],
    },
    stats: {
      totalPurchases: 67,
      totalSpent: 5840.25,
      lastPurchaseDate: new Date('2025-11-03'),
      averageOrderValue: 87.17,
    },
    notes: 'Corporate wellness program participant',
    tags: ['corporate', 'high-value'],
    createdAt: new Date('2022-09-10'),
    updatedAt: new Date('2025-11-03'),
    createdBy: 'admin',
  },
  {
    id: 'cust_004',
    firstName: 'David',
    lastName: 'Thompson',
    email: 'david.thompson@email.com',
    phone: '+1-555-0104',
    dateOfBirth: '1988-03-25',
    gender: GENDER.MALE,
    address: {
      street: '321 Pine Road',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'USA',
    },
    customerType: CUSTOMER_TYPES.REGULAR,
    status: CUSTOMER_STATUS.ACTIVE,
    loyaltyInfo: {
      points: 450,
      tier: LOYALTY_TIERS.BRONZE,
      joinedDate: new Date('2024-05-01'),
    },
    preferences: {
      emailNotifications: false,
      smsNotifications: false,
      interests: ['yoga'],
    },
    stats: {
      totalPurchases: 12,
      totalSpent: 680.00,
      lastPurchaseDate: new Date('2025-10-15'),
      averageOrderValue: 56.67,
    },
    notes: '',
    tags: [],
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2025-10-15'),
    createdBy: 'staff_01',
  },
  {
    id: 'cust_005',
    firstName: 'Jessica',
    lastName: 'Williams',
    email: 'jessica.williams@email.com',
    phone: '+1-555-0105',
    dateOfBirth: '1995-07-18',
    gender: GENDER.FEMALE,
    address: {
      street: '654 Maple Drive',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94106',
      country: 'USA',
    },
    customerType: CUSTOMER_TYPES.VIP,
    status: CUSTOMER_STATUS.ACTIVE,
    loyaltyInfo: {
      points: 1850,
      tier: LOYALTY_TIERS.GOLD,
      joinedDate: new Date('2023-03-12'),
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      interests: ['yoga', 'meditation', 'nutrition', 'wellness'],
    },
    stats: {
      totalPurchases: 53,
      totalSpent: 3420.90,
      lastPurchaseDate: new Date('2025-11-04'),
      averageOrderValue: 64.55,
    },
    notes: 'Interested in nutrition workshops',
    tags: ['wellness', 'nutrition'],
    createdAt: new Date('2023-03-12'),
    updatedAt: new Date('2025-11-04'),
    createdBy: 'admin',
  },
];

/**
 * Customer service - handles all customer-related API operations
 */
const customerService = {
  /**
   * Get list of customers with optional filters
   * @param {Object} filters - Filter options
   * @param {string} [filters.search] - Search term for name, email, or phone
   * @param {string} [filters.status] - Filter by status
   * @param {string} [filters.customerType] - Filter by customer type
   * @param {string} [filters.loyaltyTier] - Filter by loyalty tier
   * @param {string} [filters.sortBy] - Sort field
   * @param {string} [filters.sortOrder] - Sort order (asc/desc)
   * @returns {Promise<Customer[]>}
   */
  async getList(filters = {}) {
    await delay(500);

    let filtered = [...MOCK_CUSTOMERS];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(searchLower) ||
          customer.lastName.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          customer.phone.includes(searchLower)
      );
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((customer) => customer.status === filters.status);
    }

    // Customer type filter
    if (filters.customerType) {
      filtered = filtered.filter((customer) => customer.customerType === filters.customerType);
    }

    // Loyalty tier filter
    if (filters.loyaltyTier) {
      filtered = filtered.filter((customer) => customer.loyaltyInfo.tier === filters.loyaltyTier);
    }

    // Sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aVal, bVal;

        switch (filters.sortBy) {
          case 'name':
            aVal = `${a.firstName} ${a.lastName}`.toLowerCase();
            bVal = `${b.firstName} ${b.lastName}`.toLowerCase();
            break;
          case 'email':
            aVal = a.email.toLowerCase();
            bVal = b.email.toLowerCase();
            break;
          case 'totalSpent':
            aVal = a.stats.totalSpent;
            bVal = b.stats.totalSpent;
            break;
          case 'totalPurchases':
            aVal = a.stats.totalPurchases;
            bVal = b.stats.totalPurchases;
            break;
          case 'lastPurchase':
            aVal = a.stats.lastPurchaseDate;
            bVal = b.stats.lastPurchaseDate;
            break;
          case 'createdAt':
            aVal = a.createdAt;
            bVal = b.createdAt;
            break;
          default:
            aVal = a[filters.sortBy];
            bVal = b[filters.sortBy];
        }

        if (filters.sortOrder === 'desc') {
          return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      });
    }

    return filtered;
  },

  /**
   * Get customer by ID
   * @param {string} id - Customer ID
   * @returns {Promise<Customer|null>}
   */
  async getById(id) {
    await delay(300);
    const customer = MOCK_CUSTOMERS.find((c) => c.id === id);
    return customer || null;
  },

  /**
   * Create new customer
   * @param {Partial<Customer>} data - Customer data
   * @returns {Promise<Customer>}
   */
  async create(data) {
    await delay(500);

    const newCustomer = {
      id: generateId(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      dateOfBirth: data.dateOfBirth || null,
      gender: data.gender || GENDER.PREFER_NOT_TO_SAY,
      address: data.address || {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
      customerType: data.customerType || CUSTOMER_TYPES.REGULAR,
      status: data.status || CUSTOMER_STATUS.ACTIVE,
      loyaltyInfo: {
        points: 0,
        tier: LOYALTY_TIERS.BRONZE,
        joinedDate: new Date(),
      },
      preferences: {
        emailNotifications: data.preferences?.emailNotifications ?? true,
        smsNotifications: data.preferences?.smsNotifications ?? false,
        interests: data.preferences?.interests || [],
      },
      stats: {
        totalPurchases: 0,
        totalSpent: 0,
        lastPurchaseDate: null,
        averageOrderValue: 0,
      },
      notes: data.notes || '',
      tags: data.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user', // In real app, get from auth context
    };

    MOCK_CUSTOMERS.push(newCustomer);
    return newCustomer;
  },

  /**
   * Update existing customer
   * @param {string} id - Customer ID
   * @param {Partial<Customer>} data - Updated customer data
   * @returns {Promise<Customer>}
   */
  async update(id, data) {
    await delay(500);

    const index = MOCK_CUSTOMERS.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }

    MOCK_CUSTOMERS[index] = {
      ...MOCK_CUSTOMERS[index],
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    return MOCK_CUSTOMERS[index];
  },

  /**
   * Delete customer
   * @param {string} id - Customer ID
   * @returns {Promise<boolean>}
   */
  async remove(id) {
    await delay(500);

    const index = MOCK_CUSTOMERS.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }

    MOCK_CUSTOMERS.splice(index, 1);
    return true;
  },

  /**
   * Update customer loyalty points
   * @param {string} id - Customer ID
   * @param {number} pointsChange - Points to add (positive) or subtract (negative)
   * @returns {Promise<Customer>}
   */
  async updateLoyaltyPoints(id, pointsChange) {
    await delay(300);

    const index = MOCK_CUSTOMERS.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }

    const customer = MOCK_CUSTOMERS[index];
    const newPoints = Math.max(0, customer.loyaltyInfo.points + pointsChange);

    // Update tier based on points
    let newTier = LOYALTY_TIERS.BRONZE;
    if (newPoints >= 2000) newTier = LOYALTY_TIERS.PLATINUM;
    else if (newPoints >= 1000) newTier = LOYALTY_TIERS.GOLD;
    else if (newPoints >= 500) newTier = LOYALTY_TIERS.SILVER;

    MOCK_CUSTOMERS[index] = {
      ...customer,
      loyaltyInfo: {
        ...customer.loyaltyInfo,
        points: newPoints,
        tier: newTier,
      },
      updatedAt: new Date(),
    };

    return MOCK_CUSTOMERS[index];
  },

  /**
   * Update customer purchase stats
   * @param {string} id - Customer ID
   * @param {number} amount - Purchase amount
   * @returns {Promise<Customer>}
   */
  async updatePurchaseStats(id, amount) {
    await delay(300);

    const index = MOCK_CUSTOMERS.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error('Customer not found');
    }

    const customer = MOCK_CUSTOMERS[index];
    const newTotalPurchases = customer.stats.totalPurchases + 1;
    const newTotalSpent = customer.stats.totalSpent + amount;
    const newAverageOrderValue = newTotalSpent / newTotalPurchases;

    MOCK_CUSTOMERS[index] = {
      ...customer,
      stats: {
        ...customer.stats,
        totalPurchases: newTotalPurchases,
        totalSpent: newTotalSpent,
        lastPurchaseDate: new Date(),
        averageOrderValue: newAverageOrderValue,
      },
      updatedAt: new Date(),
    };

    return MOCK_CUSTOMERS[index];
  },

  /**
   * Get customer statistics summary
   * @returns {Promise<Object>}
   */
  async getStats() {
    await delay(300);

    const totalCustomers = MOCK_CUSTOMERS.length;
    const activeCustomers = MOCK_CUSTOMERS.filter((c) => c.status === CUSTOMER_STATUS.ACTIVE).length;
    const vipCustomers = MOCK_CUSTOMERS.filter((c) => c.customerType === CUSTOMER_TYPES.VIP).length;
    const totalRevenue = MOCK_CUSTOMERS.reduce((sum, c) => sum + c.stats.totalSpent, 0);
    const averageCustomerValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    return {
      totalCustomers,
      activeCustomers,
      vipCustomers,
      totalRevenue,
      averageCustomerValue,
      newThisMonth: MOCK_CUSTOMERS.filter((c) => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return c.createdAt >= monthAgo;
      }).length,
    };
  },

  /**
   * Bulk update customer status
   * @param {string[]} ids - Array of customer IDs
   * @param {string} status - New status
   * @returns {Promise<number>}
   */
  async bulkUpdateStatus(ids, status) {
    await delay(500);

    let updated = 0;
    ids.forEach((id) => {
      const index = MOCK_CUSTOMERS.findIndex((c) => c.id === id);
      if (index !== -1) {
        MOCK_CUSTOMERS[index] = {
          ...MOCK_CUSTOMERS[index],
          status,
          updatedAt: new Date(),
        };
        updated++;
      }
    });

    return updated;
  },
};

export { customerService };
export default customerService;
