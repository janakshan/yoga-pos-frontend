# Project Folder Structure

This document explains the folder structure and organization of the Yoga POS Frontend application.

## Overview

This project follows a **feature-based architecture** combined with **separation of concerns** principles, making it scalable and maintainable for large applications.

## Root Structure

```
yoga-pos-frontend/
├── public/              # Static assets served directly
├── src/                 # Source code
└── [config files]       # Configuration files (vite, eslint, etc.)
```

## Source Code Structure (`src/`)

### 📁 `features/`
Feature-based modules following domain-driven design. Each feature is self-contained with its own components, hooks, services, and state management.

**Available Features:**
- **`auth/`** - Authentication & authorization (login, PIN login, password reset, token management)
- **`dashboard/`** - Main dashboard with analytics and business metrics
- **`pos/`** - Point of Sale (checkout, split payments, returns, hold sales, shift management)
- **`products/`** - Product management (CRUD, variants, bundles, pricing tiers, barcode generation)
- **`customers/`** - Customer/member management (CRM, loyalty, store credit, segments, notes)
- **`inventory/`** - Inventory management (stock levels, cycle counts, serial tracking, inter-branch transfers)
- **`financial/`** - Financial management (invoices, payments, expenses, cash flow, reports)
- **`reports/`** - Analytics and reporting (sales, inventory, financial, customer analytics)
- **`branch/`** - Multi-location/branch management (branch settings, performance tracking)
- **`users/`** - User management (staff profiles, user CRUD operations)
- **`roles/`** - Role management (role creation, assignment, hierarchies)
- **`permissions/`** - Permission management (fine-grained access control)
- **`audit/`** - Audit logging (comprehensive activity tracking, 40+ event types)
- **`session/`** - Session management (concurrent user tracking, session state)
- **`purchase/`** - Purchase orders and supplier management (PO lifecycle, receiving)
- **`pricing/`** - Pricing and promotions (tiered pricing, discounts, location-specific)
- **`settings/`** - Application settings (multi-currency, multi-language, branding, hardware)
- **`bookings/`** - Class bookings and scheduling (placeholder for future expansion)

**Each feature contains:**
```
feature/
├── components/      # Feature-specific components
├── hooks/          # Feature-specific custom hooks
├── services/       # Feature-specific API calls and business logic
├── types/          # Feature-specific TypeScript types/interfaces
├── utils/          # Feature-specific utility functions
├── store/          # Feature-specific state management
└── index.ts        # Public API of the feature
```

### 📁 `components/`
Shared/reusable components used across multiple features.

- **`common/`** - Generic UI components (Button, Input, Card, etc.)
- **`forms/`** - Form-related components (FormField, FormGroup, etc.)
- **`tables/`** - Table and data grid components
- **`modals/`** - Modal/dialog components
- **`navigation/`** - Navigation components (Navbar, Sidebar, Breadcrumbs)
- **`feedback/`** - User feedback components (Toast, Alert, Spinner)
- **`dataDisplay/`** - Data display components (Charts, Stats, Badges)

### 📁 `layouts/`
Page layout components that wrap pages and provide consistent structure.

- **`MainLayout/`** - Main application layout (with sidebar, header)
- **`AuthLayout/`** - Layout for authentication pages
- **`POSLayout/`** - Specialized layout for POS interface

### 📁 `pages/`
Page components corresponding to routes. Usually thin wrappers that compose features and components.

```
pages/
├── Dashboard.tsx
├── Login.tsx
├── Products.tsx
├── Customers.tsx
└── ...
```

### 📁 `hooks/`
Custom React hooks organized by functionality.

- **`useAuth/`** - Authentication-related hooks
- **`useApi/`** - API calling and data fetching hooks
- **`useForm/`** - Form handling hooks
- **`useTable/`** - Table/data grid hooks
- **`useModal/`** - Modal management hooks

### 📁 `services/`
Business logic and external service integration.

- **`api/`** - API client configuration and HTTP interceptors
- **`storage/`** - LocalStorage, SessionStorage utilities
- **`validation/`** - Validation schemas and rules
- **`notification/`** - Multi-channel notification service (Email, SMS, WhatsApp)
- **`backup/`** - Backup and recovery service (local and cloud backup, encryption)
- **`hardware/`** - Hardware integration (printer, cash drawer, scanner, customer display)
- **`analytics/`** - Analytics tracking and reporting service

### 📁 `store/`
Global state management using Zustand with persistence.

- **`slices/`** - State slices for different features:
  - `authSlice.js` - Authentication state
  - `cartSlice.js` - Shopping cart (session storage)
  - `settingsSlice.js` - App settings (currency, language, hardware, branding)
  - `notificationSlice.js` - Notification preferences and history
  - `backupSlice.js` - Backup settings and status
  - `uiSlice.js` - UI state (sidebar, modals, theme)
  - `branchSlice.js` - Branch management
  - `permissionSlice.js` - Permission management
  - `roleSlice.js` - Role management
  - `userSlice.js` - User management
  - `productSlice.js` - Product catalog
  - `inventorySlice.js` - Inventory state
  - `posSlice.js` - POS-specific state
  - `customerSlice.js` - Customer data
  - `reportSlice.js` - Report data
  - `supplierSlice.js` - Supplier data
  - `purchaseOrderSlice.js` - Purchase order data
  - `auditSlice.js` - Audit logs
  - `sessionSlice.js` - Session data
  - `invoiceSlice.js` - Invoice management
  - `paymentSlice.js` - Payment tracking
  - `expenseSlice.js` - Expense recording
  - `transactionSlice.js` - Transaction management
  - `financialSlice.js` - Financial summaries
- **`middleware/`** - Custom middleware (persist, devtools, immer)
- **`selectors/`** - Memoized selectors for optimized state access
- **`index.js`** - Store configuration and exports

### 📁 `types/`
Global TypeScript type definitions and interfaces.

```
types/
├── api.types.ts        # API request/response types
├── models.types.ts     # Domain model types
├── common.types.ts     # Common shared types
└── index.ts           # Type exports
```

### 📁 `utils/`
Utility functions and helpers used throughout the application.

```
utils/
├── formatters.ts      # Date, currency, text formatters
├── validators.ts      # Validation functions
├── helpers.ts         # General helper functions
├── constants.ts       # Application constants
└── index.ts          # Utility exports
```

### 📁 `constants/`
Application-wide constants and configuration values.

```
constants/
├── routes.ts          # Route paths
├── apiEndpoints.ts    # API endpoints
├── appConfig.ts       # App configuration
└── index.ts          # Constant exports
```

### 📁 `styles/`
Global styles, theme configuration, and style utilities.

```
styles/
├── global.css         # Global CSS styles
├── variables.css      # CSS variables
├── theme.ts          # Theme configuration
└── mixins.css        # Reusable CSS mixins
```

### 📁 `config/`
Application configuration files.

```
config/
├── env.ts            # Environment variables
├── routes.ts         # Route configuration
└── app.config.ts     # General app config
```

### 📁 `lib/`
External library configurations and wrappers.

```
lib/
├── axios.ts          # Axios configuration
├── reactQuery.ts     # React Query setup
└── errorBoundary.ts  # Error boundary setup
```

### 📁 `test/`
Testing utilities and shared test resources.

- **`mocks/`** - Mock data and functions
- **`fixtures/`** - Test fixtures
- **`helpers/`** - Test helper functions
- **`__tests__/`** - Integration tests

### 📁 `assets/`
Static assets like images, icons, fonts, and videos.

- **`images/`** - Image files
- **`icons/`** - Icon files (SVG, PNG)
- **`fonts/`** - Custom fonts
- **`videos/`** - Video files

## Best Practices

### 1. **Feature Isolation**
Each feature should be self-contained and not directly import from other features. Use the public API (index.ts) for cross-feature communication.

### 2. **Component Organization**
- Keep components small and focused (Single Responsibility Principle)
- Place feature-specific components in the feature folder
- Place reusable components in the shared components folder

### 3. **File Naming Conventions**
- **Components**: PascalCase (e.g., `UserProfile.tsx`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- **Utils**: camelCase (e.g., `formatCurrency.ts`)
- **Types**: PascalCase with '.types' suffix (e.g., `User.types.ts`)
- **Constants**: UPPER_SNAKE_CASE or camelCase (e.g., `API_ENDPOINTS.ts`)

### 4. **Import Order**
```typescript
// 1. External libraries
import React from 'react';
import { useQuery } from 'react-query';

// 2. Internal modules (absolute imports)
import { Button } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';

// 3. Relative imports
import { ProductCard } from './ProductCard';
import styles from './Products.module.css';

// 4. Types
import type { Product } from '@/types';
```

### 5. **Index Files**
Each major folder should have an `index.ts` that exports its public API, making imports cleaner:

```typescript
// Instead of:
import { UserList } from '@/features/customers/components/UserList';

// Use:
import { UserList } from '@/features/customers';
```

### 6. **Code Splitting**
- Use React.lazy() for route-based code splitting
- Keep feature bundles independent
- Lazy load heavy components and libraries

### 7. **Testing Strategy**
- Unit tests alongside components (`.test.tsx`)
- Integration tests in `test/__tests__/`
- Mock API responses in `test/mocks/`

## Scalability Considerations

1. **Vertical Scaling**: Deep feature folders can have their own sub-features
2. **Horizontal Scaling**: Easy to add new features without affecting existing ones
3. **Team Collaboration**: Different teams can work on different features independently
4. **Code Splitting**: Features are naturally split for optimal bundle sizes

## Migration Path

When adding new functionality:
1. Identify if it's feature-specific or shared
2. Create necessary folders following the structure
3. Keep features isolated with clear boundaries
4. Document feature APIs in their index files

## Examples

### Creating a New Feature
```bash
mkdir -p src/features/newFeature/{components,hooks,services,types,utils,store}
touch src/features/newFeature/index.ts
```

### Creating a New Shared Component
```bash
touch src/components/common/NewComponent.tsx
# Add export to src/components/common/index.ts
```

### Adding a New Service
```bash
touch src/services/newService/index.ts
```

## Additional Directories

### 📁 `i18n/`
Internationalization and localization configuration.

- **`config.js`** - i18next configuration
- **`locales/`** - Translation files:
  - `en.json` - English translations (343+ keys)
  - `es.json` - Spanish translations
  - `fr.json` - French translations

### 📁 `utils/`
Additional utility functions.

- **`currency.js`** - Multi-currency utilities (8+ currencies, conversion, formatting)
- **`date.js`** - Date formatting and manipulation
- **`validators.js`** - Validation utilities
- **`storage.js`** - Enhanced storage utilities

## State Persistence Strategy

The application uses a two-tier storage approach:

### LocalStorage (Persistent across sessions)
- User authentication state
- Application settings
- User preferences
- Product catalog
- Customer data
- Financial records (invoices, payments, expenses)
- Branch configuration
- Role and permission data
- Audit logs

### SessionStorage (Cleared on browser close)
- Shopping cart state
- Current POS transaction
- Temporary checkout data

## Feature Module Pattern

Each feature module follows this standard structure:

```
feature/
├── components/          # UI components
│   ├── FeatureList.jsx
│   ├── FeatureForm.jsx
│   ├── FeatureCard.jsx
│   └── index.js
├── hooks/              # Custom hooks
│   ├── useFeature.js
│   ├── useFeatureForm.js
│   └── index.js
├── services/           # API and business logic
│   ├── featureService.js
│   └── index.js
├── store/             # State management
│   ├── featureSlice.js
│   └── index.js
├── types/             # Type definitions
│   ├── feature.types.js
│   └── index.js
├── utils/             # Feature-specific utilities
│   └── index.js
├── index.js           # Public API exports
└── README.md          # Feature documentation
```

## Code Organization Best Practices

1. **Barrel Exports** - Each directory has an `index.js` for clean imports
2. **Feature Isolation** - Features are self-contained with minimal cross-dependencies
3. **Service Layer** - Business logic separated from UI components
4. **State Management** - Zustand slices organized by feature
5. **Type Safety** - JSDoc type definitions for all data structures
6. **Mock Data** - Services include mock data for development
7. **Documentation** - Each feature module includes README documentation

## Recent Additions (2025-11-06)

- ✅ Multi-channel notification system (Email, SMS, WhatsApp)
- ✅ Automated backup with cloud storage (Google Drive, Dropbox, AWS S3)
- ✅ Hardware integration services (printer, cash drawer, scanner, display)
- ✅ Multi-currency support with 8+ currencies
- ✅ Multi-language support (English, Spanish, French)
- ✅ Comprehensive audit logging system
- ✅ Session management with concurrent user tracking
- ✅ Advanced inventory management (cycle counts, serial tracking)
- ✅ Purchase order management
- ✅ Financial management module (invoices, payments, expenses)
- ✅ Pricing and promotions engine

---

**Version**: 2.0
**Last Updated**: 2025-11-06
**Maintainer**: Development Team
