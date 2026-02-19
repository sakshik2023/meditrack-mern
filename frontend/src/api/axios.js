import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

// Attach JWT Bearer token to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('meditrack_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
