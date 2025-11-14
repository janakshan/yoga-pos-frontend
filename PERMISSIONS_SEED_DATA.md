# Permission Seed Data - Complete List

This document contains all possible permissions in the Yoga POS system for backend database seeding.

## Permission Naming Convention

**Format Options:**
- `resource.action` (recommended - e.g., `users.view`)
- `resource:action` (alternative - e.g., `users:view`)

**Note**: The frontend automatically normalizes both formats, so you can use either `.` or `:` as separator.

**Actions:**
- `view` / `read` - View single record details
- `list` / `index` - List/browse multiple records
- `create` / `write` - Create new records
- `update` / `edit` - Modify existing records
- `delete` / `remove` - Remove records
- `manage` - Full control (combination of all actions)
- `access` - Access to a feature/module
- `*` - Wildcard for all actions on a resource

**Examples of equivalent permissions:**
- `users.view` = `users:view` = `users.read` = `users:read`
- `users.create` = `users:create` = `users.write` = `users:write`
- `users.list` = `users:list` = `users.manage` = `users:manage`

---

## 1. User Management Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `users.view` | View User | View individual user details |
| `users.list` | List Users | Browse and search users |
| `users.create` | Create User | Create new user accounts |
| `users.update` | Update User | Modify user information |
| `users.delete` | Delete User | Remove user accounts |
| `users.manage` | Manage Users | Full user management access |
| `users.*` | All User Permissions | Wildcard for all user operations |

---

## 2. Role Management Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `roles.view` | View Role | View role details and permissions |
| `roles.list` | List Roles | Browse all roles |
| `roles.create` | Create Role | Create new roles |
| `roles.update` | Update Role | Modify role settings and permissions |
| `roles.delete` | Delete Role | Remove roles (non-system roles only) |
| `roles.manage` | Manage Roles | Full role management access |
| `roles.*` | All Role Permissions | Wildcard for all role operations |

---

## 3. Permission Management

| Permission Code | Name | Description |
|----------------|------|-------------|
| `permissions.view` | View Permission | View permission details |
| `permissions.list` | List Permissions | Browse all permissions |
| `permissions.create` | Create Permission | Create new permissions |
| `permissions.update` | Update Permission | Modify permission settings |
| `permissions.delete` | Delete Permission | Remove permissions |
| `permissions.manage` | Manage Permissions | Full permission management |
| `permissions.*` | All Permission Operations | Wildcard for all permission operations |

---

## 4. Branch Management Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `branches.view` | View Branch | View branch details |
| `branches.list` | List Branches | Browse all branches |
| `branches.create` | Create Branch | Create new branches |
| `branches.update` | Update Branch | Modify branch information |
| `branches.delete` | Delete Branch | Remove branches |
| `branches.manage` | Manage Branches | Full branch management access |
| `branches.*` | All Branch Permissions | Wildcard for all branch operations |

---

## 5. Product Management Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `products.view` | View Product | View product details |
| `products.list` | List Products | Browse products catalog |
| `products.create` | Create Product | Add new products |
| `products.update` | Update Product | Modify product information |
| `products.delete` | Delete Product | Remove products |
| `products.manage` | Manage Products | Full product management |
| `products.*` | All Product Permissions | Wildcard for all product operations |

---

## 6. Inventory Management Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `inventory.view` | View Inventory | View inventory levels and details |
| `inventory.list` | List Inventory | Browse inventory items |
| `inventory.create` | Create Inventory | Add inventory records |
| `inventory.update` | Update Inventory | Adjust inventory levels |
| `inventory.delete` | Delete Inventory | Remove inventory records |
| `inventory.manage` | Manage Inventory | Full inventory management |
| `inventory.*` | All Inventory Permissions | Wildcard for all inventory operations |

---

## 7. Point of Sale (POS) Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `pos.access` | Access POS | Access POS interface |
| `pos.checkout` | Checkout | Process sales transactions |
| `pos.refund` | Process Refunds | Handle refunds and returns |
| `pos.discount` | Apply Discounts | Apply discounts to sales |
| `pos.void` | Void Transactions | Cancel transactions |
| `pos.*` | All POS Permissions | Wildcard for all POS operations |

---

## 8. Sales Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `sales.view` | View Sale | View sale details |
| `sales.list` | List Sales | Browse sales history |
| `sales.create` | Create Sale | Process new sales |
| `sales.update` | Update Sale | Modify sales (if allowed) |
| `sales.delete` | Delete Sale | Remove sales records |
| `sales.refund` | Refund Sale | Process sale refunds |
| `sales.*` | All Sales Permissions | Wildcard for all sales operations |

---

## 9. Customer Management Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `customers.view` | View Customer | View customer details |
| `customers.list` | List Customers | Browse customer database |
| `customers.create` | Create Customer | Add new customers |
| `customers.update` | Update Customer | Modify customer information |
| `customers.delete` | Delete Customer | Remove customer records |
| `customers.manage` | Manage Customers | Full customer management |
| `customers.*` | All Customer Permissions | Wildcard for all customer operations |

---

## 10. Supplier Management Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `suppliers.view` | View Supplier | View supplier details |
| `suppliers.list` | List Suppliers | Browse suppliers |
| `suppliers.create` | Create Supplier | Add new suppliers |
| `suppliers.update` | Update Supplier | Modify supplier information |
| `suppliers.delete` | Delete Supplier | Remove suppliers |
| `suppliers.*` | All Supplier Permissions | Wildcard for all supplier operations |

---

## 11. Purchase Order Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `purchase_orders.view` | View Purchase Order | View PO details |
| `purchase_orders.list` | List Purchase Orders | Browse purchase orders |
| `purchase_orders.create` | Create Purchase Order | Create new POs |
| `purchase_orders.update` | Update Purchase Order | Modify purchase orders |
| `purchase_orders.delete` | Delete Purchase Order | Remove purchase orders |
| `purchase_orders.approve` | Approve Purchase Order | Approve POs for processing |
| `purchase_orders.receive` | Receive Purchase Order | Mark POs as received |
| `purchase_orders.*` | All PO Permissions | Wildcard for all PO operations |

---

## 12. Order Management Permissions (Restaurant)

| Permission Code | Name | Description |
|----------------|------|-------------|
| `orders.view` | View Order | View order details |
| `orders.list` | List Orders | Browse orders |
| `orders.create` | Create Order | Create new orders |
| `orders.update` | Update Order | Modify orders |
| `orders.delete` | Delete Order | Cancel/remove orders |
| `orders.complete` | Complete Order | Mark orders as completed |
| `orders.cancel` | Cancel Order | Cancel orders |
| `orders.*` | All Order Permissions | Wildcard for all order operations |

---

## 13. Recipe Management Permissions (Restaurant)

| Permission Code | Name | Description |
|----------------|------|-------------|
| `recipes.view` | View Recipe | View recipe details |
| `recipes.list` | List Recipes | Browse recipes |
| `recipes.create` | Create Recipe | Add new recipes |
| `recipes.update` | Update Recipe | Modify recipes |
| `recipes.delete` | Delete Recipe | Remove recipes |
| `recipes.*` | All Recipe Permissions | Wildcard for all recipe operations |

---

## 14. Table Management Permissions (Restaurant)

| Permission Code | Name | Description |
|----------------|------|-------------|
| `tables.view` | View Table | View table details |
| `tables.list` | List Tables | Browse tables |
| `tables.create` | Create Table | Add new tables |
| `tables.update` | Update Table | Modify table information |
| `tables.delete` | Delete Table | Remove tables |
| `tables.assign` | Assign Table | Assign tables to servers |
| `tables.*` | All Table Permissions | Wildcard for all table operations |

---

## 15. Floor Plan Permissions (Restaurant)

| Permission Code | Name | Description |
|----------------|------|-------------|
| `floor_plan.view` | View Floor Plan | View restaurant floor layout |
| `floor_plan.update` | Update Floor Plan | Modify floor plan layout |
| `floor_plan.manage` | Manage Floor Plan | Full floor plan management |
| `floor_plan.*` | All Floor Plan Permissions | Wildcard for floor plan operations |

---

## 16. Kitchen Display Permissions (Restaurant)

| Permission Code | Name | Description |
|----------------|------|-------------|
| `kitchen.view` | View Kitchen Display | Access kitchen display system |
| `kitchen.update` | Update Kitchen Orders | Update order status in kitchen |
| `kitchen.manage` | Manage Kitchen | Full kitchen display management |
| `kitchen.*` | All Kitchen Permissions | Wildcard for kitchen operations |

---

## 17. Server Management Permissions (Restaurant)

| Permission Code | Name | Description |
|----------------|------|-------------|
| `servers.view` | View Server | View server details and shifts |
| `servers.list` | List Servers | Browse server list |
| `servers.manage` | Manage Servers | Assign servers and manage shifts |
| `servers.*` | All Server Permissions | Wildcard for server operations |

---

## 18. QR Ordering Permissions (Restaurant)

| Permission Code | Name | Description |
|----------------|------|-------------|
| `qr_ordering.view` | View QR Orders | View QR ordering system |
| `qr_ordering.manage` | Manage QR Ordering | Configure QR ordering settings |
| `qr_ordering.*` | All QR Ordering Permissions | Wildcard for QR ordering operations |

---

## 19. Booking Management Permissions (Yoga)

| Permission Code | Name | Description |
|----------------|------|-------------|
| `bookings.view` | View Booking | View booking details |
| `bookings.list` | List Bookings | Browse all bookings |
| `bookings.create` | Create Booking | Create new bookings |
| `bookings.update` | Update Booking | Modify bookings |
| `bookings.delete` | Delete Booking | Cancel/remove bookings |
| `bookings.checkin` | Check-in Booking | Mark bookings as checked-in |
| `bookings.*` | All Booking Permissions | Wildcard for all booking operations |

---

## 20. Financial Management Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `financial.view` | View Financial Data | View financial information |
| `financial.manage` | Manage Financial Data | Full financial management |
| `financial.*` | All Financial Permissions | Wildcard for financial operations |

---

## 21. Invoice Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `invoices.view` | View Invoice | View invoice details |
| `invoices.list` | List Invoices | Browse invoices |
| `invoices.create` | Create Invoice | Generate new invoices |
| `invoices.update` | Update Invoice | Modify invoices |
| `invoices.delete` | Delete Invoice | Remove invoices |
| `invoices.send` | Send Invoice | Email invoices to customers |
| `invoices.*` | All Invoice Permissions | Wildcard for invoice operations |

---

## 22. Payment Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `payments.view` | View Payment | View payment details |
| `payments.list` | List Payments | Browse payment history |
| `payments.create` | Create Payment | Process payments |
| `payments.update` | Update Payment | Modify payment records |
| `payments.delete` | Delete Payment | Remove payment records |
| `payments.refund` | Refund Payment | Process payment refunds |
| `payments.*` | All Payment Permissions | Wildcard for payment operations |

---

## 23. Expense Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `expenses.view` | View Expense | View expense details |
| `expenses.list` | List Expenses | Browse expenses |
| `expenses.create` | Create Expense | Record new expenses |
| `expenses.update` | Update Expense | Modify expenses |
| `expenses.delete` | Delete Expense | Remove expenses |
| `expenses.approve` | Approve Expense | Approve expense claims |
| `expenses.*` | All Expense Permissions | Wildcard for expense operations |

---

## 24. Report Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `reports.view` | View Reports | Access reports and analytics |
| `reports.list` | List Reports | Browse available reports |
| `reports.export` | Export Reports | Export report data |
| `reports.create` | Create Reports | Generate custom reports |
| `reports.*` | All Report Permissions | Wildcard for report operations |

---

## 25. Analytics Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `analytics.view` | View Analytics | Access analytics dashboards |
| `analytics.export` | Export Analytics | Export analytics data |
| `analytics.*` | All Analytics Permissions | Wildcard for analytics operations |

---

## 26. Settings Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `settings.view` | View Settings | View system settings |
| `settings.update` | Update Settings | Modify system settings |
| `settings.manage` | Manage Settings | Full settings management |
| `settings.*` | All Settings Permissions | Wildcard for settings operations |

---

## 27. Dashboard Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `dashboard.view` | View Dashboard | Access main dashboard |
| `dashboard.*` | All Dashboard Permissions | Wildcard for dashboard operations |

---

## 28. System Administration Permissions

| Permission Code | Name | Description |
|----------------|------|-------------|
| `system.backup` | System Backup | Create system backups |
| `system.restore` | System Restore | Restore from backups |
| `system.logs` | View System Logs | Access system logs |
| `system.maintenance` | System Maintenance | Perform maintenance tasks |
| `system.*` | All System Permissions | Wildcard for system operations |

---

## 29. Wildcard Permission

| Permission Code | Name | Description |
|----------------|------|-------------|
| `*` | Super Admin | Full access to all system features |

---

## Suggested Role-Permission Mappings

### Super Admin
```json
{
  "role": "SUPER_ADMIN",
  "permissions": ["*"]
}
```

### Admin
```json
{
  "role": "ADMIN",
  "permissions": [
    "users.*", "roles.*", "permissions.*", "branches.*",
    "products.*", "inventory.*", "customers.*", "suppliers.*",
    "purchase_orders.*", "sales.*", "orders.*", "financial.*",
    "invoices.*", "payments.*", "expenses.*", "reports.*",
    "settings.*", "dashboard.view"
  ]
}
```

### Manager
```json
{
  "role": "MANAGER",
  "permissions": [
    "dashboard.view",
    "users.view", "users.list", "users.create", "users.update",
    "branches.view", "branches.list",
    "products.*", "inventory.*", "customers.*", "suppliers.*",
    "purchase_orders.*", "sales.*", "orders.*",
    "tables.*", "floor_plan.view", "kitchen.view", "servers.*",
    "reports.view", "reports.list", "reports.export",
    "financial.view"
  ]
}
```

### Cashier
```json
{
  "role": "CASHIER",
  "permissions": [
    "dashboard.view",
    "pos.*", "sales.create", "sales.view",
    "products.view", "products.list",
    "customers.view", "customers.list", "customers.create",
    "inventory.view",
    "payments.create"
  ]
}
```

### Server (Restaurant)
```json
{
  "role": "SERVER",
  "permissions": [
    "dashboard.view",
    "orders.*", "tables.view", "tables.update", "tables.assign",
    "floor_plan.view", "kitchen.view",
    "products.view", "products.list",
    "customers.view", "customers.create"
  ]
}
```

### Chef (Restaurant)
```json
{
  "role": "CHEF",
  "permissions": [
    "dashboard.view",
    "kitchen.*",
    "orders.view", "orders.update", "orders.complete",
    "recipes.view", "recipes.list",
    "inventory.view"
  ]
}
```

### Instructor (Yoga)
```json
{
  "role": "INSTRUCTOR",
  "permissions": [
    "dashboard.view",
    "bookings.view", "bookings.list", "bookings.checkin",
    "customers.view", "customers.list",
    "reports.view"
  ]
}
```

### Receptionist (Yoga)
```json
{
  "role": "RECEPTIONIST",
  "permissions": [
    "dashboard.view",
    "bookings.*",
    "customers.*",
    "payments.create", "payments.view",
    "pos.access", "sales.create"
  ]
}
```

### Viewer/Analyst
```json
{
  "role": "VIEWER",
  "permissions": [
    "dashboard.view",
    "reports.*", "analytics.*",
    "users.view", "users.list",
    "products.view", "products.list",
    "inventory.view", "inventory.list",
    "sales.view", "sales.list",
    "orders.view", "orders.list",
    "financial.view"
  ]
}
```

### Staff (General)
```json
{
  "role": "STAFF",
  "permissions": [
    "dashboard.view",
    "products.view", "products.list",
    "inventory.view", "inventory.list",
    "customers.view", "customers.list"
  ]
}
```

---

## Total Permissions Count

**By Category:**
- User Management: 7 permissions
- Role Management: 7 permissions
- Permission Management: 7 permissions
- Branch Management: 7 permissions
- Product Management: 7 permissions
- Inventory Management: 7 permissions
- POS: 6 permissions
- Sales: 7 permissions
- Customer Management: 7 permissions
- Supplier Management: 6 permissions
- Purchase Orders: 8 permissions
- Orders (Restaurant): 8 permissions
- Recipes (Restaurant): 6 permissions
- Tables (Restaurant): 7 permissions
- Floor Plan (Restaurant): 4 permissions
- Kitchen (Restaurant): 4 permissions
- Servers (Restaurant): 4 permissions
- QR Ordering (Restaurant): 3 permissions
- Bookings (Yoga): 7 permissions
- Financial: 3 permissions
- Invoices: 7 permissions
- Payments: 7 permissions
- Expenses: 7 permissions
- Reports: 5 permissions
- Analytics: 3 permissions
- Settings: 4 permissions
- Dashboard: 2 permissions
- System Administration: 5 permissions
- Wildcard: 1 permission

**Total: ~150+ unique permissions**

---

## Backend Seeding Notes

1. **Store permission code as unique identifier** (e.g., `users.view`)
2. **Store display name** (e.g., "View User")
3. **Store description** for admin UI
4. **Group by resource** for better organization
5. **Mark wildcards** (`*`, `users.*`, etc.) as special types
6. **Consider hierarchy**: `users.*` should include all `users.{action}` permissions
7. **Add timestamps**: createdAt, updatedAt
8. **Add metadata**: category, resource, action fields

### Sample Database Schema

```sql
CREATE TABLE permissions (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  category VARCHAR(50),
  is_wildcard BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Sample Seed Record

```json
{
  "id": "perm-001",
  "code": "users.view",
  "name": "View User",
  "description": "View individual user details",
  "resource": "users",
  "action": "view",
  "category": "User Management",
  "is_wildcard": false
}
```

---

## API Endpoints Reference

These permissions map to the following API functionality:

- User permissions → `/api/v1/users/*`
- Role permissions → `/api/v1/roles/*`
- Permission permissions → `/api/v1/permissions/*`
- Branch permissions → `/api/v1/branches/*`
- Product permissions → `/api/v1/products/*`
- Inventory permissions → `/api/v1/inventory/*`
- Order permissions → `/api/v1/orders/*`
- etc.

Use this list to implement backend authorization middleware that checks user permissions before allowing API access.

---

## Common Issues & Solutions

### Issue: User has permissions but routes not accessible

**Example User Data:**
```json
{
  "id": "user-123",
  "username": "vithiya",
  "email": "vithiya@gmail.com",
  "roles": ["user_management"],
  "permissions": [
    "users:read",
    "users:create",
    "users:update",
    "users:delete",
    "users:view",
    "users:list",
    "users:manage"
  ]
}
```

**Problem**: User has permissions but can't access `/users` route.

**Solutions**:

1. **Permission Format**: Frontend accepts both `:` and `.` separators
   - ✅ `users:view` will work (auto-normalized to `users.view`)
   - ✅ `users.view` will work
   - ✅ `users:read` will work (alternative name for view)
   - ✅ `users:manage` will work (comprehensive permission)

2. **Direct Permissions**: Make sure permissions are in `user.permissions` array
   - The frontend now reads from **both** `user.permissions` and `user.roles[].permissions`

3. **Permission Guards**: Check if guards are enabled
   - Go to Settings → Security & Access
   - If disabled, all routes show (testing mode)
   - If enabled, permissions are enforced

4. **Permission Variations**: Use any of these equivalent formats:
   ```
   users.view    = users:view = users.read  = users:read
   users.create  = users:create = users.write = users:write
   users.update  = users:update = users.edit  = users:edit
   users.delete  = users:delete = users.remove = users:remove
   users.list    = users:list = users.index = users:index
   users.manage  = users:manage (includes all above)
   users.*       = users:* (wildcard - all permissions)
   ```

### Recommended Backend Implementation

**Store in Database:**
```json
{
  "code": "users.view",
  "alternatives": ["users:view", "users.read", "users:read"]
}
```

**Or simply use the dot format:**
```json
{
  "code": "users.view"
}
```

The frontend will automatically handle the conversion!
