/**
 * FloorPlanPage - Floor plan designer page
 */

import { useState, useEffect } from 'react';
import { useFloorPlan } from '../features/restaurant/floorplan/hooks/useFloorPlan';
import { FloorPlanDesigner } from '../features/restaurant/floorplan/components/FloorPlanDesigner';
import { Plus, Layout } from 'lucide-react';

export const FloorPlanPage = () => {
  const { floorPlans, fetchFloorPlans, isLoading } = useFloorPlan();
  const [selectedFloorPlanId, setSelectedFloorPlanId] = useState(null);

  useEffect(() => {
    loadFloorPlans();
  }, []);

  const loadFloorPlans = async () => {
    const result = await fetchFloorPlans();
    if (result && result.length > 0) {
      setSelectedFloorPlanId(result[0].id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Floor Plan Designer</h1>
            <p className="text-sm text-gray-600 mt-1">
              Design and manage your restaurant floor layouts
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => alert('Create floor plan feature coming soon!')}
          >
            <Plus className="w-4 h-4" />
            New Floor Plan
          </button>
        </div>

        {/* Floor Plan Selector */}
        {floorPlans.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Floor Plan
            </label>
            <select
              value={selectedFloorPlanId || ''}
              onChange={(e) => setSelectedFloorPlanId(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {floorPlans.map((fp) => (
                <option key={fp.id} value={fp.id}>
                  {fp.name} {fp.description ? `- ${fp.description}` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Floor Plan Designer */}
        {selectedFloorPlanId ? (
          <div className="h-[calc(100vh-16rem)]">
            <FloorPlanDesigner floorPlanId={selectedFloorPlanId} />
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Layout className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Floor Plans Found
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Create your first floor plan to start designing your restaurant layout
              </p>
              <button
                onClick={() => alert('Create floor plan feature coming soon!')}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Floor Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloorPlanPage;
