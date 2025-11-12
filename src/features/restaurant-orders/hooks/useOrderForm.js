import { useState, useCallback, useEffect } from 'react';
import { ORDER_STATUS, SERVICE_TYPE, ITEM_STATUS } from '../types/order.types';
import {
  validateOrder,
  calculateOrderTotals,
  canModifyOrder
} from '../utils/orderWorkflow';

/**
 * Hook for managing order form state
 * @param {Object} initialOrder - Initial order data
 * @returns {Object} Form state and handlers
 */
export const useOrderForm = (initialOrder = null) => {
  const [formData, setFormData] = useState({
    serviceType: initialOrder?.serviceType || SERVICE_TYPE.DINE_IN,
    tableId: initialOrder?.tableId || null,
    tableName: initialOrder?.tableName || null,
    customer: initialOrder?.customer || null,
    items: initialOrder?.items || [],
    notes: initialOrder?.notes || '',
    taxRate: initialOrder?.taxRate || 0.1,
    discount: initialOrder?.discount || 0,
    tip: initialOrder?.tip || 0,
    assignedServerId: initialOrder?.assignedServerId || null,
    assignedServerName: initialOrder?.assignedServerName || null
  });

  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    discount: 0,
    tip: 0,
    total: 0
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  /**
   * Recalculate totals when items, tax, discount, or tip change
   */
  useEffect(() => {
    const calculated = calculateOrderTotals(
      formData.items,
      formData.taxRate,
      formData.discount,
      formData.tip
    );
    setTotals(calculated);
  }, [formData.items, formData.taxRate, formData.discount, formData.tip]);

  /**
   * Update a form field
   */
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * Update service type
   */
  const setServiceType = useCallback(
    (serviceType) => {
      updateField('serviceType', serviceType);

      // Clear table if not dine-in
      if (serviceType !== SERVICE_TYPE.DINE_IN) {
        updateField('tableId', null);
        updateField('tableName', null);
      }
    },
    [updateField]
  );

  /**
   * Set table for dine-in orders
   */
  const setTable = useCallback(
    (tableId, tableName) => {
      updateField('tableId', tableId);
      updateField('tableName', tableName);
    },
    [updateField]
  );

  /**
   * Set customer information
   */
  const setCustomer = useCallback(
    (customer) => {
      updateField('customer', customer);
    },
    [updateField]
  );

  /**
   * Add item to order
   */
  const addItem = useCallback(
    (item) => {
      setFormData((prev) => {
        const existingItemIndex = prev.items.findIndex(
          (i) => i.productId === item.productId &&
            JSON.stringify(i.modifiers) === JSON.stringify(item.modifiers)
        );

        let newItems;
        if (existingItemIndex >= 0) {
          // Update quantity of existing item
          newItems = [...prev.items];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + (item.quantity || 1),
            total: (newItems[existingItemIndex].quantity + (item.quantity || 1)) * newItems[existingItemIndex].price
          };
        } else {
          // Add new item
          newItems = [
            ...prev.items,
            {
              ...item,
              id: item.id || `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              status: item.status || ITEM_STATUS.PENDING,
              quantity: item.quantity || 1,
              modifiers: item.modifiers || [],
              notes: item.notes || null
            }
          ];
        }

        return { ...prev, items: newItems };
      });
      setIsDirty(true);
    },
    []
  );

  /**
   * Update item in order
   */
  const updateItem = useCallback((itemId, updates) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    }));
    setIsDirty(true);
  }, []);

  /**
   * Update item quantity
   */
  const updateItemQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== itemId)
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === itemId
            ? {
                ...item,
                quantity,
                total: quantity * item.price +
                  (item.modifiers || []).reduce((sum, mod) => sum + mod.price * quantity, 0)
              }
            : item
        )
      }));
    }
    setIsDirty(true);
  }, []);

  /**
   * Remove item from order
   */
  const removeItem = useCallback((itemId) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId)
    }));
    setIsDirty(true);
  }, []);

  /**
   * Clear all items
   */
  const clearItems = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      items: []
    }));
    setIsDirty(true);
  }, []);

  /**
   * Set notes
   */
  const setNotes = useCallback(
    (notes) => {
      updateField('notes', notes);
    },
    [updateField]
  );

  /**
   * Set discount
   */
  const setDiscount = useCallback(
    (discount) => {
      updateField('discount', discount);
    },
    [updateField]
  );

  /**
   * Set tip
   */
  const setTip = useCallback(
    (tip) => {
      updateField('tip', tip);
    },
    [updateField]
  );

  /**
   * Set assigned server
   */
  const setServer = useCallback(
    (serverId, serverName) => {
      updateField('assignedServerId', serverId);
      updateField('assignedServerName', serverName);
    },
    [updateField]
  );

  /**
   * Validate the form
   */
  const validate = useCallback(() => {
    const orderData = {
      ...formData,
      ...totals
    };

    const validation = validateOrder(orderData);

    if (!validation.isValid) {
      const fieldErrors = {};
      validation.errors.forEach((error) => {
        if (error.includes('Service type')) {
          fieldErrors.serviceType = error;
        } else if (error.includes('Table')) {
          fieldErrors.tableId = error;
        } else if (error.includes('item')) {
          fieldErrors.items = error;
        } else if (error.includes('total')) {
          fieldErrors.total = error;
        }
      });
      setErrors(fieldErrors);
    } else {
      setErrors({});
    }

    return validation;
  }, [formData, totals]);

  /**
   * Get form data for submission
   */
  const getFormData = useCallback(() => {
    return {
      ...formData,
      ...totals
    };
  }, [formData, totals]);

  /**
   * Reset form
   */
  const reset = useCallback((newOrder = null) => {
    if (newOrder) {
      setFormData({
        serviceType: newOrder.serviceType || SERVICE_TYPE.DINE_IN,
        tableId: newOrder.tableId || null,
        tableName: newOrder.tableName || null,
        customer: newOrder.customer || null,
        items: newOrder.items || [],
        notes: newOrder.notes || '',
        taxRate: newOrder.taxRate || 0.1,
        discount: newOrder.discount || 0,
        tip: newOrder.tip || 0,
        assignedServerId: newOrder.assignedServerId || null,
        assignedServerName: newOrder.assignedServerName || null
      });
    } else {
      setFormData({
        serviceType: SERVICE_TYPE.DINE_IN,
        tableId: null,
        tableName: null,
        customer: null,
        items: [],
        notes: '',
        taxRate: 0.1,
        discount: 0,
        tip: 0,
        assignedServerId: null,
        assignedServerName: null
      });
    }
    setErrors({});
    setIsDirty(false);
  }, []);

  /**
   * Check if order can be modified
   */
  const isModifiable = useCallback(() => {
    if (!initialOrder) return true;
    return canModifyOrder(initialOrder.status);
  }, [initialOrder]);

  return {
    formData,
    totals,
    errors,
    isDirty,
    isModifiable: isModifiable(),

    // Actions
    updateField,
    setServiceType,
    setTable,
    setCustomer,
    addItem,
    updateItem,
    updateItemQuantity,
    removeItem,
    clearItems,
    setNotes,
    setDiscount,
    setTip,
    setServer,
    validate,
    getFormData,
    reset
  };
};

export default useOrderForm;
