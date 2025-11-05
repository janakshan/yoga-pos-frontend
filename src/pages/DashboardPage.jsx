import React from 'react';
import { useAuthStore } from '@/store/authSlice';

/**
 * DashboardPage Component
 * Main dashboard page showing overview and stats
 */
const DashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your Yoga POS management system
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-gray-900">$12,345</p>
          <p className="text-sm text-green-600 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Active Members
          </h3>
          <p className="text-3xl font-bold text-gray-900">456</p>
          <p className="text-sm text-green-600 mt-2">+8% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            Classes Today
          </h3>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-sm text-gray-600 mt-2">3 in progress</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Branches</h3>
          <p className="text-3xl font-bold text-gray-900">5</p>
          <p className="text-sm text-gray-600 mt-2">All active</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">New member registered</p>
              <p className="text-sm text-gray-600">John Doe joined Downtown Branch</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Class completed</p>
              <p className="text-sm text-gray-600">Morning Yoga - 15 attendees</p>
            </div>
            <span className="text-sm text-gray-500">4 hours ago</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Payment received</p>
              <p className="text-sm text-gray-600">Monthly subscription - $99</p>
            </div>
            <span className="text-sm text-gray-500">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
