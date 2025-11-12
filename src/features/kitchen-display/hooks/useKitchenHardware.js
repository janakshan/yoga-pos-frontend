/**
 * Kitchen Hardware Hook
 *
 * Manages all kitchen hardware integrations:
 * - Kitchen printers with multi-printer routing
 * - Customer pagers/buzzers
 * - Customer displays
 * - Hardware health monitoring
 */

import { useState, useEffect, useCallback } from 'react';
import kitchenPrinterService from '@/services/hardware/kitchenPrinterService';
import pagerService from '@/services/hardware/pagerService';
import customerDisplayService from '@/services/hardware/customerDisplayService';
import { HARDWARE_STATUS } from '../types/kitchen.types';

/**
 * Kitchen Hardware Hook
 */
export const useKitchenHardware = () => {
  const [printers, setPrinters] = useState({
    status: HARDWARE_STATUS.DISCONNECTED,
    devices: [],
    routing: [],
    queue: [],
  });

  const [pager, setPager] = useState({
    status: HARDWARE_STATUS.DISCONNECTED,
    activePagers: [],
    history: [],
  });

  const [customerDisplay, setCustomerDisplay] = useState({
    status: HARDWARE_STATUS.DISCONNECTED,
    currentMessage: { line1: '', line2: '' },
  });

  const [healthStatus, setHealthStatus] = useState({
    lastCheck: null,
    errors: [],
    warnings: [],
  });

  /**
   * Initialize all hardware
   */
  const initializeHardware = useCallback(async (config) => {
    const results = {
      printers: null,
      pager: null,
      customerDisplay: null,
    };

    // Initialize printers
    if (config.printers && config.printers.length > 0) {
      try {
        setPrinters((prev) => ({ ...prev, status: HARDWARE_STATUS.CONNECTING }));

        results.printers = await kitchenPrinterService.initialize(config.printers);

        if (config.printerRouting) {
          kitchenPrinterService.configureRouting(config.printerRouting);
        }

        setPrinters({
          status: results.printers.connected.length > 0
            ? HARDWARE_STATUS.ONLINE
            : HARDWARE_STATUS.OFFLINE,
          devices: results.printers.connected,
          routing: config.printerRouting || [],
          queue: [],
        });
      } catch (error) {
        console.error('Printer initialization error:', error);
        setPrinters((prev) => ({
          ...prev,
          status: HARDWARE_STATUS.ERROR
        }));
        addError('Printer initialization failed', error.message);
      }
    }

    // Initialize pager system
    if (config.pager && config.pager.enabled) {
      try {
        setPager((prev) => ({ ...prev, status: HARDWARE_STATUS.CONNECTING }));

        results.pager = await pagerService.initialize(config.pager);

        setPager({
          status: results.pager ? HARDWARE_STATUS.ONLINE : HARDWARE_STATUS.OFFLINE,
          activePagers: [],
          history: [],
        });
      } catch (error) {
        console.error('Pager initialization error:', error);
        setPager((prev) => ({
          ...prev,
          status: HARDWARE_STATUS.ERROR
        }));
        addError('Pager system initialization failed', error.message);
      }
    }

    // Initialize customer display
    if (config.customerDisplay && config.customerDisplay.enabled) {
      try {
        setCustomerDisplay((prev) => ({
          ...prev,
          status: HARDWARE_STATUS.CONNECTING
        }));

        results.customerDisplay = await customerDisplayService.initialize(
          config.customerDisplay
        );

        setCustomerDisplay({
          status: results.customerDisplay
            ? HARDWARE_STATUS.ONLINE
            : HARDWARE_STATUS.OFFLINE,
          currentMessage: { line1: '', line2: '' },
        });

        if (results.customerDisplay) {
          await customerDisplayService.displayWelcome();
        }
      } catch (error) {
        console.error('Customer display initialization error:', error);
        setCustomerDisplay((prev) => ({
          ...prev,
          status: HARDWARE_STATUS.ERROR
        }));
        addError('Customer display initialization failed', error.message);
      }
    }

    setHealthStatus((prev) => ({
      ...prev,
      lastCheck: new Date(),
    }));

    return results;
  }, []);

  /**
   * Print order to kitchen printers
   */
  const printOrder = useCallback(async (order, options = {}) => {
    try {
      const result = await kitchenPrinterService.printOrder(order, options);

      // Update queue status
      const queueStatus = kitchenPrinterService.getQueueStatus();
      setPrinters((prev) => ({
        ...prev,
        queue: queueStatus.jobs,
      }));

      return result;
    } catch (error) {
      console.error('Print order error:', error);
      addError('Print failed', error.message);
      throw error;
    }
  }, []);

  /**
   * Print bump ticket for expeditor
   */
  const printBumpTicket = useCallback(async (order) => {
    try {
      return await kitchenPrinterService.printBumpTicket(order);
    } catch (error) {
      console.error('Print bump ticket error:', error);
      addError('Bump ticket print failed', error.message);
      throw error;
    }
  }, []);

  /**
   * Page customer when order is ready
   */
  const pageCustomer = useCallback(async (order) => {
    try {
      const result = await pagerService.pageOrderReady(order);

      // Update active pagers
      const active = pagerService.getActivePagers();
      setPager((prev) => ({
        ...prev,
        activePagers: active,
      }));

      return result;
    } catch (error) {
      console.error('Page customer error:', error);
      addError('Customer paging failed', error.message);
      throw error;
    }
  }, []);

  /**
   * Buzz kitchen station
   */
  const buzzKitchen = useCallback(async (station, buzzerType = 'order_ready') => {
    try {
      return await pagerService.buzzKitchen(station, buzzerType);
    } catch (error) {
      console.error('Kitchen buzzer error:', error);
      addError('Kitchen buzzer failed', error.message);
      throw error;
    }
  }, []);

  /**
   * Update customer display
   */
  const updateCustomerDisplay = useCallback(async (line1, line2 = '') => {
    try {
      const result = await customerDisplayService.displayMessage(line1, line2);

      if (result) {
        setCustomerDisplay((prev) => ({
          ...prev,
          currentMessage: { line1, line2 },
        }));
      }

      return result;
    } catch (error) {
      console.error('Customer display error:', error);
      addError('Customer display update failed', error.message);
      throw error;
    }
  }, []);

  /**
   * Display item on customer display
   */
  const displayItemToCustomer = useCallback(async (itemName, price, currency = '$') => {
    try {
      return await customerDisplayService.displayItem(itemName, price, currency);
    } catch (error) {
      console.error('Display item error:', error);
      throw error;
    }
  }, []);

  /**
   * Display total on customer display
   */
  const displayTotalToCustomer = useCallback(async (total, currency = '$') => {
    try {
      return await customerDisplayService.displayTotal(total, currency);
    } catch (error) {
      console.error('Display total error:', error);
      throw error;
    }
  }, []);

  /**
   * Test printer
   */
  const testPrinter = useCallback(async (printerName) => {
    try {
      return await kitchenPrinterService.testPrint(printerName);
    } catch (error) {
      console.error('Test print error:', error);
      addError(`Test print failed for ${printerName}`, error.message);
      throw error;
    }
  }, []);

  /**
   * Test pager
   */
  const testPager = useCallback(async (pagerNumber) => {
    try {
      return await pagerService.test(pagerNumber);
    } catch (error) {
      console.error('Test pager error:', error);
      addError(`Test pager failed for #${pagerNumber}`, error.message);
      throw error;
    }
  }, []);

  /**
   * Test customer display
   */
  const testCustomerDisplay = useCallback(async () => {
    try {
      return await customerDisplayService.test();
    } catch (error) {
      console.error('Test display error:', error);
      addError('Test display failed', error.message);
      throw error;
    }
  }, []);

  /**
   * Get all printer statuses
   */
  const getPrinterStatuses = useCallback(() => {
    return kitchenPrinterService.getAllPrintersStatus();
  }, []);

  /**
   * Get printer queue status
   */
  const getPrinterQueue = useCallback(() => {
    return kitchenPrinterService.getQueueStatus();
  }, []);

  /**
   * Get active pagers
   */
  const getActivePagers = useCallback(() => {
    return pagerService.getActivePagers();
  }, []);

  /**
   * Clear pager (mark as returned)
   */
  const clearPager = useCallback((pagerNumber) => {
    const result = pagerService.clearPager(pagerNumber);

    // Update active pagers
    const active = pagerService.getActivePagers();
    setPager((prev) => ({
      ...prev,
      activePagers: active,
    }));

    return result;
  }, []);

  /**
   * Check hardware health
   */
  const checkHealth = useCallback(async () => {
    const health = {
      printers: [],
      pager: null,
      customerDisplay: null,
      timestamp: new Date(),
    };

    // Check printers
    try {
      health.printers = getPrinterStatuses();
    } catch (error) {
      console.error('Printer health check error:', error);
    }

    // Check pager
    try {
      health.pager = pagerService.getStatus();
    } catch (error) {
      console.error('Pager health check error:', error);
    }

    // Check customer display
    try {
      health.customerDisplay = customerDisplayService.getStatus();
    } catch (error) {
      console.error('Customer display health check error:', error);
    }

    setHealthStatus((prev) => ({
      ...prev,
      lastCheck: new Date(),
    }));

    return health;
  }, [getPrinterStatuses]);

  /**
   * Add error to health status
   */
  const addError = useCallback((message, details) => {
    setHealthStatus((prev) => ({
      ...prev,
      errors: [
        ...prev.errors.slice(-9), // Keep last 10 errors
        {
          message,
          details,
          timestamp: new Date(),
        },
      ],
    }));
  }, []);

  /**
   * Add warning to health status
   */
  const addWarning = useCallback((message, details) => {
    setHealthStatus((prev) => ({
      ...prev,
      warnings: [
        ...prev.warnings.slice(-9),
        {
          message,
          details,
          timestamp: new Date(),
        },
      ],
    }));
  }, []);

  /**
   * Disconnect all hardware
   */
  const disconnectAll = useCallback(async () => {
    try {
      await Promise.all([
        kitchenPrinterService.disconnectAll(),
        pagerService.disconnect(),
        customerDisplayService.disconnect(),
      ]);

      setPrinters((prev) => ({
        ...prev,
        status: HARDWARE_STATUS.DISCONNECTED
      }));
      setPager((prev) => ({
        ...prev,
        status: HARDWARE_STATUS.DISCONNECTED
      }));
      setCustomerDisplay((prev) => ({
        ...prev,
        status: HARDWARE_STATUS.DISCONNECTED
      }));

      return true;
    } catch (error) {
      console.error('Disconnect error:', error);
      return false;
    }
  }, []);

  /**
   * Auto health check every minute
   */
  useEffect(() => {
    const interval = setInterval(() => {
      checkHealth();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    // State
    printers,
    pager,
    customerDisplay,
    healthStatus,

    // Actions
    initializeHardware,
    printOrder,
    printBumpTicket,
    pageCustomer,
    buzzKitchen,
    updateCustomerDisplay,
    displayItemToCustomer,
    displayTotalToCustomer,

    // Testing
    testPrinter,
    testPager,
    testCustomerDisplay,

    // Status
    getPrinterStatuses,
    getPrinterQueue,
    getActivePagers,
    clearPager,
    checkHealth,

    // Cleanup
    disconnectAll,
  };
};

export default useKitchenHardware;
