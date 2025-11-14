import React, { useState, useEffect, useRef } from 'react';
import {
  BuildingStorefrontIcon,
  ChevronDownIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { useBranch } from '../hooks';
import { useStore } from '@/store';
import { selectUser } from '@/store/selectors';
import toast from 'react-hot-toast';

/**
 * BranchSelector Component
 *
 * Dropdown component for selecting the current branch/location.
 * Only displays branches associated with the logged-in user.
 * The selected branch is persisted to localStorage automatically.
 *
 * Features:
 * - Shows current branch with indicator
 * - Dropdown list of user's assigned branches only
 * - Automatic persistence
 * - Click outside to close
 * - Keyboard accessible
 */
const BranchSelector = () => {
  const {
    branches,
    currentBranch,
    setCurrentBranch,
    getActiveBranches,
    fetchBranches,
    initializeUserBranch,
    isLoading,
  } = useBranch();

  const user = useStore(selectUser);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch branches on mount if not already loaded
  useEffect(() => {
    if (branches.length === 0 && !isLoading) {
      fetchBranches();
    }
  }, []);

  // Initialize user's branch after branches are loaded
  useEffect(() => {
    if (branches.length > 0 && !currentBranch) {
      initializeUserBranch();
    }
  }, [branches.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Filter branches to only show those associated with the current user
  const activeBranches = getActiveBranches();
  const userBranches = user?.branchId
    ? activeBranches.filter(branch => branch.id === user.branchId)
    : activeBranches;

  const handleBranchSelect = (branch) => {
    setCurrentBranch(branch);
    setIsOpen(false);
    toast.success(`Switched to ${branch.name}`);
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Don't render if no branches available or user has no branch assigned
  if (userBranches.length === 0) {
    return null;
  }

  // If user only has one branch, don't show dropdown - just display the branch name
  if (userBranches.length === 1) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg">
        <BuildingStorefrontIcon className="w-5 h-5" />
        <span className="hidden md:inline">{userBranches[0].name}</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Toggle Button */}
      <button
        onClick={handleToggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-gray-300 hover:border-indigo-300"
        aria-label="Select branch"
        aria-expanded={isOpen}
      >
        <BuildingStorefrontIcon className="w-5 h-5" />
        <span className="hidden md:inline">
          {currentBranch ? currentBranch.name : 'Select Branch'}
        </span>
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-auto">
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Select Branch Location
            </div>
            <div className="space-y-1">
              {userBranches.map((branch) => {
                const isSelected = currentBranch?.id === branch.id;
                return (
                  <button
                    key={branch.id}
                    onClick={() => handleBranchSelect(branch)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <BuildingStorefrontIcon
                        className={`w-5 h-5 flex-shrink-0 ${
                          isSelected ? 'text-indigo-600' : 'text-gray-400'
                        }`}
                      />
                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-medium truncate">{branch.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {branch.code} • {branch.city}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchSelector;
