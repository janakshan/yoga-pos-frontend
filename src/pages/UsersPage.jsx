import { UserList } from '../features/users/components';

const UsersPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          User Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage user accounts and role assignments
        </p>
      </div>

      <UserList />
    </div>
  );
};

export default UsersPage;
