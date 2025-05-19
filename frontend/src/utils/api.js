import axios from 'axios';

const APIHOST = import.meta.env.VITE_API_URL;
const IMAGEHOST = import.meta.env.VITE_FUNCTION_URL;

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