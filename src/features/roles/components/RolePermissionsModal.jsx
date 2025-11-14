import { useState, useEffect, useMemo } from 'react';
import { X, Shield } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '../../permissions/hooks/usePermissions';

const RolePermissionsModal = ({ role, onClose }) => {
  const { setPermissions, isLoading: roleLoading } = useRoles();
  const { permissions, fetchPermissions, isLoading: permLoading } = usePermissions();

  const [selectedPermissions, setSelectedPermissions] = useState(new Set());

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  useEffect(() => {
    if (role) {
      // Extract permission IDs from role permissions
      const permissionIds = role.permissions?.map(p => p.id || p) || [];
      setSelectedPermissions(new Set(permissionIds));
    }
  }, [role]);

  // Group permissions by resource
  const permissionGroups = useMemo(() => {
    if (!permissions || permissions.length === 0) return [];

    const groups = {};
    permissions.forEach(permission => {
      const resource = permission.resource || 'Other';
      if (!groups[resource]) {
        groups[resource] = {
          category: resource,
          displayName: resource.charAt(0).toUpperCase() + resource.slice(1),
          permissions: []
        };
      }
      groups[resource].permissions.push(permission);
    });

    return Object.values(groups);
  }, [permissions]);

  const handleTogglePermission = (permissionId) => {
    const newSelected = new Set(selectedPermissions);
    if (newSelected.has(permissionId)) {
      newSelected.delete(permissionId);
    } else {
      newSelected.add(permissionId);
    }
    setSelectedPermissions(newSelected);
  };

  const handleSelectAll = (categoryPermissions) => {
    const newSelected = new Set(selectedPermissions);
    categoryPermissions.forEach((perm) => newSelected.add(perm.id));
    setSelectedPermissions(newSelected);
  };

  const handleDeselectAll = (categoryPermissions) => {
    const newSelected = new Set(selectedPermissions);
    categoryPermissions.forEach((perm) => newSelected.delete(perm.id));
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
  const isSystemRole = role?.isSystem;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Manage Permissions
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Role: {role?.name}
            {isSystemRole && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                System Role (Read-only)
              </span>
            )}
          </p>
        </div>
        <button
          onClick={() => onClose(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {isSystemRole && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> System roles cannot be modified. Permissions are read-only for system roles.
          </p>
        </div>
      )}

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          {selectedPermissions.size} permission(s) selected
        </p>
      </div>

      <div className="space-y-6 max-h-[500px] overflow-y-auto mb-6">
        {permissionGroups.map((group) => {
          const categoryPerms = group.permissions;
          const allSelected = categoryPerms.every((p) => selectedPermissions.has(p.id));
          const someSelected = categoryPerms.some((p) => selectedPermissions.has(p.id));

          return (
            <div key={group.category} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {group.displayName}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSelectAll(categoryPerms)}
                    disabled={allSelected || isSystemRole}
                    className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => handleDeselectAll(categoryPerms)}
                    disabled={!someSelected || isSystemRole}
                    className="text-xs px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {categoryPerms.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-start gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.has(permission.id)}
                      onChange={() => handleTogglePermission(permission.id)}
                      disabled={isSystemRole}
                      className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {permission.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-800 rounded text-xs">
                          {permission.action}
                        </span>
                        {permission.description || permission.code}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={isLoading || isSystemRole}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          title={isSystemRole ? 'Cannot modify system role permissions' : ''}
        >
          {isLoading ? 'Saving...' : 'Save Permissions'}
        </button>
        <button
          onClick={() => onClose(false)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors"
        >
          {isSystemRole ? 'Close' : 'Cancel'}
        </button>
      </div>
    </div>
  );
};

export default RolePermissionsModal;
