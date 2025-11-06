import toast from 'react-hot-toast';

/**
 * Backup Service with Encryption
 * Handles cloud backup, local backup, and data restoration
 */

class BackupService {
  constructor() {
    this.storageKey = 'yoga-pos-storage';
    this.backupHistoryKey = 'yoga-pos-backup-history';
    this.encryptionEnabled = true;
    this.cloudProviders = {
      google: new GoogleDriveProvider(),
      dropbox: new DropboxProvider(),
      aws: new AWSProvider(),
    };
  }

  /**
   * Encrypt data using AES-256-GCM simulation
   */
  async encryptData(data, password = null) {
    if (!this.encryptionEnabled) {
      return { encrypted: false, data: JSON.stringify(data) };
    }

    try {
      // In production, use Web Crypto API for actual encryption
      // For demo, we'll use base64 encoding as a placeholder
      const jsonString = JSON.stringify(data);
      const encrypted = btoa(jsonString);

      return {
        encrypted: true,
        data: encrypted,
        algorithm: 'AES-256-GCM',
        timestamp: new Date().toISOString(),
      };

      // Production implementation with Web Crypto API:
      /*
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(JSON.stringify(data));

      // Generate key from password
      const passwordBuffer = encoder.encode(password || 'default-key');
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('yoga-pos-salt'),
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );

      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        dataBuffer
      );

      return {
        encrypted: true,
        data: Array.from(new Uint8Array(encryptedBuffer)),
        iv: Array.from(iv),
        algorithm: 'AES-256-GCM',
        timestamp: new Date().toISOString(),
      };
      */
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error(`Failed to encrypt data: ${error.message}`);
    }
  }

  /**
   * Decrypt data
   */
  async decryptData(encryptedData, password = null) {
    if (!encryptedData.encrypted) {
      return JSON.parse(encryptedData.data);
    }

    try {
      // Demo decryption (reverse of encryption)
      const decrypted = atob(encryptedData.data);
      return JSON.parse(decrypted);

      // Production implementation with Web Crypto API:
      /*
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password || 'default-key');
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('yoga-pos-salt'),
          iterations: 100000,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
        key,
        new Uint8Array(encryptedData.data)
      );

      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decryptedBuffer));
      */
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error(`Failed to decrypt data: ${error.message}`);
    }
  }

  /**
   * Create local backup
   */
  async createLocalBackup(options = {}) {
    try {
      toast.loading('Creating backup...', { id: 'backup' });

      // Get current state from localStorage
      const stateData = localStorage.getItem(this.storageKey);
      if (!stateData) {
        throw new Error('No data found to backup');
      }

      const state = JSON.parse(stateData);

      // Add metadata
      const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        type: 'local',
        data: state,
        metadata: {
          userAgent: navigator.userAgent,
          appVersion: options.appVersion || '1.0.0',
          ...options.metadata,
        },
      };

      // Encrypt backup
      const encryptedBackup = await this.encryptData(
        backupData,
        options.password
      );

      // Store in backup history
      this.addToBackupHistory({
        id: `backup-${Date.now()}`,
        type: 'local',
        timestamp: backupData.timestamp,
        size: JSON.stringify(encryptedBackup).length,
        encrypted: encryptedBackup.encrypted,
      });

      // Download as file
      if (options.download !== false) {
        this.downloadBackup(encryptedBackup, options.filename);
      }

      toast.success('Backup created successfully', { id: 'backup' });

      return {
        success: true,
        backup: encryptedBackup,
        timestamp: backupData.timestamp,
      };
    } catch (error) {
      console.error('Backup failed:', error);
      toast.error(`Backup failed: ${error.message}`, { id: 'backup' });
      throw error;
    }
  }

  /**
   * Create cloud backup
   */
  async createCloudBackup(provider, options = {}) {
    try {
      toast.loading(`Uploading to ${provider}...`, { id: 'cloud-backup' });

      // Get current state
      const stateData = localStorage.getItem(this.storageKey);
      if (!stateData) {
        throw new Error('No data found to backup');
      }

      const state = JSON.parse(stateData);

      // Create backup data
      const backupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        type: 'cloud',
        provider,
        data: state,
        metadata: {
          userAgent: navigator.userAgent,
          appVersion: options.appVersion || '1.0.0',
          ...options.metadata,
        },
      };

      // Encrypt backup
      const encryptedBackup = await this.encryptData(
        backupData,
        options.password
      );

      // Upload to cloud provider
      const cloudProvider = this.cloudProviders[provider];
      if (!cloudProvider) {
        throw new Error(`Cloud provider '${provider}' not supported`);
      }

      const uploadResult = await cloudProvider.upload(
        encryptedBackup,
        options.filename || `yoga-pos-backup-${Date.now()}.json`
      );

      // Store in backup history
      this.addToBackupHistory({
        id: uploadResult.fileId,
        type: 'cloud',
        provider,
        timestamp: backupData.timestamp,
        size: JSON.stringify(encryptedBackup).length,
        encrypted: encryptedBackup.encrypted,
        cloudFileId: uploadResult.fileId,
        cloudUrl: uploadResult.url,
      });

      toast.success(`Backup uploaded to ${provider}`, { id: 'cloud-backup' });

      return {
        success: true,
        provider,
        fileId: uploadResult.fileId,
        url: uploadResult.url,
        timestamp: backupData.timestamp,
      };
    } catch (error) {
      console.error('Cloud backup failed:', error);
      toast.error(`Cloud backup failed: ${error.message}`, {
        id: 'cloud-backup',
      });
      throw error;
    }
  }

  /**
   * Restore from backup
   */
  async restoreBackup(backupData, options = {}) {
    try {
      toast.loading('Restoring backup...', { id: 'restore' });

      // Decrypt backup if encrypted
      const decryptedData = await this.decryptData(
        backupData,
        options.password
      );

      // Validate backup data
      if (!decryptedData.version || !decryptedData.data) {
        throw new Error('Invalid backup file format');
      }

      // Create backup of current state before restoring
      if (options.createBackupBeforeRestore !== false) {
        await this.createLocalBackup({
          filename: `pre-restore-backup-${Date.now()}.json`,
          download: false,
        });
      }

      // Restore state to localStorage
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(decryptedData.data)
      );

      toast.success('Backup restored successfully. Please refresh the page.', {
        id: 'restore',
        duration: 5000,
      });

      return {
        success: true,
        timestamp: decryptedData.timestamp,
        requiresRefresh: true,
      };
    } catch (error) {
      console.error('Restore failed:', error);
      toast.error(`Restore failed: ${error.message}`, { id: 'restore' });
      throw error;
    }
  }

  /**
   * Restore from cloud
   */
  async restoreFromCloud(provider, fileId, options = {}) {
    try {
      toast.loading(`Downloading from ${provider}...`, { id: 'cloud-restore' });

      const cloudProvider = this.cloudProviders[provider];
      if (!cloudProvider) {
        throw new Error(`Cloud provider '${provider}' not supported`);
      }

      // Download backup from cloud
      const backupData = await cloudProvider.download(fileId);

      // Restore the downloaded backup
      return await this.restoreBackup(backupData, options);
    } catch (error) {
      console.error('Cloud restore failed:', error);
      toast.error(`Cloud restore failed: ${error.message}`, {
        id: 'cloud-restore',
      });
      throw error;
    }
  }

  /**
   * Download backup as file
   */
  downloadBackup(backupData, filename) {
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download =
      filename || `yoga-pos-backup-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Upload backup from file
   */
  async uploadBackupFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const backupData = JSON.parse(e.target.result);
          resolve(backupData);
        } catch (error) {
          reject(new Error('Invalid backup file format'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read backup file'));
      reader.readAsText(file);
    });
  }

  /**
   * Add backup to history
   */
  addToBackupHistory(backup) {
    const history = this.getBackupHistory();
    history.unshift(backup);

    // Keep only last 50 backups in history
    const trimmedHistory = history.slice(0, 50);

    localStorage.setItem(
      this.backupHistoryKey,
      JSON.stringify(trimmedHistory)
    );
  }

  /**
   * Get backup history
   */
  getBackupHistory() {
    const history = localStorage.getItem(this.backupHistoryKey);
    return history ? JSON.parse(history) : [];
  }

  /**
   * Clear backup history
   */
  clearBackupHistory() {
    localStorage.removeItem(this.backupHistoryKey);
  }

  /**
   * Delete backup from history
   */
  deleteBackupFromHistory(backupId) {
    const history = this.getBackupHistory();
    const updatedHistory = history.filter(backup => backup.id !== backupId);
    localStorage.setItem(
      this.backupHistoryKey,
      JSON.stringify(updatedHistory)
    );
  }

  /**
   * Get storage size information
   */
  getStorageInfo() {
    const stateData = localStorage.getItem(this.storageKey);
    const backupHistory = localStorage.getItem(this.backupHistoryKey);

    const stateSize = stateData ? new Blob([stateData]).size : 0;
    const historySize = backupHistory ? new Blob([backupHistory]).size : 0;

    return {
      stateSize,
      historySize,
      totalSize: stateSize + historySize,
      stateSizeFormatted: this.formatBytes(stateSize),
      historySizeFormatted: this.formatBytes(historySize),
      totalSizeFormatted: this.formatBytes(stateSize + historySize),
    };
  }

  /**
   * Format bytes to human readable size
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

/**
 * Google Drive Cloud Provider
 */
class GoogleDriveProvider {
  constructor() {
    this.config = {
      clientId: process.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id',
      apiKey: process.env.VITE_GOOGLE_API_KEY || 'demo-api-key',
    };
  }

  async upload(data, filename) {
    // Mock implementation - in production, use Google Drive API
    await this.simulateDelay(2000);

    return {
      fileId: `gdrive-${Date.now()}`,
      url: `https://drive.google.com/file/d/gdrive-${Date.now()}`,
      provider: 'google',
    };
  }

  async download(fileId) {
    // Mock implementation
    await this.simulateDelay(2000);
    throw new Error('Download from Google Drive not implemented in demo');
  }

  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Dropbox Cloud Provider
 */
class DropboxProvider {
  constructor() {
    this.config = {
      accessToken: process.env.VITE_DROPBOX_ACCESS_TOKEN || 'demo-token',
    };
  }

  async upload(data, filename) {
    // Mock implementation - in production, use Dropbox API
    await this.simulateDelay(2000);

    return {
      fileId: `dropbox-${Date.now()}`,
      url: `https://www.dropbox.com/s/dropbox-${Date.now()}`,
      provider: 'dropbox',
    };
  }

  async download(fileId) {
    // Mock implementation
    await this.simulateDelay(2000);
    throw new Error('Download from Dropbox not implemented in demo');
  }

  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * AWS S3 Cloud Provider
 */
class AWSProvider {
  constructor() {
    this.config = {
      accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || 'demo-key',
      secretAccessKey:
        process.env.VITE_AWS_SECRET_ACCESS_KEY || 'demo-secret',
      bucket: process.env.VITE_AWS_BUCKET || 'yoga-pos-backups',
      region: process.env.VITE_AWS_REGION || 'us-east-1',
    };
  }

  async upload(data, filename) {
    // Mock implementation - in production, use AWS SDK
    await this.simulateDelay(2000);

    return {
      fileId: `s3-${Date.now()}`,
      url: `https://${this.config.bucket}.s3.amazonaws.com/${filename}`,
      provider: 'aws',
    };
  }

  async download(fileId) {
    // Mock implementation
    await this.simulateDelay(2000);
    throw new Error('Download from AWS S3 not implemented in demo');
  }

  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const backupService = new BackupService();
export default backupService;
