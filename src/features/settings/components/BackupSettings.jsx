import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store';
import backupService from '../../../services/backup';
import autoBackupScheduler from '../../../services/backup/autoBackupScheduler';
import { toast } from 'react-hot-toast';
import {
  Database,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  Clock,
  Shield,
  HardDrive,
  Trash2,
  CheckCircle,
  XCircle,
  Play,
  Pause,
} from 'lucide-react';
import { format } from 'date-fns';

const BackupSettings = () => {
  const { t } = useTranslation();
  const {
    backupSettings,
    backupStatus,
    backupStats,
    updateBackupSettings,
    toggleAutoBackup,
    toggleCloudProvider,
    setBackupInProgress,
    onBackupComplete,
    setNextScheduledBackup,
  } = useStore();

  const [backupHistory, setBackupHistory] = useState([]);
  const [storageInfo, setStorageInfo] = useState(null);
  const [schedulerStatus, setSchedulerStatus] = useState(null);

  // Load backup history and storage info
  useEffect(() => {
    loadBackupHistory();
    loadStorageInfo();
    loadSchedulerStatus();
  }, []);

  const loadBackupHistory = () => {
    const history = backupService.getBackupHistory();
    setBackupHistory(history);
  };

  const loadStorageInfo = () => {
    const info = backupService.getStorageInfo();
    setStorageInfo(info);
  };

  const loadSchedulerStatus = () => {
    const status = autoBackupScheduler.getStatus();
    setSchedulerStatus(status);
    if (status.nextBackupTime) {
      setNextScheduledBackup(status.nextBackupTime.toISOString());
    }
  };

  const handleAutoBackupToggle = (enabled) => {
    toggleAutoBackup(enabled);
    if (enabled) {
      autoBackupScheduler.updateConfig({ enabled: true });
      toast.success('Automated backup enabled');
    } else {
      autoBackupScheduler.updateConfig({ enabled: false });
      toast.success('Automated backup disabled');
    }
    loadSchedulerStatus();
  };

  const handleAutoBackupSettingUpdate = (setting, value) => {
    updateBackupSettings('autoBackup', { [setting]: value });
    autoBackupScheduler.updateConfig({ [setting]: value });
    loadSchedulerStatus();
  };

  const handleCreateBackup = async () => {
    try {
      setBackupInProgress(true, 'Creating local backup');
      const result = await backupService.createLocalBackup();
      onBackupComplete(
        result.success,
        JSON.stringify(result.backup).length,
        'local'
      );
      loadBackupHistory();
      loadStorageInfo();
    } catch (error) {
      onBackupComplete(false, 0, 'local');
    }
  };

  const handleCreateCloudBackup = async (provider) => {
    try {
      setBackupInProgress(true, `Uploading to ${provider}`);
      const result = await backupService.createCloudBackup(provider);
      onBackupComplete(
        result.success,
        JSON.stringify(result).length,
        'cloud'
      );
      loadBackupHistory();
    } catch (error) {
      onBackupComplete(false, 0, 'cloud');
    }
  };

  const handleRestoreBackup = async (file) => {
    if (!file) return;

    try {
      const backupData = await backupService.uploadBackupFile(file);
      await backupService.restoreBackup(backupData);
      // Page will need to refresh after restore
    } catch (error) {
      console.error('Restore failed:', error);
    }
  };

  const handleDeleteBackup = (backupId) => {
    backupService.deleteBackupFromHistory(backupId);
    loadBackupHistory();
    toast.success('Backup deleted from history');
  };

  const handleForceBackup = async () => {
    try {
      await autoBackupScheduler.forceBackup();
      loadBackupHistory();
      loadStorageInfo();
      loadSchedulerStatus();
    } catch (error) {
      console.error('Force backup failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Backups</p>
              <p className="text-2xl font-bold text-gray-900">
                {backupStats.totalBackups}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Local Backups</p>
              <p className="text-2xl font-bold text-gray-900">
                {backupStats.localBackups}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Cloud Backups</p>
              <p className="text-2xl font-bold text-gray-900">
                {backupStats.cloudBackups}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-xl font-bold text-gray-900">
                {storageInfo?.totalSizeFormatted || '0 Bytes'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Backup */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Manual Backup
            </h3>
            <p className="text-sm text-gray-500">
              Create and restore backups manually
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCreateBackup}
            disabled={backupStatus.isBackingUp}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Download className="w-5 h-5" />
            Create Local Backup
          </button>

          <label className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer">
            <Upload className="w-5 h-5" />
            Restore from File
            <input
              type="file"
              accept=".json"
              onChange={(e) => handleRestoreBackup(e.target.files[0])}
              className="hidden"
            />
          </label>

          <button
            onClick={() => handleCreateCloudBackup('google')}
            disabled={backupStatus.isBackingUp}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
          >
            <Cloud className="w-5 h-5" />
            Backup to Cloud
          </button>
        </div>

        {backupStatus.isBackingUp && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-600">
                {backupStatus.currentOperation || 'Processing...'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Automated Backup */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Automated Backup
              </h3>
              <p className="text-sm text-gray-500">
                Schedule automatic backups
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={backupSettings.autoBackup.enabled}
              onChange={(e) => handleAutoBackupToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {backupSettings.autoBackup.enabled && (
          <div className="space-y-4 mt-4">
            {schedulerStatus && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {schedulerStatus.isRunning ? (
                      <>
                        <Play className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-600">
                          Running
                        </span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-600">
                          Paused
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Last Backup</p>
                  <p className="text-sm font-medium text-gray-900">
                    {schedulerStatus.lastBackupTime
                      ? format(
                          new Date(schedulerStatus.lastBackupTime),
                          'MMM dd, HH:mm'
                        )
                      : 'Never'}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Next Backup</p>
                  <p className="text-sm font-medium text-gray-900">
                    {schedulerStatus.nextBackupTime
                      ? format(schedulerStatus.nextBackupTime, 'MMM dd, HH:mm')
                      : 'Not scheduled'}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Frequency
                </label>
                <select
                  value={backupSettings.autoBackup.frequency}
                  onChange={(e) =>
                    handleAutoBackupSettingUpdate('frequency', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {backupSettings.autoBackup.frequency === 'daily' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Time (24h format)
                  </label>
                  <input
                    type="time"
                    value={backupSettings.autoBackup.time}
                    onChange={(e) =>
                      handleAutoBackupSettingUpdate('time', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Backups to Keep
                </label>
                <input
                  type="number"
                  value={backupSettings.autoBackup.maxBackups}
                  onChange={(e) =>
                    handleAutoBackupSettingUpdate(
                      'maxBackups',
                      parseInt(e.target.value)
                    )
                  }
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={backupSettings.autoBackup.localBackup}
                  onChange={(e) =>
                    handleAutoBackupSettingUpdate('localBackup', e.target.checked)
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Local Backup
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={backupSettings.autoBackup.cloudBackup}
                  onChange={(e) =>
                    handleAutoBackupSettingUpdate('cloudBackup', e.target.checked)
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Cloud Backup
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={backupSettings.autoBackup.encryptionEnabled}
                  onChange={(e) =>
                    handleAutoBackupSettingUpdate(
                      'encryptionEnabled',
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Enable Encryption
                </span>
              </label>
            </div>

            <button
              onClick={handleForceBackup}
              disabled={backupStatus.isBackingUp}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
            >
              Run Backup Now
            </button>
          </div>
        )}
      </div>

      {/* Cloud Providers */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Cloud className="w-6 h-6 text-indigo-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Cloud Storage Providers
            </h3>
            <p className="text-sm text-gray-500">
              Configure cloud backup destinations
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Google Drive */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Cloud className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Google Drive</h4>
                <p className="text-sm text-gray-500">
                  {backupSettings.cloudProviders.google.authenticated
                    ? 'Connected'
                    : 'Not connected'}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                toast.info('Cloud provider integration coming soon')
              }
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              {backupSettings.cloudProviders.google.authenticated
                ? 'Disconnect'
                : 'Connect'}
            </button>
          </div>

          {/* Dropbox */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Cloud className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Dropbox</h4>
                <p className="text-sm text-gray-500">
                  {backupSettings.cloudProviders.dropbox.authenticated
                    ? 'Connected'
                    : 'Not connected'}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                toast.info('Cloud provider integration coming soon')
              }
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              {backupSettings.cloudProviders.dropbox.authenticated
                ? 'Disconnect'
                : 'Connect'}
            </button>
          </div>

          {/* AWS S3 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <Cloud className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">AWS S3</h4>
                <p className="text-sm text-gray-500">
                  {backupSettings.cloudProviders.aws.authenticated
                    ? 'Connected'
                    : 'Not connected'}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                toast.info('Cloud provider integration coming soon')
              }
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              {backupSettings.cloudProviders.aws.authenticated
                ? 'Disconnect'
                : 'Connect'}
            </button>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Backup History
              </h3>
              <p className="text-sm text-gray-500">
                View and manage your backup history
              </p>
            </div>
          </div>
          <button
            onClick={loadBackupHistory}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {backupHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No backups found. Create your first backup above.
            </p>
          ) : (
            backupHistory.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="flex items-center gap-3">
                  {backup.type === 'local' ? (
                    <HardDrive className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Cloud className="w-5 h-5 text-purple-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {backup.type === 'local' ? 'Local Backup' : 'Cloud Backup'}
                      {backup.provider && ` (${backup.provider})`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(backup.timestamp), 'MMM dd, yyyy HH:mm')} •{' '}
                      {Math.round(backup.size / 1024)} KB
                      {backup.encrypted && (
                        <>
                          {' '}
                          • <Shield className="inline w-3 h-3" /> Encrypted
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteBackup(backup.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Data Security */}
      <div className="border border-gray-200 rounded-lg p-6 bg-blue-50">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Data Security
            </h3>
            <p className="text-sm text-gray-600">
              Your backups are encrypted using AES-256-GCM encryption. All data
              is stored securely and can only be restored by you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupSettings;
