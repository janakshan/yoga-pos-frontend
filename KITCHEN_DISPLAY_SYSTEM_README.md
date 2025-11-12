# Kitchen Display System (KDS)

A comprehensive, real-time Kitchen Display System for restaurant operations with multi-station support, order tracking, and performance metrics.

## Features

### 🎯 Core Functionality

- **Multi-Station Support**: Configure multiple kitchen stations (Hot Kitchen, Cold Kitchen, Grill, Bar, Dessert, Prep)
- **Real-Time Order Updates**: Socket.io integration for instant order notifications
- **Order Queue Management**: Smart filtering and sorting by priority, time, table, or course
- **Order Aging & Alerts**: Color-coded timer system with configurable thresholds
- **Item-Level Tracking**: Track preparation status for individual order items
- **Course Sequencing**: Organize orders by appetizers, mains, desserts, and beverages
- **Priority Ordering**: Mark orders as urgent, high, normal, or low priority
- **QR Order Integration**: Seamlessly handle orders from QR ordering system

### 📊 Performance Metrics

- **Real-Time Statistics**:
  - Active orders count
  - Pending items count
  - Orders completed
  - Average preparation time
  - Average ticket time
  - On-time percentage
- **Station-Level Metrics**: Performance breakdown by kitchen station
- **Course-Level Metrics**: Analytics by course type
- **Time-Based Reports**: Today, week, and month views

### 🖨️ Kitchen Printer Integration

- **Multi-Printer Support**: Configure different printers for each station
- **Automatic Routing**: Orders automatically route to correct station printers
- **Thermal Receipt Formatting**: Optimized for standard thermal printers
- **Reprint Capability**: Easily reprint orders when needed
- **Test Printing**: Test printer connectivity and configuration

### 🎨 Display Options

- **Grid View**: Card-based layout for comprehensive order details
- **List View**: Vertical list for easy scanning
- **Compact View**: Minimalist view for high-order volumes
- **Customizable Sorting**: By time, priority, table, or course
- **Status Filtering**: Filter by pending, preparing, ready, or all orders

### 🔔 Notifications & Alerts

- **Sound Notifications**: Audio alerts for new orders
- **Visual Alerts**: Flashing indicators for urgent orders
- **Order Aging**: Color-coded timers (green → yellow → orange → red)
- **Configurable Thresholds**: Set custom warning times per station

## Project Structure

```
src/features/kitchen-display/
├── components/
│   ├── KitchenDisplay.jsx        # Main KDS interface
│   ├── OrderCard.jsx              # Order display card
│   ├── OrderTimer.jsx             # Timer with aging colors
│   ├── StationSelector.jsx       # Station filtering
│   └── PerformanceMetrics.jsx    # Metrics dashboard
├── hooks/
│   └── useKitchenDisplay.js      # Main KDS hook
├── services/
│   ├── kitchenService.js         # API service
│   └── printerService.js         # Printer integration
├── store/
│   └── kitchenDisplaySlice.js    # Zustand state management
├── types/
│   └── kitchen.types.js          # TypeScript-style type definitions
└── index.js                      # Feature exports
```

## Installation & Setup

### 1. Dependencies

All required dependencies are already included in the project:
- React 18.3.1
- Zustand 5.0.8 (state management)
- Socket.io-client 4.8.1 (real-time)
- Heroicons (UI icons)
- Tailwind CSS (styling)
- React Hot Toast (notifications)

### 2. Environment Variables

Add to your `.env` file:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
VITE_SOCKET_URL=http://localhost:3000
```

### 3. Access the KDS

Navigate to: `http://localhost:5173/kitchen-display`

## Usage

### Basic Operation

1. **Select a Station**
   - Click "All Stations" to see all orders
   - Or select a specific station to filter orders

2. **Start Preparing**
   - Click "Start Preparing" button on an order card
   - Individual items can be marked as preparing

3. **Mark Items Ready**
   - Click "Ready" button on individual items
   - Or use "Mark All Ready" to complete all items at once

4. **Bump Orders**
   - When all items are ready, click "Serve / Bump Order"
   - This removes the order from the display

### View Modes

- **Grid View** (🟦): Best for detailed order information
- **List View** (☰): Easy vertical scanning
- **Compact View** (⚙️): Maximum orders on screen

### Sorting Options

- **Oldest First**: FIFO queue management
- **Newest First**: Latest orders first
- **Priority**: High-priority orders at top
- **Table Number**: Organized by table
- **Course Sequence**: Appetizers → Mains → Desserts

### Performance Metrics

Click the "Metrics" button to view:
- Current performance statistics
- Historical data
- Station-specific metrics
- On-time performance tracking

## Configuration

### Station Setup

Edit `src/features/kitchen-display/types/kitchen.types.js`:

```javascript
export const DEFAULT_STATIONS = [
  {
    id: 'hot-kitchen-1',
    name: 'Hot Kitchen',
    type: KITCHEN_STATION.HOT_KITCHEN,
    enabled: true,
    printerName: 'Hot Kitchen Printer',
    displayOrder: 1,
    productCategories: ['mains', 'sides'],
    settings: {
      autoAccept: false,
      soundNotification: true,
      warningTime: 10, // minutes
    },
  },
  // Add more stations...
];
```

### Order Aging Thresholds

Configure time-based color alerts:

```javascript
export const ORDER_AGING_THRESHOLDS = {
  WARNING: 10,   // Yellow at 10 minutes
  CRITICAL: 15,  // Orange at 15 minutes
  URGENT: 20,    // Red at 20 minutes
};
```

## API Endpoints

The KDS expects these backend endpoints:

### Orders
- `GET /restaurant-orders/active-kitchen` - Get active kitchen orders
- `PATCH /restaurant-orders/:id/status` - Update order status
- `PATCH /restaurant-orders/:id/items/:itemId/status` - Update item status
- `PATCH /restaurant-orders/:id/priority` - Update order priority

### Kitchen Management
- `GET /kitchen/stations` - Get station configurations
- `PATCH /kitchen/stations/:id` - Update station config
- `GET /kitchen/metrics` - Get performance metrics
- `GET /kitchen/orders-by-course` - Get orders by course

### Printing
- `GET /kitchen/printers` - Get available printers
- `POST /kitchen/print` - Print order
- `POST /kitchen/reprint` - Reprint order
- `POST /kitchen/print-ticket` - Print formatted ticket
- `GET /kitchen/printers/:name/status` - Get printer status

### Socket.io Events

**Emit Events:**
- `join_room` - Join kitchen room for updates
- `leave_room` - Leave kitchen room

**Listen Events:**
- `new_order` - New order received
- `order_update` - Order updated
- `order_status_change` - Order status changed
- `item_status_change` - Item status changed

## State Management

The KDS uses Zustand for state management with the following structure:

```javascript
kitchenDisplay: {
  stations: [],              // Station configurations
  selectedStation: null,     // Current selected station
  kitchenOrders: [],        // All active orders
  filteredOrders: [],       // Filtered by station/status
  orderQueue: [],           // Sorted order queue
  viewMode: 'grid',         // Display mode
  sortBy: 'time_asc',       // Sort option
  filterStatus: 'all',      // Status filter
  metrics: {},              // Performance metrics
  soundEnabled: true,       // Sound notifications
  isLoading: false,         // Loading state
  error: null,              // Error state
}
```

## Customization

### Styling

The KDS uses Tailwind CSS. Customize colors in your `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      kitchen: {
        fresh: '#10b981',      // Green
        warning: '#f59e0b',    // Yellow
        critical: '#f97316',   // Orange
        urgent: '#ef4444',     // Red
      },
    },
  },
}
```

### Sound Notifications

Add custom notification sound:

1. Place audio file in `/public/sounds/kitchen-notification.mp3`
2. The system will play it automatically on new orders

### Keyboard Shortcuts

Add keyboard shortcuts in `KitchenDisplay.jsx`:

```javascript
useEffect(() => {
  const handleKeyPress = (e) => {
    if (e.key === 'F5') {
      e.preventDefault();
      fetchKitchenOrders();
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, [fetchKitchenOrders]);
```

## Troubleshooting

### Orders Not Appearing

1. Check Socket.io connection:
   - Open browser console
   - Look for "Socket connected" message
   - Verify `VITE_SOCKET_URL` in `.env`

2. Check API endpoint:
   - Verify `VITE_API_BASE_URL` is correct
   - Test endpoint: `GET /restaurant-orders/active-kitchen`

3. Check order status:
   - Orders must have status: pending, confirmed, preparing, or ready
   - Orders with status "served" or "completed" won't appear

### Real-Time Updates Not Working

1. Verify Socket.io server is running
2. Check if socket events are emitted from backend:
   - `new_order` - When order created
   - `order_update` - When order modified
   - `order_status_change` - When status changed

3. Check browser console for socket errors

### Printer Issues

1. Verify printer service is configured:
   - Check `/kitchen/printers` endpoint
   - Ensure printer names match station configuration

2. Test printer connection:
   - Use `POST /kitchen/printers/test` endpoint

3. Check printer status:
   - Use `GET /kitchen/printers/:name/status`

## Performance Optimization

### For High Order Volumes

1. **Use Compact View**: Shows more orders on screen
2. **Filter by Station**: Reduce number of orders displayed
3. **Adjust Auto-Refresh**: Increase refresh interval to reduce API calls
4. **Disable Animations**: Remove transitions for better performance

### Memory Management

The KDS automatically:
- Removes completed orders from state
- Limits order history to active orders only
- Uses efficient re-rendering with React memoization

## Integration with Existing Systems

### With QR Ordering System

Orders from QR system are automatically:
- Tagged with `source: 'qr'`
- Include `sessionId` reference
- Display "QR Order" badge
- Route to correct kitchen stations

### With Restaurant Orders

The KDS integrates with existing restaurant order management:
- Uses same order data model
- Shares order status workflow
- Compatible with table management
- Works with floor plan system

## Future Enhancements

Planned features:
- [ ] Voice notifications
- [ ] Multi-language support
- [ ] Kitchen display analytics dashboard
- [ ] Staff performance tracking
- [ ] Recipe/prep instructions display
- [ ] Inventory depletion tracking
- [ ] Photo display for order items
- [ ] Customer allergies/preferences display
- [ ] Integration with kitchen video system

## Support

For issues or questions:
1. Check the [API Documentation](./API_DOCUMENTATION.md)
2. Review [QR Ordering README](./QR_ORDERING_README.md) for integration details
3. Open an issue on GitHub

## License

Part of the Yoga POS Frontend project.

---

**Version**: 1.0.0
**Last Updated**: 2025-11-12
**Author**: Yoga POS Development Team
