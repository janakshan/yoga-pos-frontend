# Restaurant Feature Module

This module contains all restaurant-specific functionality for the POS system.

## Structure

```
restaurant/
├── components/         # React components for restaurant UI
│   ├── TableManagement.jsx      # Table layout and management
│   ├── KitchenDisplay.jsx       # Kitchen display system
│   ├── OrderManagement.jsx      # Restaurant order management
│   └── ...
├── hooks/             # Custom React hooks
│   ├── useRestaurantTables.js   # Table management hook
│   ├── useRestaurantOrders.js   # Order management hook
│   └── ...
├── services/          # API and business logic
│   ├── restaurantService.js     # Restaurant API calls
│   └── ...
├── store/             # State management
│   └── restaurantSlice.js       # Restaurant Zustand slice
├── types/             # Type definitions (JSDoc)
├── utils/             # Utility functions
└── index.js           # Public API exports
```

## Features

- **Table Management**: Manage table layouts, status, and assignments
- **Kitchen Display System**: Display orders for kitchen staff
- **Order Management**: Handle restaurant-specific orders with courses
- **Server Assignment**: Assign tables and orders to servers
- **Course Management**: Organize orders by courses (appetizer, main, dessert)

## Usage

```javascript
import { useRestaurantTables, useRestaurantOrders } from '@/features/restaurant';
```

## State Management

Restaurant state is managed through Zustand and includes:
- `tables`: Array of table objects
- `restaurantOrders`: Array of restaurant-specific orders
- `activeTableId`: Currently selected table
- `kitchenOrders`: Orders displayed in kitchen

## Integration

This module integrates with:
- Settings (business type configuration)
- Products (menu items)
- POS (order processing)
- Users (server assignments)
