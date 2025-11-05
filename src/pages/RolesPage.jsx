import { RoleList } from '../features/roles/components';

const RolesPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Role Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage user roles and permissions for your yoga studio
        </p>
      </div>

      <RoleList />
    </div>
  );
};

export default RolesPage;
