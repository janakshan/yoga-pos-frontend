# Kitchen Hardware Implementation Guide

## Quick Reference - File Structure for New Features

### 1. NEW HARDWARE SERVICES (Recommended Extension Points)

```
/src/services/hardware/
├── printerService.js           # [EXISTING] Receipt printer
├── cashDrawerService.js        # [EXISTING] Cash drawer
├── scannerService.js           # [EXISTING] Barcode scanner
├── customerDisplayService.js   # [EXISTING] Customer display
├── kitchenDisplayService.js    # [NEW] Kitchen display controller
├── kitchenPrinterService.js    # [NEW] Kitchen ticket printer
└── index.js                    # [UPDATE] Export new services
```

### 2. KITCHEN DISPLAY FEATURE EXTENSIONS

```
/src/features/kitchen-display/
├── components/
│   ├── KitchenDisplay.jsx           # [EXISTING]
│   ├── OrderCard.jsx                # [EXISTING]
│   ├── OrderTimer.jsx               # [EXISTING]
│   ├── StationSelector.jsx          # [EXISTING]
│   ├── PerformanceMetrics.jsx       # [EXISTING]
│   ├── HardwareStatus.jsx           # [NEW] Hardware status indicator
│   ├── PrinterQueue.jsx             # [NEW] Printer queue display
│   └── HardwareSettings.jsx         # [NEW] Hardware config UI
├── hooks/
│   ├── useKitchenDisplay.js         # [EXISTING]
│   └── useKitchenHardware.js        # [NEW] Hardware-specific hook
├── services/
│   ├── kitchenService.js            # [EXISTING]
│   ├── printerService.js            # [EXISTING]
│   └── hardwareIntegration.js       # [NEW] Hardware integration layer
├── store/
│   └── kitchenDisplaySlice.js       # [EXTEND] Add hardware state
├── types/
│   ├── kitchen.types.js             # [EXISTING]
│   └── hardware.types.js            # [NEW] Hardware type definitions
└── utils/
    └── hardwareUtils.js             # [NEW] Hardware utilities
```

---

## State Management Architecture

### Current KDS State (in Zustand)

```javascript
// File: /src/features/kitchen-display/store/kitchenDisplaySlice.js

kitchenDisplay: {
  // ... existing state
  
  // [NEW] Hardware state section
  hardware: {
    printers: {
      [stationId]: {
        status: 'connected' | 'disconnected' | 'error',
        queue: [{ orderId, itemIds, status, timestamp }],
        lastHeartbeat: timestamp,
        error: null
      }
    },
    displays: {
      [displayId]: {
        status: 'connected' | 'disconnected',
        lastUpdate: timestamp,
        brightness: 100
      }
    },
    healthStatus: 'healthy' | 'warning' | 'critical'
  }
}
```

---

## Service Implementation Pattern

### Hardware Service Template

```javascript
// File: /src/services/hardware/kitchenPrinterService.js

class KitchenPrinterService {
  constructor() {
    this.printers = {};      // Connected printers by station
    this.queue = [];         // Print queue
    this.eventListeners = {};
  }

  /**
   * Connect to printer for kitchen station
   */
  async connectPrinter(stationId, settings) {
    // Implementation using existing printerService
  }

  /**
   * Queue order for printing
   */
  async queueOrder(orderId, stationId, items) {
    // Add to queue, emit event
  }

  /**
   * Process print queue
   */
  async processPrintQueue() {
    // Handle print operations
  }

  /**
   * Get printer status
   */
  getStatus(stationId) {
    // Return printer health
  }

  /**
   * Subscribe to hardware events
   */
  on(event, callback) {
    // Socket.io or custom events
  }
}

export default new KitchenPrinterService();
```

---

## Hook Pattern for Hardware

### Custom Hardware Hook Template

```javascript
// File: /src/features/kitchen-display/hooks/useKitchenHardware.js

import { useEffect, useCallback } from 'react';
import { useStore } from '@/store';
import { kitchenPrinterService } from '../services/kitchenPrinterService';

export const useKitchenHardware = () => {
  // Get hardware state from store
  const hardware = useStore((state) => state.kitchenDisplay.hardware);
  const {
    setHardwareStatus,
    updatePrinterQueue,
    addHardwareError
  } = useStore();

  // Connect printers on mount
  useEffect(() => {
    const stations = useStore((state) => 
      state.kitchenDisplay.stations
    );
    
    stations.forEach(station => {
      kitchenPrinterService.connectPrinter(
        station.id, 
        station.printerSettings
      );
    });

    // Subscribe to hardware events
    kitchenPrinterService.on('printer-status', handlePrinterStatus);
    kitchenPrinterService.on('print-error', handlePrintError);

    return () => {
      kitchenPrinterService.disconnect();
    };
  }, []);

  // Print order handler
  const printOrder = useCallback(async (orderId, stationId) => {
    try {
      await kitchenPrinterService.printOrder(orderId, stationId);
    } catch (error) {
      addHardwareError(error);
    }
  }, []);

  const handlePrinterStatus = (stationId, status) => {
    setHardwareStatus(stationId, status);
  };

  const handlePrintError = (error) => {
    addHardwareError(error);
  };

  return {
    hardware,
    printOrder,
    printerStatus: hardware.printers,
    displayStatus: hardware.displays
  };
};
```

---

## Integration with Existing Kitchen Display

### Extend useKitchenDisplay Hook

```javascript
// File: /src/features/kitchen-display/hooks/useKitchenDisplay.js
// [ADD THIS CODE]

import { useKitchenHardware } from './useKitchenHardware';

export const useKitchenDisplay = () => {
  // ... existing code ...
  
  // New: Add hardware hook
  const hardware = useKitchenHardware();
  
  // Extend with hardware capabilities
  const printOrder = useCallback(
    async (orderId, stationId) => {
      try {
        // API call
        await kitchenService.printOrder(orderId, stationId);
        
        // Hardware call (NEW)
        await hardware.printOrder(orderId, stationId);
        
        toast.success('Order printed');
      } catch (error) {
        // Fallback if hardware fails
        toast.error('Print failed, using fallback');
      }
    },
    [hardware]
  );

  return {
    // ... existing return values ...
    hardware,
    printOrder  // Updated
  };
};
```

---

## Store Slice Extension

### Update kitchenDisplaySlice.js

```javascript
// File: /src/features/kitchen-display/store/kitchenDisplaySlice.js
// [ADD THIS CODE]

const initialState = {
  // ... existing state ...
  
  // NEW: Hardware state
  hardware: {
    printers: {},
    displays: {},
    healthStatus: 'healthy',
    connectionErrors: []
  }
};

export const createKitchenDisplaySlice = (set, get) => ({
  // ... existing actions ...
  
  // NEW: Hardware actions
  setHardwareStatus: (stationId, status) =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.printers[stationId] = status;
      })
    ),

  updatePrinterQueue: (stationId, queue) =>
    set(
      produce((state) => {
        if (state.kitchenDisplay.hardware.printers[stationId]) {
          state.kitchenDisplay.hardware.printers[stationId].queue = queue;
        }
      })
    ),

  addHardwareError: (error) =>
    set(
      produce((state) => {
        state.kitchenDisplay.hardware.connectionErrors.push({
          error: error.message,
          timestamp: new Date().toISOString()
        });
      })
    )
});
```

---

## Component Integration Example

### Add Hardware Status to KitchenDisplay

```javascript
// File: /src/features/kitchen-display/components/KitchenDisplay.jsx
// [ADD THIS CODE]

import { useKitchenHardware } from '../hooks/useKitchenHardware';
import HardwareStatus from './HardwareStatus';

const KitchenDisplay = () => {
  const { hardware, printOrder } = useKitchenDisplay();
  const hardwareInfo = useKitchenHardware();

  return (
    <div className="kitchen-display">
      {/* NEW: Hardware status bar */}
      {hardwareInfo.hardware?.healthStatus !== 'healthy' && (
        <HardwareStatus 
          status={hardwareInfo.hardware}
          onRetry={() => hardwareInfo.reconnect?.()}
        />
      )}

      {/* Existing KDS UI */}
      <div className="order-queue">
        {/* ... */}
      </div>

      {/* NEW: Optional - Printer queue monitor */}
      {showAdvancedSettings && (
        <PrinterQueue printers={hardwareInfo.printerStatus} />
      )}
    </div>
  );
};
```

---

## Settings/Configuration Integration

### Add Hardware Config UI

```javascript
// File: /src/features/settings/components/HardwareSettings.jsx

import { useState, useEffect } from 'react';
import { kitchenService } from '@/features/kitchen-display/services/kitchenService';
import { kitchenPrinterService } from '@/services/hardware/kitchenPrinterService';

const HardwareSettings = () => {
  const [stations, setStations] = useState([]);
  const [testingPrinterId, setTestingPrinterId] = useState(null);

  useEffect(() => {
    loadStations();
  }, []);

  const loadStations = async () => {
    const stationsData = await kitchenService.getStations();
    setStations(stationsData);
  };

  const testPrinter = async (stationId) => {
    setTestingPrinterId(stationId);
    try {
      await kitchenPrinterService.testPrint(stationId);
      // Success
    } catch (error) {
      // Error handling
    } finally {
      setTestingPrinterId(null);
    }
  };

  return (
    <div className="hardware-settings">
      <h2>Kitchen Hardware Configuration</h2>
      {stations.map(station => (
        <div key={station.id} className="station-config">
          <h3>{station.name}</h3>
          
          {/* Printer configuration */}
          <div className="printer-config">
            <label>Printer Name: {station.printerName}</label>
            <button onClick={() => testPrinter(station.id)}>
              {testingPrinterId === station.id ? 'Testing...' : 'Test Print'}
            </button>
          </div>

          {/* Status indicator */}
          <div className="status-indicator">
            Status: <span className={`status-${station.status}`}>
              {station.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HardwareSettings;
```

---

## Real-Time Event Handling with Socket.io

### Hardware Event Integration

```javascript
// File: /src/features/kitchen-display/services/hardwareIntegration.js

import { socketService } from '@/features/qr-ordering/services/socketService';
import { useStore } from '@/store';

export const initializeHardwareEvents = () => {
  const { setHardwareStatus, updatePrinterQueue } = useStore.getState();

  // Listen for printer status changes
  socketService.on('printer:status', (stationId, status) => {
    setHardwareStatus(stationId, status);
  });

  // Listen for print queue updates
  socketService.on('printer:queue-updated', (stationId, queue) => {
    updatePrinterQueue(stationId, queue);
  });

  // Listen for print job completion
  socketService.on('printer:job-complete', (jobId) => {
    // Handle completion
  });

  // Listen for hardware errors
  socketService.on('hardware:error', (error) => {
    useStore.getState().addHardwareError(error);
  });
};

// Call this in App.jsx on mount
export const cleanup = () => {
  socketService.off('printer:status');
  socketService.off('printer:queue-updated');
  socketService.off('printer:job-complete');
  socketService.off('hardware:error');
};
```

---

## Type Definitions

### Hardware Types

```javascript
// File: /src/features/kitchen-display/types/hardware.types.js

/**
 * @typedef {Object} PrinterStatus
 * @property {string} id - Printer ID
 * @property {string} stationId - Associated station
 * @property {'connected'|'disconnected'|'error'} status - Connection status
 * @property {string|null} error - Last error message
 * @property {number} jobsQueued - Number of queued print jobs
 * @property {number} jobsCompleted - Total completed jobs
 * @property {Date} lastHeartbeat - Last successful connection
 * @property {Object} settings - Printer settings
 */

/**
 * @typedef {Object} PrintJob
 * @property {string} id - Job ID
 * @property {string} orderId - Order ID
 * @property {string[]} itemIds - Item IDs to print
 * @property {'pending'|'printing'|'completed'|'error'} status - Job status
 * @property {Date} createdAt - Job creation time
 * @property {Date|null} completedAt - Completion time
 * @property {string|null} error - Error message if failed
 */

/**
 * @typedef {Object} DisplayStatus
 * @property {string} id - Display ID
 * @property {'connected'|'disconnected'} status - Connection status
 * @property {number} brightness - Display brightness (0-100)
 * @property {Object} currentDisplay - Current content being displayed
 */

/**
 * @typedef {Object} HardwareHealth
 * @property {'healthy'|'warning'|'critical'} status - Overall status
 * @property {PrinterStatus[]} printers - Printer statuses
 * @property {DisplayStatus[]} displays - Display statuses
 * @property {Object[]} errors - Recent errors
 */

export const HARDWARE_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};

export const PRINT_JOB_STATUS = {
  PENDING: 'pending',
  PRINTING: 'printing',
  COMPLETED: 'completed',
  ERROR: 'error'
};

export const HEALTH_STATUS = {
  HEALTHY: 'healthy',
  WARNING: 'warning',
  CRITICAL: 'critical'
};
```

---

## Error Handling & Fallbacks

### Graceful Degradation Pattern

```javascript
// File: /src/features/kitchen-display/services/hardwareIntegration.js

export const printOrderWithFallback = async (orderId, stationId) => {
  try {
    // Try hardware printer
    await kitchenPrinterService.printOrder(orderId, stationId);
    return { success: true, method: 'hardware' };
  } catch (hardwareError) {
    console.warn('Hardware print failed:', hardwareError);
    
    try {
      // Fallback: Browser print
      const order = await kitchenService.getOrder(orderId);
      const printWindow = window.open('', '_blank');
      printWindow.document.write(generateOrderHTML(order));
      printWindow.print();
      return { success: true, method: 'browser' };
    } catch (browserError) {
      console.error('All print methods failed:', browserError);
      return { 
        success: false, 
        error: 'Print failed on both hardware and browser' 
      };
    }
  }
};
```

---

## Testing Hardware Integration

### Test Strategy

```javascript
// File: /src/test/hardware.test.js

describe('Kitchen Hardware Integration', () => {
  test('Should connect to kitchen printer', async () => {
    const service = kitchenPrinterService;
    const connected = await service.connectPrinter('hot-kitchen-1');
    expect(connected).toBe(true);
  });

  test('Should queue order for printing', async () => {
    const service = kitchenPrinterService;
    await service.queueOrder('order-123', 'hot-kitchen-1', [1, 2, 3]);
    const queue = service.getQueue('hot-kitchen-1');
    expect(queue.length).toBe(1);
  });

  test('Should handle printer disconnection gracefully', async () => {
    const service = kitchenPrinterService;
    service.setPrinterStatus('hot-kitchen-1', 'disconnected');
    const fallback = await printOrderWithFallback('order-123');
    expect(fallback.method).toBe('browser');
  });
});
```

---

## Migration Checklist

When implementing kitchen hardware features:

- [ ] Create `/src/services/hardware/kitchenDisplayService.js`
- [ ] Create `/src/services/hardware/kitchenPrinterService.js`
- [ ] Update `/src/services/hardware/index.js` exports
- [ ] Create `/src/features/kitchen-display/hooks/useKitchenHardware.js`
- [ ] Add hardware state to `kitchenDisplaySlice.js`
- [ ] Create `/src/features/kitchen-display/types/hardware.types.js`
- [ ] Add `HardwareStatus.jsx` component
- [ ] Add `PrinterQueue.jsx` component
- [ ] Extend `useKitchenDisplay.js` with hardware methods
- [ ] Add hardware settings UI to settings feature
- [ ] Integrate Socket.io hardware events
- [ ] Add error handling & fallbacks
- [ ] Create unit tests for hardware services
- [ ] Document hardware setup guide for end users

---

## Performance Considerations

1. **Printer Queue Management**
   - Batch multiple orders into single print job
   - Implement print job deduplication
   - Queue size limits to prevent memory issues

2. **Event Throttling**
   - Throttle hardware status updates (every 5 seconds)
   - Debounce printer queue changes (wait for batch)

3. **Connection Pooling**
   - Reuse printer connections
   - Implement connection timeout with reconnect logic
   - Health check heartbeats (every 30 seconds)

4. **State Management**
   - Keep hardware state lean in Zustand
   - Use selectors for granular subscriptions
   - Archive old print jobs regularly

