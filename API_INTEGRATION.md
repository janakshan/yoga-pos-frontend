# API Integration - Authentication Module

This document describes the API integration for the authentication module of the Yoga POS frontend application.

## Overview

The authentication module has been integrated with the backend API as specified in `API_DOCUMENTATION.md`. All mock data has been removed and replaced with real API calls using axios.

## Architecture

### Key Components

1. **Axios Instance** (`src/lib/axios.js`)
   - Centralized axios configuration
   - Automatic token injection via request interceptor
   - Automatic token refresh via response interceptor
   - Base URL configuration via environment variables

2. **Token Storage** (`src/lib/tokenStorage.js`)
   - Secure token storage in localStorage
   - Helper functions for token management
   - User data persistence

3. **Auth API Client** (`src/api/auth.api.js`)
   - Authentication endpoint definitions
   - Typed API calls for all auth operations
   - Clean separation of concerns

4. **Auth Service** (`src/features/auth/services/authService.js`)
   - Business logic layer
   - Error handling and transformation
   - Integration with token storage

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

See `.env.example` for reference.

### API Base URL

The API base URL can be configured via the `VITE_API_BASE_URL` environment variable. If not set, it defaults to `https://api.yourdomain.com/api/v1`.

## Authentication Flow

### 1. Login with Email/Password

```javascript
import { authService } from '@/features/auth/services';

const response = await authService.login({
  email: 'admin@yoga.com',
  password: 'admin123',
  rememberMe: true
});

// Response includes:
// - user: User object
// - token: JWT access token
// - refreshToken: Refresh token
// - expiresIn: Token expiration in seconds
```

### 2. Login with PIN

```javascript
const response = await authService.loginWithPIN({
  username: 'admin',
  pin: '1234',
  rememberMe: false
});
```

### 3. Logout

```javascript
await authService.logout();
// Tokens are automatically cleared from localStorage
```

### 4. Token Refresh

Token refresh is handled automatically by the axios interceptor when a 401 response is received. Manual refresh is also available:

```javascript
const response = await authService.refreshToken(refreshToken);
```

### 5. Get Current User

```javascript
const user = await authService.getCurrentUser();
```

### 6. PIN Management

```javascript
// Set PIN
await authService.setPIN(userId, '1234');

// Disable PIN
await authService.disablePIN(userId);

// Reset PIN attempts (admin only)
await authService.resetPINAttempts(userId);
```

## Token Management

### Automatic Token Injection

All API requests automatically include the Authorization header:

```
Authorization: Bearer {access_token}
```

This is handled by the axios request interceptor in `src/lib/axios.js`.

### Automatic Token Refresh

When an API request returns a 401 status:
1. The response interceptor catches the error
2. Attempts to refresh the token using the refresh token
3. Retries the original request with the new token
4. If refresh fails, clears tokens and redirects to login

### Token Storage

Tokens are stored in localStorage:
- `accessToken`: JWT access token
- `refreshToken`: Refresh token for obtaining new access tokens
- `user`: User data object

## Error Handling

### Error Format

All authentication errors follow a consistent format:

```javascript
{
  message: 'Error description',
  code: 'ERROR_CODE',
  details: { /* optional additional details */ }
}
```

### Error Codes

- `INVALID_CREDENTIALS`: Invalid email/password or username/PIN
- `USER_NOT_FOUND`: User does not exist
- `EXPIRED_TOKEN`: Token has expired
- `INVALID_TOKEN`: Token is invalid or malformed
- `NETWORK_ERROR`: Network/connection error
- `UNAUTHORIZED`: Not authorized to access resource
- `INVALID_PIN`: PIN format is invalid
- `PIN_NOT_SET`: PIN authentication not enabled
- `PIN_LOCKED`: Too many failed PIN attempts

### Error Handling Example

```javascript
try {
  await authService.login(credentials);
} catch (error) {
  console.error('Login error:', error.message);
  console.error('Error code:', error.code);

  // Handle specific error codes
  if (error.code === 'INVALID_CREDENTIALS') {
    // Show invalid credentials message
  } else if (error.code === 'NETWORK_ERROR') {
    // Show network error message
  }
}
```

## API Endpoints Used

Based on `API_DOCUMENTATION.md`:

- `POST /auth/login` - Email/password login
- `POST /auth/login/pin` - PIN login
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user
- `POST /auth/pin/set` - Set user PIN
- `POST /auth/pin/disable` - Disable PIN authentication
- `POST /auth/pin/reset-attempts` - Reset PIN attempts

## Usage in Components

### Using the useAuth Hook

```javascript
import { useAuth } from '@/features/auth/hooks/useAuth';

function LoginComponent() {
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (values) => {
    try {
      await login(values);
      // Login successful, user is redirected
    } catch (error) {
      // Error is already handled by the hook
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Best Practices

1. **Always use the authService layer** - Don't call the API directly
2. **Handle errors appropriately** - Use the error codes to show user-friendly messages
3. **Check authentication state** - Use the `isAuthenticated` flag from the store
4. **Secure token storage** - Tokens are stored in localStorage, consider additional security measures for production
5. **Environment configuration** - Always use environment variables for API URLs

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage. For enhanced security in production, consider:
   - Using httpOnly cookies for tokens
   - Implementing token encryption
   - Adding CSRF protection

2. **Token Expiration**: Access tokens expire after 24 hours. The refresh token is valid for 30 days.

3. **Automatic Logout**: Users are automatically logged out when:
   - They explicitly logout
   - Token refresh fails
   - Invalid/expired tokens are detected

4. **PIN Security**:
   - PINs are validated on the backend
   - Account is locked after 5 failed attempts
   - Locked accounts require admin intervention to unlock

## Testing

To test the authentication integration:

1. Set up your backend API endpoint in `.env`
2. Ensure the backend is running and accessible
3. Test login with valid credentials
4. Test error scenarios (invalid credentials, network errors)
5. Test token refresh by waiting for token expiration
6. Test PIN login functionality

## Migration Notes

### Changes from Mock Implementation

- ✅ Removed all mock user data
- ✅ Removed mock delay functions
- ✅ Implemented real API calls using axios
- ✅ Added proper error handling for API responses
- ✅ Implemented token storage and management
- ✅ Added automatic token refresh
- ✅ Maintained backward compatibility with existing components

### Breaking Changes

None. The API interface remains the same, only the implementation has changed.

## Future Enhancements

1. Implement biometric authentication
2. Add two-factor authentication (2FA)
3. Implement OAuth/SSO integration
4. Add session management and concurrent login handling
5. Implement remember me functionality with secure token persistence
6. Add password reset functionality
7. Implement account recovery mechanisms

## Troubleshooting

### Common Issues

1. **401 Errors on All Requests**
   - Check if the API base URL is correct
   - Verify the token is being stored correctly
   - Check if the backend is running

2. **CORS Errors**
   - Configure CORS on the backend to allow requests from the frontend domain
   - Add the frontend URL to the backend's allowed origins

3. **Token Refresh Loop**
   - Check if the refresh token endpoint is working correctly
   - Verify the refresh token is being stored and retrieved properly

4. **Network Errors**
   - Check internet connectivity
   - Verify the API endpoint is accessible
   - Check firewall/network settings

## Support

For issues or questions:
1. Check the API documentation in `API_DOCUMENTATION.md`
2. Review the error codes and messages
3. Check the browser console for detailed error logs
4. Verify environment configuration

## Changelog

### Version 1.0.0 (2025-11-07)
- Initial API integration for authentication module
- Implemented all auth endpoints from API documentation
- Added token storage and management
- Implemented automatic token refresh
- Added comprehensive error handling
- Removed all mock data and functions
