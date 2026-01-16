import axios from 'axios';
import msalInstance from '../msalInstance';
import { loginRequest } from '../authConfig';

const APIHOST = import.meta.env.VITE_API_URL;
const IMAGEHOST = import.meta.env.VITE_FUNCTION_URL;

const api = axios.create({
  baseURL: APIHOST
});

// Add request interceptor to include MSAL token
api.interceptors.request.use(
  async (config) => {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      try {
        const response = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account: accounts[0]
        });
        config.headers.Authorization = `Bearer ${response.accessToken}`;
      } catch (error) {
        console.error('Error acquiring token silently:', error);
        // If silent token acquisition fails, redirect to login
        if (error.name === 'InteractionRequiredAuthError') {
          await msalInstance.acquireTokenRedirect(loginRequest);
        }
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
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Try to acquire a new token
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        try {
          const response = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
          });
          originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
          return api(originalRequest);
        } catch (tokenError) {
          console.error('Token refresh failed:', tokenError);
          // Only logout if token refresh fails with interaction required
          if (tokenError.name === 'InteractionRequiredAuthError') {
            window.location.href = '/login';
          }
        }
      } else {
        // No accounts, redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Image upload function
export const uploadPatientImage = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await axios.post(`${IMAGEHOST}/api/ImageUpload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Get image URL function
export const getPatientImageUrl = async (imageFilename) => {
  const response = await axios.get(`${IMAGEHOST}/api/GetImageUrl/${imageFilename}`);
  return response.data;
};

export default api; 