import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store';
import { useOrders } from '../hooks/useOrders';
import { useOrderForm } from '../hooks/useOrderForm';
import { SERVICE_TYPE } from '../types/order.types';
import ServiceTypeSelector from './ServiceTypeSelector';
import TableSelector from './TableSelector';
import OrderItemsList from './OrderItemsList';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

/**
 * Order Form Component
 * Form for creating and editing restaurant orders
 */
export const OrderForm = ({ order = null, onSuccess = null }) => {
  const navigate = useNavigate();
  const { createOrder, saveOrder } = useOrders();
  const user = useStore((state) => state.user);
  const currentBranch = useStore((state) => state.currentBranch);

  const {
    formData,
    totals,
    errors,
    isDirty,
    isModifiable,
    setServiceType,
    setTable,
    setCustomer,
    addItem,
    updateItem,
    updateItemQuantity,
    removeItem,
    setNotes,
    setDiscount,
    setTip,
    setServer,
    validate,
    getFormData,
    reset
  } = useOrderForm(order);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showItemPicker, setShowItemPicker] = useState(false);

  const isEditing = !!order;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validation = validate();
    if (!validation.isValid) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...getFormData(),
        branchId: currentBranch?.id || 'branch_001',
        createdBy: user?.id || 'user_001',
        createdByName: user?.name || 'Unknown User'
      };

      if (isEditing) {
        await saveOrder(order.id, orderData);
        toast.success('Order updated successfully');
      } else {
        const newOrder = await createOrder(orderData);
        toast.success(`Order ${newOrder.orderNumber} created successfully`);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/orders');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service Type Selection */}
      <div className="bg-white rounded-lg shadow p-6">
        <ServiceTypeSelector
          value={formData.serviceType}
          onChange={setServiceType}
          disabled={!isModifiable}
        />
        {errors.serviceType && (
          <p className="mt-2 text-sm text-red-600">{errors.serviceType}</p>
        )}
      </div>

      {/* Table Selection (for Dine-In only) */}
      {formData.serviceType === SERVICE_TYPE.DINE_IN && (
        <div className="bg-white rounded-lg shadow p-6">
          <TableSelector
            value={formData.tableId}
            onChange={setTable}
            disabled={!isModifiable}
            showOccupied={isEditing}
          />
          {errors.tableId && (
            <p className="mt-2 text-sm text-red-600">{errors.tableId}</p>
          )}
        </div>
      )}

      {/* Customer Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Customer Information (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={formData.customer?.name || ''}
              onChange={(e) =>
                setCustomer({ ...formData.customer, name: e.target.value })
              }
              placeholder="Customer name"
              disabled={!isModifiable}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              value={formData.customer?.phone || ''}
              onChange={(e) =>
                setCustomer({ ...formData.customer, phone: e.target.value })
              }
              placeholder="Phone number"
              disabled={!isModifiable}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.customer?.email || ''}
              onChange={(e) =>
                setCustomer({ ...formData.customer, email: e.target.value })
              }
              placeholder="Email address"
              disabled={!isModifiable}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
          {isModifiable && (
            <button
              type="button"
              onClick={() => setShowItemPicker(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Add Items
            </button>
          )}
        </div>

        <OrderItemsList
          items={formData.items}
          onUpdateQuantity={updateItemQuantity}
          onRemoveItem={removeItem}
          onUpdateItem={updateItem}
          readOnly={!isModifiable}
        />

        {errors.items && (
          <p className="mt-2 text-sm text-red-600">{errors.items}</p>
        )}

        {formData.items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No items added yet</p>
            <p className="text-sm mt-1">Click "Add Items" to get started</p>
          </div>
        )}
      </div>

      {/* Order Totals */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Summary
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>${totals.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-700">
            <span>Tax ({(formData.taxRate * 100).toFixed(0)}%)</span>
            <span>${totals.tax.toFixed(2)}</span>
          </div>

          {totals.discount > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Discount</span>
              <span className="text-red-600">-${totals.discount.toFixed(2)}</span>
            </div>
          )}

          {totals.tip > 0 && (
            <div className="flex justify-between text-gray-700">
              <span>Tip</span>
              <span>${totals.tip.toFixed(2)}</span>
            </div>
          )}

          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Order Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Special instructions or notes..."
          rows={3}
          disabled={!isModifiable}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !isModifiable}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Order' : 'Create Order'}
        </button>
      </div>

      {/* TODO: Add Item Picker Modal */}
      {showItemPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Add Items (Coming Soon)</h3>
            <p className="text-gray-600 mb-4">
              Item picker will be integrated with the menu/product catalog.
            </p>
            <button
              type="button"
              onClick={() => setShowItemPicker(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default OrderForm;
