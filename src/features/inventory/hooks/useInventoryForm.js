import { useState, useCallback, useEffect } from 'react';
import { TRANSACTION_TYPES } from '../types/inventory.types.js';

/**
 * Custom hook for inventory transaction form handling
 * @param {Object} initialData - Initial form data (for edit mode)
 * @returns {Object} Form state and handlers
 */
export const useInventoryForm = (initialData = null) => {
  const isEditMode = !!initialData;

  const getInitialFormData = () => {
    if (initialData) {
      return {
        productId: initialData.productId || '',
        type: initialData.type || TRANSACTION_TYPES.PURCHASE,
        quantity: Math.abs(initialData.quantity) || 0,
        unitCost: initialData.unitCost || 0,
        batchNumber: initialData.batchNumber || '',
        expiryDate: initialData.expiryDate || '',
        locationId: initialData.locationId || '',
        referenceType: initialData.referenceType || '',
        referenceId: initialData.referenceId || '',
        referenceNumber: initialData.referenceNumber || '',
        notes: initialData.notes || '',
        transactionDate: initialData.transactionDate
          ? new Date(initialData.transactionDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      };
    }

    return {
      productId: '',
      type: TRANSACTION_TYPES.PURCHASE,
      quantity: 0,
      unitCost: 0,
      batchNumber: '',
      expiryDate: '',
      locationId: '',
      referenceType: '',
      referenceId: '',
      referenceNumber: '',
      notes: '',
      transactionDate: new Date().toISOString().split('T')[0]
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(getInitialFormData());
    }
  }, [initialData]);

  /**
   * Validate a single field
   * @param {string} name - Field name
   * @param {any} value - Field value
   * @returns {string|null} Error message or null
   */
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'productId':
        if (!value || value.trim() === '') {
          return 'Product is required';
        }
        break;

      case 'type':
        if (!value || !Object.values(TRANSACTION_TYPES).includes(value)) {
          return 'Valid transaction type is required';
        }
        break;

      case 'quantity':
        if (value === undefined || value === null || value === '') {
          return 'Quantity is required';
        }
        const quantityNum = parseFloat(value);
        if (isNaN(quantityNum) || quantityNum === 0) {
          return 'Quantity must be a non-zero number';
        }
        if (quantityNum < 0) {
          return 'Quantity must be positive';
        }
        break;

      case 'unitCost':
        if (value === undefined || value === null || value === '') {
          return 'Unit cost is required';
        }
        const costNum = parseFloat(value);
        if (isNaN(costNum) || costNum < 0) {
          return 'Unit cost must be a positive number';
        }
        break;

      case 'expiryDate':
        if (value && value.trim() !== '') {
          const expiryDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (expiryDate < today) {
            return 'Expiry date cannot be in the past';
          }
        }
        break;

      case 'transactionDate':
        if (!value || value.trim() === '') {
          return 'Transaction date is required';
        }
        const transactionDate = new Date(value);
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);
        if (transactionDate > futureDate) {
          return 'Transaction date cannot be in the future';
        }
        break;

      default:
        break;
    }

    return null;
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
   * @param {Event|Object} e - Event or custom object with name and value
   */
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target || e;

      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));

      setIsDirty(true);

      // Clear error for this field if it was touched
      if (touched[name]) {
        const error = validateField(name, value);
        setErrors((prev) => ({
          ...prev,
          [name]: error
        }));
      }
    },
    [touched, validateField]
  );

  /**
   * Handle field blur (mark as touched)
   * @param {Event|string} e - Event or field name
   */
  const handleBlur = useCallback(
    (e) => {
      const name = typeof e === 'string' ? e : e.target.name;

      setTouched((prev) => ({
        ...prev,
        [name]: true
      }));

      // Validate field on blur
      const error = validateField(name, formData[name]);
      setErrors((prev) => ({
        ...prev,
        [name]: error
      }));
    },
    [formData, validateField]
  );

  /**
   * Handle form submission
   * @param {Function} onSubmit - Submit callback
   * @returns {Function} Submit handler
   */
  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }

      // Mark all fields as touched
      const allTouched = Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);

      // Validate form
      const newErrors = validateForm();
      setErrors(newErrors);

      // If there are errors, don't submit
      if (Object.keys(newErrors).length > 0) {
        return;
      }

      // Convert string values to appropriate types
      const submitData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        unitCost: parseFloat(formData.unitCost),
        // Remove empty strings
        batchNumber: formData.batchNumber || undefined,
        expiryDate: formData.expiryDate || undefined,
        locationId: formData.locationId || undefined,
        referenceType: formData.referenceType || undefined,
        referenceId: formData.referenceId || undefined,
        referenceNumber: formData.referenceNumber || undefined
      };

      try {
        await onSubmit(submitData);
        // Reset form state on successful submission
        if (!isEditMode) {
          setFormData(getInitialFormData());
          setErrors({});
          setTouched({});
          setIsDirty(false);
        }
      } catch (error) {
        // Error handling is done in the onSubmit callback
        console.error('Form submission error:', error);
      }
    },
    [formData, validateForm, isEditMode]
  );

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialData]);

  /**
   * Set a specific field value
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const setFieldValue = useCallback((name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setIsDirty(true);
  }, []);

  /**
   * Set a specific field error
   * @param {string} name - Field name
   * @param {string} error - Error message
   */
  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  }, []);

  /**
   * Check if a field has an error
   * @param {string} name - Field name
   * @returns {boolean} Has error
   */
  const hasError = useCallback(
    (name) => {
      return touched[name] && !!errors[name];
    },
    [touched, errors]
  );

  /**
   * Get error for a field
   * @param {string} name - Field name
   * @returns {string|null} Error message
   */
  const getError = useCallback(
    (name) => {
      return touched[name] ? errors[name] : null;
    },
    [touched, errors]
  );

  /**
   * Calculate total cost based on quantity and unit cost
   * @returns {number} Total cost
   */
  const calculateTotalCost = useCallback(() => {
    const quantity = parseFloat(formData.quantity) || 0;
    const unitCost = parseFloat(formData.unitCost) || 0;
    return quantity * unitCost;
  }, [formData.quantity, formData.unitCost]);

  return {
    formData,
    errors,
    touched,
    isDirty,
    isEditMode,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    hasError,
    getError,
    calculateTotalCost
  };
};

export default useInventoryForm;
