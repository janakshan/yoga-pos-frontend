import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store';
import notificationService from '../../../services/notification';
import { toast } from 'react-hot-toast';
import { Mail, MessageSquare, Send, Bell, Volume2, Clock } from 'lucide-react';

const NotificationSettings = () => {
  const { t } = useTranslation();
  const {
    notificationSettings,
    updateNotificationSettings,
    toggleNotificationChannel,
    notificationStats,
  } = useStore();

  const [testRecipient, setTestRecipient] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleChannelToggle = (channel) => {
    toggleNotificationChannel(channel, !notificationSettings[channel].enabled);
    toast.success(
      `${channel.toUpperCase()} notifications ${
        !notificationSettings[channel].enabled ? 'enabled' : 'disabled'
      }`
    );
  };

  const handleSettingUpdate = (channel, setting, value) => {
    updateNotificationSettings(channel, { [setting]: value });
  };

  const handleTestNotification = async (channel) => {
    if (!testRecipient) {
      toast.error('Please enter a recipient');
      return;
    }

    setIsSendingTest(true);
    try {
      await notificationService.send(channel, {
        to: testRecipient,
        subject: 'Test Notification',
        message: 'This is a test notification from Yoga POS',
        body: 'This is a test notification from Yoga POS. If you received this, notifications are working correctly!',
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900">
                {notificationStats.totalSent}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-2xl font-bold text-gray-900">
                {notificationStats.emailSent}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">SMS</p>
              <p className="text-2xl font-bold text-gray-900">
                {notificationStats.smsSent}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-teal-50 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-teal-600" />
            <div>
              <p className="text-sm text-gray-600">WhatsApp</p>
              <p className="text-2xl font-bold text-gray-900">
                {notificationStats.whatsappSent}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Notifications */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Email Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Send notifications via email
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.email.enabled}
              onChange={() => handleChannelToggle('email')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {notificationSettings.email.enabled && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Email Recipient
              </label>
              <input
                type="email"
                value={notificationSettings.email.defaultRecipient}
                onChange={(e) =>
                  handleSettingUpdate('email', 'defaultRecipient', e.target.value)
                }
                placeholder="email@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.email.sendOnSale}
                  onChange={(e) =>
                    handleSettingUpdate('email', 'sendOnSale', e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Sale
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.email.sendOnBooking}
                  onChange={(e) =>
                    handleSettingUpdate('email', 'sendOnBooking', e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Booking
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.email.sendOnLowStock}
                  onChange={(e) =>
                    handleSettingUpdate('email', 'sendOnLowStock', e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Low Stock
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.email.sendOnPaymentDue}
                  onChange={(e) =>
                    handleSettingUpdate('email', 'sendOnPaymentDue', e.target.checked)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Payment Due
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.email.sendOnMembershipExpiry}
                  onChange={(e) =>
                    handleSettingUpdate(
                      'email',
                      'sendOnMembershipExpiry',
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Membership Expiry
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* SMS Notifications */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                SMS Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Send notifications via SMS
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.sms.enabled}
              onChange={() => handleChannelToggle('sms')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {notificationSettings.sms.enabled && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Phone Number
              </label>
              <input
                type="tel"
                value={notificationSettings.sms.defaultRecipient}
                onChange={(e) =>
                  handleSettingUpdate('sms', 'defaultRecipient', e.target.value)
                }
                placeholder="+1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.sms.sendOnSale}
                  onChange={(e) =>
                    handleSettingUpdate('sms', 'sendOnSale', e.target.checked)
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Sale
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.sms.sendOnBooking}
                  onChange={(e) =>
                    handleSettingUpdate('sms', 'sendOnBooking', e.target.checked)
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Booking
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.sms.sendOnPaymentDue}
                  onChange={(e) =>
                    handleSettingUpdate('sms', 'sendOnPaymentDue', e.target.checked)
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Payment Due
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.sms.sendOnMembershipExpiry}
                  onChange={(e) =>
                    handleSettingUpdate(
                      'sms',
                      'sendOnMembershipExpiry',
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Membership Expiry
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Notifications */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-teal-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                WhatsApp Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Send notifications via WhatsApp
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSettings.whatsapp.enabled}
              onChange={() => handleChannelToggle('whatsapp')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        {notificationSettings.whatsapp.enabled && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default WhatsApp Number
              </label>
              <input
                type="tel"
                value={notificationSettings.whatsapp.defaultRecipient}
                onChange={(e) =>
                  handleSettingUpdate('whatsapp', 'defaultRecipient', e.target.value)
                }
                placeholder="+1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.whatsapp.sendOnSale}
                  onChange={(e) =>
                    handleSettingUpdate('whatsapp', 'sendOnSale', e.target.checked)
                  }
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Sale
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.whatsapp.sendOnBooking}
                  onChange={(e) =>
                    handleSettingUpdate('whatsapp', 'sendOnBooking', e.target.checked)
                  }
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Booking
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.whatsapp.sendOnPaymentDue}
                  onChange={(e) =>
                    handleSettingUpdate(
                      'whatsapp',
                      'sendOnPaymentDue',
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Payment Due
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notificationSettings.whatsapp.sendOnMembershipExpiry}
                  onChange={(e) =>
                    handleSettingUpdate(
                      'whatsapp',
                      'sendOnMembershipExpiry',
                      e.target.checked
                    )
                  }
                  className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Send on Membership Expiry
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* General Settings */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-6 h-6 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              General Notification Settings
            </h3>
            <p className="text-sm text-gray-500">
              Configure general notification preferences
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-gray-500" />
              <span className="text-sm text-gray-700">
                Enable notification sounds
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationSettings.general.soundEnabled}
              onChange={(e) =>
                handleSettingUpdate('general', 'soundEnabled', e.target.checked)
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Show toast notifications
            </span>
            <input
              type="checkbox"
              checked={notificationSettings.general.toastEnabled}
              onChange={(e) =>
                handleSettingUpdate('general', 'toastEnabled', e.target.checked)
              }
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </label>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-5 h-5 text-gray-500" />
              Toast duration (milliseconds)
            </label>
            <input
              type="number"
              value={notificationSettings.general.toastDuration}
              onChange={(e) =>
                handleSettingUpdate(
                  'general',
                  'toastDuration',
                  parseInt(e.target.value)
                )
              }
              min="1000"
              max="10000"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Test Notification */}
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Test Notifications
        </h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={testRecipient}
            onChange={(e) => setTestRecipient(e.target.value)}
            placeholder="Enter email or phone number"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => handleTestNotification('email')}
            disabled={isSendingTest}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Test Email
          </button>
          <button
            onClick={() => handleTestNotification('sms')}
            disabled={isSendingTest}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
          >
            Test SMS
          </button>
          <button
            onClick={() => handleTestNotification('whatsapp')}
            disabled={isSendingTest}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400"
          >
            Test WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
