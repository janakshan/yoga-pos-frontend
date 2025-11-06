/**
 * UI Selectors
 * Optimized selectors for accessing UI state
 */

export const selectIsSidebarOpen = (state) => state.isSidebarOpen;
export const selectIsSidebarCollapsed = (state) => state.isSidebarCollapsed;
export const selectActiveModal = (state) => state.activeModal;
export const selectModalData = (state) => state.modalData;
export const selectNotifications = (state) => state.notifications;
