# Yoga POS Frontend - Codebase Architecture Overview

## Executive Summary

This is a **React 18** application built with **Vite** using a **feature-based architecture**. It's a comprehensive POS (Point of Sale) system designed for restaurants and studios with multi-location, multi-user support, and extensive hardware integration capabilities.

---

## 1. PROJECT TECHNOLOGY STACK

### Frontend Framework
- **React 18.3.1** - Modern UI library with hooks
- **Vite 6** - Lightning-fast build tool with HMR (Hot Module Replacement)
- **React Router v7** - Client-side routing
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Lucide React** - Modern SVG icons
- **Heroicons** - Polished hand-crafted SVG icons

### State Management
- **Zustand 5.0.8** - Lightweight, performant state management
- **Immer 10.2** - Immutable state updates with draft pattern
- **zustand-persist** - LocalStorage persistence with serialization

### Data Fetching & Real-Time
- **Axios 1.13.2** - HTTP client with interceptors
- **React Query (@tanstack) 5.90.6** - Server state management (available but not heavily used in favor of custom hooks)
- **Socket.io-client 4.8.1** - Real-time bidirectional communication

### Internationalization & Localization
- **i18next 25.6.0** - Multi-language framework
- **react-i18next 16.2.4** - React integration
- **i18next-http-backend** - Language file loading
- **Supported: English, Spanish, French + 8+ currencies**

### Utilities & Libraries
- **date-fns 4.1.0** - Date manipulation
- **clsx 2.1.1** - Conditional className utility
- **qrcode 1.5.4** - QR code generation
- **react-hot-toast 2.6.0** - Toast notifications
- **vite-plugin-pwa** - Progressive Web App support

### Dev Tools
- **ESLint 9.17** - Code linting
- **Tailwind CSS PostCSS** - CSS processing

---

## 2. PROJECT STRUCTURE

### Root Level Directory Map

```
yoga-pos-frontend/
├── src/                           # Source code
│   ├── features/                  # Feature modules (domain-driven)
│   ├── components/                # Shared/reusable components
│   ├── layouts/                   # Page layout components
│   ├── pages/                     # Page-level components
│   ├── hooks/                     # Custom React hooks
│   ├── services/                  # Business logic & API services
│   ├── store/                     # Zustand state management
│   ├── types/                     # Type definitions
│   ├── utils/                     # Utility functions
│   ├── constants/                 # Application constants
│   ├── config/                    # Configuration files
│   ├── lib/                       # Library setup (axios, tokenStorage)
│   ├── styles/                    # Global styles
│   ├── i18n/                      # Internationalization
│   ├── assets/                    # Static assets
│   └── App.jsx                    # Root component
├── public/                        # Static files
├── .env, .env.example             # Environment variables
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind configuration
├── package.json                   # Dependencies
└── [Documentation files]          # Guides (README, FOLDER_STRUCTURE, etc.)
```

---

## 3. FEATURE-BASED ARCHITECTURE

The application follows a **feature-based architecture** where each major business domain is a self-contained module.

### Available Features Structure

Each feature follows this pattern:

```
feature-name/
├── components/          # Feature UI components
├── hooks/              # Feature-specific custom hooks
├── services/           # API calls & business logic
├── store/              # Zustand state slice
├── types/              # TypeScript type definitions
├── utils/              # Feature utilities
└── index.js            # Public API exports
```

### Core Features

| Feature | Location | Purpose |
|---------|----------|---------|
| **auth** | `src/features/auth/` | Login, PIN auth, roles, permissions |
| **dashboard** | `src/features/dashboard/` | Analytics, business metrics |
| **pos** | `src/features/pos/` | Point of sale, checkout, payments |
| **products** | `src/features/products/` | Menu, variants, bundles, pricing |
| **customers** | `src/features/customers/` | CRM, loyalty, store credit |
| **inventory** | `src/features/inventory/` | Stock tracking, transfers, counting |
| **restaurant-orders** | `src/features/restaurant-orders/` | Order management, tracking |
| **kitchen-display** | `src/features/kitchen-display/` | Kitchen Display System (KDS) |
| **recipes** | `src/features/recipes/` | Recipe management, costing |
| **financial** | `src/features/financial/` | Invoices, payments, expenses |
| **purchase** | `src/features/purchase/` | Purchase orders, suppliers |
| **qr-ordering** | `src/features/qr-ordering/` | QR-based customer ordering |
| **restaurant** | `src/features/restaurant/` | Tables, floor plans, reservations |
| **users** | `src/features/users/` | User management, profiles |
| **roles** | `src/features/roles/` | Role definitions, permissions |
| **settings** | `src/features/settings/` | App settings, hardware config |
| **branch** | `src/features/branch/` | Multi-location management |
| **session** | `src/features/session/` | Session tracking, user activity |
| **audit** | `src/features/audit/` | Activity logging, compliance |
| **reports** | `src/features/reports/` | Analytics, reporting |

---

## 4. STATE MANAGEMENT ARCHITECTURE

### Zustand Store Location
**File**: `/src/store/index.js`

### Key Characteristics
- **Centralized Store**: All features register their state slices in the main store
- **Middleware Stack**:
  1. **Immer middleware** - Enables immutable-style updates with mutable syntax
  2. **Persist middleware** - Automatically saves state to localStorage
  3. **DevTools middleware** - Redux DevTools integration for debugging

### State Persistence
```javascript
// Persisted slices (saved to localStorage):
- User & authentication (user, token, refreshToken)
- UI preferences (sidebar collapse state)
- Settings (all application settings)
- Cart state
- Backup settings
```

### Usage Pattern
```javascript
import { useStore } from '@/store';

// Usage in components
const user = useStore((state) => state.user);
const { setUser } = useStore();
```

---

## 5. API INTEGRATION & DATA FETCHING

### API Client Configuration
**File**: `/src/lib/axios.js`

#### Features:
- **Base URL**: Configured via `VITE_API_BASE_URL` environment variable
- **Timeout**: 30 seconds default
- **Request Interceptor**: Automatically attaches Bearer token to requests
- **Response Interceptor**: 
  - Handles 401 Unauthorized (token refresh)
  - Automatic retry with new token
  - Fallback to login on auth failure

### Service Layer Pattern
**Location**: `/src/services/` and `feature/services/`

Example: Kitchen Service (`/src/features/kitchen-display/services/kitchenService.js`)
```javascript
export const kitchenService = {
  async getActiveKitchenOrders() { ... },
  async updateItemStatus(orderId, itemId, status) { ... },
  async markOrderReady(orderId) { ... },
  async printOrder(orderId, stationId) { ... },
  // ... more methods
}
```

---

## 6. EXISTING HARDWARE INTEGRATION

### Current Hardware Services
**Location**: `/src/services/hardware/`

#### 1. **Receipt Printer Service** (`printerService.js`)
- **Supported Connections**: USB, Network (HTTP/TCP), Bluetooth
- **Protocol**: ESC/POS (standard thermal printer format)
- **Features**:
  - PDF/HTML fallback if hardware unavailable
  - Paper cutting and cash drawer opening
  - Custom receipt formatting
  - Test printing capability
  - Multi-printer support

#### 2. **Cash Drawer Service** (`cashDrawerService.js`)
- Opens/closes cash drawer
- Status monitoring
- Integration with POS system

#### 3. **Barcode Scanner Service** (`scannerService.js`)
- Barcode reading
- Product lookup
- Real-time scanning input handling

#### 4. **Customer Display Service** (`customerDisplayService.js`)
- External display connectivity
- Order total display
- Customer-facing information

### Hardware Export Index
**File**: `/src/services/hardware/index.js`
```javascript
export { printerService, scannerService, cashDrawerService, customerDisplayService };
```

---

## 7. KITCHEN DISPLAY SYSTEM (KDS) - EXISTING IMPLEMENTATION

### Current KDS Structure
**Location**: `/src/features/kitchen-display/`

#### Components
- **KitchenDisplay.jsx** - Main KDS interface (11KB)
- **OrderCard.jsx** - Order display card (10KB)
- **OrderTimer.jsx** - Real-time timer with aging colors
- **StationSelector.jsx** - Station filtering UI
- **PerformanceMetrics.jsx** - Performance stats dashboard

#### Services
1. **kitchenService.js** - API integration for:
   - Fetching active kitchen orders
   - Updating item status
   - Marking orders ready
   - Getting performance metrics
   - Station management
   - Order prioritization

2. **printerService.js** - Kitchen printer specific operations:
   - Print order tickets
   - Reprint functionality

#### State Management
**File**: `/src/features/kitchen-display/store/kitchenDisplaySlice.js`

Manages:
- Station configurations (6 default stations: Hot Kitchen, Cold Kitchen, Grill, Bar, Dessert, Prep)
- Active orders and filtering
- Display settings (grid/list/compact view)
- Sorting options (time, priority, table, course)
- Performance metrics
- Printer status
- Sound/notification settings
- Auto-refresh intervals

#### Types & Constants
**File**: `/src/features/kitchen-display/types/kitchen.types.js`

Defines:
- **KITCHEN_STATION** - Station types (hot_kitchen, cold_kitchen, grill, bar, dessert, prep)
- **ORDER_PRIORITY** - Priority levels (low, normal, high, urgent)
- **COURSE_TYPE** - Course types (appetizer, main, dessert, beverage)
- **ORDER_AGING_COLORS** - Visual color coding based on age
- **KDS_VIEW_MODE** - Display modes (grid, list, compact)
- **DEFAULT_STATIONS** - 6 pre-configured kitchen stations

#### Hook
**File**: `/src/features/kitchen-display/hooks/useKitchenDisplay.js`

Provides:
- Fetching kitchen orders with auto-refresh
- Starting order preparation
- Updating item status
- Marking orders ready/served
- Printing orders
- Real-time socket integration
- Performance metric fetching

---

## 8. RESTAURANT ORDERS MANAGEMENT

### Order Types & Constants
**File**: `/src/features/restaurant-orders/types/order.types.js`

#### Order Structure
```javascript
{
  id: string,
  orderNumber: string,  // "ORD-001"
  status: ORDER_STATUS,
  serviceType: SERVICE_TYPE,  // dine_in, takeaway, delivery, online
  tableId: string|null,
  tableName: string|null,
  customerId: string|null,
  items: OrderItem[],
  subtotal: number,
  tax: number,
  discount: number,
  total: number,
  assignedServerId: string|null,
  stationRoutes: string[],  // Kitchen stations
  statusHistory: OrderStatusHistory[],
  notes: string|null,
  createdAt: ISO_timestamp,
  updatedAt: ISO_timestamp,
  completedAt: ISO_timestamp|null,
  branchId: string,
  payment: PaymentInfo|null
}
```

#### Order Item Structure
```javascript
{
  id: string,
  productId: string,
  name: string,
  quantity: number,
  price: number,
  total: number,
  modifiers: OrderModifier[],
  notes: string|null,
  status: ITEM_STATUS,  // pending, preparing, ready, served
  stationId: string|null,
  stationName: string|null
}
```

#### Status Constants
- **ORDER_STATUS**: draft, pending, confirmed, preparing, ready, served, completed, cancelled, refunded
- **ITEM_STATUS**: pending, preparing, ready, served, cancelled
- **SERVICE_TYPE**: dine_in, takeaway, delivery, online
- **KITCHEN_STATION**: hot_kitchen, cold_kitchen, grill, bar, dessert, prep
- **PAYMENT_STATUS**: pending, paid, partial, refunded, failed

### Order Management Pages
**Location**: `/src/pages/restaurant-orders/`
- `OrdersList.jsx` - All orders view
- `OrderDetails.jsx` - Order detail page
- `NewOrder.jsx` - Create new order
- `OrdersDashboard.jsx` - Orders analytics

### Order Store
**Location**: `/src/features/restaurant-orders/store/orderSlice.js`

---

## 9. SETTINGS & CONFIGURATION

### Settings Feature
**Location**: `/src/features/settings/`

Manages:
- Hardware configuration (printers, scanners, cash drawers, displays)
- Multi-currency settings
- Multi-language preferences
- Business information
- Tax rules
- Notification preferences
- Backup settings

### Store Configuration
**File**: `/src/store/slices/settingsSlice.js`

### Environment Configuration
**File**: `/src/lib/axios.js`
- `VITE_API_BASE_URL` - Backend API endpoint
- `VITE_ENV` - Environment (development/production)
- `VITE_API_TIMEOUT` - Request timeout

---

## 10. ROUTING STRUCTURE

### Main Router
**File**: `/src/App.jsx`

#### Public Routes
- `/login` - Login page
- `/unauthorized` - 403 page
- `/customer-display` - Customer-facing display
- `/qr/:code` - QR ordering landing

#### Protected Routes (with MainLayout)
```
/dashboard              → Dashboard
/branches               → Branch management
/users                  → User management
/roles                  → Role management
/products               → Product catalog
/inventory              → Inventory tracking
/suppliers              → Supplier management
/purchase-orders        → PO management
/pos                    → Point of Sale
/pos/fast-checkout     → Quick checkout
/orders                 → Restaurant orders
/orders/new            → Create order
/orders/:orderId       → Order details
/orders-dashboard      → Orders analytics
/customers             → Customer management
/reports               → Reports & analytics
/tables                → Table management
/floor-plan            → Floor plan editor
/settings              → Application settings
/financial             → Financial dashboard
/qr-codes              → QR management
/qr-analytics          → QR analytics
/kitchen-display       → Kitchen Display System
/recipes               → Recipe management
/server-management     → Server management
```

---

## 11. COMPONENT ORGANIZATION

### Shared Components
**Location**: `/src/components/`

```
components/
├── common/           # Basic UI (Button, Input, Card, Modal)
├── forms/            # Form-related components
├── tables/           # Data tables and grids
├── modals/           # Modal dialogs
├── navigation/       # Navbar, Sidebar, Breadcrumbs
├── feedback/         # Toast, Alert, Spinner
├── dataDisplay/      # Charts, Stats, Badges
├── dashboard/        # Dashboard-specific
├── invoices/         # Invoice templates
├── receipts/         # Receipt formatting
└── reports/          # Report components
```

### Layout Components
**Location**: `/src/layouts/`
- **MainLayout** - With sidebar, header, and footer
- **AuthLayout** - For login/auth pages
- **POSLayout** - Specialized for POS interface

---

## 12. RECOMMENDED IMPLEMENTATION LOCATIONS FOR KITCHEN HARDWARE

Based on the current architecture, here's where to implement kitchen hardware features:

### 1. **Hardware Service Layer**
**Location**: `/src/services/hardware/`

Create new services:
- `kitchenDisplayService.js` - KDS-specific hardware operations
- `kitchenPrinterService.js` - Kitchen ticket printer control
- `kitchenKDSIntegrationService.js` - Integration layer

### 2. **KDS Feature Enhancement**
**Location**: `/src/features/kitchen-display/`

Add to existing structure:
- New components in `/components/` for hardware status displays
- New services in `/services/` for hardware-specific operations
- Extend the store slice for hardware state
- Add hooks for hardware operations

### 3. **Hardware Settings**
**Location**: `/src/features/settings/components/`

Create hardware configuration UI:
- Printer configuration page
- Display connection settings
- Kitchen hardware status monitoring

### 4. **Integration Points**

#### In KitchenDisplay Component
- Add hardware status indicators
- Trigger printer operations on order status changes
- Display connection status and health

#### In Store (useStore)
- Hardware state management
- Printer queue management
- Real-time hardware status updates

#### In Services
- Extend `kitchenService.js` with hardware-related APIs
- Create hardware-specific error handling

---

## 13. KEY PATTERNS & CONVENTIONS

### Custom Hooks Pattern
```javascript
// Location: feature/hooks/useFeature.js
export const useKitchenDisplay = () => {
  const store = useStore((state) => state.kitchenDisplay);
  const { setKitchenOrders, updateKitchenOrder } = useStore();
  // ... logic
  return { /* exposed interface */ };
};
```

### Service Pattern
```javascript
// Location: feature/services/featureService.js
export const featureService = {
  async fetchData() { },
  async updateData(id, data) { },
  // ... more methods
};
```

### Store Slice Pattern
```javascript
// Location: feature/store/featureSlice.js
export const createFeatureSlice = (set, get) => ({
  // Initial state
  featureState: { /* ... */ },
  
  // Actions
  setFeatureState: (value) => set(/* update */),
  updateFeatureItem: (id, data) => set(/* update */),
});
```

### Component Pattern
```javascript
// Location: feature/components/FeatureComponent.jsx
import { useFeature } from '../hooks/useFeature';

const FeatureComponent = () => {
  const { state, actions } = useFeature();
  return <div>{/* UI */}</div>;
};
```

---

## 14. SOCKET.IO REAL-TIME INTEGRATION

### Service Location
**File**: `/src/features/qr-ordering/services/socketService.js`

### Current Usage
- Kitchen Display System uses Socket.io for real-time order updates
- Connected via `socketService` in `useKitchenDisplay` hook
- Events for order creation, status updates, etc.

### For Kitchen Hardware
You'll want to:
1. Extend socket listener for hardware-related events
2. Add event emissions for hardware status changes
3. Implement real-time printer queue updates

---

## 15. AUTHENTICATION & PERMISSIONS

### Auth Feature
**Location**: `/src/features/auth/`

Manages:
- Login (email/PIN)
- Token management (access + refresh tokens)
- Role-Based Access Control (RBAC)
- User sessions

### Token Storage
**File**: `/src/lib/tokenStorage.js`

Handles:
- localStorage for access token
- Session token management
- Token refresh logic

### Protected Routes
Uses `ProtectedRoute` component that:
- Checks authentication status
- Verifies user permissions
- Redirects unauthorized users

---

## 16. SUMMARY: WHERE TO IMPLEMENT KITCHEN HARDWARE FEATURES

### For Kitchen Display Hardware Control:

1. **New Hardware Services**
   - `/src/services/hardware/kitchenDisplayService.js` - KDS display control
   - `/src/services/hardware/kitchenPrinterService.js` - Ticket printer control
   
2. **Extend Kitchen Display Feature**
   - Add components for hardware status in `/src/features/kitchen-display/components/`
   - Add hardware hooks in `/src/features/kitchen-display/hooks/`
   - Extend store slice with hardware state
   - Update services to integrate hardware

3. **Hardware Configuration UI**
   - Extend `/src/features/settings/` with hardware config pages
   - Create printer/display setup wizards

4. **Real-Time Updates**
   - Integrate with Socket.io for hardware status events
   - Add hardware health monitoring to dashboard

5. **Integration with Order Flow**
   - Trigger printer when orders reach "ready" status
   - Monitor printer queue and errors
   - Handle print failures gracefully with fallbacks

---

## QUICK COMMAND REFERENCE

```bash
# Development
npm run dev          # Start dev server at http://localhost:5173

# Building
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint

# Environment
# Edit .env to configure API_BASE_URL
```

---

## ARCHITECTURE STRENGTHS FOR KITCHEN HARDWARE

✓ **Feature-based isolation** - Kitchen hardware can be completely self-contained
✓ **Service layer pattern** - Clean API integration for hardware
✓ **Zustand store** - Lightweight state management for hardware status
✓ **Socket.io ready** - Real-time updates already in place
✓ **Centralized config** - Settings feature ready for hardware configuration
✓ **Existing hardware stubs** - Printer service already partially implemented
✓ **Modular components** - Easy to add hardware status indicators anywhere

