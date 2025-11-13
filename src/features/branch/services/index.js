/**
 * Branch Services Exports
 */

// Export mock service (for development/testing)
export * from './branchService';

// Export real API service
export * from './branchApiService';

// Default export uses the API service
export { branchApiService as default } from './branchApiService';
