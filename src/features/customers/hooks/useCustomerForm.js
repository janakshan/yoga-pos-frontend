import { useState, useCallback, useMemo } from 'react';
import {
  CUSTOMER_TYPES,
  CUSTOMER_STATUS,
  GENDER,
  LOYALTY_TIERS,
} from '../types/customer.types.js';

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: GENDER.PREFER_NOT_TO_SAY,
  address: {
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  },
  customerType: CUSTOMER_TYPES.REGULAR,
  status: CUSTOMER_STATUS.ACTIVE,
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    interests: [],
  },
  notes: '',
  tags: [],
};

/**
 * Custom hook for customer form management with validation
 * @param {Object} initialData - Initial form data (for edit mode)
 * @returns {Object} Form state and handlers
 */
export const useCustomerForm = (initialData = null) => {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialFormState,
        ...initialData,
        address: {
          ...initialFormState.address,
          ...(initialData.address || {}),
        },
        preferences: {
          ...initialFormState.preferences,
          ...(initialData.preferences || {}),
        },
      };
    }
    return { ...initialFormState };
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'firstName':
        if (!value?.trim()) return 'First name is required';
        if (value.trim().length < 2) return 'First name must be at least 2 characters';
        if (value.trim().length > 50) return 'First name must not exceed 50 characters';
        return null;

      case 'lastName':
        if (!value?.trim()) return 'Last name is required';
        if (value.trim().length < 2) return 'Last name must be at least 2 characters';
        if (value.trim().length > 50) return 'Last name must not exceed 50 characters';
        return null;

      case 'email':
        if (!value?.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        return null;

      case 'phone':
        if (!value?.trim()) return 'Phone number is required';
        const phoneRegex = /^[\d\s\-+()]+$/;
        if (!phoneRegex.test(value)) return 'Invalid phone number format';
        if (value.replace(/\D/g, '').length < 10) {
          return 'Phone number must be at least 10 digits';
        }
        return null;

      case 'dateOfBirth':
        if (value) {
          const date = new Date(value);
          const today = new Date();
          const minDate = new Date(1900, 0, 1);

          if (date > today) return 'Date of birth cannot be in the future';
          if (date < minDate) return 'Invalid date of birth';

          const age = today.getFullYear() - date.getFullYear();
          if (age < 13) return 'Customer must be at least 13 years old';
        }
        return null;

      case 'address.street':
        if (value && value.length > 100) return 'Street address must not exceed 100 characters';
        return null;

      case 'address.city':
        if (value && value.length > 50) return 'City must not exceed 50 characters';
        return null;

      case 'address.state':
        if (value && value.length > 50) return 'State must not exceed 50 characters';
        return null;

      case 'address.postalCode':
        if (value && !/^[\w\s\-]+$/.test(value)) return 'Invalid postal code format';
        return null;

      case 'address.country':
        if (value && value.length > 50) return 'Country must not exceed 50 characters';
        return null;

      case 'notes':
        if (value && value.length > 500) return 'Notes must not exceed 500 characters';
        return null;

      default:
        return null;
    }
  }, []);

  /**
   * Validate all fields
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    // Validate optional fields if they have values
    const optionalFields = [
      'dateOfBirth',
      'address.street',
      'address.city',
      'address.state',
      'address.postalCode',
      'address.country',
      'notes',
    ];

    optionalFields.forEach((field) => {
      const [parent, child] = field.split('.');
      const value = child ? formData[parent]?.[child] : formData[field];

      if (value) {
        const error = validateField(field, value);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  /**
   * Handle field change
   */
  const handleChange = useCallback(
    (name, value) => {
      setIsDirty(true);

      // Handle nested fields (e.g., address.street)
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      } else if (name.startsWith('preferences.')) {
        const key = name.split('.')[1];
        setFormData((prev) => ({
          ...prev,
          preferences: {
            ...prev.preferences,
            [key]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }

      // Clear error for this field
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    },
    []
  );

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(
    (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Validate field on blur
      const [parent, child] = name.split('.');
      const value = child ? formData[parent]?.[child] : formData[name];
      const error = validateField(name, value);

      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [formData, validateField]
  );

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      e.preventDefault();

      // Mark all fields as touched
      const allFields = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'dateOfBirth',
        'address.street',
        'address.city',
        'address.state',
        'address.postalCode',
        'address.country',
        'notes',
      ];
      const touchedState = {};
      allFields.forEach((field) => {
        touchedState[field] = true;
      });
      setTouched(touchedState);

      // Validate form
      const isValid = validateForm();

      if (!isValid) {
        return;
      }

      // Submit form
      await onSubmit(formData);
    },
    [formData, validateForm]
  );

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData({ ...initialFormState });
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, []);

  /**
   * Add interest
   */
  const addInterest = useCallback((interest) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        interests: [...prev.preferences.interests, interest],
      },
    }));
    setIsDirty(true);
  }, []);

  /**
   * Remove interest
   */
  const removeInterest = useCallback((interest) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        interests: prev.preferences.interests.filter((i) => i !== interest),
      },
    }));
    setIsDirty(true);
  }, []);

  /**
   * Add tag
   */
  const addTag = useCallback((tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setIsDirty(true);
    }
  }, [formData.tags]);

  /**
   * Remove tag
   */
  const removeTag = useCallback((tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
    setIsDirty(true);
  }, []);

  /**
   * Check if field has error
   */
  const hasError = useCallback(
    (name) => {
      return touched[name] && !!errors[name];
    },
    [touched, errors]
  );

  /**
   * Get error message for field
   */
  const getError = useCallback(
    (name) => {
      return errors[name] || '';
    },
    [errors]
  );

  /**
   * Check if form is valid
   */
  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && formData.firstName && formData.lastName && formData.email && formData.phone;
  }, [errors, formData]);

  return {
    formData,
    errors,
    touched,
    isDirty,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    addInterest,
    removeInterest,
    addTag,
    removeTag,
    hasError,
    getError,
    validateForm,
  };
};
