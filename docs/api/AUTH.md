# Authentication, Users, Roles & Permissions API Documentation

**Project:** Yoga POS Backend
**Base URL:** `http://localhost:3000/api/v1`
**Authentication:** JWT Bearer Token
**Last Updated:** 2025-11-13

---

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Users API](#users-api)
3. [Roles API](#roles-api)
4. [Permissions API](#permissions-api)
5. [Common Response Codes](#common-response-codes)
6. [Data Models](#data-models)

---

## Authentication API

### 1. Register New User

**Endpoint:** `POST /auth/register`
**Access:** Public
**Description:** Register a new user account

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/auth/register' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "StrongPass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}'
```

**Request Body:**
```json
{
  "username": "string (required, min: 3 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min: 8 chars, must contain uppercase, lowercase, number/special char)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "status": "active",
  "createdAt": "2025-11-13T10:00:00.000Z"
}
```

---

### 2. Login with Email & Password

**Endpoint:** `POST /auth/login`
**Access:** Public
**Description:** Authenticate user with email and password

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/auth/login' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "admin@yogapos.com",
  "password": "admin123",
  "rememberMe": true
}'
```

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required, min: 6 chars)",
  "rememberMe": "boolean (optional)"
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@yogapos.com",
    "firstName": "Admin",
    "lastName": "User",
    "roles": [
      {
        "id": "uuid",
        "code": "admin",
        "name": "Administrator"
      }
    ]
  },
  "expiresIn": 86400
}
```

---

### 3. Login with PIN

**Endpoint:** `POST /auth/login/pin`
**Access:** Public
**Description:** Authenticate user with username and PIN

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/auth/login/pin' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "admin",
  "pin": "1234",
  "rememberMe": false
}'
```

**Request Body:**
```json
{
  "username": "string (required)",
  "pin": "string (required, min: 4 chars)",
  "rememberMe": "boolean (optional)"
}
```

**Success Response (200):** Same as email/password login

**Error Response (423 - PIN Locked):**
```json
{
  "statusCode": 423,
  "message": "PIN locked due to too many failed attempts",
  "error": "Locked"
}
```

---

### 4. Refresh Access Token

**Endpoint:** `POST /auth/refresh`
**Access:** Public
**Description:** Get a new access token using refresh token

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/auth/refresh' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}'
```

**Request Body:**
```json
{
  "refreshToken": "string (required)"
}
```

**Success Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400
}
```

---

### 5. Logout

**Endpoint:** `POST /auth/logout`
**Access:** Authenticated
**Description:** Logout current user and invalidate tokens

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/auth/logout' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
{
  "message": "Logged out successfully"
}
```

---

### 6. Get Current User Info

**Endpoint:** `GET /auth/me`
**Access:** Authenticated
**Description:** Get information about the currently authenticated user

```bash
curl -X 'GET' \
  'http://localhost:3000/api/v1/auth/me' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "username": "admin",
  "email": "admin@yogapos.com",
  "firstName": "Admin",
  "lastName": "User",
  "phone": "+1234567890",
  "status": "active",
  "roles": [
    {
      "id": "uuid",
      "code": "admin",
      "name": "Administrator",
      "permissions": [...]
    }
  ],
  "branch": {
    "id": "uuid",
    "name": "Main Branch",
    "code": "MAIN001"
  }
}
```

---

### 7. Set PIN for Current User

**Endpoint:** `POST /auth/pin/set`
**Access:** Authenticated
**Description:** Set a PIN for quick login

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/auth/pin/set' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "newPIN": "1234"
}'
```

**Request Body:**
```json
{
  "newPIN": "string (required, min: 4 chars)"
}
```

**Success Response (200):**
```json
{
  "message": "PIN set successfully"
}
```

---

### 8. Disable PIN

**Endpoint:** `POST /auth/pin/disable`
**Access:** Authenticated
**Description:** Disable PIN login for current user

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/auth/pin/disable' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
{
  "message": "PIN disabled successfully"
}
```

---

### 9. Reset PIN Attempts (Admin Only)

**Endpoint:** `POST /auth/pin/reset-attempts`
**Access:** Admin
**Description:** Reset PIN lockout for a user

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/auth/pin/reset-attempts' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "userId": "b2ac613c-32c1-435c-af92-48cbb31c6578"
}'
```

**Request Body:**
```json
{
  "userId": "string (required, uuid)"
}
```

**Success Response (200):**
```json
{
  "message": "PIN attempts reset successfully"
}
```

---

## Users API

### 1. Create User

**Endpoint:** `POST /users`
**Access:** Admin, Manager
**Description:** Create a new user

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/users' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "roles": ["staff"],
  "status": "active",
  "branchId": "BRANCH_UUID"
}'
```

**Request Body:**
```json
{
  "username": "string (required, min: 3 chars)",
  "email": "string (required, valid email)",
  "password": "string (required, min: 6 chars)",
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)",
  "roles": "string[] (optional, role codes)",
  "status": "string (optional, enum: active|inactive|suspended)",
  "branchId": "string (optional, uuid)"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "status": "active",
  "roles": [...],
  "branch": {...},
  "createdAt": "2025-11-13T10:00:00.000Z"
}
```

---

### 2. Get All Users

**Endpoint:** `GET /users`
**Access:** Admin, Manager
**Description:** Get list of all users with pagination

```bash
# Basic
curl -X 'GET' \
  'http://localhost:3000/api/v1/users' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'

# With pagination
curl -X 'GET' \
  'http://localhost:3000/api/v1/users?page=1&limit=20' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Query Parameters:**
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 20)

**Success Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "username": "johndoe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "status": "active",
      "roles": [...],
      "branch": {...}
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "totalItems": 100,
    "totalPages": 5
  }
}
```

---

### 3. Get User Statistics

**Endpoint:** `GET /users/stats`
**Access:** Admin
**Description:** Get user statistics

```bash
curl -X 'GET' \
  'http://localhost:3000/api/v1/users/stats' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
{
  "totalUsers": 100,
  "activeUsers": 85,
  "inactiveUsers": 10,
  "suspendedUsers": 5,
  "usersByRole": [
    {
      "role": "admin",
      "count": 5
    },
    {
      "role": "manager",
      "count": 10
    },
    {
      "role": "staff",
      "count": 85
    }
  ],
  "usersByBranch": [...]
}
```

---

### 4. Get User by ID

**Endpoint:** `GET /users/:id`
**Access:** Authenticated
**Description:** Get a specific user by ID

```bash
curl -X 'GET' \
  'http://localhost:3000/api/v1/users/b2ac613c-32c1-435c-af92-48cbb31c6578' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "status": "active",
  "roles": [...],
  "branch": {...},
  "createdAt": "2025-11-13T10:00:00.000Z",
  "updatedAt": "2025-11-13T10:00:00.000Z"
}
```

---

### 5. Update User

**Endpoint:** `PATCH /users/:id`
**Access:** Admin, Manager
**Description:** Update user information

```bash
curl -X 'PATCH' \
  'http://localhost:3000/api/v1/users/b2ac613c-32c1-435c-af92-48cbb31c6578' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+9876543210",
  "status": "active"
}'
```

**Request Body:** All fields optional (partial update)
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)",
  "email": "string (optional)",
  "status": "string (optional)",
  "branchId": "string (optional)",
  "roles": "string[] (optional)"
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+9876543210",
  "status": "active",
  "updatedAt": "2025-11-13T10:30:00.000Z"
}
```

---

### 6. Delete User

**Endpoint:** `DELETE /users/:id`
**Access:** Admin
**Description:** Delete a user

```bash
curl -X 'DELETE' \
  'http://localhost:3000/api/v1/users/b2ac613c-32c1-435c-af92-48cbb31c6578' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

### 7. Bulk Update User Roles

**Endpoint:** `POST /users/bulk/roles`
**Access:** Admin, Manager
**Description:** Update roles for multiple users at once

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/users/bulk/roles' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "userIds": [
    "b2ac613c-32c1-435c-af92-48cbb31c6578",
    "c3bd724d-43d2-546d-bg03-59dcc42d7689"
  ],
  "roleIds": [
    "d4ce835e-54e3-657e-ch14-60edd53e8790"
  ]
}'
```

**Request Body:**
```json
{
  "userIds": "string[] (required, array of user UUIDs)",
  "roleIds": "string[] (required, array of role UUIDs)"
}
```

**Success Response (200):**
```json
{
  "updated": 2,
  "users": [...]
}
```

---

## Roles API

### 1. Create Role

**Endpoint:** `POST /roles`
**Access:** Admin
**Description:** Create a new role

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/roles' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "code": "cashier",
  "name": "Cashier",
  "description": "Cashier role with POS access",
  "isSystem": false,
  "isActive": true
}'
```

**Request Body:**
```json
{
  "code": "string (required, unique)",
  "name": "string (required)",
  "description": "string (optional)",
  "isSystem": "boolean (optional, default: false)",
  "isActive": "boolean (optional, default: true)"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "code": "cashier",
  "name": "Cashier",
  "description": "Cashier role with POS access",
  "isSystem": false,
  "isActive": true,
  "permissions": [],
  "createdAt": "2025-11-13T10:00:00.000Z"
}
```

---

### 2. Get All Roles

**Endpoint:** `GET /roles`
**Access:** Authenticated
**Description:** Get list of all roles

```bash
curl -X 'GET' \
  'http://localhost:3000/api/v1/roles' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "code": "admin",
    "name": "Administrator",
    "description": "Full system access",
    "isSystem": true,
    "isActive": true,
    "permissions": [...]
  },
  {
    "id": "uuid",
    "code": "manager",
    "name": "Manager",
    "description": "Branch management access",
    "isSystem": false,
    "isActive": true,
    "permissions": [...]
  }
]
```

---

### 3. Get Role by ID

**Endpoint:** `GET /roles/:id`
**Access:** Authenticated
**Description:** Get a specific role by ID

```bash
curl -X 'GET' \
  'http://localhost:3000/api/v1/roles/d4ce835e-54e3-657e-ch14-60edd53e8790' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "code": "manager",
  "name": "Manager",
  "description": "Branch management access",
  "isSystem": false,
  "isActive": true,
  "permissions": [
    {
      "id": "uuid",
      "code": "branches.manage",
      "name": "Manage Branches",
      "resource": "branches",
      "action": "manage"
    }
  ],
  "createdAt": "2025-11-13T10:00:00.000Z",
  "updatedAt": "2025-11-13T10:00:00.000Z"
}
```

---

### 4. Update Role

**Endpoint:** `PATCH /roles/:id`
**Access:** Admin
**Description:** Update a role (cannot modify system roles)

```bash
curl -X 'PATCH' \
  'http://localhost:3000/api/v1/roles/d4ce835e-54e3-657e-ch14-60edd53e8790' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Senior Cashier",
  "description": "Senior cashier with additional privileges",
  "isActive": true
}'
```

**Request Body:** All fields optional
```json
{
  "code": "string (optional)",
  "name": "string (optional)",
  "description": "string (optional)",
  "isActive": "boolean (optional)"
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "code": "cashier",
  "name": "Senior Cashier",
  "description": "Senior cashier with additional privileges",
  "isActive": true,
  "updatedAt": "2025-11-13T10:30:00.000Z"
}
```

---

### 5. Delete Role

**Endpoint:** `DELETE /roles/:id`
**Access:** Admin
**Description:** Delete a role (cannot delete system roles)

```bash
curl -X 'DELETE' \
  'http://localhost:3000/api/v1/roles/d4ce835e-54e3-657e-ch14-60edd53e8790' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
{
  "message": "Role deleted successfully"
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": "Cannot delete system role",
  "error": "Bad Request"
}
```

---

### 6. Assign Permissions to Role

**Endpoint:** `POST /roles/:id/permissions`
**Access:** Admin
**Description:** Assign multiple permissions to a role

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/roles/d4ce835e-54e3-657e-ch14-60edd53e8790/permissions' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "permissionIds": [
    "e5df946f-65f4-768f-di25-71fee64f9801",
    "f6eg057g-76g5-879g-ej36-82gff75g0912"
  ]
}'
```

**Request Body:**
```json
{
  "permissionIds": "string[] (required, array of permission UUIDs)"
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "code": "manager",
  "name": "Manager",
  "permissions": [
    {
      "id": "e5df946f-65f4-768f-di25-71fee64f9801",
      "code": "products.create",
      "name": "Create Products"
    },
    {
      "id": "f6eg057g-76g5-879g-ej36-82gff75g0912",
      "code": "products.read",
      "name": "Read Products"
    }
  ]
}
```

---

## Permissions API

### 1. Create Permission

**Endpoint:** `POST /permissions`
**Access:** Admin
**Description:** Create a new permission

```bash
curl -X 'POST' \
  'http://localhost:3000/api/v1/permissions' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "code": "products.create",
  "name": "Create Products",
  "resource": "products",
  "action": "create",
  "description": "Allows user to create new products"
}'
```

**Request Body:**
```json
{
  "code": "string (required, unique, e.g., 'products.create')",
  "name": "string (required)",
  "resource": "string (required, e.g., 'products', 'users', 'branches')",
  "action": "string (required, e.g., 'create', 'read', 'update', 'delete')",
  "description": "string (optional)"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "code": "products.create",
  "name": "Create Products",
  "resource": "products",
  "action": "create",
  "description": "Allows user to create new products",
  "createdAt": "2025-11-13T10:00:00.000Z"
}
```

---

### 2. Get All Permissions

**Endpoint:** `GET /permissions`
**Access:** Authenticated
**Description:** Get list of all permissions

```bash
curl -X 'GET' \
  'http://localhost:3000/api/v1/permissions' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "code": "products.create",
    "name": "Create Products",
    "resource": "products",
    "action": "create",
    "description": "Allows user to create new products"
  },
  {
    "id": "uuid",
    "code": "products.read",
    "name": "Read Products",
    "resource": "products",
    "action": "read",
    "description": "Allows user to view products"
  }
]
```

---

### 3. Get Permission by ID

**Endpoint:** `GET /permissions/:id`
**Access:** Authenticated
**Description:** Get a specific permission by ID

```bash
curl -X 'GET' \
  'http://localhost:3000/api/v1/permissions/e5df946f-65f4-768f-di25-71fee64f9801' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "code": "products.create",
  "name": "Create Products",
  "resource": "products",
  "action": "create",
  "description": "Allows user to create new products",
  "createdAt": "2025-11-13T10:00:00.000Z",
  "updatedAt": "2025-11-13T10:00:00.000Z"
}
```

---

### 4. Get Permissions by Role

**Endpoint:** `GET /permissions/role/:roleId`
**Access:** Authenticated
**Description:** Get all permissions assigned to a specific role

```bash
curl -X 'GET' \
  'http://localhost:3000/api/v1/permissions/role/d4ce835e-54e3-657e-ch14-60edd53e8790' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "code": "products.create",
    "name": "Create Products",
    "resource": "products",
    "action": "create"
  },
  {
    "id": "uuid",
    "code": "products.read",
    "name": "Read Products",
    "resource": "products",
    "action": "read"
  }
]
```

---

### 5. Update Permission

**Endpoint:** `PATCH /permissions/:id`
**Access:** Admin
**Description:** Update a permission

```bash
curl -X 'PATCH' \
  'http://localhost:3000/api/v1/permissions/e5df946f-65f4-768f-di25-71fee64f9801' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "Create New Products",
  "description": "Updated description for creating products"
}'
```

**Request Body:** All fields optional
```json
{
  "code": "string (optional)",
  "name": "string (optional)",
  "resource": "string (optional)",
  "action": "string (optional)",
  "description": "string (optional)"
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "code": "products.create",
  "name": "Create New Products",
  "resource": "products",
  "action": "create",
  "description": "Updated description for creating products",
  "updatedAt": "2025-11-13T10:30:00.000Z"
}
```

---

### 6. Delete Permission

**Endpoint:** `DELETE /permissions/:id`
**Access:** Admin
**Description:** Delete a permission

```bash
curl -X 'DELETE' \
  'http://localhost:3000/api/v1/permissions/e5df946f-65f4-768f-di25-71fee64f9801' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

**Success Response (200):**
```json
{
  "message": "Permission deleted successfully"
}
```

---

## Common Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or validation error |
| 401 | Unauthorized | Invalid credentials or missing/expired token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (duplicate) |
| 423 | Locked | Account locked (e.g., PIN attempts) |
| 500 | Internal Server Error | Server error |

---

## Data Models

### User Status Enum
```typescript
enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended'
}
```

### Permission Naming Convention
- **Format:** `{resource}.{action}`
- **Resources:** products, users, branches, sales, inventory, reports, etc.
- **Actions:** create, read, update, delete, manage, export, etc.

**Examples:**
- `products.create` - Create products
- `products.read` - View products
- `users.manage` - Full user management
- `reports.export` - Export reports
- `branches.update` - Update branch information

---

## Common Use Cases

### 1. Complete User Registration Flow
```bash
# 1. Register
curl -X POST 'http://localhost:3000/api/v1/auth/register' \
  -H 'Content-Type: application/json' \
  -d '{"username":"john","email":"john@example.com","password":"Pass123!"}'

# 2. Login
curl -X POST 'http://localhost:3000/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{"email":"john@example.com","password":"Pass123!"}'

# 3. Get current user info (using token from login)
curl -X GET 'http://localhost:3000/api/v1/auth/me' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### 2. Create Role with Permissions
```bash
# 1. Create permissions
curl -X POST 'http://localhost:3000/api/v1/permissions' \
  -H 'Authorization: Bearer ADMIN_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"code":"products.create","name":"Create Products","resource":"products","action":"create"}'

# Save the permission ID from response

# 2. Create role
curl -X POST 'http://localhost:3000/api/v1/roles' \
  -H 'Authorization: Bearer ADMIN_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"code":"cashier","name":"Cashier","description":"POS cashier"}'

# Save the role ID from response

# 3. Assign permissions to role
curl -X POST 'http://localhost:3000/api/v1/roles/ROLE_ID/permissions' \
  -H 'Authorization: Bearer ADMIN_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"permissionIds":["PERMISSION_ID_1","PERMISSION_ID_2"]}'
```

### 3. Assign Role to User
```bash
# Update user with role
curl -X PATCH 'http://localhost:3000/api/v1/users/USER_ID' \
  -H 'Authorization: Bearer ADMIN_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"roles":["cashier","staff"]}'
```

---

## Notes

1. **Token Management:**
   - Access tokens expire after 24 hours (configurable)
   - Use refresh tokens to get new access tokens
   - Store tokens securely (never in localStorage for production)

2. **PIN Security:**
   - Maximum 5 failed PIN attempts before lockout
   - Admin can reset PIN attempts
   - PIN must be at least 4 characters

3. **Role System:**
   - System roles (admin, manager) cannot be modified or deleted
   - Custom roles can be created with any combination of permissions
   - Users can have multiple roles

4. **Permission Granularity:**
   - Permissions follow resource.action pattern
   - Resources represent modules (products, users, etc.)
   - Actions represent operations (create, read, update, delete, manage)

---

**Last Updated:** 2025-11-13
**API Version:** v1
**Backend:** NestJS with TypeORM & PostgreSQL
