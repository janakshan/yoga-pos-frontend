/**
 * QR Code Generator Component
 *
 * Allows admins to generate and configure QR codes for tables
 */

import { useState, useEffect } from 'react';
import { QrCodeIcon, ArrowDownTrayIcon, PrinterIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store';
import { downloadQRCode, printQRCode } from '../../services/qrService';
import toast from 'react-hot-toast';

const QRCodeGenerator = ({ tableId, table, onClose }) => {
  const { createQRCode, updateQRCode, qrOrdering } = useStore();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // QR Code Configuration
    size: 300,
    errorCorrectionLevel: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',

    // Settings
    allowOrdering: true,
    showPrices: true,
    allowModifiers: true,
    requireCustomerInfo: false,
    sessionTimeout: 120,
    maxOrdersPerSession: 10,

    // Restrictions
    allowedCategories: [],
    restrictedItems: [],
    timeStart: '',
    timeEnd: '',
    allowedDays: [0, 1, 2, 3, 4, 5, 6],

    // Metadata
    notes: ''
  });

  const [qrCode, setQrCode] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      allowedDays: prev.allowedDays.includes(day)
        ? prev.allowedDays.filter(d => d !== day)
        : [...prev.allowedDays, day]
    }));
  };

  const handleGenerate = async () => {
    if (!tableId) {
      toast.error('No table selected');
      return;
    }

    setLoading(true);

    try {
      const qrData = {
        tableId,
        tableNumber: table?.number || tableId,
        config: {
          size: parseInt(formData.size),
          errorCorrectionLevel: formData.errorCorrectionLevel,
          foregroundColor: formData.foregroundColor,
          backgroundColor: formData.backgroundColor
        },
        settings: {
          allowOrdering: formData.allowOrdering,
          showPrices: formData.showPrices,
          allowModifiers: formData.allowModifiers,
          requireCustomerInfo: formData.requireCustomerInfo,
          sessionTimeout: parseInt(formData.sessionTimeout),
          maxOrdersPerSession: parseInt(formData.maxOrdersPerSession)
        },
        restrictions: {
          allowedCategories: formData.allowedCategories,
          restrictedItems: formData.restrictedItems,
          timeRestrictions: {
            startTime: formData.timeStart || null,
            endTime: formData.timeEnd || null,
            allowedDays: formData.allowedDays
          }
        },
        notes: formData.notes
      };

      const generated = await createQRCode(qrData);
      setQrCode(generated);
      toast.success('QR code generated successfully!');
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCode) return;
    const filename = `table-${table?.number || tableId}-qr.png`;
    downloadQRCode(qrCode.qrCodeDataUrl, filename);
    toast.success('QR code downloaded');
  };

  const handlePrint = () => {
    if (!qrCode) return;
    const tableName = `Table ${table?.number || tableId}`;
    printQRCode(qrCode.qrCodeDataUrl, tableName);
  };

  const errorLevels = [
    { value: 'L', label: 'Low (7%)', description: 'Best for clean environments' },
    { value: 'M', label: 'Medium (15%)', description: 'Recommended' },
    { value: 'Q', label: 'Quartile (25%)', description: 'Good for logos' },
    { value: 'H', label: 'High (30%)', description: 'Best for damaged codes' }
  ];

  const days = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <QrCodeIcon className="h-8 w-8 text-indigo-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Generate QR Code</h2>
            <p className="text-sm text-gray-500">
              Table {table?.number || tableId} - {table?.name || 'Unnamed Table'}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* QR Code Configuration */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">QR Code Appearance</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size (pixels)
                </label>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  min="100"
                  max="1000"
                  step="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Error Correction
                </label>
                <select
                  name="errorCorrectionLevel"
                  value={formData.errorCorrectionLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {errorLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foreground Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    name="foregroundColor"
                    value={formData.foregroundColor}
                    onChange={handleInputChange}
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.foregroundColor}
                    onChange={(e) => handleInputChange({ target: { name: 'foregroundColor', value: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    name="backgroundColor"
                    value={formData.backgroundColor}
                    onChange={handleInputChange}
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.backgroundColor}
                    onChange={(e) => handleInputChange({ target: { name: 'backgroundColor', value: e.target.value } })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ordering Settings */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Ordering Settings</h3>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="allowOrdering"
                  checked={formData.allowOrdering}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Allow customers to place orders</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="showPrices"
                  checked={formData.showPrices}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Show prices to customers</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="allowModifiers"
                  checked={formData.allowModifiers}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Allow modifier selection</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="requireCustomerInfo"
                  checked={formData.requireCustomerInfo}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Require customer information</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={formData.sessionTimeout}
                  onChange={handleInputChange}
                  min="15"
                  max="480"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Orders Per Session
                </label>
                <input
                  type="number"
                  name="maxOrdersPerSession"
                  value={formData.maxOrdersPerSession}
                  onChange={handleInputChange}
                  min="1"
                  max="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Time Restrictions */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Time Restrictions</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  name="timeStart"
                  value={formData.timeStart}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  name="timeEnd"
                  value={formData.timeEnd}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed Days
              </label>
              <div className="flex space-x-2">
                {days.map(day => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayToggle(day.value)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      formData.allowedDays.includes(day.value)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Notes</h3>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              placeholder="Add any notes about this QR code..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* QR Code Preview */}
        <div className="space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-900 mb-4 text-center">Preview</h3>

            {qrCode ? (
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={qrCode.qrCodeDataUrl}
                  alt="QR Code"
                  className="w-full max-w-xs border-4 border-white shadow-lg rounded-lg"
                />

                <div className="text-center">
                  <p className="text-xs font-mono text-gray-500 break-all">
                    {qrCode.code}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {qrCode.url}
                  </p>
                </div>

                <div className="flex space-x-2 w-full">
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Download
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PrinterIcon className="h-4 w-4 mr-2" />
                    Print
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <QrCodeIcon className="h-24 w-24 mb-4" />
                <p className="text-sm text-center">
                  Configure settings and click<br />Generate to create QR code
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
