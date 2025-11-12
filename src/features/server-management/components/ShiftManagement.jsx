/**
 * Shift Management Component
 * Allows servers to clock in/out and managers to view all shifts
 */

import React, { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut, Coffee, Calendar, User, Timer } from 'lucide-react';
import { useServerManagement } from '../hooks/useServerManagement';
import { useStore } from '../../../store';
import { SHIFT_STATUS, formatShiftTime, getShiftStatusColor } from '../types/serverManagement.types';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/modals/Modal';
import FormField from '../../../components/forms/FormField';
import { format } from 'date-fns';

const ShiftManagement = () => {
  const {
    shifts,
    activeShifts,
    loading,
    fetchShifts,
    createShift,
    clockIn,
    clockOut,
    addBreak,
    getServerActiveShift,
  } = useServerManagement();

  const currentUser = useStore((state) => state.user);
  const users = useStore((state) => state.users);
  const fetchUsers = useStore((state) => state.fetchUsers);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [formData, setFormData] = useState({
    serverId: currentUser?.id || '',
    scheduledStart: '',
    scheduledEnd: '',
    notes: '',
  });
  const [breakData, setBreakData] = useState({
    startTime: new Date(),
    endTime: new Date(),
    type: 'rest',
    notes: '',
  });
  const [filter, setFilter] = useState('all'); // all, active, scheduled, completed

  useEffect(() => {
    fetchShifts();
    fetchUsers();
  }, [fetchShifts, fetchUsers]);

  // Get current user's active shift
  const myActiveShift = getServerActiveShift(currentUser?.id);

  // Get servers (users with server role)
  const servers = users.filter(user =>
    user.roles?.some(role => role.toLowerCase().includes('server')) ||
    user.staffProfile?.serverProfile?.isServer
  );

  // Filter shifts
  const filteredShifts = shifts.filter(shift => {
    if (filter === 'all') return true;
    if (filter === 'active') return shift.status === SHIFT_STATUS.ACTIVE;
    if (filter === 'scheduled') return shift.status === SHIFT_STATUS.SCHEDULED;
    if (filter === 'completed') return shift.status === SHIFT_STATUS.COMPLETED;
    return true;
  });

  const handleCreateShift = async (e) => {
    e.preventDefault();
    try {
      const server = servers.find(s => s.id === formData.serverId);
      await createShift({
        ...formData,
        serverName: server?.fullName || server?.firstName + ' ' + server?.lastName,
        branchId: currentUser?.branchId || 'BRANCH001',
        createdBy: currentUser?.id,
      });
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating shift:', error);
    }
  };

  const handleClockIn = async (shiftId) => {
    try {
      await clockIn(shiftId);
    } catch (error) {
      console.error('Error clocking in:', error);
    }
  };

  const handleClockOut = async (shiftId) => {
    if (window.confirm('Are you sure you want to clock out?')) {
      try {
        await clockOut(shiftId);
      } catch (error) {
        console.error('Error clocking out:', error);
      }
    }
  };

  const handleAddBreak = async (e) => {
    e.preventDefault();
    if (!selectedShift) return;

    const duration = Math.round(
      (new Date(breakData.endTime) - new Date(breakData.startTime)) / (1000 * 60)
    );

    try {
      await addBreak(selectedShift.id, {
        ...breakData,
        duration,
      });
      setShowBreakModal(false);
      setSelectedShift(null);
      resetBreakData();
    } catch (error) {
      console.error('Error adding break:', error);
    }
  };

  const openBreakModal = (shift) => {
    setSelectedShift(shift);
    setShowBreakModal(true);
  };

  const resetForm = () => {
    setFormData({
      serverId: currentUser?.id || '',
      scheduledStart: '',
      scheduledEnd: '',
      notes: '',
    });
  };

  const resetBreakData = () => {
    setBreakData({
      startTime: new Date(),
      endTime: new Date(),
      type: 'rest',
      notes: '',
    });
  };

  const calculateCurrentShiftDuration = (shift) => {
    if (!shift?.actualStart) return 0;
    const start = new Date(shift.actualStart);
    const end = shift.actualEnd ? new Date(shift.actualEnd) : new Date();
    return Math.round((end - start) / (1000 * 60));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shift Management</h2>
          <p className="text-gray-600 mt-1">
            Clock in/out and manage server shifts
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          Schedule Shift
        </Button>
      </div>

      {/* My Active Shift Card */}
      {myActiveShift && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Currently On Shift</h3>
                <p className="text-gray-600">
                  Started at {format(new Date(myActiveShift.actualStart), 'h:mm a')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Duration: {formatShiftTime(calculateCurrentShiftDuration(myActiveShift))}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => openBreakModal(myActiveShift)}
                className="flex items-center gap-2"
              >
                <Coffee className="w-4 h-4" />
                Add Break
              </Button>
              <Button
                onClick={() => handleClockOut(myActiveShift.id)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
              >
                <LogOut className="w-4 h-4" />
                Clock Out
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Servers</p>
              <p className="text-2xl font-bold text-gray-900">{activeShifts.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Shifts Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {shifts.filter(s => {
                  const today = new Date();
                  const shiftDate = new Date(s.scheduledStart);
                  return shiftDate.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Timer className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">
                {shifts.filter(s => s.status === SHIFT_STATUS.SCHEDULED).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {shifts.filter(s => s.status === SHIFT_STATUS.COMPLETED).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'active', 'scheduled', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              filter === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Shifts List */}
      {loading.shifts ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredShifts.length === 0 ? (
        <Card className="p-12 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No shifts found</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all'
              ? 'Schedule your first shift to get started'
              : `No ${filter} shifts at the moment`}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredShifts.map((shift) => (
            <Card key={shift.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900">{shift.serverName}</h3>
                      <Badge color={getShiftStatusColor(shift.status)}>
                        {shift.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>
                        Scheduled: {format(new Date(shift.scheduledStart), 'MMM d, h:mm a')} -{' '}
                        {format(new Date(shift.scheduledEnd), 'h:mm a')}
                      </span>
                      {shift.actualStart && (
                        <span>
                          • Actual: {format(new Date(shift.actualStart), 'h:mm a')}
                          {shift.actualEnd && ` - ${format(new Date(shift.actualEnd), 'h:mm a')}`}
                        </span>
                      )}
                      {shift.duration > 0 && (
                        <span>• Duration: {formatShiftTime(shift.duration)}</span>
                      )}
                    </div>
                    {shift.breakDuration > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Breaks: {formatShiftTime(shift.breakDuration)} ({shift.breakPeriods?.length || 0})
                      </p>
                    )}
                    {shift.notes && (
                      <p className="text-sm text-gray-500 mt-1">{shift.notes}</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {shift.status === SHIFT_STATUS.SCHEDULED && (
                    <Button
                      size="sm"
                      onClick={() => handleClockIn(shift.id)}
                      className="flex items-center gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      Clock In
                    </Button>
                  )}
                  {shift.status === SHIFT_STATUS.ACTIVE && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openBreakModal(shift)}
                        className="flex items-center gap-2"
                      >
                        <Coffee className="w-4 h-4" />
                        Add Break
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleClockOut(shift.id)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700"
                      >
                        <LogOut className="w-4 h-4" />
                        Clock Out
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Performance Summary (for completed shifts) */}
              {shift.status === SHIFT_STATUS.COMPLETED && shift.performance && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Shift Performance</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600">Orders</p>
                      <p className="text-sm font-semibold">{shift.performance.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Sales</p>
                      <p className="text-sm font-semibold">${shift.performance.totalSales.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Tips</p>
                      <p className="text-sm font-semibold">${shift.performance.totalTips.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Tables</p>
                      <p className="text-sm font-semibold">{shift.performance.tablesServed}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Shift Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Schedule New Shift"
      >
        <form onSubmit={handleCreateShift}>
          <div className="space-y-4">
            <FormField
              label="Server"
              type="select"
              required
              value={formData.serverId}
              onChange={(e) => setFormData({ ...formData, serverId: e.target.value })}
            >
              <option value="">Select a server...</option>
              {servers.map((server) => (
                <option key={server.id} value={server.id}>
                  {server.fullName || `${server.firstName} ${server.lastName}`}
                </option>
              ))}
            </FormField>

            <FormField
              label="Scheduled Start"
              type="datetime-local"
              required
              value={formData.scheduledStart}
              onChange={(e) => setFormData({ ...formData, scheduledStart: e.target.value })}
            />

            <FormField
              label="Scheduled End"
              type="datetime-local"
              required
              value={formData.scheduledEnd}
              onChange={(e) => setFormData({ ...formData, scheduledEnd: e.target.value })}
            />

            <FormField
              label="Notes"
              type="textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Shift notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="submit" className="flex-1">
              Schedule Shift
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Break Modal */}
      <Modal
        isOpen={showBreakModal}
        onClose={() => {
          setShowBreakModal(false);
          setSelectedShift(null);
          resetBreakData();
        }}
        title="Add Break"
      >
        <form onSubmit={handleAddBreak}>
          <div className="space-y-4">
            <p className="text-gray-600">
              Adding break for shift: {selectedShift?.serverName}
            </p>

            <FormField
              label="Break Type"
              type="select"
              required
              value={breakData.type}
              onChange={(e) => setBreakData({ ...breakData, type: e.target.value })}
            >
              <option value="rest">Rest Break</option>
              <option value="meal">Meal Break</option>
              <option value="other">Other</option>
            </FormField>

            <FormField
              label="Start Time"
              type="datetime-local"
              required
              value={format(breakData.startTime, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setBreakData({ ...breakData, startTime: new Date(e.target.value) })}
            />

            <FormField
              label="End Time"
              type="datetime-local"
              required
              value={format(breakData.endTime, "yyyy-MM-dd'T'HH:mm")}
              onChange={(e) => setBreakData({ ...breakData, endTime: new Date(e.target.value) })}
            />

            <FormField
              label="Notes"
              type="textarea"
              value={breakData.notes}
              onChange={(e) => setBreakData({ ...breakData, notes: e.target.value })}
              placeholder="Break notes..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="submit" className="flex-1">
              Add Break
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowBreakModal(false);
                setSelectedShift(null);
                resetBreakData();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShiftManagement;
