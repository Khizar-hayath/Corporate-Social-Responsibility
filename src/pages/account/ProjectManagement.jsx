import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { projectsAPI } from '../../services/api';
import ProjectForm from '../../components/forms/ProjectForm';
import PageTransition from '../../components/layout/PageTransition';

function ProjectManagement() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { user } = useAuth();

  // Fetch projects when component mounts
  useEffect(() => {
    fetchProjects();
  }, []);

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'education', label: 'Education' },
    { id: 'environment', label: 'Environment' },
    { id: 'health', label: 'Health' },
    { id: 'community', label: 'Community' },
  ];

  // Fetch user's projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      // We fetch all projects and filter by the current user's ID
      const response = await projectsAPI.getAll();
      // Only show projects created by this NGO
      const userProjects = response.data.filter(
        (project) => project.createdBy === user.id
      );
      setProjects(userProjects);
      setError('');
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (create/update)
  const handleSubmit = async (projectData) => {
    try {
      if (editingProject) {
        await projectsAPI.update(editingProject._id, projectData);
      } else {
        await projectsAPI.create(projectData);
      }
      
      await fetchProjects();
      setShowForm(false);
      setEditingProject(null);
    } catch (err) {
      //console.error('Error saving project:', err);
      //setError('Failed to save project. Please try again.');
    }
  };

  // Handle edit button click
  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      setLoading(true);
      await projectsAPI.delete(projectId);
      setError('');
      // Show success message
      window.alert('Project successfully deleted');
      await fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Failed to delete project. Please try again.');
      // Show more detailed error if available
      if (err.response?.data?.message) {
        setError(`Failed to delete project: ${err.response.data.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on search and category
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status badge color
  const getStatusColor = (status) => {
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
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <button
            onClick={() => {
              setEditingProject(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiPlus className="mr-2 -ml-1" />
            Create New Project
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form for creating/editing projects */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-white p-6 rounded-lg shadow-lg"
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

        {/* Projects List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <li key={project._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="sm:flex sm:items-center">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {project.title}
                        </p>
                        <div className="mt-2 sm:mt-0 sm:ml-6 flex-shrink-0 flex">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(`/projects/${project._id}`, '_blank')}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <FiEdit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          {project.location}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {formatDate(project.startDate)}
                          {project.endDate && ` - ${formatDate(project.endDate)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || activeCategory !== 'all'
                ? 'Try adjusting your search filters'
                : 'Create your first project by clicking the button above'}
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default ProjectManagement; 