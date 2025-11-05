import React from 'react';
import { useStore, selectUser } from '@/store';

/**
 * DashboardPage Component
 * Main dashboard page showing overview and stats
 * Features: Dark mode support, mobile responsive layout
 */
const DashboardPage = () => {
  const user = useStore(selectUser);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your Yoga POS management system
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Total Revenue
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">$12,345</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Active Members
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">456</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">+8% from last month</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Classes Today
          </h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">12</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">3 in progress</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 sm:p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Branches</h3>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">5</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">All active</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/50 p-4 sm:p-6 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 dark:border-gray-700 gap-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">New member registered</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">John Doe joined Downtown Branch</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 dark:border-gray-700 gap-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Class completed</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Morning Yoga - 15 attendees</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">4 hours ago</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Payment received</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly subscription - $99</p>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
