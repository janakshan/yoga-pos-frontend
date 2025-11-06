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
- **`auth/`** - Authentication & authorization (login, register, password reset)
- **`dashboard/`** - Main dashboard with analytics and overview
- **`pos/`** - Point of Sale checkout interface
- **`products/`** - Product/class management (CRUD operations)
- **`customers/`** - Customer/member management
- **`inventory/`** - Inventory tracking and management
- **`reports/`** - Analytics, reports, and data visualization
- **`settings/`** - Application settings and configuration
- **`payments/`** - Payment processing and history
- **`bookings/`** - Class bookings and scheduling

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
- **`notification/`** - Notification/toast service
- **`analytics/`** - Analytics tracking service

### 📁 `store/`
Global state management (Redux, Zustand, or other state management solution).

- **`slices/`** - State slices/reducers
- **`middleware/`** - Custom middleware
- **`selectors/`** - Memoized selectors
- **`index.ts`** - Store configuration

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

---

**Last Updated**: 2025-11-04
**Maintainer**: Development Team
