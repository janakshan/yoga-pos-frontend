import {
  CUSTOMER_TYPES,
  CUSTOMER_STATUS,
  GENDER,
  LOYALTY_TIERS,
  CREDIT_STATUS,
  NOTE_TYPES,
  CONTACT_METHODS,
  COMMUNICATION_FREQUENCY,
  LANGUAGES,
  LOYALTY_TIER_THRESHOLDS,
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
    alternatePhone: '+1-555-0201',
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
    segments: ['seg_vip', 'seg_high_value'],
    loyaltyInfo: {
      points: 5500,
      tier: LOYALTY_TIERS.GOLD,
      joinedDate: new Date('2023-01-15'),
      lastEarnedDate: new Date('2025-11-01'),
      lastRedeemedDate: new Date('2025-10-15'),
      lifetimePoints: 8200,
      redeemedPoints: 2700,
    },
    creditInfo: {
      creditLimit: 5000,
      currentBalance: 0,
      availableCredit: 5000,
      creditStatus: CREDIT_STATUS.GOOD,
      lastPaymentDate: new Date('2025-10-25'),
      lastPaymentAmount: 500,
      nextPaymentDue: null,
    },
    storeCredit: {
      balance: 150.00,
      lastUpdated: new Date('2025-10-15'),
      expiryDate: new Date('2026-10-15'),
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      promotionalSms: false,
      preferredContactMethod: CONTACT_METHODS.EMAIL,
      preferredLanguage: LANGUAGES.ENGLISH,
      interests: ['yoga', 'meditation', 'wellness'],
      communicationFrequency: COMMUNICATION_FREQUENCY.WEEKLY,
    },
    stats: {
      totalPurchases: 45,
      totalSpent: 2850.75,
      lastPurchaseDate: new Date('2025-11-01'),
      averageOrderValue: 63.35,
      firstPurchaseDate: new Date('2023-01-20'),
      yearlySpent: 1850.75,
      monthlySpent: 320.50,
      returnRate: 2.5,
    },
    notes: 'Regular customer, prefers morning classes',
    tags: ['regular', 'yoga-enthusiast'],
    referredBy: null,
    referralCount: 3,
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

// Mock customer segments
let MOCK_SEGMENTS = [
  {
    id: 'seg_vip',
    name: 'VIP Customers',
    description: 'High-value VIP customers with premium benefits',
    criteria: {
      type: 'automatic',
      rules: {
        customerType: CUSTOMER_TYPES.VIP,
        minSpent: 2000,
      },
    },
    customerIds: ['cust_001', 'cust_005'],
    customerCount: 2,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2025-11-01'),
    createdBy: 'admin',
  },
  {
    id: 'seg_high_value',
    name: 'High Value Customers',
    description: 'Customers who have spent more than $2000',
    criteria: {
      type: 'automatic',
      rules: {
        minSpent: 2000,
      },
    },
    customerIds: ['cust_001', 'cust_003', 'cust_005'],
    customerCount: 3,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2025-11-01'),
    createdBy: 'admin',
  },
  {
    id: 'seg_recent',
    name: 'Recently Active',
    description: 'Customers who made a purchase in the last 30 days',
    criteria: {
      type: 'automatic',
      rules: {
        lastPurchaseDays: 30,
      },
    },
    customerIds: ['cust_001', 'cust_003', 'cust_005'],
    customerCount: 3,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-11-01'),
    createdBy: 'admin',
  },
];

// Mock customer notes
let MOCK_NOTES = [
  {
    id: 'note_001',
    customerId: 'cust_001',
    note: 'Customer expressed interest in advanced yoga workshops',
    type: NOTE_TYPES.SALES,
    createdBy: 'admin',
    createdAt: new Date('2025-10-15'),
  },
  {
    id: 'note_002',
    customerId: 'cust_001',
    note: 'Resolved billing inquiry regarding loyalty points',
    type: NOTE_TYPES.SUPPORT,
    createdBy: 'support_01',
    createdAt: new Date('2025-10-20'),
  },
  {
    id: 'note_003',
    customerId: 'cust_003',
    note: 'Corporate wellness program renewal scheduled',
    type: NOTE_TYPES.GENERAL,
    createdBy: 'admin',
    createdAt: new Date('2025-11-01'),
  },
];

// Mock purchase history
let MOCK_PURCHASE_HISTORY = [
  {
    id: 'order_001',
    customerId: 'cust_001',
    date: new Date('2025-11-01'),
    amount: 120.00,
    discount: 12.00,
    total: 108.00,
    paymentMethod: 'credit_card',
    items: [
      { name: 'Yoga Mat Premium', quantity: 1, price: 80.00 },
      { name: 'Meditation Cushion', quantity: 1, price: 40.00 },
    ],
    status: 'completed',
    loyaltyPointsEarned: 108,
  },
  {
    id: 'order_002',
    customerId: 'cust_001',
    date: new Date('2025-10-15'),
    amount: 200.00,
    discount: 20.00,
    total: 180.00,
    paymentMethod: 'store_credit',
    items: [
      { name: 'Yoga Block Set', quantity: 2, price: 50.00 },
      { name: 'Resistance Bands', quantity: 1, price: 30.00 },
      { name: 'Water Bottle', quantity: 2, price: 35.00 },
    ],
    status: 'completed',
    loyaltyPointsEarned: 180,
  },
  {
    id: 'order_003',
    customerId: 'cust_003',
    date: new Date('2025-11-03'),
    amount: 350.00,
    discount: 52.50,
    total: 297.50,
    paymentMethod: 'corporate_account',
    items: [
      { name: 'Wellness Package', quantity: 5, price: 70.00 },
    ],
    status: 'completed',
    loyaltyPointsEarned: 298,
  },
];

// Mock credit transactions
let MOCK_CREDIT_TRANSACTIONS = [
  {
    id: 'credit_tx_001',
    customerId: 'cust_001',
    type: 'payment',
    amount: 500.00,
    balanceBefore: 500.00,
    balanceAfter: 0,
    description: 'Payment received',
    paymentMethod: 'bank_transfer',
    date: new Date('2025-10-25'),
    createdBy: 'admin',
  },
  {
    id: 'credit_tx_002',
    customerId: 'cust_003',
    type: 'charge',
    amount: 297.50,
    balanceBefore: 0,
    balanceAfter: 297.50,
    description: 'Corporate order #order_003',
    paymentMethod: null,
    date: new Date('2025-11-03'),
    createdBy: 'system',
  },
];

// Mock store credit transactions
let MOCK_STORE_CREDIT_TRANSACTIONS = [
  {
    id: 'sc_tx_001',
    customerId: 'cust_001',
    type: 'credit',
    amount: 150.00,
    balanceBefore: 0,
    balanceAfter: 150.00,
    reason: 'Return credit for order #order_050',
    orderId: 'order_050',
    date: new Date('2025-10-15'),
    createdBy: 'admin',
  },
  {
    id: 'sc_tx_002',
    customerId: 'cust_001',
    type: 'debit',
    amount: 50.00,
    balanceBefore: 200.00,
    balanceAfter: 150.00,
    reason: 'Applied to order #order_002',
    orderId: 'order_002',
    date: new Date('2025-10-16'),
    createdBy: 'system',
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

  // ========== SEGMENT MANAGEMENT ==========

  /**
   * Get all customer segments
   * @returns {Promise<CustomerSegment[]>}
   */
  async getSegments() {
    await delay(300);
    return [...MOCK_SEGMENTS];
  },

  /**
   * Get segment by ID
   * @param {string} id - Segment ID
   * @returns {Promise<CustomerSegment|null>}
   */
  async getSegmentById(id) {
    await delay(300);
    return MOCK_SEGMENTS.find((s) => s.id === id) || null;
  },

  /**
   * Create new customer segment
   * @param {Object} data - Segment data
   * @returns {Promise<CustomerSegment>}
   */
  async createSegment(data) {
    await delay(500);

    const newSegment = {
      id: `seg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      description: data.description || '',
      criteria: data.criteria,
      customerIds: data.customerIds || [],
      customerCount: data.customerIds?.length || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'current_user',
    };

    MOCK_SEGMENTS.push(newSegment);
    return newSegment;
  },

  /**
   * Update existing segment
   * @param {string} id - Segment ID
   * @param {Object} data - Updated segment data
   * @returns {Promise<CustomerSegment>}
   */
  async updateSegment(id, data) {
    await delay(500);

    const index = MOCK_SEGMENTS.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('Segment not found');
    }

    MOCK_SEGMENTS[index] = {
      ...MOCK_SEGMENTS[index],
      ...data,
      id,
      updatedAt: new Date(),
    };

    return MOCK_SEGMENTS[index];
  },

  /**
   * Delete segment
   * @param {string} id - Segment ID
   * @returns {Promise<boolean>}
   */
  async deleteSegment(id) {
    await delay(500);

    const index = MOCK_SEGMENTS.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('Segment not found');
    }

    MOCK_SEGMENTS.splice(index, 1);
    return true;
  },

  /**
   * Assign customers to a segment
   * @param {string} segmentId - Segment ID
   * @param {string[]} customerIds - Customer IDs to assign
   * @returns {Promise<CustomerSegment>}
   */
  async assignCustomersToSegment(segmentId, customerIds) {
    await delay(500);

    const segmentIndex = MOCK_SEGMENTS.findIndex((s) => s.id === segmentId);
    if (segmentIndex === -1) {
      throw new Error('Segment not found');
    }

    // Update segment with new customer IDs
    const existingIds = MOCK_SEGMENTS[segmentIndex].customerIds || [];
    const updatedIds = [...new Set([...existingIds, ...customerIds])];

    MOCK_SEGMENTS[segmentIndex] = {
      ...MOCK_SEGMENTS[segmentIndex],
      customerIds: updatedIds,
      customerCount: updatedIds.length,
      updatedAt: new Date(),
    };

    // Update customers with segment ID
    customerIds.forEach((customerId) => {
      const customerIndex = MOCK_CUSTOMERS.findIndex((c) => c.id === customerId);
      if (customerIndex !== -1) {
        const existingSegments = MOCK_CUSTOMERS[customerIndex].segments || [];
        if (!existingSegments.includes(segmentId)) {
          MOCK_CUSTOMERS[customerIndex] = {
            ...MOCK_CUSTOMERS[customerIndex],
            segments: [...existingSegments, segmentId],
            updatedAt: new Date(),
          };
        }
      }
    });

    return MOCK_SEGMENTS[segmentIndex];
  },

  /**
   * Remove customers from a segment
   * @param {string} segmentId - Segment ID
   * @param {string[]} customerIds - Customer IDs to remove
   * @returns {Promise<CustomerSegment>}
   */
  async removeCustomersFromSegment(segmentId, customerIds) {
    await delay(500);

    const segmentIndex = MOCK_SEGMENTS.findIndex((s) => s.id === segmentId);
    if (segmentIndex === -1) {
      throw new Error('Segment not found');
    }

    // Update segment by removing customer IDs
    const updatedIds = MOCK_SEGMENTS[segmentIndex].customerIds.filter(
      (id) => !customerIds.includes(id)
    );

    MOCK_SEGMENTS[segmentIndex] = {
      ...MOCK_SEGMENTS[segmentIndex],
      customerIds: updatedIds,
      customerCount: updatedIds.length,
      updatedAt: new Date(),
    };

    // Update customers by removing segment ID
    customerIds.forEach((customerId) => {
      const customerIndex = MOCK_CUSTOMERS.findIndex((c) => c.id === customerId);
      if (customerIndex !== -1) {
        const existingSegments = MOCK_CUSTOMERS[customerIndex].segments || [];
        MOCK_CUSTOMERS[customerIndex] = {
          ...MOCK_CUSTOMERS[customerIndex],
          segments: existingSegments.filter((s) => s !== segmentId),
          updatedAt: new Date(),
        };
      }
    });

    return MOCK_SEGMENTS[segmentIndex];
  },

  // ========== CUSTOMER NOTES ==========

  /**
   * Get notes for a customer
   * @param {string} customerId - Customer ID
   * @returns {Promise<CustomerNote[]>}
   */
  async getCustomerNotes(customerId) {
    await delay(300);
    return MOCK_NOTES.filter((n) => n.customerId === customerId).sort(
      (a, b) => b.createdAt - a.createdAt
    );
  },

  /**
   * Add note to customer
   * @param {string} customerId - Customer ID
   * @param {Object} noteData - Note data
   * @returns {Promise<CustomerNote>}
   */
  async addCustomerNote(customerId, noteData) {
    await delay(500);

    const newNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      note: noteData.note,
      type: noteData.type || NOTE_TYPES.GENERAL,
      createdBy: 'current_user',
      createdAt: new Date(),
    };

    MOCK_NOTES.push(newNote);
    return newNote;
  },

  /**
   * Update customer note
   * @param {string} noteId - Note ID
   * @param {Object} noteData - Updated note data
   * @returns {Promise<CustomerNote>}
   */
  async updateCustomerNote(noteId, noteData) {
    await delay(500);

    const index = MOCK_NOTES.findIndex((n) => n.id === noteId);
    if (index === -1) {
      throw new Error('Note not found');
    }

    MOCK_NOTES[index] = {
      ...MOCK_NOTES[index],
      ...noteData,
      id: noteId,
    };

    return MOCK_NOTES[index];
  },

  /**
   * Delete customer note
   * @param {string} noteId - Note ID
   * @returns {Promise<boolean>}
   */
  async deleteCustomerNote(noteId) {
    await delay(500);

    const index = MOCK_NOTES.findIndex((n) => n.id === noteId);
    if (index === -1) {
      throw new Error('Note not found');
    }

    MOCK_NOTES.splice(index, 1);
    return true;
  },

  // ========== PURCHASE HISTORY ==========

  /**
   * Get purchase history for a customer
   * @param {string} customerId - Customer ID
   * @param {Object} filters - Filter options
   * @returns {Promise<PurchaseHistoryItem[]>}
   */
  async getCustomerPurchaseHistory(customerId, filters = {}) {
    await delay(300);

    let history = MOCK_PURCHASE_HISTORY.filter((p) => p.customerId === customerId);

    // Date range filter
    if (filters.startDate) {
      history = history.filter((p) => p.date >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      history = history.filter((p) => p.date <= new Date(filters.endDate));
    }

    // Status filter
    if (filters.status) {
      history = history.filter((p) => p.status === filters.status);
    }

    return history.sort((a, b) => b.date - a.date);
  },

  /**
   * Get purchase history statistics for a customer
   * @param {string} customerId - Customer ID
   * @returns {Promise<Object>}
   */
  async getPurchaseHistoryStats(customerId) {
    await delay(300);

    const history = MOCK_PURCHASE_HISTORY.filter((p) => p.customerId === customerId);

    if (history.length === 0) {
      return {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        totalSaved: 0,
        lastOrderDate: null,
        firstOrderDate: null,
      };
    }

    const totalSpent = history.reduce((sum, p) => sum + p.total, 0);
    const totalSaved = history.reduce((sum, p) => sum + p.discount, 0);
    const dates = history.map((p) => p.date).sort((a, b) => a - b);

    return {
      totalOrders: history.length,
      totalSpent,
      averageOrderValue: totalSpent / history.length,
      totalSaved,
      lastOrderDate: dates[dates.length - 1],
      firstOrderDate: dates[0],
    };
  },

  // ========== CREDIT MANAGEMENT ==========

  /**
   * Get credit transactions for a customer
   * @param {string} customerId - Customer ID
   * @returns {Promise<CreditTransaction[]>}
   */
  async getCreditTransactions(customerId) {
    await delay(300);
    return MOCK_CREDIT_TRANSACTIONS.filter((t) => t.customerId === customerId).sort(
      (a, b) => b.date - a.date
    );
  },

  /**
   * Create credit charge
   * @param {string} customerId - Customer ID
   * @param {Object} chargeData - Charge data
   * @returns {Promise<CreditTransaction>}
   */
  async createCreditCharge(customerId, chargeData) {
    await delay(500);

    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const currentBalance = customer.creditInfo?.currentBalance || 0;
    const newBalance = currentBalance + chargeData.amount;
    const creditLimit = customer.creditInfo?.creditLimit || 0;

    if (newBalance > creditLimit) {
      throw new Error('Credit limit exceeded');
    }

    const transaction = {
      id: `credit_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      type: 'charge',
      amount: chargeData.amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      description: chargeData.description || 'Credit charge',
      paymentMethod: null,
      date: new Date(),
      createdBy: 'current_user',
    };

    MOCK_CREDIT_TRANSACTIONS.push(transaction);

    // Update customer credit info
    const customerIndex = MOCK_CUSTOMERS.findIndex((c) => c.id === customerId);
    if (customerIndex !== -1) {
      MOCK_CUSTOMERS[customerIndex] = {
        ...MOCK_CUSTOMERS[customerIndex],
        creditInfo: {
          ...MOCK_CUSTOMERS[customerIndex].creditInfo,
          currentBalance: newBalance,
          availableCredit: creditLimit - newBalance,
        },
        updatedAt: new Date(),
      };
    }

    return transaction;
  },

  /**
   * Create credit payment
   * @param {string} customerId - Customer ID
   * @param {Object} paymentData - Payment data
   * @returns {Promise<CreditTransaction>}
   */
  async createCreditPayment(customerId, paymentData) {
    await delay(500);

    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const currentBalance = customer.creditInfo?.currentBalance || 0;
    const newBalance = Math.max(0, currentBalance - paymentData.amount);
    const creditLimit = customer.creditInfo?.creditLimit || 0;

    const transaction = {
      id: `credit_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      type: 'payment',
      amount: paymentData.amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      description: paymentData.description || 'Credit payment',
      paymentMethod: paymentData.paymentMethod,
      date: new Date(),
      createdBy: 'current_user',
    };

    MOCK_CREDIT_TRANSACTIONS.push(transaction);

    // Update customer credit info
    const customerIndex = MOCK_CUSTOMERS.findIndex((c) => c.id === customerId);
    if (customerIndex !== -1) {
      MOCK_CUSTOMERS[customerIndex] = {
        ...MOCK_CUSTOMERS[customerIndex],
        creditInfo: {
          ...MOCK_CUSTOMERS[customerIndex].creditInfo,
          currentBalance: newBalance,
          availableCredit: creditLimit - newBalance,
          lastPaymentDate: new Date(),
          lastPaymentAmount: paymentData.amount,
        },
        updatedAt: new Date(),
      };
    }

    return transaction;
  },

  /**
   * Update customer credit limit
   * @param {string} customerId - Customer ID
   * @param {number} newLimit - New credit limit
   * @returns {Promise<Customer>}
   */
  async updateCreditLimit(customerId, newLimit) {
    await delay(500);

    const index = MOCK_CUSTOMERS.findIndex((c) => c.id === customerId);
    if (index === -1) {
      throw new Error('Customer not found');
    }

    const customer = MOCK_CUSTOMERS[index];
    const currentBalance = customer.creditInfo?.currentBalance || 0;

    MOCK_CUSTOMERS[index] = {
      ...customer,
      creditInfo: {
        ...customer.creditInfo,
        creditLimit: newLimit,
        availableCredit: newLimit - currentBalance,
      },
      updatedAt: new Date(),
    };

    return MOCK_CUSTOMERS[index];
  },

  // ========== STORE CREDIT MANAGEMENT ==========

  /**
   * Get store credit transactions for a customer
   * @param {string} customerId - Customer ID
   * @returns {Promise<StoreCreditTransaction[]>}
   */
  async getStoreCreditTransactions(customerId) {
    await delay(300);
    return MOCK_STORE_CREDIT_TRANSACTIONS.filter((t) => t.customerId === customerId).sort(
      (a, b) => b.date - a.date
    );
  },

  /**
   * Add store credit to customer
   * @param {string} customerId - Customer ID
   * @param {Object} creditData - Store credit data
   * @returns {Promise<StoreCreditTransaction>}
   */
  async addStoreCredit(customerId, creditData) {
    await delay(500);

    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const currentBalance = customer.storeCredit?.balance || 0;
    const newBalance = currentBalance + creditData.amount;

    const transaction = {
      id: `sc_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      type: 'credit',
      amount: creditData.amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      reason: creditData.reason || 'Store credit added',
      orderId: creditData.orderId || null,
      date: new Date(),
      createdBy: 'current_user',
    };

    MOCK_STORE_CREDIT_TRANSACTIONS.push(transaction);

    // Update customer store credit
    const customerIndex = MOCK_CUSTOMERS.findIndex((c) => c.id === customerId);
    if (customerIndex !== -1) {
      MOCK_CUSTOMERS[customerIndex] = {
        ...MOCK_CUSTOMERS[customerIndex],
        storeCredit: {
          balance: newBalance,
          lastUpdated: new Date(),
          expiryDate: creditData.expiryDate || null,
        },
        updatedAt: new Date(),
      };
    }

    return transaction;
  },

  /**
   * Deduct store credit from customer
   * @param {string} customerId - Customer ID
   * @param {Object} debitData - Debit data
   * @returns {Promise<StoreCreditTransaction>}
   */
  async deductStoreCredit(customerId, debitData) {
    await delay(500);

    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const currentBalance = customer.storeCredit?.balance || 0;
    if (currentBalance < debitData.amount) {
      throw new Error('Insufficient store credit balance');
    }

    const newBalance = currentBalance - debitData.amount;

    const transaction = {
      id: `sc_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      customerId,
      type: 'debit',
      amount: debitData.amount,
      balanceBefore: currentBalance,
      balanceAfter: newBalance,
      reason: debitData.reason || 'Store credit used',
      orderId: debitData.orderId || null,
      date: new Date(),
      createdBy: 'current_user',
    };

    MOCK_STORE_CREDIT_TRANSACTIONS.push(transaction);

    // Update customer store credit
    const customerIndex = MOCK_CUSTOMERS.findIndex((c) => c.id === customerId);
    if (customerIndex !== -1) {
      MOCK_CUSTOMERS[customerIndex] = {
        ...MOCK_CUSTOMERS[customerIndex],
        storeCredit: {
          ...MOCK_CUSTOMERS[customerIndex].storeCredit,
          balance: newBalance,
          lastUpdated: new Date(),
        },
        updatedAt: new Date(),
      };
    }

    return transaction;
  },

  /**
   * Redeem loyalty points for store credit
   * @param {string} customerId - Customer ID
   * @param {number} points - Points to redeem
   * @param {number} conversionRate - Points to currency conversion rate
   * @returns {Promise<Object>}
   */
  async redeemLoyaltyPoints(customerId, points, conversionRate = 100) {
    await delay(500);

    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    const currentPoints = customer.loyaltyInfo?.points || 0;
    if (currentPoints < points) {
      throw new Error('Insufficient loyalty points');
    }

    // Convert points to store credit (e.g., 100 points = $1)
    const creditAmount = points / conversionRate;

    // Deduct points
    await this.updateLoyaltyPoints(customerId, -points);

    // Add store credit
    const transaction = await this.addStoreCredit(customerId, {
      amount: creditAmount,
      reason: `Redeemed ${points} loyalty points`,
    });

    return {
      pointsRedeemed: points,
      storeCreditAdded: creditAmount,
      transaction,
    };
  },
};

export { customerService };
export default customerService;
