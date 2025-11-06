import React, { useState } from 'react';
import { RotateCcw, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { usePos } from '../hooks/usePos';
import { formatCurrency } from '../utils/calculations';
import toast from 'react-hot-toast';

/**
 * ReturnRefund Component
 * Process returns and refunds
 * @returns {JSX.Element}
 */
export const ReturnRefund = () => {
  const [transactionNumber, setTransactionNumber] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [refundReason, setRefundReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { refundTransaction, fetchTransactions } = usePos();

  /**
   * Search for transaction
   */
  const handleSearch = async () => {
    if (!transactionNumber.trim()) {
      toast.error('Please enter a transaction number');
      return;
    }

    try {
      setIsProcessing(true);
      const transactions = await fetchTransactions({
        transactionNumber: transactionNumber.trim(),
      });

      if (transactions.length === 0) {
        toast.error('Transaction not found');
        setTransaction(null);
      } else {
        const txn = transactions[0];
        if (txn.status === 'refunded') {
          toast.error('This transaction has already been refunded');
          setTransaction(null);
        } else if (txn.status === 'cancelled') {
          toast.error('This transaction was cancelled');
          setTransaction(null);
        } else {
          setTransaction(txn);
          // Auto-select all items for full refund
          setSelectedItems(txn.items.map((item) => ({
            ...item,
            returnQuantity: item.quantity,
          })));
          toast.success('Transaction found');
        }
      }
    } catch (error) {
      toast.error('Error searching for transaction');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Update return quantity for an item
   */
  const handleUpdateReturnQuantity = (itemId, quantity) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === itemId
          ? { ...item, returnQuantity: Math.max(0, Math.min(quantity, item.quantity)) }
          : item
      )
    );
  };

  /**
   * Calculate refund amount
   */
  const calculateRefundAmount = () => {
    if (!transaction || selectedItems.length === 0) return 0;

    const itemsTotal = selectedItems.reduce(
      (sum, item) => sum + item.price * item.returnQuantity,
      0
    );

    // Apply same discount percentage as original transaction
    const discount = itemsTotal * (transaction.discountPercentage / 100);
    const taxableAmount = itemsTotal - discount;
    const tax = taxableAmount * (transaction.taxPercentage / 100);

    return itemsTotal - discount + tax;
  };

  /**
   * Process refund
   */
  const handleProcessRefund = async () => {
    if (!transaction) {
      toast.error('No transaction selected');
      return;
    }

    const itemsToRefund = selectedItems.filter((item) => item.returnQuantity > 0);

    if (itemsToRefund.length === 0) {
      toast.error('Please select items to refund');
      return;
    }

    if (!refundReason.trim()) {
      toast.error('Please enter a refund reason');
      return;
    }

    try {
      setIsProcessing(true);
      await refundTransaction(transaction.id, refundReason);

      toast.success('Refund processed successfully');

      // Reset form
      setTransaction(null);
      setSelectedItems([]);
      setRefundReason('');
      setTransactionNumber('');
    } catch (error) {
      console.error('Refund error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <RotateCcw className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Returns & Refunds</h2>
      </div>

      {/* Transaction Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transaction Number
        </label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={transactionNumber}
              onChange={(e) => setTransactionNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter transaction number..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isProcessing}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Transaction Details */}
      {transaction && (
        <div className="space-y-6">
          {/* Transaction Info */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-sm text-gray-600">Transaction #</div>
                <div className="font-semibold text-gray-900">
                  {transaction.transactionNumber}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Date</div>
                <div className="font-semibold text-gray-900">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Customer</div>
                <div className="font-semibold text-gray-900">
                  {transaction.customerName || 'Walk-in Customer'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Original Total</div>
                <div className="font-semibold text-blue-600 text-lg">
                  {formatCurrency(transaction.total)}
                </div>
              </div>
            </div>
          </div>

          {/* Items to Return */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Select Items to Return
            </h3>
            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        Original Qty: {item.quantity} × {formatCurrency(item.price)}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">
                          Return Qty
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={item.quantity}
                          value={item.returnQuantity}
                          onChange={(e) =>
                            handleUpdateReturnQuantity(
                              item.id,
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                        />
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-gray-500">Refund</div>
                        <div className="font-bold text-gray-900">
                          {formatCurrency(item.price * item.returnQuantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Refund Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Refund Reason *
            </label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Enter reason for refund..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Refund Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-lg font-semibold text-gray-900">
                  Refund Amount
                </span>
              </div>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(calculateRefundAmount())}
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Important:</p>
                <p>
                  This refund will be processed to the original payment method (
                  {transaction.paymentMethod}). Items will be returned to inventory.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleProcessRefund}
              disabled={
                isProcessing ||
                !selectedItems.some((item) => item.returnQuantity > 0) ||
                !refundReason.trim()
              }
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Process Refund'}
            </button>
            <button
              onClick={() => {
                setTransaction(null);
                setSelectedItems([]);
                setRefundReason('');
                setTransactionNumber('');
              }}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* No Transaction State */}
      {!transaction && !isProcessing && (
        <div className="text-center py-12">
          <RotateCcw className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Search for a transaction to process returns</p>
          <p className="text-gray-400 text-sm mt-2">
            Enter transaction number above and click Search
          </p>
        </div>
      )}
    </div>
  );
};

export default ReturnRefund;
