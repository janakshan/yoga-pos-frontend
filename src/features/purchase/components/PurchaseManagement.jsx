import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, TrendingUp } from 'lucide-react';
import { SupplierList } from './SupplierList.jsx';
import { PurchaseOrderList } from './PurchaseOrderList.jsx';
import { PurchaseAnalytics } from './PurchaseAnalytics.jsx';
import { SupplierFormModal } from './SupplierFormModal.jsx';
import { PurchaseOrderFormModal } from './PurchaseOrderFormModal.jsx';
import { useSuppliers } from '../hooks/useSuppliers.js';
import { usePurchase } from '../hooks/usePurchase.js';

export const PurchaseManagement = () => {
  const [activeTab, setActiveTab] = useState('purchase-orders');
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPOModal, setShowPOModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);

  const { fetchSuppliers } = useSuppliers();
  const { fetchPurchaseOrders } = usePurchase();

  useEffect(() => {
    // Load initial data
    fetchSuppliers();
    fetchPurchaseOrders();
  }, [fetchSuppliers, fetchPurchaseOrders]);

  const tabs = [
    { id: 'purchase-orders', label: 'Purchase Orders', icon: null },
    { id: 'suppliers', label: 'Suppliers', icon: null },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  const handleAddNew = () => {
    if (activeTab === 'suppliers') {
      setSelectedSupplier(null);
      setShowSupplierModal(true);
    } else if (activeTab === 'purchase-orders') {
      setSelectedPO(null);
      setShowPOModal(true);
    }
  };

  const handleEditSupplier = (supplier) => {
    setSelectedSupplier(supplier);
    setShowSupplierModal(true);
  };

  const handleEditPO = (po) => {
    setSelectedPO(po);
    setShowPOModal(true);
  };

  const handleCloseSupplierModal = () => {
    setShowSupplierModal(false);
    setSelectedSupplier(null);
  };

  const handleClosePOModal = () => {
    setShowPOModal(false);
    setSelectedPO(null);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Purchase & Procurement
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage suppliers, purchase orders, and goods receiving
            </p>
          </div>
          {activeTab !== 'analytics' && (
            <button
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              {activeTab === 'suppliers' ? 'Add Supplier' : 'New Purchase Order'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-center">
                  {Icon && <Icon className="h-4 w-4 mr-2" />}
                  {tab.label}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'purchase-orders' && (
          <PurchaseOrderList onEdit={handleEditPO} />
        )}
        {activeTab === 'suppliers' && (
          <SupplierList onEdit={handleEditSupplier} />
        )}
        {activeTab === 'analytics' && <PurchaseAnalytics />}
      </div>

      {/* Modals */}
      {showSupplierModal && (
        <SupplierFormModal
          supplier={selectedSupplier}
          onClose={handleCloseSupplierModal}
        />
      )}
      {showPOModal && (
        <PurchaseOrderFormModal
          purchaseOrder={selectedPO}
          onClose={handleClosePOModal}
        />
      )}
    </div>
  );
};
