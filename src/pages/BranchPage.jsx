import React from 'react';
import { BranchList } from '@/features/branch';

/**
 * BranchPage Component
 * Page wrapper for branch management
 *
 * Features:
 * - Displays branch list with all management capabilities
 * - Search and filter branches
 * - Create, edit, delete branches
 */
const BranchPage = () => {
  return (
    <div className="w-full">
      <BranchList />
    </div>
  );
};

export default BranchPage;
