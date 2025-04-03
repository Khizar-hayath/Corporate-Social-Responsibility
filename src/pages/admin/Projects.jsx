import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { API_BASE_URL } from '../../config';
import ProjectTable from './components/projects/ProjectTable';
import ProjectForm from './components/projects/ProjectForm';
import ProjectFilters from './components/projects/ProjectFilters';

/**
 * Admin Projects Management Page
 * 
 * Features:
 * - View all projects in a table
 * - Search and filter projects
 * - Create, edit, and delete projects
 * - Preview projects
 */
function AdminProjects() {
  // State management
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  // Fetch projects when component mounts or dependencies change
  useEffect(() => {
    fetchProjects();
  }, [category, status]);

  /**
   * Fetch projects from the API
   */
  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Construct query parameters for filtering
      const queryParams = new URLSearchParams();
      if (category !== 'all') queryParams.append('category', category);
      if (status !== 'all') queryParams.append('status', status);
      
      const response = await fetch(`${API_BASE_URL}/admin/projects?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission for creating or updating a project
   */
  const handleSubmit = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Process dates and numbers
      const processedData = {
        ...projectData,
        budget: Number(projectData.budget),
        startDate: new Date(projectData.startDate),
        endDate: projectData.endDate ? new Date(projectData.endDate) : null,
      };

      const url = editingProject
        ? `${API_BASE_URL}/admin/projects/${editingProject._id}`
        : `${API_BASE_URL}/admin/projects`;
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save project');
      }

      // Refresh the projects list
      await fetchProjects();
      
      // Reset form state
      setShowForm(false);
      setEditingProject(null);
    } catch (err) {
      setError(err.message);
      console.error('Error saving project:', err);
    }
  };

  /**
   * Handle editing a project
   */
  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  /**
   * Handle deleting a project
   */
  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/projects/${projectId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete project');
      }

      // Refresh the projects list
      await fetchProjects();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting project:', err);
    }
  };

  /**
   * Filter projects based on search query and other filters
   */
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  /**
   * Handle previewing a project (redirect to public view)
   */
  const handlePreview = (project) => {
    // Open in a new tab
    window.open(`/projects/${project._id}`, '_blank');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Projects Management</h1>
        <button
          onClick={() => {
            setEditingProject(null);
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Add Project
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <ProjectFilters 
            category={category}
            setCategory={setCategory}
            status={status}
            setStatus={setStatus}
          />
        </div>
      </div>

      {/* Project Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6"
        >
          <ProjectForm
            project={editingProject}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingProject(null);
            }}
          />
        </motion.div>
      )}

      {/* Projects Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <ProjectTable 
            projects={filteredProjects} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
            onPreview={handlePreview}
          />
        ) : (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            No projects found. {searchQuery && 'Try adjusting your search criteria.'}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProjects; 