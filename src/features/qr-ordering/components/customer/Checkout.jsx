/**
 * Checkout Component
 *
 * Order review and payment selection
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCardIcon,
  BanknotesIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { useStore } from '@/store';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { qrOrdering, updateCurrentSession, completeCurrentSession } = useStore();
  const cart = qrOrdering.customerCart;
  const session = qrOrdering.currentSession;

  const [customerInfo, setCustomerInfo] = useState({
    name: session?.customerName || '',
    phone: session?.customerPhone || '',
    email: session?.customerEmail || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [processing, setProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash',
      description: 'Pay with cash when server arrives',
      icon: BanknotesIcon,
      color: 'green'
    },
    {
      id: 'card',
      name: 'Card',
      description: 'Pay with credit/debit card',
      icon: CreditCardIcon,
      color: 'blue'
    },
    {
      id: 'online',
      name: 'Online Payment',
      description: 'Pay now with Stripe/PayPal',
      icon: DevicePhoneMobileIcon,
      color: 'indigo'
    }
  ];

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async () => {
    // Validate customer info if required
    const requiresInfo = session?.qrCodeId?.settings?.requireCustomerInfo;
    if (requiresInfo && (!customerInfo.name || !customerInfo.phone)) {
      toast.error('Please fill in your contact information');
      return;
    }

    setProcessing(true);

    try {
      // Update session with customer info
      await updateCurrentSession({
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email
      });

      // Create order (this would typically call an API)
      const orderData = {
        sessionId: session.id,
        tableId: session.tableId,
        items: cart.items,
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
        paymentMethod,
        customerInfo
      };

      // Simulate order creation
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log('Order placed:', orderData);

      toast.success('Order placed successfully!');

      // Navigate to order tracking
      navigate('/qr/order-tracking');

    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!session || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/qr/menu')}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Go back to menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
            <p className="text-sm text-gray-500">Table {session.tableId}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">
                    {item.quantity}x {item.name}
                  </p>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {item.modifiers.map(m =>
                        m.selections.map(s => s.name).join(', ')
                      ).join(' • ')}
                    </p>
                  )}
                </div>
                <span className="text-gray-900 font-medium">
                  ${item.subtotal.toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>${cart.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Tax (10%)</span>
              <span>${cart.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-300">
              <span>Total</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name {session?.qrCodeId?.settings?.requireCustomerInfo && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleCustomerInfoChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone {session?.qrCodeId?.settings?.requireCustomerInfo && <span className="text-red-500">*</span>}
              </label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleCustomerInfoChange}
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleCustomerInfoChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>

          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <label
                  key={method.id}
                  className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === method.id
                      ? `border-${method.color}-500 bg-${method.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center">
                      <Icon className={`h-5 w-5 text-${method.color}-600 mr-2`} />
                      <span className="font-medium text-gray-900">{method.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{method.description}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={processing}
          className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircleIcon className="h-6 w-6 mr-2" />
              Place Order - ${cart.total.toFixed(2)}
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          By placing this order, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
