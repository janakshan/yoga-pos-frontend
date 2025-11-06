import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store';
import { toast } from 'react-hot-toast';

const BrandingSettings = () => {
  const { t } = useTranslation();
  const { branding, businessInfo, updateBranding, updateBusinessInfo } = useStore();
  const [localBranding, setLocalBranding] = useState(branding);
  const [localBusinessInfo, setLocalBusinessInfo] = useState(businessInfo);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalBranding({ ...localBranding, logo: reader.result });
        setLocalBusinessInfo({ ...localBusinessInfo, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateBranding(localBranding);
    updateBusinessInfo(localBusinessInfo);
    toast.success(t('settings.settingsSaved'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('settings.branding')}
        </h2>
      </div>

      {/* Business Information */}
      <div className="border-b pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {t('settings.businessInfo')}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('settings.businessName')}
            </label>
            <input
              type="text"
              value={localBusinessInfo.name}
              onChange={(e) =>
                setLocalBusinessInfo({ ...localBusinessInfo, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('common.address')}
            </label>
            <input
              type="text"
              value={localBusinessInfo.address}
              onChange={(e) =>
                setLocalBusinessInfo({ ...localBusinessInfo, address: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.phone')}
              </label>
              <input
                type="tel"
                value={localBusinessInfo.phone}
                onChange={(e) =>
                  setLocalBusinessInfo({ ...localBusinessInfo, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.email')}
              </label>
              <input
                type="email"
                value={localBusinessInfo.email}
                onChange={(e) =>
                  setLocalBusinessInfo({ ...localBusinessInfo, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={localBusinessInfo.website}
              onChange={(e) =>
                setLocalBusinessInfo({ ...localBusinessInfo, website: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tax ID
            </label>
            <input
              type="text"
              value={localBusinessInfo.taxId}
              onChange={(e) =>
                setLocalBusinessInfo({ ...localBusinessInfo, taxId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('settings.logo')}
        </label>
        <div className="flex items-center space-x-4">
          {localBranding.logo && (
            <img
              src={localBranding.logo}
              alt="Business Logo"
              className="w-24 h-24 object-contain border border-gray-300 rounded"
            />
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
              id="logo-upload"
            />
            <label
              htmlFor="logo-upload"
              className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              {t('settings.uploadLogo')}
            </label>
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Brand Colors
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('settings.primaryColor')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={localBranding.primaryColor}
                onChange={(e) =>
                  setLocalBranding({ ...localBranding, primaryColor: e.target.value })
                }
                className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={localBranding.primaryColor}
                onChange={(e) =>
                  setLocalBranding({ ...localBranding, primaryColor: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('settings.secondaryColor')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={localBranding.secondaryColor}
                onChange={(e) =>
                  setLocalBranding({ ...localBranding, secondaryColor: e.target.value })
                }
                className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={localBranding.secondaryColor}
                onChange={(e) =>
                  setLocalBranding({ ...localBranding, secondaryColor: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accent Color
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={localBranding.accentColor}
                onChange={(e) =>
                  setLocalBranding({ ...localBranding, accentColor: e.target.value })
                }
                className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={localBranding.accentColor}
                onChange={(e) =>
                  setLocalBranding({ ...localBranding, accentColor: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom CSS
        </label>
        <textarea
          value={localBranding.customCSS}
          onChange={(e) =>
            setLocalBranding({ ...localBranding, customCSS: e.target.value })
          }
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder=".custom-class { color: #333; }"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {t('common.save')}
        </button>
      </div>
    </div>
  );
};

export default BrandingSettings;
