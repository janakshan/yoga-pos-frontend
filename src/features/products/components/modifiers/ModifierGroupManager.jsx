/**
 * Modifier Group Manager
 * Main component for managing modifier groups
 */

import { useState, useEffect } from 'react';
import { useStore } from '../../../../store';
import { Plus, Edit2, Trash2, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import ModifierGroupForm from './ModifierGroupForm';
import { MODIFIER_STATUS_LABELS, SELECTION_TYPE_LABELS } from '../../types/modifier.types';

export default function ModifierGroupManager() {
  const {
    modifierGroups,
    fetchModifierGroups,
    deleteModifierGroup,
    duplicateModifierGroup,
    isLoadingModifiers,
    modifierError
  } = useStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set());

  useEffect(() => {
    fetchModifierGroups();
  }, [fetchModifierGroups]);

  const handleCreate = () => {
    setEditingGroup(null);
    setIsFormOpen(true);
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setIsFormOpen(true);
  };

  const handleDelete = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this modifier group?')) {
      try {
        await deleteModifierGroup(groupId);
      } catch (error) {
        console.error('Failed to delete modifier group:', error);
      }
    }
  };

  const handleDuplicate = async (groupId) => {
    try {
      await duplicateModifierGroup(groupId);
    } catch (error) {
      console.error('Failed to duplicate modifier group:', error);
    }
  };

  const toggleExpand = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const activeGroups = modifierGroups.filter(g => g.status === 'active');
  const inactiveGroups = modifierGroups.filter(g => g.status === 'inactive');

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modifier Groups</h1>
          <p className="text-gray-600 mt-1">
            Manage customization options for menu items
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Modifier Group
        </button>
      </div>

      {modifierError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {modifierError}
        </div>
      )}

      {isLoadingModifiers ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Active Groups */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Active Groups ({activeGroups.length})
            </h2>
            <div className="space-y-3">
              {activeGroups.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-600">No active modifier groups yet</p>
                  <button
                    onClick={handleCreate}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Create your first modifier group
                  </button>
                </div>
              ) : (
                activeGroups.map((group) => (
                  <ModifierGroupCard
                    key={group.id}
                    group={group}
                    isExpanded={expandedGroups.has(group.id)}
                    onToggleExpand={() => toggleExpand(group.id)}
                    onEdit={() => handleEdit(group)}
                    onDelete={() => handleDelete(group.id)}
                    onDuplicate={() => handleDuplicate(group.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Inactive Groups */}
          {inactiveGroups.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Inactive Groups ({inactiveGroups.length})
              </h2>
              <div className="space-y-3">
                {inactiveGroups.map((group) => (
                  <ModifierGroupCard
                    key={group.id}
                    group={group}
                    isExpanded={expandedGroups.has(group.id)}
                    onToggleExpand={() => toggleExpand(group.id)}
                    onEdit={() => handleEdit(group)}
                    onDelete={() => handleDelete(group.id)}
                    onDuplicate={() => handleDuplicate(group.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <ModifierGroupForm
          group={editingGroup}
          onClose={() => {
            setIsFormOpen(false);
            setEditingGroup(null);
          }}
        />
      )}
    </div>
  );
}

function ModifierGroupCard({ group, isExpanded, onToggleExpand, onEdit, onDelete, onDuplicate }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  group.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {MODIFIER_STATUS_LABELS[group.status]}
              </span>
              {group.required && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  Required
                </span>
              )}
            </div>
            {group.description && (
              <p className="text-gray-600 mt-1 text-sm">{group.description}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>{SELECTION_TYPE_LABELS[group.selectionType]}</span>
              <span>•</span>
              <span>{group.options?.length || 0} options</span>
              <span>•</span>
              <span>
                {group.minSelections}-{group.maxSelections} selections
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleExpand}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={onEdit}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onDuplicate}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Duplicate"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isExpanded && group.options && group.options.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Options</h4>
            <div className="space-y-2">
              {group.options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{option.name}</span>
                      {option.isDefault && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                          Default
                        </span>
                      )}
                      {!option.isAvailable && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-700">
                          Unavailable
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">
                      {option.price === 0 ? 'Free' : `+$${option.price.toFixed(2)}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
