import { useCallback } from 'react';
import { useStore } from '../../../store';
import customerService from '../services/customerService';
import toast from 'react-hot-toast';

/**
 * Hook for managing customer notes
 * @returns {Object} Notes state and operations
 */
export const useCustomerNotes = () => {
  // Get state from store
  const customerNotes = useStore((state) => state.customerNotes);
  const loading = useStore((state) => state.notesLoading);
  const error = useStore((state) => state.notesError);

  // Get mutations
  const setCustomerNotes = useStore((state) => state.setCustomerNotes);
  const addCustomerNote = useStore((state) => state.addCustomerNote);
  const updateCustomerNote = useStore((state) => state.updateCustomerNote);
  const removeCustomerNote = useStore((state) => state.removeCustomerNote);
  const setLoading = useStore((state) => state.setNotesLoading);
  const setError = useStore((state) => state.setNotesError);

  // Get getters
  const getNotesByCustomer = useStore((state) => state.getNotesByCustomer);
  const getNotesByType = useStore((state) => state.getNotesByType);

  /**
   * Fetch notes for a customer
   */
  const fetchCustomerNotes = useCallback(
    async (customerId) => {
      try {
        setLoading(true);
        setError(null);
        const result = await customerService.getCustomerNotes(customerId);
        setCustomerNotes(result);
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to fetch customer notes';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setCustomerNotes, setLoading, setError]
  );

  /**
   * Add note to customer
   */
  const addNote = useCallback(
    async (customerId, noteData) => {
      try {
        setLoading(true);
        setError(null);
        const result = await customerService.addCustomerNote(customerId, noteData);
        addCustomerNote(result);
        toast.success('Note added successfully');
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to add note';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [addCustomerNote, setLoading, setError]
  );

  /**
   * Update customer note
   */
  const updateNote = useCallback(
    async (noteId, noteData) => {
      try {
        setLoading(true);
        setError(null);
        const result = await customerService.updateCustomerNote(noteId, noteData);
        updateCustomerNote(noteId, result);
        toast.success('Note updated successfully');
        return result;
      } catch (err) {
        const errorMessage = err.message || 'Failed to update note';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateCustomerNote, setLoading, setError]
  );

  /**
   * Delete customer note
   */
  const deleteNote = useCallback(
    async (noteId) => {
      try {
        setLoading(true);
        setError(null);
        await customerService.deleteCustomerNote(noteId);
        removeCustomerNote(noteId);
        toast.success('Note deleted successfully');
        return true;
      } catch (err) {
        const errorMessage = err.message || 'Failed to delete note';
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [removeCustomerNote, setLoading, setError]
  );

  return {
    // State
    customerNotes,
    loading,
    error,

    // Operations
    fetchCustomerNotes,
    addNote,
    updateNote,
    deleteNote,

    // Getters
    getNotesByCustomer,
    getNotesByType,
  };
};

export default useCustomerNotes;
