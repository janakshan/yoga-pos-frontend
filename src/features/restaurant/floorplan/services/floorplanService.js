/**
 * Floor Plan Service - API operations for floor plan management
 * @module features/restaurant/floorplan/services/floorplanService
 */

import axiosInstance from '@/lib/axios';

/**
 * Mock data for development
 */
const mockFloorPlans = [
  {
    id: 'fp1',
    name: 'Main Floor',
    description: 'Ground floor dining area',
    floor: 'Ground Floor',
    dimensions: { width: 800, height: 600 },
    sections: [
      {
        id: 's1',
        name: 'Main Dining',
        color: '#3b82f6',
        floor: 'Ground Floor',
        capacity: 24,
        position: { x: 50, y: 50 },
        dimensions: { width: 350, height: 250 },
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 's2',
        name: 'VIP',
        color: '#eab308',
        floor: 'Ground Floor',
        capacity: 16,
        position: { x: 420, y: 50 },
        dimensions: { width: 200, height: 150 },
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 's3',
        name: 'Bar',
        color: '#8b5cf6',
        floor: 'Ground Floor',
        capacity: 12,
        position: { x: 50, y: 320 },
        dimensions: { width: 250, height: 150 },
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 's4',
        name: 'Patio',
        color: '#10b981',
        floor: 'Ground Floor',
        capacity: 16,
        position: { x: 320, y: 320 },
        dimensions: { width: 300, height: 150 },
        isActive: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
    tableIds: ['t1', 't2', 't3', 't4', 't5', 't6'],
    elements: [
      {
        id: 'el1',
        type: 'entrance',
        position: { x: 0, y: 250 },
        dimensions: { width: 40, height: 80 },
        rotation: 0,
        label: 'Main Entrance',
        color: '#22c55e',
      },
      {
        id: 'el2',
        type: 'kitchen',
        position: { x: 650, y: 50 },
        dimensions: { width: 150, height: 200 },
        rotation: 0,
        label: 'Kitchen',
        color: '#ef4444',
      },
      {
        id: 'el3',
        type: 'restroom',
        position: { x: 650, y: 270 },
        dimensions: { width: 100, height: 100 },
        rotation: 0,
        label: 'Restrooms',
        color: '#6366f1',
      },
    ],
    gridSettings: {
      enabled: true,
      size: 20,
      visible: true,
      color: '#e5e7eb',
    },
    scale: 10, // 10 pixels per meter
    isActive: true,
    branchId: 'branch1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

let floorPlansData = [...mockFloorPlans];

/**
 * Simulates API delay
 */
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generate unique ID
 */
const generateId = () => `fp${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

/**
 * Floor Plan Service API
 */
export const floorplanService = {
  /**
   * Get all floor plans with optional filters
   * @param {import('../types/floorplan.types').FloorPlanFilters} [filters] - Filter options
   * @returns {Promise<import('../types/floorplan.types').FloorPlan[]>}
   */
  getList: async (filters = {}) => {
    await delay();

    let filtered = [...floorPlansData];

    if (filters.floor) {
      filtered = filtered.filter(fp => fp.floor === filters.floor);
    }
    if (filters.isActive !== undefined) {
      filtered = filtered.filter(fp => fp.isActive === filters.isActive);
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(fp =>
        fp.name.toLowerCase().includes(search) ||
        fp.description?.toLowerCase().includes(search)
      );
    }

    return {
      data: filtered,
      total: filtered.length,
    };
  },

  /**
   * Get floor plan by ID
   * @param {string} id - Floor plan ID
   * @returns {Promise<import('../types/floorplan.types').FloorPlan>}
   */
  getById: async (id) => {
    await delay();
    const floorPlan = floorPlansData.find(fp => fp.id === id);
    if (!floorPlan) {
      throw new Error(`Floor plan with ID ${id} not found`);
    }
    return floorPlan;
  },

  /**
   * Create new floor plan
   * @param {Partial<import('../types/floorplan.types').FloorPlan>} data - Floor plan data
   * @returns {Promise<import('../types/floorplan.types').FloorPlan>}
   */
  create: async (data) => {
    await delay();

    const newFloorPlan = {
      id: generateId(),
      name: data.name,
      description: data.description,
      floor: data.floor,
      dimensions: data.dimensions || { width: 800, height: 600 },
      sections: data.sections || [],
      tableIds: data.tableIds || [],
      elements: data.elements || [],
      gridSettings: data.gridSettings || {
        enabled: true,
        size: 20,
        visible: true,
        color: '#e5e7eb',
      },
      scale: data.scale || 10,
      isActive: data.isActive !== undefined ? data.isActive : true,
      branchId: data.branchId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    floorPlansData.push(newFloorPlan);
    return newFloorPlan;
  },

  /**
   * Update existing floor plan
   * @param {string} id - Floor plan ID
   * @param {Partial<import('../types/floorplan.types').FloorPlan>} data - Updated data
   * @returns {Promise<import('../types/floorplan.types').FloorPlan>}
   */
  update: async (id, data) => {
    await delay();

    const index = floorPlansData.findIndex(fp => fp.id === id);
    if (index === -1) {
      throw new Error(`Floor plan with ID ${id} not found`);
    }

    const updatedFloorPlan = {
      ...floorPlansData[index],
      ...data,
      id, // Ensure ID doesn't change
      updatedAt: new Date(),
    };

    floorPlansData[index] = updatedFloorPlan;
    return updatedFloorPlan;
  },

  /**
   * Delete floor plan
   * @param {string} id - Floor plan ID
   * @returns {Promise<{success: boolean, message: string}>}
   */
  delete: async (id) => {
    await delay();

    const index = floorPlansData.findIndex(fp => fp.id === id);
    if (index === -1) {
      throw new Error(`Floor plan with ID ${id} not found`);
    }

    floorPlansData.splice(index, 1);
    return { success: true, message: 'Floor plan deleted successfully' };
  },

  /**
   * Add section to floor plan
   * @param {string} floorPlanId - Floor plan ID
   * @param {import('../types/floorplan.types').Section} section - Section data
   * @returns {Promise<import('../types/floorplan.types').FloorPlan>}
   */
  addSection: async (floorPlanId, section) => {
    await delay();

    const floorPlan = floorPlansData.find(fp => fp.id === floorPlanId);
    if (!floorPlan) {
      throw new Error(`Floor plan with ID ${floorPlanId} not found`);
    }

    const newSection = {
      id: `s${Date.now()}`,
      ...section,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedSections = [...floorPlan.sections, newSection];
    return floorplanService.update(floorPlanId, { sections: updatedSections });
  },

  /**
   * Update section in floor plan
   * @param {string} floorPlanId - Floor plan ID
   * @param {string} sectionId - Section ID
   * @param {Partial<import('../types/floorplan.types').Section>} data - Updated section data
   * @returns {Promise<import('../types/floorplan.types').FloorPlan>}
   */
  updateSection: async (floorPlanId, sectionId, data) => {
    await delay();

    const floorPlan = floorPlansData.find(fp => fp.id === floorPlanId);
    if (!floorPlan) {
      throw new Error(`Floor plan with ID ${floorPlanId} not found`);
    }

    const updatedSections = floorPlan.sections.map(section =>
      section.id === sectionId
        ? { ...section, ...data, updatedAt: new Date() }
        : section
    );

    return floorplanService.update(floorPlanId, { sections: updatedSections });
  },

  /**
   * Remove section from floor plan
   * @param {string} floorPlanId - Floor plan ID
   * @param {string} sectionId - Section ID
   * @returns {Promise<import('../types/floorplan.types').FloorPlan>}
   */
  removeSection: async (floorPlanId, sectionId) => {
    await delay();

    const floorPlan = floorPlansData.find(fp => fp.id === floorPlanId);
    if (!floorPlan) {
      throw new Error(`Floor plan with ID ${floorPlanId} not found`);
    }

    const updatedSections = floorPlan.sections.filter(s => s.id !== sectionId);
    return floorplanService.update(floorPlanId, { sections: updatedSections });
  },

  /**
   * Add element to floor plan
   * @param {string} floorPlanId - Floor plan ID
   * @param {import('../types/floorplan.types').FloorPlanElement} element - Element data
   * @returns {Promise<import('../types/floorplan.types').FloorPlan>}
   */
  addElement: async (floorPlanId, element) => {
    await delay();

    const floorPlan = floorPlansData.find(fp => fp.id === floorPlanId);
    if (!floorPlan) {
      throw new Error(`Floor plan with ID ${floorPlanId} not found`);
    }

    const newElement = {
      id: `el${Date.now()}`,
      ...element,
    };

    const updatedElements = [...floorPlan.elements, newElement];
    return floorplanService.update(floorPlanId, { elements: updatedElements });
  },

  /**
   * Update element in floor plan
   * @param {string} floorPlanId - Floor plan ID
   * @param {string} elementId - Element ID
   * @param {Partial<import('../types/floorplan.types').FloorPlanElement>} data - Updated element data
   * @returns {Promise<import('../types/floorplan.types').FloorPlan>}
   */
  updateElement: async (floorPlanId, elementId, data) => {
    await delay();

    const floorPlan = floorPlansData.find(fp => fp.id === floorPlanId);
    if (!floorPlan) {
      throw new Error(`Floor plan with ID ${floorPlanId} not found`);
    }

    const updatedElements = floorPlan.elements.map(element =>
      element.id === elementId ? { ...element, ...data } : element
    );

    return floorplanService.update(floorPlanId, { elements: updatedElements });
  },

  /**
   * Remove element from floor plan
   * @param {string} floorPlanId - Floor plan ID
   * @param {string} elementId - Element ID
   * @returns {Promise<import('../types/floorplan.types').FloorPlan>}
   */
  removeElement: async (floorPlanId, elementId) => {
    await delay();

    const floorPlan = floorPlansData.find(fp => fp.id === floorPlanId);
    if (!floorPlan) {
      throw new Error(`Floor plan with ID ${floorPlanId} not found`);
    }

    const updatedElements = floorPlan.elements.filter(e => e.id !== elementId);
    return floorplanService.update(floorPlanId, { elements: updatedElements });
  },

  /**
   * Get section statistics for a floor plan
   * @param {string} floorPlanId - Floor plan ID
   * @returns {Promise<import('../types/floorplan.types').SectionStats[]>}
   */
  getSectionStats: async (floorPlanId) => {
    await delay();

    const floorPlan = floorPlansData.find(fp => fp.id === floorPlanId);
    if (!floorPlan) {
      throw new Error(`Floor plan with ID ${floorPlanId} not found`);
    }

    // Mock statistics - in real implementation, this would aggregate table data
    return floorPlan.sections.map(section => ({
      sectionId: section.id,
      sectionName: section.name,
      totalTables: 3,
      availableTables: 2,
      occupiedTables: 1,
      capacity: section.capacity,
      occupancyRate: 33,
    }));
  },
};

export default floorplanService;
