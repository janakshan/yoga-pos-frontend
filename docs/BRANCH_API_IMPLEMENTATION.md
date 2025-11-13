# Branch API Implementation Guide

This document explains how the Branch API integration is implemented in the frontend application.

## Overview

The branch module now supports both **Mock API** (for development) and **Real API** (for production) modes. You can switch between them using an environment variable.

## Files Structure

```
src/
├── api/
│   └── branch.api.js           # Low-level API client (Axios)
├── features/
│   └── branch/
│       ├── services/
│       │   ├── branchService.js       # Mock service (original)
│       │   ├── branchApiService.js    # Real API service (new)
│       │   └── index.js               # Exports both services
│       ├── hooks/
│       │   └── useBranch.js           # Main hook (uses either service)
│       └── store/
│           └── branchSlice.js         # Zustand state management
```

## Configuration

### Environment Variables

Add to your `.env` file:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Mock API Mode
# Set to 'true' to use mock data, 'false' to use real API
VITE_USE_MOCK_API=false
```

### Development vs Production

**Development (with backend):**
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_USE_MOCK_API=false
```

**Development (without backend):**
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_USE_MOCK_API=true
```

**Production:**
```env
VITE_API_BASE_URL=https://api.yourproduction.com/api/v1
VITE_USE_MOCK_API=false
```

## API Endpoints

All endpoints are documented in `docs/api/BRANCH.md`. The implementation includes:

### Branch CRUD Operations
- ✅ `POST /api/v1/branches` - Create branch
- ✅ `GET /api/v1/branches` - Get all branches (with filters)
- ✅ `GET /api/v1/branches/:id` - Get branch by ID
- ✅ `GET /api/v1/branches/code/:code` - Get branch by code
- ✅ `PATCH /api/v1/branches/:id` - Update branch
- ✅ `DELETE /api/v1/branches/:id` - Delete branch

### Branch Information
- ✅ `GET /api/v1/branches/stats` - Overall statistics
- ✅ `GET /api/v1/branches/:id/settings` - Get branch settings
- ✅ `GET /api/v1/branches/:id/operating-hours` - Get operating hours
- ✅ `GET /api/v1/branches/:id/stats` - Get branch performance

### Branch Updates
- ✅ `PATCH /api/v1/branches/:id/settings` - Update settings
- ✅ `PATCH /api/v1/branches/:id/operating-hours` - Update operating hours

### Branch Management
- ✅ `POST /api/v1/branches/:id/manager` - Assign manager
- ✅ `POST /api/v1/branches/bulk/status` - Bulk update status

### Branch Analytics
- ✅ `GET /api/v1/branches/performance` - All branches performance
- ✅ `POST /api/v1/branches/compare` - Compare multiple branches
- ✅ `POST /api/v1/branches/settings/clone` - Clone settings

## Usage Examples

### Basic Usage with Hook

```javascript
import { useBranch } from '@/features/branch/hooks';

function BranchComponent() {
  const {
    branches,
    isLoading,
    error,
    fetchBranches,
    createBranch,
    updateBranch,
    deleteBranch,
  } = useBranch();

  // Fetch all branches
  useEffect(() => {
    fetchBranches();
  }, []);

  // Create a branch
  const handleCreate = async (data) => {
    try {
      await createBranch(data);
    } catch (error) {
      console.error('Failed to create branch:', error);
    }
  };

  // Update a branch
  const handleUpdate = async (id, updates) => {
    try {
      await updateBranch(id, updates);
    } catch (error) {
      console.error('Failed to update branch:', error);
    }
  };

  // Delete a branch
  const handleDelete = async (id) => {
    try {
      await deleteBranch(id);
    } catch (error) {
      console.error('Failed to delete branch:', error);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {branches.map(branch => (
        <div key={branch.id}>{branch.name}</div>
      ))}
    </div>
  );
}
```

### Fetching with Filters

```javascript
// Filter by active status
await fetchBranches({ isActive: true });

// Search by name/code/address
await fetchBranches({ search: 'Downtown' });

// Filter by city
await fetchBranches({ city: 'New York' });

// Combined filters with sorting
await fetchBranches({
  isActive: true,
  city: 'New York',
  sortBy: 'name',
  sortOrder: 'asc',
});

// Pagination
await fetchBranches({
  page: 1,
  limit: 10,
});
```

### Direct API Usage

If you need to use the API directly without the hook:

```javascript
import { branchApi } from '@/api/branch.api';

// Create branch
const newBranch = await branchApi.createBranch({
  name: 'Downtown Studio',
  code: 'DT001',
  address: '123 Main Street',
  city: 'New York',
  state: 'NY',
  zipCode: '10001',
  country: 'USA',
  phone: '+1234567890',
  email: 'downtown@example.com',
  isActive: true,
  settings: {
    timezone: 'America/New_York',
    currency: 'USD',
    taxRate: 8.5,
  },
});

// Get all branches
const branches = await branchApi.getAllBranches({
  page: 1,
  limit: 10,
  search: 'downtown',
});

// Update branch
const updated = await branchApi.updateBranch('branch-id', {
  name: 'Updated Name',
  isActive: false,
});
```

## API Client Features

### Automatic Token Management
The axios instance automatically adds JWT tokens to requests:

```javascript
// Token is automatically added to Authorization header
// Authorization: Bearer <your-token>
```

### Automatic Token Refresh
When a 401 error occurs, the client automatically:
1. Attempts to refresh the token using the refresh token
2. Retries the original request with the new token
3. Redirects to login if refresh fails

### Error Handling
All API errors are properly caught and formatted:

```javascript
try {
  await branchApi.createBranch(data);
} catch (error) {
  // Error object contains:
  // - error.message
  // - error.response.status
  // - error.response.data
}
```

## Testing

### With Backend Running

1. Start your backend server on `localhost:3000`
2. Set environment:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   VITE_USE_MOCK_API=false
   ```
3. Run the frontend: `npm run dev`
4. All API calls will hit the real backend

### Without Backend (Mock Mode)

1. Set environment:
   ```env
   VITE_USE_MOCK_API=true
   ```
2. Run the frontend: `npm run dev`
3. All API calls will use mock data

### Testing Individual Endpoints

Use the curl commands from `docs/api/BRANCH.md`:

```bash
# Create a branch
curl -X 'POST' \
  'http://localhost:3000/api/v1/branches' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test Branch",
    "code": "TST001",
    "address": "123 Test Street",
    "city": "Test City",
    "state": "TS",
    "zipCode": "12345",
    "country": "USA",
    "phone": "+1234567890",
    "email": "test@example.com",
    "isActive": true
  }'
```

## Migration from Mock to Real API

When switching from mock to real API:

1. Update `.env` file:
   ```env
   VITE_USE_MOCK_API=false
   ```

2. Restart the development server:
   ```bash
   npm run dev
   ```

3. No code changes needed! The hook automatically uses the right service.

## Authentication

The API client uses JWT tokens stored in localStorage:
- `accessToken` - Short-lived token for API requests
- `refreshToken` - Long-lived token for refreshing access tokens

Tokens are managed automatically by the axios interceptors.

## Response Format

### Success Response

```json
{
  "data": {
    "id": "branch-id",
    "name": "Branch Name",
    ...
  }
}
```

Or for lists:

```json
{
  "data": [
    { "id": "branch-1", ... },
    { "id": "branch-2", ... }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

### Error Response

```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Best Practices

1. **Always use the hook** (`useBranch`) instead of calling the API directly
2. **Handle loading states** - Check `isLoading` before showing data
3. **Handle errors** - Display error messages from `error` state
4. **Use toast notifications** - The hook automatically shows success/error toasts
5. **Cache wisely** - Branches are cached in Zustand store
6. **Clear cache when needed** - Use `fetchBranches()` to refresh data

## Troubleshooting

### API calls not working

1. Check if backend is running
2. Verify `VITE_API_BASE_URL` in `.env`
3. Check browser console for errors
4. Verify authentication token is present

### Getting 401 errors

1. Check if user is logged in
2. Verify token in localStorage
3. Try logging out and back in

### Mock data not showing

1. Verify `VITE_USE_MOCK_API=true` in `.env`
2. Restart dev server after changing `.env`
3. Check that mock service is properly exported

## Future Enhancements

- [ ] Add request caching layer
- [ ] Implement optimistic updates
- [ ] Add retry logic for failed requests
- [ ] Add request cancellation for pending requests
- [ ] Add request deduplication
- [ ] Implement offline queue

## Support

For issues or questions:
1. Check API documentation: `docs/api/BRANCH.md`
2. Review backend API responses in Network tab
3. Check console for detailed error messages
