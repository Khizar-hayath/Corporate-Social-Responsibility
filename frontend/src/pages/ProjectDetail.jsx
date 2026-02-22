import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiTag, FiUsers, FiGlobe, FiTarget, FiArrowLeft } from 'react-icons/fi';
import PageTransition from '../components/layout/PageTransition';
import CommentSection from '../components/comments/CommentSection';
import ClaimCertificate from '../components/certificates/ClaimCertificate';
import { projectsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await projectsAPI.getAll();
        const projectData = response.data.find(p => p._id === id);
        if (projectData) {
          setProject(projectData);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
        <Link to="/projects" className="btn-primary">
          Back to Projects
        </Link>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Project not found</h2>
        <Link to="/projects" className="btn-primary">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 mt-8 sm:px-6 lg:px-12 py-16">
        <Link to="/projects" className="inline-flex items-center text-primary-600 mb-8 hover:underline">
          <FiArrowLeft className="mr-2" />
          Back to Projects
        </Link>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="h-80 relative">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-white/90 dark:bg-gray-900/90 text-sm font-semibold text-gray-900 dark:text-white">
                {project.status}
              </span>
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center mr-6 mb-2">
                <FiGlobe className="mr-2" />
                <span>{project.location}</span>
              </div>
              <div className="flex items-center mb-2">
                <FiUsers className="mr-2" />
                <span>{project.impact} people impacted</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags && project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  <FiTag className="mr-1" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project Description</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {project.description}
              </p>
              {project.fullDescription && (
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {project.fullDescription}
                </p>
              )}
            </div>

            {project.goals && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Project Goals</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                  {project.goals.map((goal, index) => (
                    <li key={index} className="flex items-start">
                      <FiTarget className="mt-1 mr-2 text-primary-600" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Category: {project.category?.charAt(0).toUpperCase() + project.category?.slice(1)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Status: {project.status}
                </p>
              </div>
              {project.website && (
                <Link 
                  to={project.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Visit Project Website
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <CommentSection projectId={id} />
        
        {/* Certificate Section - Only visible to company users */}
        {user && user.userType === 'company' && (
          <ClaimCertificate projectId={id} projectTitle={project.title} />
        )}
      </div>
    </PageTransition>
  );
}

export default ProjectDetail; 