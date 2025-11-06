import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * EmailReceipt Component
 * Send receipt via email
 * @param {Object} props
 * @param {Object} props.transaction - Transaction data
 * @param {Object} props.receipt - Receipt data
 * @param {Function} props.onClose - Close callback
 * @returns {JSX.Element}
 */
export const EmailReceipt = ({ transaction, receipt, onClose }) => {
  const [email, setEmail] = useState(transaction?.customerEmail || '');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  /**
   * Send email receipt
   */
  const handleSendEmail = async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSending(true);

    try {
      // Simulate email sending (in production, this would call your email API)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock email service
      console.log('Sending receipt to:', email);
      console.log('Transaction:', transaction);
      console.log('Receipt:', receipt);

      setIsSent(true);
      toast.success(`Receipt sent to ${email}`);

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error('Failed to send email');
      console.error('Email error:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex items-center gap-3 mb-6">
          <Mail className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Email Receipt</h3>
        </div>

        {!isSent ? (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendEmail()}
                placeholder="customer@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                disabled={isSending}
              />
            </div>

            {/* Transaction Summary */}
            {transaction && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Receipt Details</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction #:</span>
                    <span className="font-medium text-gray-900">
                      {transaction.transactionNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-bold text-gray-900">
                      ${transaction.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium text-gray-900">
                      {transaction.items.length}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSendEmail}
                disabled={isSending || !email.includes('@')}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Receipt
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                disabled={isSending}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Receipt Sent!
            </h3>
            <p className="text-gray-600">
              The receipt has been sent to <strong>{email}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailReceipt;
