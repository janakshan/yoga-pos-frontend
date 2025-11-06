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
- **Authentication & Authorization** - Login, register, password management, role-based access control (RBAC), PIN authentication
- **Dashboard** - Overview, analytics, and real-time business metrics
- **Point of Sale (POS)** - Advanced checkout with split payments, returns/refunds, hold sales, shift management
- **Product Management** - Comprehensive product catalog with variants, bundles, pricing tiers, barcode generation
- **Customer Management** - CRM with loyalty programs, store credit, purchase history, customer segments
- **Inventory Management** - Multi-location stock tracking, cycle counting, serial number tracking, inter-branch transfers
- **Financial Management** - Invoicing, payment tracking, expense recording, cash flow monitoring, profit & loss
- **Purchase & Procurement** - Purchase orders, supplier management, receiving
- **Reports & Analytics** - Sales reports, inventory reports, financial reports, customer analytics, export to CSV/PDF/Excel
- **Branch Management** - Multi-location support with branch-specific settings and performance tracking
- **User Management** - User accounts, staff profiles, roles, permissions, audit logging
- **Notification System** - Multi-channel notifications (Email, SMS, WhatsApp) for sales, alerts, reminders
- **Backup & Recovery** - Automated backup with cloud storage (Google Drive, Dropbox, AWS S3), encryption support
- **Hardware Integration** - Receipt printer, cash drawer, barcode scanner, customer display support
- **Settings** - Multi-currency, multi-language, custom branding, tax configuration, hardware setup

## Technology Stack

### Frontend
- **React 18.3+** - UI framework with hooks
- **Vite 6+** - Build tool and dev server with HMR
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v6** - Client-side routing
- **Lucide React** - Icon library

### State Management
- **Zustand** - Lightweight state management
- **Immer** - Immutable state updates
- **Persist Middleware** - LocalStorage/SessionStorage persistence

### Internationalization & Localization
- **i18next** - Internationalization framework
- **react-i18next** - React bindings for i18next
- **3 Languages** - English, Spanish, French
- **8+ Currencies** - Multi-currency support with conversion

### Developer Tools
- **ESLint** - Code linting
- **Redux DevTools** - State debugging
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
- [API Documentation](./API_DOCUMENTATION.md) - Complete API specifications for all features
- [Feature Documentation](./docs/FEATURES.md) - Multi-language, multi-currency, branding, and hardware support
- [Security Features](./SECURITY_FEATURES.md) - User management, RBAC, audit logging, session management
- [Product Management](./PRODUCT_MANAGEMENT_FEATURES.md) - Product catalog, categories, variants, bundles, pricing
- [Financial Module](./src/features/financial/README.md) - Invoicing, payments, expenses, cash flow, reporting

## Key Features Highlights

### 🔐 Enterprise Security
- Role-Based Access Control (RBAC) with 6 predefined roles
- PIN and password authentication
- Comprehensive audit logging (40+ event types)
- Session management with concurrent user tracking

### 💰 Advanced POS
- Split payments with multiple methods
- Returns and refunds processing
- Hold sales for later completion
- Shift management with cash reconciliation
- Receipt printer integration with ESC/POS protocol

### 📦 Inventory Management
- Multi-location stock tracking
- Cycle counting and physical inventory
- Serial number tracking
- Inter-branch transfers
- Low stock alerts and notifications

### 📊 Financial Management
- Invoice generation with customizable templates
- Payment tracking and reconciliation
- Expense recording with approvals
- Cash flow monitoring
- Profit & loss statements
- End-of-day reports

### 🌐 Multi-Currency & Multi-Language
- 8+ supported currencies with exchange rates
- 3 languages (English, Spanish, French)
- Locale-aware formatting
- Easy language switching

### 🔔 Notification System
- Multi-channel: Email, SMS, WhatsApp
- Event-based triggers (sales, low stock, payment reminders)
- Customizable templates
- Delivery tracking

### 💾 Backup & Recovery
- Automated backup scheduling (hourly/daily/weekly/monthly)
- Cloud storage integration (Google Drive, Dropbox, AWS S3)
- AES-256-GCM encryption
- One-click restore with safety backups

### 🖨️ Hardware Integration
- Receipt printer (USB, Network, Bluetooth)
- Cash drawer control
- Barcode scanner support
- Customer display pole

### 📈 Reporting & Analytics
- Sales reports with multiple dimensions
- Customer analytics and segmentation
- Product performance analysis
- Export to CSV, PDF, Excel
- Customizable report builder

## Project Status

🚀 **Production Ready** - Full-featured POS system with enterprise capabilities

**Version**: 2.0
**Last Updated**: 2025-11-06
