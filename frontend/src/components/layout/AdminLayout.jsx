import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiFileText, FiUsers, FiMessageSquare, FiSettings, FiLogOut, FiChevronLeft, FiUserPlus, FiAward, FiSun, FiMoon } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

function AdminLayout({ title, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const isAdmin = user?.userType === 'admin';
  const isNGO = user?.userType === 'ngo';

  // Determine if we're in the admin or NGO section
  const basePath = isAdmin ? '/admin' : '/ngo';

  // Close sidebar by default on mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once on mount
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Common menu items for both NGOs and admins
  const commonMenuItems = [
    { path: `${basePath}`, label: 'Dashboard', icon: FiHome },
    { path: `${basePath}/news`, label: 'News', icon: FiFileText },
    { path: `${basePath}/projects`, label: 'Projects', icon: FiFileText },
    { path: `${basePath}/volunteers`, label: 'Volunteers', icon: FiUsers },
    { path: `${basePath}/contact`, label: 'Messages', icon: FiMessageSquare },
    { path: `${basePath}/settings`, label: 'Settings', icon: FiSettings },
  ];

  // Admin-specific menu items
  const adminMenuItems = [
    { path: '/admin/users', label: 'Users', icon: FiUserPlus },
    { path: '/admin/certificates', label: 'Certificates', icon: FiAward },
  ];

  // Combine the menu items based on user type
  const menuItems = isAdmin ? [...commonMenuItems, ...adminMenuItems] : commonMenuItems;

  // Variants for the sidebar animation
  const sidebarVariants = {
    open: { 
      width: isMobile ? '100%' : 240,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    closed: { 
      width: isMobile ? 0 : 64,
      x: isMobile ? '-100%' : 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  // Variants for the backdrop
  const backdropVariants = {
    open: { opacity: 1, display: 'block' },
    closed: { opacity: 0, transitionEnd: { display: 'none' } }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            key="backdrop"
            initial="closed"
            animate="open"
            exit="closed"
            variants={backdropVariants}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-10"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={isSidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-20 overflow-hidden ${isMobile ? 'max-w-xs' : ''}`}
      >
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 border-b border-gray-200 dark:border-gray-700">
          {isSidebarOpen && (
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              {isAdmin ? 'Admin Panel' : 'NGO Dashboard'}
            </h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <FiX className="w-5 h-5" />
            ) : (
              <FiMenu className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="p-4 sm:p-6 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => isMobile && setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
          </div>

          {/* Logout button at the bottom */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <FiLogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </nav>

        {/* Collapsible sidebar button */}
        {!isMobile && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute bottom-4 right-4 p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <FiChevronLeft className={`w-5 h-5 text-gray-600 dark:text-gray-300 transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`} />
          </button>
        )}
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={false}
        animate={{ 
          marginLeft: isMobile ? 0 : (isSidebarOpen ? 240 : 64)
        }}
        className="min-h-screen transition-all duration-300"
      >
        {/* Top Bar */}
        <div className="fixed top-0 right-0 left-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40 flex items-center justify-between px-4 sm:px-6"
             style={{ left: isMobile ? 0 : (isSidebarOpen ? 240 : 64) }}
        >
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <FiMenu className="w-5 h-5" />
            </button>
            {title && (
              <h1 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">
                {title}
              </h1>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
              {isAdmin ? 'Administrator' : 'NGO Manager'}: <span className="font-medium">{user?.name}</span>
            </span>
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <FiSun className="w-5 h-5" />
              ) : (
                <FiMoon className="w-5 h-5" />
              )}
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              aria-label="Logout"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="pt-16 px-4 sm:px-6 lg:px-8 pb-6">
          {children || <Outlet />}
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLayout; 