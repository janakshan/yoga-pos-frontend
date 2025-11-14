import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  BuildingStorefrontIcon,
  ShoppingCartIcon,
  CubeIcon,
  UserIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  CreditCardIcon,
  CalendarIcon,
  ArchiveBoxIcon,
  ShieldCheckIcon,
  UsersIcon,
  TruckIcon,
  BuildingOffice2Icon,
  ArrowRightStartOnRectangleIcon,
  ClipboardDocumentListIcon,
  RectangleStackIcon,
  MapIcon,
  TableCellsIcon,
  BookOpenIcon,
  ClockIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../features/auth/hooks';
import { useBusinessType } from '../../hooks/useBusinessType';
import { usePermissions } from '../../hooks/usePermissions';
import { BUSINESS_TYPES } from '../../types/business.types';

const navigationItems = [
  { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
  { name: 'Branches', path: '/branches', icon: BuildingStorefrontIcon },
  { name: 'Users', path: '/users', icon: UsersIcon },
  { name: 'Roles', path: '/roles', icon: ShieldCheckIcon },
  { name: 'Permissions', path: '/permissions', icon: ShieldCheckIcon },
  { name: 'POS', path: '/pos', icon: ShoppingCartIcon },
  { name: 'Products', path: '/products', icon: CubeIcon },
  { name: 'Customers', path: '/customers', icon: UserIcon },
  { name: 'Inventory', path: '/inventory', icon: ArchiveBoxIcon },
  { name: 'Recipes', path: '/recipes', icon: BookOpenIcon, businessType: BUSINESS_TYPES.RESTAURANT },
  { name: 'Suppliers', path: '/suppliers', icon: BuildingOffice2Icon },
  { name: 'Purchase Orders', path: '/purchase-orders', icon: TruckIcon },
  // Restaurant-specific features
  { name: 'Orders Dashboard', path: '/orders-dashboard', icon: RectangleStackIcon, businessType: BUSINESS_TYPES.RESTAURANT },
  { name: 'Restaurant Orders', path: '/orders', icon: ClipboardDocumentListIcon, businessType: BUSINESS_TYPES.RESTAURANT },
  { name: 'Tables', path: '/tables', icon: TableCellsIcon, businessType: BUSINESS_TYPES.RESTAURANT },
  { name: 'Floor Plan', path: '/floor-plan', icon: MapIcon, businessType: BUSINESS_TYPES.RESTAURANT },
  { name: 'Kitchen Display', path: '/kitchen-display', icon: ComputerDesktopIcon, businessType: BUSINESS_TYPES.RESTAURANT },
  { name: 'Server Management', path: '/server-management', icon: ClockIcon, businessType: BUSINESS_TYPES.RESTAURANT },
  // Yoga-specific features
  { name: 'Bookings', path: '/bookings', icon: CalendarIcon, businessType: BUSINESS_TYPES.YOGA },
  // Common features
  { name: 'Financial', path: '/financial', icon: CreditCardIcon },
  { name: 'Reports', path: '/reports', icon: ChartBarIcon },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
];

/**
 * Sidebar navigation component
 * Displays navigation links for all modules in the application
 * Supports mobile drawer functionality
 */
const Sidebar = ({ isMobileMenuOpen = false, setIsMobileMenuOpen = () => {} }) => {
  const navigate = useNavigate();
  const { logout, isLoading } = useAuth();
  const { businessType } = useBusinessType();
  const { canAccessRoute } = usePermissions();

  // Filter navigation items based on business type and permissions
  const visibleNavigationItems = navigationItems.filter((item) => {
    // Check business type filter
    if (item.businessType && item.businessType !== businessType) {
      return false;
    }

    // Check permission-based access
    if (!canAccessRoute(item.path)) {
      return false;
    }

    return true;
  });

  const handleLinkClick = () => {
    // Close mobile menu when a link is clicked
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside
      className={`
        w-64 min-h-screen flex flex-col shadow-xl
        bg-white
        border-r border-gray-200
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-600">
        <h1 className="text-2xl font-bold text-white tracking-tight">Yoga POS</h1>
        <p className="text-sm text-indigo-100 mt-1">Management System</p>
      </div>

      {/* Navigation Links */}
      <nav key={businessType} className="flex-1 px-3 py-4 space-y-1 overflow-y-auto bg-white">
        {visibleNavigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleLinkClick}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-600'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3 shrink-0" />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer with Logout Button */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 mb-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRightStartOnRectangleIcon className="w-5 h-5 mr-3" />
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
        <p className="text-xs text-gray-500 text-center">
          © 2025 Yoga POS System
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
