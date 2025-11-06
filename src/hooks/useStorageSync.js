import { useEffect } from 'react';
import { useStore } from '../store';

/**
 * Hook to sync Zustand store across browser windows/tabs
 * Listens to localStorage changes and updates the store accordingly
 */
export const useStorageSync = () => {
  useEffect(() => {
    const handleStorageChange = (e) => {
      // Only respond to changes in our app's storage
      if (e.key === 'yoga-pos-storage' && e.newValue) {
        try {
          const newState = JSON.parse(e.newValue);
          const currentState = useStore.getState();

          // Update cart items if they've changed
          if (JSON.stringify(newState.state.cartItems) !== JSON.stringify(currentState.cartItems)) {
            // Batch all POS state updates together
            useStore.setState({
              cartItems: newState.state.cartItems || [],
              selectedCustomerId: newState.state.selectedCustomerId || null,
              customerInfo: newState.state.customerInfo || { name: '', email: '', phone: '' },
              paymentMethod: newState.state.paymentMethod || 'cash',
              discountPercentage: newState.state.discountPercentage || 0,
              taxPercentage: newState.state.taxPercentage || 0,
              notes: newState.state.notes || '',
            });
          }
        } catch (error) {
          console.error('Error syncing storage:', error);
        }
      }
    };

    // Listen to storage events (fired when localStorage changes in another window)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
};

export default useStorageSync;
