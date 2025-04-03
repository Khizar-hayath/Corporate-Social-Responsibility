import React from 'react';
import { FiFilter } from 'react-icons/fi';

/**
 * ProjectFilters Component
 * 
 * Provides filtering options for the projects list
 * 
 * @param {Object} props
 * @param {string} props.category - Current category filter value
 * @param {Function} props.setCategory - Function to update category
 * @param {string} props.status - Current status filter value
 * @param {Function} props.setStatus - Function to update status
 */
const ProjectFilters = ({ category, setCategory, status, setStatus }) => {
  // Available categories for filtering
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'education', label: 'Education' },
    { id: 'environment', label: 'Environment' },
    { id: 'health', label: 'Health' },
    { id: 'community', label: 'Community' }
  ];

  // Available statuses for filtering
  const statuses = [
    { id: 'all', label: 'All Statuses' },
    { id: 'Active', label: 'Active' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Planned', label: 'Planned' }
  ];

  return (
    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
      <div className="flex items-center w-full md:w-auto">
        <FiFilter className="text-gray-400 mr-2" />
        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Filters:</span>
      </div>
      
      {/* Category Filter */}
      <div className="w-full md:w-auto">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
          aria-label="Filter by category"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Status Filter */}
      <div className="w-full md:w-auto">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
          aria-label="Filter by status"
        >
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProjectFilters; 