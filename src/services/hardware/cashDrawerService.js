/**
 * Cash Drawer Service
 * Handles cash drawer control
 */

class CashDrawerService {
  constructor() {
    this.connected = false;
    this.settings = null;
    this.printer = null;
  }

  /**
   * Initialize cash drawer
   * @param {Object} settings - Cash drawer settings
   * @param {Object} printerService - Printer service instance (for printer-connected drawers)
   * @returns {boolean} Initialization success
   */
  initialize(settings, printerService = null) {
    this.settings = settings;

    if (settings.enabled) {
      if (settings.connectionType === 'printer') {
        // Cash drawer connected via printer
        this.printer = printerService;
        this.connected = printerService?.connected || false;
        return this.connected;
      } else if (settings.connectionType === 'serial') {
        // Direct serial connection
        return this.connectSerial();
      } else if (settings.connectionType === 'usb') {
        // Direct USB connection
        return this.connectUSB();
      }
    }

    return false;
  }

  /**
   * Connect to serial cash drawer using Web Serial API
   * @returns {Promise<boolean>} Connection success
   */
  async connectSerial() {
    if (!navigator.serial) {
      console.warn('Web Serial API not supported');
      return false;
    }

    try {
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: this.settings.baudRate || 9600 });

      this.port = port;
      this.connected = true;
      return true;
    } catch (error) {
      console.error('Serial connection error:', error);
      return false;
    }
  }

  /**
   * Connect to USB cash drawer using Web USB API
   * @returns {Promise<boolean>} Connection success
   */
  async connectUSB() {
    if (!navigator.usb) {
      console.warn('Web USB API not supported');
      return false;
    }

    try {
      const device = await navigator.usb.requestDevice({
        filters: [], // Add specific vendor IDs for cash drawer manufacturers
      });

      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      this.device = device;
      this.connected = true;
      return true;
    } catch (error) {
      console.error('USB connection error:', error);
      return false;
    }
  }

  /**
   * Open cash drawer
   * @returns {Promise<boolean>} Success status
   */
  async open() {
    if (!this.connected) {
      console.warn('Cash drawer not connected');
      return false;
    }

    try {
      if (this.settings.connectionType === 'printer' && this.printer) {
        // Send open drawer command via printer (ESC/POS)
        return await this.openViaPrinter();
      } else if (this.settings.connectionType === 'serial' && this.port) {
        // Send command via serial port
        return await this.openViaSerial();
      } else if (this.settings.connectionType === 'usb' && this.device) {
        // Send command via USB
        return await this.openViaUSB();
      }

      return false;
    } catch (error) {
      console.error('Cash drawer open error:', error);
      return false;
    }
  }

  /**
   * Open drawer via printer (ESC/POS command)
   * @returns {Promise<boolean>} Success status
   */
  async openViaPrinter() {
    // ESC/POS command to open cash drawer
    // ESC p m t1 t2 (0x1B 0x70 m t1 t2)
    // m = drawer pin (0 or 1)
    // t1 = ON time (pulse width)
    // t2 = OFF time
    const ESC = 0x1b;
    const p = 0x70;
    const m = 0x00; // Drawer pin 0
    const t1 = Math.floor((this.settings.pulseWidth || 100) / 2); // ON time
    const t2 = 0xfa; // OFF time

    const command = new Uint8Array([ESC, p, m, t1, t2]);

    if (this.printer && this.printer.sendCommands) {
      return await this.printer.sendCommands(command);
    }

    return false;
  }

  /**
   * Open drawer via serial port
   * @returns {Promise<boolean>} Success status
   */
  async openViaSerial() {
    if (!this.port) return false;

    try {
      const writer = this.port.writable.getWriter();

      // Standard cash drawer pulse command
      const command = new Uint8Array([0x1b, 0x70, 0x00, 0x32, 0xfa]);

      await writer.write(command);
      writer.releaseLock();

      return true;
    } catch (error) {
      console.error('Serial write error:', error);
      return false;
    }
  }

  /**
   * Open drawer via USB
   * @returns {Promise<boolean>} Success status
   */
  async openViaUSB() {
    if (!this.device) return false;

    try {
      // USB open drawer command (device-specific)
      const command = new Uint8Array([0x1b, 0x70, 0x00, 0x32, 0xfa]);

      await this.device.transferOut(1, command);
      return true;
    } catch (error) {
      console.error('USB write error:', error);
      return false;
    }
  }

  /**
   * Disconnect cash drawer
   */
  async disconnect() {
    if (this.port) {
      try {
        await this.port.close();
      } catch (error) {
        console.error('Port close error:', error);
      }
      this.port = null;
    }

    if (this.device) {
      try {
        await this.device.close();
      } catch (error) {
        console.error('Device close error:', error);
      }
      this.device = null;
    }

    this.connected = false;
    this.printer = null;
  }

  /**
   * Test cash drawer
   * @returns {Promise<boolean>} Test success
   */
  async test() {
    return await this.open();
  }

  /**
   * Get cash drawer status
   * @returns {Object} Drawer status
   */
  getStatus() {
    return {
      connected: this.connected,
      settings: this.settings,
      connectionType: this.settings?.connectionType,
    };
  }

  /**
   * Check if drawer should open automatically on sale
   * @returns {boolean} Auto-open setting
   */
  shouldOpenOnSale() {
    return this.settings?.openOnSale || false;
  }
}

// Export singleton instance
export default new CashDrawerService();
