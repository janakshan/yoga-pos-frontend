import React from 'react';
import { X, Printer } from 'lucide-react';

/**
 * Print Modal Component
 * Reusable modal for displaying and printing receipts, invoices, and reports
 */
const PrintModal = ({
  isOpen,
  onClose,
  title = 'Print Document',
  children,
  onPrint,
  showActions = true
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 no-print"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        {showActions && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 no-print">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        )}

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 no-print">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrintModal;
