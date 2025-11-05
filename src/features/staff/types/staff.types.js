/**
 * Staff Type Definitions
 *
 * Defines the structure of staff entities and related types
 * for the multi-branch POS system.
 */

/**
 * @typedef {Object} Staff
 * @property {string} id - Unique staff identifier
 * @property {string} employeeId - Employee ID/number
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} email - Email address
 * @property {string} phone - Contact phone number
 * @property {StaffRole} role - Staff role
 * @property {string|null} branchId - Assigned branch ID
 * @property {string|null} branchName - Assigned branch name
 * @property {string} position - Job position/title
 * @property {string} department - Department (e.g., 'Instructors', 'Reception', 'Management')
 * @property {Date|string} hireDate - Date of hire
 * @property {Date|string|null} terminationDate - Termination date (if applicable)
 * @property {EmploymentStatus} status - Employment status
 * @property {EmploymentType} employmentType - Employment type
 * @property {StaffSchedule} schedule - Work schedule
 * @property {StaffPermissions} permissions - Access permissions
 * @property {number} hourlyRate - Hourly rate (for hourly employees)
 * @property {number} salary - Annual salary (for salaried employees)
 * @property {string} emergencyContactName - Emergency contact name
 * @property {string} emergencyContactPhone - Emergency contact phone
 * @property {string} address - Physical address
 * @property {string} city - City
 * @property {string} state - State/province
 * @property {string} zipCode - ZIP/postal code
 * @property {string} country - Country
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 * @property {string} createdBy - ID of user who created the record
 */

/**
 * @typedef {'admin'|'manager'|'instructor'|'receptionist'|'staff'} StaffRole
 */

/**
 * @typedef {'active'|'inactive'|'on_leave'|'terminated'} EmploymentStatus
 */

/**
 * @typedef {'full_time'|'part_time'|'contract'|'intern'} EmploymentType
 */

/**
 * @typedef {Object} StaffSchedule
 * @property {DaySchedule} monday - Monday schedule
 * @property {DaySchedule} tuesday - Tuesday schedule
 * @property {DaySchedule} wednesday - Wednesday schedule
 * @property {DaySchedule} thursday - Thursday schedule
 * @property {DaySchedule} friday - Friday schedule
 * @property {DaySchedule} saturday - Saturday schedule
 * @property {DaySchedule} sunday - Sunday schedule
 */

/**
 * @typedef {Object} DaySchedule
 * @property {boolean} working - Whether staff works this day
 * @property {string} startTime - Start time (HH:mm format)
 * @property {string} endTime - End time (HH:mm format)
 */

/**
 * @typedef {Object} StaffPermissions
 * @property {boolean} canAccessPOS - Access POS system
 * @property {boolean} canManageInventory - Manage inventory
 * @property {boolean} canManageCustomers - Manage customers
 * @property {boolean} canManageBookings - Manage bookings
 * @property {boolean} canViewReports - View reports
 * @property {boolean} canManageStaff - Manage staff
 * @property {boolean} canManageSettings - Manage settings
 * @property {boolean} canProcessRefunds - Process refunds
 * @property {boolean} canApplyDiscounts - Apply discounts
 */

/**
 * @typedef {Object} CreateStaffInput
 * @property {string} employeeId - Employee ID/number
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} email - Email address
 * @property {string} phone - Contact phone
 * @property {StaffRole} role - Staff role
 * @property {string|null} [branchId] - Assigned branch ID
 * @property {string} position - Job position
 * @property {string} department - Department
 * @property {Date|string} hireDate - Hire date
 * @property {EmploymentType} employmentType - Employment type
 * @property {number} [hourlyRate] - Hourly rate (for hourly)
 * @property {number} [salary] - Annual salary (for salaried)
 * @property {string} [emergencyContactName] - Emergency contact
 * @property {string} [emergencyContactPhone] - Emergency phone
 * @property {string} [address] - Address
 * @property {string} [city] - City
 * @property {string} [state] - State
 * @property {string} [zipCode] - ZIP code
 * @property {string} [country] - Country
 */

/**
 * @typedef {Object} UpdateStaffInput
 * @property {string} [firstName] - First name
 * @property {string} [lastName] - Last name
 * @property {string} [email] - Email address
 * @property {string} [phone] - Contact phone
 * @property {StaffRole} [role] - Staff role
 * @property {string|null} [branchId] - Assigned branch ID
 * @property {string} [position] - Job position
 * @property {string} [department] - Department
 * @property {EmploymentStatus} [status] - Employment status
 * @property {EmploymentType} [employmentType] - Employment type
 * @property {StaffSchedule} [schedule] - Work schedule
 * @property {StaffPermissions} [permissions] - Permissions
 * @property {number} [hourlyRate] - Hourly rate
 * @property {number} [salary] - Annual salary
 * @property {string} [emergencyContactName] - Emergency contact
 * @property {string} [emergencyContactPhone] - Emergency phone
 * @property {string} [address] - Address
 * @property {string} [city] - City
 * @property {string} [state] - State
 * @property {string} [zipCode] - ZIP code
 * @property {Date|string|null} [terminationDate] - Termination date
 */

/**
 * @typedef {Object} StaffFilters
 * @property {string} [search] - Search term
 * @property {EmploymentStatus} [status] - Filter by status
 * @property {StaffRole} [role] - Filter by role
 * @property {string} [branchId] - Filter by branch
 * @property {string} [department] - Filter by department
 * @property {EmploymentType} [employmentType] - Filter by employment type
 * @property {string} [sortBy] - Sort field
 * @property {'asc'|'desc'} [sortOrder] - Sort direction
 */

/**
 * @typedef {Object} StaffStats
 * @property {number} totalStaff - Total staff count
 * @property {number} activeStaff - Active staff count
 * @property {number} inactiveStaff - Inactive staff count
 * @property {number} onLeave - Staff on leave
 * @property {number} fullTime - Full-time staff
 * @property {number} partTime - Part-time staff
 * @property {Object} byRole - Staff count by role
 * @property {Object} byBranch - Staff count by branch
 * @property {Object} byDepartment - Staff count by department
 */

export {};
