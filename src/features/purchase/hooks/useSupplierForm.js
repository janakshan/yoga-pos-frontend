/**
 * useSupplierForm Hook
 * Form management for supplier create/edit operations
 */

import { useState, useCallback, useEffect } from 'react';
import { DEFAULT_SUPPLIER } from '../types/supplier.types.js';

export const useSupplierForm = (initialData = null) => {
  const [formData, setFormData] = useState(
    initialData || { ...DEFAULT_SUPPLIER }
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsDirty(false);
      setErrors({});
      setTouched({});
    }
  }, [initialData]);

  /**
   * Validate individual field
   */
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'code':
        if (!value?.trim()) return 'Supplier code is required';
        if (value.length < 3) return 'Code must be at least 3 characters';
        return null;

      case 'name':
        if (!value?.trim()) return 'Supplier name is required';
        if (value.length < 3) return 'Name must be at least 3 characters';
        return null;

      case 'phone':
        if (!value?.trim()) return 'Phone number is required';
        if (value.length < 10) return 'Please enter a valid phone number';
        return null;

      case 'email':
        if (value && value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return 'Invalid email format';
        }
        return null;

      case 'contact.name':
        if (!value?.trim()) return 'Contact name is required';
        return null;

      case 'contact.email':
        if (value && value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) return 'Invalid email format';
        }
        return null;

      case 'address.street':
        if (!value?.trim()) return 'Street address is required';
        return null;

      case 'address.city':
        if (!value?.trim()) return 'City is required';
        return null;

      case 'address.postalCode':
        if (!value?.trim()) return 'Postal code is required';
        return null;

      case 'paymentTerms.creditDays':
        if (value === '' || value === null || value === undefined)
          return 'Credit days is required';
        if (value < 0) return 'Credit days cannot be negative';
        return null;

      case 'paymentTerms.creditLimit':
        if (value < 0) return 'Credit limit cannot be negative';
        return null;

      default:
        return null;
    }
  }, []);

  /**
   * Validate entire form
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required fields
    const codeError = validateField('code', formData.code);
    if (codeError) newErrors.code = codeError;

    const nameError = validateField('name', formData.name);
    if (nameError) newErrors.name = nameError;

    const phoneError = validateField('phone', formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const emailError = validateField('email', formData.email);
    if (emailError) newErrors.email = emailError;

    // Contact information
    const contactNameError = validateField(
      'contact.name',
      formData.contact.name
    );
    if (contactNameError) newErrors['contact.name'] = contactNameError;

    const contactEmailError = validateField(
      'contact.email',
      formData.contact.email
    );
    if (contactEmailError) newErrors['contact.email'] = contactEmailError;

    // Address
    const streetError = validateField('address.street', formData.address.street);
    if (streetError) newErrors['address.street'] = streetError;

    const cityError = validateField('address.city', formData.address.city);
    if (cityError) newErrors['address.city'] = cityError;

    const postalCodeError = validateField(
      'address.postalCode',
      formData.address.postalCode
    );
    if (postalCodeError) newErrors['address.postalCode'] = postalCodeError;

    // Payment terms
    const creditDaysError = validateField(
      'paymentTerms.creditDays',
      formData.paymentTerms.creditDays
    );
    if (creditDaysError) newErrors['paymentTerms.creditDays'] = creditDaysError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  /**
   * Handle field change
   */
  const handleChange = useCallback((name, value) => {
    setIsDirty(true);

    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback(
    (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      // Get value for validation
      let value;
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        value = formData[parent]?.[child];
      } else {
        value = formData[name];
      }

      const error = validateField(name, value);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [formData, validateField]
  );

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      e?.preventDefault();

      // Mark all fields as touched
      const allFields = [
        'code',
        'name',
        'phone',
        'email',
        'contact.name',
        'contact.email',
        'address.street',
        'address.city',
        'address.postalCode',
        'paymentTerms.creditDays'
      ];
      const touchedFields = {};
      allFields.forEach((field) => (touchedFields[field] = true));
      setTouched(touchedFields);

      // Validate form
      if (!validateForm()) {
        return;
      }

      // Submit
      await onSubmit(formData);
    },
    [formData, validateForm]
  );

  /**
   * Reset form
   */
  const resetForm = useCallback(() => {
    setFormData(initialData || { ...DEFAULT_SUPPLIER });
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialData]);

  /**
   * Check if field has error
   */
  const hasError = useCallback(
    (name) => {
      return touched[name] && errors[name];
    },
    [touched, errors]
  );

  /**
   * Get field error message
   */
  const getError = useCallback(
    (name) => {
      return errors[name];
    },
    [errors]
  );

  /**
   * Check if form is valid
   */
  const isValid = Object.keys(errors).length === 0;

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
    hasError,
    getError,
    validateForm,
    setFormData
  };
};
