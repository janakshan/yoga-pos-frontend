import { useState, useEffect } from 'react';
import { usePurchaseOrders } from '../hooks/usePurchaseOrders.js';
import { useSuppliers } from '../hooks/useSuppliers.js';
import { PO_STATUS, PO_STATUS_LABELS, PAYMENT_STATUS } from '../types/purchaseOrder.types.js';
import {
  Plus,
  Search,
  Edit,
  Eye,
  X,
  Check,
  Package,
  FileText,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';

export const PurchaseOrderManagement = () => {
  const {
    purchaseOrders,
    isLoading,
    fetchPurchaseOrders,
    createPurchaseOrder,
    updatePurchaseOrderById,
    changePurchaseOrderStatus,
    receiveGoods,
    createReturn,
  } = usePurchaseOrders();

  const { suppliers, fetchSuppliers } = useSuppliers();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReceivingModal, setShowReceivingModal] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [receivingOrder, setReceivingOrder] = useState(null);

  const [formData, setFormData] = useState({
    supplierId: '',
    supplierName: '',
    expectedDeliveryDate: '',
    items: [],
    notes: '',
  });

  const [newItem, setNewItem] = useState({
    productName: '',
    sku: '',
    orderedQuantity: 0,
    unitPrice: 0,
    taxRate: 10,
  });

  useEffect(() => {
    fetchPurchaseOrders();
    fetchSuppliers();
  }, [fetchPurchaseOrders, fetchSuppliers]);

  const handleAddItem = () => {
    if (!newItem.productName || !newItem.sku || newItem.orderedQuantity <= 0) {
      return;
    }

    const item = {
      id: `POI-${Date.now()}`,
      productId: `PROD-${Date.now()}`,
      productName: newItem.productName,
      sku: newItem.sku,
      unit: 'piece',
      orderedQuantity: parseInt(newItem.orderedQuantity),
      receivedQuantity: 0,
      pendingQuantity: parseInt(newItem.orderedQuantity),
      unitPrice: parseFloat(newItem.unitPrice),
      discount: 0,
      discountType: 'fixed',
      tax: 0,
      taxRate: parseFloat(newItem.taxRate),
      totalAmount: 0,
      notes: '',
    };

    // Calculate amounts
    const lineTotal = item.orderedQuantity * item.unitPrice;
    item.tax = (lineTotal * item.taxRate) / 100;
    item.totalAmount = lineTotal + item.tax;

    setFormData({
      ...formData,
      items: [...formData.items, item],
    });

    // Reset new item form
    setNewItem({
      productName: '',
      sku: '',
      orderedQuantity: 0,
      unitPrice: 0,
      taxRate: 10,
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({ ...formData, items: updatedItems });
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + item.orderedQuantity * item.unitPrice;
    }, 0);

    const totalTax = formData.items.reduce((sum, item) => sum + item.tax, 0);
    const totalAmount = subtotal + totalTax;

    return { subtotal, totalTax, totalAmount };
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (formData.items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    const { subtotal, totalTax, totalAmount } = calculateTotals();
    const selectedSupplier = suppliers.find((s) => s.id === formData.supplierId);

    const orderData = {
      supplierId: formData.supplierId,
      supplierName: selectedSupplier?.name || '',
      branchId: 'BRANCH-001',
      branchName: 'Main Branch',
      expectedDeliveryDate: formData.expectedDeliveryDate
        ? new Date(formData.expectedDeliveryDate)
        : null,
      items: formData.items,
      subtotal,
      totalDiscount: 0,
      totalTax,
      shippingCost: 0,
      otherCharges: 0,
      totalAmount,
      paymentTerms: selectedSupplier?.paymentTerms?.terms || 'net30',
      notes: formData.notes,
      status: PO_STATUS.DRAFT,
    };

    try {
      await createPurchaseOrder(orderData);
      setShowCreateModal(false);
      setFormData({
        supplierId: '',
        supplierName: '',
        expectedDeliveryDate: '',
        items: [],
        notes: '',
      });
      fetchPurchaseOrders();
    } catch (error) {
      console.error('Error creating purchase order:', error);
    }
  };

  const handleViewDetails = (order) => {
    setViewingOrder(order);
    setShowDetailModal(true);
  };

  const handleOpenReceiving = (order) => {
    setReceivingOrder(order);
    setShowReceivingModal(true);
  };

  const handleReceiveGoods = async (orderId, receivedItems) => {
    try {
      await receiveGoods(orderId, {
        items: receivedItems,
        receivedDate: new Date(),
        status: 'complete',
        notes: 'Goods received',
      });
      setShowReceivingModal(false);
      setReceivingOrder(null);
      fetchPurchaseOrders();
    } catch (error) {
      console.error('Error receiving goods:', error);
    }
  };

  const handleApprove = async (orderId) => {
    try {
      await changePurchaseOrderStatus(orderId, PO_STATUS.APPROVED);
      fetchPurchaseOrders();
    } catch (error) {
      console.error('Error approving order:', error);
    }
  };

  const filteredOrders = purchaseOrders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      ordered: 'bg-indigo-100 text-indigo-800',
      partial: 'bg-orange-100 text-orange-800',
      received: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status] || styles.draft;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading purchase orders...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Purchase Order Management
        </h1>
        <p className="text-gray-600">
          Create and manage purchase orders from suppliers
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search purchase orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            {Object.entries(PO_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Purchase Order
          </button>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.orderNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.supplierName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {PO_STATUS_LABELS[order.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.paymentStatus === PAYMENT_STATUS.PAID
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === PAYMENT_STATUS.PARTIAL
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="text-blue-600 hover:text-blue-900"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5 inline" />
                  </button>

                  {order.status === PO_STATUS.DRAFT && (
                    <button
                      onClick={() => handleApprove(order.id)}
                      className="text-green-600 hover:text-green-900"
                      title="Approve"
                    >
                      <Check className="w-5 h-5 inline" />
                    </button>
                  )}

                  {(order.status === PO_STATUS.ORDERED ||
                    order.status === PO_STATUS.PARTIAL) && (
                    <button
                      onClick={() => handleOpenReceiving(order)}
                      className="text-purple-600 hover:text-purple-900"
                      title="Receive Goods"
                    >
                      <Package className="w-5 h-5 inline" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No purchase orders found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new purchase order.
            </p>
          </div>
        )}
      </div>

      {/* Create Purchase Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Create Purchase Order</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
              {/* Order Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier *
                  </label>
                  <select
                    required
                    value={formData.supplierId}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.filter((s) => s.status === 'active').map((supplier) => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.expectedDeliveryDate}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expectedDeliveryDate: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Add Item Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Add Items</h3>
                <div className="grid grid-cols-5 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newItem.productName}
                    onChange={(e) =>
                      setNewItem({ ...newItem, productName: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="SKU"
                    value={newItem.sku}
                    onChange={(e) =>
                      setNewItem({ ...newItem, sku: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    min="1"
                    value={newItem.orderedQuantity || ''}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        orderedQuantity: e.target.value,
                      })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Unit Price"
                    min="0"
                    step="0.01"
                    value={newItem.unitPrice || ''}
                    onChange={(e) =>
                      setNewItem({ ...newItem, unitPrice: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          SKU
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Qty
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Total
                        </th>
                        <th className="px-4 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {formData.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{item.productName}</td>
                          <td className="px-4 py-2 text-sm">{item.sku}</td>
                          <td className="px-4 py-2 text-sm text-right">
                            {item.orderedQuantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-right">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-medium">
                            ${item.totalAmount.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="bg-gray-50 px-4 py-3 border-t">
                    <div className="flex justify-end space-x-8 text-sm">
                      <div>
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="ml-2 font-medium">
                          ${calculateTotals().subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tax:</span>
                        <span className="ml-2 font-medium">
                          ${calculateTotals().totalTax.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <span className="ml-2 font-bold text-lg">
                          ${calculateTotals().totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {showDetailModal && viewingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Purchase Order Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-bold">{viewingOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Supplier</p>
                  <p className="font-medium">{viewingOrder.supplierName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(
                      viewingOrder.status
                    )}`}
                  >
                    {PO_STATUS_LABELS[viewingOrder.status]}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-medium">
                    {format(new Date(viewingOrder.orderDate), 'MMM dd, yyyy')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Expected Delivery</p>
                  <p className="font-medium">
                    {viewingOrder.expectedDeliveryDate
                      ? format(
                          new Date(viewingOrder.expectedDeliveryDate),
                          'MMM dd, yyyy'
                        )
                      : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Status</p>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      viewingOrder.paymentStatus === PAYMENT_STATUS.PAID
                        ? 'bg-green-100 text-green-800'
                        : viewingOrder.paymentStatus === PAYMENT_STATUS.PARTIAL
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {viewingOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-lg font-medium mb-3">Order Items</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Product
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Ordered
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Received
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Pending
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Unit Price
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {viewingOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 text-sm">
                            <div>{item.productName}</div>
                            <div className="text-gray-500 text-xs">{item.sku}</div>
                          </td>
                          <td className="px-4 py-2 text-sm text-right">
                            {item.orderedQuantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-green-600">
                            {item.receivedQuantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-right text-orange-600">
                            {item.pendingQuantity}
                          </td>
                          <td className="px-4 py-2 text-sm text-right">
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm text-right font-medium">
                            ${item.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="bg-gray-50 px-4 py-3 border-t">
                    <div className="flex justify-end space-x-8 text-sm">
                      <div>
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="ml-2 font-medium">
                          ${viewingOrder.subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Tax:</span>
                        <span className="ml-2 font-medium">
                          ${viewingOrder.totalTax.toFixed(2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total:</span>
                        <span className="ml-2 font-bold text-lg">
                          ${viewingOrder.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {viewingOrder.notes && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{viewingOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Receiving Modal */}
      {showReceivingModal && receivingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Receive Goods</h2>
              <button
                onClick={() => setShowReceivingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Order: <span className="font-medium">{receivingOrder.orderNumber}</span>
              </p>

              <div className="space-y-3">
                {receivingOrder.items
                  .filter((item) => item.pendingQuantity > 0)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-gray-500">{item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Pending: {item.pendingQuantity}
                        </p>
                        <button
                          onClick={() =>
                            handleReceiveGoods(receivingOrder.id, [
                              {
                                ...item,
                                receivedQuantity: item.pendingQuantity,
                              },
                            ])
                          }
                          className="mt-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Receive All
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
