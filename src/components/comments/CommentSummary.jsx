import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiMessageSquare, FiLoader, FiX, FiSettings } from 'react-icons/fi';
import useGeminiModels from '../../hooks/useGeminiModels';

function CommentSummary({ comments }) {
  const [showSummary, setShowSummary] = useState(false);
  const [showModelOptions, setShowModelOptions] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [selectedModelSummary, setSelectedModelSummary] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const {
    models,
    currentModel,
    setCurrentModel,
    modelResults,
    loading,
    error,
    useModel,
    modelConfig,
    updateModelConfig
  } = useGeminiModels();

  // Generate a summary with the selected model
  const generateSummary = async () => {
    if (comments.length === 0) {
      return;
    }

    try {
      const config = {
        ...modelConfig,
        preInstructions: customInstructions || modelConfig.preInstructions
      };
      
      const result = await useModel(currentModel, comments, config);
      setSelectedModelSummary(result);
      setShowSummary(true);
    } catch (err) {
      console.error('Error generating summary:', err);
    }
  };

  // Handle model selection
  const handleModelSelect = (modelName) => {
    setCurrentModel(modelName);
    setShowModelOptions(false);
    // Set the summary text if we already have results for this model
    if (modelResults) {
      setSelectedModelSummary();
    } else {
      // Otherwise, generate a new summary with this model
      const config = {
        ...modelConfig,
        preInstructions: customInstructions || modelConfig.preInstructions
      };
      
      useModel(modelName, comments, config).then(result => {
        setSelectedModelSummary(result);
      });
    }
  };

  // Handle temperature change
  const handleTemperatureChange = (e) => {
    const value = parseFloat(e.target.value);
    updateModelConfig({ temperature: value });
  };

  // Handle max tokens change
  const handleMaxTokensChange = (e) => {
    const value = parseInt(e.target.value);
    updateModelConfig({ maxOutputTokens: value });
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <button
            onClick={() => {
              if (!showSummary) {
                generateSummary();
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
          
          <button
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
            className="ml-2 flex items-center px-3 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <FiSettings className="mr-2" />
            {showAdvancedOptions ? 'Hide Options' : 'Options'}
          </button>
        </div>
        
        {showSummary && (
          <button
            onClick={() => {
              setShowSummary(false);
            }}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
      
      <AnimatePresence>
        {showAdvancedOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Temperature: {modelConfig.temperature.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={modelConfig.temperature}
                  onChange={handleTemperatureChange}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>More focused</span>
                  <span>More creative</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Output Tokens: {modelConfig.maxOutputTokens}
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={modelConfig.maxOutputTokens}
                  onChange={handleMaxTokensChange}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Shorter</span>
                  <span>Longer</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Custom Instructions
                </label>
                <textarea
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  placeholder="Enter custom instructions for the model (e.g., 'Summarize these comments focusing on technical feedback')"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows="3"
                />
              </div>
            </div>
          </motion.div>
        )}
        
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
            <p>{selectedModelSummary || "No summary available yet"}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CommentSummary; 