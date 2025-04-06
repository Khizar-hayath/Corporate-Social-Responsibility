import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiSun, FiMoon, FiUser, FiLogOut } from 'react-icons/fi';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'News', path: '/news' },
    { name: 'Get Involved', path: '/get-involved' },
    { name: 'Contact', path: '/contact' },
  ];

  // Get dashboard link based on user type
  const getDashboardLink = () => {
    if (!user) return null;
    
    if (user.userType === 'admin') {
      return {
        path: '/admin',
        label: 'Admin Dashboard'
      };
    }
    
    if (user.userType === 'ngo') {
      return {
        path: '/account/projects',
        label: 'My Projects'
      };
    }
    
    return null;
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav
      className={`fixed w-full z-10 transition-all duration-300 ${
        isScrolled || isOpen
          ? 'bg-gradient-to-r from-primary-700 via-blue-700 to-indigo-700 shadow-lg'
          : 'bg-gradient-to-r from-primary-700/90 via-blue-700/90 to-indigo-700/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-white">NGO Portal</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-8">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3 py-2 text-sm font-medium group ${
                    location.pathname === link.path
                      ? 'text-white font-bold'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                    location.pathname === link.path ? 'scale-x-100' : ''
                  }`}></span>
                </Link>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none transition-colors duration-300"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-white">
                  Welcome, {user.name}
                </span>
                {dashboardLink && (
                  <Link
                    to={dashboardLink.path}
                    className="text-sm text-white/90 hover:text-white transition-colors duration-300"
                  >
                    {dashboardLink.label}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-gray-100 transition-colors duration-300"
                >
                  <FiLogOut className="mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm text-white/90 hover:text-white transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-white hover:bg-gray-100 transition-colors duration-300"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none transition-colors duration-300"
            >
              {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="ml-2 inline-flex items-center justify-center p-2 rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none transition-colors duration-300"
            >
              {isOpen ? (
                <FiX className="block h-5 w-5" />
              ) : (
                <FiMenu className="block h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="sm:hidden overflow-hidden bg-gradient-to-b from-blue-800 to-primary-800"
      >
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 text-base font-medium ${
                location.pathname === link.path
                  ? 'text-white bg-white/10'
                  : 'text-white/90 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user ? (
            <>
              <div className="border-t border-white/10 pt-4 pb-3">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <FiUser className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-white/70">
                      {user.organization}
                    </div>
                  </div>
                </div>
                {dashboardLink && (
                  <Link
                    to={dashboardLink.path}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-white/5"
                  >
                    {dashboardLink.label}
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-white/5"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="border-t border-white/10 pt-4 pb-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-base font-medium text-white/90 hover:text-white hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-base font-medium text-white bg-white/10 hover:bg-white/15"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </nav>
  );
}

export default Navbar; 