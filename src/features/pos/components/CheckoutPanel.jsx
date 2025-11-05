import React, { useState } from 'react';
import { CreditCard, DollarSign, Smartphone, Building2, Receipt } from 'lucide-react';
import { usePos } from '../hooks/usePos';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '../types';
import { formatCurrency, calculateChange } from '../utils/calculations';
import toast from 'react-hot-toast';

/**
 * CheckoutPanel Component
 * Handles payment processing and checkout
 * @returns {JSX.Element}
 */
export const CheckoutPanel = () => {
  const {
    cartItems,
    customerInfo,
    paymentMethod,
    notes,
    processSale,
    updateCustomerInfo,
    updatePaymentMethod,
    updateNotes,
    getCartTotals,
    isLoading,
    generateReceipt,
  } = usePos();

  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [cashReceived, setCashReceived] = useState('');

  const totals = getCartTotals();

  const paymentMethodIcons = {
    [PAYMENT_METHODS.CASH]: DollarSign,
    [PAYMENT_METHODS.CARD]: CreditCard,
    [PAYMENT_METHODS.MOBILE]: Smartphone,
    [PAYMENT_METHODS.UPI]: Smartphone,
    [PAYMENT_METHODS.BANK_TRANSFER]: Building2,
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    // Validate cash payment
    if (paymentMethod === PAYMENT_METHODS.CASH) {
      const received = parseFloat(cashReceived);
      if (!received || received < totals.total) {
        toast.error('Insufficient cash amount');
        return;
      }
    }

    try {
      const transaction = await processSale();
      setLastTransaction(transaction);
      setCashReceived('');
      toast.success('Sale completed! Generating receipt...');

      // Generate and show receipt
      const receipt = await generateReceipt(transaction.id);
      setShowReceipt(true);
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
    setShowReceipt(false);
    setLastTransaction(null);
  };

  const change =
    paymentMethod === PAYMENT_METHODS.CASH && cashReceived
      ? calculateChange(totals.total, parseFloat(cashReceived))
      : 0;

  if (showReceipt && lastTransaction) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <Receipt className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Transaction Complete!
          </h2>
          <p className="text-gray-600">
            Transaction #{lastTransaction.transactionNumber}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(lastTransaction.total)}
              </span>
            </div>
            {paymentMethod === PAYMENT_METHODS.CASH && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cash Received:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(parseFloat(cashReceived))}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-gray-600">Change:</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(change)}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium text-gray-900">
                {PAYMENT_METHOD_LABELS[lastTransaction.paymentMethod]}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePrintReceipt}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Print Receipt
          </button>
          <button
            onClick={() => {
              setShowReceipt(false);
              setLastTransaction(null);
            }}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            New Transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Checkout</h2>

      {/* Customer Information */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Customer Information (Optional)
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerInfo.name}
            onChange={(e) =>
              updateCustomerInfo({ ...customerInfo, name: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="email"
            placeholder="Email"
            value={customerInfo.email}
            onChange={(e) =>
              updateCustomerInfo({ ...customerInfo, email: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={customerInfo.phone}
            onChange={(e) =>
              updateCustomerInfo({ ...customerInfo, phone: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Payment Method
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(PAYMENT_METHODS).map(([key, value]) => {
            const Icon = paymentMethodIcons[value];
            return (
              <button
                key={value}
                onClick={() => updatePaymentMethod(value)}
                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  paymentMethod === value
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {PAYMENT_METHOD_LABELS[value]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cash Payment Input */}
      {paymentMethod === PAYMENT_METHODS.CASH && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cash Received
          </label>
          <input
            type="number"
            step="0.01"
            min={totals.total}
            placeholder={`Minimum: ${formatCurrency(totals.total)}`}
            value={cashReceived}
            onChange={(e) => setCashReceived(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold"
          />
          {cashReceived && parseFloat(cashReceived) >= totals.total && (
            <div className="mt-2 p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Change:
                </span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(change)}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          placeholder="Add transaction notes..."
          value={notes}
          onChange={(e) => updateNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Total Display */}
      <div className="mb-6 bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-700">
            Total Amount:
          </span>
          <span className="text-3xl font-bold text-blue-600">
            {formatCurrency(totals.total)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={cartItems.length === 0 || isLoading}
        className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? 'Processing...' : `Complete Sale (${formatCurrency(totals.total)})`}
      </button>
    </div>
  );
};

export default CheckoutPanel;
