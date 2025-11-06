import React, { useState, useEffect } from 'react';
import { Clock, DollarSign, LogIn, LogOut, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { formatCurrency } from '../utils/calculations';
import toast from 'react-hot-toast';

/**
 * ShiftManagement Component
 * Manage cashier shifts and cash drawer operations
 * @returns {JSX.Element}
 */
export const ShiftManagement = () => {
  const [currentShift, setCurrentShift] = useState(null);
  const [shiftHistory, setShiftHistory] = useState([]);
  const [startingCash, setStartingCash] = useState('');
  const [showStartShift, setShowStartShift] = useState(false);
  const [showEndShift, setShowEndShift] = useState(false);
  const [endingCash, setEndingCash] = useState('');
  const [cashOperations, setCashOperations] = useState([]);

  // Load shift data from localStorage
  useEffect(() => {
    const savedShift = localStorage.getItem('currentShift');
    const savedHistory = localStorage.getItem('shiftHistory');
    const savedOperations = localStorage.getItem('cashOperations');

    if (savedShift) {
      try {
        setCurrentShift(JSON.parse(savedShift));
      } catch (e) {
        console.error('Failed to load current shift:', e);
      }
    }

    if (savedHistory) {
      try {
        setShiftHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to load shift history:', e);
      }
    }

    if (savedOperations) {
      try {
        setCashOperations(JSON.parse(savedOperations));
      } catch (e) {
        console.error('Failed to load cash operations:', e);
      }
    }
  }, []);

  // Save shift data to localStorage
  useEffect(() => {
    if (currentShift) {
      localStorage.setItem('currentShift', JSON.stringify(currentShift));
    } else {
      localStorage.removeItem('currentShift');
    }
  }, [currentShift]);

  useEffect(() => {
    localStorage.setItem('shiftHistory', JSON.stringify(shiftHistory));
  }, [shiftHistory]);

  useEffect(() => {
    localStorage.setItem('cashOperations', JSON.stringify(cashOperations));
  }, [cashOperations]);

  /**
   * Start a new shift
   */
  const handleStartShift = () => {
    const amount = parseFloat(startingCash);

    if (!amount || amount < 0) {
      toast.error('Please enter a valid starting cash amount');
      return;
    }

    const shift = {
      id: `shift-${Date.now()}`,
      startTime: new Date().toISOString(),
      startingCash: amount,
      endTime: null,
      endingCash: null,
      salesTotal: 0,
      transactionCount: 0,
      cashIn: 0,
      cashOut: 0,
      expectedCash: amount,
      actualCash: null,
      variance: null,
      status: 'active',
    };

    setCurrentShift(shift);
    setShowStartShift(false);
    setStartingCash('');
    toast.success('Shift started successfully');
  };

  /**
   * End current shift
   */
  const handleEndShift = () => {
    if (!currentShift) return;

    const amount = parseFloat(endingCash);

    if (!amount || amount < 0) {
      toast.error('Please enter the actual ending cash amount');
      return;
    }

    const expectedCash =
      currentShift.startingCash +
      currentShift.salesTotal +
      currentShift.cashIn -
      currentShift.cashOut;

    const variance = amount - expectedCash;

    const completedShift = {
      ...currentShift,
      endTime: new Date().toISOString(),
      endingCash: amount,
      expectedCash,
      actualCash: amount,
      variance,
      status: 'completed',
    };

    setShiftHistory([completedShift, ...shiftHistory]);
    setCurrentShift(null);
    setCashOperations([]);
    setShowEndShift(false);
    setEndingCash('');

    if (Math.abs(variance) > 0.01) {
      if (variance > 0) {
        toast.success(`Shift ended. Cash over by ${formatCurrency(variance)}`);
      } else {
        toast.error(`Shift ended. Cash short by ${formatCurrency(Math.abs(variance))}`);
      }
    } else {
      toast.success('Shift ended successfully. Cash balanced!');
    }
  };

  /**
   * Record cash in operation
   */
  const recordCashIn = (amount, reason) => {
    if (!currentShift) return;

    const operation = {
      id: `op-${Date.now()}`,
      type: 'cash_in',
      amount: parseFloat(amount),
      reason,
      timestamp: new Date().toISOString(),
    };

    setCashOperations([...cashOperations, operation]);
    setCurrentShift({
      ...currentShift,
      cashIn: currentShift.cashIn + operation.amount,
    });

    toast.success(`Cash in: ${formatCurrency(operation.amount)}`);
  };

  /**
   * Record cash out operation
   */
  const recordCashOut = (amount, reason) => {
    if (!currentShift) return;

    const operation = {
      id: `op-${Date.now()}`,
      type: 'cash_out',
      amount: parseFloat(amount),
      reason,
      timestamp: new Date().toISOString(),
    };

    setCashOperations([...cashOperations, operation]);
    setCurrentShift({
      ...currentShift,
      cashOut: currentShift.cashOut + operation.amount,
    });

    toast.success(`Cash out: ${formatCurrency(operation.amount)}`);
  };

  /**
   * Calculate shift duration
   */
  const getShiftDuration = (shift) => {
    const start = new Date(shift.startTime);
    const end = shift.endTime ? new Date(shift.endTime) : new Date();
    const duration = Math.floor((end - start) / 1000 / 60); // minutes
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Current Shift Status */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Current Shift</h2>
          </div>

          {!currentShift ? (
            <button
              onClick={() => setShowStartShift(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <LogIn className="h-4 w-4" />
              Start Shift
            </button>
          ) : (
            <button
              onClick={() => setShowEndShift(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              End Shift
            </button>
          )}
        </div>

        {!currentShift ? (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No active shift</p>
            <p className="text-gray-400 text-sm mt-2">Start a shift to begin operations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Shift Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Started</div>
                <div className="text-lg font-bold text-gray-900">
                  {new Date(currentShift.startTime).toLocaleTimeString()}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Duration</div>
                <div className="text-lg font-bold text-gray-900">
                  {getShiftDuration(currentShift)}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Transactions</div>
                <div className="text-lg font-bold text-gray-900">
                  {currentShift.transactionCount}
                </div>
              </div>
            </div>

            {/* Cash Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Starting Cash</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(currentShift.startingCash)}
                </div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Sales Total</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatCurrency(currentShift.salesTotal)}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Cash In</div>
                  <div className="text-xl font-bold text-green-600">
                    +{formatCurrency(currentShift.cashIn)}
                  </div>
                </div>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="bg-red-50 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Cash Out</div>
                  <div className="text-xl font-bold text-red-600">
                    -{formatCurrency(currentShift.cashOut)}
                  </div>
                </div>
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>

            {/* Expected Cash */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Expected Cash in Drawer</div>
              <div className="text-3xl font-bold text-blue-600">
                {formatCurrency(
                  currentShift.startingCash +
                    currentShift.salesTotal +
                    currentShift.cashIn -
                    currentShift.cashOut
                )}
              </div>
            </div>

            {/* Recent Cash Operations */}
            {cashOperations.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Recent Cash Operations
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cashOperations.slice(-5).reverse().map((op) => (
                    <div
                      key={op.id}
                      className={`p-3 rounded-lg border ${
                        op.type === 'cash_in'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className={`font-semibold ${
                            op.type === 'cash_in' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {op.type === 'cash_in' ? 'Cash In' : 'Cash Out'}
                          </div>
                          <div className="text-sm text-gray-600">{op.reason}</div>
                        </div>
                        <div className={`text-lg font-bold ${
                          op.type === 'cash_in' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {op.type === 'cash_in' ? '+' : '-'}
                          {formatCurrency(op.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Start Shift Modal */}
      {showStartShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Start New Shift</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Cash Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={startingCash}
                onChange={(e) => setStartingCash(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleStartShift}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Start Shift
              </button>
              <button
                onClick={() => {
                  setShowStartShift(false);
                  setStartingCash('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Shift Modal */}
      {showEndShift && currentShift && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">End Shift</h3>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Expected Cash</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  currentShift.startingCash +
                    currentShift.salesTotal +
                    currentShift.cashIn -
                    currentShift.cashOut
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual Cash in Drawer
              </label>
              <input
                type="number"
                step="0.01"
                value={endingCash}
                onChange={(e) => setEndingCash(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleEndShift}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                End Shift
              </button>
              <button
                onClick={() => {
                  setShowEndShift(false);
                  setEndingCash('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Drawer Operations */}
      {currentShift && (
        <CashDrawerOperations onCashIn={recordCashIn} onCashOut={recordCashOut} />
      )}

      {/* Shift History */}
      {shiftHistory.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Shift History (Last 5)
          </h3>
          <div className="space-y-3">
            {shiftHistory.slice(0, 5).map((shift) => (
              <div
                key={shift.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-gray-900">
                      {new Date(shift.startTime).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(shift.startTime).toLocaleTimeString()} -{' '}
                      {shift.endTime
                        ? new Date(shift.endTime).toLocaleTimeString()
                        : 'Active'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(shift.salesTotal)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {shift.transactionCount} transactions
                    </div>
                  </div>
                </div>
                {shift.variance !== null && (
                  <div
                    className={`text-sm font-semibold ${
                      Math.abs(shift.variance) < 0.01
                        ? 'text-green-600'
                        : shift.variance > 0
                        ? 'text-blue-600'
                        : 'text-red-600'
                    }`}
                  >
                    {Math.abs(shift.variance) < 0.01
                      ? 'Balanced'
                      : shift.variance > 0
                      ? `Over: ${formatCurrency(shift.variance)}`
                      : `Short: ${formatCurrency(Math.abs(shift.variance))}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * CashDrawerOperations Component
 * Record cash in/out operations
 */
const CashDrawerOperations = ({ onCashIn, onCashOut }) => {
  const [showCashIn, setShowCashIn] = useState(false);
  const [showCashOut, setShowCashOut] = useState(false);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');

  const handleCashIn = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !reason.trim()) {
      toast.error('Please enter amount and reason');
      return;
    }
    onCashIn(amt, reason);
    setAmount('');
    setReason('');
    setShowCashIn(false);
  };

  const handleCashOut = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !reason.trim()) {
      toast.error('Please enter amount and reason');
      return;
    }
    onCashOut(amt, reason);
    setAmount('');
    setReason('');
    setShowCashOut(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-bold text-gray-900">Cash Drawer Operations</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setShowCashIn(true)}
          className="flex items-center justify-center gap-2 p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-700">Cash In</span>
        </button>
        <button
          onClick={() => setShowCashOut(true)}
          className="flex items-center justify-center gap-2 p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          <TrendingDown className="h-5 w-5 text-red-600" />
          <span className="font-semibold text-red-700">Cash Out</span>
        </button>
      </div>

      {/* Cash In Modal */}
      {showCashIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cash In</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Change replenishment"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCashIn}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
              >
                Record Cash In
              </button>
              <button
                onClick={() => {
                  setShowCashIn(false);
                  setAmount('');
                  setReason('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cash Out Modal */}
      {showCashOut && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cash Out</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g., Bank deposit"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCashOut}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700"
              >
                Record Cash Out
              </button>
              <button
                onClick={() => {
                  setShowCashOut(false);
                  setAmount('');
                  setReason('');
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftManagement;
