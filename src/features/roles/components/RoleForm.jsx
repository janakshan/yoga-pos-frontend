import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useRoles } from '../hooks/useRoles';

const RoleForm = ({ role, mode, onClose }) => {
  const { createRole, updateRoleById, isLoading } = useRoles();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    isActive: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (role && mode === 'edit') {
      setFormData({
        name: role.name || '',
        code: role.code || '',
        description: role.description || '',
        isActive: role.isActive ?? true,
      });
    }
  }, [role, mode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generate code from name if creating
    if (name === 'name' && mode === 'create') {
      const generatedCode = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      setFormData((prev) => ({ ...prev, code: generatedCode }));
    }

    // Clear error for this field
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Role name is required';
    }

    if (!formData.code.trim()) {
      newErrors.code = 'Role code is required';
    } else if (!/^[a-z_]+$/.test(formData.code)) {
      newErrors.code = 'Code must be lowercase letters and underscores only';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      if (mode === 'edit') {
        await updateRoleById(role.id, formData);
      } else {
        await createRole({
          ...formData,
          permissions: [], // Initially no permissions
        });
      }
      onClose(true); // Reload data
    } catch (err) {
      // Error already shown by toast
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'edit' ? 'Edit Role' : 'Create New Role'}
        </h2>
        <button
          onClick={() => onClose(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            placeholder="e.g., Assistant Manager"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role Code *
          </label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
            disabled={mode === 'edit'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="e.g., assistant_manager"
          />
          <p className="mt-1 text-xs text-gray-500">Lowercase letters and underscores only</p>
          {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            placeholder="Describe the role and its responsibilities..."
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            Active (role can be assigned to users)
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
          >
            {isLoading ? 'Saving...' : mode === 'edit' ? 'Update Role' : 'Create Role'}
          </button>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;
