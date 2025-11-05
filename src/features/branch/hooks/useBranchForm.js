/**
 * useBranchForm Hook
 *
 * Hook for managing branch form state and validation.
 * Provides form handling utilities for create/edit branch operations.
 */

import { useState, useCallback, useEffect } from 'react';

/**
 * Initial form state
 */
const initialFormState = {
  name: '',
  code: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'USA',
  phone: '',
  email: '',
  managerId: null,
  settings: {
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    taxRate: 0.0875,
    allowWalkins: true,
  },
};

/**
 * Hook for branch form management
 * @param {Object} initialData - Initial form data (for editing)
 * @returns {Object} Form management interface
 */
export const useBranchForm = (initialData = null) => {
  const [formData, setFormData] = useState(
    initialData || initialFormState
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsDirty(false);
    }
  }, [initialData]);

  /**
   * Validate form field
   * @param {string} name - Field name
   * @param {any} value - Field value
   * @returns {string|null} Error message or null
   */
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'name':
        if (!value || !value.trim()) {
          return 'Branch name is required';
        }
        if (value.trim().length < 3) {
          return 'Branch name must be at least 3 characters';
        }
        return null;

      case 'address':
        if (!value || !value.trim()) {
          return 'Address is required';
        }
        return null;

      case 'phone':
        if (!value || !value.trim()) {
          return 'Phone number is required';
        }
        // Basic phone validation
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
          return 'Invalid phone number format';
        }
        return null;

      case 'email':
        if (!value || !value.trim()) {
          return 'Email is required';
        }
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return 'Invalid email format';
        }
        return null;

      case 'city':
        if (!value || !value.trim()) {
          return 'City is required';
        }
        return null;

      case 'state':
        if (!value || !value.trim()) {
          return 'State is required';
        }
        return null;

      case 'zipCode':
        if (!value || !value.trim()) {
          return 'ZIP code is required';
        }
        return null;

      default:
        return null;
    }
  }, []);

  /**
   * Validate entire form
   * @returns {Object} Errors object
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    return newErrors;
  }, [formData, validateField]);

  /**
   * Handle field change
   * @param {string} name - Field name
   * @param {any} value - New value
   */
  const handleChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      setIsDirty(true);

      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors]
  );

  /**
   * Handle nested field change (e.g., settings.timezone)
   * @param {string} parent - Parent field name
   * @param {string} name - Field name
   * @param {any} value - New value
   */
  const handleNestedChange = useCallback((parent, name, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value,
      },
    }));
    setIsDirty(true);
  }, []);

  /**
   * Handle field blur
   * @param {string} name - Field name
   */
  const handleBlur = useCallback(
    (name) => {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      // Validate field on blur
      const error = validateField(name, formData[name]);
      if (error) {
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [formData, validateField]
  );

  /**
   * Handle form submit
   * @param {Function} onSubmit - Submit callback
   * @returns {Function} Submit handler
   */
  const handleSubmit = useCallback(
    (onSubmit) => {
      return async (e) => {
        if (e) {
          e.preventDefault();
        }

        // Validate all fields
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
          setErrors(formErrors);
          // Mark all fields as touched
          const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {});
          setTouched(allTouched);
          return;
        }

        // Call submit callback
        try {
          await onSubmit(formData);
          setIsDirty(false);
        } catch (error) {
          // Error handling is done in the callback
          console.error('Form submit error:', error);
        }
      };
    },
    [formData, validateForm]
  );

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initialData || initialFormState);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialData]);

  /**
   * Set form data programmatically
   * @param {Object} data - Form data
   */
  const setForm = useCallback((data) => {
    setFormData(data);
    setIsDirty(true);
  }, []);

  /**
   * Check if field has error and is touched
   * @param {string} name - Field name
   * @returns {boolean}
   */
  const hasError = useCallback(
    (name) => {
      return touched[name] && !!errors[name];
    },
    [touched, errors]
  );

  /**
   * Get error message for field
   * @param {string} name - Field name
   * @returns {string|null}
   */
  const getError = useCallback(
    (name) => {
      return touched[name] ? errors[name] : null;
    },
    [touched, errors]
  );

  /**
   * Check if form is valid
   * @returns {boolean}
   */
  const isValid = useCallback(() => {
    const formErrors = validateForm();
    return Object.keys(formErrors).length === 0;
  }, [validateForm]);

  return {
    // Form state
    formData,
    errors,
    touched,
    isDirty,

    // Handlers
    handleChange,
    handleNestedChange,
    handleBlur,
    handleSubmit,

    // Utilities
    resetForm,
    setForm,
    hasError,
    getError,
    isValid,
  };
};
