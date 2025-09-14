import axios from 'axios';

// Create a reusable API instance with the base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://created-by-dobas.onrender.com',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.message);
    
    // Handle network errors gracefully
    if (error.code === 'ERR_NETWORK') {
      console.warn('Network error - API server may be down');
    }
    
    return Promise.reject(error);
  }
);

export default api;
