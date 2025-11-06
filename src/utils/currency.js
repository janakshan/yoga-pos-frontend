/**
 * Currency Utilities
 * Handles multi-currency conversion and formatting
 */

/**
 * Convert amount from one currency to another
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Array} currencies - Array of currency objects with rates
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency, currencies) => {
  if (fromCurrency === toCurrency) return amount;

  const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
  const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;

  // Convert to base currency first, then to target currency
  const baseAmount = amount / fromRate;
  return baseAmount * toRate;
};

/**
 * Format currency value with symbol and locale
 * @param {number} amount - Amount to format
 * @param {string} currencyCode - Currency code (e.g., 'USD')
 * @param {string} locale - Locale for formatting (e.g., 'en-US')
 * @param {boolean} showSymbol - Whether to show currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (
  amount,
  currencyCode = 'USD',
  locale = 'en-US',
  showSymbol = true
) => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback if Intl is not available or currency code is invalid
    const symbol = getCurrencySymbol(currencyCode);
    return showSymbol
      ? `${symbol}${amount.toFixed(2)}`
      : amount.toFixed(2);
  }
};

/**
 * Format currency without symbol
 * @param {number} amount - Amount to format
 * @param {string} locale - Locale for formatting
 * @returns {string} Formatted number string
 */
export const formatNumber = (amount, locale = 'en-US') => {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return amount.toFixed(2);
  }
};

/**
 * Get currency symbol by currency code
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode) => {
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '¥',
    INR: '₹',
    MXN: 'MX$',
    BRL: 'R$',
    ZAR: 'R',
    RUB: '₽',
    KRW: '₩',
    SGD: 'S$',
    HKD: 'HK$',
    NOK: 'kr',
    SEK: 'kr',
    DKK: 'kr',
    PLN: 'zł',
    THB: '฿',
    IDR: 'Rp',
    MYR: 'RM',
    PHP: '₱',
    NZD: 'NZ$',
    TRY: '₺',
    AED: 'د.إ',
    SAR: '﷼',
  };

  return symbols[currencyCode] || currencyCode;
};

/**
 * Parse currency string to number
 * @param {string} value - Currency string
 * @returns {number} Parsed number
 */
export const parseCurrency = (value) => {
  if (typeof value === 'number') return value;

  // Remove all non-numeric characters except decimal point and minus sign
  const cleaned = value.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);

  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Get exchange rate between two currencies
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {Array} currencies - Array of currency objects with rates
 * @returns {number} Exchange rate
 */
export const getExchangeRate = (fromCurrency, toCurrency, currencies) => {
  if (fromCurrency === toCurrency) return 1;

  const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
  const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;

  return toRate / fromRate;
};

/**
 * Round currency amount to specified decimal places
 * @param {number} amount - Amount to round
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} Rounded amount
 */
export const roundCurrency = (amount, decimals = 2) => {
  return Math.round(amount * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Validate currency code
 * @param {string} code - Currency code to validate
 * @param {Array} currencies - Array of supported currencies
 * @returns {boolean} Whether currency code is valid
 */
export const isValidCurrency = (code, currencies) => {
  return currencies.some((c) => c.code === code);
};

/**
 * Get currency name by code
 * @param {string} code - Currency code
 * @param {Array} currencies - Array of currency objects
 * @returns {string} Currency name
 */
export const getCurrencyName = (code, currencies) => {
  return currencies.find((c) => c.code === code)?.name || code;
};
