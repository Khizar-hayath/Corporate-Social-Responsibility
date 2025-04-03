import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiHome, FiFileText, FiUsers, FiMessageSquare, FiSettings, FiLogOut, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: FiHome },
    { path: '/admin/news', label: 'News', icon: FiFileText },
    { path: '/admin/projects', label: 'Projects', icon: FiFileText },
    { path: '/admin/volunteers', label: 'Volunteers', icon: FiUsers },
    { path: '/admin/contact', label: 'Messages', icon: FiMessageSquare },
    { path: '/admin/settings', label: 'Settings', icon: FiSettings },
  ];

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
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 shadow-lg z-20 overflow-hidden ${isMobile ? 'max-w-xs' : ''}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
          {isSidebarOpen && <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <FiX className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        <nav className="p-4 overflow-y-auto h-[calc(100vh-64px)]">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setIsSidebarOpen(false)}
              className={`flex items-center px-4 py-2 mb-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                location.pathname === item.path ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : ''
              }`}
            >
              <item.icon className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          ))}

          {/* Logout button at the bottom */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 mt-6 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </nav>

        {/* Collapsible sidebar button */}
        {!isMobile && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute bottom-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
        <div className="fixed top-0 right-0 left-0 h-16 bg-white dark:bg-gray-800 shadow-sm z-10 flex items-center justify-between px-6"
             style={{ left: isMobile ? 0 : (isSidebarOpen ? 240 : 64) }}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">Admin</span>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Logout"
            >
              <FiLogOut className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="pt-20 px-6 pb-6">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLayout; 