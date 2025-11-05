/**
 * useStaffForm Hook
 *
 * Hook for managing staff form state and validation.
 */

import { useState, useCallback, useEffect } from 'react';

const initialFormState = {
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: 'staff',
  branchId: null,
  position: '',
  department: '',
  hireDate: new Date().toISOString().split('T')[0],
  employmentType: 'full_time',
  hourlyRate: 0,
  salary: 0,
  emergencyContactName: '',
  emergencyContactPhone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'USA',
};

export const useStaffForm = (initialData = null) => {
  const [formData, setFormData] = useState(initialData || initialFormState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setIsDirty(false);
    }
  }, [initialData]);

  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return !value?.trim() ? `${name === 'firstName' ? 'First' : 'Last'} name is required` : null;
      case 'email':
        if (!value?.trim()) return 'Email is required';
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : null;
      case 'phone':
        return !value?.trim() ? 'Phone is required' : null;
      default:
        return null;
    }
  }, []);

  const handleChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [formData, validateField]);

  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      if (e) e.preventDefault();
      const formErrors = {};
      Object.keys(formData).forEach((key) => {
        const error = validateField(key, formData[key]);
        if (error) formErrors[key] = error;
      });

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        return;
      }

      try {
        await onSubmit(formData);
        setIsDirty(false);
      } catch (error) {
        console.error('Form submit error:', error);
      }
    };
  }, [formData, validateField]);

  const resetForm = useCallback(() => {
    setFormData(initialData || initialFormState);
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialData]);

  return {
    formData,
    errors,
    touched,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    hasError: (name) => touched[name] && !!errors[name],
    getError: (name) => touched[name] ? errors[name] : null,
  };
};
