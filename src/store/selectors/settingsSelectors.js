/**
 * Settings Selectors
 * Optimized selectors for accessing settings state
 */

export const selectCurrency = (state) => state.currency;
export const selectCurrencySymbol = (state) => state.currencySymbol;
export const selectLocale = (state) => state.locale;
export const selectDateFormat = (state) => state.dateFormat;
export const selectTimeFormat = (state) => state.timeFormat;
export const selectDefaultTaxRate = (state) => state.defaultTaxRate;
export const selectDefaultPaymentMethod = (state) => state.defaultPaymentMethod;
export const selectPrintReceipt = (state) => state.printReceipt;
export const selectSoundEnabled = (state) => state.soundEnabled;
export const selectReceiptFooter = (state) => state.receiptFooter;
export const selectBusinessInfo = (state) => state.businessInfo;
