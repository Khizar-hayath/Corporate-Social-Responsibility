import { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../../../../config';

function SettingsForm() {
  const [formData, setFormData] = useState({
    siteName: 'CSR Website',
    siteEmail: 'contact@csrwebsite.com',
    sitePhone: '+1 (555) 123-4567',
    siteAddress: '123 Main St, New York, NY 10001',
    allowRegistration: true,
    emailNotifications: true,
    darkModeDefault: false,
    maxUploadSize: 5,
    maintenanceMode: false
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  // Fetch settings data
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setStatus({ loading: true, success: false, error: null });
        const token = localStorage.getItem('token');
        
        // Simulate API call to fetch settings
        // In a real application, you would call an actual API
        setTimeout(() => {
          setStatus({ loading: false, success: false, error: null });
        }, 1000);
        
        // If you have a real API endpoint, use this:
        /*
        const response = await fetch(`${API_BASE_URL}/api/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }

        const data = await response.json();
        setFormData(data);
        setStatus({ loading: false, success: false, error: null });
        */
      } catch (error) {
        console.error('Error fetching settings:', error);
        setStatus({ loading: false, success: false, error: error.message });
      }
    };

    fetchSettings();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus({ loading: true, success: false, error: null });
      const token = localStorage.getItem('token');
      
      // Simulate API call to save settings
      // In a real application, you would call an actual API
      setTimeout(() => {
        setStatus({ loading: false, success: true, error: null });
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setStatus({ loading: false, success: false, error: null });
        }, 3000);
      }, 1000);
      
      // If you have a real API endpoint, use this:
      /*
      const response = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      setStatus({ loading: false, success: true, error: null });
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setStatus({ loading: false, success: false, error: null });
      }, 3000);
      */
    } catch (error) {
      console.error('Error saving settings:', error);
      setStatus({ loading: false, success: false, error: error.message });
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (status.loading && !formData) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Site Settings</h2>
      
      {status.error && (
        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900 dark:text-red-200">
          <p>Error: {status.error}</p>
        </div>
      )}
      
      {status.success && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900 dark:text-green-200"
        >
          <p>Settings saved successfully!</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">General Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Email
              </label>
              <input
                type="email"
                name="siteEmail"
                value={formData.siteEmail}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Phone
              </label>
              <input
                type="text"
                name="sitePhone"
                value={formData.sitePhone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Site Address
              </label>
              <input
                type="text"
                name="siteAddress"
                value={formData.siteAddress}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowRegistration"
                name="allowRegistration"
                checked={formData.allowRegistration}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="allowRegistration" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Allow User Registration
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="darkModeDefault"
                name="darkModeDefault"
                checked={formData.darkModeDefault}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="darkModeDefault" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Dark Mode Default
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Upload Size (MB)
              </label>
              <input
                type="number"
                name="maxUploadSize"
                value={formData.maxUploadSize}
                onChange={handleChange}
                min="1"
                max="50"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Maintenance</h3>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceMode"
              name="maintenanceMode"
              checked={formData.maintenanceMode}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Enable Maintenance Mode
            </label>
          </div>
          {formData.maintenanceMode && (
            <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200">
              <p className="text-sm">
                Warning: Enabling maintenance mode will make the site inaccessible to regular users. 
                Only administrators will be able to access the site.
              </p>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status.loading}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              status.loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <FiSave className="mr-2" />
            {status.loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SettingsForm; 