import React from 'react';
import { FiX, FiMapPin, FiCalendar, FiDollarSign, FiTarget, FiList, FiMail } from 'react-icons/fi';

/**
 * ProjectModal Component
 * 
 * Modal for displaying project details in a preview
 * 
 * @param {Object} props
 * @param {Object} props.project - Project data to display
 * @param {Function} props.onClose - Function to close the modal
 */
const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Format currency for display
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
      case 'Planned':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        
        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX className="h-6 w-6" />
          </button>
          
          <div className="bg-white dark:bg-gray-800">
            {/* Project image header */}
            <div className="relative h-48 sm:h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  No image available
                </div>
              )}
              
              {/* Status badge */}
              <div className="absolute top-4 left-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              {/* Title and category */}
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h3>
                <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded">
                  {project.category}
                </span>
              </div>
              
              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
              </div>
              
              {/* Project details grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Location */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <FiMapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200">Location</h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{project.location}</p>
                  </div>
                </div>
                
                {/* Dates */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <FiCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200">Timeline</h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(project.startDate)}
                      {project.endDate && ` to ${formatDate(project.endDate)}`}
                    </p>
                  </div>
                </div>
                
                {/* Budget */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <FiDollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200">Budget</h4>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(project.budget)}
                    </p>
                  </div>
                </div>
                
                {/* Contact */}
                {project.contactEmail && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-200">Contact</h4>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {project.contactEmail}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Goals section */}
              {project.goals && (
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <FiTarget className="h-5 w-5 text-gray-400 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200">Project Goals</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 ml-7">{project.goals}</p>
                </div>
              )}
              
              {/* Requirements section */}
              {project.requirements && (
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <FiList className="h-5 w-5 text-gray-400 mr-2" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-200">Requirements</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 ml-7">{project.requirements}</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 text-right">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal; 