/**
 * Security Settings Component
 *
 * Manages security-related settings including permission guards toggle
 */

import { useState } from 'react';
import { useStore } from '../../../store';
import { usePermissions } from '../../../hooks/usePermissions';
import { ShieldCheckIcon, ShieldExclamationIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const SecuritySettings = () => {
  const enablePermissionGuards = useStore((state) => state.enablePermissionGuards);
  const togglePermissionGuards = useStore((state) => state.togglePermissionGuards);
  const { userPermissions, hasRole, isAdmin } = usePermissions();

  const handleToggleGuards = () => {
    togglePermissionGuards();
    const newState = !enablePermissionGuards;
    toast.success(
      newState
        ? 'Permission guards enabled - Routes and UI will be restricted based on user roles'
        : 'Permission guards disabled - All routes accessible for testing'
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security & Access Control</h2>
        <p className="text-gray-600">
          Configure security settings and role-based access controls
        </p>
      </div>

      {/* Permission Guards Toggle */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {enablePermissionGuards ? (
                <ShieldCheckIcon className="h-6 w-6 text-green-600" />
              ) : (
                <ShieldExclamationIcon className="h-6 w-6 text-yellow-600" />
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                Permission-Based Route Guards
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              When enabled, routes and UI elements will be restricted based on user roles and permissions.
              Disable this for testing purposes to access all routes regardless of permissions.
            </p>

            {/* Info Box */}
            <div className={`flex items-start gap-3 p-4 rounded-lg ${
              enablePermissionGuards
                ? 'bg-green-50 border border-green-200'
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <InformationCircleIcon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                enablePermissionGuards ? 'text-green-600' : 'text-yellow-600'
              }`} />
              <div className="text-sm">
                {enablePermissionGuards ? (
                  <>
                    <p className="font-medium text-green-900 mb-1">Guards Active</p>
                    <p className="text-green-700">
                      Users can only access routes and features they have permission for.
                      Unauthorized access attempts will redirect to the unauthorized page.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-yellow-900 mb-1">Guards Disabled (Testing Mode)</p>
                    <p className="text-yellow-700">
                      All routes are accessible regardless of permissions. This is useful for development and testing.
                      <strong className="block mt-1">⚠️ Enable guards in production!</strong>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="ml-6">
            <button
              onClick={handleToggleGuards}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
                enablePermissionGuards ? 'bg-green-600' : 'bg-gray-200'
              }`}
              role="switch"
              aria-checked={enablePermissionGuards}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  enablePermissionGuards ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Current User Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Current Access</h3>

        <div className="space-y-4">
          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Roles
            </label>
            <div className="flex flex-wrap gap-2">
              {isAdmin() ? (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  Administrator (Full Access)
                </span>
              ) : (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Standard User
                </span>
              )}
            </div>
          </div>

          {/* Permissions Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Permissions {!enablePermissionGuards && <span className="text-yellow-600">(Not enforced - Testing mode)</span>}
            </label>
            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              {userPermissions.length > 0 ? (
                userPermissions.includes('*') ? (
                  <p className="text-sm text-gray-700">
                    <strong className="text-purple-600">All Permissions (*)</strong> - You have full access to all features
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {userPermissions.slice(0, 20).map((perm, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700"
                      >
                        {perm}
                      </span>
                    ))}
                    {userPermissions.length > 20 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{userPermissions.length - 20} more
                      </span>
                    )}
                  </div>
                )
              ) : (
                <p className="text-sm text-gray-500 italic">No permissions assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Help & Documentation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <InformationCircleIcon className="h-5 w-5" />
          How It Works
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>
            <strong>When guards are enabled:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Users can only access routes they have permission for</li>
            <li>Navigation menu items automatically hide if user lacks access</li>
            <li>Direct URL access to unauthorized routes redirects to /unauthorized</li>
            <li>UI components can check permissions before rendering</li>
          </ul>
          <p className="mt-3">
            <strong>For testing:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Disable guards to test all features without permission restrictions</li>
            <li>Perfect for development, demos, and QA testing</li>
            <li>Remember to enable guards before deploying to production</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
