import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiFileText, FiUsers, FiMessageSquare, FiSettings } from 'react-icons/fi';

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FiHome },
    { path: '/admin/news', label: 'News', icon: FiFileText },
    { path: '/admin/projects', label: 'Projects', icon: FiFileText },
    { path: '/admin/volunteers', label: 'Volunteers', icon: FiUsers },
    { path: '/admin/contact', label: 'Messages', icon: FiMessageSquare },
    { path: '/admin/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2 mb-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                location.pathname === item.path ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : ''
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="h-16 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between px-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">Admin</span>
            <button className="px-4 py-2 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700">
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout; 