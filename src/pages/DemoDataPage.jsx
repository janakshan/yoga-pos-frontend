import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Package,
  Tag,
  FileText,
  ArrowRight,
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  ShoppingCart,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { branchService } from '../features/branch/services/branchService';
import { pricingService } from '../features/pricing/services/pricingService';
import { inventoryService } from '../features/inventory/services/inventoryService';
import { reportService } from '../features/reports/services/reportService';

/**
 * DemoDataPage Component
 * Comprehensive overview of all demo data in the system
 */
const DemoDataPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [demoData, setDemoData] = useState({
    branches: [],
    promotions: [],
    transactions: [],
    reports: [],
    branchPrices: [],
  });

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
    try {
      setLoading(true);
      const [branches, promotions, transactions, reports, branchPrices] = await Promise.all([
        branchService.getList(),
        pricingService.getPromotions(),
        inventoryService.getTransactionHistory({ limit: 10 }),
        reportService.getReports(),
        pricingService.getBranchPrices(),
      ]);

      setDemoData({
        branches: branches.items || [],
        promotions: promotions.items || [],
        transactions: transactions.items || [],
        reports: reports.items || [],
        branchPrices: branchPrices.items || [],
      });
    } catch (error) {
      console.error('Failed to load demo data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeBranches = demoData.branches.filter(b => b.isActive);
  const activePromotions = demoData.promotions.filter(p => p.status === 'ACTIVE');
  const scheduledPromotions = demoData.promotions.filter(p => p.status === 'SCHEDULED');

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Demo Data Overview</h1>
        <p className="text-gray-600">
          Comprehensive view of all demo data in the Yoga POS system. Click on any section to explore the features.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <Store className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="text-sm font-medium opacity-90 mb-1">Branches</h3>
          <p className="text-3xl font-bold">{demoData.branches.length}</p>
          <p className="text-sm opacity-80 mt-2">{activeBranches.length} active</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <Tag className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="text-sm font-medium opacity-90 mb-1">Promotions</h3>
          <p className="text-3xl font-bold">{demoData.promotions.length}</p>
          <p className="text-sm opacity-80 mt-2">{activePromotions.length} active</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <Package className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="text-sm font-medium opacity-90 mb-1">Transactions</h3>
          <p className="text-3xl font-bold">{demoData.transactions.length}</p>
          <p className="text-sm opacity-80 mt-2">Recent inventory activity</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-md p-6 text-white">
          <FileText className="w-8 h-8 opacity-80 mb-3" />
          <h3 className="text-sm font-medium opacity-90 mb-1">Reports</h3>
          <p className="text-3xl font-bold">{demoData.reports.length}</p>
          <p className="text-sm opacity-80 mt-2">Sample reports</p>
        </div>
      </div>

      {/* Branches Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Store className="w-6 h-6 text-blue-600" />
              Branch Locations
            </h2>
            <p className="text-sm text-gray-600 mt-1">5 demo branches with full performance metrics</p>
          </div>
          <button
            onClick={() => navigate('/branches')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {demoData.branches.map((branch) => (
              <div
                key={branch.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => navigate('/branches')}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Store className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{branch.name}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        branch.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {branch.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {branch.city}, {branch.state}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {branch.staffCount} staff
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="text-lg font-bold text-gray-900">
                    ${branch.monthlyRevenue?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{branch.transactionCount} transactions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promotions Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Tag className="w-6 h-6 text-green-600" />
              Promotions
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {activePromotions.length} active promotions, {scheduledPromotions.length} scheduled
            </p>
          </div>
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoData.promotions.map((promo) => (
              <div
                key={promo.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{promo.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{promo.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ml-2 ${
                    promo.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : promo.status === 'SCHEDULED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {promo.status === 'ACTIVE' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                    {promo.status === 'SCHEDULED' && <Clock className="w-3 h-3 inline mr-1" />}
                    {promo.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-gray-600">
                    {promo.type === 'PERCENTAGE' && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {promo.discountPercentage}% off
                      </span>
                    )}
                    {promo.type === 'FIXED_AMOUNT' && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${promo.discountAmount} off
                      </span>
                    )}
                    {promo.type === 'BUY_X_GET_Y' && (
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4" />
                        Buy {promo.buyQuantity} Get {promo.getQuantity}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(promo.startDate).toLocaleDateString()}
                  </div>
                </div>
                {promo.code && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Code: </span>
                    <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {promo.code}
                    </code>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Transactions Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-purple-600" />
              Recent Inventory Activity
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Sample transactions including purchases, sales, and transfers
            </p>
          </div>
          <button
            onClick={() => navigate('/inventory')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {demoData.transactions.slice(0, 7).map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(txn.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      txn.type === 'PURCHASE'
                        ? 'bg-blue-100 text-blue-800'
                        : txn.type === 'SALE'
                        ? 'bg-green-100 text-green-800'
                        : txn.type === 'TRANSFER_IN' || txn.type === 'TRANSFER_OUT'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {txn.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{txn.productName}</div>
                    <div className="text-xs text-gray-500">{txn.productSku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {txn.quantity > 0 ? '+' : ''}{txn.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {txn.branchName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    ${txn.totalCost?.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Branch-Specific Pricing Section */}
      {demoData.branchPrices.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-blue-600" />
              Branch-Specific Pricing
            </h2>
            <p className="text-sm text-gray-600 mt-1">Location-based price variations</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {demoData.branchPrices.map((price) => (
                <div
                  key={price.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{price.productName}</p>
                    <p className="text-sm text-gray-600 mt-1">{price.branchName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">${price.price}</p>
                    {price.isActive && (
                      <span className="text-xs text-green-600 flex items-center gap-1 justify-end">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports Section */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100 mb-8">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-orange-600" />
              Sample Reports
            </h2>
            <p className="text-sm text-gray-600 mt-1">Pre-configured analytics and insights</p>
          </div>
          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoData.reports.map((report) => (
              <div
                key={report.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer"
                onClick={() => navigate('/reports')}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{report.name}</h3>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                    {report.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(report.startDate).toLocaleDateString()} - {new Date(report.endDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {report.format}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-md border border-blue-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-blue-600" />
          Where to Find Everything
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Dashboard</h3>
            <p className="text-sm text-gray-600">Multi-branch overview & consolidated metrics</p>
          </button>
          <button
            onClick={() => navigate('/branches')}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Branch Management</h3>
            <p className="text-sm text-gray-600">View, edit, and manage all 5 branch locations</p>
          </button>
          <button
            onClick={() => navigate('/inventory')}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Inventory</h3>
            <p className="text-sm text-gray-600">Stock levels, transactions & inter-branch transfers</p>
          </button>
          <button
            onClick={() => navigate('/pos')}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Point of Sale</h3>
            <p className="text-sm text-gray-600">Branch-aware POS with pricing & promotions</p>
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Reports</h3>
            <p className="text-sm text-gray-600">Analytics, sales reports & performance data</p>
          </button>
          <button
            onClick={() => navigate('/customers')}
            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow text-left"
          >
            <h3 className="font-semibold text-gray-900 mb-2">Customers</h3>
            <p className="text-sm text-gray-600">Customer management & tracking</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoDataPage;
