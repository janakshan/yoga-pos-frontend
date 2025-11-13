import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBusinessType } from '../../hooks/useBusinessType';
import { BUSINESS_TYPES } from '../../types/business.types';

/**
 * BusinessTypeRoute Component
 * Protects routes based on business type
 * Redirects to dashboard if business type doesn't match
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.requiredType - Required business type (BUSINESS_TYPES.RESTAURANT or BUSINESS_TYPES.YOGA)
 * @returns {JSX.Element}
 */
export const BusinessTypeRoute = ({ children, requiredType }) => {
  const { businessType } = useBusinessType();

  // If no required type specified, render children
  if (!requiredType) {
    return children;
  }

  // Check if current business type matches required type
  if (businessType !== requiredType) {
    // Redirect to dashboard with a message
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default BusinessTypeRoute;
