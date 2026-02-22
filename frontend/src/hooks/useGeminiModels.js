import { useState } from 'react';
import { geminiAPI } from '../services/api';

// Custom hook to manage different Gemini model selections and capabilities
export function useGeminiModels() {
  const [currentModel, setCurrentModel] = useState(geminiAPI.models.gemini20FlashExp);
  const [modelResults, setModelResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modelConfig, setModelConfig] = useState({
    temperature: 0.4,
    maxOutputTokens: 300,
    preInstructions: ''
  });

  // Function to update model configuration
  const updateModelConfig = (config) => {
    setModelConfig(prevConfig => ({
      ...prevConfig,
      ...config
    }));
  };

  // Function to try multiple models in sequence
  const tryMultipleModels = async (inputData, callback, config = modelConfig) => {
    setLoading(true);
    setError(null);
    const results = {};
    
    try {
      // Try each model in sequence
      for (const [key, modelName] of Object.entries(geminiAPI.models)) {
        try {
          console.log(`Trying model: ${modelName}`);
          const result = await geminiAPI.summarizeComments(inputData, modelName, config);
          results[modelName] = result;
          
          // Call the callback if provided after each model completes
          if (callback) {
            callback(modelName, result);
          }
        } catch (err) {
          console.error(`Error with model ${modelName}:`, err);
          results[modelName] = `Error: ${err.message || 'Failed to generate content'}`;
        }
      }
      
      setModelResults(results);
    } catch (err) {
      setError(`Failed to test models: ${err.message}`);
    } finally {
      setLoading(false);
    }
    
    return results;
  };

  // Function to use a specific model
  const useModel = async (modelName, inputData, config = modelConfig) => {
    setLoading(true);
    setError(null);
    
    try {
      setCurrentModel(modelName);
      const result = await geminiAPI.summarizeComments(inputData, modelName, config);
      
      // Store the result
      setModelResults(prev => ({
        ...prev,
        [modelName]: result
      }));
      
      return result;
    } catch (err) {
      setError(`Error with model ${modelName}: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    models: geminiAPI.models,
    currentModel,
    setCurrentModel,
    modelResults,
    loading,
    error,
    modelConfig,
    updateModelConfig,
    tryMultipleModels,
    useModel
  };
}

export default useGeminiModels; 