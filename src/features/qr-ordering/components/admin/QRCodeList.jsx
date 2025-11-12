/**
 * QR Code List Component
 *
 * Displays and manages all QR codes for tables
 */

import { useState, useEffect } from 'react';
import {
  QrCodeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  DownloadIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { useStore } from '@/store';
import { downloadQRCode, printQRCode } from '../../services/qrService';
import toast from 'react-hot-toast';
import QRCodeGenerator from './QRCodeGenerator';

const QRCodeList = () => {
  const { fetchQRCodes, deleteQRCode, toggleQRCodeStatus, qrOrdering } = useStore();
  const [showGenerator, setShowGenerator] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    loadQRCodes();
  }, [filterStatus]);

  const loadQRCodes = async () => {
    try {
      const filters = {};
      if (filterStatus !== 'all') {
        filters.status = filterStatus;
      }
      await fetchQRCodes(filters);
    } catch (error) {
      console.error('Error loading QR codes:', error);
      toast.error('Failed to load QR codes');
    }
  };

  const handleCreateQRCode = (table) => {
    setSelectedTable(table);
    setShowGenerator(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this QR code?')) {
      return;
    }

    try {
      await deleteQRCode(id);
      toast.success('QR code deleted');
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('Failed to delete QR code');
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const activate = currentStatus !== 'active';
      await toggleQRCodeStatus(id, activate);
      toast.success(activate ? 'QR code activated' : 'QR code deactivated');
    } catch (error) {
      console.error('Error toggling QR code status:', error);
      toast.error('Failed to update QR code status');
    }
  };

  const handleDownload = (qrCode) => {
    const filename = `table-${qrCode.tableId}-qr.png`;
    downloadQRCode(qrCode.qrCodeDataUrl, filename);
    toast.success('QR code downloaded');
  };

  const handlePrint = (qrCode) => {
    const tableName = `Table ${qrCode.tableId}`;
    printQRCode(qrCode.qrCodeDataUrl, tableName);
  };

  const filteredQRCodes = qrOrdering.qrCodes.filter(qr => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        qr.code.toLowerCase().includes(query) ||
        qr.tableId.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      case 'revoked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showGenerator) {
    return (
      <QRCodeGenerator
        tableId={selectedTable?.id}
        table={selectedTable}
        onClose={() => {
          setShowGenerator(false);
          setSelectedTable(null);
          loadQRCodes();
        }}
      />
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <QrCodeIcon className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QR Code Management</h1>
              <p className="text-sm text-gray-500">
                Manage QR codes for table ordering
              </p>
            </div>
          </div>

          <button
            onClick={() => handleCreateQRCode({ id: 'new', number: 'New' })}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create QR Code
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total QR Codes</div>
            <div className="text-2xl font-bold text-gray-900">
              {qrOrdering.qrCodes.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Active</div>
            <div className="text-2xl font-bold text-green-600">
              {qrOrdering.qrCodes.filter(qr => qr.status === 'active').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Inactive</div>
            <div className="text-2xl font-bold text-gray-600">
              {qrOrdering.qrCodes.filter(qr => qr.status === 'inactive').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-500">Total Scans</div>
            <div className="text-2xl font-bold text-indigo-600">
              {qrOrdering.qrCodes.reduce((sum, qr) => sum + qr.analytics.totalScans, 0)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search QR codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>

          <button
            onClick={loadQRCodes}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <ArrowPathIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* QR Codes Grid */}
      {qrOrdering.qrCodeLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredQRCodes.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <QrCodeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No QR codes found</h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first QR code for a table
          </p>
          <button
            onClick={() => handleCreateQRCode({ id: 'new', number: 'New' })}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create QR Code
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredQRCodes.map((qrCode) => (
            <div
              key={qrCode.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              {/* QR Code Image */}
              <div className="p-4 bg-gray-50 rounded-t-lg">
                <img
                  src={qrCode.qrCodeDataUrl}
                  alt={`QR Code for ${qrCode.tableId}`}
                  className="w-full aspect-square object-contain"
                />
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Table {qrCode.tableId}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(qrCode.status)}`}>
                    {qrCode.status}
                  </span>
                </div>

                <p className="text-xs font-mono text-gray-500 mb-3 truncate">
                  {qrCode.code}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div>
                    <div className="text-gray-500">Scans</div>
                    <div className="font-semibold">{qrCode.analytics.totalScans}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Sessions</div>
                    <div className="font-semibold">{qrCode.analytics.totalSessions}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Orders</div>
                    <div className="font-semibold">{qrCode.analytics.totalOrders}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Revenue</div>
                    <div className="font-semibold">${qrCode.analytics.totalRevenue.toFixed(2)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDownload(qrCode)}
                    className="flex-1 flex items-center justify-center px-2 py-2 border border-gray-300 rounded-md text-xs hover:bg-gray-50"
                    title="Download"
                  >
                    <DownloadIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handlePrint(qrCode)}
                    className="flex-1 flex items-center justify-center px-2 py-2 border border-gray-300 rounded-md text-xs hover:bg-gray-50"
                    title="Print"
                  >
                    <PrinterIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(qrCode.id, qrCode.status)}
                    className={`flex-1 flex items-center justify-center px-2 py-2 border rounded-md text-xs ${
                      qrCode.status === 'active'
                        ? 'border-red-300 text-red-600 hover:bg-red-50'
                        : 'border-green-300 text-green-600 hover:bg-green-50'
                    }`}
                    title={qrCode.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {qrCode.status === 'active' ? (
                      <XCircleIcon className="h-4 w-4" />
                    ) : (
                      <CheckCircleIcon className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(qrCode.id)}
                    className="flex-1 flex items-center justify-center px-2 py-2 border border-red-300 text-red-600 rounded-md text-xs hover:bg-red-50"
                    title="Delete"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QRCodeList;
