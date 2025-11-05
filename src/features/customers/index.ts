/**
 * Customers Feature Module
 *
 * Manages customer/member information, memberships, and customer relationships
 *
 * Public API:
 * - Components: CustomerList, CustomerForm
 * - Hooks: useCustomers, useCustomerForm
 * - Services: customerService
 * - Store: createCustomerSlice, customerSelectors
 * - Types: Customer types and constants
 */

// Export components
export { CustomerList, CustomerForm } from './components/index.js';

// Export hooks
export { useCustomers, useCustomerForm } from './hooks/index.js';

// Export services
export { customerService } from './services/index.js';

// Export store
export { createCustomerSlice } from './store/index.js';
export * from './store/customerSelectors.js';

// Export types
export * from './types/index.js';
