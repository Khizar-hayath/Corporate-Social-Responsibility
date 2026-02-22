import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

function AdminHeader({ title, subtitle }) {
  const { darkMode } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {/* Dark mode toggle removed */}
      </div>
    </motion.div>
  );
}

export default AdminHeader; 