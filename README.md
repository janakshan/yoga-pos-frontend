# Yoga POS Frontend

A modern, scalable Point of Sale (POS) system built for yoga studios using React, TypeScript, and Vite.

## Project Structure

This project follows a **feature-based architecture** designed for large-scale applications. See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for detailed documentation.

### Quick Overview

```
src/
├── features/           # Feature modules (auth, pos, products, customers, etc.)
├── components/         # Shared/reusable components
├── layouts/           # Page layouts
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── services/          # Business logic & API services
├── store/             # State management
├── types/             # TypeScript types
├── utils/             # Utility functions
├── constants/         # Application constants
├── styles/            # Global styles
├── config/            # Configuration files
├── lib/               # Library configurations
├── test/              # Testing utilities
└── assets/            # Static assets
```

## Available Features

### Core Modules
- **Authentication** - Login, register, password management
- **Dashboard** - Overview and analytics
- **Point of Sale** - Checkout and transaction processing
- **Products** - Product/class management
- **Customers** - Member management
- **Inventory** - Stock tracking
- **Bookings** - Class scheduling and appointments
- **Payments** - Payment processing
- **Reports** - Analytics and reporting
- **Staff** - Employee management
- **Settings** - Application configuration

## Technology Stack

- **React 18.3+** - UI framework
- **TypeScript** - Type safety
- **Vite 6+** - Build tool and dev server
- **ESLint** - Code linting
- **Hot Module Replacement (HMR)** - Fast refresh during development

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Development Guidelines

### File Naming Conventions
- **Components**: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- **Hooks**: `camelCase.ts` with 'use' prefix (e.g., `useAuth.ts`)
- **Utils**: `camelCase.ts` (e.g., `formatCurrency.ts`)
- **Types**: `PascalCase.types.ts` (e.g., `User.types.ts`)

### Import Patterns

```typescript
// Use barrel exports from index files
import { Button, Input } from '@/components';
import { useAuth } from '@/hooks';
import { productService } from '@/features/products';
```

### Adding New Features

1. Create feature folder in `src/features/`
2. Add internal structure (components, hooks, services, etc.)
3. Create `index.ts` to export public API
4. Update `src/features/index.ts` to include new feature

```bash
# Example: Adding a new feature
mkdir -p src/features/newFeature/{components,hooks,services,types,utils,store}
touch src/features/newFeature/index.ts
```

## Architecture Principles

1. **Feature Isolation** - Features are self-contained modules
2. **Separation of Concerns** - Clear boundaries between UI, logic, and data
3. **Reusability** - Shared components and utilities
4. **Scalability** - Easy to add new features without affecting existing code
5. **Type Safety** - Full TypeScript support
6. **Testing** - Structured testing approach

## Documentation

- [Folder Structure Guide](./FOLDER_STRUCTURE.md) - Detailed explanation of project organization
- [Contributing Guidelines](./CONTRIBUTING.md) - Coming soon
- [API Documentation](./docs/API.md) - Coming soon

## Project Status

Currently in initial setup phase. Folder structure and architecture established.

---

**Last Updated**: 2025-11-04
