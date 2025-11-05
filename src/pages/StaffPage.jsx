/**
 * StaffPage Component
 * Page for managing staff members
 */

import { StaffList } from '../features/staff';

export const StaffPage = () => {
  const handleStaffSelect = (staff) => {
    console.log('Selected staff:', staff);
  };

  return <StaffList onStaffSelect={handleStaffSelect} />;
};
