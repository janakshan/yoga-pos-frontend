/**
 * Modifier Slice
 * Zustand slice for managing modifier groups and selections
 */

import modifierService from '../services/modifierService';

/**
 * Create modifier slice
 * @param {Function} set - Zustand set function
 * @param {Function} get - Zustand get function
 * @returns {Object} Modifier slice
 */
export const createModifierSlice = (set, get) => ({
  // State
  modifierGroups: [],
  selectedModifiers: {}, // keyed by order item ID
  isLoadingModifiers: false,
  modifierError: null,

  // Actions

  /**
   * Fetch all modifier groups
   */
  fetchModifierGroups: async () => {
    set({ isLoadingModifiers: true, modifierError: null });
    try {
      const groups = await modifierService.getModifierGroups();
      set({ modifierGroups: groups, isLoadingModifiers: false });
    } catch (error) {
      set({ modifierError: error.message, isLoadingModifiers: false });
      throw error;
    }
  },

  /**
   * Create a new modifier group
   * @param {import('../types/modifier.types.js').CreateModifierGroupInput} input
   */
  createModifierGroup: async (input) => {
    set({ isLoadingModifiers: true, modifierError: null });
    try {
      const newGroup = await modifierService.createModifierGroup(input);
      set((state) => ({
        modifierGroups: [...state.modifierGroups, newGroup],
        isLoadingModifiers: false
      }));
      return newGroup;
    } catch (error) {
      set({ modifierError: error.message, isLoadingModifiers: false });
      throw error;
    }
  },

  /**
   * Update a modifier group
   * @param {string} id
   * @param {import('../types/modifier.types.js').UpdateModifierGroupInput} input
   */
  updateModifierGroup: async (id, input) => {
    set({ isLoadingModifiers: true, modifierError: null });
    try {
      const updatedGroup = await modifierService.updateModifierGroup(id, input);
      set((state) => ({
        modifierGroups: state.modifierGroups.map(group =>
          group.id === id ? updatedGroup : group
        ),
        isLoadingModifiers: false
      }));
      return updatedGroup;
    } catch (error) {
      set({ modifierError: error.message, isLoadingModifiers: false });
      throw error;
    }
  },

  /**
   * Delete a modifier group
   * @param {string} id
   */
  deleteModifierGroup: async (id) => {
    set({ isLoadingModifiers: true, modifierError: null });
    try {
      await modifierService.deleteModifierGroup(id);
      set((state) => ({
        modifierGroups: state.modifierGroups.filter(group => group.id !== id),
        isLoadingModifiers: false
      }));
    } catch (error) {
      set({ modifierError: error.message, isLoadingModifiers: false });
      throw error;
    }
  },

  /**
   * Add a modifier option to a group
   * @param {string} groupId
   * @param {import('../types/modifier.types.js').CreateModifierOptionInput} option
   */
  addModifierOption: async (groupId, option) => {
    set({ isLoadingModifiers: true, modifierError: null });
    try {
      const updatedGroup = await modifierService.addModifierOption(groupId, option);
      set((state) => ({
        modifierGroups: state.modifierGroups.map(group =>
          group.id === groupId ? updatedGroup : group
        ),
        isLoadingModifiers: false
      }));
      return updatedGroup;
    } catch (error) {
      set({ modifierError: error.message, isLoadingModifiers: false });
      throw error;
    }
  },

  /**
   * Update a modifier option
   * @param {string} groupId
   * @param {string} optionId
   * @param {import('../types/modifier.types.js').CreateModifierOptionInput} updates
   */
  updateModifierOption: async (groupId, optionId, updates) => {
    set({ isLoadingModifiers: true, modifierError: null });
    try {
      const updatedGroup = await modifierService.updateModifierOption(groupId, optionId, updates);
      set((state) => ({
        modifierGroups: state.modifierGroups.map(group =>
          group.id === groupId ? updatedGroup : group
        ),
        isLoadingModifiers: false
      }));
      return updatedGroup;
    } catch (error) {
      set({ modifierError: error.message, isLoadingModifiers: false });
      throw error;
    }
  },

  /**
   * Remove a modifier option
   * @param {string} groupId
   * @param {string} optionId
   */
  removeModifierOption: async (groupId, optionId) => {
    set({ isLoadingModifiers: true, modifierError: null });
    try {
      const updatedGroup = await modifierService.removeModifierOption(groupId, optionId);
      set((state) => ({
        modifierGroups: state.modifierGroups.map(group =>
          group.id === groupId ? updatedGroup : group
        ),
        isLoadingModifiers: false
      }));
      return updatedGroup;
    } catch (error) {
      set({ modifierError: error.message, isLoadingModifiers: false });
      throw error;
    }
  },

  /**
   * Set selected modifiers for an order item
   * @param {string} orderItemId
   * @param {import('../types/modifier.types.js').SelectedModifier[]} modifiers
   */
  setSelectedModifiers: (orderItemId, modifiers) => {
    set((state) => ({
      selectedModifiers: {
        ...state.selectedModifiers,
        [orderItemId]: modifiers
      }
    }));
  },

  /**
   * Add a selected modifier to an order item
   * @param {string} orderItemId
   * @param {import('../types/modifier.types.js').SelectedModifier} modifier
   */
  addSelectedModifier: (orderItemId, modifier) => {
    set((state) => {
      const existing = state.selectedModifiers[orderItemId] || [];
      return {
        selectedModifiers: {
          ...state.selectedModifiers,
          [orderItemId]: [...existing, modifier]
        }
      };
    });
  },

  /**
   * Remove a selected modifier from an order item
   * @param {string} orderItemId
   * @param {string} optionId
   */
  removeSelectedModifier: (orderItemId, optionId) => {
    set((state) => {
      const existing = state.selectedModifiers[orderItemId] || [];
      return {
        selectedModifiers: {
          ...state.selectedModifiers,
          [orderItemId]: existing.filter(m => m.optionId !== optionId)
        }
      };
    });
  },

  /**
   * Clear selected modifiers for an order item
   * @param {string} orderItemId
   */
  clearSelectedModifiers: (orderItemId) => {
    set((state) => {
      const { [orderItemId]: _, ...rest } = state.selectedModifiers;
      return { selectedModifiers: rest };
    });
  },

  /**
   * Get selected modifiers for an order item
   * @param {string} orderItemId
   * @returns {import('../types/modifier.types.js').SelectedModifier[]}
   */
  getSelectedModifiers: (orderItemId) => {
    return get().selectedModifiers[orderItemId] || [];
  },

  /**
   * Calculate total price for selected modifiers
   * @param {string} orderItemId
   * @returns {number}
   */
  calculateModifierTotal: (orderItemId) => {
    const modifiers = get().selectedModifiers[orderItemId] || [];
    return modifierService.calculateModifierPrice(modifiers);
  },

  /**
   * Validate modifier selections for an order item
   * @param {string} orderItemId
   * @param {string[]} modifierGroupIds
   * @returns {{valid: boolean, errors: string[]}}
   */
  validateModifierSelections: (orderItemId, modifierGroupIds) => {
    const state = get();
    const selectedModifiers = state.selectedModifiers[orderItemId] || [];
    const allErrors = [];

    modifierGroupIds.forEach(groupId => {
      const group = state.modifierGroups.find(g => g.id === groupId);
      if (group) {
        const validation = modifierService.validateModifierSelections(group, selectedModifiers);
        if (!validation.valid) {
          allErrors.push(...validation.errors);
        }
      }
    });

    return {
      valid: allErrors.length === 0,
      errors: allErrors
    };
  },

  /**
   * Duplicate a modifier group
   * @param {string} id
   */
  duplicateModifierGroup: async (id) => {
    set({ isLoadingModifiers: true, modifierError: null });
    try {
      const duplicatedGroup = await modifierService.duplicateModifierGroup(id);
      set((state) => ({
        modifierGroups: [...state.modifierGroups, duplicatedGroup],
        isLoadingModifiers: false
      }));
      return duplicatedGroup;
    } catch (error) {
      set({ modifierError: error.message, isLoadingModifiers: false });
      throw error;
    }
  },

  /**
   * Reorder modifier options in a group
   * @param {string} groupId
   * @param {string[]} optionIds
   */
  reorderModifierOptions: async (groupId, optionIds) => {
    set({ isLoadingModifiers: true, modifierError: null });
    try {
      const updatedGroup = await modifierService.reorderModifierOptions(groupId, optionIds);
      set((state) => ({
        modifierGroups: state.modifierGroups.map(group =>
          group.id === groupId ? updatedGroup : group
        ),
        isLoadingModifiers: false
      }));
      return updatedGroup;
    } catch (error) {
      set({ modifierError: error.message, isLoadingModifiers: false });
      throw error;
    }
  },

  /**
   * Clear modifier error
   */
  clearModifierError: () => {
    set({ modifierError: null });
  }
});
