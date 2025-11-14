# Sidebar Navigation - Permission Mapping

This document shows exactly which permissions control the visibility of each sidebar menu item.

## How It Works

The sidebar filters menu items in **two steps**:

1. **Business Type Filter**: Checks if the item matches current business type (Yoga/Restaurant)
2. **Permission Filter**: Uses `canAccessRoute(item.path)` to check if user has ANY of the required permissions

**Logic**: User needs **at least ONE** of the listed permissions to see a menu item (ANY logic, not ALL).

---

## Sidebar Menu Items & Required Permissions

### ✅ Always Visible (No Permissions Required)

| Menu Item | Path | Permissions |
|-----------|------|-------------|
| **Dashboard** | `/dashboard` | None - Accessible to all authenticated users |

---

### 🏢 Branch Management

| Menu Item | Path | Permissions (Need ANY) |
|-----------|------|------------------------|
| **Branches** | `/branches` | `branches.view` OR `branches.list` OR `branches.create` OR `branches.update` OR `branches.delete` OR `branches.*` |

---

### 👥 User & Role Management

| Menu Item | Path | Permissions (Need ANY) |
|-----------|------|------------------------|
| **Users** | `/users` | `users.view` OR `users.list` OR `users.create` OR `users.update` OR `users.delete` OR `users.*` |
| **Roles** | `/roles` | `roles.view` OR `roles.list` OR `roles.create` OR `roles.update` OR `roles.delete` OR `roles.*` |
| **Permissions** | `/permissions` | `permissions.view` OR `permissions.list` OR `permissions.create` OR `permissions.update` OR `permissions.delete` OR `permissions.*` |

---

### 🛍️ Products & Inventory

| Menu Item | Path | Permissions (Need ANY) |
|-----------|------|------------------------|
| **Products** | `/products` | `products.view` OR `products.list` OR `products.create` OR `products.update` OR `products.delete` OR `products.*` |
| **Inventory** | `/inventory` | `inventory.view` OR `inventory.list` OR `inventory.create` OR `inventory.update` OR `inventory.delete` OR `inventory.*` |

---

### 🍽️ Restaurant Features (Only visible when Business Type = Restaurant)

| Menu Item | Path | Permissions (Need ANY) |
|-----------|------|------------------------|
| **Recipes** | `/recipes` | `recipes.view` OR `recipes.list` |
| **Orders Dashboard** | `/orders-dashboard` | `orders.view` OR `orders.list` |
| **Restaurant Orders** | `/orders` | `orders.view` OR `orders.list` |
| **Tables** | `/tables` | `tables.view` OR `tables.list` |
| **Floor Plan** | `/floor-plan` | `tables.view` OR `floor_plan.view` |
| **Kitchen Display** | `/kitchen-display` | `kitchen.view` OR `orders.view` |
| **Server Management** | `/server-management` | `servers.view` OR `servers.manage` |

---

### 🧘 Yoga Features (Only visible when Business Type = Yoga)

| Menu Item | Path | Permissions (Need ANY) |
|-----------|------|------------------------|
| **Bookings** | `/bookings` | `bookings.view` OR `bookings.list` |

---

### 💰 Point of Sale

| Menu Item | Path | Permissions (Need ANY) |
|-----------|------|------------------------|
| **POS** | `/pos` | `pos.access` OR `sales.create` |

---

### 👤 Customer Management

| Menu Item | Path | Permissions (Need ANY) |
|-----------|------|------------------------|
| **Customers** | `/customers` | `customers.view` OR `customers.list` |

---

### 📦 Procurement

| Menu Item | Path | Permissions (Need ANY) |
|-----------|------|------------------------|
| **Suppliers** | `/suppliers` | `suppliers.view` OR `suppliers.list` |
| **Purchase Orders** | `/purchase-orders` | `purchase_orders.view` OR `purchase_orders.list` |

---

### 💵 Financial Management

| Menu Item | Path | Permissions (Need ANY) |
|-----------|------|------------------------|
| **Financial** | `/financial` | `financial.view` OR `reports.view` |

---

### 📊 Reports

| Menu Item | Path | Permissions (Need ANY) |
|-----------|------|------------------------|
| **Reports** | `/reports` | `reports.view` OR `reports.list` |

---

### ⚙️ Settings

| Menu Item | Path | Permissions (Need ANY) |
|-----------|------|------------------------|
| **Settings** | `/settings` | `settings.view` OR `settings.manage` |

---

## Common Permission Patterns

### Wildcard Permissions
If a user has a wildcard permission, they automatically get access to all related routes:
- `users.*` → Access to all user-related pages
- `products.*` → Access to all product-related pages
- `orders.*` → Access to all order-related pages

### Admin/Super Admin
If a user has the `*` permission (wildcard for everything), they see ALL menu items regardless of specific permissions.

---

## Examples

### Example 1: User with Limited Permissions
**User Permissions**: `users.create`, `users.update`

**Visible Menu Items**:
- ✅ Dashboard (always visible)
- ✅ Users (has `users.create` - one of the required permissions)

**Hidden Menu Items**:
- ❌ Branches (no branch permissions)
- ❌ Roles (no role permissions)
- ❌ Products (no product permissions)
- etc.

---

### Example 2: Manager Role
**User Permissions**: `users.*`, `products.*`, `inventory.*`, `orders.*`

**Visible Menu Items**:
- ✅ Dashboard
- ✅ Users (has `users.*`)
- ✅ Products (has `products.*`)
- ✅ Inventory (has `inventory.*`)
- ✅ Orders (if restaurant business type)
- etc.

**Hidden Menu Items**:
- ❌ Roles (no role permissions)
- ❌ Permissions (no permission permissions)
- ❌ Settings (no settings permissions)

---

### Example 3: Cashier Role
**User Permissions**: `pos.access`, `sales.create`, `products.view`, `customers.view`

**Visible Menu Items**:
- ✅ Dashboard
- ✅ POS (has `pos.access`)
- ✅ Products (has `products.view`)
- ✅ Customers (has `customers.view`)

**Hidden Menu Items**:
- ❌ Users (no user permissions)
- ❌ Inventory (only has view for products, not inventory)
- ❌ Financial (no financial permissions)
- etc.

---

## Code Reference

### Sidebar Filter Logic
Location: `src/components/navigation/Sidebar.jsx` (lines 72-84)

```javascript
const visibleNavigationItems = navigationItems.filter((item) => {
  // Check business type filter
  if (item.businessType && item.businessType !== businessType) {
    return false;
  }

  // Check permission-based access
  if (!canAccessRoute(item.path)) {
    return false;
  }

  return true;
});
```

### Permission Check Logic
Location: `src/hooks/usePermissions.js`

```javascript
const canAccessRoute = (routePath) => {
  // If guards are disabled, allow access
  if (!enablePermissionGuards) return true;

  // Find required permissions for this route
  let requiredPerms = ROUTE_PERMISSIONS[routePath];

  // No permissions required for this route
  if (!requiredPerms) return true;

  // Check if user has ANY of the required permissions
  return hasPermission(requiredPerms, false); // false = ANY logic
};
```

---

## Testing Sidebar Visibility

### Step 1: Enable Permission Guards
1. Go to **Settings** → **Security & Access**
2. Toggle **Permission-Based Route Guards** to ON

### Step 2: Test Different User Roles
1. Create test users with specific permissions
2. Login as each user
3. Observe which menu items are visible

### Step 3: Verify Permission Logic
1. User with `users.create` SHOULD see "Users" menu
2. User with `products.view` SHOULD see "Products" menu
3. User with NO user permissions should NOT see "Users" menu
4. Admin with `*` permission SHOULD see ALL menu items

---

## Troubleshooting

### Menu Item Not Showing

**Check 1: Guards Enabled?**
- Go to Settings → Security & Access
- Is "Permission-Based Route Guards" enabled?
- If disabled, all items show (testing mode)

**Check 2: User Permissions**
- Check user's roles in the database
- Verify role has the required permissions
- Use Security Settings page to view current user's permissions

**Check 3: Business Type**
- Restaurant-specific items only show in Restaurant mode
- Yoga-specific items only show in Yoga mode
- Check Settings → Business Type

**Check 4: Permission Format**
- Permissions use format: `resource.action`
- Check for typos: `users.view` not `user.view`
- Check wildcard: `users.*` works for all user actions

### Menu Item Showing When It Shouldn't

**Check 1: Wildcard Permissions**
- User might have `resource.*` permission
- User might have `*` permission (admin)

**Check 2: Guards Disabled**
- Check if guards are disabled in Settings
- If disabled, all items show for testing

**Check 3: Multiple Roles**
- User might have multiple roles
- Check ALL roles for the permission
- System combines permissions from all roles

---

## Summary

The sidebar uses a **simple and flexible** permission system:

1. ✅ Each menu item maps to a route
2. ✅ Each route has a list of acceptable permissions
3. ✅ User needs **ANY ONE** permission from the list
4. ✅ Wildcard (`*`) permissions grant access automatically
5. ✅ Guards can be toggled for testing
6. ✅ Business type filters apply first

This ensures users only see menu items they can actually use!
