import React, { useState } from 'react';
import { InventoryTransactionList } from '../features/inventory/components/InventoryTransactionList.jsx';
import { StockLevelsList } from '../features/inventory/components/StockLevelsList.jsx';
import InventoryDashboard from '../features/inventory/components/InventoryDashboard.jsx';
import InventoryAlertsList from '../features/inventory/components/InventoryAlertsList.jsx';
import CycleCountList from '../features/inventory/components/CycleCountList.jsx';

/**
 * InventoryPage
 * Main page for comprehensive inventory management with dashboard, transactions, stock levels, alerts, and cycle counts
 * @returns {JSX.Element}
 */
const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="h-full px-4 sm:px-6 py-4 sm:py-6 overflow-auto bg-gray-50">
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('stock-levels')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'stock-levels'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Stock Levels
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'alerts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Alerts
            </button>
            <button
              onClick={() => setActiveTab('cycle-counts')}
              className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === 'cycle-counts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Cycle Counts
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <InventoryDashboard />}
      {activeTab === 'stock-levels' && <StockLevelsList />}
      {activeTab === 'transactions' && <InventoryTransactionList />}
      {activeTab === 'alerts' && <InventoryAlertsList />}
      {activeTab === 'cycle-counts' && <CycleCountList />}
    </div>
  );
};

export default InventoryPage;
