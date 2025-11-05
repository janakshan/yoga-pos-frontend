import { useState, useEffect } from 'react';
import { X, Shield } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '../../permissions/hooks/usePermissions';

const RolePermissionsModal = ({ role, onClose }) => {
  const { setPermissions, isLoading: roleLoading } = useRoles();
  const { permissionGroups, fetchPermissionGroups, isLoading: permLoading } = usePermissions();

  const [selectedPermissions, setSelectedPermissions] = useState(new Set());

  useEffect(() => {
    fetchPermissionGroups();
  }, []);

  useEffect(() => {
    if (role) {
      setSelectedPermissions(new Set(role.permissions));
    }
  }, [role]);

  const handleTogglePermission = (permissionName) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionName)) {
      newSelected.delete(permissionName);
    } else {
      newSelected.add(permissionName);
    }
    setSelectedPermissions(newSelected);
  };

  const handleSelectAll = (categoryPermissions) => {
    const newSelected = new Set(selectedPermissions);
    categoryPermissions.forEach((perm) => newSelected.add(perm.name));
    setSelectedPermissions(newSelected);
  };

  const handleDeselectAll = (categoryPermissions) => {
    const newSelected = new Set(selectedPermissions);
    categoryPermissions.forEach((perm) => newSelected.delete(perm.name));
    setSelectedPermissions(newSelected);
  };

  const handleSave = async () => {
    try {
      await setPermissions(role.id, Array.from(selectedPermissions));
      onClose(true);
    } catch (err) {
      // Error handled by hook
    }
  };

  const isLoading = roleLoading || permLoading;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manage Permissions
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Role: {role?.name}
          </p>
        </div>
        <button
          onClick={() => onClose(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          {selectedPermissions.size} permission(s) selected
        </p>
      </div>

      <div className="space-y-6 max-h-[500px] overflow-y-auto mb-6">
        {permissionGroups.map((group) => {
          const categoryPerms = group.permissions;
          const allSelected = categoryPerms.every((p) => selectedPermissions.has(p.name));
          const someSelected = categoryPerms.some((p) => selectedPermissions.has(p.name));

          return (
            <div key={group.category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {group.displayName}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectAll(categoryPerms)}
                    disabled={allSelected}
                    className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => handleDeselectAll(categoryPerms)}
                    disabled={!someSelected}
                    className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categoryPerms.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-start gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.has(permission.name)}
                      onChange={() => handleTogglePermission(permission.name)}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {permission.displayName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {permission.description}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
        >
          {isLoading ? 'Saving...' : 'Save Permissions'}
        </button>
        <button
          onClick={() => onClose(false)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RolePermissionsModal;
