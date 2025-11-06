/**
 * usePurchaseForm Hook
 * Form management for purchase order create/edit operations
 */

import { useState, useCallback, useEffect } from 'react';
import { DEFAULT_PURCHASE_ORDER, DEFAULT_PURCHASE_ITEM } from '../types/purchase.types.js';

export const usePurchaseForm = (initialData = null) => {
  const [formData, setFormData] = useState(
    initialData || { ...DEFAULT_PURCHASE_ORDER, items: [] }
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
      case 'supplierId':
        if (!value) return 'Supplier is required';
        return null;

      case 'orderDate':
        if (!value) return 'Order date is required';
        return null;

      case 'expectedDeliveryDate':
        if (value && formData.orderDate) {
          if (new Date(value) < new Date(formData.orderDate)) {
            return 'Delivery date cannot be before order date';
          }
        }
        return null;

      case 'items':
        if (!value || value.length === 0) {
          return 'At least one item is required';
        }
        return null;

      case 'shippingCost':
        if (value < 0) return 'Shipping cost cannot be negative';
        return null;

      default:
        return null;
    }
  }, [formData.orderDate]);

  /**
   * Validate line item
   */
  const validateLineItem = useCallback((item) => {
    const itemErrors = {};

    if (!item.productId) {
      itemErrors.productId = 'Product is required';
    }
    if (!item.quantity || item.quantity <= 0) {
      itemErrors.quantity = 'Quantity must be greater than 0';
    }
    if (!item.unitCost || item.unitCost <= 0) {
      itemErrors.unitCost = 'Unit cost must be greater than 0';
    }
    if (item.discount < 0 || item.discount > 100) {
      itemErrors.discount = 'Discount must be between 0 and 100';
    }
    if (item.tax < 0 || item.tax > 100) {
      itemErrors.tax = 'Tax must be between 0 and 100';
    }

    return itemErrors;
  }, []);

  /**
   * Validate entire form
   */
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Validate main fields
    const supplierError = validateField('supplierId', formData.supplierId);
    if (supplierError) newErrors.supplierId = supplierError;

    const orderDateError = validateField('orderDate', formData.orderDate);
    if (orderDateError) newErrors.orderDate = orderDateError;

    const deliveryDateError = validateField(
      'expectedDeliveryDate',
      formData.expectedDeliveryDate
    );
    if (deliveryDateError) newErrors.expectedDeliveryDate = deliveryDateError;

    const itemsError = validateField('items', formData.items);
    if (itemsError) newErrors.items = itemsError;

    // Validate each line item
    const itemErrors = formData.items.map((item) => validateLineItem(item));
    const hasItemErrors = itemErrors.some(
      (itemError) => Object.keys(itemError).length > 0
    );
    if (hasItemErrors) {
      newErrors.itemErrors = itemErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField, validateLineItem]);

  /**
   * Calculate line item total
   */
  const calculateItemTotal = useCallback((item) => {
    const subtotal = item.quantity * item.unitCost;
    const discountAmount = (subtotal * item.discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * item.tax) / 100;
    return taxableAmount + taxAmount;
  }, []);

  /**
   * Recalculate order totals
   */
  const recalculateTotals = useCallback((items, shippingCost = 0) => {
    let subtotal = 0;
    let discountAmount = 0;
    let taxAmount = 0;

    items.forEach((item) => {
      const itemSubtotal = item.quantity * item.unitCost;
      const itemDiscount = (itemSubtotal * item.discount) / 100;
      const itemTaxable = itemSubtotal - itemDiscount;
      const itemTax = (itemTaxable * item.tax) / 100;

      item.totalCost = itemTaxable + itemTax;
      subtotal += itemSubtotal;
      discountAmount += itemDiscount;
      taxAmount += itemTax;
    });

    const totalAmount = subtotal - discountAmount + taxAmount + shippingCost;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      balanceAmount: totalAmount - (formData.paidAmount || 0)
    };
  }, [formData.paidAmount]);

  /**
   * Handle field change
   */
  const handleChange = useCallback((name, value) => {
    setIsDirty(true);

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value
      };

      // Recalculate if shipping cost changed
      if (name === 'shippingCost') {
        const totals = recalculateTotals(prev.items, value);
        return { ...updated, ...totals };
      }

      return updated;
    });

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, [recalculateTotals]);

  /**
   * Add line item
   */
  const addItem = useCallback((product) => {
    setIsDirty(true);

    const newItem = {
      ...DEFAULT_PURCHASE_ITEM,
      id: `temp-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      unitCost: product.cost || 0
    };

    setFormData((prev) => {
      const items = [...prev.items, newItem];
      const totals = recalculateTotals(items, prev.shippingCost);
      return {
        ...prev,
        items,
        ...totals
      };
    });

    // Clear items error
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.items;
      return newErrors;
    });
  }, [recalculateTotals]);

  /**
   * Update line item
   */
  const updateItem = useCallback((index, updates) => {
    setIsDirty(true);

    setFormData((prev) => {
      const items = [...prev.items];
      items[index] = { ...items[index], ...updates };

      // Recalculate item total
      const item = items[index];
      item.totalCost = calculateItemTotal(item);

      const totals = recalculateTotals(items, prev.shippingCost);
      return {
        ...prev,
        items,
        ...totals
      };
    });

    // Clear item errors
    setErrors((prev) => {
      if (prev.itemErrors) {
        const newItemErrors = [...prev.itemErrors];
        newItemErrors[index] = {};
        return { ...prev, itemErrors: newItemErrors };
      }
      return prev;
    });
  }, [calculateItemTotal, recalculateTotals]);

  /**
   * Remove line item
   */
  const removeItem = useCallback((index) => {
    setIsDirty(true);

    setFormData((prev) => {
      const items = prev.items.filter((_, i) => i !== index);
      const totals = recalculateTotals(items, prev.shippingCost);
      return {
        ...prev,
        items,
        ...totals
      };
    });

    // Clear item errors
    setErrors((prev) => {
      if (prev.itemErrors) {
        const newItemErrors = prev.itemErrors.filter((_, i) => i !== index);
        return { ...prev, itemErrors: newItemErrors };
      }
      return prev;
    });
  }, [recalculateTotals]);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback((name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));

    const value = formData[name];
    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }, [formData, validateField]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      e?.preventDefault();

      // Mark all fields as touched
      setTouched({
        supplierId: true,
        orderDate: true,
        expectedDeliveryDate: true,
        items: true
      });

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
    setFormData(initialData || { ...DEFAULT_PURCHASE_ORDER, items: [] });
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
   * Get item error
   */
  const getItemError = useCallback(
    (index, field) => {
      return errors.itemErrors?.[index]?.[field];
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
    getItemError,
    validateForm,
    setFormData,
    addItem,
    updateItem,
    removeItem
  };
};
