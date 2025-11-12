/**
 * Section Assignment Component
 * Allows managers to view and assign servers to sections
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Users, MapPin } from 'lucide-react';
import { useServerManagement } from '../hooks/useServerManagement';
import { useStore } from '../../../store';
import { getSectionTypeName, SECTION_TYPE } from '../types/serverManagement.types';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/modals/Modal';
import FormField from '../../../components/forms/FormField';

const SectionAssignment = () => {
  const {
    sections,
    loading,
    fetchSections,
    createSection,
    updateSectionData,
    deleteSection,
    assignServer,
  } = useServerManagement();

  const users = useStore((state) => state.users);
  const fetchUsers = useStore((state) => state.fetchUsers);

  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: SECTION_TYPE.DINING_ROOM,
    description: '',
    capacity: 0,
    floor: '1st Floor',
    color: '#3B82F6',
    notes: '',
  });
  const [selectedServerId, setSelectedServerId] = useState('');

  useEffect(() => {
    fetchSections();
    fetchUsers();
  }, [fetchSections, fetchUsers]);

  // Get servers (users with server role)
  const servers = users.filter(user =>
    user.roles?.some(role => role.toLowerCase().includes('server')) ||
    user.staffProfile?.serverProfile?.isServer
  );

  const handleCreateSection = async (e) => {
    e.preventDefault();
    try {
      await createSection(formData);
      setShowSectionModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    try {
      await updateSectionData(selectedSection.id, formData);
      setShowSectionModal(false);
      setSelectedSection(null);
      resetForm();
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  const handleDeleteSection = async (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await deleteSection(sectionId);
      } catch (error) {
        console.error('Error deleting section:', error);
      }
    }
  };

  const handleAssignServer = async (e) => {
    e.preventDefault();
    if (!selectedServerId || !selectedSection) return;

    const server = servers.find(s => s.id === selectedServerId);
    if (!server) return;

    try {
      await assignServer({
        serverId: server.id,
        serverName: server.fullName || `${server.firstName} ${server.lastName}`,
        sectionIds: [selectedSection.id],
        shiftId: null, // Will be set when shift is created
        tableIds: selectedSection.tableIds || [],
        maxTables: selectedSection.tableCount || 5,
        assignedBy: 'current-user-id', // Replace with actual current user ID
        notes: '',
        branchId: selectedSection.branchId || 'BRANCH001',
      });
      setShowAssignModal(false);
      setSelectedSection(null);
      setSelectedServerId('');
      fetchSections();
    } catch (error) {
      console.error('Error assigning server:', error);
    }
  };

  const openEditModal = (section) => {
    setSelectedSection(section);
    setFormData({
      name: section.name,
      type: section.type,
      description: section.description || '',
      capacity: section.capacity,
      floor: section.floor,
      color: section.color,
      notes: section.notes || '',
    });
    setShowSectionModal(true);
  };

  const openAssignModal = (section) => {
    setSelectedSection(section);
    setShowAssignModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: SECTION_TYPE.DINING_ROOM,
      description: '',
      capacity: 0,
      floor: '1st Floor',
      color: '#3B82F6',
      notes: '',
    });
  };

  const getSectionStatusColor = (section) => {
    if (!section.isActive) return 'gray';
    if (section.assignedServerId) return 'green';
    return 'yellow';
  };

  const getSectionStatusText = (section) => {
    if (!section.isActive) return 'Inactive';
    if (section.assignedServerId) return 'Assigned';
    return 'Available';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Section Assignment</h2>
          <p className="text-gray-600 mt-1">
            Manage restaurant sections and assign servers
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedSection(null);
            resetForm();
            setShowSectionModal(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </Button>
      </div>

      {/* Sections Grid */}
      {loading.sections ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : sections.length === 0 ? (
        <Card className="p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No sections yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first section to start managing server assignments
          </p>
          <Button onClick={() => setShowSectionModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Section
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Card key={section.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: section.color }}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{section.name}</h3>
                    <p className="text-sm text-gray-600">
                      {getSectionTypeName(section.type)}
                    </p>
                  </div>
                </div>
                <Badge color={getSectionStatusColor(section)}>
                  {getSectionStatusText(section)}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{section.capacity} guests</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tables:</span>
                  <span className="font-medium">{section.tableCount} tables</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Floor:</span>
                  <span className="font-medium">{section.floor}</span>
                </div>
              </div>

              {/* Assigned Server */}
              {section.assignedServerId ? (
                <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{section.assignedServerName}</span>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>No server assigned</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAssignModal(section)}
                  className="flex-1"
                >
                  <User className="w-4 h-4 mr-1" />
                  {section.assignedServerId ? 'Reassign' : 'Assign'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(section)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSection(section.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Section Create/Edit Modal */}
      <Modal
        isOpen={showSectionModal}
        onClose={() => {
          setShowSectionModal(false);
          setSelectedSection(null);
          resetForm();
        }}
        title={selectedSection ? 'Edit Section' : 'Create Section'}
      >
        <form onSubmit={selectedSection ? handleUpdateSection : handleCreateSection}>
          <div className="space-y-4">
            <FormField
              label="Section Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Front Dining Room"
            />

            <FormField
              label="Section Type"
              type="select"
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              {Object.values(SECTION_TYPE).map((type) => (
                <option key={type} value={type}>
                  {getSectionTypeName(type)}
                </option>
              ))}
            </FormField>

            <FormField
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the section"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Capacity"
                type="number"
                required
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                placeholder="40"
              />

              <FormField
                label="Floor"
                required
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                placeholder="1st Floor"
              />
            </div>

            <FormField
              label="Color"
              type="color"
              required
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />

            <FormField
              label="Notes"
              type="textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="submit" className="flex-1">
              {selectedSection ? 'Update Section' : 'Create Section'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowSectionModal(false);
                setSelectedSection(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Server Assignment Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedSection(null);
          setSelectedServerId('');
        }}
        title={`Assign Server to ${selectedSection?.name}`}
      >
        <form onSubmit={handleAssignServer}>
          <div className="space-y-4">
            <p className="text-gray-600">
              Select a server to assign to this section:
            </p>

            <FormField
              label="Server"
              type="select"
              required
              value={selectedServerId}
              onChange={(e) => setSelectedServerId(e.target.value)}
            >
              <option value="">Select a server...</option>
              {servers.map((server) => (
                <option key={server.id} value={server.id}>
                  {server.fullName || `${server.firstName} ${server.lastName}`}
                  {server.staffProfile?.serverProfile?.isOnShift && ' (On Shift)'}
                </option>
              ))}
            </FormField>

            {selectedServerId && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Section Details</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Tables: {selectedSection?.tableCount}</li>
                  <li>• Capacity: {selectedSection?.capacity} guests</li>
                  <li>• Type: {getSectionTypeName(selectedSection?.type)}</li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button type="submit" className="flex-1" disabled={!selectedServerId}>
              Assign Server
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAssignModal(false);
                setSelectedSection(null);
                setSelectedServerId('');
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

export default SectionAssignment;
