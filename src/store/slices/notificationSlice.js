/**
 * Notification Store Slice
 * Manages notification preferences and history
 */

export const createNotificationSlice = (set, get) => ({
  // State
  notificationSettings: {
    // Email settings
    email: {
      enabled: false,
      defaultRecipient: '',
      sendOnSale: true,
      sendOnBooking: true,
      sendOnLowStock: true,
      sendOnPaymentDue: true,
      sendOnMembershipExpiry: true,
    },

    // SMS settings
    sms: {
      enabled: false,
      defaultRecipient: '',
      sendOnSale: true,
      sendOnBooking: true,
      sendOnLowStock: false,
      sendOnPaymentDue: true,
      sendOnMembershipExpiry: true,
    },

    // WhatsApp settings
    whatsapp: {
      enabled: false,
      defaultRecipient: '',
      sendOnSale: true,
      sendOnBooking: true,
      sendOnLowStock: false,
      sendOnPaymentDue: true,
      sendOnMembershipExpiry: true,
    },

    // General notification settings
    general: {
      soundEnabled: true,
      toastEnabled: true,
      toastDuration: 3000,
      toastPosition: 'top-right',
    },
  },

  // Notification history
  notificationHistory: [],
  notificationStats: {
    totalSent: 0,
    emailSent: 0,
    smsSent: 0,
    whatsappSent: 0,
    failedSent: 0,
  },

  // Actions

  /**
   * Update notification settings
   */
  updateNotificationSettings: (channel, settings) =>
    set((state) => {
      if (channel === 'general') {
        state.notificationSettings.general = {
          ...state.notificationSettings.general,
          ...settings,
        };
      } else {
        state.notificationSettings[channel] = {
          ...state.notificationSettings[channel],
          ...settings,
        };
      }
    }),

  /**
   * Enable/disable notification channel
   */
  toggleNotificationChannel: (channel, enabled) =>
    set((state) => {
      state.notificationSettings[channel].enabled = enabled;
    }),

  /**
   * Add notification to history
   */
  addNotificationToHistory: (notification) =>
    set((state) => {
      state.notificationHistory.unshift({
        ...notification,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      });

      // Keep only last 100 notifications
      if (state.notificationHistory.length > 100) {
        state.notificationHistory = state.notificationHistory.slice(0, 100);
      }

      // Update stats
      state.notificationStats.totalSent += 1;
      if (notification.success) {
        state.notificationStats[`${notification.channel}Sent`] += 1;
      } else {
        state.notificationStats.failedSent += 1;
      }
    }),

  /**
   * Clear notification history
   */
  clearNotificationHistory: () =>
    set((state) => {
      state.notificationHistory = [];
    }),

  /**
   * Remove notification from history
   */
  removeNotificationFromHistory: (id) =>
    set((state) => {
      state.notificationHistory = state.notificationHistory.filter(
        (notif) => notif.id !== id
      );
    }),

  /**
   * Get notification settings for a channel
   */
  getNotificationSettings: (channel) => {
    const state = get();
    return state.notificationSettings[channel];
  },

  /**
   * Check if notification should be sent for event
   */
  shouldSendNotification: (channel, eventType) => {
    const state = get();
    const settings = state.notificationSettings[channel];

    if (!settings || !settings.enabled) {
      return false;
    }

    // Map event types to settings
    const eventMap = {
      sale: 'sendOnSale',
      booking: 'sendOnBooking',
      lowStock: 'sendOnLowStock',
      payment: 'sendOnPaymentDue',
      membership: 'sendOnMembershipExpiry',
    };

    const settingKey = eventMap[eventType];
    return settingKey ? settings[settingKey] : false;
  },

  /**
   * Get enabled notification channels
   */
  getEnabledChannels: () => {
    const state = get();
    const channels = [];

    if (state.notificationSettings.email.enabled) channels.push('email');
    if (state.notificationSettings.sms.enabled) channels.push('sms');
    if (state.notificationSettings.whatsapp.enabled) channels.push('whatsapp');

    return channels;
  },

  /**
   * Reset notification stats
   */
  resetNotificationStats: () =>
    set((state) => {
      state.notificationStats = {
        totalSent: 0,
        emailSent: 0,
        smsSent: 0,
        whatsappSent: 0,
        failedSent: 0,
      };
    }),
});
