/**
 * QR Landing Page Component
 *
 * Entry point when customer scans QR code
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QrCodeIcon, UserGroupIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store';
import toast from 'react-hot-toast';

const QRLanding = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { createQRSession, fetchQRCodeByCode, qrOrdering } = useStore();

  const [loading, setLoading] = useState(true);
  const [qrCode, setQrCode] = useState(null);
  const [customerCount, setCustomerCount] = useState(2);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (code) {
      loadQRCode();
    }
  }, [code]);

  const loadQRCode = async () => {
    setLoading(true);
    try {
      const qr = await fetchQRCodeByCode(code);

      if (!qr) {
        toast.error('Invalid QR code');
        return;
      }

      if (qr.status !== 'active') {
        toast.error('This QR code is no longer active');
        return;
      }

      setQrCode(qr);
    } catch (error) {
      console.error('Error loading QR code:', error);
      toast.error('Failed to load QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = async () => {
    if (!qrCode) return;

    // Validate customer info if required
    if (qrCode.settings.requireCustomerInfo) {
      if (!customerInfo.name.trim() || !customerInfo.phone.trim()) {
        toast.error('Please fill in your name and phone number');
        return;
      }
    }

    setLoading(true);

    try {
      const sessionData = {
        customerCount,
        customerName: customerInfo.name || null,
        customerPhone: customerInfo.phone || null,
        customerEmail: customerInfo.email || null
      };

      await createQRSession(code, sessionData);

      toast.success('Welcome! Loading menu...');
      navigate('/qr/menu');
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to start session. Please try again.');
      setLoading(false);
    }
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && !qrCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!qrCode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-500 to-pink-600">
        <div className="text-center text-white p-8">
          <QrCodeIcon className="h-24 w-24 mx-auto mb-6 opacity-50" />
          <h1 className="text-3xl font-bold mb-4">Invalid QR Code</h1>
          <p className="text-lg">
            The QR code you scanned is not valid or has expired.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center">
            <QrCodeIcon className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
            <p className="text-indigo-100">
              Table {qrCode.tableId}
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to Order?
              </h2>
              <p className="text-gray-600">
                Browse our menu and place your order directly from your phone
              </p>
            </div>

            {/* Customer Count */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Guests
              </label>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setCustomerCount(Math.max(1, customerCount - 1))}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700"
                >
                  -
                </button>
                <div className="flex items-center">
                  <UserGroupIcon className="h-8 w-8 text-indigo-600 mr-2" />
                  <span className="text-3xl font-bold text-gray-900">{customerCount}</span>
                </div>
                <button
                  onClick={() => setCustomerCount(customerCount + 1)}
                  className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Customer Info (if required) */}
            {qrCode.settings.requireCustomerInfo && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleCustomerInfoChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleCustomerInfoChange}
                    placeholder="Enter your phone number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Features */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Browse full menu with photos</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Customize your order</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Track your order in real-time</span>
              </div>
              <div className="flex items-center text-gray-700">
                <svg className="h-5 w-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Call server or request bill anytime</span>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartSession}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Starting Session...
                </>
              ) : (
                <>
                  View Menu
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </>
              )}
            </button>

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Your session will remain active for {qrCode.settings.sessionTimeout} minutes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRLanding;
