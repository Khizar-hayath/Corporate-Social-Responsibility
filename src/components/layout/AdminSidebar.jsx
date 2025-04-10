import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiUsers, FiFileText, FiFolder, FiMail, FiHeart, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

function AdminSidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  
  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/admin' },
    { icon: FiFolder, label: 'Projects', path: '/admin/projects' },
    { icon: FiFileText, label: 'News', path: '/admin/news' },
    { icon: FiUsers, label: 'Users', path: '/admin/users' },
    { icon: FiHeart, label: 'Volunteers', path: '/admin/volunteers' },
    { icon: FiMail, label: 'Messages', path: '/admin/contact' },
    { icon: FiSettings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700 px-4">
          <Link 
            to="/admin" 
            className="text-2xl font-bold text-primary-600 dark:text-primary-400"
          >
            Admin Panel
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    location.pathname === item.path ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-400' : ''
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                  {item.path === '/admin/contact' && (
                    <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      3
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center w-full px-4 py-2 mb-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? 
              <FiSun className="w-5 h-5 mr-3" /> : 
              <FiMoon className="w-5 h-5 mr-3" />
            }
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminSidebar; 