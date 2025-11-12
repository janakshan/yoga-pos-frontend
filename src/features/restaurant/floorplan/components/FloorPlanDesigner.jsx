/**
 * FloorPlanDesigner Component
 * Visual floor plan editor for designing restaurant layouts
 */

import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Grid, Move, Save, Undo, Redo, Plus } from 'lucide-react';
import { useFloorPlan } from '../hooks/useFloorPlan';
import { useTables } from '../../tables/hooks/useTables';
import { TableStatusBadge } from '../../tables/components/TableStatusBadge';

export const FloorPlanDesigner = ({ floorPlanId }) => {
  const {
    selectedFloorPlan,
    zoom,
    showGrid,
    editorMode,
    fetchFloorPlanById,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleGrid,
    setEditorMode,
  } = useFloorPlan();

  const { tables, fetchTables } = useTables();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (floorPlanId) {
          await fetchFloorPlanById(floorPlanId);
        }
        await fetchTables();
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [floorPlanId, fetchFloorPlanById, fetchTables]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!selectedFloorPlan) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <p className="text-gray-600">No floor plan selected</p>
      </div>
    );
  }

  const floorPlanTables = tables.filter(
    (table) => selectedFloorPlan.tableIds.includes(table.id)
  );

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedFloorPlan.name}
          </h2>
          {selectedFloorPlan.description && (
            <span className="text-sm text-gray-500">
              - {selectedFloorPlan.description}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
            <button
              onClick={zoomOut}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-sm font-medium min-w-[4rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={resetZoom}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors border-l ml-1 pl-2"
              title="Reset Zoom"
            >
              <span className="text-xs font-medium">100%</span>
            </button>
          </div>

          {/* Grid Toggle */}
          <button
            onClick={toggleGrid}
            className={`p-2 rounded-lg transition-colors ${
              showGrid
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Toggle Grid"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Mode Toggle */}
          <button
            onClick={() =>
              setEditorMode(editorMode === 'select' ? 'pan' : 'select')
            }
            className={`p-2 rounded-lg transition-colors ${
              editorMode === 'pan'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title="Pan Mode"
          >
            <Move className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 overflow-auto bg-gray-50 p-8">
        <div
          className="relative mx-auto bg-white shadow-lg"
          style={{
            width: selectedFloorPlan.dimensions.width * zoom,
            height: selectedFloorPlan.dimensions.height * zoom,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Grid Pattern */}
          {showGrid && selectedFloorPlan.gridSettings?.visible && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(${selectedFloorPlan.gridSettings.color || '#e5e7eb'} 1px, transparent 1px),
                  linear-gradient(90deg, ${selectedFloorPlan.gridSettings.color || '#e5e7eb'} 1px, transparent 1px)
                `,
                backgroundSize: `${selectedFloorPlan.gridSettings.size}px ${selectedFloorPlan.gridSettings.size}px`,
              }}
            />
          )}

          {/* Sections */}
          {selectedFloorPlan.sections?.map((section) => (
            <div
              key={section.id}
              className="absolute border-2 border-dashed rounded-lg flex items-center justify-center"
              style={{
                left: section.position?.x || 0,
                top: section.position?.y || 0,
                width: section.dimensions?.width || 100,
                height: section.dimensions?.height || 100,
                borderColor: section.color || '#3b82f6',
                backgroundColor: `${section.color || '#3b82f6'}10`,
              }}
            >
              <div
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: section.color || '#3b82f6',
                  color: 'white',
                }}
              >
                {section.name}
              </div>
            </div>
          ))}

          {/* Elements (walls, doors, etc.) */}
          {selectedFloorPlan.elements?.map((element) => (
            <div
              key={element.id}
              className="absolute border-2 rounded flex items-center justify-center"
              style={{
                left: element.position?.x || 0,
                top: element.position?.y || 0,
                width: element.dimensions?.width || 50,
                height: element.dimensions?.height || 50,
                backgroundColor: element.color || '#6b7280',
                borderColor: element.color || '#4b5563',
                transform: `rotate(${element.rotation || 0}deg)`,
              }}
              title={element.label}
            >
              {element.label && (
                <span className="text-xs text-white font-medium px-2 py-1">
                  {element.label}
                </span>
              )}
            </div>
          ))}

          {/* Tables */}
          {floorPlanTables.map((table) => {
            if (!table.position) return null;

            const shapeClass =
              table.shape === 'round' || table.shape === 'oval'
                ? 'rounded-full'
                : 'rounded-lg';

            return (
              <div
                key={table.id}
                className={`absolute border-2 shadow-md cursor-pointer hover:shadow-lg transition-shadow ${shapeClass}`}
                style={{
                  left: table.position.x,
                  top: table.position.y,
                  width: table.dimensions?.width || 80,
                  height: table.dimensions?.height || 80,
                  transform: `rotate(${table.rotation || 0}deg)`,
                  backgroundColor: 'white',
                  borderColor:
                    table.status === 'available'
                      ? '#10b981'
                      : table.status === 'occupied'
                      ? '#3b82f6'
                      : table.status === 'reserved'
                      ? '#8b5cf6'
                      : '#ef4444',
                }}
                title={`${table.number} - ${table.capacity} seats`}
              >
                <div className="h-full flex flex-col items-center justify-center p-2">
                  <div className="font-bold text-lg">{table.number}</div>
                  <div className="text-xs text-gray-600">{table.capacity} seats</div>
                  <div className="mt-1 scale-75">
                    <TableStatusBadge status={table.status} size="sm" showDot={false} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Legend:</span>
            <div className="flex items-center gap-3">
              {selectedFloorPlan.sections?.map((section) => (
                <div key={section.id} className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: section.color || '#3b82f6' }}
                  />
                  <span className="text-xs text-gray-600">{section.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {floorPlanTables.length} tables on this floor plan
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanDesigner;
