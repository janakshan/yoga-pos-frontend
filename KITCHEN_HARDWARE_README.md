# Kitchen Hardware Support

Comprehensive kitchen hardware integration for the Yoga POS system, including multi-printer routing, customer pagers, displays, and expeditor functionality.

## Features

### 1. Kitchen Printer System
- **Multi-Printer Support**: Configure multiple kitchen printers with different connection types (USB, Network, Serial)
- **Smart Routing**: Route orders to specific printers based on kitchen station assignments
- **Priority-Based Failover**: Automatically fail over to backup printers if primary printers are offline
- **ESC/POS Protocol**: Full support for thermal printer ESC/POS commands
- **Print Queue Management**: Queue management with automatic retry
- **Bump Ticket Printing**: Special expeditor tickets for order tracking

### 2. Pager/Buzzer System
- **Customer Pagers**: Support for guest paging systems with multiple connection types
- **Kitchen Buzzers**: Alert kitchen staff when orders need attention
- **Pattern-Based Alerts**: Different buzzer patterns for various alert types (order ready, urgent, attention, reminder)
- **Active Pager Tracking**: Track which pagers are currently active and assigned to orders
- **History Logging**: Complete history of all pager activations

### 3. Customer Display
- **Real-time Updates**: Display items and totals to customers as they're entered
- **Configurable Layout**: Support for 2-4 line displays with 16-40 columns
- **Multiple Connection Types**: Serial, USB, Network, or Bluetooth
- **Brightness Control**: Adjustable brightness levels (0-100%)
- **Standard Messages**: Pre-configured welcome, thank you, and custom messages

### 4. Expeditor Display
- **Full-Screen Interface**: Dedicated display for expeditor station
- **Order Readiness Overview**: Visual progress indicators for all active orders
- **Multi-Station View**: See order items grouped by kitchen station
- **Priority Management**: Sort and filter by priority, age, and readiness
- **Quick Actions**: Bump orders, page customers, print tickets, and rush orders
- **Auto-Advance**: Automatically advance to next order after bumping

## Installation

All hardware services are included in the project. No additional dependencies required beyond the existing project setup.

## Configuration

### Printer Configuration

Configure printers in the Kitchen Display settings:

```javascript
const printerConfig = {
  name: 'Hot Kitchen Printer',
  connectionType: 'network', // 'usb', 'network', 'serial'
  ipAddress: '192.168.1.101',
  port: 9100,
  paperWidth: 32, // characters
  autoCut: true,
  enabled: true,
};
```

### Printer Routing

Set up routing rules to direct orders to appropriate printers:

```javascript
const routingRule = {
  station: 'hot_kitchen',
  printerName: 'Hot Kitchen Printer',
  priority: 1, // Higher priority = primary printer
  enabled: true,
};
```

### Pager System

Configure the pager/buzzer system:

```javascript
const pagerConfig = {
  enabled: true,
  systemType: 'network', // 'serial', 'usb', 'network', 'api'
  ipAddress: '192.168.1.200',
  port: 8080,
  baudRate: 9600, // for serial connections
  apiEndpoint: '', // for cloud-based systems
  apiKey: '',
};
```

### Customer Display

Configure customer-facing display:

```javascript
const displayConfig = {
  enabled: true,
  connectionType: 'serial',
  baudRate: 9600,
  lines: 2,
  columns: 20,
  brightness: 80,
};
```

## Usage

### Using the Hardware Hook

```javascript
import { useKitchenHardware } from '@/features/kitchen-display/hooks/useKitchenHardware';

function KitchenComponent() {
  const {
    printers,
    pager,
    customerDisplay,
    initializeHardware,
    printOrder,
    pageCustomer,
    updateCustomerDisplay,
  } = useKitchenHardware();

  // Initialize hardware on mount
  useEffect(() => {
    const config = {
      printers: [...printerConfigs],
      printerRouting: [...routingRules],
      pager: pagerConfig,
      customerDisplay: displayConfig,
    };

    initializeHardware(config);
  }, []);

  // Print an order
  const handlePrintOrder = async (order) => {
    try {
      const result = await printOrder(order, {
        copies: 1,
        priority: 'normal',
      });
      console.log('Print result:', result);
    } catch (error) {
      console.error('Print failed:', error);
    }
  };

  // Page customer when order is ready
  const handlePageCustomer = async (order) => {
    try {
      await pageCustomer(order);
    } catch (error) {
      console.error('Paging failed:', error);
    }
  };

  return (
    // Component JSX
  );
}
```

### Using the Expeditor Display

```javascript
import ExpeditorDisplay from '@/features/kitchen-display/components/ExpeditorDisplay';

function ExpeditorStation() {
  const orders = useOrdersStore((state) => state.activeOrders);
  const { printBumpTicket, pageCustomer, buzzKitchen } = useKitchenHardware();

  const handleBumpOrder = async (order) => {
    // Mark order as completed/served
    await completeOrder(order.id);
  };

  return (
    <ExpeditorDisplay
      orders={orders}
      onBumpOrder={handleBumpOrder}
      onPrintBumpTicket={printBumpTicket}
      onPageCustomer={pageCustomer}
      onBuzzKitchen={buzzKitchen}
      pagerEnabled={true}
    />
  );
}
```

### Hardware Configuration UI

```javascript
import HardwareConfig from '@/features/kitchen-display/components/HardwareConfig';

function SettingsPage() {
  const [config, setConfig] = useState(currentHardwareConfig);
  const { testPrinter, testPager, testCustomerDisplay } = useKitchenHardware();

  const handleSave = (newConfig) => {
    // Save to backend/local storage
    saveHardwareConfig(newConfig);
    setConfig(newConfig);
  };

  const handleTest = async (type, data) => {
    if (type === 'printer') {
      await testPrinter(data);
    } else if (type === 'pager') {
      await testPager(data);
    } else if (type === 'customerDisplay') {
      await testCustomerDisplay();
    }
  };

  return (
    <HardwareConfig
      currentConfig={config}
      onSave={handleSave}
      onTest={handleTest}
      hardwareStatus={{
        printers: { 'Hot Kitchen Printer': 'online' },
        pager: 'online',
        customerDisplay: 'offline',
      }}
    />
  );
}
```

## API Reference

### Kitchen Printer Service

#### `initialize(printerConfigs)`
Initialize multiple printers with configurations.

**Returns:** `Promise<{connected: string[], failed: Array}>`

#### `printOrder(order, options)`
Print order to appropriate printer(s) based on routing rules.

**Options:**
- `stationFilter`: Only print items from specific station
- `copies`: Number of copies to print (default: 1)
- `priority`: Print priority ('normal', 'high', 'urgent')

**Returns:** `Promise<{success: Array, failed: Array}>`

#### `printBumpTicket(order, printerName)`
Print expeditor bump ticket.

#### `testPrint(printerName)`
Test print to verify printer connection.

### Pager Service

#### `initialize(settings)`
Initialize pager system with configuration.

**Returns:** `Promise<boolean>`

#### `page(pagerNumber, options)`
Activate a pager.

**Options:**
- `mode`: 'vibrate', 'beep', 'flash', 'all'
- `duration`: Duration in seconds (default: 30)
- `intensity`: 'low', 'medium', 'high'
- `orderId`: Associated order ID
- `tableNumber`: Table number

**Returns:** `Promise<Object>`

#### `pageOrderReady(order)`
Convenience method to page customer when order is ready.

#### `buzzKitchen(station, buzzerType)`
Activate kitchen buzzer for specific station.

**Buzzer Types:** 'order_ready', 'urgent', 'attention', 'reminder'

### Customer Display Service

#### `initialize(settings)`
Initialize customer display.

**Returns:** `Promise<boolean>`

#### `displayMessage(line1, line2)`
Display custom message.

#### `displayItem(itemName, price, currency)`
Display item being added to order.

#### `displayTotal(total, currency)`
Display order total.

#### `displayWelcome()` / `displayThankYou()`
Display standard messages.

## Hardware Support

### Supported Printers
- Epson TM series (ESC/POS)
- Star Micronics
- Citizen
- Bixolon
- Any ESC/POS compatible thermal printer

### Supported Connection Types
- **USB**: Web USB API (requires user permission)
- **Network**: Raw TCP/IP connection (port 9100 standard)
- **Serial**: Web Serial API (RS-232/485)
- **Bluetooth**: Web Bluetooth API (limited support)

### Browser Requirements
- **Chrome/Edge 89+**: Full support for USB, Serial, Bluetooth
- **Firefox**: Network printers only
- **Safari**: Limited hardware API support

## Troubleshooting

### Printers Not Connecting

1. **Network Printers**:
   - Verify IP address and port (usually 9100)
   - Check firewall settings
   - Ensure printer is on same network

2. **USB Printers**:
   - Browser must support Web USB API
   - User must grant permission
   - Check USB cable and connection

3. **Serial Printers**:
   - Verify baud rate matches printer (usually 9600 or 19200)
   - Check COM port availability
   - Ensure correct serial cable (null modem vs straight-through)

### Pager System Issues

1. Check connection type matches your hardware
2. Verify pager numbers are in valid range
3. Test individual pager first before full deployment
4. Ensure pager base station is powered and connected

### Display Issues

1. Verify character encoding (ASCII for most displays)
2. Check display dimensions (lines x columns)
3. Test with simple message first
4. Adjust brightness if display is too dim

## File Structure

```
src/
├── services/hardware/
│   ├── kitchenPrinterService.js    # Multi-printer management
│   ├── pagerService.js              # Pager/buzzer system
│   ├── printerService.js            # Receipt printer (existing)
│   └── customerDisplayService.js    # Customer display (existing)
│
├── features/kitchen-display/
│   ├── components/
│   │   ├── ExpeditorDisplay.jsx    # Full-screen expeditor interface
│   │   ├── HardwareConfig.jsx      # Hardware configuration UI
│   │   ├── OrderCard.jsx           # Order display card
│   │   └── ...
│   │
│   ├── hooks/
│   │   ├── useKitchenHardware.js   # Hardware integration hook
│   │   └── useKitchenDisplay.js    # Kitchen display hook
│   │
│   ├── types/
│   │   └── kitchen.types.js        # Types, constants, configs
│   │
│   └── store/
│       └── kitchenDisplaySlice.js  # Zustand store with hardware state
│
└── KITCHEN_HARDWARE_README.md      # This file
```

## Future Enhancements

- [ ] Cloud-based printer management
- [ ] Mobile app integration for pager notifications
- [ ] Video kitchen display streaming
- [ ] AI-powered order routing optimization
- [ ] Multi-location printer management
- [ ] Advanced analytics and reporting
- [ ] Voice alerts for kitchen staff
- [ ] Integration with third-party delivery services

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify hardware configuration in settings
3. Test hardware individually before full integration
4. Consult ESC/POS printer manual for specific commands

## License

Part of Yoga POS Frontend - All rights reserved
