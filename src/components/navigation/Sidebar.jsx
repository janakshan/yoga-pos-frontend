import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  ShoppingCartIcon,
  CubeIcon,
  UserIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  CalendarIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Branches', path: '/branches', icon: BuildingStorefrontIcon },
  { name: 'Staff', path: '/staff', icon: UserGroupIcon },
  { name: 'POS', path: '/pos', icon: ShoppingCartIcon },
  { name: 'Products', path: '/products', icon: CubeIcon },
  { name: 'Customers', path: '/customers', icon: UserIcon },
  { name: 'Inventory', path: '/inventory', icon: ArchiveBoxIcon },
  { name: 'Bookings', path: '/bookings', icon: CalendarIcon },
  { name: 'Payments', path: '/payments', icon: CreditCardIcon },
  { name: 'Reports', path: '/reports', icon: ChartBarIcon },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
];

/**
 * Sidebar navigation component
 * Displays navigation links for all modules in the application
 */
const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 min-h-screen flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">Yoga POS</h1>
        <p className="text-sm text-gray-400 mt-1">Management System</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-300 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 text-center">
          © 2025 Yoga POS System
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
