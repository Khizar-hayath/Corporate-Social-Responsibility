import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

function Volunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [editingVolunteer, setEditingVolunteer] = useState(null);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/volunteers');
      const data = await response.json();
      setVolunteers(data);
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/volunteers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchVolunteers();
      }
    } catch (error) {
      console.error('Error updating volunteer status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this volunteer?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/volunteers/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchVolunteers();
        }
      } catch (error) {
        console.error('Error deleting volunteer:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Volunteers Management</h1>
      </div>

      {/* Volunteers List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {volunteers.map((volunteer) => (
              <tr key={volunteer._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{volunteer.name}</div>
                  {volunteer.message && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">{volunteer.message}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{volunteer.email}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{volunteer.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                    {volunteer.volunteerType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={volunteer.status}
                    onChange={(e) => handleStatusChange(volunteer._id, e.target.value)}
                    className={`text-sm rounded-full px-2 py-1 ${
                      volunteer.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : volunteer.status === 'Rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingVolunteer(volunteer)}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    <FiEdit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(volunteer._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Details Modal */}
      {editingVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Volunteer Details</h2>
              <button
                onClick={() => setEditingVolunteer(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{editingVolunteer.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Information</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{editingVolunteer.email}</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{editingVolunteer.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Volunteer Type</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{editingVolunteer.volunteerType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{editingVolunteer.message || 'No message provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                <select
                  value={editingVolunteer.status}
                  onChange={(e) => handleStatusChange(editingVolunteer._id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Applied Date</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(editingVolunteer.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Volunteers; 