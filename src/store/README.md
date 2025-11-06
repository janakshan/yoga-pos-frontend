# Store Documentation

This directory contains the centralized state management setup using Zustand.

## Structure

```
store/
├── middleware/        # Custom middleware for Zustand
│   ├── persist.js    # Persistence middleware (localStorage/sessionStorage)
│   ├── devtools.js   # Redux DevTools integration
│   ├── immer.js      # Immer for immutable updates
│   └── index.js      # Middleware exports
├── slices/           # State slices for different features
│   ├── authSlice.js      # Authentication state
│   ├── cartSlice.js      # Shopping cart state
│   ├── uiSlice.js        # UI state (modals, sidebar, theme)
│   ├── settingsSlice.js  # Application settings
│   └── index.js          # Slice exports
├── selectors/        # Optimized state selectors
│   ├── authSelectors.js
│   ├── cartSelectors.js
│   ├── uiSelectors.js
│   ├── settingsSelectors.js
│   └── index.js
└── index.js          # Main store configuration
```

## Usage

### Basic Usage

```javascript
import { useStore } from '@/store';

function MyComponent() {
  // Get state
  const user = useStore((state) => state.user);
  const items = useStore((state) => state.items);

  // Get actions
  const login = useStore((state) => state.login);
  const addItem = useStore((state) => state.addItem);

  return <div>...</div>;
}
```

### Using Selectors

```javascript
import { useStore, selectUser, selectCartTotal } from '@/store';

function MyComponent() {
  const user = useStore(selectUser);
  const total = useStore(selectCartTotal);

  return <div>...</div>;
}
```

### Cart Store (Session-based)

```javascript
import { useCartStore } from '@/store';

function Cart() {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const total = useCartStore((state) => state.getTotal());

  return <div>...</div>;
}
```

## Available Stores

### Main Store (`useStore`)
The main store persists in `localStorage` and includes these slices:

#### Authentication & User Management
- **authSlice** - User authentication, tokens, session management
- **userSlice** - User accounts, staff profiles
- **roleSlice** - Role management and assignments
- **permissionSlice** - Permission management and access control
- **sessionSlice** - Session tracking and concurrent user management
- **auditSlice** - Audit logs and activity tracking

#### Business Operations
- **productSlice** - Product catalog, variants, bundles, pricing
- **inventorySlice** - Stock levels, transactions, alerts
- **customerSlice** - Customer records, loyalty, segments
- **posSlice** - POS configuration and statistics
- **branchSlice** - Multi-location management
- **supplierSlice** - Supplier management
- **purchaseOrderSlice** - Purchase order tracking

#### Financial Management
- **invoiceSlice** - Invoice management and tracking
- **paymentSlice** - Payment processing and history
- **expenseSlice** - Expense recording and tracking
- **transactionSlice** - Financial transaction management
- **financialSlice** - Financial summaries and statistics

#### System & Configuration
- **settingsSlice** - App settings (currency, language, hardware, branding, tax)
- **uiSlice** - UI state (theme, modals, sidebar, notifications)
- **notificationSlice** - Notification preferences and history
- **backupSlice** - Backup settings, history, and status
- **reportSlice** - Report data and configurations

### Cart Store (`useCartStore`)
- **cartSlice** - POS cart items, customer, discounts, calculations
- Persisted in `sessionStorage` (cleared on browser close)
- Isolated from main store for better performance

## Middleware

### Immer
Allows writing mutable code that produces immutable updates:
```javascript
set((state) => {
  state.user.name = 'John'; // Direct mutation
});
```

### Persist
Automatically saves state to localStorage/sessionStorage:
- Main store: localStorage (persists across sessions)
- Cart store: sessionStorage (cleared on browser close)

### DevTools
Redux DevTools integration (dev mode only):
- Time-travel debugging
- Action inspection
- State snapshots

## Store State Organization

### localStorage Persistence (Main Store)
Data that needs to survive browser restarts:
- User authentication and preferences
- Product catalog and inventory
- Customer database
- Financial records (invoices, payments, expenses)
- Audit logs and session history
- Application settings and configuration
- Branch and user management data

### sessionStorage Persistence (Cart Store)
Data that should reset on browser close:
- Current shopping cart
- POS checkout state
- Temporary transaction data

## New Features in State Management

### Notification System
```javascript
const {
  notifications,
  notificationStats,
  notificationPreferences,
  updateNotificationPreferences,
  addNotification
} = useStore();

// Tracks notification history, delivery status, and preferences
```

### Backup System
```javascript
const {
  backups,
  backupSettings,
  backupStatus,
  updateBackupSettings,
  addBackup,
  setBackupStatus
} = useStore();

// Manages backup history (last 50), cloud settings, and auto-backup configuration
```

### Audit Logging
```javascript
const {
  auditLogs,
  auditStats,
  setAuditLogs,
  addAuditLog,
  getAuditLogsByUser
} = useStore();

// Comprehensive activity tracking with 40+ event types
```

### Session Management
```javascript
const {
  sessions,
  currentSession,
  sessionStats,
  addSession,
  updateSession,
  terminateSession
} = useStore();

// Tracks concurrent users and session activity
```

## Best Practices

1. **Use selectors** for accessing state to optimize re-renders
2. **Keep actions simple** - complex logic should be in services
3. **Persist wisely** - only persist what's necessary
4. **Use cart store for session data** - use main store for permanent data
5. **Computed values** - use getter functions for derived state
6. **Audit sensitive operations** - log all security-relevant actions
7. **Session tracking** - track user activity for security and analytics
8. **Backup regularly** - ensure data persistence with automated backups

## Examples

### Authentication
```javascript
const { user, login, logout } = useStore((state) => ({
  user: state.user,
  login: state.login,
  logout: state.logout,
}));

// Login
login(userData, token, refreshToken);

// Logout
logout();
```

### Cart Operations
```javascript
const { items, addItem, clearCart, getTotal } = useCartStore((state) => ({
  items: state.items,
  addItem: state.addItem,
  clearCart: state.clearCart,
  getTotal: state.getTotal,
}));

// Add item
addItem(product);

// Get totals
const total = getTotal();
```

### UI State
```javascript
const { theme, toggleTheme, openModal } = useStore((state) => ({
  theme: state.theme,
  toggleTheme: state.toggleTheme,
  openModal: state.openModal,
}));

// Toggle theme
toggleTheme();

// Open modal
openModal('payment', { amount: 100 });
```

### Financial Operations
```javascript
const {
  invoices,
  invoiceStats,
  addInvoice,
  updateInvoice,
  getInvoiceById,
  getOverdueInvoices
} = useStore((state) => ({
  invoices: state.invoices,
  invoiceStats: state.invoiceStats,
  addInvoice: state.addInvoice,
  updateInvoice: state.updateInvoice,
  getInvoiceById: state.getInvoiceById,
  getOverdueInvoices: state.getOverdueInvoices,
}));

// Create invoice
addInvoice({
  customerId: '1',
  items: [...],
  total: 100.00
});

// Get overdue invoices
const overdue = getOverdueInvoices();
```

### Settings Management
```javascript
const {
  settings,
  currency,
  language,
  updateSettings,
  updateCurrency,
  updateLanguage
} = useStore((state) => ({
  settings: state.settings,
  currency: state.currency,
  language: state.language,
  updateSettings: state.updateSettings,
  updateCurrency: state.updateCurrency,
  updateLanguage: state.updateLanguage,
}));

// Update currency
updateCurrency('USD');

// Update language
updateLanguage('es');

// Update hardware settings
updateSettings({
  hardware: {
    receiptPrinter: {
      enabled: true,
      connection: 'usb'
    }
  }
});
```

## Store Statistics

Total state slices: **24+**
- Authentication & Security: 6 slices
- Business Operations: 7 slices
- Financial Management: 5 slices
- System & Configuration: 6+ slices

Persisted data size: Typically 5-20 MB (depends on transaction volume)
Session data size: Typically 50-500 KB

## Version History

- **v2.0** (2025-11-06) - Added notification, backup, audit, and session management slices
- **v1.5** (2025-10-15) - Added financial management slices
- **v1.0** (2024-11-04) - Initial store setup with core slices

---

**Last Updated**: 2025-11-06
