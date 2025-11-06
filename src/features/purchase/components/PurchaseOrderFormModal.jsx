import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { usePurchase } from '../hooks/usePurchase.js';
import { useSuppliers } from '../hooks/useSuppliers.js';
import { useStore } from '../../../store/index.js';

export const PurchaseOrderFormModal = ({ purchaseOrder = null, onClose }) => {
  const { createPurchaseOrder, updatePurchaseOrderData, isLoading } = usePurchase();
  const { fetchActiveSuppliers } = useSuppliers();
  const products = useStore((state) => state.products || []);

  const [suppliers, setSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    supplierId: '',
    supplierName: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    status: 'draft',
    items: [],
    shippingCost: 0,
    paymentTerms: '30 days net',
    shippingAddress: 'Main Warehouse, 123 Store Street, Colombo 05',
    notes: ''
  });

  useEffect(() => {
    fetchActiveSuppliers().then(setSuppliers);

    if (purchaseOrder) {
      setFormData({
        ...purchaseOrder,
        orderDate: purchaseOrder.orderDate.split('T')[0],
        expectedDeliveryDate: purchaseOrder.expectedDeliveryDate ? purchaseOrder.expectedDeliveryDate.split('T')[0] : ''
      });
    }
  }, [purchaseOrder, fetchActiveSuppliers]);

  const handleSupplierChange = (e) => {
    const supplierId = e.target.value;
    const supplier = suppliers.find(s => s.id === supplierId);
    setFormData({
      ...formData,
      supplierId,
      supplierName: supplier?.name || '',
      paymentTerms: supplier?.paymentTerms ? `${supplier.paymentTerms.creditDays} days net` : '30 days net'
    });
  };

  const addItem = () => {
    const newItem = {
      id: `temp-${Date.now()}`,
      productId: '',
      productName: '',
      sku: '',
      quantity: 1,
      receivedQuantity: 0,
      unitCost: 0,
      discount: 0,
      tax: 0,
      totalCost: 0,
      notes: ''
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const updateItem = (index, field, value) => {
    const items = [...formData.items];
    items[index] = { ...items[index], [field]: value };

    // If product changed, update related fields
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        items[index].productName = product.name;
        items[index].sku = product.sku;
        items[index].unitCost = product.cost || 0;
      }
    }

    // Recalculate item total
    const item = items[index];
    const subtotal = item.quantity * item.unitCost;
    const discount = (subtotal * item.discount) / 100;
    const taxable = subtotal - discount;
    const tax = (taxable * item.tax) / 100;
    items[index].totalCost = taxable + tax;

    setFormData({ ...formData, items });
  };

  const removeItem = (index) => {
    const items = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
    const discountAmount = formData.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitCost;
      return sum + ((itemSubtotal * item.discount) / 100);
    }, 0);
    const taxAmount = formData.items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitCost;
      const itemDiscount = (itemSubtotal * item.discount) / 100;
      const itemTaxable = itemSubtotal - itemDiscount;
      return sum + ((itemTaxable * item.tax) / 100);
    }, 0);
    const totalAmount = subtotal - discountAmount + taxAmount + formData.shippingCost;

    return { subtotal, discountAmount, taxAmount, totalAmount };
  };

  const totals = calculateTotals();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.supplierId) {
      alert('Please select a supplier');
      return;
    }
    if (formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    const submitData = {
      ...formData,
      ...totals,
      paidAmount: 0,
      balanceAmount: totals.totalAmount,
      paymentStatus: 'unpaid',
      createdBy: 'current-user'
    };

    try {
      if (purchaseOrder) {
        await updatePurchaseOrderData(purchaseOrder.id, submitData);
      } else {
        await createPurchaseOrder(submitData);
      }
      onClose();
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {purchaseOrder ? 'Edit Purchase Order' : 'New Purchase Order'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="px-6 py-4 space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.supplierId}
                  onChange={handleSupplierChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} ({supplier.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Delivery
                </label>
                <input
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Items */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">Order Items</h3>
                <button
                  type="button"
                  onClick={addItem}
                  disabled={isLoading}
                  className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </button>
              </div>

              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Product</label>
                        <select
                          value={item.productId}
                          onChange={(e) => updateItem(index, 'productId', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                        >
                          <option value="">Select Product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} ({product.sku})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                          min="1"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Unit Cost</label>
                        <input
                          type="number"
                          value={item.unitCost}
                          onChange={(e) => updateItem(index, 'unitCost', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="col-span-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Disc %</label>
                        <input
                          type="number"
                          value={item.discount}
                          onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                          min="0"
                          max="100"
                        />
                      </div>

                      <div className="col-span-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Tax %</label>
                        <input
                          type="number"
                          value={item.tax}
                          onChange={(e) => updateItem(index, 'tax', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                          min="0"
                          max="100"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Total</label>
                        <div className="px-2 py-1 text-sm font-medium bg-white border border-gray-300 rounded-md">
                          {item.totalCost.toFixed(2)}
                        </div>
                      </div>

                      <div className="col-span-1 flex items-end">
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="w-full px-2 py-1 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.items.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No items added. Click "Add Item" to start.
                  </div>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">LKR {totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount:</span>
                    <span className="font-medium text-red-600">-LKR {totals.discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">LKR {totals.taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping:</span>
                    <input
                      type="number"
                      value={formData.shippingCost}
                      onChange={(e) => setFormData({ ...formData, shippingCost: parseFloat(e.target.value) || 0 })}
                      className="w-32 px-2 py-1 text-right border border-gray-300 rounded-md"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                    <span>Total:</span>
                    <span>LKR {totals.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Saving...' : purchaseOrder ? 'Update Order' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
