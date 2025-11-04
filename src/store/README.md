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
- **Auth**: User authentication, tokens
- **UI**: Theme, modals, sidebar, notifications
- **Settings**: App settings and preferences
- Persisted in `localStorage`

### Cart Store (`useCartStore`)
- **Cart**: POS cart items, customer, discounts, calculations
- Persisted in `sessionStorage` (cleared on browser close)

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

## Best Practices

1. **Use selectors** for accessing state to optimize re-renders
2. **Keep actions simple** - complex logic should be in services
3. **Persist wisely** - only persist what's necessary
4. **Use cart store for session data** - use main store for permanent data
5. **Computed values** - use getter functions for derived state

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
