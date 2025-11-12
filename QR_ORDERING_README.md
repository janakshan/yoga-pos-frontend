# QR Code Table Ordering System

A comprehensive QR code-based ordering system for restaurants, built with React, Zustand, and modern web technologies.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Components](#components)
- [API Integration](#api-integration)
- [PWA Configuration](#pwa-configuration)
- [Real-time Updates](#real-time-updates)
- [Deployment](#deployment)
- [Security](#security)

## Overview

The QR Code Table Ordering System allows restaurants to provide contactless ordering experiences to their customers. Customers can scan a QR code at their table, browse the menu, customize items, place orders, and track order status in real-time - all from their mobile devices.

## Features

### Customer-Facing Features

- **QR Code Scanning**: Scan QR code to start ordering session
- **Mobile-Optimized Menu**: Beautiful, responsive menu interface
- **Product Browsing**: Browse menu by categories with search functionality
- **Customization**: Select modifiers and add special instructions
- **Shopping Cart**: Add, remove, and modify cart items
- **Order Tracking**: Real-time order status updates
- **Call Server**: Request server assistance with one tap
- **Request Bill**: Request bill directly from the app
- **Multiple Payment Methods**: Cash, card, and online payment options
- **PWA Support**: Install as app for app-like experience
- **Offline Capability**: Browse menu even without internet

### Admin Features

- **QR Code Management**: Generate, activate, deactivate, and manage QR codes
- **QR Code Generator**: Customize QR code appearance and settings
- **Analytics Dashboard**: Track scans, sessions, orders, and revenue
- **Session Management**: Monitor active customer sessions
- **Order Management**: View and manage orders from QR sessions
- **Table Configuration**: Configure ordering settings per table
- **Download & Print**: Download or print QR codes for tables

## Architecture

### Project Structure

```
src/features/qr-ordering/
├── components/
│   ├── admin/
│   │   ├── QRCodeGenerator.jsx      # QR code creation interface
│   │   ├── QRCodeList.jsx           # QR code management dashboard
│   │   └── QRAnalyticsDashboard.jsx # Analytics and insights
│   └── customer/
│       ├── QRLanding.jsx            # Landing page after QR scan
│       ├── MobileMenu.jsx           # Mobile menu interface
│       ├── ProductCard.jsx          # Product display card
│       ├── ProductModal.jsx         # Product details & modifiers
│       ├── CartDrawer.jsx           # Shopping cart drawer
│       ├── Checkout.jsx             # Order review & payment
│       └── OrderTracking.jsx        # Real-time order tracking
├── services/
│   ├── qrService.js                 # QR code & session management
│   └── socketService.js             # Real-time communication
├── store/
│   └── qrOrderingSlice.js           # Zustand state management
└── types/
    └── qr.types.js                  # TypeScript-style type definitions
```

### Tech Stack

- **Frontend**: React 18 with JSX
- **State Management**: Zustand with Immer
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **QR Generation**: qrcode library
- **Real-time**: Socket.io Client
- **PWA**: Vite PWA Plugin
- **Notifications**: React Hot Toast
- **Icons**: Heroicons

## Installation

### Prerequisites

- Node.js 16+ and npm
- Modern web browser
- (Optional) Backend server with Socket.io for real-time features

### Setup

1. **Install Dependencies**

```bash
npm install
```

The following packages are already included:
- `qrcode` - QR code generation
- `socket.io-client` - Real-time communication
- `vite-plugin-pwa` - PWA support

2. **Environment Variables**

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

3. **Start Development Server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

### For Restaurant Administrators

#### 1. Generate QR Codes

1. Navigate to **QR Codes** in the admin panel
2. Click **Create QR Code**
3. Select a table
4. Configure settings:
   - QR code appearance (size, colors, error correction)
   - Ordering settings (pricing, modifiers, session timeout)
   - Time restrictions (operating hours, allowed days)
5. Click **Generate QR Code**
6. Download or print the QR code

#### 2. Manage QR Codes

- **View All Codes**: See all generated QR codes with stats
- **Activate/Deactivate**: Toggle QR code availability
- **Regenerate**: Create new code for security
- **Delete**: Remove unused QR codes
- **Analytics**: View performance metrics

#### 3. Monitor Analytics

Navigate to **QR Analytics** to view:
- Total scans and sessions
- Active sessions
- Orders and revenue
- Conversion rates
- Top performing tables
- Peak hours and busy days

### For Customers

#### 1. Scan QR Code

1. Scan the QR code at your table using your phone's camera
2. Landing page opens in browser
3. Enter number of guests
4. (Optional) Provide contact information
5. Click **View Menu**

#### 2. Browse Menu

- Search for items using the search bar
- Filter by category
- View product details, images, and prices
- Check allergen information

#### 3. Add Items to Cart

1. Tap on a product card
2. Select modifiers if available
3. Add special instructions
4. Adjust quantity
5. Click **Add to Cart**

#### 4. Review Cart

- View cart by tapping the cart icon
- Modify quantities
- Remove items
- See order total with tax

#### 5. Checkout

1. Click **Proceed to Checkout**
2. Review order summary
3. Enter/confirm contact information
4. Select payment method:
   - Cash (pay when server arrives)
   - Card (contactless payment)
   - Online (Stripe/PayPal)
5. Click **Place Order**

#### 6. Track Order

- View real-time order status
- Estimated preparation time
- Order history
- Call server or request bill anytime

## Components

### Admin Components

#### QRCodeGenerator

Generates customizable QR codes for tables.

**Props:**
- `tableId` - Table identifier
- `table` - Table object with metadata
- `onClose` - Callback when closing

**Features:**
- Visual QR code preview
- Customizable appearance
- Settings configuration
- Time-based restrictions
- Download and print options

#### QRCodeList

Manages all QR codes in the system.

**Features:**
- Grid/list view toggle
- Search and filter
- Status indicators
- Quick actions (download, print, activate, delete)
- Analytics preview

#### QRAnalyticsDashboard

Displays analytics and insights.

**Metrics:**
- Total QR codes and scans
- Active sessions
- Orders and revenue
- Conversion rates
- Performance by table
- Time-based analysis

### Customer Components

#### QRLanding

Entry point after scanning QR code.

**URL:** `/qr/:code`

**Features:**
- QR code validation
- Guest count selection
- Customer information form
- Feature highlights
- Session initialization

#### MobileMenu

Main menu browsing interface.

**Features:**
- Category navigation
- Product grid
- Search functionality
- Cart preview
- Quick actions (call server, request bill)

#### ProductModal

Detailed product view with customization.

**Features:**
- Product images and description
- Modifier selection
- Special instructions
- Quantity controls
- Allergen warnings
- Nutritional information

#### CartDrawer

Sliding drawer for cart management.

**Features:**
- Item list with modifiers
- Quantity adjustment
- Remove items
- Order totals
- Checkout button

#### Checkout

Order review and payment selection.

**Features:**
- Order summary
- Customer information
- Payment method selection
- Order placement
- Loading states

#### OrderTracking

Real-time order status tracking.

**Features:**
- Order status timeline
- Estimated time
- Order details
- Quick actions
- Multiple orders support

## API Integration

The system uses a service-based architecture for API integration.

### QR Service (`qrService.js`)

**QR Code Operations:**
```javascript
import { createTableQRCodeService, getQRCodes } from '@/features/qr-ordering/services/qrService';

// Create QR code
const qrCode = await createTableQRCodeService({
  tableId: 'table-1',
  tableNumber: '10',
  settings: {
    allowOrdering: true,
    showPrices: true
  }
});

// Get all QR codes
const qrCodes = await getQRCodes({ status: 'active' });
```

**Session Management:**
```javascript
import { createSession, updateSession } from '@/features/qr-ordering/services/qrService';

// Create session
const session = await createSession(qrCode, {
  customerCount: 2,
  customerName: 'John Doe'
});

// Update session
const updated = await updateSession(sessionId, {
  status: 'ordering'
});
```

**Cart Operations:**
```javascript
import { addToCart, removeFromCart } from '@/features/qr-ordering/services/qrService';

// Add item to cart
await addToCart(sessionId, cartItem);

// Remove item
await removeFromCart(sessionId, itemId);
```

### Socket Service (`socketService.js`)

**Real-time Communication:**
```javascript
import socketService from '@/features/qr-ordering/services/socketService';

// Connect to socket server
socketService.connect('http://localhost:3000');

// Join session room
socketService.joinSession(sessionId);

// Listen for order updates
socketService.onOrderUpdate((order) => {
  console.log('Order updated:', order);
});

// Emit events
socketService.callServer({ sessionId, message: 'Need help' });
```

## PWA Configuration

### Manifest

The PWA manifest is configured in `vite.config.js`:

```javascript
{
  name: 'Yoga POS - QR Ordering',
  short_name: 'Yoga POS',
  description: 'QR Code Table Ordering System',
  theme_color: '#4F46E5',
  background_color: '#ffffff',
  display: 'standalone',
  orientation: 'portrait'
}
```

### Service Worker

Workbox is configured for caching strategies:

- **Google Fonts**: Cache-first strategy (1 year)
- **Images**: Cache-first strategy (30 days)
- **API**: Network-first strategy (5 minutes)

### Installation

Users can install the app:

1. **Android**: Browser will show "Add to Home Screen" prompt
2. **iOS**: Open in Safari → Share → Add to Home Screen
3. **Desktop**: Look for install icon in address bar

## Real-time Updates

### Socket.io Integration

**Server-side Setup** (example):

```javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  // Join session room
  socket.on('join_room', (room) => {
    socket.join(room);
  });

  // Handle order submission
  socket.on('order:submit', (orderData) => {
    // Process order
    // Emit to kitchen
    io.to('kitchen').emit('order:new', orderData);
    // Emit to customer
    io.to(`session:${orderData.sessionId}`).emit('order:status', {
      status: 'confirmed'
    });
  });

  // Handle server requests
  socket.on('server:call', (request) => {
    // Notify staff
    io.to('staff').emit('server:request', request);
  });
});
```

**Client-side Usage:**

```javascript
// Subscribe to order updates
socketService.onOrderStatusChange((order) => {
  // Update UI with new status
  updateOrderStatus(order);
});

// Submit order
socketService.submitOrder(orderData);
```

## Deployment

### Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist` directory with:
- Minified JavaScript and CSS
- Service worker for PWA
- Manifest file
- Optimized assets

### Deployment Checklist

1. **Environment Variables**
   - Set `VITE_API_BASE_URL` to production API
   - Set `VITE_SOCKET_URL` to production Socket.io server

2. **PWA Assets**
   - Add icon files to `public/`:
     - `pwa-192x192.png`
     - `pwa-512x512.png`
     - `apple-touch-icon.png`
     - `favicon.ico`

3. **HTTPS**
   - PWA requires HTTPS in production
   - Service workers require HTTPS

4. **Backend Integration**
   - Update API endpoints
   - Configure CORS
   - Set up Socket.io server
   - Configure session storage

### Hosting Options

- **Vercel**: Zero-config deployment
- **Netlify**: Automatic HTTPS and CDN
- **AWS S3 + CloudFront**: Scalable static hosting
- **Firebase Hosting**: Fast global CDN

## Security

### Best Practices

1. **Session Management**
   - Generate unique session tokens
   - Set session expiration times
   - Validate sessions server-side
   - Use HTTPS for all communications

2. **QR Code Security**
   - Regenerate QR codes periodically
   - Revoke compromised codes
   - Monitor unusual activity
   - Rate limit QR scans

3. **Data Protection**
   - Sanitize user inputs
   - Validate all data client and server-side
   - Use HTTPS for API calls
   - Encrypt sensitive data

4. **Payment Security**
   - Use PCI-compliant payment processors
   - Never store card details
   - Implement 3D Secure
   - Log all transactions

### Rate Limiting

Implement rate limiting to prevent abuse:

```javascript
// Example rate limiting configuration
const rateLimits = {
  qrScan: {
    maxAttempts: 10,
    windowMs: 60000 // 1 minute
  },
  orderPlacement: {
    maxAttempts: 5,
    windowMs: 300000 // 5 minutes
  }
};
```

## Troubleshooting

### Common Issues

**QR Code Not Scanning**
- Ensure QR code is active
- Check code hasn't expired
- Verify URL is correct
- Test with different QR scanner apps

**Session Expired**
- Sessions timeout after configured duration
- Create new session by scanning QR again
- Check session timeout settings

**Cart Not Updating**
- Verify Socket.io connection
- Check network connectivity
- Clear browser cache
- Ensure session is valid

**PWA Not Installing**
- Use HTTPS (required for PWA)
- Check manifest.json
- Verify service worker is registered
- Clear browser cache

## Future Enhancements

### Planned Features

- [ ] Multi-language support
- [ ] Voice ordering
- [ ] Split bill functionality
- [ ] Loyalty program integration
- [ ] Table-to-table transfers
- [ ] Group ordering
- [ ] Pre-ordering for reservations
- [ ] Dietary filter presets
- [ ] AI-powered recommendations
- [ ] Integration with kitchen display system

### Payment Integrations

- [ ] Stripe integration
- [ ] PayPal integration
- [ ] Apple Pay
- [ ] Google Pay
- [ ] Local payment gateways

## Support

For issues, questions, or feature requests, please:
- Open an issue on GitHub
- Contact support team
- Check documentation

## License

This project is part of the Yoga POS system.

## Credits

Built with:
- React
- Zustand
- Tailwind CSS
- Heroicons
- qrcode.js
- Socket.io
- Vite PWA

---

**Version**: 1.0.0
**Last Updated**: 2025
