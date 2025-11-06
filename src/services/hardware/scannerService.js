/**
 * Barcode Scanner Service
 * Handles barcode scanner integration
 */

class ScannerService {
  constructor() {
    this.connected = false;
    this.settings = null;
    this.listeners = [];
    this.buffer = '';
    this.timeout = null;
  }

  /**
   * Initialize scanner
   * @param {Object} settings - Scanner settings
   * @param {Function} onScan - Callback for scan events
   * @returns {boolean} Initialization success
   */
  initialize(settings, onScan) {
    this.settings = settings;

    if (settings.enabled) {
      if (settings.type === 'usb' || settings.type === 'bluetooth') {
        // For USB/Bluetooth scanners that act as keyboard input
        this.setupKeyboardListener(onScan);
        this.connected = true;
        return true;
      } else if (settings.type === 'serial') {
        // For serial scanners
        return this.connectSerial(onScan);
      }
    }

    return false;
  }

  /**
   * Set up keyboard input listener for USB/Bluetooth scanners
   * @param {Function} onScan - Callback for scan events
   */
  setupKeyboardListener(onScan) {
    const handleKeyPress = (event) => {
      // Check if the input is coming from the scanner
      // Most barcode scanners send data very quickly and end with Enter
      const char = event.key;

      if (char === 'Enter') {
        // End of scan
        if (this.buffer.length > 0) {
          const scannedCode = this.processScannedCode(this.buffer);
          if (scannedCode) {
            onScan(scannedCode);
          }
          this.buffer = '';
        }
        event.preventDefault();
      } else if (char.length === 1) {
        // Add character to buffer
        this.buffer += char;

        // Clear timeout
        if (this.timeout) {
          clearTimeout(this.timeout);
        }

        // Set timeout to clear buffer if input is too slow
        this.timeout = setTimeout(() => {
          this.buffer = '';
        }, 100); // Clear buffer after 100ms of inactivity
      }
    };

    // Add event listener
    document.addEventListener('keypress', handleKeyPress);

    // Store listener for cleanup
    this.listeners.push({
      event: 'keypress',
      handler: handleKeyPress,
    });
  }

  /**
   * Connect to serial scanner using Web Serial API
   * @param {Function} onScan - Callback for scan events
   * @returns {Promise<boolean>} Connection success
   */
  async connectSerial(onScan) {
    if (!navigator.serial) {
      console.warn('Web Serial API not supported');
      return false;
    }

    try {
      // Request serial port
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: this.settings.baudRate || 9600 });

      this.port = port;
      this.connected = true;

      // Read from serial port
      this.readSerial(port, onScan);

      return true;
    } catch (error) {
      console.error('Serial connection error:', error);
      return false;
    }
  }

  /**
   * Read data from serial port
   * @param {SerialPort} port - Serial port
   * @param {Function} onScan - Callback for scan events
   */
  async readSerial(port, onScan) {
    const reader = port.readable.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        this.buffer += text;

        // Check for end of scan (usually newline or carriage return)
        if (text.includes('\n') || text.includes('\r')) {
          const scannedCode = this.processScannedCode(this.buffer);
          if (scannedCode) {
            onScan(scannedCode);
          }
          this.buffer = '';
        }
      }
    } catch (error) {
      console.error('Serial read error:', error);
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Process scanned code (remove prefix/suffix, trim)
   * @param {string} rawCode - Raw scanned code
   * @returns {string} Processed code
   */
  processScannedCode(rawCode) {
    let code = rawCode;

    // Remove prefix if configured
    if (this.settings.prefix && code.startsWith(this.settings.prefix)) {
      code = code.substring(this.settings.prefix.length);
    }

    // Remove suffix if configured
    if (this.settings.suffix && code.endsWith(this.settings.suffix)) {
      code = code.substring(0, code.length - this.settings.suffix.length);
    }

    // Trim whitespace
    code = code.trim();

    return code;
  }

  /**
   * Disconnect scanner
   */
  async disconnect() {
    // Remove event listeners
    this.listeners.forEach(({ event, handler }) => {
      document.removeEventListener(event, handler);
    });
    this.listeners = [];

    // Close serial port if open
    if (this.port) {
      try {
        await this.port.close();
      } catch (error) {
        console.error('Port close error:', error);
      }
      this.port = null;
    }

    this.connected = false;
    this.buffer = '';
  }

  /**
   * Test scanner
   * @returns {Promise<boolean>} Test success
   */
  async test() {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve(false);
      }, 10000); // 10 second timeout

      const testCallback = (code) => {
        clearTimeout(timeout);
        console.log('Test scan received:', code);
        resolve(true);
      };

      // Temporarily set up test listener
      this.initialize(this.settings, testCallback);
    });
  }

  /**
   * Get scanner status
   * @returns {Object} Scanner status
   */
  getStatus() {
    return {
      connected: this.connected,
      settings: this.settings,
    };
  }

  /**
   * Validate barcode format
   * @param {string} code - Barcode to validate
   * @param {string} format - Expected format (e.g., 'EAN13', 'UPC', 'CODE128')
   * @returns {boolean} Whether barcode is valid
   */
  validateBarcode(code, format) {
    switch (format) {
      case 'EAN13':
        return /^\d{13}$/.test(code);
      case 'EAN8':
        return /^\d{8}$/.test(code);
      case 'UPCA':
        return /^\d{12}$/.test(code);
      case 'UPCE':
        return /^\d{6,8}$/.test(code);
      case 'CODE39':
        return /^[A-Z0-9\-\.\ \$\/\+\%]+$/.test(code);
      case 'CODE128':
        return /^[\x00-\x7F]+$/.test(code); // ASCII characters
      case 'QR':
        return code.length > 0; // QR codes can contain any data
      default:
        return code.length > 0;
    }
  }
}

// Export singleton instance
export default new ScannerService();
