import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMessageSquare, FiLoader, FiX } from 'react-icons/fi';
import { geminiAPI } from '../../services/api';

function CommentSummary({ comments }) {
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [showModelOptions, setShowModelOptions] = useState(false);
  const [selectedModel, setSelectedModel] = useState(geminiAPI.models.gemini15Pro);
  const [error, setError] = useState('');

  const generateSummary = async (modelName) => {
    if (comments.length === 0) {
      setError('No comments to summarize');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Call the Gemini API to summarize comments
      const result = await geminiAPI.summarizeComments(comments, modelName);
      setSummary(result);
      setShowSummary(true);
    } catch (err) {
      console.error('Error summarizing comments:', err);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (modelName) => {
    setSelectedModel(modelName);
    setShowModelOptions(false);
    generateSummary(modelName);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button
            onClick={() => {
              if (!showSummary) {
                generateSummary(selectedModel);
              } else {
                setShowSummary(false);
              }
            }}
            disabled={loading}
            className="flex items-center px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Generating summary...
              </>
            ) : (
              <>
                <FiMessageSquare className="mr-2" />
                {showSummary ? 'Hide Summary' : 'Summarize Comments'}
              </>
            )}
          </button>
          
          <div className="relative ml-2">
            <button
              onClick={() => setShowModelOptions(!showModelOptions)}
              className="flex items-center px-3 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              disabled={loading}
            >
              Model
              <FiChevronDown className="ml-1" />
            </button>
            
            <AnimatePresence>
              {showModelOptions && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  {Object.entries(geminiAPI.models).map(([key, modelName]) => (
                    <button
                      key={key}
                      onClick={() => handleModelSelect(modelName)}
                      className={`block w-full px-4 py-2 text-left text-sm ${
                        selectedModel === modelName
                          ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-medium'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {modelName}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {showSummary && (
          <button
            onClick={() => setShowSummary(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 mb-4 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-md"
          >
            {error}
          </motion.div>
        )}
        
        {showSummary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg mb-4 text-gray-800 dark:text-gray-200"
          >
            <h3 className="text-lg font-semibold mb-2">Comment Summary</h3>
            <p>{summary}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CommentSummary; 