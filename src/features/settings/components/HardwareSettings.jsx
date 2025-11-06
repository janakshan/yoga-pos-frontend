import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../../store';
import { toast } from 'react-hot-toast';
import hardwareServices from '../../../services/hardware';

const HardwareSettings = () => {
  const { t } = useTranslation();
  const { hardware, updateHardwareSettings, toggleHardware } = useStore();
  const [testing, setTesting] = useState({});

  const handleTest = async (deviceType) => {
    setTesting({ ...testing, [deviceType]: true });

    try {
      let result = false;

      switch (deviceType) {
        case 'receiptPrinter':
          await hardwareServices.printer.connect(hardware.receiptPrinter);
          result = await hardwareServices.printer.testPrint();
          break;
        case 'barcodeScanner':
          result = await hardwareServices.scanner.test();
          break;
        case 'cashDrawer':
          await hardwareServices.cashDrawer.initialize(
            hardware.cashDrawer,
            hardwareServices.printer
          );
          result = await hardwareServices.cashDrawer.test();
          break;
        case 'customerDisplay':
          await hardwareServices.customerDisplay.initialize(hardware.customerDisplay);
          result = await hardwareServices.customerDisplay.test();
          break;
        default:
          break;
      }

      if (result) {
        toast.success(t('hardware.testPrint') + ' - ' + t('hardware.printSuccess'));
      } else {
        toast.error(t('hardware.testPrint') + ' - ' + t('hardware.printError'));
      }
    } catch (error) {
      console.error('Test error:', error);
      toast.error(t('hardware.printError'));
    } finally {
      setTesting({ ...testing, [deviceType]: false });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t('settings.hardware')}
        </h2>
      </div>

      {/* Receipt Printer */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {t('settings.receiptPrinter')}
            </h3>
            <p className="text-sm text-gray-500">Configure receipt printer settings</p>
          </div>
          <button
            onClick={() => toggleHardware('receiptPrinter')}
            className={`
              ${hardware.receiptPrinter.enabled ? 'bg-blue-600' : 'bg-gray-200'}
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
              border-2 border-transparent transition-colors duration-200 ease-in-out
            `}
          >
            <span
              className={`
                ${hardware.receiptPrinter.enabled ? 'translate-x-5' : 'translate-x-0'}
                pointer-events-none inline-block h-5 w-5 transform rounded-full
                bg-white shadow ring-0 transition duration-200 ease-in-out
              `}
            />
          </button>
        </div>

        {hardware.receiptPrinter.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hardware.printerType')}
                </label>
                <select
                  value={hardware.receiptPrinter.type}
                  onChange={(e) =>
                    updateHardwareSettings('receiptPrinter', { type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="thermal">{t('hardware.thermal')}</option>
                  <option value="inkjet">{t('hardware.inkjet')}</option>
                  <option value="laser">{t('hardware.laser')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hardware.connectionType')}
                </label>
                <select
                  value={hardware.receiptPrinter.connectionType}
                  onChange={(e) =>
                    updateHardwareSettings('receiptPrinter', {
                      connectionType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="usb">{t('hardware.usb')}</option>
                  <option value="network">{t('hardware.network')}</option>
                  <option value="bluetooth">{t('hardware.bluetooth')}</option>
                </select>
              </div>
            </div>

            {hardware.receiptPrinter.connectionType === 'network' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('hardware.ipAddress')}
                  </label>
                  <input
                    type="text"
                    value={hardware.receiptPrinter.ipAddress}
                    onChange={(e) =>
                      updateHardwareSettings('receiptPrinter', {
                        ipAddress: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="192.168.1.100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('hardware.port')}
                  </label>
                  <input
                    type="text"
                    value={hardware.receiptPrinter.port}
                    onChange={(e) =>
                      updateHardwareSettings('receiptPrinter', { port: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="9100"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hardware.paperWidth')} (mm)
                </label>
                <input
                  type="number"
                  value={hardware.receiptPrinter.paperWidth}
                  onChange={(e) =>
                    updateHardwareSettings('receiptPrinter', {
                      paperWidth: parseInt(e.target.value) || 80,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hardware.characterSet')}
                </label>
                <select
                  value={hardware.receiptPrinter.characterSet}
                  onChange={(e) =>
                    updateHardwareSettings('receiptPrinter', {
                      characterSet: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="CP437">CP437</option>
                  <option value="CP850">CP850</option>
                  <option value="CP852">CP852</option>
                  <option value="UTF-8">UTF-8</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hardware.receiptPrinter.autoCut}
                  onChange={(e) =>
                    updateHardwareSettings('receiptPrinter', {
                      autoCut: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-cut paper</span>
              </label>

              <button
                onClick={() => handleTest('receiptPrinter')}
                disabled={testing.receiptPrinter}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {testing.receiptPrinter ? t('common.loading') : t('settings.testPrinter')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Barcode Scanner */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {t('settings.barcodeScanner')}
            </h3>
            <p className="text-sm text-gray-500">Configure barcode scanner settings</p>
          </div>
          <button
            onClick={() => toggleHardware('barcodeScanner')}
            className={`
              ${hardware.barcodeScanner.enabled ? 'bg-blue-600' : 'bg-gray-200'}
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
              border-2 border-transparent transition-colors duration-200 ease-in-out
            `}
          >
            <span
              className={`
                ${hardware.barcodeScanner.enabled ? 'translate-x-5' : 'translate-x-0'}
                pointer-events-none inline-block h-5 w-5 transform rounded-full
                bg-white shadow ring-0 transition duration-200 ease-in-out
              `}
            />
          </button>
        </div>

        {hardware.barcodeScanner.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('hardware.connectionType')}
              </label>
              <select
                value={hardware.barcodeScanner.type}
                onChange={(e) =>
                  updateHardwareSettings('barcodeScanner', { type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="usb">{t('hardware.usb')}</option>
                <option value="bluetooth">{t('hardware.bluetooth')}</option>
                <option value="serial">{t('hardware.serial')}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prefix
                </label>
                <input
                  type="text"
                  value={hardware.barcodeScanner.prefix}
                  onChange={(e) =>
                    updateHardwareSettings('barcodeScanner', { prefix: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Optional prefix"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Suffix
                </label>
                <input
                  type="text"
                  value={hardware.barcodeScanner.suffix}
                  onChange={(e) =>
                    updateHardwareSettings('barcodeScanner', { suffix: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Optional suffix"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hardware.barcodeScanner.autoSubmit}
                  onChange={(e) =>
                    updateHardwareSettings('barcodeScanner', {
                      autoSubmit: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-submit on scan</span>
              </label>

              <button
                onClick={() => handleTest('barcodeScanner')}
                disabled={testing.barcodeScanner}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {testing.barcodeScanner ? t('common.loading') : t('settings.testScanner')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Cash Drawer */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {t('settings.cashDrawer')}
            </h3>
            <p className="text-sm text-gray-500">Configure cash drawer settings</p>
          </div>
          <button
            onClick={() => toggleHardware('cashDrawer')}
            className={`
              ${hardware.cashDrawer.enabled ? 'bg-blue-600' : 'bg-gray-200'}
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
              border-2 border-transparent transition-colors duration-200 ease-in-out
            `}
          >
            <span
              className={`
                ${hardware.cashDrawer.enabled ? 'translate-x-5' : 'translate-x-0'}
                pointer-events-none inline-block h-5 w-5 transform rounded-full
                bg-white shadow ring-0 transition duration-200 ease-in-out
              `}
            />
          </button>
        </div>

        {hardware.cashDrawer.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('hardware.connectionType')}
              </label>
              <select
                value={hardware.cashDrawer.connectionType}
                onChange={(e) =>
                  updateHardwareSettings('cashDrawer', {
                    connectionType: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="printer">Via Printer</option>
                <option value="serial">{t('hardware.serial')}</option>
                <option value="usb">{t('hardware.usb')}</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={hardware.cashDrawer.openOnSale}
                  onChange={(e) =>
                    updateHardwareSettings('cashDrawer', {
                      openOnSale: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Open drawer automatically on sale
                </span>
              </label>

              <button
                onClick={() => handleTest('cashDrawer')}
                disabled={testing.cashDrawer}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {testing.cashDrawer ? t('common.loading') : t('settings.openDrawer')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Customer Display */}
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {t('settings.customerDisplay')}
            </h3>
            <p className="text-sm text-gray-500">Configure customer display settings</p>
          </div>
          <button
            onClick={() => toggleHardware('customerDisplay')}
            className={`
              ${hardware.customerDisplay.enabled ? 'bg-blue-600' : 'bg-gray-200'}
              relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
              border-2 border-transparent transition-colors duration-200 ease-in-out
            `}
          >
            <span
              className={`
                ${hardware.customerDisplay.enabled ? 'translate-x-5' : 'translate-x-0'}
                pointer-events-none inline-block h-5 w-5 transform rounded-full
                bg-white shadow ring-0 transition duration-200 ease-in-out
              `}
            />
          </button>
        </div>

        {hardware.customerDisplay.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hardware.deviceType')}
                </label>
                <select
                  value={hardware.customerDisplay.type}
                  onChange={(e) =>
                    updateHardwareSettings('customerDisplay', { type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="pole">Pole Display</option>
                  <option value="tablet">Tablet</option>
                  <option value="monitor">Monitor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('hardware.connectionType')}
                </label>
                <select
                  value={hardware.customerDisplay.connectionType}
                  onChange={(e) =>
                    updateHardwareSettings('customerDisplay', {
                      connectionType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="serial">{t('hardware.serial')}</option>
                  <option value="usb">{t('hardware.usb')}</option>
                  <option value="network">{t('hardware.network')}</option>
                </select>
              </div>
            </div>

            {hardware.customerDisplay.connectionType === 'network' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('hardware.ipAddress')}
                  </label>
                  <input
                    type="text"
                    value={hardware.customerDisplay.ipAddress}
                    onChange={(e) =>
                      updateHardwareSettings('customerDisplay', {
                        ipAddress: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="192.168.1.101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('hardware.port')}
                  </label>
                  <input
                    type="text"
                    value={hardware.customerDisplay.port}
                    onChange={(e) =>
                      updateHardwareSettings('customerDisplay', { port: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="8080"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lines
                </label>
                <input
                  type="number"
                  value={hardware.customerDisplay.lines}
                  onChange={(e) =>
                    updateHardwareSettings('customerDisplay', {
                      lines: parseInt(e.target.value) || 2,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Columns
                </label>
                <input
                  type="number"
                  value={hardware.customerDisplay.columns}
                  onChange={(e) =>
                    updateHardwareSettings('customerDisplay', {
                      columns: parseInt(e.target.value) || 20,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleTest('customerDisplay')}
                disabled={testing.customerDisplay}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {testing.customerDisplay ? t('common.loading') : t('hardware.testConnection')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HardwareSettings;
