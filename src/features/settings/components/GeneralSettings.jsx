import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store';
import { toast } from 'react-hot-toast';

const GeneralSettings = () => {
  const { t } = useTranslation();
  const {
    defaultTaxRate,
    defaultPaymentMethod,
    printReceipt,
    soundEnabled,
    receiptFooter,
    receiptHeader,
    setDefaultTaxRate,
    setDefaultPaymentMethod,
    togglePrintReceipt,
    toggleSound,
    setReceiptFooter,
    setReceiptHeader,
  } = useStore();

  const handleSave = () => {
    toast.success(t('settings.settingsSaved'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('settings.general')}
        </h2>
      </div>

      {/* Tax Rate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('settings.taxRate')} (%)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={defaultTaxRate}
          onChange={(e) => setDefaultTaxRate(parseFloat(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Default Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('settings.defaultPaymentMethod')}
        </label>
        <select
          value={defaultPaymentMethod}
          onChange={(e) => setDefaultPaymentMethod(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="cash">{t('pos.cash')}</option>
          <option value="card">{t('pos.card')}</option>
          <option value="mobile">{t('pos.mobile')}</option>
        </select>
      </div>

      {/* Receipt Header */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('settings.receiptHeader')}
        </label>
        <textarea
          value={receiptHeader}
          onChange={(e) => setReceiptHeader(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('settings.receiptHeader')}
        />
      </div>

      {/* Receipt Footer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('settings.receiptFooter')}
        </label>
        <textarea
          value={receiptFooter}
          onChange={(e) => setReceiptFooter(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t('settings.receiptFooter')}
        />
      </div>

      {/* Toggle Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t('settings.autoPrint')}
            </label>
            <p className="text-sm text-gray-500">
              Automatically print receipt after sale
            </p>
          </div>
          <button
            onClick={togglePrintReceipt}
            className={`
              ${printReceipt ? 'bg-blue-600' : 'bg-gray-200'}
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
              border-2 border-transparent transition-colors duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
          >
            <span
              className={`
                ${printReceipt ? 'translate-x-5' : 'translate-x-0'}
                pointer-events-none inline-block h-5 w-5 transform rounded-full
                bg-white shadow ring-0 transition duration-200 ease-in-out
              `}
            />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t('settings.soundEnabled')}
            </label>
            <p className="text-sm text-gray-500">
              Enable sound effects and notifications
            </p>
          </div>
          <button
            onClick={toggleSound}
            className={`
              ${soundEnabled ? 'bg-blue-600' : 'bg-gray-200'}
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
              border-2 border-transparent transition-colors duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
          >
            <span
              className={`
                ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}
                pointer-events-none inline-block h-5 w-5 transform rounded-full
                bg-white shadow ring-0 transition duration-200 ease-in-out
              `}
            />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t('common.save')}
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;
