# Architecture Visual Summary

## Data Flow & Integration Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        REACT APPLICATION (Frontend)                      │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐ │
│  │                    App.jsx (Root)                                  │ │
│  │          Protected Routes | Public Routes | KDS Route             │ │
│  └────────────────┬─────────────────────────────────────────────────┘ │
│                   │                                                    │
│  ┌────────────────┴─────────────────────────────────────────────────┐ │
│  │                  Features (Domain Modules)                        │ │
│  │                                                                  │ │
│  │  ┌──────────────────────────────────────────────────────────┐   │ │
│  │  │  Kitchen Display Feature                                 │   │ │
│  │  │  /src/features/kitchen-display/                         │   │ │
│  │  │                                                          │   │ │
│  │  │  ┌─────────────────────────────────────────────────┐   │   │ │
│  │  │  │  Components                                      │   │   │ │
│  │  │  │  • KitchenDisplay.jsx (Main UI)                │   │   │ │
│  │  │  │  • OrderCard.jsx                               │   │   │ │
│  │  │  │  • StationSelector.jsx                         │   │   │ │
│  │  │  │  • PerformanceMetrics.jsx                      │   │   │ │
│  │  │  │  • [NEW] HardwareStatus.jsx                    │   │   │ │
│  │  │  │  • [NEW] PrinterQueue.jsx                      │   │   │ │
│  │  │  └─────────────────────────────────────────────────┘   │   │ │
│  │  │                         ↓                               │   │ │
│  │  │  ┌─────────────────────────────────────────────────┐   │   │ │
│  │  │  │  Hooks                                           │   │   │ │
│  │  │  │  • useKitchenDisplay() [EXISTING]              │   │   │ │
│  │  │  │  • [NEW] useKitchenHardware()                  │   │   │ │
│  │  │  └──────────────────┬────────────────────────────┘   │   │ │
│  │  │                     ↓                                 │   │ │
│  │  │  ┌──────────────────────────────────────────────┐    │   │ │
│  │  │  │  Store (Zustand State Management)            │    │   │ │
│  │  │  │  • kitchenDisplay.stations[]                │    │   │ │
│  │  │  │  • kitchenDisplay.orders[]                  │    │   │ │
│  │  │  │  • [NEW] kitchenDisplay.hardware {}         │    │   │ │
│  │  │  │    - printers{}                             │    │   │ │
│  │  │  │    - displays{}                             │    │   │ │
│  │  │  │    - healthStatus                           │    │   │ │
│  │  │  └──────────────────┬───────────────────────────┘    │   │ │
│  │  │                     ↓                                 │   │ │
│  │  │  ┌──────────────────────────────────────────────┐    │   │ │
│  │  │  │  Services                                    │    │   │ │
│  │  │  │  • kitchenService.js [API Calls]           │    │   │ │
│  │  │  │  • [NEW] hardwareIntegration.js             │    │   │ │
│  │  │  └─────────┬──────────────────────────────────┘    │   │ │
│  │  └─────────────┼──────────────────────────────────────┘   │ │
│  │                │                                         │ │
│  │                ↓                                         │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │  Other Features                                  │   │ │
│  │  │  • restaurant-orders/                           │   │ │
│  │  │  • products/                                    │   │ │
│  │  │  • settings/ [HARDWARE CONFIG]                 │   │ │
│  │  │  • pos/                                         │   │ │
│  │  │  • qr-ordering/                                │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           Core Services Layer                           │ │
│  │                                                        │ │
│  │  ┌───────────────────────────────────────────────┐   │ │
│  │  │  Hardware Services (/src/services/hardware/)  │   │ │
│  │  │  • [EXISTING] printerService.js             │   │ │
│  │  │  • [EXISTING] cashDrawerService.js          │   │ │
│  │  │  • [EXISTING] scannerService.js             │   │ │
│  │  │  • [EXISTING] customerDisplayService.js     │   │ │
│  │  │  • [NEW] kitchenDisplayService.js           │   │ │
│  │  │  • [NEW] kitchenPrinterService.js           │   │ │
│  │  └──────────────────┬────────────────────────────┘   │ │
│  │                     ↓                                │ │
│  │  ┌───────────────────────────────────────────────┐   │ │
│  │  │  Axios HTTP Client + Interceptors            │   │ │
│  │  │  (/src/lib/axios.js)                         │   │ │
│  │  │  • Token injection in requests               │   │ │
│  │  │  • 401 refresh token handler                │   │ │
│  │  │  • Error handling                            │   │ │
│  │  └──────────────────┬────────────────────────────┘   │ │
│  │                     ↓                                │ │
│  │  ┌───────────────────────────────────────────────┐   │ │
│  │  │  Socket.io Client                            │   │ │
│  │  │  (/src/features/qr-ordering/services/)      │   │ │
│  │  │  • Real-time order updates                  │   │ │
│  │  │  • Printer status events                    │   │ │
│  │  └───────────────────────────────────────────────┘   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
                ┌───────────────────────────┐
                │   Backend API Server      │
                │   /api/v1/...            │
                │                          │
                │  • /restaurant-orders    │
                │  • /kitchen/             │
                │  • /auth/                │
                │  • /hardware/            │
                └────────┬──────────────────┘
                         ↓
        ┌────────────────────────────────┐
        │   Kitchen Hardware             │
        │                                │
        │  ┌──────────────────────────┐  │
        │  │  Thermal Printer        │  │ ESC/POS Protocol
        │  │  (USB/Network/BT)       │  │◄─── USB, Network, Bluetooth
        │  │  • Order tickets        │  │
        │  │  • Queue management     │  │
        │  └──────────────────────────┘  │
        │                                │
        │  ┌──────────────────────────┐  │
        │  │  Kitchen Display        │  │
        │  │  • Order cards          │  │
        │  │  • Status updates       │  │
        │  │  • Brightness control   │  │
        │  └──────────────────────────┘  │
        │                                │
        │  ┌──────────────────────────┐  │
        │  │  Cash Drawer            │  │
        │  │  • Open/Close control   │  │
        │  │  • Status monitoring    │  │
        │  └──────────────────────────┘  │
        └────────────────────────────────┘
```

---

## State Management Flow

```
                    useKitchenDisplay()
                          ↓
        ┌─────────────────────────────────────┐
        │    Component Requests Data           │
        │  (printOrder, startPreparing, etc)  │
        └──────────────┬──────────────────────┘
                       ↓
        ┌─────────────────────────────────────┐
        │    API Service Calls                 │
        │    kitchenService.printOrder()      │
        └──────────────┬──────────────────────┘
                       ↓
        ┌─────────────────────────────────────┐
        │    Axios HTTP Request                │
        │    POST /restaurant-orders/print     │
        └──────────────┬──────────────────────┘
                       ↓
        ┌─────────────────────────────────────┐
        │    Backend Processes Request         │
        │    • Validates order                │
        │    • Routes to hardware             │
        │    • Returns confirmation           │
        └──────────────┬──────────────────────┘
                       ↓
        ┌─────────────────────────────────────┐
        │    Update Zustand Store              │
        │    state.setKitchenOrders()         │
        │    state.setHardwareStatus()        │
        └──────────────┬──────────────────────┘
                       ↓
        ┌─────────────────────────────────────┐
        │    Component Re-renders              │
        │    Shows updated state              │
        │    Displays printer status          │
        └─────────────────────────────────────┘

           REAL-TIME UPDATES (Socket.io)
                       ↓
        ┌─────────────────────────────────────┐
        │    Server Emits Event                │
        │    socket.emit('order:ready')       │
        └──────────────┬──────────────────────┘
                       ↓
        ┌─────────────────────────────────────┐
        │    Socket Listener Triggers          │
        │    onOrderReady()                   │
        └──────────────┬──────────────────────┘
                       ↓
        ┌─────────────────────────────────────┐
        │    Update Store                      │
        │    state.updateKitchenOrder()      │
        └──────────────┬──────────────────────┘
                       ↓
        ┌─────────────────────────────────────┐
        │    UI Updates Automatically          │
        │    No refresh needed!               │
        └─────────────────────────────────────┘
```

---

## Hardware Integration Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                 Kitchen Display System (KDS)                       │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ORDER FLOW WITH HARDWARE:                                        │
│                                                                    │
│  1. Order Received                                                │
│     └─→ Store: kitchenDisplay.kitchenOrders[] += newOrder        │
│                                                                    │
│  2. Order Marked "Ready"                                          │
│     └─→ Hook: useKitchenHardware.printOrder(orderId)            │
│          └─→ Service: kitchenPrinterService.queueOrder()         │
│               └─→ Store: hardware.printers[].queue += job        │
│                    └─→ Component: PrinterQueue shows update      │
│                                                                    │
│  3. Print Job Sent to Hardware                                    │
│     └─→ ESC/POS commands → USB/Network/Bluetooth                 │
│          └─→ Printer receives & executes                          │
│               └─→ Event: printer:job-complete                    │
│                    └─→ Store: hardware.printers[].jobsCompleted++│
│                         └─→ UI updates status                     │
│                                                                    │
│  4. Error Handling                                                │
│     └─→ Printer offline?                                         │
│          └─→ Fallback: Browser print dialog                      │
│               └─→ Show warning: "Using software printer"         │
│                    └─→ User still gets printed order             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│                 Hardware Status Monitoring                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Every 30 seconds (Health Check):                                │
│                                                                    │
│  KitchenPrinterService                                           │
│    ↓                                                              │
│  Check: socket.emit('printer:heartbeat', stationId)            │
│    ↓                                                              │
│  Server responds with status                                     │
│    ↓                                                              │
│  Update store: hardware.printers[stationId].status               │
│    ↓                                                              │
│  Display indicator:                                              │
│    • GREEN = Connected, ready                                    │
│    • YELLOW = Slow response time                                 │
│    • RED = Disconnected/Error                                    │
│    ↓                                                              │
│  Alert if critical: Show banner in KitchenDisplay UI            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## File Location Quick Reference

```
HARDWARE SERVICES
├── /src/services/hardware/
│   ├── printerService.js              [EXISTING] General receipt printer
│   ├── cashDrawerService.js          [EXISTING] Cash drawer control
│   ├── scannerService.js             [EXISTING] Barcode scanner
│   ├── customerDisplayService.js     [EXISTING] Customer display
│   ├── kitchenDisplayService.js      [NEW] KDS controller
│   ├── kitchenPrinterService.js      [NEW] Kitchen ticket printer
│   └── index.js                       [UPDATE] Exports

KITCHEN DISPLAY FEATURE
├── /src/features/kitchen-display/
│   ├── components/
│   │   ├── KitchenDisplay.jsx         [EXISTING] Main UI
│   │   ├── OrderCard.jsx              [EXISTING]
│   │   ├── StationSelector.jsx        [EXISTING]
│   │   ├── PerformanceMetrics.jsx     [EXISTING]
│   │   ├── HardwareStatus.jsx         [NEW] Status indicator
│   │   └── PrinterQueue.jsx           [NEW] Queue display
│   ├── hooks/
│   │   ├── useKitchenDisplay.js       [EXISTING] Main hook
│   │   └── useKitchenHardware.js      [NEW] Hardware hook
│   ├── services/
│   │   ├── kitchenService.js          [EXISTING] API calls
│   │   ├── printerService.js          [EXISTING]
│   │   └── hardwareIntegration.js     [NEW] Integration layer
│   ├── store/
│   │   └── kitchenDisplaySlice.js     [EXTEND] Add hardware state
│   ├── types/
│   │   ├── kitchen.types.js           [EXISTING]
│   │   └── hardware.types.js          [NEW] Type definitions
│   └── index.js

CONFIGURATION & SETUP
├── /src/features/settings/
│   └── components/
│       └── HardwareSettings.jsx       [NEW] Hardware config UI
├── /src/App.jsx                       [UPDATE] Socket events
└── /.env                              [UPDATE] Hardware config vars
```

---

## Request/Response Flow Example: Printing an Order

```
USER CLICKS "PRINT" BUTTON ON ORDER
         ↓
    Component: OrderCard.jsx
    onClick={() => printOrder(orderId, stationId)}
         ↓
    Hook: useKitchenDisplay()
    action: printOrder(orderId, stationId)
         ↓
    Service: kitchenService.printOrder(orderId, stationId)
         ↓
    ┌─ Axios HTTP Request ─┐
    │ POST /restaurant-orders/print
    │ {
    │   orderId: "order-123",
    │   stationId: "hot-kitchen-1"
    │ }
    └──────────────────────┘
         ↓
    ┌─ Backend Processing ─┐
    │ • Fetch order details
    │ • Format for printer
    │ • Queue to station
    │ • Return success
    └──────────────────────┘
         ↓
    Response: {
      success: true,
      jobId: "job-456",
      stationId: "hot-kitchen-1"
    }
         ↓
    Hook: Update store
    setKitchenOrders([...updated orders])
    updatePrinterQueue(stationId, [...updated queue])
         ↓
    Hardware Service: kitchenPrinterService
    queueOrder(orderId, stationId, items)
         ↓
    Socket.io: Emit print event
    socketService.emit('printer:print-queued', jobId)
         ↓
    ESC/POS Protocol: Format print commands
    \x1b\x40 (Initialize printer)
    \x1b\x61\x01 (Center alignment)
    "ORDER #123"
    [items and formatting]
    \x1d\x56\x00 (Cut paper)
         ↓
    Hardware Device: Receive commands
    USB/Network/Bluetooth transmission
         ↓
    Physical Printer: Execute commands
    Paper ejects with order ticket
         ↓
    Printer Firmware: Send status
    "Print completed" → Socket.io event
         ↓
    Backend: Receive & emit to UI
    socket.emit('printer:job-complete', jobId)
         ↓
    Frontend Socket Listener: Triggered
    onPrintComplete(jobId)
         ↓
    Store Update:
    updatePrinterQueue(stationId, [...removed jobId])
    setHardwareStatus(stationId, 'connected')
         ↓
    Component: Re-render
    Show "Print successful" toast
    Update PrinterQueue component
    Show kitchen staff the printed items
```

---

## Database/State Relationships

```
ORDERS TABLE (Backend)
├── id
├── orderNumber
├── items[]
│   ├── id
│   ├── status (pending, preparing, ready, served)
│   ├── stationId (hot_kitchen, cold_kitchen, etc)
│   └── notes
└── status (pending, preparing, ready, completed)
         ↓ Socket.io broadcast
         ↓
ZUSTAND STORE (Frontend)
├── kitchenDisplay.kitchenOrders[]  (from API)
├── kitchenDisplay.hardware         (hardware status)
│   ├── printers {}
│   │   ├── status
│   │   ├── queue[] (print jobs)
│   │   └── jobsCompleted
│   └── displays {}
└── kitchenDisplay.selectedStation (user selection)
         ↓ Component hooks
         ↓
KITCHEN DISPLAY COMPONENT
├── Shows stations (selector)
├── Shows orders (order cards)
├── Shows hardware status (banner)
└── Shows printer queue (optional)
```

---

## Key Integration Points Checklist

For Kitchen Hardware Implementation:

```
PHASE 1: Foundation
  [ ] Create kitchen hardware services in /src/services/hardware/
  [ ] Extend store with hardware state in kitchenDisplaySlice
  [ ] Create hardware types in kitchen.types.js
  
PHASE 2: UI Integration  
  [ ] Create HardwareStatus component
  [ ] Create PrinterQueue component
  [ ] Create useKitchenHardware hook
  [ ] Extend useKitchenDisplay with hardware calls
  
PHASE 3: Hardware Operations
  [ ] Implement printer connection & heartbeat
  [ ] Implement print queue management
  [ ] Implement graceful fallbacks
  [ ] Add error handling & alerts
  
PHASE 4: Real-Time Sync
  [ ] Integrate Socket.io events for printer status
  [ ] Implement real-time queue updates
  [ ] Add health check broadcasts
  [ ] Emit print completion events
  
PHASE 5: Configuration UI
  [ ] Add HardwareSettings component
  [ ] Create printer connection wizard
  [ ] Add test print functionality
  [ ] Add hardware status dashboard
  
PHASE 6: Testing & Deployment
  [ ] Unit tests for hardware services
  [ ] Integration tests with mock hardware
  [ ] Hardware failure scenario testing
  [ ] Performance load testing
  [ ] Documentation for end-users
```

