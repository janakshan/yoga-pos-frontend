/**
 * UI Store Slice
 * Manages UI state including modals, sidebars, notifications, and theme
 */

export const createUISlice = (set, get) => ({
  // State
  isSidebarOpen: true,
  isSidebarCollapsed: false,
  activeModal: null,
  modalData: null,
  theme: 'light', // 'light' or 'dark'
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

  setTheme: (theme) =>
    set((state) => {
      state.theme = theme;
      // Update HTML class for Tailwind dark mode
      if (typeof document !== 'undefined') {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    }),

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      // Update HTML class for Tailwind dark mode
      if (typeof document !== 'undefined') {
        if (newTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
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
