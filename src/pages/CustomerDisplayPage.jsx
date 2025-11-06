import React from 'react';
import { CustomerDisplay } from '../features/pos/components/CustomerDisplay';

/**
 * CustomerDisplayPage
 * Standalone page for customer-facing display
 * Meant to be opened in a separate window/monitor
 * @returns {JSX.Element}
 */
export const CustomerDisplayPage = () => {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <CustomerDisplay />
    </div>
  );
};

export default CustomerDisplayPage;
