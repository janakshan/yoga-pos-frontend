/**
 * Settings Store Slice
 * Manages application settings and preferences
 */

export const createSettingsSlice = (set, get) => ({
  // State
  businessType: 'yoga', // 'yoga' or 'restaurant'
  currency: 'USD',
  currencySymbol: '$',
  locale: 'en-US',
  language: 'en', // Language for translations
  dateFormat: 'MM/dd/yyyy',
  timeFormat: '12h', // '12h' or '24h'
  defaultTaxRate: 0,
  defaultPaymentMethod: 'cash',
  printReceipt: true,
  soundEnabled: true,
  receiptFooter: '',
  receiptHeader: '',

  // Multi-currency settings
  currencies: [
    { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
    { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
    { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.50 },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rate: 1.36 },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53 },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 83.12 },
    { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', rate: 17.05 },
  ],
  baseCurrency: 'USD',
  enableMultiCurrency: false,

  // Branding settings
  branding: {
    primaryColor: '#3B82F6', // Blue
    secondaryColor: '#10B981', // Green
    accentColor: '#F59E0B', // Amber
    logo: null,
    favicon: null,
    customCSS: '',
  },

  businessInfo: {
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    taxId: '',
    logo: null,
  },

  // Restaurant-specific settings
  restaurantSettings: {
    enableTableService: false,
    enableKitchenDisplay: false,
    enableCourseManagement: false,
    autoAssignTables: false,
    defaultServiceCharge: 0,
    enableTipping: true,
    tipSuggestions: [10, 15, 20],
    requireServerAssignment: false,
    defaultOrderStatus: 'open',
    enableReservations: false,
  },

  // Hardware settings
  hardware: {
    receiptPrinter: {
      enabled: false,
      type: 'thermal', // 'thermal', 'inkjet', 'laser'
      connectionType: 'usb', // 'usb', 'bluetooth', 'network', 'serial'
      port: '',
      ipAddress: '',
      baudRate: 9600,
      paperWidth: 80, // mm
      characterSet: 'CP437',
      autoCut: true,
      openDrawer: false,
    },
    barcodeScanner: {
      enabled: false,
      type: 'usb', // 'usb', 'bluetooth', 'serial'
      port: '',
      prefix: '',
      suffix: '',
      autoSubmit: true,
    },
    cashDrawer: {
      enabled: false,
      connectionType: 'printer', // 'printer', 'serial', 'usb'
      port: '',
      openOnSale: true,
      pulseWidth: 100, // milliseconds
    },
    customerDisplay: {
      enabled: false,
      type: 'pole', // 'pole', 'tablet', 'monitor'
      connectionType: 'serial', // 'serial', 'usb', 'network'
      port: '',
      ipAddress: '',
      baudRate: 9600,
      lines: 2,
      columns: 20,
    },
  },

  // Actions
  setBusinessType: (businessType) =>
    set((state) => {
      state.businessType = businessType;
    }),

  setCurrency: (currency, symbol) =>
    set((state) => {
      state.currency = currency;
      state.currencySymbol = symbol;
    }),

  setLanguage: (language) =>
    set((state) => {
      state.language = language;
    }),

  setLocale: (locale) =>
    set((state) => {
      state.locale = locale;
    }),

  addCurrency: (currencyData) =>
    set((state) => {
      state.currencies.push(currencyData);
    }),

  updateCurrency: (code, updates) =>
    set((state) => {
      const index = state.currencies.findIndex((c) => c.code === code);
      if (index !== -1) {
        state.currencies[index] = { ...state.currencies[index], ...updates };
      }
    }),

  removeCurrency: (code) =>
    set((state) => {
      state.currencies = state.currencies.filter((c) => c.code !== code);
    }),

  setBaseCurrency: (code) =>
    set((state) => {
      state.baseCurrency = code;
    }),

  toggleMultiCurrency: () =>
    set((state) => {
      state.enableMultiCurrency = !state.enableMultiCurrency;
    }),

  updateBranding: (brandingData) =>
    set((state) => {
      state.branding = { ...state.branding, ...brandingData };
    }),

  setReceiptHeader: (header) =>
    set((state) => {
      state.receiptHeader = header;
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

  updateRestaurantSettings: (settings) =>
    set((state) => {
      state.restaurantSettings = { ...state.restaurantSettings, ...settings };
    }),

  updateHardwareSettings: (category, settings) =>
    set((state) => {
      if (state.hardware[category]) {
        state.hardware[category] = { ...state.hardware[category], ...settings };
      }
    }),

  toggleHardware: (category) =>
    set((state) => {
      if (state.hardware[category]) {
        state.hardware[category].enabled = !state.hardware[category].enabled;
      }
    }),

  resetSettings: () =>
    set((state) => {
      state.businessType = 'yoga';
      state.currency = 'USD';
      state.currencySymbol = '$';
      state.locale = 'en-US';
      state.language = 'en';
      state.dateFormat = 'MM/dd/yyyy';
      state.timeFormat = '12h';
      state.defaultTaxRate = 0;
      state.defaultPaymentMethod = 'cash';
      state.printReceipt = true;
      state.soundEnabled = true;
      state.receiptFooter = '';
      state.receiptHeader = '';
    }),
});
