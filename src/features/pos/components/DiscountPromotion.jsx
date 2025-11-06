import React, { useState } from 'react';
import { Tag, Percent, DollarSign, X, Check, Gift } from 'lucide-react';
import { usePos } from '../hooks/usePos';
import { formatCurrency } from '../utils/calculations';
import toast from 'react-hot-toast';

/**
 * DiscountPromotion Component
 * Apply discounts and promotions to cart
 * @returns {JSX.Element}
 */
export const DiscountPromotion = () => {
  const {
    discountPercentage,
    updateDiscountPercentage,
    getCartTotals,
  } = usePos();

  const [discountType, setDiscountType] = useState('percentage'); // percentage | fixed
  const [discountValue, setDiscountValue] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const totals = getCartTotals();

  // Mock promotion codes
  const PROMO_CODES = {
    'WELCOME10': { type: 'percentage', value: 10, description: 'Welcome discount - 10% off' },
    'SAVE20': { type: 'percentage', value: 20, description: 'Special offer - 20% off' },
    'FLAT50': { type: 'fixed', value: 50, description: 'Flat $50 discount' },
    'YOGA25': { type: 'percentage', value: 25, description: 'Yoga enthusiast - 25% off' },
  };

  /**
   * Apply discount
   */
  const handleApplyDiscount = () => {
    const value = parseFloat(discountValue);

    if (!value || value <= 0) {
      toast.error('Please enter a valid discount value');
      return;
    }

    if (discountType === 'percentage') {
      if (value > 100) {
        toast.error('Discount percentage cannot exceed 100%');
        return;
      }
      updateDiscountPercentage(value);
      toast.success(`Applied ${value}% discount`);
    } else {
      // Fixed amount - convert to percentage based on subtotal
      if (value > totals.subtotal) {
        toast.error('Discount amount cannot exceed subtotal');
        return;
      }
      const percentage = (value / totals.subtotal) * 100;
      updateDiscountPercentage(percentage);
      toast.success(`Applied ${formatCurrency(value)} discount`);
    }

    setDiscountValue('');
  };

  /**
   * Apply promo code
   */
  const handleApplyPromoCode = () => {
    const code = promoCode.toUpperCase().trim();

    if (!code) {
      toast.error('Please enter a promo code');
      return;
    }

    const promo = PROMO_CODES[code];

    if (!promo) {
      toast.error('Invalid promo code');
      return;
    }

    if (promo.type === 'percentage') {
      updateDiscountPercentage(promo.value);
      toast.success(`Applied promo: ${promo.description}`);
    } else {
      const percentage = (promo.value / totals.subtotal) * 100;
      updateDiscountPercentage(percentage);
      toast.success(`Applied promo: ${promo.description}`);
    }

    setPromoCode('');
  };

  /**
   * Clear discount
   */
  const handleClearDiscount = () => {
    updateDiscountPercentage(0);
    toast.success('Discount removed');
  };

  /**
   * Quick discount buttons
   */
  const quickDiscounts = [5, 10, 15, 20, 25, 50];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-4">
        <Tag className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">Discounts & Promotions</h3>
      </div>

      {/* Current Discount Display */}
      {discountPercentage > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Active Discount: {discountPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">
                  Saving {formatCurrency(totals.discount)}
                </div>
              </div>
            </div>
            <button
              onClick={handleClearDiscount}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Discount Type Toggle */}
      <div className="mb-4">
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setDiscountType('percentage')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
              discountType === 'percentage'
                ? 'bg-white text-purple-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Percent className="h-4 w-4" />
            Percentage
          </button>
          <button
            onClick={() => setDiscountType('fixed')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
              discountType === 'fixed'
                ? 'bg-white text-purple-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <DollarSign className="h-4 w-4" />
            Fixed Amount
          </button>
        </div>
      </div>

      {/* Quick Discount Buttons */}
      <div className="mb-4">
        <div className="text-xs text-gray-600 mb-2">Quick Discounts</div>
        <div className="grid grid-cols-6 gap-2">
          {quickDiscounts.map((discount) => (
            <button
              key={discount}
              onClick={() => {
                updateDiscountPercentage(discount);
                toast.success(`Applied ${discount}% discount`);
              }}
              className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 font-semibold text-sm transition-colors"
            >
              {discount}%
            </button>
          ))}
        </div>
      </div>

      {/* Manual Discount Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            max={discountType === 'percentage' ? 100 : totals.subtotal}
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyDiscount()}
            placeholder={discountType === 'percentage' ? '0.00' : '0.00'}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleApplyDiscount}
            disabled={!discountValue || parseFloat(discountValue) <= 0}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="h-4 w-4" />
            Apply
          </button>
        </div>
      </div>

      {/* Promo Code Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
            placeholder="Enter promo code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent uppercase"
          />
          <button
            onClick={handleApplyPromoCode}
            disabled={!promoCode.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="h-4 w-4" />
            Redeem
          </button>
        </div>

        {/* Available Promo Codes (for demo) */}
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs font-semibold text-blue-900 mb-2">
            Available Promo Codes (Demo):
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(PROMO_CODES).map(([code, promo]) => (
              <div
                key={code}
                className="bg-white px-2 py-1 rounded border border-blue-200"
              >
                <div className="font-mono font-bold text-blue-700">{code}</div>
                <div className="text-gray-600">{promo.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountPromotion;
