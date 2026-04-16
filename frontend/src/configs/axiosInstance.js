import axios from 'axios';

// Base instance configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify this based on where you store the token (localStorage, cookies, state)
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // You can handle global auth errors (e.g. 401 Unauthorized) here
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized access - maybe token is expired?");
      // e.g., clear localStorage and throw to login screen
      // localStorage.removeItem('token');
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
