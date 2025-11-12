/**
 * TablesPage - Main page for table management
 */

import { TableStatusBoard } from '../features/restaurant/tables/components/TableStatusBoard';

export const TablesPage = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <TableStatusBoard />
    </div>
  );
};

export default TablesPage;
