import React, { useState, useEffect, useRef } from 'react';
import { Scan, Search } from 'lucide-react';
import { useProducts } from '../../products/hooks/useProducts';
import { usePos } from '../hooks/usePos';
import toast from 'react-hot-toast';

/**
 * BarcodeScanner Component
 * Handles barcode scanning and quick product lookup
 * @returns {JSX.Element}
 */
export const BarcodeScanner = () => {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const inputRef = useRef(null);
  const { products } = useProducts();
  const { handleAddToCart } = usePos();

  // Auto-focus on input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle keyboard scanning (barcode scanners act as keyboards)
  useEffect(() => {
    let buffer = '';
    let timeout;

    const handleKeyPress = (e) => {
      // If input is focused, let it handle normally
      if (document.activeElement === inputRef.current) {
        return;
      }

      // Ignore modifier keys
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Build buffer from keypresses
      if (e.key === 'Enter') {
        if (buffer.length > 0) {
          handleBarcodeScan(buffer);
          buffer = '';
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          buffer = '';
        }, 100); // Reset buffer after 100ms of no input
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      clearTimeout(timeout);
    };
  }, [products]);

  /**
   * Handle barcode scan
   * @param {string} barcode - Scanned barcode
   */
  const handleBarcodeScan = (barcode) => {
    if (!barcode || barcode.trim() === '') {
      return;
    }

    setIsScanning(true);

    // Search for product by barcode or SKU
    const product = products.find(
      (p) =>
        (p.barcode && p.barcode.toLowerCase() === barcode.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase() === barcode.toLowerCase())
    );

    if (product) {
      if (product.status !== 'active') {
        toast.error(`${product.name} is not available for sale`);
      } else if (product.trackInventory && product.stockQuantity === 0) {
        toast.error(`${product.name} is out of stock`);
      } else {
        handleAddToCart(product);
        // Play success sound (optional)
        playBeep('success');
      }
    } else {
      toast.error(`Product not found: ${barcode}`);
      playBeep('error');
    }

    setIsScanning(false);
    setBarcodeInput('');

    // Refocus on input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  /**
   * Play beep sound for feedback
   * @param {string} type - 'success' or 'error'
   */
  const playBeep = (type) => {
    // Create audio context for beep sound
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = type === 'success' ? 800 : 400;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Ignore audio errors
      console.debug('Audio not supported');
    }
  };

  /**
   * Handle manual input submit
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (barcodeInput.trim()) {
      handleBarcodeScan(barcodeInput.trim());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex items-center gap-3 mb-3">
        <Scan className={`h-6 w-6 ${isScanning ? 'text-green-600 animate-pulse' : 'text-blue-600'}`} />
        <h3 className="text-lg font-semibold text-gray-900">Barcode Scanner</h3>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={barcodeInput}
            onChange={(e) => setBarcodeInput(e.target.value)}
            placeholder="Scan barcode or enter SKU/Barcode..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-mono"
            autoComplete="off"
          />
        </div>

        <div className="mt-2 text-xs text-gray-500">
          <p>💡 Tip: Use barcode scanner or manually type and press Enter</p>
        </div>
      </form>

      {isScanning && (
        <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
          <span>Processing scan...</span>
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
