/**
 * useFloorPlan Hook - React hook for floor plan management
 * @module features/restaurant/floorplan/hooks/useFloorPlan
 */

import { useCallback } from 'react';
import { useStore } from '@/store';
import { floorplanService } from '../services/floorplanService';
import toast from 'react-hot-toast';

/**
 * Custom hook for floor plan management
 * @returns {Object} Floor plan state and operations
 */
export const useFloorPlan = () => {
  // Select state from store
  const floorPlans = useStore((state) => state.floorPlans);
  const selectedFloorPlan = useStore((state) => state.selectedFloorPlan);
  const activeFloorPlan = useStore((state) => state.activeFloorPlan);
  const editorMode = useStore((state) => state.editorMode);
  const selectedObjects = useStore((state) => state.selectedObjects);
  const editorClipboard = useStore((state) => state.editorClipboard);
  const isDragging = useStore((state) => state.isDragging);
  const dragStart = useStore((state) => state.dragStart);
  const zoom = useStore((state) => state.zoom);
  const panOffset = useStore((state) => state.panOffset);
  const showGrid = useStore((state) => state.showGrid);
  const snapToGrid = useStore((state) => state.snapToGrid);
  const sectionStats = useStore((state) => state.sectionStats);
  const isLoading = useStore((state) => state.floorPlanLoading);
  const error = useStore((state) => state.floorPlanError);

  // Select actions from store
  const setFloorPlans = useStore((state) => state.setFloorPlans);
  const addFloorPlan = useStore((state) => state.addFloorPlan);
  const updateFloorPlan = useStore((state) => state.updateFloorPlan);
  const removeFloorPlan = useStore((state) => state.removeFloorPlan);
  const setSelectedFloorPlan = useStore((state) => state.setSelectedFloorPlan);
  const setActiveFloorPlan = useStore((state) => state.setActiveFloorPlan);
  const setEditorMode = useStore((state) => state.setEditorMode);
  const setSelectedObjects = useStore((state) => state.setSelectedObjects);
  const addToSelection = useStore((state) => state.addToSelection);
  const removeFromSelection = useStore((state) => state.removeFromSelection);
  const clearSelection = useStore((state) => state.clearSelection);
  const setClipboard = useStore((state) => state.setClipboard);
  const setDragging = useStore((state) => state.setDragging);
  const setZoom = useStore((state) => state.setZoom);
  const setPanOffset = useStore((state) => state.setPanOffset);
  const toggleGrid = useStore((state) => state.toggleGrid);
  const toggleSnapToGrid = useStore((state) => state.toggleSnapToGrid);
  const resetEditorView = useStore((state) => state.resetEditorView);
  const setSectionStats = useStore((state) => state.setSectionStats);
  const setFloorPlanLoading = useStore((state) => state.setFloorPlanLoading);
  const setFloorPlanError = useStore((state) => state.setFloorPlanError);
  const clearFloorPlanError = useStore((state) => state.clearFloorPlanError);

  // Select selectors from store
  const getFloorPlanById = useStore((state) => state.getFloorPlanById);
  const getFloorPlansByFloor = useStore((state) => state.getFloorPlansByFloor);
  const getActiveFloorPlans = useStore((state) => state.getActiveFloorPlans);
  const getSectionById = useStore((state) => state.getSectionById);
  const getElementById = useStore((state) => state.getElementById);

  /**
   * Fetch floor plans from API
   */
  const fetchFloorPlans = useCallback(
    async (filters = {}) => {
      try {
        setFloorPlanLoading(true);
        clearFloorPlanError();

        const response = await floorplanService.getList(filters);
        setFloorPlans(response.data);

        return response.data;
      } catch (err) {
        const message = err.message || 'Failed to load floor plans';
        setFloorPlanError(message);
        toast.error(message);
        throw err;
      } finally {
        setFloorPlanLoading(false);
      }
    },
    [setFloorPlanLoading, clearFloorPlanError, setFloorPlans, setFloorPlanError]
  );

  /**
   * Fetch floor plan by ID
   */
  const fetchFloorPlanById = useCallback(
    async (id) => {
      try {
        setFloorPlanLoading(true);
        clearFloorPlanError();

        const floorPlan = await floorplanService.getById(id);
        setSelectedFloorPlan(floorPlan);

        return floorPlan;
      } catch (err) {
        const message = err.message || 'Failed to load floor plan';
        setFloorPlanError(message);
        toast.error(message);
        throw err;
      } finally {
        setFloorPlanLoading(false);
      }
    },
    [setFloorPlanLoading, clearFloorPlanError, setSelectedFloorPlan, setFloorPlanError]
  );

  /**
   * Create new floor plan
   */
  const createFloorPlan = useCallback(
    async (data) => {
      try {
        setFloorPlanLoading(true);
        clearFloorPlanError();

        const newFloorPlan = await floorplanService.create(data);
        addFloorPlan(newFloorPlan);

        toast.success('Floor plan created successfully');
        return newFloorPlan;
      } catch (err) {
        const message = err.message || 'Failed to create floor plan';
        setFloorPlanError(message);
        toast.error(message);
        throw err;
      } finally {
        setFloorPlanLoading(false);
      }
    },
    [setFloorPlanLoading, clearFloorPlanError, addFloorPlan, setFloorPlanError]
  );

  /**
   * Update existing floor plan
   */
  const updateFloorPlanData = useCallback(
    async (id, data) => {
      try {
        setFloorPlanLoading(true);
        clearFloorPlanError();

        const updatedFloorPlan = await floorplanService.update(id, data);
        updateFloorPlan(id, updatedFloorPlan);

        toast.success('Floor plan updated successfully');
        return updatedFloorPlan;
      } catch (err) {
        const message = err.message || 'Failed to update floor plan';
        setFloorPlanError(message);
        toast.error(message);
        throw err;
      } finally {
        setFloorPlanLoading(false);
      }
    },
    [setFloorPlanLoading, clearFloorPlanError, updateFloorPlan, setFloorPlanError]
  );

  /**
   * Delete floor plan
   */
  const deleteFloorPlan = useCallback(
    async (id) => {
      try {
        setFloorPlanLoading(true);
        clearFloorPlanError();

        await floorplanService.delete(id);
        removeFloorPlan(id);

        toast.success('Floor plan deleted successfully');
      } catch (err) {
        const message = err.message || 'Failed to delete floor plan';
        setFloorPlanError(message);
        toast.error(message);
        throw err;
      } finally {
        setFloorPlanLoading(false);
      }
    },
    [setFloorPlanLoading, clearFloorPlanError, removeFloorPlan, setFloorPlanError]
  );

  /**
   * Add section to floor plan
   */
  const addSection = useCallback(
    async (floorPlanId, section) => {
      try {
        setFloorPlanLoading(true);
        clearFloorPlanError();

        const updatedFloorPlan = await floorplanService.addSection(floorPlanId, section);
        updateFloorPlan(floorPlanId, updatedFloorPlan);

        toast.success('Section added successfully');
        return updatedFloorPlan;
      } catch (err) {
        const message = err.message || 'Failed to add section';
        setFloorPlanError(message);
        toast.error(message);
        throw err;
      } finally {
        setFloorPlanLoading(false);
      }
    },
    [setFloorPlanLoading, clearFloorPlanError, updateFloorPlan, setFloorPlanError]
  );

  /**
   * Update section in floor plan
   */
  const updateSection = useCallback(
    async (floorPlanId, sectionId, data) => {
      try {
        setFloorPlanLoading(true);
        clearFloorPlanError();

        const updatedFloorPlan = await floorplanService.updateSection(
          floorPlanId,
          sectionId,
          data
        );
        updateFloorPlan(floorPlanId, updatedFloorPlan);

        toast.success('Section updated successfully');
        return updatedFloorPlan;
      } catch (err) {
        const message = err.message || 'Failed to update section';
        setFloorPlanError(message);
        toast.error(message);
        throw err;
      } finally {
        setFloorPlanLoading(false);
      }
    },
    [setFloorPlanLoading, clearFloorPlanError, updateFloorPlan, setFloorPlanError]
  );

  /**
   * Remove section from floor plan
   */
  const removeSection = useCallback(
    async (floorPlanId, sectionId) => {
      try {
        setFloorPlanLoading(true);
        clearFloorPlanError();

        const updatedFloorPlan = await floorplanService.removeSection(floorPlanId, sectionId);
        updateFloorPlan(floorPlanId, updatedFloorPlan);

        toast.success('Section removed successfully');
        return updatedFloorPlan;
      } catch (err) {
        const message = err.message || 'Failed to remove section';
        setFloorPlanError(message);
        toast.error(message);
        throw err;
      } finally {
        setFloorPlanLoading(false);
      }
    },
    [setFloorPlanLoading, clearFloorPlanError, updateFloorPlan, setFloorPlanError]
  );

  /**
   * Add element to floor plan
   */
  const addElement = useCallback(
    async (floorPlanId, element) => {
      try {
        setFloorPlanLoading(true);
        clearFloorPlanError();

        const updatedFloorPlan = await floorplanService.addElement(floorPlanId, element);
        updateFloorPlan(floorPlanId, updatedFloorPlan);

        toast.success('Element added successfully');
        return updatedFloorPlan;
      } catch (err) {
        const message = err.message || 'Failed to add element';
        setFloorPlanError(message);
        toast.error(message);
        throw err;
      } finally {
        setFloorPlanLoading(false);
      }
    },
    [setFloorPlanLoading, clearFloorPlanError, updateFloorPlan, setFloorPlanError]
  );

  /**
   * Update element in floor plan
   */
  const updateElement = useCallback(
    async (floorPlanId, elementId, data) => {
      try {
        setFloorPlanLoading(true);
        clearFloorPlanError();

        const updatedFloorPlan = await floorplanService.updateElement(
          floorPlanId,
          elementId,
          data
        );
        updateFloorPlan(floorPlanId, updatedFloorPlan);

        toast.success('Element updated successfully');
        return updatedFloorPlan;
      } catch (err) {
        const message = err.message || 'Failed to update element';
        setFloorPlanError(message);
        toast.error(message);
        throw err;
      } finally {
        setFloorPlanLoading(false);
      }
    },
    [setFloorPlanLoading, clearFloorPlanError, updateFloorPlan, setFloorPlanError]
  );

  /**
   * Remove element from floor plan
   */
  const removeElement = useCallback(
    async (floorPlanId, elementId) => {
      try {
        setFloorPlanLoading(true);
        clearFloorPlanError();

        const updatedFloorPlan = await floorplanService.removeElement(floorPlanId, elementId);
        updateFloorPlan(floorPlanId, updatedFloorPlan);

        toast.success('Element removed successfully');
        return updatedFloorPlan;
      } catch (err) {
        const message = err.message || 'Failed to remove element';
        setFloorPlanError(message);
        toast.error(message);
        throw err;
      } finally {
        setFloorPlanLoading(false);
      }
    },
    [setFloorPlanLoading, clearFloorPlanError, updateFloorPlan, setFloorPlanError]
  );

  /**
   * Fetch section statistics
   */
  const fetchSectionStats = useCallback(
    async (floorPlanId) => {
      try {
        const stats = await floorplanService.getSectionStats(floorPlanId);
        setSectionStats(stats);
        return stats;
      } catch (err) {
        const message = err.message || 'Failed to load section statistics';
        toast.error(message);
        throw err;
      }
    },
    [setSectionStats]
  );

  /**
   * Zoom in
   */
  const zoomIn = useCallback(() => {
    setZoom(Math.min(zoom + 0.1, 3.0));
  }, [zoom, setZoom]);

  /**
   * Zoom out
   */
  const zoomOut = useCallback(() => {
    setZoom(Math.max(zoom - 0.1, 0.1));
  }, [zoom, setZoom]);

  /**
   * Reset zoom to 100%
   */
  const resetZoom = useCallback(() => {
    setZoom(1.0);
  }, [setZoom]);

  return {
    // State
    floorPlans,
    selectedFloorPlan,
    activeFloorPlan,
    editorMode,
    selectedObjects,
    editorClipboard,
    isDragging,
    dragStart,
    zoom,
    panOffset,
    showGrid,
    snapToGrid,
    sectionStats,
    isLoading,
    error,

    // CRUD actions
    fetchFloorPlans,
    fetchFloorPlanById,
    createFloorPlan,
    updateFloorPlan: updateFloorPlanData,
    deleteFloorPlan,

    // Section actions
    addSection,
    updateSection,
    removeSection,

    // Element actions
    addElement,
    updateElement,
    removeElement,

    // Statistics
    fetchSectionStats,

    // Editor actions
    setEditorMode,
    setSelectedObjects,
    addToSelection,
    removeFromSelection,
    clearSelection,
    setClipboard,
    setDragging,
    setPanOffset,
    toggleGrid,
    toggleSnapToGrid,
    resetEditorView,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,

    // Store actions
    setSelectedFloorPlan,
    setActiveFloorPlan,
    clearError: clearFloorPlanError,

    // Selectors
    getFloorPlanById,
    getFloorPlansByFloor,
    getActiveFloorPlans,
    getSectionById,
    getElementById,
  };
};

export default useFloorPlan;
