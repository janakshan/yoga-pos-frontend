import backupService from './backupService';
import toast from 'react-hot-toast';

/**
 * Automated Backup Scheduler
 * Handles scheduled automatic backups
 */

class AutoBackupScheduler {
  constructor() {
    this.interval = null;
    this.config = {
      enabled: false,
      frequency: 'daily', // 'hourly', 'daily', 'weekly', 'monthly'
      time: '02:00', // 24-hour format
      cloudProvider: null, // 'google', 'dropbox', 'aws'
      localBackup: true,
      cloudBackup: false,
      encryptionEnabled: true,
      maxBackups: 10, // Maximum number of backups to keep
    };
    this.lastBackupTime = null;
    this.isRunning = false;
  }

  /**
   * Initialize scheduler with configuration
   */
  init(config = {}) {
    this.config = { ...this.config, ...config };

    // Load last backup time
    const lastBackup = localStorage.getItem('last-auto-backup');
    if (lastBackup) {
      this.lastBackupTime = new Date(lastBackup);
    }

    // Start scheduler if enabled
    if (this.config.enabled) {
      this.start();
    }
  }

  /**
   * Start the scheduler
   */
  start() {
    if (this.isRunning) {
      console.log('Auto-backup scheduler is already running');
      return;
    }

    console.log('Starting auto-backup scheduler');
    this.isRunning = true;

    // Check immediately if backup is due
    this.checkAndBackup();

    // Set up interval based on frequency
    const intervalMs = this.getIntervalMs();
    this.interval = setInterval(() => {
      this.checkAndBackup();
    }, intervalMs);
  }

  /**
   * Stop the scheduler
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('Auto-backup scheduler stopped');
  }

  /**
   * Check if backup is due and execute
   */
  async checkAndBackup() {
    if (!this.config.enabled) {
      return;
    }

    const now = new Date();
    const shouldBackup = this.shouldBackupNow(now);

    if (shouldBackup) {
      await this.executeBackup();
    }
  }

  /**
   * Determine if backup should run now
   */
  shouldBackupNow(now) {
    if (!this.lastBackupTime) {
      return true; // No previous backup, run now
    }

    const timeSinceLastBackup = now - this.lastBackupTime;

    switch (this.config.frequency) {
      case 'hourly':
        return timeSinceLastBackup >= 60 * 60 * 1000; // 1 hour
      case 'daily':
        // Check if it's the right time of day
        const [targetHour, targetMinute] = this.config.time.split(':').map(Number);
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        // If it's past the target time and we haven't backed up today
        const lastBackupDate = this.lastBackupTime.toDateString();
        const currentDate = now.toDateString();

        if (lastBackupDate !== currentDate) {
          if (
            currentHour > targetHour ||
            (currentHour === targetHour && currentMinute >= targetMinute)
          ) {
            return true;
          }
        }
        return false;
      case 'weekly':
        return timeSinceLastBackup >= 7 * 24 * 60 * 60 * 1000; // 7 days
      case 'monthly':
        return timeSinceLastBackup >= 30 * 24 * 60 * 60 * 1000; // 30 days
      default:
        return false;
    }
  }

  /**
   * Execute backup
   */
  async executeBackup() {
    try {
      console.log('Executing auto-backup...');

      const results = [];

      // Create local backup
      if (this.config.localBackup) {
        const localResult = await backupService.createLocalBackup({
          filename: `auto-backup-local-${Date.now()}.json`,
          download: false, // Don't auto-download scheduled backups
          metadata: {
            autoBackup: true,
            frequency: this.config.frequency,
          },
        });
        results.push({ type: 'local', ...localResult });
      }

      // Create cloud backup
      if (this.config.cloudBackup && this.config.cloudProvider) {
        const cloudResult = await backupService.createCloudBackup(
          this.config.cloudProvider,
          {
            metadata: {
              autoBackup: true,
              frequency: this.config.frequency,
            },
          }
        );
        results.push({ type: 'cloud', ...cloudResult });
      }

      // Update last backup time
      this.lastBackupTime = new Date();
      localStorage.setItem(
        'last-auto-backup',
        this.lastBackupTime.toISOString()
      );

      // Clean up old backups
      await this.cleanupOldBackups();

      console.log('Auto-backup completed successfully');
      toast.success('Automatic backup completed', { duration: 2000 });

      return {
        success: true,
        results,
        timestamp: this.lastBackupTime.toISOString(),
      };
    } catch (error) {
      console.error('Auto-backup failed:', error);
      toast.error(`Auto-backup failed: ${error.message}`);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * Clean up old backups based on maxBackups setting
   */
  async cleanupOldBackups() {
    try {
      const history = backupService.getBackupHistory();

      // Filter auto-backups only
      const autoBackups = history.filter(
        backup => backup.metadata && backup.metadata.autoBackup
      );

      if (autoBackups.length > this.config.maxBackups) {
        // Sort by timestamp descending
        autoBackups.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        // Remove old backups
        const backupsToDelete = autoBackups.slice(this.config.maxBackups);
        backupsToDelete.forEach(backup => {
          backupService.deleteBackupFromHistory(backup.id);
        });

        console.log(`Cleaned up ${backupsToDelete.length} old backups`);
      }
    } catch (error) {
      console.error('Failed to clean up old backups:', error);
    }
  }

  /**
   * Get interval in milliseconds based on frequency
   */
  getIntervalMs() {
    switch (this.config.frequency) {
      case 'hourly':
        return 60 * 60 * 1000; // Check every hour
      case 'daily':
        return 60 * 60 * 1000; // Check every hour (to catch the right time)
      case 'weekly':
        return 24 * 60 * 60 * 1000; // Check every day
      case 'monthly':
        return 24 * 60 * 60 * 1000; // Check every day
      default:
        return 60 * 60 * 1000; // Default: check every hour
    }
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    const wasEnabled = this.config.enabled;
    this.config = { ...this.config, ...newConfig };

    // Restart scheduler if needed
    if (this.config.enabled && !wasEnabled) {
      this.start();
    } else if (!this.config.enabled && wasEnabled) {
      this.stop();
    } else if (this.config.enabled && this.isRunning) {
      // Restart with new config
      this.stop();
      this.start();
    }
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Get scheduler status
   */
  getStatus() {
    return {
      isRunning: this.isRunning,
      enabled: this.config.enabled,
      lastBackupTime: this.lastBackupTime,
      nextBackupTime: this.calculateNextBackupTime(),
      frequency: this.config.frequency,
    };
  }

  /**
   * Calculate next backup time
   */
  calculateNextBackupTime() {
    if (!this.config.enabled || !this.lastBackupTime) {
      return null;
    }

    const next = new Date(this.lastBackupTime);

    switch (this.config.frequency) {
      case 'hourly':
        next.setHours(next.getHours() + 1);
        break;
      case 'daily':
        next.setDate(next.getDate() + 1);
        const [hour, minute] = this.config.time.split(':').map(Number);
        next.setHours(hour, minute, 0, 0);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
    }

    return next;
  }

  /**
   * Force immediate backup
   */
  async forceBackup() {
    console.log('Forcing immediate backup...');
    return await this.executeBackup();
  }
}

// Export singleton instance
export const autoBackupScheduler = new AutoBackupScheduler();
export default autoBackupScheduler;
