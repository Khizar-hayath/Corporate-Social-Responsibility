import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/layout/AdminSidebar';
import VolunteersTable from './components/volunteers/VolunteersTable';

function Volunteers() {
  useEffect(() => {
    document.title = 'Admin - Volunteers | CSR Website';
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Volunteer Applications
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage volunteer applications submitted through the website
            </p>
          </div>
          
          <VolunteersTable />
        </motion.div>
      </div>
    </div>
  );
}

export default Volunteers; 