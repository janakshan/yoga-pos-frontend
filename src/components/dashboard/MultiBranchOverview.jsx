import React, { useEffect, useState } from 'react';
import {
  Store,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Package,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useBranch } from '../../features/branch/hooks/useBranch.js';
import { branchService } from '../../features/branch/services/branchService.js';

/**
 * MultiBranchOverview Component
 * Dashboard overview showing consolidated metrics across all branches
 * @returns {JSX.Element}
 */
export const MultiBranchOverview = () => {
  const { branches, currentBranch } = useBranch();
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
  }, []);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const data = await branchService.getConsolidatedPerformance();
      setPerformanceData(data);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activeBranches = branches.filter(b => b.isActive);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Multi-Branch Overview</h2>
          <p className="text-sm text-gray-600 mt-1">
            Consolidated performance across {activeBranches.length} active branches
          </p>
        </div>
        {currentBranch && (
          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Current Branch</p>
            <p className="text-sm font-semibold text-blue-900">{currentBranch.name}</p>
          </div>
        )}
      </div>

      {/* Consolidated Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
              All Branches
            </span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold">
            ${performanceData?.totalRevenue?.toLocaleString() || '0'}
          </p>
          <p className="text-sm opacity-80 mt-2">
            Avg: ${(performanceData?.totalRevenue / activeBranches.length || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} per branch
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 opacity-80" />
            <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
              This Month
            </span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Total Transactions</h3>
          <p className="text-3xl font-bold">
            {performanceData?.totalTransactions?.toLocaleString() || '0'}
          </p>
          <p className="text-sm opacity-80 mt-2">
            Avg ticket: ${performanceData?.averageTicketSize?.toFixed(2) || '0'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Store className="w-8 h-8 opacity-80" />
            <span className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
              Active
            </span>
          </div>
          <h3 className="text-sm font-medium opacity-90 mb-1">Branch Locations</h3>
          <p className="text-3xl font-bold">{activeBranches.length}</p>
          <p className="text-sm opacity-80 mt-2">
            {branches.length - activeBranches.length} inactive
          </p>
        </div>
      </div>

      {/* Top Performing Branches */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Top Performing Branches</h3>
          <p className="text-sm text-gray-600 mt-1">Ranked by monthly revenue</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {performanceData?.topPerformingBranches?.slice(0, 5).map((branch, index) => (
              <div
                key={branch.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-amber-600' :
                    'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{branch.name}</p>
                    <p className="text-sm text-gray-600">
                      {branch.transactions} transactions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${branch.revenue.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>+12%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Performance Comparison */}
      <div className="bg-white rounded-lg shadow-md border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">Branch Performance</h3>
          <p className="text-sm text-gray-600 mt-1">Key metrics by location</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceData?.branchPerformance?.map((branch) => (
                <tr key={branch.branchId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Store className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900">{branch.branchName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ${branch.revenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{branch.transactions}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      ${branch.averageTicketSize.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{branch.staffCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-white rounded-lg shadow-md border border-gray-100 p-4 hover:shadow-lg transition-shadow text-left group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Transfer Inventory</h4>
          <p className="text-sm text-gray-600">Move stock between branches</p>
        </button>

        <button className="bg-white rounded-lg shadow-md border border-gray-100 p-4 hover:shadow-lg transition-shadow text-left group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">View Reports</h4>
          <p className="text-sm text-gray-600">Consolidated analytics</p>
        </button>

        <button className="bg-white rounded-lg shadow-md border border-gray-100 p-4 hover:shadow-lg transition-shadow text-left group">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-purple-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-1">Manage Branches</h4>
          <p className="text-sm text-gray-600">Settings and configuration</p>
        </button>
      </div>
    </div>
  );
};

export default MultiBranchOverview;
