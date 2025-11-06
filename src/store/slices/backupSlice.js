/**
 * Backup Store Slice
 * Manages backup settings, history, and automation
 */

export const createBackupSlice = (set, get) => ({
  // State
  backupSettings: {
    // Automated backup settings
    autoBackup: {
      enabled: false,
      frequency: 'daily', // 'hourly', 'daily', 'weekly', 'monthly'
      time: '02:00', // 24-hour format for daily backups
      cloudProvider: null, // 'google', 'dropbox', 'aws'
      localBackup: true,
      cloudBackup: false,
      encryptionEnabled: true,
      maxBackups: 10, // Maximum number of auto-backups to keep
    },

    // Encryption settings
    encryption: {
      enabled: true,
      algorithm: 'AES-256-GCM',
      passwordProtected: false,
    },

    // Cloud provider settings
    cloudProviders: {
      google: {
        enabled: false,
        authenticated: false,
        folderPath: '/YogaPOS Backups',
      },
      dropbox: {
        enabled: false,
        authenticated: false,
        folderPath: '/YogaPOS Backups',
      },
      aws: {
        enabled: false,
        authenticated: false,
        bucket: 'yoga-pos-backups',
        region: 'us-east-1',
      },
    },
  },

  // Backup status
  backupStatus: {
    isBackingUp: false,
    isRestoring: false,
    lastBackupTime: null,
    lastBackupSuccess: null,
    nextScheduledBackup: null,
    currentOperation: null,
  },

  // Backup statistics
  backupStats: {
    totalBackups: 0,
    localBackups: 0,
    cloudBackups: 0,
    failedBackups: 0,
    lastBackupSize: 0,
    totalStorageUsed: 0,
  },

  // Actions

  /**
   * Update backup settings
   */
  updateBackupSettings: (category, settings) =>
    set((state) => {
      if (category === 'autoBackup') {
        state.backupSettings.autoBackup = {
          ...state.backupSettings.autoBackup,
          ...settings,
        };
      } else if (category === 'encryption') {
        state.backupSettings.encryption = {
          ...state.backupSettings.encryption,
          ...settings,
        };
      } else if (category === 'cloudProviders') {
        const provider = Object.keys(settings)[0];
        state.backupSettings.cloudProviders[provider] = {
          ...state.backupSettings.cloudProviders[provider],
          ...settings[provider],
        };
      }
    }),

  /**
   * Toggle auto backup
   */
  toggleAutoBackup: (enabled) =>
    set((state) => {
      state.backupSettings.autoBackup.enabled = enabled;
    }),

  /**
   * Toggle cloud provider
   */
  toggleCloudProvider: (provider, enabled) =>
    set((state) => {
      state.backupSettings.cloudProviders[provider].enabled = enabled;
    }),

  /**
   * Update cloud provider authentication status
   */
  setCloudProviderAuth: (provider, authenticated) =>
    set((state) => {
      state.backupSettings.cloudProviders[provider].authenticated = authenticated;
    }),

  /**
   * Update backup status
   */
  updateBackupStatus: (status) =>
    set((state) => {
      state.backupStatus = {
        ...state.backupStatus,
        ...status,
      };
    }),

  /**
   * Set backup in progress
   */
  setBackupInProgress: (isBackingUp, operation = null) =>
    set((state) => {
      state.backupStatus.isBackingUp = isBackingUp;
      state.backupStatus.currentOperation = operation;
    }),

  /**
   * Set restore in progress
   */
  setRestoreInProgress: (isRestoring, operation = null) =>
    set((state) => {
      state.backupStatus.isRestoring = isRestoring;
      state.backupStatus.currentOperation = operation;
    }),

  /**
   * Update backup completion
   */
  onBackupComplete: (success, size = 0, type = 'local') =>
    set((state) => {
      state.backupStatus.isBackingUp = false;
      state.backupStatus.lastBackupTime = new Date().toISOString();
      state.backupStatus.lastBackupSuccess = success;
      state.backupStatus.currentOperation = null;

      if (success) {
        state.backupStats.totalBackups += 1;
        if (type === 'local') {
          state.backupStats.localBackups += 1;
        } else if (type === 'cloud') {
          state.backupStats.cloudBackups += 1;
        }
        state.backupStats.lastBackupSize = size;
        state.backupStats.totalStorageUsed += size;
      } else {
        state.backupStats.failedBackups += 1;
      }
    }),

  /**
   * Update restore completion
   */
  onRestoreComplete: (success) =>
    set((state) => {
      state.backupStatus.isRestoring = false;
      state.backupStatus.currentOperation = null;
    }),

  /**
   * Set next scheduled backup time
   */
  setNextScheduledBackup: (timestamp) =>
    set((state) => {
      state.backupStatus.nextScheduledBackup = timestamp;
    }),

  /**
   * Get backup settings
   */
  getBackupSettings: () => {
    const state = get();
    return state.backupSettings;
  },

  /**
   * Get auto backup config
   */
  getAutoBackupConfig: () => {
    const state = get();
    return state.backupSettings.autoBackup;
  },

  /**
   * Check if cloud backup is enabled
   */
  isCloudBackupEnabled: () => {
    const state = get();
    const providers = state.backupSettings.cloudProviders;
    return (
      providers.google.enabled ||
      providers.dropbox.enabled ||
      providers.aws.enabled
    );
  },

  /**
   * Get enabled cloud providers
   */
  getEnabledCloudProviders: () => {
    const state = get();
    const providers = state.backupSettings.cloudProviders;
    const enabled = [];

    if (providers.google.enabled && providers.google.authenticated) {
      enabled.push('google');
    }
    if (providers.dropbox.enabled && providers.dropbox.authenticated) {
      enabled.push('dropbox');
    }
    if (providers.aws.enabled && providers.aws.authenticated) {
      enabled.push('aws');
    }

    return enabled;
  },

  /**
   * Reset backup stats
   */
  resetBackupStats: () =>
    set((state) => {
      state.backupStats = {
        totalBackups: 0,
        localBackups: 0,
        cloudBackups: 0,
        failedBackups: 0,
        lastBackupSize: 0,
        totalStorageUsed: 0,
      };
    }),

  /**
   * Check if backup is in progress
   */
  isBackupInProgress: () => {
    const state = get();
    return state.backupStatus.isBackingUp || state.backupStatus.isRestoring;
  },
});
