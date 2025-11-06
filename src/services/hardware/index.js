/**
 * Hardware Services Index
 * Central export for all hardware services
 */

import printerService from './printerService';
import scannerService from './scannerService';
import cashDrawerService from './cashDrawerService';
import customerDisplayService from './customerDisplayService';

export {
  printerService,
  scannerService,
  cashDrawerService,
  customerDisplayService,
};

export default {
  printer: printerService,
  scanner: scannerService,
  cashDrawer: cashDrawerService,
  customerDisplay: customerDisplayService,
};
