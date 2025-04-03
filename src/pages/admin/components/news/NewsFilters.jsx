import React from 'react';
import { FiFilter } from 'react-icons/fi';

/**
 * NewsFilters Component
 * 
 * Provides filtering options for the news articles list
 * 
 * @param {Object} props
 * @param {string} props.category - Current category filter value
 * @param {Function} props.setCategory - Function to update category
 * @param {string} props.view - Current view filter value
 * @param {Function} props.setView - Function to update view
 */
const NewsFilters = ({ category, setCategory, view, setView }) => {
  // Available categories for filtering
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'press', label: 'Press Releases' },
    { id: 'updates', label: 'Project Updates' },
    { id: 'stories', label: 'Success Stories' },
    { id: 'events', label: 'Events' },
    { id: 'announcement', label: 'Announcements' },
  ];

  // Available views for filtering
  const views = [
    { id: 'all', label: 'All Status' },
    { id: 'published', label: 'Published' },
    { id: 'draft', label: 'Drafts' },
    { id: 'archived', label: 'Archived' },
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
      
      {/* View/Status Filter */}
      <div className="w-full md:w-auto">
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
          aria-label="Filter by status"
        >
          {views.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default NewsFilters; 