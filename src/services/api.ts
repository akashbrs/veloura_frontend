import axios from 'axios';
import { toastService } from '@/services/toastService';

// Base API configuration
const api = axios.create({
    baseURL: (import.meta.env.VITE_API_URL || 'https://api.veloura.prime-wave.tech/api/').replace(/\/$/, '') + '/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors systematically
api.interceptors.response.use(
    (response) => {
        // Unwrap ApiResponseHandler's { success, data, message } envelope if present
        if (response.data && response.data.success === true && response.data.data !== undefined) {
            response.data = response.data.data;
        }
        return response;
    },
    (error) => {
        console.log('API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            message: error.message
        });

        // Handle network errors
        if (!error.response) {
            console.error('Network error - Response missing:', error.message);
            toastService.error('Network error - please check your connection');
            return Promise.reject({
                message: 'Network Error',
                status: 0,
                isNetworkError: true,
            });
        }

        // If error is 401 (Unauthorized), user needs to login again
        if (error.response?.status === 401 && error.config.url !== '/login/') {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            // ONLY redirect if we aren't already on the login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        // Handle other error responses
        let errorMessage = 'Something went wrong';
        if (error.response?.data) {
            const d = error.response.data;
            if (d.message) errorMessage = d.message;
            else if (d.error) errorMessage = d.error;
            else if (d.detail) errorMessage = d.detail;
            else if (typeof d === 'object') {
                const firstKey = Object.keys(d)[0];
                if (firstKey && Array.isArray(d[firstKey])) {
                    errorMessage = `${firstKey}: ${d[firstKey][0]}`;
                }
            }
        }
        if (errorMessage === 'Something went wrong' && error.message) {
            errorMessage = error.message;
        }

        return Promise.reject({
            response: error.response,
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data,
        });
    }
);

export default api;
