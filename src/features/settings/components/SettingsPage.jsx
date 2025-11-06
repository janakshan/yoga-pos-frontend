import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store';
import GeneralSettings from './GeneralSettings';
import LocalizationSettings from './LocalizationSettings';
import BrandingSettings from './BrandingSettings';
import HardwareSettings from './HardwareSettings';
import NotificationSettings from './NotificationSettings';
import BackupSettings from './BackupSettings';
import { toast } from 'react-hot-toast';

const SettingsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: t('settings.general'), icon: '⚙️' },
    { id: 'localization', label: t('settings.localization'), icon: '🌍' },
    { id: 'branding', label: t('settings.branding'), icon: '🎨' },
    { id: 'hardware', label: t('settings.hardware'), icon: '🖨️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'backup', label: 'Backup & Security', icon: '💾' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {t('settings.title')}
        </h1>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  flex items-center gap-2
                `}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'general' && <GeneralSettings />}
          {activeTab === 'localization' && <LocalizationSettings />}
          {activeTab === 'branding' && <BrandingSettings />}
          {activeTab === 'hardware' && <HardwareSettings />}
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'backup' && <BackupSettings />}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
