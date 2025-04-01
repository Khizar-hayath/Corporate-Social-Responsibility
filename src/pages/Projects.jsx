import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '../components/layout/PageTransition';
import { FiTarget, FiUsers, FiGlobe, FiArrowRight, FiTag } from 'react-icons/fi';

function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectsRef, projectsInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'education', label: 'Education' },
    { id: 'environment', label: 'Environment' },
    { id: 'health', label: 'Health' },
    { id: 'community', label: 'Community' },
  ];

  const projects = [
    {
      id: 1,
      title: 'Education for All',
      description: 'Providing quality education to underprivileged children in rural communities.',
      category: 'education',
      status: 'Active',
      location: 'Rural Areas',
      impact: '500+ students',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tags: ['Education', 'Children', 'Rural'],
    },
    {
      id: 2,
      title: 'Green Earth Initiative',
      description: 'Environmental conservation and sustainable development projects.',
      category: 'environment',
      status: 'Active',
      location: 'Multiple Regions',
      impact: '1000+ trees planted',
      image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tags: ['Environment', 'Conservation', 'Sustainability'],
    },
    {
      id: 3,
      title: 'Healthcare Access',
      description: 'Improving healthcare access in underserved communities.',
      category: 'health',
      status: 'Active',
      location: 'Urban Areas',
      impact: '2000+ patients served',
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tags: ['Healthcare', 'Community', 'Access'],
    },
    {
      id: 4,
      title: 'Digital Literacy Program',
      description: 'Empowering communities through technology education and digital skills training.',
      category: 'education',
      status: 'Active',
      location: 'Urban & Rural',
      impact: '1000+ participants',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tags: ['Technology', 'Education', 'Digital'],
    },
    {
      id: 5,
      title: 'Clean Water Initiative',
      description: 'Providing access to clean and safe drinking water in remote communities.',
      category: 'health',
      status: 'Active',
      location: 'Rural Areas',
      impact: '50+ communities',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tags: ['Water', 'Health', 'Infrastructure'],
    },
    {
      id: 6,
      title: 'Sustainable Agriculture',
      description: 'Promoting sustainable farming practices and food security.',
      category: 'environment',
      status: 'Active',
      location: 'Rural Areas',
      impact: '200+ farmers',
      image: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tags: ['Agriculture', 'Sustainability', 'Food'],
    },
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
                key={project.id}
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