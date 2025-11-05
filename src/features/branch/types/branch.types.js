/**
 * Branch Type Definitions
 *
 * Defines the structure of branch entities and related types
 * for the multi-branch POS system.
 */

/**
 * @typedef {Object} Branch
 * @property {string} id - Unique branch identifier
 * @property {string} name - Branch display name
 * @property {string} code - Unique branch code (e.g., "BR001")
 * @property {string} address - Physical address of the branch
 * @property {string} city - City where branch is located
 * @property {string} state - State/province
 * @property {string} zipCode - Postal/ZIP code
 * @property {string} country - Country
 * @property {string} phone - Contact phone number
 * @property {string} email - Branch email address
 * @property {string|null} managerId - ID of the assigned manager
 * @property {string|null} managerName - Name of the assigned manager
 * @property {boolean} isActive - Whether branch is currently active
 * @property {number} staffCount - Number of staff members
 * @property {BranchSettings} settings - Branch-specific settings
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 * @property {string} createdBy - ID of user who created the branch
 */

/**
 * @typedef {Object} BranchSettings
 * @property {string} timezone - Branch timezone (e.g., "America/New_York")
 * @property {string} currency - Default currency code (e.g., "USD")
 * @property {number} taxRate - Default tax rate as decimal (e.g., 0.08 for 8%)
 * @property {boolean} allowWalkins - Whether to allow walk-in customers
 * @property {Object} operatingHours - Weekly operating hours
 */

/**
 * @typedef {Object} CreateBranchInput
 * @property {string} name - Branch display name
 * @property {string} code - Unique branch code
 * @property {string} address - Physical address
 * @property {string} city - City
 * @property {string} state - State/province
 * @property {string} zipCode - Postal code
 * @property {string} country - Country
 * @property {string} phone - Contact phone
 * @property {string} email - Branch email
 * @property {string|null} [managerId] - Optional manager ID
 * @property {BranchSettings} [settings] - Optional branch settings
 */

/**
 * @typedef {Object} UpdateBranchInput
 * @property {string} [name] - Branch display name
 * @property {string} [address] - Physical address
 * @property {string} [city] - City
 * @property {string} [state] - State/province
 * @property {string} [zipCode] - Postal code
 * @property {string} [country] - Country
 * @property {string} [phone] - Contact phone
 * @property {string} [email] - Branch email
 * @property {string|null} [managerId] - Manager ID
 * @property {boolean} [isActive] - Active status
 * @property {BranchSettings} [settings] - Branch settings
 */

/**
 * @typedef {Object} BranchFilters
 * @property {string} [search] - Search term for name, code, or address
 * @property {boolean} [isActive] - Filter by active status
 * @property {string} [city] - Filter by city
 * @property {string} [state] - Filter by state
 * @property {string} [managerId] - Filter by manager
 * @property {string} [sortBy] - Sort field (name, code, createdAt)
 * @property {'asc'|'desc'} [sortOrder] - Sort direction
 */

/**
 * @typedef {Object} BranchStats
 * @property {number} totalBranches - Total number of branches
 * @property {number} activeBranches - Number of active branches
 * @property {number} inactiveBranches - Number of inactive branches
 * @property {number} totalStaff - Total staff across all branches
 * @property {number} branchesWithoutManager - Branches without assigned manager
 */

export {};
