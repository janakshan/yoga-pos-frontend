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
  ArchiveBoxIcon,
  ShieldCheckIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Branches', path: '/branches', icon: BuildingStorefrontIcon },
  { name: 'Staff', path: '/staff', icon: UserGroupIcon },
  { name: 'Users', path: '/users', icon: UsersIcon },
  { name: 'Roles', path: '/roles', icon: ShieldCheckIcon },
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
    <aside className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen flex flex-col shadow-xl">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white tracking-tight">Yoga POS</h1>
        <p className="text-sm text-gray-400 mt-1">Management System</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-gray-300 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50 scale-105'
                    : 'hover:bg-gray-700 hover:text-white hover:translate-x-1'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-900">
        <p className="text-xs text-gray-500 text-center">
          © 2025 Yoga POS System
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
