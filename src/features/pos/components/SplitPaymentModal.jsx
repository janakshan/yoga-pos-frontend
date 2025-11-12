import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Users, CreditCard, DollarSign, Smartphone } from 'lucide-react';
import { useStore } from '../../../store';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../types';
import { formatCurrency } from '../utils/calculations';
import toast from 'react-hot-toast';

/**
 * SplitPaymentModal Component
 * Allows splitting payments between multiple people/payment methods
 * @param {boolean} isOpen - Whether modal is open
 * @param {Function} onClose - Close modal callback
 * @param {number} totalAmount - Total amount to split
 * @param {Function} onComplete - Callback when split is complete
 * @returns {JSX.Element}
 */
export const SplitPaymentModal = ({ isOpen, onClose, totalAmount, onComplete }) => {
  const splitPayments = useStore((state) => state.splitPayments);
  const addSplitPayment = useStore((state) => state.addSplitPayment);
  const removeSplitPayment = useStore((state) => state.removeSplitPayment);
  const clearSplitPayments = useStore((state) => state.clearSplitPayments);

  const [splitType, setSplitType] = useState('equal'); // 'equal' or 'custom'
  const [numPeople, setNumPeople] = useState(2);
  const [currentPayment, setCurrentPayment] = useState({
    amount: 0,
    method: PAYMENT_METHODS.CASH,
    paidBy: '',
  });

  useEffect(() => {
    if (isOpen && splitType === 'equal') {
      // Auto-calculate equal splits
      const amountPerPerson = totalAmount / numPeople;
      clearSplitPayments();
      for (let i = 0; i < numPeople; i++) {
        addSplitPayment({
          amount: amountPerPerson,
          method: PAYMENT_METHODS.CASH,
          paidBy: `Person ${i + 1}`,
        });
      }
    }
  }, [isOpen, splitType, numPeople, totalAmount]);

  const totalPaid = splitPayments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = totalAmount - totalPaid;

  const handleAddPayment = () => {
    if (currentPayment.amount <= 0) {
      toast.error('Payment amount must be greater than 0');
      return;
    }

    if (totalPaid + currentPayment.amount > totalAmount) {
      toast.error('Total payments exceed order amount');
      return;
    }

    addSplitPayment(currentPayment);
    setCurrentPayment({
      amount: 0,
      method: PAYMENT_METHODS.CASH,
      paidBy: '',
    });
    toast.success('Payment added');
  };

  const handleComplete = () => {
    if (Math.abs(remaining) > 0.01) {
      toast.error('Total payments must equal order amount');
      return;
    }

    onComplete(splitPayments);
    onClose();
  };

  const handleQuickAmount = (percentage) => {
    const amount = (totalAmount * percentage) / 100;
    setCurrentPayment({ ...currentPayment, amount });
  };

  const paymentMethodIcons = {
    [PAYMENT_METHODS.CASH]: DollarSign,
    [PAYMENT_METHODS.CARD]: CreditCard,
    [PAYMENT_METHODS.MOBILE]: Smartphone,
    [PAYMENT_METHODS.UPI]: Smartphone,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Split Payment</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-100">Total Amount:</span>
            <span className="text-2xl font-bold">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Split Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Split Method
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSplitType('equal')}
                className={`p-3 rounded-lg border-2 font-medium transition-all ${
                  splitType === 'equal'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                Equal Split
              </button>
              <button
                onClick={() => {
                  setSplitType('custom');
                  clearSplitPayments();
                }}
                className={`p-3 rounded-lg border-2 font-medium transition-all ${
                  splitType === 'custom'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
                }`}
              >
                Custom Split
              </button>
            </div>
          </div>

          {/* Equal Split Configuration */}
          {splitType === 'equal' && (
            <div className="mb-6 bg-blue-50 rounded-lg p-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of People
              </label>
              <input
                type="number"
                min="2"
                max="20"
                value={numPeople}
                onChange={(e) => setNumPeople(parseInt(e.target.value) || 2)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
              />
              <div className="mt-3 text-center">
                <div className="text-sm text-gray-600">Amount per person:</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalAmount / numPeople)}
                </div>
              </div>
            </div>
          )}

          {/* Custom Split - Add Payment Form */}
          {splitType === 'custom' && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Add Payment</h3>

              {/* Amount Input */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentPayment.amount || ''}
                  onChange={(e) =>
                    setCurrentPayment({
                      ...currentPayment,
                      amount: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
                  placeholder="Enter amount"
                />
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {[25, 33, 50, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => handleQuickAmount(pct)}
                      className="px-2 py-1 text-xs bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium"
                    >
                      {pct === 100 ? 'Remaining' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(PAYMENT_METHODS).slice(0, 4).map(([key, value]) => {
                    const Icon = paymentMethodIcons[value];
                    return (
                      <button
                        key={value}
                        onClick={() =>
                          setCurrentPayment({ ...currentPayment, method: value })
                        }
                        className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                          currentPayment.method === value
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400 text-gray-700'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {PAYMENT_METHOD_LABELS[value]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Paid By */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paid By (Optional)
                </label>
                <input
                  type="text"
                  value={currentPayment.paidBy}
                  onChange={(e) =>
                    setCurrentPayment({ ...currentPayment, paidBy: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Person name or seat number"
                />
              </div>

              {/* Add Payment Button */}
              <button
                onClick={handleAddPayment}
                disabled={currentPayment.amount <= 0}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="h-5 w-5" />
                Add Payment
              </button>
            </div>
          )}

          {/* Payments List */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              Payments ({splitPayments.length})
            </h3>
            {splitPayments.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No payments added yet
              </div>
            ) : (
              <div className="space-y-2">
                {splitPayments.map((payment, index) => {
                  const Icon = paymentMethodIcons[payment.method];
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div>
                          <div className="font-semibold text-gray-900">
                            {formatCurrency(payment.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {PAYMENT_METHOD_LABELS[payment.method]}
                            {payment.paidBy && ` - ${payment.paidBy}`}
                          </div>
                        </div>
                      </div>
                      {splitType === 'custom' && (
                        <button
                          onClick={() => removeSplitPayment(index)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Paid:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(totalPaid)}
                </span>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-700">Remaining:</span>
                  <span
                    className={`text-lg font-bold ${
                      Math.abs(remaining) < 0.01
                        ? 'text-green-600'
                        : remaining > 0
                        ? 'text-orange-600'
                        : 'text-red-600'
                    }`}
                  >
                    {formatCurrency(remaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              disabled={Math.abs(remaining) > 0.01}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Complete Split Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitPaymentModal;
