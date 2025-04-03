import React from 'react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

/**
 * ProjectTable Component
 * 
 * Displays projects in a responsive table format with actions for edit, delete, and preview.
 * 
 * @param {Object} props
 * @param {Array} props.projects - Array of project objects
 * @param {Function} props.onEdit - Handler for editing a project
 * @param {Function} props.onDelete - Handler for deleting a project
 * @param {Function} props.onPreview - Handler for previewing a project
 */
const ProjectTable = ({ projects, onEdit, onDelete, onPreview }) => {
  // Format date to a readable string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get status badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Planned':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Project
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Category
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Status
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Location
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Budget
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {projects.map((project) => (
          <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {project.title}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                {project.description.substring(0, 80)}...
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-700 dark:text-primary-200 capitalize">
                {project.category}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(project.status)}`}>
                {project.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {project.location}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {formatCurrency(project.budget)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end items-center space-x-2">
                {onPreview && (
                  <button
                    onClick={() => onPreview(project)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    aria-label={`Preview ${project.title}`}
                  >
                    <FiEye className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => onEdit(project)}
                  className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  aria-label={`Edit ${project.title}`}
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(project._id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  aria-label={`Delete ${project.title}`}
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProjectTable; 