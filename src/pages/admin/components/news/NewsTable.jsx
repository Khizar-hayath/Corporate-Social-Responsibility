import React from 'react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';

/**
 * NewsTable Component
 * 
 * Displays news articles in a responsive table format with actions for edit, delete, and preview.
 * 
 * @param {Object} props
 * @param {Array} props.news - Array of news articles
 * @param {Function} props.onEdit - Handler for editing a news article
 * @param {Function} props.onDelete - Handler for deleting a news article
 * @param {Function} props.onPreview - Handler for previewing a news article (optional)
 */
const NewsTable = ({ news, onEdit, onDelete, onPreview }) => {
  // Format date to a readable string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color based on status
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Title
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Category
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Author
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Date
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Status
          </th>
          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {news.map((item) => (
          <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {item.title}
              </div>
              {item.excerpt && (
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                  {item.excerpt}
                </div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800 dark:bg-primary-700 dark:text-primary-200">
                {item.category}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {item.author}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {formatDate(item.createdAt || item.date)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                {item.status || 'Published'}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex justify-end items-center space-x-2">
                {onPreview && (
                  <button
                    onClick={() => onPreview(item)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    aria-label={`Preview ${item.title}`}
                  >
                    <FiEye className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => onEdit(item)}
                  className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                  aria-label={`Edit ${item.title}`}
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  aria-label={`Delete ${item.title}`}
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

export default NewsTable; 