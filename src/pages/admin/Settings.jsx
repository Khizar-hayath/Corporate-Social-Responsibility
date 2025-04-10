import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/layout/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import SettingsForm from './components/settings/SettingsForm';

function Settings() {
  useEffect(() => {
    document.title = 'Admin - Settings | CSR Website';
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 p-8 ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <AdminHeader 
            title="Settings" 
            subtitle="Configure your site preferences" 
          />
          
          <SettingsForm />
        </motion.div>
      </div>
    </div>
  );
}

export default Settings; 