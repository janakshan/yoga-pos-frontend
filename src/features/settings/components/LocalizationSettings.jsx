import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store';
import { toast } from 'react-hot-toast';

const LocalizationSettings = () => {
  const { t, i18n } = useTranslation();
  const {
    language,
    locale,
    currency,
    currencySymbol,
    dateFormat,
    timeFormat,
    currencies,
    baseCurrency,
    enableMultiCurrency,
    setLanguage,
    setLocale,
    setCurrency,
    setDateFormat,
    setTimeFormat,
    setBaseCurrency,
    toggleMultiCurrency,
    updateCurrency,
  } = useStore();

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    toast.success(t('settings.settingsSaved'));
  };

  const handleCurrencyChange = (code) => {
    const selectedCurrency = currencies.find((c) => c.code === code);
    if (selectedCurrency) {
      setCurrency(code, selectedCurrency.symbol);
      toast.success(t('settings.settingsSaved'));
    }
  };

  const handleSave = () => {
    toast.success(t('settings.settingsSaved'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('settings.localization')}
        </h2>
      </div>

      {/* Language Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('settings.language')}
        </label>
        <select
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
        </select>
      </div>

      {/* Locale Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Locale
        </label>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="es-ES">Español (España)</option>
          <option value="es-MX">Español (México)</option>
          <option value="fr-FR">Français (France)</option>
          <option value="fr-CA">Français (Canada)</option>
        </select>
      </div>

      {/* Currency Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('settings.currency')}
        </label>
        <select
          value={currency}
          onChange={(e) => handleCurrencyChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.name} ({curr.symbol})
            </option>
          ))}
        </select>
      </div>

      {/* Multi-Currency Support */}
      <div className="border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Multi-Currency Support
            </label>
            <p className="text-sm text-gray-500">
              Enable support for multiple currencies
            </p>
          </div>
          <button
            onClick={toggleMultiCurrency}
            className={`
              ${enableMultiCurrency ? 'bg-blue-600' : 'bg-gray-200'}
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
              border-2 border-transparent transition-colors duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
          >
            <span
              className={`
                ${enableMultiCurrency ? 'translate-x-5' : 'translate-x-0'}
                pointer-events-none inline-block h-5 w-5 transform rounded-full
                bg-white shadow ring-0 transition duration-200 ease-in-out
              `}
            />
          </button>
        </div>

        {enableMultiCurrency && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Currency
              </label>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map((curr) => (
                  <option key={curr.code} value={curr.code}>
                    {curr.name} ({curr.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exchange Rates
              </label>
              <div className="bg-gray-50 rounded-md p-4 space-y-2">
                {currencies.map((curr) => (
                  <div key={curr.code} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {curr.code} - {curr.name}
                    </span>
                    <input
                      type="number"
                      step="0.0001"
                      value={curr.rate}
                      onChange={(e) =>
                        updateCurrency(curr.code, {
                          rate: parseFloat(e.target.value) || 1,
                        })
                      }
                      className="w-32 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Date Format */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('settings.dateFormat')}
        </label>
        <select
          value={dateFormat}
          onChange={(e) => setDateFormat(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="MM/dd/yyyy">MM/DD/YYYY</option>
          <option value="dd/MM/yyyy">DD/MM/YYYY</option>
          <option value="yyyy-MM-dd">YYYY-MM-DD</option>
          <option value="dd-MMM-yyyy">DD-MMM-YYYY</option>
        </select>
      </div>

      {/* Time Format */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('settings.timeFormat')}
        </label>
        <select
          value={timeFormat}
          onChange={(e) => setTimeFormat(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="12h">12-hour (AM/PM)</option>
          <option value="24h">24-hour</option>
        </select>
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

export default LocalizationSettings;
