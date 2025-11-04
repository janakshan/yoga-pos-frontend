/**
 * Cart Selectors
 * Optimized selectors for accessing cart state
 */

export const selectCartItems = (state) => state.items;
export const selectCartCustomer = (state) => state.customer;
export const selectCartDiscount = (state) => state.discount;
export const selectCartDiscountType = (state) => state.discountType;
export const selectCartTaxRate = (state) => state.taxRate;
export const selectCartNote = (state) => state.note;

// Computed selectors
export const selectCartSubtotal = (state) => state.getSubtotal();
export const selectCartDiscountAmount = (state) => state.getDiscountAmount();
export const selectCartTaxAmount = (state) => state.getTaxAmount();
export const selectCartTotal = (state) => state.getTotal();
export const selectCartItemCount = (state) => state.getItemCount();
export const selectIsCartEmpty = (state) => state.items.length === 0;
