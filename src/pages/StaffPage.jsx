import React from 'react';
import { StaffList } from '@/features/staff';

/**
 * StaffPage Component
 * Page wrapper for staff management
 *
 * Features:
 * - Displays staff list with all management capabilities
 * - Search and filter staff members
 * - Create, edit, delete staff members
 */
const StaffPage = () => {
  return (
    <div className="w-full">
      <StaffList />
    </div>
  );
};

export default StaffPage;
