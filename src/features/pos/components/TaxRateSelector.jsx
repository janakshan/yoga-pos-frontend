import React, { useState } from 'react';
import { Calculator, Check } from 'lucide-react';
import { usePos } from '../hooks/usePos';
import toast from 'react-hot-toast';

/**
 * TaxRateSelector Component
 * Select and apply different tax rates
 * @returns {JSX.Element}
 */
export const TaxRateSelector = () => {
  const { taxPercentage, updateTaxPercentage, getCartTotals } = usePos();
  const [customRate, setCustomRate] = useState('');

  const totals = getCartTotals();

  // Predefined tax rates
  const TAX_RATES = [
    { label: 'No Tax', value: 0, description: 'Tax-exempt items' },
    { label: 'GST (5%)', value: 5, description: 'Goods and Services Tax' },
    { label: 'GST (10%)', value: 10, description: 'Standard GST' },
    { label: 'GST (15%)', value: 15, description: 'Higher rate' },
    { label: 'GST (18%)', value: 18, description: 'Standard rate (India)' },
    { label: 'VAT (20%)', value: 20, description: 'Value Added Tax (UK)' },
  ];

  /**
   * Apply tax rate
   */
  const handleApplyTaxRate = (rate) => {
    updateTaxPercentage(rate);
    toast.success(`Tax rate set to ${rate}%`);
  };

  /**
   * Apply custom tax rate
   */
  const handleApplyCustomRate = () => {
    const rate = parseFloat(customRate);

    if (!rate || rate < 0) {
      toast.error('Please enter a valid tax rate');
      return;
    }

    if (rate > 100) {
      toast.error('Tax rate cannot exceed 100%');
      return;
    }

    updateTaxPercentage(rate);
    toast.success(`Custom tax rate set to ${rate}%`);
    setCustomRate('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-4">
        <Calculator className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Tax Rate</h3>
      </div>

      {/* Current Tax Display */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Current Tax Rate</div>
            <div className="text-2xl font-bold text-blue-600">
              {taxPercentage.toFixed(2)}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Tax Amount</div>
            <div className="text-xl font-bold text-gray-900">
              ${totals.tax.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Predefined Tax Rates */}
      <div className="mb-4">
        <div className="text-xs text-gray-600 mb-2">Standard Tax Rates</div>
        <div className="grid grid-cols-2 gap-2">
          {TAX_RATES.map((rate) => (
            <button
              key={rate.label}
              onClick={() => handleApplyTaxRate(rate.value)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                taxPercentage === rate.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-gray-900">{rate.label}</div>
                {taxPercentage === rate.value && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div className="text-xs text-gray-600">{rate.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Tax Rate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Tax Rate
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={customRate}
            onChange={(e) => setCustomRate(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleApplyCustomRate()}
            placeholder="0.00"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleApplyCustomRate}
            disabled={!customRate || parseFloat(customRate) < 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Check className="h-4 w-4" />
            Apply
          </button>
        </div>
      </div>

      {/* Tax Calculation Breakdown */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs text-gray-600 mb-2 font-semibold">
          Tax Calculation
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Discount:</span>
            <span className="font-medium text-red-600">
              -${totals.discount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-1">
            <span className="text-gray-600">Taxable Amount:</span>
            <span className="font-medium">
              ${(totals.subtotal - totals.discount).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax ({taxPercentage.toFixed(2)}%):</span>
            <span className="font-medium text-blue-600">
              ${totals.tax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-1 font-bold">
            <span className="text-gray-900">Total:</span>
            <span className="text-blue-600">${totals.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxRateSelector;
