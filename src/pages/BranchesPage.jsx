/**
 * BranchesPage Component
 * Page for managing branches
 */

import { BranchList } from '../features/branch';

export const BranchesPage = () => {
  const handleBranchSelect = (branch) => {
    console.log('Selected branch:', branch);
  };

  return <BranchList onBranchSelect={handleBranchSelect} />;
};
