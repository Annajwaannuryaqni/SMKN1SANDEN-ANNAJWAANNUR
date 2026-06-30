import axios from 'axios';

// Base URL sesuai dengan ketentuan dokumen Farmagitechs
const API_BASE_URL = 'http://192.168.0.199:9006'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Otomatis menyisipkan token Keycloak tanpa double quote
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      const cleanToken = token.replace(/^"(.*)"$/, '$1');
      config.headers.Authorization = `Bearer ${cleanToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;