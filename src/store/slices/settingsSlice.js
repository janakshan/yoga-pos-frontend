/**
 * Settings Store Slice
 * Manages application settings and preferences
 */

export const createSettingsSlice = (set, get) => ({
  // State
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
  dateFormat: 'MM/dd/yyyy',
  timeFormat: '12h', // '12h' or '24h'
  defaultTaxRate: 0,
  defaultPaymentMethod: 'cash',
  printReceipt: true,
  soundEnabled: true,
  receiptFooter: '',
  businessInfo: {
    name: '',
    address: '',
    phone: '',
    email: '',
    logo: null,
  },

  // Actions
  setCurrency: (currency, symbol) =>
    set((state) => {
      state.currency = currency;
      state.currencySymbol = symbol;
    }),

  setLocale: (locale) =>
    set((state) => {
      state.locale = locale;
    }),

  setDateFormat: (format) =>
    set((state) => {
      state.dateFormat = format;
    }),

  setTimeFormat: (format) =>
    set((state) => {
      state.timeFormat = format;
    }),

  setDefaultTaxRate: (rate) =>
    set((state) => {
      state.defaultTaxRate = rate;
    }),

  setDefaultPaymentMethod: (method) =>
    set((state) => {
      state.defaultPaymentMethod = method;
    }),

  togglePrintReceipt: () =>
    set((state) => {
      state.printReceipt = !state.printReceipt;
    }),

  setPrintReceipt: (value) =>
    set((state) => {
      state.printReceipt = value;
    }),

  toggleSound: () =>
    set((state) => {
      state.soundEnabled = !state.soundEnabled;
    }),

  setSoundEnabled: (value) =>
    set((state) => {
      state.soundEnabled = value;
    }),

  setReceiptFooter: (footer) =>
    set((state) => {
      state.receiptFooter = footer;
    }),

  updateBusinessInfo: (info) =>
    set((state) => {
      state.businessInfo = { ...state.businessInfo, ...info };
    }),

  resetSettings: () =>
    set((state) => {
      state.currency = 'USD';
      state.currencySymbol = '$';
      state.locale = 'en-US';
      state.dateFormat = 'MM/dd/yyyy';
      state.timeFormat = '12h';
      state.defaultTaxRate = 0;
      state.defaultPaymentMethod = 'cash';
      state.printReceipt = true;
      state.soundEnabled = true;
      state.receiptFooter = '';
    }),
});
