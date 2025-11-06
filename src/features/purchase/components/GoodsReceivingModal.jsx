import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { usePurchase } from '../hooks/usePurchase.js';

export const GoodsReceivingModal = ({ purchaseOrder, onClose }) => {
  const { receiveGoods, isLoading } = usePurchase();
  const [receivingData, setReceivingData] = useState({
    receivedBy: 'Current User',
    items: purchaseOrder.items.map((item) => ({
      purchaseItemId: item.id,
      productId: item.productId,
      quantityOrdered: item.quantity,
      quantityReceived: item.quantity - item.receivedQuantity,
      quantityAccepted: item.quantity - item.receivedQuantity,
      quantityRejected: 0,
      rejectionReason: '',
      batchNumber: '',
      expiryDate: ''
    })),
    notes: '',
    inspectionNotes: '',
    qualityApproved: true
  });

  const updateItem = (index, field, value) => {
    const items = [...receivingData.items];
    items[index] = { ...items[index], [field]: value };

    // Auto-calculate accepted/rejected
    if (field === 'quantityReceived' || field === 'quantityAccepted') {
      const received = parseFloat(items[index].quantityReceived) || 0;
      const accepted = parseFloat(items[index].quantityAccepted) || 0;
      items[index].quantityRejected = received - accepted;
    }

    setReceivingData({ ...receivingData, items });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await receiveGoods(purchaseOrder.id, receivingData);
      onClose();
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Receive Goods</h2>
            <p className="text-sm text-gray-600 mt-1">
              PO: {purchaseOrder.orderNumber} - {purchaseOrder.supplierName}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="px-6 py-4 space-y-6">
            {/* Receiving Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Received By
                </label>
                <input
                  type="text"
                  value={receivingData.receivedBy}
                  onChange={(e) => setReceivingData({ ...receivingData, receivedBy: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={receivingData.qualityApproved}
                    onChange={(e) => setReceivingData({ ...receivingData, qualityApproved: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Quality Approved</span>
                </label>
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Items to Receive</h3>
              <div className="space-y-3">
                {receivingData.items.map((item, index) => {
                  const orderItem = purchaseOrder.items[index];
                  return (
                    <div key={item.purchaseItemId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{orderItem.productName}</h4>
                          <p className="text-sm text-gray-600">SKU: {orderItem.sku}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Ordered: {item.quantityOrdered}</div>
                          <div className="text-sm text-gray-600">Already Received: {orderItem.receivedQuantity}</div>
                          <div className="text-sm font-medium">Pending: {item.quantityOrdered - orderItem.receivedQuantity}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-5 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Received</label>
                          <input
                            type="number"
                            value={item.quantityReceived}
                            onChange={(e) => updateItem(index, 'quantityReceived', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                            min="0"
                            max={item.quantityOrdered - orderItem.receivedQuantity}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Accepted</label>
                          <input
                            type="number"
                            value={item.quantityAccepted}
                            onChange={(e) => updateItem(index, 'quantityAccepted', parseFloat(e.target.value) || 0)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                            min="0"
                            max={item.quantityReceived}
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Rejected</label>
                          <input
                            type="number"
                            value={item.quantityRejected}
                            readOnly
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md bg-gray-100"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Batch No</label>
                          <input
                            type="text"
                            value={item.batchNumber}
                            onChange={(e) => updateItem(index, 'batchNumber', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Expiry Date</label>
                          <input
                            type="date"
                            value={item.expiryDate}
                            onChange={(e) => updateItem(index, 'expiryDate', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      {item.quantityRejected > 0 && (
                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Rejection Reason</label>
                          <input
                            type="text"
                            value={item.rejectionReason}
                            onChange={(e) => updateItem(index, 'rejectionReason', e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                            placeholder="Specify reason for rejection"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={receivingData.notes}
                  onChange={(e) => setReceivingData({ ...receivingData, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Notes</label>
                <textarea
                  value={receivingData.inspectionNotes}
                  onChange={(e) => setReceivingData({ ...receivingData, inspectionNotes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
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
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              {isLoading ? 'Processing...' : 'Confirm Receipt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
