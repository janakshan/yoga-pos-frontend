import React from 'react';
import { UserList } from '../features/users/components';

/**
 * StaffPage Component
 * Page wrapper for staff management using unified User system
 *
 * Features:
 * - Displays users with staff profiles
 * - Search and filter staff members
 * - Create, edit, delete staff members
 * - Unified with main user management system
 */
const StaffPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Staff Management
        </h1>
        <p className="text-gray-600">
          Manage employee accounts, roles, and employment details
        </p>
      </div>

      <UserList staffOnly={true} />
    </div>
  );
};

export default StaffPage;
