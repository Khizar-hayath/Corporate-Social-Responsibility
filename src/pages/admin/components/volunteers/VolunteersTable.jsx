import { useState, useEffect } from 'react';
import { FiCheck, FiX, FiTrash2, FiEye, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../../../config';

function VolunteersTable() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch volunteers data
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_BASE_URL}/api/volunteers`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch volunteers');
        }

        const data = await response.json();
        setVolunteers(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/volunteers/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update volunteer status');
      }

      // Update the volunteer in the local state
      setVolunteers(volunteers.map(volunteer => 
        volunteer._id === id ? { ...volunteer, status: newStatus } : volunteer
      ));
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      setError(error.message);
    }
  };

  // Handle volunteer deletion
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this volunteer application?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/api/volunteers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete volunteer');
      }

      // Remove the volunteer from the local state
      setVolunteers(volunteers.filter(volunteer => volunteer._id !== id));
    } catch (error) {
      console.error('Error deleting volunteer:', error);
      setError(error.message);
    }
  };

  // Email volunteer
  const handleEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  // Filter volunteers by status
  const filteredVolunteers = filterStatus === 'all' 
    ? volunteers 
    : volunteers.filter(volunteer => volunteer.status === filterStatus);

  if (loading) {
    return <div className="text-center py-8">Loading volunteers...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Volunteer Applications</h2>
        <div className="flex space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {filteredVolunteers.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No volunteer applications found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredVolunteers.map((volunteer) => (
                <motion.tr 
                  key={volunteer._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {volunteer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {volunteer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {volunteer.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      volunteer.status === 'approved' ? 'bg-green-100 text-green-800' :
                      volunteer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {volunteer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedVolunteer(volunteer)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEmail(volunteer.email)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <FiMail size={18} />
                      </button>
                      {volunteer.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(volunteer._id, 'approved')}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <FiCheck size={18} />
                        </button>
                      )}
                      {volunteer.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(volunteer._id, 'rejected')}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FiX size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(volunteer._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Volunteer Details Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Volunteer Details</h3>
              <button 
                onClick={() => setSelectedVolunteer(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</h4>
                <p className="text-gray-900 dark:text-white">{selectedVolunteer.name}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</h4>
                <p className="text-gray-900 dark:text-white">{selectedVolunteer.email}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</h4>
                <p className="text-gray-900 dark:text-white">{selectedVolunteer.phone}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Availability</h4>
                <p className="text-gray-900 dark:text-white">{selectedVolunteer.availability}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Skills</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedVolunteer.skills.length > 0 ? (
                    selectedVolunteer.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No skills provided</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Interests</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedVolunteer.interests.length > 0 ? (
                    selectedVolunteer.interests.map((interest, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No interests provided</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</h4>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedVolunteer.message}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h4>
                <p className={`
                  ${selectedVolunteer.status === 'approved' ? 'text-green-600 dark:text-green-400' : 
                    selectedVolunteer.status === 'rejected' ? 'text-red-600 dark:text-red-400' : 
                    'text-yellow-600 dark:text-yellow-400'}
                `}>
                  {selectedVolunteer.status.charAt(0).toUpperCase() + selectedVolunteer.status.slice(1)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Application Date</h4>
                <p className="text-gray-900 dark:text-white">
                  {new Date(selectedVolunteer.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  handleEmail(selectedVolunteer.email);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiMail className="mr-2" />
                Email Volunteer
              </button>
              <button
                onClick={() => {
                  handleStatusChange(selectedVolunteer._id, 'approved');
                  setSelectedVolunteer({...selectedVolunteer, status: 'approved'});
                }}
                disabled={selectedVolunteer.status === 'approved'}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  selectedVolunteer.status === 'approved' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                }`}
              >
                <FiCheck className="mr-2" />
                Approve
              </button>
              <button
                onClick={() => {
                  handleStatusChange(selectedVolunteer._id, 'rejected');
                  setSelectedVolunteer({...selectedVolunteer, status: 'rejected'});
                }}
                disabled={selectedVolunteer.status === 'rejected'}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  selectedVolunteer.status === 'rejected' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                }`}
              >
                <FiX className="mr-2" />
                Reject
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default VolunteersTable; 