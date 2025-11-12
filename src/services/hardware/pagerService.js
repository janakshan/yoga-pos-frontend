/**
 * Pager/Buzzer Service
 * Handles customer pager systems and kitchen buzzers for order ready notifications
 */

class PagerService {
  constructor() {
    this.system = null;
    this.connected = false;
    this.settings = null;
    this.activePagers = new Map(); // Map of pager number to order/table
    this.pagerHistory = [];
  }

  /**
   * Initialize pager system
   * @param {Object} settings - Pager system settings
   * @returns {Promise<boolean>} Initialization success
   */
  async initialize(settings) {
    this.settings = settings;

    if (!settings.enabled) {
      return false;
    }

    try {
      if (settings.systemType === 'serial') {
        return await this.connectSerial();
      } else if (settings.systemType === 'network') {
        return await this.connectNetwork();
      } else if (settings.systemType === 'usb') {
        return await this.connectUSB();
      } else if (settings.systemType === 'api') {
        return await this.connectAPI();
      }

      return false;
    } catch (error) {
      console.error('Pager system initialization error:', error);
      return false;
    }
  }

  /**
   * Connect via Serial (RS-232/485)
   */
  async connectSerial() {
    if (!navigator.serial) {
      console.warn('Web Serial API not supported');
      return false;
    }

    try {
      const port = await navigator.serial.requestPort();
      await port.open({
        baudRate: this.settings.baudRate || 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
      });

      this.system = { type: 'serial', port };
      this.connected = true;

      // Initialize system
      await this.sendCommand('INIT');

      return true;
    } catch (error) {
      console.error('Serial connection error:', error);
      return false;
    }
  }

  /**
   * Connect via USB
   */
  async connectUSB() {
    if (!navigator.usb) {
      console.warn('Web USB API not supported');
      return false;
    }

    try {
      const device = await navigator.usb.requestDevice({
        filters: [
          { vendorId: 0x10c4 }, // Silicon Labs
          { vendorId: 0x0403 }, // FTDI
        ],
      });

      await device.open();
      await device.selectConfiguration(1);
      await device.claimInterface(0);

      this.system = { type: 'usb', device };
      this.connected = true;

      return true;
    } catch (error) {
      console.error('USB connection error:', error);
      return false;
    }
  }

  /**
   * Connect via Network
   */
  async connectNetwork() {
    const { ipAddress, port } = this.settings;

    try {
      const response = await fetch(`http://${ipAddress}:${port || 8080}/status`);

      if (response.ok) {
        this.system = { type: 'network', ipAddress, port };
        this.connected = true;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Network connection error:', error);
      return false;
    }
  }

  /**
   * Connect via API (cloud-based pager systems)
   */
  async connectAPI() {
    const { apiEndpoint, apiKey } = this.settings;

    try {
      const response = await fetch(`${apiEndpoint}/status`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        this.system = { type: 'api', apiEndpoint, apiKey };
        this.connected = true;
        return true;
      }

      return false;
    } catch (error) {
      console.error('API connection error:', error);
      return false;
    }
  }

  /**
   * Page a customer (vibrate/beep pager)
   * @param {number} pagerNumber - Pager number to call
   * @param {Object} options - Paging options
   * @returns {Promise<Object>} Paging result
   */
  async page(pagerNumber, options = {}) {
    if (!this.connected) {
      throw new Error('Pager system not connected');
    }

    const {
      mode = 'vibrate', // vibrate, beep, flash, all
      duration = 30, // seconds
      intensity = 'medium', // low, medium, high
      orderId = null,
      tableNumber = null,
    } = options;

    try {
      // Send page command based on system type
      let result;

      if (this.system.type === 'serial' || this.system.type === 'usb') {
        result = await this.sendPagerCommand(pagerNumber, mode, duration, intensity);
      } else if (this.system.type === 'network') {
        result = await this.sendNetworkPage(pagerNumber, mode, duration, intensity);
      } else if (this.system.type === 'api') {
        result = await this.sendAPIPage(pagerNumber, mode, duration, intensity);
      }

      // Track active pager
      this.activePagers.set(pagerNumber, {
        orderId,
        tableNumber,
        pagedAt: new Date(),
        mode,
        duration,
      });

      // Add to history
      this.pagerHistory.unshift({
        pagerNumber,
        orderId,
        tableNumber,
        timestamp: new Date(),
        mode,
        success: result.success,
      });

      // Limit history size
      if (this.pagerHistory.length > 100) {
        this.pagerHistory = this.pagerHistory.slice(0, 100);
      }

      return result;
    } catch (error) {
      console.error('Paging error:', error);
      throw error;
    }
  }

  /**
   * Send pager command via serial/USB
   */
  async sendPagerCommand(pagerNumber, mode, duration, intensity) {
    const command = this.buildPagerCommand(pagerNumber, mode, duration, intensity);

    if (this.system.type === 'serial') {
      const writer = this.system.port.writable.getWriter();
      await writer.write(command);
      writer.releaseLock();
    } else if (this.system.type === 'usb') {
      await this.system.device.transferOut(1, command);
    }

    return { success: true, pagerNumber, mode };
  }

  /**
   * Build pager command bytes
   */
  buildPagerCommand(pagerNumber, mode, duration, intensity) {
    // Standard pager protocol (example - adjust for your system)
    const commands = [];

    // Header
    commands.push(0x02); // STX

    // Pager address (2 bytes)
    commands.push((pagerNumber >> 8) & 0xff);
    commands.push(pagerNumber & 0xff);

    // Mode byte
    let modeByte = 0x00;
    if (mode === 'vibrate' || mode === 'all') modeByte |= 0x01;
    if (mode === 'beep' || mode === 'all') modeByte |= 0x02;
    if (mode === 'flash' || mode === 'all') modeByte |= 0x04;
    commands.push(modeByte);

    // Duration (seconds)
    commands.push(duration & 0xff);

    // Intensity (0-255)
    const intensityValue =
      intensity === 'low' ? 85 : intensity === 'high' ? 255 : 170;
    commands.push(intensityValue);

    // Checksum
    const checksum = commands.reduce((sum, byte) => sum + byte, 0) & 0xff;
    commands.push(checksum);

    // End
    commands.push(0x03); // ETX

    return new Uint8Array(commands);
  }

  /**
   * Send page via network
   */
  async sendNetworkPage(pagerNumber, mode, duration, intensity) {
    const response = await fetch(
      `http://${this.system.ipAddress}:${this.system.port}/page`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pager: pagerNumber,
          mode,
          duration,
          intensity,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Network page failed');
    }

    return response.json();
  }

  /**
   * Send page via API
   */
  async sendAPIPage(pagerNumber, mode, duration, intensity) {
    const response = await fetch(`${this.system.apiEndpoint}/page`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.system.apiKey}`,
      },
      body: JSON.stringify({
        pager: pagerNumber,
        mode,
        duration,
        intensity,
      }),
    });

    if (!response.ok) {
      throw new Error('API page failed');
    }

    return response.json();
  }

  /**
   * Cancel active page
   */
  async cancelPage(pagerNumber) {
    if (!this.connected) {
      throw new Error('Pager system not connected');
    }

    try {
      // Send cancel command
      await this.sendCommand(`CANCEL:${pagerNumber}`);

      // Remove from active pagers
      this.activePagers.delete(pagerNumber);

      return { success: true, pagerNumber };
    } catch (error) {
      console.error('Cancel page error:', error);
      throw error;
    }
  }

  /**
   * Page customer for order ready
   * @param {Object} order - Order object
   * @returns {Promise<Object>} Page result
   */
  async pageOrderReady(order) {
    const pagerNumber = order.pagerNumber || order.tableNumber;

    if (!pagerNumber) {
      throw new Error('No pager number assigned to order');
    }

    return await this.page(pagerNumber, {
      mode: 'all',
      duration: 60,
      intensity: 'high',
      orderId: order.id,
      tableNumber: order.tableNumber,
    });
  }

  /**
   * Buzz kitchen station
   * @param {string} station - Kitchen station ID
   * @param {string} buzzerType - Type of alert
   * @returns {Promise<Object>} Result
   */
  async buzzKitchen(station, buzzerType = 'order_ready') {
    // Kitchen buzzers typically use simple on/off signals
    // Map station to buzzer number/relay
    const buzzerMap = {
      hot_kitchen: 1,
      cold_kitchen: 2,
      grill: 3,
      bar: 4,
      dessert: 5,
      prep: 6,
    };

    const buzzerNumber = buzzerMap[station] || 1;

    // Send buzzer command
    const pattern = this.getBuzzerPattern(buzzerType);

    try {
      await this.activateBuzzer(buzzerNumber, pattern);

      return {
        success: true,
        station,
        buzzerType,
      };
    } catch (error) {
      console.error('Kitchen buzzer error:', error);
      throw error;
    }
  }

  /**
   * Get buzzer pattern for alert type
   */
  getBuzzerPattern(buzzerType) {
    const patterns = {
      order_ready: { pulses: 3, duration: 500, interval: 200 },
      urgent: { pulses: 5, duration: 300, interval: 100 },
      attention: { pulses: 2, duration: 1000, interval: 500 },
      reminder: { pulses: 1, duration: 2000, interval: 0 },
    };

    return patterns[buzzerType] || patterns.order_ready;
  }

  /**
   * Activate buzzer with pattern
   */
  async activateBuzzer(buzzerNumber, pattern) {
    for (let i = 0; i < pattern.pulses; i++) {
      await this.sendCommand(`BUZZER:${buzzerNumber}:ON`);
      await this.delay(pattern.duration);
      await this.sendCommand(`BUZZER:${buzzerNumber}:OFF`);

      if (i < pattern.pulses - 1 && pattern.interval > 0) {
        await this.delay(pattern.interval);
      }
    }
  }

  /**
   * Send generic command
   */
  async sendCommand(command) {
    const encoder = new TextEncoder();
    const data = encoder.encode(command + '\r\n');

    if (this.system.type === 'serial') {
      const writer = this.system.port.writable.getWriter();
      await writer.write(data);
      writer.releaseLock();
    } else if (this.system.type === 'usb') {
      await this.system.device.transferOut(1, data);
    } else if (this.system.type === 'network') {
      await fetch(`http://${this.system.ipAddress}:${this.system.port}/command`, {
        method: 'POST',
        body: command,
      });
    } else if (this.system.type === 'api') {
      await fetch(`${this.system.apiEndpoint}/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.system.apiKey}`,
        },
        body: JSON.stringify({ command }),
      });
    }
  }

  /**
   * Test pager
   */
  async test(pagerNumber) {
    return await this.page(pagerNumber, {
      mode: 'all',
      duration: 5,
      intensity: 'medium',
    });
  }

  /**
   * Get active pagers
   */
  getActivePagers() {
    return Array.from(this.activePagers.entries()).map(([number, data]) => ({
      pagerNumber: number,
      ...data,
    }));
  }

  /**
   * Get pager history
   */
  getHistory(limit = 50) {
    return this.pagerHistory.slice(0, limit);
  }

  /**
   * Check if pager is active
   */
  isPagerActive(pagerNumber) {
    return this.activePagers.has(pagerNumber);
  }

  /**
   * Get pager info
   */
  getPagerInfo(pagerNumber) {
    return this.activePagers.get(pagerNumber) || null;
  }

  /**
   * Clear pager (mark as returned)
   */
  clearPager(pagerNumber) {
    this.activePagers.delete(pagerNumber);
    return { success: true, pagerNumber };
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      connected: this.connected,
      systemType: this.system?.type || 'none',
      activePagers: this.activePagers.size,
      settings: this.settings,
    };
  }

  /**
   * Disconnect pager system
   */
  async disconnect() {
    if (!this.connected) return true;

    try {
      if (this.system.type === 'serial' && this.system.port) {
        await this.system.port.close();
      } else if (this.system.type === 'usb' && this.system.device) {
        await this.system.device.close();
      }

      this.connected = false;
      this.system = null;
      this.activePagers.clear();

      return true;
    } catch (error) {
      console.error('Disconnect error:', error);
      return false;
    }
  }

  /**
   * Utility: delay
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export default new PagerService();
