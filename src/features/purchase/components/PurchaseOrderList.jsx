import React, { useState, useMemo } from 'react';
import { Search, Eye, Package, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { usePurchase } from '../hooks/usePurchase.js';
import { GoodsReceivingModal } from './GoodsReceivingModal.jsx';
import { PurchaseOrderDetailModal } from './PurchaseOrderDetailModal.jsx';
import {
  PURCHASE_STATUS_LABELS,
  PURCHASE_STATUS_COLORS,
  PAYMENT_STATUS_LABELS
} from '../types/purchase.types.js';

export const PurchaseOrderList = ({ onEdit }) => {
  const { purchaseOrders, isLoading, updateStatus } = usePurchase();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showReceivingModal, setShowReceivingModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState(null);

  const filteredOrders = useMemo(() => {
    return purchaseOrders.filter((po) => {
      const matchesSearch =
        searchTerm === '' ||
        po.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        po.supplierName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || po.status === statusFilter;

      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  }, [purchaseOrders, searchTerm, statusFilter]);

  const handleViewDetail = (po) => {
    setSelectedPO(po);
    setShowDetailModal(true);
  };

  const handleReceiveGoods = (po) => {
    setSelectedPO(po);
    setShowReceivingModal(true);
  };

  const handleApprove = async (po) => {
    if (window.confirm(`Approve purchase order ${po.orderNumber}?`)) {
      try {
        await updateStatus(po.id, 'approved', { approvedBy: 'current-user' });
      } catch (error) {
        // Error handled by hook
      }
    }
  };

  const getStatusColor = (status) => {
    const colorMap = PURCHASE_STATUS_COLORS;
    const color = colorMap[status] || 'gray';
    return `bg-${color}-100 text-${color}-800`;
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'partial':
        return 'text-yellow-600';
      case 'unpaid':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading && purchaseOrders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading purchase orders...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search purchase orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="ordered">Ordered</option>
          <option value="partial">Partially Received</option>
          <option value="received">Received</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No purchase orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((po) => (
            <div
              key={po.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {po.orderNumber}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(po.status)}`}>
                      {PURCHASE_STATUS_LABELS[po.status]}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{po.supplierName}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Order Date
                      </div>
                      <div className="text-sm font-medium">{formatDate(po.orderDate)}</div>
                    </div>

                    {po.expectedDeliveryDate && (
                      <div>
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Expected Delivery
                        </div>
                        <div className="text-sm font-medium">
                          {formatDate(po.expectedDeliveryDate)}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Package className="h-3 w-3 mr-1" />
                        Items
                      </div>
                      <div className="text-sm font-medium">{po.items.length} items</div>
                    </div>

                    <div>
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <DollarSign className="h-3 w-3 mr-1" />
                        Total Amount
                      </div>
                      <div className="text-sm font-medium">{formatCurrency(po.totalAmount)}</div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="mt-3 flex items-center gap-4 text-sm">
                    <span className="text-gray-600">Payment:</span>
                    <span className={`font-medium ${getPaymentStatusColor(po.paymentStatus)}`}>
                      {PAYMENT_STATUS_LABELS[po.paymentStatus]}
                    </span>
                    {po.paymentStatus !== 'paid' && (
                      <span className="text-gray-600">
                        Balance: {formatCurrency(po.balanceAmount)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleViewDetail(po)}
                    className="inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>

                  {po.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(po)}
                      className="inline-flex items-center justify-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-white hover:bg-green-50"
                    >
                      Approve
                    </button>
                  )}

                  {(po.status === 'approved' || po.status === 'ordered' || po.status === 'partial') && (
                    <button
                      onClick={() => handleReceiveGoods(po)}
                      className="inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50"
                    >
                      <Package className="h-4 w-4 mr-1" />
                      Receive
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showReceivingModal && selectedPO && (
        <GoodsReceivingModal
          purchaseOrder={selectedPO}
          onClose={() => {
            setShowReceivingModal(false);
            setSelectedPO(null);
          }}
        />
      )}

      {showDetailModal && selectedPO && (
        <PurchaseOrderDetailModal
          purchaseOrder={selectedPO}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedPO(null);
          }}
          onEdit={() => {
            setShowDetailModal(false);
            onEdit(selectedPO);
          }}
        />
      )}
    </div>
  );
};
