/**
 * Hardware Configuration Component
 *
 * Manages configuration for all kitchen hardware:
 * - Printers and routing
 * - Pager systems
 * - Customer displays
 * - Hardware testing
 */

import { useState } from 'react';
import {
  PrinterIcon,
  BellAlertIcon,
  TvIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import {
  CONNECTION_TYPE,
  HARDWARE_STATUS,
  KITCHEN_STATION,
  KITCHEN_STATION_LABELS,
  DEFAULT_PRINTERS,
  DEFAULT_PRINTER_ROUTING,
  DEFAULT_PAGER_CONFIG,
  DEFAULT_CUSTOMER_DISPLAY_CONFIG,
} from '../types/kitchen.types';

/**
 * Hardware Configuration Component
 */
const HardwareConfig = ({
  currentConfig = {},
  onSave,
  onTest,
  hardwareStatus = {},
}) => {
  const [activeTab, setActiveTab] = useState('printers');
  const [config, setConfig] = useState({
    printers: currentConfig.printers || DEFAULT_PRINTERS,
    printerRouting: currentConfig.printerRouting || DEFAULT_PRINTER_ROUTING,
    pager: currentConfig.pager || DEFAULT_PAGER_CONFIG,
    customerDisplay: currentConfig.customerDisplay || DEFAULT_CUSTOMER_DISPLAY_CONFIG,
  });

  /**
   * Update printer configuration
   */
  const updatePrinter = (index, updates) => {
    const newPrinters = [...config.printers];
    newPrinters[index] = { ...newPrinters[index], ...updates };
    setConfig({ ...config, printers: newPrinters });
  };

  /**
   * Add new printer
   */
  const addPrinter = () => {
    setConfig({
      ...config,
      printers: [
        ...config.printers,
        {
          name: `Printer ${config.printers.length + 1}`,
          connectionType: CONNECTION_TYPE.NETWORK,
          ipAddress: '192.168.1.100',
          port: 9100,
          paperWidth: 32,
          autoCut: true,
          enabled: true,
        },
      ],
    });
  };

  /**
   * Remove printer
   */
  const removePrinter = (index) => {
    const newPrinters = config.printers.filter((_, i) => i !== index);
    setConfig({ ...config, printers: newPrinters });
  };

  /**
   * Update routing rule
   */
  const updateRouting = (index, updates) => {
    const newRouting = [...config.printerRouting];
    newRouting[index] = { ...newRouting[index], ...updates };
    setConfig({ ...config, printerRouting: newRouting });
  };

  /**
   * Add routing rule
   */
  const addRouting = () => {
    setConfig({
      ...config,
      printerRouting: [
        ...config.printerRouting,
        {
          station: KITCHEN_STATION.HOT_KITCHEN,
          printerName: config.printers[0]?.name || '',
          priority: 1,
          enabled: true,
        },
      ],
    });
  };

  /**
   * Remove routing rule
   */
  const removeRouting = (index) => {
    const newRouting = config.printerRouting.filter((_, i) => i !== index);
    setConfig({ ...config, printerRouting: newRouting });
  };

  /**
   * Update pager config
   */
  const updatePager = (updates) => {
    setConfig({
      ...config,
      pager: { ...config.pager, ...updates },
    });
  };

  /**
   * Update customer display config
   */
  const updateCustomerDisplay = (updates) => {
    setConfig({
      ...config,
      customerDisplay: { ...config.customerDisplay, ...updates },
    });
  };

  /**
   * Handle save
   */
  const handleSave = () => {
    if (onSave) {
      onSave(config);
    }
  };

  /**
   * Handle test
   */
  const handleTest = (type, data) => {
    if (onTest) {
      onTest(type, data);
    }
  };

  /**
   * Get status badge
   */
  const getStatusBadge = (status) => {
    const badges = {
      [HARDWARE_STATUS.ONLINE]: (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
          <CheckCircleIcon className="h-4 w-4" />
          Online
        </span>
      ),
      [HARDWARE_STATUS.OFFLINE]: (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-medium">
          <XCircleIcon className="h-4 w-4" />
          Offline
        </span>
      ),
      [HARDWARE_STATUS.ERROR]: (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
          <XCircleIcon className="h-4 w-4" />
          Error
        </span>
      ),
      [HARDWARE_STATUS.CONNECTING]: (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
          <WrenchScrewdriverIcon className="h-4 w-4" />
          Connecting...
        </span>
      ),
    };

    return badges[status] || badges[HARDWARE_STATUS.OFFLINE];
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-4 px-6">
          {[
            { id: 'printers', label: 'Printers', icon: PrinterIcon },
            { id: 'routing', label: 'Printer Routing', icon: WrenchScrewdriverIcon },
            { id: 'pager', label: 'Pager System', icon: BellAlertIcon },
            { id: 'display', label: 'Customer Display', icon: TvIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Printers Tab */}
        {activeTab === 'printers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Kitchen Printers</h3>
              <button
                onClick={addPrinter}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Add Printer
              </button>
            </div>

            {config.printers.map((printer, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PrinterIcon className="h-6 w-6 text-gray-400" />
                    <input
                      type="text"
                      value={printer.name}
                      onChange={(e) => updatePrinter(index, { name: e.target.value })}
                      className="text-lg font-medium border-0 border-b-2 border-transparent hover:border-gray-300 focus:border-indigo-600 focus:outline-none"
                    />
                    {getStatusBadge(hardwareStatus.printers?.[printer.name] || HARDWARE_STATUS.OFFLINE)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTest('printer', printer.name)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => removePrinter(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Connection Type
                    </label>
                    <select
                      value={printer.connectionType}
                      onChange={(e) =>
                        updatePrinter(index, { connectionType: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {Object.values(CONNECTION_TYPE).map((type) => (
                        <option key={type} value={type}>
                          {type.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {printer.connectionType === CONNECTION_TYPE.NETWORK && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          IP Address
                        </label>
                        <input
                          type="text"
                          value={printer.ipAddress}
                          onChange={(e) =>
                            updatePrinter(index, { ipAddress: e.target.value })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="192.168.1.100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Port
                        </label>
                        <input
                          type="number"
                          value={printer.port}
                          onChange={(e) =>
                            updatePrinter(index, { port: parseInt(e.target.value) })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="9100"
                        />
                      </div>
                    </>
                  )}

                  {printer.connectionType === CONNECTION_TYPE.SERIAL && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Baud Rate
                      </label>
                      <input
                        type="number"
                        value={printer.baudRate || 9600}
                        onChange={(e) =>
                          updatePrinter(index, { baudRate: parseInt(e.target.value) })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="9600"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Paper Width (characters)
                    </label>
                    <input
                      type="number"
                      value={printer.paperWidth}
                      onChange={(e) =>
                        updatePrinter(index, { paperWidth: parseInt(e.target.value) })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="32"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={printer.autoCut}
                        onChange={(e) =>
                          updatePrinter(index, { autoCut: e.target.checked })
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Auto Cut</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={printer.enabled}
                        onChange={(e) =>
                          updatePrinter(index, { enabled: e.target.checked })
                        }
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">Enabled</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Printer Routing Tab */}
        {activeTab === 'routing' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Printer Routing Rules</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Configure which printer handles orders for each kitchen station
                </p>
              </div>
              <button
                onClick={addRouting}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="h-5 w-5" />
                Add Rule
              </button>
            </div>

            <div className="space-y-3">
              {config.printerRouting.map((rule, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Station
                      </label>
                      <select
                        value={rule.station}
                        onChange={(e) => updateRouting(index, { station: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        {Object.entries(KITCHEN_STATION).map(([key, value]) => (
                          <option key={value} value={value}>
                            {KITCHEN_STATION_LABELS[value]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Printer
                      </label>
                      <select
                        value={rule.printerName}
                        onChange={(e) =>
                          updateRouting(index, { printerName: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                      >
                        {config.printers.map((printer) => (
                          <option key={printer.name} value={printer.name}>
                            {printer.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <input
                        type="number"
                        value={rule.priority}
                        onChange={(e) =>
                          updateRouting(index, { priority: parseInt(e.target.value) })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        min="1"
                      />
                    </div>

                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={(e) =>
                            updateRouting(index, { enabled: e.target.checked })
                          }
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">Enabled</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => removeRouting(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pager Tab */}
        {activeTab === 'pager' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Pager System</h3>
              {getStatusBadge(hardwareStatus.pager || HARDWARE_STATUS.OFFLINE)}
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.pager.enabled}
                  onChange={(e) => updatePager({ enabled: e.target.checked })}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">Enable Pager System</span>
              </label>
            </div>

            {config.pager.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    System Type
                  </label>
                  <select
                    value={config.pager.systemType}
                    onChange={(e) => updatePager({ systemType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {Object.values(CONNECTION_TYPE).map((type) => (
                      <option key={type} value={type}>
                        {type.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {(config.pager.systemType === CONNECTION_TYPE.NETWORK ||
                  config.pager.systemType === CONNECTION_TYPE.API) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IP Address / Endpoint
                      </label>
                      <input
                        type="text"
                        value={config.pager.ipAddress || config.pager.apiEndpoint}
                        onChange={(e) =>
                          updatePager(
                            config.pager.systemType === CONNECTION_TYPE.NETWORK
                              ? { ipAddress: e.target.value }
                              : { apiEndpoint: e.target.value }
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>

                    {config.pager.systemType === CONNECTION_TYPE.NETWORK && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Port
                        </label>
                        <input
                          type="number"
                          value={config.pager.port}
                          onChange={(e) =>
                            updatePager({ port: parseInt(e.target.value) })
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    )}

                    {config.pager.systemType === CONNECTION_TYPE.API && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          API Key
                        </label>
                        <input
                          type="password"
                          value={config.pager.apiKey}
                          onChange={(e) => updatePager({ apiKey: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                    )}
                  </>
                )}

                {config.pager.systemType === CONNECTION_TYPE.SERIAL && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Baud Rate
                    </label>
                    <input
                      type="number"
                      value={config.pager.baudRate}
                      onChange={(e) =>
                        updatePager({ baudRate: parseInt(e.target.value) })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                )}

                <div className="col-span-2">
                  <button
                    onClick={() => handleTest('pager', 1)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Test Pager #1
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer Display Tab */}
        {activeTab === 'display' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Customer Display</h3>
              {getStatusBadge(hardwareStatus.customerDisplay || HARDWARE_STATUS.OFFLINE)}
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.customerDisplay.enabled}
                  onChange={(e) =>
                    updateCustomerDisplay({ enabled: e.target.checked })
                  }
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enable Customer Display
                </span>
              </label>
            </div>

            {config.customerDisplay.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Connection Type
                  </label>
                  <select
                    value={config.customerDisplay.connectionType}
                    onChange={(e) =>
                      updateCustomerDisplay({ connectionType: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    {Object.values(CONNECTION_TYPE).map((type) => (
                      <option key={type} value={type}>
                        {type.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {config.customerDisplay.connectionType === CONNECTION_TYPE.NETWORK && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        IP Address
                      </label>
                      <input
                        type="text"
                        value={config.customerDisplay.ipAddress}
                        onChange={(e) =>
                          updateCustomerDisplay({ ipAddress: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Port
                      </label>
                      <input
                        type="number"
                        value={config.customerDisplay.port}
                        onChange={(e) =>
                          updateCustomerDisplay({ port: parseInt(e.target.value) })
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </>
                )}

                {config.customerDisplay.connectionType === CONNECTION_TYPE.SERIAL && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Baud Rate
                    </label>
                    <input
                      type="number"
                      value={config.customerDisplay.baudRate}
                      onChange={(e) =>
                        updateCustomerDisplay({ baudRate: parseInt(e.target.value) })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lines
                  </label>
                  <input
                    type="number"
                    value={config.customerDisplay.lines}
                    onChange={(e) =>
                      updateCustomerDisplay({ lines: parseInt(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="1"
                    max="4"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Columns
                  </label>
                  <input
                    type="number"
                    value={config.customerDisplay.columns}
                    onChange={(e) =>
                      updateCustomerDisplay({ columns: parseInt(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    min="16"
                    max="40"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brightness ({config.customerDisplay.brightness}%)
                  </label>
                  <input
                    type="range"
                    value={config.customerDisplay.brightness}
                    onChange={(e) =>
                      updateCustomerDisplay({ brightness: parseInt(e.target.value) })
                    }
                    className="w-full"
                    min="0"
                    max="100"
                  />
                </div>

                <div className="col-span-2">
                  <button
                    onClick={() => handleTest('customerDisplay')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Test Display
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default HardwareConfig;
