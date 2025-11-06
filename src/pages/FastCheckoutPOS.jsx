import React, { useState, useEffect } from 'react';
import {
  Maximize,
  Minimize,
  Monitor,
  Settings,
  Receipt,
  RotateCcw,
  Pause,
  Clock,
  DollarSign,
  CreditCard,
  Tag,
  Percent,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { BarcodeScanner } from '../features/pos/components/BarcodeScanner';
import { ProductSelector } from '../features/pos/components/ProductSelector';
import { Cart } from '../features/pos/components/Cart';
import { CheckoutPanel } from '../features/pos/components/CheckoutPanel';
import { SplitPayment } from '../features/pos/components/SplitPayment';
import { CustomerDisplay } from '../features/pos/components/CustomerDisplay';
import { HoldSales } from '../features/pos/components/HoldSales';
import { ShiftManagement } from '../features/pos/components/ShiftManagement';
import { ReturnRefund } from '../features/pos/components/ReturnRefund';
import { usePos } from '../features/pos/hooks/usePos';

/**
 * FastCheckoutPOS Page
 * Comprehensive POS interface with all features
 * @returns {JSX.Element}
 */
export const FastCheckoutPOS = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState('checkout'); // checkout, returns, holds, shift
  const [showCustomerDisplay, setShowCustomerDisplay] = useState(false);
  const [showSplitPayment, setShowSplitPayment] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);

  const { getCartTotals } = usePos();
  const totals = getCartTotals();

  /**
   * Toggle fullscreen mode
   */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  /**
   * Handle fullscreen change events
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  /**
   * Open customer display in new window
   */
  const openCustomerDisplay = () => {
    const width = 800;
    const height = 600;
    const left = window.screen.width - width;
    const top = 0;

    const displayWindow = window.open(
      '/customer-display',
      'CustomerDisplay',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
    );

    if (displayWindow) {
      setShowCustomerDisplay(true);
      toast.success('Customer display opened');
    } else {
      toast.error('Please allow pop-ups for customer display');
    }
  };

  /**
   * Handle split payment completion
   */
  const handleSplitPaymentComplete = (payments) => {
    console.log('Split payments:', payments);
    // Process the split payments
    // This would integrate with your actual payment processing
    setShowSplitPayment(false);
    toast.success('Split payment processed successfully');
  };

  // Quick action buttons configuration
  const quickActions = [
    {
      icon: RotateCcw,
      label: 'Returns',
      onClick: () => setActiveTab('returns'),
      color: 'blue',
      active: activeTab === 'returns',
    },
    {
      icon: Pause,
      label: 'Hold Sales',
      onClick: () => setActiveTab('holds'),
      color: 'yellow',
      active: activeTab === 'holds',
    },
    {
      icon: Clock,
      label: 'Shift',
      onClick: () => setActiveTab('shift'),
      color: 'green',
      active: activeTab === 'shift',
    },
    {
      icon: CreditCard,
      label: 'Split Pay',
      onClick: () => setShowSplitPayment(true),
      color: 'purple',
      active: false,
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Fast Checkout POS</h1>
              <p className="text-blue-100 text-sm">Point of Sale System</p>
            </div>

            {/* Top Bar Actions */}
            <div className="flex items-center gap-3">
              {/* Tab Navigation */}
              <div className="flex gap-2 bg-white bg-opacity-10 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('checkout')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'checkout'
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <Receipt className="inline h-4 w-4 mr-2" />
                  Checkout
                </button>
                <button
                  onClick={() => setActiveTab('returns')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'returns'
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <RotateCcw className="inline h-4 w-4 mr-2" />
                  Returns
                </button>
                <button
                  onClick={() => setActiveTab('holds')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'holds'
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <Pause className="inline h-4 w-4 mr-2" />
                  Holds
                </button>
                <button
                  onClick={() => setActiveTab('shift')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'shift'
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-white hover:bg-opacity-20'
                  }`}
                >
                  <Clock className="inline h-4 w-4 mr-2" />
                  Shift
                </button>
              </div>

              {/* Utility Buttons */}
              <button
                onClick={openCustomerDisplay}
                className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                title="Open Customer Display"
              >
                <Monitor className="h-5 w-5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="p-2 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'checkout' && (
          <div className="h-full flex gap-6 p-6">
            {/* Left Panel - Products */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
              {/* Barcode Scanner */}
              <BarcodeScanner />

              {/* Product Selector */}
              <div className="flex-1 overflow-hidden">
                <ProductSelector />
              </div>
            </div>

            {/* Middle Panel - Cart */}
            <div className="w-96">
              <Cart />
            </div>

            {/* Right Panel - Checkout */}
            <div className="w-96">
              {showSplitPayment ? (
                <SplitPayment
                  totalAmount={totals.total}
                  onComplete={handleSplitPaymentComplete}
                  onCancel={() => setShowSplitPayment(false)}
                />
              ) : (
                <CheckoutPanel />
              )}
            </div>
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <ReturnRefund />
            </div>
          </div>
        )}

        {activeTab === 'holds' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <HoldSales />
            </div>
          </div>
        )}

        {activeTab === 'shift' && (
          <div className="h-full p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              <ShiftManagement />
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Bar (Bottom) - Only show in checkout mode */}
      {activeTab === 'checkout' && showQuickActions && (
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Quick Stats */}
              <div className="flex items-center gap-6">
                <div>
                  <div className="text-xs text-gray-500">Items</div>
                  <div className="text-lg font-bold text-gray-900">
                    {totals.itemCount || 0}
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div>
                  <div className="text-xs text-gray-500">Subtotal</div>
                  <div className="text-lg font-bold text-gray-900">
                    ${totals.subtotal?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div>
                  <div className="text-xs text-gray-500">Tax</div>
                  <div className="text-lg font-bold text-gray-900">
                    ${totals.tax?.toFixed(2) || '0.00'}
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-300"></div>
                <div>
                  <div className="text-xs text-gray-500">Total</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${totals.total?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  const colorClasses = {
                    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
                    yellow: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
                    green: 'bg-green-100 text-green-600 hover:bg-green-200',
                    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
                  };

                  return (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        action.active
                          ? `bg-${action.color}-600 text-white`
                          : colorClasses[action.color]
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{action.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Helper */}
      <div className="fixed bottom-4 right-4 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-75 hover:opacity-100 transition-opacity">
        <div className="font-semibold mb-1">Keyboard Shortcuts</div>
        <div className="space-y-1">
          <div><span className="font-mono bg-gray-800 px-1 rounded">F11</span> Fullscreen</div>
          <div><span className="font-mono bg-gray-800 px-1 rounded">Scan</span> Barcode Focus</div>
        </div>
      </div>
    </div>
  );
};

export default FastCheckoutPOS;
