/**
 * Kitchen Printer Service
 * Handles multi-printer routing and kitchen ticket printing with ESC/POS protocol
 */

class KitchenPrinterService {
  constructor() {
    this.printers = new Map(); // Map of printer name to printer instance
    this.routingRules = new Map(); // Map of station to printer configuration
    this.printQueue = [];
    this.isProcessingQueue = false;
  }

  /**
   * Initialize kitchen printers
   * @param {Array} printerConfigs - Array of printer configurations
   * @returns {Promise<Object>} Initialization results
   */
  async initialize(printerConfigs) {
    const results = {
      connected: [],
      failed: [],
    };

    for (const config of printerConfigs) {
      try {
        const printer = await this.connectPrinter(config);
        if (printer) {
          this.printers.set(config.name, {
            config,
            device: printer,
            status: 'online',
            lastPrint: null,
            errorCount: 0,
          });
          results.connected.push(config.name);
        } else {
          results.failed.push({ name: config.name, error: 'Connection failed' });
        }
      } catch (error) {
        results.failed.push({ name: config.name, error: error.message });
      }
    }

    return results;
  }

  /**
   * Connect to a single printer
   * @param {Object} config - Printer configuration
   * @returns {Promise<Object>} Printer device
   */
  async connectPrinter(config) {
    const { connectionType, name } = config;

    try {
      if (connectionType === 'usb') {
        return await this.connectUSBPrinter(config);
      } else if (connectionType === 'network') {
        return await this.connectNetworkPrinter(config);
      } else if (connectionType === 'serial') {
        return await this.connectSerialPrinter(config);
      }

      return null;
    } catch (error) {
      console.error(`Failed to connect printer ${name}:`, error);
      throw error;
    }
  }

  /**
   * Connect to USB printer
   */
  async connectUSBPrinter(config) {
    if (!navigator.usb) {
      console.warn('Web USB API not supported');
      return null;
    }

    try {
      const device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: 0x04b8 }, // Epson
          { vendorId: 0x0dd4 }, // Citizen
          { vendorId: 0x154f }, // Star
          { vendorId: 0x0519 }, // Bixolon
        ],
      });

      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      return device;
    } catch (error) {
      console.error('USB printer connection error:', error);
      throw error;
    }
  }

  /**
   * Connect to network printer
   */
  async connectNetworkPrinter(config) {
    const { ipAddress, port } = config;

    try {
      // Test connection
      const response = await fetch(
        `http://${ipAddress}:${port || 9100}/status`,
        { timeout: 5000 }
      );

      if (response.ok) {
        return { type: 'network', ipAddress, port };
      }

      throw new Error('Network printer not responding');
    } catch (error) {
      console.error('Network printer connection error:', error);
      throw error;
    }
  }

  /**
   * Connect to serial printer
   */
  async connectSerialPrinter(config) {
    if (!navigator.serial) {
      console.warn('Web Serial API not supported');
      return null;
    }

    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: config.baudRate || 9600 });

      return port;
    } catch (error) {
      console.error('Serial printer connection error:', error);
      throw error;
    }
  }

  /**
   * Configure printer routing rules
   * @param {Array} rules - Routing rules [{station, printerName, priority}]
   */
  configureRouting(rules) {
    this.routingRules.clear();

    for (const rule of rules) {
      const { station, printerName, priority = 1, enabled = true } = rule;

      if (!this.routingRules.has(station)) {
        this.routingRules.set(station, []);
      }

      this.routingRules.get(station).push({
        printerName,
        priority,
        enabled,
      });
    }

    // Sort by priority (higher priority first)
    for (const [station, printers] of this.routingRules.entries()) {
      this.routingRules.set(
        station,
        printers.sort((a, b) => b.priority - a.priority)
      );
    }
  }

  /**
   * Route order to appropriate printer(s)
   * @param {Object} order - Order object
   * @param {Object} options - Print options
   * @returns {Promise<Object>} Print results
   */
  async printOrder(order, options = {}) {
    const {
      stationFilter = null,
      copies = 1,
      priority = 'normal',
    } = options;

    const results = {
      success: [],
      failed: [],
    };

    // Group items by kitchen station
    const itemsByStation = this.groupItemsByStation(order, stationFilter);

    // Print to each station's configured printer(s)
    for (const [station, items] of Object.entries(itemsByStation)) {
      const printerConfigs = this.routingRules.get(station) || [];
      const enabledPrinters = printerConfigs.filter((p) => p.enabled);

      if (enabledPrinters.length === 0) {
        console.warn(`No printer configured for station: ${station}`);
        results.failed.push({
          station,
          error: 'No printer configured',
        });
        continue;
      }

      // Print to primary printer (highest priority enabled)
      const primaryPrinter = enabledPrinters[0];
      const printerInstance = this.printers.get(primaryPrinter.printerName);

      if (!printerInstance) {
        results.failed.push({
          station,
          printer: primaryPrinter.printerName,
          error: 'Printer not found',
        });
        continue;
      }

      try {
        for (let i = 0; i < copies; i++) {
          await this.printTicket(printerInstance, order, items, station);
        }

        results.success.push({
          station,
          printer: primaryPrinter.printerName,
          items: items.length,
        });
      } catch (error) {
        console.error(
          `Failed to print to ${primaryPrinter.printerName}:`,
          error
        );
        results.failed.push({
          station,
          printer: primaryPrinter.printerName,
          error: error.message,
        });

        // Try backup printers
        if (enabledPrinters.length > 1) {
          const backupResult = await this.tryBackupPrinters(
            enabledPrinters.slice(1),
            order,
            items,
            station,
            copies
          );

          if (backupResult.success) {
            results.success.push(backupResult);
          }
        }
      }
    }

    return results;
  }

  /**
   * Try backup printers if primary fails
   */
  async tryBackupPrinters(backupPrinters, order, items, station, copies) {
    for (const printer of backupPrinters) {
      const printerInstance = this.printers.get(printer.printerName);

      if (!printerInstance) continue;

      try {
        for (let i = 0; i < copies; i++) {
          await this.printTicket(printerInstance, order, items, station);
        }

        return {
          success: true,
          station,
          printer: printer.printerName,
          items: items.length,
          isBackup: true,
        };
      } catch (error) {
        console.error(`Backup printer ${printer.printerName} failed:`, error);
      }
    }

    return { success: false };
  }

  /**
   * Group order items by kitchen station
   */
  groupItemsByStation(order, stationFilter) {
    const groups = {};

    for (const item of order.items) {
      const station = item.kitchenStation || 'default';

      // Apply station filter if specified
      if (stationFilter && station !== stationFilter) {
        continue;
      }

      if (!groups[station]) {
        groups[station] = [];
      }

      groups[station].push(item);
    }

    return groups;
  }

  /**
   * Print kitchen ticket to specific printer
   */
  async printTicket(printerInstance, order, items, station) {
    const { device, config } = printerInstance;

    // Generate ESC/POS commands
    const commands = this.generateKitchenTicket(order, items, station, config);

    // Send to printer
    if (config.connectionType === 'usb') {
      await device.transferOut(1, commands);
    } else if (config.connectionType === 'network') {
      await fetch(
        `http://${device.ipAddress}:${device.port || 9100}/print`,
        {
          method: 'POST',
          body: commands,
          headers: { 'Content-Type': 'application/octet-stream' },
        }
      );
    } else if (config.connectionType === 'serial') {
      const writer = device.writable.getWriter();
      await writer.write(commands);
      writer.releaseLock();
    }

    // Update printer status
    printerInstance.lastPrint = new Date();
    printerInstance.status = 'online';
  }

  /**
   * Generate ESC/POS commands for kitchen ticket
   */
  generateKitchenTicket(order, items, station, config) {
    const encoder = new TextEncoder();
    const commands = [];

    // ESC/POS control codes
    const ESC = 0x1b;
    const GS = 0x1d;
    const LF = 0x0a;

    // Initialize printer
    commands.push(ESC, 0x40);

    // Set character size and alignment
    commands.push(ESC, 0x61, 0x01); // Center align
    commands.push(GS, 0x21, 0x11); // Double size
    commands.push(ESC, 0x45, 0x01); // Bold on

    // Station header
    commands.push(...encoder.encode(station.toUpperCase()));
    commands.push(LF);

    commands.push(ESC, 0x45, 0x00); // Bold off
    commands.push(GS, 0x21, 0x00); // Normal size

    // Separator
    const width = config.paperWidth || 32;
    commands.push(...encoder.encode('='.repeat(width)));
    commands.push(LF);

    // Order information
    commands.push(ESC, 0x61, 0x00); // Left align

    // Order number (large and bold)
    commands.push(GS, 0x21, 0x22); // Triple size
    commands.push(ESC, 0x45, 0x01); // Bold on
    commands.push(...encoder.encode(`#${order.orderNumber || order.id}`));
    commands.push(LF);
    commands.push(ESC, 0x45, 0x00); // Bold off
    commands.push(GS, 0x21, 0x00); // Normal size
    commands.push(LF);

    // Order details
    if (order.tableNumber) {
      commands.push(ESC, 0x45, 0x01); // Bold
      commands.push(...encoder.encode(`TABLE: ${order.tableNumber}`));
      commands.push(ESC, 0x45, 0x00);
      commands.push(LF);
    }

    if (order.serverName) {
      commands.push(...encoder.encode(`Server: ${order.serverName}`));
      commands.push(LF);
    }

    if (order.serviceType) {
      commands.push(...encoder.encode(`Type: ${order.serviceType}`));
      commands.push(LF);
    }

    if (order.customerCount) {
      commands.push(...encoder.encode(`Guests: ${order.customerCount}`));
      commands.push(LF);
    }

    // Priority indicator
    if (order.priority && order.priority !== 'normal') {
      commands.push(LF);
      commands.push(ESC, 0x45, 0x01); // Bold
      commands.push(GS, 0x21, 0x11); // Double size
      commands.push(...encoder.encode(`*** ${order.priority.toUpperCase()} ***`));
      commands.push(GS, 0x21, 0x00);
      commands.push(ESC, 0x45, 0x00);
      commands.push(LF);
    }

    // Time
    const now = new Date();
    commands.push(
      ...encoder.encode(
        `Time: ${now.toLocaleTimeString()}`
      )
    );
    commands.push(LF);

    commands.push(...encoder.encode('-'.repeat(width)));
    commands.push(LF, LF);

    // Items
    items.forEach((item, index) => {
      // Item quantity and name
      commands.push(GS, 0x21, 0x11); // Double size
      commands.push(ESC, 0x45, 0x01); // Bold
      commands.push(...encoder.encode(`${item.quantity}x ${item.name}`));
      commands.push(ESC, 0x45, 0x00);
      commands.push(GS, 0x21, 0x00);
      commands.push(LF);

      // Modifiers
      if (item.modifiers && item.modifiers.length > 0) {
        item.modifiers.forEach((mod) => {
          commands.push(...encoder.encode(`  + ${mod.name}`));
          commands.push(LF);

          if (mod.options) {
            mod.options.forEach((opt) => {
              commands.push(...encoder.encode(`    * ${opt.name}`));
              commands.push(LF);
            });
          }
        });
      }

      // Special notes
      if (item.notes) {
        commands.push(LF);
        commands.push(ESC, 0x45, 0x01); // Bold
        commands.push(...encoder.encode(`  ** ${item.notes.toUpperCase()} **`));
        commands.push(ESC, 0x45, 0x00);
        commands.push(LF);
      }

      // Course timing
      if (item.course && item.course !== 'main') {
        commands.push(...encoder.encode(`  [${item.course.toUpperCase()}]`));
        commands.push(LF);
      }

      commands.push(LF);
    });

    // Order notes
    if (order.notes) {
      commands.push(...encoder.encode('='.repeat(width)));
      commands.push(LF);
      commands.push(ESC, 0x45, 0x01); // Bold
      commands.push(...encoder.encode('ORDER NOTES:'));
      commands.push(ESC, 0x45, 0x00);
      commands.push(LF);
      commands.push(...encoder.encode(order.notes));
      commands.push(LF);
    }

    // Footer
    commands.push(...encoder.encode('='.repeat(width)));
    commands.push(LF);

    commands.push(ESC, 0x61, 0x01); // Center
    commands.push(...encoder.encode(now.toLocaleString()));
    commands.push(LF, LF, LF, LF);

    // Auto cut (if supported)
    if (config.autoCut !== false) {
      commands.push(GS, 0x56, 0x00);
    }

    return new Uint8Array(commands);
  }

  /**
   * Print bump/expedite ticket
   * @param {Object} order - Order object
   * @param {string} printerName - Specific printer name
   */
  async printBumpTicket(order, printerName = 'expeditor') {
    const printerInstance = this.printers.get(printerName);

    if (!printerInstance) {
      throw new Error(`Printer ${printerName} not found`);
    }

    const encoder = new TextEncoder();
    const commands = [];
    const ESC = 0x1b;
    const GS = 0x1d;
    const LF = 0x0a;

    // Initialize
    commands.push(ESC, 0x40);
    commands.push(ESC, 0x61, 0x01); // Center

    // Order number
    commands.push(GS, 0x21, 0x33); // Quadruple size
    commands.push(ESC, 0x45, 0x01); // Bold
    commands.push(...encoder.encode(`#${order.orderNumber || order.id}`));
    commands.push(LF);
    commands.push(ESC, 0x45, 0x00);
    commands.push(GS, 0x21, 0x00);

    // Table
    if (order.tableNumber) {
      commands.push(GS, 0x21, 0x11); // Double
      commands.push(...encoder.encode(`TABLE ${order.tableNumber}`));
      commands.push(LF);
      commands.push(GS, 0x21, 0x00);
    }

    // Ready items count
    const readyItems = order.items.filter((i) => i.status === 'ready').length;
    commands.push(...encoder.encode(`${readyItems}/${order.items.length} Ready`));
    commands.push(LF, LF, LF);

    // Cut
    commands.push(GS, 0x56, 0x00);

    const cmdArray = new Uint8Array(commands);
    await this.printTicket(printerInstance, order, [], 'expeditor', cmdArray);
  }

  /**
   * Test print for a specific printer
   */
  async testPrint(printerName) {
    const printerInstance = this.printers.get(printerName);

    if (!printerInstance) {
      throw new Error(`Printer ${printerName} not found`);
    }

    const testOrder = {
      id: 'TEST',
      orderNumber: 'TEST-001',
      tableNumber: '1',
      serverName: 'System',
      serviceType: 'Test',
      priority: 'normal',
      notes: 'This is a test print',
      items: [
        {
          name: 'Test Item',
          quantity: 1,
          modifiers: [],
          notes: 'Test notes',
        },
      ],
    };

    await this.printTicket(
      printerInstance,
      testOrder,
      testOrder.items,
      'TEST',
      printerInstance.config
    );

    return { success: true, printer: printerName };
  }

  /**
   * Get printer status
   */
  getPrinterStatus(printerName) {
    const printer = this.printers.get(printerName);

    if (!printer) {
      return { status: 'not_found' };
    }

    return {
      name: printerName,
      status: printer.status,
      lastPrint: printer.lastPrint,
      errorCount: printer.errorCount,
      config: printer.config,
    };
  }

  /**
   * Get all printers status
   */
  getAllPrintersStatus() {
    const statuses = [];

    for (const [name, printer] of this.printers.entries()) {
      statuses.push({
        name,
        status: printer.status,
        lastPrint: printer.lastPrint,
        errorCount: printer.errorCount,
        station: this.getStationForPrinter(name),
      });
    }

    return statuses;
  }

  /**
   * Get station assigned to printer
   */
  getStationForPrinter(printerName) {
    for (const [station, printers] of this.routingRules.entries()) {
      if (printers.some((p) => p.printerName === printerName)) {
        return station;
      }
    }
    return null;
  }

  /**
   * Disconnect a specific printer
   */
  async disconnectPrinter(printerName) {
    const printer = this.printers.get(printerName);

    if (!printer) return false;

    try {
      const { device, config } = printer;

      if (config.connectionType === 'usb' && device.close) {
        await device.close();
      } else if (config.connectionType === 'serial' && device.close) {
        await device.close();
      }

      this.printers.delete(printerName);
      return true;
    } catch (error) {
      console.error(`Error disconnecting printer ${printerName}:`, error);
      return false;
    }
  }

  /**
   * Disconnect all printers
   */
  async disconnectAll() {
    const printerNames = Array.from(this.printers.keys());

    for (const name of printerNames) {
      await this.disconnectPrinter(name);
    }
  }

  /**
   * Add print job to queue
   */
  queuePrintJob(order, options) {
    this.printQueue.push({ order, options, timestamp: new Date() });

    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  /**
   * Process print queue
   */
  async processQueue() {
    if (this.isProcessingQueue || this.printQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    while (this.printQueue.length > 0) {
      const job = this.printQueue.shift();

      try {
        await this.printOrder(job.order, job.options);
      } catch (error) {
        console.error('Queue processing error:', error);
      }
    }

    this.isProcessingQueue = false;
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      length: this.printQueue.length,
      isProcessing: this.isProcessingQueue,
      jobs: this.printQueue.map((j) => ({
        orderId: j.order.id,
        timestamp: j.timestamp,
      })),
    };
  }
}

// Export singleton instance
export default new KitchenPrinterService();
