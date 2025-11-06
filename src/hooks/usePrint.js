import { useState } from 'react';

/**
 * Custom hook for handling print functionality
 * Provides state and methods for printing documents
 */
export const usePrint = () => {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [printDocument, setPrintDocument] = useState(null);

  const openPrintModal = (document) => {
    setPrintDocument(document);
    setIsPrintModalOpen(true);
  };

  const closePrintModal = () => {
    setIsPrintModalOpen(false);
    setPrintDocument(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const printDirectly = () => {
    window.print();
  };

  return {
    isPrintModalOpen,
    printDocument,
    openPrintModal,
    closePrintModal,
    handlePrint,
    printDirectly,
  };
};

export default usePrint;
