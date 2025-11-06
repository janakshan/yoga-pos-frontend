import React from 'react';
import { X, Edit, Calendar, DollarSign, Package } from 'lucide-react';
import {
  PURCHASE_STATUS_LABELS,
  PAYMENT_STATUS_LABELS
} from '../types/purchase.types.js';

export const PurchaseOrderDetailModal = ({ purchaseOrder, onClose, onEdit }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Purchase Order Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">{purchaseOrder.orderNumber}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] px-6 py-4">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="text-xs text-gray-500 mb-1">Status</div>
              <div className="font-medium">{PURCHASE_STATUS_LABELS[purchaseOrder.status]}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Supplier</div>
              <div className="font-medium">{purchaseOrder.supplierName}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Order Date</div>
              <div className="font-medium">{formatDate(purchaseOrder.orderDate)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Payment Status</div>
              <div className="font-medium">{PAYMENT_STATUS_LABELS[purchaseOrder.paymentStatus]}</div>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Order Items</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Received</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Cost</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchaseOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-gray-900">{item.productName}</div>
                        <div className="text-gray-500">{item.sku}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-right">{item.receivedQuantity}</td>
                      <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.unitCost)}</td>
                      <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(item.totalCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="mb-6 flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(purchaseOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount:</span>
                <span className="font-medium text-red-600">-{formatCurrency(purchaseOrder.discountAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-medium">{formatCurrency(purchaseOrder.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">{formatCurrency(purchaseOrder.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                <span>Total:</span>
                <span>{formatCurrency(purchaseOrder.totalAmount)}</span>
              </div>
              {purchaseOrder.paymentStatus !== 'paid' && (
                <div className="flex justify-between text-sm text-red-600 font-medium">
                  <span>Balance Due:</span>
                  <span>{formatCurrency(purchaseOrder.balanceAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {purchaseOrder.notes && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Notes</h3>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{purchaseOrder.notes}</p>
            </div>
          )}

          {/* Receipts */}
          {purchaseOrder.receipts && purchaseOrder.receipts.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Goods Receipts</h3>
              <div className="space-y-2">
                {purchaseOrder.receipts.map((receipt) => (
                  <div key={receipt.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{receipt.receiptNumber}</div>
                        <div className="text-sm text-gray-600">
                          Received by {receipt.receivedBy} on {formatDate(receipt.receivedDate)}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        receipt.qualityApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {receipt.qualityApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    {receipt.notes && (
                      <p className="text-sm text-gray-600 mt-2">{receipt.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
