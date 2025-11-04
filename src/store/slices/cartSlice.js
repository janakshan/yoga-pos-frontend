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

  // Actions
  addItem: (product) =>
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === product.id
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

  clearCart: () =>
    set((state) => {
      state.items = [];
      state.customer = null;
      state.discount = 0;
      state.discountType = 'percentage';
      state.note = '';
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

  getTotal: () => {
    const subtotal = get().getSubtotal();
    const discountAmount = get().getDiscountAmount();
    const taxAmount = get().getTaxAmount();

    return subtotal - discountAmount + taxAmount;
  },

  getItemCount: () => {
    const { items } = get();
    return items.reduce((count, item) => count + item.quantity, 0);
  },
});
