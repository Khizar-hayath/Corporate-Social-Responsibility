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
  apiKey: 'YAIzaSyDj7b9RDKSWmzH-vbRlXug-Lfyli1aLC78',
  
  // Different model versions to try
  models: {
    gemini10Pro: 'gemini-1.0-pro',
    gemini10ProVision: 'gemini-1.0-pro-vision',
    gemini15Pro: 'gemini-1.5-pro',
    gemini15Flash: 'gemini-1.5-flash',
    gemini20FlashExp: 'Gemini 2.0 Flash Thinking Experimental 01-21'
  },
  
  // Summarize comments
  summarizeComments: async (
    comments, 
    modelName = 'gemini-1.5-pro', 
    options = {
      temperature: 0.4,
      maxOutputTokens: 350,
      preInstructions: 'You are an AI assistant integrated into a CSR platform. Your task is to analyze user reviews and feedback submitted by NGOs, Corporates, and Community Members. Your goal is to perform sentiment analysis and classify each feedback as Positive, Neutral, or Negative. Also, extract the key themes, suggestions, or complaints if available. Keep the tone professional, the response concise, and focus on insights that can help improve platform experience, trust, and engagement.'
    }
  ) => {
    try {
      // For demo purposes, we'll use a mock response
      // In production, replace with an actual API call:
      /*
      const { temperature, maxOutputTokens, preInstructions } = options;
      const promptText = preInstructions 
        ? `${preInstructions} ${comments.map(c => c.content).join(' | ')}`
        : `Please summarize these comments in 2-3 key points. Do not include the name of the model in your response: ${comments.map(c => c.content).join(' | ')}`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent`,
        {
          contents: [{
            parts: [{
              text: promptText
            }]
          }],
          generationConfig: {
            temperature,
            maxOutputTokens,
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
      console.log(`Model settings: temperature=${options.temperature}, maxTokens=${options.maxOutputTokens}`);
      if (options.preInstructions) {
        console.log(`Using custom instructions: ${options.preInstructions}`);
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock summary without model name
      return `${comments.length} comments analyzed. The main topics discussed include ${getRandomTopics(comments)}. Most users seem to ${getRandomSentiment()}.`;
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

// Certificate API calls
export const certificateAPI = {
  validate: (code, projectId, name) => 
    api.post('/api/certificates/validate', { code, projectId, name }),
  claim: (code, projectId, name) => 
    api.post('/api/certificates/claim', { code, projectId, name }),
  generatePDF: (certificateData) => {
    // This is a client-side function to generate a PDF
    // It doesn't make an API call but is included here for organization
    return new Promise((resolve) => {
      // We'll implement the actual PDF generation in the component
      resolve({ success: true, certificateData });
    });
  }
};

// Payment API calls
export const paymentsAPI = {
  createOrder: (donationData) => 
    api.post('/api/payments/create-order', donationData),
  verifyPayment: (paymentData) => 
    api.post('/api/payments/verify', paymentData),
  getHistory: (page = 1, limit = 10) => 
    api.get(`/api/payments/history?page=${page}&limit=${limit}`)
};

export default api; 