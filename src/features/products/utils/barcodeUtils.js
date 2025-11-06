/**
 * Barcode Utilities
 * Utilities for generating and validating barcodes
 */

/**
 * Generates a check digit for EAN-13 barcode using modulo 10 algorithm
 * @param {string} digits - First 12 digits of the barcode
 * @returns {number} Check digit (0-9)
 */
const calculateEAN13CheckDigit = (digits) => {
  if (digits.length !== 12) {
    throw new Error('EAN-13 requires exactly 12 digits before check digit');
  }

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(digits[i], 10);
    // Odd positions (from right) are multiplied by 3
    sum += (i % 2 === 0) ? digit : digit * 3;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit;
};

/**
 * Generates a check digit for UPC-A barcode
 * @param {string} digits - First 11 digits of the barcode
 * @returns {number} Check digit (0-9)
 */
const calculateUPCACheckDigit = (digits) => {
  if (digits.length !== 11) {
    throw new Error('UPC-A requires exactly 11 digits before check digit');
  }

  let oddSum = 0;
  let evenSum = 0;

  for (let i = 0; i < 11; i++) {
    const digit = parseInt(digits[i], 10);
    if (i % 2 === 0) {
      oddSum += digit;
    } else {
      evenSum += digit;
    }
  }

  const total = (oddSum * 3) + evenSum;
  const checkDigit = (10 - (total % 10)) % 10;
  return checkDigit;
};

/**
 * Generates a unique barcode based on product information
 * @param {Object} options - Barcode generation options
 * @param {string} options.type - Barcode type: 'EAN13', 'UPCA', 'CODE128', 'CUSTOM'
 * @param {string} [options.prefix] - Custom prefix for the barcode
 * @param {string} [options.sku] - Product SKU
 * @param {string} [options.productId] - Product ID
 * @returns {string} Generated barcode
 */
export const generateBarcode = (options = {}) => {
  const { type = 'EAN13', prefix = '200', sku = '', productId = '' } = options;

  switch (type.toUpperCase()) {
    case 'EAN13':
      return generateEAN13Barcode(prefix, sku, productId);

    case 'UPCA':
      return generateUPCABarcode(prefix, sku, productId);

    case 'CODE128':
      return generateCODE128Barcode(prefix, sku, productId);

    case 'CUSTOM':
      return generateCustomBarcode(prefix, sku, productId);

    default:
      throw new Error(`Unsupported barcode type: ${type}`);
  }
};

/**
 * Generates an EAN-13 barcode
 * @param {string} prefix - Country/manufacturer prefix (2-3 digits)
 * @param {string} sku - Product SKU
 * @param {string} productId - Product ID
 * @returns {string} 13-digit EAN-13 barcode
 */
const generateEAN13Barcode = (prefix, sku, productId) => {
  // Use timestamp and random number for uniqueness
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

  // Create base number (12 digits)
  let baseNumber = prefix.padStart(3, '0').slice(0, 3);
  baseNumber += timestamp;
  baseNumber += random;

  // Ensure exactly 12 digits
  baseNumber = baseNumber.slice(0, 12).padStart(12, '0');

  // Calculate and append check digit
  const checkDigit = calculateEAN13CheckDigit(baseNumber);

  return baseNumber + checkDigit;
};

/**
 * Generates a UPC-A barcode
 * @param {string} prefix - Number system digit
 * @param {string} sku - Product SKU
 * @param {string} productId - Product ID
 * @returns {string} 12-digit UPC-A barcode
 */
const generateUPCABarcode = (prefix, sku, productId) => {
  // Use timestamp and random number for uniqueness
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

  // Create base number (11 digits)
  let baseNumber = prefix.slice(0, 1).padStart(1, '0');
  baseNumber += random;
  baseNumber += timestamp;

  // Ensure exactly 11 digits
  baseNumber = baseNumber.slice(0, 11).padStart(11, '0');

  // Calculate and append check digit
  const checkDigit = calculateUPCACheckDigit(baseNumber);

  return baseNumber + checkDigit;
};

/**
 * Generates a CODE128 barcode (alphanumeric)
 * @param {string} prefix - Custom prefix
 * @param {string} sku - Product SKU
 * @param {string} productId - Product ID
 * @returns {string} CODE128 barcode
 */
const generateCODE128Barcode = (prefix, sku, productId) => {
  // CODE128 can handle alphanumeric, so we can be more flexible
  const sanitizedSku = sku.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const timestamp = Date.now().toString().slice(-8);

  return `${prefix}${sanitizedSku}${timestamp}`.slice(0, 20);
};

/**
 * Generates a custom barcode based on SKU and product info
 * @param {string} prefix - Custom prefix
 * @param {string} sku - Product SKU
 * @param {string} productId - Product ID
 * @returns {string} Custom barcode
 */
const generateCustomBarcode = (prefix, sku, productId) => {
  // Use SKU if available, otherwise use product ID
  const identifier = sku || productId || Date.now().toString();
  const sanitized = identifier.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  const timestamp = Date.now().toString().slice(-6);

  return `${prefix}${sanitized}${timestamp}`.slice(0, 25);
};

/**
 * Validates an EAN-13 barcode
 * @param {string} barcode - Barcode to validate
 * @returns {boolean} True if valid
 */
export const validateEAN13 = (barcode) => {
  if (!barcode || barcode.length !== 13) {
    return false;
  }

  if (!/^\d{13}$/.test(barcode)) {
    return false;
  }

  const checkDigit = parseInt(barcode[12], 10);
  const calculatedCheckDigit = calculateEAN13CheckDigit(barcode.slice(0, 12));

  return checkDigit === calculatedCheckDigit;
};

/**
 * Validates a UPC-A barcode
 * @param {string} barcode - Barcode to validate
 * @returns {boolean} True if valid
 */
export const validateUPCA = (barcode) => {
  if (!barcode || barcode.length !== 12) {
    return false;
  }

  if (!/^\d{12}$/.test(barcode)) {
    return false;
  }

  const checkDigit = parseInt(barcode[11], 10);
  const calculatedCheckDigit = calculateUPCACheckDigit(barcode.slice(0, 11));

  return checkDigit === calculatedCheckDigit;
};

/**
 * Validates any barcode format
 * @param {string} barcode - Barcode to validate
 * @param {string} type - Barcode type to validate against
 * @returns {boolean} True if valid
 */
export const validateBarcode = (barcode, type = 'auto') => {
  if (!barcode) {
    return false;
  }

  if (type === 'auto') {
    // Auto-detect based on length and format
    if (barcode.length === 13 && /^\d{13}$/.test(barcode)) {
      return validateEAN13(barcode);
    }
    if (barcode.length === 12 && /^\d{12}$/.test(barcode)) {
      return validateUPCA(barcode);
    }
    // For other formats, just check it's not empty and has valid characters
    return /^[A-Z0-9-]+$/i.test(barcode);
  }

  switch (type.toUpperCase()) {
    case 'EAN13':
      return validateEAN13(barcode);
    case 'UPCA':
      return validateUPCA(barcode);
    case 'CODE128':
    case 'CUSTOM':
      return /^[A-Z0-9-]+$/i.test(barcode) && barcode.length <= 25;
    default:
      return false;
  }
};

/**
 * Formats a barcode with spaces for better readability
 * @param {string} barcode - Barcode to format
 * @param {string} type - Barcode type
 * @returns {string} Formatted barcode
 */
export const formatBarcode = (barcode, type = 'auto') => {
  if (!barcode) {
    return '';
  }

  // Auto-detect type if not specified
  if (type === 'auto') {
    if (barcode.length === 13) {
      type = 'EAN13';
    } else if (barcode.length === 12) {
      type = 'UPCA';
    } else {
      return barcode;
    }
  }

  switch (type.toUpperCase()) {
    case 'EAN13':
      // Format: XXX XXXX XXXXX X
      return `${barcode.slice(0, 3)} ${barcode.slice(3, 7)} ${barcode.slice(7, 12)} ${barcode.slice(12)}`;

    case 'UPCA':
      // Format: X XXXXX XXXXX X
      return `${barcode.slice(0, 1)} ${barcode.slice(1, 6)} ${barcode.slice(6, 11)} ${barcode.slice(11)}`;

    default:
      return barcode;
  }
};

/**
 * Generates a barcode for a product variant
 * @param {string} baseBarcode - Base product barcode
 * @param {number} variantIndex - Index of the variant
 * @returns {string} Variant barcode
 */
export const generateVariantBarcode = (baseBarcode, variantIndex) => {
  if (!baseBarcode) {
    return generateBarcode({ type: 'CUSTOM', prefix: 'VAR' });
  }

  // For numeric barcodes, increment the last digits
  if (/^\d+$/.test(baseBarcode)) {
    const baseNumber = baseBarcode.slice(0, -3);
    const suffix = (parseInt(baseBarcode.slice(-3), 10) + variantIndex + 1).toString().padStart(3, '0');
    return baseNumber + suffix;
  }

  // For alphanumeric, append variant index
  return `${baseBarcode}-${variantIndex + 1}`;
};

/**
 * Checks if a barcode is unique in a list of products
 * @param {string} barcode - Barcode to check
 * @param {Array} products - Array of products to check against
 * @param {string} [excludeProductId] - Product ID to exclude from check (for updates)
 * @returns {boolean} True if unique
 */
export const isBarcodeUnique = (barcode, products, excludeProductId = null) => {
  if (!barcode) {
    return true; // Empty barcodes are allowed
  }

  return !products.some(product => {
    if (excludeProductId && product.id === excludeProductId) {
      return false; // Skip the product being updated
    }

    // Check main product barcode
    if (product.barcode === barcode) {
      return true;
    }

    // Check variant barcodes
    if (product.variants && Array.isArray(product.variants)) {
      return product.variants.some(variant => variant.barcode === barcode);
    }

    return false;
  });
};

export default {
  generateBarcode,
  validateBarcode,
  validateEAN13,
  validateUPCA,
  formatBarcode,
  generateVariantBarcode,
  isBarcodeUnique
};
