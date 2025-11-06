import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '@/store';
import { invoiceService } from '../services/invoiceService.js';

/**
 * Custom hook for invoice operations
 * Provides methods to interact with invoices
 */
export const useInvoices = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get state from store
  const invoices = useStore((state) => state.invoices);
  const invoiceStats = useStore((state) => state.invoiceStats);
  const selectedInvoice = useStore((state) => state.selectedInvoice);
  const invoiceFilters = useStore((state) => state.invoiceFilters);

  // Get actions from store
  const setInvoices = useStore((state) => state.setInvoices);
  const setInvoiceStats = useStore((state) => state.setInvoiceStats);
  const setSelectedInvoice = useStore((state) => state.setSelectedInvoice);
  const setInvoiceFilters = useStore((state) => state.setInvoiceFilters);
  const addInvoice = useStore((state) => state.addInvoice);
  const updateInvoice = useStore((state) => state.updateInvoice);
  const removeInvoice = useStore((state) => state.removeInvoice);
  const getInvoiceById = useStore((state) => state.getInvoiceById);
  const getInvoicesByCustomer = useStore((state) => state.getInvoicesByCustomer);
  const getOverdueInvoices = useStore((state) => state.getOverdueInvoices);
  const clearInvoiceFilters = useStore((state) => state.clearInvoiceFilters);

  /**
   * Fetch all invoices
   */
  const fetchInvoices = useCallback(
    async (filters = {}) => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await invoiceService.getList(filters);
        setInvoices(data);

        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch invoices';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setInvoices]
  );

  /**
   * Fetch invoice by ID
   */
  const fetchInvoiceById = useCallback(
    async (id) => {
      try {
        setIsLoading(true);
        setError(null);

        const data = await invoiceService.getById(id);
        setSelectedInvoice(data);

        return data;
      } catch (err) {
        const message = err.message || 'Failed to fetch invoice';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setSelectedInvoice]
  );

  /**
   * Create new invoice
   */
  const createInvoice = useCallback(
    async (invoiceData) => {
      try {
        setIsLoading(true);
        setError(null);

        const newInvoice = await invoiceService.create(invoiceData);
        addInvoice(newInvoice);

        toast.success('Invoice created successfully');
        return newInvoice;
      } catch (err) {
        const message = err.message || 'Failed to create invoice';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [addInvoice]
  );

  /**
   * Update invoice
   */
  const updateInvoiceData = useCallback(
    async (id, updates) => {
      try {
        setIsLoading(true);
        setError(null);

        const updated = await invoiceService.update(id, updates);
        updateInvoice(id, updated);

        toast.success('Invoice updated successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to update invoice';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [updateInvoice]
  );

  /**
   * Delete invoice
   */
  const deleteInvoice = useCallback(
    async (id) => {
      try {
        setIsLoading(true);
        setError(null);

        await invoiceService.remove(id);
        removeInvoice(id);

        toast.success('Invoice deleted successfully');
        return true;
      } catch (err) {
        const message = err.message || 'Failed to delete invoice';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [removeInvoice]
  );

  /**
   * Mark invoice as paid
   */
  const markInvoiceAsPaid = useCallback(
    async (id, paymentData) => {
      try {
        setIsLoading(true);
        setError(null);

        const updated = await invoiceService.markAsPaid(id, paymentData);
        updateInvoice(id, updated);

        toast.success('Invoice marked as paid');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to mark invoice as paid';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [updateInvoice]
  );

  /**
   * Record partial payment
   */
  const recordPartialPayment = useCallback(
    async (id, paymentData) => {
      try {
        setIsLoading(true);
        setError(null);

        const updated = await invoiceService.recordPartialPayment(id, paymentData);
        updateInvoice(id, updated);

        toast.success('Partial payment recorded');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to record partial payment';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [updateInvoice]
  );

  /**
   * Send invoice to customer
   */
  const sendInvoice = useCallback(
    async (id) => {
      try {
        setIsLoading(true);
        setError(null);

        const updated = await invoiceService.sendInvoice(id);
        updateInvoice(id, updated);

        toast.success('Invoice sent successfully');
        return updated;
      } catch (err) {
        const message = err.message || 'Failed to send invoice';
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [updateInvoice]
  );

  /**
   * Fetch invoice statistics
   */
  const fetchInvoiceStats = useCallback(
    async (filters = {}) => {
      try {
        setError(null);

        const stats = await invoiceService.getStats(filters);
        setInvoiceStats(stats);

        return stats;
      } catch (err) {
        const message = err.message || 'Failed to fetch invoice stats';
        setError(message);
        throw err;
      }
    },
    [setInvoiceStats]
  );

  /**
   * Generate invoice PDF
   */
  const generateInvoicePDF = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);

      const pdfUrl = await invoiceService.generatePDF(id);
      toast.success('Invoice PDF generated');

      return pdfUrl;
    } catch (err) {
      const message = err.message || 'Failed to generate PDF';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Email invoice to customer
   */
  const emailInvoice = useCallback(async (id) => {
    try {
      setIsLoading(true);
      setError(null);

      await invoiceService.emailInvoice(id);
      toast.success('Invoice emailed successfully');

      return true;
    } catch (err) {
      const message = err.message || 'Failed to email invoice';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    invoices,
    invoiceStats,
    selectedInvoice,
    invoiceFilters,
    isLoading,
    error,

    // Actions
    fetchInvoices,
    fetchInvoiceById,
    createInvoice,
    updateInvoiceData,
    deleteInvoice,
    markInvoiceAsPaid,
    recordPartialPayment,
    sendInvoice,
    fetchInvoiceStats,
    generateInvoicePDF,
    emailInvoice,
    setSelectedInvoice,
    setInvoiceFilters,
    clearInvoiceFilters,

    // Getters
    getInvoiceById,
    getInvoicesByCustomer,
    getOverdueInvoices,
  };
};
