/**
 * Customer Display Service
 * Handles customer-facing display pole/monitor
 */

class CustomerDisplayService {
  constructor() {
    this.connected = false;
    this.settings = null;
    this.port = null;
    this.device = null;
  }

  /**
   * Initialize customer display
   * @param {Object} settings - Display settings
   * @returns {Promise<boolean>} Initialization success
   */
  async initialize(settings) {
    this.settings = settings;

    if (settings.enabled) {
      if (settings.connectionType === 'serial') {
        return await this.connectSerial();
      } else if (settings.connectionType === 'usb') {
        return await this.connectUSB();
      } else if (settings.connectionType === 'network') {
        return await this.connectNetwork();
      }
    }

    return false;
  }

  /**
   * Connect to serial display using Web Serial API
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

      // Initialize display
      await this.clearDisplay();

      return true;
    } catch (error) {
      console.error('Serial connection error:', error);
      return false;
    }
  }

  /**
   * Connect to USB display using Web USB API
   * @returns {Promise<boolean>} Connection success
   */
  async connectUSB() {
    if (!navigator.usb) {
      console.warn('Web USB API not supported');
      return false;
    }

    try {
      const device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: 0x0dd4 }, // Citizen
          { vendorId: 0x0519 }, // Bixolon
        ],
      });

      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      this.device = device;
      this.connected = true;

      // Initialize display
      await this.clearDisplay();

      return true;
    } catch (error) {
      console.error('USB connection error:', error);
      return false;
    }
  }

  /**
   * Connect to network display
   * @returns {Promise<boolean>} Connection success
   */
  async connectNetwork() {
    const { ipAddress, port } = this.settings;

    try {
      // For network displays, we'll use WebSocket or HTTP
      const response = await fetch(`http://${ipAddress}:${port || 8080}/status`);
      this.connected = response.ok;

      if (this.connected) {
        await this.clearDisplay();
      }

      return this.connected;
    } catch (error) {
      console.error('Network connection error:', error);
      return false;
    }
  }

  /**
   * Display message on customer display
   * @param {string} line1 - First line text
   * @param {string} line2 - Second line text (optional)
   * @returns {Promise<boolean>} Display success
   */
  async displayMessage(line1, line2 = '') {
    if (!this.connected) {
      console.warn('Customer display not connected');
      return false;
    }

    try {
      // Format text to fit display dimensions
      const formattedLine1 = this.formatLine(line1, this.settings.columns || 20);
      const formattedLine2 = this.settings.lines >= 2
        ? this.formatLine(line2, this.settings.columns || 20)
        : '';

      return await this.sendToDisplay(formattedLine1, formattedLine2);
    } catch (error) {
      console.error('Display message error:', error);
      return false;
    }
  }

  /**
   * Display transaction total
   * @param {number} total - Transaction total amount
   * @param {string} currency - Currency symbol
   * @returns {Promise<boolean>} Display success
   */
  async displayTotal(total, currency = '$') {
    const line1 = 'TOTAL';
    const line2 = `${currency}${total.toFixed(2)}`;
    return await this.displayMessage(line1, line2);
  }

  /**
   * Display item being scanned/added
   * @param {string} itemName - Item name
   * @param {number} price - Item price
   * @param {string} currency - Currency symbol
   * @returns {Promise<boolean>} Display success
   */
  async displayItem(itemName, price, currency = '$') {
    const line1 = this.formatLine(itemName, this.settings.columns || 20);
    const line2 = `${currency}${price.toFixed(2)}`;
    return await this.displayMessage(line1, line2);
  }

  /**
   * Display welcome message
   * @returns {Promise<boolean>} Display success
   */
  async displayWelcome() {
    return await this.displayMessage('Welcome!', 'Thank you');
  }

  /**
   * Display thank you message
   * @returns {Promise<boolean>} Display success
   */
  async displayThankYou() {
    return await this.displayMessage('Thank You!', 'Please come again');
  }

  /**
   * Clear display
   * @returns {Promise<boolean>} Clear success
   */
  async clearDisplay() {
    return await this.displayMessage('', '');
  }

  /**
   * Format line to fit display width
   * @param {string} text - Text to format
   * @param {number} width - Display width
   * @returns {string} Formatted text
   */
  formatLine(text, width) {
    if (text.length > width) {
      return text.substring(0, width);
    }
    return text.padEnd(width, ' ');
  }

  /**
   * Send formatted text to display
   * @param {string} line1 - First line
   * @param {string} line2 - Second line
   * @returns {Promise<boolean>} Send success
   */
  async sendToDisplay(line1, line2) {
    const encoder = new TextEncoder();

    // Clear display and position cursor
    const ESC = 0x1b;
    const commands = [];

    // Clear display (ESC [2J)
    commands.push(ESC, 0x5b, 0x32, 0x4a);

    // Position cursor at home (ESC [H)
    commands.push(ESC, 0x5b, 0x48);

    // Write first line
    commands.push(...encoder.encode(line1));

    // Move to second line if supported
    if (this.settings.lines >= 2 && line2) {
      // Newline or position cursor at line 2
      commands.push(0x0a); // LF (newline)
      commands.push(...encoder.encode(line2));
    }

    const data = new Uint8Array(commands);

    try {
      if (this.port) {
        // Send via serial
        const writer = this.port.writable.getWriter();
        await writer.write(data);
        writer.releaseLock();
        return true;
      } else if (this.device) {
        // Send via USB
        await this.device.transferOut(1, data);
        return true;
      } else if (this.settings.connectionType === 'network') {
        // Send via network
        const response = await fetch(
          `http://${this.settings.ipAddress}:${this.settings.port || 8080}/display`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ line1, line2 }),
          }
        );
        return response.ok;
      }

      return false;
    } catch (error) {
      console.error('Send to display error:', error);
      return false;
    }
  }

  /**
   * Disconnect display
   */
  async disconnect() {
    if (this.port) {
      try {
        await this.clearDisplay();
        await this.port.close();
      } catch (error) {
        console.error('Port close error:', error);
      }
      this.port = null;
    }

    if (this.device) {
      try {
        await this.clearDisplay();
        await this.device.close();
      } catch (error) {
        console.error('Device close error:', error);
      }
      this.device = null;
    }

    this.connected = false;
  }

  /**
   * Test display
   * @returns {Promise<boolean>} Test success
   */
  async test() {
    const success = await this.displayMessage('Test Display', 'Line 2');
    if (success) {
      setTimeout(async () => {
        await this.clearDisplay();
      }, 3000);
    }
    return success;
  }

  /**
   * Get display status
   * @returns {Object} Display status
   */
  getStatus() {
    return {
      connected: this.connected,
      settings: this.settings,
      lines: this.settings?.lines || 2,
      columns: this.settings?.columns || 20,
    };
  }

  /**
   * Adjust brightness (if supported)
   * @param {number} level - Brightness level (0-100)
   * @returns {Promise<boolean>} Success status
   */
  async setBrightness(level) {
    // Implementation depends on display model
    // This is a placeholder
    console.log(`Setting brightness to ${level}%`);
    return true;
  }
}

// Export singleton instance
export default new CustomerDisplayService();
