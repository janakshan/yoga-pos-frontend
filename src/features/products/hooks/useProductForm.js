import { useState, useCallback } from 'react';
import { PRODUCT_STATUSES, UNIT_TYPES } from '../types/product.types.js';

const initialFormState = {
  sku: '',
  name: '',
  description: '',
  category: '',
  price: '',
  cost: '',
  stockQuantity: '0',
  lowStockThreshold: '10',
  unit: UNIT_TYPES.PIECE,
  barcode: '',
  imageUrl: '',
  status: PRODUCT_STATUSES.ACTIVE,
  tags: [],
  trackInventory: true,
  allowBackorder: false,
  taxRate: '10',
  supplier: '',
  variants: []
};

/**
 * Custom hook for product form validation
 * @param {Object|null} initialData - Initial product data for editing
 * @returns {Object} Form state and handlers
 */
export const useProductForm = (initialData = null) => {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        sku: initialData.sku || '',
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || '',
        price: initialData.price?.toString() || '',
        cost: initialData.cost?.toString() || '',
        stockQuantity: initialData.stockQuantity?.toString() || '0',
        lowStockThreshold: initialData.lowStockThreshold?.toString() || '10',
        unit: initialData.unit || UNIT_TYPES.PIECE,
        barcode: initialData.barcode || '',
        imageUrl: initialData.imageUrl || '',
        status: initialData.status || PRODUCT_STATUSES.ACTIVE,
        tags: initialData.tags || [],
        trackInventory: initialData.trackInventory !== false,
        allowBackorder: initialData.allowBackorder || false,
        taxRate: initialData.taxRate?.toString() || '10',
        supplier: initialData.supplier || '',
        variants: initialData.variants || []
      };
    }
    return { ...initialFormState };
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  /**
   * Validate a single field
   * @param {string} name - Field name
   * @param {*} value - Field value
   * @returns {string|null} Error message or null
   */
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'sku':
        if (!value?.trim()) {
          return 'SKU is required';
        }
        if (value.trim().length < 2) {
          return 'SKU must be at least 2 characters';
        }
        if (value.trim().length > 50) {
          return 'SKU must not exceed 50 characters';
        }
        return null;

      case 'name':
        if (!value?.trim()) {
          return 'Product name is required';
        }
        if (value.trim().length < 2) {
          return 'Product name must be at least 2 characters';
        }
        if (value.trim().length > 200) {
          return 'Product name must not exceed 200 characters';
        }
        return null;

      case 'description':
        if (value && value.length > 1000) {
          return 'Description must not exceed 1000 characters';
        }
        return null;

      case 'category':
        if (!value) {
          return 'Category is required';
        }
        return null;

      case 'price':
        if (value === '' || value === null || value === undefined) {
          return 'Price is required';
        }
        const price = parseFloat(value);
        if (isNaN(price)) {
          return 'Price must be a valid number';
        }
        if (price < 0) {
          return 'Price cannot be negative';
        }
        if (price > 999999.99) {
          return 'Price must not exceed 999,999.99';
        }
        return null;

      case 'cost':
        if (value === '' || value === null || value === undefined) {
          return 'Cost is required';
        }
        const cost = parseFloat(value);
        if (isNaN(cost)) {
          return 'Cost must be a valid number';
        }
        if (cost < 0) {
          return 'Cost cannot be negative';
        }
        if (cost > 999999.99) {
          return 'Cost must not exceed 999,999.99';
        }
        return null;

      case 'stockQuantity':
        if (value === '' || value === null || value === undefined) {
          return 'Stock quantity is required';
        }
        const stock = parseInt(value);
        if (isNaN(stock)) {
          return 'Stock quantity must be a valid number';
        }
        if (stock < 0) {
          return 'Stock quantity cannot be negative';
        }
        if (stock > 999999) {
          return 'Stock quantity must not exceed 999,999';
        }
        return null;

      case 'lowStockThreshold':
        if (value === '' || value === null || value === undefined) {
          return 'Low stock threshold is required';
        }
        const threshold = parseInt(value);
        if (isNaN(threshold)) {
          return 'Low stock threshold must be a valid number';
        }
        if (threshold < 0) {
          return 'Low stock threshold cannot be negative';
        }
        if (threshold > 999999) {
          return 'Low stock threshold must not exceed 999,999';
        }
        return null;

      case 'unit':
        if (!value) {
          return 'Unit is required';
        }
        return null;

      case 'taxRate':
        if (value === '' || value === null || value === undefined) {
          return 'Tax rate is required';
        }
        const taxRate = parseFloat(value);
        if (isNaN(taxRate)) {
          return 'Tax rate must be a valid number';
        }
        if (taxRate < 0) {
          return 'Tax rate cannot be negative';
        }
        if (taxRate > 100) {
          return 'Tax rate cannot exceed 100%';
        }
        return null;

      case 'barcode':
        if (value && value.length > 50) {
          return 'Barcode must not exceed 50 characters';
        }
        return null;

      case 'imageUrl':
        if (value && value.length > 500) {
          return 'Image URL must not exceed 500 characters';
        }
        return null;

      case 'supplier':
        if (value && value.length > 200) {
          return 'Supplier name must not exceed 200 characters';
        }
        return null;

      case 'status':
        if (!value) {
          return 'Status is required';
        }
        return null;

      default:
        return null;
    }
  }, []);

  /**
   * Validate entire form
   * @returns {Object} Validation errors
   */
  const validateForm = useCallback(() => {
    const formErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        formErrors[key] = error;
      }
    });

    // Cross-field validation
    if (formData.price && formData.cost) {
      const price = parseFloat(formData.price);
      const cost = parseFloat(formData.cost);
      if (!isNaN(price) && !isNaN(cost) && cost > price) {
        formErrors.cost = 'Cost should not exceed selling price';
      }
    }

    return formErrors;
  }, [formData, validateField]);

  /**
   * Handle field change
   * @param {string} name - Field name
   * @param {*} value - Field value
   */
  const handleChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Handle field blur
   * @param {string} name - Field name
   */
  const handleBlur = useCallback(
    (name) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(name, formData[name]);
      if (error) {
        setErrors((prev) => ({ ...prev, [name]: error }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [formData, validateField]
  );

  /**
   * Handle form submission
   * @param {Function} onSubmit - Submit callback
   * @returns {Function} Form submit handler
   */
  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      e.preventDefault();

      // Mark all fields as touched
      const allTouched = {};
      Object.keys(formData).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      // Validate form
      const formErrors = validateForm();

      if (Object.keys(formErrors).length > 0) {
        setErrors(formErrors);
        return;
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        stockQuantity: parseInt(formData.stockQuantity),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        taxRate: parseFloat(formData.taxRate)
      };

      try {
        await onSubmit(submitData);
      } catch (err) {
        // Error is handled in the hook
      }
    },
    [formData, validateForm]
  );

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(initialData || { ...initialFormState });
    setErrors({});
    setTouched({});
    setIsDirty(false);
  }, [initialData]);

  /**
   * Check if field has error
   * @param {string} name - Field name
   * @returns {boolean} True if field has error
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
   * @returns {string|null} Error message or null
   */
  const getError = useCallback(
    (name) => {
      return touched[name] ? errors[name] : null;
    },
    [touched, errors]
  );

  /**
   * Add a tag
   * @param {string} tag - Tag to add
   */
  const addTag = useCallback((tag) => {
    if (tag && !formData.tags.includes(tag)) {
      handleChange('tags', [...formData.tags, tag]);
    }
  }, [formData.tags, handleChange]);

  /**
   * Remove a tag
   * @param {string} tag - Tag to remove
   */
  const removeTag = useCallback((tag) => {
    handleChange('tags', formData.tags.filter((t) => t !== tag));
  }, [formData.tags, handleChange]);

  return {
    formData,
    errors,
    touched,
    isDirty,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    hasError,
    getError,
    addTag,
    removeTag,
    isValid: Object.keys(errors).length === 0
  };
};

export default useProductForm;
