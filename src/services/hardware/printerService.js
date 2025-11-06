/**
 * Receipt Printer Service
 * Handles communication with receipt printers using ESC/POS protocol
 */

class PrinterService {
  constructor() {
    this.connected = false;
    this.printer = null;
    this.settings = null;
  }

  /**
   * Initialize printer connection
   * @param {Object} settings - Printer settings
   * @returns {Promise<boolean>} Connection success
   */
  async connect(settings) {
    this.settings = settings;

    try {
      if (settings.connectionType === 'usb') {
        return await this.connectUSB();
      } else if (settings.connectionType === 'network') {
        return await this.connectNetwork();
      } else if (settings.connectionType === 'bluetooth') {
        return await this.connectBluetooth();
      }

      return false;
    } catch (error) {
      console.error('Printer connection error:', error);
      return false;
    }
  }

  /**
   * Connect to USB printer using Web USB API
   */
  async connectUSB() {
    if (!navigator.usb) {
      console.warn('Web USB API not supported');
      return false;
    }

    try {
      // Request USB device
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

      this.printer = device;
      this.connected = true;
      return true;
    } catch (error) {
      console.error('USB connection error:', error);
      return false;
    }
  }

  /**
   * Connect to network printer
   */
  async connectNetwork() {
    const { ipAddress, port } = this.settings;

    try {
      // For network printers, we'll use a WebSocket or HTTP endpoint
      // This is a placeholder - actual implementation would depend on printer model
      const response = await fetch(`http://${ipAddress}:${port || 9100}/status`);
      this.connected = response.ok;
      return this.connected;
    } catch (error) {
      console.error('Network printer connection error:', error);
      return false;
    }
  }

  /**
   * Connect to Bluetooth printer using Web Bluetooth API
   */
  async connectBluetooth() {
    if (!navigator.bluetooth) {
      console.warn('Web Bluetooth API not supported');
      return false;
    }

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['battery_service'],
      });

      const server = await device.gatt.connect();
      this.printer = server;
      this.connected = true;
      return true;
    } catch (error) {
      console.error('Bluetooth connection error:', error);
      return false;
    }
  }

  /**
   * Disconnect from printer
   */
  async disconnect() {
    if (this.printer && this.connected) {
      try {
        if (this.settings.connectionType === 'usb' && this.printer.close) {
          await this.printer.close();
        }
        this.connected = false;
        this.printer = null;
        return true;
      } catch (error) {
        console.error('Disconnect error:', error);
        return false;
      }
    }
    return true;
  }

  /**
   * Print receipt
   * @param {Object} receiptData - Receipt data to print
   * @returns {Promise<boolean>} Print success
   */
  async printReceipt(receiptData) {
    if (!this.connected) {
      console.warn('Printer not connected');
      // Fallback to browser print
      return this.browserPrint(receiptData);
    }

    try {
      const commands = this.generateESCPOS(receiptData);
      return await this.sendCommands(commands);
    } catch (error) {
      console.error('Print error:', error);
      return false;
    }
  }

  /**
   * Generate ESC/POS commands for receipt
   * @param {Object} receiptData - Receipt data
   * @returns {Uint8Array} ESC/POS command bytes
   */
  generateESCPOS(receiptData) {
    const encoder = new TextEncoder();
    const commands = [];

    // ESC/POS commands
    const ESC = 0x1b;
    const GS = 0x1d;
    const LF = 0x0a;
    const CR = 0x0d;

    // Initialize printer
    commands.push(ESC, 0x40);

    // Set alignment center
    commands.push(ESC, 0x61, 0x01);

    // Business name (bold, large)
    if (receiptData.businessName) {
      commands.push(ESC, 0x45, 0x01); // Bold on
      commands.push(GS, 0x21, 0x11); // Double size
      commands.push(...encoder.encode(receiptData.businessName));
      commands.push(LF);
      commands.push(ESC, 0x45, 0x00); // Bold off
      commands.push(GS, 0x21, 0x00); // Normal size
    }

    // Business info
    if (receiptData.businessAddress) {
      commands.push(...encoder.encode(receiptData.businessAddress));
      commands.push(LF);
    }
    if (receiptData.businessPhone) {
      commands.push(...encoder.encode(receiptData.businessPhone));
      commands.push(LF);
    }

    // Separator
    commands.push(...encoder.encode('--------------------------------'));
    commands.push(LF);

    // Receipt header
    if (receiptData.header) {
      commands.push(...encoder.encode(receiptData.header));
      commands.push(LF);
    }

    // Receipt details
    commands.push(ESC, 0x61, 0x00); // Align left
    commands.push(...encoder.encode(`Receipt No: ${receiptData.receiptNo}`));
    commands.push(LF);
    commands.push(...encoder.encode(`Date: ${receiptData.date}`));
    commands.push(LF);
    commands.push(...encoder.encode(`Cashier: ${receiptData.cashier}`));
    commands.push(LF);

    // Separator
    commands.push(...encoder.encode('--------------------------------'));
    commands.push(LF);

    // Items
    receiptData.items.forEach((item) => {
      commands.push(...encoder.encode(`${item.name}`));
      commands.push(LF);
      commands.push(
        ...encoder.encode(`  ${item.qty} x ${item.price} = ${item.total}`)
      );
      commands.push(LF);
    });

    // Separator
    commands.push(...encoder.encode('--------------------------------'));
    commands.push(LF);

    // Totals
    commands.push(ESC, 0x61, 0x02); // Align right
    commands.push(...encoder.encode(`Subtotal: ${receiptData.subtotal}`));
    commands.push(LF);
    if (receiptData.tax && receiptData.tax !== '0.00') {
      commands.push(...encoder.encode(`Tax: ${receiptData.tax}`));
      commands.push(LF);
    }
    if (receiptData.discount && receiptData.discount !== '0.00') {
      commands.push(...encoder.encode(`Discount: ${receiptData.discount}`));
      commands.push(LF);
    }

    // Grand total (bold, large)
    commands.push(ESC, 0x45, 0x01); // Bold on
    commands.push(GS, 0x21, 0x11); // Double size
    commands.push(...encoder.encode(`TOTAL: ${receiptData.total}`));
    commands.push(LF);
    commands.push(ESC, 0x45, 0x00); // Bold off
    commands.push(GS, 0x21, 0x00); // Normal size

    // Payment details
    commands.push(ESC, 0x61, 0x00); // Align left
    commands.push(...encoder.encode(`Payment: ${receiptData.paymentMethod}`));
    commands.push(LF);
    commands.push(...encoder.encode(`Amount Paid: ${receiptData.amountPaid}`));
    commands.push(LF);
    if (receiptData.change && receiptData.change !== '0.00') {
      commands.push(...encoder.encode(`Change: ${receiptData.change}`));
      commands.push(LF);
    }

    // Footer
    if (receiptData.footer) {
      commands.push(...encoder.encode('--------------------------------'));
      commands.push(LF);
      commands.push(ESC, 0x61, 0x01); // Center
      commands.push(...encoder.encode(receiptData.footer));
      commands.push(LF);
    }

    // Thank you message
    commands.push(ESC, 0x61, 0x01); // Center
    commands.push(...encoder.encode('Thank you for your business!'));
    commands.push(LF);
    commands.push(...encoder.encode('Please visit again'));
    commands.push(LF, LF, LF);

    // Cut paper (if supported)
    if (this.settings.autoCut) {
      commands.push(GS, 0x56, 0x00);
    }

    // Open cash drawer (if enabled)
    if (this.settings.openDrawer) {
      commands.push(ESC, 0x70, 0x00, 0x32, 0xfa);
    }

    return new Uint8Array(commands);
  }

  /**
   * Send commands to printer
   * @param {Uint8Array} commands - ESC/POS commands
   * @returns {Promise<boolean>} Send success
   */
  async sendCommands(commands) {
    if (!this.printer || !this.connected) return false;

    try {
      if (this.settings.connectionType === 'usb') {
        await this.printer.transferOut(1, commands);
        return true;
      } else if (this.settings.connectionType === 'network') {
        // Send to network printer
        const response = await fetch(
          `http://${this.settings.ipAddress}:${this.settings.port || 9100}/print`,
          {
            method: 'POST',
            body: commands,
          }
        );
        return response.ok;
      }

      return false;
    } catch (error) {
      console.error('Send command error:', error);
      return false;
    }
  }

  /**
   * Fallback to browser print dialog
   * @param {Object} receiptData - Receipt data
   * @returns {boolean} Print initiated
   */
  browserPrint(receiptData) {
    try {
      // Create a formatted HTML receipt and print using window.print()
      const printWindow = window.open('', '_blank');
      printWindow.document.write(this.generateHTMLReceipt(receiptData));
      printWindow.document.close();
      printWindow.print();
      return true;
    } catch (error) {
      console.error('Browser print error:', error);
      return false;
    }
  }

  /**
   * Generate HTML receipt for browser printing
   * @param {Object} receiptData - Receipt data
   * @returns {string} HTML string
   */
  generateHTMLReceipt(receiptData) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body { font-family: monospace; width: 80mm; margin: 0 auto; }
            .center { text-align: center; }
            .right { text-align: right; }
            .bold { font-weight: bold; }
            .large { font-size: 1.5em; }
            hr { border: none; border-top: 1px dashed #000; }
            table { width: 100%; }
          </style>
        </head>
        <body>
          <div class="center bold large">${receiptData.businessName || ''}</div>
          <div class="center">${receiptData.businessAddress || ''}</div>
          <div class="center">${receiptData.businessPhone || ''}</div>
          <hr />
          <div>Receipt No: ${receiptData.receiptNo}</div>
          <div>Date: ${receiptData.date}</div>
          <div>Cashier: ${receiptData.cashier}</div>
          <hr />
          ${receiptData.items.map(item => `
            <div>${item.name}</div>
            <div>  ${item.qty} x ${item.price} = ${item.total}</div>
          `).join('')}
          <hr />
          <table>
            <tr><td>Subtotal:</td><td class="right">${receiptData.subtotal}</td></tr>
            ${receiptData.tax !== '0.00' ? `<tr><td>Tax:</td><td class="right">${receiptData.tax}</td></tr>` : ''}
            ${receiptData.discount !== '0.00' ? `<tr><td>Discount:</td><td class="right">${receiptData.discount}</td></tr>` : ''}
            <tr class="bold large"><td>TOTAL:</td><td class="right">${receiptData.total}</td></tr>
          </table>
          <hr />
          <div>Payment: ${receiptData.paymentMethod}</div>
          <div>Amount Paid: ${receiptData.amountPaid}</div>
          ${receiptData.change !== '0.00' ? `<div>Change: ${receiptData.change}</div>` : ''}
          <hr />
          <div class="center">${receiptData.footer || ''}</div>
          <div class="center">Thank you for your business!</div>
          <div class="center">Please visit again</div>
        </body>
      </html>
    `;
  }

  /**
   * Test printer connection
   * @returns {Promise<boolean>} Test success
   */
  async testPrint() {
    const testReceipt = {
      businessName: 'Test Print',
      businessAddress: '',
      businessPhone: '',
      receiptNo: 'TEST-001',
      date: new Date().toLocaleString(),
      cashier: 'System',
      header: '',
      items: [
        { name: 'Test Item', qty: 1, price: '$0.00', total: '$0.00' },
      ],
      subtotal: '$0.00',
      tax: '$0.00',
      discount: '$0.00',
      total: '$0.00',
      paymentMethod: 'Test',
      amountPaid: '$0.00',
      change: '$0.00',
      footer: 'This is a test print',
    };

    return await this.printReceipt(testReceipt);
  }

  /**
   * Get printer status
   * @returns {Object} Printer status
   */
  getStatus() {
    return {
      connected: this.connected,
      settings: this.settings,
    };
  }
}

// Export singleton instance
export default new PrinterService();
