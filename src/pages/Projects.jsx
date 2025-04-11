import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '../components/layout/PageTransition';
import { FiTarget, FiUsers, FiGlobe, FiArrowRight, FiTag, FiPlus, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import ProjectForm from '../components/forms/ProjectForm';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../services/api';

function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectsRef, projectsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'education', label: 'Education' },
    { id: 'environment', label: 'Environment' },
    { id: 'health', label: 'Health' },
    { id: 'community', label: 'Community' },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

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
      setError(err.message);
      console.error('Error saving project:', err);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectsAPI.delete(projectId);
      await fetchProjects();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting project:', err);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Projects
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore our ongoing initiatives and see how we're making a positive
              impact in communities around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="input w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                      activeCategory === category.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Project Form - Only visible for NGO users */}
          {user?.userType === 'ngo' && (
            <div className="mt-12 mb-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
                  Submit a New Project
                </h2>
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setShowForm(true);
                  }}
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  {showForm ? (
                    <>
                      <FiX className="w-5 h-5 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <FiPlus className="w-5 h-5 mr-2" />
                      Submit Project
                    </>
                  )}
                </button>
              </div>

              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8"
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
            </div>
          )}

          {/* Projects Grid */}
          <motion.div
            ref={projectsRef}
            initial={{ opacity: 0 }}
            animate={projectsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={projectsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden group"
              >
                <div className="relative h-48">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 rounded-full text-sm font-semibold text-gray-900 dark:text-white">
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <FiGlobe className="mr-2" />
                    <span>{project.location}</span>
                    <FiUsers className="ml-4 mr-2" />
                    <span>{project.impact}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                      >
                        <FiTag className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">
                        Status: {project.status}
                      </span>
                      <br />
                      <span className="text-sm text-gray-500">
                        Category: {project.category}
                      </span>
                    </div>
                    {user?.userType === 'ngo' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(project)}
                          className="p-2 text-primary-600 hover:text-primary-800"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="p-2 text-red-600 hover:text-red-800"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ x: 5 }}
                    className="btn-secondary inline-flex items-center"
                  >
                    Learn More
                    <FiArrowRight className="ml-2" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}

export default Projects; 