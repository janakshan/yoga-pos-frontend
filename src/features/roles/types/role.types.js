/**
 * @fileoverview Role type definitions
 */

/**
 * @typedef {Object} Role
 * @property {string} id - Unique identifier
 * @property {string} name - Role name (e.g., "Manager", "Instructor")
 * @property {string} code - System code (e.g., "manager", "instructor")
 * @property {string} description - Role description
 * @property {string[]} permissions - Array of permission IDs or names
 * @property {boolean} isSystem - Whether this is a system-defined role (cannot be deleted)
 * @property {boolean} isActive - Whether role is active
 * @property {number} userCount - Number of users assigned to this role
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 * @property {string} createdBy - User ID who created the role
 */

/**
 * @typedef {Object} CreateRoleInput
 * @property {string} name - Role name
 * @property {string} code - System code (lowercase, no spaces)
 * @property {string} description - Role description
 * @property {string[]} permissions - Array of permission IDs or names to assign
 * @property {boolean} [isActive=true] - Whether role is active
 */

/**
 * @typedef {Object} UpdateRoleInput
 * @property {string} [name] - Role name
 * @property {string} [description] - Role description
 * @property {string[]} [permissions] - Array of permission IDs or names
 * @property {boolean} [isActive] - Whether role is active
 */

/**
 * @typedef {Object} RoleFilters
 * @property {string} [search] - Search term for name/description
 * @property {boolean} [isActive] - Filter by active status
 * @property {boolean} [isSystem] - Filter system/custom roles
 * @property {string} [sortBy] - Sort field (name, createdAt, userCount)
 * @property {string} [sortOrder] - Sort order (asc, desc)
 */

/**
 * @typedef {Object} RoleStats
 * @property {number} total - Total roles
 * @property {number} active - Active roles
 * @property {number} inactive - Inactive roles
 * @property {number} system - System roles
 * @property {number} custom - Custom roles
 */

/**
 * System role codes
 * @readonly
 * @enum {string}
 */
export const SystemRoles = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  INSTRUCTOR: 'instructor',
  RECEPTIONIST: 'receptionist',
};

/**
 * Default system roles with their initial permissions
 */
export const DEFAULT_ROLES = [
  {
    name: 'Super Admin',
    code: SystemRoles.SUPER_ADMIN,
    description: 'Full system access with all permissions',
    isSystem: true,
    permissions: ['*'], // Special case: all permissions
  },
  {
    name: 'Admin',
    code: SystemRoles.ADMIN,
    description: 'Administrative access to manage studio operations',
    isSystem: true,
    permissions: [
      'pos:create', 'pos:read', 'pos:update', 'pos:delete', 'pos:refund',
      'inventory:create', 'inventory:read', 'inventory:update', 'inventory:delete', 'inventory:adjust',
      'products:create', 'products:read', 'products:update', 'products:delete',
      'customers:create', 'customers:read', 'customers:update', 'customers:delete',
      'bookings:create', 'bookings:read', 'bookings:update', 'bookings:delete',
      'staff:create', 'staff:read', 'staff:update', 'staff:delete',
      'branches:create', 'branches:read', 'branches:update', 'branches:delete',
      'reports:sales', 'reports:inventory', 'reports:staff', 'reports:financial', 'reports:export',
      'payments:process', 'payments:read', 'payments:refund',
      'users:create', 'users:read', 'users:update', 'users:delete', 'users:assign-roles',
      'roles:read',
      'settings:read', 'settings:update', 'settings:business',
    ],
  },
  {
    name: 'Manager',
    code: SystemRoles.MANAGER,
    description: 'Branch manager with operational permissions',
    isSystem: true,
    permissions: [
      'pos:create', 'pos:read', 'pos:update', 'pos:refund',
      'inventory:read', 'inventory:update', 'inventory:adjust',
      'products:read', 'products:update',
      'customers:create', 'customers:read', 'customers:update',
      'bookings:create', 'bookings:read', 'bookings:update', 'bookings:delete',
      'staff:read', 'staff:update',
      'branches:read',
      'reports:sales', 'reports:inventory', 'reports:staff', 'reports:export',
      'payments:process', 'payments:read',
      'settings:read',
    ],
  },
  {
    name: 'Staff',
    code: SystemRoles.STAFF,
    description: 'General staff member with basic operational access',
    isSystem: true,
    permissions: [
      'pos:create', 'pos:read',
      'products:read',
      'customers:create', 'customers:read', 'customers:update',
      'bookings:create', 'bookings:read', 'bookings:update',
      'inventory:read',
      'payments:process', 'payments:read',
    ],
  },
  {
    name: 'Instructor',
    code: SystemRoles.INSTRUCTOR,
    description: 'Yoga instructor with class and booking management',
    isSystem: true,
    permissions: [
      'bookings:create', 'bookings:read', 'bookings:update', 'bookings:delete',
      'customers:read', 'customers:update',
      'reports:staff',
      'products:read',
    ],
  },
  {
    name: 'Receptionist',
    code: SystemRoles.RECEPTIONIST,
    description: 'Front desk staff managing bookings and customer service',
    isSystem: true,
    permissions: [
      'bookings:create', 'bookings:read', 'bookings:update', 'bookings:delete',
      'customers:create', 'customers:read', 'customers:update',
      'payments:process', 'payments:read',
      'products:read',
    ],
  },
];
