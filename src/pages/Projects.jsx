import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '../components/layout/PageTransition';
import { FiTarget, FiUsers, FiGlobe, FiArrowRight, FiTag, FiPlus, FiX, FiEdit2, FiTrash2 } from 'react-icons/fi';
import ProjectForm from '../components/forms/ProjectForm';
import { useAuth } from '../context/AuthContext';
import { projectsAPI } from '../services/api';
import { FaSearch } from 'react-icons/fa';

function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectsRef, projectsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [filterRef, filterInView] = useInView({
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-r from-primary-800 via-blue-700 to-indigo-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600 opacity-10 blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 text-shadow"
            >
              Our <span className="text-blue-300">Projects</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
            >
              Explore our innovative projects and initiatives making a difference
              in communities around the world.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
            >
              <button
                onClick={() => projectsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary px-8 py-3 rounded-lg shadow-lg hover:shadow-primary-500/50 transition-all"
              >
                View Projects
              </button>
              
              <button
                onClick={() => setShowForm(true)}
                className="btn-outline-light px-8 py-3 rounded-lg border-2 border-white/80 text-white hover:bg-white/10 transition-all"
              >
                Submit a Project
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white dark:bg-gray-900 -mt-12 md:-mt-16 relative z-10 rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={filterRef}
            initial={{ opacity: 0 }}
            animate={filterInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
          >
            <div className="relative w-full md:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-10 pr-4 py-3 w-full md:w-80 rounded-lg border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
          </motion.div>

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
                          className="p-2 text-indigo-600 hover:text-indigo-800"
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