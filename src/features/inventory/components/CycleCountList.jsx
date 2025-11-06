import React, { useEffect, useState } from 'react';
import {
  ClipboardList,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  PlayCircle,
  RefreshCw,
  Plus
} from 'lucide-react';
import { cycleCountService } from '../services/cycleCountService';

/**
 * Cycle Count List Component
 * Display and manage cycle counts
 */
const CycleCountList = () => {
  const [cycleCounts, setCycleCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCount, setSelectedCount] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all'
  });

  useEffect(() => {
    loadCycleCounts();
  }, [filters]);

  const loadCycleCounts = async () => {
    try {
      setLoading(true);
      const data = await cycleCountService.getCycleCounts(filters);
      setCycleCounts(data);
    } catch (error) {
      console.error('Error loading cycle counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCount = async (id) => {
    try {
      await cycleCountService.startCycleCount(id);
      loadCycleCounts();
    } catch (error) {
      console.error('Error starting cycle count:', error);
      alert(error.message);
    }
  };

  const handleCompleteCount = async (id) => {
    try {
      await cycleCountService.completeCycleCount(id);
      loadCycleCounts();
      alert('Cycle count completed successfully!');
    } catch (error) {
      console.error('Error completing cycle count:', error);
      alert(error.message);
    }
  };

  const handleCancelCount = async (id) => {
    const reason = prompt('Enter cancellation reason:');
    if (!reason) return;

    try {
      await cycleCountService.cancelCycleCount(id, reason);
      loadCycleCounts();
    } catch (error) {
      console.error('Error cancelling cycle count:', error);
      alert(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-600" />;
      default:
        return <ClipboardList className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cycle Counts</h2>
          <p className="text-gray-600">Manage inventory cycle counting activities</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadCycleCounts}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            New Cycle Count
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Cycle Counts List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : cycleCounts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ClipboardList className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Cycle Counts Found
          </h3>
          <p className="text-gray-600 mb-4">
            Create a new cycle count to start tracking inventory accuracy.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create Cycle Count
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cycleCounts.map((count) => (
            <div key={count.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">{getStatusIcon(count.status)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {count.name}
                        </h3>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusColor(count.status)}`}>
                          {count.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-gray-500">Location</p>
                          <p className="text-sm font-medium text-gray-900">{count.locationName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Scheduled Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(count.scheduledDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Items</p>
                          <p className="text-sm font-medium text-gray-900">
                            {count.countedItems} / {count.totalItems}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Variances</p>
                          <p className="text-sm font-medium text-gray-900">
                            {count.varianceCount}
                          </p>
                        </div>
                      </div>

                      {count.assignedToName && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-4 h-4" />
                          <span>Assigned to: {count.assignedToName}</span>
                        </div>
                      )}

                      {count.notes && (
                        <p className="text-sm text-gray-600 mt-2">{count.notes}</p>
                      )}

                      {count.startDate && (
                        <div className="mt-2 text-xs text-gray-500">
                          Started: {new Date(count.startDate).toLocaleString()}
                        </div>
                      )}

                      {count.endDate && (
                        <div className="mt-1 text-xs text-gray-500">
                          Completed: {new Date(count.endDate).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4">
                    {count.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handleStartCount(count.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <PlayCircle className="w-4 h-4" />
                          Start
                        </button>
                        <button
                          onClick={() => handleCancelCount(count.id)}
                          className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600"
                        >
                          Cancel
                        </button>
                      </>
                    )}

                    {count.status === 'in_progress' && (
                      <>
                        <button
                          onClick={() => setSelectedCount(count)}
                          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleCompleteCount(count.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                          disabled={count.countedItems < count.totalItems}
                        >
                          <CheckCircle className="w-4 h-4" />
                          Complete
                        </button>
                      </>
                    )}

                    {count.status === 'completed' && (
                      <button
                        onClick={() => setSelectedCount(count)}
                        className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      >
                        View Report
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress Bar for In Progress Counts */}
                {count.status === 'in_progress' && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>
                        {Math.round((count.countedItems / count.totalItems) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(count.countedItems / count.totalItems) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {cycleCounts.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {cycleCounts.filter((c) => c.status === 'scheduled').length}
              </p>
              <p className="text-sm text-gray-600">Scheduled</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {cycleCounts.filter((c) => c.status === 'in_progress').length}
              </p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {cycleCounts.filter((c) => c.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {cycleCounts.reduce((sum, c) => sum + c.varianceCount, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Variances</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CycleCountList;
