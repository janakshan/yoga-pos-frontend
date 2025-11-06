import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Smartphone, Building2, Plus, X, Check } from 'lucide-react';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../types';
import { formatCurrency } from '../utils/calculations';
import toast from 'react-hot-toast';

/**
 * SplitPayment Component
 * Handles multiple payment methods in a single transaction
 * @param {Object} props
 * @param {number} props.totalAmount - Total amount to be paid
 * @param {Function} props.onComplete - Callback when payment is complete
 * @param {Function} props.onCancel - Callback to cancel split payment
 * @returns {JSX.Element}
 */
export const SplitPayment = ({ totalAmount, onComplete, onCancel }) => {
  const [payments, setPayments] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS.CASH);
  const [paymentAmount, setPaymentAmount] = useState('');

  const paymentMethodIcons = {
    [PAYMENT_METHODS.CASH]: DollarSign,
    [PAYMENT_METHODS.CARD]: CreditCard,
    [PAYMENT_METHODS.MOBILE]: Smartphone,
    [PAYMENT_METHODS.UPI]: Smartphone,
    [PAYMENT_METHODS.BANK_TRANSFER]: Building2,
  };

  // Calculate remaining amount
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingAmount = totalAmount - totalPaid;
  const isFullyPaid = remainingAmount <= 0;

  /**
   * Add a payment
   */
  const handleAddPayment = () => {
    const amount = parseFloat(paymentAmount);

    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (amount > remainingAmount) {
      toast.error(`Amount cannot exceed remaining ${formatCurrency(remainingAmount)}`);
      return;
    }

    const newPayment = {
      id: `payment-${Date.now()}`,
      method: selectedMethod,
      amount: amount,
      timestamp: new Date(),
    };

    setPayments([...payments, newPayment]);
    setPaymentAmount('');
    toast.success(`Added ${PAYMENT_METHOD_LABELS[selectedMethod]} payment`);

    // Auto-complete if fully paid
    if (amount === remainingAmount) {
      setTimeout(() => {
        handleComplete();
      }, 500);
    }
  };

  /**
   * Remove a payment
   * @param {string} paymentId
   */
  const handleRemovePayment = (paymentId) => {
    setPayments(payments.filter((p) => p.id !== paymentId));
    toast.success('Payment removed');
  };

  /**
   * Quick add remaining amount
   */
  const handleQuickAddRemaining = () => {
    if (remainingAmount <= 0) return;
    setPaymentAmount(remainingAmount.toFixed(2));
  };

  /**
   * Complete split payment
   */
  const handleComplete = () => {
    if (!isFullyPaid) {
      toast.error('Payment incomplete. Please pay the remaining amount.');
      return;
    }

    onComplete(payments);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Split Payment</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Total and Remaining Display */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Total Amount:</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Paid:</span>
            <span className="text-xl font-semibold text-green-600">
              {formatCurrency(totalPaid)}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-blue-200">
            <span className="text-gray-700 font-medium">Remaining:</span>
            <span className={`text-2xl font-bold ${isFullyPaid ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(Math.max(0, remainingAmount))}
            </span>
          </div>
        </div>
      </div>

      {/* Add Payment Section */}
      {!isFullyPaid && (
        <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Add Payment Method
          </h3>

          {/* Payment Method Selection */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.entries(PAYMENT_METHODS).map(([key, value]) => {
              const Icon = paymentMethodIcons[value];
              return (
                <button
                  key={value}
                  onClick={() => setSelectedMethod(value)}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    selectedMethod === value
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    {PAYMENT_METHOD_LABELS[value]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                max={remainingAmount}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleQuickAddRemaining}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium whitespace-nowrap"
              >
                Full Amount
              </button>
            </div>

            <button
              onClick={handleAddPayment}
              disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Payment
            </button>
          </div>
        </div>
      )}

      {/* Payments List */}
      {payments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Applied Payments ({payments.length})
          </h3>
          <div className="space-y-2">
            {payments.map((payment) => {
              const Icon = paymentMethodIcons[payment.method];
              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {PAYMENT_METHOD_LABELS[payment.method]}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(payment.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>
                    {!isFullyPaid && (
                      <button
                        onClick={() => handleRemovePayment(payment.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {isFullyPaid && (
          <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200 mb-3">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-green-700 font-semibold">Payment Complete!</span>
          </div>
        )}

        <button
          onClick={handleComplete}
          disabled={!isFullyPaid}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isFullyPaid ? 'Complete Transaction' : `Pay Remaining ${formatCurrency(remainingAmount)}`}
        </button>

        <button
          onClick={onCancel}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SplitPayment;
