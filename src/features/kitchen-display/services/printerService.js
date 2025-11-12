/**
 * Kitchen Printer Service
 *
 * Handles printing orders to kitchen printers
 */

import apiClient from '@/services/apiClient';

/**
 * Printer Service
 */
export const printerService = {
  /**
   * Get available printers
   * @returns {Promise<Array>} List of printers
   */
  async getPrinters() {
    try {
      const response = await apiClient.get('/kitchen/printers');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch printers:', error);
      throw error;
    }
  },

  /**
   * Print order to specific printer
   * @param {Object} printJob - Print job configuration
   * @returns {Promise<Object>} Print result
   */
  async print(printJob) {
    try {
      const {
        orderId,
        stationId,
        printerName,
        items,
        copies = 1,
        priority = 'normal',
      } = printJob;

      const response = await apiClient.post('/kitchen/print', {
        orderId,
        stationId,
        printerName,
        items,
        copies,
        priority,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Failed to print order:', error);
      throw error;
    }
  },

  /**
   * Print order ticket
   * @param {Object} order - Order object
   * @param {string} stationId - Station ID
   * @returns {Promise<Object>} Print result
   */
  async printOrderTicket(order, stationId = null) {
    try {
      // Filter items by station if specified
      const items = stationId
        ? order.items.filter((item) => item.kitchenStation === stationId)
        : order.items;

      // Format order for printing
      const printData = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        tableNumber: order.tableNumber,
        serviceType: order.serviceType,
        serverName: order.serverName,
        customerCount: order.customerCount,
        priority: order.priority,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          modifiers: item.modifiers,
          notes: item.notes,
          kitchenStation: item.kitchenStation,
        })),
        notes: order.notes,
        timestamp: new Date().toISOString(),
      };

      const response = await apiClient.post('/kitchen/print-ticket', printData);
      return response.data;
    } catch (error) {
      console.error('Failed to print order ticket:', error);
      throw error;
    }
  },

  /**
   * Reprint order
   * @param {string} orderId - Order ID
   * @param {string} stationId - Station ID
   * @returns {Promise<Object>} Print result
   */
  async reprint(orderId, stationId) {
    try {
      const response = await apiClient.post('/kitchen/reprint', {
        orderId,
        stationId,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to reprint order:', error);
      throw error;
    }
  },

  /**
   * Print item ticket (for item-level routing)
   * @param {Object} order - Order object
   * @param {Object} item - Item object
   * @returns {Promise<Object>} Print result
   */
  async printItemTicket(order, item) {
    try {
      const printData = {
        orderId: order.id,
        orderNumber: order.orderNumber,
        tableNumber: order.tableNumber,
        item: {
          name: item.name,
          quantity: item.quantity,
          modifiers: item.modifiers,
          notes: item.notes,
          kitchenStation: item.kitchenStation,
        },
        timestamp: new Date().toISOString(),
      };

      const response = await apiClient.post('/kitchen/print-item', printData);
      return response.data;
    } catch (error) {
      console.error('Failed to print item ticket:', error);
      throw error;
    }
  },

  /**
   * Get printer status
   * @param {string} printerName - Printer name
   * @returns {Promise<Object>} Printer status
   */
  async getPrinterStatus(printerName) {
    try {
      const response = await apiClient.get(`/kitchen/printers/${printerName}/status`);
      return response.data;
    } catch (error) {
      console.error('Failed to get printer status:', error);
      throw error;
    }
  },

  /**
   * Test print
   * @param {string} printerName - Printer name
   * @returns {Promise<Object>} Test result
   */
  async testPrint(printerName) {
    try {
      const response = await apiClient.post('/kitchen/printers/test', {
        printerName,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to test print:', error);
      throw error;
    }
  },

  /**
   * Configure printer
   * @param {string} printerName - Printer name
   * @param {Object} config - Printer configuration
   * @returns {Promise<Object>} Updated config
   */
  async configurePrinter(printerName, config) {
    try {
      const response = await apiClient.patch(
        `/kitchen/printers/${printerName}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error('Failed to configure printer:', error);
      throw error;
    }
  },

  /**
   * Format order for thermal printer
   * @param {Object} order - Order object
   * @param {Array} items - Items to print
   * @returns {string} Formatted text for thermal printer
   */
  formatThermalReceipt(order, items) {
    const lines = [];
    const width = 32; // Standard thermal printer width

    // Center text helper
    const center = (text) => {
      const padding = Math.max(0, Math.floor((width - text.length) / 2));
      return ' '.repeat(padding) + text;
    };

    // Header
    lines.push(center('KITCHEN ORDER'));
    lines.push('='.repeat(width));
    lines.push('');

    // Order info
    lines.push(`Order #: ${order.orderNumber}`);
    lines.push(`Table: ${order.tableNumber || 'N/A'}`);
    if (order.serverName) {
      lines.push(`Server: ${order.serverName}`);
    }
    if (order.customerCount) {
      lines.push(`Guests: ${order.customerCount}`);
    }
    if (order.priority !== 'normal') {
      lines.push(`PRIORITY: ${order.priority.toUpperCase()}`);
    }
    lines.push('');
    lines.push('-'.repeat(width));
    lines.push('');

    // Items
    items.forEach((item) => {
      lines.push(`${item.quantity}x ${item.name}`);

      // Modifiers
      if (item.modifiers && item.modifiers.length > 0) {
        item.modifiers.forEach((mod) => {
          lines.push(`  - ${mod.name}`);
          if (mod.options) {
            mod.options.forEach((opt) => {
              lines.push(`    * ${opt.name}`);
            });
          }
        });
      }

      // Notes
      if (item.notes) {
        lines.push(`  ** ${item.notes} **`);
      }

      lines.push('');
    });

    // Order notes
    if (order.notes) {
      lines.push('-'.repeat(width));
      lines.push('ORDER NOTES:');
      lines.push(order.notes);
      lines.push('');
    }

    // Footer
    lines.push('='.repeat(width));
    lines.push(center(new Date().toLocaleString()));
    lines.push('');
    lines.push('');
    lines.push('');

    return lines.join('\n');
  },
};

export default printerService;
