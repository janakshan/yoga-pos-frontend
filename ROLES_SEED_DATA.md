# Roles Seed Data for Backend Database

This document provides comprehensive role definitions for seeding your backend database. Each role includes a description, typical use cases, and associated permissions.

## Table of Contents
1. [Role Structure](#role-structure)
2. [Default System Roles](#default-system-roles)
3. [Database Schema](#database-schema)
4. [SQL Insert Statements](#sql-insert-statements)
5. [JSON Format for API Seeding](#json-format-for-api-seeding)
6. [Role-Permission Mapping](#role-permission-mapping)

---

## Role Structure

Each role should have the following fields:

```javascript
{
  id: "uuid",                    // Unique identifier
  code: "ADMIN",                 // Uppercase code for system identification
  name: "Administrator",         // Display name
  description: "Full system access", // Description
  isSystemRole: true,           // Cannot be deleted if true
  isActive: true,               // Role is active
  permissions: [],              // Array of permission IDs or codes
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

---

## Default System Roles

### 1. Super Admin
**Code**: `SUPER_ADMIN`
**Name**: Super Administrator
**Description**: Highest level access with full system control including system configuration, all branches, and all features. Cannot be restricted.

**Use Cases**:
- System owner
- IT administrators
- Platform administrators

**Permissions**: `["*"]` (Wildcard - all permissions)

**Access Level**:
- ✅ All branches
- ✅ All features
- ✅ System settings
- ✅ User management
- ✅ Role management
- ✅ Permission management
- ✅ Financial reports
- ✅ Audit logs

---

### 2. Admin
**Code**: `ADMIN`
**Name**: Administrator
**Description**: Full access to all features and settings within assigned branch. Can manage users, roles, and business operations.

**Use Cases**:
- Business owner
- General manager
- Branch manager

**Permissions**: `["*"]` (Wildcard - all permissions)

**Access Level**:
- ✅ Assigned branch only (or all if no branch restriction)
- ✅ All features
- ✅ User management
- ✅ Role management
- ✅ Financial reports
- ✅ Settings

---

### 3. Manager
**Code**: `MANAGER`
**Name**: Manager
**Description**: Can manage daily operations, staff, inventory, and view reports. Limited access to system settings.

**Use Cases**:
- Store manager
- Operations manager
- Shift manager

**Permissions**:
```javascript
[
  // Dashboard
  "dashboard.view",

  // Branch Management (View Only)
  "branches.view",

  // User Management (View Only)
  "users.view",
  "users.list",

  // Role Management (View Only)
  "roles.view",
  "roles.list",

  // Products & Inventory
  "products.*",
  "inventory.*",
  "recipes.*",

  // Suppliers & Purchase Orders
  "suppliers.*",
  "purchase_orders.*",

  // POS & Sales
  "pos.access",
  "sales.*",

  // Orders (Restaurant)
  "orders.*",

  // Customers
  "customers.*",

  // Tables & Floor Plan (Restaurant)
  "tables.*",
  "floor_plan.*",
  "kitchen.view",

  // Server Management (Restaurant)
  "servers.view",
  "servers.manage",

  // QR Ordering (Restaurant)
  "qr_ordering.view",

  // Bookings (Yoga)
  "bookings.*",

  // Financial (View Only)
  "financial.view",
  "invoices.view",
  "invoices.list",
  "payments.view",
  "payments.list",
  "expenses.*",

  // Reports (View Only)
  "reports.view",
  "reports.list",

  // Settings (View Only)
  "settings.view"
]
```

**Access Level**:
- ✅ Assigned branch only
- ✅ Most operational features
- ❌ Cannot create/edit users
- ❌ Cannot create/edit roles
- ❌ Cannot modify system settings
- ✅ Can view financial reports
- ✅ Can manage inventory

---

### 4. Cashier
**Code**: `CASHIER`
**Name**: Cashier
**Description**: Point of sale operations, process sales, and manage customer transactions. Limited access to other features.

**Use Cases**:
- Cashier
- Sales associate
- Front desk staff

**Permissions**:
```javascript
[
  // Dashboard
  "dashboard.view",

  // POS & Sales
  "pos.access",
  "sales.create",
  "sales.view",
  "sales.list",

  // Products (Read Only)
  "products.view",
  "products.list",

  // Customers
  "customers.view",
  "customers.list",
  "customers.create",
  "customers.update",

  // Inventory (View Only)
  "inventory.view",
  "inventory.list",

  // Payments
  "payments.create",
  "payments.view",

  // Invoices (View Only)
  "invoices.view",
  "invoices.list"
]
```

**Access Level**:
- ✅ Assigned branch only
- ✅ POS operations
- ✅ Process sales
- ✅ View/create customers
- ❌ Cannot access inventory management
- ❌ Cannot view financial reports
- ❌ Cannot access settings

---

### 5. Server (Restaurant Only)
**Code**: `SERVER`
**Name**: Server/Waiter
**Description**: Take orders, manage tables, and communicate with kitchen. Restaurant-specific role.

**Use Cases**:
- Waiter
- Waitress
- Server
- Host/Hostess

**Permissions**:
```javascript
[
  // Dashboard
  "dashboard.view",

  // Orders
  "orders.*",

  // Tables
  "tables.view",
  "tables.list",
  "tables.update",

  // Floor Plan
  "floor_plan.view",

  // Kitchen Display
  "kitchen.view",

  // Products (View Only)
  "products.view",
  "products.list",

  // Customers
  "customers.view",
  "customers.list",
  "customers.create",

  // Payments
  "payments.create",
  "payments.view"
]
```

**Access Level**:
- ✅ Assigned branch only
- ✅ Take orders
- ✅ Manage tables
- ✅ View kitchen status
- ❌ Cannot access POS
- ❌ Cannot manage inventory
- ❌ Cannot view financial reports

---

### 6. Chef (Restaurant Only)
**Code**: `CHEF`
**Name**: Chef/Cook
**Description**: View orders, update preparation status, manage recipes, and view inventory. Kitchen-focused role.

**Use Cases**:
- Chef
- Cook
- Kitchen staff
- Food preparation staff

**Permissions**:
```javascript
[
  // Dashboard
  "dashboard.view",

  // Kitchen Display
  "kitchen.view",

  // Orders (View & Update Status)
  "orders.view",
  "orders.list",
  "orders.update",

  // Recipes
  "recipes.view",
  "recipes.list",

  // Inventory (View Only)
  "inventory.view",
  "inventory.list",

  // Products (View Only)
  "products.view",
  "products.list"
]
```

**Access Level**:
- ✅ Assigned branch only
- ✅ View orders
- ✅ Update order status
- ✅ View recipes
- ✅ View inventory
- ❌ Cannot take orders
- ❌ Cannot access POS
- ❌ Cannot manage inventory

---

### 7. Inventory Manager
**Code**: `INVENTORY_MANAGER`
**Name**: Inventory Manager
**Description**: Full control over inventory, products, suppliers, and purchase orders. Focused on stock management.

**Use Cases**:
- Inventory manager
- Stock manager
- Warehouse manager
- Procurement officer

**Permissions**:
```javascript
[
  // Dashboard
  "dashboard.view",

  // Products
  "products.*",

  // Inventory
  "inventory.*",

  // Recipes
  "recipes.*",

  // Suppliers
  "suppliers.*",

  // Purchase Orders
  "purchase_orders.*",

  // Expenses (for purchase tracking)
  "expenses.view",
  "expenses.list",
  "expenses.create",

  // Reports (Inventory related)
  "reports.view",
  "reports.list"
]
```

**Access Level**:
- ✅ Assigned branch only
- ✅ Full inventory control
- ✅ Manage suppliers
- ✅ Create purchase orders
- ✅ View inventory reports
- ❌ Cannot access POS
- ❌ Cannot view financial reports
- ❌ Cannot manage users

---

### 8. Accountant
**Code**: `ACCOUNTANT`
**Name**: Accountant
**Description**: Access to financial features, reports, invoices, payments, and expenses. No access to operational features.

**Use Cases**:
- Accountant
- Bookkeeper
- Financial analyst
- Accounts manager

**Permissions**:
```javascript
[
  // Dashboard
  "dashboard.view",

  // Financial
  "financial.*",

  // Invoices
  "invoices.*",

  // Payments
  "payments.*",

  // Expenses
  "expenses.*",

  // Reports (Financial)
  "reports.view",
  "reports.list",
  "reports.create",
  "reports.export",

  // Sales (View Only for reconciliation)
  "sales.view",
  "sales.list",

  // Purchase Orders (View Only)
  "purchase_orders.view",
  "purchase_orders.list",

  // Customers (View Only)
  "customers.view",
  "customers.list",

  // Suppliers (View Only)
  "suppliers.view",
  "suppliers.list"
]
```

**Access Level**:
- ✅ All branches (typically)
- ✅ Full financial access
- ✅ Generate reports
- ✅ Manage invoices
- ✅ Track expenses
- ❌ Cannot access POS
- ❌ Cannot manage inventory
- ❌ Cannot manage users

---

### 9. Staff
**Code**: `STAFF`
**Name**: Staff/Employee
**Description**: Basic access for general staff members. Minimal permissions for viewing information only.

**Use Cases**:
- General staff
- Part-time employees
- Trainees
- Support staff

**Permissions**:
```javascript
[
  // Dashboard
  "dashboard.view",

  // Products (View Only)
  "products.view",
  "products.list",

  // Inventory (View Only)
  "inventory.view",
  "inventory.list"
]
```

**Access Level**:
- ✅ Assigned branch only
- ✅ View dashboard
- ✅ View products
- ✅ View inventory levels
- ❌ Cannot make any changes
- ❌ Cannot access POS
- ❌ Cannot view financial data

---

### 10. Viewer/Analyst
**Code**: `VIEWER`
**Name**: Viewer/Analyst
**Description**: Read-only access to reports and analytics. Cannot modify any data. Useful for external consultants or stakeholders.

**Use Cases**:
- Business analyst
- External consultant
- Stakeholder
- Auditor

**Permissions**:
```javascript
[
  // Dashboard
  "dashboard.view",

  // Reports (View Only)
  "reports.view",
  "reports.list",
  "reports.export",

  // Analytics
  "analytics.view",
  "qr_analytics.view",

  // Sales (View Only)
  "sales.view",
  "sales.list",

  // Financial (View Only)
  "financial.view",

  // Customers (View Only)
  "customers.view",
  "customers.list",

  // Products (View Only)
  "products.view",
  "products.list",

  // Inventory (View Only)
  "inventory.view",
  "inventory.list"
]
```

**Access Level**:
- ✅ All branches (typically)
- ✅ View all reports
- ✅ Export data
- ✅ View analytics
- ❌ Cannot modify anything
- ❌ Cannot access POS
- ❌ Cannot manage users

---

### 11. Customer Support
**Code**: `CUSTOMER_SUPPORT`
**Name**: Customer Support
**Description**: Manage customers, handle inquiries, process refunds, and view orders. Customer-facing role.

**Use Cases**:
- Customer service representative
- Support agent
- Help desk staff

**Permissions**:
```javascript
[
  // Dashboard
  "dashboard.view",

  // Customers
  "customers.*",

  // Orders (View & Update)
  "orders.view",
  "orders.list",
  "orders.update",

  // Sales (View Only)
  "sales.view",
  "sales.list",

  // Invoices (View Only)
  "invoices.view",
  "invoices.list",

  // Payments (View & Refund)
  "payments.view",
  "payments.list",
  "payments.update",

  // Bookings (Yoga)
  "bookings.view",
  "bookings.list",
  "bookings.update"
]
```

**Access Level**:
- ✅ All branches (typically)
- ✅ Manage customers
- ✅ View orders
- ✅ Process refunds
- ✅ Handle bookings
- ❌ Cannot access POS
- ❌ Cannot manage inventory
- ❌ Cannot view financial reports

---

### 12. Marketing Manager
**Code**: `MARKETING_MANAGER`
**Name**: Marketing Manager
**Description**: Access to customer data, analytics, QR ordering, and marketing-related features.

**Use Cases**:
- Marketing manager
- Marketing coordinator
- Social media manager
- Campaign manager

**Permissions**:
```javascript
[
  // Dashboard
  "dashboard.view",

  // Customers
  "customers.view",
  "customers.list",
  "customers.export",

  // QR Ordering & Analytics
  "qr_ordering.*",
  "qr_analytics.*",

  // Analytics
  "analytics.view",

  // Reports (Marketing related)
  "reports.view",
  "reports.list",
  "reports.export",

  // Sales (View Only)
  "sales.view",
  "sales.list",

  // Products (View Only)
  "products.view",
  "products.list"
]
```

**Access Level**:
- ✅ All branches
- ✅ View customer data
- ✅ Generate QR codes
- ✅ View analytics
- ✅ Export reports
- ❌ Cannot access POS
- ❌ Cannot manage inventory
- ❌ Cannot view financial data

---

### 13. Yoga Instructor (Yoga Only)
**Code**: `YOGA_INSTRUCTOR`
**Name**: Yoga Instructor
**Description**: Manage classes, bookings, and view student information. Yoga studio specific role.

**Use Cases**:
- Yoga instructor
- Yoga teacher
- Class instructor

**Permissions**:
```javascript
[
  // Dashboard
  "dashboard.view",

  // Bookings
  "bookings.*",

  // Classes (if you have class management)
  "classes.*",

  // Customers (View Only - students)
  "customers.view",
  "customers.list",

  // Products (View Only - yoga products)
  "products.view",
  "products.list",

  // Payments (View Only)
  "payments.view",
  "payments.list"
]
```

**Access Level**:
- ✅ Assigned branch only
- ✅ Manage bookings
- ✅ View student information
- ✅ Manage classes
- ❌ Cannot access POS
- ❌ Cannot manage inventory
- ❌ Cannot view financial reports

---

## Database Schema

### PostgreSQL Schema

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role-Permission junction table
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, permission_id)
);

-- User-Role junction table (if not exists)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, role_id)
);

-- Indexes for performance
CREATE INDEX idx_roles_code ON roles(code);
CREATE INDEX idx_roles_is_active ON roles(is_active);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```

### MySQL Schema

```sql
CREATE TABLE roles (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  is_system_role BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Role-Permission junction table
CREATE TABLE role_permissions (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  role_id CHAR(36) NOT NULL,
  permission_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_role_permission (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- User-Role junction table
CREATE TABLE user_roles (
  id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  user_id CHAR(36) NOT NULL,
  role_id CHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_role (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_roles_code ON roles(code);
CREATE INDEX idx_roles_is_active ON roles(is_active);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
```

---

## SQL Insert Statements

### PostgreSQL Insert Statements

```sql
-- Insert Roles
INSERT INTO roles (id, code, name, description, is_system_role, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'SUPER_ADMIN', 'Super Administrator', 'Highest level access with full system control including system configuration, all branches, and all features.', TRUE, TRUE),
('22222222-2222-2222-2222-222222222222', 'ADMIN', 'Administrator', 'Full access to all features and settings within assigned branch.', TRUE, TRUE),
('33333333-3333-3333-3333-333333333333', 'MANAGER', 'Manager', 'Can manage daily operations, staff, inventory, and view reports.', TRUE, TRUE),
('44444444-4444-4444-4444-444444444444', 'CASHIER', 'Cashier', 'Point of sale operations and customer transactions.', TRUE, TRUE),
('55555555-5555-5555-5555-555555555555', 'SERVER', 'Server/Waiter', 'Take orders, manage tables, and communicate with kitchen.', TRUE, TRUE),
('66666666-6666-6666-6666-666666666666', 'CHEF', 'Chef/Cook', 'View orders, update preparation status, and manage recipes.', TRUE, TRUE),
('77777777-7777-7777-7777-777777777777', 'INVENTORY_MANAGER', 'Inventory Manager', 'Full control over inventory, products, and suppliers.', TRUE, TRUE),
('88888888-8888-8888-8888-888888888888', 'ACCOUNTANT', 'Accountant', 'Access to financial features, reports, and accounting.', TRUE, TRUE),
('99999999-9999-9999-9999-999999999999', 'STAFF', 'Staff/Employee', 'Basic access for general staff members.', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'VIEWER', 'Viewer/Analyst', 'Read-only access to reports and analytics.', TRUE, TRUE),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'CUSTOMER_SUPPORT', 'Customer Support', 'Manage customers and handle inquiries.', TRUE, TRUE),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'MARKETING_MANAGER', 'Marketing Manager', 'Access to customer data, analytics, and marketing features.', TRUE, TRUE),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'YOGA_INSTRUCTOR', 'Yoga Instructor', 'Manage classes, bookings, and view student information.', TRUE, TRUE);

-- For role-permission mappings, you'll need to get permission IDs first
-- Example for MANAGER role:
INSERT INTO role_permissions (role_id, permission_id)
SELECT '33333333-3333-3333-3333-333333333333', id
FROM permissions
WHERE code IN (
  'dashboard:view',
  'branches:view',
  'users:view', 'users:list',
  'roles:view', 'roles:list',
  'products:view', 'products:list', 'products:create', 'products:update', 'products:delete',
  'inventory:view', 'inventory:list', 'inventory:create', 'inventory:update', 'inventory:delete',
  -- ... add all manager permissions
);
```

### MySQL Insert Statements

```sql
-- Insert Roles
INSERT INTO roles (id, code, name, description, is_system_role, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'SUPER_ADMIN', 'Super Administrator', 'Highest level access with full system control including system configuration, all branches, and all features.', TRUE, TRUE),
('22222222-2222-2222-2222-222222222222', 'ADMIN', 'Administrator', 'Full access to all features and settings within assigned branch.', TRUE, TRUE),
('33333333-3333-3333-3333-333333333333', 'MANAGER', 'Manager', 'Can manage daily operations, staff, inventory, and view reports.', TRUE, TRUE),
('44444444-4444-4444-4444-444444444444', 'CASHIER', 'Cashier', 'Point of sale operations and customer transactions.', TRUE, TRUE),
('55555555-5555-5555-5555-555555555555', 'SERVER', 'Server/Waiter', 'Take orders, manage tables, and communicate with kitchen.', TRUE, TRUE),
('66666666-6666-6666-6666-666666666666', 'CHEF', 'Chef/Cook', 'View orders, update preparation status, and manage recipes.', TRUE, TRUE),
('77777777-7777-7777-7777-777777777777', 'INVENTORY_MANAGER', 'Inventory Manager', 'Full control over inventory, products, and suppliers.', TRUE, TRUE),
('88888888-8888-8888-8888-888888888888', 'ACCOUNTANT', 'Accountant', 'Access to financial features, reports, and accounting.', TRUE, TRUE),
('99999999-9999-9999-9999-999999999999', 'STAFF', 'Staff/Employee', 'Basic access for general staff members.', TRUE, TRUE),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'VIEWER', 'Viewer/Analyst', 'Read-only access to reports and analytics.', TRUE, TRUE),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'CUSTOMER_SUPPORT', 'Customer Support', 'Manage customers and handle inquiries.', TRUE, TRUE),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'MARKETING_MANAGER', 'Marketing Manager', 'Access to customer data, analytics, and marketing features.', TRUE, TRUE),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'YOGA_INSTRUCTOR', 'Yoga Instructor', 'Manage classes, bookings, and view student information.', TRUE, TRUE);
```

---

## JSON Format for API Seeding

### Complete Roles Array

```json
[
  {
    "id": "11111111-1111-1111-1111-111111111111",
    "code": "SUPER_ADMIN",
    "name": "Super Administrator",
    "description": "Highest level access with full system control including system configuration, all branches, and all features.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": ["*"]
  },
  {
    "id": "22222222-2222-2222-2222-222222222222",
    "code": "ADMIN",
    "name": "Administrator",
    "description": "Full access to all features and settings within assigned branch.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": ["*"]
  },
  {
    "id": "33333333-3333-3333-3333-333333333333",
    "code": "MANAGER",
    "name": "Manager",
    "description": "Can manage daily operations, staff, inventory, and view reports.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": [
      "dashboard:view",
      "branches:view",
      "users:view",
      "users:list",
      "roles:view",
      "roles:list",
      "products:view",
      "products:list",
      "products:create",
      "products:update",
      "products:delete",
      "inventory:view",
      "inventory:list",
      "inventory:create",
      "inventory:update",
      "inventory:delete",
      "recipes:view",
      "recipes:list",
      "recipes:create",
      "recipes:update",
      "recipes:delete",
      "suppliers:view",
      "suppliers:list",
      "suppliers:create",
      "suppliers:update",
      "suppliers:delete",
      "purchase_orders:view",
      "purchase_orders:list",
      "purchase_orders:create",
      "purchase_orders:update",
      "purchase_orders:delete",
      "pos:access",
      "sales:view",
      "sales:list",
      "sales:create",
      "sales:update",
      "sales:delete",
      "orders:view",
      "orders:list",
      "orders:create",
      "orders:update",
      "orders:delete",
      "customers:view",
      "customers:list",
      "customers:create",
      "customers:update",
      "customers:delete",
      "tables:view",
      "tables:list",
      "tables:create",
      "tables:update",
      "tables:delete",
      "floor_plan:view",
      "kitchen:view",
      "servers:view",
      "servers:manage",
      "qr_ordering:view",
      "bookings:view",
      "bookings:list",
      "bookings:create",
      "bookings:update",
      "bookings:delete",
      "financial:view",
      "invoices:view",
      "invoices:list",
      "payments:view",
      "payments:list",
      "expenses:view",
      "expenses:list",
      "expenses:create",
      "expenses:update",
      "expenses:delete",
      "reports:view",
      "reports:list",
      "settings:view"
    ]
  },
  {
    "id": "44444444-4444-4444-4444-444444444444",
    "code": "CASHIER",
    "name": "Cashier",
    "description": "Point of sale operations and customer transactions.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": [
      "dashboard:view",
      "pos:access",
      "sales:create",
      "sales:view",
      "sales:list",
      "products:view",
      "products:list",
      "customers:view",
      "customers:list",
      "customers:create",
      "customers:update",
      "inventory:view",
      "inventory:list",
      "payments:create",
      "payments:view",
      "invoices:view",
      "invoices:list"
    ]
  },
  {
    "id": "55555555-5555-5555-5555-555555555555",
    "code": "SERVER",
    "name": "Server/Waiter",
    "description": "Take orders, manage tables, and communicate with kitchen.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": [
      "dashboard:view",
      "orders:view",
      "orders:list",
      "orders:create",
      "orders:update",
      "orders:delete",
      "tables:view",
      "tables:list",
      "tables:update",
      "floor_plan:view",
      "kitchen:view",
      "products:view",
      "products:list",
      "customers:view",
      "customers:list",
      "customers:create",
      "payments:create",
      "payments:view"
    ]
  },
  {
    "id": "66666666-6666-6666-6666-666666666666",
    "code": "CHEF",
    "name": "Chef/Cook",
    "description": "View orders, update preparation status, and manage recipes.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": [
      "dashboard:view",
      "kitchen:view",
      "orders:view",
      "orders:list",
      "orders:update",
      "recipes:view",
      "recipes:list",
      "inventory:view",
      "inventory:list",
      "products:view",
      "products:list"
    ]
  },
  {
    "id": "77777777-7777-7777-7777-777777777777",
    "code": "INVENTORY_MANAGER",
    "name": "Inventory Manager",
    "description": "Full control over inventory, products, and suppliers.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": [
      "dashboard:view",
      "products:view",
      "products:list",
      "products:create",
      "products:update",
      "products:delete",
      "inventory:view",
      "inventory:list",
      "inventory:create",
      "inventory:update",
      "inventory:delete",
      "recipes:view",
      "recipes:list",
      "recipes:create",
      "recipes:update",
      "recipes:delete",
      "suppliers:view",
      "suppliers:list",
      "suppliers:create",
      "suppliers:update",
      "suppliers:delete",
      "purchase_orders:view",
      "purchase_orders:list",
      "purchase_orders:create",
      "purchase_orders:update",
      "purchase_orders:delete",
      "expenses:view",
      "expenses:list",
      "expenses:create",
      "reports:view",
      "reports:list"
    ]
  },
  {
    "id": "88888888-8888-8888-8888-888888888888",
    "code": "ACCOUNTANT",
    "name": "Accountant",
    "description": "Access to financial features, reports, and accounting.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": [
      "dashboard:view",
      "financial:view",
      "financial:manage",
      "invoices:view",
      "invoices:list",
      "invoices:create",
      "invoices:update",
      "invoices:delete",
      "payments:view",
      "payments:list",
      "payments:create",
      "payments:update",
      "payments:delete",
      "expenses:view",
      "expenses:list",
      "expenses:create",
      "expenses:update",
      "expenses:delete",
      "reports:view",
      "reports:list",
      "reports:create",
      "reports:export",
      "sales:view",
      "sales:list",
      "purchase_orders:view",
      "purchase_orders:list",
      "customers:view",
      "customers:list",
      "suppliers:view",
      "suppliers:list"
    ]
  },
  {
    "id": "99999999-9999-9999-9999-999999999999",
    "code": "STAFF",
    "name": "Staff/Employee",
    "description": "Basic access for general staff members.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": [
      "dashboard:view",
      "products:view",
      "products:list",
      "inventory:view",
      "inventory:list"
    ]
  },
  {
    "id": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
    "code": "VIEWER",
    "name": "Viewer/Analyst",
    "description": "Read-only access to reports and analytics.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": [
      "dashboard:view",
      "reports:view",
      "reports:list",
      "reports:export",
      "analytics:view",
      "qr_analytics:view",
      "sales:view",
      "sales:list",
      "financial:view",
      "customers:view",
      "customers:list",
      "products:view",
      "products:list",
      "inventory:view",
      "inventory:list"
    ]
  },
  {
    "id": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
    "code": "CUSTOMER_SUPPORT",
    "name": "Customer Support",
    "description": "Manage customers and handle inquiries.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": [
      "dashboard:view",
      "customers:view",
      "customers:list",
      "customers:create",
      "customers:update",
      "customers:delete",
      "orders:view",
      "orders:list",
      "orders:update",
      "sales:view",
      "sales:list",
      "invoices:view",
      "invoices:list",
      "payments:view",
      "payments:list",
      "payments:update",
      "bookings:view",
      "bookings:list",
      "bookings:update"
    ]
  },
  {
    "id": "cccccccc-cccc-cccc-cccc-cccccccccccc",
    "code": "MARKETING_MANAGER",
    "name": "Marketing Manager",
    "description": "Access to customer data, analytics, and marketing features.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": [
      "dashboard:view",
      "customers:view",
      "customers:list",
      "customers:export",
      "qr_ordering:view",
      "qr_ordering:create",
      "qr_ordering:update",
      "qr_ordering:delete",
      "qr_ordering:manage",
      "qr_analytics:view",
      "qr_analytics:export",
      "analytics:view",
      "reports:view",
      "reports:list",
      "reports:export",
      "sales:view",
      "sales:list",
      "products:view",
      "products:list"
    ]
  },
  {
    "id": "dddddddd-dddd-dddd-dddd-dddddddddddd",
    "code": "YOGA_INSTRUCTOR",
    "name": "Yoga Instructor",
    "description": "Manage classes, bookings, and view student information.",
    "isSystemRole": true,
    "isActive": true,
    "permissions": [
      "dashboard:view",
      "bookings:view",
      "bookings:list",
      "bookings:create",
      "bookings:update",
      "bookings:delete",
      "classes:view",
      "classes:list",
      "classes:create",
      "classes:update",
      "classes:delete",
      "customers:view",
      "customers:list",
      "products:view",
      "products:list",
      "payments:view",
      "payments:list"
    ]
  }
]
```

---

## Role-Permission Mapping

### Quick Reference Table

| Role | Code | Permission Count | Key Permissions |
|------|------|------------------|-----------------|
| **Super Admin** | `SUPER_ADMIN` | All (*) | Everything |
| **Admin** | `ADMIN` | All (*) | Everything |
| **Manager** | `MANAGER` | ~70 | Operations, inventory, limited financial |
| **Cashier** | `CASHIER` | ~15 | POS, sales, customers |
| **Server** | `SERVER` | ~15 | Orders, tables, kitchen |
| **Chef** | `CHEF` | ~10 | Kitchen, orders, recipes |
| **Inventory Manager** | `INVENTORY_MANAGER` | ~25 | Products, inventory, suppliers |
| **Accountant** | `ACCOUNTANT` | ~25 | Financial, reports, invoices |
| **Staff** | `STAFF` | ~4 | View only |
| **Viewer** | `VIEWER` | ~15 | Reports, analytics (read-only) |
| **Customer Support** | `CUSTOMER_SUPPORT` | ~15 | Customers, orders, bookings |
| **Marketing Manager** | `MARKETING_MANAGER` | ~15 | Customers, analytics, QR |
| **Yoga Instructor** | `YOGA_INSTRUCTOR` | ~15 | Bookings, classes, students |

---

## Implementation Notes

### 1. Seeding Order

Execute in this order to avoid foreign key constraints:

1. **Permissions** (see PERMISSIONS_SEED_DATA.md)
2. **Roles** (this document)
3. **Role-Permissions junction table**
4. **Users**
5. **User-Roles junction table**

### 2. Permission Code Format

The backend should support both formats:
- `users:view` (colon separator)
- `users.view` (dot separator)

Normalize them internally to your preferred format.

### 3. Wildcard Handling

- `*` = All permissions
- `users:*` = All user-related permissions
- `products:*` = All product-related permissions

### 4. System Roles

Roles with `isSystemRole: true` should:
- Not be deletable via API
- Not be editable (except permissions)
- Always be visible in role selection

### 5. Dynamic Role Creation

Allow admins to create custom roles by:
1. Cloning an existing role
2. Selecting specific permissions
3. Assigning to users

### 6. Role Hierarchy (Optional)

Consider implementing role hierarchy where higher roles inherit lower role permissions:
```
SUPER_ADMIN > ADMIN > MANAGER > CASHIER/SERVER > STAFF
```

---

## Testing Roles

### Test User Creation

Create test users for each role:

```sql
-- Example: Create test user for CASHIER role
INSERT INTO users (id, username, email, password_hash, branch_id) VALUES
('test-cashier-id', 'cashier.test', 'cashier@test.com', 'hashed_password', 'branch-id');

INSERT INTO user_roles (user_id, role_id) VALUES
('test-cashier-id', '44444444-4444-4444-4444-444444444444');
```

### Test Credentials for Frontend

Update your login form to include test credentials for each role:

```javascript
const testCredentials = {
  superAdmin: { email: 'superadmin@test.com', password: 'Test123!' },
  admin: { email: 'admin@yogapos.com', password: 'Manager1@3' },
  manager: { email: 'manager@test.com', password: 'Test123!' },
  cashier: { email: 'cashier@test.com', password: 'Test123!' },
  server: { email: 'server@test.com', password: 'Test123!' },
  chef: { email: 'chef@test.com', password: 'Test123!' },
  // ... etc
};
```

---

## Common Issues & Solutions

### Issue 1: Role Not Showing in Dropdown
**Solution**: Check `is_active = TRUE` and ensure role is not soft-deleted

### Issue 2: Permission Changes Not Reflecting
**Solution**: Clear JWT token cache, re-login to get fresh token with updated permissions

### Issue 3: User Has Role But No Permissions
**Solution**: Check `role_permissions` junction table has correct mappings

### Issue 4: Cannot Delete Role
**Solution**: Check if `is_system_role = TRUE` - system roles cannot be deleted

### Issue 5: Role Code Mismatch
**Solution**: Frontend expects uppercase codes (e.g., `ADMIN`), ensure consistency

---

## Migration Script Example (NestJS)

```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert roles
    await queryRunner.query(`
      INSERT INTO roles (id, code, name, description, is_system_role, is_active)
      VALUES
        ('11111111-1111-1111-1111-111111111111', 'SUPER_ADMIN', 'Super Administrator', 'Highest level access', TRUE, TRUE),
        ('22222222-2222-2222-2222-222222222222', 'ADMIN', 'Administrator', 'Full access', TRUE, TRUE),
        -- ... more roles
    `);

    // For wildcard roles (ADMIN, SUPER_ADMIN), you might want to skip junction table
    // and handle wildcard in your authorization guard

    // For other roles, insert role-permission mappings
    // This requires permissions to be seeded first
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM role_permissions WHERE role_id IN (...)`);
    await queryRunner.query(`DELETE FROM roles WHERE id IN (...)`);
  }
}
```

---

## Summary

This document provides 13 pre-configured roles suitable for a Yoga/Restaurant POS system:

1. ✅ **Super Admin** - Full system access
2. ✅ **Admin** - Branch-level full access
3. ✅ **Manager** - Operations management
4. ✅ **Cashier** - POS operations
5. ✅ **Server** - Restaurant orders & tables
6. ✅ **Chef** - Kitchen operations
7. ✅ **Inventory Manager** - Stock management
8. ✅ **Accountant** - Financial operations
9. ✅ **Staff** - Basic view access
10. ✅ **Viewer** - Read-only reports
11. ✅ **Customer Support** - Customer management
12. ✅ **Marketing Manager** - Marketing & analytics
13. ✅ **Yoga Instructor** - Class & booking management

Each role has been carefully designed with appropriate permissions for its use case. Use this document to seed your backend database and ensure consistency between frontend and backend role definitions.
