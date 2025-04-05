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