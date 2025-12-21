import axios from 'axios';

const api = axios.create({
    baseURL: 'https://unimart-backend-1fo0.onrender.com/api/v1',
    withCredentials: true,
});

// Add Interceptor to attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;