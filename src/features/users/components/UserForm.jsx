import { useState, useEffect } from 'react';
import { X, Briefcase } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { useRoles } from '../../roles/hooks/useRoles';
import { UserStatus, EmploymentType, EmploymentStatus, CompensationType } from '../types/user.types';

const UserForm = ({ user, mode, onClose }) => {
  const { createUser, updateUserById, isLoading } = useUsers();
  const { roles, fetchRoles } = useRoles();

  const [isStaff, setIsStaff] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    roles: [],
    status: UserStatus.ACTIVE,
    staffProfile: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    if (user && mode === 'edit') {
      const hasStaffProfile = user.staffProfile != null;
      setIsStaff(hasStaffProfile);

      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '', // Don't pre-fill password
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        roles: user.roles || [],
        status: user.status || UserStatus.ACTIVE,
        staffProfile: hasStaffProfile ? user.staffProfile : null,
      });
    }
  }, [user, mode]);

  const handleStaffToggle = (checked) => {
    setIsStaff(checked);
    if (checked && !formData.staffProfile) {
      // Initialize staff profile with defaults
      setFormData(prev => ({
        ...prev,
        staffProfile: {
          employeeId: '',
          position: '',
          department: '',
          employmentType: EmploymentType.FULL_TIME,
          hireDate: new Date().toISOString().split('T')[0],
          employmentStatus: EmploymentStatus.EMPLOYED,
          compensationType: CompensationType.SALARY,
          salary: 0,
          hourlyRate: 0,
          schedule: {
            monday: { working: false, startTime: '09:00', endTime: '17:00' },
            tuesday: { working: false, startTime: '09:00', endTime: '17:00' },
            wednesday: { working: false, startTime: '09:00', endTime: '17:00' },
            thursday: { working: false, startTime: '09:00', endTime: '17:00' },
            friday: { working: false, startTime: '09:00', endTime: '17:00' },
            saturday: { working: false, startTime: '09:00', endTime: '17:00' },
            sunday: { working: false, startTime: '09:00', endTime: '17:00' },
          },
          emergencyContact: {
            name: '',
            phone: '',
            relationship: '',
          },
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA',
          },
        },
      }));
    } else if (!checked) {
      // Remove staff profile
      setFormData(prev => ({ ...prev, staffProfile: null }));
    }
  };

  const handleStaffFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      staffProfile: {
        ...prev.staffProfile,
        [field]: value,
      },
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleRoleToggle = (roleId) => {
    setFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter((id) => id !== roleId)
        : [...prev.roles, roleId],
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (mode === 'create' && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (formData.roles.length === 0) {
      newErrors.roles = 'At least one role must be assigned';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      if (mode === 'edit') {
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password; // Don't update password if not provided
        }
        delete updateData.username; // Username can't be changed
        await updateUserById(user.id, updateData);
      } else {
        await createUser(formData);
      }
      onClose(true);
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {mode === 'edit' ? 'Edit User' : 'Create New User'}
        </h2>
        <button onClick={() => onClose(false)} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={mode === 'edit'}
              className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>

        {mode === 'create' && (
          <div>
            <label className="block text-sm font-medium mb-2">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Last Name *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Roles *</label>
          <div className="grid grid-cols-2 gap-2 p-3 border rounded-lg">
            {roles.filter((r) => r.isActive).map((role) => (
              <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.roles.includes(role.id)}
                  onChange={() => handleRoleToggle(role.id)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm">{role.name}</span>
              </label>
            ))}
          </div>
          {errors.roles && <p className="mt-1 text-sm text-red-600">{errors.roles}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            <option value={UserStatus.ACTIVE}>Active</option>
            <option value={UserStatus.INACTIVE}>Inactive</option>
            <option value={UserStatus.SUSPENDED}>Suspended</option>
            <option value={UserStatus.PENDING}>Pending</option>
          </select>
        </div>

        {/* Staff Profile Section */}
        <div className="border-t pt-4">
          <label className="flex items-center gap-2 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={isStaff}
              onChange={(e) => handleStaffToggle(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <Briefcase className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium">This user is an employee (add staff profile)</span>
          </label>

          {isStaff && formData.staffProfile && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white">Employment Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Employee ID</label>
                  <input
                    type="text"
                    value={formData.staffProfile.employeeId || ''}
                    onChange={(e) => handleStaffFieldChange('employeeId', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Auto-generated if empty"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <input
                    type="text"
                    value={formData.staffProfile.position || ''}
                    onChange={(e) => handleStaffFieldChange('position', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Department</label>
                  <input
                    type="text"
                    value={formData.staffProfile.department || ''}
                    onChange={(e) => handleStaffFieldChange('department', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Employment Type</label>
                  <select
                    value={formData.staffProfile.employmentType || EmploymentType.FULL_TIME}
                    onChange={(e) => handleStaffFieldChange('employmentType', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value={EmploymentType.FULL_TIME}>Full Time</option>
                    <option value={EmploymentType.PART_TIME}>Part Time</option>
                    <option value={EmploymentType.CONTRACT}>Contract</option>
                    <option value={EmploymentType.INTERN}>Intern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Hire Date</label>
                  <input
                    type="date"
                    value={formData.staffProfile.hireDate || ''}
                    onChange={(e) => handleStaffFieldChange('hireDate', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Employment Status</label>
                  <select
                    value={formData.staffProfile.employmentStatus || EmploymentStatus.EMPLOYED}
                    onChange={(e) => handleStaffFieldChange('employmentStatus', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value={EmploymentStatus.EMPLOYED}>Employed</option>
                    <option value={EmploymentStatus.ON_LEAVE}>On Leave</option>
                    <option value={EmploymentStatus.TERMINATED}>Terminated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Compensation Type</label>
                  <select
                    value={formData.staffProfile.compensationType || CompensationType.SALARY}
                    onChange={(e) => handleStaffFieldChange('compensationType', e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value={CompensationType.SALARY}>Salary</option>
                    <option value={CompensationType.HOURLY}>Hourly</option>
                  </select>
                </div>

                {formData.staffProfile.compensationType === CompensationType.SALARY && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Annual Salary ($)</label>
                    <input
                      type="number"
                      value={formData.staffProfile.salary || 0}
                      onChange={(e) => handleStaffFieldChange('salary', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="0"
                      step="1000"
                    />
                  </div>
                )}

                {formData.staffProfile.compensationType === CompensationType.HOURLY && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Hourly Rate ($)</label>
                    <input
                      type="number"
                      value={formData.staffProfile.hourlyRate || 0}
                      onChange={(e) => handleStaffFieldChange('hourlyRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-2 border rounded-lg"
                      min="0"
                      step="0.5"
                    />
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-500 italic">
                Note: Schedule, emergency contact, and address can be updated after user creation.
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg"
          >
            {isLoading ? 'Saving...' : mode === 'edit' ? 'Update User' : 'Create User'}
          </button>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
