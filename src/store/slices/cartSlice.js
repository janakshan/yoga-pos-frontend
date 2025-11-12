/**
 * Cart Store Slice
 * Manages POS cart state including items, quantities, discounts, and totals
 */

export const createCartSlice = (set, get) => ({
  // State
  items: [],
  customer: null,
  discount: 0,
  discountType: 'percentage', // 'percentage' or 'fixed'
  taxRate: 0,
  note: '',

  // Restaurant-specific fields
  tableId: null,
  tableName: null,
  serviceType: 'dine_in', // 'dine_in', 'takeaway', 'delivery', 'online'
  serverId: null,
  serverName: null,
  tip: 0,
  tipType: 'percentage', // 'percentage' or 'fixed'
  splitPayment: false,
  splitPayments: [], // Array of split payment objects

  // Actions
  addItem: (product) =>
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === product.id &&
        JSON.stringify(item.modifiers || []) === JSON.stringify(product.modifiers || [])
      );

      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        state.items[existingItemIndex].quantity += 1;
      } else {
        // New item
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          tax: product.tax || 0,
          image: product.image || null,
          modifiers: product.modifiers || [],
          course: product.courseOrder || null,
          seatNumber: product.seatNumber || null,
          specialInstructions: product.specialInstructions || '',
          kdsStation: product.kdsStation || null,
        });
      }
    }),

  removeItem: (itemId) =>
    set((state) => {
      state.items = state.items.filter((item) => item.id !== itemId);
    }),

  updateQuantity: (itemId, quantity) =>
    set((state) => {
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((item) => item.id !== itemId);
        } else {
          item.quantity = quantity;
        }
      }
    }),

  incrementQuantity: (itemId) =>
    set((state) => {
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.quantity += 1;
      }
    }),

  decrementQuantity: (itemId) =>
    set((state) => {
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.items = state.items.filter((item) => item.id !== itemId);
        }
      }
    }),

  setCustomer: (customer) =>
    set((state) => {
      state.customer = customer;
    }),

  setDiscount: (discount, type = 'percentage') =>
    set((state) => {
      state.discount = discount;
      state.discountType = type;
    }),

  setTaxRate: (taxRate) =>
    set((state) => {
      state.taxRate = taxRate;
    }),

  setNote: (note) =>
    set((state) => {
      state.note = note;
    }),

  // Restaurant-specific actions
  setTable: (tableId, tableName) =>
    set((state) => {
      state.tableId = tableId;
      state.tableName = tableName;
    }),

  setServiceType: (serviceType) =>
    set((state) => {
      state.serviceType = serviceType;
      // Clear table selection if not dine-in
      if (serviceType !== 'dine_in') {
        state.tableId = null;
        state.tableName = null;
      }
    }),

  setServer: (serverId, serverName) =>
    set((state) => {
      state.serverId = serverId;
      state.serverName = serverName;
    }),

  setTip: (tip, tipType = 'percentage') =>
    set((state) => {
      state.tip = tip;
      state.tipType = tipType;
    }),

  setSplitPayment: (enabled) =>
    set((state) => {
      state.splitPayment = enabled;
      if (!enabled) {
        state.splitPayments = [];
      }
    }),

  addSplitPayment: (payment) =>
    set((state) => {
      state.splitPayments.push(payment);
    }),

  removeSplitPayment: (index) =>
    set((state) => {
      state.splitPayments.splice(index, 1);
    }),

  clearSplitPayments: () =>
    set((state) => {
      state.splitPayments = [];
    }),

  updateItemModifiers: (itemId, modifiers) =>
    set((state) => {
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.modifiers = modifiers;
      }
    }),

  updateItemCourse: (itemId, course) =>
    set((state) => {
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.course = course;
      }
    }),

  updateItemSeat: (itemId, seatNumber) =>
    set((state) => {
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.seatNumber = seatNumber;
      }
    }),

  updateItemInstructions: (itemId, instructions) =>
    set((state) => {
      const item = state.items.find((item) => item.id === itemId);
      if (item) {
        item.specialInstructions = instructions;
      }
    }),

  clearCart: () =>
    set((state) => {
      state.items = [];
      state.customer = null;
      state.discount = 0;
      state.discountType = 'percentage';
      state.note = '';
      state.tableId = null;
      state.tableName = null;
      state.serviceType = 'dine_in';
      state.serverId = null;
      state.serverName = null;
      state.tip = 0;
      state.tipType = 'percentage';
      state.splitPayment = false;
      state.splitPayments = [];
    }),

  // Computed values (getters)
  getSubtotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getDiscountAmount: () => {
    const { discount, discountType } = get();
    const subtotal = get().getSubtotal();

    if (discountType === 'percentage') {
      return (subtotal * discount) / 100;
    }
    return discount;
  },

  getTaxAmount: () => {
    const { taxRate } = get();
    const subtotal = get().getSubtotal();
    const discountAmount = get().getDiscountAmount();
    const taxableAmount = subtotal - discountAmount;

    return (taxableAmount * taxRate) / 100;
  },

  getTipAmount: () => {
    const { tip, tipType } = get();
    const subtotal = get().getSubtotal();
    const discountAmount = get().getDiscountAmount();
    const taxAmount = get().getTaxAmount();
    const amountBeforeTip = subtotal - discountAmount + taxAmount;

    if (tipType === 'percentage') {
      return (amountBeforeTip * tip) / 100;
    }
    return tip;
  },

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discountAmount = get().getDiscountAmount();
    const taxAmount = get().getTaxAmount();
    const tipAmount = get().getTipAmount();

    return subtotal - discountAmount + taxAmount + tipAmount;
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },
});
