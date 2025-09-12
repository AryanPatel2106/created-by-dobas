import axios from 'axios';

// Create a reusable API instance with the base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : ''),
});

export default api;