import axios from 'axios';

const APIHOST = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: APIHOST
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const storedUser = sessionStorage.getItem('nurse');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (error) {
        console.error('Error parsing stored user data:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      sessionStorage.removeItem('nurse');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 