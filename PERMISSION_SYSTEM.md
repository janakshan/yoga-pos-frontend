# Permission-Based Route Guard System

## Overview

This application includes a comprehensive permission-based route guard system that controls access to routes and UI elements based on user roles and permissions. The system can be toggled on/off via settings for easy testing and development.

## Features

- ✅ **Role-based Access Control (RBAC)**: Control access based on user roles
- ✅ **Permission-based Guards**: Fine-grained control with specific permissions
- ✅ **Route Protection**: Automatically guard routes based on permissions
- ✅ **Navigation Filtering**: Hide menu items user can't access
- ✅ **Testing Toggle**: Enable/disable guards via Settings for development
- ✅ **Wildcard Support**: Use wildcards (e.g., `products.*`) for permission groups
- ✅ **Flexible Configuration**: Easy to add new routes and permissions

## How to Enable/Disable Guards

### Via Settings UI

1. Navigate to **Settings** → **Security & Access** tab
2. Toggle the **Permission-Based Route Guards** switch
3. When **enabled**: Routes are protected based on user permissions
4. When **disabled**: All routes accessible (testing mode)

**Note**: The guard state is automatically saved to localStorage and persists across browser sessions.

### Programmatically

```javascript
import { useStore } from './store';

// Get current state
const enablePermissionGuards = useStore((state) => state.enablePermissionGuards);

// Toggle guards
const togglePermissionGuards = useStore((state) => state.togglePermissionGuards);
togglePermissionGuards();

// Set guards explicitly
const setPermissionGuards = useStore((state) => state.setPermissionGuards);
setPermissionGuards(true); // Enable
setPermissionGuards(false); // Disable
```

## Using the Permission System

### 1. Check Permissions in Components

```javascript
import { usePermissions } from './hooks/usePermissions';

function MyComponent() {
  const { hasPermission, hasRole, canAccessRoute, isAdmin } = usePermissions();

  // Check single permission
  if (hasPermission('users.create')) {
    return <CreateUserButton />;
  }

  // Check multiple permissions (ANY)
  if (hasPermission(['users.create', 'users.update'], false)) {
    return <UserActions />;
  }

  // Check multiple permissions (ALL required)
  if (hasPermission(['users.view', 'users.update'], true)) {
    return <EditUserForm />;
  }

  // Check role
  if (hasRole('ADMIN')) {
    return <AdminPanel />;
  }

  // Check multiple roles
  if (hasRole(['ADMIN', 'MANAGER'])) {
    return <ManagementDashboard />;
  }

  // Check if user is admin
  if (isAdmin()) {
    return <SuperAdminTools />;
  }

  // Check route access
  if (canAccessRoute('/users')) {
    return <Link to="/users">Users</Link>;
  }
}
```

### 2. Guard Routes

```javascript
import { RouteGuard } from './components/guards';

// In App.jsx or router configuration
<Route
  path="users"
  element={
    <RouteGuard routePath="/users">
      <UsersPage />
    </RouteGuard>
  }
/>
```

### 3. Guard UI Elements

```javascript
import PermissionGuard from './components/guards/PermissionGuard';

function MyPage() {
  return (
    <div>
      {/* Show inline access denied message */}
      <PermissionGuard permission="users.create" showMessage={true}>
        <CreateUserForm />
      </PermissionGuard>

      {/* Redirect to custom page */}
      <PermissionGuard permission="admin.panel" redirectTo="/dashboard">
        <AdminPanel />
      </PermissionGuard>

      {/* Require all permissions */}
      <PermissionGuard
        permission={['users.view', 'users.update']}
        requireAll={true}
      >
        <EditUserButton />
      </PermissionGuard>
    </div>
  );
}
```

## Permission Structure

### Route Permissions

Defined in `src/hooks/usePermissions.js`:

**Important**: Route permissions use **ANY** logic - users need at least ONE of the listed permissions to access the route.

```javascript
export const ROUTE_PERMISSIONS = {
  '/dashboard': null, // Public to all authenticated users
  '/users': ['users.view', 'users.list', 'users.create', 'users.update', 'users.delete', 'users.*'],
  '/users/:id': ['users.view', 'users.update', 'users.delete', 'users.*'],
  '/roles': ['roles.view', 'roles.list', 'roles.create', 'roles.update', 'roles.delete', 'roles.*'],
  // ... more routes
};
```

This means:
- A user with `users.create` permission CAN access `/users` (even without `users.view`)
- A user with ANY user-related permission can access the users page
- This allows users to perform their specific tasks without needing all permissions

### Role Permissions

```javascript
export const ROLE_PERMISSIONS = {
  ADMIN: ['*'], // All permissions
  MANAGER: [
    'dashboard.view',
    'users.view',
    'products.*', // All product permissions
    // ... more permissions
  ],
  CASHIER: [
    'dashboard.view',
    'pos.access',
    'sales.create',
    // ... more permissions
  ],
  // ... more roles
};
```

## Permission Naming Convention

Format: `resource.action`

Examples:
- `users.view` - View user details
- `users.list` - List all users
- `users.create` - Create new users
- `users.update` - Update user information
- `users.delete` - Delete users
- `users.*` - All user permissions

Common actions:
- `view` - Read single record
- `list` - List multiple records
- `create` - Create new records
- `update` - Modify existing records
- `delete` - Remove records
- `manage` - Full control (create/update/delete)
- `*` - All actions for a resource

## Adding New Protected Routes

1. **Define Route Permission** in `src/hooks/usePermissions.js`:

```javascript
export const ROUTE_PERMISSIONS = {
  // ... existing routes
  '/my-new-route': ['my_resource.view', 'my_resource.list'],
};
```

2. **Add Permission to Roles**:

```javascript
export const ROLE_PERMISSIONS = {
  ADMIN: ['*'],
  MANAGER: [
    // ... existing permissions
    'my_resource.*',
  ],
  // ... other roles
};
```

3. **Wrap Route with Guard** in `App.jsx`:

```javascript
<Route
  path="my-new-route"
  element={
    <RouteGuard routePath="/my-new-route">
      <MyNewPage />
    </RouteGuard>
  }
/>
```

4. **Add to Navigation** in `Sidebar.jsx`:

```javascript
const navigationItems = [
  // ... existing items
  { name: 'My New Feature', path: '/my-new-route', icon: MyIcon },
];
```

The navigation will automatically hide if the user lacks permission (when guards are enabled).

## How It Works

### When Guards are Enabled

1. **User Login**: User roles and permissions are loaded from the API
2. **Navigation**: Sidebar automatically filters out inaccessible routes
3. **Route Access**: `RouteGuard` checks permissions before rendering
4. **Direct URL**: Unauthorized access redirects to `/unauthorized`
5. **UI Elements**: `PermissionGuard` conditionally renders components

### When Guards are Disabled (Testing Mode)

1. All routes are accessible regardless of permissions
2. Navigation shows all items
3. Guards return `true` for all permission checks
4. Perfect for development and testing

### Permission Resolution

1. Check if guards are enabled (if not, allow all)
2. Check if user has `*` permission (admin) → Allow
3. Check direct permission match → Allow if found
4. Check wildcard permissions (e.g., `users.*` matches `users.view`) → Allow if found
5. If none match → Deny

## Best Practices

### 1. Always Check Guards in Production

```javascript
// In your deployment script or environment config
if (process.env.NODE_ENV === 'production') {
  store.getState().setPermissionGuards(true);
}
```

### 2. Granular Permissions

```javascript
// Good - Specific actions
'users.create'
'users.update'
'users.delete'

// Avoid - Too broad for non-admins
'users.*'
```

### 3. Use Wildcards for Admin/Manager Roles

```javascript
ROLE_PERMISSIONS.MANAGER = [
  'products.*',  // All product operations
  'inventory.*', // All inventory operations
];
```

### 4. Combine Guards with Business Logic

```javascript
function UserList() {
  const { hasPermission } = usePermissions();

  return (
    <div>
      <UserTable />
      {hasPermission('users.create') && <CreateButton />}
      {hasPermission('users.delete') && <DeleteButton />}
    </div>
  );
}
```

### 5. Provide Clear Error Messages

```javascript
<PermissionGuard
  permission="admin.panel"
  showMessage={true}
>
  <AdminPanel />
</PermissionGuard>
// Shows: "You don't have permission to access this feature"
```

## Testing

### Test with Guards Disabled

1. Go to **Settings** → **Security & Access**
2. Disable **Permission-Based Route Guards**
3. Test all features without permission restrictions
4. Verify functionality works correctly

### Test with Guards Enabled

1. Enable **Permission-Based Route Guards**
2. Create test users with different roles:
   - Admin user (full access)
   - Manager user (limited access)
   - Cashier user (POS only)
   - Viewer user (read-only)
3. Test each role:
   - Login as the test user
   - Verify correct routes are visible in navigation
   - Try accessing unauthorized routes (should redirect)
   - Verify UI elements respect permissions

### Test Permission Checks

```javascript
import { renderHook } from '@testing-library/react';
import { usePermissions } from './hooks/usePermissions';

test('admin has all permissions', () => {
  const { result } = renderHook(() => usePermissions());
  expect(result.current.hasPermission('any.permission')).toBe(true);
});

test('cashier cannot access user management', () => {
  const { result } = renderHook(() => usePermissions());
  expect(result.current.canAccessRoute('/users')).toBe(false);
});
```

## Troubleshooting

### Routes Not Protected

1. Check if guards are enabled in Settings
2. Verify route is wrapped with `RouteGuard`
3. Check permission is defined in `ROUTE_PERMISSIONS`
4. Verify user roles include required permissions

### Navigation Items Not Hiding

1. Check `Sidebar.jsx` uses `canAccessRoute` filter
2. Verify `usePermissions` hook is imported
3. Check route path matches navigation item path

### Permission Always Returns True

1. Check if user has `*` permission (admin)
2. Verify guards are enabled in settings
3. Check wildcard permissions (e.g., `products.*`)

### User Can't Access Allowed Routes

1. Check user roles in API response
2. Verify role code matches `ROLE_PERMISSIONS` keys
3. Check permission format (should be `resource.action`)
4. Verify route permission definition

## API Integration

The system expects user data with this structure:

```javascript
{
  user: {
    id: "user-123",
    username: "john.doe",
    roles: [
      {
        id: "role-1",
        code: "MANAGER",
        name: "Manager",
        permissions: [
          { code: "users.view" },
          { code: "products.*" },
          // ... more permissions
        ]
      }
    ]
  }
}
```

Permissions can come from:
1. **Role-based**: Defined in `ROLE_PERMISSIONS`
2. **Direct permissions**: From role.permissions array
3. **Both**: System merges all permissions

## Security Considerations

1. **Frontend Only**: This is client-side protection for UX
2. **Backend Required**: Always validate permissions on the API
3. **Token-based**: Use JWT or session for authentication
4. **Regular Updates**: Sync permissions with backend on user updates
5. **Audit Logs**: Track permission changes and access attempts

## Summary

- Toggle guards in **Settings** → **Security & Access**
- Guards disabled = Testing mode (all access)
- Guards enabled = Production mode (permission-based)
- Use `usePermissions()` hook for permission checks
- Wrap routes with `<RouteGuard>` component
- Navigation automatically filters based on permissions
- Perfect for development, testing, and production!
