/**
 * useModifiers Hook
 * Custom hook for managing modifiers
 */

import { useStore } from '../../../store';

export function useModifiers() {
  const {
    modifierGroups,
    fetchModifierGroups,
    createModifierGroup,
    updateModifierGroup,
    deleteModifierGroup,
    addModifierOption,
    updateModifierOption,
    removeModifierOption,
    duplicateModifierGroup,
    reorderModifierOptions,
    isLoadingModifiers,
    modifierError,
    clearModifierError
  } = useStore();

  return {
    // State
    modifierGroups,
    isLoadingModifiers,
    modifierError,

    // Actions
    fetchModifierGroups,
    createModifierGroup,
    updateModifierGroup,
    deleteModifierGroup,
    addModifierOption,
    updateModifierOption,
    removeModifierOption,
    duplicateModifierGroup,
    reorderModifierOptions,
    clearModifierError
  };
}

export function useModifierSelection(orderItemId) {
  const {
    selectedModifiers,
    setSelectedModifiers,
    addSelectedModifier,
    removeSelectedModifier,
    clearSelectedModifiers,
    getSelectedModifiers,
    calculateModifierTotal,
    validateModifierSelections
  } = useStore();

  return {
    // State
    selectedModifiers: getSelectedModifiers(orderItemId),

    // Actions
    setModifiers: (modifiers) => setSelectedModifiers(orderItemId, modifiers),
    addModifier: (modifier) => addSelectedModifier(orderItemId, modifier),
    removeModifier: (optionId) => removeSelectedModifier(orderItemId, optionId),
    clearModifiers: () => clearSelectedModifiers(orderItemId),
    calculateTotal: () => calculateModifierTotal(orderItemId),
    validateSelections: (modifierGroupIds) =>
      validateModifierSelections(orderItemId, modifierGroupIds)
  };
}

export default useModifiers;
