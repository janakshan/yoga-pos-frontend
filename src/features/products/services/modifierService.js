/**
 * Modifier Service
 * Handles all API calls and business logic for modifiers and modifier groups
 */

import { generateId } from '../../../utils/generateId';

/**
 * Get all modifier groups
 * @returns {Promise<import('../types/modifier.types.js').ModifierGroup[]>}
 */
export const getModifierGroups = async () => {
  try {
    const stored = localStorage.getItem('modifierGroups');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error fetching modifier groups:', error);
    throw error;
  }
};

/**
 * Get a single modifier group by ID
 * @param {string} id - Modifier group ID
 * @returns {Promise<import('../types/modifier.types.js').ModifierGroup|null>}
 */
export const getModifierGroupById = async (id) => {
  try {
    const groups = await getModifierGroups();
    return groups.find(group => group.id === id) || null;
  } catch (error) {
    console.error('Error fetching modifier group:', error);
    throw error;
  }
};

/**
 * Create a new modifier group
 * @param {import('../types/modifier.types.js').CreateModifierGroupInput} input
 * @returns {Promise<import('../types/modifier.types.js').ModifierGroup>}
 */
export const createModifierGroup = async (input) => {
  try {
    const groups = await getModifierGroups();

    // Generate IDs for options if not provided
    const optionsWithIds = input.options.map(option => ({
      id: option.id || generateId('modifier_option'),
      ...option
    }));

    const newGroup = {
      id: generateId('modifier_group'),
      ...input,
      options: optionsWithIds,
      status: input.status || 'active',
      displayOrder: input.displayOrder ?? groups.length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    groups.push(newGroup);
    localStorage.setItem('modifierGroups', JSON.stringify(groups));

    return newGroup;
  } catch (error) {
    console.error('Error creating modifier group:', error);
    throw error;
  }
};

/**
 * Update an existing modifier group
 * @param {string} id - Modifier group ID
 * @param {import('../types/modifier.types.js').UpdateModifierGroupInput} input
 * @returns {Promise<import('../types/modifier.types.js').ModifierGroup>}
 */
export const updateModifierGroup = async (id, input) => {
  try {
    const groups = await getModifierGroups();
    const index = groups.findIndex(group => group.id === id);

    if (index === -1) {
      throw new Error(`Modifier group with ID ${id} not found`);
    }

    // Ensure options have IDs
    const optionsWithIds = input.options?.map(option => ({
      id: option.id || generateId('modifier_option'),
      ...option
    })) || groups[index].options;

    const updatedGroup = {
      ...groups[index],
      ...input,
      options: optionsWithIds,
      updatedAt: new Date().toISOString()
    };

    groups[index] = updatedGroup;
    localStorage.setItem('modifierGroups', JSON.stringify(groups));

    return updatedGroup;
  } catch (error) {
    console.error('Error updating modifier group:', error);
    throw error;
  }
};

/**
 * Delete a modifier group
 * @param {string} id - Modifier group ID
 * @returns {Promise<boolean>}
 */
export const deleteModifierGroup = async (id) => {
  try {
    const groups = await getModifierGroups();
    const filteredGroups = groups.filter(group => group.id !== id);

    if (filteredGroups.length === groups.length) {
      throw new Error(`Modifier group with ID ${id} not found`);
    }

    localStorage.setItem('modifierGroups', JSON.stringify(filteredGroups));
    return true;
  } catch (error) {
    console.error('Error deleting modifier group:', error);
    throw error;
  }
};

/**
 * Add a modifier option to a group
 * @param {string} groupId - Modifier group ID
 * @param {import('../types/modifier.types.js').CreateModifierOptionInput} option
 * @returns {Promise<import('../types/modifier.types.js').ModifierGroup>}
 */
export const addModifierOption = async (groupId, option) => {
  try {
    const groups = await getModifierGroups();
    const index = groups.findIndex(group => group.id === groupId);

    if (index === -1) {
      throw new Error(`Modifier group with ID ${groupId} not found`);
    }

    const newOption = {
      id: generateId('modifier_option'),
      ...option
    };

    groups[index].options.push(newOption);
    groups[index].updatedAt = new Date().toISOString();

    localStorage.setItem('modifierGroups', JSON.stringify(groups));

    return groups[index];
  } catch (error) {
    console.error('Error adding modifier option:', error);
    throw error;
  }
};

/**
 * Update a modifier option
 * @param {string} groupId - Modifier group ID
 * @param {string} optionId - Option ID
 * @param {import('../types/modifier.types.js').CreateModifierOptionInput} updates
 * @returns {Promise<import('../types/modifier.types.js').ModifierGroup>}
 */
export const updateModifierOption = async (groupId, optionId, updates) => {
  try {
    const groups = await getModifierGroups();
    const groupIndex = groups.findIndex(group => group.id === groupId);

    if (groupIndex === -1) {
      throw new Error(`Modifier group with ID ${groupId} not found`);
    }

    const optionIndex = groups[groupIndex].options.findIndex(opt => opt.id === optionId);

    if (optionIndex === -1) {
      throw new Error(`Option with ID ${optionId} not found in group ${groupId}`);
    }

    groups[groupIndex].options[optionIndex] = {
      ...groups[groupIndex].options[optionIndex],
      ...updates
    };
    groups[groupIndex].updatedAt = new Date().toISOString();

    localStorage.setItem('modifierGroups', JSON.stringify(groups));

    return groups[groupIndex];
  } catch (error) {
    console.error('Error updating modifier option:', error);
    throw error;
  }
};

/**
 * Remove a modifier option from a group
 * @param {string} groupId - Modifier group ID
 * @param {string} optionId - Option ID
 * @returns {Promise<import('../types/modifier.types.js').ModifierGroup>}
 */
export const removeModifierOption = async (groupId, optionId) => {
  try {
    const groups = await getModifierGroups();
    const index = groups.findIndex(group => group.id === groupId);

    if (index === -1) {
      throw new Error(`Modifier group with ID ${groupId} not found`);
    }

    groups[index].options = groups[index].options.filter(opt => opt.id !== optionId);
    groups[index].updatedAt = new Date().toISOString();

    localStorage.setItem('modifierGroups', JSON.stringify(groups));

    return groups[index];
  } catch (error) {
    console.error('Error removing modifier option:', error);
    throw error;
  }
};

/**
 * Get modifier groups for a specific product
 * @param {string[]} modifierGroupIds - Array of modifier group IDs
 * @returns {Promise<import('../types/modifier.types.js').ModifierGroup[]>}
 */
export const getModifierGroupsForProduct = async (modifierGroupIds) => {
  try {
    const allGroups = await getModifierGroups();
    return allGroups.filter(group =>
      modifierGroupIds.includes(group.id) && group.status === 'active'
    );
  } catch (error) {
    console.error('Error fetching modifier groups for product:', error);
    throw error;
  }
};

/**
 * Calculate total modifier price
 * @param {import('../types/modifier.types.js').SelectedModifier[]} selectedModifiers
 * @returns {number}
 */
export const calculateModifierPrice = (selectedModifiers) => {
  if (!selectedModifiers || selectedModifiers.length === 0) {
    return 0;
  }

  return selectedModifiers.reduce((total, modifier) => {
    return total + (modifier.price * (modifier.quantity || 1));
  }, 0);
};

/**
 * Validate modifier selections against group rules
 * @param {import('../types/modifier.types.js').ModifierGroup} group
 * @param {import('../types/modifier.types.js').SelectedModifier[]} selections
 * @returns {{valid: boolean, errors: string[]}}
 */
export const validateModifierSelections = (group, selections) => {
  const errors = [];

  // Filter selections for this group
  const groupSelections = selections.filter(s => s.modifierGroupId === group.id);
  const selectionCount = groupSelections.length;

  // Check if required
  if (group.required && selectionCount === 0) {
    errors.push(`${group.name} is required`);
  }

  // Check minimum selections
  if (selectionCount < group.minSelections) {
    errors.push(`${group.name} requires at least ${group.minSelections} selection(s)`);
  }

  // Check maximum selections
  if (selectionCount > group.maxSelections) {
    errors.push(`${group.name} allows maximum ${group.maxSelections} selection(s)`);
  }

  // Check if options are available
  const unavailableOptions = groupSelections.filter(selection => {
    const option = group.options.find(opt => opt.id === selection.optionId);
    return option && !option.isAvailable;
  });

  if (unavailableOptions.length > 0) {
    errors.push(`Some selected options in ${group.name} are not available`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Get modifier group statistics
 * @param {string} groupId - Modifier group ID
 * @param {Date} startDate - Start date for stats
 * @param {Date} endDate - End date for stats
 * @returns {Promise<import('../types/modifier.types.js').ModifierGroupStats>}
 */
export const getModifierGroupStats = async (groupId, startDate, endDate) => {
  try {
    // This would typically call an analytics API
    // For now, return mock data structure
    const group = await getModifierGroupById(groupId);

    if (!group) {
      throw new Error(`Modifier group with ID ${groupId} not found`);
    }

    return {
      modifierGroupId: groupId,
      modifierGroupName: group.name,
      totalSelections: 0,
      revenue: 0,
      optionSelections: {},
      lastUsed: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching modifier group stats:', error);
    throw error;
  }
};

/**
 * Duplicate a modifier group
 * @param {string} id - Modifier group ID to duplicate
 * @returns {Promise<import('../types/modifier.types.js').ModifierGroup>}
 */
export const duplicateModifierGroup = async (id) => {
  try {
    const group = await getModifierGroupById(id);

    if (!group) {
      throw new Error(`Modifier group with ID ${id} not found`);
    }

    const { id: _id, createdAt, updatedAt, ...groupData } = group;

    return await createModifierGroup({
      ...groupData,
      name: `${group.name} (Copy)`,
      options: group.options.map(({ id: optionId, ...optionData }) => optionData)
    });
  } catch (error) {
    console.error('Error duplicating modifier group:', error);
    throw error;
  }
};

/**
 * Reorder modifier options in a group
 * @param {string} groupId - Modifier group ID
 * @param {string[]} optionIds - Array of option IDs in new order
 * @returns {Promise<import('../types/modifier.types.js').ModifierGroup>}
 */
export const reorderModifierOptions = async (groupId, optionIds) => {
  try {
    const groups = await getModifierGroups();
    const index = groups.findIndex(group => group.id === groupId);

    if (index === -1) {
      throw new Error(`Modifier group with ID ${groupId} not found`);
    }

    // Reorder options based on optionIds array
    const reorderedOptions = optionIds.map((optionId, displayOrder) => {
      const option = groups[index].options.find(opt => opt.id === optionId);
      return {
        ...option,
        displayOrder
      };
    });

    groups[index].options = reorderedOptions;
    groups[index].updatedAt = new Date().toISOString();

    localStorage.setItem('modifierGroups', JSON.stringify(groups));

    return groups[index];
  } catch (error) {
    console.error('Error reordering modifier options:', error);
    throw error;
  }
};

export default {
  getModifierGroups,
  getModifierGroupById,
  createModifierGroup,
  updateModifierGroup,
  deleteModifierGroup,
  addModifierOption,
  updateModifierOption,
  removeModifierOption,
  getModifierGroupsForProduct,
  calculateModifierPrice,
  validateModifierSelections,
  getModifierGroupStats,
  duplicateModifierGroup,
  reorderModifierOptions
};
