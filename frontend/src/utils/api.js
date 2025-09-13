import axios from 'axios';

// Create a reusable API instance with the base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://created-by-dobas.onrender.com',
});

export default api;