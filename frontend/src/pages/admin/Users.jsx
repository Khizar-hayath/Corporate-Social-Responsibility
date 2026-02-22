import { useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../../components/layout/AdminSidebar';
import UsersTable from './components/users/UsersTable';
import AdminHeader from '../../components/admin/AdminHeader';

/**
 * Admin User Management Page
 * 
 * Features:
 * - View all users in a table
 * - Search and filter users
 * - Create, edit, and delete users
 * - Change user types
 */
function Users() {
  useEffect(() => {
    document.title = 'Admin - Users | CSR Website';
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
            title="User Management" 
            subtitle="Manage users, assign roles, and control access to the system" 
          />
          
          <UsersTable />
        </motion.div>
      </div>
    </div>
  );
}

export default Users; 