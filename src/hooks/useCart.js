import { useCartStore } from '@/store';
import {
  selectCartItems,
  selectCartCustomer,
  selectCartSubtotal,
  selectCartTotal,
  selectCartItemCount,
  selectIsCartEmpty,
} from '@/store';

/**
 * Custom hook for cart management
 * Provides easy access to cart state and actions
 */
export const useCart = () => {
  const items = useCartStore(selectCartItems);
  const customer = useCartStore(selectCartCustomer);
  const subtotal = useCartStore(selectCartSubtotal);
  const total = useCartStore(selectCartTotal);
  const itemCount = useCartStore(selectCartItemCount);
  const isEmpty = useCartStore(selectIsCartEmpty);

  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const setCustomer = useCartStore((state) => state.setCustomer);
  const setDiscount = useCartStore((state) => state.setDiscount);
  const setTaxRate = useCartStore((state) => state.setTaxRate);
  const clearCart = useCartStore((state) => state.clearCart);

  return {
    items,
    customer,
    subtotal,
    total,
    itemCount,
    isEmpty,
    addItem,
    removeItem,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    setCustomer,
    setDiscount,
    setTaxRate,
    clearCart,
  };
};
