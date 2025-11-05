/**
 * HomePage Component
 * Main dashboard/home page for authenticated users
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth';
import { Building2, Users, Package, ShoppingCart, Calendar, UserCircle2 } from 'lucide-react';

export const HomePage = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      name: 'Branches',
      description: 'Manage your yoga studio branches',
      icon: Building2,
      href: '/branches',
      color: 'bg-blue-500',
    },
    {
      name: 'Staff',
      description: 'Manage staff members and permissions',
      icon: Users,
      href: '/staff',
      color: 'bg-green-500',
    },
    {
      name: 'Products',
      description: 'Manage products and inventory',
      icon: Package,
      href: '/products',
      color: 'bg-purple-500',
    },
    {
      name: 'POS',
      description: 'Process sales and transactions',
      icon: ShoppingCart,
      href: '/pos',
      color: 'bg-orange-500',
    },
    {
      name: 'Bookings',
      description: 'Manage class bookings and schedules',
      icon: Calendar,
      href: '/bookings',
      color: 'bg-pink-500',
    },
    {
      name: 'Customers',
      description: 'Manage customer information',
      icon: UserCircle2,
      href: '/customers',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your yoga studio today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">3</h3>
          <p className="text-sm text-gray-600">Active Branches</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">4</h3>
          <p className="text-sm text-gray-600">Staff Members</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">12</h3>
          <p className="text-sm text-gray-600">Today's Bookings</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">$1,250</h3>
          <p className="text-sm text-gray-600">Today's Sales</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start">
                  <div className={`p-3 ${action.color} rounded-lg mr-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {action.name}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You are logged in as <strong>{user?.role}</strong>.
          The Branch and Staff modules are fully functional with mock data.
          Other modules are placeholders and will be implemented later.
        </p>
      </div>
    </div>
  );
};
