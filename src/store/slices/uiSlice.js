/**
 * UI Store Slice
 * Manages UI state including modals, sidebars, and notifications
 */

export const createUISlice = (set, get) => ({
  // State
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  activeModal: null,
  modalData: null,
  notifications: [],

  // Actions
  toggleSidebar: () =>
    set((state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    }),

  setSidebarOpen: (isOpen) =>
    set((state) => {
      state.isSidebarOpen = isOpen;
    }),

  toggleSidebarCollapse: () =>
    set((state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    }),

  setSidebarCollapsed: (isCollapsed) =>
    set((state) => {
      state.isSidebarCollapsed = isCollapsed;
    }),

  openModal: (modalName, data = null) =>
    set((state) => {
      state.activeModal = modalName;
      state.modalData = data;
    }),

  closeModal: () =>
    set((state) => {
      state.activeModal = null;
      state.modalData = null;
    }),

  addNotification: (notification) =>
    set((state) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        type: 'info', // 'info', 'success', 'warning', 'error'
        duration: 5000,
        ...notification,
      });
    }),

  removeNotification: (id) =>
    set((state) => {
      state.notifications = state.notifications.filter((n) => n.id !== id);
    }),

  clearNotifications: () =>
    set((state) => {
      state.notifications = [];
    }),
});
