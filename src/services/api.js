import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Send token in both formats for compatibility
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Gemini API configuration
export const geminiAPI = {
  // Replace with your actual Gemini API key when deploying
  apiKey: 'YOUR_GEMINI_API_KEY',
  
  // Different model versions to try
  models: {
    gemini10Pro: 'gemini-1.0-pro',
    gemini10ProVision: 'gemini-1.0-pro-vision',
    gemini15Pro: 'gemini-1.5-pro',
    gemini15Flash: 'gemini-1.5-flash'
  },
  
  // Summarize comments
  summarizeComments: async (comments, modelName = 'gemini-1.5-pro') => {
    try {
      // For demo purposes, we'll use a mock response
      // In production, replace with an actual API call:
      /*
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
        {
          contents: [{
            parts: [{
              text: `Please summarize these comments in 2-3 key points: ${comments.map(c => c.content).join(' | ')}`
            }]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 300,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiAPI.apiKey
          }
        }
      );
      return response.data.candidates[0].content.parts[0].text;
      */
      
      // Mock response for testing
      console.log(`Generating summary with model: ${modelName}`);
      console.log(`Summarizing ${comments.length} comments`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock summary
      return `Summary (using ${modelName}): ${comments.length} comments analyzed. The main topics discussed include ${getRandomTopics(comments)}. Most users seem to ${getRandomSentiment()}.`;
    } catch (error) {
      console.error('Error using Gemini API:', error);
      throw error;
    }
  }
};

// Helper functions for mock summary generation
function getRandomTopics(comments) {
  const topics = [
    'project goals and milestones', 
    'design suggestions and feedback', 
    'implementation challenges',
    'timeline and scheduling concerns',
    'positive feedback about the progress',
    'questions about specific features'
  ];
  
  // Get a random subset of topics
  const topicCount = Math.min(1 + Math.floor(Math.random() * 3), topics.length);
  const selectedTopics = [];
  
  while (selectedTopics.length < topicCount) {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    if (!selectedTopics.includes(randomTopic)) {
      selectedTopics.push(randomTopic);
    }
  }
  
  return selectedTopics.join(', ');
}

function getRandomSentiment() {
  const sentiments = [
    'be enthusiastic about the project',
    'have constructive feedback to share',
    'express interest in contributing to future efforts',
    'appreciate the current progress',
    'have questions about implementation details',
    'suggest improvements to the current approach'
  ];
  
  return sentiments[Math.floor(Math.random() * sentiments.length)];
}

// Auth API calls
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: (userData) => api.post('/api/auth/register', userData),
};

// Projects API calls
export const projectsAPI = {
  getAll: () => api.get('/api/projects'),
  create: (projectData) => api.post('/admin/projects', projectData),
  update: (id, projectData) => api.put(`/admin/projects/${id}`, projectData),
  delete: (id) => {
    // Get the token for authentication
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // Get the user to determine the correct endpoint
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      throw new Error('User information not found');
    }
    
    try {
      const user = JSON.parse(userJson);
      const baseUrl = user.userType === 'admin' ? '/admin/projects' : '/admin/projects';
      
      // Configure request with authentication headers
      return api.delete(`${baseUrl}/${id}`);
      // No need to add headers manually, the interceptor will handle it
    } catch (error) {
      console.error('Error parsing user data:', error);
      throw new Error('Failed to determine user role');
    }
  },
};

export default api; 