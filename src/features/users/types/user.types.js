/**
 * @fileoverview User type definitions
 */

/**
 * User status
 * @readonly
 * @enum {string}
 */
export const UserStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  PENDING: 'pending',
};

/**
 * @typedef {Object} User
 * @property {string} id - Unique identifier
 * @property {string} username - Unique username
 * @property {string} email - User email address
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} fullName - Full name (computed)
 * @property {string} phone - Phone number
 * @property {string} avatar - Avatar URL
 * @property {string[]} roles - Array of role IDs assigned to user
 * @property {string[]} permissions - Computed array of all permissions (from roles)
 * @property {UserStatus} status - Account status
 * @property {string} [branchId] - Associated branch ID (optional)
 * @property {string} [branchName] - Associated branch name
 * @property {Date|string} [lastLogin] - Last login timestamp
 * @property {Date|string} [passwordChangedAt] - Last password change
 * @property {boolean} [mustChangePassword] - Require password change on next login
 * @property {Object} [preferences] - User preferences (theme, language, etc.)
 * @property {StaffProfile} [staffProfile] - Optional staff/employee profile (for employees only)
 * @property {Date|string} createdAt - Creation timestamp
 * @property {Date|string} updatedAt - Last update timestamp
 * @property {string} createdBy - User ID who created this account
 */

/**
 * @typedef {Object} CreateUserInput
 * @property {string} username - Unique username
 * @property {string} email - User email address
 * @property {string} password - User password
 * @property {string} firstName - First name
 * @property {string} lastName - Last name
 * @property {string} [phone] - Phone number
 * @property {string[]} roles - Array of role IDs to assign
 * @property {UserStatus} [status=active] - Initial account status
 * @property {string} [branchId] - Associated branch ID
 * @property {boolean} [mustChangePassword=true] - Require password change on first login
 * @property {StaffProfile} [staffProfile] - Optional staff profile (for employees)
 */

/**
 * @typedef {Object} UpdateUserInput
 * @property {string} [email] - User email address
 * @property {string} [firstName] - First name
 * @property {string} [lastName] - Last name
 * @property {string} [phone] - Phone number
 * @property {string} [avatar] - Avatar URL
 * @property {string[]} [roles] - Array of role IDs
 * @property {UserStatus} [status] - Account status
 * @property {string} [branchId] - Associated branch ID
 * @property {StaffProfile} [staffProfile] - Optional staff profile (for employees)
 */

/**
 * @typedef {Object} ChangePasswordInput
 * @property {string} currentPassword - Current password (for verification)
 * @property {string} newPassword - New password
 * @property {string} confirmPassword - Password confirmation
 */

/**
 * @typedef {Object} ResetPasswordInput
 * @property {string} newPassword - New password
 * @property {boolean} [mustChangePassword=false] - Require password change on next login
 */

/**
 * @typedef {Object} UserFilters
 * @property {string} [search] - Search term (username, email, name)
 * @property {UserStatus} [status] - Filter by status
 * @property {string} [roleId] - Filter by role ID
 * @property {string} [branchId] - Filter by branch ID
 * @property {string} [sortBy] - Sort field (username, email, createdAt, lastLogin)
 * @property {string} [sortOrder] - Sort order (asc, desc)
 */

/**
 * @typedef {Object} UserStats
 * @property {number} total - Total users
 * @property {number} active - Active users
 * @property {number} inactive - Inactive users
 * @property {number} suspended - Suspended users
 * @property {number} pending - Pending users
 * @property {number} loggedInToday - Users logged in today
 */

/**
 * @typedef {Object} UserActivity
 * @property {string} id - Activity ID
 * @property {string} userId - User ID
 * @property {string} action - Action performed
 * @property {string} resource - Resource affected
 * @property {string} [details] - Additional details
 * @property {string} [ipAddress] - IP address
 * @property {string} [userAgent] - User agent string
 * @property {Date|string} timestamp - When action occurred
 */

/**
 * Employment type
 * @readonly
 * @enum {string}
 */
export const EmploymentType = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERN: 'intern',
};

/**
 * Employment status
 * @readonly
 * @enum {string}
 */
export const EmploymentStatus = {
  EMPLOYED: 'employed',
  ON_LEAVE: 'on_leave',
  TERMINATED: 'terminated',
};

/**
 * Compensation type
 * @readonly
 * @enum {string}
 */
export const CompensationType = {
  SALARY: 'salary',
  HOURLY: 'hourly',
};

/**
 * @typedef {Object} DaySchedule
 * @property {boolean} working - Whether staff works this day
 * @property {string} [startTime] - Start time (HH:mm format)
 * @property {string} [endTime] - End time (HH:mm format)
 */

/**
 * @typedef {Object} WeekSchedule
 * @property {DaySchedule} monday - Monday schedule
 * @property {DaySchedule} tuesday - Tuesday schedule
 * @property {DaySchedule} wednesday - Wednesday schedule
 * @property {DaySchedule} thursday - Thursday schedule
 * @property {DaySchedule} friday - Friday schedule
 * @property {DaySchedule} saturday - Saturday schedule
 * @property {DaySchedule} sunday - Sunday schedule
 */

/**
 * @typedef {Object} EmergencyContact
 * @property {string} name - Contact name
 * @property {string} phone - Contact phone
 * @property {string} [relationship] - Relationship to employee
 */

/**
 * @typedef {Object} Address
 * @property {string} street - Street address
 * @property {string} city - City
 * @property {string} state - State/province
 * @property {string} zipCode - ZIP/postal code
 * @property {string} country - Country
 */

/**
 * @typedef {Object} StaffProfile
 * @property {string} employeeId - Unique employee ID/number
 * @property {string} position - Job position/title
 * @property {string} department - Department (e.g., 'Instructors', 'Reception', 'Management')
 * @property {EmploymentType} employmentType - Employment type
 * @property {Date|string} hireDate - Date of hire
 * @property {Date|string} [terminationDate] - Termination date (if applicable)
 * @property {EmploymentStatus} employmentStatus - Employment status
 * @property {CompensationType} compensationType - Compensation type (salary or hourly)
 * @property {number} [salary] - Annual salary (for salaried employees)
 * @property {number} [hourlyRate] - Hourly rate (for hourly employees)
 * @property {WeekSchedule} [schedule] - Work schedule
 * @property {EmergencyContact} [emergencyContact] - Emergency contact information
 * @property {Address} [address] - Physical address
 * @property {ServerProfile} [serverProfile] - Server-specific profile (for servers only)
 */

/**
 * Server-specific profile for staff who work as servers
 * @typedef {Object} ServerProfile
 * @property {boolean} isServer - Whether this staff member is a server
 * @property {string} [serverId] - Server-specific ID
 * @property {string} [currentShiftId] - Current active shift ID
 * @property {boolean} isOnShift - Whether server is currently on shift
 * @property {string[]} assignedSections - Currently assigned section IDs
 * @property {string[]} assignedTables - Currently assigned table IDs
 * @property {number} maxTables - Maximum tables this server can handle
 * @property {number} experienceLevel - Experience level (1-5 scale)
 * @property {string[]} certifications - Server certifications (e.g., 'Alcohol Service', 'Food Safety')
 * @property {ServerPerformanceMetrics} performanceMetrics - Lifetime performance metrics
 * @property {ServerPreferences} preferences - Server preferences
 * @property {Date|string} [lastShiftDate] - Last shift worked date
 * @property {number} totalShifts - Total shifts worked
 * @property {number} totalHours - Total hours worked
 */

/**
 * Server performance metrics
 * @typedef {Object} ServerPerformanceMetrics
 * @property {number} lifetimeSales - Lifetime total sales
 * @property {number} lifetimeTips - Lifetime total tips
 * @property {number} averageTipPercentage - Average tip percentage
 * @property {number} averageOrderValue - Average order value
 * @property {number} totalOrders - Total orders handled
 * @property {number} totalTables - Total tables served
 * @property {number} totalGuests - Total guests served
 * @property {number} averageServiceTime - Average service time in minutes
 * @property {number} customerRating - Average customer rating (1-5)
 * @property {number} orderAccuracy - Order accuracy percentage
 * @property {number} upsellSuccess - Upsell success rate percentage
 * @property {Date|string} lastUpdated - Last metrics update
 */

/**
 * Server preferences
 * @typedef {Object} ServerPreferences
 * @property {string[]} preferredSections - Preferred section IDs
 * @property {string[]} preferredShiftTimes - Preferred shift times (e.g., 'morning', 'evening')
 * @property {number} preferredMaxTables - Preferred maximum tables
 * @property {boolean} availableForExtraShifts - Available for extra shifts
 * @property {Object} availability - Weekly availability
 */
