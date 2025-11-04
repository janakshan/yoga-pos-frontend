# Authentication Module

Complete authentication module for Yoga POS with mock API implementation.

## Features

- ✅ Login/Logout functionality
- ✅ Protected routes
- ✅ Role-based access control
- ✅ Session persistence with Zustand
- ✅ Mock API with realistic delay
- ✅ Token management (access & refresh tokens)
- ✅ Toast notifications for auth events
- ✅ Beautiful UI with Tailwind CSS

## Mock Users

The following demo accounts are available:

| Email | Password | Role |
|-------|----------|------|
| admin@yoga.com | admin123 | admin |
| manager@yoga.com | manager123 | manager |
| staff@yoga.com | staff123 | staff |
| instructor@yoga.com | instructor123 | instructor |

## Usage

### Using the Auth Hook

```javascript
import { useAuth } from './features/auth';

function MyComponent() {
  const {
    user,
    isAuthenticated,
    login,
    logout,
    isAdmin,
    isManager
  } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: 'admin@yoga.com',
        password: 'admin123'
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
}
```

### Protected Routes

```javascript
import { ProtectedRoute } from './features/auth';

// Protect any route
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

// Protect with role requirements
<Route
  path="/admin"
  element={
    <ProtectedRoute roles={['admin']}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

### Using the Login Form Component

```javascript
import { LoginForm } from './features/auth';

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
```

### Require Auth Hook

```javascript
import { useRequireAuth } from './features/auth';

function ProtectedComponent() {
  // Automatically redirects to /login if not authenticated
  const { user } = useRequireAuth();

  // Or with role requirements
  const { user } = useRequireAuth({
    roles: ['admin', 'manager'],
    redirectTo: '/login'
  });

  return <div>Protected content for {user.name}</div>;
}
```

## File Structure

```
features/auth/
├── components/
│   ├── LoginForm.jsx        # Login form component
│   ├── ProtectedRoute.jsx   # Route protection wrapper
│   └── index.js
├── hooks/
│   ├── useAuth.js           # Main auth hook
│   ├── useRequireAuth.js    # Auth requirement hook
│   └── index.js
├── services/
│   ├── authService.js       # Mock API service
│   └── index.js
├── types/
│   ├── auth.types.js        # Type definitions
│   └── index.js
├── index.js                 # Main export
└── README.md
```

## Store Integration

The auth module integrates with the Zustand store at `store/slices/authSlice.js`:

**State:**
- `user` - Current user object
- `token` - Access token
- `refreshToken` - Refresh token
- `isAuthenticated` - Authentication status
- `isLoading` - Loading state
- `error` - Error message

**Actions:**
- `login(user, token, refreshToken)` - Set user and tokens
- `logout()` - Clear auth state
- `setUser(user)` - Update user data
- `setTokens(token, refreshToken)` - Update tokens
- `updateUser(updates)` - Partial user update

## API Service Methods

### `authService.login(credentials)`
Login with email and password.

```javascript
const response = await authService.login({
  email: 'admin@yoga.com',
  password: 'admin123',
  rememberMe: true
});
// Returns: { user, token, refreshToken, expiresIn }
```

### `authService.logout()`
Logout the current user.

```javascript
await authService.logout();
```

### `authService.refreshToken(refreshToken)`
Refresh the access token.

```javascript
const response = await authService.refreshToken(refreshToken);
// Returns: { token, refreshToken, expiresIn }
```

### `authService.getCurrentUser(token)`
Get current user from token.

```javascript
const user = await authService.getCurrentUser(token);
```

### `authService.verifyToken(token)`
Verify if token is valid.

```javascript
const isValid = await authService.verifyToken(token);
```

## Connecting Real API

To connect the real API later, simply update the `authService.js` file to use actual API endpoints:

```javascript
// Replace mock functions with real API calls
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

// Update other methods similarly...
```

The rest of the code will work without changes!

## Notes

- All auth state is persisted in localStorage via Zustand
- Tokens are automatically included in API requests (when real API is connected)
- Session verification runs on app mount
- Mock API includes realistic delays (800ms for login, 400ms for other operations)
- Beautiful toast notifications for all auth events
