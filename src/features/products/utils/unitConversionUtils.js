/**
 * Unit Conversion Utilities
 * Utilities for converting between different units of measurement
 */

import { UNIT_CONVERSIONS } from '../types/product.types.js';

/**
 * Converts a quantity from one unit to another
 * @param {number} quantity - Quantity to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @param {Object} [customConversions] - Product-specific conversion factors
 * @returns {number} Converted quantity
 */
export const convertUnit = (quantity, fromUnit, toUnit, customConversions = {}) => {
  if (fromUnit === toUnit) {
    return quantity;
  }

  // Check for custom conversions first (product-specific)
  const customKey = `${fromUnit}_to_${toUnit}`;
  if (customConversions[customKey]) {
    return quantity * customConversions[customKey].conversionFactor;
  }

  // Check standard conversions
  const standardKey = `${fromUnit}_to_${toUnit}`;
  if (UNIT_CONVERSIONS[standardKey]) {
    return quantity * UNIT_CONVERSIONS[standardKey].conversionFactor;
  }

  // Try reverse conversion
  const reverseKey = `${toUnit}_to_${fromUnit}`;
  if (UNIT_CONVERSIONS[reverseKey]) {
    return quantity / UNIT_CONVERSIONS[reverseKey].conversionFactor;
  }

  throw new Error(`No conversion available from ${fromUnit} to ${toUnit}`);
};

/**
 * Gets all available conversions for a given unit
 * @param {string} unit - Unit to get conversions for
 * @param {Object} [customConversions] - Product-specific conversions
 * @returns {Array<Object>} Array of available conversions
 */
export const getAvailableConversions = (unit, customConversions = {}) => {
  const conversions = [];

  // Check standard conversions
  Object.entries(UNIT_CONVERSIONS).forEach(([key, conversion]) => {
    if (conversion.fromUnit === unit) {
      conversions.push({
        ...conversion,
        isCustom: false
      });
    } else if (conversion.toUnit === unit) {
      // Add reverse conversion
      conversions.push({
        fromUnit: conversion.toUnit,
        toUnit: conversion.fromUnit,
        conversionFactor: 1 / conversion.conversionFactor,
        formula: `Reverse of: ${conversion.formula}`,
        isCustom: false
      });
    }
  });

  // Check custom conversions
  Object.entries(customConversions).forEach(([key, conversion]) => {
    if (conversion.fromUnit === unit) {
      conversions.push({
        ...conversion,
        isCustom: true
      });
    }
  });

  return conversions;
};

/**
 * Checks if conversion is available between two units
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @param {Object} [customConversions] - Product-specific conversions
 * @returns {boolean} True if conversion is available
 */
export const canConvert = (fromUnit, toUnit, customConversions = {}) => {
  if (fromUnit === toUnit) {
    return true;
  }

  const customKey = `${fromUnit}_to_${toUnit}`;
  if (customConversions[customKey]) {
    return true;
  }

  const standardKey = `${fromUnit}_to_${toUnit}`;
  if (UNIT_CONVERSIONS[standardKey]) {
    return true;
  }

  const reverseKey = `${toUnit}_to_${fromUnit}`;
  if (UNIT_CONVERSIONS[reverseKey]) {
    return true;
  }

  return false;
};

/**
 * Formats a quantity with its unit
 * @param {number} quantity - Quantity to format
 * @param {string} unit - Unit of measurement
 * @param {Object} options - Formatting options
 * @param {number} [options.decimals=2] - Number of decimal places
 * @param {boolean} [options.showUnit=true] - Whether to show the unit
 * @param {Object} [options.unitLabels] - Custom unit labels
 * @returns {string} Formatted quantity string
 */
export const formatQuantity = (quantity, unit, options = {}) => {
  const {
    decimals = 2,
    showUnit = true,
    unitLabels = {}
  } = options;

  const formattedQuantity = typeof quantity === 'number'
    ? quantity.toFixed(decimals).replace(/\.?0+$/, '')
    : quantity;

  if (!showUnit) {
    return formattedQuantity;
  }

  const unitLabel = unitLabels[unit] || unit;
  return `${formattedQuantity} ${unitLabel}`;
};

/**
 * Creates a custom unit conversion for a product
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @param {number} conversionFactor - Conversion multiplier
 * @param {string} [formula] - Formula description
 * @returns {Object} Conversion object
 */
export const createCustomConversion = (fromUnit, toUnit, conversionFactor, formula = '') => {
  return {
    fromUnit,
    toUnit,
    conversionFactor,
    formula: formula || `1 ${fromUnit} = ${conversionFactor} ${toUnit}`
  };
};

/**
 * Validates a custom conversion factor
 * @param {number} conversionFactor - Factor to validate
 * @returns {boolean} True if valid
 */
export const isValidConversionFactor = (conversionFactor) => {
  return typeof conversionFactor === 'number'
    && conversionFactor > 0
    && isFinite(conversionFactor);
};

/**
 * Gets conversion factor between two units
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @param {Object} [customConversions] - Product-specific conversions
 * @returns {number|null} Conversion factor or null if not available
 */
export const getConversionFactor = (fromUnit, toUnit, customConversions = {}) => {
  if (fromUnit === toUnit) {
    return 1;
  }

  const customKey = `${fromUnit}_to_${toUnit}`;
  if (customConversions[customKey]) {
    return customConversions[customKey].conversionFactor;
  }

  const standardKey = `${fromUnit}_to_${toUnit}`;
  if (UNIT_CONVERSIONS[standardKey]) {
    return UNIT_CONVERSIONS[standardKey].conversionFactor;
  }

  const reverseKey = `${toUnit}_to_${fromUnit}`;
  if (UNIT_CONVERSIONS[reverseKey]) {
    return 1 / UNIT_CONVERSIONS[reverseKey].conversionFactor;
  }

  return null;
};

/**
 * Converts stock quantity for display in different units
 * @param {number} stockQuantity - Stock quantity in base unit
 * @param {string} baseUnit - Base unit of the product
 * @param {string} displayUnit - Unit to display in
 * @param {Object} [customConversions] - Product-specific conversions
 * @returns {Object} Converted quantity info
 */
export const convertStockForDisplay = (stockQuantity, baseUnit, displayUnit, customConversions = {}) => {
  try {
    const convertedQuantity = convertUnit(stockQuantity, baseUnit, displayUnit, customConversions);
    return {
      quantity: convertedQuantity,
      unit: displayUnit,
      originalQuantity: stockQuantity,
      originalUnit: baseUnit,
      success: true
    };
  } catch (error) {
    return {
      quantity: stockQuantity,
      unit: baseUnit,
      originalQuantity: stockQuantity,
      originalUnit: baseUnit,
      success: false,
      error: error.message
    };
  }
};

/**
 * Converts pricing based on unit conversion
 * Useful for pricing per different units (e.g., price per kg vs price per g)
 * @param {number} price - Price in base unit
 * @param {string} baseUnit - Base unit
 * @param {string} targetUnit - Target unit
 * @param {Object} [customConversions] - Product-specific conversions
 * @returns {number} Converted price
 */
export const convertPriceByUnit = (price, baseUnit, targetUnit, customConversions = {}) => {
  if (baseUnit === targetUnit) {
    return price;
  }

  const factor = getConversionFactor(baseUnit, targetUnit, customConversions);
  if (factor === null) {
    throw new Error(`Cannot convert price from ${baseUnit} to ${targetUnit}`);
  }

  // Price conversion is inverse of quantity conversion
  return price / factor;
};

/**
 * Groups conversion factors by conversion type (weight, volume, etc.)
 * @returns {Object} Grouped conversions
 */
export const getConversionGroups = () => {
  return {
    weight: {
      name: 'Weight',
      conversions: [
        UNIT_CONVERSIONS.kg_to_g,
        UNIT_CONVERSIONS.g_to_kg
      ]
    },
    volume: {
      name: 'Volume',
      conversions: [
        UNIT_CONVERSIONS.l_to_ml,
        UNIT_CONVERSIONS.ml_to_l
      ]
    },
    packaging: {
      name: 'Packaging',
      conversions: [
        UNIT_CONVERSIONS.set_to_piece,
        UNIT_CONVERSIONS.pack_to_piece
      ]
    }
  };
};

/**
 * Normalizes quantity to base unit for comparison
 * @param {number} quantity - Quantity to normalize
 * @param {string} unit - Unit of the quantity
 * @param {string} baseUnit - Base unit to normalize to
 * @param {Object} [customConversions] - Product-specific conversions
 * @returns {number} Normalized quantity
 */
export const normalizeToBaseUnit = (quantity, unit, baseUnit, customConversions = {}) => {
  if (unit === baseUnit) {
    return quantity;
  }

  try {
    return convertUnit(quantity, unit, baseUnit, customConversions);
  } catch (error) {
    console.warn(`Cannot normalize ${unit} to ${baseUnit}:`, error.message);
    return quantity;
  }
};

export default {
  convertUnit,
  getAvailableConversions,
  canConvert,
  formatQuantity,
  createCustomConversion,
  isValidConversionFactor,
  getConversionFactor,
  convertStockForDisplay,
  convertPriceByUnit,
  getConversionGroups,
  normalizeToBaseUnit
};
