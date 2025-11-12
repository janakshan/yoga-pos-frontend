/**
 * TableCard Component
 * Displays a table card with status and details
 */

import { Users, MapPin, Clock, User } from 'lucide-react';
import { TableStatusBadge } from './TableStatusBadge';

const SHAPE_STYLES = {
  square: 'rounded-lg',
  round: 'rounded-full',
  rectangle: 'rounded-lg',
  oval: 'rounded-full',
  bar: 'rounded-md',
};

export const TableCard = ({ table, onEdit, onStatusChange, onSelect, selected = false }) => {
  const shapeClass = SHAPE_STYLES[table.shape] || SHAPE_STYLES.square;

  const handleClick = () => {
    if (onSelect) {
      onSelect(table);
    }
  };

  const handleStatusClick = (e) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(table);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(table);
    }
  };

  return (
    <div
      className={`
        relative bg-white rounded-lg border-2 p-4 cursor-pointer transition-all
        hover:shadow-md hover:border-blue-400
        ${selected ? 'border-blue-500 shadow-lg' : 'border-gray-200'}
      `}
      onClick={handleClick}
    >
      {/* Table Number and Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className={`
              w-12 h-12 flex items-center justify-center font-bold text-lg
              bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 ${shapeClass}
            `}
          >
            {table.number}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900">{table.number}</span>
            {table.section && (
              <span className="text-xs text-gray-500">{table.section}</span>
            )}
          </div>
        </div>
        <div onClick={handleStatusClick}>
          <TableStatusBadge status={table.status} size="sm" />
        </div>
      </div>

      {/* Table Details */}
      <div className="space-y-2 mb-3">
        {/* Capacity */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{table.capacity} seats</span>
        </div>

        {/* Floor */}
        {table.floor && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{table.floor}</span>
          </div>
        )}

        {/* Assigned Server */}
        {table.assignedServer && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>Server: {table.assignedServer}</span>
          </div>
        )}

        {/* Reservation Info */}
        {table.status === 'reserved' && table.reservedFor && (
          <div className="text-sm">
            <div className="text-gray-600">Reserved for:</div>
            <div className="font-medium text-gray-900">{table.reservedFor}</div>
            {table.reservedAt && (
              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <Clock className="w-3 h-3" />
                {new Date(table.reservedAt).toLocaleTimeString()}
              </div>
            )}
          </div>
        )}

        {/* Last Occupied */}
        {table.status === 'occupied' && table.lastOccupied && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            Since {new Date(table.lastOccupied).toLocaleTimeString()}
          </div>
        )}

        {/* Combined Tables */}
        {table.isCombined && table.combinedWith && table.combinedWith.length > 0 && (
          <div className="text-xs text-purple-600 font-medium">
            Combined with: {table.combinedWith.join(', ')}
          </div>
        )}

        {/* Notes */}
        {table.notes && (
          <div className="text-xs text-gray-500 italic border-t pt-2 mt-2">
            {table.notes}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t">
        <button
          onClick={handleEditClick}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleStatusClick}
          className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          Change Status
        </button>
      </div>
    </div>
  );
};

export default TableCard;
