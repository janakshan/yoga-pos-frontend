/**
 * @fileoverview Permission type definitions
 */

/**
 * Permission categories for grouping related permissions
 * @readonly
 * @enum {string}
 */
export const PermissionCategory = {
  POS: 'pos',
  INVENTORY: 'inventory',
  CUSTOMERS: 'customers',
  BOOKINGS: 'bookings',
  STAFF: 'staff',
  BRANCHES: 'branches',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  USERS: 'users',
  ROLES: 'roles',
  PRODUCTS: 'products',
  PAYMENTS: 'payments',
};

/**
 * Permission actions
 * @readonly
 * @enum {string}
 */
export const PermissionAction = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage', // Full access (CRUD)
  VIEW: 'view',     // Read-only access
};

/**
 * @typedef {Object} Permission
 * @property {string} id - Unique identifier
 * @property {string} name - Permission name (e.g., "pos:create")
 * @property {string} displayName - Human-readable name
 * @property {string} description - What this permission allows
 * @property {PermissionCategory} category - Permission category
 * @property {PermissionAction} action - Action type
 * @property {boolean} isActive - Whether permission is active
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 */

/**
 * @typedef {Object} PermissionGroup
 * @property {PermissionCategory} category - Category name
 * @property {string} displayName - Human-readable category name
 * @property {Permission[]} permissions - Permissions in this category
 */

/**
 * @typedef {Object} CreatePermissionInput
 * @property {string} name - Permission name
 * @property {string} displayName - Human-readable name
 * @property {string} description - Permission description
 * @property {PermissionCategory} category - Permission category
 * @property {PermissionAction} action - Action type
 * @property {boolean} [isActive=true] - Whether permission is active
 */

/**
 * @typedef {Object} UpdatePermissionInput
 * @property {string} [displayName] - Human-readable name
 * @property {string} [description] - Permission description
 * @property {boolean} [isActive] - Whether permission is active
 */

/**
 * @typedef {Object} PermissionFilters
 * @property {string} [search] - Search term for name/description
 * @property {PermissionCategory} [category] - Filter by category
 * @property {PermissionAction} [action] - Filter by action
 * @property {boolean} [isActive] - Filter by active status
 */

/**
 * Default permission definitions for the system
 */
export const DEFAULT_PERMISSIONS = [
  // POS Permissions
  { name: 'pos:create', displayName: 'Create POS Transaction', description: 'Create new POS sales transactions', category: PermissionCategory.POS, action: PermissionAction.CREATE },
  { name: 'pos:read', displayName: 'View POS Transactions', description: 'View POS transaction history', category: PermissionCategory.POS, action: PermissionAction.READ },
  { name: 'pos:update', displayName: 'Update POS Transaction', description: 'Modify existing POS transactions', category: PermissionCategory.POS, action: PermissionAction.UPDATE },
  { name: 'pos:delete', displayName: 'Delete POS Transaction', description: 'Delete POS transactions', category: PermissionCategory.POS, action: PermissionAction.DELETE },
  { name: 'pos:refund', displayName: 'Process Refunds', description: 'Process refunds and returns', category: PermissionCategory.POS, action: PermissionAction.MANAGE },

  // Inventory Permissions
  { name: 'inventory:create', displayName: 'Add Inventory', description: 'Add new inventory items', category: PermissionCategory.INVENTORY, action: PermissionAction.CREATE },
  { name: 'inventory:read', displayName: 'View Inventory', description: 'View inventory items and stock levels', category: PermissionCategory.INVENTORY, action: PermissionAction.READ },
  { name: 'inventory:update', displayName: 'Update Inventory', description: 'Update inventory items and quantities', category: PermissionCategory.INVENTORY, action: PermissionAction.UPDATE },
  { name: 'inventory:delete', displayName: 'Delete Inventory', description: 'Delete inventory items', category: PermissionCategory.INVENTORY, action: PermissionAction.DELETE },
  { name: 'inventory:adjust', displayName: 'Adjust Stock', description: 'Adjust inventory stock levels', category: PermissionCategory.INVENTORY, action: PermissionAction.MANAGE },

  // Products Permissions
  { name: 'products:create', displayName: 'Add Products', description: 'Create new products and services', category: PermissionCategory.PRODUCTS, action: PermissionAction.CREATE },
  { name: 'products:read', displayName: 'View Products', description: 'View products and services', category: PermissionCategory.PRODUCTS, action: PermissionAction.READ },
  { name: 'products:update', displayName: 'Update Products', description: 'Modify product information and pricing', category: PermissionCategory.PRODUCTS, action: PermissionAction.UPDATE },
  { name: 'products:delete', displayName: 'Delete Products', description: 'Delete products and services', category: PermissionCategory.PRODUCTS, action: PermissionAction.DELETE },

  // Customers Permissions
  { name: 'customers:create', displayName: 'Add Customers', description: 'Register new customers', category: PermissionCategory.CUSTOMERS, action: PermissionAction.CREATE },
  { name: 'customers:read', displayName: 'View Customers', description: 'View customer information', category: PermissionCategory.CUSTOMERS, action: PermissionAction.READ },
  { name: 'customers:update', displayName: 'Update Customers', description: 'Update customer details', category: PermissionCategory.CUSTOMERS, action: PermissionAction.UPDATE },
  { name: 'customers:delete', displayName: 'Delete Customers', description: 'Delete customer records', category: PermissionCategory.CUSTOMERS, action: PermissionAction.DELETE },

  // Bookings Permissions
  { name: 'bookings:create', displayName: 'Create Bookings', description: 'Create class and appointment bookings', category: PermissionCategory.BOOKINGS, action: PermissionAction.CREATE },
  { name: 'bookings:read', displayName: 'View Bookings', description: 'View booking schedules and details', category: PermissionCategory.BOOKINGS, action: PermissionAction.READ },
  { name: 'bookings:update', displayName: 'Update Bookings', description: 'Modify or reschedule bookings', category: PermissionCategory.BOOKINGS, action: PermissionAction.UPDATE },
  { name: 'bookings:delete', displayName: 'Cancel Bookings', description: 'Cancel bookings and appointments', category: PermissionCategory.BOOKINGS, action: PermissionAction.DELETE },

  // Staff Permissions
  { name: 'staff:create', displayName: 'Add Staff', description: 'Hire new staff members', category: PermissionCategory.STAFF, action: PermissionAction.CREATE },
  { name: 'staff:read', displayName: 'View Staff', description: 'View staff information', category: PermissionCategory.STAFF, action: PermissionAction.READ },
  { name: 'staff:update', displayName: 'Update Staff', description: 'Update staff details and schedules', category: PermissionCategory.STAFF, action: PermissionAction.UPDATE },
  { name: 'staff:delete', displayName: 'Remove Staff', description: 'Terminate staff members', category: PermissionCategory.STAFF, action: PermissionAction.DELETE },
  { name: 'staff:manage-permissions', displayName: 'Manage Staff Permissions', description: 'Assign permissions to staff', category: PermissionCategory.STAFF, action: PermissionAction.MANAGE },

  // Branches Permissions
  { name: 'branches:create', displayName: 'Add Branches', description: 'Create new branch locations', category: PermissionCategory.BRANCHES, action: PermissionAction.CREATE },
  { name: 'branches:read', displayName: 'View Branches', description: 'View branch information', category: PermissionCategory.BRANCHES, action: PermissionAction.READ },
  { name: 'branches:update', displayName: 'Update Branches', description: 'Update branch details and settings', category: PermissionCategory.BRANCHES, action: PermissionAction.UPDATE },
  { name: 'branches:delete', displayName: 'Close Branches', description: 'Close or remove branches', category: PermissionCategory.BRANCHES, action: PermissionAction.DELETE },

  // Reports Permissions
  { name: 'reports:sales', displayName: 'View Sales Reports', description: 'Access sales and revenue reports', category: PermissionCategory.REPORTS, action: PermissionAction.VIEW },
  { name: 'reports:inventory', displayName: 'View Inventory Reports', description: 'Access inventory and stock reports', category: PermissionCategory.REPORTS, action: PermissionAction.VIEW },
  { name: 'reports:staff', displayName: 'View Staff Reports', description: 'Access staff performance reports', category: PermissionCategory.REPORTS, action: PermissionAction.VIEW },
  { name: 'reports:financial', displayName: 'View Financial Reports', description: 'Access financial and accounting reports', category: PermissionCategory.REPORTS, action: PermissionAction.VIEW },
  { name: 'reports:export', displayName: 'Export Reports', description: 'Export reports to various formats', category: PermissionCategory.REPORTS, action: PermissionAction.MANAGE },

  // Payments Permissions
  { name: 'payments:process', displayName: 'Process Payments', description: 'Process customer payments', category: PermissionCategory.PAYMENTS, action: PermissionAction.CREATE },
  { name: 'payments:read', displayName: 'View Payments', description: 'View payment history', category: PermissionCategory.PAYMENTS, action: PermissionAction.READ },
  { name: 'payments:refund', displayName: 'Process Refunds', description: 'Process payment refunds', category: PermissionCategory.PAYMENTS, action: PermissionAction.MANAGE },

  // Users Permissions
  { name: 'users:create', displayName: 'Create Users', description: 'Create new user accounts', category: PermissionCategory.USERS, action: PermissionAction.CREATE },
  { name: 'users:read', displayName: 'View Users', description: 'View user accounts', category: PermissionCategory.USERS, action: PermissionAction.READ },
  { name: 'users:update', displayName: 'Update Users', description: 'Update user account details', category: PermissionCategory.USERS, action: PermissionAction.UPDATE },
  { name: 'users:delete', displayName: 'Delete Users', description: 'Delete user accounts', category: PermissionCategory.USERS, action: PermissionAction.DELETE },
  { name: 'users:assign-roles', displayName: 'Assign User Roles', description: 'Assign roles to users', category: PermissionCategory.USERS, action: PermissionAction.MANAGE },

  // Roles Permissions
  { name: 'roles:create', displayName: 'Create Roles', description: 'Create new user roles', category: PermissionCategory.ROLES, action: PermissionAction.CREATE },
  { name: 'roles:read', displayName: 'View Roles', description: 'View role definitions', category: PermissionCategory.ROLES, action: PermissionAction.READ },
  { name: 'roles:update', displayName: 'Update Roles', description: 'Update role definitions and permissions', category: PermissionCategory.ROLES, action: PermissionAction.UPDATE },
  { name: 'roles:delete', displayName: 'Delete Roles', description: 'Delete user roles', category: PermissionCategory.ROLES, action: PermissionAction.DELETE },

  // Settings Permissions
  { name: 'settings:read', displayName: 'View Settings', description: 'View system settings', category: PermissionCategory.SETTINGS, action: PermissionAction.READ },
  { name: 'settings:update', displayName: 'Update Settings', description: 'Modify system settings', category: PermissionCategory.SETTINGS, action: PermissionAction.UPDATE },
  { name: 'settings:business', displayName: 'Manage Business Info', description: 'Update business information', category: PermissionCategory.SETTINGS, action: PermissionAction.MANAGE },
];
