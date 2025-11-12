import React, { useState } from 'react';
import { Heart, DollarSign, Percent } from 'lucide-react';
import { useStore } from '../../../store';
import { formatCurrency } from '../utils/calculations';

/**
 * TippingPanel Component
 * Allows customers/staff to add tips to orders
 * @returns {JSX.Element}
 */
export const TippingPanel = () => {
  const tip = useStore((state) => state.tip);
  const tipType = useStore((state) => state.tipType);
  const setTip = useStore((state) => state.setTip);
  const getCartTotals = useStore((state) => state.getCartTotals);
  const getTipAmount = useStore((state) => state.getTipAmount);

  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const totals = getCartTotals();
  const subtotalBeforeTip = totals.subtotal - totals.discount + totals.tax;
  const tipAmount = getTipAmount();

  // Preset tip percentages
  const presetPercentages = [10, 15, 18, 20, 25];

  const handlePresetTip = (percentage) => {
    setTip(percentage, 'percentage');
    setShowCustom(false);
    setCustomAmount('');
  };

  const handleCustomPercentage = () => {
    const percentage = parseFloat(customAmount);
    if (!isNaN(percentage) && percentage >= 0) {
      setTip(percentage, 'percentage');
      setCustomAmount('');
      setShowCustom(false);
    }
  };

  const handleCustomFixed = () => {
    const amount = parseFloat(customAmount);
    if (!isNaN(amount) && amount >= 0) {
      setTip(amount, 'fixed');
      setCustomAmount('');
      setShowCustom(false);
    }
  };

  const handleNoTip = () => {
    setTip(0, 'percentage');
    setShowCustom(false);
    setCustomAmount('');
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-pink-500" />
        <h3 className="text-lg font-bold text-gray-900">Add Tip</h3>
      </div>

      {/* Preset Tip Buttons */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {presetPercentages.map((percentage) => {
          const isSelected = tip === percentage && tipType === 'percentage';
          const calculatedTip = (subtotalBeforeTip * percentage) / 100;

          return (
            <button
              key={percentage}
              onClick={() => handlePresetTip(percentage)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-pink-500 bg-pink-50 text-pink-700'
                  : 'border-gray-300 hover:border-pink-300 text-gray-700'
              }`}
            >
              <span className="text-lg font-bold">{percentage}%</span>
              <span className="text-xs text-gray-500">
                {formatCurrency(calculatedTip)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Tip and No Tip Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
            showCustom
              ? 'border-pink-500 bg-pink-50 text-pink-700'
              : 'border-gray-300 hover:border-pink-300 text-gray-700'
          }`}
        >
          <DollarSign className="h-5 w-5" />
          <span className="font-semibold">Custom</span>
        </button>
        <button
          onClick={handleNoTip}
          className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
            tip === 0
              ? 'border-gray-400 bg-gray-100 text-gray-700'
              : 'border-gray-300 hover:border-gray-400 text-gray-700'
          }`}
        >
          <span className="font-semibold">No Tip</span>
        </button>
      </div>

      {/* Custom Tip Input */}
      {showCustom && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Tip Amount
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCustomPercentage}
              disabled={!customAmount}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              <Percent className="h-4 w-4" />
              As %
            </button>
            <button
              onClick={handleCustomFixed}
              disabled={!customAmount}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
            >
              <DollarSign className="h-4 w-4" />
              Fixed
            </button>
          </div>
        </div>
      )}

      {/* Tip Summary */}
      {tipAmount > 0 && (
        <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Tip Amount:
            </span>
            <div className="text-right">
              <div className="text-lg font-bold text-pink-600">
                {formatCurrency(tipAmount)}
              </div>
              {tipType === 'percentage' && (
                <div className="text-xs text-gray-500">{tip}% of bill</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TippingPanel;
