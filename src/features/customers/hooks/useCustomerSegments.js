import { useCallback } from 'react';
import { useStore } from '../../../store';
import customerService from '../services/customerService';
import toast from 'react-hot-toast';

/**
 * Hook for managing customer segments
 * @returns {Object} Segment state and operations
 */
export const useCustomerSegments = () => {
  // Get state from store
  const segments = useStore((state) => state.segments);
  const selectedSegment = useStore((state) => state.selectedSegment);
  const loading = useStore((state) => state.segmentLoading);
  const error = useStore((state) => state.segmentError);

  // Get mutations
  const setSegments = useStore((state) => state.setSegments);
  const addSegment = useStore((state) => state.addSegment);
  const updateSegment = useStore((state) => state.updateSegment);
  const removeSegment = useStore((state) => state.removeSegment);
  const setSelectedSegment = useStore((state) => state.setSelectedSegment);
  const clearSelectedSegment = useStore((state) => state.clearSelectedSegment);
  const setLoading = useStore((state) => state.setSegmentLoading);
  const setError = useStore((state) => state.setSegmentError);

  // Get getters
  const getSegmentById = useStore((state) => state.getSegmentById);
  const getCustomersBySegment = useStore((state) => state.getCustomersBySegment);
  const getSegmentsForCustomer = useStore((state) => state.getSegmentsForCustomer);

  /**
   * Fetch all segments
   */
  const fetchSegments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await customerService.getSegments();
      setSegments(result);
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch segments';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setSegments, setLoading, setError]);

  /**
   * Fetch segment by ID
   */
  const fetchSegmentById = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        const result = await customerService.getSegmentById(id);
        if (result) {
          setSelectedSegment(result);
        }
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch segment';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setSelectedSegment, setLoading, setError]
  );

  /**
   * Create new segment
   */
  const createSegment = useCallback(
    async (data) => {
      try {
        setLoading(true);
        setError(null);
        const result = await customerService.createSegment(data);
        addSegment(result);
        toast.success('Segment created successfully');
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to create segment';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addSegment, setLoading, setError]
  );

  /**
   * Update existing segment
   */
  const updateSegmentById = useCallback(
    async (id, data) => {
      try {
        setLoading(true);
        setError(null);
        const result = await customerService.updateSegment(id, data);
        updateSegment(id, result);
        toast.success('Segment updated successfully');
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to update segment';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateSegment, setLoading, setError]
  );

  /**
   * Delete segment
   */
  const deleteSegment = useCallback(
    async (id) => {
      try {
        setLoading(true);
        setError(null);
        await customerService.deleteSegment(id);
        removeSegment(id);
        toast.success('Segment deleted successfully');
        return true;
      } catch (err) {
        const errorMessage = err.message || 'Failed to delete segment';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [removeSegment, setLoading, setError]
  );

  /**
   * Assign customers to segment
   */
  const assignCustomers = useCallback(
    async (segmentId, customerIds) => {
      try {
        setLoading(true);
        setError(null);
        const result = await customerService.assignCustomersToSegment(segmentId, customerIds);
        updateSegment(segmentId, result);
        toast.success(`${customerIds.length} customer(s) assigned to segment`);
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to assign customers';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateSegment, setLoading, setError]
  );

  /**
   * Remove customers from segment
   */
  const removeCustomers = useCallback(
    async (segmentId, customerIds) => {
      try {
        setLoading(true);
        setError(null);
        const result = await customerService.removeCustomersFromSegment(segmentId, customerIds);
        updateSegment(segmentId, result);
        toast.success(`${customerIds.length} customer(s) removed from segment`);
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to remove customers';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateSegment, setLoading, setError]
  );

  return {
    // State
    segments,
    selectedSegment,
    loading,
    error,

    // Operations
    fetchSegments,
    fetchSegmentById,
    createSegment,
    updateSegmentById,
    deleteSegment,
    assignCustomers,
    removeCustomers,
    setSelectedSegment,
    clearSelectedSegment,

    // Getters
    getSegmentById,
    getCustomersBySegment,
    getSegmentsForCustomer,
  };
};

export default useCustomerSegments;
