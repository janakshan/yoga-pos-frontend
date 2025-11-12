# Multi-Purpose POS System Implementation Plan
## Restaurant Mode Feature Addition

**Version:** 1.0
**Date:** 2025-11-12
**Status:** Planning Phase

---

## Executive Summary

This document outlines the comprehensive plan to transform the current yoga/wellness POS system into a **multi-purpose POS platform** that supports both retail operations and restaurant operations through a configurable business type system.

### Goal
Enable users to toggle between "Retail Mode" and "Restaurant Mode" through settings. When restaurant mode is enabled, restaurant-specific features (tables, kitchen display, order management, modifiers, etc.) become available while maintaining all existing retail functionality.

### Key Benefits
- Single codebase serving multiple business types
- Modular feature activation
- No impact on existing retail functionality
- Scalable architecture for future business types

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Architecture Design](#2-architecture-design)
3. [Data Model Extensions](#3-data-model-extensions)
4. [Feature Specifications](#4-feature-specifications)
5. [Implementation Phases](#5-implementation-phases)
6. [Technical Implementation Details](#6-technical-implementation-details)
7. [UI/UX Changes](#7-uiux-changes)
8. [API Requirements](#8-api-requirements)
9. [Testing Strategy](#9-testing-strategy)
10. [Migration & Rollout](#10-migration--rollout)

---

## 1. Current State Analysis

### 1.1 Existing Features (Retail Mode)
- ✅ Advanced POS checkout with split payments
- ✅ Product management with categories
- ✅ Inventory tracking and management
- ✅ Customer management with loyalty
- ✅ Multi-branch support
- ✅ Financial reporting
- ✅ User roles & permissions
- ✅ Hardware integration (printers, scanners)
- ✅ Multi-currency support
- ✅ Backup & recovery

### 1.2 Current Architecture
- **Frontend:** React 18.3 with Vite
- **State Management:** Zustand with Immer
- **Styling:** Tailwind CSS
- **Routing:** React Router v7
- **i18n:** i18next
- **File Structure:** Feature-based modules

### 1.3 Settings Structure
Located at: `src/store/slices/settingsSlice.js`

Current settings include:
- Currency & localization
- Branding
- Business info
- Hardware configuration
- Receipt settings

---

## 2. Architecture Design

### 2.1 Business Type System

```javascript
// Core configuration structure
{
  businessType: 'retail' | 'restaurant',

  retailSettings: {
    // Existing yoga/wellness specific settings
  },

  restaurantSettings: {
    enabled: boolean,
    features: {
      tableManagement: boolean,
      kitchenDisplay: boolean,
      orderManagement: boolean,
      modifiers: boolean,
      tipping: boolean,
      courseSequencing: boolean,
    }
  }
}
```

### 2.2 Conditional Rendering Strategy

**Custom Hook: `useBusinessType`**
```javascript
// hooks/useBusinessType.js
export const useBusinessType = () => {
  const businessType = useStore(state => state.businessType);
  const restaurantSettings = useStore(state => state.restaurantSettings);

  return {
    isRetailMode: businessType === 'retail',
    isRestaurantMode: businessType === 'restaurant',
    restaurantSettings,

    // Feature flags
    hasTableManagement: businessType === 'restaurant' &&
                        restaurantSettings.features.tableManagement,
    hasKDS: businessType === 'restaurant' &&
            restaurantSettings.features.kitchenDisplay,
    hasModifiers: businessType === 'restaurant' &&
                  restaurantSettings.features.modifiers,
    hasTipping: businessType === 'restaurant' &&
                restaurantSettings.features.tipping,
  };
};
```

### 2.3 Module Structure

```
src/
├── features/
│   ├── restaurant/              # NEW - Restaurant features
│   │   ├── tables/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── services/
│   │   │   └── types/
│   │   ├── kitchen/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   ├── orders/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   └── menu/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── types/
│   ├── pos/                     # ENHANCED
│   ├── products/                # ENHANCED (menu items)
│   └── ...existing features
```

---

## 3. Data Model Extensions

### 3.1 New Entities

#### **Table**
```typescript
interface Table {
  id: string;
  number: string;
  name?: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'cleaning';
  floor: string;
  section: string;
  position: { x: number; y: number };
  shape: 'square' | 'rectangle' | 'circle' | 'oval';
  currentOrder?: string; // order ID
  server?: string; // user ID
  lastSeated?: Date;
  lastCleared?: Date;
  branch: string;
  metadata?: Record<string, any>;
}
```

#### **Floor Plan**
```typescript
interface FloorPlan {
  id: string;
  name: string;
  branch: string;
  isActive: boolean;
  dimensions: { width: number; height: number };
  tables: Table[];
  sections: Section[];
  createdAt: Date;
  updatedAt: Date;
}

interface Section {
  id: string;
  name: string;
  color: string;
  bounds: { x: number; y: number; width: number; height: number };
}
```

#### **Restaurant Order**
```typescript
interface RestaurantOrder {
  id: string;
  orderNumber: string;
  table?: string; // table ID
  serviceType: 'dine-in' | 'takeout' | 'delivery';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';

  items: OrderItem[];

  customer?: string; // customer ID
  server?: string; // user ID

  courses: Course[];

  timing: {
    orderPlaced: Date;
    confirmedAt?: Date;
    preparingAt?: Date;
    readyAt?: Date;
    servedAt?: Date;
    completedAt?: Date;
  };

  kitchen: {
    stations: string[]; // kitchen, bar, grill, dessert
    priority: 'low' | 'normal' | 'high' | 'urgent';
    notes: string;
  };

  payment: {
    subtotal: number;
    tax: number;
    tip?: number;
    discount?: number;
    total: number;
    tipPercentage?: number;
    splitType?: 'none' | 'by-seat' | 'by-item' | 'even';
    payments: Payment[];
  };

  branch: string;
  metadata?: Record<string, any>;
}
```

#### **Order Item (Enhanced)**
```typescript
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;

  // Restaurant-specific fields
  modifiers?: Modifier[];
  course?: 'appetizer' | 'main' | 'dessert' | 'beverage';
  seat?: number;
  status?: 'pending' | 'preparing' | 'ready' | 'served';
  station?: string; // kitchen, bar, grill
  specialInstructions?: string;

  subtotal: number;
}
```

#### **Menu Modifier**
```typescript
interface Modifier {
  id: string;
  name: string;
  price: number; // additional cost (can be 0)
  selected: boolean;
}

interface ModifierGroup {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  required: boolean;
  minSelections: number;
  maxSelections: number;
  modifiers: Modifier[];
}

interface Product {
  // ...existing fields

  // Restaurant-specific fields
  modifierGroups?: ModifierGroup[];
  station?: string; // default kitchen station
  prepTime?: number; // minutes
  recipe?: Recipe;
  availability?: {
    schedule?: { start: string; end: string }[]; // time-based
    daysOfWeek?: number[]; // 0-6
    dateRange?: { start: Date; end: Date };
  };
}
```

#### **Recipe**
```typescript
interface Recipe {
  id: string;
  productId: string;
  name: string;
  ingredients: RecipeIngredient[];
  prepTime: number; // minutes
  cookTime: number; // minutes
  instructions?: string;
  servings: number;
  costPerServing: number;
}

interface RecipeIngredient {
  inventoryItemId: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
}
```

#### **Kitchen Station**
```typescript
interface KitchenStation {
  id: string;
  name: string;
  code: string; // 'kitchen', 'bar', 'grill', 'dessert'
  branch: string;
  printerConfig?: {
    enabled: boolean;
    printerName: string;
    copies: number;
  };
  displayConfig?: {
    enabled: boolean;
    displayId: string;
  };
  isActive: boolean;
}
```

#### **Server Assignment**
```typescript
interface ServerAssignment {
  id: string;
  serverId: string;
  serverName: string;
  tables: string[]; // table IDs
  section: string;
  shift: {
    start: Date;
    end?: Date;
  };
  status: 'active' | 'break' | 'ended';
  branch: string;
}
```

### 3.2 Enhanced Entities

#### **Product/Menu Item Categories**
```typescript
// Restaurant-specific categories
const restaurantCategories = [
  'Appetizers',
  'Salads',
  'Soups',
  'Main Course',
  'Sides',
  'Desserts',
  'Beverages',
  'Alcoholic Beverages',
  'Coffee & Tea',
  'Kids Menu',
  'Specials',
  'Combo Meals',
];
```

#### **Customer Entity Enhancement**
```typescript
interface Customer {
  // ...existing fields

  // Restaurant-specific fields
  restaurantPreferences?: {
    favoriteTable?: string;
    dietaryRestrictions?: string[];
    allergies?: string[];
    favoriteItems?: string[]; // product IDs
    averagePartySize?: number;
    reservationHistory?: Reservation[];
  };
}
```

#### **User/Staff Enhancement**
```typescript
interface User {
  // ...existing fields

  // Restaurant-specific fields
  restaurantRole?: 'server' | 'chef' | 'bartender' | 'host' | 'kitchen_staff';
  serverInfo?: {
    sections: string[];
    tipPoolPercentage?: number;
    performanceMetrics?: {
      averageOrderValue: number;
      tablesTurnedToday: number;
      customerRating: number;
    };
  };
}
```

---

## 4. Feature Specifications

### 4.1 Table Management System

#### Features
- **Floor Plan Designer**
  - Drag-and-drop table placement
  - Multiple floor plans per branch
  - Customizable table shapes and sizes
  - Section/zone configuration
  - Visual table status indicators

- **Table Management**
  - Real-time status updates
  - Quick table actions (seat, clear, reserve)
  - Server assignment
  - Table merging/splitting
  - Estimated wait time tracking

- **Table Status Board**
  - Grid or floor plan view
  - Color-coded status
  - Quick order access
  - Time since seated
  - Filter by section/server

#### User Interface Components
```
/tables
  ├── TableStatusBoard.jsx       # Main dashboard
  ├── FloorPlanView.jsx          # Visual floor layout
  ├── FloorPlanDesigner.jsx      # Design mode
  ├── TableCard.jsx              # Individual table info
  ├── TableQuickActions.jsx      # Seat, clear, reserve
  ├── SectionManager.jsx         # Manage sections
  └── TableHistory.jsx           # Historical data
```

### 4.2 Kitchen Display System (KDS)

#### Features
- **Order Queue**
  - Orders organized by station
  - Priority sorting
  - Timer for each order
  - Auto-aging (color changes)

- **Order Details**
  - Full item breakdown with modifiers
  - Special instructions highlighted
  - Course sequencing
  - Quantity indicators

- **Order Management**
  - Mark items as ready
  - Bump/complete orders
  - Recall completed orders
  - Print to kitchen printer

- **Performance Metrics**
  - Average prep time
  - Orders completed per hour
  - Late orders tracking

#### User Interface Components
```
/kitchen
  ├── KitchenDisplaySystem.jsx   # Main KDS view
  ├── OrderQueue.jsx             # Queue by station
  ├── OrderCard.jsx              # Individual order
  ├── StationView.jsx            # Single station view
  ├── OrderTimer.jsx             # Timer component
  ├── KitchenMetrics.jsx         # Performance dashboard
  └── PrinterConfig.jsx          # Printer settings
```

### 4.3 Enhanced POS for Restaurant

#### New Features
- **Order Initiation**
  - Service type selection (dine-in/takeout/delivery)
  - Table selection (for dine-in)
  - Server auto-assignment
  - Guest count input

- **Menu Item Modifiers**
  - Modifier groups UI
  - Visual modifier selection
  - Price updates with modifiers
  - Special instructions text field

- **Course Management**
  - Assign items to courses
  - Course firing (send to kitchen by course)
  - Hold/rush orders

- **Tipping Interface**
  - Pre-calculated tip suggestions
  - Custom tip entry
  - Tip on pre-tax or post-tax
  - No tip option

- **Split Payment**
  - Split by seat
  - Split by item
  - Split evenly
  - Custom amount split

#### Enhanced Components
```
/pos
  ├── RestaurantPOS.jsx          # Restaurant-specific POS
  ├── TableSelector.jsx          # Select table
  ├── ServiceTypeSelector.jsx   # Dine-in/takeout/delivery
  ├── ModifierSelector.jsx       # Modifier UI
  ├── CourseManager.jsx          # Course assignment
  ├── TippingInterface.jsx       # Tip calculation
  ├── SplitPayment.jsx           # Split payment methods
  └── ServerView.jsx             # Server's orders view
```

### 4.4 Menu Management (Enhanced Products)

#### New Features
- **Modifier Groups**
  - Create modifier groups
  - Assign to products
  - Set pricing per modifier
  - Required vs optional

- **Recipe Management**
  - Ingredient breakdown
  - Cost calculation
  - Prep/cook time
  - Yield/serving size

- **Menu Categories**
  - Restaurant-specific categories
  - Category ordering
  - Time-based availability
  - Happy hour pricing

- **Menu Display**
  - Visual menu for ordering
  - Images and descriptions
  - Dietary icons (vegan, gluten-free)
  - Popular items highlighting

#### Components
```
/menu
  ├── MenuManagement.jsx         # Main menu admin
  ├── MenuItemForm.jsx           # Create/edit items
  ├── ModifierGroupForm.jsx      # Modifier management
  ├── RecipeBuilder.jsx          # Recipe creation
  ├── MenuDisplay.jsx            # Customer-facing menu
  ├── CategoryManager.jsx        # Category organization
  └── AvailabilityScheduler.jsx  # Time-based rules
```

### 4.5 Order Management System

#### Features
- **Order History**
  - All orders with filters
  - Status tracking
  - Order details view
  - Reorder functionality

- **Order Status Tracking**
  - Real-time status updates
  - Status change notifications
  - Estimated completion time
  - Customer notifications (SMS/email)

- **Order Modifications**
  - Edit in-progress orders
  - Cancel items
  - Add items to existing order
  - Void/comp items with reason

#### Components
```
/orders
  ├── OrderList.jsx              # Order history
  ├── OrderDetails.jsx           # Full order view
  ├── OrderTracking.jsx          # Status timeline
  ├── OrderModification.jsx      # Edit orders
  └── OrderNotifications.jsx     # Customer notifications
```

### 4.6 QR Code Table Ordering System

#### Features
- **QR Code Generation**
  - Unique QR code per table
  - Printable QR codes for table tents/stickers
  - Dynamic QR codes with table information
  - QR code regeneration if needed

- **Customer-Facing Web Menu**
  - Mobile-optimized menu display
  - Browse by category
  - Item images and descriptions
  - Dietary information and allergen warnings
  - Prices and availability
  - Popular items highlighting

- **Order Placement**
  - Add items to cart with modifiers
  - Special instructions per item
  - Real-time cart total calculation
  - Session management (cart persists during visit)
  - Order review before submission

- **Table Session Management**
  - Automatic table detection via QR scan
  - Session tracking per table
  - Multiple orders from same table
  - Call server button
  - Request bill button

- **Payment Options**
  - Pay now (card payment online)
  - Pay at counter
  - Pay when server brings bill
  - Split payment options

- **Order Tracking**
  - Real-time order status
  - Estimated preparation time
  - Notification when ready
  - Order history during session

- **Customer Features**
  - Save favorite items
  - Reorder previous items
  - Rate items (optional)
  - Tip adding (if paying online)

#### User Flow
```
1. Customer scans QR code at table
   ↓
2. Web app opens with menu (table auto-detected)
   ↓
3. Customer browses menu and adds items
   ↓
4. Customer customizes with modifiers
   ↓
5. Customer reviews order and submits
   ↓
6. Order sent to POS/Kitchen
   ↓
7. Customer receives order confirmation
   ↓
8. Real-time status updates
   ↓
9. Customer can place additional orders or request bill
```

#### Technical Components
```
/qr-ordering
  ├── QRCodeGenerator.jsx        # Generate QR codes
  ├── QRCodeManager.jsx          # Manage table QR codes
  ├── CustomerMenu.jsx           # Customer-facing menu
  ├── MenuItemCard.jsx           # Menu item display
  ├── CustomerCart.jsx           # Shopping cart
  ├── ModifierSelection.jsx      # Modifier UI
  ├── OrderReview.jsx            # Review before submit
  ├── OrderTracking.jsx          # Track order status
  ├── TableSession.jsx           # Session management
  ├── PaymentSelection.jsx       # Payment options
  └── CallServerButton.jsx       # Request assistance
```

#### Data Models

**QR Code Session**
```typescript
interface QROrderSession {
  id: string;
  tableId: string;
  tableNumber: string;
  sessionToken: string; // UUID for this dining session
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'requesting-bill' | 'closed';
  orders: string[]; // order IDs
  totalSpent: number;
  guestCount?: number;
}
```

**QR Code Configuration**
```typescript
interface TableQRCode {
  id: string;
  tableId: string;
  qrCodeUrl: string; // Generated QR code image
  deepLink: string; // URL encoded in QR: https://yourapp.com/order/table/{tableId}
  isActive: boolean;
  createdAt: Date;
  lastScanned?: Date;
  scanCount: number;
}
```

#### Security Considerations
- Session tokens expire after table is cleared
- Rate limiting on order submissions
- CAPTCHA for spam prevention (optional)
- Validate table ID and session on every request
- HTTPS only for customer-facing site
- No authentication required (guest checkout)

#### Mobile Optimization
- Progressive Web App (PWA)
  - Add to home screen
  - Offline menu browsing
  - Push notifications for order status

- Touch-optimized UI
  - Large tap targets
  - Swipe gestures
  - Bottom navigation for easy thumb access

- Performance
  - Lazy load images
  - Infinite scroll for menu
  - Minimal bundle size
  - Fast initial load

#### Restaurant Admin Features
- Enable/disable QR ordering per table or globally
- View active QR sessions
- Monitor orders from QR system
- Analytics on QR usage
- Print QR codes in bulk

### 4.7 Reservation System (Optional - Future)

#### Features
- Online reservation management
- Table assignment
- Party size management
- Wait list
- SMS/email confirmations

### 4.8 Restaurant Reports & Analytics

#### New Reports
- **Table Performance**
  - Average table turnover time
  - Revenue per table
  - Occupancy rate by time of day
  - Best/worst performing tables

- **Menu Performance**
  - Top selling items
  - Slow-moving items
  - Food cost percentage
  - Profit margin by item
  - Category performance

- **Server Performance**
  - Orders per server
  - Average order value
  - Table turnover rate
  - Tips earned
  - Customer feedback

- **Kitchen Performance**
  - Average preparation time by station
  - Order accuracy rate
  - Peak hours analysis
  - Labor cost percentage

- **Service Type Analysis**
  - Dine-in vs takeout vs delivery
  - Revenue by service type
  - Popular items by service type

#### Components
```
/reports/restaurant
  ├── TablePerformance.jsx
  ├── MenuAnalytics.jsx
  ├── ServerPerformance.jsx
  ├── KitchenMetrics.jsx
  └── ServiceTypeAnalysis.jsx
```

---

## 5. Implementation Phases

### Phase 1: Foundation (Week 1-2)
**Goal:** Setup business type configuration and infrastructure

#### Tasks
- [ ] Add `businessType` field to settings slice
- [ ] Create `restaurantSettings` configuration object
- [ ] Implement `useBusinessType` custom hook
- [ ] Create restaurant types/interfaces file
- [ ] Add business type toggle in Settings UI
- [ ] Update navigation to conditionally show/hide routes
- [ ] Create restaurant feature module structure
- [ ] Add restaurant-specific constants

**Deliverables:**
- Settings UI with business type toggle
- Conditional navigation working
- Foundation for restaurant features
- Type definitions complete

**Estimated Effort:** 40-50 hours

---

### Phase 2: Table Management (Week 3-4)
**Goal:** Complete table management functionality

#### Tasks
- [ ] Create Table data model
- [ ] Create FloorPlan data model
- [ ] Implement table CRUD operations
- [ ] Build Floor Plan Designer component
- [ ] Build Table Status Board
- [ ] Implement table status updates
- [ ] Add section management
- [ ] Create table assignment logic
- [ ] Build table quick actions
- [ ] Add table filtering and search
- [ ] Implement real-time status sync (if applicable)

**Deliverables:**
- Functional table management
- Floor plan designer
- Table status dashboard
- API integration complete

**Estimated Effort:** 60-70 hours

---

### Phase 3: Order Management & Status Workflow (Week 5-6)
**Goal:** Restaurant order lifecycle and status tracking

#### Tasks
- [ ] Create RestaurantOrder data model
- [ ] Implement order status workflow
- [ ] Build order creation flow with table selection
- [ ] Add service type selection
- [ ] Implement order status updates
- [ ] Create order history view
- [ ] Build order details view
- [ ] Add order modification functionality
- [ ] Implement order routing to stations
- [ ] Create order notification system

**Deliverables:**
- Complete order workflow
- Order management dashboard
- Status tracking system
- Order history and details

**Estimated Effort:** 50-60 hours

---

### Phase 4: Menu Modifiers & Enhanced Products (Week 7-8)
**Goal:** Menu item customization and modifiers

#### Tasks
- [ ] Create Modifier data models
- [ ] Create ModifierGroup data models
- [ ] Update Product model with restaurant fields
- [ ] Build Modifier Group management UI
- [ ] Build Modifier selection UI in POS
- [ ] Implement modifier pricing logic
- [ ] Add special instructions field
- [ ] Create restaurant category system
- [ ] Build visual menu display
- [ ] Implement menu availability rules

**Deliverables:**
- Modifier system complete
- Restaurant categories
- Enhanced product management
- Visual menu display

**Estimated Effort:** 50-60 hours

---

### Phase 5: QR Code Table Ordering System (Week 9-11)
**Goal:** Customer-facing QR code ordering system

#### Tasks
- [ ] Create QROrderSession data model
- [ ] Create TableQRCode data model
- [ ] Build QR code generator (using qrcode.js or similar)
- [ ] Build QR code management UI (admin)
- [ ] Design customer-facing mobile menu UI
- [ ] Build customer menu browsing interface
- [ ] Implement cart functionality for customers
- [ ] Build modifier selection for customers
- [ ] Create order review and submission flow
- [ ] Implement table session management
- [ ] Add session token validation
- [ ] Build order tracking for customers
- [ ] Implement "Call Server" button
- [ ] Implement "Request Bill" button
- [ ] Add online payment integration (optional)
- [ ] Build payment selection UI
- [ ] Implement real-time order status updates
- [ ] Add PWA capabilities (manifest, service worker)
- [ ] Optimize for mobile performance
- [ ] Add QR analytics dashboard
- [ ] Implement rate limiting and security

**Deliverables:**
- QR code generation system
- Customer-facing mobile menu
- Order placement workflow
- Session management
- Real-time updates
- PWA with offline support
- Admin management interface

**Estimated Effort:** 70-80 hours

---

### Phase 6: Kitchen Display System (Week 12-13)
**Goal:** KDS functionality for kitchen operations

#### Tasks
- [ ] Create KitchenStation data model
- [ ] Build KDS main interface
- [ ] Implement order queue by station
- [ ] Add order card with details
- [ ] Build order timer component
- [ ] Implement order aging (color coding)
- [ ] Add mark ready/bump functionality
- [ ] Create station selector
- [ ] Build kitchen printer integration
- [ ] Add performance metrics dashboard
- [ ] Implement course sequencing
- [ ] Add priority ordering
- [ ] Handle orders from QR system

**Deliverables:**
- Functional KDS
- Multi-station support
- Kitchen printer integration
- Performance tracking
- QR order integration

**Estimated Effort:** 60-70 hours

---

### Phase 7: Enhanced POS for Restaurant (Week 14-15)
**Goal:** Restaurant-specific POS enhancements

#### Tasks
- [ ] Add table selection to POS
- [ ] Implement service type selector
- [ ] Integrate modifier selection in cart
- [ ] Build course assignment UI
- [ ] Create tipping interface
- [ ] Implement tip calculation logic
- [ ] Build split payment functionality
- [ ] Add seat assignment
- [ ] Create server view/dashboard
- [ ] Implement quick re-order
- [ ] Add special instructions field

**Deliverables:**
- Enhanced POS for restaurants
- Tipping functionality
- Split payment working
- Server dashboard

**Estimated Effort:** 60-70 hours

---

### Phase 8: Recipe Management (Week 16)
**Goal:** Recipe and ingredient tracking

#### Tasks
- [ ] Create Recipe data model
- [ ] Create RecipeIngredient model
- [ ] Build recipe builder UI
- [ ] Implement ingredient selection
- [ ] Add cost calculation
- [ ] Link recipes to menu items
- [ ] Build recipe list/management
- [ ] Add prep/cook time tracking
- [ ] Implement recipe costing reports

**Deliverables:**
- Recipe management system
- Ingredient tracking
- Cost calculation
- Integration with inventory

**Estimated Effort:** 30-40 hours

---

### Phase 9: Server Management (Week 17)
**Goal:** Server assignment and performance tracking

#### Tasks
- [ ] Create ServerAssignment model
- [ ] Update User model with server fields
- [ ] Build server assignment UI
- [ ] Implement section assignment
- [ ] Add shift management
- [ ] Create server performance dashboard
- [ ] Build server order history
- [ ] Add tip tracking
- [ ] Implement server reports

**Deliverables:**
- Server management
- Performance tracking
- Tip tracking
- Server reports

**Estimated Effort:** 30-40 hours

---

### Phase 10: Restaurant Reports & Analytics (Week 18-19)
**Goal:** Restaurant-specific reporting

#### Tasks
- [ ] Build table performance report
- [ ] Create menu analytics dashboard
- [ ] Implement server performance report
- [ ] Add kitchen metrics report
- [ ] Create service type analysis
- [ ] Build food cost percentage report
- [ ] Add table turnover report
- [ ] Implement peak hours analysis
- [ ] Create profit margin analysis
- [ ] Add QR ordering analytics report
- [ ] Add export functionality

**Deliverables:**
- Complete restaurant reports
- Analytics dashboards
- QR ordering insights
- Export capabilities
- Scheduled reports

**Estimated Effort:** 50-60 hours

---

### Phase 11: Hardware Integration (Week 20)
**Goal:** Kitchen hardware support

#### Tasks
- [ ] Add kitchen printer configuration
- [ ] Implement multi-printer routing
- [ ] Add customer display support
- [ ] Configure pager/buzzer system
- [ ] Test hardware integration
- [ ] Add kitchen display screens
- [ ] Implement expeditor display

**Deliverables:**
- Kitchen printer support
- Customer displays
- Pager system integration

**Estimated Effort:** 30-40 hours

---

### Phase 12: Testing & QA (Week 21-22)
**Goal:** Comprehensive testing

#### Tasks
- [ ] Unit tests for restaurant features
- [ ] Integration tests
- [ ] End-to-end testing
- [ ] QR ordering mobile testing
- [ ] Performance testing
- [ ] Security testing (QR sessions)
- [ ] User acceptance testing
- [ ] Bug fixes
- [ ] Documentation updates

**Deliverables:**
- Test coverage > 80%
- Bug-free release candidate
- Updated documentation
- Security audit report

**Estimated Effort:** 50-60 hours

---

### Phase 13: Polish & Launch (Week 23)
**Goal:** Final polish and production release

#### Tasks
- [ ] UI/UX refinements
- [ ] Performance optimizations
- [ ] Final bug fixes
- [ ] User documentation
- [ ] QR ordering customer guide
- [ ] Training materials
- [ ] Deployment preparation
- [ ] Production release

**Deliverables:**
- Production-ready application
- User guides
- Customer-facing QR guide
- Training materials
- Launch announcement

**Estimated Effort:** 20-30 hours

---

## 6. Technical Implementation Details

### 6.1 Settings Slice Extension

**File:** `src/store/slices/settingsSlice.js`

```javascript
export const createSettingsSlice = (set, get) => ({
  // ...existing settings

  // Business Type Configuration
  businessType: 'retail', // 'retail' | 'restaurant'

  // Restaurant Settings
  restaurantSettings: {
    enabled: false,

    // Feature Flags
    features: {
      tableManagement: true,
      kitchenDisplay: true,
      orderManagement: true,
      modifiers: true,
      tipping: true,
      courseSequencing: true,
      serverManagement: true,
      recipes: true,
      qrOrdering: true,
      reservations: false, // Future feature
    },

    // Table Configuration
    tables: {
      enabled: true,
      autoAssignServer: false,
      requireTableForDineIn: true,
      defaultFloorPlan: null,
    },

    // Order Configuration
    orderManagement: {
      enableKDS: true,
      enableCourseSequencing: true,
      stations: [
        { id: 'kitchen', name: 'Kitchen', color: '#3B82F6' },
        { id: 'bar', name: 'Bar', color: '#10B981' },
        { id: 'grill', name: 'Grill', color: '#F59E0B' },
        { id: 'dessert', name: 'Dessert', color: '#EC4899' },
      ],
      defaultPrepTime: 15, // minutes
      autoSendToKitchen: true,
      printToKitchen: true,
    },

    // Service Types
    serviceTypes: {
      dineIn: { enabled: true, label: 'Dine In' },
      takeout: { enabled: true, label: 'Takeout' },
      delivery: { enabled: true, label: 'Delivery' },
    },
    defaultServiceType: 'dineIn',

    // Menu Configuration
    menu: {
      enableModifiers: true,
      enableComboDeals: true,
      enableHappyHour: false,
      enableTimeBasedPricing: false,
      showNutritionalInfo: false,
      showCalories: false,
    },

    // Tipping Configuration
    tipping: {
      enabled: true,
      defaultTipPercentages: [15, 18, 20, 25],
      allowCustomTip: true,
      tipOnPreTax: false,
      suggestedTipCalculation: 'total', // 'subtotal' | 'total'
      autoGratuity: {
        enabled: false,
        partySize: 6,
        percentage: 18,
      },
    },

    // Kitchen Hardware
    kitchenHardware: {
      kitchenPrinters: [],
      expeditorDisplay: {
        enabled: false,
        displayId: null,
      },
      pagerSystem: {
        enabled: false,
        type: 'vibrating', // 'vibrating' | 'beeper'
      },
    },

    // Server Configuration
    servers: {
      enableServerAssignment: true,
      requireServerForOrders: false,
      enableTipPooling: false,
      tipPoolPercentage: 0,
    },

    // Dining Options
    dining: {
      coursesEnabled: true,
      availableCourses: [
        { id: 'appetizer', name: 'Appetizer', order: 1 },
        { id: 'soup-salad', name: 'Soup/Salad', order: 2 },
        { id: 'main', name: 'Main Course', order: 3 },
        { id: 'dessert', name: 'Dessert', order: 4 },
        { id: 'beverage', name: 'Beverage', order: 5 },
      ],
    },

    // QR Code Ordering Configuration
    qrOrdering: {
      enabled: true,
      requireGuestInfo: false, // Require name/phone before ordering
      enableOnlinePayment: true,
      enableCallServer: true,
      enableRequestBill: true,
      sessionTimeout: 240, // minutes (4 hours)
      allowReorders: true,
      showItemImages: true,
      showNutritionalInfo: false,
      showAllergens: true,
      enableRatings: false,
      minimumOrderAmount: 0,
      publicMenuUrl: '', // Auto-generated: https://yourapp.com/menu/{branch-id}
    },
  },

  // Actions
  setBusinessType: (type) =>
    set((state) => {
      state.businessType = type;
      if (type === 'restaurant') {
        state.restaurantSettings.enabled = true;
      }
    }),

  toggleRestaurantMode: () =>
    set((state) => {
      if (state.businessType === 'retail') {
        state.businessType = 'restaurant';
        state.restaurantSettings.enabled = true;
      } else {
        state.businessType = 'retail';
        state.restaurantSettings.enabled = false;
      }
    }),

  updateRestaurantSettings: (updates) =>
    set((state) => {
      state.restaurantSettings = {
        ...state.restaurantSettings,
        ...updates,
      };
    }),

  toggleRestaurantFeature: (feature) =>
    set((state) => {
      if (state.restaurantSettings.features[feature] !== undefined) {
        state.restaurantSettings.features[feature] =
          !state.restaurantSettings.features[feature];
      }
    }),

  updateKitchenStations: (stations) =>
    set((state) => {
      state.restaurantSettings.orderManagement.stations = stations;
    }),

  updateTippingConfig: (config) =>
    set((state) => {
      state.restaurantSettings.tipping = {
        ...state.restaurantSettings.tipping,
        ...config,
      };
    }),

  // ...existing actions
});
```

### 6.2 Custom Hooks

**File:** `src/hooks/useBusinessType.js`

```javascript
import { useStore } from '@/store';

export const useBusinessType = () => {
  const businessType = useStore((state) => state.businessType);
  const restaurantSettings = useStore((state) => state.restaurantSettings);

  const isRetailMode = businessType === 'retail';
  const isRestaurantMode = businessType === 'restaurant';

  return {
    businessType,
    isRetailMode,
    isRestaurantMode,
    restaurantSettings,

    // Feature flags
    hasTableManagement:
      isRestaurantMode && restaurantSettings.features.tableManagement,
    hasKDS:
      isRestaurantMode && restaurantSettings.features.kitchenDisplay,
    hasOrderManagement:
      isRestaurantMode && restaurantSettings.features.orderManagement,
    hasModifiers:
      isRestaurantMode && restaurantSettings.features.modifiers,
    hasTipping:
      isRestaurantMode && restaurantSettings.features.tipping,
    hasCourseSequencing:
      isRestaurantMode && restaurantSettings.features.courseSequencing,
    hasServerManagement:
      isRestaurantMode && restaurantSettings.features.serverManagement,
    hasRecipes:
      isRestaurantMode && restaurantSettings.features.recipes,
    hasReservations:
      isRestaurantMode && restaurantSettings.features.reservations,

    // Configuration accessors
    getTippingConfig: () => restaurantSettings.tipping,
    getServiceTypes: () => restaurantSettings.serviceTypes,
    getKitchenStations: () => restaurantSettings.orderManagement.stations,
    getCoursesConfig: () => restaurantSettings.dining,
  };
};
```

**File:** `src/hooks/useRestaurantSettings.js`

```javascript
import { useStore } from '@/store';

export const useRestaurantSettings = () => {
  const restaurantSettings = useStore((state) => state.restaurantSettings);
  const updateRestaurantSettings = useStore(
    (state) => state.updateRestaurantSettings
  );
  const toggleRestaurantFeature = useStore(
    (state) => state.toggleRestaurantFeature
  );
  const updateKitchenStations = useStore(
    (state) => state.updateKitchenStations
  );
  const updateTippingConfig = useStore(
    (state) => state.updateTippingConfig
  );

  return {
    settings: restaurantSettings,
    updateSettings: updateRestaurantSettings,
    toggleFeature: toggleRestaurantFeature,
    updateKitchenStations,
    updateTippingConfig,
  };
};
```

### 6.3 Type Definitions

**File:** `src/features/restaurant/types/index.js`

```javascript
/**
 * Restaurant Type Definitions
 */

// Table Status
export const TableStatus = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  CLEANING: 'cleaning',
};

// Order Status
export const RestaurantOrderStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  SERVED: 'served',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

// Service Type
export const ServiceType = {
  DINE_IN: 'dine-in',
  TAKEOUT: 'takeout',
  DELIVERY: 'delivery',
};

// Course Type
export const CourseType = {
  APPETIZER: 'appetizer',
  SOUP_SALAD: 'soup-salad',
  MAIN: 'main',
  DESSERT: 'dessert',
  BEVERAGE: 'beverage',
};

// Kitchen Station
export const KitchenStationType = {
  KITCHEN: 'kitchen',
  BAR: 'bar',
  GRILL: 'grill',
  DESSERT: 'dessert',
};

// Order Priority
export const OrderPriority = {
  LOW: 'low',
  NORMAL: 'normal',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Table Shape
export const TableShape = {
  SQUARE: 'square',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  OVAL: 'oval',
};

// Split Type
export const SplitType = {
  NONE: 'none',
  BY_SEAT: 'by-seat',
  BY_ITEM: 'by-item',
  EVEN: 'even',
};

// Server Status
export const ServerStatus = {
  ACTIVE: 'active',
  BREAK: 'break',
  ENDED: 'ended',
};

// Modifier Type
export const ModifierType = {
  SINGLE: 'single',
  MULTIPLE: 'multiple',
};
```

**File:** `src/features/restaurant/types/table.types.js`

```javascript
/**
 * @typedef {Object} Table
 * @property {string} id
 * @property {string} number
 * @property {string} [name]
 * @property {number} capacity
 * @property {'available'|'occupied'|'reserved'|'cleaning'} status
 * @property {string} floor
 * @property {string} section
 * @property {{x: number, y: number}} position
 * @property {'square'|'rectangle'|'circle'|'oval'} shape
 * @property {string} [currentOrder]
 * @property {string} [server]
 * @property {Date} [lastSeated]
 * @property {Date} [lastCleared]
 * @property {string} branch
 * @property {Object} [metadata]
 */

/**
 * @typedef {Object} Section
 * @property {string} id
 * @property {string} name
 * @property {string} color
 * @property {{x: number, y: number, width: number, height: number}} bounds
 */

/**
 * @typedef {Object} FloorPlan
 * @property {string} id
 * @property {string} name
 * @property {string} branch
 * @property {boolean} isActive
 * @property {{width: number, height: number}} dimensions
 * @property {Table[]} tables
 * @property {Section[]} sections
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

export {};
```

### 6.4 Navigation Configuration

**File:** `src/routes/index.jsx` (or similar)

```javascript
import { useBusinessType } from '@/hooks/useBusinessType';

export const AppRoutes = () => {
  const { isRestaurantMode, hasTableManagement, hasKDS } = useBusinessType();

  return (
    <Routes>
      {/* Common Routes */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/pos" element={<POS />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />

      {/* Conditional: Products or Menu */}
      {isRestaurantMode ? (
        <Route path="/menu" element={<MenuManagement />} />
      ) : (
        <Route path="/products" element={<Products />} />
      )}

      {/* Restaurant-only Routes */}
      {isRestaurantMode && hasTableManagement && (
        <Route path="/tables" element={<TableManagement />} />
      )}

      {isRestaurantMode && hasKDS && (
        <Route path="/kitchen" element={<KitchenDisplay />} />
      )}

      {isRestaurantMode && (
        <>
          <Route path="/orders" element={<OrderManagement />} />
          <Route path="/servers" element={<ServerManagement />} />
        </>
      )}

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
```

**File:** `src/components/layout/Sidebar.jsx` (or Navigation component)

```javascript
import { useBusinessType } from '@/hooks/useBusinessType';

export const Sidebar = () => {
  const {
    isRestaurantMode,
    hasTableManagement,
    hasKDS
  } = useBusinessType();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: HomeIcon, show: true },
    { name: 'POS', path: '/pos', icon: CashRegisterIcon, show: true },

    // Conditional: Products or Menu
    {
      name: isRestaurantMode ? 'Menu' : 'Products',
      path: isRestaurantMode ? '/menu' : '/products',
      icon: PackageIcon,
      show: true
    },

    // Restaurant-only items
    {
      name: 'Tables',
      path: '/tables',
      icon: GridIcon,
      show: isRestaurantMode && hasTableManagement
    },
    {
      name: 'Kitchen',
      path: '/kitchen',
      icon: ChefHatIcon,
      show: isRestaurantMode && hasKDS
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: ClipboardIcon,
      show: isRestaurantMode
    },
    {
      name: 'Servers',
      path: '/servers',
      icon: UsersIcon,
      show: isRestaurantMode
    },

    // Common items
    { name: 'Customers', path: '/customers', icon: UserIcon, show: true },
    { name: 'Inventory', path: '/inventory', icon: BoxIcon, show: true },
    { name: 'Reports', path: '/reports', icon: ChartIcon, show: true },
    { name: 'Settings', path: '/settings', icon: SettingsIcon, show: true },
  ];

  const visibleItems = navItems.filter(item => item.show);

  return (
    <nav className="sidebar">
      {visibleItems.map(item => (
        <NavLink key={item.path} to={item.path}>
          <item.icon />
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};
```

### 6.5 Component Examples

**Settings Toggle Component**

```javascript
// src/features/settings/components/BusinessTypeSettings.jsx

import { useStore } from '@/store';
import { useBusinessType } from '@/hooks/useBusinessType';
import { toast } from 'react-hot-toast';

export const BusinessTypeSettings = () => {
  const { businessType, isRestaurantMode } = useBusinessType();
  const setBusinessType = useStore((state) => state.setBusinessType);
  const restaurantSettings = useStore((state) => state.restaurantSettings);
  const toggleRestaurantFeature = useStore(
    (state) => state.toggleRestaurantFeature
  );

  const handleBusinessTypeChange = (type) => {
    setBusinessType(type);
    toast.success(`Switched to ${type} mode`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Business Type</h2>
        <p className="text-sm text-gray-600 mb-4">
          Select your business type to enable specific features
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => handleBusinessTypeChange('retail')}
            className={`
              flex-1 p-6 border-2 rounded-lg transition-all
              ${businessType === 'retail'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🛍️</div>
              <h3 className="font-semibold text-lg">Retail</h3>
              <p className="text-sm text-gray-600 mt-2">
                For yoga studios, wellness centers, retail stores
              </p>
            </div>
          </button>

          <button
            onClick={() => handleBusinessTypeChange('restaurant')}
            className={`
              flex-1 p-6 border-2 rounded-lg transition-all
              ${businessType === 'restaurant'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
              }
            `}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">🍽️</div>
              <h3 className="font-semibold text-lg">Restaurant</h3>
              <p className="text-sm text-gray-600 mt-2">
                For restaurants, cafes, food service
              </p>
            </div>
          </button>
        </div>
      </div>

      {isRestaurantMode && (
        <div className="border-t pt-6">
          <h3 className="font-semibold text-lg mb-4">Restaurant Features</h3>
          <div className="space-y-3">
            {Object.entries(restaurantSettings.features).map(([feature, enabled]) => (
              <div key={feature} className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-sm capitalize">
                    {feature.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <p className="text-xs text-gray-600">
                    Enable {feature} functionality
                  </p>
                </div>
                <button
                  onClick={() => toggleRestaurantFeature(feature)}
                  className={`
                    ${enabled ? 'bg-blue-600' : 'bg-gray-200'}
                    relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors
                  `}
                >
                  <span
                    className={`
                      ${enabled ? 'translate-x-6' : 'translate-x-1'}
                      inline-block h-4 w-4 transform rounded-full bg-white
                      transition-transform
                    `}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 7. UI/UX Changes

### 7.1 Dashboard Enhancements

**Retail Mode Dashboard:**
- Revenue metrics
- Product sales
- Inventory alerts
- Customer stats
- Branch performance

**Restaurant Mode Dashboard:**
- Revenue metrics
- Active tables count
- Active orders count
- Kitchen performance
- Server performance
- Table turnover rate
- Popular menu items
- Average order value

### 7.2 POS Enhancements

**New UI Elements for Restaurant Mode:**

1. **Service Type Selector** (top of POS)
   - Radio buttons or tabs: Dine In | Takeout | Delivery

2. **Table Selector** (when Dine In selected)
   - Dropdown showing available tables
   - Quick search by table number
   - Option to view floor plan

3. **Modifier Selection Modal**
   - Appears when menu item clicked
   - Groups of modifiers with checkboxes/radio buttons
   - Price adjustments shown
   - Special instructions text area

4. **Cart Enhancements**
   - Show modifiers under each item
   - Course assignment badges
   - Edit/remove modifier options

5. **Checkout Panel Additions**
   - Tipping section with suggested amounts
   - Split payment options
   - Print to kitchen option
   - Course firing buttons

### 7.3 New Screens

1. **Table Management** (`/tables`)
   - Floor plan view (default)
   - List view toggle
   - Quick actions toolbar
   - Filter by status/section

2. **Kitchen Display** (`/kitchen`)
   - Station tabs across top
   - Order queue cards
   - Timer on each order
   - Color-coded aging
   - Bump/complete buttons

3. **Menu Management** (`/menu`)
   - Similar to Products but with restaurant categories
   - Modifier groups tab
   - Recipe tab
   - Availability scheduler

4. **Order Management** (`/orders`)
   - Order list with status filters
   - Search by order number/table
   - Order details sidebar
   - Status timeline

5. **Server Management** (`/servers`)
   - Server list
   - Active/inactive status
   - Section assignments
   - Performance metrics
   - Shift management

### 7.4 Mobile Responsiveness

All restaurant features must be mobile-friendly for:
- Server tablets for order taking
- Kitchen tablets for KDS
- Manager mobile access

---

## 8. API Requirements

### 8.1 New Endpoints

#### Tables
```
GET    /api/tables                     # List all tables
POST   /api/tables                     # Create table
GET    /api/tables/:id                 # Get table details
PUT    /api/tables/:id                 # Update table
DELETE /api/tables/:id                 # Delete table
PATCH  /api/tables/:id/status          # Update table status
GET    /api/tables/available           # Get available tables
```

#### Floor Plans
```
GET    /api/floor-plans                # List floor plans
POST   /api/floor-plans                # Create floor plan
GET    /api/floor-plans/:id            # Get floor plan
PUT    /api/floor-plans/:id            # Update floor plan
DELETE /api/floor-plans/:id            # Delete floor plan
PATCH  /api/floor-plans/:id/activate   # Set as active
```

#### Restaurant Orders
```
GET    /api/restaurant-orders          # List orders
POST   /api/restaurant-orders          # Create order
GET    /api/restaurant-orders/:id      # Get order details
PUT    /api/restaurant-orders/:id      # Update order
DELETE /api/restaurant-orders/:id      # Cancel order
PATCH  /api/restaurant-orders/:id/status # Update status
POST   /api/restaurant-orders/:id/items # Add items to order
DELETE /api/restaurant-orders/:id/items/:itemId # Remove item
GET    /api/restaurant-orders/kitchen  # Get kitchen queue
GET    /api/restaurant-orders/table/:tableId # Get orders by table
```

#### Modifiers
```
GET    /api/modifiers                  # List all modifiers
POST   /api/modifiers                  # Create modifier
GET    /api/modifiers/:id              # Get modifier
PUT    /api/modifiers/:id              # Update modifier
DELETE /api/modifiers/:id              # Delete modifier
```

#### Modifier Groups
```
GET    /api/modifier-groups            # List groups
POST   /api/modifier-groups            # Create group
GET    /api/modifier-groups/:id        # Get group
PUT    /api/modifier-groups/:id        # Update group
DELETE /api/modifier-groups/:id        # Delete group
```

#### Recipes
```
GET    /api/recipes                    # List recipes
POST   /api/recipes                    # Create recipe
GET    /api/recipes/:id                # Get recipe
PUT    /api/recipes/:id                # Update recipe
DELETE /api/recipes/:id                # Delete recipe
GET    /api/recipes/product/:productId # Get recipe by product
POST   /api/recipes/:id/cost           # Calculate recipe cost
```

#### Kitchen Stations
```
GET    /api/kitchen-stations           # List stations
POST   /api/kitchen-stations           # Create station
GET    /api/kitchen-stations/:id       # Get station
PUT    /api/kitchen-stations/:id       # Update station
DELETE /api/kitchen-stations/:id       # Delete station
GET    /api/kitchen-stations/:id/orders # Get orders for station
```

#### Servers
```
GET    /api/servers                    # List servers
POST   /api/servers                    # Create server
GET    /api/servers/:id                # Get server
PUT    /api/servers/:id                # Update server
GET    /api/servers/:id/assignments    # Get server assignments
POST   /api/servers/:id/assignments    # Assign server
GET    /api/servers/:id/performance    # Get performance metrics
GET    /api/servers/:id/tips           # Get tip history
```

#### QR Code Ordering
```
# QR Code Management (Admin)
GET    /api/qr-codes                   # List all QR codes
POST   /api/qr-codes/generate          # Generate QR codes for tables
GET    /api/qr-codes/table/:tableId    # Get QR code for specific table
POST   /api/qr-codes/regenerate/:tableId # Regenerate QR code
DELETE /api/qr-codes/:id               # Delete QR code
GET    /api/qr-codes/download/:tableId # Download QR code image
POST   /api/qr-codes/bulk-download     # Download all QR codes as ZIP

# Customer-Facing Menu API (Public/No Auth)
GET    /api/public/menu/:branchId      # Get public menu for branch
GET    /api/public/menu/:branchId/categories # Get menu categories
GET    /api/public/menu/:branchId/items # Get menu items
GET    /api/public/menu/item/:itemId   # Get item details with modifiers

# QR Order Session Management
POST   /api/qr-sessions/start          # Start new session (on QR scan)
GET    /api/qr-sessions/:sessionToken  # Get session details
PATCH  /api/qr-sessions/:sessionToken/heartbeat # Keep session alive
POST   /api/qr-sessions/:sessionToken/close # Close session
GET    /api/qr-sessions/:sessionToken/orders # Get all orders in session

# Customer Order Placement (Session-based auth)
POST   /api/qr-orders                  # Create order from QR
GET    /api/qr-orders/:orderId         # Get order status
GET    /api/qr-orders/:orderId/track   # Track order with real-time updates
POST   /api/qr-orders/:orderId/rate    # Rate order/items (optional)

# Customer Actions
POST   /api/qr-sessions/:sessionToken/call-server  # Request server assistance
POST   /api/qr-sessions/:sessionToken/request-bill # Request bill
POST   /api/qr-sessions/:sessionToken/payment      # Submit online payment

# QR Analytics (Admin)
GET    /api/qr-analytics/sessions      # Active/past sessions
GET    /api/qr-analytics/orders        # Orders from QR
GET    /api/qr-analytics/popular-items # Popular items via QR
GET    /api/qr-analytics/usage         # QR scan statistics
```

### 8.2 Enhanced Endpoints

#### Products (now Menu Items in restaurant mode)
```
GET    /api/products?businessType=restaurant
POST   /api/products (include restaurant fields)
```

#### Settings
```
GET    /api/settings
PUT    /api/settings (include businessType and restaurantSettings)
```

### 8.3 Real-time Updates (WebSocket/SSE)

For real-time features (optional but recommended):
```
WS     /api/ws/tables                  # Table status updates
WS     /api/ws/orders                  # Order status updates
WS     /api/ws/kitchen/:station        # Kitchen order updates
```

---

## 9. Testing Strategy

### 9.1 Unit Tests

Test coverage for:
- All new hooks (useBusinessType, useRestaurantSettings)
- Settings slice actions
- Utility functions
- Type validation
- Calculations (tip, split payment, recipe cost)

**Target:** 80%+ code coverage

### 9.2 Integration Tests

Test:
- Business type switching
- Feature flag toggling
- Navigation changes based on mode
- Settings persistence
- API integration

### 9.3 Component Tests

Test:
- Settings toggle UI
- Conditional rendering
- Table management components
- KDS components
- POS enhancements
- Modifier selection
- Tipping interface

### 9.4 End-to-End Tests

Test complete workflows:
1. **Dine-in Order Flow**
   - Select table
   - Add items with modifiers
   - Send to kitchen
   - Mark ready in KDS
   - Complete order with tip

2. **Takeout Order Flow**
   - Select takeout
   - Add items
   - Process payment
   - Print receipt

3. **Table Management Flow**
   - Create floor plan
   - Add tables
   - Assign table
   - Clear table

4. **Kitchen Workflow**
   - Receive order in KDS
   - Route to stations
   - Mark ready
   - Complete order

### 9.5 Performance Tests

- Load testing with multiple orders
- Real-time update latency
- KDS performance with many orders
- Database query optimization

### 9.6 User Acceptance Testing

- Test with actual restaurant staff
- Gather feedback on workflows
- Identify usability issues
- Validate against real-world scenarios

---

## 10. Migration & Rollout

### 10.1 Data Migration

**No migration needed for existing users** - they continue in retail mode by default.

New settings will be added with sensible defaults:
```javascript
businessType: 'retail' // Default for existing users
restaurantSettings: {
  enabled: false // Default
}
```

### 10.2 Feature Flags

Use feature flags for gradual rollout:
```javascript
{
  restaurantMode: {
    enabled: true,
    rolloutPercentage: 0, // Start at 0%, increase gradually
    betaUsers: ['user-id-1', 'user-id-2'], // Early access
  }
}
```

### 10.3 Rollout Plan

**Phase 1: Internal Testing (Week 1-2)**
- Enable for development team
- Internal QA testing
- Bug fixes

**Phase 2: Beta Testing (Week 3-4)**
- Enable for selected beta users (5-10 restaurants)
- Gather feedback
- Iterate on issues

**Phase 3: Limited Release (Week 5-6)**
- Enable for 25% of new users
- Monitor performance and errors
- Collect user feedback

**Phase 4: General Availability (Week 7+)**
- Enable for all users
- Marketing announcement
- Documentation release
- Training materials

### 10.4 Documentation

**User Documentation:**
- Business type selection guide
- Restaurant mode overview
- Table management guide
- Kitchen display guide
- Menu modifiers guide
- Tipping configuration
- Server management guide
- Restaurant reports guide

**Developer Documentation:**
- Architecture overview
- API documentation
- Component library
- State management guide
- Testing guide
- Contributing guide

### 10.5 Training & Support

**Training Materials:**
- Video tutorials for each feature
- Quick start guide
- Best practices guide
- Troubleshooting guide

**Support:**
- Updated FAQ
- Support ticket system
- Live chat support
- Community forum

---

## 11. Success Metrics

### 11.1 Technical Metrics

- Zero critical bugs in production
- < 100ms latency for order updates
- 99.9% uptime
- 80%+ test coverage
- < 2s page load time

### 11.2 Business Metrics

- Number of restaurants using the system
- Average orders per day
- Customer satisfaction score (CSAT)
- Feature adoption rates
- User retention

### 11.3 User Metrics

- Time to complete order (dine-in)
- Time to complete order (takeout)
- Time to complete QR order (customer)
- Error rate in order entry
- Kitchen order completion time
- QR ordering adoption rate
- Customer satisfaction with QR ordering
- User satisfaction ratings

---

## 12. Future Enhancements

### 12.1 Phase 2 Features (Post-Launch)

1. **Reservation System**
   - Online reservations
   - Table booking
   - Wait list management
   - SMS notifications

2. **Enhanced QR Ordering Features**
   - Customer accounts (save favorites, payment methods)
   - Loyalty points for QR orders
   - Split payment via QR
   - Group ordering (multiple phones, same table)
   - Multi-language menu
   - Voice ordering integration
   - Allergen filtering

3. **Delivery Platform Integration**
   - Integration with UberEats, DoorDash, GrubHub
   - Unified order management
   - Commission tracking

4. **Advanced Analytics**
   - Predictive analytics
   - Demand forecasting
   - Staff optimization
   - Menu engineering

4. **Customer App**
   - Mobile ordering
   - Loyalty program
   - Reservations
   - Payment

5. **Multi-language Menu**
   - QR code menu
   - Multiple language support
   - Digital menu board

### 12.2 Other Business Types

Consider adding support for:
- Coffee shops / Cafes
- Bars / Nightclubs
- Food trucks
- Salons / Spas
- Gyms / Fitness centers

---

## 13. Risk Assessment & Mitigation

### 13.1 Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| State management complexity | High | Medium | Thorough testing, use Immer for immutability |
| Performance with many orders | High | Medium | Pagination, virtual scrolling, caching |
| Real-time sync issues | Medium | Medium | WebSocket fallback, offline support |
| Hardware integration issues | Medium | Low | Thorough hardware testing, fallback options |

### 13.2 Business Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| User confusion | High | Medium | Clear UI, onboarding, documentation |
| Feature overload | Medium | High | Progressive disclosure, optional features |
| Restaurant adoption | High | Medium | Beta testing, user feedback, iteration |
| Support burden | Medium | High | Good documentation, training, FAQ |

### 13.3 User Experience Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Complex workflows | High | High | User testing, simplification, shortcuts |
| Learning curve | Medium | High | Onboarding, tooltips, help system |
| Mobile usability | High | Medium | Responsive design, mobile testing |

---

## 14. Appendices

### Appendix A: Restaurant Categories
```javascript
const restaurantCategories = [
  { id: 'appetizers', name: 'Appetizers', icon: '🥗' },
  { id: 'salads', name: 'Salads', icon: '🥙' },
  { id: 'soups', name: 'Soups', icon: '🍲' },
  { id: 'main-course', name: 'Main Course', icon: '🍽️' },
  { id: 'seafood', name: 'Seafood', icon: '🦞' },
  { id: 'meat', name: 'Meat', icon: '🥩' },
  { id: 'poultry', name: 'Poultry', icon: '🍗' },
  { id: 'pasta', name: 'Pasta', icon: '🍝' },
  { id: 'pizza', name: 'Pizza', icon: '🍕' },
  { id: 'sides', name: 'Sides', icon: '🍟' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' },
  { id: 'beverages', name: 'Beverages', icon: '🥤' },
  { id: 'alcoholic', name: 'Alcoholic Beverages', icon: '🍷' },
  { id: 'coffee-tea', name: 'Coffee & Tea', icon: '☕' },
  { id: 'kids', name: 'Kids Menu', icon: '🧒' },
  { id: 'specials', name: 'Specials', icon: '⭐' },
];
```

### Appendix B: Dietary Tags
```javascript
const dietaryTags = [
  { id: 'vegetarian', name: 'Vegetarian', icon: '🥬', color: '#10B981' },
  { id: 'vegan', name: 'Vegan', icon: '🌱', color: '#10B981' },
  { id: 'gluten-free', name: 'Gluten Free', icon: '🌾', color: '#F59E0B' },
  { id: 'dairy-free', name: 'Dairy Free', icon: '🥛', color: '#3B82F6' },
  { id: 'nut-free', name: 'Nut Free', icon: '🥜', color: '#EF4444' },
  { id: 'spicy', name: 'Spicy', icon: '🌶️', color: '#DC2626' },
  { id: 'halal', name: 'Halal', icon: '🕌', color: '#8B5CF6' },
  { id: 'kosher', name: 'Kosher', icon: '✡️', color: '#6366F1' },
  { id: 'organic', name: 'Organic', icon: '🌿', color: '#059669' },
];
```

### Appendix C: Order Status Colors
```javascript
const orderStatusColors = {
  pending: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  confirmed: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  preparing: { bg: '#FED7AA', text: '#9A3412', border: '#FDBA74' },
  ready: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  served: { bg: '#E0E7FF', text: '#3730A3', border: '#C7D2FE' },
  completed: { bg: '#D1D5DB', text: '#1F2937', border: '#9CA3AF' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
};
```

### Appendix D: Table Status Colors
```javascript
const tableStatusColors = {
  available: { bg: '#D1FAE5', text: '#065F46', border: '#6EE7B7' },
  occupied: { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  reserved: { bg: '#DBEAFE', text: '#1E40AF', border: '#93C5FD' },
  cleaning: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
};
```

---

## 15. Glossary

- **Business Type**: The operational mode of the POS system (retail or restaurant)
- **Course**: A stage in a multi-course meal (appetizer, main, dessert)
- **Dine-in**: Service type where customers eat at the restaurant
- **Floor Plan**: Visual layout of tables and sections in a restaurant
- **KDS**: Kitchen Display System - screen showing orders for kitchen staff
- **Modifier**: Customization option for menu items (e.g., add cheese, no onions)
- **Service Type**: How the order is fulfilled (dine-in, takeout, delivery)
- **Split Payment**: Dividing the bill among multiple payers
- **Station**: Kitchen work area (e.g., grill, bar, dessert)
- **Table Turnover**: Time between seating and clearing a table
- **Takeout**: Service type where customers order food to go
- **Tip Pool**: Shared tips distributed among staff

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-11-12 | System | Initial plan created |

**Approval:**

- [ ] Product Owner
- [ ] Technical Lead
- [ ] UX Lead
- [ ] QA Lead

**Next Review Date:** TBD after Phase 1 completion

---

**End of Document**
