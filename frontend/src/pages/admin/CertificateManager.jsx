import { useState, useEffect } from 'react';
import { FiPlus, FiLoader, FiCheck, FiClipboard, FiDownload } from 'react-icons/fi';
import AdminLayout from '../../components/layout/AdminLayout';
import { projectsAPI } from '../../services/api';
import api from '../../services/api';

function CertificateManager() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [codeCount, setCodeCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [projectCertificates, setProjectCertificates] = useState([]);

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const response = await projectsAPI.getAll();
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  // Fetch certificates for selected project
  useEffect(() => {
    if (!selectedProject) {
      setProjectCertificates([]);
      return;
    }

    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/certificates/project/${selectedProject}`);
        setProjectCertificates(response.data);
      } catch (err) {
        console.error('Error fetching certificates:', err);
        setError('Failed to load certificates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [selectedProject]);

  // Generate certificate codes
  const generateCertificates = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!selectedProject) {
      setError('Please select a project');
      return;
    }

    if (codeCount < 1 || codeCount > 50) {
      setError('Please enter a valid number of codes (1-50)');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/api/certificates', {
        projectId: selectedProject,
        count: codeCount
      });

      if (response.data.success) {
        setSuccess(true);
        setCertificates(response.data.certificates);
        
        // Refresh the project certificates list
        const certificatesResponse = await api.get(`/api/certificates/project/${selectedProject}`);
        setProjectCertificates(certificatesResponse.data);
      }
    } catch (err) {
      console.error('Error generating certificates:', err);
      setError(err.response?.data?.message || 'Failed to generate certificate codes');
    } finally {
      setLoading(false);
    }
  };

  // Copy certificate codes to clipboard
  const copyCertificatesToClipboard = () => {
    const codes = certificates.map(cert => cert.code).join('\n');
    navigator.clipboard.writeText(codes);
  };

  // Export certificate codes as CSV
  const exportCertificatesCSV = () => {
    const header = 'Code,Project,Created\n';
    const csv = certificates.map(cert => (
      `${cert.code},${projects.find(p => p._id === cert.projectId)?.title || cert.projectId},${new Date(cert.createdAt).toLocaleDateString()}`
    )).join('\n');
    
    const blob = new Blob([header + csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `certificates-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <AdminLayout title="Certificate Manager">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generate Certificates Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-1">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Generate Certificate Codes
          </h2>
          
          <form onSubmit={generateCertificates} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={loading || loadingProjects}
              >
                <option value="">-- Select a project --</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Number of Codes to Generate
              </label>
              <input
                type="number"
                value={codeCount}
                onChange={(e) => setCodeCount(parseInt(e.target.value) || 1)}
                min="1"
                max="50"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                disabled={loading}
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading || loadingProjects}
              className="btn-primary btn-full btn-sm"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" />
                  Generate Certificate Codes
                </>
              )}
            </button>
          </form>
          
          {success && certificates.length > 0 && (
            <div className="mt-6">
              <div className="p-3 bg-green-50 text-green-700 rounded-md flex items-center mb-4">
                <FiCheck className="mr-2" />
                <span>{certificates.length} certificate codes generated successfully!</span>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-3 max-h-60 overflow-y-auto mb-3">
                <ul className="space-y-1">
                  {certificates.map((cert) => (
                    <li key={cert._id} className="font-mono text-sm bg-gray-100 dark:bg-gray-700 p-1 rounded">
                      {cert.code}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={copyCertificatesToClipboard}
                  className="flex items-center px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <FiClipboard className="mr-1" />
                  Copy All
                </button>
                
                <button
                  onClick={exportCertificatesCSV}
                  className="flex items-center px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <FiDownload className="mr-1" />
                  Export CSV
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Project Certificates List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Project Certificates
          </h2>
          
          {!selectedProject ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              Select a project to view certificates
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <FiLoader className="animate-spin mx-auto h-8 w-8 text-primary-500" />
            </div>
          ) : projectCertificates.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No certificates found for this project
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Claimed By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {projectCertificates.map((cert) => (
                    <tr key={cert._id}>
                      <td className="px-6 py-4 whitespace-nowrap font-mono">
                        {cert.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          cert.used 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {cert.used ? 'Used' : 'Available'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cert.claimedBy || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(cert.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

export default CertificateManager; 